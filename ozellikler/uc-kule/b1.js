
const c = document.getElementById('c'), ctx = c.getContext('2d');
let W = c.width = innerWidth, H = c.height = innerHeight;
addEventListener('resize', () => { W = c.width = innerWidth; H = c.height = innerHeight; });

let yaw = 0.55, tYaw = 0.55, pitch = 0.24, drag = false, lx = 0, ly = 0;
c.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; });
addEventListener('pointerup', () => drag = false);
addEventListener('pointermove', e => {
  if (!drag) return;
  tYaw += (e.clientX - lx) * 0.008;
  pitch = Math.max(0.05, Math.min(0.65, pitch + (e.clientY - ly) * 0.004));
  lx = e.clientX; ly = e.clientY;
});
function focusTower(ang, btn) {
  tYaw = 0.55 + ang;
  document.querySelectorAll('.dock button').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

const towers = [
  { x:-160, z:0,   w:76, d:76, h:260, label:'A BLOK' },
  { x:0,    z:-30, w:84, d:84, h:330, label:'B BLOK' },
  { x:160,  z:15,  w:76, d:76, h:285, label:'C BLOK' },
];

function proj(x, y, z) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
  const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp + 680;
  const f = Math.min(W, H) * 0.9 / Math.max(120, z2);
  return { sx: W * 0.54 + x1 * f, sy: H * 0.56 + y2 * f, z: z2 };
}

function drawBox(tw, day) {
  const hw = tw.w/2, hd = tw.d/2, y0 = 120, y1 = 120 - tw.h;
  const pts = [
    [-hw,y0,-hd],[hw,y0,-hd],[hw,y0,hd],[-hw,y0,hd],
    [-hw,y1,-hd],[hw,y1,-hd],[hw,y1,hd],[-hw,y1,hd]
  ].map(([dx,y,dz]) => proj(tw.x+dx, y, tw.z+dz));

  const faces = [
    { idx:[0,1,5,4], shade:0.85 },
    { idx:[1,2,6,5], shade:0.62 },
    { idx:[2,3,7,6], shade:0.50 },
    { idx:[3,0,4,7], shade:0.74 },
    { idx:[4,5,6,7], shade:1.00 },
  ].map(f => ({ ...f, z: f.idx.reduce((s,i)=>s+pts[i].z,0)/4 })).sort((a,b)=>b.z-a.z);

  for (const f of faces) {
    const base = 24 + day * 115;
    const r = (base * f.shade)|0, g = ((base+6) * f.shade)|0, b = ((base+18) * f.shade)|0;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.strokeStyle = `rgba(226,198,148,${0.25 + (1-day)*0.25})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    f.idx.forEach((k, idx) => idx ? ctx.lineTo(pts[k].sx, pts[k].sy) : ctx.moveTo(pts[k].sx, pts[k].sy));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function loop() {
  yaw += (tYaw - yaw) * 0.08;
  const day = +document.getElementById('sun').value / 100;
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, `rgb(${(10+day*52)|0},${(14+day*76)|0},${(24+day*112)|0})`);
  bg.addColorStop(1, `rgb(${(6+day*22)|0},${(8+day*26)|0},${(13+day*34)|0})`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const sorted = [...towers].sort((a,b) => proj(b.x,0,b.z).z - proj(a.x,0,a.z).z);
  for (const tw of sorted) drawBox(tw, day);
  requestAnimationFrame(loop);
}
loop();
