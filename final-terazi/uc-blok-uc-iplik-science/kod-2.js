'use strict';
const V=JSON.parse(document.getElementById('veri').textContent);
const az=matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS='http://www.w3.org/2000/svg',$=id=>document.getElementById(id);
const s=(t,a)=>{const n=document.createElementNS(NS,t);for(const k in a)n.setAttribute(k,a[k]);return n};
const el=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!==undefined)n.textContent=x;return n};
const tr=x=>String(x).replace('.',',');
/* blocks */
const B=[{x:520,h:250},{x:600,h:300},{x:680,h:220}],ZEMIN=600;
B.forEach(b=>{$('bloklar').append(s('rect',{class:'blok',x:b.x-26,y:ZEMIN-b.h,width:52,height:b.h}));
 for(let y=ZEMIN-b.h+14;y<ZEMIN-10;y+=18)for(const dx of[-16,-4,8])$('bloklar').append(s('rect',{class:'blok-cam',x:b.x+dx,y,width:8,height:9}))});
$('bloklar').append(s('rect',{x:440,y:ZEMIN,width:320,height:4,fill:'#1F2A44'}));
/* threads from roofs to ring */
const R=395,CX=600,CY=450,yollar=[];
V.yonler.forEach((h,i)=>{const b=B[i],a=h.aci*Math.PI/180,tx=CX+R*Math.cos(a),ty=CY+R*Math.sin(a),sx=b.x,sy=ZEMIN-b.h;
 const c1x=sx+(tx-sx)*.2,c1y=sy-140,c2x=tx-(tx-CX)*.25,c2y=ty-(ty-CY)*.25-60;
 const p=s('path',{class:'ip'+(az?'':' ciz'),d:`M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}`,stroke:h.renk});$('ipler').append(p);yollar.push(p);
 const g=s('g',{class:'hedef'});g.append(s('circle',{cx:tx,cy:ty,r:13}));g.append(s('circle',{cx:tx,cy:ty,r:6,fill:h.renk,stroke:'none'}));
 const lx=tx+(tx>=CX?22:-22),an=tx>=CX?'start':'end',t1=s('text',{x:lx,y:ty-4,'text-anchor':an});t1.textContent=h.ad;
 const t2=s('text',{class:'alt',x:lx,y:ty+15,'text-anchor':an});t2.textContent=h.alt;g.append(t1,t2);$('hedefler').append(g)});
/* glider along threads in turn */
const u=$('ucan');let k=0,t0=performance.now();
function uc(t){const p=yollar[k],L=p.getTotalLength(),f=Math.min(1,(t-t0)/4200),q=p.getPointAtLength(f*L),q2=p.getPointAtLength(Math.min(L,f*L+2));
 const ang=Math.atan2(q2.y-q.y,q2.x-q.x)*180/Math.PI;u.setAttribute('transform',`translate(${q.x},${q.y}) rotate(${ang})`);
 if(f>=1){k=(k+1)%yollar.length;t0=t}requestAnimationFrame(uc)}
if(az){const p=yollar[0],q=p.getPointAtLength(p.getTotalLength()*.5);u.setAttribute('transform',`translate(${q.x},${q.y})`)}else requestAnimationFrame(uc);
/* optional video: shown only if the file loads */
const vd=$('vid');vd.addEventListener('loadeddata',()=>{vd.hidden=false;if(!az)vd.play().catch(()=>{})});vd.addEventListener('error',()=>vd.remove());
/* swatches */
V.renkler.forEach(([ad,hex])=>{const d=el('div','top'),i=el('i');i.style.backgroundColor=hex;d.append(i,el('b',null,ad),el('code',null,hex));$('toplar').append(d)});
/* measurements */
const O=V.olcu,[a,b]=O.raporlar,tb=$('olcutab');
const sat=(h,x,y,fark)=>{const r=el('tr');r.append(el(h?'th':'td',null,x[0]),el(h?'th':'td',null,x[1]),el(h?'th':'td',null,x[2]));const f=el(h?'th':'td',fark&&fark!=='0'&&!h?'fark':null,fark||'');r.append(f);tb.append(r)};
sat(true,['',a.ad,b.ad],0,'fark');
sat(false,['Salon derinliği (cm)',tr(a.salon_derinlik_cm),tr(b.salon_derinlik_cm)],0,tr((b.salon_derinlik_cm-a.salon_derinlik_cm).toFixed(1))+' cm');
sat(false,['Toplam net alan (m²)',tr(a.toplam_net_m2.toFixed(2)),tr(b.toplam_net_m2)],0,tr((b.toplam_net_m2-a.toplam_net_m2).toFixed(2))+' m²');
sat(false,['Ön cephe (cm)',O.ortak.cephe_cm,O.ortak.cephe_cm],0,'0');
sat(false,['Tavan: salon / arka sol / arka sağ (cm)',O.ortak.tavan_salon_cm+' / '+O.ortak.tavan_arka_sol_cm+' / '+O.ortak.tavan_arka_sag_cm,'aynı'],0,'0');
/* plan: facade 1238 cm, two depths drawn to scale (1 cm = 1 unit / 1238*1200) */
const P=$('plan'),sc=1200/O.ortak.cephe_cm,x0=50,y0=40;
P.append(s('rect',{x:x0,y:y0,width:O.ortak.cephe_cm*sc,height:b.salon_derinlik_cm*sc,fill:'none',stroke:'#A4432F','stroke-width':3,'stroke-dasharray':'10 6'}));
P.append(s('rect',{x:x0,y:y0,width:O.ortak.cephe_cm*sc,height:a.salon_derinlik_cm*sc,fill:'#2E8B8322',stroke:'#1F2A44','stroke-width':3}));
const yz=(x,y,t,c)=>{const n=s('text',{x,y,'font-family':'system-ui,sans-serif','font-size':22,fill:c||'#1F2A44'});n.textContent=t;P.append(n)};
yz(x0,y0+a.salon_derinlik_cm*sc+34,a.ad+': '+a.salon_derinlik_cm+' cm');yz(x0+520,y0+b.salon_derinlik_cm*sc+34,b.ad+': '+b.salon_derinlik_cm+' cm','#A4432F');
yz(x0,y0-12,'ön cephe '+O.ortak.cephe_cm+' cm');
/* services → request cards */
const uid=()=>(crypto.randomUUID?crypto.randomUUID():Date.now().toString(16)+Math.random().toString(16).slice(2));
V.hizmetler.forEach(h=>{const c=el('div','kart');c.append(el('span','durum',h.durum),el('h3',null,h.ad),el('div',null,h.soru));
 const lt=el('label',null,'Tercih edilen gün ve saat'),it=el('input');it.type='datetime-local';lt.append(it);
 const ln=el('label',null,'Not'),nt=el('textarea');nt.rows=2;ln.append(nt);const bt=el('button',null,'Talep kartı üret'),pr=el('pre');
 bt.onclick=()=>{const id=uid(),k8=id.slice(0,8),z=new Date();
  pr.textContent=['klasor: '+z.toISOString().slice(0,10).replace(/-/g,'')+'_SAKIN__TO-'+h.kod+'__talep__'+k8,'istek_id: '+id,'gonderen: SAKIN','alici: '+h.kod,'sonraki: SAKIN',
   'is: '+h.soru,'tercih: '+(it.value||'belirtilmedi'),'not: '+(nt.value||'-'),'son_tarih_utc: '+new Date(z.getTime()+48*3600e3).toISOString()].join('\n')};
 c.append(lt,ln,bt,pr);$('hiz').append(c)});
