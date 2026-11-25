import { kumasKur } from "./kumas.js";
// Baska Istanbul Yok · terazi. Bagimsiz ES modulu; harita altligi, karo, uydu, isaretci kullanmaz. Veri gondermez.
const $ = (s, k = document) => k.querySelector(s);
const kac = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sayi = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 });
const depo = { al(k, v) { try { const x = localStorage.getItem(k); return x == null ? v : x; } catch { return v; } }, koy(k, v) { try { localStorage.setItem(k, v); } catch {} } };

// ---------- iplik receteleri (tasarim recetesi; olculmus numune degil) ----------
const IPLIK = {
  "ipek-civit": { ad: "Ham ipek · çivit", lif: "Dut ipeği (Bombyx mori)", numara: "20/22 denye", bukum: "Z · 600 tur/m", orgu: "saten 5'li", boya: "çivit (Indigofera), 3 daldırma", koyu: [38, 52, 104], acik: [118, 142, 206] },
  "keten-ceviz": { ad: "Keten · ceviz kabuğu", lif: "Keten (Linum usitatissimum)", numara: "Nm 40/1", bukum: "S · 420 tur/m", orgu: "bez ayağı", boya: "ceviz kabuğu tanenı", koyu: [86, 58, 36], acik: [192, 152, 108] },
  "yun-kokboya": { ad: "Yün · kökboya", lif: "Merinos yün", numara: "Nm 2/48", bukum: "2 kat · Z/S · 520 tur/m", orgu: "dimi 2/2", boya: "kökboya (Rubia tinctorum), şap mordanı", koyu: [120, 44, 32], acik: [226, 132, 104] },
  "pamuk-cehri": { ad: "Pamuk · cehri", lif: "Ege pamuğu", numara: "Ne 30/1", bukum: "Z · 780 tur/m", orgu: "bez ayağı", boya: "cehri (Rhamnus), şap", koyu: [150, 112, 24], acik: [244, 214, 118] },
};

// ---------- konumlar: yaklasik (blok temsili); Maltepe yayimlanmis deger ----------
const MERKEZ = { ad: "Ataşehir Modern · Atatürk Mah., Ahmet Yesevi Cad.", enlem: 40.984, boylam: 29.118 };
const ROTA = [
  { blok: "A", ofset: [-0.0006, -0.0004], hedef: "Watergarden", alt: "AVM · Barbaros Mah., Kızılbegonya Sk.", enlem: 40.9935, boylam: 29.1105, iplik: "ipek-civit", kesin: false, ne: "moda, sinema, konser: akşamın sahnesi" },
  { blok: "B", ofset: [0.0004, 0.0006], hedef: "Finanskent", alt: "İstanbul Finans Merkezi fırsatları", enlem: 40.9965, boylam: 29.1215, iplik: "yun-kokboya", kesin: false, ne: "iş, yatırım, yeni ofis kapıları" },
  { blok: "C", ofset: [0.0006, -0.0006], hedef: "Maltepe sahil", alt: "Miting ve konser alanı · Yalı Mah.", enlem: 40.9249, boylam: 29.1206, iplik: "keten-ceviz", kesin: true, ne: "deniz, konser, kalabalığın sesi" },
];
function olc(a, b) {  // haversine km ve kuzeyden saat yonunde derece
  const r = Math.PI / 180, R = 6371;
  const f1 = a.enlem * r, f2 = b.enlem * r, df = (b.enlem - a.enlem) * r, dl = (b.boylam - a.boylam) * r;
  const h = Math.sin(df / 2) ** 2 + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) ** 2;
  const km = 2 * R * Math.asin(Math.sqrt(h));
  const y = Math.sin(dl) * Math.cos(f2), x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
  return { km, yon: (Math.atan2(y, x) / r + 360) % 360 };
}
const pusula = d => ["K", "KKD", "KD", "DKD", "D", "DGD", "GD", "GGD", "G", "GGB", "GB", "BGB", "B", "BKB", "KB", "KKB"][Math.round(d / 22.5) % 16];

// ---------- hareket ----------
const azalt = matchMedia("(prefers-reduced-motion: reduce)");
let hareket = (() => { const v = depo.al("bi.hareket", null); return v == null ? !azalt.matches : v === "acik"; })();
const dinle = new Set();
function hareketUygula() {
  document.documentElement.dataset.hareket = hareket ? "acik" : "kapali";
  const b = $("#hareket"); b.setAttribute("aria-pressed", String(hareket)); b.textContent = "Hareket: " + (hareket ? "açık" : "kapalı");
  dinle.forEach(f => f());
}

// ---------- ucus: kasnak icinde iplikle cizilen rotalar ----------
let secili = 0;
function ucusKur() {
  const cv = $("#ucus-tuval"), ctx = cv.getContext("2d");
  const W = cv.width, H = cv.height, cx = W / 2, cy = H / 2 + 10, R = Math.min(W, H) * 0.44;
  const veri = ROTA.map(r => ({ ...r, ...olc({ enlem: MERKEZ.enlem + r.ofset[0], boylam: MERKEZ.boylam + r.ofset[1] }, r) }));
  const enUzak = Math.max(...veri.map(v => v.km));
  // yon gercek; uzaklik sikistirilmis olcek (yakin duraklar merkeze yigilmasin), kasnak icinde kalir
  const nokta = v => { const rr = R * 0.8 * (0.45 + 0.55 * Math.sqrt(v.km / enUzak)), a = (v.yon - 90) * Math.PI / 180; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; };
  const blokXY = i => [cx + (i - 1) * 26, cy + (i === 1 ? -14 : 10)];

  // kumas dokusu: kucuk karo bir kez uretilir (bez ayagi, iplik golgeli)
  const karo = document.createElement("canvas"); karo.width = karo.height = 64;
  const kc = karo.getContext("2d");
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const ust = (x + y) % 2 === 0, gx = x * 4, gy = y * 4;
    const g = ust ? kc.createLinearGradient(gx, 0, gx + 4, 0) : kc.createLinearGradient(0, gy, 0, gy + 4);
    const taban = ust ? [228, 216, 190] : [214, 200, 172];
    g.addColorStop(0, `rgb(${taban.map(c => c * 0.72 | 0)})`); g.addColorStop(0.5, `rgb(${taban})`); g.addColorStop(1, `rgb(${taban.map(c => c * 0.72 | 0)})`);
    kc.fillStyle = g; kc.fillRect(gx, gy, 4, 4);
  }
  const desen = ctx.createPattern(karo, "repeat");

  function kasnak() {
    ctx.clearRect(0, 0, W, H);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = desen; ctx.fillRect(0, 0, W, H);
    const lekeli = ctx.createRadialGradient(cx - R * .3, cy - R * .3, R * .1, cx, cy, R);
    lekeli.addColorStop(0, "rgba(255,255,255,.08)"); lekeli.addColorStop(1, "rgba(40,30,20,.28)");
    ctx.fillStyle = lekeli; ctx.fillRect(0, 0, W, H);
    ctx.restore();
    // ahsap kasnak: iki halka ve vida
    for (const [en, renk] of [[22, "#6b4a2e"], [14, "#9a7046"], [3, "#c49a68"]]) { ctx.lineWidth = en; ctx.strokeStyle = renk; ctx.beginPath(); ctx.arc(cx, cy, R + 10, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = "#7d7d86"; ctx.fillRect(cx - 14, cy - R - 40, 28, 26); ctx.fillStyle = "#b9b9c4"; ctx.fillRect(cx - 5, cy - R - 52, 10, 16);
    // kuzey: tek teyel ilmegi
    ctx.fillStyle = "#3b3b52"; ctx.font = "600 20px Georgia, serif"; ctx.textAlign = "center"; ctx.fillText("K", cx, cy - R + 36);
  }
  function ilmekCizgi(yol, renk, acik, ilerleme) {  // saten dikis: kisa capraz ilmekler
    const adim = 9, n = Math.floor(yol.length * ilerleme);
    ctx.lineCap = "round";
    for (let i = 0; i < n - 1; i += 1) {
      const [x, y] = yol[i], [x2, y2] = yol[Math.min(i + 1, yol.length - 1)];
      const dx = x2 - x, dy = y2 - y, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
      if (i % adim > adim - 3) continue;  // ilmek araliklari
      ctx.strokeStyle = `rgb(${renk})`; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(x - nx * 3 - dx * .3, y - ny * 3 - dy * .3); ctx.lineTo(x2 + nx * 3, y2 + ny * 3); ctx.stroke();
      ctx.strokeStyle = `rgba(${acik},.75)`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x - nx * 1.5, y - ny * 1.5); ctx.lineTo(x2 + nx * 1.5, y2 + ny * 1.5); ctx.stroke();
    }
  }
  function egri(a, b, bukum) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    const k = [mx - dy * bukum, my + dx * bukum], noktalar = [];
    for (let i = 0; i <= 160; i++) { const t = i / 160, u = 1 - t; noktalar.push([u * u * a[0] + 2 * u * t * k[0] + t * t * b[0], u * u * a[1] + 2 * u * t * k[1] + t * t * b[1]]); }
    return noktalar;
  }
  const yollar = veri.map((v, i) => egri(blokXY(i), nokta(v), i === 2 ? -0.18 : 0.22));
  function halka(x, y, aci, renk) {  // ucusun gectigi halka: elips, iplikten
    ctx.save(); ctx.translate(x, y); ctx.rotate(aci);
    ctx.strokeStyle = `rgba(${renk},.9)`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 10, 24, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 8, 21, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  function ucucu(x, y, aci, renk) {  // wingsuit silueti: kanat kumas, govde iplik
    ctx.save(); ctx.translate(x, y); ctx.rotate(aci);
    ctx.fillStyle = `rgb(${renk})`; ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-8, -13); ctx.lineTo(-4, 0); ctx.lineTo(-8, 13); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 1; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-7, k * 5); ctx.stroke(); }
    ctx.fillStyle = "#f3d27a"; ctx.beginPath(); ctx.arc(10, 0, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function ciz(t) {
    kasnak();
    veri.forEach((v, i) => {
      const ip = IPLIK[v.iplik], yol = yollar[i], aktif = i === secili;
      const ilerleme = aktif ? (hareket ? Math.min(1, ((t / 1000) % 7) / 5) : 1) : 1;
      ctx.globalAlpha = aktif ? 1 : 0.35;
      ilmekCizgi(yol, ip.koyu, ip.acik, ilerleme);
      [0.3, 0.55, 0.8].forEach(f => { const j = Math.floor(f * 160), [x, y] = yol[j], [x2, y2] = yol[j + 1]; halka(x, y, Math.atan2(y2 - y, x2 - x), ip.acik); });
      const [hx, hy] = yol[160];
      ctx.fillStyle = `rgb(${ip.koyu})`; ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.fill();  // fransiz dugumu
      ctx.strokeStyle = `rgb(${ip.acik})`; ctx.lineWidth = 2; ctx.beginPath(); for (let a = 0; a < 12; a += .3) ctx.lineTo(hx + Math.cos(a) * a * .6, hy + Math.sin(a) * a * .6); ctx.stroke();
      ctx.fillStyle = "#24243a"; ctx.font = `${aktif ? 700 : 500} 21px Georgia, serif`; ctx.textAlign = hx > cx ? "left" : "right";
      ctx.fillText(v.hedef, hx + (hx > cx ? 16 : -16), hy - 4);
      ctx.font = "15px Consolas, monospace"; ctx.fillText(`${sayi.format(v.km)} km · ${Math.round(v.yon)}° ${pusula(v.yon)}`, hx + (hx > cx ? 16 : -16), hy + 16);
      if (aktif) {
        const j = Math.max(1, Math.floor(ilerleme * 160)), [x, y] = yol[j - 1], [x2, y2] = yol[Math.min(160, j)];
        ucucu(x2, y2, Math.atan2(y2 - y, x2 - x), ip.koyu);
      }
      ctx.globalAlpha = 1;
    });
    // uc blok: dokuma dugum kareleri
    ["A", "B", "C"].forEach((b, i) => {
      const [x, y] = blokXY(i);
      ctx.fillStyle = i === secili ? "#3d3b55" : "#6a6884"; ctx.fillRect(x - 10, y - 18, 20, 36);
      ctx.strokeStyle = "#e9dfc9"; ctx.lineWidth = 1; for (let k = -15; k < 18; k += 4) { ctx.beginPath(); ctx.moveTo(x - 10, y + k); ctx.lineTo(x + 10, y + k); ctx.stroke(); }
      ctx.fillStyle = "#24243a"; ctx.font = "700 15px Georgia, serif"; ctx.textAlign = "center"; ctx.fillText(b, x, y + 34);
    });
  }
  let dongu = 0;
  const kare = t => { ciz(t); if (hareket) dongu = requestAnimationFrame(kare); };
  const yeniden = () => { cancelAnimationFrame(dongu); hareket ? (dongu = requestAnimationFrame(kare)) : ciz(0); };
  dinle.add(yeniden);
  function kartYaz() {
    const v = veri[secili], ip = IPLIK[v.iplik];
    $("#ucus-kart").innerHTML = `<b>${kac(v.blok)} Blok çatısı → ${kac(v.hedef)}</b><span>${kac(v.alt)} · ${kac(v.ne)}</span>
      <div class="olculer"><span>${sayi.format(v.km)} km ${v.kesin ? "" : "(yaklaşık)"}</span><span>yön ${Math.round(v.yon)}° ${pusula(v.yon)}</span><span>iplik: ${kac(ip.ad)}</span><span>${kac(ip.numara)} · ${kac(ip.orgu)}</span></div>`;
  }
  document.querySelectorAll(".blok-sec [data-blok]").forEach(b => b.addEventListener("click", () => {
    secili = +b.dataset.blok;
    document.querySelectorAll(".blok-sec [data-blok]").forEach(x => { x.setAttribute("aria-checked", String(x === b)); x.classList.toggle("bos", x !== b); });
    kartYaz(); yeniden();
  }));
  $(".blok-sec").addEventListener("keydown", e => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
    e.preventDefault(); const n = (secili + d + 3) % 3; const b = document.querySelector(`.blok-sec [data-blok="${n}"]`); b.click(); b.focus();
  });
  kartYaz(); yeniden();
}

// ---------- misafir masasi ----------
const KAPI = [
  { id: "terzi", ad: "Online terzi", site: "AFAIR · afair.live", iplik: "yun-kokboya", ihtiyac: ["Ölçü alma (iki mezura)", "Prova", "Tadilat", "Dikim danışmanlığı"] },
  { id: "sanat", ad: "Sanat ve renk", site: "Dila · afair.studio", iplik: "ipek-civit", ihtiyac: ["Renk analizi", "Eser seçimi", "Duvar ve ışık uyumu"] },
  { id: "elektronik", ad: "Elektronik kurulum", site: "Codekafa · codekafa.com", iplik: "pamuk-cehri", ihtiyac: ["Ev ağı ve modem", "Akıllı ev kurulumu", "Bilgisayar desteği"] },
  { id: "tarim", ad: "Tarım danışmanı", site: "Hasat · hasat.online", iplik: "keten-ceviz", ihtiyac: ["Balkon ve teras bahçesi", "Toprak ve tohum", "Parsel danışmanlığı"] },
];
let kapiSec = KAPI[0], sonIcs = null;
function misafirKur() {
  const k = $("#kapilar"), f = $("#randevu"), durum = $("#randevu-durum"), ics = $("#ics-indir");
  k.innerHTML = KAPI.map((x, i) => `<button type="button" class="kapi" data-i="${i}" aria-pressed="${i === 0}"><b>${kac(x.ad)}</b><span>${kac(x.site)}</span><span>${kac(IPLIK[x.iplik].ad)}</span></button>`).join("");
  k.querySelectorAll(".kapi").forEach(b => b.style.setProperty("--iplik", `rgb(${IPLIK[KAPI[+b.dataset.i].iplik].koyu})`));
  const saatler = []; for (let m = 10 * 60; m <= 19 * 60; m += 45) saatler.push(`${String(m / 60 | 0).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  f.saat.innerHTML = saatler.map(s => `<option>${s}</option>`).join("");
  const bugun = new Date(); bugun.setMinutes(bugun.getMinutes() - bugun.getTimezoneOffset());
  f.gun.min = bugun.toISOString().slice(0, 10); f.gun.value = f.gun.min;
  const sec = i => {
    kapiSec = KAPI[i];
    k.querySelectorAll(".kapi").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.i === i)));
    $("#randevu-baslik").textContent = `${kapiSec.ad} · ${kapiSec.site}`;
    f.ihtiyac.innerHTML = kapiSec.ihtiyac.map(s => `<option>${kac(s)}</option>`).join("");
    durum.textContent = ""; ics.disabled = true; sonIcs = null;
  };
  k.addEventListener("click", e => { const b = e.target.closest(".kapi"); if (b) sec(+b.dataset.i); });
  sec(0);
  f.addEventListener("submit", e => {
    e.preventDefault();
    const ad = f.ad.value.trim(), gun = f.gun.value, saat = f.saat.value;
    if (!ad || !gun || !saat) { durum.textContent = "Adını, günü ve saati seç."; return; }
    if (gun < f.gun.min) { durum.textContent = "Geçmiş bir gün seçilemez."; return; }
    const bas = `${gun.replaceAll("-", "")}T${saat.replace(":", "")}00`;
    const [hh, mm] = saat.split(":").map(Number), bitis = new Date(2000, 0, 1, hh, mm + 45);
    const bit = `${gun.replaceAll("-", "")}T${String(bitis.getHours()).padStart(2, "0")}${String(bitis.getMinutes()).padStart(2, "0")}00`;
    const temiz = s => s.replace(/[\\;,]/g, m => "\\" + m).replace(/\r?\n/g, "\\n");
    const uid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}@baskaistanbulyok`;
    sonIcs = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Baska Istanbul Yok//Misafir Masasi//TR", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      `UID:${uid}`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`, `DTSTART;TZID=Europe/Istanbul:${bas}`, `DTEND;TZID=Europe/Istanbul:${bit}`,
      `SUMMARY:${temiz(`Randevu talebi · ${kapiSec.ad}: ${f.ihtiyac.value}`)}`,
      `DESCRIPTION:${temiz(`${ad} · ${kapiSec.site}. ${f.not.value.trim()} Durum: talep (onaylanmadı).`)}`,
      "STATUS:TENTATIVE", "END:VEVENT", "END:VCALENDAR"].join("\r\n") + "\r\n";
    ics.disabled = false;
    durum.textContent = `Talep hazır: ${kapiSec.ad}, ${new Date(`${gun}T${saat}`).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })} ${saat}. Müsaitlik henüz doğrulanmadı; dosyayı takvimine ekle ve ${kapiSec.site} ekibine ilet.`;
  });
  ics.addEventListener("click", () => {
    if (!sonIcs) return;
    const u = URL.createObjectURL(new Blob([sonIcs], { type: "text/calendar" }));
    Object.assign(document.createElement("a"), { href: u, download: `randevu-${kapiSec.id}.ics` }).click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  });
}

// ---------- kumas arayuzu: ruzgar ve iplik secimi kullanicida ----------
function kumasArayuz() {
  const bilgi = $("#kumas-bilgi");
  let k;
  try { k = kumasKur({ tuval: $("#kumas"), bilgi, iplikler: IPLIK, hareketAcik: () => hareket, dinle }); }
  catch (e) { bilgi.textContent = "Kumaş çizilemedi: " + String(e.message || e).slice(0, 80); return; }
  if (!k) return;
  window.kumasOlc = n => k.olc(n);  // GPT/denetim icin: fizik gercekten calisiyor mu
  const ruzgar = document.querySelectorAll("[data-ruzgar]");
  ruzgar.forEach(b => b.addEventListener("click", () => { ruzgar.forEach(x => x.setAttribute("aria-pressed", String(x === b))); k.ruzgar(+b.dataset.ruzgar); }));
  const sec = $("#iplik-sec");
  sec.innerHTML = Object.entries(IPLIK).map(([id, x], i) => `<button type="button" class="cip" data-iplik="${id}" aria-pressed="${i === 0}" aria-label="${kac(x.ad)}"><i></i>${kac(x.ad.split(" · ")[1])}</button>`).join("");
  sec.querySelectorAll("[data-iplik]").forEach(b => {
    b.querySelector("i").style.setProperty("--c", `rgb(${IPLIK[b.dataset.iplik].acik})`);
    b.addEventListener("click", () => { sec.querySelectorAll("[data-iplik]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); k.iplik(b.dataset.iplik); bilgi.textContent = `${IPLIK[b.dataset.iplik].ad} · ${IPLIK[b.dataset.iplik].orgu} · ${IPLIK[b.dataset.iplik].numara}`; });
  });
}

function baslat() {
  hareketUygula();
  $("#hareket").addEventListener("click", () => { hareket = !hareket; depo.koy("bi.hareket", hareket ? "acik" : "kapali"); hareketUygula(); });
  for (const [ad, f] of [["kumas", kumasArayuz], ["ucus", ucusKur], ["misafir", misafirKur]]) {
    try { f(); } catch (e) { console.error(ad, e); }
  }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
