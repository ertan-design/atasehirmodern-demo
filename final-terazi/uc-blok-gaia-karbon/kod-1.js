const FABRICS=[{"kod":"PANTONE 13-1008 TCX","ad":"Bleached Linen · Ham Keten","hex":"#E8DEC8","cuzgu_hex":"#EFE7D6","atki_hex":"#DDD0B6","lab":"L*88.4 a*+1.2 b*+11.8","orgu":"1/1 Bezayağı Doğal Slub Keten","iplik_no":"Nm 26/1 Belçika & Trakya Keten Lifi","siklik":"22 çözgü × 19 atkı tel/cm · 215 g/m²","bukum":"520 TPM Z-Büküm","kullanim":"Yazlık Ceket, Salon Güneşlik Perde & Tuval Bezi"},{"kod":"PANTONE 19-3924 TCX","ad":"Night Sky · Gece Çiviti İpek (Siyah İkamesi)","hex":"#232F46","cuzgu_hex":"#2D3D5B","atki_hex":"#1B2438","lab":"L*20.1 a*+1.8 b*-16.4","orgu":"5'li Saten Dokuma Bursa Koza Ham İpek","iplik_no":"20/22 Denier Dut İpeği · 19 Momme","siklik":"58 çözgü × 42 atkı tel/cm · 82 g/m²","bukum":"180 TPM S-Büküm (Yüksek Anizotropik Parlaklık)","kullanim":"Saf Siyah Yerine Gece Elbisesi, Smokin Yaka & Akşam Drape"},{"kod":"PANTONE 16-0948 TCX","ad":"Harvest Gold · Hasat Kehribarı İpek-Yün","hex":"#C8923B","cuzgu_hex":"#D8A44E","atki_hex":"#B07B28","lab":"L*63.7 a*+12.4 b*+48.2","orgu":"2/2 Dimi (Twill) Diyagonal Kabartma","iplik_no":"Nm 48/2 Anadolu Merinos + Yabani Tussah İpeği","siklik":"34 çözgü × 28 atkı tel/cm · 260 g/m²","bukum":"640 TPM Çift Kat Büküm","kullanim":"Sonbahar Trençkot, AFAIR Galeri Koltuk Döşemesi"},{"kod":"PANTONE 18-5616 TCX","ad":"Posy Green · Marmara Çam & Adaçayı Kadife","hex":"#2E5A4E","cuzgu_hex":"#3B7062","atki_hex":"#22453B","lab":"L*35.8 a*-18.6 b*+2.9","orgu":"Kesik Havlı İpek-Pamuk Kadife","iplik_no":"Ne 60/2 Ege Uzun Elyaf Organik Pamuk","siklik":"40 çözgü × 36 atkı tel/cm · 340 g/m²","bukum":"710 TPM Z-Büküm","kullanim":"Kruvaze Kışlık Ceket, Akustik Duvar Paneli"},{"kod":"PANTONE 19-2428 TCX","ad":"Magenta Plum · Mürdüm Kökboya Kaşmir","hex":"#5B2947","cuzgu_hex":"#703458","atki_hex":"#461E36","lab":"L*24.9 a*+24.1 b*-6.8","orgu":"Balıksırtı (Herringbone) İnce Kaşmir","iplik_no":"15.5 Mikron İç Moğolistan & Van Kaşmir Harmanı","siklik":"29 çözgü × 26 atkı tel/cm · 290 g/m²","bukum":"490 TPM S-Büküm","kullanim":"Omuz Kalıplı Manto, Şal & Yatak Başı Tekstili"},{"kod":"PANTONE 16-1432 TCX","ad":"Terracotta Clay · Kiremit Toprak Bukle","hex":"#B86B52","cuzgu_hex":"#CA7B61","atki_hex":"#9E563F","lab":"L*52.6 a*+25.3 b*+24.7","orgu":"Üç Boyutlu Bukle (Bouclé) Dokuma","iplik_no":"Nm 14/2 Bükümlü Fantazi Yün-Keten","siklik":"16 çözgü × 14 atkı tel/cm · 380 g/m²","bukum":"390 TPM Gevşek İlnekli","kullanim":"Atölye Ceket, Dokulu Kırlent & Berjer"},{"kod":"PANTONE 15-4717 TCX","ad":"Aqua Sky · Boğaz & Wingsuit Gökyüzü Poplin","hex":"#5A9BB0","cuzgu_hex":"#6EB0C6","atki_hex":"#478498","lab":"L*61.8 a*-15.2 b*-14.9","orgu":"Sık Dokuma Nefes Alan Gömleklik Poplin","iplik_no":"Ne 80/2 Söke Giza-Kalite Pamuk","siklik":"52 çözgü × 34 atkı tel/cm · 125 g/m²","bukum":"820 TPM Merserize","kullanim":"Özel Dikim Gömlek, Rüzgâr Geçirmez İç Astar"},{"kod":"PANTONE 17-1518 TCX","ad":"Old Rose · Gül Kurusu Ham İpek Organze","hex":"#B07A7E","cuzgu_hex":"#C48B90","atki_hex":"#986569","lab":"L*55.4 a*+16.8 b*+3.4","orgu":"Şeffaf Sert Bükümlü Organze","iplik_no":"14/16 Denier Çift Kat Bükümlü İpek","siklik":"44 çözgü × 40 atkı tel/cm · 48 g/m²","bukum":"1400 TPM Yüksek Büküm","kullanim":"Katmanlı Drape, Abajur & Işık Difüzörü"}];
const ROUTES=[{"id":"BLOK_A_FLEX","kule":"Blok A · Flex Kule (43 Kat)","adres":"Atatürk Mah. Ahmet Yesevi Cad. Gülnihal Sok., Ataşehir","cati_m":148,"yon":"Batı-Kuzeybatı · 288° Azimut","hedef":"Watergarden AVM & Havuz Sahnesi","mesafe_km":1.15,"ucus_sn":24,"hiz_kmh":172,"renk_pantone":"PANTONE 16-0948 TCX","hex":"#C8923B","yasam_baglantisi":"Moda & Sanat Rotası: afair.studio sergi salonu, su-ışık sahnesi, akşam gastronomisi ve AFAIR terzi kumaş teslim noktası.","site_kapi":"https://www.afair.studio/afair-studio-vitrin.html"},{"id":"BLOK_B_BALANCE","kule":"Blok B · Balance Kule (35 Kat)","adres":"Atatürk Mah. Ahmet Yesevi Cad., Ataşehir","cati_m":121,"yon":"Kuzeydoğu · 018° Azimut","hedef":"Finanskent / İstanbul Finans Merkezi (İFM)","mesafe_km":1.65,"ucus_sn":31,"hiz_kmh":188,"renk_pantone":"PANTONE 15-4717 TCX","hex":"#5A9BB0","yasam_baglantisi":"Fırsat & Elektronik Rotası: Toiji 17-domain fırsat radarı, Pureaker 3B ekran & akıllı daire otomasyonu, finans ve girişim kulübü.","site_kapi":"https://toiji.com/"},{"id":"BLOK_C_GRAND","kule":"Blok C · Grand Kule (25 Kat)","adres":"Atatürk Mah. Gülnihal Sok., Ataşehir","cati_m":88,"yon":"Güneybatı · 204° Azimut","hedef":"Maltepe Sahil Miting & Konser Alanı (Marmara Kıyısı)","mesafe_km":6.4,"ucus_sn":68,"hiz_kmh":164,"renk_pantone":"PANTONE 18-5616 TCX","hex":"#2E5A4E","yasam_baglantisi":"Sahil, Konser & Spor Rotası: Orhangazi Şehir Parkı açık hava konser sahnesi, Prens Adaları ufku, Gospor tek-çizgi koşu ve yelken hattı.","site_kapi":"https://www.gospor.com/"},{"id":"UST_HALKA_ISTANBUL","kule":"Üst Halka · Termik Yükseliş (+420 m)","adres":"Başka İstanbul Yok · İki Kıta Tek İplik","cati_m":420,"yon":"360° Panoramik İstanbul Kaytan Halkası","hedef":"Başka İstanbul Yok (Sultanahmet ⇄ Ortaköy Kaytan & Çekmeköy Hüseyinbey Rölöve)","mesafe_km":14.8,"ucus_sn":95,"hiz_kmh":196,"renk_pantone":"PANTONE 19-2428 TCX","hex":"#5B2947","yasam_baglantisi":"Üst Halka: 7×11 Kaytan kültür rotası, Çekmeköy Hüseyinbey 1238 cm cepheli Sakinler Kahvesi (Zehra Barista) ve Gökçeada tarım köprüsü.","site_kapi":"https://ertanaraz.com/tarim"}];
let curFab=0, curRoute=0, flyT=0, camYaw=0, dragging=false, lastX=0;
const $=id=>document.getElementById(id);

function hexToRgb(h){
  const n=parseInt(h.slice(1),16);
  return [(n>>16)&255,(n>>8)&255,n&255];
}

// --- 1. GERÇEK ATKI-ÇÖZGÜ (WARP/WEFT) PANTONE İPLİK DOKUMA RENDERER ---
function paintWeaveCanvas(cv, fab, zoom, sunDeg, cursorX=0.5){
  const ctx=cv.getContext('2d'), w=cv.width, h=cv.height;
  const img=ctx.createImageData(w,h), d=img.data;
  const warp=hexToRgb(fab.cuzgu_hex), weft=hexToRgb(fab.atki_hex);
  const sunRad=sunDeg*Math.PI/180;
  const isTwill=fab.orgu.includes('Dimi')||fab.orgu.includes('Balıksırtı');
  const isSatin=fab.orgu.includes('Saten');
  const pitch=Math.max(4, Math.round(zoom));

  for(let y=0;y<h;y++){
    const wy=Math.floor(y/pitch), fy=(y%pitch)/pitch;
    const slubY=1+0.05*Math.sin(wy*1.7);
    for(let x=0;x<w;x++){
      const wx=Math.floor(x/pitch), fx=(x%pitch)/pitch;
      let warpUp;
      if(isTwill) warpUp=((wx+wy)%4)<2;
      else if(isSatin) warpUp=((wx*2+wy)%5)!==0;
      else warpUp=((wx+wy)%2)===0;

      const cyl = warpUp ? Math.sin(fx*Math.PI) : Math.sin(fy*Math.PI);
      const twist = 0.07*Math.sin((fx*6 + fy*6)*(warpUp?1:-1)*Math.PI);
      const sheenDist = Math.abs((x/w)-cursorX);
      const aniso = isSatin ? Math.max(0, 0.22*(1-sheenDist*2.2))*Math.sin(sunRad) : 0.08*Math.sin(sunRad);
      const shade = (0.66 + 0.36*cyl + twist + aniso)*slubY;
      const base = warpUp ? warp : weft;
      // Saf siyah yasagi: her kanal en az 24!
      const idx=(y*w+x)*4;
      d[idx]   = Math.max(24, Math.min(252, Math.round(base[0]*shade)));
      d[idx+1] = Math.max(26, Math.min(250, Math.round(base[1]*shade)));
      d[idx+2] = Math.max(34, Math.min(248, Math.round(base[2]*shade)));
      d[idx+3] = 255;
    }
  }
  ctx.putImageData(img,0,0);
}

function initSwatches(){
  $('swatchGrid').innerHTML=FABRICS.map((f,i)=>`
    <div class="swatch ${i===curFab?'active':''}" id="sw_${i}" data-fo10="">
      <canvas id="swCv_${i}" width="180" height="92"></canvas>
      <div class="swatch-meta"><b>${f.kod}</b><span>${f.ad}</span></div>
    </div>`).join('');
  drawAllFabrics();
}

function drawAllFabrics(){
  const sun=parseInt($('sunRng').value,10);
  $('sunVal').textContent=sun+'°';
  FABRICS.forEach((f,i)=>{
    const cv=$('swCv_'+i);
    if(cv) paintWeaveCanvas(cv, f, 6, sun, 0.45);
  });
  drawLoupe(0.5);
}

function pickFabric(i){
  curFab=i;
  document.querySelectorAll('.swatch').forEach((el,k)=>el.classList.toggle('active',k===i));
  drawLoupe(0.5);
  updateResident();
}

function drawLoupe(cx=0.5){
  const f=FABRICS[curFab], zm=parseInt($('zmRng').value,10), sun=parseInt($('sunRng').value,10);
  $('zmVal').textContent=zm+'x';
  $('lpTitle').textContent=f.ad;
  $('lpCode').textContent=f.kod+' · '+f.hex;
  paintWeaveCanvas($('loupeCv'), f, zm, sun, cx);
  const specs=[
    ['Örgü Yapısı', f.orgu],
    ['İplik & Lif Kökeni', f.iplik_no],
    ['Sıklık & Gramaj', f.siklik],
    ['Büküm & Spektrum', f.bukum+' · '+f.lab],
    ['Mimari & Terzi Kullanımı', f.kullanim],
    ['Kromatik Kural', 'Saf Siyah Yok · Gerçek Atkı-Çözgü']
  ];
  $('lpSpecs').innerHTML=specs.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}

$('loupeCv').addEventListener('mousemove', e=>{
  const r=e.target.getBoundingClientRect();
  drawLoupe((e.clientX-r.left)/Math.max(1,r.width));
});

// --- 2. SIFIR GOOGLE MAPS: 3B İPLİK-UFUK & ATAŞEHİR 3-BLOK WINGSUIT UÇUŞ SAHNESİ ---
function initTowers(){
  $('towerList').innerHTML=ROUTES.map((r,i)=>`
    <button class="tbtn ${i===curRoute?'active':''}" id="rt_${i}" data-fo11="">
      <small>${r.kule} · Çatı +${r.cati_m}m</small>
      <strong>➔ ${r.hedef} (${r.mesafe_km} km)</strong>
      <span>${r.yasam_baglantisi}</span>
    </button>`).join('');
}

function selectRoute(i){
  curRoute=i; flyT=0.02;
  document.querySelectorAll('.tbtn').forEach((el,k)=>el.classList.toggle('active',k===i));
}
function relaunchFlight(){ flyT=0.0; }

const skyCv=$('skyLoom');
skyCv.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;});
window.addEventListener('pointerup',()=>dragging=false);
window.addEventListener('pointermove',e=>{if(dragging){camYaw+=(e.clientX-lastX)*0.005;lastX=e.clientX;}});

function proj3D(x,y,z,w,h){
  const cy=Math.cos(camYaw), sy=Math.sin(camYaw);
  const rx=x*cy - z*sy, rz=x*sy + z*cy + 520;
  const fov=480/Math.max(90,rz);
  return [w*0.5 + rx*fov, h*0.64 - y*fov, fov, rz];
}

function renderSkyLoom(){
  const ctx=skyCv.getContext('2d'), w=skyCv.width, h=skyCv.height;
  // Gökyüzü keten-ufuk gradyanı (Sıfır karo harita!)
  const grd=ctx.createLinearGradient(0,0,0,h);
  grd.addColorStop(0,'#dfeaf0'); grd.addColorStop(0.58,'#efe7d6'); grd.addColorStop(1,'#ded3be');
  ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);

  // Marmara Denizi & Boğaz İplik Çizgileri (Güney ve Batı Ufku)
  for(let row=-260; row<=280; row+=22){
    ctx.beginPath();
    ctx.strokeStyle = row>110 ? 'rgba(60,125,147,0.34)' : 'rgba(184,125,43,0.22)';
    ctx.lineWidth = row>110 ? 1.5 : 1.0;
    for(let x=-380; x<=380; x+=24){
      const wave = row>110 ? Math.sin(x*0.03 + flyT*8)*4 : Math.cos(x*0.02)*10 + Math.sin(row*0.03)*8;
      const [px,py]=proj3D(x, wave-28, row, w, h);
      if(x===-380) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.stroke();
  }

  // 4 Hedef Bölge Plakası (Watergarden Batı, Finanskent Kuzeydoğu, Maltepe Güney, Üst Halka Boğaz)
  const dest3D=[[-230,-22,-40,'Watergarden AVM'],[195,-20,-150,'Finanskent / İFM'],[-95,-26,230,'Maltepe Sahil Konser'],[15,125,-210,'Üst Halka · Başka İstanbul Yok']];
  dest3D.forEach(([dx,dy,dz,lbl],idx)=>{
    const [px,py,sc]=proj3D(dx,dy,dz,w,h);
    ctx.fillStyle = idx===curRoute ? ROUTES[idx].hex : '#2c3952';
    ctx.beginPath(); ctx.arc(px,py,Math.max(5,12*sc),0,Math.PI*2); ctx.fill();
    ctx.font='600 12px Georgia,serif';
    ctx.fillText('✦ '+lbl, px+10, py+4);
  });

  // Ataşehir Modern 3 Kule (Flex 43K, Balance 35K, Grand 25K) 3B Prizma Çizimi
  const towers=[[-34,132,0,'Flex 43K','#b87d2b'],[8,108,-18,'Balance 35K','#3c7d93'],[46,80,14,'Grand 25K','#2e5a4e']];
  towers.forEach(([tx,th,tz,tlbl,tclr],ti)=>{
    const [bx,by,bsc]=proj3D(tx,-26,tz,w,h);
    const [rx,ry,rsc]=proj3D(tx,th-26,tz,w,h);
    const tw=Math.max(14,28*bsc);
    ctx.fillStyle = ti===curRoute ? tclr : '#39465e';
    ctx.fillRect(rx-tw*0.5, ry, tw, by-ry);
    ctx.strokeStyle='#f6f1e7'; ctx.lineWidth=1;
    for(let fy=ry+8; fy<by-4; fy+=7){ ctx.beginPath(); ctx.moveTo(rx-tw*0.4,fy); ctx.lineTo(rx+tw*0.4,fy); ctx.stroke(); }
    ctx.fillStyle='#1f283b'; ctx.font='700 11px ui-monospace,monospace';
    ctx.fillText(tlbl, rx-24, ry-8);
  });

  // Aktif Çatıdan Hedefe Gaia Wingsuit Halkaları & Süzülen Karakter
  const startT = curRoute<3 ? towers[curRoute] : [8,132,-10];
  const endD = dest3D[curRoute];
  const p0=[startT[0], startT[1]-24, startT[2]], p2=[endD[0], endD[1]+8, endD[2]];
  const p1=[(p0[0]+p2[0])*0.5, Math.max(p0[1],p2[1])+55, (p0[2]+p2[2])*0.5];

  const bez=(t)=>[
    (1-t)*(1-t)*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],
    (1-t)*(1-t)*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1],
    (1-t)*(1-t)*p0[2]+2*(1-t)*t*p1[2]+t*t*p2[2]
  ];

  // Uçuş İpliği
  ctx.beginPath(); ctx.strokeStyle=ROUTES[curRoute].hex; ctx.lineWidth=2.4;
  for(let s=0;s<=30;s++){
    const [qx,qy]=proj3D(...bez(s/30),w,h);
    if(s===0) ctx.moveTo(qx,qy); else ctx.lineTo(qx,qy);
  }
  ctx.stroke();

  // Parlayan Gaia Gökyüzü Halkaları (Genie MP4 referansı!)
  [0.22,0.48,0.74].forEach(rt=>{
    const [hx,hy,hsc]=proj3D(...bez(rt),w,h);
    ctx.strokeStyle='#3c7d93'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.ellipse(hx,hy,Math.max(8,20*hsc),Math.max(12,28*hsc),0.2,0,Math.PI*2); ctx.stroke();
  });

  // Wingsuit Karakteri (Mavi Kanat + Sarı Kask)
  const [fx,fy,fsc]=proj3D(...bez(flyT),w,h);
  ctx.save(); ctx.translate(fx,fy);
  ctx.fillStyle='#2b6cb0';
  ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(-18,8); ctx.lineTo(0,4); ctx.lineTo(18,8); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#ecc94b'; ctx.beginPath(); ctx.arc(0,-6,4.5,0,Math.PI*2); ctx.fill();
  ctx.restore();

  flyT += 0.0042; if(flyT>1) flyT=0.0;
  const curAlt = Math.max(4, Math.round(ROUTES[curRoute].cati_m*(1-flyT*0.92)));
  $('flightTele').innerHTML=`<b>${ROUTES[curRoute].kule}</b> ➔ <b>${ROUTES[curRoute].hedef}</b> · İrtifa: <code>+${curAlt}m</code> · Hız: <code>${ROUTES[curRoute].hiz_kmh} km/sa</code> · Yön: <code>${ROUTES[curRoute].yon}</code>`;
  requestAnimationFrame(renderSkyLoom);
}

// --- 3. YENİ TAŞINAN KOMŞU 4-SİTE HESAPLAYICISI ---
function updateResident(){
  const bi=parseInt($('resBlock').value,10), fl=Math.min(43,Math.max(1,parseInt($('resFloor').value||'18',10)));
  const wall=parseInt($('wallRng').value,10), fab=FABRICS[curFab];
  $('wallVal').textContent=wall;
  const wind=(2.1 + fl*0.09).toFixed(1);
  const sunH = bi===2 ? '7,2 saat Marmara güneşi' : (bi===0 ? '5,8 saat öğleden sonra güneşi' : '4,6 saat dingin sabah ışığı');
  const plants = bi===2 ? 'Bodur Gemlik Zeytini, Gökçeada Lavantası ve Biberiye' : (bi===0 ? 'Limon Selvisi, Kekik ve Yediveren Çilek' : 'Defne, Adaçayı ve Gölgeye Dayanıklı Kamelya');

  $('tailorDesc').innerHTML=`<b>Kat ${fl}</b> daireniz için seçili kumaş: <b>${fab.kod} (${fab.ad})</b>. Usta terzimiz iki mezura ve gerçek iplik kartelasıyla bugün 18 dakika mesafedeki Ataşehir atölyesinden dairenize çıkabilir.`;
  $('agroDesc').innerHTML=`<b>Kat ${fl}</b> mikro-iklim ölçümü: rüzgâr <b>${wind} m/sn</b>, <b>${sunH}</b>. Önerilen teras dikimi: <b>${plants}</b> (pH 6,7 rüzgâr ağırlıklı pomza-torf harcı).`;
  const artW=Math.round(wall*0.62), artH=Math.round(artW*0.62);
  $('artDesc').innerHTML=`Hüseyinbey DXF rölöve standardında (<code>H: 288 cm</code> tavan, <code>${wall} cm</code> duvar) altın oran tablo ölçünüz: <b>${artW} × ${artH} cm</b>; eşlikçi perde dokusu: <b>${fab.kod}</b> (${fab.siklik}).`;
}

function bookService(id,msg){ $(id).textContent=msg; }

initSwatches();
initTowers();
updateResident();
renderSkyLoom();
