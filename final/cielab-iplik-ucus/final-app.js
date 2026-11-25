
(function(){
"use strict";
var NS="http://www.w3.org/2000/svg";
var IPLIK=[
 ["lac","Lacivert çözgü","#1F2A44","başlık, çerçeve"],["ket","Ham keten","#E8DFCC","zemin dokusu"],["kin","Kına","#B5562B","A Blok, vurgu"],
 ["zey","Zeytin","#6B7A3A","tarım, yeşil alan"],["mar","Marmara mavisi","#2E6F8E","C Blok, deniz"],["saf","Safran","#E3A22B","B Blok, ışık"],
 ["gul","Gül kurusu","#C98B8B","moda"],["kom","Kömür","#2B2B2B","metin"],["fil","Fildişi","#F6F1E6","sayfa zemini"]];
var R={};IPLIK.forEach(function(x){R[x[0]]=x[2];});
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
var svg=document.getElementById("harita");
var defs=el("defs",{},svg);
function dokuma(id,zemin,cozgu,atki,ad){var p=el("pattern",{id:id,width:ad,height:ad,patternUnits:"userSpaceOnUse"},defs);
 el("rect",{width:ad,height:ad,fill:zemin},p);
 el("rect",{x:0,y:0,width:ad/2,height:ad/2,fill:cozgu,opacity:.55},p);el("rect",{x:ad/2,y:ad/2,width:ad/2,height:ad/2,fill:cozgu,opacity:.55},p);
 el("line",{x1:0,y1:ad/4,x2:ad,y2:ad/4,stroke:atki,"stroke-width":.7,opacity:.6},p);el("line",{x1:ad/4,y1:0,x2:ad/4,y2:ad,stroke:atki,"stroke-width":.7,opacity:.4},p);return "url(#"+id+")";}
var kara=dokuma("kara",R.ket,"#ddd2bb",R.fil,8), deniz=dokuma("deniz",R.mar,"#28627e","#5f95ad",10),
    yesil=dokuma("yesil","#7d8a4c",R.zey,"#97a465",9), sehir=dokuma("sehir","#d9ccb2","#cbbd9f",R.fil,6);
el("rect",{width:1200,height:800,fill:kara},svg);
el("path",{d:"M0 655 C120 630 210 672 330 650 S560 615 700 640 S930 690 1040 655 S1160 640 1200 650 L1200 800 L0 800 Z",fill:deniz},svg);
el("path",{d:"M0 655 C120 630 210 672 330 650 S560 615 700 640 S930 690 1040 655 S1160 640 1200 650",fill:"none",stroke:R.fil,"stroke-width":2.5,"stroke-dasharray":"9 6"},svg);
var yamalar=[["M150 90 L520 60 L560 250 L300 290 L130 240 Z",sehir],["M120 300 L420 280 L460 470 L200 520 L90 430 Z",sehir],
 ["M560 150 L860 120 L900 420 L620 450 L540 300 Z",sehir],["M600 470 L960 440 L1010 610 L640 625 Z",sehir],["M900 130 L1120 170 L1150 420 L930 410 Z",yesil],["M420 480 L590 470 L610 610 L430 630 Z",yesil]];
yamalar.forEach(function(y){el("path",{d:y[0],fill:y[1],stroke:R.lac,"stroke-width":1.6,"stroke-dasharray":"7 5","stroke-linejoin":"round"},svg);});
function yazi(x,y,t,boy,renk,kal){var e=el("text",{x:x,y:y,"font-family":"system-ui,Segoe UI,Arial,sans-serif","font-size":boy,"fill":renk,"font-weight":kal||600,"text-anchor":"middle"},svg);e.textContent=t;return e;}
yazi(1000,760,"MARMARA",26,R.fil,500).setAttribute("letter-spacing","10");
var bloklar=[{ad:"A",x:600,renk:R.kin},{ad:"B",x:660,renk:R.saf},{ad:"C",x:720,renk:R.mar}];
var CATI=250;
bloklar.forEach(function(b){var g=el("g",{},svg);
 el("rect",{x:b.x-22,y:CATI,width:44,height:170,fill:R.lac},g);el("rect",{x:b.x-22,y:CATI,width:44,height:8,fill:b.renk},g);
 for(var r=0;r<9;r++)for(var c=0;c<3;c++)el("rect",{x:b.x-15+c*12,y:CATI+18+r*17,width:6,height:9,fill:(r+c)%3?R.ket:R.saf,opacity:.85},g);
 yazi(b.x,CATI+192,b.ad+" Blok",15,R.lac,700);});
yazi(660,CATI-18,"Ataşehir Modern",17,R.lac,700);
var hedefler=[{ad:"Watergarden AVM",x:360,y:150,renk:R.kin,d:"M600 250 C560 160 470 120 360 150"},
 {ad:"Finanskent",x:250,y:390,renk:R.saf,d:"M660 250 C600 300 420 300 250 390"},
 {ad:"Maltepe miting ve konser alanı",x:800,y:660,renk:R.mar,d:"M720 250 C860 360 900 520 800 660"}];
var yollar=hedefler.map(function(h){
 var iz=el("path",{d:h.d,fill:"none",stroke:h.renk,"stroke-width":3.2,"stroke-dasharray":"10 7","stroke-linecap":"round",opacity:.35},svg);
 for(var i=0;i<3;i++)el("circle",{cx:h.x+(i-1)*7,cy:h.y,r:5,fill:h.renk,stroke:R.lac,"stroke-width":1.2},svg);
 el("circle",{cx:h.x,cy:h.y,r:17,fill:"none",stroke:h.renk,"stroke-width":2,"stroke-dasharray":"4 3"},svg);
 yazi(h.x,h.y-26,h.ad,16,R.lac,700);return iz;});
var kus=el("g",{opacity:0},svg);
el("path",{d:"M-18 0 L0 -12 L18 0 L0 6 Z",fill:R.kom},kus);el("path",{d:"M-16 0 L0 -9 L16 0",fill:"none",stroke:R.saf,"stroke-width":2},kus);el("circle",{cx:0,cy:-14,r:3.6,fill:R.gul},kus);
var dikis=el("path",{fill:"none","stroke-width":4,"stroke-linecap":"round"},svg);
var durum=document.getElementById("durum"), dugmeler=[].slice.call(document.querySelectorAll(".dugme button"));
var azHareket=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches, anim=0;
function uc(i){
 cancelAnimationFrame(anim);
 dugmeler.forEach(function(b,j){b.setAttribute("aria-pressed",String(i===j));});
 var p=yollar[i],h=hedefler[i],L=p.getTotalLength();
 dikis.setAttribute("d",h.d);dikis.setAttribute("stroke",h.renk);dikis.setAttribute("stroke-dasharray","10 7");
 durum.textContent=bloklar[i].ad+" Blok çatısından atladı → "+h.ad;
 var sure=azHareket?1:3200,t0=null;kus.setAttribute("opacity",1);
 function kare(t){if(t0===null)t0=t;var u=Math.min(1,(t-t0)/sure),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,s=e*L;
  var a=p.getPointAtLength(s),b=p.getPointAtLength(Math.min(L,s+1)),ac=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
  kus.setAttribute("transform","translate("+a.x.toFixed(1)+","+a.y.toFixed(1)+") rotate("+ac.toFixed(1)+")");
  dikis.style.strokeDasharray="10 7";dikis.setAttribute("stroke-dasharray",s.toFixed(1)+" "+L.toFixed(1));
  if(u<1)anim=requestAnimationFrame(kare);else{durum.textContent=bloklar[i].ad+" Blok → "+h.ad+": iniş tamam.";dikis.setAttribute("stroke-dasharray","10 7");}}
 anim=requestAnimationFrame(kare);}
dugmeler.forEach(function(b,i){b.addEventListener("click",function(){uc(i);});});

// iplik kartı: sRGB -> CIELAB (D65) ve CIEDE2000
function lin(c){c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function lab(hex){var r=lin(parseInt(hex.substr(1,2),16)),g=lin(parseInt(hex.substr(3,2),16)),b=lin(parseInt(hex.substr(5,2),16));
 var X=(0.4124564*r+0.3575761*g+0.1804375*b)/0.95047,Y=(0.2126729*r+0.7151522*g+0.0721750*b),Z=(0.0193339*r+0.1191920*g+0.9503041*b)/1.08883;
 function f(t){return t>216/24389?Math.cbrt(t):(24389/27*t+16)/116;}var fx=f(X),fy=f(Y),fz=f(Z);return [116*fy-16,500*(fx-fy),200*(fy-fz)];}
function de00(p,q){var d=Math.PI/180,L1=p[0],a1=p[1],b1=p[2],L2=q[0],a2=q[1],b2=q[2];
 var C1=Math.hypot(a1,b1),C2=Math.hypot(a2,b2),Cm=(C1+C2)/2,G=0.5*(1-Math.sqrt(Math.pow(Cm,7)/(Math.pow(Cm,7)+Math.pow(25,7))));
 var a1p=(1+G)*a1,a2p=(1+G)*a2,C1p=Math.hypot(a1p,b1),C2p=Math.hypot(a2p,b2);
 function hp(a,b){if(a===0&&b===0)return 0;var h=Math.atan2(b,a)/d;return h<0?h+360:h;}
 var h1=hp(a1p,b1),h2=hp(a2p,b2),dL=L2-L1,dC=C2p-C1p,dh=0;
 if(C1p*C2p!==0){dh=h2-h1;if(dh>180)dh-=360;else if(dh<-180)dh+=360;}
 var dH=2*Math.sqrt(C1p*C2p)*Math.sin(dh*d/2),Lm=(L1+L2)/2,Cmp=(C1p+C2p)/2,hm=h1+h2;
 if(C1p*C2p!==0){if(Math.abs(h1-h2)>180)hm=(h1+h2<360)?(h1+h2+360)/2:(h1+h2-360)/2;else hm=(h1+h2)/2;}
 var T=1-0.17*Math.cos((hm-30)*d)+0.24*Math.cos(2*hm*d)+0.32*Math.cos((3*hm+6)*d)-0.20*Math.cos((4*hm-63)*d);
 var dth=30*Math.exp(-Math.pow((hm-275)/25,2)),Rc=2*Math.sqrt(Math.pow(Cmp,7)/(Math.pow(Cmp,7)+Math.pow(25,7)));
 var SL=1+0.015*Math.pow(Lm-50,2)/Math.sqrt(20+Math.pow(Lm-50,2)),SC=1+0.045*Cmp,SH=1+0.015*Cmp*T,RT=-Math.sin(2*dth*d)*Rc;
 return Math.sqrt(Math.pow(dL/SL,2)+Math.pow(dC/SC,2)+Math.pow(dH/SH,2)+RT*(dC/SC)*(dH/SH));}
var tb=document.querySelector("#tablo tbody"),renkSec=document.getElementById("renk"),onceki=null;
renkSec.appendChild(new Option("Seçilmedi",""));
IPLIK.forEach(function(x){var L=lab(x[2]),tr=document.createElement("tr");
 var hucre=[null,x[1],x[2],L[0].toFixed(1),L[1].toFixed(1),L[2].toFixed(1),onceki?de00(onceki,L).toFixed(1):"—",x[3]];
 hucre.forEach(function(v,i){var td=document.createElement("td");if(i===0){var s=document.createElement("div");s.className="numune";s.style.background=x[2];td.appendChild(s);}else td.textContent=v;tr.appendChild(td);});
 tb.appendChild(tr);onceki=L;renkSec.appendChild(new Option(x[1]+" ("+x[2]+")",x[1]+" "+x[2]));});

// randevu talep kartı (sunucuya hiçbir şey gönderilmez)
var gun=document.getElementById("gun"),bugun=new Date();gun.min=bugun.toISOString().slice(0,10);
function ozet(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(36).toUpperCase().padStart(7,"0").slice(-7);}
document.getElementById("form").addEventListener("submit",function(e){e.preventDefault();
 var v=function(id){return document.getElementById(id).value;};
 var govde=["Hizmet: "+v("hizmet"),"Blok: "+v("blok"),"Gün: "+v("gun"),"Zaman aralığı: "+v("aralik"),"Biçim: "+v("bicim"),"Renk: "+(v("renk")||"—"),"Not: "+(v("not").trim()||"—")].join("\n");
 var kod="BIY-"+v("gun").replace(/-/g,"")+"-"+ozet(govde);
 var k=document.getElementById("talep");k.style.display="block";
 k.textContent="RANDEVU TALEBİ "+kod+"\n"+govde+"\n\nDurum: talep oluşturuldu, henüz bir hizmet sağlayıcıya iletilmedi.\nBu kartı kopyalayıp terzinize ya da tarım danışmanınıza gönderin.";});
})();

