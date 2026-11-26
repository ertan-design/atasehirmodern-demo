(() => {
  const img = document.getElementById('planSvg');
  let zoom = 1;
  document.querySelectorAll('[data-svg]').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-svg]').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      img.src = b.getAttribute('data-svg');
    });
  });
  document.getElementById('zIn').addEventListener('click', () => { zoom = Math.min(2.6, zoom + 0.25); img.style.transform = `scale(${zoom})`; });
  document.getElementById('zOut').addEventListener('click', () => { zoom = Math.max(0.6, zoom - 0.25); img.style.transform = `scale(${zoom})`; });
  document.getElementById('zRst').addEventListener('click', () => { zoom = 1; img.style.transform = 'scale(1)'; });
})();
