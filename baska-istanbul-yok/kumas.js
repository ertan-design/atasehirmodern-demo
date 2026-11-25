// Ruzgarda dalgalanan 3B kumas: Verlet fizigi (CPU) + WebGL2 dokuma golgelendirici.
// Kullanici yonetir: surukle = 360 derece dondur, imlec = ruzgar yonu, dugmeler = ruzgar gucu ve iplik.
const SX = 40, SY = 28, GEN = 1.6, BOY = 1.15;  // dugum sayisi ve kumas olcusu (birim)

const VS = `#version 300 es
in vec3 p; in vec3 n; in vec2 uv;
uniform mat4 mvp;
out vec3 vN; out vec2 vUv; out vec3 vP;
void main(){ vN = n; vUv = uv; vP = p; gl_Position = mvp * vec4(p, 1.0); }`;

const FS = `#version 300 es
precision highp float;
in vec3 vN; in vec2 vUv; in vec3 vP;
uniform vec3 koyu, acik, goz; uniform float tel;
out vec4 o;
float h(vec2 q){ return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec3 N = normalize(gl_FrontFacing ? vN : -vN);
  vec2 q = vUv * tel;
  vec2 c = floor(q), f = fract(q);
  float ust = step(2.0, mod(c.x - c.y, 4.0));                 // dimi 2/2
  float d = ust > 0.5 ? abs(f.x - 0.5) * 2.0 : abs(f.y - 0.5) * 2.0;
  float sil = sqrt(max(0.0, 1.0 - d * d));                    // iplik silindiri
  float lif = h(ust > 0.5 ? vec2(c.x, floor(q.y * 6.0)) : vec2(floor(q.x * 6.0), c.y)) * 0.18;
  vec3 taban = mix(koyu, acik, 0.35 + 0.45 * sil + lif);
  taban *= 1.0 - smoothstep(0.9, 1.0, d) * 0.5;             // tel araligi golgesi
  vec3 V = normalize(goz - vP);
  vec3 L = normalize(vec3(-0.85, 0.55, 0.35));                // tek sicak yan isik (los): kivrimlar golge verir
  float dif = max(dot(N, L), 0.0);
  float rim = pow(1.0 - abs(dot(N, V)), 3.0);                 // kenar parlamasi
  vec3 Hh = normalize(L + V);
  float ipek = pow(max(dot(N, Hh), 0.0), 40.0) * (0.35 + 0.65 * sil); // ipek parlakligi iplik yonunde
  vec3 renk = taban * (0.16 + 1.5 * dif * dif) + vec3(1.0, 0.86, 0.66) * ipek * 0.55 + acik * rim * 0.35;
  renk = pow(renk, vec3(0.9));
  o = vec4(renk, 1.0);
}`;

function mat(){ return new Float32Array(16); }
function persp(f, a, n, u){ const m = mat(), t = 1 / Math.tan(f / 2); m[0] = t / a; m[5] = t; m[10] = (u + n) / (n - u); m[11] = -1; m[14] = 2 * u * n / (n - u); return m; }
function bak(e, h, y){
  const z = norm([e[0] - h[0], e[1] - h[1], e[2] - h[2]]), x = norm(cap(y, z)), yy = cap(z, x), m = mat();
  m.set([x[0], yy[0], z[0], 0, x[1], yy[1], z[1], 0, x[2], yy[2], z[2], 0, -dot(x, e), -dot(yy, e), -dot(z, e), 1]); return m;
}
function carp(a, b){ const m = mat(); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; m[i * 4 + j] = s; } return m; }
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cap = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

export function kumasKur({ tuval, bilgi, iplikler, hareketAcik, dinle }) {
  const gl = tuval.getContext("webgl2", { antialias: true, alpha: true });
  if (!gl) { bilgi.textContent = "Bu tarayıcıda WebGL2 yok; kumaş durağan gösteriliyor."; return null; }
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const U = n => gl.getUniformLocation(pr, n);

  // dugumler
  const N = SX * SY, P = new Float32Array(N * 3), O = new Float32Array(N * 3), NO = new Float32Array(N * 3), UV = new Float32Array(N * 2);
  for (let j = 0; j < SY; j++) for (let i = 0; i < SX; i++) {
    const k = j * SX + i, x = (i / (SX - 1) - 0.5) * GEN, y = 0.62 - (j / (SY - 1)) * BOY;
    P.set([x, y, 0], k * 3); O.set([x, y, 0], k * 3); UV.set([i / (SX - 1), j / (SY - 1)], k * 2);
  }
  const bag = [];  // [a, b, dinlenme boyu]
  const ekle = (a, b) => bag.push([a, b, Math.hypot(P[a * 3] - P[b * 3], P[a * 3 + 1] - P[b * 3 + 1])]);
  for (let j = 0; j < SY; j++) for (let i = 0; i < SX; i++) {
    const k = j * SX + i;
    if (i < SX - 1) ekle(k, k + 1); if (j < SY - 1) ekle(k, k + SX);
    if (i < SX - 1 && j < SY - 1) { ekle(k, k + SX + 1); ekle(k + 1, k + SX); }   // makaslama
    if (j < SY - 2 && i % 2 === 0) ekle(k, k + 2 * SX);  // yalniz dikeyde hafif bukulme direnci: kumas yatayda kivrilir
  }
  const idx = []; for (let j = 0; j < SY - 1; j++) for (let i = 0; i < SX - 1; i++) { const k = j * SX + i; idx.push(k, k + 1, k + SX, k + 1, k + SX + 1, k + SX); }
  const buf = (veri, ad, boyut) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, veri, gl.DYNAMIC_DRAW); const l = gl.getAttribLocation(pr, ad); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, boyut, gl.FLOAT, false, 0, 0); return b; };
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const bP = buf(P, "p", 3), bN = buf(NO, "n", 3); buf(UV, "uv", 2);
  const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST);

  // kullanici durumu
  let yaw = 0.55, pitch = 0.1, uzak = 2.4, ruzgarGuc = 1, ruzgarYon = [0.25, 0, 1], surukle = null, bosta = 0, t = 0;
  const iplikSec = k => { gl.uniform3fv(U("koyu"), iplikler[k].koyu.map(v => v / 255)); gl.uniform3fv(U("acik"), iplikler[k].acik.map(v => v / 255)); };
  gl.uniform1f(U("tel"), 90);

  tuval.addEventListener("pointerdown", e => { surukle = [e.clientX, e.clientY, yaw, pitch]; tuval.setPointerCapture(e.pointerId); });
  tuval.addEventListener("pointermove", e => {
    const r = tuval.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1;
    if (surukle) { yaw = surukle[2] + (e.clientX - surukle[0]) * 0.008; pitch = Math.max(-0.7, Math.min(0.9, surukle[3] + (e.clientY - surukle[1]) * 0.006)); bosta = 0; }
    else ruzgarYon = [nx * 1.2, -ny * 0.3, 1];   // imlec ruzgari yonlendirir
  });
  const birak = () => { surukle = null; };
  tuval.addEventListener("pointerup", birak); tuval.addEventListener("pointercancel", birak);
  tuval.addEventListener("wheel", e => { e.preventDefault(); uzak = Math.max(1.6, Math.min(4.5, uzak + e.deltaY * 0.0015)); }, { passive: false });
  tuval.addEventListener("keydown", e => {
    const d = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] }[e.key];
    if (d) { e.preventDefault(); yaw += d[0]; pitch = Math.max(-0.7, Math.min(0.9, pitch + d[1])); bosta = 0; if (!hareketAcik()) kare(); }
  });

  function fizik(dt) {
    const g = -2.2, s = ruzgarGuc;
    for (let k = SX; k < N; k++) {  // ust sira cubuga sabit
      const i = k * 3, x = P[i], y = P[i + 1], z = P[i + 2];
      const dal = Math.sin(t * 1.7 + x * 3.1 + y * 2.3) * 0.5 + Math.sin(t * 3.3 - y * 4.0 + x * 1.5) * 0.3 + Math.sin(t * 5.1 + x * 9.0 - y * 6.0) * 0.2;  // uzun + kisa ruzgar dalgasi
      const fx = ruzgarYon[0] * s * 0.9 * (0.5 + 0.5 * dal), fz = ruzgarYon[2] * s * 2.4 * dal, fy = g + ruzgarYon[1] * s * 0.4;
      const vx = (x - O[i]) * 0.985, vy = (y - O[i + 1]) * 0.985, vz = (z - O[i + 2]) * 0.985;
      O[i] = x; O[i + 1] = y; O[i + 2] = z;
      P[i] = x + vx + fx * dt * dt; P[i + 1] = y + vy + fy * dt * dt; P[i + 2] = z + vz + fz * dt * dt;
    }
    for (let it = 0; it < 6; it++) for (const [a, b, l] of bag) {
      const ia = a * 3, ib2 = b * 3, dx = P[ib2] - P[ia], dy = P[ib2 + 1] - P[ia + 1], dz = P[ib2 + 2] - P[ia + 2];
      const d = Math.hypot(dx, dy, dz) || 1e-6, f = (d - l) / d * 0.5, sa = a < SX ? 0 : 1, sb = b < SX ? 0 : 1, top = sa + sb || 1;
      P[ia] += dx * f * sa * 2 / top; P[ia + 1] += dy * f * sa * 2 / top; P[ia + 2] += dz * f * sa * 2 / top;
      P[ib2] -= dx * f * sb * 2 / top; P[ib2 + 1] -= dy * f * sb * 2 / top; P[ib2 + 2] -= dz * f * sb * 2 / top;
    }
  }
  function normaller() {
    NO.fill(0);
    for (let q = 0; q < idx.length; q += 3) {
      const a = idx[q] * 3, b = idx[q + 1] * 3, c = idx[q + 2] * 3;
      const n = cap([P[b] - P[a], P[b + 1] - P[a + 1], P[b + 2] - P[a + 2]], [P[c] - P[a], P[c + 1] - P[a + 1], P[c + 2] - P[a + 2]]);
      for (const v of [a, b, c]) { NO[v] += n[0]; NO[v + 1] += n[1]; NO[v + 2] += n[2]; }
    }
  }
  function ciz() {
    const k = Math.min(devicePixelRatio || 1, 2), w = Math.round(tuval.clientWidth * k), h = Math.round(tuval.clientHeight * k);
    if (tuval.width !== w || tuval.height !== h) { tuval.width = w; tuval.height = h; }
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    normaller();
    gl.bindBuffer(gl.ARRAY_BUFFER, bP); gl.bufferSubData(gl.ARRAY_BUFFER, 0, P);
    gl.bindBuffer(gl.ARRAY_BUFFER, bN); gl.bufferSubData(gl.ARRAY_BUFFER, 0, NO);
    const u = uzak * (w / h < 1 ? 1.7 : 1);  // dar ekranda kumasin tamami gorunsun
    const goz = [Math.sin(yaw) * Math.cos(pitch) * u, Math.sin(pitch) * u + 0.05, Math.cos(yaw) * Math.cos(pitch) * u];
    gl.uniformMatrix4fv(U("mvp"), false, carp(persp(0.75, w / h, 0.1, 20), bak(goz, [0, -0.22, 0], [0, 1, 0])));
    gl.uniform3fv(U("goz"), goz);
    gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
  }
  let dongu = 0, son = performance.now(), gorunur = true;
  function kare() {
    const simdi = performance.now(), dt = Math.min(0.033, (simdi - son) / 1000); son = simdi;
    if (hareketAcik()) {
      t += dt; bosta += dt;
      if (!surukle && bosta > 4) yaw += dt * 0.12;   // kullanici dokunmazsa yavasca doner
      fizik(dt); fizik(dt);
    }
    ciz();
    if (hareketAcik() && gorunur) dongu = requestAnimationFrame(kare);
  }
  // hareket kapaliyken: ruzgarsiz duz asili kumas, 60 adim on hesap (durgun drape)
  for (let i = 0; i < 60; i++) { const s = ruzgarGuc; ruzgarGuc = 0.25; fizik(0.016); ruzgarGuc = s; }
  const yeniden = () => { cancelAnimationFrame(dongu); son = performance.now(); kare(); };
  new IntersectionObserver(([e]) => { gorunur = e.isIntersecting; if (gorunur) yeniden(); }).observe(tuval);
  new ResizeObserver(() => { if (!hareketAcik()) ciz(); }).observe(tuval);
  dinle.add(yeniden);
  iplikSec(Object.keys(iplikler)[0]); yeniden();
  return {
    ruzgar(g) { ruzgarGuc = g; if (!hareketAcik()) yeniden(); },
    iplik(k) { iplikSec(k); if (!hareketAcik()) ciz(); },
    // olcum: n adim fizigi zorla kosar, kumasin derinlik (z) yayilimini ve alt kenar sarkmasini dondurur
    olc(n = 120) {
      for (let i = 0; i < n; i++) { t += 0.016; fizik(0.016); }
      let zmin = 1e9, zmax = -1e9, yAlt = 0;
      for (let k = 0; k < N; k++) { zmin = Math.min(zmin, P[k * 3 + 2]); zmax = Math.max(zmax, P[k * 3 + 2]); }
      for (let i = 0; i < SX; i++) yAlt += P[((SY - 1) * SX + i) * 3 + 1] / SX;
      ciz();
      return { adim: n, z_yayilim: +(zmax - zmin).toFixed(3), alt_kenar_y: +yAlt.toFixed(3), ruzgar: ruzgarGuc };
    },
  };
}
