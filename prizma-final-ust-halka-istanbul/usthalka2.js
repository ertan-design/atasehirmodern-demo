(function () {
  "use strict";

  var NODES = [
    { id: "ifm", ad: "İFM / Finanskent", km: 2.8, x: 0.68, y: 0.32, desc: "Flex 43K çıkışı: uluslararası finans, iş ve teknoloji fırsatları koridoru." },
    { id: "wg", ad: "Watergarden AVM", km: 2.4, x: 0.35, y: 0.49, desc: "Balance 35K çıkışı: su gösterisi, buluşma ve günlük yaşam merkezi." },
    { id: "maltepe", ad: "Maltepe Sahil & Konser", km: 10.8, x: 0.56, y: 0.74, desc: "Grand 25K çıkışı: Orhangazi Şehir Parkı, sahil ve açık hava konser alanı." },
    { id: "adalar", ad: "Prens Adaları", km: 15.4, x: 0.32, y: 0.82, desc: "Marmara ufuk hattı: ada vapuru ve güney rüzgâr koridoru." },
    { id: "kadikoy", ad: "Kadıköy & Boğaz", km: 9.6, x: 0.16, y: 0.42, desc: "Kültür, tasarım atölyeleri, moda galerileri ve iki kıta geçişi." }
  ];

  var active = NODES[0], glide = 3.2, phase = 0;
  var cv = document.getElementById("ist-cv");
  var ctx = cv.getContext("2d");

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function renderUI() {
    var row = document.getElementById("node-row");
    clear(row);
    NODES.forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ubtn" + (n.id === active.id ? " is-on" : "");
      b.textContent = n.ad + " (" + n.km + " km)";
      b.addEventListener("click", function () { active = n; renderUI(); });
      row.appendChild(b);
    });
    var box = document.getElementById("node-box");
    clear(box);
    var st = document.createElement("strong"); st.textContent = active.ad + " · Kuş Uçuşu ~" + active.km + " km";
    var sp = document.createElement("span"); sp.textContent = active.desc;
    box.appendChild(st); box.appendChild(sp);

    var reqAlt = Math.round((active.km * 1000) / glide);
    var speedKmh = 95;
    var etaMin = ((active.km / speedKmh) * 60).toFixed(1);
    document.getElementById("calc-out").textContent = [
      "HEDEF          : " + active.ad,
      "MESAFE         : ~" + active.km + " km",
      "SÜZÜLÜŞ ORANI  : " + glide.toFixed(1) + " : 1",
      "SİMÜLASYON SÜRE: ~" + etaMin + " dk (95 km/s)",
      "GEREKEN İRTİFA : ~" + reqAlt + " m (teorik süzülüş)"
    ].join("\n");
  }

  document.getElementById("u-glide").addEventListener("input", function (e) {
    glide = Number(e.target.value) / 10;
    document.getElementById("v-glide").textContent = glide.toFixed(1) + " : 1";
    renderUI();
  });

  function draw() {
    var W = cv.width, H = cv.height;
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#060b16"); g.addColorStop(0.58, "#142246"); g.addColorStop(1, "#091429");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    var cx = W * 0.50, cy = H * 0.44;
    [[cx - 20, 68, 12], [cx - 4, 90, 14], [cx + 14, 56, 12]].forEach(function (t) {
      ctx.fillStyle = "rgba(242,167,92,0.24)"; ctx.strokeStyle = "#f2a75c";
      ctx.fillRect(t[0], cy + 24 - t[1], t[2], t[1]); ctx.strokeRect(t[0], cy + 24 - t[1], t[2], t[1]);
    });

    NODES.forEach(function (n) {
      var nx = W * n.x, ny = H * n.y, isA = n.id === active.id;
      ctx.strokeStyle = isA ? "#f2a75c" : "rgba(92,195,237,0.35)";
      ctx.lineWidth = isA ? 3 : 1.3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo((cx + nx) / 2, Math.min(cy, ny) - 54, nx, ny); ctx.stroke();
      ctx.fillStyle = isA ? "#f2a75c" : "#5cc3ed";
      ctx.beginPath(); ctx.arc(nx, ny, isA ? 8 + Math.sin(phase * 2) * 2 : 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f3f6fc"; ctx.font = (isA ? "700 " : "500 ") + "12px system-ui, sans-serif";
      ctx.fillText(n.ad, nx + 11, ny + 4);
    });
    phase += 0.03;
    requestAnimationFrame(draw);
  }

  renderUI(); draw();
})();
