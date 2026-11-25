
// 1) OZGUN 3-BLOK UCUS MOTORU (0 Google Maps, 60fps Canvas)
var fc=document.getElementById("flightCanvas"), fctx=fc.getContext("2d");
var rotalar=[
  {ad:"BLOK A → WATERGARDEN AVM & SANAT VADİSİ",irtifa:"148m",renk:"#5be4a8",bx:210,by:250,tx:95,ty:120,cx:120,cy:75},
  {ad:"BLOK B → FİNANSKENT FIRSATLAR & 50K KAPI",irtifa:"172m",renk:"#e6c27a",bx:375,by:235,tx:410,ty:85,cx:430,cy:125},
  {ad:"BLOK C → MALTEPE SAHİL & KONSER ALANI",irtifa:"136m",renk:"#78c0ff",bx:540,by:255,tx:675,ty:140,cx:640,cy:80},
  {ad:"ÜST HALKA → BASKAISTANBULYOK.COM (3 ROTA SENKRON)",irtifa:"320m",renk:"#f4efe6",bx:375,by:235,tx:375,ty:55,cx:375,cy:120}
];
var aktifRota=0, tAnim=0;
function ucusSec(i,el){
  aktifRota=i; tAnim=0;
  document.querySelectorAll(".route-card").forEach(function(c){c.classList.remove("active");});
  if(el) el.classList.add("active");
  document.getElementById("flightHud").textContent="ROTA: "+rotalar[i].ad+" · İRTİFA: "+rotalar[i].irtifa;
}
function qBez(p0,p1,p2,t){return (1-t)*(1-t)*p0+2*(1-t)*t*p1+t*t*p2;}
function ucusCiz(){
  var w=fc.width, h=fc.height;
  fctx.clearRect(0,0,w,h);
  // Gece ufuk gradyani + ust halka baskaistanbulyok.com yorungesi
  var g=fctx.createRadialGradient(w/2,h*0.75,40,w/2,h*0.5,460);
  g.addColorStop(0,"#181c30"); g.addColorStop(1,"#07080d");
  fctx.fillStyle=g; fctx.fillRect(0,0,w,h);
  fctx.strokeStyle="rgba(214,180,114,0.18)"; fctx.lineWidth=1.2;
  fctx.beginPath(); fctx.ellipse(w/2,225,345,155,0,0,Math.PI*2); fctx.stroke();
  fctx.fillStyle="rgba(214,180,114,0.55)"; fctx.font="11px Consolas,monospace";
  fctx.fillText("ÜST HALKA · BASKAISTANBULYOK.COM",w/2-112,56);

  // 3 Ufuk Hedefi
  var hedefler=[[95,120,"WATERGARDEN","#5be4a8"],[410,85,"FİNANSKENT","#e6c27a"],[675,140,"MALTEPE SAHİL","#78c0ff"]];
  hedefler.forEach(function(hd){
    fctx.fillStyle=hd[3]; fctx.beginPath(); fctx.arc(hd[0],hd[1],6,0,Math.PI*2); fctx.fill();
    fctx.fillStyle="rgba(244,239,230,0.8)"; fctx.fillText(hd[2],hd[0]-36,hd[1]-12);
  });

  // 3 Modern Blok (Atasehir Modern)
  var bloklar=[[185,250,50,120,"BLOK A"],[350,235,52,135,"BLOK B"],[515,255,50,115,"BLOK C"]];
  bloklar.forEach(function(b,bi){
    var act=(aktifRota===bi||aktifRota===3);
    fctx.fillStyle=act?"#23253b":"#151726";
    fctx.strokeStyle=act?"#d6b472":"rgba(214,180,114,0.28)";
    fctx.lineWidth=act?2:1;
    fctx.fillRect(b[0],b[1],b[2],b[3]); fctx.strokeRect(b[0],b[1],b[2],b[3]);
    fctx.fillStyle="#d6b472"; fctx.fillText(b[4],b[0]+6,b[1]+b[3]+16);
  });

  // Ucus yaylari + suzulen karakter isigi
  tAnim=(tAnim+0.008)%1;
  var cizilecek=aktifRota===3?[0,1,2]:[aktifRota];
  cizilecek.forEach(function(ri){
    var r=rotalar[ri];
    fctx.strokeStyle=r.renk; fctx.lineWidth=2.2; fctx.setLineDash([5,5]);
    fctx.beginPath(); fctx.moveTo(r.bx,r.by); fctx.quadraticCurveTo(r.cx,r.cy,r.tx,r.ty); fctx.stroke();
    fctx.setLineDash([]);
    var px=qBez(r.bx,r.cx,r.tx,tAnim), py=qBez(r.by,r.cy,r.ty,tAnim);
    fctx.fillStyle=r.renk; fctx.beginPath(); fctx.arc(px,py,5.5,0,Math.PI*2); fctx.fill();
    fctx.fillStyle="rgba(255,255,255,0.28)"; fctx.beginPath(); fctx.arc(px,py,13,0,Math.PI*2); fctx.fill();
  });
  requestAnimationFrame(ucusCiz);
}
ucusCiz();

// 2) PANTONE TCX GERCEK KUMAS / IPLIK MIKRO-DOKUMA SHADERI
var kumaslar=[
  {code:"PANTONE 19-5420 TCX",ad:"Derin Zümrüt İpek",warp:[11,93,75],weft:[22,126,102],gsm:"19 Momme",lif:"Mulberry İpek · Saten Parlaklık"},
  {code:"PANTONE 18-1442 TCX",ad:"Yanık Toprak Keten",warp:[184,93,59],weft:[150,74,47],gsm:"210 GSM",lif:"Belçika Keteni · Mat Doğal Lif"},
  {code:"PANTONE 11-0604 TCX",ad:"Kaymaktaşı Merinos",warp:[243,236,225],weft:[216,206,190],gsm:"260 GSM",lif:"Super 150s Merinos · Sıcak Doku"},
  {code:"PANTONE 19-4024 TCX",ad:"Gece Çiviti Kaşmir",warp:[22,34,56],weft:[38,54,84],gsm:"310 GSM",lif:"Çift Kat Kaşmir · Derin Siyah Alternatifi"}
];
var aktifKumas=0;
function kumasSec(i,el){
  aktifKumas=i;
  document.querySelectorAll(".swatch").forEach(function(s){s.classList.remove("active");});
  if(el) el.classList.add("active");
  dokumaCiz();
}
function dokumaCiz(){
  var wc=document.getElementById("weaveCanvas"), ctx=wc.getContext("2d");
  var z=+document.getElementById("zoomRng").value||4;
  var lk=+document.getElementById("lightSel").value||3000;
  document.getElementById("zoomVal").textContent=z+"×";
  var k=kumaslar[aktifKumas], step=z*4, w=wc.width, h=wc.height;
  var tint=lk===3000?[1.06,1.01,0.92]:(lk===5500?[0.97,1.01,1.07]:[1,1,1]);
  ctx.fillStyle="#07070c"; ctx.fillRect(0,0,w,h);
  for(var y=0;y<h;y+=step){
    for(var x=0;x<w;x+=step){
      var over=((Math.floor(x/step)+Math.floor(y/step))%2===0);
      var base=over?k.warp:k.weft;
      var grain=((x*13+y*7)%17)-8;
      var r=Math.min(255,Math.max(0,Math.round((base[0]+grain)*tint[0])));
      var g=Math.min(255,Math.max(0,Math.round((base[1]+grain)*tint[1])));
      var b=Math.min(255,Math.max(0,Math.round((base[2]+grain)*tint[2])));
      ctx.fillStyle="rgb("+r+","+g+","+b+")";
      if(over){ ctx.fillRect(x+1,y,step-2,step); }
      else{ ctx.fillRect(x,y+1,step,step-2); }
      ctx.fillStyle="rgba(255,255,255,0.09)";
      ctx.fillRect(x+2,y+2,Math.max(1,step/3),Math.max(1,step/3));
    }
  }
  document.getElementById("weaveMeta").textContent=k.code+" · "+k.ad+" | "+k.gsm+" | "+k.lif+" | Işık: "+lk+"K · Büyütme: "+z+"×";
}
dokumaCiz();

function slotSec(tip,metin,el){
  el.parentNode.querySelectorAll(".slot-btn").forEach(function(b){b.classList.remove("sel");});
  el.classList.add("sel");
  document.getElementById(tip+"Out").textContent=(tip==="terzi"?"SEÇİLİ SLOT: ":"SEÇİLİ RANDEVU: ")+metin+" · ONAYA HAZIR";
}
