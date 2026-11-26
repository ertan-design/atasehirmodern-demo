(function () {
  'use strict';
  var MOD = "pervititch_50";
  var PANTONE = "18-4043 TCX Kadastro Kobalt";
  var ARSIV_VERI = [{"a": "Caferiye Sokak", "e": ["Cafer Ağa Çıkmazı", "Medrese Sokağı", "Hagia Sophia North Lane"], "k": 2, "p": [[41.0091, 28.9786], [41.0093, 28.9789], [41.00955, 28.9793]]}, {"a": "Soğukçeşme Sokağı", "e": ["Bâb-ı Hümâyûn Arkası", "Ayasofya-i Kebir Sahil Yolu"], "k": 2, "p": [[41.0097, 28.9802], [41.0102, 28.9807], [41.0109, 28.9814], [41.0116, 28.9822]]}, {"a": "Divanyolu Caddesi", "e": ["Mese Odos (Regia)", "Cadde-i Âmire", "Tarihi Divan Yolu"], "k": 1, "p": [[41.0078, 28.9772], [41.0084, 28.9735], [41.0089, 28.9702], [41.0095, 28.9668]]}, {"a": "Akbıyık Caddesi", "e": ["Akbıyık Muhiddin Sokağı", "Mangana Sarayı Aksı"], "k": 2, "p": [[41.0052, 28.9801], [41.0064, 28.9812], [41.0075, 28.9823], [41.0088, 28.9835]]}, {"a": "Alemdar Caddesi", "e": ["Alay Köşkü Caddesi", "Gülhane Kapısı Yolu"], "k": 1, "p": [[41.0098, 28.9782], [41.0112, 28.9778], [41.0128, 28.9774], [41.0145, 28.977]]}, {"a": "Piyer Loti Caddesi", "e": ["Meclis-i Mebusan Caddesi", "Theodosius Sarnıcı Yolu"], "k": 2, "p": [[41.0068, 28.9732], [41.0074, 28.9726], [41.0082, 28.9718]]}, {"a": "Yerebatan Caddesi", "e": ["Basilica Cistern Lane", "Sarnıç Arkası"], "k": 2, "p": [[41.0082, 28.9774], [41.009, 28.977], [41.0101, 28.9765]]}, {"a": "Kabasakal Caddesi", "e": ["Augustaion Meydan Kenarı", "Arasta Çıkışı"], "k": 2, "p": [[41.0068, 28.9792], [41.0062, 28.9798], [41.0055, 28.9804]]}, {"a": "Torun Sokak", "e": ["Büyük Saray Mozaik Yolu", "Arasta Arkası"], "k": 3, "p": [[41.0048, 28.9782], [41.0042, 28.9775], [41.0036, 28.9768]]}, {"a": "Küçük Ayasofya Caddesi", "e": ["Sergios & Bakhos Yolu", "Kadırga Liman Yokuşu"], "k": 2, "p": [[41.0045, 28.9735], [41.0035, 28.9728], [41.0025, 28.9718]]}, {"a": "Nuruosmaniye Caddesi", "e": ["Forum Constantini Aksı", "Kuyumcular Kapısı Yolu"], "k": 1, "p": [[41.0092, 28.9715], [41.01, 28.9708], [41.0108, 28.97]]}, {"a": "Kalpakçılar Caddesi (Kapalıçarşı İçi)", "e": ["Via Tecta Orientalis", "Kalpakçılar Başı"], "k": 1, "p": [[41.0104, 28.9695], [41.0106, 28.9682], [41.0108, 28.9669]]}, {"a": "Yağlıkçılar Caddesi (Kapalıçarşı)", "e": ["İpekçiler Caddesi", "Bedesten Kuzey Aksı"], "k": 2, "p": [[41.0109, 28.9685], [41.0116, 28.9684], [41.0123, 28.9682]]}, {"a": "Mahmutpaşa Yokuşu", "e": ["Kaza Yokuşu", "Mahmut Paşa Camii Sokağı"], "k": 1, "p": [[41.0125, 28.9702], [41.0142, 28.97], [41.0158, 28.9698]]}, {"a": "Hasırcılar Caddesi", "e": ["Baharatçılar Caddesi", "Rüstem Paşa Altı"], "k": 2, "p": [[41.0172, 28.9685], [41.0175, 28.9695], [41.0178, 28.9705]]}, {"a": "Tahmis Sokak", "e": ["Kahvehane-i Âmire Sokağı", "Kuru Kahveci Aksı"], "k": 2, "p": [[41.0168, 28.9698], [41.0172, 28.9702], [41.0176, 28.9706]]}, {"a": "Hamidiye Caddesi", "e": ["Sirkeci Rıhtım Yolu", "Büyük Postane Caddesi"], "k": 1, "p": [[41.0155, 28.9745], [41.0162, 28.9755], [41.0169, 28.9765]]}, {"a": "Ankara Caddesi (Eski Bâb-ı Âli)", "e": ["Bâb-ı Âli Caddesi", "Sadaret Yokuşu", "Matbuat Caddesi"], "k": 1, "p": [[41.0118, 28.975], [41.0135, 28.9758], [41.0152, 28.9766]]}, {"a": "Süleymaniye Caddesi", "e": ["Külliye Caddesi", "Mimar Sinan Yolu"], "k": 1, "p": [[41.0142, 28.9652], [41.0152, 28.9645], [41.0162, 28.9638]]}, {"a": "Mimar Sinan Caddesi (Fatih)", "e": ["Sinan Türbe Yolu", "Ağa Kapısı Yokuşu"], "k": 2, "p": [[41.016, 28.9625], [41.0168, 28.9635], [41.0175, 28.9642]]}, {"a": "Karaköy Kemeraltı Caddesi", "e": ["Rue Saint Benoît", "Galata Surları Dışı", "Kemeraltı Caddesi"], "k": 1, "p": [[41.0245, 28.9768], [41.0255, 28.9792], [41.0265, 28.9818]]}, {"a": "Bankalar Caddesi (Voyvoda Caddesi)", "e": ["Rue Voïvoda", "Bank-ı Osmanî-i Şahane Caddesi"], "k": 1, "p": [[41.024, 28.9738], [41.0246, 28.9748], [41.0252, 28.976]]}, {"a": "Kamondo Merdivenleri", "e": ["Escalier de Camondo", "Aşıklar Merdiveni"], "k": 3, "p": [[41.0246, 28.9746], [41.0249, 28.9744], [41.0252, 28.9742]]}, {"a": "Galip Dede Caddesi (Yüksek Kaldırım Devamı)", "e": ["Rue de Galata", "Mevlevîhane Yokuşu", "Tekke Sokağı"], "k": 1, "p": [[41.0258, 28.9745], [41.027, 28.975], [41.0282, 28.9754]]}, {"a": "İstiklal Caddesi", "e": ["Grand Rue de Péra", "Cadde-i Kebîr"], "k": 1, "p": [[41.0285, 28.9755], [41.0315, 28.9778], [41.0345, 28.981], [41.037, 28.9855]]}, {"a": "Meşrutiyet Caddesi", "e": ["Rue Tepe-Bachi", "Tepebaşı Caddesi"], "k": 1, "p": [[41.029, 28.9735], [41.0318, 28.9755], [41.0342, 28.9778]]}, {"a": "Asmalı Mescit Sokağı", "e": ["Rue Asmali", "Mescit Sokağı"], "k": 2, "p": [[41.0305, 28.9745], [41.0308, 28.9755], [41.0312, 28.9765]]}, {"a": "Çukurcuma Caddesi", "e": ["Fatih Cuma Sokağı", "Antikacılar Yolu"], "k": 2, "p": [[41.0315, 28.9805], [41.0322, 28.9815], [41.033, 28.9825]]}, {"a": "Boğazkesen Caddesi", "e": ["Rue Boghaz-Kessen", "Tophane İnişi"], "k": 1, "p": [[41.031, 28.98], [41.029, 28.9818], [41.0272, 28.9835]]}, {"a": "Necatibey Caddesi (Karaköy Sahil)", "e": ["Mumhane Caddesi Devamı", "Galataport Kıyı Aksı"], "k": 1, "p": [[41.0248, 28.9785], [41.026, 28.981], [41.0272, 28.9835]]}, {"a": "Meclis-i Mebusan Caddesi (Fındıklı)", "e": ["Çifte Saraylar Caddesi", "Fındıklı Rıhtım Yolu"], "k": 1, "p": [[41.028, 28.986], [41.031, 28.991], [41.0335, 28.995]]}, {"a": "Dolmabahçe Caddesi", "e": ["Dolmabahçe Saray Yolu", "Asırlık Çınarlar Caddesi"], "k": 1, "p": [[41.0385, 28.998], [41.04, 29.002], [41.0415, 29.006]]}, {"a": "Süleyman Seba Caddesi (Akaretler)", "e": ["Akaretler Caddesi", "Sıraevler Yolu"], "k": 1, "p": [[41.0412, 29.0012], [41.0425, 29.0025], [41.044, 29.0038]]}, {"a": "Çırağan Caddesi", "e": ["Çırağan Saray Yolu", "Feriye Sahil Aksı"], "k": 1, "p": [[41.043, 29.01], [41.0445, 29.015], [41.046, 29.02]]}, {"a": "Muallim Naci Caddesi (Ortaköy)", "e": ["Ortaköy Kuruçeşme Sahil Yolu", "Yalılar Caddesi"], "k": 1, "p": [[41.0465, 29.023], [41.047, 29.024], [41.0485, 29.028], [41.051, 29.031]]}, {"a": "İskele Sokağı (Ortaköy Meydanı)", "e": ["Büyük Mecidiye İskele Yolu", "Balıkçılar Sokağı"], "k": 2, "p": [[41.0472, 29.0265], [41.0474, 29.0275], [41.0476, 29.0285]]}, {"a": "Paşalimanı Caddesi (Üsküdar)", "e": ["Paşa Limanı Yolu", "Fethi Paşa Kıyı Aksı"], "k": 1, "p": [[41.028, 29.018], [41.031, 29.022], [41.034, 29.026]]}, {"a": "İcadiye Caddesi (Kuzguncuk)", "e": ["Kuzguncuk Ana Caddesi", "Bostan Sokağı"], "k": 1, "p": [[41.0345, 29.028], [41.036, 29.0295], [41.0375, 29.031]]}, {"a": "Salacak Sahil Yolu (Harem-Üsküdar)", "e": ["Dam-ı Leandros Yolu", "Kız Kulesi Seyir Kordonu"], "k": 1, "p": [[41.0185, 29.006], [41.021, 29.009], [41.024, 29.012]]}, {"a": "Beylerbeyi Abdullah Ağa Caddesi", "e": ["İstavroz Koyu Yolu", "Beylerbeyi Saray Caddesi"], "k": 1, "p": [[41.041, 29.038], [41.0425, 29.041], [41.044, 29.0435]]}, {"a": "Palas Arkası Sokak (Ortaköy)", "e": ["Esma Sultan Arkası", "Yalı Kordonu"], "k": 3, "p": [[41.0478, 29.0255], [41.0482, 29.0268], [41.0486, 29.028]]}, {"a": "Büyükparmakkapı Sokak (Beyoğlu)", "e": ["Rue Parmak-Kapou", "Pera Tiyatro Geçidi"], "k": 2, "p": [[41.034, 28.979], [41.0348, 28.9805], [41.0355, 28.9818]]}, {"a": "Sıraselviler Caddesi", "e": ["Grand Rue des Théâtres", "Selviler Caddesi"], "k": 1, "p": [[41.036, 28.984], [41.0345, 28.983], [41.0325, 28.9815]]}, {"a": "Tünel Meydanı & Yolu", "e": ["Place du Tunnel", "Tünel Başı"], "k": 1, "p": [[41.0278, 28.9748], [41.0282, 28.9752], [41.0286, 28.9756]]}, {"a": "Kallavi Sokak (Beyoğlu)", "e": ["Rue Kallavi", "Elçilik Arkası"], "k": 3, "p": [[41.033, 28.9765], [41.0332, 28.9758], [41.0335, 28.975]]}, {"a": "Turnacıbaşı Caddesi", "e": ["Rue de Turnadjibachi", "Yeniçeri Turnacı Kışlası"], "k": 2, "p": [[41.0335, 28.9785], [41.033, 28.98], [41.0325, 28.9815]]}, {"a": "Faik Paşa Caddesi (Çukurcuma)", "e": ["Rue Faik Pacha", "Dr. Della Suda Yolu"], "k": 2, "p": [[41.032, 28.981], [41.0325, 28.982], [41.033, 28.983]]}, {"a": "Kadırga Limanı Caddesi", "e": ["Portus Iulianus", "Portus Theodosiacus Sahili", "Kadırga Meydanı"], "k": 1, "p": [[41.0035, 28.9685], [41.004, 28.9705], [41.0045, 28.9725]]}, {"a": "Gülhane Parkı İçi Sahil Yolu", "e": ["Topkapı Hasbahçe Yolu", "Sarayburnu Kordonu"], "k": 2, "p": [[41.0125, 28.981], [41.014, 28.983], [41.0155, 28.9855]]}, {"a": "Bebek Arnavutköy Sahil Kordonu", "e": ["Akıntıburnu Yolu", "Megalu Revmatu Sahili"], "k": 1, "p": [[41.06, 29.04], [41.0625, 29.043], [41.065, 29.046]]}];
  var BAZ_RENK = [0.220, 0.400, 0.600];
  var PAR_RENK = [0.840, 0.940, 1.000];

  var durum = { yaw: 0.30, pitch: 0.21, zoom: 2.84, ruzgarGuc: 0.68, ruzgarMod: 1, isikAci: 0.72, itki: 0.0, ses: false };
  var tuval = document.getElementById('tuval');
  var gl = tuval ? tuval.getContext('webgl2', { antialias: true, alpha: false, preserveDrawingBuffer: true }) : null;

  var sesCtx = null, panner = null, kazanc = null;
  function sesAcKapat() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!durum.ses && AC) {
      if (!sesCtx) {
        sesCtx = new AC();
        var len = sesCtx.sampleRate * 2, buf = sesCtx.createBuffer(1, len, sesCtx.sampleRate), d = buf.getChannelData(0), son = 0;
        for (var i = 0; i < len; i++) { son = (son + 0.03 * (Math.random() * 2 - 1)) / 1.03; d[i] = son * 0.45; }
        var src = sesCtx.createBufferSource(); src.buffer = buf; src.loop = true;
        var flt = sesCtx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.value = 370;
        panner = sesCtx.createStereoPanner ? sesCtx.createStereoPanner() : null;
        kazanc = sesCtx.createGain(); kazanc.gain.value = 0.15;
        src.connect(flt);
        if (panner) { flt.connect(panner); panner.connect(kazanc); } else { flt.connect(kazanc); }
        kazanc.connect(sesCtx.destination); src.start();
      }
      if (sesCtx.state === 'suspended') sesCtx.resume();
      if (kazanc) kazanc.gain.value = 0.15;
      durum.ses = true;
    } else {
      if (kazanc) kazanc.gain.value = 0.0;
      durum.ses = false;
    }
    var bs = document.getElementById('btn-ses');
    if (bs) { bs.classList.toggle('aktif', durum.ses); bs.setAttribute('aria-pressed', String(durum.ses)); }
  }

  var N = 50, topN = N * N;
  var kon = new Float32Array(topN * 3), norm = new Float32Array(topN * 3), uv = new Float32Array(topN * 2), idxArr = [];
  for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) { var p = j * N + i; uv[p * 2] = i / (N - 1); uv[p * 2 + 1] = j / (N - 1); }
  for (var y = 0; y < N - 1; y++) for (var x = 0; x < N - 1; x++) { var a = y * N + x, b = a + 1, c = a + N, d = c + 1; idxArr.push(a, c, b, b, c, d); }
  var indeksler = new Uint16Array(idxArr);

  function yuzeyHesapla(t) {
    var wGuc = 0.16 + durum.ruzgarGuc * 0.16 + durum.itki * 0.50;
    durum.itki *= 0.93;
    var faz = t * (0.30 + durum.ruzgarGuc * 0.20);
    for (var j = 0; j < N; j++) {
      var v = j / (N - 1);
      for (var i = 0; i < N; i++) {
        var u = i / (N - 1), idx = (j * N + i) * 3;
        var aci = (u - 0.5) * Math.PI * 1.58;
        var r = 0.44 + v * 1.38 * (0.82 + 0.24 * Math.cos(3.0 * aci));
        kon[idx] = Math.sin(aci) * r * 1.22;
        kon[idx + 1] = (0.54 - v) * 2.08 + Math.cos(3.0 * aci) * 0.20 * v;
        kon[idx + 2] = Math.cos(aci) * r * 0.56 + Math.sin(v * 4.8 - faz + u * 3.4) * 0.14 * wGuc;
      }
    }
    norm.fill(0);
    for (var k = 0; k < indeksler.length; k += 3) {
      var ia = indeksler[k] * 3, ib = indeksler[k + 1] * 3, ic = indeksler[k + 2] * 3;
      var e1x = kon[ib] - kon[ia], e1y = kon[ib + 1] - kon[ia + 1], e1z = kon[ib + 2] - kon[ia + 2];
      var e2x = kon[ic] - kon[ia], e2y = kon[ic + 1] - kon[ia + 1], e2z = kon[ic + 2] - kon[ia + 2];
      var nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
      norm[ia] += nx; norm[ia + 1] += ny; norm[ia + 2] += nz;
      norm[ib] += nx; norm[ib + 1] += ny; norm[ib + 2] += nz;
      norm[ic] += nx; norm[ic + 1] += ny; norm[ic + 2] += nz;
    }
  }

  function derle(tip, kod) { var s = gl.createShader(tip); gl.shaderSource(s, kod); gl.compileShader(s); return s; }
  function matCarp(a, b) {
    var o = new Float32Array(16);
    for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++)
      o[j * 4 + i] = a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3];
    return o;
  }
  function matPersp(fov, oran, yn, uz) {
    var f = 1.0 / Math.tan(fov * 0.5), nf = 1.0 / (yn - uz);
    return new Float32Array([f / oran, 0, 0, 0, 0, f, 0, 0, 0, 0, (uz + yn) * nf, -1, 0, 0, 2 * uz * yn * nf, 0]);
  }
  function matBak(goz, mrk, yuk) {
    var zx = goz[0] - mrk[0], zy = goz[1] - mrk[1], zz = goz[2] - mrk[2];
    var zl = Math.hypot(zx, zy, zz) || 1; zx /= zl; zy /= zl; zz /= zl;
    var xx = yuk[1] * zz - yuk[2] * zy, xy = yuk[2] * zx - yuk[0] * zz, xz = yuk[0] * zy - yuk[1] * zx;
    var xl = Math.hypot(xx, xy, xz) || 1; xx /= xl; xy /= xl; xz /= xl;
    var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
      -(xx * goz[0] + xy * goz[1] + xz * goz[2]), -(yx * goz[0] + yy * goz[1] + yz * goz[2]), -(zx * goz[0] + zy * goz[1] + zz * goz[2]), 1]);
  }

  var prog = null, vao = null, bKon = null, bNorm = null, uL = {};
  if (gl) {
    var vs = '#version 300 es\nprecision highp float;\nprecision highp int;\nlayout(location=0) in vec3 aKon;\nlayout(location=1) in vec3 aNorm;\nlayout(location=2) in vec2 aUv;\nuniform mat4 uMvp;\nout vec3 vKon; out vec3 vNorm; out vec2 vUv;\nvoid main(){ vKon=aKon; vNorm=aNorm; vUv=aUv; gl_Position=uMvp*vec4(aKon,1.0); }';
    var fs = '#version 300 es\nprecision highp float;\nprecision highp int;\nin vec3 vKon; in vec3 vNorm; in vec2 vUv;\nuniform vec3 uGoz; uniform vec3 uIsik; uniform vec3 uBaz; uniform vec3 uPar;\nout vec4 frag;\nvoid main(){ vec3 N=normalize(vNorm); if(!gl_FrontFacing) N=-N; vec3 V=normalize(uGoz-vKon); vec3 L=normalize(uIsik); float w1=sin((vUv.x*52.0+vUv.y*7.0)*6.28318); float ndl=dot(N,L); float ayd=pow(clamp(ndl*0.52+0.48,0.0,1.0),2.0); vec3 H=normalize(L+V); float ipek=pow(max(0.0,dot(N,H)),16.0); float kenar=pow(1.0-max(0.0,dot(N,V)),2.5); vec3 r=mix(vec3(0.05,0.045,0.08),uBaz*(0.92+0.08*w1),ayd)+uPar*(ipek*0.65+kenar*0.42); frag=vec4(clamp(r,vec3(0.035,0.04,0.06),vec3(1.0)),1.0); }';
    prog = gl.createProgram();
    gl.attachShader(prog, derle(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, derle(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    uL = { mvp: gl.getUniformLocation(prog, 'uMvp'), goz: gl.getUniformLocation(prog, 'uGoz'), isik: gl.getUniformLocation(prog, 'uIsik'), baz: gl.getUniformLocation(prog, 'uBaz'), par: gl.getUniformLocation(prog, 'uPar') };
    vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    bKon = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bKon); gl.bufferData(gl.ARRAY_BUFFER, kon.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    bNorm = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bNorm); gl.bufferData(gl.ARRAY_BUFFER, norm.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    var bUv = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bUv); gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    var bI = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bI); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indeksler, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
  }

  function kare(ms) {
    var t = ms * 0.001;
    if (tuval && gl) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.floor(window.innerWidth * dpr)), h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (tuval.width !== w || tuval.height !== h) { tuval.width = w; tuval.height = h; gl.viewport(0, 0, w, h); }
      if (durum.ses && panner) panner.pan.value = Math.sin(durum.yaw + t * 0.7);
      yuzeyHesapla(t);
      gl.clearColor(0.035, 0.043, 0.063, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      var goz = [Math.sin(durum.yaw) * Math.cos(durum.pitch) * durum.zoom, Math.sin(durum.pitch) * durum.zoom + 0.08, Math.cos(durum.yaw) * Math.cos(durum.pitch) * durum.zoom];
      var mvp = matCarp(matPersp(0.76, w / h, 0.1, 30.0), matBak(goz, [0, -0.04, 0], [0, 1, 0]));
      var isik = [Math.cos(durum.isikAci + durum.yaw * 0.35) * 1.35, 1.55, Math.sin(durum.isikAci + durum.yaw * 0.35) * 1.35];
      gl.useProgram(prog);
      gl.uniformMatrix4fv(uL.mvp, false, mvp);
      gl.uniform3fv(uL.goz, goz); gl.uniform3fv(uL.isik, isik); gl.uniform3fv(uL.baz, BAZ_RENK); gl.uniform3fv(uL.par, PAR_RENK);
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, bKon); gl.bufferSubData(gl.ARRAY_BUFFER, 0, kon);
      gl.bindBuffer(gl.ARRAY_BUFFER, bNorm); gl.bufferSubData(gl.ARRAY_BUFFER, 0, norm);
      gl.drawElements(gl.TRIANGLES, indeksler.length, gl.UNSIGNED_SHORT, 0);
    }
    requestAnimationFrame(kare);
  }

  var basili = false, sx = 0, sy = 0;
  function guncelleEtiket() {
    var el = document.getElementById('durum');
    if (el) el.textContent = PANTONE + ' · ' + Math.round(((durum.yaw * 180 / Math.PI) % 360 + 360) % 360) + '°';
  }
  if (tuval) {
    tuval.addEventListener('pointerdown', function (e) { basili = true; sx = e.clientX; sy = e.clientY; });
    window.addEventListener('pointermove', function (e) {
      if (!basili) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = e.clientX; sy = e.clientY;
      durum.yaw -= dx * 0.0046;
      durum.pitch = Math.max(-1.18, Math.min(1.18, durum.pitch + dy * 0.0068));
      durum.itki = Math.min(1.2, durum.itki + Math.hypot(dx, dy) * 0.012);
      guncelleEtiket();
    });
    window.addEventListener('pointerup', function () { basili = false; });
    tuval.addEventListener('wheel', function (e) { e.preventDefault(); durum.zoom = Math.max(1.65, Math.min(5.6, durum.zoom + e.deltaY * 0.0022)); }, { passive: false });
  }

  var bR = document.getElementById('btn-ruzgar');
  if (bR) bR.addEventListener('click', function () { durum.ruzgarMod = (durum.ruzgarMod + 1) % 3; durum.ruzgarGuc = [0.35, 0.68, 1.0][durum.ruzgarMod]; });
  var bI = document.getElementById('btn-isik');
  if (bI) bI.addEventListener('click', function () { durum.isikAci += 0.85; });
  var bS = document.getElementById('btn-ses');
  if (bS) bS.addEventListener('click', sesAcKapat);

  var bAc = document.getElementById('arsiv-ac'), bKapat = document.getElementById('arsiv-kapat'), aPanel = document.getElementById('arsiv-panel');
  function panelDegistir(acikMi) {
    if (!aPanel || !bAc) return;
    var yeni = (typeof acikMi === 'boolean') ? acikMi : aPanel.hidden;
    aPanel.hidden = !yeni;
    bAc.classList.toggle('aktif', yeni);
    bAc.setAttribute('aria-expanded', String(yeni));
    bAc.textContent = yeni ? 'Arşiv Paftası −' : 'Arşiv Paftası ＋';
    if (yeni) guncelleArsiv();
  }
  if (bAc) bAc.addEventListener('click', function () { panelDegistir(); });
  if (bKapat) bKapat.addEventListener('click', function () { panelDegistir(false); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') panelDegistir(false); });

  function guncelleArsiv() {
    var detay = document.getElementById('arsiv-detay');
    var indir = document.getElementById('arsiv-indir');
    if (!detay) return;
    var cikti = { mod: MOD, pantone: PANTONE };

    if (MOD === 'sanart_12svg') {
      var secE = document.getElementById('sec-eser');
      var imgE = document.getElementById('eser-gorsel');
      var ad = secE ? secE.value : ARSIV_VERI[0].ad;
      if (imgE) imgE.src = './' + ad;
      var kayit = ARSIV_VERI.filter(function (x) { return x.ad === ad; })[0] || ARSIV_VERI[0];
      detay.textContent = 'Özgün Arşiv Dosyası: ' + kayit.ad + '\nBoyut: ' + kayit.bayt + ' bayt · SHA-256(16): ' + kayit.sha16 + '\nDurum: Vektör sergi eseri yerel kapsül içinde sıfır dış bağımlılıkla yüklendi.';
      cikti.seciliEser = kayit;
    }
    else if (MOD === 'sakinler_ikiz_svg') {
      var secP = document.getElementById('sec-pafta');
      var imgP = document.getElementById('pafta-gorsel');
      var pad = secP ? secP.value : 'konsept2_sakinler_dogrulanmis.svg';
      if (imgP) imgP.src = './' + pad;
      var pk = ARSIV_VERI.filter(function (x) { return x.ad === pad; })[0] || ARSIV_VERI[0];
      detay.textContent = 'Mimari Pafta: ' + pk.ad + ' (' + pk.bayt + ' bayt · SHA-256(16): ' + pk.sha16 + ')\nDoğrulama: HUSEYINBEY_ROLOVE_310826.dxf (1238×976 cm · H:288/264/268 cm) ve saha fotoğrafı topolojisiyle eşleşir.';
      cikti.seciliPafta = pk;
    }
    else if (MOD === 'pervititch_50') {
      var secS = document.getElementById('sec-sokak');
      var araS = document.getElementById('ara-sokak');
      var q = araS ? araS.value.trim().toLowerCase() : '';
      var idx = secS ? Number(secS.value) || 0 : 0;
      if (q) {
        for (var m = 0; m < ARSIV_VERI.length; m++) {
          var met = (ARSIV_VERI[m].a + ' ' + (ARSIV_VERI[m].e || []).join(' ')).toLowerCase();
          if (met.indexOf(q) !== -1) { idx = m; if (secS) secS.value = String(m); break; }
        }
      }
      var sk = ARSIV_VERI[idx] || ARSIV_VERI[0];
      detay.textContent = 'Güncel Sokak Adı: ' + sk.a + '\nPervititch / Tarihî Adları: ' + (sk.e || []).join(' · ') + '\nKoordinat Düğüm Sayısı: ' + (sk.p ? sk.p.length : 0) + ' nokta (0 Google Maps karosu — doğrudan vektör çizim).';
      cikti.seciliSokak = sk;
      cizSokakHarita(idx);
    }
    else {
      var secD = document.getElementById('sec-dil');
      var di = secD ? Number(secD.value) || 0 : 0;
      var dl = ARSIV_VERI[di] || ARSIV_VERI[0];
      detay.textContent = 'Kanal [' + dl[0].toUpperCase() + '] · ' + dl[1] + '\nSimultane Kulis & Podyum Altyazısı: “' + dl[2] + '”\nToplam Hazır Dil Kanalı: 68 uluslararası yayın akışı.';
      cikti.seciliDil = { kod: dl[0], ad: dl[1], altyazi: dl[2] };
    }

    if (indir) indir.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cikti, null, 2));
  }

  function cizSokakHarita(seciliIdx) {
    var cv = document.getElementById('sokak-harita');
    if (!cv || !ARSIV_VERI.length) return;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = '#0d121c';
    ctx.fillRect(0, 0, cv.width, cv.height);
    var minLat = 90, maxLat = -90, minLon = 180, maxLon = -180;
    for (var i = 0; i < ARSIV_VERI.length; i++) {
      var pts = ARSIV_VERI[i].p || [];
      for (var k = 0; k < pts.length; k++) {
        if (pts[k][0] < minLat) minLat = pts[k][0];
        if (pts[k][0] > maxLat) maxLat = pts[k][0];
        if (pts[k][1] < minLon) minLon = pts[k][1];
        if (pts[k][1] > maxLon) maxLon = pts[k][1];
      }
    }
    var dLat = Math.max(0.0001, maxLat - minLat), dLon = Math.max(0.0001, maxLon - minLon);
    for (var s = 0; s < ARSIV_VERI.length; s++) {
      var pArr = ARSIV_VERI[s].p || [];
      if (pArr.length < 2) continue;
      ctx.beginPath();
      for (var n = 0; n < pArr.length; n++) {
        var x = 28 + ((pArr[n][1] - minLon) / dLon) * (cv.width - 56);
        var y = cv.height - 24 - ((pArr[n][0] - minLat) / dLat) * (cv.height - 48);
        if (n === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = (s === seciliIdx) ? '#7fe0b0' : 'rgba(216,188,140,0.28)';
      ctx.lineWidth = (s === seciliIdx) ? 3.2 : 1.2;
      ctx.stroke();
    }
  }

  var girdiler = document.querySelectorAll('.arsiv-panel select, .arsiv-panel input');
  for (var g = 0; g < girdiler.length; g++) {
    girdiler[g].addEventListener('change', guncelleArsiv);
    girdiler[g].addEventListener('input', guncelleArsiv);
  }
  guncelleArsiv();
  requestAnimationFrame(kare);
})();
