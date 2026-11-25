
'use strict';

const element = id => document.getElementById(id);
const routes = {
  a:{block:'A',name:'Watergarden İstanbul',address:'Barbaros Mahallesi, Kızılbegonya Sokak 10/1, Ataşehir.',url:'https://watergarden.com.tr/iletisim',source:'Adres ve ulaşım kaynağı ↗',next:'https://watergarden.com.tr/',nextLabel:'Watergarden’ı keşfet ↗', ink:'#ffd19b', sky:'#75504d', ground:'#384348', from:-20, bend:-28, seed:308},
  b:{block:'B',name:'Finanskent · İstanbul Finans Merkezi',address:'Finanskent Mahallesi, Finans Caddesi 46/3, Ümraniye.',url:'https://ifm.gov.tr/iletisim',source:'İstanbul Finans Merkezi adresi ↗',next:'https://ifm.gov.tr/',nextLabel:'Finans Merkezi’ni keşfet ↗',ink:'#91efd1',sky:'#375f6f',ground:'#253e47',from:0,bend:20,seed:821},
  c:{block:'C',name:'Maltepe Sahili · Orhangazi Şehir Parkı',address:'Çınar Mahallesi, Turgut Özal Bulvarı, Maltepe.',url:'https://sporenvanteri.ibb.istanbul/public/en/facility/ibb-orhangazi-city-park-maltepe-sports-facility',source:'İBB park ve tesis kaydı ↗',next:'https://kultur.istanbul/etkinlikler/',nextLabel:'Konser ve etkinlik takvimi ↗',ink:'#a8d7fa',sky:'#485b81',ground:'#213f4d',from:20,bend:43,seed:409}
};
const canvas = element('sahne');
const ctx = canvas.getContext('2d');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const duration = 5900;
let current = routes.a;
let buildings = [];
let frame = 0;
let phase = 0, offset = 0, lastTick = 0, running = false;

function layout(route) {
  let seed = route.seed;
  const random = () => ((seed = (Math.imul(seed,1664525)+1013904223) >>> 0) / 4294967296);
  const result = [];
  for (let i=0;i<64;i++) {
    const z = 24 + (i % 16)*18 + random()*11;
    const x = (i % 4 < 2 ? -1 : 1)*(19+random()*31)+(z/300)*route.bend;
    if (route.block==='C' && x>8 && z>86) continue;
    result.push({x,z,w:5+random()*9,d:9+random()*12,h:5+random()*19,c:random()>.54?0:1});
  }
  result.push(...[-20,0,20].map((x,i)=>({x,z:11,w:12,d:13,h:[33,39,31][i], c:2})));
  const b=route.bend;
  if (route.block==='A') result.push({x:b-13,z:210,w:27,d:21,h:10,c:2},{x:b+12,z:221,w:19,d:18,h:6,c:2});
  if (route.block==='B') result.push({x:b-11,z:213,w:13,d:21,h:46,c:2},{x:b+11,z:226,w:14,d:21,h:61,c:2});
  if (route.block==='C') result.push({x:b-11,z:207,w:23,d:23,h:6,c:2},{x:b+16,z:218,w:26,d:9,h:13,c:2});
  return result.sort((a,b)=>b.z-a.z);
}

function polygon(points, color) {
  if(points.some(point=>point===null))return;
  ctx.beginPath(); ctx.moveTo(...points[0]); for(const point of points.slice(1))ctx.lineTo(...point);
  ctx.closePath(); ctx.fillStyle=color; ctx.fill();
}

function render(p) {
  if(!ctx)return;
  const width=canvas.width,height=canvas.height;
  const step=p*p*(3-2*p);
  const x=current.from+(current.bend-current.from)*step+offset*11*(1-step*.72);
  const z=1 + p*180;
  const altitude=43-25*step;
  const focal=width*.66, horizon=height*.3;
  const projection=(X,Y,Z)=>{
    const depth=Z-z;
    if(depth<2)return null;
    return [width/2+(X-x)*focal/depth,horizon+(altitude-Y)*focal/depth];
  };
  const sky=ctx.createLinearGradient(0,0,0,height);
  sky.addColorStop(0,'#182f40'); sky.addColorStop(.38,current.sky); sky.addColorStop(.55,'#d29979'); sky.addColorStop(.56,current.ground); sky.addColorStop(1,'#14292f');
  ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
  const glow=ctx.createRadialGradient(width*.76,height*.32,2,width*.76,height*.32,width*.35);
  glow.addColorStop(0,'#ffd29a70');glow.addColorStop(1,'#e6956500');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  if(current.block==='C')polygon([[width*.5,horizon],[width,horizon],[width,height],[width*.67,height]],'#426476');
  const pathNear=z+10,far=300;
  const roadCenter=current.bend*p;
  polygon([projection(roadCenter-3,0,pathNear),projection(roadCenter+3,0,pathNear),projection(current.bend+4,0,far),projection(current.bend-4,0,far)],'#75664e');
  const palettes=[['#253b47','#395161','#597488'],['#36494d','#536363','#819386'],['#486060','#6b7770',current.ink]];
  for(const building of buildings) {
    const {x:bx,z:bz,w,d,h,c}=building;
    if(bz<=z+2)continue;
    const f=projection(bx-w/2,0,bz),g=projection(bx+w/2,0,bz);
    const ft=projection(bx-w/2,h,bz),gt=projection(bx+w/2,h,bz);
    const farTop=projection(bx+w/2,h,bz+d), farBase=projection(bx+w/2,0,bz+d), farLeft=projection(bx-w/2,h,bz+d);
    polygon([g,gt,farTop,farBase],palettes[c][0]);
    polygon([ft,gt,farTop,farLeft],palettes[c][2]);
    polygon([f,g,gt,ft],palettes[c][1]);
    if(bz-z>175)continue;
    const floors=Math.min(10,Math.floor(h/3));
    for(let floor=1;floor<=floors;floor++){
      const lp=projection(bx-w*.38,floor*h/(floors+1),bz-.1);
      const rp=projection(bx+w*.38,floor*h/(floors+1),bz-.1);
      if(lp&&rp){
        ctx.strokeStyle=floor%3===0?'#ffe4ad8a':'#203842a8';
        ctx.lineWidth=Math.max(1,Math.min(4,110/(bz-z)));
        ctx.beginPath();ctx.moveTo(...lp);ctx.lineTo(...rp);ctx.stroke();
      }
    }
  }
  const ring=projection(current.bend,19,207);
  if(ring){
    const radius=Math.min(265,10*focal/(207-z));
    ctx.strokeStyle=current.ink;ctx.lineWidth=2+radius*.016;
    ctx.shadowColor=current.ink;ctx.shadowBlur=20;
    ctx.beginPath();ctx.ellipse(...ring,radius,radius*.77,0,0,Math.PI*2);ctx.stroke();
    ctx.shadowBlur=0;
  }
  if(p>=1)return;
  const size=width*.105;
  ctx.save();ctx.translate(width*.5,height*(.65+Math.sin(p*8)*.032));ctx.scale(size,size);
  ctx.rotate(Math.sin(p*Math.PI*1.4)*current.bend/145+offset*.21);
  polygon([[-.18,-.18],[-1,-.33],[-.66,.12],[-.25,.32],[0,.18],[.25,.32],[.66,.12],[1,-.33],[.18,-.18]],'#365e9a');
  polygon([[-1,-.33],[-.43,-.14],[-.26,.24],[-.66,.12]],'#6d8fbc');
  polygon([[1,-.33],[.43,-.14],[.26,.24],[.66,.12]],'#6d8fbc');
  polygon([[-.19,-.14],[.19,-.14],[.12,.4],[-.13,.38]],'#1b2937');
  ctx.fillStyle='#ffca75';ctx.beginPath();ctx.ellipse(0,-.22,.13,.15,0,0,Math.PI*2);ctx.fill();ctx.restore();
}

function selectRoute(key) {
  cancelAnimationFrame(frame);frame=0;phase=0;offset=0;running=false;canvas.dataset.direction='0';syncFlight();current=routes[key]; buildings=layout(current);
  for(const button of document.querySelectorAll('[data-route]')) button.setAttribute('aria-pressed',String(button.dataset.route===key));
  element('rota-adi').textContent=current.name; element('rota-adres').textContent=current.address;
  const link=element('rota-kaynak');link.href=current.url;link.textContent=current.source;
  const next=element('rota-devam');next.href=current.next;next.textContent=current.nextLabel;
  element('arrival').hidden=true;
  element('hud-clock').textContent='BLOK '+current.block; element('ucus-durum').textContent='Blok '+current.block+' seçili. Görsel rota temsili.';
  element('uc').textContent='GAIA ile uç';
  render(0);
}

function arrive() {
  cancelAnimationFrame(frame);frame=0;phase=1;running=false;syncFlight();render(1);
  element('arrival').hidden=false; element('arrival-block').textContent='BLOK '+current.block+' / VARIŞ';
  element('arrival-name').textContent=current.name;
  element('hud-clock').textContent='VARIŞ'; element('uc').textContent='Tekrar uç';
  element('ucus-durum').textContent='Varış: '+current.name+'. Adres ve kaynak aşağıda.';
}


function tickFlight(now) {
  const increment = lastTick ? Math.min(65,now-lastTick)/duration : 0;
  lastTick=now;
  phase=Math.min(1,phase+increment);
  syncFlight();
  if(phase>=1)return arrive();
  render(phase);
  frame=requestAnimationFrame(tickFlight);
}

function fly() {
  cancelAnimationFrame(frame);
  if(motion.matches)return arrive();
  if(phase>=1)phase=0;
  running=true;lastTick=0;
  element('arrival').hidden=true;
  element('hud-clock').textContent='UÇUŞ';
  element('ucus-durum').textContent='GAIA, Blok '+current.block+' rotasında.';
  syncFlight();
  frame=requestAnimationFrame(tickFlight);
}
function syncFlight() {
  if(document.activeElement!==element('ucus-konum'))element('ucus-konum').value=String(Math.round(phase*100));
  element('ucus-konum-deger').textContent='%'+Math.round(phase*100);
  element('ucus-dur').textContent=running?'Duraklat':phase>0&&phase<1?'Sürdür':'Oynat';
  element('ucus-dur').setAttribute('aria-pressed',String(running));
}
function steer(delta){
  offset=Math.max(-1.5,Math.min(1.5,offset+delta));
  canvas.dataset.direction=String(offset);
  render(phase);
}
function pauseFlight(){
  cancelAnimationFrame(frame);frame=0;running=false;lastTick=0;
  element('hud-clock').textContent='BEKLEMEDE';
  element('ucus-durum').textContent='Uçuş duraklatıldı. Oku veya ilerleme çubuğunu kullan.';
  syncFlight();
}

function resize() {
  const size=canvas.getBoundingClientRect();
  const factor=Math.min(1.4,Math.max(1,devicePixelRatio));
  canvas.width=Math.min(2200,Math.max(1,Math.round(size.width*factor)));
  canvas.height=Math.min(920,Math.max(1,Math.round(size.height*factor)));
  render(phase);
}

document.querySelectorAll('[data-route]').forEach(button=>button.addEventListener('click',()=>selectRoute(button.dataset.route)));
element('uc').addEventListener('click',fly);element('direkt').addEventListener('click',arrive);
element('ucus-sol').addEventListener('click',()=>steer(-.3));
element('ucus-sag').addEventListener('click',()=>steer(.3));
element('ucus-dur').addEventListener('click',()=>{if(running)pauseFlight();else fly();});
element('ucus-konum').addEventListener('input',event=>{
 pauseFlight();phase=Number(event.target.value)/100;
 if(phase===1){arrive();return;}
 element('arrival').hidden=true;render(phase);syncFlight();
});
canvas.addEventListener('keydown',event=>{
 if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
 event.preventDefault();steer(event.key==='ArrowLeft'?-.3:.3);
});
const requestedRoute=new URLSearchParams(location.search).get('rota');
selectRoute(Object.hasOwn(routes,requestedRoute)?requestedRoute:'a');resize();
new ResizeObserver(resize).observe(canvas);

const offerings={
 terzi:{label:'AFAIR · Terzi',topics:['İlk prova','Ölçü alma','Kumaş ve renk']},
 tarim:{label:'Tarım danışmanlığı',topics:['Balkon ve ışık','Toprak ve saksı','Su ihtiyacı']}
};
let service='terzi';
let appointment=null;
const partsOfIstanbulDate=new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
const datePart=type=>partsOfIstanbulDate.find(item=>item.type===type).value;
element('talep-tarih').min=[datePart('year'),datePart('month'),datePart('day')].join('-');

const hideDraft=()=>{
  appointment=null;element('taslak-panel').hidden=true;element('taslak-eylemler').hidden=true;
};
document.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>{
 service=button.dataset.book;const offer=offerings[service];hideDraft();
 element('talep').hidden=false;element('talep-baslik').textContent=offer.label+' · Görüşme taslağı';
 element('talep-durum').textContent='Tercih ettiğin tarihi ve saati seç.';
 element('talep-konu').replaceChildren(...offer.topics.map(topic=>new Option(topic,topic)));
 element('talep-baslik').focus();
}));
for(const id of ['talep-tarih','talep-saat','talep-konu'])element(id).addEventListener('change',hideDraft);
element('hazirla').addEventListener('click',()=>{
 const date=element('talep-tarih').value,time=element('talep-saat').value, topic=element('talep-konu').value;
 const serviceName=offerings[service].label;
 const dateTime=new Date(date+'T'+time+':00+03:00');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(dateTime.getTime())||dateTime<=Date.now()||!offerings[service].topics.includes(topic)){
   element('talep-durum').textContent='Gelecekteki bir tarih ve saat seç.';return;
 }
 const format=new Intl.DateTimeFormat('tr-TR',{dateStyle:'long',timeZone:'Europe/Istanbul'}).format(dateTime);
 const text='Merhaba, '+topic.toLocaleLowerCase('tr-TR')+' için '+format+' saat '+time+' (İstanbul) civarında görüşebilir miyiz? Müsaitliğinizi ve görüşme şeklini teyit edebilir misiniz?';
 appointment={subject:serviceName+' · '+topic,start:dateTime,end:new Date(dateTime.getTime()+30*60*1000)};
 element('taslak').value=text;element('taslak-panel').hidden=false;element('taslak-eylemler').hidden=false;
 element('talep-durum').textContent='Talep hazır. Randevu için sağlayıcının teyidi gerekiyor.';
});
element('kopyala').addEventListener('click',async()=>{
 if(!appointment)return;
 try{await navigator.clipboard.writeText(element('taslak').value);element('talep-durum').textContent='Talep metni kopyalandı.';}
 catch{element('taslak').focus();element('taslak').select();element('talep-durum').textContent='Metin seçildi. Kopyalama kısayolunu kullan.';}
});
element('takvim').addEventListener('click',()=>{
 if(!appointment)return;
 const fmt=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const e=new Blob([['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Baska Istanbul Yok//Taslak//TR','BEGIN:VEVENT','UID:'+Date.now()+'@baskaistanbulyok.com','DTSTAMP:'+fmt(new Date()),'DTSTART:'+fmt(appointment.start),'DTEND:'+fmt(appointment.end),'SUMMARY:TASLAK - '+appointment.subject,'STATUS:TENTATIVE','DESCRIPTION:Sağlayıcı teyidi gerekiyor.','END:VEVENT','END:VCALENDAR',''].join('\r\n')],{type:'text/calendar;charset=utf-8'});
 const address=URL.createObjectURL(e), link=document.createElement('a');link.href=address;link.download='gorusme-taslagi.ics';link.click();
 setTimeout(()=>URL.revokeObjectURL(address),1000);
});

function recall(key) {
 try{return JSON.parse(localStorage.getItem('baskaistanbul.'+key));}catch{return null;}
}
function remember(key,value) {
 try{localStorage.setItem('baskaistanbul.'+key,JSON.stringify(value));return true;}catch{return false;}
}
document.querySelectorAll('[data-check]').forEach(check=>{
  check.checked=recall(check.dataset.check)===true;
  check.addEventListener('change',()=>remember(check.dataset.check,check.checked));
});

const tcxPattern=/^\d{2}-\d{4}(?: TCX)?$/;
function describeSample(data){
 element('numune-durum').textContent=data.fiber+' · '+data.weave+' · Ekran '+data.hex+' · '+(data.tcx?'Fiziksel kart referansı: '+data.tcx:'Fiziksel kart belirtilmedi')+'.';
}
const previous=recall('numune');
if(previous&&typeof previous.fiber==='string'&&typeof previous.weave==='string'&&/^#[0-9a-f]{6}$/i.test(previous.hex)){
 for(const [id,key] of [['lif','fiber'],['orgu','weave'],['renk','hex'],['tcx','tcx']])element(id).value=previous[key]||'';
 describeSample(previous);
}
element('numune-kaydet').addEventListener('click',()=>{
 const code=element('tcx').value.trim().toUpperCase();
 if(code&&!tcxPattern.test(code)){element('numune-durum').textContent='Fiziksel kartı 15-1247 TCX biçiminde gir.';return;}
 const data={fiber:element('lif').value,weave:element('orgu').value,hex:element('renk').value,tcx:code?code.replace(/ TCX$/,'')+' TCX':''};
 const saved=remember('numune',data);
 describeSample(data); if(!saved)element('numune-durum').textContent+=' Tarayıcı saklama izni vermedi.';
});
