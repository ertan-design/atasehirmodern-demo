(function () {
  "use strict";

  var CORRIDORS = [
    { id: "ifm", tower: "Flex Tower · 43 Kat", dest: "İFM / Finanskent (~2.8 km KD)", alt: 162, az: 52, sky: ["#071822", "#163b47"], accent: "#52d1a0", glow: "#e6b86a" },
    { id: "wg", tower: "Balance Tower · 35 Kat", dest: "Watergarden AVM (~2.4 km GB)", alt: 134, az: 224, sky: ["#0c1522", "#1f3250"], accent: "#6bc3f0", glow: "#f2c178" },
    { id: "sahil", tower: "Grand Tower · 25 Kat", dest: "Maltepe Sahili / Orhangazi (~10.8 km G)", alt: 102, az: 176, sky: ["#0a1820", "#17424a"], accent: "#52e0c4", glow: "#7cc7f2" },
    { id: "ust", tower: "Üst Halka · 3 Kule Birleşim", dest: "Başka İstanbul Yok · Boğaz–Adalar", alt: 215, az: 295, sky: ["#131024", "#2e2444"], accent: "#e6b86a", glow: "#9b87f5" }
  ];

  var active = CORRIDORS[0];
  var paused = false;
  var speed = 1.2;
  var sx = 0, sy = 0, tsx = 0, tsy = 0;
  var ringCount = 0;
  var keys = {};
  var rings = [];
  var blocks = [];

  function initWorld() {
    rings = [];
    for (var i = 0; i < 12; i++) {
      rings.push({ z: 2.0 + i * 2.1, x: Math.sin(i * 0.78) * 1.1, y: Math.cos(i * 0.62) * 0.4, r: 0.62 });
    }
    blocks = [];
    for (var j = 0; j < 44; j++) {
      var side = j % 2 === 0 ? -1 : 1;
      blocks.push({ x: side * (1.2 + ((j * 29) % 100) / 20), z: 0.9 + j * 0.55, w: 0.35 + ((j * 11) % 20) / 36, h: 0.8 + ((j * 37) % 100) / 32 });
    }
  }

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function renderCorridors() {
    var box = document.getElementById("corridor-list");
    clear(box);
    CORRIDORS.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cbtn" + (c.id === active.id ? " is-on" : "");
      var st = document.createElement("strong");
      st.textContent = c.tower;
      var sp = document.createElement("span");
      sp.textContent = c.dest;
      b.appendChild(st);
      b.appendChild(sp);
      b.addEventListener("click", function () {
        active = c;
        ringCount = 0;
        tsx = 0;
        tsy = 0;
        initWorld();
        renderCorridors();
        updateHud();
        drawRadar();
      });
      box.appendChild(b);
    });
  }

  function updateHud() {
    document.getElementById("hud-tower").textContent = active.tower;
    document.getElementById("hud-target").textContent = "Hedef: " + active.dest;
    document.getElementById("hud-alt").textContent = "İrtifa: " + Math.max(28, Math.round(active.alt + sy * 34)) + " m";
    document.getElementById("hud-rings").textContent = "Halka: " + ringCount;
  }

  function drawRadar() {
    var rc = document.getElementById("radar-canvas");
    var rctx = rc.getContext("2d");
    var W = rc.width, H = rc.height, cx = W / 2, cy = H / 2;
    rctx.fillStyle = "#071214";
    rctx.fillRect(0, 0, W, H);
    rctx.strokeStyle = "#1d3d42";
    [28, 54, 76].forEach(function (rad) {
      rctx.beginPath();
      rctx.arc(cx, cy, rad, 0, Math.PI * 2);
      rctx.stroke();
    });
    CORRIDORS.forEach(function (c) {
      var rad = (c.az - 90) * Math.PI / 180;
      var x2 = cx + Math.cos(rad) * 66;
      var y2 = cy + Math.sin(rad) * 66;
      rctx.strokeStyle = c.id === active.id ? c.accent : "#294d54";
      rctx.lineWidth = c.id === active.id ? 2.5 : 1;
      rctx.beginPath();
      rctx.moveTo(cx, cy);
      rctx.lineTo(x2, y2);
      rctx.stroke();
      rctx.fillStyle = c.id === active.id ? c.glow : "#5d8288";
      rctx.beginPath();
      rctx.arc(x2, y2, c.id === active.id ? 5 : 3, 0, Math.PI * 2);
      rctx.fill();
    });
    rctx.fillStyle = "#eef7f5";
    rctx.font = "10px ui-monospace, monospace";
    rctx.fillText("K (İFM)", cx - 18, 13);
    rctx.fillText("G (MALTEPE)", cx - 32, H - 6);
  }

  var canvas = document.getElementById("flight-canvas");
  var ctx = canvas.getContext("2d");
  var dragging = false;
  canvas.addEventListener("pointerdown", function () { dragging = true; });
  window.addEventListener("pointerup", function () { dragging = false; });
  canvas.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var r = canvas.getBoundingClientRect();
    tsx = ((e.clientX - r.left) / r.width - 0.5) * 2.4;
    tsy = (0.5 - (e.clientY - r.top) / r.height) * 1.4;
  });
  window.addEventListener("keydown", function (e) { keys[e.code] = true; });
  window.addEventListener("keyup", function (e) { keys[e.code] = false; });

  document.getElementById("btn-pause").addEventListener("click", function () {
    paused = !paused;
    var b = document.getElementById("btn-pause");
    b.classList.toggle("is-on", !paused);
    b.textContent = paused ? "Uçuşa Devam Et" : "Uçuşu Duraklat";
  });
  document.getElementById("btn-reset").addEventListener("click", function () {
    tsx = 0; tsy = 0; ringCount = 0; initWorld(); updateHud();
  });
  document.getElementById("spd-range").addEventListener("input", function (e) {
    speed = Number(e.target.value) / 10;
    document.getElementById("spd-val").textContent = speed.toFixed(1) + "x";
  });

  var last = 0;
  function tick(ts) {
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
    last = ts;
    if (keys.ArrowLeft || keys.KeyA) tsx = Math.max(-1.4, tsx - dt * 1.8);
    if (keys.ArrowRight || keys.KeyD) tsx = Math.min(1.4, tsx + dt * 1.8);
    if (keys.ArrowUp || keys.KeyW) tsy = Math.min(0.85, tsy + dt * 1.3);
    if (keys.ArrowDown || keys.KeyS) tsy = Math.max(-0.85, tsy - dt * 1.3);
    sx += (tsx - sx) * Math.min(1, dt * 5.5);
    sy += (tsy - sy) * Math.min(1, dt * 5.5);

    var W = canvas.width, H = canvas.height;
    var hor = H * 0.44 + sy * H * 0.14;
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, active.sky[0]);
    g.addColorStop(0.55, active.sky[1]);
    g.addColorStop(1, "#050d0f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Horizon glow & architectural grid
    ctx.strokeStyle = "rgba(82,209,160,0.16)";
    ctx.lineWidth = 1;
    for (var gx = -6; gx <= 6; gx++) {
      ctx.beginPath();
      ctx.moveTo(W * 0.5 - sx * 120 + gx * 34, hor);
      ctx.lineTo(W * 0.5 - sx * 360 + gx * 190, H);
      ctx.stroke();
    }

    // 3D projected city towers
    var fov = Math.min(W, H) * 0.68;
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (!paused) {
        b.z -= dt * speed * 2.2;
        if (b.z < 0.35) b.z += 24.0;
      }
      var sc = fov / b.z;
      var bx = W * 0.5 + (b.x - sx) * sc;
      var bw = b.w * sc;
      var bh = b.h * sc;
      var baseY = hor + (1.15 - sy * 0.4) * sc;
      var topY = baseY - bh;
      if (bx + bw < -40 || bx - bw > W + 40) continue;
      ctx.fillStyle = "rgba(15, 36, 42, 0.88)";
      ctx.strokeStyle = "rgba(82, 209, 160, 0.28)";
      ctx.fillRect(bx - bw * 0.5, topY, bw, bh);
      ctx.strokeRect(bx - bw * 0.5, topY, bw, bh);
    }

    // 3D guidance rings
    for (var r = 0; r < rings.length; r++) {
      var rg = rings[r];
      var prevZ = rg.z;
      if (!paused) {
        rg.z -= dt * speed * 2.2;
        if (prevZ >= 0.45 && rg.z < 0.45) {
          var dist = Math.hypot(rg.x - sx, rg.y - sy);
          if (dist < 0.92) {
            ringCount++;
            updateHud();
          }
        }
        if (rg.z < 0.3) rg.z += 25.2;
      }
      var rsc = fov / rg.z;
      var rx = W * 0.5 + (rg.x - sx) * rsc;
      var ry = hor - (rg.y - sy) * rsc * 0.75;
      var rad = rg.r * rsc;
      if (rad > 4 && rad < W) {
        ctx.strokeStyle = rg.z < 3.2 ? active.glow : active.accent;
        ctx.lineWidth = Math.max(1.5, Math.min(5, 8 / rg.z));
        ctx.beginPath();
        ctx.arc(rx, ry, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Center reticle
    ctx.strokeStyle = "rgba(230,184,106,0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(W * 0.5, H * 0.5, 14, 0, Math.PI * 2);
    ctx.stroke();

    updateHud();
    requestAnimationFrame(tick);
  }

  initWorld();
  renderCorridors();
  drawRadar();
  updateHud();
  requestAnimationFrame(tick);
})();
