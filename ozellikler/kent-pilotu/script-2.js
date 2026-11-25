
'use strict';
const places = [
  {id:'blok-a',kind:'Konut bloğu',title:'A Blok',short:'A',description:'Üç bloklu pilotun giriş ve yönlendirme senaryosu.',status:'Örnek açık',use:'Karşılama',x:-136,y:-81,w:72,d:64,h:115},
  {id:'blok-b',kind:'Konut bloğu',title:'B Blok',short:'B',description:'Bloklar arası yaya yönlendirmesi için örnek durak.',status:'Örnek açık',use:'Yaya bağlantısı',x:-26,y:-135,w:76,d:77,h:160},
  {id:'blok-c',kind:'Konut bloğu',title:'C Blok',short:'C',description:'Ortak alan ve servis rotasının kesiştiği örnek blok.',status:'Prova',use:'Ortak alan',x:40,y:7,w:73,d:68,h:99},
  {id:'yesil-aks',kind:'Sokak örneği',title:'Yeşil Aks',short:'Y',description:'Park, yaya geçişi ve blok bağlantılarını birleştiren örnek yürüyüş aksı.',status:'Örnek açık',use:'Yaya ve park',x:-145,y:23,w:135,d:31,h:1},
  {id:'servis-sokagi',kind:'Sokak örneği',title:'Servis Sokağı',short:'S',description:'Pilot yerleşimin doğu tarafındaki servis erişimi örneği.',status:'Planlama',use:'Servis rotası',x:105,y:-126,w:33,d:126,h:1}
];
const byId = new Map(places.map(place => [place.id, place]));
const $ = id => document.getElementById(id);
const canvas = $('canvas');
const ctx = canvas.getContext('2d');
const controls = [$('left'),$('right'),$('minus'),$('plus')];
const state = {place:places[0], angle:-Math.PI/4, zoom:1, width:0, height:0, polygons:[], frame:0};
const trees = [[-147,-142],[-87,-141],[-68,-141],[72,-120],[86,-112],[98,-87],[-126,80],[-106,89],[-79,91],[-23,83],[-9,101],[17,95],[128,94],[141,74],[-130,-2],[-93,3]];
const palette = {roof:'#c4d0af',front:'#809083',side:'#647f72'};
const highlight = {roof:'#e1f4b9',front:'#b0c58c',side:'#85a574'};
let transform;

function setTransform() {
  const angle = state.angle;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const fit = Math.min(state.width / 480, state.height / 420) * state.zoom;
  transform = (x,y,z=0) => [
    state.width / 2 + (x*cos - y*sin)*fit,
    state.height * .61 + ((x*sin + y*cos)*.52 - z)*fit
  ];
  return {sin,cos,fit};
}
function polygon(points, fill, line) {
  ctx.beginPath();
  points.forEach(([x,y],index) => index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.closePath();
  ctx.fillStyle=fill;ctx.fill();
  if(line){ctx.strokeStyle=line;ctx.lineWidth=1;ctx.stroke();}
}
function plane(x1,y1,x2,y2,z=0) {
  return [transform(x1,y1,z),transform(x2,y1,z),transform(x2,y2,z),transform(x1,y2,z)];
}
function line(points,color,width=1) {
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}
function paintTerrain() {
  polygon(plane(-172,-160,163,126,-5),'#10241f','#284738');
  polygon(plane(-169,-160,161,123),'#354e3f','#7e9773');
  for(let x=-160;x<=160;x+=16)line([transform(x,-159),transform(x,122)],'#536b55');
  for(let y=-156;y<=121;y+=16)line([transform(-168,y),transform(160,y)],'#536b55');
  polygon(plane(-157,-16,150,10,1),'#738576','#9eb295');
  polygon(plane(-151,72,150,119),'#44624a');
  polygon(plane(65,-148,98,-29),'#4e694d');
  for(const place of places.filter(p=>p.h===1)) {
    const selected=state.place.id===place.id;
    const footprint=plane(place.x, place.y, place.x+place.w, place.y+place.d,2);
    polygon(footprint,selected?'#d2eb9d':place.id==='yesil-aks'?'#7ea263':'#88a697',selected?'#edffbd':'#afc6a5');
    if(place.id==='servis-sokagi')for(let y=place.y+8;y<place.y+place.d-6;y+=13) {
      line([transform(place.x+place.w/2,y,3),transform(place.x+place.w/2,y+6,3)],'#dae8cf');
    }
    state.polygons.push({id:place.id,points:footprint});
  }
}
function lerp(p,q,t){return [p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t];}
function wall(bottomA,bottomB,topA,topB,color,selected) {
  const points=[bottomA,bottomB,topB,topA];
  polygon(points,color,'#405e4c');
  for(let row=1;row<=6;row++) for(let col=0;col<5;col++){
    const a = lerp(bottomA,topA,row/7), b=lerp(bottomB,topB,row/7);
    const c = lerp(bottomA,topA,(row+.26)/7), d=lerp(bottomB,topB,(row+.26)/7);
    polygon([lerp(a,b,(col+.21)/5),lerp(a,b,(col+.76)/5),lerp(c,d,(col+.76)/5),lerp(c,d,(col+.21)/5)], selected?'#435e4a':'#384f48');
  }
  return points;
}
function paintBlock(block,orientation) {
  const {x,y,w,d,h}=block;
  const bottom=plane(x,y,x+w,y+d,3), top=plane(x,y,x+w,y+d,h);
  const colors=state.place.id===block.id?highlight:palette;
  const selected=state.place.id===block.id;
  const faces=[orientation.sin<0?[0,3]:[1,2],orientation.cos<0?[0,1]:[3,2]];
  faces.forEach(([a,b],i)=>{
    const points=wall(bottom[a],bottom[b],top[a],top[b],i?colors.front:colors.side,selected);
    state.polygons.push({id:block.id,points});
  });
  polygon(top,colors.roof,selected?'#f2ffe1':'#c0d3ac');
  polygon(plane(x+11,y+10,x+w-12,y+d-10,h+1),selected?'#bfd49f':'#a7b899');
  polygon(plane(x+w*.43,y+d*.41,x+w*.67,y+d*.62,h+3),selected?'#7c9878':'#728a7a');
  state.polygons.push({id:block.id,points:top});
}
function paintTree([x,y],fit) {
  const [px,py]=transform(x,y,4);
  line([[px,py+4*fit],[px,py-7*fit]],'#526549',1.5*fit);
  ctx.fillStyle='#72966a';ctx.strokeStyle='#3b664e';ctx.lineWidth=Math.max(1,fit);
  ctx.beginPath();ctx.ellipse(px,py-5*fit,5*fit,7*fit,0,0,Math.PI*2);ctx.fill();ctx.stroke();
}
function labelFor(place,fit) {
  const coord=transform(place.x+place.w*.5,place.y+place.d*.5,place.h>1?place.h+13:14);
  const x=coord[0],y=coord[1];
  const size=Math.max(12,Math.min(23,Math.round(fit*13)));
  const active=state.place.id===place.id;
  ctx.font='700 '+size+'px system-ui';
  const text=place.h>1?place.title:place.short;
  const width=ctx.measureText(text).width+14;
  const points=[[x-width/2,y-size],[x+width/2,y-size],[x+width/2,y+7],[x-width/2,y+7]];
  polygon(points,active?'#e4ffbe':'#1f3c32',active?'#eaffd4':'#809e7b');
  ctx.textAlign='center';ctx.fillStyle=active?'#23362a':'#edf6de';
  ctx.fillText(text,x,y+1);
  state.polygons.push({id:place.id,points});
}
function draw() {
  state.frame=0;
  if(!ctx||!state.width||!state.height)return;
  const dpr=canvas.width/state.width;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,state.width,state.height);
  const grad=ctx.createRadialGradient(state.width*.54,state.height*.49,0,state.width*.48,state.height*.54,state.width*.64);
  grad.addColorStop(0,'#2b4939');grad.addColorStop(1,'#112823');
  ctx.fillStyle=grad;ctx.fillRect(0,0,state.width,state.height);
  state.polygons.length=0;
  const orientation=setTransform();
  paintTerrain();
  const items=[...places.filter(place=>place.h>1).map(place=>({depth:transform(place.x+place.w/2,place.y+place.d/2)[1],place})),
               ...trees.map(tree=>({depth:transform(...tree)[1],tree}))];
  items.sort((a,b)=>a.depth-b.depth);
  for(const item of items)item.place?paintBlock(item.place,orientation):paintTree(item.tree,orientation.fit);
  for(const place of places)labelFor(place,orientation.fit);
}
function queueDraw(){if(!state.frame)state.frame=requestAnimationFrame(draw);}
function resize(){
  const {width,height}=canvas.getBoundingClientRect();
  if(!width||!height)return;
  state.width=width;state.height=height;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  queueDraw();
}
function contains(x,y,points){
  let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [xi,yi]=points[i],[xj,yj]=points[j];
    if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
  }
  return inside;
}
function selectionFromHash() {
  const id=location.hash.slice(1);
  return byId.get(id)??places[0];
}
function applySelection(place,route){
  state.place=place;
  $('place-kind').textContent=place.kind;
  $('place-title').textContent=place.title;
  $('place-detail').textContent=place.description;
  $('place-state').textContent=place.status;
  $('place-function').textContent=place.use;
  $('route').href='#'+place.id;
  $('route').textContent='#'+place.id;
  $('copy-state').textContent='';
  for(const button of $('choices').children)button.setAttribute('aria-pressed',String(button.dataset.place===place.id));
  if(route&&location.hash!=='#'+place.id)history.pushState(null,'','#'+place.id);
  queueDraw();
}
for(const place of places){
  const button=document.createElement('button');
  const name=document.createElement('strong'),kind=document.createElement('span');
  button.type='button';button.dataset.place=place.id;button.setAttribute('aria-pressed','false');
  name.textContent=place.title;kind.textContent=place.kind;button.append(name,kind);
  button.addEventListener('click',()=>applySelection(place,true));
  $('choices').append(button);
}
function rotation(amount){state.angle+=amount;queueDraw();}
function zoom(amount){
  state.zoom=Math.round(Math.min(1.6,Math.max(.75,state.zoom+amount))*100)/100;
  $('minus').disabled=state.zoom<=.75;$('plus').disabled=state.zoom>=1.6;
  queueDraw();
}
$('left').addEventListener('click',()=>rotation(-Math.PI/8));$('right').addEventListener('click',()=>rotation(Math.PI/8));
$('minus').addEventListener('click',()=>zoom(-.15));$('plus').addEventListener('click',()=>zoom(.15));
$('reset').addEventListener('click',()=>{state.angle=-Math.PI/4;state.zoom=1;zoom(0);});
for(const control of [...controls,$('reset')])control.disabled=!ctx;
canvas.addEventListener('click',event=>{
  const box=canvas.getBoundingClientRect();
  for(const shape of state.polygons.slice().reverse()){
    if(contains(event.clientX-box.left,event.clientY-box.top,shape.points)) {
      applySelection(byId.get(shape.id),true);break;
    }
  }
});
$('share').addEventListener('click',async()=>{
  const url=new URL(location.href);
  url.hash=state.place.id;
  try{
    await navigator.clipboard.writeText(url.href);
    $('copy-state').textContent='Kapı adresi kopyalandı.';
  }catch{
    $('copy-state').textContent='Kapı bağlantısına sağ tıklayarak adresi kopyalayabilirsin.';
    $('route').focus();
  }
});
function syncFromUrl(){if(!location.hash||byId.has(location.hash.slice(1)))applySelection(selectionFromHash(),false);}
window.addEventListener('popstate',syncFromUrl);
window.addEventListener('hashchange',syncFromUrl);
if(typeof ResizeObserver==='function')new ResizeObserver(resize).observe(canvas);
else window.addEventListener('resize',resize);
applySelection(selectionFromHash(),false);
resize();
