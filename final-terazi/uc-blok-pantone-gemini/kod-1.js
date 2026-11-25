// 1. PANTONE TCX REAL FABRIC & THREAD WEAVE ENGINE
const SWATCHES = [
  {code:'PANTONE 19-4024 TCX', name:'Dress Blues · Gece Laciverti', hex:'#132238', weft:'#1D3554', gsm:'240 GSM', thread:'140×120 İpek Krep', origin:'Bursa Koza · Doğal İpek', desc:'Saf siyah yerine derin gece laciverti. Yüksek bükümlü ipek çözgü, ışığı mimari kıvrımlarda yumuşak yansıtır.'},
  {code:'PANTONE 11-0602 TCX', name:'Warm Bone · Kırık Kemik', hex:'#EFE9DC', weft:'#DDD3C0', gsm:'285 GSM', thread:'68×64 Ham Keten', origin:'Trakya Keten · Toprak pH 6.8', desc:'Ağartılmamış ham keten. Tarımdaki toprak kalibrasyonu gibi lif olgunluğu ölçülerek dokunur.'},
  {code:'PANTONE 18-5633 TCX', name:'Deep Emerald · Botanik Zümrüt', hex:'#1A5643', weft:'#266F58', gsm:'310 GSM', thread:'110×96 Organik Gabardin', origin:'Merinos Yün · Kök Boya', desc:'Dila renk analizinin ana imza tonu. Sıkı diyagonal gabardin dokusuyla dört mevsim form tutar.'},
  {code:'PANTONE 17-1340 TCX', name:'Raw Umber · Sıcak Bronz', hex:'#9A6B3F', weft:'#B58454', gsm:'195 GSM', thread:'98×88 İpek-Keten', origin:'Mineral Pigment · Doğal Lif', desc:'Gün batımı traverten ışığına uyumlu sıcak bronz. Ev içi ışık ölçümüyle birebir kalibre edilir.'},
  {code:'PANTONE 14-1118 TCX', name:'Travertine · Mimari Bej', hex:'#CBB89D', weft:'#B7A183', gsm:'340 GSM', thread:'56×52 Mimari Kanvas', origin:'Ham Selüloz · Kuru Tarım', desc:'Ataşehir Modern cephe taşından ilham alan kalın mimari kanvas. Dış giyim ve galeri panolarında ortak doku.'}
];

function drawWeave(canvas, hexA, hexB, step){
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = hexA;
  ctx.fillRect(0, 0, w, h);
  for(let y = 0; y < h; y += step){
    for(let x = 0; x < w; x += step){
      const over = ((x / step) + (y / step)) % 2 === 0;
      ctx.fillStyle = over ? hexB : 'rgba(255,255,255,0.08)';
      ctx.fillRect(x, y, step - 1, Math.max(1, step / 2));
      ctx.fillStyle = over ? 'rgba(19,34,56,0.12)' : hexB;
      ctx.fillRect(x, y + step / 2, Math.max(1, step / 2), step - 1);
    }
  }
}

let activeSwatch = 0;
const pGrid = document.getElementById('pantoneGrid');
SWATCHES.forEach((s, idx) => {
  const el = document.createElement('article');
  el.className = 'swatch' + (idx === 0 ? ' on' : '');
  el.innerHTML = `<div class="swatch-chip"><canvas width="260" height="126"></canvas></div>
    <div class="swatch-meta">
      <div class="swatch-code">${s.code}</div>
      <div class="swatch-name">${s.name}</div>
      <div class="swatch-spec">${s.gsm} · ${s.thread}<br>${s.origin}</div>
    </div>`;
  drawWeave(el.querySelector('canvas'), s.hex, s.weft, 4);
  el.addEventListener('click', () => {
    activeSwatch = idx;
    document.querySelectorAll('.swatch').forEach((x,i) => x.classList.toggle('on', i === idx));
    updateLoom();
  });
  pGrid.appendChild(el);
});

function updateLoom(){
  const s = SWATCHES[activeSwatch];
  document.documentElement.style.setProperty('--accent', s.hex === '#EFE9DC' ? '#9A6B3F' : s.hex);
  document.getElementById('loomCode').textContent = s.code;
  document.getElementById('loomTitle').textContent = s.name;
  document.getElementById('loomDesc').textContent = s.desc;
  document.getElementById('loomPills').innerHTML =
    `<span>${s.gsm}</span><span>${s.thread}</span><span>${s.origin}</span><span>HEX ${s.hex}</span>`;
  drawWeave(document.getElementById('loomZoom'), s.hex, s.weft, 10);
}
updateLoom();

// 2. ORIGINAL NON-GOOGLE-MAPS 3-BLOCK SPATIAL FLIGHT CANVAS
const fc = document.getElementById('flightCanvas');
const fctx = fc.getContext('2d');
const ROUTES = [
  {name:'BLOK A → WATERGARDEN AVM', alt:'142 m → 28 m', spd:'118 km/s', dur:'48 sn', sx:0.46, sy:0.46, ex:0.16, ey:0.52, col:'#9A6B3F', label:'Watergarden AVM (Batı · Moda & Gastronomi)'},
  {name:'BLOK B → FİNANSKENT / İFM', alt:'156 m → 44 m', spd:'126 km/s', dur:'62 sn', sx:0.53, sy:0.42, ex:0.84, ey:0.22, col:'#1A5643', label:'Finanskent / İFM (Kuzey-Doğu · Teknoloji & Fırsat)'},
  {name:'BLOK C → MALTEPE SAHİL KONSER', alt:'168 m → 4 m', spd:'134 km/s', dur:'142 sn', sx:0.51, sy:0.51, ex:0.62, ey:0.88, col:'#132238', label:'Maltepe Sahil Konser Alanı (Güney · Marmara)'}
];
let activeBlock = 0, upperRing = false, flyT = 0;

function resizeFlight(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  fc.width = Math.floor(fc.clientWidth * dpr);
  fc.height = Math.floor(fc.clientHeight * dpr);
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeFlight);
resizeFlight();

function drawFlight(){
  const w = fc.clientWidth, h = fc.clientHeight;
  fctx.clearRect(0, 0, w, h);

  // Parchment architectural base
  fctx.fillStyle = '#FAF8F3';
  fctx.fillRect(0, 0, w, h);

  // Original topological contour rings (zero Google Maps)
  fctx.strokeStyle = 'rgba(19,34,56,0.08)';
  fctx.lineWidth = 1;
  const cx = w * 0.5, cy = h * 0.46;
  for(let r = 42; r < Math.max(w, h) * 0.9; r += 42){
    fctx.beginPath();
    fctx.ellipse(cx, cy, r * 1.15, r * 0.72, -0.18, 0, Math.PI * 2);
    fctx.stroke();
  }

  // Compass axes
  fctx.strokeStyle = 'rgba(154,107,63,0.18)';
  fctx.setLineDash([4, 6]);
  fctx.beginPath(); fctx.moveTo(cx, 16); fctx.lineTo(cx, h - 16); fctx.moveTo(16, cy); fctx.lineTo(w - 16, cy); fctx.stroke();
  fctx.setLineDash([]);

  // Marmara shoreline contour at bottom
  fctx.fillStyle = 'rgba(26,86,67,0.08)';
  fctx.beginPath();
  fctx.moveTo(0, h * 0.86);
  fctx.quadraticCurveTo(w * 0.45, h * 0.79, w, h * 0.89);
  fctx.lineTo(w, h); fctx.lineTo(0, h); fctx.closePath();
  fctx.fill();
  fctx.fillStyle = '#1A5643';
  fctx.font = '600 10px system-ui';
  fctx.fillText('MARMARA DENİZİ · MALTEPE SAHİL HATTI', 18, h - 14);

  // Upper ring overlay (baskaistanbulyok.com)
  if(upperRing){
    fctx.strokeStyle = '#9A6B3F';
    fctx.lineWidth = 2;
    fctx.beginPath();
    fctx.ellipse(cx, cy, w * 0.44, h * 0.41, 0, 0, Math.PI * 2);
    fctx.stroke();
    fctx.fillStyle = '#9A6B3F';
    fctx.font = '700 11px system-ui';
    fctx.fillText('ÜST HALKA: BASKAISTANBULYOK.COM · İSTANBUL → BOĞAZ → GÖKÇEADA', 18, 24);
  }

  // Draw all 3 routes faintly, active route bold + animated glider
  ROUTES.forEach((r, i) => {
    const sx = w * r.sx, sy = h * r.sy, ex = w * r.ex, ey = h * r.ey;
    const mx = (sx + ex) / 2, my = Math.min(sy, ey) - 65;
    fctx.strokeStyle = i === activeBlock ? r.col : 'rgba(19,34,56,0.22)';
    fctx.lineWidth = i === activeBlock ? 2.6 : 1.2;
    fctx.beginPath(); fctx.moveTo(sx, sy); fctx.quadraticCurveTo(mx, my, ex, ey); fctx.stroke();

    // Destination node
    fctx.fillStyle = i === activeBlock ? r.col : '#42526B';
    fctx.beginPath(); fctx.arc(ex, ey, i === activeBlock ? 6 : 4, 0, Math.PI * 2); fctx.fill();
    fctx.font = (i === activeBlock ? '700 ' : '500 ') + '11px system-ui';
    fctx.fillText(r.label, Math.max(14, Math.min(w - 250, ex - 40)), ey + (ey > h * 0.7 ? -12 : 18));

    if(i === activeBlock){
      const t = flyT;
      const gx = (1-t)*(1-t)*sx + 2*(1-t)*t*mx + t*t*ex;
      const gy = (1-t)*(1-t)*sy + 2*(1-t)*t*my + t*t*ey;
      fctx.fillStyle = '#FAF8F3';
      fctx.strokeStyle = r.col;
      fctx.lineWidth = 2.5;
      fctx.beginPath(); fctx.arc(gx, gy, 7, 0, Math.PI * 2); fctx.fill(); fctx.stroke();
    }
  });

  // 3 Isometric Rooftop Blocks (Ataşehir Modern)
  const blocks = [{x:cx-28,y:cy-4,t:'A'},{x:cx+16,y:cy-22,t:'B'},{x:cx+6,y:cy+18,t:'C'}];
  blocks.forEach((b, i) => {
    const on = i === activeBlock;
    fctx.fillStyle = on ? '#132238' : '#D8CEBE';
    fctx.fillRect(b.x - 14, b.y - 14, 28, 28);
    fctx.strokeStyle = '#9A6B3F';
    fctx.lineWidth = on ? 2 : 1;
    fctx.strokeRect(b.x - 14, b.y - 14, 28, 28);
    fctx.fillStyle = on ? '#FAF8F3' : '#132238';
    fctx.font = '700 11px system-ui';
    fctx.fillText(b.t, b.x - 4, b.y + 4);
  });

  flyT = (flyT + 0.0065) % 1.0;
  requestAnimationFrame(drawFlight);
}
requestAnimationFrame(drawFlight);

document.querySelectorAll('.block-card').forEach(btn => {
  btn.addEventListener('click', () => {
    activeBlock = parseInt(btn.dataset.b, 10);
    flyT = 0;
    document.querySelectorAll('.block-card').forEach((x,i) => x.classList.toggle('on', i === activeBlock));
    const r = ROUTES[activeBlock];
    document.getElementById('fRoute').textContent = r.name;
    document.getElementById('fAlt').textContent = r.alt;
    document.getElementById('fSpd').textContent = r.spd;
    document.getElementById('fDur').textContent = r.dur;
  });
});
document.getElementById('btnRing').addEventListener('click', e => {
  upperRing = !upperRing;
  e.target.textContent = upperRing ? 'Ataşehir 3-Blok Odağına Dön' : 'Üst Halkaya Çık: baskaistanbulyok.com ↗';
});

// 3. 4-SITE RESIDENT CONCIERGE
const CONCIERGE = {
  terzi: {
    title: 'Online Terzi Müsait mi? — afair.live İki Mezura Akışı',
    desc: 'Ataşehir Modern dairelerine iki mezura ile gelen AFAIR terzisi, ilk ziyarette 12 noktalı dijital kalıp + Dila renk analizini (%0 saf siyah) çıkarır.',
    slots: ['Bugün 16:00 · Blok A', 'Yarın 11:00 · Blok B', 'Yarın 19:00 · Blok C'],
    note: 'Pilot taslak durum: Seçtiğiniz saat ön planlama olarak bu ekranda işaretlenir; gerçek canlı takvim bağlantısı afair.live yayınıyla açılacaktır.',
    link: ['/dila-senkron', 'Dila 8-Senkron Renk Motorunu Aç ↗']
  },
  tarim: {
    title: 'Tarım Danışmanımdan Nasıl Randevu Alabilirim? — tarim.online',
    desc: 'Gökçeada 1.308 parsel v3 toprak pH, kuru tarım (832 parsel) ve balkon/teras mikroklima danışmanlığı tek profilde toplanır.',
    slots: ['Çevrimiçi Toprak Analizi · 20 dk', 'Gökçeada Parsel Brifingi · 30 dk', 'Ataşehir Teras Bitki Planı · 25 dk'],
    note: 'Bilimsel şeffaflık: Tüm öneriler SoilGrids + v3 sulama verisine dayanır; ERA5 yıllık seri eksikliği gizlenmeden raporlanır.',
    link: ['/gokceada', 'Gökçeada 1.308 Parsel Atlasına Git ↗']
  },
  sanat: {
    title: 'AI Galeri & 1-of-1 Eser Kumaş Dönüşümü — afair.studio',
    desc: 'Galeride beğendiğiniz sanat eserinin Pantone TCX renk kodu ve dokusu, doğrudan iki mezura kalıbınıza özel 1 adet üretilir.',
    slots: ['Özel Galeri Turu · 3D/VR', 'Eser → Kumaş Eşleştirme', 'Higgsfield Sinema Önizleme'],
    note: 'Higgsfield Seedance + yerel 60 FPS WebGL 3D sahnesi canlı olarak /3d ve /dila-video adreslerinde çalışıyor.',
    link: ['/3d', '3D / VR Uzamsal Galeriye Gir ↗']
  },
  elektronik: {
    title: 'Teknoloji, Elektronik & Üst Halka — baskaistanbulyok.com',
    desc: 'Ataşehir Modern akıllı yaşam altyapısı, 37-site canlı erişim radarı ve 50.000 slotlu otonom üretim ekosistemi tek merkezden izlenir.',
    slots: ['37-Site Canlı Radar', '50.000 Slot Tek-Tetik', 'Akıllı Ev & Işık Kalibrasyonu'],
    note: 'Tüm sistem 0 harici CDN ve SHA-256 doğrulama ilkesiyle bağımsız çalışır.',
    link: ['/radar', '37-Site Canlı Radarı Aç ↗']
  }
};

function renderConcierge(key){
  const c = CONCIERGE[key];
  document.getElementById('cBody').innerHTML = `
    <div>
      <h3 class="serif fs-2">${c.title}</h3>
      <p class="fs-3">${c.desc}</p>
      <div class="slot-list">${c.slots.map((s,i)=>`<button class="slot-btn ${i===0?'on':''}">${s}</button>`).join('')}</div>
      <a class="btn" href="${c.link[0]}">${c.link[1]}</a>
    </div>
    <div class="note-box">
      <div class="kicker fs-4">Dürüst Durum &amp; Seçim Özeti</div>
      <p class="fs-5">${c.note}</p>
      <div id="selSlot" class="fs-6">Seçili Akış: ${c.slots[0]}</div>
    </div>`;
  document.querySelectorAll('.slot-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.slot-btn').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    document.getElementById('selSlot').textContent = 'Seçili Akış: ' + b.textContent;
  }));
}
document.getElementById('cTabs').addEventListener('click', e => {
  const b = e.target.closest('.ctab'); if(!b) return;
  document.querySelectorAll('.ctab').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  renderConcierge(b.dataset.t);
});
renderConcierge('terzi');
