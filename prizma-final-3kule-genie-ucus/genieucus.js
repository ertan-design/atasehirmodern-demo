(function () {
  "use strict";

  var ROUTES = [
    { id: "ifm", tower: "Flex Tower · 43 Kat", dest: "İFM / Finanskent (~2.8 km KD)", alt: 162, c1: "#071822", c2: "#163d4a", acc: "#54d6a4" },
    { id: "wg", tower: "Balance Tower · 35 Kat", dest: "Watergarden AVM (~2.4 km GB)", alt: 134, c1: "#0c1626", c2: "#213657", acc: "#6dc4f2" },
    { id: "sahil", tower: "Grand Tower · 25 Kat", dest: "Maltepe Sahili / Konser (~10.8 km G)", alt: 102, c1: "#091b22", c2: "#1a4850", acc: "#52e4c7" },
    { id: "ist", tower: "Üst Halka · 3 Kule", dest: "Başka İstanbul Yok · Boğaz–Adalar", alt: 215, c1: "#141026", c2: "#31264a", acc: "#e8bc6c" }
  ];

  var active = ROUTES[0], viewMode = "3d", speed = 1.2;
  var sx = 0, sy = 0, tsx = 0, tsy = 0, ringScore = 0, keys = {}, rings = [], towers = [];
  var windOn = false, actx = null, wGain = null, wFilter = null;

  function initWorld() {
    rings = [];
    for (var i = 0; i < 12; i++) rings.push({ z: 2.0 + i * 2.1, x: Math.sin(i * 0.72) * 1.1, y: Math.cos(i * 0.56) * 0.42, r: 0.62 });
    towers = [];
    for (var j = 0; j < 42; j++) {
      var side = j % 2 === 0 ? -1 : 1;
      towers.push({ x: side * (1.2 + ((j * 31) % 100) / 19), z: 0.8 + j * 0.56, w: 0.34 + ((j * 13) % 22) / 36, h: 0.8 + ((j * 29) % 100) / 32 });
    }
  }

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function renderRoutes() {
    var box = document.getElementById("route-btns");
    clear(box);
    ROUTES.forEach(function (r) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "rbtn" + (r.id === active.id ? " is-on" : "");
      var st = document.createElement("strong"); st.textContent = r.tower;
      var sp = document.createElement("span"); sp.textContent = r.dest;
      b.appendChild(st); b.appendChild(sp);
      b.addEventListener("click", function () {
        active = r; ringScore = 0; tsx = 0; tsy = 0; initWorld(); renderRoutes(); updateHud();
      });
      box.appendChild(b);
    });
  }

  function updateHud() {
    document.getElementById("h-tower").textContent = active.tower;
    document.getElementById("h-dest").textContent = "Hedef: " + active.dest;
    document.getElementById("h-alt").textContent = "İrtifa: " + Math.max(24, Math.round(active.alt + sy * 34)) + " m";
    document.getElementById("h-ring").textContent = "Halka: " + ringScore;
  }

  function switchView(m) {
    viewMode = m;
    var cv = document.getElementById("wing-cv");
    var vid = document.getElementById("genie-vid");
    var img = document.getElementById("aerial-img");
    cv.classList.toggle("is-hidden", m !== "3d");
    vid.classList.toggle("is-hidden", m !== "genie");
    img.classList.toggle("is-hidden", m !== "plate");
    document.getElementById("m-3d").classList.toggle("is-on", m === "3d");
    document.getElementById("m-genie").classList.toggle("is-on", m === "genie");
    document.getElementById("m-plate").classList.toggle("is-on", m === "plate");
    if (m === "genie") {
      if (!vid.getAttribute("src")) vid.setAttribute("src", "./genie_ucus_referans.mp4");
      vid.play().catch(function () {});
    } else {
      vid.pause();
    }
  }

  function toggleWindAudio() {
    var btn = document.getElementById("m-wind");
    if (!windOn) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!actx) {
        actx = new Ctx();
        var buf = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate);
        var d = buf.getChannelData(0), lp = 0;
        for (var i = 0; i < d.length; i++) { lp = lp * 0.94 + (Math.random() * 2 - 1) * 0.06; d[i] = lp; }
        var src = actx.createBufferSource(); src.buffer = buf; src.loop = true;
        wFilter = actx.createBiquadFilter(); wFilter.type = "bandpass"; wFilter.frequency.value = 380; wFilter.Q.value = 1.6;
        wGain = actx.createGain(); wGain.gain.value = 0.001;
        src.connect(wFilter); wFilter.connect(wGain); wGain.connect(actx.destination); src.start();
      }
      if (actx.state === "suspended") actx.resume();
      wGain.gain.setTargetAtTime(0.28, actx.currentTime, 0.25);
      windOn = true; btn.classList.add("is-on"); btn.textContent = "Rüzgâr Sesi: Açık";
    } else {
      if (wGain && actx) wGain.gain.setTargetAtTime(0.0001, actx.currentTime, 0.2);
      windOn = false; btn.classList.remove("is-on"); btn.textContent = "Rüzgâr Sesi: Kapalı";
    }
  }

  document.getElementById("m-3d").addEventListener("click", function () { switchView("3d"); });
  document.getElementById("m-genie").addEventListener("click", function () { switchView("genie"); });
  document.getElementById("m-plate").addEventListener("click", function () { switchView("plate"); });
  document.getElementById("m-wind").addEventListener("click", toggleWindAudio);
  document.getElementById("spd-sl").addEventListener("input", function (e) {
    speed = Number(e.target.value) / 10;
    document.getElementById("spd-txt").textContent = speed.toFixed(1) + "x";
  });

  var cv = document.getElementById("wing-cv");
  var ctx = cv.getContext("2d");
  var drag = false;
  cv.addEventListener("pointerdown", function () { drag = true; });
  window.addEventListener("pointerup", function () { drag = false; });
  cv.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var r = cv.getBoundingClientRect();
    tsx = ((e.clientX - r.left) / r.width - 0.5) * 2.4;
    tsy = (0.5 - (e.clientY - r.top) / r.height) * 1.4;
  });
  window.addEventListener("keydown", function (e) { keys[e.code] = true; });
  window.addEventListener("keyup", function (e) { keys[e.code] = false; });

  var last = 0;
  function tick(ts) {
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
    last = ts;
    if (viewMode === "3d") {
      if (keys.ArrowLeft || keys.KeyA) tsx = Math.max(-1.4, tsx - dt * 1.8);
      if (keys.ArrowRight || keys.KeyD) tsx = Math.min(1.4, tsx + dt * 1.8);
      if (keys.ArrowUp || keys.KeyW) tsy = Math.min(0.85, tsy + dt * 1.3);
      if (keys.ArrowDown || keys.KeyS) tsy = Math.max(-0.85, tsy - dt * 1.3);
      sx += (tsx - sx) * Math.min(1, dt * 5.5);
      sy += (tsy - sy) * Math.min(1, dt * 5.5);
      if (windOn && wFilter && actx) wFilter.frequency.setTargetAtTime(260 + speed * 210 + Math.abs(sx) * 120, actx.currentTime, 0.1);

      var W = cv.width, H = cv.height, hor = H * 0.44 + sy * H * 0.14;
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, active.c1); g.addColorStop(0.56, active.c2); g.addColorStop(1, "#050d10");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      var fov = Math.min(W, H) * 0.68;
      for (var i = 0; i < towers.length; i++) {
        var b = towers[i];
        b.z -= dt * speed * 2.1;
        if (b.z < 0.35) b.z += 23.5;
        var sc = fov / b.z;
        var bx = W * 0.5 + (b.x - sx) * sc, bw = b.w * sc, bh = b.h * sc;
        var topY = hor + (1.15 - sy * 0.4) * sc - bh;
        ctx.fillStyle = "rgba(15, 36, 42, 0.88)"; ctx.strokeStyle = "rgba(84, 214, 164, 0.28)";
        ctx.fillRect(bx - bw * 0.5, topY, bw, bh); ctx.strokeRect(bx - bw * 0.5, topY, bw, bh);
      }
      for (var k = 0; k < rings.length; k++) {
        var rg = rings[k], pz = rg.z;
        rg.z -= dt * speed * 2.1;
        if (pz >= 0.45 && rg.z < 0.45 && Math.hypot(rg.x - sx, rg.y - sy) < 0.92) { ringScore++; updateHud(); }
        if (rg.z < 0.3) rg.z += 25.2;
        var rsc = fov / rg.z;
        var rad = rg.r * rsc;
        if (rad > 4 && rad < W) {
          ctx.strokeStyle = rg.z < 3.0 ? "#e8bc6c" : active.acc;
          ctx.lineWidth = Math.max(1.5, Math.min(5, 8 / rg.z));
          ctx.beginPath(); ctx.arc(W * 0.5 + (rg.x - sx) * rsc, hor - (rg.y - sy) * rsc * 0.75, rad, 0, Math.PI * 2); ctx.stroke();
        }
      }
      updateHud();
    }
    requestAnimationFrame(tick);
  }

  initWorld(); renderRoutes(); updateHud(); requestAnimationFrame(tick);
})();
