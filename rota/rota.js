'use strict';

const byId = id => document.getElementById(id);
const canvas = byId('city');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const routes = {
  a: {roof: [-6, 9, 2], end: [-29, 0.6, -25], color: '#f1bd86', kicker: 'A ÇATISI / MODA VE SANAT', title: 'Watergarden İstanbul', address: 'Barbaros Mah., Kızılbegonya Sok. 10/1, Ataşehir.', description: 'Günün rotasını tasarımla aç. Önce prova, ardından galeri.', url: 'https://watergarden.com.tr/iletisim'},
  b: {roof: [1, 13, -1], end: [5, 0.6, -37], color: '#a7ddc4', kicker: 'B ÇATISI / TEKNOLOJİ VE FIRSAT', title: 'İstanbul Finans Merkezi', address: 'Finanskent Mah., Finans Cad. No: 46/3, Ümraniye.', description: 'Finanskent durağında kurum ve iletişim bilgilerini aç. Mahalle rehberinden ev teknolojisi ihtiyaçlarını hazırlayabilirsin.', url: 'https://ifm.gov.tr/iletisim'},
  c: {roof: [8, 10, 3], end: [37, 0.6, -18], color: '#e7a5a6', kicker: 'C ÇATISI / MÜZİK VE AÇIK HAVA', title: 'Maltepe Orhangazi Şehir Parkı', address: 'Maltepe sahili, İstanbul.', description: 'Sahil durağında açık alan etkinliklerine bak. Etkinlik saati için resmi programı kontrol et.', url: 'https://sportesisleri.ibb.istanbul/acik-alan-egzersizleri'}
};
const add = (a, b) => a.map((v, i) => v + b[i]);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const scale = (a, s) => a.map(v => v * s);
const mix = (a, b, t) => add(scale(a, 1 - t), scale(b, t));
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const cross = ([a,b,c], [x,y,z]) => [b*z-c*y,c*x-a*z,a*y-b*x];
const unit = v => scale(v, 1 / (Math.hypot(...v) || 1));
const smooth = t => t*t*(3-2*t);
const up = [0,1,0];
const faceIndexes = [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];
const boxes = [
  [-6, 2, 4.7, 5, 8.6, '#996956'], [1, -1, 4.4, 5, 12.6, '#79958a'], [8, 3, 4.8, 5, 9.6, '#946675'],
  [-31, -26, 10, 5, 1.8, '#b3895e'], [-27,-30,7,4,2.6,'#805e56'],
  [2,-40,3,4,8,'#729697'], [7,-42,3,4,11,'#799690'], [12,-39,3,4,6,'#9a785c'],
  [35,-22,8,4,1.8,'#a06362'], [40,-24,9,8,.12,'#627c89']
];
const palette = ['#627371','#716b69','#536773','#85745f','#77687c'];
for (let n = 0; n < 60; n++) {
  const x = ((n * 11) % 79) - 39;
  const z = ((n * 19 + 15) % 53) - 48;
  if (z > -8 && Math.abs(x) < 13) continue;
  if (Object.values(routes).some(({end}) => Math.hypot(x-end[0],z-end[2]) < 6)) continue;
  boxes.push([x,z,1.4+(n%3)*.48,1.8+(n%4)*.35,1.3+(n%5)*.49,palette[n%palette.length]]);
}
let selected = 'a';
let pending = 0;
let flight = null;
let finished = false;
let yaw = 0.53;
let drag = null;
let width = 1;
let height = 1;
let ratio = 1;
let projectedRoofs = {};
const buttons = [...document.querySelectorAll('[data-route]')];
const fly = byId('fly');
const status = byId('flight-status');

function weave() {
  const swatch = document.createElement('canvas');
  swatch.width = swatch.height = 8;
  const ink = swatch.getContext('2d');
  for (let i = 0; i < 8; i += 4) {
    ink.fillStyle = '#fff2cb35';
    ink.fillRect(i,0,1,8);
    ink.fillStyle = '#1d182c63';
    ink.fillRect(0,i,8,1);
    ink.fillStyle = '#fff2cb45';
    ink.fillRect(i,i,2,1);
  }
  return ctx.createPattern(swatch,'repeat');
}
const fabric = ctx && weave();

function cameraBetween(origin, target) {
  const front = unit(sub(target, origin));
  const right = unit(cross(front, up));
  const vertical = cross(right, front);
  return point => {
    const delta = sub(point,origin);
    const depth = dot(delta,front);
    if (depth < .85) return null;
    const focal = Math.min(width,height*1.7)*.86;
    return [width*.5 + dot(delta,right)*focal/depth,
      height*.55 - dot(delta,vertical)*focal/depth, depth];
  };
}

function polygon(path, color, texture = 0) {
  if (path.some(point => !point)) return;
  ctx.beginPath();
  path.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (texture) {
    ctx.save();
    ctx.globalAlpha = texture;
    ctx.fillStyle = fabric;
    ctx.fill();
    ctx.restore();
  }
}

function stroke(points, color, thickness) {
  if (points.some(point => !point)) return;
  ctx.beginPath();
  points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.stroke();
}

function flightPoint(route, t) {
  const s = 1-t;
  const start = route.roof;
  const end = route.end;
  const c1 = add(mix(start,end,.18),[0,9,0]);
  const c2 = add(mix(start,end,.67),[0,4,0]);
  return add(add(scale(start,s*s*s),scale(c1,3*s*s*t)),
    add(scale(c2,3*s*t*t),scale(end,t*t*t)));
}

function marker(project, point, color, size) {
  const projected = project(point);
  if (!projected) return;
  const rad = Math.max(4, Math.min(35, size*300/projected[2]));
  ctx.beginPath();
  ctx.ellipse(projected[0],projected[1],rad,rad*.38,0,0,Math.PI*2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function city(project, origin) {
  for (let i=-48;i<=48;i+=4) {
    stroke([project([i,0,-57]),project([i,0,30])],'#c1b09432',1);
    stroke([project([-58,0,i]),project([58,0,i])],'#c1b09428',1);
  }
  const faces = [];
  for (const [x,z,w,d,h,color] of boxes) {
    const v = [
      [x-w/2,0,z-d/2],[x+w/2,0,z-d/2],[x+w/2,0,z+d/2],[x-w/2,0,z+d/2],
      [x-w/2,h,z-d/2],[x+w/2,h,z-d/2],[x+w/2,h,z+d/2],[x-w/2,h,z+d/2]
    ];
    for (let i=1;i<faceIndexes.length;i++) {
      const points = faceIndexes[i].map(index => v[index]);
      const normal = cross(sub(points[1],points[0]),sub(points[2],points[0]));
      if (dot(normal,sub(origin,points[0])) <= 0) continue;
      const path = points.map(project);
      if (path.some(point => !point)) continue;
      const shade = i===1 ? 0 : i===2||i===4 ? 0.15 : .31;
      faces.push({path,color,shade,depth:path.reduce((n,p)=>n+p[2],0)/4});
    }
  }
  faces.sort((a,b)=>b.depth-a.depth);
  for (const f of faces) {
    polygon(f.path,f.color,.65);
    if (f.shade) polygon(f.path,'rgba(15, 23, 33, '+f.shade+')');
  }
}

function draw(now) {
  pending = 0;
  const route = routes[selected];
  const t = flight === null ? (finished ? 1 : 0) : Math.min(1,(now-flight)/3750);
  const active = flight !== null || finished;
  const point = flightPoint(route,t);
  const next = flightPoint(route,Math.min(1,t+.014));
  const before = flightPoint(route,Math.max(0,t-.014));
  const front = unit(sub(next,before));
  const overviewOrigin = [Math.sin(yaw)*62,42,Math.cos(yaw)*62];
  const overviewTarget = [0,3,-10];
  const arrival = active ? smooth(Math.min(1,t*3.2)) : 0;
  const followingOrigin = add(sub(point,scale(front,12)),[0,8,0]);
  const origin = mix(overviewOrigin,followingOrigin,arrival);
  const target = mix(overviewTarget,add(point,[0,-1,-4]),arrival);
  const project = cameraBetween(origin,target);
  if (ctx) {
    ctx.setTransform(ratio,0,0,ratio,0,0);
    const sky = ctx.createLinearGradient(0,0,0,height);
    sky.addColorStop(0,'#283342');sky.addColorStop(.47,'#5d5d60');sky.addColorStop(1,'#202932');
    ctx.fillStyle = sky;ctx.fillRect(0,0,width,height);
    city(project,origin);
    for (const [key,r] of Object.entries(routes)) {
      marker(project,r.end,r.color,key===selected?2:1.25);
      const anchor = project(add(r.roof,[0,1.1,0]));
      const tag = byId('tag-'+key);
      tag.hidden = !anchor || active;
      if (anchor) tag.style.transform = 'translate('+anchor[0]+'px,'+anchor[1]+'px) translate(-50%,-50%)';
      projectedRoofs[key] = anchor;
    }
    const trail = Array.from({length:32},(_,i)=>project(flightPoint(route,i/31)));
    let prev = null;
    trail.forEach((p,i)=>{
      if (p && prev && i%3 && (!active || i/31 >= t-.24)) {
        stroke([prev,p],route.color,1.7);
      }
      prev = p;
    });
    const side = unit(cross(front,up));
    const wing = add(point,[0,.16,0]);
    const nose = add(point,scale(front,.86));
    const tail = sub(point,scale(front,.68));
    polygon([nose,add(tail,scale(side,1.02)),tail].map(project),'#ebd2a5');
    polygon([nose,sub(tail,scale(side,1.02)),tail].map(project),route.color);
    if (active) for (const n of [.25,.51,.77]) {
      if (n>t) marker(project,flightPoint(route,n),route.color,1.45);
    }
  }
  if (flight !== null && t < 1) redraw();
  if (flight !== null && t === 1) arrive();
}
function redraw() {
  if (!pending) pending = requestAnimationFrame(draw);
}
function arrive() {
  flight = null;
  finished = true;
  fly.disabled = false;
  status.textContent = routes[selected].title+' durağına ulaştın.';
  byId('scene').dataset.phase = 'arrived';
}
function choose(key) {
  selected = key;
  finished = false;
  flight = null;
  fly.disabled = false;
  const r = routes[key];
  byId('route-kicker').textContent = r.kicker;
  byId('destination').textContent = r.title;
  byId('route-address').textContent = r.address;
  byId('route-description').textContent = r.description;
  byId('destination-source').href = r.url;
  byId('scene').dataset.phase = 'ready';
  status.textContent = r.title+' rotası hazır.';
  buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.route===key)));
  redraw();
}
buttons.forEach(button => button.addEventListener('click',()=>choose(button.dataset.route)));
fly.addEventListener('click',()=>{
  if (reducedMotion.matches || !ctx) {arrive();redraw();return;}
  flight = performance.now();finished = false;fly.disabled = true;
  status.textContent = routes[selected].title+' yönünde süzülüyorsun.';
  byId('scene').dataset.phase = 'flight';
  redraw();
});
byId('reset').addEventListener('click',()=>{yaw=.53;choose(selected);});
canvas.addEventListener('keydown',event=>{
  if (event.key!=='ArrowLeft' && event.key!=='ArrowRight') return;
  event.preventDefault();
  if (flight === null && !finished) {
    yaw+=event.key==='ArrowLeft' ? -.13 : .13;
    redraw();
  }
});
canvas.addEventListener('pointerdown',event=>{
  if (flight!==null || finished) return;
  drag = {x:event.clientX, origin:event.clientX, pointer:event.pointerId};
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener('pointermove',event=>{
  if (!drag || drag.pointer!==event.pointerId) return;
  yaw+=(event.clientX-drag.x)*.008;
  drag.x=event.clientX;
  redraw();
});
canvas.addEventListener('pointerup',event=>{
  if (!drag || drag.pointer!==event.pointerId) return;
  if (Math.abs(event.clientX-drag.origin)<7) {
    const rect = canvas.getBoundingClientRect();
    const key = Object.keys(routes).find(k=>{
      const p = projectedRoofs[k];
      return p && Math.hypot(event.clientX-rect.left-p[0],event.clientY-rect.top-p[1])<32;
    });
    if (key) choose(key);
  }
  drag=null;
});
canvas.addEventListener('pointercancel',()=>{drag=null;});
new ResizeObserver(()=>{
  width=canvas.clientWidth || 1;height=canvas.clientHeight || 1;
  ratio=Math.min(devicePixelRatio || 1,2);
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);redraw();
}).observe(canvas);
choose('a');

const services = {
  terzi: ['Terzi görüşmesi','https://www.afair.studio/dila'],
  teknoloji: ['Ev teknolojisi görüşmesi','https://www.xn--modernataehir-qtc.com/'],
  tarim: ['Tarım danışmanı görüşmesi','https://tarim.online/']
};
const form = byId('draft-form');
const output = byId('draft-output');
const copy = byId('copy-draft');
const draftStatus = byId('draft-status');
let service = services.terzi;
document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click',()=>{
  service = services[button.dataset.service];
  byId('request-title').textContent = service[0];
  byId('service-link').href = service[1];
  byId('request').hidden = false;
  form.reset();
  output.hidden = true;
  copy.hidden = true;
  draftStatus.textContent = '';
  byId('request').scrollIntoView({block:'start',behavior:reducedMotion.matches?'instant':'smooth'});
  form.elements.date.focus({preventScroll:true});
}));
form.addEventListener('submit',event=>{
  event.preventDefault();
  const details = new FormData(form);
  output.value = [service[0]+' talebi',
    'Tercih edilen tarih: '+(details.get('date') || 'Belirtilmedi'),
    'Tercih edilen saat (İstanbul): '+(details.get('time') || 'Belirtilmedi'),
    'Not: '+(details.get('note').trim() || 'Belirtilmedi'),
    'Bu metin bir taslaktır. Randevu henüz doğrulanmadı.'].join('\n');
  output.hidden = false;
  copy.hidden = false;
  draftStatus.textContent = 'Taslak hazır. Gönderim yapılmadı.';
});
copy.addEventListener('click',async()=>{
  try {
    await navigator.clipboard.writeText(output.value);
    draftStatus.textContent = 'Taslak kopyalandı.';
  } catch {
    output.select();
    draftStatus.textContent = 'Metni seçtim. Ctrl+C veya ⌘+C ile kopyalayabilirsin.';
  }
});
