(() => {
  const cv = document.getElementById('loomCv');
  const ctx = cv.getContext('2d');
  const info = document.getElementById('loomInfo');
  const imgs = { dimi: new Image(), kot: new Image() };
  imgs.dimi.src = '/kumas-360/dimi.webp';
  imgs.kot.src = '/kumas-360/kot.jpg';
  let cur = 'dimi', angle = 24, zoom = 1.15, drag = false, lx = 0, ly = 0, tilt = 0;

  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth || 800, h = cv.clientHeight || 420;
    if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#101622';
    ctx.fillRect(0, 0, w, h);

    const im = imgs[cur];
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.scale(zoom, zoom * (1 - Math.abs(tilt) * 0.18));
    if (im.complete && im.naturalWidth > 0) {
      const sz = Math.max(w, h) * 0.9;
      ctx.drawImage(im, -sz * 0.5, -sz * 0.5, sz, sz);
    }
    // Specular raking light
    const grad = ctx.createLinearGradient(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5);
    grad.addColorStop(0, 'rgba(255,230,190,0.18)');
    grad.addColorStop(0.5, 'rgba(20,24,36,0.0)');
    grad.addColorStop(1, 'rgba(14,18,28,0.42)');
    ctx.fillStyle = grad;
    ctx.fillRect(-w, -h, w * 2, h * 2);
    ctx.restore();
    info.textContent = `Aktif Dokuma: ${cur === 'dimi' ? '2/1 Dimi Keten-Yün Karışımı' : 'Ham İndigo Kot Dokuma'} · Işık/Çözgü Açısı: ${((Math.round(angle)%360)+360)%360}° · Yakınlaştırma: ${zoom.toFixed(2)}x`;
  }

  imgs.dimi.onload = draw; imgs.kot.onload = draw;
  cv.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; });
  window.addEventListener('pointerup', () => { drag = false; });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    angle += (e.clientX - lx) * 0.45;
    tilt = Math.max(-1, Math.min(1, tilt + (e.clientY - ly) * 0.005));
    lx = e.clientX; ly = e.clientY;
    draw();
  });
  cv.addEventListener('wheel', e => { e.preventDefault(); zoom = Math.max(0.65, Math.min(2.8, zoom - e.deltaY * 0.0015)); draw(); }, { passive: false });
  document.querySelectorAll('[data-tex]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-tex]').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      cur = b.getAttribute('data-tex');
      draw();
    });
  });
  window.addEventListener('resize', draw);
  draw();
})();
