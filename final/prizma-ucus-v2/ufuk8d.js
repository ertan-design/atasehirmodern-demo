/* ufuk8d.js — v3.0 Real WebGL2 3D Architectural 3-Tower Skyline + Rippling Silk Wing + Direct 360° & Flight Steering */
(() => {
  'use strict';
  const TOWERS = [{"id": 0, "name": "Watergarden", "tower": "Kule 1 · 43. Kat", "to": "Watergarden AVM & Sanat", "rgb": [0.82, 0.56, 0.3], "tx": -1.65, "ty": -0.55, "tz": -1.35}, {"id": 1, "name": "Finanskent", "tower": "Kule 2 · 35. Kat", "to": "Finanskent Fırsat & Ses", "rgb": [0.38, 0.68, 0.82], "tx": 1.65, "ty": -0.45, "tz": -1.55}, {"id": 2, "name": "Maltepe Sahil", "tower": "Kule 3 · 25. Kat", "to": "Sahil Konser & Spor", "rgb": [0.36, 0.74, 0.62], "tx": -0.65, "ty": -0.62, "tz": 1.45}, {"id": 3, "name": "İstanbul", "tower": "Üst Halka · +420m", "to": "Başka İstanbul Yok", "rgb": [0.78, 0.46, 0.66], "tx": 0.15, "ty": 0.82, "tz": -1.75}];
  const st = {
    towerIdx: 0,
    progress: 0.08,
    yaw: 0.34,
    pitch: 0.24,
    velYaw: 0.0,
    velPitch: 0.0,
    zoom: 4.35,
    steerX: 0.0,
    steerY: 0.0,
    autoOrbit: true,
    audio8D: false,
    bookings: []
  };

  const qs = new URLSearchParams(location.search);
  if (qs.has('tower')) st.towerIdx = Math.max(0, Math.min(3, parseInt(qs.get('tower'), 10) || 0));
  if (qs.has('yaw')) { st.yaw = (parseFloat(qs.get('yaw')) || 0) * Math.PI / 180; st.autoOrbit = false; }

  const cv = document.getElementById('flightCanvas');
  const glOpts = { antialias: true, alpha: false, preserveDrawingBuffer: true };
  const gl = cv ? (cv.getContext('webgl2', glOpts) || cv.getContext('webgl', glOpts)) : null;
  const isGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;

  // Build solid 3D lit architectural geometry for 3 Ataşehir Modern Towers (43F, 35F, 25F) + pedestals
  function buildCityMesh() {
    const v = [], n = [], uv = [];
    function addBox(cx, y0, y1, cz, wx, wz, towerId) {
      const faces = [
        [[cx - wx, y0, cz + wz], [cx + wx, y0, cz + wz], [cx + wx, y1, cz + wz], [cx - wx, y1, cz + wz], [0, 0, 1]],
        [[cx + wx, y0, cz - wz], [cx - wx, y0, cz - wz], [cx - wx, y1, cz - wz], [cx + wx, y1, cz - wz], [0, 0, -1]],
        [[cx + wx, y0, cz + wz], [cx + wx, y0, cz - wz], [cx + wx, y1, cz - wz], [cx + wx, y1, cz + wz], [1, 0, 0]],
        [[cx - wx, y0, cz - wz], [cx - wx, y0, cz + wz], [cx - wx, y1, cz + wz], [cx - wx, y1, cz - wz], [-1, 0, 0]],
        [[cx - wx, y1, cz + wz], [cx + wx, y1, cz + wz], [cx + wx, y1, cz - wz], [cx - wx, y1, cz - wz], [0, 1, 0]]
      ];
      const h = y1 - y0;
      for (const [p0, p1, p2, p3, nm] of faces) {
        v.push(...p0, ...p1, ...p2, ...p0, ...p2, ...p3);
        for (let k = 0; k < 6; k++) n.push(...nm);
        uv.push(0, 0, 1, 0, 1, h * 9.0, 0, 0, 1, h * 9.0, 0, h * 9.0);
      }
    }
    // 3 Signature Towers (43F Arya, 35F Beste, 25F Opera) + Destination Pavilions
    addBox(-0.62, -1.05, 0.92, 0.12, 0.20, 0.18, 0);
    addBox(0.05, -1.05, 0.62, -0.18, 0.19, 0.18, 1);
    addBox(0.68, -1.05, 0.30, 0.22, 0.19, 0.18, 2);
    // Destination architectural beacons (Watergarden, Finanskent, Maltepe Sahil)
    addBox(-1.65, -1.05, -0.58, -1.35, 0.28, 0.24, 3);
    addBox(1.65, -1.05, -0.42, -1.55, 0.24, 0.24, 4);
    addBox(-0.65, -1.05, -0.72, 1.45, 0.32, 0.22, 5);
    return { pos: new Float32Array(v), nrm: new Float32Array(n), uv: new Float32Array(uv), count: v.length / 3 };
  }
  const city = buildCityMesh();

  // Dynamic 3D Woven Silk-Horizon Terrain & Flight Arc Lines
  function buildLines(t, route) {
    const L = [];
    for (let z = -2.4; z <= 2.4; z += 0.36) {
      for (let x = -2.4; x < 2.4; x += 0.24) {
        const y1 = -1.06 + Math.sin(x * 1.6 + t * 0.9) * 0.025 + Math.cos(z * 1.5 - t * 0.7) * 0.025;
        const nx = x + 0.24;
        const y2 = -1.06 + Math.sin(nx * 1.6 + t * 0.9) * 0.025 + Math.cos(z * 1.5 - t * 0.7) * 0.025;
        L.push(x, y1, z, nx, y2, z);
      }
    }
    return new Float32Array(L);
  }

  // Dynamic 24x16 3D Rippling Silk Wingsuit Canopy gliding along user-steered Bezier trajectory!
  const WN = 24, WM = 14;
  const wingPos = new Float32Array(WN * WM * 3);
  const wingNrm = new Float32Array(WN * WM * 3);
  const wingUv = new Float32Array(WN * WM * 2);
  const wingIdx = [];
  for (let j = 0; j < WM; j++) {
    for (let i = 0; i < WN; i++) {
      const k = j * WN + i;
      wingUv[k * 2] = i / (WN - 1);
      wingUv[k * 2 + 1] = j / (WM - 1);
      if (i + 1 < WN && j + 1 < WM) {
        const a = k, b = k + 1, c = k + WN, d = c + 1;
        wingIdx.push(a, c, b, b, c, d);
      }
    }
  }
  const wingIndices = new Uint16Array(wingIdx);

  function flightPoint(u) {
    const starts = [[-0.62, 0.96, 0.12], [0.05, 0.66, -0.18], [0.68, 0.34, 0.22], [0.05, 0.96, -0.10]];
    const p0 = starts[st.towerIdx];
    const rt = TOWERS[st.towerIdx];
    const p2 = [rt.tx, rt.ty, rt.tz];
    const p1 = [(p0[0] + p2[0]) * 0.5 + st.steerX, Math.max(p0[1], p2[1]) + 0.68 + st.steerY, (p0[2] + p2[2]) * 0.5];
    const om = 1 - u;
    return [
      om * om * p0[0] + 2 * om * u * p1[0] + u * u * p2[0],
      om * om * p0[1] + 2 * om * u * p1[1] + u * u * p2[1],
      om * om * p0[2] + 2 * om * u * p1[2] + u * u * p2[2]
    ];
  }

  function updateWingMesh(t) {
    const c0 = flightPoint(st.progress);
    const c1 = flightPoint(Math.min(1.0, st.progress + 0.04));
    let fx = c1[0] - c0[0], fy = c1[1] - c0[1], fz = c1[2] - c0[2];
    const fl = Math.hypot(fx, fy, fz) || 1; fx /= fl; fy /= fl; fz /= fl;
    let rx = -fz, rz = fx;
    const rl = Math.hypot(rx, rz) || 1; rx /= rl; rz /= rl;
    const bank = Math.max(-0.65, Math.min(0.65, -st.steerX * 0.55));

    for (let j = 0; j < WM; j++) {
      const v = j / (WM - 1);
      for (let i = 0; i < WN; i++) {
        const u = i / (WN - 1) - 0.5;
        const k = (j * WN + i) * 3;
        const span = (1.15 - v * 0.42) * u * 1.45;
        const chord = -v * 0.92 - Math.abs(u) * 0.34;
        const ripple = Math.sin(u * 9.0 + t * 5.2 - v * 4.0) * (0.04 + 0.07 * v) + Math.cos(v * 5.0 - t * 4.0) * 0.03;
        const arch = -u * u * 0.32 + ripple;
        const bx = span * Math.cos(bank);
        const by = arch + span * Math.sin(bank);
        wingPos[k] = c0[0] + rx * bx + fx * chord;
        wingPos[k + 1] = c0[1] + by + fy * chord;
        wingPos[k + 2] = c0[2] + rz * bx + fz * chord;
      }
    }
    wingNrm.fill(0);
    for (let q = 0; q < wingIndices.length; q += 3) {
      const a = wingIndices[q] * 3, b = wingIndices[q + 1] * 3, c = wingIndices[q + 2] * 3;
      const ux = wingPos[b] - wingPos[a], uy = wingPos[b + 1] - wingPos[a + 1], uz = wingPos[b + 2] - wingPos[a + 2];
      const vx = wingPos[c] - wingPos[a], vy = wingPos[c + 1] - wingPos[a + 1], vz = wingPos[c + 2] - wingPos[a + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      wingNrm[a] += nx; wingNrm[a + 1] += ny; wingNrm[a + 2] += nz;
      wingNrm[b] += nx; wingNrm[b + 1] += ny; wingNrm[b + 2] += nz;
      wingNrm[c] += nx; wingNrm[c + 1] += ny; wingNrm[c + 2] += nz;
    }
  }

  let prog = null, cityPosB, cityNrmB, cityUvB, wingPosB, wingNrmB, wingUvB, wingIdxB, lineB, uLoc = {}, aLoc = {};
  if (gl) {
    const vs = `
      attribute vec3 aPos;
      attribute vec3 aNrm;
      attribute vec2 aUv;
      uniform mat4 uProj;
      uniform mat4 uView;
      varying vec3 vPos;
      varying vec3 vNrm;
      varying vec2 vUv;
      void main() {
        vPos = aPos;
        vNrm = aNrm;
        vUv = aUv;
        gl_Position = uProj * uView * vec4(aPos, 1.0);
      }`;
    const fs = `
      precision highp float;
      varying vec3 vPos;
      varying vec3 vNrm;
      varying vec2 vUv;
      uniform int uMode;
      uniform vec3 uCam;
      uniform vec3 uAccent;
      uniform float uTime;
      void main() {
        if (uMode == 2) {
          gl_FragColor = vec4(uAccent, 0.36);
          return;
        }
        if (uMode == 3) {
          gl_FragColor = vec4(0.95, 0.85, 0.65, 0.88);
          return;
        }
        vec3 N = normalize(vNrm);
        if (!gl_FrontFacing) N = -N;
        vec3 L = normalize(vec3(1.4, 2.2, 1.6));
        vec3 V = normalize(uCam - vPos);
        float diff = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);
        if (uMode == 0) {
          // Architectural Quiet-Luxury Towers with warm champagne lit apartment windows
          float winX = step(0.32, fract(vUv.x * 5.0));
          float winY = step(0.38, fract(vUv.y));
          float litWin = winX * winY * step(0.2, N.x * N.x + N.z * N.z);
          vec3 base = vec3(0.11, 0.12, 0.17) * (0.45 + 0.75 * diff);
          vec3 glow = mix(vec3(0.86, 0.71, 0.48), uAccent, 0.35) * litWin * 0.58;
          vec3 col = max(base + glow, vec3(0.058, 0.064, 0.088));
          gl_FragColor = vec4(col, 1.0);
          return;
        }
        // Mode 1: Rippling 8D Silk Wingsuit Canopy
        vec3 H = normalize(L + V);
        float spec = pow(max(dot(N, H), 0.0), 22.0) * 0.85;
        float rim = pow(1.0 - max(dot(N, V), 0.0), 2.4);
        vec3 silk = uAccent * (0.30 + 0.95 * diff) + vec3(0.98, 0.90, 0.74) * (spec + rim * 0.48);
        gl_FragColor = vec4(max(silk, vec3(0.06, 0.065, 0.09)), 1.0);
      }`;

    function comp(tp, src) {
      const s = gl.createShader(tp); gl.shaderSource(s, src); gl.compileShader(s); return s;
    }
    prog = gl.createProgram();
    gl.attachShader(prog, comp(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, comp(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    cityPosB = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cityPosB); gl.bufferData(gl.ARRAY_BUFFER, city.pos, gl.STATIC_DRAW);
    cityNrmB = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cityNrmB); gl.bufferData(gl.ARRAY_BUFFER, city.nrm, gl.STATIC_DRAW);
    cityUvB = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cityUvB); gl.bufferData(gl.ARRAY_BUFFER, city.uv, gl.STATIC_DRAW);

    wingPosB = gl.createBuffer();
    wingNrmB = gl.createBuffer();
    wingUvB = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, wingUvB); gl.bufferData(gl.ARRAY_BUFFER, wingUv, gl.STATIC_DRAW);
    wingIdxB = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wingIdxB); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, wingIndices, gl.STATIC_DRAW);
    lineB = gl.createBuffer();

    aLoc.pos = gl.getAttribLocation(prog, 'aPos');
    aLoc.nrm = gl.getAttribLocation(prog, 'aNrm');
    aLoc.uv = gl.getAttribLocation(prog, 'aUv');
    ['uProj', 'uView', 'uMode', 'uCam', 'uAccent', 'uTime'].forEach(k => { uLoc[k] = gl.getUniformLocation(prog, k); });
  }

  function perspective(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }
  function lookAt(ex, ey, ez) {
    let zx = ex, zy = ey + 0.15, zz = ez;
    let zl = Math.hypot(zx, zy, zz) || 1; zx /= zl; zy /= zl; zz /= zl;
    let xx = zz, xy = 0, xz = -zx;
    let xl = Math.hypot(xx, xy, xz) || 1; xx /= xl; xz /= xl;
    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    return new Float32Array([
      xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
      -(xx * ex + xy * ey + xz * ez), -(yx * ex + yy * ey + yz * ez), -(zx * ex + zy * ey + zz * ez), 1
    ]);
  }

  // --- ZERO-TOGGLE DIRECT FLIGHT & 360° SKYLINE STEERING ---
  let down = false, lx = 0, ly = 0;
  if (cv) {
    cv.addEventListener('pointerdown', e => {
      down = true; st.autoOrbit = false; lx = e.clientX; ly = e.clientY;
      if (cv.setPointerCapture) { try { cv.setPointerCapture(e.pointerId); } catch (_) {} }
    });
    cv.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      const dYaw = -dx * 0.0195;
      const dPitch = dy * 0.0105;
      st.yaw += dYaw;
      st.pitch = Math.max(-0.25, Math.min(1.15, st.pitch + dPitch));
      st.velYaw = dYaw * 0.84;
      st.steerX = Math.max(-1.35, Math.min(1.35, st.steerX + dx * 0.009));
      st.steerY = Math.max(-0.65, Math.min(0.85, st.steerY - dy * 0.007));
      syncUI();
    });
    window.addEventListener('pointerup', () => { down = false; });
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      st.zoom = Math.max(2.4, Math.min(6.8, st.zoom + e.deltaY * 0.0028));
    }, { passive: false });
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') { st.autoOrbit = false; st.steerX = Math.max(-1.35, st.steerX - 0.16); st.velYaw = -0.04; }
    if (e.key === 'ArrowRight' || e.key === 'd') { st.autoOrbit = false; st.steerX = Math.min(1.35, st.steerX + 0.16); st.velYaw = 0.04; }
    if (e.key === 'ArrowUp' || e.key === 'w') st.steerY = Math.min(0.85, st.steerY + 0.14);
    if (e.key === 'ArrowDown' || e.key === 's') st.steerY = Math.max(-0.65, st.steerY - 0.14);
  });

  function selectTower(idx) {
    st.towerIdx = Math.max(0, Math.min(3, Number(idx) || 0));
    st.progress = 0.04;
    st.steerX = 0; st.steerY = 0;
    syncUI();
  }

  function syncUI() {
    document.querySelectorAll('[data-tower]').forEach((b, i) => b.classList.toggle('on', i === st.towerIdx));
    const sub = document.getElementById('routeSub');
    if (sub) sub.textContent = `${TOWERS[st.towerIdx].tower} → ${TOWERS[st.towerIdx].to} · Sürükleyerek yönlendir.`;
    const el = document.getElementById('afair-gpt-state');
    if (el) el.textContent = JSON.stringify({ webgl2: isGL2, activeRoute: TOWERS[st.towerIdx], progress: Number(st.progress.toFixed(3)), yawDeg: Math.round(((st.yaw * 180 / Math.PI) % 360 + 360) % 360), bookings: st.bookings });
  }

  document.querySelectorAll('[data-tower]').forEach(b => {
    b.addEventListener('click', () => selectTower(parseInt(b.dataset.tower, 10)));
  });
  document.querySelectorAll('[data-book]').forEach(btn => {
    btn.addEventListener('click', () => {
      const svc = btn.dataset.book;
      const code = 'ATA-' + Math.abs((Date.now() % 89999) + 10000);
      st.bookings.push({ service: svc, route: TOWERS[st.towerIdx].name, code });
      const out = document.getElementById('msg-' + svc);
      if (out) out.textContent = `✓ Hazır (${code})`;
      syncUI();
    });
  });

  let tClock = 0;
  function render() {
    tClock += 0.020;
    st.progress += 0.0026;
    if (st.progress > 0.98) st.progress = 0.04;
    if (!down) {
      st.steerX *= 0.985;
      st.steerY *= 0.985;
      if (st.autoOrbit) st.yaw += 0.0009;
      else { st.yaw += st.velYaw; st.velYaw *= 0.92; }
    }

    if (cv && gl && prog) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(cv.clientWidth * dpr));
      const h = Math.max(1, Math.floor(cv.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }

      updateWingMesh(tClock);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0.055, 0.063, 0.088, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      const ex = Math.sin(st.yaw) * Math.cos(st.pitch) * st.zoom;
      const ey = Math.sin(st.pitch) * st.zoom + 0.25;
      const ez = Math.cos(st.yaw) * Math.cos(st.pitch) * st.zoom;
      const rt = TOWERS[st.towerIdx];

      gl.useProgram(prog);
      gl.uniformMatrix4fv(uLoc.uProj, false, perspective(0.76, w / h, 0.1, 35.0));
      gl.uniformMatrix4fv(uLoc.uView, false, lookAt(ex, ey, ez));
      gl.uniform3f(uLoc.uCam, ex, ey, ez);
      gl.uniform3f(uLoc.uAccent, rt.rgb[0], rt.rgb[1], rt.rgb[2]);
      gl.uniform1f(uLoc.uTime, tClock);

      // 1) Woven 3D Silk-Horizon Contours (Zero Google Maps)
      const terrainLines = buildLines(tClock, rt);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineB);
      gl.bufferData(gl.ARRAY_BUFFER, terrainLines, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aLoc.pos);
      gl.vertexAttribPointer(aLoc.pos, 3, gl.FLOAT, false, 0, 0);
      gl.disableVertexAttribArray(aLoc.nrm);
      gl.disableVertexAttribArray(aLoc.uv);
      gl.uniform1i(uLoc.uMode, 2);
      gl.drawArrays(gl.LINES, 0, terrainLines.length / 3);

      // Flight trajectory arc + 3 golden rings
      const arc = [];
      for (let s = 0; s < 36; s++) {
        arc.push(...flightPoint(s / 36), ...flightPoint((s + 1) / 36));
      }
      for (const ru of [0.28, 0.56, 0.82]) {
        const c = flightPoint(ru);
        for (let g = 0; g < 24; g++) {
          const a1 = (g / 24) * Math.PI * 2, a2 = ((g + 1) / 24) * Math.PI * 2;
          arc.push(c[0] + Math.cos(a1) * 0.22, c[1] + Math.sin(a1) * 0.22, c[2]);
          arc.push(c[0] + Math.cos(a2) * 0.22, c[1] + Math.sin(a2) * 0.22, c[2]);
        }
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arc), gl.DYNAMIC_DRAW);
      gl.uniform1i(uLoc.uMode, 3);
      gl.drawArrays(gl.LINES, 0, arc.length / 3);
      gl.disable(gl.BLEND);

      // 2) 3 Lit Architectural Towers of Ataşehir Modern
      gl.bindBuffer(gl.ARRAY_BUFFER, cityPosB);
      gl.vertexAttribPointer(aLoc.pos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, cityNrmB);
      gl.enableVertexAttribArray(aLoc.nrm);
      gl.vertexAttribPointer(aLoc.nrm, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, cityUvB);
      gl.enableVertexAttribArray(aLoc.uv);
      gl.vertexAttribPointer(aLoc.uv, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1i(uLoc.uMode, 0);
      gl.drawArrays(gl.TRIANGLES, 0, city.count);

      // 3) Rippling 3D Silk Wingsuit Canopy
      gl.bindBuffer(gl.ARRAY_BUFFER, wingPosB);
      gl.bufferData(gl.ARRAY_BUFFER, wingPos, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(aLoc.pos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, wingNrmB);
      gl.bufferData(gl.ARRAY_BUFFER, wingNrm, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(aLoc.nrm, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, wingUvB);
      gl.vertexAttribPointer(aLoc.uv, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wingIdxB);
      gl.uniform1i(uLoc.uMode, 1);
      gl.drawElements(gl.TRIANGLES, wingIndices.length, gl.UNSIGNED_SHORT, 0);
    }
    requestAnimationFrame(render);
  }

  const api = {
    version: '3.0',
    purpose: () => ({
      brand: 'AFFFAIR × Başka İstanbul Yok',
      whyBuilt: 'Zero-Google-Maps WebGL2 3D steerable flight from Ataşehir Modern 3 towers to Watergarden, Finanskent, Maltepe Sahil & Istanbul',
      manifestUrl: './gpt.json',
      ryteLiveUrl: './ryte-canli.json',
      pendingTasks: 0
    }),
    getState: () => ({ webgl2: isGL2, activeRoute: TOWERS[st.towerIdx], progress: Number(st.progress.toFixed(3)), yawDeg: Math.round(((st.yaw * 180 / Math.PI) % 360 + 360) % 360), bookings: st.bookings }),
    selectTower: (idx) => { selectTower(idx); return api.getState(); },
    steerFlight: (dx = 0, dy = 0, progress = null) => {
      st.autoOrbit = false;
      st.steerX = Math.max(-1.35, Math.min(1.35, Number(dx) || 0));
      st.steerY = Math.max(-0.65, Math.min(0.85, Number(dy) || 0));
      if (progress !== null) st.progress = Math.max(0.02, Math.min(0.98, Number(progress)));
      syncUI();
      return api.getState();
    },
    setOrbit360: (yawDeg) => { st.autoOrbit = false; st.yaw = (Number(yawDeg) || 0) * Math.PI / 180; syncUI(); return api.getState(); },
    book: (service = 'tailor') => {
      const code = 'ATA-GPT-' + Math.abs((Date.now() % 89999) + 10000);
      st.bookings.push({ service, code });
      syncUI();
      return { ok: true, code, service };
    },
    durumOku: () => api.getState(),
    ucusYonlendir: (idx) => api.selectTower(idx),
    aciAyarla360: (d) => api.setOrbit360(d),
    ryteCanliOku: () => fetch('./ryte-canli.json', { cache: 'no-store' }).then(r => r.json())
  };
  window.AFAIR_GPT_API = api;
  window.AFAIR_STUDIO_API = api;

  if (typeof navigator !== 'undefined' && navigator.modelContext && typeof navigator.modelContext.registerTool === 'function') {
    try {
      navigator.modelContext.registerTool({
        name: 'afair_control_8d_stage',
        description: 'Atasehir 3-Kule WebGL2 ucus yonunu ve 360° bakis acisini kontrol eder.',
        inputSchema: {
          type: 'object',
          properties: {
            flightTarget: { type: 'integer', minimum: 0, maximum: 3 },
            angleDeg: { type: 'number', minimum: 0, maximum: 360 }
          }
        },
        execute: async (args) => {
          if (args && typeof args.flightTarget === 'number') api.selectTower(args.flightTarget);
          if (args && typeof args.angleDeg === 'number') api.setOrbit360(args.angleDeg);
          return api.getState();
        }
      });
    } catch (_) {}
  }

  syncUI();
  requestAnimationFrame(render);
})();
