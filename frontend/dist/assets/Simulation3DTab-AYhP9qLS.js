var Dh=Object.defineProperty;var Nh=(i,e,t)=>e in i?Dh(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var Ct=(i,e,t)=>Nh(i,typeof e!="symbol"?e+"":e,t);import{u as Ru,d as Uh,r as Ue,j as se}from"./index-Bdc5hhzE.js";import{c as Ih,A as _s,M as Fh,L as Oh,K as kh,J as Bh,I as zh,O as Hh,H as Gh,G as Vh,E as Wh,B as Zi,z as Xh,y as $h,w as Ji,P as za,Q as Kh,R as Yh,v as qh,u as jh,o as Zh,n as Qi,q as Jh,t as Qh,m as ed,l as td,k as nd,j as id,p as sd,i as rd,s as ad,g as od,h as ld,r as cd,f as ud,b as hd,x as dd,a as fd,e as pd,d as md,N as Ha,D as vl}from"./simulationTypes-CV6_2Z50.js";const Sl={input:"input",key:"key",internal:"internal",output:"output",transform:"transform",active:"active",muted:"muted",error:"error"};function fi(i,e="muted"){return i?i in Sl?Sl[i]:i:e}function gd(i){return i?{label:i.label,tone:fi(i.tone),emphasize:i.emphasize,opacity:i.opacity,visible:i.visible}:null}function mt(i,e,t,n,s={}){const r=new Set((s.highlight??[]).map(([a,o])=>`${a},${o}`));return Fn(i,e.map((a,o)=>a.map((l,c)=>({label:l,tone:r.has(`${o},${c}`)?"active":t}))),{cellSize:s.cellSize??1,gap:s.gap??.16,height:s.height??1.6,position:n})}function Fn(i,e,t={}){var s,r;const n=(s=t.layers)!=null&&s.length?t.layers:[{rows:e.length,cols:Math.max(1,((r=e[0])==null?void 0:r.length)??0),cellSize:t.cellSize,gap:t.gap,labelScale:t.labelScale,cells:e.map(a=>a.map(gd))}];return{id:i,kind:"grid",position:t.position??[0,0,0],visible:t.visible??!0,tone:fi(t.tone??"muted"),grid:{layers:n,height:t.height}}}function ae(i,e,t,n="path",s={}){return{id:i,kind:"arrow",position:[0,0,0],from:e,to:t,tone:fi(n),visible:s.visible??!0}}function _d(i,e=2){const t=(i??"").replace(/\s/g,""),n=[];for(let s=0;s<t.length;s+=e)n.push(t.slice(s,s+e));return n}function xd(i,e,t={}){return _d(i,t.piece??2).map(n=>({label:n,tone:e}))}function ve(i,e,t,n,s={}){const r=s.piece??2,a=xd(e,t,{piece:r}),{objects:o,positions:l}=vn(i,a,n,{cellSize:s.cellSize??.7,gap:s.gap??.07,cubeY:s.cubeY??.3,glyphY:s.glyphY??.95}),c=o;return c.objects=o,c.positions=l.map(u=>u?u.position:null),c}function vn(i,e,t,n={}){const s=n.cellSize??.92,r=n.gap??.12,a=n.cubeY??.55,o=n.glyphY??1.25,l=[],c=[],u=s+r,m=(e.length-1)*u/2;return e.forEach((h,p)=>{if(!h){c.push(null);return}const g=[t[0]-m+p*u,t[1],t[2]],y=fi(h.tone);l.push({id:`${i}-${p}`,kind:"box",position:[g[0],t[1]+a,g[2]],size:[s,s,s],tone:y,emphasize:h.emphasize??!1,opacity:h.opacity??1,visible:h.visible??!0},{id:`${i}g-${p}`,kind:"glyph",position:[g[0],t[1]+o,g[2]],label:h.label===" "?"·":h.label,glyphScale:.95,tone:y,opacity:h.opacity??1,visible:h.visible??!0}),c.push({position:g,cell:h})}),{objects:l,positions:c}}function vd(i){if(i.length===0)return[0,.4,0];let e=0,t=0,n=0;for(const s of i)e+=s[0],t+=s[1],n+=s[2];return[e/i.length,t/i.length,n/i.length]}const Cu=[.78,.72,1];function Sd(i,e={}){const t=vd(i),n=Math.max(2,...i.map(o=>Math.hypot(o[0]-t[0],o[1]-t[1],o[2]-t[2]))),s=e.distance??n*2.5+6,r=e.dir??Cu,a=Math.hypot(r[0],r[1],r[2])||1;return{position:[t[0]+r[0]/a*s,t[1]+r[1]/a*s,t[2]+r[2]/a*s],target:t,instant:e.instant}}function yl(i,e,t=0,n=0){const s=[];if(i===1)return[[0,t,n]];for(let r=0;r<i;r++)s.push([-e/2+e*r/(i-1),t,n]);return s}function vt(...i){return i.flatMap(e=>Array.isArray(e)?e:[e])}function $t(i,e,t={}){const n=t.rowStep??2.1,s=t.cellSize??.92,r=t.gap??.12,a=[],o=[],l=Math.max(0,...i.map(p=>(p.cells??[]).length)),c=s+r,u=(l-1)*c/2,m=e[1]+s/2,h=e[1]+s+.28;return i.forEach((p,g)=>{const y=e[2]+g*n;p.label&&a.push({id:`rowlabel-${g}`,kind:"glyph",position:[e[0]-u-(t.labelOffset??1.6),m+.35,y],label:p.label,glyphScale:.9,tone:"muted"});const f=[];(p.cells??[]).forEach((d,E)=>{if(!d){f.push(null);return}const w=e[0]-u+E*c,v=fi(d.tone);a.push({id:`R${g}C${E}`,kind:"box",position:[w,m,y],size:[s,s,s],tone:v,emphasize:d.emphasize??!1,opacity:d.opacity??1,visible:d.visible??!0},{id:`R${g}C${E}g`,kind:"glyph",position:[w,h,y],label:d.label===" "?"·":d.label,glyphScale:.92,tone:v,opacity:d.opacity??1,visible:d.visible??!0}),f.push([w,m,y])}),o.push(f)}),{objects:a,cells:o}}function Zt(i,e,t,n={}){var p;const s=n.cellSize??.9,r=n.gap??.1,a=s+r,o=e.length,l=Math.max(1,((p=e[0])==null?void 0:p.length)??0),c=(l-1)*a/2,u=(o-1)*a/2,m=[],h=[];return e.forEach((g,y)=>{const f=[];for(let d=0;d<l;d++){const E=g[d],w=t[0]-c+d*a,v=t[2]-u+y*a;if(f.push([w,t[1]+.12,v]),!E)continue;const M=fi(E.tone);m.push({id:`${i}-${y}-${d}`,kind:"box",position:[w,t[1]+.12,v],size:[s,.24,s],tone:M,emphasize:E.emphasize??!1,opacity:E.opacity??1},{id:`${i}-${y}-${d}g`,kind:"glyph",position:[w,t[1]+.62,v],label:E.label,glyphScale:.9,tone:M,opacity:E.opacity??1})}h.push(f)}),{objects:m,cells:h}}function pi(i,e={}){var g,y;const t=[],n=[],s=[],r=(f,d=.6)=>{f&&(t.push(f[0]+d,f[0]-d),n.push(f[1]+d,f[1]-d),s.push(f[2]+d,f[2]-d))};for(const f of i){if(f.kind==="grid"&&((g=f.grid)!=null&&g.layers)){for(const d of f.grid.layers){const E=d.cellSize??1,w=d.gap??.14,v=(Math.max(1,d.cols)-1)*(E+w)+E,M=(Math.max(1,d.rows)-1)*(E+w)+E;r([f.position[0]+v/2,f.position[1],f.position[2]-M/2]),r([f.position[0]-v/2,f.position[1],f.position[2]+M/2])}continue}if(r(f.position),f.kind==="arrow"&&(r(f.from,1),r(f.to,1)),f.kind==="arc"&&((y=f.points)!=null&&y.length))for(const d of f.points)r(d)}t.length===0&&(t.push(0,1),n.push(0,1),s.push(0,1));const a=(Math.min(...t)+Math.max(...t))/2,o=(Math.min(...n)+Math.max(...n))/2,l=(Math.min(...s)+Math.max(...s))/2,u=Math.max(4,Math.max(Math.max(...t)-Math.min(...t),Math.max(...n)-Math.min(...n),Math.max(...s)-Math.min(...s)))*1.35+4.5,m=e.dir??Cu,h=Math.hypot(m[0],m[1],m[2])||1,p=e.pad??0;return{position:[a+m[0]/h*(u+p),o+m[1]/h*(u+p),l+m[2]/h*(u+p)],target:[a,o,l],instant:e.instant}}function b(i,e,t,n,s="internal",r={}){const a=fi(s);return[{id:i,kind:"box",position:e,size:[Math.max(1.2,Math.min(4,.35*Math.max(n.length,t.length)+1)),.5,1.2],tone:a,emphasize:r.emphasize??!1},{id:`${i}-lbl`,kind:"glyph",position:[e[0],e[1]+.72,e[2]],label:t,glyphScale:.55,tone:"muted",opacity:.85},{id:`${i}-val`,kind:"glyph",position:[e[0],e[1]-.05,e[2]],label:n,glyphScale:.9,tone:a}]}const Ds=8,yd=1.15,es=12.2,bl=.55,Ml=8.6,bd=.35,Md=8.6,El=.5,Ed=[-6.4,3,-3.2],Td=[-6.4,4.6,-3.2],Wr=12,Pu=Math.PI*2,Xr={position:[9.5,10,15],target:[0,.4,0]},_r=i=>i/26*Pu,$r=(i,e,t)=>{const n=_r(i);return[e*Math.cos(n),t,e*Math.sin(n)]};function Jn(i,e){var u,m,h,p,g,y;const t=[],n=i.letters.length,s=i.sign,r=f=>{if(n<=1)return Math.PI/2;const d=Math.min(1.05,.35+.1*n);return Math.PI/2-d+2*d*f/(n-1)},a=f=>[es*Math.cos(r(f)),bl,es*Math.sin(r(f))],o=f=>[-es*Math.cos(r(f)),bl,-es*Math.sin(r(f))];t.push({id:"ring",kind:"ring",position:[0,0,0],ringRadius:Ds,ringTube:.22,tone:"muted",emphasize:e.ringEmphasize??!1});for(let f=0;f<26;f++){const d=(u=e.glyphs)==null?void 0:u[f];t.push({id:`glyph-${f}`,kind:"glyph",position:$r(f,Ds,yd),label:_s[f],glyphScale:1.1,tone:(d==null?void 0:d.tone)??"muted",emphasize:(d==null?void 0:d.emphasize)??!1})}t.push({id:"key-block",kind:"box",position:Ed,size:[1.5,1.2,1.5],tone:"key",emphasize:e.keyOn??!1}),t.push({id:"key-label",kind:"glyph",position:Td,label:String(i.k),glyphScale:1.25,tone:"key",emphasize:e.keyOn??!1});for(let f=0;f<n;f++){const d=f===e.activeLetter,E=((m=e.fadePlain)==null?void 0:m.includes(f))??!1,w=((h=e.dimPlain)==null?void 0:h.includes(f))??!1;t.push({id:`pt-${f}`,kind:"box",position:a(f),size:[1.3,1.3,1.3],tone:d?"active":"plaintext",emphasize:d,scale:d?[1.25,1.25,1.25]:[1,1,1],opacity:E?.35:1}),t.push({id:`ptg-${f}`,kind:"glyph",position:[a(f)[0],1.95,a(f)[2]],label:i.letters[f].plain,glyphScale:1,tone:d?"active":w?"muted":"plaintext"})}for(let f=0;f<n;f++){const d=((p=e.revealed)==null?void 0:p.includes(f))??!1;t.push({id:`ot-${f}`,kind:"box",position:o(f),size:[1.3,1.3,1.3],tone:"output",visible:d,emphasize:d}),t.push({id:`otg-${f}`,kind:"glyph",position:[o(f)[0],1.95,o(f)[2]],label:i.letters[f].mapped,glyphScale:1,tone:"output",visible:d})}for(let f=0;f<n;f++){const d=(e.arcVisible??!1)&&f===e.activeLetter;t.push({id:`arc-${f}`,kind:"arc",position:[0,0,0],points:Ad(i.letters[f].value,s,i.k),ringTube:.16,tone:"transform",visible:d,emphasize:d})}for(let f=0;f<n;f++){const d=((g=e.ptArrows)==null?void 0:g.includes(f))??!1,E=a(f),w=$r(i.letters[f].value,Ds,1.05);t.push({id:`ptar-${f}`,kind:"arrow",position:[0,0,0],from:[E[0],.3,E[2]],to:w,tone:"path",visible:d})}for(let f=0;f<n;f++){const d=((y=e.otArrows)==null?void 0:y.includes(f))??!1,E=o(f),w=$r(i.letters[f].mappedVal,Ds,1.05);t.push({id:`otar-${f}`,kind:"arrow",position:[0,0,0],from:w,to:[E[0],.3,E[2]],tone:"output",visible:d})}const l=e.activeLetter??-1;if((e.travelerVisible??!1)&&l>=0&&l<n){const d=i.letters[l].value;t.push({id:"traveler",kind:"sphere",position:[0,El,0],size:[.48,.48,.48],tone:e.travelerAt==="target"?"complete":"active",emphasize:!0,orbit:{center:[0,0,0],radius:Md,y:El,fromAngle:_r(d),toAngle:e.travelerAt==="target"?_r(d+s*i.k):_r(d)}})}return t.push({id:"result-arrow",kind:"arrow",position:[0,0,0],from:[0,2.4,es+.4],to:[0,2.4,-12.6],tone:"transform",visible:e.resultArrow??!1}),t}function Ad(i,e,t){const n=i+(e>=0?1:-1)*t,s=[],r=64;for(let a=0;a<=1;a+=1/r){const l=(i+(n-i)*a)/26*Pu;s.push([Ml*Math.cos(l),bd,Ml*Math.sin(l)])}return s}function Ns(){return Array.from({length:26},()=>({tone:"muted"}))}const Tl={id:"caesar",nameKey:"simulation3d.caesar.name",educationalKey:"simulation3d.caesar.educational",demoInputs:{text:"HELLO",shift:3},defaultCamera:Xr,getLegend(){return[{id:"plaintext",labelKey:"simulation3d.legend.input",tone:"plaintext"},{id:"key",labelKey:"simulation3d.legend.key",tone:"key"},{id:"path",labelKey:"simulation3d.legend.path",tone:"transform"},{id:"active",labelKey:"simulation3d.legend.active",tone:"active"},{id:"output",labelKey:"simulation3d.legend.output",tone:"output"}]},buildSteps(i){const e=i.operation==="decrypt",t=String(i.inputs.text??""),n=Number.isFinite(Number(i.inputs.shift))?Number(i.inputs.shift):3,{chars:s,k:r}=Ih(t,n,e),a=s.filter(v=>v.note!=="ignored"),o=a.map(v=>v.mapped.toUpperCase()).join(""),l=a.length>Wr,c=a.slice(0,Wr).map(v=>{const M=v.mapped.toUpperCase();return{plain:v.plain.toUpperCase(),value:v.value,mapped:M,mappedVal:_s.indexOf(M)}}),u=e?-1:1,m={letters:c,k:r,sign:u},h=[],p=c.length;if(p===0)return h.push({id:"caesar3d-empty",titleKey:"simulation3d.caesar.intro.title",descKey:"simulation3d.caesar.intro.desc",descArgs:{k:r},phase:"input",objects:Jn({...m,letters:[]},{keyOn:!0}),camera:Xr,duration:0}),h;const g={intro:"input",key:"key",ring:"internal",select:"transform",move:"transform",result:"output"},f={glyphs:Ns(),keyOn:!0};h.push({id:"caesar3d-intro",titleKey:"simulation3d.caesar.intro.title",descKey:"simulation3d.caesar.intro.desc",descArgs:{k:r},phase:g.intro,objects:Jn(m,f),camera:Xr,duration:900}),h.push({id:"caesar3d-key",titleKey:"simulation3d.caesar.key.title",descKey:"simulation3d.caesar.key.desc",descArgs:{k:r},phase:g.key,objects:Jn(m,{...f,keyOn:!0}),duration:700}),h.push({id:"caesar3d-ring",titleKey:"simulation3d.caesar.ring.title",descKey:"simulation3d.caesar.ring.desc",descArgs:{k:r,signed:u>0?`+${r}`:`−${r}`},phase:g.ring,objects:Jn(m,{...f,ringEmphasize:!0}),duration:900});const d=[],E=[];for(let v=0;v<p;v++){const M=c[v],T=u>0?`+${r}`:`−${r}`,C=Ns();C[M.value].tone="active",C[M.value].emphasize=!0,h.push({id:`caesar3d-l${v}-select`,titleKey:"simulation3d.caesar.select.title",descKey:"simulation3d.caesar.select.desc",titleArgs:{ch:M.plain},descArgs:{ch:M.plain,i:M.value,j:M.mappedVal,k:T},phase:g.select,objects:Jn(m,{glyphs:C,keyOn:!0,activeLetter:v,travelerVisible:!0,travelerAt:"source",arcVisible:!0,ptArrows:[v],dimPlain:E}),duration:900}),d.push(v);const x=Ns();x[M.mappedVal].tone="complete",x[M.mappedVal].emphasize=!0,h.push({id:`caesar3d-l${v}-move`,titleKey:"simulation3d.caesar.move.title",descKey:"simulation3d.caesar.move.desc",titleArgs:{ch:M.plain,cipher:M.mapped},descArgs:{ch:M.plain,i:M.value,j:M.mappedVal,k:T,cipher:M.mapped},phase:g.move,objects:Jn(m,{glyphs:x,keyOn:!0,activeLetter:v,travelerVisible:!0,travelerAt:"target",arcVisible:!0,revealed:d.slice(),otArrows:[v],fadePlain:[v],dimPlain:E}),duration:1100}),E.push(v)}const w=Ns();return h.push({id:"caesar3d-result",titleKey:"simulation3d.caesar.result.title",descKey:"simulation3d.caesar.result.desc",descArgs:{out:o},phase:g.result,objects:[...Jn(m,{glyphs:w,keyOn:!0,revealed:d.slice(),resultArrow:!0}),...b("caesar-full",[0,-2.8,12.4],"ciphertext",o||"·","output",{emphasize:!0}),...l?b("caesar-note",[0,-4.7,8.4],"note",`ring shows the first ${Wr} letters · ${a.length} letters total`,"muted"):[]],duration:900}),h}};function wd(i,e,t){return i.map((n,s)=>{const r=e(n,s),a=t==null?void 0:t(n,s);return{id:`3d-${n.id}`,titleKey:n.titleKey,titleArgs:n.titleArgs,descKey:n.descKey,descArgs:n.descArgs,phase:n.phase,objects:r,camera:s===0?pi(r):void 0,duration:800,...a?{meta:a}:{}}})}function Rd(i){return String(i.view.kind)}const Cd={input:"concept",key:"algorithm",transform:"operation",internal:"bit",output:"algorithm"};function Pd(i){return i.replace(/[_\-\s]+/g," ").replace(/\b\w/g,e=>e.toUpperCase())}function Ld(i){return{level:(i.phase?Cd[i.phase]:void 0)??"algorithm",operation:Pd(Rd(i))}}function Al(i,e=[0,0,0]){const t=i.rows??[];return $t(t.map(n=>({label:n.label,cells:(n.cells??[]).map(s=>({label:s.ch,tone:s.tone}))})),e).objects}function mi(i,e=[0,0,0]){const t=i.chars??[],n=String(i.text??""),s=[],{objects:r}=$t([{cells:t.map(a=>({label:a.ch,tone:a.tone}))}],e);return s.push(...r),s.push(...b("result-value",[0,1.6,4.6],"result",n||"·","output",{emphasize:!0})),s}const Dd=[{id:"input",labelKey:"simulation3d.legend.input",tone:"input"},{id:"plaintext",labelKey:"simulation3d.legend.plaintext",tone:"plaintext"},{id:"key",labelKey:"simulation3d.legend.key",tone:"key"},{id:"active",labelKey:"simulation3d.legend.active",tone:"active"},{id:"transform",labelKey:"simulation3d.legend.transform",tone:"transform"},{id:"output",labelKey:"simulation3d.legend.output",tone:"output"}];function Qe(i,e,t={},n){return{id:i.id,nameKey:i.nameKey,educationalKey:i.educationalKey,demoInputs:i.demoInputs,buildSteps(s){return wd(i.build(s),r=>e(r),Ld)},getLegend:()=>Dd,...t}}const Kr=14,Ar=.92+.12;function Yr(i){const t=(Math.max(0,...i.map(s=>s.parts.length))-1)*Ar/2,n=[];return i.forEach((s,r)=>{const a=r*2.3;n.push({id:`rlabel-${r}`,kind:"glyph",position:[-t-1.7,1,a],label:s.label,glyphScale:.95,tone:"muted"}),s.parts.forEach((o,l)=>{const c=-t+l*Ar;n.push({id:`R${r}C${l}`,kind:"box",position:[c,.5,a],size:[.92,.92,.92],tone:o.tone},{id:`R${r}C${l}g`,kind:"glyph",position:[c,1.24,a],label:o.label,glyphScale:.95,tone:o.tone})})}),n}const wl=Qe(Fh,i=>{const e=i.view;switch(e.kind){case"vig-key":{const t=String(e.key),n=t.split("").map((s,r)=>({label:s,tone:"key",emphasize:r<2}));return vt(Yr([{label:"K",parts:n}]),b("key-len",[7,.4,0],"key length",String(t.length),"internal"),b("mod",[9,.4,2.4],"mod 26","26","transform"),ae("cycle",[7,1.4,0],[9,1.4,2.4],"path"))}case"vig-input":{const t=e.chars??[];return Al({rows:[{label:"P",cells:t}]},[0,0,0])}case"vig-rail":{const t=String(e.key),n=String(e.text),s=n.slice(0,Kr),r=(t+t.repeat(Math.ceil(s.length/t.length))).slice(0,s.length),a=s.split("").map(c=>({label:c,tone:"input"})),o=Yr([{label:"P",parts:a},{label:"K",parts:r.split("").map(c=>({label:c,tone:"key"}))}]),l=(Math.max(s.length,r.length)-1)*Ar/2;return s.split("").forEach((c,u)=>{const m=-l+u*Ar;o.push(ae(`ar-${u}`,[m,.5,2.3],[m,.5,0],"path"))}),n.length>Kr&&o.push(...b("vig-rail-note",[0,3.6,-2.6],"note",`first ${Kr} letters shown · ${n.length} total`,"muted")),o}case"rows":return Al(e);case"result":return mi(e);default:return[]}},{defaultCamera:pi(vt(...Yr([{label:"P",parts:Array.from({length:12},()=>({label:"A",tone:"input"}))},{label:"K",parts:Array.from({length:12},()=>({label:"A",tone:"key"}))}])),{dir:[.8,.85,1.2]})}),Ga=.6,Nd=.05,Lu=Ga+Nd;function Us(i,e,t,n){const s=[];return e.split("").forEach((r,a)=>{const o=-8.125+a*Lu;s.push({id:`${i}-${a}`,kind:"box",position:[o,.3,n],size:[Ga,.26,Ga],tone:t},{id:`${i}g-${a}`,kind:"glyph",position:[o,.85,n],label:r,glyphScale:.7,tone:t})}),s}const Rl=Qe(Oh,i=>{const e=i.view;switch(e.kind){case"mono-key":{const t=String(e.sub),n=vt(Us("a",_s,"input",0),Us("s",t,"key",2.3)),s=[0,4,11,17,25];for(const r of s){const a=-8.125+r*Lu;n.push(ae(`map-${r}`,[a,.65,2.3],[a,.45,0],"transform"))}return n}case"mono-input":{const t=e.chars??[];return vt(...$t([{cells:t.map(n=>({label:n.ch,tone:n.tone}))}],[0,0,0],{rowStep:2.4}).objects)}case"mono-sub-grid":{const t=e.gridRows??[];return vt(...$t(t.map(n=>({label:n.label,cells:(n.cells??[]).map(s=>({label:s.ch,tone:s.tone}))})),[0,0,0],{rowStep:2.4,cellSize:.72,gap:.05}).objects)}case"mono-chars":{const t=e.pRow??[],n=e.mRow??[];return vt(...$t([{label:"P",cells:t.map(s=>({label:s.ch,tone:s.tone}))},{label:"C",cells:n.map(s=>({label:s.ch,tone:s.tone}))}],[0,0,0],{rowStep:2.4}).objects)}case"result":return mi(e);default:return[]}},{defaultCamera:pi(vt(Us("a",_s,"input",0),Us("s",_s,"key",2.3)),{dir:[.85,.9,1.1]})});function Cl(i,e,t){const n=new Set(e.toUpperCase().split(""));return i.map((s,r)=>s.map((a,o)=>({label:a,tone:n.has(a)?"key":"internal",emphasize:t!==null&&(r===t.ra&&o===t.ca||r===t.rb&&o===t.cb)})))}const Pl=Qe(kh,i=>{const e=i.view;switch(e.kind){case"pf-square":{const t=e.square??[],n=String(e.keyword),{objects:s}=Zt("sq",Cl(t,n,null),[0,0,0],{cellSize:1.15,gap:.18});return vt(...s,...b("kw",[-2.8,1.3,3.6],"keyword",n,"key",{emphasize:!0}))}case"pf-digraphs":{const t=e.pairs??[];return vt(...$t([{label:"digraphs",cells:t.map((n,s)=>({label:n,tone:"input",emphasize:s===0}))}],[0,0,0],{rowStep:2.4,cellSize:1.3,gap:.08}).objects)}case"pf-encrypt":{const t=e.square??[],n=e.steps??[],s=n[0],{objects:r,cells:a}=Zt("sq",Cl(t,"",s),[0,0,0],{cellSize:1.15,gap:.18}),o=[...r];return n.forEach((l,c)=>{var h,p;const u=(h=a[l.ra])==null?void 0:h[l.ca],m=(p=a[l.rb])==null?void 0:p[l.cb];!u||!m||(l.ra===l.rb?o.push(ae(`m-${c}`,[u[0],.5,u[2]],[m[0],.5,m[2]],"transform")):l.ca===l.cb?o.push(ae(`m-${c}`,[u[0],.5,u[2]],[m[0],.5,m[2]],"transform")):o.push(ae(`m-${c}`,u,m,"path")))}),o.push(...b("rule",[6.6,.3,0],"rule",(s==null?void 0:s.rule)??"","transform")),o}case"result":return mi(e);default:return[]}},{defaultCamera:pi(Zt("sq",Array.from({length:5},()=>Array.from({length:5},()=>({label:"A",tone:"internal"}))),[0,0,0],{cellSize:1.15,gap:.18}).objects,{dir:[.75,.85,1.3]})});function ts(i,e){return i.map(t=>t.map(n=>({label:String(n),tone:e})))}const Ll=Qe(Bh,i=>{const e=i.view;switch(e.kind){case"hill-matrix":{const t=e.matrix??[],n=!!e.decrypt,s=!!e.valid,r=Number(e.determin),a=e.detInv,o=e.originalMatrix??[],l=[];if(n){const{objects:c}=Zt("K",ts(o,"key"),[-6.5,0,0],{cellSize:1,gap:.1}),{objects:u}=Zt("Kinv",ts(t,"transform"),[3.5,0,0],{cellSize:1,gap:.1});l.push(...c,...u,ae("kinv",[-4.4,1,0],[1.9,1,0],"path"),...b("det",[8.2,.4,2.4],"det",a!==null?`${r} (inv ${a})`:`${r} · not invertible`,s?"internal":"error",{emphasize:!s}))}else{const{objects:c}=Zt("K",ts(t,"key"),[0,0,-1.5],{cellSize:1,gap:.1});l.push(...c),l.push(...b("formula",[4.5,.8,-1.5],"C = K · P mod 26","","transform"))}return l}case"hill-prepare":{const t=e.blocks??[],n=Number(e.padded),s=[];return t.slice(0,4).forEach((r,a)=>{const o=a*3,l=-3.5;s.push(...b(`b${a}-chars`,[l,.3,o],`block ${a+1}`,r.chars.join(""),"input"),...b(`b${a}-vec`,[l+5.2,.3,o],"P vector",r.inputVec.join(", "),"internal"))}),n>0&&s.push(...b("pad",[4.5,1.2,t.length*3],"padding",`${n} × X`,"muted")),t.length>4&&s.push(...b("hill-prep-note",[0,3.6,-2.2],"note",`first 4 of ${t.length} blocks shown`,"muted")),s}case"hill-compute":{const t=e.matrix??[],n=e.blocks??[],{objects:s}=Zt("K",ts(t,"key"),[.5,0,-2.4],{cellSize:1,gap:.1}),r=[...s];return n.slice(0,4).forEach((a,o)=>{const l=o*3;r.push(...$t([{label:"P",cells:a.chars.map((c,u)=>({label:c,tone:"input",emphasize:u===0}))},{label:"in",cells:a.inputVec.map(c=>({label:String(c),tone:"internal"}))},{label:"out",cells:(a.outputVec??[]).map(c=>({label:String(c),tone:"transform"}))},{label:"C",cells:a.outputChars.map(c=>({label:c,tone:"output",emphasize:!0}))}],[-4.2,.2,l],{rowStep:1.9,cellSize:.7,gap:.06}).objects),r.push(ae(`in-${o}`,[3.3,.8,l],[1.7,.7,-2.4],"transform")),r.push(ae(`out-${o}`,[10.6,.8,l],[1.7,.9,-2.4],"transform"))}),n.length>4&&r.push(...b("hill-compute-note",[0,4.2,-2.2],"note",`first 4 of ${n.length} blocks shown`,"muted")),r}case"result":return mi(e);default:return[]}},{defaultCamera:pi(Zt("K",ts([[3,3],[2,5]],"key"),[0,0,-1.5],{cellSize:1,gap:.1}).objects,{dir:[.8,.9,1.15]})});function Dl(i,e,t="zigzag"){const n=Math.min(i.length,14),s=Hh(i.length,e),r=[];for(let a=0;a<(n||1);a++){const o=s[a]??0;r.push([a*1.1-n*1.1/2,o*1.7+.3,0])}return{id:t,kind:"arc",position:[0,0,0],points:r,ringTube:.18,tone:"path"}}function Ud(i){return i.map(e=>e.map(t=>t==="."?{label:"",tone:"muted",opacity:.25}:{label:t,tone:"active",emphasize:!0}))}const Nl=Qe(zh,i=>{const e=i.view;switch(e.kind){case"rf-config":{const t=Number(e.rails),n=Number(e.cycle),s=[];for(let r=0;r<n;r++){const a=r<t?r:n-r;s.push([r*1.4-n*1.4/2,a*1.8+.3,0])}return vt({id:"cycle-arc",kind:"arc",position:[0,0,0],points:s,ringTube:.2,tone:"path"},{id:"cycle-ring",kind:"ring",position:[5.5,0,0],ringRadius:2,ringTube:.14,tone:"transform"},...b("rails",[9.2,.6,1.6],"rails",String(t),"key"),...b("cycle",[6.8,.6,3.4],"cycle",`${n}`,"internal"))}case"rf-pattern":case"rf-rebuild":{const t=e.grid??e.displayGrid??[],{objects:n}=Zt("g",Ud(t??[]),[0,0,0],{cellSize:.5,gap:.02});return n}case"rf-read":{const t=e.rows??[];return vt(...$t(t.map((n,s)=>({label:`rail ${s+1}`,cells:n.split("").map(r=>({label:r,tone:"transform"}))})),[0,0,0],{rowStep:2.5,cellSize:.8,gap:.06}).objects)}case"rf-positions":{const t=e.counts??[],n=String(e.text??"");return vt(...$t([{label:"rail",cells:t.map((s,r)=>({label:String(s),tone:r%2===0?"internal":"transform"}))}],[0,0,0]).objects,Dl(n,t.length,"rf-zig"),ae("zig-goto",[n.length*.3,t.length*1.7,0],[6,.4,3.5],"path"))}case"result":return mi(e);default:return[]}},{defaultCamera:pi([Dl("HELLOWORLD1234",3,"demo")],{dir:[.85,.6,.9]})});function qr(i){return i.map(e=>e.map(t=>t==="."?{label:"",tone:"muted",opacity:.22}:{label:t,tone:"internal"}))}function Id(i,e){return i.split("").map(t=>[{label:t,tone:e}])}const Ul=Qe(Gh,i=>{var t;const e=i.view;switch(e.kind){case"col-key":{const n=String(e.key),s=e.order??[],r=[],a=1.1;return n.split("").forEach((o,l)=>{const c=l*a-(n.length-1)*a/2;r.push({id:`kc-${l}`,kind:"box",position:[c,.4,0],size:[.85,.24,.85],tone:"key",emphasize:!0},{id:`kcg-${l}`,kind:"glyph",position:[c,1,0],label:o,glyphScale:.95,tone:"key"},{id:`ko-${l}`,kind:"glyph",position:[c,0,0],label:String(s.indexOf(l)),glyphScale:.5,tone:"internal"})}),r}case"col-grid":{const n=e.grid??[],s=String(e.key),{objects:r,cells:a}=Zt("cg",qr(n),[0,0,0],{cellSize:.8,gap:.1}),o=[...r];return s.split("").forEach((l,c)=>{var m,h,p;const u=((m=a[0][c])==null?void 0:m[0])??0;o.push({id:`hdr-${c}`,kind:"box",position:[u,-.16-.14,((h=a[0][c])==null?void 0:h[2])??0],size:[.8,.28,.8],tone:"key",emphasize:!0},{id:`hdrg-${c}`,kind:"glyph",position:[u,-.16+.28,(((p=a[0][c])==null?void 0:p[2])??0)-.7],label:l,glyphScale:.7,tone:"key"})}),o}case"col-read":case"col-split":{const n=String(e.key),s=e.order??[],r=e.columnTexts??e.colTexts??[],a=[],o=2.6,l=[];return s.forEach((c,u)=>{const m=u*o-(s.length-1)*o/2,h=Id(r[c]??"","transform"),{objects:p}=Zt(`col${u}`,h,[m,0,0],{cellSize:.85,gap:.06});a.push(...p,{id:`lbl-${u}`,kind:"glyph",position:[m,-.55,0],label:`${n[c]}(read ${s.indexOf(c)})`,glyphScale:.55,tone:"key"}),h.length>0&&l.push([m,0,h.length*.91])}),l.length>1&&a.push({id:"readpath",kind:"arc",position:[0,0,0],points:l.map(c=>[c[0],.55,c[2]]),ringTube:.12,tone:"path"}),a}case"col-rebuild":{const n=e.grid??[],{objects:s}=Zt("rb",qr(n),[0,0,0],{cellSize:.85,gap:.1}),r=[...s];return n.forEach((a,o)=>{a.forEach((l,c)=>{var u;l!=="."&&r.push({kind:"sphere",id:`rb-dot-${o}-${c}`,position:[-((((u=n[0])==null?void 0:u.length)??1)*.95)/2+c*.95,1.15,0],size:[.22,.22,.22],tone:"active",emphasize:!0})})}),r.push(...b("plain-hint",[(((t=n[0])==null?void 0:t.length)??2)/2,1.6,n.length/2*.95],"rows read","left → right","path")),r}case"result":return mi(e);default:return[]}},{defaultCamera:pi(Zt("cg",qr([["A","B",".","C"],["D","E",".","F"]]),[0,0,0],{cellSize:.8,gap:.1}).objects,{dir:[.8,.9,1.1]})}),Fd=[16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];function Od(i){let e=0n;for(const t of i)e=e<<1n|BigInt(t&1);return e.toString(16).padStart(8,"0")}function kd(i,e){const t=Math.max(i.length,e.length),n=BigInt("0x"+i.padStart(t,"0")),s=BigInt("0x"+e.padStart(t,"0"));return(n^s).toString(16).padStart(t,"0")}const Il=Qe(Vh,i=>{const e=i.view;switch(e.kind){case"des-input":{const t=String(e.block??""),n=String(e.key??""),s=String(e.l0??""),r=String(e.r0??""),a=ve("blk",t.toUpperCase(),"input",[0,.8,-1.6],{piece:1,cellSize:.6,gap:.035}),o=ve("key",n.toUpperCase(),"key",[0,.8,.4],{piece:1,cellSize:.6,gap:.035});return[...a.objects,...o.objects,...b("ip",[0,2.1,1.6],"initial permutation","IP","transform"),...b("L0",[-1.7,.15,4],"L0",s,"internal"),...b("R0",[1.7,.15,4],"R0",r,"internal")]}case"des-key":{const t=e.roundKeys??[],n=[];return t.slice(0,16).forEach((s,r)=>{const a=r*(Math.PI*2/16),o=[8*Math.cos(a),.5,8*Math.sin(a)];n.push(...b(`k${r}`,o,`K${r+1}`,s.toUpperCase(),r===0?"key":"internal"))}),n.push({id:"key-ring",kind:"ring",position:[0,0,0],ringRadius:8,ringTube:.12,tone:"key"}),n.push(...b("pc",[0,3.4,0],"key schedule","PC-1 → rotate → PC-2","transform")),n}case"des-f":{const t=e.f??{},n=String(e.l0??""),s=String(e.r0??""),r=Array.isArray(t.sboxes)?t.sboxes:[];if(!r.length)return[];const a=String(t.expanded??"").toUpperCase(),o=String(t.xor??"").toUpperCase(),l=r.map(d=>(d.fourBits??d.four_bits??"").split("").map(E=>Number(E))).flat(),c=Fd.map(d=>l[d-1]??0),u=Od(c),m=kd(n,u),h=[],p=[["R0",s,"internal"],["E(R0)",a,"transform"],["E(R0)⊕K1",o,"transform"],["f(R0,K1)",u,"output"],["⊕L0 → R1",m,"output"]],g=4.8;p.forEach((d,E)=>{const w=(E-(p.length-1)/2)*g;h.push(...b(`f${E}`,[w,.5,-1.8],d[0],d[1],d[2],{emphasize:E===4})),E<p.length-1&&h.push(ae(`fa${E}`,[w+g/2-.7,1.15,-1.8],[w+g/2+.7,1.15,-1.8],"path"))});const y=r.map(d=>`S${d.sbox}`),f=r.map(d=>d.fourBits??d.four_bits??"");return h.push(...b("sboxtitle",[0,.3,1.6],"S-boxes","8 × 6→4 bits","transform"),...$t([{label:"S",cells:y.map((d,E)=>({label:d,tone:E%2===0?"internal":"transform"}))},{cells:f.map((d,E)=>({label:d,tone:E%2===0?"transform":"output"}))}],[0,-.2,3],{rowStep:1.8,cellSize:.85,gap:.08}).objects,...b("ptitle",[0,-1.35,7.2],"P-box","spread 32 bits","transform")),h}case"des-rounds":{const t=e.states??[],n=[];return t.forEach((s,r)=>{const a=r%6,o=Math.floor(r/6);n.push(...b(`r${r}`,[a*5.4-13.5,.45,o*3.6-3.6],`R${s.round}`,`L ${s.L.toUpperCase()}  R ${s.R.toUpperCase()}`,s.round%2===0?"internal":"transform"))}),n.push(...b("chain",[0,3.4,-8.2],"Feistel ladder","16 rounds · L=R, R=L⊕f(R,K)","transform")),n}case"des-swap":{const t=String(e.preOutput??""),n=String(e.resultHex??"");return vt(...b("pre",[-3.4,.4,0],"R16L16",t.toUpperCase(),"internal"),...b("fp",[0,.4,0],"final permutation","FP","transform"),...b("out",[3.4,.4,0],"output",n.toUpperCase(),"output",{emphasize:!0}),ae("swap",[-1.6,1.2,0],[1.6,1.2,0],"path"))}case"des-result":{const t=String(e.hex??"");return vt(...ve("out",t.toUpperCase(),"output",[0,.3,0],{piece:1,cellSize:.62,gap:.04}).objects,...b("cap",[0,2.1,0],e.decrypt?"plaintext":"ciphertext",t.toUpperCase(),"output",{emphasize:!0}))}case"result":return mi(e);default:return[]}}),Bd=(i=>i.stage),jr=(i,e)=>String((i==null?void 0:i[e])??"").toUpperCase(),Fl=Qe(Wh,i=>{const e=i.view;switch(e.kind){case"tdes-key":{const t=String(e.block??"").toUpperCase(),n=String(e.k1??"").toUpperCase(),s=String(e.k2??"").toUpperCase(),r=String(e.k3??"").toUpperCase();return[...ve("blk",t,"input",[0,.9,-1.4],{piece:1,cellSize:.6,gap:.035}).objects,...b("k1",[-3.6,.3,1.2],"K1",n,"key"),...b("k2",[0,.3,1.2],"K2",s,"key"),...b("k3",[3.6,.3,1.2],"K3",r,"key"),...b("split",[0,2.6,1.2],"3DES key","24 bytes split into K1 · K2 · K3","transform")]}case"tdes-pass":{const t=Bd(e),n=Number(e.index??1);if(!t)return[];const s=jr(t,"key"),r=jr(t,"input"),a=jr(t,"output"),o=String(t.stage??"").toUpperCase(),l=-7.2+(n-1)*3.6;return[...b("both",[l,1.2,-1.6],t.operation==="decrypt"?"decrypt":"encrypt",o,"transform",{emphasize:!0}),...b("opkey",[l,-.4,2],o,s,"key"),...ve("in",r,"input",[l,.6,.6],{piece:1,cellSize:.55,gap:.03}).objects,ae("pass",[l,.6,2.8],[l,.6,3.8],"path"),...ve("out",a,"output",[l,.6,4.4],{piece:1,cellSize:.55,gap:.03}).objects,...b("stagecap",[l,2.9,1.4],`pass ${n}`,o,"transform")]}case"tdes-formula":{const t=String(e.formula??"");return[...b("form",[0,.4,0],e.decrypt?"decrypt":"encrypt",t,"transform",{emphasize:!0}),...b("chain",[0,-1.7,2.6],"EDE chain","encrypt · decrypt · encrypt","internal")]}case"tdes-result":{const t=String(e.hex??"").toUpperCase();return vt(...ve("out",t,"output",[0,.3,0],{piece:1,cellSize:.62,gap:.04}).objects,...b("cap",[0,2.1,0],e.decrypt?"plaintext":"ciphertext",t,"output",{emphasize:!0}))}default:return[]}}),Is=i=>typeof i=="string"?i:"",Si=i=>{var t;if(!i)return;const e=[];for(let n=0;n<4;n++)for(let s=0;s<4;s++)e.push([`s${n}${s}`,(((t=i[n])==null?void 0:t[s])??"").toUpperCase()]);return Object.fromEntries(e)},Zr=(i,e,t)=>{var s,r;if(!i||!e)return[];const n=[];for(let a=0;a<4;a++)for(let o=0;o<4;o++){const l=(s=i[a])==null?void 0:s[o],c=(r=e[a])==null?void 0:r[o];l&&c&&l!==c&&n.push({entity:`s${a}${o}`,label:`byte (row ${a}, col ${o})`,before:l.toUpperCase(),after:c.toUpperCase(),reason:t,tone:"active"})}return n},Du=(i,e)=>{var n,s;if(!i||!e)return[];const t=[];for(let r=0;r<4;r++)for(let a=0;a<4;a++)((n=i[r])==null?void 0:n[a])!==((s=e[r])==null?void 0:s[a])&&t.push([r,a]);return t};function zd(i,e,t,n){return[...e?[mt(`${i}-b`,e,"internal",[-5.8,0,0])]:[],...t?[mt(`${i}-a`,t,"transform",[5.8,0,0],{highlight:Du(e,t)})]:[],ae(`${i}-ar`,[-2.4,.8,0],[3.4,.8,0],"path"),...b(`${i}-cap`,[0,3.8,0],"AES round",n,"transform")]}const Ol={id:Zi.id,nameKey:Zi.nameKey,educationalKey:Zi.educationalKey,demoInputs:Zi.demoInputs,buildSteps(i){const e=i.t,t=Zi.build(i),n=t.find(Ce=>Ce.id==="aes-input"),s=t.find(Ce=>Ce.id==="aes-key"),r=t.find(Ce=>Ce.id==="aes-addkey"),a=t.find(Ce=>Ce.id==="aes-sbox"),o=t.find(Ce=>Ce.id==="aes-round"),l=t.find(Ce=>Ce.id==="aes-rounds"),c=t.find(Ce=>Ce.id==="aes-final");if(!n||!s||!r||!a||!o||!l||!c)return[];const u=Ce=>{var ke;return((ke=t.find(Ne=>{var V;return((V=Ne.view)==null?void 0:V.kind)===Ce}))==null?void 0:ke.view)??{}},m=u("aes-input"),h=u("aes-key"),p=u("aes-addkey"),g=u("aes-sbox"),y=u("aes-round"),f=u("aes-rounds"),d=u("aes-final"),E=i.operation==="decrypt",w=Number(h.nk??4),v=Number(h.nr??10),M=Array.isArray(h.roundKeys)?h.roundKeys:[],T=p.before??null,C=p.after??null,x=p.roundKey??null,A=p.highlight??Du(T??void 0,C??void 0),L=g.byteIn??null,U=g.byteOut??null,N=y.a??null,z=y.b??null,P=y.c??null,O=y.d??null,B=Is(y.roundKey),G=f.rounds??[],j=d.state??null,K=Is(d.hex).toUpperCase(),q=Is(m.block).toUpperCase(),J=Is(m.key).toUpperCase(),be=(Ce,ke,Ne,V={})=>({id:`3d-${Ce.id}${V.id??""}`,titleKey:V.titleKey??Ce.titleKey,titleArgs:V.titleArgs,descKey:V.descKey??Ce.descKey,descArgs:V.descArgs??Ce.descArgs,phase:V.phase??Ce.phase,objects:ke,camera:V.camera,duration:V.duration??800,meta:Ne}),Me=[];if(Me.push(be(n,[...ve("blk",q,"input",[0,1.6,-3.6],{piece:1,cellSize:.55,gap:.03}).objects,...ve("ky",J,"key",[0,1.6,-1.4],{piece:1,cellSize:.55,gap:.03}).objects,...T?[mt("in-state",T,"input",[0,0,-.5])]:[],...b("cap",[0,4.2,3.2],"state","block laid column-major","internal")],{level:"concept",event:"INPUT_CREATED",operation:"Setup",inputs:{block:q,key:J,"key words (Nk)":String(w),rounds:String(v)},why:e("simulation3d.aes.whyInput")})),Me.push(be(s,(()=>{const Ce=[];return M.forEach((ke,Ne)=>{const V=Ne*(Math.PI*2/Math.max(M.length,1)),ee=[9*Math.cos(V),.5,9*Math.sin(V)];Ce.push(...b(`k${Ne}`,ee,`K${Ne}`,ke.toUpperCase(),Ne===0?"key":Ne%2===0?"internal":"transform"))}),Ce.push({id:"rk-ring",kind:"ring",position:[0,0,0],ringRadius:9,ringTube:.12,tone:"key"},...b("schedule",[0,2.6,0],"round keys",`Nk = ${w} · ${M.length} keys`,"key")),Ce})(),{level:"algorithm",event:"KEY_GENERATED",operation:"Key expansion",formula:"W[i] = W[i-Nk] ⊕ SubWord(RotWord(W[i-1])) ⊕ Rcon for i ≡ 0 (mod Nk)",inputs:{Nk:String(w),"rounds (Nr)":String(v),"derived round keys":String(M.length)},why:e("simulation3d.aes.whyKey")})),Me.push(be(r,[...T?[mt("ak-b",T,"input",[-7.6,0,0])]:[],...x?[mt("ak-k",x,"key",[0,0,0],{cellSize:.9})]:[],...C?[mt("ak-a",C,"transform",[7.6,0,0],{highlight:A})]:[],ae("ak-a1",[-5.4,1,0],[-2.8,1,0],"path"),ae("ak-a2",[2.8,1,0],[5.4,1,0],"path"),...b("ak-x1",[-4.1,2.4,0],"AddRoundKey","XOR K0","transform"),...b("ak-x2",[4.1,2.4,0],"AddRoundKey","state ⊕ key","transform")],{level:"operation",event:"XOR_EXECUTED",operation:"AddRoundKey(K0)",formula:"state[i] = state[i] ⊕ key[i] — every byte of the block XOR-ed with the first round key",stateBefore:Si(T??void 0),stateAfter:Si(C??void 0),changedValues:Zr(T??void 0,C??void 0,"XOR K0"),why:e("simulation3d.aes.whyAddKey")})),L&&U){const Ce=new Set(L.flat()),Ne=Array.from({length:16},(V,ee)=>Array.from({length:16},(ge,Oe)=>`${(ee*16+Oe).toString(16).padStart(2,"0").toUpperCase()}`)).map(V=>V.map(ee=>({label:ee,tone:Ce.has(ee)?"active":"muted"})));Me.push(be(a,[...L?[mt("sb-in",L,"internal",[-10.5,0,0])]:[],{id:"sb-grid",kind:"grid",position:[0,0,0],tone:"muted",grid:{height:1.2,layers:[{rows:16,cols:16,cellSize:.42,gap:.05,labelScale:.7,cells:Ne}]}},...U?[mt("sb-out",U,"transform",[10.5,0,0])]:[],ae("sb-ar1",[-8.2,1.2,0],[-4.4,1.2,0],"path"),ae("sb-ar2",[4.4,1.2,0],[8.2,1.2,0],"path"),...b("sb-op",[0,2.6,0],E?"InvSubBytes":"SubBytes",E?"inv S-box":"S-box · 16×16","transform")],{level:"operation",event:"SUBSTITUTE_EXECUTED",operation:E?"InvSubBytes":"SubBytes",formula:"each byte b is replaced by S-box[b] — a nonlinear GF(2⁸) map",stateBefore:Si(L),stateAfter:Si(U),changedValues:Zr(L,U,E?"inverse S-box":"S-box"),why:e("simulation3d.aes.whySubBytes")}))}if(N&&z&&P&&O&&Me.push(be(o,[mt("r1-a",N,"internal",[-9.6,0,0],{cellSize:.85,height:1.4}),mt("r1-b",z,"transform",[-3.2,0,0],{cellSize:.85,height:1.4}),mt("r1-c",P,"transform",[3.2,0,0],{cellSize:.85,height:1.4}),mt("r1-d",O,"output",[9.6,0,0],{cellSize:.85,height:1.4}),ae("r1-ar1",[-6.4,1,0],[-5.6,1,0],"path"),ae("r1-ar2",[0,1,0],[.8,1,0],"path"),ae("r1-ar3",[6.4,1,0],[7.2,1,0],"path"),...b("r1-op1",[-6.4,2.7,0],E?"InvShiftRows":"ShiftRows","rotate rows","transform"),...b("r1-op2",[0,2.7,0],E?"InvMixColumns":"MixColumns","mix columns","transform"),...b("r1-op3",[6.4,2.7,0],"AddRoundKey","XOR round key","transform"),...B?b("r1-rk",[0,-2.4,4.4],"round key",B,"key"):[]],{level:"bit",event:"ROUND_STARTED",operation:E?"First inverse round, magnified":"First round, magnified",formula:E?"InvShiftRows → InvSubBytes → AddRoundKey → InvMixColumns":"ShiftRows → MixColumns → AddRoundKey",inputs:{"round key":B||""},why:e("simulation3d.aes.whyRoundDetail")})),G.length>0){const Ce=[];G.forEach((ke,Ne)=>{const V=(Ne-(G.length-1)/2)*3.4;Ce.push(mt(`ov-${Ne}`,ke,Ne%2===0?"internal":"transform",[0,0,V],{cellSize:.9,height:1.5}),...b(`ovc-${Ne}`,[0,3.2,V],`round ${Ne+1}`,"","muted"))}),Ce.push(...b("ov-legend",[0,-1.8,-16],"rounds",`${G.length} mid-round states`,"internal")),Me.push(be(l,Ce,{level:"concept",event:"ROUND_STARTED",operation:"Round journey",inputs:{rounds:String(v-1),"key words (Nk)":String(w)},why:e("simulation3d.aes.whyRounds")})),G.forEach((ke,Ne)=>{const V=Ne+1,ee=V===1?C??G[0]:G[Ne-1],ge=E?v-V:V,Oe=M[ge]??"",Se=E?`inverse round ${V}/${v-1} · K${ge}`:`round ${V}/${v-1} · K${ge}`;Me.push(be(l,zd(`aes-rm${V}`,ee,ke,Se),{level:"bit",event:"ROUND_COMPLETED",operation:E?`Inverse round ${V} of ${v-1} done`:`Round ${V} of ${v-1} done`,formula:E?"InvShiftRows → InvSubBytes → AddRoundKey(K"+ge+") → InvMixColumns":"SubBytes → ShiftRows → MixColumns → AddRoundKey(K"+ge+")",inputs:Oe?{[`K${ge}`]:Oe}:void 0,stateBefore:Si(ee),stateAfter:Si(ke),changedValues:Zr(ee,ke,"AES round"),why:e("simulation3d.aes.whyRound")},{id:`-round-${V}`,titleKey:"simulation3d.aes.roundTitle",titleArgs:{n:V,total:v-1},descKey:"simulation3d.aes.roundDesc",descArgs:{n:V,total:v-1}}))})}return Me.push(be(c,[...j?[mt("fn-st",j,"output",[-4.2,0,0])]:[],ae("fn-ar",[-.9,.6,0],[1.6,.6,0],"path"),...ve("fn-out",K,"output",[4.2,.5,0],{piece:1,cellSize:.5,gap:.028}).objects,...b("fn-cap",[4.2,2.5,0],E?"plaintext":"ciphertext",K,"output",{emphasize:!0})],{level:"concept",event:"RESULT_READY",operation:E?"Decrypted plaintext":"Encrypted ciphertext",inputs:{[E?"plaintext":"ciphertext"]:K},why:e("simulation3d.aes.whyFinal")})),Me}},yi=(i,e,t,n,s,r,a=!1)=>b(i,[s,.4,r],e,t.toUpperCase(),n,{emphasize:a}),kl=Qe(Xh,i=>{const e=i.view;switch(e.kind){case"blowfish-input":{const t=String(e.block??"").toUpperCase(),n=String(e.key??"").toUpperCase(),s=String(e.L??"").toUpperCase(),r=String(e.R??"").toUpperCase();return[...ve("blk",t,"input",[0,1,-1.4],{cellSize:.62,gap:.045,glyphY:1.7}).objects,...ve("ky",n,"key",[0,1,.8],{cellSize:.62,gap:.045,glyphY:1.7}).objects,...yi("L","L (left word)",s,"internal",-2,3,!0),...yi("R","R (right word)",r,"internal",2,3,!0)]}case"blowfish-pi":{const t=e.p??[],n=[];return t.forEach((s,r)=>{const a=r*(Math.PI*2/Math.max(1,t.length));n.push(...b(`p${r}`,[10.5*Math.cos(a),.5,10.5*Math.sin(a)],`P[${r}]`,s.toUpperCase(),r%2===0?"key":"internal"))}),n.push({id:"pi-ring",kind:"ring",position:[0,0,0],ringRadius:10.5,ringTube:.12,tone:"key"},...b("pi",[0,3.2,0],"P-array","first 148 hex digits of π","key"),...b("sb",[0,-2.4,10],"S-boxes","S0..S3 · 4 × 256 entries","transform")),n}case"blowfish-ksched":{const t=e.pXor??[],n=e.finalP??[],s=[];return t.slice(0,18).forEach((r,a)=>{const o=a%6,l=Math.floor(a/6);s.push(...yi(`px${a}`,`P'[${a}]`,r,"transform",o*3.8-9.5,l*2.7-2.7))}),n.length&&(n.slice(0,18).forEach((r,a)=>{const o=a%6,l=Math.floor(a/6);s.push(...yi(`pf${a}`,`P • ${a}`,r,"output",o*3.8-9.5,l*2.7+4.4))}),s.push(...b("capf",[0,3,-3.4],"re-encrypt zero block","final P-array","output"))),s.push(...b("cap",[0,4.6,-6],"key schedule","P[i] ⊕ key-word (key bytes cycled)","transform")),s}case"blowfish-f":{const t=String(e.L??"").toUpperCase(),n=e.bytes??["","","",""],s=e.sHeads??[],r=[...b("L",[-4,1.2,-3.2],"F(R) over L",t,"internal"),ae("fa",[-1.8,1.4,-3.2],[-1,1.4,-3.2],"path")],a=1.15;return n.forEach((o,l)=>{r.push({id:`b${l}`,kind:"box",position:[(l-1.5)*a,.55,-3.2],size:[.95,.95,.95],tone:"internal"},{id:`b${l}g`,kind:"glyph",position:[(l-1.5)*a,1.35,-3.2],label:o,glyphScale:.85,tone:"internal"},...b(`s${l}`,[(l-1.5)*a,.4,-.6],`S${l}`,(s[l]??[]).slice(0,4).join(" "),"key",{emphasize:!1}))}),r.push(...b("formula",[0,1.2,-6],"F(x)","F(x) = ((S0[a] + S1[b]) XOR S2[c]) + S3[d]","transform",{emphasize:!0}),...b("xy",[0,.3,2.2],"op","⊕ / + (mod 2³²) · 16 rounds","path")),r}case"blowfish-rounds":{const t=e.states??[],n=String(e.L??"").toUpperCase(),s=String(e.R??"").toUpperCase();if(!t.length)return[...yi("L","L",n,"internal",-2,0),...yi("R","R",s,"internal",2,0),...b("form",[0,2.4,0],"Feistel","16 × (R ^= F(L) ⊕ P[i]; swap)","transform")];const r=[];return t.slice(0,16).forEach((a,o)=>{const l=o*(Math.PI*2/16);r.push(...b(`r${o}`,[9*Math.cos(l),.5,9*Math.sin(l)],`R${a.round}`,`L ${a.L.toUpperCase()} · R ${a.R.toUpperCase()}`,a.round%2===0?"internal":"transform"))}),r.push({id:"bf-ring",kind:"ring",position:[0,0,0],ringRadius:9,ringTube:.12,tone:"path"},...b("cap",[0,3.2,0],"rounds","16-round Feistel","transform")),r}case"blowfish-result":{const t=String(e.hex??"").toUpperCase();return vt(...ve("out",t,"output",[0,.3,0],{piece:1,cellSize:.62,gap:.04}).objects,...b("cap",[0,2.1,0],e.decrypt?"plaintext":"ciphertext",t,"output",{emphasize:!0}))}default:return[]}}),Bl=Qe($h,i=>{const e=i.view;switch(e.kind){case"twofish-input":{const t=String(e.block??"").toUpperCase(),n=String(e.key??"").toUpperCase(),s=["m0","m1","m2","m3"].map(a=>String(e[a]??"").toUpperCase()),r=[...ve("blk",t,"input",[0,1.2,-2],{cellSize:.58,gap:.03,glyphY:2}).objects,...ve("ky",n,"key",[0,-.4,-2],{cellSize:.58,gap:.03,glyphY:.4}).objects];return s.forEach((a,o)=>{const l=(o-1.5)*3.1;if(r.push(...b(`m${o}`,[l,.4,2.2],`m${o}`,a,"internal")),o<3){const c=(o-.5)*3.1;r.push(ae(`wa${o}`,[l+1.1,.4,2.2],[c-1.1,.4,2.2],"path"))}}),r.push(...b("cap",[0,3.2,2.2],"little-endian words","block → m0..m3","internal")),r}case"twofish-key":{const t=e.whitening??[],n=e.subkeys??[],s=[];t.slice(0,8).forEach((r,a)=>{const o=a%4,l=Math.floor(a/4);s.push(...b(`w${a}`,[o*3.4-5.1,.4,l*2.6-1.3],`w[${a}]`,r.toUpperCase(),a%2===0?"key":"internal"))});for(let r=0;r<10;r++){const a=n.slice(4*r,4*r+4),o=r%5,l=Math.floor(r/5);s.push(...b(`sk${r}`,[o*4.2-8.4,.4,3.2+l*2.6],`k · round ${r+1}`,(a.length?a:["—","—","—","—"]).join(" "),r%2===0?"key":"internal"))}return s.push(...b("cap",[0,4.4,-4.6],"key schedule","RS (12,8) + h() via q0/q1","transform")),s}case"twofish-sboxes":{const t=e.sboxes??[];if(!t.length)return[...b("cap",[0,.4,0],"S-boxes","S0..S3 · 4 × 256 MDS-combined entries","key"),...b("note",[0,-2.2,2.6],"chain","q0/q1 → MDS (GF(2⁸), 0x169)","transform")];const n=t.map(s=>({cells:s.slice(0,8).map((r,a)=>({label:r.toUpperCase(),tone:a%2===0?"key":"internal"}))}));return[{id:"sbox-heads",kind:"grid",position:[0,0,0],tone:"key",grid:{height:1.2,layers:[{rows:Math.max(1,t.length),cols:8,cellSize:1.5,gap:.24,labelScale:.72,cells:n.map(s=>s.cells)}]}},...b("cap",[0,3.6,0],"S-vector heads","q0/q1 → MDS (GF(2⁸), 0x169)","transform")]}case"twofish-whiten":{const t=["m0","m1","m2","m3"].map(r=>String(e[r]??"").toUpperCase()),n=e.keys??[],s=[];return t.forEach((r,a)=>{const o=(a-1.5)*3.3;s.push(...b(`m${a}`,[o,1.1,-1.6],`m${a}`,r,"internal"),...b(`k${a}`,[o,-.4,.4],`w${e.decrypt?4+a:a}`,(n[a]??"").toUpperCase(),"key"),ae(`x${a}`,[o,.4,1.6],[o,.4,2.8],"path"))}),s.push(...b("cap",[0,3.6,1.2],e.decrypt?"de-whitening":"whitening","a=m0⊕w0 · b=m1⊕w1 · c=m2⊕w2 · d=m3⊕w3","transform")),s}case"twofish-rounds":{const t=e.states??[];if(!t.length)return[...b("cap",[0,.4,0],"rounds","16 × (g() keyed S-boxes + MDS → PHT → 1-bit rotations)","transform"),...b("g",[0,-2,1.6],"g(x)","g(x) = S0[x0] ⊕ S1[x1] ⊕ S2[x2] ⊕ S3[x3]","key")];const n=[];return t.slice(0,16).forEach((s,r)=>{const a=r*(Math.PI*2/16);n.push(...b(`r${r}`,[9.4*Math.cos(a),.5,9.4*Math.sin(a)],`R${s.round}`,`a ${s.a.toUpperCase()} · b ${s.b.toUpperCase()} · c ${s.c.toUpperCase()} · d ${s.d.toUpperCase()}`,s.round%2===0?"internal":"transform"))}),n.push({id:"twf-ring",kind:"ring",position:[0,0,0],ringRadius:9.4,ringTube:.12,tone:"path"},...b("cap",[0,3.2,0],"rounds","16-round Feistel · 4 words","transform")),n}case"twofish-result":{const t=String(e.hex??"").toUpperCase();return[...ve("out",t,"output",[0,.3,0],{piece:1,cellSize:.58,gap:.03}).objects,...b("cap",[0,2.1,0],e.decrypt?"plaintext":"ciphertext",t,"output",{emphasize:!0})]}default:return[]}}),Hd=i=>(i>>>0).toString(16).padStart(8,"0"),Fs=(i,e)=>(i<<e|i>>>32-e)>>>0,fs=(i,e)=>i+e>>>0;function Va(i,e,t,n,s){i[e]=fs(i[e],i[t]),i[s]=Fs(i[s]^i[e],16),i[n]=fs(i[n],i[s]),i[t]=Fs(i[t]^i[n],12),i[e]=fs(i[e],i[t]),i[s]=Fs(i[s]^i[e],8),i[n]=fs(i[n],i[s]),i[t]=Fs(i[t]^i[n],7)}const Gd=[[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]],Vd=[[0,5,10,15],[1,6,11,12],[2,7,8,13],[3,4,9,14]],Nu=[1634760805,857760878,2036477234,1797285236],zl=i=>{const e=[];for(let t=0;t<i.length;t+=4){const n=i[t]??0,s=i[t+1]??0,r=i[t+2]??0,a=i[t+3]??0;e.push((n|s<<8|r<<16|a<<24)>>>0)}return e};function Wd(i,e,t){return Nu.concat(zl(za(i))).concat([t>>>0]).concat(zl(za(e)))}const ps=i=>i.map(Hd),Xd=i=>i.map(e=>parseInt(e,16)>>>0),Qn=i=>Array.from({length:4},(e,t)=>Array.from({length:4},(n,s)=>i[t*4+s]??"--------"));function $d(i){const e=i.slice();return Va(e,0,4,8,12),e}function Kd(i,e){const t=[];for(let n=0;n<4;n++)for(let s=0;s<4;s++)(i[n][s]??"--------")!==(e[n][s]??"--------")&&t.push([n,s]);return t}const Hl=i=>i.toString(16).padStart(8,"0");function Yd(i,e,t,n,s){try{const r=Wd(e,t,n),a=r.slice(),o=[];for(let h=0;h<10;h++){for(const p of Gd)Va(a,p[0],p[1],p[2],p[3]);for(const p of Vd)Va(a,p[0],p[1],p[2],p[3]);o.push(a.slice())}const l=r.map((h,p)=>fs(h,a[p])),c=new Uint8Array(l.length*4);l.forEach((h,p)=>{c[4*p]=h&255,c[4*p+1]=h>>>8&255,c[4*p+2]=h>>>16&255,c[4*p+3]=h>>>24&255});const u=s?za(i.toLowerCase()):Kh(i),m=c.slice(0,u.length).map((h,p)=>h^(u[p]??0));return{init:ps(r),doubles:o.map(ps),final:ps(a),ks:ps(l),resultHex:Yh(m)}}catch{return null}}const Jr=(i,e,t)=>i.map((n,s)=>({entity:`w${s}`,label:`word ${s}`,before:n.toUpperCase(),after:(e[s]??"--------").toUpperCase(),reason:t,tone:"active"})).filter(n=>n.before!==n.after);function qd(i,e,t,n){return[mt(`${i}-b`,e,"internal",[-4.4,0,0]),mt(`${i}-a`,t,"transform",[4.4,0,0],{highlight:Kd(e,t)}),ae(`${i}-ar`,[-1.4,.7,0],[2.4,.7,0],"path"),...b(`${i}-cap`,[0,3.8,0],"double round",n,"transform")]}const Gl={id:Ji.id,nameKey:Ji.nameKey,educationalKey:Ji.educationalKey,demoInputs:Ji.demoInputs,buildSteps(i){const e=i.t,t=Ji.build(i),n=t.find(N=>N.id==="chacha20-input"),s=t.find(N=>N.id==="chacha20-state"),r=t.find(N=>N.id==="chacha20-quarter"),a=t.find(N=>N.id==="chacha20-double"),o=t.find(N=>N.id==="chacha20-rounds"),l=t.find(N=>N.id==="chacha20-keystream"),c=t.find(N=>N.id==="chacha20-result");if(!n||!s||!r||!a||!o||!l||!c)return[];const u=N=>{var z;return((z=t.find(P=>{var O;return((O=P.view)==null?void 0:O.kind)===N}))==null?void 0:z.view)??{}},m=u("chacha-input"),h=u("chacha-state"),p=u("chacha-quarter"),g=u("chacha-keystream"),y=u("chacha-result"),f=!!y.decrypt,d=String(m.message??""),E=String(m.key??"").replace(/\s/g,"").toLowerCase(),w=String(m.nonce??"").replace(/\s/g,"").toLowerCase(),v=Number(m.counter??1)||0,M=Yd(d,E,w,v,f),T=String(y.hex??"").toUpperCase(),C=(N,z,P,O={})=>({id:`3d-${N.id}${O.id??""}`,titleKey:O.titleKey??N.titleKey,titleArgs:O.titleArgs,descKey:O.descKey??N.descKey,descArgs:O.descArgs??N.descArgs,phase:O.phase??N.phase,objects:z,camera:O.camera,duration:O.duration??800,meta:P}),x=[];x.push(C(n,[...ve("msg",d,"input",[-4,.8,-2.6],{cellSize:.7,gap:.08,glyphY:1.6}),...ve("ky",E.toUpperCase(),"key",[0,.8,.2],{piece:1,cellSize:.5,gap:.028,glyphY:1.3}),...ve("nc",w.toUpperCase(),"key",[0,.8,1.6],{piece:1,cellSize:.5,gap:.028,glyphY:1.3}),...b("ctr",[4.6,.5,2.2],"counter",String(v),"key",{emphasize:!0}),...b("cap",[0,3.2,-2.6],"inputs","message · key (32 B) · nonce · counter","internal")],{level:"concept",event:"INPUT_CREATED",operation:"Setup",inputs:{message:d,key:E.toUpperCase(),nonce:w.toUpperCase(),counter:String(v)},why:e("simulation3d.chacha20.whyInput")}));const A=h.grid??(M?Qn(M.init):void 0);A&&x.push(C(s,[mt("cc-st",A,"internal",[0,0,0]),...b("cc-cap",[0,3.7,3.2],"initial state","c · k(8) · counter · nonce · c","internal"),...b("cc-rows",[0,-2,4.6],"layout","ccckkkkkkxxxx","muted")],{level:"algorithm",event:"STATE_UPDATED",operation:"Assemble state",formula:"S[0..3] = c || S[4..11] = key || S[12] = counter || S[13..15] = nonce",inputs:M?{constant:Nu.map(Hl).join(" "),counter:Hl(v)}:void 0,stateBefore:M?Object.fromEntries(M.init.map((N,z)=>[`w${z}`,N.toUpperCase()])):void 0,why:e("simulation3d.chacha20.whyState")}));const L=p.grid??A,U=p.after??(M?Qn(ps($d(Xd(M.init)))):void 0);if(L&&U&&M&&x.push(C(r,[mt("cc-qr-b",L,"internal",[-3.6,0,0],{highlight:[[0,0],[1,0],[2,0],[3,0]]}),mt("cc-qr-a",U,"active",[3.6,0,0],{highlight:[[0,0],[1,0],[2,0],[3,0]]}),ae("cc-qr-ar",[-.2,.6,0],[1.6,.6,0],"path"),...b("cc-qr-cap",[0,3.7,0],"quarter round","quarter_round(0, 4, 8, 12)","transform")],{level:"operation",event:"ROTATE_EXECUTED",operation:"Quarter round (0,4,8,12)",formula:"a+=b · d=RROTL(d^a,16) · c+=d · b=RROTL(b^c,12) · a+=b · d=RROTL(d^a,8) · c+=d · b=RROTL(b^c,7)",changedValues:Jr(L.flat(),U.flat(),"quarter round"),why:e("simulation3d.chacha20.whyQuarter")})),M){M.doubles.forEach((O,B)=>{const G=B===0?M.init:M.doubles[B-1],j=Qn(G),K=Qn(O);x.push(C(a,qd(`cc-dr${B}`,j,K,`double round ${B+1} / 10`),{level:B===0?"operation":"bit",event:"ROUND_STARTED",operation:`Double round ${B+1} of 10`,formula:"column round: (0,4,8,12) (1,5,9,13) (2,6,10,14) (3,7,11,15) · diagonal round: (0,5,10,15) (1,6,11,12) (2,7,8,13) (3,4,9,14)",inputs:{},stateBefore:Object.fromEntries(G.map((q,J)=>[`w${J}`,q.toUpperCase()])),stateAfter:Object.fromEntries(O.map((q,J)=>[`w${J}`,q.toUpperCase()])),changedValues:Jr(G,O,"column + diagonal QR"),why:e("simulation3d.chacha20.whyDouble")},{id:`-round-${B+1}`,titleKey:"simulation3d.chacha20.doubleTitle",titleArgs:{n:B+1},descKey:"simulation3d.chacha20.doubleDesc",descArgs:{n:B+1}}))}),x.push(C(o,[mt("cc-wrk",Qn(M.final),"internal",[0,0,0]),...b("cc-wrk-cap",[0,3.7,3.2],"working state","state after all 20 rounds","transform")],{level:"algorithm",event:"ROUND_COMPLETED",operation:"Working state",formula:"after 10 × (column round + diagonal round)",inputs:{"double rounds":"10"},why:e("simulation3d.chacha20.whyRounds")}));const N=g.init??Qn(M.init),z=g.ks??Qn(M.ks),P=String(g.ksHex??"");x.push(C(l,[mt("cc-ks-i",N,"muted",[-5,0,0]),mt("cc-ks-z",z,"transform",[5,0,0]),ae("cc-ks-ar1",[-2,.7,0],[-.4,.7,0],"path"),ae("cc-ks-ar2",[2.2,.7,0],[4,.7,0],"path"),...b("cc-ks-cap",[0,3.5,0],"keystream block","init + working (mod 2³²)","transform"),...P?ve("cc-ksh",P.toUpperCase(),"output",[0,-.6,4.6],{piece:2,cellSize:.46,gap:.025,glyphY:.15}):[]],{level:"operation",event:"ADD_EXECUTED",operation:"Keystream block Z",formula:"Z[i] = init[i] + working[i] (mod 2³²)",changedValues:Jr(M.init,M.ks,"init + working (mod 2³²)"),why:e("simulation3d.chacha20.whyKeystream")}))}else{const N=h.grid??p.grid;N&&x.push(C(s,[mt("st",N,"internal",[0,0,0])],{level:"algorithm",event:"STATE_UPDATED",operation:"Initial state"})),x.push(C(a,[mt("cc-b",N??[],"internal",[0,0,0])],{level:"operation",event:"ROUND_STARTED",operation:"Rounds"}))}return x.push(C(c,vt(...ve("out",T,"output",[0,.6,0],{piece:1,cellSize:.5,gap:.028,glyphY:1.3}),...b("cc-out-cap",[0,2.5,0],f?"plaintext":"ciphertext",T,"output",{emphasize:!0})),{level:"concept",event:"XOR_EXECUTED",operation:f?"Decrypt (XOR)":"Encrypt (XOR)",formula:f?"P = C ⊕ Z":"C = P ⊕ Z",inputs:{message:d,keystream:"first 64 bytes"},outputs:{result:T},why:e("simulation3d.chacha20.whyResult")})),x}},Vl=Qe(qh,i=>{const e=i.view;switch(e.kind){case"agcm-input":{const t=e.decrypt?String(e.ciphertext??""):String(e.plaintext??""),n=String(e.key??""),s=String(e.nonce??""),r=String(e.aad??"");return[...t?ve("data",e.decrypt?t.toUpperCase():t,"input",[0,1,-2.4],{cellSize:.62,gap:.045,glyphY:1.7}).objects:[jd("nodata","no input")],...ve("ky",n.toUpperCase(),"key",[0,1,-.4],{piece:1,cellSize:.44,gap:.024,glyphY:1.35}),...ve("nc",s.toUpperCase(),"key",[0,1,1],{piece:1,cellSize:.44,gap:.024,glyphY:1.35}),...r?ve("aad",r,"internal",[0,1,2.4],{cellSize:.62,gap:.045,glyphY:1.7}).objects:[],...b("cap",[0,3.4,0],"inputs",e.decrypt?"ciphertext ‖ tag":"plaintext · key · nonce · aad","internal")]}case"agcm-stream":{const t=(e.decrypt?String(e.pt??""):String(e.ct??""))||"no result yet";return[...ve("out",t.toUpperCase(),"output",[0,.8,0],{piece:1,cellSize:.5,gap:.028,glyphY:1.4}),...b("op",[0,3.1,0],e.decrypt?"AES-CTR decrypt":"AES-CTR encrypt","CTR keystream ⊕ block","transform"),...b("formula",[0,-1.2,2.8],"CTR","E_K(counter ‖ nonce) XOR plaintext","muted")]}case"agcm-mackey":{const t=String(e.nonce??"").toUpperCase();return[...ve("nc",t,"key",[0,.8,-.8],{piece:1,cellSize:.5,gap:.028,glyphY:1.4}),...b("h",[-4,.5,1.6],"H subkey","AES-encrypt 0¹²⁸","internal"),...b("j0",[4,.5,1.6],"J0","nonce ‖ 0x00000001","key"),...b("cap",[0,2.8,1.6],"GHASH setup","H = E_K(0¹²⁸) · J0 = nonce‖1","transform")]}case"agcm-ghash":{const t=String(e.aadHex??""),n=String(e.tagHex??"");return[...t?ve("aad",t.toUpperCase(),"internal",[0,.9,-1.4],{piece:1,cellSize:.44,gap:.024,glyphY:1.55}).objects:[],...b("gh",[0,.5,1.4],"GHASH(H, ·)","AAD ‖ ciphertext ‖ len","transform"),...b("tag",[0,-.4,3.4],"tag",n.toUpperCase(),"output",{emphasize:!0})]}case"agcm-verify":{const n=String(e.auth??"")==="PASS",s=String(e.tagHex??"").toUpperCase();return vt(...b("auth",[0,.4,0],"authentication",n?"PASS":e.decrypt?"verify tag first":"tag ready",n?"output":e.decrypt?"error":"internal",{emphasize:!0}),...b("tag",[0,-2,0],"tag",s,"output"),...b("note",[0,2.9,0],"timing-safe","constant-time compare","muted"))}case"agcm-result":{const t=String(e.out??"").toUpperCase();return vt(...ve("out",t,"output",[0,.6,0],{piece:1,cellSize:.5,gap:.028,glyphY:1.4}),...b("cap",[0,2.7,0],e.decrypt?"plaintext":"ciphertext ‖ tag",t,"output",{emphasize:!0}))}default:return[]}});function jd(i,e){return{id:i,kind:"glyph",position:[0,1,-2.4],label:e,glyphScale:.9,tone:"muted"}}const Wl=Qe(jh,i=>{const e=i.view;switch(e.kind){case"cp-input":{const t=e.decrypt?String(e.ciphertext??""):String(e.plaintext??""),n=String(e.key??""),s=String(e.nonce??""),r=String(e.aad??"");return[...t?ve("data",e.decrypt?t.toUpperCase():t,"input",[0,1,-2.4],{cellSize:.62,gap:.045,glyphY:1.7}).objects:[],...ve("ky",n.toUpperCase(),"key",[0,1,-.4],{piece:1,cellSize:.44,gap:.024,glyphY:1.35}),...ve("nc",s.toUpperCase(),"key",[0,1,1],{piece:1,cellSize:.44,gap:.024,glyphY:1.35}),...r?ve("aad",r,"internal",[0,1,2.4],{cellSize:.62,gap:.045,glyphY:1.7}).objects:[],...b("cap",[0,3.4,0],"inputs",e.decrypt?"ciphertext ‖ tag":"plaintext · key · nonce · aad","internal")]}case"cp-stream":{const t=(e.decrypt?String(e.pt??""):String(e.ct??""))||"no result yet";return[...ve("out",t.toUpperCase(),"output",[0,.8,0],{piece:1,cellSize:.5,gap:.028,glyphY:1.4}),...b("op",[0,3.1,0],e.decrypt?"ChaCha20 decrypt":"ChaCha20 encrypt","ChaCha20(key, nonce, ctr=1) ⊕ data","transform")]}case"cp-mackey":{const t=String(e.nonce??"").toUpperCase();return[...ve("nc",t,"key",[0,.8,-.8],{piece:1,cellSize:.5,gap:.028,glyphY:1.4}),...b("rs",[0,.6,1.8],"one-time key","r, s ← ChaCha20 block 0 first 32 bytes","key"),...b("cap",[0,2.9,1.8],"Poly1305 key","block 0 → r ‖ s","transform")]}case"cp-poly":{const t=String(e.aadHex??""),n=String(e.tagHex??"");return[...t?ve("aad",t.toUpperCase(),"internal",[0,.9,-1.4],{piece:1,cellSize:.44,gap:.024,glyphY:1.55}).objects:[],...b("gh",[0,.5,1.4],"Poly1305(r, s, ·)","AAD ‖ ciphertext ‖ len","transform"),...b("tag",[0,-.4,3.4],"tag",n.toUpperCase(),"output",{emphasize:!0})]}case"cp-verify":{const n=String(e.auth??"")==="PASS",s=String(e.tagHex??"").toUpperCase();return vt(...b("auth",[0,.4,0],"authentication",n?"PASS":e.decrypt?"verify tag first":"tag ready",n?"output":e.decrypt?"error":"internal",{emphasize:!0}),...b("tag",[0,-2,0],"tag",s,"output"),...b("note",[0,2.9,0],"timing-safe","constant-time compare","muted"))}case"cp-result":{const t=String(e.out??"").toUpperCase();return vt(...ve("out",t,"output",[0,.6,0],{piece:1,cellSize:.5,gap:.028,glyphY:1.4}),...b("cap",[0,2.7,0],e.decrypt?"plaintext":"ciphertext ‖ tag",t,"output",{emphasize:!0}))}default:return[]}});function gi(i,e){const t=(i||"·").split("");return[...vn("msg",t.map(n=>({label:n,tone:"input"})),[0,.6,-2.2],{cellSize:.72,gap:.09}).objects,...b("hex",[0,-.3,1.6],"bytes",e.toUpperCase(),"input")]}function No(i,e,t={}){const n=t.piece??2,s=t.msgBytesPerBlock??64,r=i.map((a,o)=>({label:`block ${o}`,cells:(a.match(new RegExp(`.{${n}}`,"g"))??[]).map((l,c)=>({label:l.toUpperCase(),tone:o*s+c*n<e?"internal":"key"}))}));return $t(r,[0,0,0],{rowStep:2.4,cellSize:.52,gap:.03}).objects}function nn(i,e,t,n){const s=(e??[]).map(r=>({label:r.toUpperCase(),tone:t}));return vn(i,s,n,{cellSize:.62,gap:.05,cubeY:.3,glyphY:1}).objects}function Ki(i,e,t={}){const n=t.radius??6.5,s=new Set(t.samples??[]),r=t.tone??"internal",a=[{id:`${i}-orbit`,kind:"ring",position:[0,.4,0],ringRadius:n,ringTube:.08,tone:"path"}];for(let l=0;l<e;l++){const c=l*(Math.PI*2/e),u=s.has(l)?n*.96:n;a.push({id:`${i}-${l}`,kind:"sphere",position:[u*Math.cos(c),.55,u*Math.sin(c)],size:s.has(l)?[.5,.5,.5]:[.34,.34,.34],tone:s.has(l)?"active":r,emphasize:s.has(l)})}const o=t.note??`${e} rounds`;return a.push(...b(`${i}-cap`,[0,2.5,-n*.9],"rounds",o,"transform")),a}function Xl(i,e={}){var s;const t=e.rateLanes??0,n=[];for(let r=0;r<5;r++){const a=[];for(let o=0;o<5;o++){const l=r*5+o;a.push({label:((s=e.values)==null?void 0:s[l])??"·",tone:l<t?e.tone??"internal":"key"})}n.push(a)}return[Fn(i,n,{cellSize:1.15,gap:.14,labelScale:.9,height:1.4})]}function Zd(i,e,t,n){const a=[];for(let o=0;o<e;o++){const l=o<t,c=-18.27+o*(.42+.16);a.push({id:`${i}-${o}`,kind:"box",position:[c,.3,0],size:[.42,.42,.42],tone:l?"output":"key",opacity:l?1:.5},{id:`${i}-${o}g`,kind:"glyph",position:[c,.95,0],label:l?"•":"·",glyphScale:.6,tone:l?"output":"key",opacity:l?1:.5})}return a.push(...b(`${i}-cap`,[0,2.5,1.8],"XOF",n,"output")),a}function sn(i,e){const t=i.replace(/\s/g,"");return t?[...b("dg",[0,1.1,-2.4],"digest",e.toUpperCase(),"output",{emphasize:!0}),...ve("dgs",t.toUpperCase(),"output",[0,-1,2.8],{piece:2,cellSize:.5,gap:.03})]:[...b("dg",[0,1.1,-2.4],"digest",e.toUpperCase(),"output",{emphasize:!0}),...b("dg-pending",[0,-1.4,2.2],"result","—","muted"),...b("dg-run",[0,-3,4.6],"note","run the algorithm to get the real digest","muted")]}const $l=Qe(Zh,i=>{const e=i.view;switch(e.kind){case"sha256-input":return gi(String(e.text??""),String(e.hex??""));case"sha256-padding":return[...No(e.blocksHex??[],Number(e.msgLen??0)),...b("padcap",[0,1.6,-4.4],"padding",`${Number(e.blockCount)} block(s) · ${Number(e.padBytes)} pad bytes`,"key")];case"sha256-schedule":{const t=e.schedule??[],n=[];for(let s=0;s<t.length;s+=8)n.push(t.slice(s,s+8));return[Fn("schedule",n.map(s=>s.map(r=>({label:r.toUpperCase(),tone:"internal"}))),{cellSize:1.35,gap:.12,labelScale:.85,height:1.5}),...b("schedule-cap",[0,2.4,-4.6],"message schedule","W[0..63] · 8×8","internal")]}case"sha256-rounds":{const t=e.rounds??[],n=e.samples??[],s=Ki("sha256-rt",t.length,{samples:n});return t.filter(r=>n.includes(r.t)).forEach((r,a)=>{const o=(a-(Math.min(n.length,3)-1)/2)*4.6;s.push(...b(`rs${a}`,[o,1.25,3.2],`round t = ${r.t}`,`W=${r.w}`,"internal"),...nn(`rs${a}-st`,r.state,"transform",[o-2,-.7,3.2]))}),s}case"sha256-final":{const t=e.hInit??[],n=e.hFinal??[],s=String(e.digest??"");return[...nn("h0",t,"input",[0,.4,-4.8]),ae("f1",[0,.5,-3.4],[0,.5,-1.6],"path"),...nn("h1",n,"transform",[0,.4,0]),ae("f2",[0,.5,1.4],[0,.5,3.2],"path"),...ve("dig",s.toUpperCase(),"output",[0,.55,4.4],{piece:2,cellSize:.44,gap:.026}).objects,...b("hstate",[0,2.9,-4.6],"state","h0 · h1 · … · h7","input")]}default:return[]}}),Jd=["a","b","c","d","e","f","g","h"];function Kl(i){const e={};return Jd.forEach((t,n)=>{e[t]=(i[n]??"").toUpperCase()}),e}function Qd(i,e){const t=(n,s,r,a)=>({entity:n,label:`register ${n}`,before:s.toUpperCase(),after:r.toUpperCase(),reason:a,tone:"active"});return[t("a",i[0],e[0],"a = T1 + T2"),t("b",i[0],e[1],"b ← a"),t("c",i[1],e[2],"c ← b"),t("d",i[2],e[3],"d ← c"),t("e",i[4],e[4],"e = d + T1"),t("f",i[4],e[5],"f ← e"),t("g",i[5],e[6],"g ← f"),t("h",i[6],e[7],"h ← g")]}function ef(i,e,t){const n=e*(Math.PI*2/t);return[{id:`${i}-ring`,kind:"ring",position:[0,.7,0],ringRadius:1.7,ringTube:.05,tone:"path"},{id:`${i}-dot`,kind:"sphere",position:[1.7*Math.cos(n),.85,1.7*Math.sin(n)],size:[.42,.42,.42],tone:"active",emphasize:!0}]}function tf(i,e){const t=e.map((n,s)=>({label:n.toUpperCase(),tone:s===0||s===4?"active":"internal",emphasize:s===0||s===4}));return vn(i,t,[0,.95,1.7],{cellSize:.62,gap:.05,cubeY:.3,glyphY:1}).objects}function nf(i){if(i.length===0)return[];const e=[];return i.forEach((t,n)=>{const s=[];for(let o=0;o<t.length;o+=16)s.push(t.slice(o,o+16));const r=(n-(i.length-1)/2)*3.1,a=[];for(let o=0;o<s.length;o+=8)a.push(s.slice(o,o+8));e.push(Fn(`blk-${n}`,a.map(o=>o.map(l=>({label:l.toUpperCase(),tone:"internal"}))),{cellSize:1.15,gap:.12,labelScale:.75,height:1.3})),e.push(...b(`blkc-${n}`,[0,2.7,r],`block ${n}`,"512-bit","muted"))}),e}const Yl={id:Qi.id,nameKey:Qi.nameKey,educationalKey:Qi.educationalKey,demoInputs:Qi.demoInputs,getLegend(){return[{id:"input",labelKey:"simulation3d.legend.input",tone:"input"},{id:"key",labelKey:"simulation3d.legend.key",tone:"key"},{id:"active",labelKey:"simulation3d.legend.active",tone:"active"},{id:"transform",labelKey:"simulation3d.legend.transform",tone:"transform"},{id:"internal",labelKey:"simulation3d.legend.internal",tone:"internal"},{id:"output",labelKey:"simulation3d.legend.output",tone:"output"},{id:"path",labelKey:"simulation3d.legend.path",tone:"path"}]},buildSteps(i){var z;const e=i.t,t=Qi.build(i),n=t.find(P=>P.id==="sha512-input"),s=t.find(P=>P.id==="sha512-padding"),r=t.find(P=>P.id==="sha512-rounds"),a=t.find(P=>P.id==="sha512-state"),o=t.find(P=>P.id==="sha512-digest");if(!n||!s||!r||!a||!o)return[];const l=P=>{var O;return((O=t.find(B=>{var G;return((G=B.view)==null?void 0:G.kind)===P}))==null?void 0:O.view)??{}},c=l("sha512-input"),u=l("sha512-padding"),m=l("sha512-state"),h=l("sha512-digest"),p=((z=i.result)==null?void 0:z.extra)??{},y=(Array.isArray(p.blocks)?p.blocks:[])[0],f=(y==null?void 0:y.rounds)??[],d=Array.isArray(m.hInit)?m.hInit:[],E=Array.isArray(m.state)?m.state:[],w=f.length>0,v=d.length===8&&E.length===8&&!!m.hasResult,M=String(h.digest??""),T=M.length>0&&!!h.hasResult,C=(P,O,B,G={})=>({id:`3d-${P.id}${G.id??""}`,titleKey:G.titleKey??P.titleKey,titleArgs:G.titleArgs,descKey:G.descKey??P.descKey,descArgs:G.descArgs??P.descArgs,phase:G.phase??P.phase,objects:O,camera:G.camera,duration:G.duration??800,meta:B}),x=[],A=String(c.text??""),L=String(c.hex??"");x.push(C(n,gi(A,L),{level:"concept",event:"INPUT_CREATED",operation:"Encode input",inputs:{message:A||"·",bytes:L.toUpperCase()},why:e("simulation3d.sha512.whyInput")}));const U=Array.isArray(u.blocksHex)?u.blocksHex:[];if(x.push(C(s,nf(U),{level:"algorithm",event:"PADDING_APPLIED",operation:"MD padding",inputs:{bytes:String(c.len??0),bits:String(c.bits??0),blocks:String(Number(u.blockCount??0)),"pad bytes":String(Number(u.padBytes??0))},why:e("simulation3d.sha512.whyPadding")})),w){const P=f.slice(0,16).map(B=>B.W),O=[16,20,63].filter(B=>f[B]).map(B=>({[B]:f[B].W})).reduce((B,G)=>({...B,...G}),{});x.push(C(r,[...nn("sh-sch",P,"input",[0,1,.8]),...b("sh-schcap",[0,2.8,-1.6],"W[0..15]","message words","transform"),...b("sh-lexp",[0,-1.4,2.4],"W[16..79]","σ0 + σ1 expansion","key")],{level:"operation",event:"SCHEDULE_READY",operation:"Message schedule",formula:"W[t] = σ0(W[t-15]) + W[t-16] + σ1(W[t-2]) + W[t-7]",inputs:{"W[0..15]":"block 0 words",σ0:"ROTR1 ⊕ ROTR8 ⊕ SHR7",σ1:"ROTR19 ⊕ ROTR61 ⊕ SHR6"},outputs:O,why:e("simulation3d.sha512.whySchedule")})),x.push(C(r,Ki("sh-ov",80,{samples:[0,20,63],radius:8.2,note:"80 rounds"}),{level:"concept",event:"ROUND_STARTED",operation:"Round traversal",inputs:{"working registers":"a,b,c,d,e,f,g,h",rounds:"80"},why:e("simulation3d.sha512.whyOverview")})),f.forEach((B,G)=>{const j=G===0?(y==null?void 0:y.state_before)??[]:f[G-1].state,K=[...ef(`sh-cu-${B.t}`,B.t,80),...tf(`sh-rt-${B.t}`,B.state),...b(`sh-w-${B.t}`,[-3.4,.3,-2.8],`W[${B.t}]`,B.W,"key"),...b(`sh-k-${B.t}`,[-1.1,.3,-2.8],`K[${B.t}]`,B.K,"input"),...b(`sh-t1-${B.t}`,[1.4,.3,-2.8],"T1",B.T1,"transform"),...b(`sh-t2-${B.t}`,[3.7,.3,-2.8],"T2",B.T2,"internal")];x.push(C(r,K,{level:"operation",event:"ROUND_STARTED",operation:`Round t = ${B.t} — compression`,formula:"T1 = h + Σ1(e) + Ch(e,f,g) + K[t] + W[t] · T2 = Σ0(a) + Maj(a,b,c) · a ← T1+T2 · e ← d+T1",inputs:{"W[t]":B.W,"K[t]":B.K},outputs:{T1:B.T1,T2:B.T2,"new a":B.state[0]},stateBefore:Kl(j),stateAfter:Kl(B.state),changedValues:Qd(j,B.state),highlightedEntities:[`sh-rt-${B.t}-0`,`sh-rt-${B.t}-4`],why:e("simulation3d.sha512.whyRound")},{id:`-round-${B.t}`,titleKey:"simulation3d.sha512.roundTitle",titleArgs:{n:B.t},descKey:"simulation3d.sha512.roundDesc",descArgs:{n:B.t},camera:G===0?Sd(K.map(q=>q.position),{distance:13}):void 0}))})}else x.push(C(r,Ki("sh-ov",80,{samples:[],radius:8.2,note:"80 rounds"}),{level:"concept",event:"ROUND_STARTED",operation:"Round traversal",why:e("simulation3d.sha512.whyOverview")}));const N=v?[...nn("sh-h0",d,"input",[0,.4,-3.6]),ae("sh-ar",[0,.5,-2.2],[0,.5,-1.1],"path"),...nn("sh-h1",E,"transform",[0,.4,.6]),...b("sh-stcap",[0,2.6,3.8],"state","h0..h7 after all blocks","internal")]:[...nn("sh-h0",d,"input",[0,.4,0])];return x.push(C(a,N,{level:"algorithm",event:"STATE_UPDATED",operation:"Chaining update",formula:"H[i] ← H[i] + compressed word[i]",inputs:v?{"chaining in":d.join(" ")}:void 0,outputs:v?{"chaining out":E.join(" ")}:void 0,stateBefore:v?Object.fromEntries(d.map((P,O)=>[`h${O}`,P.toUpperCase()])):void 0,stateAfter:v?Object.fromEntries(E.map((P,O)=>[`h${O}`,P.toUpperCase()])):void 0,changedValues:v?d.map((P,O)=>({entity:`h${O}`,label:`chaining word h${O}`,before:P.toUpperCase(),after:E[O].toUpperCase(),reason:"add compressed block words",tone:"transform"})):void 0,why:e("simulation3d.sha512.whyState")})),x.push(C(o,sn(T?M:"—","SHA-512"),{level:"concept",event:"HASH_FINALIZED",operation:"Finalize digest",inputs:{digest:T?M:"—"},why:e("simulation3d.sha512.whyDigest")},{id:T?"":"-preview"})),x}},ql=Qe(Jh,i=>{const e=i.view;switch(e.kind){case"sha1-input":return gi(String(e.text??""),String(e.hex??""));case"sha1-padding":return[...No(e.blocksHex??[],Number(e.msgLen??0)),...b("padcap",[0,1.6,-4.4],"padding",`${Number(e.blockCount)} block(s) · ${Number(e.padBytes)} pad bytes`,"key")];case"sha1-rounds":return Ki("sha1-rt",80,{radius:7.4,note:"f₀..f₇₉"});case"sha1-state":{const t=e.hInit??[],n=e.hFinal??[];return[...nn("h0",t,"input",[0,.4,-3.4]),ae("s1",[0,.5,-2.2],[0,.5,-1.1],"path"),...nn("h1",n,"transform",[0,.4,.6]),...b("hstate",[0,2.4,3.4],"state","h0..h4 (160-bit)","internal")]}case"sha1-digest":return sn(String(e.digest??""),"SHA-1");default:return[]}}),jl=Qe(Qh,i=>{const e=i.view;switch(e.kind){case"md5-input":return gi(String(e.text??""),String(e.hex??""));case"md5-padding":return[...No(e.blocksHex??[],Number(e.msgLen??0)),...b("padcap",[0,1.6,-4.4],"padding",`${Number(e.blockCount)} block(s) · ${Number(e.padBytes)} pad bytes`,"key")];case"md5-rounds":{const t=[];return["F","G","H","I"].forEach((n,s)=>{const r=Ki(`md5-${n}`,16,{radius:3.2,note:`R${s+1} · ${n}`,tone:"transform"}),a=[(s-1.5)*7.6,0,0];r.forEach(o=>{const l=o.position;t.push({...o,position:[l[0]+a[0],l[1],l[2]]})})}),t.push(...b("rounds-cap",[0,4.4,0],"1st pass","4 × 16 steps = 64","internal")),t}case"md5-state":return[...nn("h0",e.hInit??[],"input",[0,.4,-2.4]),...b("hstate",[0,2.5,2.8],"state","A B C D · 32-bit words","internal")];case"md5-digest":return sn(String(e.digest??""),"MD5");default:return[]}}),Zl=Qe(ed,i=>{const e=i.view;switch(e.kind){case"sha3-input":return[...gi(String(e.text??""),String(e.hex??"")),...b("rate-cap",[0,2.6,4.2],"sponge",`rate ${Number(e.rate)} · capacity ${200-Number(e.rate)}`,"key")];case"sha3-sponge":return[...Xl("sponge",{rateLanes:Number(e.rate)/8}),...b("sponge-cap",[0,3.2,0],"rate region",`${Number(e.rate)} bytes · rest capacity (${Number(e.capacity)})`,"transform"),...b("sponge-note",[0,-2.6,4.6],"note","structural 5×5 lane grid · real words appear in absorb / squeeze","muted")];case"sha3-absorb":{const t=e.absorb??[],n=!!e.hasResult,s=Number(e.rateLanes??e.rate)%25||17;if(!n||t.length===0){const a=Array.from({length:Math.max(1,Number(e.blocks))},(o,l)=>({label:`block ${l}`,cells:Array.from({length:Math.min(25,Math.max(s,1))},()=>({label:"·",tone:"muted"}))}));return[...$t(a,[0,0,0],{rowStep:2.4,cellSize:.7,gap:.12}).objects,...b("absorb-cap",[0,2.2,-4],"absorb",`${Number(e.blocks)} block(s) · rate ${Number(e.rate)}`,"key"),...b("absorb-note",[0,-2,4.4],"note","placeholder · run the algorithm to see the real absorbed blocks","muted")]}const r=[];return t.forEach((a,o)=>{const l=(o-(t.length-1)/2)*2.6,c=(a.lanes_xor??[]).map(u=>u.toUpperCase());c.length&&r.push(...ve(`ab-${o}`,c.join(""),"transform",[0,.3,l],{piece:8,cellSize:.72,gap:.06}).objects),r.push(...b(`abc-${o}`,[0,2,l],`block ${a.block_index}`,"⊕ into rate region","internal"))}),r}case"sha3-squeeze":{const t=e.state??[];return[...Xl("squeeze",{values:t.length===25?t:void 0,tone:"internal"}),...b("squeeze-cap",[0,3.4,0],"Keccak-f","permute ×24, then squeeze","internal"),...b("out-len",[0,-1.4,5],"digest bytes",String(e.digestBytes??""),"output"),...t.length!==25?b("squeeze-note",[0,-3,4.6],"note","placeholder lanes · run the algorithm to see the real permuted state","muted"):[]]}case"sha3-digest":return sn(String(e.digest??""),"SHA-3");default:return[]}}),Jl=Qe(td,i=>{const e=i.view;switch(e.kind){case"blake2-input":return[...gi(String(e.text??""),String(e.hex??"")),...b("variant",[0,2.6,4.2],"variant",`blake2${String(e.variant)} · ${Number(e.rounds)} rounds`,"key")];case"blake2-param":{const t=e.hInit??[];return[...ve("param-word",String(e.param??""),"key",[0,.6,-2.6],{piece:8,cellSize:.85}).objects,...b("param-cap",[0,2.7,-2.4],"parameter word",`h[0] ⊕ 0x${String(e.param??"")}`,"key"),...nn("h0",t,"internal",[0,.4,2.4]),...b("ivistate",[0,2.5,2.6],"initial h","IV with parameter word folded in","internal")]}case"blake2-state":{const t=e.v??[],s=t.length===16?[t.slice(0,8),t.slice(8,16)]:[];return[Fn("v-state",s.map(r=>r.map(a=>({label:a.toUpperCase(),tone:"internal"}))),{cellSize:1.15,gap:.1,labelScale:.75,height:1.3}),...b("velse",[0,2.6,-3.8],"v[0..15]","h ⊕ IV · IV[12..15] counter bytes","internal")]}case"blake2-rounds":{const t=Number(e.rounds??12),n=e.sigma??[];return[...Ki("blake2-rt",t,{radius:6.2,tone:"transform"}),Fn("sigma",n.map(s=>s.slice(0,8).map(r=>({label:String(r),tone:"key"}))),{cellSize:.62,gap:.08,labelScale:.8,height:.9}),...b("sigma-cap",[0,2.5,-5.4],"σ message schedule","G mixers use σ[r] rows","key")]}case"blake2-digest":return sn(String(e.digest??""),`blake2${String(e.variant??"")}`);default:return[]}}),Ql=Qe(nd,i=>{const e=i.view;switch(e.kind){case"blake3-input":return[...gi(String(e.text??""),String(e.hex??"")),...b("olen",[0,2.6,4.2],"output length",`${Number(e.length)} bytes (XOF)`,"key")];case"blake3-chunks":{const t=e.ranges??[],n=Math.max(1,Number(e.chunkCount??1)),s=[],r=Math.min(18,Math.max(5,n*3));return t.forEach((a,o)=>{const[l,,c]=yl(n,r)[o];s.push(...b(`chunk-${o}`,[l,.4,c],`chunk ${o}`,`b[${a}]`,"transform"))}),s.push(...b("chunks-cap",[0,2.6,-3.4],"chunks",`${n} chunk(s) of up to 1024 bytes`,"internal")),s}case"blake3-tree":{const t=e.levels??[],n=e.rootCv??[],s=[],r=t.length-1;return t.forEach((a,o)=>{const l=o*1.7+.3,c=Math.max(3,a*2.2),u=yl(a,c,l),m=o===r?"output":o===0?"internal":"transform";u.forEach((h,p)=>{s.push({id:`tree-${o}-${p}`,kind:"sphere",position:[h[0],l,h[2]],size:[o===r?.62:.42,o===r?.62:.42,o===r?.62:.42],tone:m,emphasize:o===r})})}),n.length&&(s.push(...nn("root-cv",n,"output",[0,.4,-3.2])),s.push(...b("rootcap",[0,2.4,-3.4],"root chaining value",n.length>1?`${n[0].toUpperCase()} … +${n.length-1} more`:n[0].toUpperCase(),"internal"))),s}case"blake3-xof":return Zd("xof",64,Number(e.length??32),`first ${Number(e.length)} bytes`);case"blake3-digest":return e.hasResult?sn(String(e.digest??""),"BLAKE3"):b("dg",[0,.5,0],"digest","—","muted");default:return[]}});function Os(i,e){const t=[];for(let n=0;n+1<i.length;n+=2)t.push((parseInt(i.slice(n,n+2),16)^e).toString(16).padStart(2,"0"));return t.join("")}const ec=Qe(id,i=>{const e=i.view;switch(e.kind){case"hmac-key":{const t=!!e.structural,n=String(e.keyPadded??""),s=String(e.hashName??""),r=Number(e.block??64);return t?b("k0",[0,.6,0],"K0",`${s} · ${r}-byte block`,"key",{emphasize:!0}):[...ve("k0",n.toUpperCase(),"key",[0,.4,-1.8],{piece:2,cellSize:.5,gap:.03}).objects,...b("k0cap",[0,2.3,2.2],"K0",`key padded to ${r} bytes`,"key"),...e.keyTooLong?b("too-long",[0,-1.1,3.4],"key too long","hashed once to fit","warning"):[]]}case"hmac-xor":{const t=!!e.structural,n=String(e.keyPadded??"");return t?[...b("ax1",[-3.5,.6,0],"inner key","K0 ⊕ ipad 0x36","internal"),...b("ax2",[3.5,.6,0],"outer key","K0 ⊕ opad 0x5c","internal")]:[...$t([{label:"K0",cells:ns(n,"key")},{label:"ipad",cells:ns(Os(n,54),"muted")},{label:"XOR ipad",cells:ns(Os(n,54),"internal")},{label:"opad",cells:ns(Os(n,92),"muted")},{label:"XOR opad",cells:ns(Os(n,92),"internal")}],[0,0,0],{rowStep:2,cellSize:.5,gap:.03}).objects,...b("xorcap",[0,3.4,-4],"ipad/opad","constant XOR tails with the block key","internal")]}case"hmac-inner":{const t=String(e.innerMsg??""),n=String(e.innerDigest??"");return e.structural?[...b("in-msg",[0,.6,-3.4],"input","(K0 ⊕ ipad) ∥ message","input"),ae("in-a",[0,.6,-1.6],[0,.6,1.6],"path"),...b("in-dg",[0,.6,3.2],"inner digest",n||"—","internal")]:[...ve("inner",t.toUpperCase(),"input",[0,.4,-3],{piece:2,cellSize:.44,gap:.026}).objects,ae("in-a",[0,.5,-.4],[0,.5,1.4],"path"),...ve("innerdg",n.toUpperCase(),"internal",[0,.4,3],{piece:2,cellSize:.5,gap:.03}).objects]}case"hmac-outer":{const t=String(e.opad??""),n=String(e.innerDigest??""),s=String(e.digest??"");return e.structural?[...b("out-msg",[0,.6,-3.4],"input","(K0 ⊕ opad) ∥ inner_digest","input"),ae("out-a",[0,.6,-1.6],[0,.6,1.6],"path"),...b("out-dg",[0,.6,3.4],"MAC",s||"—","output",{emphasize:!0})]:[...ve("op",t.toUpperCase(),"key",[0,.4,-3.4],{piece:2,cellSize:.5,gap:.03}).objects,...ve("ind",n.toUpperCase(),"internal",[0,.4,-1.4],{piece:2,cellSize:.5,gap:.03}).objects,ae("out-a",[0,.5,.2],[0,.5,1.6],"path"),...ve("mac",s.toUpperCase(),"output",[0,.4,3.2],{piece:2,cellSize:.5,gap:.03}).objects,...b("outcap",[0,2.5,3.2],"MAC",`${String(e.hashName??"SHA-256")} (outer)`,"output")]}case"hmac-result":return sn(String(e.digest??""),"HMAC");default:return[]}});function ns(i,e){const t=[];for(let n=0;n+1<i.length;n+=2)t.push({label:i.slice(n,n+2).toUpperCase(),tone:e});return t}const tc=Qe(sd,i=>{const e=i.view;switch(e.kind){case"pbkdf2-input":return[...ve("salt",String(e.saltHex??"").toUpperCase(),"input",[0,.4,-1.4],{piece:2,cellSize:.5,gap:.03}).objects,...b("pwcap",[0,2.5,-2.6],"password",`${Number(e.pwBytes)} bytes`,"input"),...b("saltcap",[0,-1.1,2.6],"salt",`${Number(e.saltLen)} bytes`,"input")];case"pbkdf2-params":return[...b("p1",[-5.4,.6,0],"PRF","HMAC-SHA-256","key"),...b("p2",[-1.8,.6,0],"iterations",String(e.iterations??""),"key",{emphasize:!0}),...b("p3",[2.4,.6,0],"hash size","32 bytes","internal"),...b("p4",[6,.6,0],"output",`${Number(e.blocks)} × 32 → ${Number(e.keyLength)} bytes`,"transform")];case"pbkdf2-u1":return[...ve("u1",String(e.u1??"").toUpperCase(),"transform",[0,.4,-1.2],{piece:2,cellSize:.5,gap:.03}).objects,...b("u1cap",[0,2.3,2],"U1","HMAC(password, salt ∥ 0x00000001)","internal")];case"pbkdf2-loop":{const t=e.rows??[],n=String(e.finalBlock??""),s=Number(e.more??0),r=[];return t.forEach((a,o)=>{const l=o*3.8;r.push(...ve(`u${a.n}`,a.u.toUpperCase(),"transform",[-3.2,.4,l],{piece:2,cellSize:.44,gap:.026}).objects,...ve(`t${a.n}`,a.xor.toUpperCase(),"internal",[3.4,.4,l],{piece:2,cellSize:.44,gap:.026}).objects,ae(`ua${a.n}`,[0,.4,l],[2.2,.4,l],"path"),...b(`rc${a.n}`,[0,2.4,l],`U${a.n}`,`T = ⊕ U1..U${a.n}`,"muted"))}),r.push(ae("fa",[0,.4,t.length*3.8+.4],[0,.4,t.length*3.8+2.6],"path"),...ve("final",n.toUpperCase(),"output",[0,.4,t.length*3.8+3.4],{piece:2,cellSize:.5,gap:.03}).objects,...b("loopcap",[0,2.6,t.length*3.4],"DK block",`${Number(e.iterations)} iterations · ⊕ of all U`,"output"),...s>0?b("morecap",[0,-1.6,t.length*3.4],"not drawn",`+${s} more iterations`,"muted"):[]),r}case"pbkdf2-assemble":{const t=e.blockDigests??[],n=String(e.dkHex??""),s=[];t.forEach((a,o)=>{s.push(...ve(`blk${o}`,a.toUpperCase(),"internal",[-2.4,.4,o*2.6],{piece:2,cellSize:.5,gap:.03}).objects,...b(`blklab${o}`,[-2.4,2.4,o*2.6],`block ${o+1}`,`${a.length/2} bytes`,"internal"))});const r=Math.max(1,t.length)*2.6;return s.push(ae("ca",[.4,.4,r-1.3],[2.8,.4,r+.5],"path"),...ve("dk",n.toUpperCase(),"output",[3.4,.4,r+.7],{piece:2,cellSize:.5,gap:.03}).objects,...b("dkcap",[3.8,2.4,r+1.2],"derived key",`${Number(e.keyLength)} bytes`,"output",{emphasize:!0})),s}case"pbkdf2-result":return sn(String(e.dkHex??""),"PBKDF2");default:return[]}}),nc=Qe(rd,i=>{const e=i.view;switch(e.kind){case"bcrypt-input":{const t=!!e.tooLong;return[...b("pw",[0,.6,0],"password",`${Number(e.pwBytes)} bytes`,"input",{emphasize:!0}),...t?b("tooolong",[0,-1.4,2.4],"rejected","max 72 bytes","error"):[]]}case"bcrypt-salt":return[...b("saltbox",[0,.6,-1.6],"salt","16 bytes · 128-bit (CSPRNG)","key",{emphasize:!0}),...b("prefix",[0,.6,2],"embedded",`$2b$${Number(e.rounds)}$`,"muted")];case"bcrypt-cost":return[...b("c1",[-3.6,.6,0],"cost",String(e.rounds??""),"key",{emphasize:!0}),...b("c2",[0,.6,0],"iterations",String(e.iterations??""),"transform"),...b("c3",[3.6,.6,0],"work factor",`2^${Number(e.rounds)} EksBlowfish rounds`,"internal")];case"bcrypt-schedule":return[Fn("eks-head",[["P[18]","S0[256]","S1[256]","S2[256]","S3[256]"]].map(n=>n.map(s=>({label:s,tone:"internal"}))),{cellSize:1.9,gap:.14,labelScale:.7,height:1.2}),...b("eks",[0,2.6,-4],"EksBlowfish",`${Number(e.iterations)} key-schedule passes`,"transform"),...b("derive",[0,-.6,5],"derive","encrypt 'OrpheanBeholderScryDoubt' → 184-bit hash","output")];case"bcrypt-result":{const t=String(e.hash??"");return t?sn(t,"$2b$"):b("ph",[0,.6,0],"$2b$ hash","run the operation to bind real hash","output")}default:return[]}});function ic(i,e,t){return Fn(i,e.map((n,s)=>n.map((r,a)=>({label:String(r),tone:s===t[0]&&a===t[1]?"active":"muted"}))),{cellSize:.36,gap:.035,labelScale:.65,height:.8})}const sc=Qe(ad,i=>{const e=i.view;switch(e.kind){case"scrypt-input":return[...ve("salt",String(e.saltHex??"").toUpperCase(),"input",[0,.4,-1.6],{piece:2,cellSize:.5,gap:.03}).objects,...b("pwcap",[0,2.5,-2.8],"password",`${Number(e.pwBytes)} bytes`,"input"),...b("saltcap",[0,-1.2,2.8],"salt",`${Number(e.saltLen)} bytes`,"input")];case"scrypt-params":return[...b("n1",[-5,.6,0],"N",String(e.n??""),"key",{emphasize:!0}),...b("n2",[0,.6,0],"memory",`${Number(e.memoryKiB)} KiB ≈ ${Number(e.memoryMiB)} MiB`,"transform"),...b("n3",[5,.6,0],"block",`${Number(e.blockSize)} bytes (128·r)`,"internal"),ic("mem-map",e.grid??[],[4,6])];case"scrypt-pre":return[...b("p1",[-2.5,.6,0],"PBKDF2","HMAC-SHA-256 · 1 iteration","transform"),ae("pa",[-.4,.6,0],[.6,.6,0],"path"),...b("p2",[2.4,.6,0],"initial blocks",`${Number(e.p)} lane(s) × ${Number(e.blockSize)} bytes`,"internal")];case"scrypt-romix":return[ic("romix-map",e.grid??[],[2,3]),...b("romix",[0,2.8,-3],"ROMix",`${Number(e.n)} blocks · Salsa20/8 · memory-hard`,"internal"),...b("mem",[0,-1.2,4.6],"working set",`${Number(e.memoryKiB)} KiB ≈ ${Number(e.memoryMiB)} MiB`,"transform")];case"scrypt-post":return[...b("p1",[-3.6,.6,0],"PBKDF2","final pass","transform"),ae("pa",[-1.9,.6,0],[-1,.6,0],"path"),...b("p2",[1,.6,0],"mix lanes",`${Number(e.p)} lane(s)`,"internal"),ae("pb",[2.2,.6,0],[3,.6,0],"path"),...b("p3",[4,.6,0],"truncate",`first ${Number(e.keyLength)} bytes`,"transform")];case"scrypt-result":{const t=String(e.keyHex??"");return t?sn(t,"scrypt"):b("sc",[0,.6,0],"derived key","run the operation to bind the real key","output")}default:return[]}}),rc=Qe(od,i=>{const e=i.view;switch(e.kind){case"argon2-input":return[...b("pw",[0,.6,-2],"password",`${Number(e.passwordBytes)} bytes`,"input",{emphasize:!0}),...b("variant",[-4.2,.6,1.6],"variant",String(e.variant??""),"key"),...b("t",[.4,.6,1.6],"t · m · p",`${Number(e.t)} · ${Number(e.m)} KiB · ${Number(e.p)}`,"key")];case"argon2-params":return[...b("mem",[-2,.6,0],"memory",`${Number(e.m)} KiB ≈ ${Number(e.memoryMiB)} MiB`,"key",{emphasize:!0}),...b("blocks",[3,.6,-.6],"blocks",`${Number(e.blocks)} × 1 KiB`,"internal"),...b("cells",[3,-.7,1.2],"grid cells",`${Number(e.cells)} (≈4 KiB each)`,"internal")];case"argon2-core":{const t=e.grid??[];return[Fn("matrix",t.map(n=>n.map(()=>({label:"G",tone:"transform"}))),{cellSize:.85,gap:.14,labelScale:.8,height:1.1}),...b("matrix-cap",[0,2.9,-4],"matrix",`${Number(e.p)} lanes × ${Number(e.t)} passes`,"transform"),...b("per-block",[0,-1.3,4.8],"per pass",`${Number(e.m)} blocks · BLAKE2b compression`,"internal")]}case"argon2-tag":return[...b("fc",[-3.8,.6,0],"final column","XOR of last blocks per lane","internal"),ae("ta",[-1.6,.6,0],[-.6,.6,0],"path"),...b("tag",[1.6,.6,0],"tag",`${Number(e.hashLength)} bytes · BLAKE2b`,"transform",{emphasize:!0})];case"argon2-result":{const t=String(e.tag??"");return t?sn(t,`${String(e.variant??"argon2id")}`):b("phc",[0,.6,0],"PHC hash","run the operation to bind real tag","output")}default:return[]}}),ac=Qe(ld,i=>{const e=i.view;switch(e.kind){case"hkdf-input":return[...ve("salt",String(e.saltHex??"").toUpperCase(),"input",[0,.4,-1.6],{piece:2,cellSize:.5,gap:.03}).objects,...b("ikmcap",[0,2.6,-3],"ikm",`${Number(e.ikmLen)} bytes`,"key"),...b("info",[0,-1.3,2.8],"info · output",`${Number(e.infoLen)} bytes · ${Number(e.length)} out`,"transform")];case"hkdf-extract":{const t=String(e.prk??"");return[...ve("salt",String(e.saltHex??"").toUpperCase(),"key",[0,.4,-2.6],{piece:2,cellSize:.5,gap:.03}).objects,...b("xop",[0,1.6,-.2],"PRK","HMAC-SHA-256(salt, ikm)","key"),ae("xa",[0,.5,.4],[0,.5,1.4],"path"),...ve("prk",t.toUpperCase(),"internal",[0,.4,2.6],{piece:2,cellSize:.5,gap:.03}).objects,...b("prkcap",[0,2.5,2.6],"PRK","32 bytes","internal",{emphasize:!0})]}case"hkdf-expand":{const t=e.blocks??[],n=t.slice(0,6),s=[];return n.forEach((r,a)=>{s.push(...ve(`t${a}`,r.toUpperCase(),"transform",[0,.4,a*2.4],{piece:2,cellSize:.44,gap:.026}).objects,...b(`tc${a}`,[0,2.4,a*2.4],`T${a+1}`,"HMAC(PRK, T·info·counter)","muted"))}),s.push(...b("expand-cap",[0,4,n.length*2.2],"expand",`${Number(t.length)} block(s)`,"internal"),...t.length>n.length?b("more",[0,-1.4,n.length*2.2],"not drawn",`+${t.length-n.length} more block(s)`,"muted"):[]),s}case"hkdf-concat":{const t=e.blocks??[],n=String(e.outHex??""),s=[];t.forEach((a,o)=>{s.push(...ve(`tb${o}`,a.toUpperCase(),"internal",[-3.6,.4,o*2.2],{piece:2,cellSize:.44,gap:.026}).objects)});const r=Math.max(1,t.length)*2.2;return s.push(ae("ca",[0,.4,r-1],[2.6,.4,r-.2],"path"),...ve("okm",n.toUpperCase(),"output",[3.6,.4,r-.2],{piece:2,cellSize:.5,gap:.03}).objects,...b("okmcap",[3.6,2.5,r-.2],"OKM",`first ${Number(e.length)} bytes`,"output",{emphasize:!0})),s}case"hkdf-result":return sn(String(e.outHex??""),"HKDF");default:return[]}}),oc=Qe(cd,i=>{const e=i.view;switch(e.kind){case"rsa-error":return b("err",[0,.6,0],"Error",(e.reasons??[]).join(" · "),"error",{emphasize:!0});case"rsa-keygen":return[...b("p",[-6,.8,0],"p",String(e.p??""),"key"),...b("q",[-2.6,.8,0],"q",String(e.q??""),"key"),ae("k1",[-.9,.8,0],[.5,.8,0],"path"),...b("n",[3.4,.8,0],"n = p·q",String(e.n??""),"internal"),...b("phi",[-4.3,-.9,3],"φ(n)",String(e.phi??""),"internal"),...b("gcd",[.6,-.9,3],"gcd(e, φ)",String(e.gcdCheck??""),"internal"),...b("e",[-3,-.9,6],"e (public)",String(e.e??""),"key",{emphasize:!0}),ae("k2",[-1,-.9,6],[.4,-.9,6],"path"),...b("d",[3,-.9,6],"d (private)",String(e.d??""),"output",{emphasize:!0}),...e.eNote?b("enote",[0,2.6,2],"note",String(e.eNote),"muted"):[]];case"rsa-encode":{const t=e.msgCells??[],n=e.m27Cells??[];return[...vn("msg",t.map(s=>({label:s.ch,tone:s.tone})),[0,.7,-3],{cellSize:.7,gap:.08}).objects,ae("e1",[0,.7,-1.6],[0,.7,-.4],"path"),...vn("b27",n.map(s=>({label:s.ch,tone:s.tone})),[0,.7,.6],{cellSize:.7,gap:.08}).objects,ae("e2",[0,.7,1.8],[0,.7,3],"path"),...b("M",[0,.7,4.4],"M (integer)",String(e.M??""),"output",{emphasize:!0}),...b("enc-cap",[0,3,-3],"encoding","letters → integer (A=1..Z=26, base 27)","input")]}case"rsa-encrypt":{const t=e.encryptRows??[],n=[];return t.length&&n.push(...$t(t.map(s=>({label:s.label,cells:(s.cells??[]).map(r=>({label:r.ch,tone:r.tone==="output"?"transform":r.tone}))})),[3,0,-3.4],{rowStep:1.7,cellSize:.62,gap:.1}).objects),n.push(...b("M",[-6.2,1.2,-1],"M",String(e.M??""),"input"),...b("e",[-6.2,0,1.2],"e",String(e.e??""),"key"),...b("n",[-6.2,-1,3],"n",String(e.n??""),"internal"),ae("x1",[-3.8,.4,1],[-1.4,.4,1],"path"),...b("op",[1.4,.4,1],"modexp","M^e mod n · square-and-multiply","transform"),...b("C",[6.4,.4,3],"C",String(e.C??""),"output",{emphasize:!0})),n}case"rsa-decrypt":return[...b("C",[-6,1,-1],"C",String(e.C??""),"input"),...b("d",[-6,-.1,1.4],"d",String(e.d??""),"key"),...b("n",[-6,-1.2,3.4],"n",String(e.n??""),"internal"),ae("d1",[-4,.4,1.2],[-1.6,.4,1.2],"path"),...b("dop",[1.6,.4,1.2],"modexp","C^d mod n","transform"),ae("d2",[3.8,.4,1.2],[5,.4,1.2],"path"),...b("Mp",[6.4,.7,1.2],"M'",String(e.M??""),"output"),...b("plain",[0,-1.6,5.4],"Plaintext",String(e.result??""),"output",{emphasize:!0}),...b("textbook",[0,3,-4],"note","textbook RSA — no padding; OAEP needed in practice","muted")];case"rsa-result":{const t=String(e.text??"");return[...vn("out",t.split("").map(n=>({label:n,tone:"output"})),[0,.5,-1.2],{cellSize:.8,gap:.1}).objects,...b("r0",[0,2.6,2.6],"Decrypted",t||"·","output",{emphasize:!0})]}default:return[]}}),lc=Qe(ud,i=>{const e=i.view;switch(e.kind){case"elgamal-keygen":return[...b("p",[-5,.8,0],"p",String(e.p??""),"internal"),...b("g",[-1.6,.8,0],"g",String(e.g??""),"internal"),...b("x",[1.8,.8,0],"x (private)",String(e.x??""),"key"),ae("kg1",[-.2,.8,0],[1,.8,0],"path"),ae("kg2",[3.4,.8,0],[4.4,.8,0],"path"),...b("y",[6.2,.8,0],"y (public)",`g^x mod p = ${String(e.y??"")}`,"output",{emphasize:!0})];case"elgamal-encode":{const t=String(e.message??"").toUpperCase();return[...vn("msg",t.split("").map(n=>({label:n,tone:"input"})),[0,.7,-2],{cellSize:.74,gap:.09}).objects,ae("e1",[0,.7,-.4],[0,.7,.9],"path"),...b("m",[0,.7,2.6],"M (integer)",String(e.m??""),"output",{emphasize:!0}),...b("enc-cap",[0,3,-2.6],"encoding","letters → base-27 integer","input")]}case"elgamal-ephemeral":return[...b("k",[0,1.2,-2],"k (ephemeral)",String(e.k??""),"key",{emphasize:!0}),...b("g",[-4,-.5,2],"g",String(e.g??""),"internal"),...b("k2",[0,-.5,2],"k",String(e.k??""),"key"),...b("p",[4,-.5,2],"p",String(e.p??""),"internal")];case"elgamal-encrypt":return[...b("c1",[-4.6,1.1,-1.4],"c1 = g^k mod p",String(e.c1??""),"transform",{emphasize:!0}),ae("c1b",[-2,1.1,-1.4],[-.8,1.1,-1.4],"path"),...b("c2",[2.6,1.1,-1.4],"c2 = m·y^k mod p",String(e.c2??""),"output",{emphasize:!0}),...b("y",[-4,-1.2,2.4],"y",String(e.y??""),"key"),...b("k",[0,-1.2,2.4],"k",String(e.k??""),"key"),...b("m",[4,-1.2,2.4],"m",String(e.m??""),"input"),...e.bound?b("src",[0,3,-3],"source","backend cipher (bound)","muted"):[]];case"elgamal-decrypt":return[...b("c1",[-5.2,1,-1.2],"c1",String(e.c1??""),"transform"),...b("c2",[-.6,1,-1.2],"c2",String(e.c2??""),"transform"),ae("d1",[1.4,.4,.4],[3,.4,.4],"path"),...b("m",[5,1.4,1.4],"M' (integer)",e.m!=null?String(e.m):"-","output",{emphasize:!0}),...b("dop",[1.4,-1.3,3.4],"decrypt","m = c2 · c1^-x mod p","path")];case"elgamal-formula":return[...b("y",[-5,1,-.6],"y",`g^x mod p = ${String(e.y??"")}`,"output"),...b("c1",[0,1,.6],"c1","g^k mod p","transform"),...b("c2",[5,1,-.6],"c2","m · y^k mod p","output"),...b("edu",[0,-1.9,4],"educational","small teaching parameters only","muted")];default:return[]}}),cc=Qe(hd,i=>{const e=i.view;switch(e.kind){case"ecdh-curve":{const t=e.fields??[],n=sf(),s=[{id:"curve-hint",kind:"arc",position:[0,0,0],points:n,ringTube:.14,tone:"path"},{id:"base-G",kind:"sphere",position:[2.4,1.2,-1.2],size:[.55,.55,.55],tone:"active",emphasize:!0},...b("bglabel",[2.4,2.5,-.4],"G","base point","key")];return t.slice(0,6).forEach((r,a)=>{const o=a%2,l=Math.floor(a/2),c=-6+o*12,u=-2.6+l*4.6,m=r.value.length>18?`${r.value.slice(0,18)}…`:r.value;s.push(...b(`f${a}`,[c,-.3,u],r.name,m,"internal"))}),s.push(...b("sec",[6.4,4,4.6],"security",`~${String(e.security??"")} bits`,"muted"),...b("note",[-5,4.4,4.6],"full constants","see the 2D lab for exact hex","muted")),s}case"ecdh-keys":{const t=e.aliceHex?String(e.aliceHex):null,n=e.bobHex?String(e.bobHex):null;return[...bi("alice",[-7,0,0],[...b("da",[-7,1.6,-.6],"dA (private)",String(e.dA??""),"key"),ae("a1",[-7,.6,.8],[-7,.6,2.2],"path"),...b("Aa",[-7,.6,4.4],"public A",t?`${t.slice(0,24)}…`:"dA·G","output")]),...bi("bob",[7,0,0],[...b("db",[7,1.6,-.6],"dB (private)",String(e.dB??""),"key"),ae("b1",[7,.6,.8],[7,.6,2.2],"path"),...b("Bb",[7,.6,4.4],"public B",n?`${n.slice(0,24)}…`:"dB·G","output")]),ae("wire",[-2,.4,0],[2,.4,0],"path"),...b("op",[0,2.2,0],"keygen","A = dA·G · B = dB·G","transform")]}case"ecdh-exchange":{const t=e.aliceHex?String(e.aliceHex):null,n=e.bobHex?String(e.bobHex):null;return[...bi("alice",[-7,0,0],b("Aex",[-7,.7,1],"public A →",t?`${t.slice(0,16)}…`:"A","output")),...bi("bob",[7,0,0],b("Bex",[7,.7,1],"→ public B",n?`${n.slice(0,16)}…`:"B","output")),ae("wa",[-4.4,.4,-.8],[-2.6,.4,-.8],"path"),ae("wb",[2.6,.4,.8],[4.4,.4,.8],"path"),...b("chan",[0,2.6,-1],"channel","only public points cross the wire","muted"),...b("note",[0,1,3.4],"note","eavesdropper cannot recover dA / dB","muted")]}case"ecdh-shared":{const t=e.shared?String(e.shared):null;return[...bi("alice",[-7,0,0],b("Sa",[-7,.7,1],"S = dA·B",t?`${t.slice(0,32)}…`:"dA·B","output")),...bi("bob",[7,0,0],b("Sb",[7,.7,1],"S = dB·A",t?`${t.slice(0,32)}…`:"dB·A","output")),ae("wa",[-4.4,.6,-.6],[-2.6,.6,-.6],"path"),ae("wb",[2.6,.6,.6],[4.4,.6,.6],"path"),...t?[...ve("shared",t.toUpperCase(),"output",[0,.3,3],{piece:2,cellSize:.34,gap:.02}).objects,...b("sharedcap",[0,2.4,3],"shared secret","equal x-coordinate on both sides","output")]:b("sharedcap",[0,1.2,3],"shared secret","x-coordinate of dA·dB·G","output")]}default:return[]}});function sf(){const i=[];for(let e=0;e<=24;e++){const t=-4+e*.3333333333333333;i.push([t,.4+1.1*Math.sin(t*.9),1.8-.28*t*t/4])}return i}function bi(i,e,t){return[{id:`${i}-bg`,kind:"box",position:[e[0],-.2,-3.6],size:[4.4,.16,9],tone:i==="alice"?"input":"key",opacity:.12},...t]}const uc=Qe(dd,i=>{const e=i.view;switch(e.kind){case"x25519-curve":return[...b("curve",[0,.8,-2.4],"curve","Curve25519 (Montgomery)","internal",{emphasize:!0}),...b("form",[-4.4,0,1],"form","y² = x³ + 486662·x² + x","internal"),...b("base",[4.6,0,1],"base point","u = 9 (x only)","key"),...b("p",[0,-1.4,3.6],"field prime p","2²⁵⁵ − 19","internal")];case"x25519-keys":{const t=String(e.aPriv??""),n=String(e.bPriv??""),s=String(e.aPub??""),r=String(e.bPub??"");return[...ks("alice",[-7,0,0],[...b("ap",[-7,2.1,-3.6],"Alice","private → public","key"),...ve("aPriv",t.toUpperCase(),"key",[-7,.6,-3.8],{piece:2,cellSize:.34,gap:.02}).objects,ae("a1",[-7,.6,-.8],[-7,.6,.6],"path"),...b("aPub",[-7,.4,2.6],"public",s.includes("x25")?s:`${s.slice(0,32)}…`,"output")]),...ks("bob",[7,0,0],[...b("bp",[7,2.1,-3.6],"Bob","private → public","key"),...ve("bPriv",n.toUpperCase(),"key",[7,.6,-3.8],{piece:2,cellSize:.34,gap:.02}).objects,ae("b1",[7,.6,-.8],[7,.6,.6],"path"),...b("bPub",[7,.4,2.6],"public",r.includes("x25")?r:`${r.slice(0,32)}…`,"output")]),ae("wire",[-2,.4,0],[2,.4,0],"path"),...b("op",[0,2.6,0],"X25519","clamp → scalar mult → u-coordinate","transform")]}case"x25519-ladder":return[...b("ca",[-4,.9,-1.6],"Alice clamp",String(e.clampA??""),"transform"),...b("cb",[4,.9,-1.6],"Bob clamp",String(e.clampB??""),"transform"),{id:"ladder",kind:"ring",position:[0,0,1.2],ringRadius:2.4,ringTube:.1,tone:"path"},{id:"ladder-dot",kind:"sphere",position:[2.2,.6,.7],size:[.4,.4,.4],tone:"active",emphasize:!0},...b("ladder-op",[0,-1.2,4],"Montgomery ladder","[1,u,1] → iterations → u","internal")];case"x25519-shared":{const t=e.shared?String(e.shared):null;return[...ks("alice",[-7,0,0],b("Sa",[-7,.7,0],"S = X25519(a, B)",t?`${t.slice(0,16)}…`:"X25519(a,B)","output")),...ks("bob",[7,0,0],b("Sb",[7,.7,0],"S = X25519(b, A)",t?`${t.slice(0,16)}…`:"X25519(b,A)","output")),ae("wa",[-4.4,.6,-.6],[-2.6,.6,-.6],"path"),ae("wb",[2.6,.6,.6],[4.4,.6,.6],"path"),...t?[...ve("shared",t.toUpperCase(),"output",[0,.3,3],{piece:2,cellSize:.34,gap:.02}).objects,...b("sharedcap",[0,2.3,3],"shared secret","32 bytes","output",{emphasize:!0})]:b("sharedcap",[0,1.2,3],"shared secret","binding unavailable in demo","muted")]}default:return[]}});function ks(i,e,t){return[{id:`${i}-bg`,kind:"box",position:[e[0],-.2,-3.6],size:[4.4,.16,9],tone:i==="alice"?"input":"key",opacity:.12},...t]}const hc=Qe(fd,i=>{const e=i.view;switch(e.kind){case"ecdsa-keygen":return[...b("curve",[0,1.2,-2.4],"curve",String(e.curve??""),"internal"),...b("d",[-4.4,0,.4],"private scalar d",e.priv!=null?String(e.priv):"random","key"),ae("kg1",[-2.4,.5,.4],[-.8,.5,.4],"path"),...b("Q",[2.6,.5,.4],"public point Q","Q = d·G","output",{emphasize:!0}),...b("note",[0,-1.6,3.6],"authenticates","signs — does NOT encrypt","muted")];case"ecdsa-hash":{const t=String(e.message??"");return[...vn("msg",t.split("").map(n=>({label:n,tone:"input"})),[0,.7,-2.6],{cellSize:.72,gap:.09}).objects,ae("h1",[0,.7,-.4],[0,.7,1.2],"path"),...b("z",[0,.7,2.8],"z (int digest)","SHA-256(msg) mod n","transform",{emphasize:!0})]}case"ecdsa-sign":{const t=e.rHex?String(e.rHex):null,n=e.sHex?String(e.sHex):null,s=typeof e.sigHex=="string"?String(e.sigHex):null;return[...b("k",[-5.4,1,-.6],"k","random per-message","key"),...b("R",[-1.6,1,-.6],"R = k·G","(xR, yR)","internal"),...b("r",[2.6,1,-.6],"r = xR mod n",t??"structural","output"),...b("s",[6.4,.2,-.6],"s",n??"structural","output"),...b("formula",[3,-1.4,2.4],"s = k⁻¹(z + r·d) mod n","","internal"),...s?[...ve("sig",s.toUpperCase(),"output",[0,.4,4.4],{piece:2,cellSize:.44,gap:.026}).objects,...b("sigcap",[0,2.5,4.4],"signature","DER hex","output",{emphasize:!0})]:[]]}case"ecdsa-verify":{const t=typeof e.pubHex=="string"?String(e.pubHex):null;return[...b("verify",[0,1.2,-2],"verify","w = s⁻¹ · u1 = z·w · u2 = r·w","internal"),ae("v1",[0,1.2,-.4],[0,1.2,1.2],"path"),...b("check",[0,1.2,2.6],"P = u1·G + u2·Q","OK if P.x mod n == r","transform",{emphasize:!0}),...t?[...b("pubcap",[0,2.6,4.4],"public point",`${t.slice(0,32)}…`,"output"),...ve("pub",t.toUpperCase(),"output",[0,.4,4.4],{piece:2,cellSize:.3,gap:.018}).objects]:[]]}default:return[]}}),dc=Qe(pd,i=>{const e=i.view;switch(e.kind){case"ed25519-keygen":{const t=String(e.privateHex??""),n=typeof e.pubHex=="string"?String(e.pubHex):null;return[...t?[...ve("priv",t.toUpperCase(),"key",[0,.5,-3.8],{piece:2,cellSize:.4,gap:.022}).objects,...b("privcap",[0,2.5,-3.8],"private key","32 bytes","key")]:[...b("privcap",[0,1,-3.4],"private key","(blank = auto)","key")],ae("k1",[0,.7,-1.4],[0,.7,0],"path"),...b("deriv",[0,.7,1.8],"SHA-512 → clamp → scalar a","","transform"),ae("k2",[0,.7,3.6],[0,.7,5],"path"),...b("A",[0,.7,6.4],"public A = a·B",n??"structural","output",{emphasize:!0})]}case"ed25519-hash":{const t=String(e.message??"");return[...vn("msg",t.split("").map(n=>({label:n,tone:"input"})),[0,.7,-2.4],{cellSize:.72,gap:.09}).objects,ae("h1",[0,.7,-.2],[0,.7,1.2],"path"),...b("r",[0,.7,2.6],"nonce r","SHA-512(prefix ∥ message)","transform",{emphasize:!0})]}case"ed25519-derivation":return[...b("R",[-5,1,-.6],"R = r·B","curve point","internal"),...b("h",[0,1,-.6],"h = SHA-512(R ∥ A ∥ M)","structural","transform"),...b("S",[5,1,-.6],"S = (r + h·a) mod L","structural","output",{emphasize:!0})];case"ed25519-sign":{const t=e.rHex?String(e.rHex):null,n=e.sHex?String(e.sHex):null,s=typeof e.sigHex=="string"?String(e.sigHex):null;return[...b("R",[-3.4,1,-1],"R (32 bytes)",t??"structural","output"),...b("S",[3.4,1,-1],"S (32 bytes)",n??"structural","output"),...s?[...ve("sig",s.toUpperCase(),"output",[0,.3,2.4],{piece:2,cellSize:.4,gap:.022}).objects,...b("sigcap",[0,2.5,2.4],"signature","64 bytes","output",{emphasize:!0})]:[]]}case"ed25519-result":{const t=typeof e.sigHex=="string"?String(e.sigHex):null;return[...b("scheme",[0,1.4,-2],"scheme","Ed25519 signs — NOT encryption","key",{emphasize:!0}),...t?[...ve("sig",t.toUpperCase(),"output",[0,.2,2.2],{piece:2,cellSize:.4,gap:.022}).objects,...b("sigcap",[0,2.4,2.2],"signature","64 bytes","output",{emphasize:!0})]:b("sigcap",[0,.6,2.4],"signature","run the operation to bind real signature","muted")]}default:return[]}}),fc=Qe(md,i=>{const e=i.view;switch(e.kind){case"dh-error":return[...b("err",[0,1.2,0],"invalid parameters",String(e.reason??""),"error",{emphasize:!0})];case"dh-params":return[...b("p",[-4,1.2,0],"p (prime)",String(e.p??""),"internal"),...b("g",[4,1.2,0],"g (generator)",String(e.g??""),"key"),...b("pub",[0,-1.6,3],"public domain","shared by both parties","muted")];case"dh-party":{const t=String(e.name??""),n=String(e.priv??""),s=String(e.pub??"");return[{id:`dhp-${t.toLowerCase()}-bg`,kind:"box",position:[-4.6,-.3,.6],size:[4.6,.16,8.6],tone:"internal",opacity:.14},...b(`dhp-${t.toLowerCase()}-name`,[-4.6,2.4,-3],"party",t,"path"),...b(`dhp-${t.toLowerCase()}-priv`,[-4.6,1,-1],"private",n,"key"),ae(`dhp-${t.toLowerCase()}-ar`,[-5.6,.4,.5],[-3.6,.4,.5],"path"),...b(`dhp-${t.toLowerCase()}-op`,[-4.6,.4,2.4],"compute","g^priv mod p","transform"),...b(`dhp-${t.toLowerCase()}-pub`,[-4.6,.4,4.8],"public",s,"output",{emphasize:!0})]}case"dh-exchange":{const t=String(e.A??""),n=String(e.B??""),s=(r,a)=>[{id:`${r}-bg`,kind:"box",position:[a[0],-.3,.6],size:[4.6,.16,8.6],tone:r==="alice"?"input":"key",opacity:.14},...b(`${r}-name`,[a[0],2.4,-3],"party",r==="alice"?"Alice":"Bob","path"),...b(`${r}-pub`,[a[0],.7,1],"public",r==="alice"?t:n,"output")];return[...s("alice",[-6.4,0,0]),...s("bob",[6.4,0,0]),ae("xa",[-2.4,.6,-.6],[-.8,.6,-.6],"path"),ae("xb",[.8,.6,.6],[2.4,.6,.6],"path"),...b("chan",[0,2.2,-1.6],"channel","public values only","muted"),...b("note",[0,1,3.4],"note","private exponents never leave their owners","muted")]}case"dh-shared":{const t=String(e.s??""),n=!!e.match;return[...b("sa",[-5,1,-.8],"s = B^a mod p",t,"output"),...b("sb",[5,1,-.8],"s = A^b mod p",t,"output"),ae("fa",[-1.6,.5,.2],[1.6,.5,.2],"path"),...b("sig",[0,-1.4,3],"shared secret",n?`MATCH = ${t}`:t,"output",{emphasize:!0})]}default:return[]}}),rf={[Tl.id]:Tl,[wl.id]:wl,[Rl.id]:Rl,[Pl.id]:Pl,[Ll.id]:Ll,[Nl.id]:Nl,[Ul.id]:Ul,[Il.id]:Il,[Fl.id]:Fl,[Ol.id]:Ol,[kl.id]:kl,[Bl.id]:Bl,[Gl.id]:Gl,[Vl.id]:Vl,[Wl.id]:Wl,[$l.id]:$l,[Yl.id]:Yl,[ql.id]:ql,[jl.id]:jl,[Zl.id]:Zl,[Jl.id]:Jl,[Ql.id]:Ql,[ec.id]:ec,[tc.id]:tc,[nc.id]:nc,[sc.id]:sc,[rc.id]:rc,[ac.id]:ac,[oc.id]:oc,[lc.id]:lc,[cc.id]:cc,[uc.id]:uc,[hc.id]:hc,[dc.id]:dc,[fc.id]:fc};function af(i){return rf[i]}const of=["message","plaintext","password","text","block","input","data","ikm","salt"];function lf(i){for(const e of of){const t=i[e];if(t!==void 0&&String(t)!=="")return String(t)}for(const e of Object.values(i))if(e!==void 0&&String(e)!=="")return String(e);return""}function cf(i,e,t,n,s){const{t:r,language:a,dir:o}=Ru(),{theme:l}=Uh(),c=Ue.useMemo(()=>Object.values(t??{}).some(E=>String(E??"").trim()!==""),[t]),u=i?!c:!1,m=Ue.useMemo(()=>{if(u&&(i!=null&&i.demoInputs)){const E={...i.demoInputs};return E._demo=lf(i.demoInputs),E}return t??{}},[u,i,t]),h=Ue.useRef(null),p=Ue.useRef(s),g=Ue.useRef(null),y=`${(i==null?void 0:i.id)??e}|${n}|${JSON.stringify(t??{})}`;Ue.useEffect(()=>{g.current!==e&&(g.current=e,h.current=null),p.current!==s&&(p.current=s,s&&(h.current=y))},[e,s,y]);const f=u?!1:!!s&&h.current===y,d=Ue.useMemo(()=>({id:(i==null?void 0:i.id)??e,operation:n,inputs:m,demo:u,language:a,dir:o,theme:l,result:s,resultMatches:f,t:r}),[i,e,n,m,u,a,o,l,s,f,r]);return{adapter:i,ctx:d}}const pc={input:"--simulation-input",plaintext:"--simulation-plaintext",key:"--simulation-key",internal:"--cyan",transform:"--simulation-transform",output:"--simulation-output",active:"--simulation-active",complete:"--simulation-complete",muted:"--text-faint",path:"--primary",error:"--danger",warning:"--warning"},uf={input:"#86b7ff",plaintext:"#a9d3ff",key:"#f5c07a",internal:"#22d3ee",transform:"#6ee7b7",output:"#c4b5fd",active:"#38bdf8",complete:"#34d399",muted:"#5f7796",path:"#38bdf8",error:"#f87171",warning:"#fbbf24"};function Bs(i,e){try{const t=getComputedStyle(document.documentElement).getPropertyValue(i).trim();return t.length>0?t:e}catch{return e}}function hf(i,e){const t=i.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);if(t){const[n,s,r]=t.slice(1).map(a=>Number(a));return`#${[n,s,r].map(a=>a.toString(16).padStart(2,"0")).join("")}`}return/^#[0-9a-fA-F]{3,8}$/.test(i)?i:e}function mc(){const i=Bs("--bg-deep","#0b1728"),e=Bs("--simulation-grid","rgba(147, 184, 228, 0.12)"),t=hf(e,"#93b8e4"),n=Bs("--text-faint","#5f7796"),s={};for(const r of Object.keys(pc))s[r]=Bs(pc[r],uf[r]);return{background:i,gridLine:t,gridCenter:t,text:n,tones:s}}function zs(i,e,t){return i.tones[e??t]}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Uo="186",Wi={ROTATE:0,DOLLY:1,PAN:2},Hi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},df=0,gc=1,ff=2,xr=1,Uu=2,ms=3,ci=0,Kt=1,Ln=2,Nn=0,xs=1,_c=2,xc=3,vc=4,pf=5,zi=100,mf=101,gf=102,_f=103,xf=104,vf=200,Sf=201,yf=202,bf=203,Iu=204,Fu=205,Mf=206,Ef=207,Tf=208,Af=209,wf=210,Rf=211,Cf=212,Pf=213,Lf=214,Wa=0,Xa=1,$a=2,Ms=3,Ka=4,Ya=5,qa=6,ja=7,Ou=0,Df=1,Nf=2,Sn=0,ku=1,Bu=2,zu=3,Hu=4,Gu=5,Vu=6,Wu=7,Xu=300,ui=301,Yi=302,Qr=303,ea=304,Or=306,Za=1e3,Dn=1001,Ja=1002,Lt=1003,Uf=1004,Hs=1005,Ot=1006,ta=1007,oi=1008,Jt=1009,$u=1010,Ku=1011,Es=1012,Io=1013,bn=1014,_n=1015,Mn=1016,Fo=1017,Oo=1018,Ts=1020,Yu=35902,qu=35899,ju=1021,Zu=1022,un=1023,On=1026,li=1027,Ju=1028,ko=1029,hi=1030,Bo=1031,zo=1033,vr=33776,Sr=33777,yr=33778,br=33779,Qa=35840,eo=35841,to=35842,no=35843,io=36196,so=37492,ro=37496,ao=37488,oo=37489,wr=37490,lo=37491,co=37808,uo=37809,ho=37810,fo=37811,po=37812,mo=37813,go=37814,_o=37815,xo=37816,vo=37817,So=37818,yo=37819,bo=37820,Mo=37821,Eo=36492,To=36494,Ao=36495,wo=36283,Ro=36284,Rr=36285,Co=36286,If=3200,Po=0,Ff=1,Kn="",Xt="srgb",Cr="srgb-linear",Pr="linear",it="srgb",na=7680,Of=519,kf=512,Bf=513,zf=514,Ho=515,Hf=516,Gf=517,Go=518,Vf=519,Qu=35044,Sc="300 es",xn=2e3,As=2001;function Wf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Lr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Xf(){const i=Lr("canvas");return i.style.display="block",i}const yc={};function Dr(...i){const e="THREE."+i.shift();console.log(e,...i)}function eh(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Fe(...i){i=eh(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ze(...i){i=eh(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Xi(...i){const e=i.join(" ");e in yc||(yc[e]=!0,Fe(...i))}function $f(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Kf={[Wa]:Xa,[$a]:qa,[Ka]:ja,[Ms]:Ya,[Xa]:Wa,[qa]:$a,[ja]:Ka,[Ya]:Ms};class jn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const It=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let bc=1234567;const vs=Math.PI/180,ws=180/Math.PI;function Un(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(It[i&255]+It[i>>8&255]+It[i>>16&255]+It[i>>24&255]+"-"+It[e&255]+It[e>>8&255]+"-"+It[e>>16&15|64]+It[e>>24&255]+"-"+It[t&63|128]+It[t>>8&255]+"-"+It[t>>16&255]+It[t>>24&255]+It[n&255]+It[n>>8&255]+It[n>>16&255]+It[n>>24&255]).toLowerCase()}function We(i,e,t){return Math.max(e,Math.min(t,i))}function Vo(i,e){return(i%e+e)%e}function Yf(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function qf(i,e,t){return i!==e?(t-i)/(e-i):0}function Ss(i,e,t){return(1-t)*i+t*e}function jf(i,e,t,n){return Ss(i,e,1-Math.exp(-t*n))}function Zf(i,e=1){return e-Math.abs(Vo(i,e*2)-e)}function Jf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Qf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function ep(i,e){return i+Math.floor(Math.random()*(e-i+1))}function tp(i,e){return i+Math.random()*(e-i)}function np(i){return i*(.5-Math.random())}function ip(i){i!==void 0&&(bc=i);let e=bc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function sp(i){return i*vs}function rp(i){return i*ws}function ap(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function op(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function lp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function cp(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),m=r((e-n)/2),h=a((e-n)/2),p=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*m,l*h,o*c);break;case"YZY":i.set(l*h,o*u,l*m,o*c);break;case"ZXZ":i.set(l*m,l*h,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*p,o*c);break;case"YXY":i.set(l*p,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*p,o*u,o*c);break;default:Fe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function cn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function st(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Mr={DEG2RAD:vs,RAD2DEG:ws,generateUUID:Un,clamp:We,euclideanModulo:Vo,mapLinear:Yf,inverseLerp:qf,lerp:Ss,damp:jf,pingpong:Zf,smoothstep:Jf,smootherstep:Qf,randInt:ep,randFloat:tp,randFloatSpread:np,seededRandom:ip,degToRad:sp,radToDeg:rp,isPowerOfTwo:ap,ceilPowerOfTwo:op,floorPowerOfTwo:lp,setQuaternionFromProperEuler:cp,normalize:st,denormalize:cn},sl=class sl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};sl.prototype.isVector2=!0;let xe=sl;class Yn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],m=n[s+3],h=r[a+0],p=r[a+1],g=r[a+2],y=r[a+3];if(m!==y||l!==h||c!==p||u!==g){let f=l*h+c*p+u*g+m*y;f<0&&(h=-h,p=-p,g=-g,y=-y,f=-f);let d=1-o;if(f<.9995){const E=Math.acos(f),w=Math.sin(E);d=Math.sin(d*E)/w,o=Math.sin(o*E)/w,l=l*d+h*o,c=c*d+p*o,u=u*d+g*o,m=m*d+y*o}else{l=l*d+h*o,c=c*d+p*o,u=u*d+g*o,m=m*d+y*o;const E=1/Math.sqrt(l*l+c*c+u*u+m*m);l*=E,c*=E,u*=E,m*=E}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=m}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],m=r[a],h=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+u*m+l*p-c*h,e[t+1]=l*g+u*h+c*m-o*p,e[t+2]=c*g+u*p+o*h-l*m,e[t+3]=u*g-o*m-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),m=o(r/2),h=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=h*u*m+c*p*g,this._y=c*p*m-h*u*g,this._z=c*u*g+h*p*m,this._w=c*u*m-h*p*g;break;case"YXZ":this._x=h*u*m+c*p*g,this._y=c*p*m-h*u*g,this._z=c*u*g-h*p*m,this._w=c*u*m+h*p*g;break;case"ZXY":this._x=h*u*m-c*p*g,this._y=c*p*m+h*u*g,this._z=c*u*g+h*p*m,this._w=c*u*m-h*p*g;break;case"ZYX":this._x=h*u*m-c*p*g,this._y=c*p*m+h*u*g,this._z=c*u*g-h*p*m,this._w=c*u*m+h*p*g;break;case"YZX":this._x=h*u*m+c*p*g,this._y=c*p*m+h*u*g,this._z=c*u*g-h*p*m,this._w=c*u*m-h*p*g;break;case"XZY":this._x=h*u*m-c*p*g,this._y=c*p*m-h*u*g,this._z=c*u*g+h*p*m,this._w=c*u*m+h*p*g;break;default:Fe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],m=t[10],h=n+o+m;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>m){const p=2*Math.sqrt(1+n-o-m);this._w=(u-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>m){const p=2*Math.sqrt(1+o-n-m);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+m-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const rl=class rl{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Mc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Mc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),m=2*(r*n-a*t);return this.x=t+l*c+a*m-o*u,this.y=n+l*u+o*c-r*m,this.z=s+l*m+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ia.copy(this).projectOnVector(e),this.sub(ia)}reflect(e){return this.sub(ia.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};rl.prototype.isVector3=!0;let D=rl;const ia=new D,Mc=new Yn,al=class al{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],m=n[7],h=n[2],p=n[5],g=n[8],y=s[0],f=s[3],d=s[6],E=s[1],w=s[4],v=s[7],M=s[2],T=s[5],C=s[8];return r[0]=a*y+o*E+l*M,r[3]=a*f+o*w+l*T,r[6]=a*d+o*v+l*C,r[1]=c*y+u*E+m*M,r[4]=c*f+u*w+m*T,r[7]=c*d+u*v+m*C,r[2]=h*y+p*E+g*M,r[5]=h*f+p*w+g*T,r[8]=h*d+p*v+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],m=u*a-o*c,h=o*l-u*r,p=c*r-a*l,g=t*m+n*h+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return e[0]=m*y,e[1]=(s*c-u*n)*y,e[2]=(o*n-s*a)*y,e[3]=h*y,e[4]=(u*t-s*l)*y,e[5]=(s*r-o*t)*y,e[6]=p*y,e[7]=(n*l-c*t)*y,e[8]=(a*t-n*r)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Xi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(sa.makeScale(e,t)),this}rotate(e){return Xi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(sa.makeRotation(-e)),this}translate(e,t){return Xi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(sa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};al.prototype.isMatrix3=!0;let Be=al;const sa=new Be,Ec=new Be().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tc=new Be().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function up(){const i={enabled:!0,workingColorSpace:Cr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===it&&(s.r=In(s.r),s.g=In(s.g),s.b=In(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(s.r=$i(s.r),s.g=$i(s.g),s.b=$i(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Kn?Pr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Xi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Xi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Cr]:{primaries:e,whitePoint:n,transfer:Pr,toXYZ:Ec,fromXYZ:Tc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Xt},outputColorSpaceConfig:{drawingBufferColorSpace:Xt}},[Xt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Ec,fromXYZ:Tc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Xt}}}),i}const qe=up();function In(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $i(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Mi;class hp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Mi===void 0&&(Mi=Lr("canvas")),Mi.width=e.width,Mi.height=e.height;const s=Mi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Mi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Lr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=In(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(In(t[n]/255)*255):t[n]=In(t[n]);return{data:t,width:e.width,height:e.height}}else return Fe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let dp=0;class Wo{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:dp++}),this.uuid=Un(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ra(s[a].image)):r.push(ra(s[a]))}else r=ra(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function ra(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?hp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Fe("Texture: Unable to serialize Texture."),{})}let fp=0;const aa=new D;class kt extends jn{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,n=Dn,s=Dn,r=Ot,a=oi,o=un,l=Jt,c=kt.DEFAULT_ANISOTROPY,u=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=Un(),this.name="",this.source=new Wo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new xe(0,0),this.repeat=new xe(1,1),this.center=new xe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(aa).x}get height(){return this.source.getSize(aa).y}get depth(){return this.source.getSize(aa).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Fe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Fe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Za:e.x=e.x-Math.floor(e.x);break;case Dn:e.x=e.x<0?0:1;break;case Ja:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Za:e.y=e.y-Math.floor(e.y);break;case Dn:e.y=e.y<0?0:1;break;case Ja:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=Xu;kt.DEFAULT_ANISOTROPY=1;const ol=class ol{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],m=l[8],h=l[1],p=l[5],g=l[9],y=l[2],f=l[6],d=l[10];if(Math.abs(u-h)<.01&&Math.abs(m-y)<.01&&Math.abs(g-f)<.01){if(Math.abs(u+h)<.1&&Math.abs(m+y)<.1&&Math.abs(g+f)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,v=(p+1)/2,M=(d+1)/2,T=(u+h)/4,C=(m+y)/4,x=(g+f)/4;return w>v&&w>M?w<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(w),s=T/n,r=C/n):v>M?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=T/s,r=x/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=C/r,s=x/r),this.set(n,s,r,t),this}let E=Math.sqrt((f-g)*(f-g)+(m-y)*(m-y)+(h-u)*(h-u));return Math.abs(E)<.001&&(E=1),this.x=(f-g)/E,this.y=(m-y)/E,this.z=(h-u)/E,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ol.prototype.isVector4=!0;let _t=ol;class pp extends jn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ot,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new kt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Ot,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Wo(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class hn extends pp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class th extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class mp extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Fr=class Fr{constructor(e,t,n,s,r,a,o,l,c,u,m,h,p,g,y,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,m,h,p,g,y,f)}set(e,t,n,s,r,a,o,l,c,u,m,h,p,g,y,f){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=m,d[14]=h,d[3]=p,d[7]=g,d[11]=y,d[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Fr().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/Ei.setFromMatrixColumn(e,0).length(),r=1/Ei.setFromMatrixColumn(e,1).length(),a=1/Ei.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),m=Math.sin(r);if(e.order==="XYZ"){const h=a*u,p=a*m,g=o*u,y=o*m;t[0]=l*u,t[4]=-l*m,t[8]=c,t[1]=p+g*c,t[5]=h-y*c,t[9]=-o*l,t[2]=y-h*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*u,p=l*m,g=c*u,y=c*m;t[0]=h+y*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*m,t[5]=a*u,t[9]=-o,t[2]=p*o-g,t[6]=y+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*u,p=l*m,g=c*u,y=c*m;t[0]=h-y*o,t[4]=-a*m,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*u,t[9]=y-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*u,p=a*m,g=o*u,y=o*m;t[0]=l*u,t[4]=g*c-p,t[8]=h*c+y,t[1]=l*m,t[5]=y*c+h,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,p=a*c,g=o*l,y=o*c;t[0]=l*u,t[4]=y-h*m,t[8]=g*m+p,t[1]=m,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=p*m+g,t[10]=h-y*m}else if(e.order==="XZY"){const h=a*l,p=a*c,g=o*l,y=o*c;t[0]=l*u,t[4]=-m,t[8]=c*u,t[1]=h*m+y,t[5]=a*u,t[9]=p*m-g,t[2]=g*m-p,t[6]=o*u,t[10]=y*m+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gp,e,_p)}lookAt(e,t,n){const s=this.elements;return Yt.subVectors(e,t),Yt.lengthSq()===0&&(Yt.z=1),Yt.normalize(),Gn.crossVectors(n,Yt),Gn.lengthSq()===0&&(Math.abs(n.z)===1?Yt.x+=1e-4:Yt.z+=1e-4,Yt.normalize(),Gn.crossVectors(n,Yt)),Gn.normalize(),Gs.crossVectors(Yt,Gn),s[0]=Gn.x,s[4]=Gs.x,s[8]=Yt.x,s[1]=Gn.y,s[5]=Gs.y,s[9]=Yt.y,s[2]=Gn.z,s[6]=Gs.z,s[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],m=n[5],h=n[9],p=n[13],g=n[2],y=n[6],f=n[10],d=n[14],E=n[3],w=n[7],v=n[11],M=n[15],T=s[0],C=s[4],x=s[8],A=s[12],L=s[1],U=s[5],N=s[9],z=s[13],P=s[2],O=s[6],B=s[10],G=s[14],j=s[3],K=s[7],q=s[11],J=s[15];return r[0]=a*T+o*L+l*P+c*j,r[4]=a*C+o*U+l*O+c*K,r[8]=a*x+o*N+l*B+c*q,r[12]=a*A+o*z+l*G+c*J,r[1]=u*T+m*L+h*P+p*j,r[5]=u*C+m*U+h*O+p*K,r[9]=u*x+m*N+h*B+p*q,r[13]=u*A+m*z+h*G+p*J,r[2]=g*T+y*L+f*P+d*j,r[6]=g*C+y*U+f*O+d*K,r[10]=g*x+y*N+f*B+d*q,r[14]=g*A+y*z+f*G+d*J,r[3]=E*T+w*L+v*P+M*j,r[7]=E*C+w*U+v*O+M*K,r[11]=E*x+w*N+v*B+M*q,r[15]=E*A+w*z+v*G+M*J,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],m=e[6],h=e[10],p=e[14],g=e[3],y=e[7],f=e[11],d=e[15],E=l*p-c*h,w=o*p-c*m,v=o*h-l*m,M=a*p-c*u,T=a*h-l*u,C=a*m-o*u;return t*(y*E-f*w+d*v)-n*(g*E-f*M+d*T)+s*(g*w-y*M+d*C)-r*(g*v-y*T+f*C)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(r*u-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],m=e[9],h=e[10],p=e[11],g=e[12],y=e[13],f=e[14],d=e[15],E=t*o-n*a,w=t*l-s*a,v=t*c-r*a,M=n*l-s*o,T=n*c-r*o,C=s*c-r*l,x=u*y-m*g,A=u*f-h*g,L=u*d-p*g,U=m*f-h*y,N=m*d-p*y,z=h*d-p*f,P=E*z-w*N+v*U+M*L-T*A+C*x;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/P;return e[0]=(o*z-l*N+c*U)*O,e[1]=(s*N-n*z-r*U)*O,e[2]=(y*C-f*T+d*M)*O,e[3]=(h*T-m*C-p*M)*O,e[4]=(l*L-a*z-c*A)*O,e[5]=(t*z-s*L+r*A)*O,e[6]=(f*v-g*C-d*w)*O,e[7]=(u*C-h*v+p*w)*O,e[8]=(a*N-o*L+c*x)*O,e[9]=(n*L-t*N-r*x)*O,e[10]=(g*T-y*v+d*E)*O,e[11]=(m*v-u*T-p*E)*O,e[12]=(o*A-a*U-l*x)*O,e[13]=(t*U-n*A+s*x)*O,e[14]=(y*w-g*M-f*E)*O,e[15]=(u*M-m*w+h*E)*O,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,m=o+o,h=r*c,p=r*u,g=r*m,y=a*u,f=a*m,d=o*m,E=l*c,w=l*u,v=l*m,M=n.x,T=n.y,C=n.z;return s[0]=(1-(y+d))*M,s[1]=(p+v)*M,s[2]=(g-w)*M,s[3]=0,s[4]=(p-v)*T,s[5]=(1-(h+d))*T,s[6]=(f+E)*T,s[7]=0,s[8]=(g+w)*C,s[9]=(f-E)*C,s[10]=(1-(h+y))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ei.set(s[0],s[1],s[2]).length();const o=Ei.set(s[4],s[5],s[6]).length(),l=Ei.set(s[8],s[9],s[10]).length();r<0&&(a=-a),an.copy(this);const c=1/a,u=1/o,m=1/l;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=u,an.elements[5]*=u,an.elements[6]*=u,an.elements[8]*=m,an.elements[9]*=m,an.elements[10]*=m,t.setFromRotationMatrix(an),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=xn,l=!1){const c=this.elements,u=2*r/(t-e),m=2*r/(n-s),h=(t+e)/(t-e),p=(n+s)/(n-s);let g,y;if(l)g=r/(a-r),y=a*r/(a-r);else if(o===xn)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===As)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=m,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=xn,l=!1){const c=this.elements,u=2/(t-e),m=2/(n-s),h=-(t+e)/(t-e),p=-(n+s)/(n-s);let g,y;if(l)g=1/(a-r),y=a/(a-r);else if(o===xn)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===As)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=m,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Fr.prototype.isMatrix4=!0;let ft=Fr;const Ei=new D,an=new ft,gp=new D(0,0,0),_p=new D(1,1,1),Gn=new D,Gs=new D,Yt=new D,Ac=new ft,wc=new Yn;class qn{constructor(e=0,t=0,n=0,s=qn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],m=s[2],h=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-m,r),this._z=0);break;case"ZXY":this._x=Math.asin(We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-m,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-We(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-m,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Fe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ac.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ac,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wc.setFromEuler(this),this.setFromQuaternion(wc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}qn.DEFAULT_ORDER="XYZ";class nh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let xp=0;const Rc=new D,Ti=new Yn,Tn=new ft,Vs=new D,is=new D,vp=new D,Sp=new Yn,Cc=new D(1,0,0),Pc=new D(0,1,0),Lc=new D(0,0,1),Dc={type:"added"},yp={type:"removed"},Ai={type:"childadded",child:null},oa={type:"childremoved",child:null};class Mt extends jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xp++}),this.uuid=Un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Mt.DEFAULT_UP.clone();const e=new D,t=new qn,n=new Yn,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ft},normalMatrix:{value:new Be}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=Mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ti.setFromAxisAngle(e,t),this.quaternion.multiply(Ti),this}rotateOnWorldAxis(e,t){return Ti.setFromAxisAngle(e,t),this.quaternion.premultiply(Ti),this}rotateX(e){return this.rotateOnAxis(Cc,e)}rotateY(e){return this.rotateOnAxis(Pc,e)}rotateZ(e){return this.rotateOnAxis(Lc,e)}translateOnAxis(e,t){return Rc.copy(e).applyQuaternion(this.quaternion),this.position.add(Rc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cc,e)}translateY(e){return this.translateOnAxis(Pc,e)}translateZ(e){return this.translateOnAxis(Lc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Vs.copy(e):Vs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(is,Vs,this.up):Tn.lookAt(Vs,is,this.up),this.quaternion.setFromRotationMatrix(Tn),s&&(Tn.extractRotation(s.matrixWorld),Ti.setFromRotationMatrix(Tn),this.quaternion.premultiply(Ti.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Dc),Ai.child=e,this.dispatchEvent(Ai),Ai.child=null):Ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(yp),oa.child=e,this.dispatchEvent(oa),oa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Tn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Tn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Dc),Ai.child=e,this.dispatchEvent(Ai),Ai.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,e,vp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,Sp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const m=l[c];r(e.shapes,m)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),m=a(e.shapes),h=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),m.length>0&&(n.shapes=m),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Mt.DEFAULT_UP=new D(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Gi extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const bp={type:"move"};class la{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const y of e.hand.values()){const f=t.getJointPose(y,n),d=this._getHandJoint(c,y);f!==null&&(d.matrix.fromArray(f.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=f.radius),d.visible=f!==null}const u=c.joints["index-finger-tip"],m=c.joints["thumb-tip"],h=u.position.distanceTo(m.position),p=.02,g=.005;c.inputState.pinching&&h>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(bp)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Gi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const ih={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},Ws={h:0,s:0,l:0};function ca(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class He{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,qe.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=qe.workingColorSpace){if(e=Vo(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ca(a,r,e+1/3),this.g=ca(a,r,e),this.b=ca(a,r,e-1/3)}return qe.colorSpaceToWorking(this,s),this}setStyle(e,t=Xt){function n(r){r!==void 0&&parseFloat(r)<1&&Fe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Fe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Fe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Xt){const n=ih[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Fe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=In(e.r),this.g=In(e.g),this.b=In(e.b),this}copyLinearToSRGB(e){return this.r=$i(e.r),this.g=$i(e.g),this.b=$i(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Xt){return qe.workingToColorSpace(Ft.copy(this),e),Math.round(We(Ft.r*255,0,255))*65536+Math.round(We(Ft.g*255,0,255))*256+Math.round(We(Ft.b*255,0,255))}getHexString(e=Xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qe.workingColorSpace){qe.workingToColorSpace(Ft.copy(this),t);const n=Ft.r,s=Ft.g,r=Ft.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const m=a-o;switch(c=u<=.5?m/(a+o):m/(2-a-o),a){case n:l=(s-r)/m+(s<r?6:0);break;case s:l=(r-n)/m+2;break;case r:l=(n-s)/m+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=qe.workingColorSpace){return qe.workingToColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=Xt){qe.workingToColorSpace(Ft.copy(this),e);const t=Ft.r,n=Ft.g,s=Ft.b;return e!==Xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Vn),this.setHSL(Vn.h+e,Vn.s+t,Vn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Vn),e.getHSL(Ws);const n=Ss(Vn.h,Ws.h,t),s=Ss(Vn.s,Ws.s,t),r=Ss(Vn.l,Ws.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ft=new He;He.NAMES=ih;class Mp extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qn,this.environmentIntensity=1,this.environmentRotation=new qn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const on=new D,An=new D,ua=new D,wn=new D,wi=new D,Ri=new D,Nc=new D,ha=new D,da=new D,fa=new D,pa=new _t,ma=new _t,ga=new _t;class tn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),on.subVectors(e,t),s.cross(on);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){on.subVectors(s,t),An.subVectors(n,t),ua.subVectors(e,t);const a=on.dot(on),o=on.dot(An),l=on.dot(ua),c=An.dot(An),u=An.dot(ua),m=a*c-o*o;if(m===0)return r.set(0,0,0),null;const h=1/m,p=(c*l-o*u)*h,g=(a*u-o*l)*h;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wn.x),l.addScaledVector(a,wn.y),l.addScaledVector(o,wn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return pa.setScalar(0),ma.setScalar(0),ga.setScalar(0),pa.fromBufferAttribute(e,t),ma.fromBufferAttribute(e,n),ga.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(pa,r.x),a.addScaledVector(ma,r.y),a.addScaledVector(ga,r.z),a}static isFrontFacing(e,t,n,s){return on.subVectors(n,t),An.subVectors(e,t),on.cross(An).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return on.subVectors(this.c,this.b),An.subVectors(this.a,this.b),on.cross(An).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return tn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return tn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return tn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return tn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return tn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;wi.subVectors(s,n),Ri.subVectors(r,n),ha.subVectors(e,n);const l=wi.dot(ha),c=Ri.dot(ha);if(l<=0&&c<=0)return t.copy(n);da.subVectors(e,s);const u=wi.dot(da),m=Ri.dot(da);if(u>=0&&m<=u)return t.copy(s);const h=l*m-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(wi,a);fa.subVectors(e,r);const p=wi.dot(fa),g=Ri.dot(fa);if(g>=0&&p<=g)return t.copy(r);const y=p*c-l*g;if(y<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Ri,o);const f=u*g-p*m;if(f<=0&&m-u>=0&&p-g>=0)return Nc.subVectors(r,s),o=(m-u)/(m-u+(p-g)),t.copy(s).addScaledVector(Nc,o);const d=1/(f+y+h);return a=y*d,o=h*d,t.copy(n).addScaledVector(wi,a).addScaledVector(Ri,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Cs{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ln):ln.fromBufferAttribute(r,a),ln.applyMatrix4(e.matrixWorld),this.expandByPoint(ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xs.copy(n.boundingBox)),Xs.applyMatrix4(e.matrixWorld),this.union(Xs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ln),ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ss),$s.subVectors(this.max,ss),Ci.subVectors(e.a,ss),Pi.subVectors(e.b,ss),Li.subVectors(e.c,ss),Wn.subVectors(Pi,Ci),Xn.subVectors(Li,Pi),ei.subVectors(Ci,Li);let t=[0,-Wn.z,Wn.y,0,-Xn.z,Xn.y,0,-ei.z,ei.y,Wn.z,0,-Wn.x,Xn.z,0,-Xn.x,ei.z,0,-ei.x,-Wn.y,Wn.x,0,-Xn.y,Xn.x,0,-ei.y,ei.x,0];return!_a(t,Ci,Pi,Li,$s)||(t=[1,0,0,0,1,0,0,0,1],!_a(t,Ci,Pi,Li,$s))?!1:(Ks.crossVectors(Wn,Xn),t=[Ks.x,Ks.y,Ks.z],_a(t,Ci,Pi,Li,$s))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Rn=[new D,new D,new D,new D,new D,new D,new D,new D],ln=new D,Xs=new Cs,Ci=new D,Pi=new D,Li=new D,Wn=new D,Xn=new D,ei=new D,ss=new D,$s=new D,Ks=new D,ti=new D;function _a(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ti.fromArray(i,r);const o=s.x*Math.abs(ti.x)+s.y*Math.abs(ti.y)+s.z*Math.abs(ti.z),l=e.dot(ti),c=t.dot(ti),u=n.dot(ti);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const bt=new D,Ys=new xe;let Ep=0;class yn extends jn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ep++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Qu,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ys.fromBufferAttribute(this,t),Ys.applyMatrix3(e),this.setXY(t,Ys.x,Ys.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=cn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=cn(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=cn(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=cn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=cn(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class sh extends yn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class rh extends yn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ht extends yn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Tp=new Cs,rs=new D,xa=new D;class kr{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Tp.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rs.subVectors(e,this.center);const t=rs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(rs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rs.copy(e.center).add(xa)),this.expandByPoint(rs.copy(e.center).sub(xa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Ap=0;const en=new ft,va=new Mt,Di=new D,qt=new Cs,as=new Cs,Pt=new D;class Dt extends jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ap++}),this.uuid=Un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Wf(e)?rh:sh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Be().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return en.makeRotationFromQuaternion(e),this.applyMatrix4(en),this}rotateX(e){return en.makeRotationX(e),this.applyMatrix4(en),this}rotateY(e){return en.makeRotationY(e),this.applyMatrix4(en),this}rotateZ(e){return en.makeRotationZ(e),this.applyMatrix4(en),this}translate(e,t,n){return en.makeTranslation(e,t,n),this.applyMatrix4(en),this}scale(e,t,n){return en.makeScale(e,t,n),this.applyMatrix4(en),this}lookAt(e){return va.lookAt(e),va.updateMatrix(),this.applyMatrix4(va.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Di).negate(),this.translate(Di.x,Di.y,Di.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ht(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Fe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Cs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];qt.setFromBufferAttribute(r),this.morphTargetsRelative?(Pt.addVectors(this.boundingBox.min,qt.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,qt.max),this.boundingBox.expandByPoint(Pt)):(this.boundingBox.expandByPoint(qt.min),this.boundingBox.expandByPoint(qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(qt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];as.setFromBufferAttribute(o),this.morphTargetsRelative?(Pt.addVectors(qt.min,as.min),qt.expandByPoint(Pt),Pt.addVectors(qt.max,as.max),qt.expandByPoint(Pt)):(qt.expandByPoint(as.min),qt.expandByPoint(as.max))}qt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Pt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Pt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Pt.fromBufferAttribute(o,c),l&&(Di.fromBufferAttribute(e,c),Pt.add(Di)),s=Math.max(s,n.distanceToSquared(Pt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new yn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new D,l[x]=new D;const c=new D,u=new D,m=new D,h=new xe,p=new xe,g=new xe,y=new D,f=new D;function d(x,A,L){c.fromBufferAttribute(n,x),u.fromBufferAttribute(n,A),m.fromBufferAttribute(n,L),h.fromBufferAttribute(r,x),p.fromBufferAttribute(r,A),g.fromBufferAttribute(r,L),u.sub(c),m.sub(c),p.sub(h),g.sub(h);const U=1/(p.x*g.y-g.x*p.y);isFinite(U)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(m,-p.y).multiplyScalar(U),f.copy(m).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(U),o[x].add(y),o[A].add(y),o[L].add(y),l[x].add(f),l[A].add(f),l[L].add(f))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let x=0,A=E.length;x<A;++x){const L=E[x],U=L.start,N=L.count;for(let z=U,P=U+N;z<P;z+=3)d(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const w=new D,v=new D,M=new D,T=new D;function C(x){M.fromBufferAttribute(s,x),T.copy(M);const A=o[x];w.copy(A),w.sub(M.multiplyScalar(M.dot(A))).normalize(),v.crossVectors(T,A);const U=v.dot(l[x])<0?-1:1;a.setXYZW(x,w.x,w.y,w.z,U)}for(let x=0,A=E.length;x<A;++x){const L=E[x],U=L.start,N=L.count;for(let z=U,P=U+N;z<P;z+=3)C(e.getX(z+0)),C(e.getX(z+1)),C(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new yn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);const s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,u=new D,m=new D;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),y=e.getX(h+1),f=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,f),u.subVectors(a,r),m.subVectors(s,r),u.cross(m),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,f),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),m.subVectors(s,r),u.cross(m),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,m=o.normalized,h=new c.constructor(l.length*u);let p=0,g=0;for(let y=0,f=l.length;y<f;y++){o.isInterleavedBufferAttribute?p=l[y]*o.data.stride+o.offset:p=l[y]*u;for(let d=0;d<u;d++)h[g++]=c[p++]}return new yn(h,u,m)}if(this.index===null)return Fe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Dt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,m=c.length;u<m;u++){const h=c[u],p=e(h,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let m=0,h=c.length;m<h;m++){const p=c[m];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],m=r[c];for(let h=0,p=m.length;h<p;h++)u.push(m[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const m=a[c];this.addGroup(m.start,m.count,m.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wp{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Qu,this.updateRanges=[],this.version=0,this.uuid=Un()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const zt=new D;class Nr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyMatrix4(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.applyNormalMatrix(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)zt.fromBufferAttribute(this,t),zt.transformDirection(e),this.setXYZ(t,zt.x,zt.y,zt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=cn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=st(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=cn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=cn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=cn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=cn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),n=st(n,this.array),s=st(s,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Dr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new yn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Nr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Dr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Sa=new D,Rp=new D,Cp=new Be;class Pn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Sa.subVectors(n,t).cross(Rp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(Sa),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Cp.getNormalMatrix(e),s=this.coplanarPoint(Sa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Pp=0;class _i extends jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pp++}),this.uuid=Un(),this.name="",this.type="Material",this.blending=xs,this.side=ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Iu,this.blendDst=Fu,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new He(0,0,0),this.blendAlpha=0,this.depthFunc=Ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Of,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=na,this.stencilZFail=na,this.stencilZPass=na,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Fe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Fe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new He().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Pn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new xe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new xe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Er extends _i{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new He(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ni;const os=new D,Ui=new D,Ii=new D,Fi=new xe,ls=new xe,ah=new ft,qs=new D,cs=new D,js=new D,Uc=new xe,ya=new xe,Ic=new xe;class Fc extends Mt{constructor(e=new Er){if(super(),this.isSprite=!0,this.type="Sprite",Ni===void 0){Ni=new Dt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new wp(t,5);Ni.setIndex([0,1,2,0,2,3]),Ni.setAttribute("position",new Nr(n,3,0,!1)),Ni.setAttribute("uv",new Nr(n,2,3,!1))}this.geometry=Ni,this.material=e,this.center=new xe(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ze('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ui.setFromMatrixScale(this.matrixWorld),ah.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ii.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ui.multiplyScalar(-Ii.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Zs(qs.set(-.5,-.5,0),Ii,a,Ui,s,r),Zs(cs.set(.5,-.5,0),Ii,a,Ui,s,r),Zs(js.set(.5,.5,0),Ii,a,Ui,s,r),Uc.set(0,0),ya.set(1,0),Ic.set(1,1);let o=e.ray.intersectTriangle(qs,cs,js,!1,os);if(o===null&&(Zs(cs.set(-.5,.5,0),Ii,a,Ui,s,r),ya.set(0,1),o=e.ray.intersectTriangle(qs,js,cs,!1,os),o===null))return;const l=e.ray.origin.distanceTo(os);l<e.near||l>e.far||t.push({distance:l,point:os.clone(),uv:tn.getInterpolation(os,qs,cs,js,Uc,ya,Ic,new xe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Zs(i,e,t,n,s,r){Fi.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(ls.x=r*Fi.x-s*Fi.y,ls.y=s*Fi.x+r*Fi.y):ls.copy(Fi),i.copy(e),i.x+=ls.x,i.y+=ls.y,i.applyMatrix4(ah)}const Cn=new D,ba=new D,Js=new D,Qs=new D;class Xo{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Cn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Cn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Cn.copy(this.origin).addScaledVector(this.direction,t),Cn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ba.copy(e).add(t).multiplyScalar(.5),Js.copy(t).sub(e).normalize(),Qs.copy(this.origin).sub(ba);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Js),o=Qs.dot(this.direction),l=-Qs.dot(Js),c=Qs.lengthSq(),u=Math.abs(1-a*a);let m,h,p,g;if(u>0)if(m=a*l-o,h=a*o-l,g=r*u,m>=0)if(h>=-g)if(h<=g){const y=1/u;m*=y,h*=y,p=m*(m+a*h+2*o)+h*(a*m+h+2*l)+c}else h=r,m=Math.max(0,-(a*h+o)),p=-m*m+h*(h+2*l)+c;else h=-r,m=Math.max(0,-(a*h+o)),p=-m*m+h*(h+2*l)+c;else h<=-g?(m=Math.max(0,-(-a*r+o)),h=m>0?-r:Math.min(Math.max(-r,-l),r),p=-m*m+h*(h+2*l)+c):h<=g?(m=0,h=Math.min(Math.max(-r,-l),r),p=h*(h+2*l)+c):(m=Math.max(0,-(a*r+o)),h=m>0?r:Math.min(Math.max(-r,-l),r),p=-m*m+h*(h+2*l)+c);else h=a>0?-r:r,m=Math.max(0,-(a*h+o)),p=-m*m+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,m),s&&s.copy(ba).addScaledVector(Js,h),p}intersectSphere(e,t){if(e.radius<0)return null;Cn.subVectors(e.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,m=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),m>=0?(o=(e.min.z-h.z)*m,l=(e.max.z-h.z)*m):(o=(e.max.z-h.z)*m,l=(e.min.z-h.z)*m),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Cn)!==null}intersectTriangle(e,t,n,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,m=e.x-a.x,h=e.y-a.y,p=e.z-a.z,g=t.x-a.x,y=t.y-a.y,f=t.z-a.z,d=n.x-a.x,E=n.y-a.y,w=n.z-a.z,v=Math.abs(l),M=Math.abs(c),T=Math.abs(u);let C,x,A,L,U,N,z,P,O,B,G,j;if(v>=M&&v>=T?(A=l,N=m,O=g,j=d,l>=0?(C=c,x=u,L=h,U=p,z=y,P=f,B=E,G=w):(C=u,x=c,L=p,U=h,z=f,P=y,B=w,G=E)):M>=T?(A=c,N=h,O=y,j=E,c>=0?(C=u,x=l,L=p,U=m,z=f,P=g,B=w,G=d):(C=l,x=u,L=m,U=p,z=g,P=f,B=d,G=w)):(A=u,N=p,O=f,j=w,u>=0?(C=l,x=c,L=m,U=h,z=g,P=y,B=d,G=E):(C=c,x=l,L=h,U=m,z=y,P=g,B=E,G=d)),A===0)return null;const K=C/A,q=x/A,J=1/A,be=L-K*N,Me=U-q*N,Ce=z-K*O,ke=P-q*O,Ne=B-K*j,V=G-q*j,ee=Ne*ke-V*Ce,ge=be*V-Me*Ne,Oe=Ce*Me-ke*be;if(s){if(ee<0||ge<0||Oe<0)return null}else if((ee<0||ge<0||Oe<0)&&(ee>0||ge>0||Oe>0))return null;const Se=ee+ge+Oe;if(Se===0)return null;const Xe=J*(ee*N+ge*O+Oe*j);return(Se>0?Xe<0:Xe>0)?null:this.at(Xe/Se,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $o extends _i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.combine=Ou,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Oc=new ft,ni=new Xo,er=new kr,kc=new D,tr=new D,nr=new D,ir=new D,Ma=new D,sr=new D,Bc=new D,rr=new D;class Gt extends Mt{constructor(e=new Dt,t=new $o){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){sr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],m=r[l];u!==0&&(Ma.fromBufferAttribute(m,e),a?sr.addScaledVector(Ma,u):sr.addScaledVector(Ma.sub(t),u))}t.add(sr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(r),ni.copy(e.ray).recast(e.near),!(er.containsPoint(ni.origin)===!1&&(ni.intersectSphere(er,kc)===null||ni.origin.distanceToSquared(kc)>(e.far-e.near)**2))&&(Oc.copy(r).invert(),ni.copy(e.ray).applyMatrix4(Oc),!(n.boundingBox!==null&&ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ni)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,m=r.attributes.normal,h=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){const f=h[g],d=a[f.materialIndex],E=Math.max(f.start,p.start),w=Math.min(o.count,Math.min(f.start+f.count,p.start+p.count));for(let v=E,M=w;v<M;v+=3){const T=o.getX(v),C=o.getX(v+1),x=o.getX(v+2);s=ar(this,d,e,n,c,u,m,T,C,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let f=g,d=y;f<d;f+=3){const E=o.getX(f),w=o.getX(f+1),v=o.getX(f+2);s=ar(this,a,e,n,c,u,m,E,w,v),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){const f=h[g],d=a[f.materialIndex],E=Math.max(f.start,p.start),w=Math.min(l.count,Math.min(f.start+f.count,p.start+p.count));for(let v=E,M=w;v<M;v+=3){const T=v,C=v+1,x=v+2;s=ar(this,d,e,n,c,u,m,T,C,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let f=g,d=y;f<d;f+=3){const E=f,w=f+1,v=f+2;s=ar(this,a,e,n,c,u,m,E,w,v),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}}function Lp(i,e,t,n,s,r,a,o){let l;if(e.side===Kt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===ci,o),l===null)return null;rr.copy(o),rr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(rr);return c<t.near||c>t.far?null:{distance:c,point:rr.clone(),object:i}}function ar(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,tr),i.getVertexPosition(l,nr),i.getVertexPosition(c,ir);const u=Lp(i,e,t,n,tr,nr,ir,Bc);if(u){const m=new D;tn.getBarycoord(Bc,tr,nr,ir,m),s&&(u.uv=tn.getInterpolatedAttribute(s,o,l,c,m,new xe)),r&&(u.uv1=tn.getInterpolatedAttribute(r,o,l,c,m,new xe)),a&&(u.normal=tn.getInterpolatedAttribute(a,o,l,c,m,new D),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new D,materialIndex:0};tn.getNormal(tr,nr,ir,h.normal),u.face=h,u.barycoord=m}return u}class Dp extends kt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Lt,u=Lt,m,h){super(null,a,o,l,c,u,s,r,m,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ii=new kr,Np=new xe(.5,.5),or=new D;class Ko{constructor(e=new Pn,t=new Pn,n=new Pn,s=new Pn,r=new Pn,a=new Pn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=xn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],m=r[5],h=r[6],p=r[7],g=r[8],y=r[9],f=r[10],d=r[11],E=r[12],w=r[13],v=r[14],M=r[15];if(s[0].setComponents(c-a,p-u,d-g,M-E).normalize(),s[1].setComponents(c+a,p+u,d+g,M+E).normalize(),s[2].setComponents(c+o,p+m,d+y,M+w).normalize(),s[3].setComponents(c-o,p-m,d-y,M-w).normalize(),n)s[4].setComponents(l,h,f,v).normalize(),s[5].setComponents(c-l,p-h,d-f,M-v).normalize();else if(s[4].setComponents(c-l,p-h,d-f,M-v).normalize(),t===xn)s[5].setComponents(c+l,p+h,d+f,M+v).normalize();else if(t===As)s[5].setComponents(l,h,f,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ii)}intersectsSprite(e){ii.center.set(0,0,0);const t=Np.distanceTo(e.center);return ii.radius=.7071067811865476+t,ii.applyMatrix4(e.matrixWorld),this.intersectsSphere(ii)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(or.x=s.normal.x>0?e.max.x:e.min.x,or.y=s.normal.y>0?e.max.y:e.min.y,or.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(or)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Yo extends _i{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new He(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ur=new D,Ir=new D,zc=new ft,us=new Xo,lr=new kr,Ea=new D,Hc=new D;class oh extends Mt{constructor(e=new Dt,t=new Yo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ur.fromBufferAttribute(t,s-1),Ir.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ur.distanceTo(Ir);e.setAttribute("lineDistance",new ht(n,1))}else Fe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),lr.copy(n.boundingSphere),lr.applyMatrix4(s),lr.radius+=r,e.ray.intersectsSphere(lr)===!1)return;zc.copy(s).invert(),us.copy(e.ray).applyMatrix4(zc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let y=p,f=g-1;y<f;y+=c){const d=u.getX(y),E=u.getX(y+1),w=cr(this,e,us,l,d,E,y);w&&t.push(w)}if(this.isLineLoop){const y=u.getX(g-1),f=u.getX(p),d=cr(this,e,us,l,y,f,g-1);d&&t.push(d)}}else{const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let y=p,f=g-1;y<f;y+=c){const d=cr(this,e,us,l,y,y+1,y);d&&t.push(d)}if(this.isLineLoop){const y=cr(this,e,us,l,g-1,p,g-1);y&&t.push(y)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function cr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Ur.fromBufferAttribute(o,s),Ir.fromBufferAttribute(o,r),t.distanceSqToSegment(Ur,Ir,Ea,Hc)>n)return;Ea.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Ea);if(!(c<e.near||c>e.far))return{distance:c,point:Hc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const Gc=new D,Vc=new D;class Up extends oh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Gc.fromBufferAttribute(t,s),Vc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Gc.distanceTo(Vc);e.setAttribute("lineDistance",new ht(n,1))}else Fe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class lh extends kt{constructor(e=[],t=ui,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ip extends kt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Rs extends kt{constructor(e,t,n=bn,s,r,a,o=Lt,l=Lt,c,u=On,m=1){if(u!==On&&u!==li)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:m};super(h,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Wo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Fp extends Rs{constructor(e,t=bn,n=ui,s,r,a=Lt,o=Lt,l,c=On){const u={width:e,height:e,depth:1},m=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,l,c),this.image=m,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ch extends kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class di extends Dt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],m=[];let h=0,p=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(u,3)),this.setAttribute("uv",new ht(m,2));function g(y,f,d,E,w,v,M,T,C,x,A){const L=v/C,U=M/x,N=v/2,z=M/2,P=T/2,O=C+1,B=x+1;let G=0,j=0;const K=new D;for(let q=0;q<B;q++){const J=q*U-z;for(let be=0;be<O;be++){const Me=be*L-N;K[y]=Me*E,K[f]=J*w,K[d]=P,c.push(K.x,K.y,K.z),K[y]=0,K[f]=0,K[d]=T>0?1:-1,u.push(K.x,K.y,K.z),m.push(be/C),m.push(1-q/x),G+=1}}for(let q=0;q<x;q++)for(let J=0;J<C;J++){const be=h+J+O*q,Me=h+J+O*(q+1),Ce=h+(J+1)+O*(q+1),ke=h+(J+1)+O*q;l.push(be,Me,ke),l.push(Me,Ce,ke),j+=6}o.addGroup(p,j,A),p+=j,h+=G}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new di(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class qo extends Dt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],m=[],h=[],p=[];let g=0;const y=[],f=n/2;let d=0;E(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(u),this.setAttribute("position",new ht(m,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(p,2));function E(){const v=new D,M=new D;let T=0;const C=(t-e)/n;for(let x=0;x<=r;x++){const A=[],L=x/r,U=L*(t-e)+e;for(let N=0;N<=s;N++){const z=N/s,P=z*l+o,O=Math.sin(P),B=Math.cos(P);M.x=U*O,M.y=-L*n+f,M.z=U*B,m.push(M.x,M.y,M.z),v.set(O,C,B).normalize(),h.push(v.x,v.y,v.z),p.push(z,1-L),A.push(g++)}y.push(A)}for(let x=0;x<s;x++)for(let A=0;A<r;A++){const L=y[A][x],U=y[A+1][x],N=y[A+1][x+1],z=y[A][x+1];(e>0||A!==0)&&(u.push(L,U,z),T+=3),(t>0||A!==r-1)&&(u.push(U,N,z),T+=3)}c.addGroup(d,T,0),d+=T}function w(v){const M=g,T=new xe,C=new D;let x=0;const A=v===!0?e:t,L=v===!0?1:-1;for(let N=1;N<=s;N++)m.push(0,f*L,0),h.push(0,L,0),p.push(.5,.5),g++;const U=g;for(let N=0;N<=s;N++){const P=N/s*l+o,O=Math.cos(P),B=Math.sin(P);C.x=A*B,C.y=f*L,C.z=A*O,m.push(C.x,C.y,C.z),h.push(0,L,0),T.x=O*.5+.5,T.y=B*.5*L+.5,p.push(T.x,T.y),g++}for(let N=0;N<s;N++){const z=M+N,P=U+N;v===!0?u.push(P,P+1,z):u.push(P+1,P,z),x+=3}c.addGroup(d,x,v===!0?1:2),d+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qo(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class jo extends qo{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new jo(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class kn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Fe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const u=n[s],h=n[s+1]-u,p=(a-u)/h;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new xe:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new D,s=[],r=[],a=[],o=new D,l=new ft;for(let p=0;p<=e;p++){const g=p/e;s[p]=this.getTangentAt(g,new D)}r[0]=new D,a[0]=new D;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),m=Math.abs(s[0].y),h=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),m<=c&&(c=m,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(We(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(We(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class uh extends kn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new xe){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),m=Math.sin(this.aRotation),h=l-this.aX,p=c-this.aY;l=h*u-p*m+this.aX,c=h*m+p*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Op extends uh{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Zo(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,m){let h=(a-r)/c-(o-r)/(c+u)+(o-a)/u,p=(o-a)/u-(l-a)/(u+m)+(l-o)/m;h*=u,p*=u,s(a,o,h,p)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Wc=new D,Xc=new D,Ta=new Zo,Aa=new Zo,wa=new Zo;class hh extends kn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new D){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(Xc.subVectors(s[0],s[1]).add(s[0]),c=Xc);const m=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Wc.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Wc),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(m),p),y=Math.pow(m.distanceToSquared(h),p),f=Math.pow(h.distanceToSquared(u),p);y<1e-4&&(y=1),g<1e-4&&(g=y),f<1e-4&&(f=y),Ta.initNonuniformCatmullRom(c.x,m.x,h.x,u.x,g,y,f),Aa.initNonuniformCatmullRom(c.y,m.y,h.y,u.y,g,y,f),wa.initNonuniformCatmullRom(c.z,m.z,h.z,u.z,g,y,f)}else this.curveType==="catmullrom"&&(Ta.initCatmullRom(c.x,m.x,h.x,u.x,this.tension),Aa.initCatmullRom(c.y,m.y,h.y,u.y,this.tension),wa.initCatmullRom(c.z,m.z,h.z,u.z,this.tension));return n.set(Ta.calc(l),Aa.calc(l),wa.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function $c(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function kp(i,e){const t=1-i;return t*t*e}function Bp(i,e){return 2*(1-i)*i*e}function zp(i,e){return i*i*e}function ys(i,e,t,n){return kp(i,e)+Bp(i,t)+zp(i,n)}function Hp(i,e){const t=1-i;return t*t*t*e}function Gp(i,e){const t=1-i;return 3*t*t*i*e}function Vp(i,e){return 3*(1-i)*i*i*e}function Wp(i,e){return i*i*i*e}function bs(i,e,t,n,s){return Hp(i,e)+Gp(i,t)+Vp(i,n)+Wp(i,s)}class Xp extends kn{constructor(e=new xe,t=new xe,n=new xe,s=new xe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new xe){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(bs(e,s.x,r.x,a.x,o.x),bs(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class $p extends kn{constructor(e=new D,t=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(bs(e,s.x,r.x,a.x,o.x),bs(e,s.y,r.y,a.y,o.y),bs(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Kp extends kn{constructor(e=new xe,t=new xe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new xe){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new xe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Yp extends kn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class qp extends kn{constructor(e=new xe,t=new xe,n=new xe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new xe){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ys(e,s.x,r.x,a.x),ys(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class dh extends kn{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ys(e,s.x,r.x,a.x),ys(e,s.y,r.y,a.y),ys(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class jp extends kn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new xe){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],m=s[a>s.length-3?s.length-1:a+2];return n.set($c(o,l.x,c.x,u.x,m.x),$c(o,l.y,c.y,u.y,m.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new xe().fromArray(s))}return this}}var Zp=Object.freeze({__proto__:null,ArcCurve:Op,CatmullRomCurve3:hh,CubicBezierCurve:Xp,CubicBezierCurve3:$p,EllipseCurve:uh,LineCurve:Kp,LineCurve3:Yp,QuadraticBezierCurve:qp,QuadraticBezierCurve3:dh,SplineCurve:jp});class Br extends Dt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,m=e/o,h=t/l,p=[],g=[],y=[],f=[];for(let d=0;d<u;d++){const E=d*h-a;for(let w=0;w<c;w++){const v=w*m-r;g.push(v,-E,0),y.push(0,0,1),f.push(w/o),f.push(1-d/l)}}for(let d=0;d<l;d++)for(let E=0;E<o;E++){const w=E+c*d,v=E+c*(d+1),M=E+1+c*(d+1),T=E+1+c*d;p.push(w,v,T),p.push(v,M,T)}this.setIndex(p),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(y,3)),this.setAttribute("uv",new ht(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Br(e.width,e.height,e.widthSegments,e.heightSegments)}}class Jo extends Dt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],m=new D,h=new D,p=[],g=[],y=[],f=[];for(let d=0;d<=n;d++){const E=[],w=d/n,v=a+w*o,M=e*Math.cos(v),T=Math.sqrt(e*e-M*M);let C=0;d===0&&a===0?C=.5/t:d===n&&l===Math.PI&&(C=-.5/t);for(let x=0;x<=t;x++){const A=x/t,L=s+A*r;m.x=-T*Math.cos(L),m.y=M,m.z=T*Math.sin(L),g.push(m.x,m.y,m.z),h.copy(m).normalize(),y.push(h.x,h.y,h.z),f.push(A+C,1-w),E.push(c++)}u.push(E)}for(let d=0;d<n;d++)for(let E=0;E<t;E++){const w=u[d][E+1],v=u[d][E],M=u[d+1][E],T=u[d+1][E+1];(d!==0||a>0)&&p.push(w,v,T),(d!==n-1||l<Math.PI)&&p.push(v,M,T)}this.setIndex(p),this.setAttribute("position",new ht(g,3)),this.setAttribute("normal",new ht(y,3)),this.setAttribute("uv",new ht(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Qo extends Dt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const l=[],c=[],u=[],m=[],h=new D,p=new D,g=new D;for(let y=0;y<=n;y++){const f=a+y/n*o;for(let d=0;d<=s;d++){const E=d/s*r;p.x=(e+t*Math.cos(f))*Math.cos(E),p.y=(e+t*Math.cos(f))*Math.sin(E),p.z=t*Math.sin(f),c.push(p.x,p.y,p.z),h.x=e*Math.cos(E),h.y=e*Math.sin(E),g.subVectors(p,h).normalize(),u.push(g.x,g.y,g.z),m.push(d/s),m.push(y/n)}}for(let y=1;y<=n;y++)for(let f=1;f<=s;f++){const d=(s+1)*y+f-1,E=(s+1)*(y-1)+f-1,w=(s+1)*(y-1)+f,v=(s+1)*y+f;l.push(d,E,v),l.push(E,w,v)}this.setIndex(l),this.setAttribute("position",new ht(c,3)),this.setAttribute("normal",new ht(u,3)),this.setAttribute("uv",new ht(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qo(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}class el extends Dt{constructor(e=new dh(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};const a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new D,l=new D,c=new xe;let u=new D;const m=[],h=[],p=[],g=[];y(),this.setIndex(g),this.setAttribute("position",new ht(m,3)),this.setAttribute("normal",new ht(h,3)),this.setAttribute("uv",new ht(p,2));function y(){for(let w=0;w<t;w++)f(w);f(r===!1?t:0),E(),d()}function f(w){u=e.getPointAt(w/t,u);const v=a.normals[w],M=a.binormals[w];for(let T=0;T<=s;T++){const C=T/s*Math.PI*2,x=Math.sin(C),A=-Math.cos(C);l.x=A*v.x+x*M.x,l.y=A*v.y+x*M.y,l.z=A*v.z+x*M.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,m.push(o.x,o.y,o.z)}}function d(){for(let w=1;w<=t;w++)for(let v=1;v<=s;v++){const M=(s+1)*(w-1)+(v-1),T=(s+1)*w+(v-1),C=(s+1)*w+v,x=(s+1)*(w-1)+v;g.push(M,T,x),g.push(T,C,x)}}function E(){for(let w=0;w<=t;w++)for(let v=0;v<=s;v++)c.x=w/t,c.y=v/s,p.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new el(new Zp[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}function qi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(Kc(s))s.isRenderTargetTexture?(Fe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Kc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Ht(i){const e={};for(let t=0;t<i.length;t++){const n=qi(i[t]);for(const s in n)e[s]=n[s]}return e}function Kc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Jp(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function fh(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:qe.workingColorSpace}const Qp={clone:qi,merge:Ht};var em=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class En extends _i{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=em,this.fragmentShader=tm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=qi(e.uniforms),this.uniformsGroups=Jp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new He().setHex(s.value);break;case"v2":this.uniforms[n].value=new xe().fromArray(s.value);break;case"v3":this.uniforms[n].value=new D().fromArray(s.value);break;case"v4":this.uniforms[n].value=new _t().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Be().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ft().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class nm extends En{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class si extends _i{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new He(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Po,this.normalScale=new xe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class im extends _i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=If,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class sm extends _i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class tl extends Mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new He(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class rm extends tl{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new He(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ra=new ft,Yc=new D,qc=new D;class ph{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xe(512,512),this.mapType=Jt,this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ko,this._frameExtents=new xe(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Yc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yc),qc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Ra.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ra,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===As||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ra)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ur=new D,hr=new Yn,pn=new D;class mh extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ur,hr,pn),pn.x===1&&pn.y===1&&pn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,hr,pn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ur,hr,pn),pn.x===1&&pn.y===1&&pn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,hr,pn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const $n=new D,jc=new xe,Zc=new xe;class jt extends mh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ws*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(vs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ws*2*Math.atan(Math.tan(vs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){$n.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set($n.x,$n.y).multiplyScalar(-e/$n.z),$n.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set($n.x,$n.y).multiplyScalar(-e/$n.z)}getViewSize(e,t){return this.getViewBounds(e,jc,Zc),t.subVectors(Zc,jc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(vs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class am extends ph{constructor(){super(new jt(90,1,.5,500)),this.isPointLightShadow=!0}}class om extends tl{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new am}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class nl extends mh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class lm extends ph{constructor(){super(new nl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class cm extends tl{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.shadow=new lm}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Oi=-90,ki=1;class um extends Mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new jt(Oi,ki,e,t);s.layers=this.layers,this.add(s);const r=new jt(Oi,ki,e,t);r.layers=this.layers,this.add(r);const a=new jt(Oi,ki,e,t);a.layers=this.layers,this.add(a);const o=new jt(Oi,ki,e,t);o.layers=this.layers,this.add(o);const l=new jt(Oi,ki,e,t);l.layers=this.layers,this.add(l);const c=new jt(Oi,ki,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===As)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,m=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let f=!1;e.isWebGLRenderer===!0?f=e.state.buffers.depth.getReversed():f=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),f&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(m,h,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class hm extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Jc{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=We(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(We(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const ll=class ll{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};ll.prototype.isMatrix2=!0;let Qc=ll;class eu extends Up{constructor(e=10,t=10,n=4473924,s=8947848){n=new He(n),s=new He(s);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let h=0,p=0,g=-o;h<=t;h++,g+=a){l.push(-o,0,g,o,0,g),l.push(g,0,-o,g,0,o);const y=h===r?n:s;y.toArray(c,p),p+=3,y.toArray(c,p),p+=3,y.toArray(c,p),p+=3,y.toArray(c,p),p+=3}const u=new Dt;u.setAttribute("position",new ht(l,3)),u.setAttribute("color",new ht(c,3));const m=new Yo({vertexColors:!0,toneMapped:!1});super(u,m),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}const tu=new D;let dr,Ca;class dm extends Mt{constructor(e=new D(0,0,1),t=new D(0,0,0),n=1,s=16776960,r=n*.2,a=r*.2){super(),this.type="ArrowHelper",dr===void 0&&(dr=new Dt,dr.setAttribute("position",new ht([0,0,0,0,1,0],3)),Ca=new jo(.5,1,5,1),Ca.translate(0,-.5,0)),this.position.copy(t),this.line=new oh(dr,new Yo({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Gt(Ca,new $o({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,a)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{tu.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(tu,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class fm extends jn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function nu(i,e,t,n){const s=pm(n);switch(t){case ju:return i*e;case Ju:return i*e/s.components*s.byteLength;case ko:return i*e/s.components*s.byteLength;case hi:return i*e*2/s.components*s.byteLength;case Bo:return i*e*2/s.components*s.byteLength;case Zu:return i*e*3/s.components*s.byteLength;case un:return i*e*4/s.components*s.byteLength;case zo:return i*e*4/s.components*s.byteLength;case vr:case Sr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case yr:case br:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case eo:case no:return Math.max(i,16)*Math.max(e,8)/4;case Qa:case to:return Math.max(i,8)*Math.max(e,8)/2;case io:case so:case ao:case oo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ro:case wr:case lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case uo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ho:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case fo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case po:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case mo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case go:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case _o:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case xo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case vo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case So:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case yo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case bo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Mo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Eo:case To:case Ao:return Math.ceil(i/4)*Math.ceil(e/4)*16;case wo:case Ro:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Rr:case Co:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function pm(i){switch(i){case Jt:case $u:return{byteLength:1,components:1};case Es:case Ku:case Mn:return{byteLength:2,components:1};case Fo:case Oo:return{byteLength:2,components:4};case bn:case Io:case _n:return{byteLength:4,components:1};case Yu:case qu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Uo}}));typeof window<"u"&&(window.__THREE__?Fe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Uo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function gh(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function mm(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,m=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:m}}function n(o,l,c){const u=l.array,m=l.updateRanges;if(i.bindBuffer(c,o),m.length===0)i.bufferSubData(c,0,u);else{m.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<m.length;p++){const g=m[h],y=m[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,m[h]=y)}m.length=h+1;for(let p=0,g=m.length;p<g;p++){const y=m[p];i.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var gm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_m=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,xm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ym=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Mm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Em=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Tm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Am=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,wm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Rm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Cm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Pm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Lm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Dm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Nm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Um=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Im=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Fm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Om=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,km=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Bm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,zm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Hm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Gm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$m="gl_FragColor = linearToOutputTexel( gl_FragColor );",Km=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ym=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,qm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,jm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Zm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Jm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,e0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,t0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,n0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,i0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,s0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,r0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,a0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,o0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,l0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,c0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,u0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,h0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,d0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,f0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,p0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,m0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,g0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,_0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,x0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,v0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,S0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,y0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,b0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,M0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,E0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,T0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,A0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,w0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,R0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,C0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,P0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,L0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,D0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,N0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,U0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,I0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,F0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,O0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,k0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,B0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,z0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,H0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,G0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,V0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,W0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,X0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,$0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,K0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Y0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,q0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,j0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Z0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,J0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Q0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,eg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,tg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ng=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ig=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,sg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ag=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,og=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ug=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,hg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,fg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,mg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const gg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_g=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Mg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Eg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Tg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Cg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Lg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ng=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ug=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ig=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Og=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,kg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Hg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Xg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$g=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Yg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:gm,alphahash_pars_fragment:_m,alphamap_fragment:xm,alphamap_pars_fragment:vm,alphatest_fragment:Sm,alphatest_pars_fragment:ym,aomap_fragment:bm,aomap_pars_fragment:Mm,batching_pars_vertex:Em,batching_vertex:Tm,begin_vertex:Am,beginnormal_vertex:wm,bsdfs:Rm,iridescence_fragment:Cm,bumpmap_pars_fragment:Pm,clipping_planes_fragment:Lm,clipping_planes_pars_fragment:Dm,clipping_planes_pars_vertex:Nm,clipping_planes_vertex:Um,color_fragment:Im,color_pars_fragment:Fm,color_pars_vertex:Om,color_vertex:km,common:Bm,cube_uv_reflection_fragment:zm,defaultnormal_vertex:Hm,displacementmap_pars_vertex:Gm,displacementmap_vertex:Vm,emissivemap_fragment:Wm,emissivemap_pars_fragment:Xm,colorspace_fragment:$m,colorspace_pars_fragment:Km,envmap_fragment:Ym,envmap_common_pars_fragment:qm,envmap_pars_fragment:jm,envmap_pars_vertex:Zm,envmap_physical_pars_fragment:l0,envmap_vertex:Jm,fog_vertex:Qm,fog_pars_vertex:e0,fog_fragment:t0,fog_pars_fragment:n0,gradientmap_pars_fragment:i0,lightmap_pars_fragment:s0,lights_lambert_fragment:r0,lights_lambert_pars_fragment:a0,lights_pars_begin:o0,lights_toon_fragment:c0,lights_toon_pars_fragment:u0,lights_phong_fragment:h0,lights_phong_pars_fragment:d0,lights_physical_fragment:f0,lights_physical_pars_fragment:p0,lights_fragment_begin:m0,lights_fragment_maps:g0,lights_fragment_end:_0,lightprobes_pars_fragment:x0,logdepthbuf_fragment:v0,logdepthbuf_pars_fragment:S0,logdepthbuf_pars_vertex:y0,logdepthbuf_vertex:b0,map_fragment:M0,map_pars_fragment:E0,map_particle_fragment:T0,map_particle_pars_fragment:A0,metalnessmap_fragment:w0,metalnessmap_pars_fragment:R0,morphinstance_vertex:C0,morphcolor_vertex:P0,morphnormal_vertex:L0,morphtarget_pars_vertex:D0,morphtarget_vertex:N0,normal_fragment_begin:U0,normal_fragment_maps:I0,normal_pars_fragment:F0,normal_pars_vertex:O0,normal_vertex:k0,normalmap_pars_fragment:B0,clearcoat_normal_fragment_begin:z0,clearcoat_normal_fragment_maps:H0,clearcoat_pars_fragment:G0,iridescence_pars_fragment:V0,opaque_fragment:W0,packing:X0,premultiplied_alpha_fragment:$0,project_vertex:K0,dithering_fragment:Y0,dithering_pars_fragment:q0,roughnessmap_fragment:j0,roughnessmap_pars_fragment:Z0,shadowmap_pars_fragment:J0,shadowmap_pars_vertex:Q0,shadowmap_vertex:eg,shadowmask_pars_fragment:tg,skinbase_vertex:ng,skinning_pars_vertex:ig,skinning_vertex:sg,skinnormal_vertex:rg,specularmap_fragment:ag,specularmap_pars_fragment:og,tonemapping_fragment:lg,tonemapping_pars_fragment:cg,transmission_fragment:ug,transmission_pars_fragment:hg,uv_pars_fragment:dg,uv_pars_vertex:fg,uv_vertex:pg,worldpos_vertex:mg,background_vert:gg,background_frag:_g,backgroundCube_vert:xg,backgroundCube_frag:vg,cube_vert:Sg,cube_frag:yg,depth_vert:bg,depth_frag:Mg,distance_vert:Eg,distance_frag:Tg,equirect_vert:Ag,equirect_frag:wg,linedashed_vert:Rg,linedashed_frag:Cg,meshbasic_vert:Pg,meshbasic_frag:Lg,meshlambert_vert:Dg,meshlambert_frag:Ng,meshmatcap_vert:Ug,meshmatcap_frag:Ig,meshnormal_vert:Fg,meshnormal_frag:Og,meshphong_vert:kg,meshphong_frag:Bg,meshphysical_vert:zg,meshphysical_frag:Hg,meshtoon_vert:Gg,meshtoon_frag:Vg,points_vert:Wg,points_frag:Xg,shadow_vert:$g,shadow_frag:Kg,sprite_vert:Yg,sprite_frag:qg},fe={common:{diffuse:{value:new He(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new xe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new He(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new D},probesMax:{value:new D},probesResolution:{value:new D}},points:{diffuse:{value:new He(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new He(16777215)},opacity:{value:1},center:{value:new xe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},gn={basic:{uniforms:Ht([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:Ht([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new He(0)},envMapIntensity:{value:1}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:Ht([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new He(0)},specular:{value:new He(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:Ht([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new He(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:Ht([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new He(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:Ht([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:Ht([fe.points,fe.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:Ht([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:Ht([fe.common,fe.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:Ht([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:Ht([fe.sprite,fe.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distance:{uniforms:Ht([fe.common,fe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distance_vert,fragmentShader:Ve.distance_frag},shadow:{uniforms:Ht([fe.lights,fe.fog,{color:{value:new He(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};gn.physical={uniforms:Ht([gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new xe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new He(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new xe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new He(0)},specularColor:{value:new He(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new xe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};const fr={r:0,b:0,g:0},jg=new ft,_h=new Be;_h.set(-1,0,0,0,1,0,0,0,1);function Zg(i,e,t,n,s,r){const a=new He(0);let o=s===!0?0:1,l,c,u=null,m=0,h=null;function p(E){let w=E.isScene===!0?E.background:null;if(w&&w.isTexture){const v=E.backgroundBlurriness>0;w=e.get(w,v)}return w}function g(E){let w=!1;const v=p(E);v===null?f(a,o):v&&v.isColor&&(f(v,1),w=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?t.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(E,w){const v=p(w);v&&(v.isCubeTexture||v.mapping===Or)?(c===void 0&&(c=new Gt(new di(1,1,1),new En({name:"BackgroundCubeMaterial",uniforms:qi(gn.backgroundCube.uniforms),vertexShader:gn.backgroundCube.vertexShader,fragmentShader:gn.backgroundCube.fragmentShader,side:Kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(jg.makeRotationFromEuler(w.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(_h),c.material.toneMapped=qe.getTransfer(v.colorSpace)!==it,(u!==v||m!==v.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,m=v.version,h=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Gt(new Br(2,2),new En({name:"BackgroundMaterial",uniforms:qi(gn.background.uniforms),vertexShader:gn.background.vertexShader,fragmentShader:gn.background.fragmentShader,side:ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=qe.getTransfer(v.colorSpace)!==it,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||m!==v.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,m=v.version,h=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function f(E,w){E.getRGB(fr,fh(i)),t.buffers.color.setClear(fr.r,fr.g,fr.b,w,r)}function d(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,w=1){a.set(E),o=w,f(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(E){o=E,f(a,o)},render:g,addToRenderList:y,dispose:d}}function Jg(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null);let r=s,a=!1;function o(U,N,z,P,O){let B=!1;const G=m(U,P,z,N);r!==G&&(r=G,c(r.object)),B=p(U,P,z,O),B&&g(U,P,z,O),O!==null&&e.update(O,i.ELEMENT_ARRAY_BUFFER),(B||a)&&(a=!1,v(U,N,z,P),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return i.createVertexArray()}function c(U){return i.bindVertexArray(U)}function u(U){return i.deleteVertexArray(U)}function m(U,N,z,P){const O=P.wireframe===!0;let B=n[N.id];B===void 0&&(B={},n[N.id]=B);const G=U.isInstancedMesh===!0?U.id:0;let j=B[G];j===void 0&&(j={},B[G]=j);let K=j[z.id];K===void 0&&(K={},j[z.id]=K);let q=K[O];return q===void 0&&(q=h(l()),K[O]=q),q}function h(U){const N=[],z=[],P=[];for(let O=0;O<t;O++)N[O]=0,z[O]=0,P[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:z,attributeDivisors:P,object:U,attributes:{},index:null}}function p(U,N,z,P){const O=r.attributes,B=N.attributes;let G=0;const j=z.getAttributes();for(const K in j)if(j[K].location>=0){const J=O[K];let be=B[K];if(be===void 0&&(K==="instanceMatrix"&&U.instanceMatrix&&(be=U.instanceMatrix),K==="instanceColor"&&U.instanceColor&&(be=U.instanceColor)),J===void 0||J.attribute!==be||be&&J.data!==be.data)return!0;G++}return r.attributesNum!==G||r.index!==P}function g(U,N,z,P){const O={},B=N.attributes;let G=0;const j=z.getAttributes();for(const K in j)if(j[K].location>=0){let J=B[K];J===void 0&&(K==="instanceMatrix"&&U.instanceMatrix&&(J=U.instanceMatrix),K==="instanceColor"&&U.instanceColor&&(J=U.instanceColor));const be={};be.attribute=J,J&&J.data&&(be.data=J.data),O[K]=be,G++}r.attributes=O,r.attributesNum=G,r.index=P}function y(){const U=r.newAttributes;for(let N=0,z=U.length;N<z;N++)U[N]=0}function f(U){d(U,0)}function d(U,N){const z=r.newAttributes,P=r.enabledAttributes,O=r.attributeDivisors;z[U]=1,P[U]===0&&(i.enableVertexAttribArray(U),P[U]=1),O[U]!==N&&(i.vertexAttribDivisor(U,N),O[U]=N)}function E(){const U=r.newAttributes,N=r.enabledAttributes;for(let z=0,P=N.length;z<P;z++)N[z]!==U[z]&&(i.disableVertexAttribArray(z),N[z]=0)}function w(U,N,z,P,O,B,G){G===!0?i.vertexAttribIPointer(U,N,z,O,B):i.vertexAttribPointer(U,N,z,P,O,B)}function v(U,N,z,P){y();const O=P.attributes,B=z.getAttributes(),G=N.defaultAttributeValues;for(const j in B){const K=B[j];if(K.location>=0){let q=O[j];if(q===void 0&&(j==="instanceMatrix"&&U.instanceMatrix&&(q=U.instanceMatrix),j==="instanceColor"&&U.instanceColor&&(q=U.instanceColor)),q!==void 0){const J=q.normalized,be=q.itemSize,Me=e.get(q);if(Me===void 0)continue;const Ce=Me.buffer,ke=Me.type,Ne=Me.bytesPerElement,V=ke===i.INT||ke===i.UNSIGNED_INT||q.gpuType===Io;if(q.isInterleavedBufferAttribute){const ee=q.data,ge=ee.stride,Oe=q.offset;if(ee.isInstancedInterleavedBuffer){for(let Se=0;Se<K.locationSize;Se++)d(K.location+Se,ee.meshPerAttribute);U.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Se=0;Se<K.locationSize;Se++)f(K.location+Se);i.bindBuffer(i.ARRAY_BUFFER,Ce);for(let Se=0;Se<K.locationSize;Se++)w(K.location+Se,be/K.locationSize,ke,J,ge*Ne,(Oe+be/K.locationSize*Se)*Ne,V)}else{if(q.isInstancedBufferAttribute){for(let ee=0;ee<K.locationSize;ee++)d(K.location+ee,q.meshPerAttribute);U.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let ee=0;ee<K.locationSize;ee++)f(K.location+ee);i.bindBuffer(i.ARRAY_BUFFER,Ce);for(let ee=0;ee<K.locationSize;ee++)w(K.location+ee,be/K.locationSize,ke,J,be*Ne,be/K.locationSize*ee*Ne,V)}}else if(G!==void 0){const J=G[j];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(K.location,J);break;case 3:i.vertexAttrib3fv(K.location,J);break;case 4:i.vertexAttrib4fv(K.location,J);break;default:i.vertexAttrib1fv(K.location,J)}}}}E()}function M(){A();for(const U in n){const N=n[U];for(const z in N){const P=N[z];for(const O in P){const B=P[O];for(const G in B)u(B[G].object),delete B[G];delete P[O]}}delete n[U]}}function T(U){if(n[U.id]===void 0)return;const N=n[U.id];for(const z in N){const P=N[z];for(const O in P){const B=P[O];for(const G in B)u(B[G].object),delete B[G];delete P[O]}}delete n[U.id]}function C(U){for(const N in n){const z=n[N];for(const P in z){const O=z[P];if(O[U.id]===void 0)continue;const B=O[U.id];for(const G in B)u(B[G].object),delete B[G];delete O[U.id]}}}function x(U){for(const N in n){const z=n[N],P=U.isInstancedMesh===!0?U.id:0,O=z[P];if(O!==void 0){for(const B in O){const G=O[B];for(const j in G)u(G[j].object),delete G[j];delete O[B]}delete z[P],Object.keys(z).length===0&&delete n[N]}}}function A(){L(),a=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:L,dispose:M,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:f,disableUnusedAttributes:E}}function Qg(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let p=0;p<u;p++)h+=c[p];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function e_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==un&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const x=C===Mn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Jt&&C!==_n&&!x&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Fe("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const m=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Fe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),f=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:m,reversedDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:f,maxAttributes:d,maxVertexUniforms:E,maxVaryings:w,maxFragmentUniforms:v,maxSamples:M,samples:T}}function t_(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Pn,o=new Be,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(m,h){const p=m.length!==0||h||n!==0||s;return s=h,n=m.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(m,h){t=u(m,h,0)},this.setState=function(m,h,p){const g=m.clippingPlanes,y=m.clipIntersection,f=m.clipShadows,d=i.get(m);if(!s||g===null||g.length===0||r&&!f)r?u(null):c();else{const E=r?0:n,w=E*4;let v=d.clippingState||null;l.value=v,v=u(g,h,w,p);for(let M=0;M!==w;++M)v[M]=t[M];d.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(m,h,p,g){const y=m!==null?m.length:0;let f=null;if(y!==0){if(f=l.value,g!==!0||f===null){const d=p+y*4,E=h.matrixWorldInverse;o.getNormalMatrix(E),(f===null||f.length<d)&&(f=new Float32Array(d));for(let w=0,v=p;w!==y;++w,v+=4)a.copy(m[w]).applyMatrix4(E,o),a.normal.toArray(f,v),f[v+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,f}}const Vi=4,n_=6,i_=20,s_=256,hs=new nl,iu=new He;let Pa=null,La=0,Da=0,Na=!1;const r_=new D,ri=new D;class su{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=r_}=r;Pa=this._renderer.getRenderTarget(),La=this._renderer.getActiveCubeFace(),Da=this._renderer.getActiveMipmapLevel(),Na=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ou(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=au(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Pa,La,Da),this._renderer.xr.enabled=Na,e.scissorTest=!1,Bi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ui||e.mapping===Yi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Pa=this._renderer.getRenderTarget(),La=this._renderer.getActiveCubeFace(),Da=this._renderer.getActiveMipmapLevel(),Na=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ot,minFilter:Ot,generateMipmaps:!1,type:Mn,format:un,colorSpace:Cr,depthBuffer:!1},s=ru(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ru(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=a_(r)),this._blurMaterial=l_(r,e,t),this._ggxMaterial=o_(r,e,t)}return s}_compileMaterial(e){const t=new Gt(new Dt,e);this._renderer.compile(t,hs)}_sceneToCubeUV(e,t,n,s,r){const l=new jt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],m=this._renderer,h=m.autoClear,p=m.toneMapping;m.getClearColor(iu),m.toneMapping=Sn,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(s),m.clearDepth(),m.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Gt(new di,new $o({name:"PMREM.Background",side:Kt,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,f=y.material;let d=!1;const E=e.background;E?E.isColor&&(f.color.copy(E),e.background=null,d=!0):(f.color.copy(iu),d=!0);for(let w=0;w<6;w++){const v=w%3;v===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[w],r.y,r.z)):v===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[w]));const M=this._cubeSize;Bi(s,v*M,w>2?M:0,M,M),m.setRenderTarget(s),d&&m.render(y,l),m.render(e,l)}m.toneMapping=p,m.autoClear=h,e.background=E}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ui||e.mapping===Yi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ou()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=au());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Bi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,hs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),m=Math.sqrt(c*c-u*u),h=c*1.25,p=m*h,{_lodMax:g}=this,y=this._sizeLods[n],f=3*y*(n>g-Vi?n-g+Vi:0),d=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,Bi(r,f,d,3*y,2*y),s.setRenderTarget(r),s.render(o,hs),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Bi(e,f,d,3*y,2*y),s.setRenderTarget(e),s.render(o,hs)}_blur(e,t,n,s){const r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;const u=this._sizeLods[s],m=3*u*(s>this._lodMax-Vi?s-this._lodMax+Vi:0),h=4*(this._cubeSize-u);Bi(t,m,h,3*u,2*u),a.setRenderTarget(t),a.render(l,hs)}}function a_(i){const e=[],t=[];let n=i;const s=i-Vi+1+n_;for(let r=0;r<s;r++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],m=6,h=6,p=3,g=new Float32Array(p*h*m),y=new Float32Array(p*h*m);for(let d=0;d<m;d++){const E=d%3*2/3-1,w=d>2?0:-1,v=[E,w,0,E+2/3,w,0,E+2/3,w+1,0,E,w,0,E+2/3,w+1,0,E,w+1,0];g.set(v,p*h*d);for(let M=0;M<h;M++){const T=u[M*2]*2-1,C=u[M*2+1]*2-1;d===0?ri.set(1,C,T):d===1?ri.set(-T,1,-C):d===2?ri.set(-T,C,1):d===3?ri.set(-1,C,-T):d===4?ri.set(-T,-1,C):ri.set(T,C,-1),ri.toArray(y,(d*h+M)*p)}}const f=new Dt;f.setAttribute("position",new yn(g,p)),f.setAttribute("outputDirection",new yn(y,p)),t.push(new Gt(f,null)),n>Vi&&n--}return{lodMeshes:t,sizeLods:e}}function ru(i,e,t){const n=new hn(i,e,t);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Bi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function o_(i,e,t){return new En({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:s_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:zr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function l_(i,e,t){return new En({name:"SphericalGaussianBlur",defines:{SAMPLES:i_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:zr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function au(){return new En({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:zr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function ou(){return new En({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:zr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function zr(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class xh extends hn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new lh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new di(5,5,5),r=new En({name:"CubemapFromEquirect",uniforms:qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Kt,blending:Nn});r.uniforms.tEquirect.value=t;const a=new Gt(s,r),o=t.minFilter;return t.minFilter===oi&&(t.minFilter=Ot),new um(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function c_(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,p=!1){return h==null?null:p?a(h):r(h)}function r(h){if(h&&h.isTexture){const p=h.mapping;if(p===Qr||p===ea)if(e.has(h)){const g=e.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const y=new xh(g.height);return y.fromEquirectangularTexture(i,h),e.set(h,y),h.addEventListener("dispose",c),o(y.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const p=h.mapping,g=p===Qr||p===ea,y=p===ui||p===Yi;if(g||y){let f=t.get(h);const d=f!==void 0?f.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==d)return n===null&&(n=new su(i)),f=g?n.fromEquirectangular(h,f):n.fromCubemap(h,f),f.texture.pmremVersion=h.pmremVersion,t.set(h,f),f.texture;if(f!==void 0)return f.texture;{const E=h.image;return g&&E&&E.height>0||y&&E&&l(E)?(n===null&&(n=new su(i)),f=g?n.fromEquirectangular(h):n.fromCubemap(h),f.texture.pmremVersion=h.pmremVersion,t.set(h,f),h.addEventListener("dispose",u),f.texture):null}}}return h}function o(h,p){return p===Qr?h.mapping=ui:p===ea&&(h.mapping=Yi),h}function l(h){let p=0;const g=6;for(let y=0;y<g;y++)h[y]!==void 0&&p++;return p===g}function c(h){const p=h.target;p.removeEventListener("dispose",c);const g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function u(h){const p=h.target;p.removeEventListener("dispose",u);const g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function m(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:m}}function u_(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Xi("WebGLRenderer: "+n+" extension not supported."),s}}}function h_(i,e,t,n){const s={},r=new WeakMap;function a(m){const h=m.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];const p=r.get(h);p&&(e.remove(p),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(m,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(m){const h=m.attributes;for(const p in h)e.update(h[p],i.ARRAY_BUFFER)}function c(m){const h=[],p=m.index,g=m.attributes.position;let y=0;if(g===void 0)return;if(p!==null){const E=p.array;y=p.version;for(let w=0,v=E.length;w<v;w+=3){const M=E[w+0],T=E[w+1],C=E[w+2];h.push(M,T,T,C,C,M)}}else{const E=g.array;y=g.version;for(let w=0,v=E.length/3-1;w<v;w+=3){const M=w+0,T=w+1,C=w+2;h.push(M,T,T,C,C,M)}}const f=new(g.count>=65535?rh:sh)(h,1);f.version=y;const d=r.get(m);d&&e.remove(d),r.set(m,f)}function u(m){const h=r.get(m);if(h){const p=m.index;p!==null&&h.version<p.version&&c(m)}else c(m);return r.get(m)}return{get:o,update:l,getWireframeAttribute:u}}function d_(i,e,t){let n;function s(m){n=m}let r,a;function o(m){r=m.type,a=m.bytesPerElement}function l(m,h){i.drawElements(n,h,r,m*a),t.update(h,n,1)}function c(m,h,p){p!==0&&(i.drawElementsInstanced(n,h,r,m*a,p),t.update(h,n,p))}function u(m,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,m,0,p);let y=0;for(let f=0;f<p;f++)y+=h[f];t.update(y,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function f_(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ze("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function p_(i,e,t){const n=new WeakMap,s=new _t;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,m=u!==void 0?u.length:0;let h=n.get(o);if(h===void 0||h.count!==m){let A=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();const p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let w=0;p===!0&&(w=1),g===!0&&(w=2),y===!0&&(w=3);let v=o.attributes.position.count*w,M=1;v>e.maxTextureSize&&(M=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const T=new Float32Array(v*M*4*m),C=new th(T,v,M,m);C.type=_n,C.needsUpdate=!0;const x=w*4;for(let L=0;L<m;L++){const U=f[L],N=d[L],z=E[L],P=v*M*4*L;for(let O=0;O<U.count;O++){const B=O*x;p===!0&&(s.fromBufferAttribute(U,O),T[P+B+0]=s.x,T[P+B+1]=s.y,T[P+B+2]=s.z,T[P+B+3]=0),g===!0&&(s.fromBufferAttribute(N,O),T[P+B+4]=s.x,T[P+B+5]=s.y,T[P+B+6]=s.z,T[P+B+7]=0),y===!0&&(s.fromBufferAttribute(z,O),T[P+B+8]=s.x,T[P+B+9]=s.y,T[P+B+10]=s.z,T[P+B+11]=z.itemSize===4?s.w:1)}}h={count:m,texture:C,size:new xe(v,M)},n.set(o,h),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let y=0;y<c.length;y++)p+=c[y];const g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function m_(i,e,t,n,s){let r=new WeakMap;function a(c){const u=s.render.frame,m=c.geometry,h=e.get(c,m);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const p=c.skeleton;r.get(p)!==u&&(p.update(),r.set(p,u))}return h}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const g_={[ku]:"LINEAR_TONE_MAPPING",[Bu]:"REINHARD_TONE_MAPPING",[zu]:"CINEON_TONE_MAPPING",[Hu]:"ACES_FILMIC_TONE_MAPPING",[Vu]:"AGX_TONE_MAPPING",[Wu]:"NEUTRAL_TONE_MAPPING",[Gu]:"CUSTOM_TONE_MAPPING"};function __(i,e,t,n,s,r){const a=new hn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new Dt;c.setAttribute("position",new ht([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ht([0,2,0,0,2,0],2));const u=new nm({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),m=new Gt(c,u),h=new nl(-1,1,1,-1,0,1);let p=null,g=null,y=!1,f,d=null,E=[],w=!1;this.setSize=function(v,M){a.setSize(v,M),o!==null&&o.setSize(v,M),l!==null&&l.setSize(v,M);for(let T=0;T<E.length;T++){const C=E[T];C.setSize&&C.setSize(v,M)}},this.setEffects=function(v){E=v,w=E.length>0&&E[0].isRenderPass===!0;const M=a.width,T=a.height;E.length>0&&o===null&&(o=new hn(M,T,{type:Mn,depthBuffer:!1,stencilBuffer:!1}),l=new hn(M,T,{type:Mn,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<E.length;C++){const x=E[C];x.setSize&&x.setSize(M,T)}},this.begin=function(v,M){if(y||v.toneMapping===Sn&&E.length===0)return!1;if(d=M,M!==null){const T=M.width,C=M.height;(a.width!==T||a.height!==C)&&this.setSize(T,C)}return w===!1&&v.setRenderTarget(a),f=v.toneMapping,v.toneMapping=Sn,!0},this.hasRenderPass=function(){return w},this.end=function(v,M){v.toneMapping=f,y=!0;let T=a,C=o;for(let x=0;x<E.length;x++){const A=E[x];A.enabled!==!1&&(A.render(v,C,T,M),A.needsSwap!==!1&&(T=C,C=C===o?l:o))}if(p!==v.outputColorSpace||g!==v.toneMapping){p=v.outputColorSpace,g=v.toneMapping,u.defines={},qe.getTransfer(p)===it&&(u.defines.SRGB_TRANSFER="");const x=g_[g];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(d),v.render(m,h),d=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}const vh=new kt,Lo=new Rs(1,1),Sh=new th,yh=new mp,bh=new lh,lu=[],cu=[],uu=new Float32Array(16),hu=new Float32Array(9),du=new Float32Array(4);function ji(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=lu[s];if(r===void 0&&(r=new Float32Array(s),lu[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function At(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Hr(i,e){let t=cu[e];t===void 0&&(t=new Int32Array(e),cu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function x_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function v_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2fv(this.addr,e),wt(t,e)}}function S_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(At(t,e))return;i.uniform3fv(this.addr,e),wt(t,e)}}function y_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4fv(this.addr,e),wt(t,e)}}function b_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(At(t,n))return;du.set(n),i.uniformMatrix2fv(this.addr,!1,du),wt(t,n)}}function M_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(At(t,n))return;hu.set(n),i.uniformMatrix3fv(this.addr,!1,hu),wt(t,n)}}function E_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(At(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(At(t,n))return;uu.set(n),i.uniformMatrix4fv(this.addr,!1,uu),wt(t,n)}}function T_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function A_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2iv(this.addr,e),wt(t,e)}}function w_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3iv(this.addr,e),wt(t,e)}}function R_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4iv(this.addr,e),wt(t,e)}}function C_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function P_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(At(t,e))return;i.uniform2uiv(this.addr,e),wt(t,e)}}function L_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(At(t,e))return;i.uniform3uiv(this.addr,e),wt(t,e)}}function D_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(At(t,e))return;i.uniform4uiv(this.addr,e),wt(t,e)}}function N_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Lo.compareFunction=t.isReversedDepthBuffer()?Go:Ho,r=Lo):r=vh,t.setTexture2D(e||r,s)}function U_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||yh,s)}function I_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||bh,s)}function F_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Sh,s)}function O_(i){switch(i){case 5126:return x_;case 35664:return v_;case 35665:return S_;case 35666:return y_;case 35674:return b_;case 35675:return M_;case 35676:return E_;case 5124:case 35670:return T_;case 35667:case 35671:return A_;case 35668:case 35672:return w_;case 35669:case 35673:return R_;case 5125:return C_;case 36294:return P_;case 36295:return L_;case 36296:return D_;case 35678:case 36198:case 36298:case 36306:case 35682:return N_;case 35679:case 36299:case 36307:return U_;case 35680:case 36300:case 36308:case 36293:return I_;case 36289:case 36303:case 36311:case 36292:return F_}}function k_(i,e){i.uniform1fv(this.addr,e)}function B_(i,e){const t=ji(e,this.size,2);i.uniform2fv(this.addr,t)}function z_(i,e){const t=ji(e,this.size,3);i.uniform3fv(this.addr,t)}function H_(i,e){const t=ji(e,this.size,4);i.uniform4fv(this.addr,t)}function G_(i,e){const t=ji(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function V_(i,e){const t=ji(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function W_(i,e){const t=ji(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function X_(i,e){i.uniform1iv(this.addr,e)}function $_(i,e){i.uniform2iv(this.addr,e)}function K_(i,e){i.uniform3iv(this.addr,e)}function Y_(i,e){i.uniform4iv(this.addr,e)}function q_(i,e){i.uniform1uiv(this.addr,e)}function j_(i,e){i.uniform2uiv(this.addr,e)}function Z_(i,e){i.uniform3uiv(this.addr,e)}function J_(i,e){i.uniform4uiv(this.addr,e)}function Q_(i,e,t){const n=this.cache,s=e.length,r=Hr(t,s);At(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Lo:a=vh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function ex(i,e,t){const n=this.cache,s=e.length,r=Hr(t,s);At(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||yh,r[a])}function tx(i,e,t){const n=this.cache,s=e.length,r=Hr(t,s);At(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||bh,r[a])}function nx(i,e,t){const n=this.cache,s=e.length,r=Hr(t,s);At(n,r)||(i.uniform1iv(this.addr,r),wt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Sh,r[a])}function ix(i){switch(i){case 5126:return k_;case 35664:return B_;case 35665:return z_;case 35666:return H_;case 35674:return G_;case 35675:return V_;case 35676:return W_;case 5124:case 35670:return X_;case 35667:case 35671:return $_;case 35668:case 35672:return K_;case 35669:case 35673:return Y_;case 5125:return q_;case 36294:return j_;case 36295:return Z_;case 36296:return J_;case 35678:case 36198:case 36298:case 36306:case 35682:return Q_;case 35679:case 36299:case 36307:return ex;case 35680:case 36300:case 36308:case 36293:return tx;case 36289:case 36303:case 36311:case 36292:return nx}}class sx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=O_(t.type)}}class rx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ix(t.type)}}class ax{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Ua=/(\w+)(\])?(\[|\.)?/g;function fu(i,e){i.seq.push(e),i.map[e.id]=e}function ox(i,e,t){const n=i.name,s=n.length;for(Ua.lastIndex=0;;){const r=Ua.exec(n),a=Ua.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){fu(t,c===void 0?new sx(o,i,e):new rx(o,i,e));break}else{let m=t.map[o];m===void 0&&(m=new ax(o),fu(t,m)),t=m}}}class Tr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);ox(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function pu(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const lx=37297;let cx=0;function ux(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const mu=new Be;function hx(i){qe._getMatrix(mu,qe.workingColorSpace,i);const e=`mat3( ${mu.elements.map(t=>t.toFixed(4))} )`;switch(qe.getTransfer(i)){case Pr:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Fe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function gu(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+ux(i.getShaderSource(e),o)}else return r}function dx(i,e){const t=hx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const fx={[ku]:"Linear",[Bu]:"Reinhard",[zu]:"Cineon",[Hu]:"ACESFilmic",[Vu]:"AgX",[Wu]:"Neutral",[Gu]:"Custom"};function px(i,e){const t=fx[e];return t===void 0?(Fe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const pr=new D;function mx(){qe.getLuminanceCoefficients(pr);const i=pr.x.toFixed(4),e=pr.y.toFixed(4),t=pr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function gx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(gs).join(`
`)}function _x(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function xx(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function gs(i){return i!==""}function _u(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function xu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const vx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Do(i){return i.replace(vx,yx)}const Sx=new Map;function yx(i,e){let t=Ve[e];if(t===void 0){const n=Sx.get(e);if(n!==void 0)t=Ve[n],Fe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Do(t)}const bx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vu(i){return i.replace(bx,Mx)}function Mx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Su(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Ex={[xr]:"SHADOWMAP_TYPE_PCF",[ms]:"SHADOWMAP_TYPE_VSM"};function Tx(i){return Ex[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Ax={[ui]:"ENVMAP_TYPE_CUBE",[Yi]:"ENVMAP_TYPE_CUBE",[Or]:"ENVMAP_TYPE_CUBE_UV"};function wx(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Ax[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Rx={[Yi]:"ENVMAP_MODE_REFRACTION"};function Cx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Rx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Px={[Ou]:"ENVMAP_BLENDING_MULTIPLY",[Df]:"ENVMAP_BLENDING_MIX",[Nf]:"ENVMAP_BLENDING_ADD"};function Lx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Px[i.combine]||"ENVMAP_BLENDING_NONE"}function Dx(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Nx(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Tx(t),c=wx(t),u=Cx(t),m=Lx(t),h=Dx(t),p=gx(t),g=_x(r),y=s.createProgram();let f,d,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(gs).join(`
`),f.length>0&&(f+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(gs).join(`
`),d.length>0&&(d+=`
`)):(f=[Su(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(gs).join(`
`),d=[Su(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+m:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Sn?"#define TONE_MAPPING":"",t.toneMapping!==Sn?Ve.tonemapping_pars_fragment:"",t.toneMapping!==Sn?px("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,dx("linearToOutputTexel",t.outputColorSpace),mx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(gs).join(`
`)),a=Do(a),a=_u(a,t),a=xu(a,t),o=Do(o),o=_u(o,t),o=xu(o,t),a=vu(a),o=vu(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,d=["#define varying in",t.glslVersion===Sc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Sc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const w=E+f+a,v=E+d+o,M=pu(s,s.VERTEX_SHADER,w),T=pu(s,s.FRAGMENT_SHADER,v);s.attachShader(y,M),s.attachShader(y,T),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function C(U){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(y)||"",z=s.getShaderInfoLog(M)||"",P=s.getShaderInfoLog(T)||"",O=N.trim(),B=z.trim(),G=P.trim();let j=!0,K=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,M,T);else{const q=gu(s,M,"vertex"),J=gu(s,T,"fragment");Ze("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+O+`
`+q+`
`+J)}else O!==""?Fe("WebGLProgram: Program Info Log:",O):(B===""||G==="")&&(K=!1);K&&(U.diagnostics={runnable:j,programLog:O,vertexShader:{log:B,prefix:f},fragmentShader:{log:G,prefix:d}})}s.deleteShader(M),s.deleteShader(T),x=new Tr(s,y),A=xx(s,y)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(y,lx)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=cx++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=M,this.fragmentShader=T,this}let Ux=0;class Ix{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Fx(e),t.set(e,n)),n}}class Fx{constructor(e){this.id=Ux++,this.code=e,this.usedTimes=0}}function Ox(i){return i===hi||i===wr||i===Rr}function kx(i,e,t,n,s,r){const a=new nh,o=new Ix,l=new Set,c=[],u=new Map,m=n.logarithmicDepthBuffer;let h=n.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function y(x,A,L,U,N,z){const P=U.fog,O=N.geometry,B=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?U.environment:null,G=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,j=e.get(x.envMap||B,G),K=j&&j.mapping===Or?j.image.height:null,q=p[x.type];x.precision!==null&&(h=n.getMaxPrecision(x.precision),h!==x.precision&&Fe("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));const J=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,be=J!==void 0?J.length:0;let Me=0;O.morphAttributes.position!==void 0&&(Me=1),O.morphAttributes.normal!==void 0&&(Me=2),O.morphAttributes.color!==void 0&&(Me=3);let Ce,ke,Ne,V;if(q){const ct=gn[q];Ce=ct.vertexShader,ke=ct.fragmentShader}else{Ce=x.vertexShader,ke=x.fragmentShader;const ct=o.getVertexShaderStage(x),et=o.getFragmentShaderStage(x);o.update(x,ct,et),Ne=ct.id,V=et.id}const ee=i.getRenderTarget(),ge=i.state.buffers.depth.getReversed(),Oe=N.isInstancedMesh===!0,Se=N.isBatchedMesh===!0,Xe=!!x.map,Et=!!x.matcap,$e=!!j,Je=!!x.aoMap,lt=!!x.lightMap,Ye=!!x.bumpMap&&x.wireframe===!1,pt=!!x.normalMap,Rt=!!x.displacementMap,Vt=!!x.emissiveMap,gt=!!x.metalnessMap,St=!!x.roughnessMap,k=x.anisotropy>0,Nt=x.clearcoat>0,nt=x.dispersion>0,R=x.retroreflectivity>0,_=x.iridescence>0,H=x.sheen>0,$=x.transmission>0,Z=k&&!!x.anisotropyMap,re=Nt&&!!x.clearcoatMap,oe=Nt&&!!x.clearcoatNormalMap,Q=Nt&&!!x.clearcoatRoughnessMap,ne=_&&!!x.iridescenceMap,le=_&&!!x.iridescenceThicknessMap,Pe=H&&!!x.sheenColorMap,de=H&&!!x.sheenRoughnessMap,ce=!!x.specularMap,Le=!!x.specularColorMap,Ie=!!x.specularIntensityMap,ze=$&&!!x.transmissionMap,F=$&&!!x.thicknessMap,ue=!!x.gradientMap,te=!!x.alphaMap,he=x.alphaTest>0,_e=!!x.alphaHash,ie=!!x.extensions;let De=Sn;x.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(De=i.toneMapping);const we={shaderID:q,shaderType:x.type,shaderName:x.name,vertexShader:Ce,fragmentShader:ke,defines:x.defines,customVertexShaderID:Ne,customFragmentShaderID:V,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:Se,batchingColor:Se&&N._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&N.instanceColor!==null,instancingMorph:Oe&&N.morphTexture!==null,outputColorSpace:ee===null?i.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:qe.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Xe,matcap:Et,envMap:$e,envMapMode:$e&&j.mapping,envMapCubeUVHeight:K,aoMap:Je,lightMap:lt,bumpMap:Ye,normalMap:pt,displacementMap:Rt,emissiveMap:Vt,normalMapObjectSpace:pt&&x.normalMapType===Ff,normalMapTangentSpace:pt&&x.normalMapType===Po,packedNormalMap:pt&&x.normalMapType===Po&&Ox(x.normalMap.format),metalnessMap:gt,roughnessMap:St,anisotropy:k,anisotropyMap:Z,clearcoat:Nt,clearcoatMap:re,clearcoatNormalMap:oe,clearcoatRoughnessMap:Q,dispersion:nt,retroreflection:R,iridescence:_,iridescenceMap:ne,iridescenceThicknessMap:le,sheen:H,sheenColorMap:Pe,sheenRoughnessMap:de,specularMap:ce,specularColorMap:Le,specularIntensityMap:Ie,transmission:$,transmissionMap:ze,thicknessMap:F,gradientMap:ue,opaque:x.transparent===!1&&x.blending===xs&&x.alphaToCoverage===!1,alphaMap:te,alphaTest:he,alphaHash:_e,combine:x.combine,mapUv:Xe&&g(x.map.channel),aoMapUv:Je&&g(x.aoMap.channel),lightMapUv:lt&&g(x.lightMap.channel),bumpMapUv:Ye&&g(x.bumpMap.channel),normalMapUv:pt&&g(x.normalMap.channel),displacementMapUv:Rt&&g(x.displacementMap.channel),emissiveMapUv:Vt&&g(x.emissiveMap.channel),metalnessMapUv:gt&&g(x.metalnessMap.channel),roughnessMapUv:St&&g(x.roughnessMap.channel),anisotropyMapUv:Z&&g(x.anisotropyMap.channel),clearcoatMapUv:re&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:oe&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:le&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Pe&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:de&&g(x.sheenRoughnessMap.channel),specularMapUv:ce&&g(x.specularMap.channel),specularColorMapUv:Le&&g(x.specularColorMap.channel),specularIntensityMapUv:Ie&&g(x.specularIntensityMap.channel),transmissionMapUv:ze&&g(x.transmissionMap.channel),thicknessMapUv:F&&g(x.thicknessMap.channel),alphaMapUv:te&&g(x.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(pt||k),vertexNormals:!!O.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!O.attributes.uv&&(Xe||te),fog:!!P,useFog:x.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||O.attributes.normal===void 0&&pt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:ge,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:Me,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:De,decodeVideoTexture:Xe&&x.map.isVideoTexture===!0&&qe.getTransfer(x.map.colorSpace)===it,decodeVideoTextureEmissive:Vt&&x.emissiveMap.isVideoTexture===!0&&qe.getTransfer(x.emissiveMap.colorSpace)===it,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ln,flipSided:x.side===Kt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ie&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ie&&x.extensions.multiDraw===!0||Se)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return we.vertexUv1s=l.has(1),we.vertexUv2s=l.has(2),we.vertexUv3s=l.has(3),l.clear(),we}function f(x){const A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(const L in x.defines)A.push(L),A.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(d(A,x),E(A,x),A.push(i.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function d(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numSunLights),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numSunLightShadows),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function E(x,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function w(x){const A=p[x.type];let L;if(A){const U=gn[A];L=Qp.clone(U.uniforms)}else L=x.uniforms;return L}function v(x,A){let L=u.get(A);return L!==void 0?++L.usedTimes:(L=new Nx(i,A,x,s),c.push(L),u.set(A,L)),L}function M(x){if(--x.usedTimes===0){const A=c.indexOf(x);c[A]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function C(){o.dispose()}return{getParameters:y,getProgramCacheKey:f,getUniforms:w,acquireProgram:v,releaseProgram:M,releaseShaderCache:T,programs:c,dispose:C}}function Bx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function zx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function yu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function bu(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let p=0;return h.isInstancedMesh&&(p+=2),h.isSkinnedMesh&&(p+=1),p}function o(h,p,g,y,f,d){let E=i[e];return E===void 0?(E={id:h.id,object:h,geometry:p,material:g,materialVariant:a(h),groupOrder:y,renderOrder:h.renderOrder,z:f,group:d},i[e]=E):(E.id=h.id,E.object=h,E.geometry=p,E.material=g,E.materialVariant=a(h),E.groupOrder=y,E.renderOrder=h.renderOrder,E.z=f,E.group=d),e++,E}function l(h,p,g,y,f,d,E){E.reversedDepth===!0&&(f=-f);const w=o(h,p,g,y,f,d);g.transmission>0?n.push(w):g.transparent===!0?s.push(w):t.push(w)}function c(h,p,g,y,f,d){const E=o(h,p,g,y,f,d);g.transmission>0?n.unshift(E):g.transparent===!0?s.unshift(E):t.unshift(E)}function u(h,p){t.length>1&&t.sort(h||zx),n.length>1&&n.sort(p||yu),s.length>1&&s.sort(p||yu)}function m(){for(let h=e,p=i.length;h<p;h++){const g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:m,sort:u}}function Hx(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new bu,i.set(n,[a])):s>=r.length?(a=new bu,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Gx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new D,color:new He};break;case"SpotLight":t={position:new D,direction:new D,color:new He,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new He,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new He,groundColor:new He};break;case"RectAreaLight":t={color:new He,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function Vx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Wx=0;function Xx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function $x(i){const e=new Gx,t=Vx(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new ft,a=new ft;function o(c){let u=0,m=0,h=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let p=0,g=0,y=0,f=0,d=0,E=0,w=0,v=0,M=0,T=0,C=0,x=0,A=0,L=0;c.sort(Xx);for(let N=0,z=c.length;N<z;N++){const P=c[N],O=P.color,B=P.intensity,G=P.distance;let j=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===hi?j=P.shadow.map.texture:j=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=O.r*B,m+=O.g*B,h+=O.b*B;else if(P.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(P.sh.coefficients[K],B);L++}else if(P.isSunLight){const K=e.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const q=P.shadow,J=t.get(P);J.shadowIntensity=q.intensity,J.shadowBias=q.bias,J.shadowNormalBias=q.normalBias,J.shadowRadius=q.radius,J.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),n.sunShadow[g]=J,n.sunShadowMap[g]=j;const be=q.getViewportCount();for(let Me=0;Me<be;Me++)n.sunShadowMatrix[y+Me]=q.getMatrix(Me),n.sunShadowCascade[y+Me]=q._cascadeData[Me];y+=be,g++}n.sun[p]=K,p++}else if(P.isDirectionalLight){const K=e.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const q=P.shadow,J=t.get(P);J.shadowIntensity=q.intensity,J.shadowBias=q.bias,J.shadowNormalBias=q.normalBias,J.shadowRadius=q.radius,J.shadowMapSize=q.mapSize,n.directionalShadow[f]=J,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=P.shadow.matrix,M++}n.directional[f]=K,f++}else if(P.isSpotLight){const K=e.get(P);K.position.setFromMatrixPosition(P.matrixWorld),K.color.copy(O).multiplyScalar(B),K.distance=G,K.coneCos=Math.cos(P.angle),K.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),K.decay=P.decay,n.spot[E]=K;const q=P.shadow;if(P.map&&(n.spotLightMap[x]=P.map,x++,q.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[E]=q.matrix,P.castShadow){const J=t.get(P);J.shadowIntensity=q.intensity,J.shadowBias=q.bias,J.shadowNormalBias=q.normalBias,J.shadowRadius=q.radius,J.shadowMapSize=q.mapSize,n.spotShadow[E]=J,n.spotShadowMap[E]=j,C++}E++}else if(P.isRectAreaLight){const K=e.get(P);K.color.copy(O).multiplyScalar(B),K.halfWidth.set(P.width*.5,0,0),K.halfHeight.set(0,P.height*.5,0),n.rectArea[w]=K,w++}else if(P.isPointLight){const K=e.get(P);if(K.color.copy(P.color).multiplyScalar(P.intensity),K.distance=P.distance,K.decay=P.decay,P.castShadow){const q=P.shadow,J=t.get(P);J.shadowIntensity=q.intensity,J.shadowBias=q.bias,J.shadowNormalBias=q.normalBias,J.shadowRadius=q.radius,J.shadowMapSize=q.mapSize,J.shadowCameraNear=q.camera.near,J.shadowCameraFar=q.camera.far,n.pointShadow[d]=J,n.pointShadowMap[d]=j,n.pointShadowMatrix[d]=P.shadow.matrix,T++}n.point[d]=K,d++}else if(P.isHemisphereLight){const K=e.get(P);K.skyColor.copy(P.color).multiplyScalar(B),K.groundColor.copy(P.groundColor).multiplyScalar(B),n.hemi[v]=K,v++}}w>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=m,n.ambient[2]=h;const U=n.hash;(U.sunLength!==p||U.directionalLength!==f||U.pointLength!==d||U.spotLength!==E||U.rectAreaLength!==w||U.hemiLength!==v||U.numSunShadows!==g||U.numDirectionalShadows!==M||U.numPointShadows!==T||U.numSpotShadows!==C||U.numSpotMaps!==x||U.numLightProbes!==L)&&(n.sun.length=p,n.directional.length=f,n.spot.length=E,n.rectArea.length=w,n.point.length=d,n.hemi.length=v,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.directionalShadowMatrix.length=M,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+x-A,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=L,U.sunLength=p,U.directionalLength=f,U.pointLength=d,U.spotLength=E,U.rectAreaLength=w,U.hemiLength=v,U.numSunShadows=g,U.numDirectionalShadows=M,U.numPointShadows=T,U.numSpotShadows=C,U.numSpotMaps=x,U.numLightProbes=L,n.version=Wx++)}function l(c,u){let m=0,h=0,p=0,g=0,y=0,f=0;const d=u.matrixWorldInverse;for(let E=0,w=c.length;E<w;E++){const v=c[E];if(v.isSunLight){const M=n.sun[m];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(d),m++}else if(v.isDirectionalLight){const M=n.directional[h];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(d),h++}else if(v.isSpotLight){const M=n.spot[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(d),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(d),g++}else if(v.isRectAreaLight){const M=n.rectArea[y];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(d),a.identity(),r.copy(v.matrixWorld),r.premultiply(d),a.extractRotation(r),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),y++}else if(v.isPointLight){const M=n.point[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(d),p++}else if(v.isHemisphereLight){const M=n.hemi[f];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(d),f++}}}return{setup:o,setupView:l,state:n}}function Mu(i){const e=new $x(i),t=[],n=[],s=[];function r(h){m.camera=h,t.length=0,n.length=0,s.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}const m={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:m,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Kx(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Mu(i),e.set(s,[o])):r>=a.length?(o=new Mu(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Yx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,jx=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],Zx=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],Eu=new ft,ds=new D,Ia=new D;function Jx(i,e,t){let n=new Ko;const s=new xe,r=new xe,a=new _t,o=new im,l=new sm,c={},u=t.maxTextureSize,m={[ci]:Kt,[Kt]:ci,[Ln]:Ln},h=new En({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xe},radius:{value:4}},vertexShader:Yx,fragmentShader:qx}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new Dt;g.setAttribute("position",new yn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Gt(g,h),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xr;let d=this.type;this.render=function(T,C,x){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||T.length===0)return;this.type===Uu&&(Fe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=xr);const A=i.getRenderTarget(),L=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),N=i.state;N.setBlending(Nn),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const z=d!==this.type;z&&C.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(O=>O.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,O=T.length;P<O;P++){const B=T[P],G=B.shadow;if(G===void 0){Fe("WebGLShadowMap:",B,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const j=G.getFrameExtents();s.multiply(j),r.copy(G.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/j.x),s.x=r.x*j.x,G.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/j.y),s.y=r.y*j.y,G.mapSize.y=r.y));const K=i.state.buffers.depth.getReversed();if(G.camera._reversedDepth=K,G.map===null||z===!0){if(G.map!==null&&(G.map.depthTexture!==null&&(G.map.depthTexture.dispose(),G.map.depthTexture=null),G.map.dispose()),this.type===ms){if(B.isPointLight){Fe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}G.map=new hn(s.x,s.y,{format:hi,type:Mn,minFilter:Ot,magFilter:Ot,generateMipmaps:!1}),G.map.texture.name=B.name+".shadowMap",G.map.depthTexture=new Rs(s.x,s.y,_n),G.map.depthTexture.name=B.name+".shadowMapDepth",G.map.depthTexture.format=On,G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=Lt,G.map.depthTexture.magFilter=Lt}else B.isPointLight?(G.map=new xh(s.x),G.map.depthTexture=new Fp(s.x,bn)):(G.map=new hn(s.x,s.y),G.map.depthTexture=new Rs(s.x,s.y,bn)),G.map.depthTexture.name=B.name+".shadowMap",G.map.depthTexture.format=On,this.type===xr?(G.map.depthTexture.compareFunction=K?Go:Ho,G.map.depthTexture.minFilter=Ot,G.map.depthTexture.magFilter=Ot):(G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=Lt,G.map.depthTexture.magFilter=Lt);G.camera.updateProjectionMatrix()}G.map.isWebGLCubeRenderTarget!==!0&&(G.map.width!==s.x||G.map.height!==s.y)&&G.map.setSize(s.x,s.y);const q=G.map.isWebGLCubeRenderTarget?6:G.getViewportCount();B.isPointLight!==!0&&G.updateMatrices(B,x);for(let J=0;J<q;J++){const be=G.getCamera(J);if(B.isPointLight){const Me=G.camera,Ce=G.matrix,ke=B.distance||Me.far;ke!==Me.far&&(Me.far=ke,Me.updateProjectionMatrix()),ds.setFromMatrixPosition(B.matrixWorld),Me.position.copy(ds),Ia.copy(Me.position),Ia.add(jx[J]),Me.up.copy(Zx[J]),Me.lookAt(Ia),Me.updateMatrixWorld(),Ce.makeTranslation(-ds.x,-ds.y,-ds.z),Eu.multiplyMatrices(Me.projectionMatrix,Me.matrixWorldInverse),G._frustum.setFromProjectionMatrix(Eu,Me.coordinateSystem,Me.reversedDepth)}if(G.map.isWebGLCubeRenderTarget)i.setRenderTarget(G.map,J),i.clear();else{J===0&&(i.setRenderTarget(G.map),i.clear());const Me=G.getViewport(J);a.set(r.x*Me.x,r.y*Me.y,r.x*Me.z,r.y*Me.w),N.viewport(a)}n=G.getFrustum(J),v(C,x,be,B,this.type)}G.isPointLightShadow!==!0&&this.type===ms&&E(G,x),G.needsUpdate=!1}d=this.type,f.needsUpdate=!1,i.setRenderTarget(A,L,U)};function E(T,C){const x=e.update(y);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null?T.mapPass=new hn(s.x,s.y,{format:hi,type:Mn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(C,null,x,h,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value.set(T.map.width,T.map.height),p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(C,null,x,p,y,null)}function w(T,C,x,A){let L=null;const U=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(U!==void 0)L=U;else if(L=x.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const N=L.uuid,z=C.uuid;let P=c[N];P===void 0&&(P={},c[N]=P);let O=P[z];O===void 0&&(O=L.clone(),P[z]=O,C.addEventListener("dispose",M)),L=O}if(L.visible=C.visible,L.wireframe=C.wireframe,A===ms?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:m[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,x.isPointLight===!0&&L.isMeshDistanceMaterial===!0){const N=i.properties.get(L);N.light=x}return L}function v(T,C,x,A,L){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&L===ms)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);const z=e.update(T),P=T.material;if(Array.isArray(P)){const O=z.groups;for(let B=0,G=O.length;B<G;B++){const j=O[B],K=P[j.materialIndex];if(K&&K.visible){const q=w(T,K,A,L);T.onBeforeShadow(i,T,C,x,z,q,j),i.renderBufferDirect(x,null,z,q,T,j),T.onAfterShadow(i,T,C,x,z,q,j)}}}else if(P.visible){const O=w(T,P,A,L);T.onBeforeShadow(i,T,C,x,z,O,null),i.renderBufferDirect(x,null,z,O,T,null),T.onAfterShadow(i,T,C,x,z,O,null)}}const N=T.children;for(let z=0,P=N.length;z<P;z++)v(N[z],C,x,A,L)}function M(T){T.target.removeEventListener("dispose",M);for(const x in c){const A=c[x],L=T.target.uuid;L in A&&(A[L].dispose(),delete A[L])}}}function Qx(i,e){function t(){let F=!1;const ue=new _t;let te=null;const he=new _t(0,0,0,0);return{setMask:function(_e){te!==_e&&!F&&(i.colorMask(_e,_e,_e,_e),te=_e)},setLocked:function(_e){F=_e},setClear:function(_e,ie,De,we,ct){ct===!0&&(_e*=we,ie*=we,De*=we),ue.set(_e,ie,De,we),he.equals(ue)===!1&&(i.clearColor(_e,ie,De,we),he.copy(ue))},reset:function(){F=!1,te=null,he.set(-1,0,0,0)}}}function n(){let F=!1,ue=!1,te=null,he=null,_e=null;return{setReversed:function(ie){if(ue!==ie){const De=e.get("EXT_clip_control");ie?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),ue=ie;const we=_e;_e=null,this.setClear(we)}},getReversed:function(){return ue},setTest:function(ie){ie?ee(i.DEPTH_TEST):ge(i.DEPTH_TEST)},setMask:function(ie){te!==ie&&!F&&(i.depthMask(ie),te=ie)},setFunc:function(ie){if(ue&&(ie=Kf[ie]),he!==ie){switch(ie){case Wa:i.depthFunc(i.NEVER);break;case Xa:i.depthFunc(i.ALWAYS);break;case $a:i.depthFunc(i.LESS);break;case Ms:i.depthFunc(i.LEQUAL);break;case Ka:i.depthFunc(i.EQUAL);break;case Ya:i.depthFunc(i.GEQUAL);break;case qa:i.depthFunc(i.GREATER);break;case ja:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}he=ie}},setLocked:function(ie){F=ie},setClear:function(ie){_e!==ie&&(_e=ie,ue&&(ie=1-ie),i.clearDepth(ie))},reset:function(){F=!1,te=null,he=null,_e=null,ue=!1}}}function s(){let F=!1,ue=null,te=null,he=null,_e=null,ie=null,De=null,we=null,ct=null;return{setTest:function(et){F||(et?ee(i.STENCIL_TEST):ge(i.STENCIL_TEST))},setMask:function(et){ue!==et&&!F&&(i.stencilMask(et),ue=et)},setFunc:function(et,rn,dn){(te!==et||he!==rn||_e!==dn)&&(i.stencilFunc(et,rn,dn),te=et,he=rn,_e=dn)},setOp:function(et,rn,dn){(ie!==et||De!==rn||we!==dn)&&(i.stencilOp(et,rn,dn),ie=et,De=rn,we=dn)},setLocked:function(et){F=et},setClear:function(et){ct!==et&&(i.clearStencil(et),ct=et)},reset:function(){F=!1,ue=null,te=null,he=null,_e=null,ie=null,De=null,we=null,ct=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let u={},m={},h={},p=new WeakMap,g=[],y=null,f=!1,d=null,E=null,w=null,v=null,M=null,T=null,C=null,x=new He(0,0,0),A=0,L=!1,U=null,N=null,z=null,P=null,O=null;const B=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,j=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(K)[1]),G=j>=1):K.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),G=j>=2);let q=null,J={};const be=i.getParameter(i.SCISSOR_BOX),Me=i.getParameter(i.VIEWPORT),Ce=new _t().fromArray(be),ke=new _t().fromArray(Me);function Ne(F,ue,te,he){const _e=new Uint8Array(4),ie=i.createTexture();i.bindTexture(F,ie),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<te;De++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(ue,0,i.RGBA,1,1,he,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(ue+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return ie}const V={};V[i.TEXTURE_2D]=Ne(i.TEXTURE_2D,i.TEXTURE_2D,1),V[i.TEXTURE_CUBE_MAP]=Ne(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[i.TEXTURE_2D_ARRAY]=Ne(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),V[i.TEXTURE_3D]=Ne(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(i.DEPTH_TEST),a.setFunc(Ms),Ye(!1),pt(gc),ee(i.CULL_FACE),Je(Nn);function ee(F){u[F]!==!0&&(i.enable(F),u[F]=!0)}function ge(F){u[F]!==!1&&(i.disable(F),u[F]=!1)}function Oe(F,ue){return h[F]!==ue?(i.bindFramebuffer(F,ue),h[F]=ue,F===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ue),F===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ue),!0):!1}function Se(F,ue){let te=g,he=!1;if(F){te=p.get(ue),te===void 0&&(te=[],p.set(ue,te));const _e=F.textures;if(te.length!==_e.length||te[0]!==i.COLOR_ATTACHMENT0){for(let ie=0,De=_e.length;ie<De;ie++)te[ie]=i.COLOR_ATTACHMENT0+ie;te.length=_e.length,he=!0}}else te[0]!==i.BACK&&(te[0]=i.BACK,he=!0);he&&i.drawBuffers(te)}function Xe(F){return y!==F?(i.useProgram(F),y=F,!0):!1}const Et={[zi]:i.FUNC_ADD,[mf]:i.FUNC_SUBTRACT,[gf]:i.FUNC_REVERSE_SUBTRACT};Et[_f]=i.MIN,Et[xf]=i.MAX;const $e={[vf]:i.ZERO,[Sf]:i.ONE,[yf]:i.SRC_COLOR,[Iu]:i.SRC_ALPHA,[wf]:i.SRC_ALPHA_SATURATE,[Tf]:i.DST_COLOR,[Mf]:i.DST_ALPHA,[bf]:i.ONE_MINUS_SRC_COLOR,[Fu]:i.ONE_MINUS_SRC_ALPHA,[Af]:i.ONE_MINUS_DST_COLOR,[Ef]:i.ONE_MINUS_DST_ALPHA,[Rf]:i.CONSTANT_COLOR,[Cf]:i.ONE_MINUS_CONSTANT_COLOR,[Pf]:i.CONSTANT_ALPHA,[Lf]:i.ONE_MINUS_CONSTANT_ALPHA};function Je(F,ue,te,he,_e,ie,De,we,ct,et){if(F===Nn){f===!0&&(ge(i.BLEND),f=!1);return}if(f===!1&&(ee(i.BLEND),f=!0),F!==pf){if(F!==d||et!==L){if((E!==zi||M!==zi)&&(i.blendEquation(i.FUNC_ADD),E=zi,M=zi),et)switch(F){case xs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _c:i.blendFunc(i.ONE,i.ONE);break;case xc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case vc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ze("WebGLState: Invalid blending: ",F);break}else switch(F){case xs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _c:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case xc:Ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case vc:Ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ze("WebGLState: Invalid blending: ",F);break}w=null,v=null,T=null,C=null,x.set(0,0,0),A=0,d=F,L=et}return}_e=_e||ue,ie=ie||te,De=De||he,(ue!==E||_e!==M)&&(i.blendEquationSeparate(Et[ue],Et[_e]),E=ue,M=_e),(te!==w||he!==v||ie!==T||De!==C)&&(i.blendFuncSeparate($e[te],$e[he],$e[ie],$e[De]),w=te,v=he,T=ie,C=De),(we.equals(x)===!1||ct!==A)&&(i.blendColor(we.r,we.g,we.b,ct),x.copy(we),A=ct),d=F,L=!1}function lt(F,ue){F.side===Ln?ge(i.CULL_FACE):ee(i.CULL_FACE);let te=F.side===Kt;ue&&(te=!te),Ye(te),F.blending===xs&&F.transparent===!1?Je(Nn):Je(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const he=F.stencilWrite;o.setTest(he),he&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Vt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ee(i.SAMPLE_ALPHA_TO_COVERAGE):ge(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ye(F){U!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),U=F)}function pt(F){F!==df?(ee(i.CULL_FACE),F!==N&&(F===gc?i.cullFace(i.BACK):F===ff?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ge(i.CULL_FACE),N=F}function Rt(F){F!==z&&(G&&i.lineWidth(F),z=F)}function Vt(F,ue,te){F?(ee(i.POLYGON_OFFSET_FILL),(P!==ue||O!==te)&&(P=ue,O=te,a.getReversed()&&(ue=-ue),i.polygonOffset(ue,te))):ge(i.POLYGON_OFFSET_FILL)}function gt(F){F?ee(i.SCISSOR_TEST):ge(i.SCISSOR_TEST)}function St(F){F===void 0&&(F=i.TEXTURE0+B-1),q!==F&&(i.activeTexture(F),q=F)}function k(F,ue,te){te===void 0&&(q===null?te=i.TEXTURE0+B-1:te=q);let he=J[te];he===void 0&&(he={type:void 0,texture:void 0},J[te]=he),(he.type!==F||he.texture!==ue)&&(q!==te&&(i.activeTexture(te),q=te),i.bindTexture(F,ue||V[F]),he.type=F,he.texture=ue)}function Nt(){const F=J[q];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function nt(){try{i.compressedTexImage2D(...arguments)}catch(F){Ze("WebGLState:",F)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(F){Ze("WebGLState:",F)}}function _(){try{i.texSubImage2D(...arguments)}catch(F){Ze("WebGLState:",F)}}function H(){try{i.texSubImage3D(...arguments)}catch(F){Ze("WebGLState:",F)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(F){Ze("WebGLState:",F)}}function Z(){try{i.compressedTexSubImage3D(...arguments)}catch(F){Ze("WebGLState:",F)}}function re(){try{i.texStorage2D(...arguments)}catch(F){Ze("WebGLState:",F)}}function oe(){try{i.texStorage3D(...arguments)}catch(F){Ze("WebGLState:",F)}}function Q(){try{i.texImage2D(...arguments)}catch(F){Ze("WebGLState:",F)}}function ne(){try{i.texImage3D(...arguments)}catch(F){Ze("WebGLState:",F)}}function le(F){return m[F]!==void 0?m[F]:i.getParameter(F)}function Pe(F,ue){m[F]!==ue&&(i.pixelStorei(F,ue),m[F]=ue)}function de(F){Ce.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),Ce.copy(F))}function ce(F){ke.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),ke.copy(F))}function Le(F,ue){let te=c.get(ue);te===void 0&&(te=new WeakMap,c.set(ue,te));let he=te.get(F);he===void 0&&(he=i.getUniformBlockIndex(ue,F.name),te.set(F,he))}function Ie(F,ue){const he=c.get(ue).get(F);l.get(ue)!==he&&(i.uniformBlockBinding(ue,he,F.__bindingPointIndex),l.set(ue,he))}function ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},m={},q=null,J={},h={},p=new WeakMap,g=[],y=null,f=!1,d=null,E=null,w=null,v=null,M=null,T=null,C=null,x=new He(0,0,0),A=0,L=!1,U=null,N=null,z=null,P=null,O=null,Ce.set(0,0,i.canvas.width,i.canvas.height),ke.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:ge,bindFramebuffer:Oe,drawBuffers:Se,useProgram:Xe,setBlending:Je,setMaterial:lt,setFlipSided:Ye,setCullFace:pt,setLineWidth:Rt,setPolygonOffset:Vt,setScissorTest:gt,activeTexture:St,bindTexture:k,unbindTexture:Nt,compressedTexImage2D:nt,compressedTexImage3D:R,texImage2D:Q,texImage3D:ne,pixelStorei:Pe,getParameter:le,updateUBOMapping:Le,uniformBlockBinding:Ie,texStorage2D:re,texStorage3D:oe,texSubImage2D:_,texSubImage3D:H,compressedTexSubImage2D:$,compressedTexSubImage3D:Z,scissor:de,viewport:ce,reset:ze}}function ev(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xe,u=new WeakMap,m=new Set;let h;const p=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,_){return g?new OffscreenCanvas(R,_):Lr("canvas")}function f(R,_,H){let $=1;const Z=nt(R);if((Z.width>H||Z.height>H)&&($=H/Math.max(Z.width,Z.height)),$<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const re=Math.floor($*Z.width),oe=Math.floor($*Z.height);h===void 0&&(h=y(re,oe));const Q=_?y(re,oe):h;return Q.width=re,Q.height=oe,Q.getContext("2d").drawImage(R,0,0,re,oe),Fe("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+re+"x"+oe+")."),Q}else return"data"in R&&Fe("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),R;return R}function d(R){return R.generateMipmaps}function E(R){i.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(R,_,H,$,Z,re=!1){if(R!==null){if(i[R]!==void 0)return i[R];Fe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let oe;$&&(oe=e.get("EXT_texture_norm16"),oe||Fe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Q=_;if(_===i.RED&&(H===i.FLOAT&&(Q=i.R32F),H===i.HALF_FLOAT&&(Q=i.R16F),H===i.UNSIGNED_BYTE&&(Q=i.R8),H===i.UNSIGNED_SHORT&&oe&&(Q=oe.R16_EXT),H===i.SHORT&&oe&&(Q=oe.R16_SNORM_EXT)),_===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(Q=i.R8UI),H===i.UNSIGNED_SHORT&&(Q=i.R16UI),H===i.UNSIGNED_INT&&(Q=i.R32UI),H===i.BYTE&&(Q=i.R8I),H===i.SHORT&&(Q=i.R16I),H===i.INT&&(Q=i.R32I)),_===i.RG&&(H===i.FLOAT&&(Q=i.RG32F),H===i.HALF_FLOAT&&(Q=i.RG16F),H===i.UNSIGNED_BYTE&&(Q=i.RG8),H===i.UNSIGNED_SHORT&&oe&&(Q=oe.RG16_EXT),H===i.SHORT&&oe&&(Q=oe.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(Q=i.RG8UI),H===i.UNSIGNED_SHORT&&(Q=i.RG16UI),H===i.UNSIGNED_INT&&(Q=i.RG32UI),H===i.BYTE&&(Q=i.RG8I),H===i.SHORT&&(Q=i.RG16I),H===i.INT&&(Q=i.RG32I)),_===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),H===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),H===i.UNSIGNED_INT&&(Q=i.RGB32UI),H===i.BYTE&&(Q=i.RGB8I),H===i.SHORT&&(Q=i.RGB16I),H===i.INT&&(Q=i.RGB32I)),_===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),H===i.UNSIGNED_INT&&(Q=i.RGBA32UI),H===i.BYTE&&(Q=i.RGBA8I),H===i.SHORT&&(Q=i.RGBA16I),H===i.INT&&(Q=i.RGBA32I)),_===i.RGB&&(H===i.UNSIGNED_SHORT&&oe&&(Q=oe.RGB16_EXT),H===i.SHORT&&oe&&(Q=oe.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(Q=i.R11F_G11F_B10F)),_===i.RGBA){const ne=re?Pr:qe.getTransfer(Z);H===i.FLOAT&&(Q=i.RGBA32F),H===i.HALF_FLOAT&&(Q=i.RGBA16F),H===i.UNSIGNED_BYTE&&(Q=ne===it?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&oe&&(Q=oe.RGBA16_EXT),H===i.SHORT&&oe&&(Q=oe.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function M(R,_){let H;return R?_===null||_===bn||_===Ts?H=i.DEPTH24_STENCIL8:_===_n?H=i.DEPTH32F_STENCIL8:_===Es&&(H=i.DEPTH24_STENCIL8,Fe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===bn||_===Ts?H=i.DEPTH_COMPONENT24:_===_n?H=i.DEPTH_COMPONENT32F:_===Es&&(H=i.DEPTH_COMPONENT16),H}function T(R,_){return d(R)===!0||R.isFramebufferTexture&&R.minFilter!==Lt&&R.minFilter!==Ot?Math.log2(Math.max(_.width,_.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?_.mipmaps.length:1}function C(R){const _=R.target;_.removeEventListener("dispose",C),A(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&m.delete(_)}function x(R){const _=R.target;_.removeEventListener("dispose",x),U(_)}function A(R){const _=n.get(R);if(_.__webglInit===void 0)return;const H=R.source,$=p.get(H);if($){const Z=$[_.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&L(R),Object.keys($).length===0&&p.delete(H)}n.remove(R)}function L(R){const _=n.get(R);i.deleteTexture(_.__webglTexture);const H=R.source,$=p.get(H);delete $[_.__cacheKey],a.memory.textures--}function U(R){const _=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(_.__webglFramebuffer[$]))for(let Z=0;Z<_.__webglFramebuffer[$].length;Z++)i.deleteFramebuffer(_.__webglFramebuffer[$][Z]);else i.deleteFramebuffer(_.__webglFramebuffer[$]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[$])}else{if(Array.isArray(_.__webglFramebuffer))for(let $=0;$<_.__webglFramebuffer.length;$++)i.deleteFramebuffer(_.__webglFramebuffer[$]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let $=0;$<_.__webglColorRenderbuffer.length;$++)_.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[$]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const H=R.textures;for(let $=0,Z=H.length;$<Z;$++){const re=n.get(H[$]);re.__webglTexture&&(i.deleteTexture(re.__webglTexture),a.memory.textures--),n.remove(H[$])}n.remove(R)}let N=0;function z(){N=0}function P(){return N}function O(R){N=R}function B(){const R=N;return R>=s.maxTextures&&Fe("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),N+=1,R}function G(R){const _=[];return _.push(R.wrapS),_.push(R.wrapT),_.push(R.wrapR||0),_.push(R.magFilter),_.push(R.minFilter),_.push(R.anisotropy),_.push(R.internalFormat),_.push(R.format),_.push(R.type),_.push(R.generateMipmaps),_.push(R.premultiplyAlpha),_.push(R.flipY),_.push(R.unpackAlignment),_.push(R.colorSpace),_.join()}function j(R,_){const H=n.get(R);if(R.isVideoTexture&&k(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&H.__version!==R.version){const $=R.image;if($===null)Fe("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Fe("WebGLRenderer: Texture marked for update but image is incomplete");else{ge(H,R,_);return}}else R.isExternalTexture&&(H.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+_)}function K(R,_){const H=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){ge(H,R,_);return}else R.isExternalTexture&&(H.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+_)}function q(R,_){const H=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){ge(H,R,_);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+_)}function J(R,_){const H=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&H.__version!==R.version){Oe(H,R,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+_)}const be={[Za]:i.REPEAT,[Dn]:i.CLAMP_TO_EDGE,[Ja]:i.MIRRORED_REPEAT},Me={[Lt]:i.NEAREST,[Uf]:i.NEAREST_MIPMAP_NEAREST,[Hs]:i.NEAREST_MIPMAP_LINEAR,[Ot]:i.LINEAR,[ta]:i.LINEAR_MIPMAP_NEAREST,[oi]:i.LINEAR_MIPMAP_LINEAR},Ce={[kf]:i.NEVER,[Vf]:i.ALWAYS,[Bf]:i.LESS,[Ho]:i.LEQUAL,[zf]:i.EQUAL,[Go]:i.GEQUAL,[Hf]:i.GREATER,[Gf]:i.NOTEQUAL};function ke(R,_){if(_.type===_n&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Ot||_.magFilter===ta||_.magFilter===Hs||_.magFilter===oi||_.minFilter===Ot||_.minFilter===ta||_.minFilter===Hs||_.minFilter===oi)&&Fe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,be[_.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,be[_.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,be[_.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Me[_.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Me[_.minFilter]),_.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Ce[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Lt||_.minFilter!==Hs&&_.minFilter!==oi||_.type===_n&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Ne(R,_){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,_.addEventListener("dispose",C));const $=_.source;let Z=p.get($);Z===void 0&&(Z={},p.set($,Z));const re=G(_);if(re!==R.__cacheKey){Z[re]===void 0&&(Z[re]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Z[re].usedTimes++;const oe=Z[R.__cacheKey];oe!==void 0&&(Z[R.__cacheKey].usedTimes--,oe.usedTimes===0&&L(_)),R.__cacheKey=re,R.__webglTexture=Z[re].texture}return H}function V(R,_,H){return Math.floor(Math.floor(R/H)/_)}function ee(R,_,H,$){const re=R.updateRanges;if(re.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,H,$,_.data);else{re.sort((Pe,de)=>Pe.start-de.start);let oe=0;for(let Pe=1;Pe<re.length;Pe++){const de=re[oe],ce=re[Pe],Le=de.start+de.count,Ie=V(ce.start,_.width,4),ze=V(de.start,_.width,4);ce.start<=Le+1&&Ie===ze&&V(ce.start+ce.count-1,_.width,4)===Ie?de.count=Math.max(de.count,ce.start+ce.count-de.start):(++oe,re[oe]=ce)}re.length=oe+1;const Q=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),le=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let Pe=0,de=re.length;Pe<de;Pe++){const ce=re[Pe],Le=Math.floor(ce.start/4),Ie=Math.ceil(ce.count/4),ze=Le%_.width,F=Math.floor(Le/_.width),ue=Ie,te=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ze),t.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,ze,F,ue,te,H,$,_.data)}R.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,Q),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,le)}}function ge(R,_,H){let $=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&($=i.TEXTURE_3D);const Z=Ne(R,_),re=_.source;t.bindTexture($,R.__webglTexture,i.TEXTURE0+H);const oe=n.get(re);if(re.version!==oe.__version||Z===!0){if(t.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const te=qe.getPrimaries(qe.workingColorSpace),he=_.colorSpace===Kn?null:qe.getPrimaries(_.colorSpace),_e=_.colorSpace===Kn||te===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let ne=f(_.image,!1,s.maxTextureSize);ne=Nt(_,ne);const le=r.convert(_.format,_.colorSpace),Pe=r.convert(_.type);let de=v(_.internalFormat,le,Pe,_.normalized,_.colorSpace,_.isVideoTexture);ke($,_);let ce;const Le=_.mipmaps,Ie=_.isVideoTexture!==!0,ze=oe.__version===void 0||Z===!0,F=re.dataReady,ue=T(_,ne);if(_.isDepthTexture)de=M(_.format===li,_.type),ze&&(Ie?t.texStorage2D(i.TEXTURE_2D,1,de,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,de,ne.width,ne.height,0,le,Pe,null));else if(_.isDataTexture)if(Le.length>0){Ie&&ze&&t.texStorage2D(i.TEXTURE_2D,ue,de,Le[0].width,Le[0].height);for(let te=0,he=Le.length;te<he;te++)ce=Le[te],Ie?F&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ce.width,ce.height,le,Pe,ce.data):t.texImage2D(i.TEXTURE_2D,te,de,ce.width,ce.height,0,le,Pe,ce.data);_.generateMipmaps=!1}else Ie?(ze&&t.texStorage2D(i.TEXTURE_2D,ue,de,ne.width,ne.height),F&&ee(_,ne,le,Pe)):t.texImage2D(i.TEXTURE_2D,0,de,ne.width,ne.height,0,le,Pe,ne.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ie&&ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,de,Le[0].width,Le[0].height,ne.depth);for(let te=0,he=Le.length;te<he;te++)if(ce=Le[te],_.format!==un)if(le!==null)if(Ie){if(F)if(_.layerUpdates.size>0){const _e=nu(ce.width,ce.height,_.format,_.type);for(const ie of _.layerUpdates){const De=ce.data.subarray(ie*_e/ce.data.BYTES_PER_ELEMENT,(ie+1)*_e/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,ie,ce.width,ce.height,1,le,De)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,ce.width,ce.height,ne.depth,le,ce.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,de,ce.width,ce.height,ne.depth,0,ce.data,0,0);else Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,ce.width,ce.height,ne.depth,le,Pe,ce.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,de,ce.width,ce.height,ne.depth,0,le,Pe,ce.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Ie&&ze&&t.texStorage2D(i.TEXTURE_2D,ue,de,Le[0].width,Le[0].height);for(let te=0,he=Le.length;te<he;te++)ce=Le[te],_.format!==un?le!==null?Ie?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,ce.width,ce.height,le,ce.data):t.compressedTexImage2D(i.TEXTURE_2D,te,de,ce.width,ce.height,0,ce.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?F&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ce.width,ce.height,le,Pe,ce.data):t.texImage2D(i.TEXTURE_2D,te,de,ce.width,ce.height,0,le,Pe,ce.data)}else if(_.isDataArrayTexture)if(Ie){if(ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,de,ne.width,ne.height,ne.depth),F)if(_.layerUpdates.size>0){const te=nu(ne.width,ne.height,_.format,_.type);for(const he of _.layerUpdates){const _e=ne.data.subarray(he*te/ne.data.BYTES_PER_ELEMENT,(he+1)*te/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,he,ne.width,ne.height,1,le,Pe,_e)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,le,Pe,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,de,ne.width,ne.height,ne.depth,0,le,Pe,ne.data);else if(_.isData3DTexture)Ie?(ze&&t.texStorage3D(i.TEXTURE_3D,ue,de,ne.width,ne.height,ne.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,le,Pe,ne.data)):t.texImage3D(i.TEXTURE_3D,0,de,ne.width,ne.height,ne.depth,0,le,Pe,ne.data);else if(_.isFramebufferTexture){if(ze)if(Ie)t.texStorage2D(i.TEXTURE_2D,ue,de,ne.width,ne.height);else{let te=ne.width,he=ne.height;for(let _e=0;_e<ue;_e++)t.texImage2D(i.TEXTURE_2D,_e,de,te,he,0,le,Pe,null),te>>=1,he>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){const te=i.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),ne.parentNode!==te){te.appendChild(ne),m.add(_),te.onpaint=he=>{const _e=he.changedElements;for(const ie of m)_e.includes(ie.image)&&(ie.needsUpdate=!0)},te.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{const _e=i.RGBA,ie=i.RGBA,De=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,_e,ie,De,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Le.length>0){if(Ie&&ze){const te=nt(Le[0]);t.texStorage2D(i.TEXTURE_2D,ue,de,te.width,te.height)}for(let te=0,he=Le.length;te<he;te++)ce=Le[te],Ie?F&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,le,Pe,ce):t.texImage2D(i.TEXTURE_2D,te,de,le,Pe,ce);_.generateMipmaps=!1}else if(Ie){if(ze){const te=nt(ne);t.texStorage2D(i.TEXTURE_2D,ue,de,te.width,te.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,le,Pe,ne)}else t.texImage2D(i.TEXTURE_2D,0,de,le,Pe,ne);d(_)&&E($),oe.__version=re.version,_.onUpdate&&_.onUpdate(_)}R.__version=_.version}function Oe(R,_,H){if(_.image.length!==6)return;const $=Ne(R,_),Z=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+H);const re=n.get(Z);if(Z.version!==re.__version||$===!0){t.activeTexture(i.TEXTURE0+H);const oe=qe.getPrimaries(qe.workingColorSpace),Q=_.colorSpace===Kn?null:qe.getPrimaries(_.colorSpace),ne=_.colorSpace===Kn||oe===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);const le=_.isCompressedTexture||_.image[0].isCompressedTexture,Pe=_.image[0]&&_.image[0].isDataTexture,de=[];for(let ie=0;ie<6;ie++)!le&&!Pe?de[ie]=f(_.image[ie],!0,s.maxCubemapSize):de[ie]=Pe?_.image[ie].image:_.image[ie],de[ie]=Nt(_,de[ie]);const ce=de[0],Le=r.convert(_.format,_.colorSpace),Ie=r.convert(_.type),ze=v(_.internalFormat,Le,Ie,_.normalized,_.colorSpace),F=_.isVideoTexture!==!0,ue=re.__version===void 0||$===!0,te=Z.dataReady;let he=T(_,ce);ke(i.TEXTURE_CUBE_MAP,_);let _e;if(le){F&&ue&&t.texStorage2D(i.TEXTURE_CUBE_MAP,he,ze,ce.width,ce.height);for(let ie=0;ie<6;ie++){_e=de[ie].mipmaps;for(let De=0;De<_e.length;De++){const we=_e[De];_.format!==un?Le!==null?F?te&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,De,0,0,we.width,we.height,Le,we.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,De,ze,we.width,we.height,0,we.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,De,0,0,we.width,we.height,Le,Ie,we.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,De,ze,we.width,we.height,0,Le,Ie,we.data)}}}else{if(_e=_.mipmaps,F&&ue){_e.length>0&&he++;const ie=nt(de[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,he,ze,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(Pe){F?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,de[ie].width,de[ie].height,Le,Ie,de[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,ze,de[ie].width,de[ie].height,0,Le,Ie,de[ie].data);for(let De=0;De<_e.length;De++){const ct=_e[De].image[ie].image;F?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,De+1,0,0,ct.width,ct.height,Le,Ie,ct.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,De+1,ze,ct.width,ct.height,0,Le,Ie,ct.data)}}else{F?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Le,Ie,de[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,ze,Le,Ie,de[ie]);for(let De=0;De<_e.length;De++){const we=_e[De];F?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,De+1,0,0,Le,Ie,we.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,De+1,ze,Le,Ie,we.image[ie])}}}d(_)&&E(i.TEXTURE_CUBE_MAP),re.__version=Z.version,_.onUpdate&&_.onUpdate(_)}R.__version=_.version}function Se(R,_,H,$,Z,re){const oe=r.convert(H.format,H.colorSpace),Q=r.convert(H.type),ne=v(H.internalFormat,oe,Q,H.normalized,H.colorSpace),le=n.get(_),Pe=n.get(H);if(Pe.__renderTarget=_,!le.__hasExternalTextures){const de=Math.max(1,_.width>>re),ce=Math.max(1,_.height>>re);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?t.texImage3D(Z,re,ne,de,ce,_.depth,0,oe,Q,null):t.texImage2D(Z,re,ne,de,ce,0,oe,Q,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),St(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,Pe.__webglTexture,0,gt(_)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,Pe.__webglTexture,re),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Xe(R,_,H){if(i.bindRenderbuffer(i.RENDERBUFFER,R),_.depthBuffer){const $=_.depthTexture,Z=$&&$.isDepthTexture?$.type:null,re=M(_.stencilBuffer,Z),oe=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;St(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(_),re,_.width,_.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(_),re,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,re,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,oe,i.RENDERBUFFER,R)}else{const $=_.textures;for(let Z=0;Z<$.length;Z++){const re=$[Z],oe=r.convert(re.format,re.colorSpace),Q=r.convert(re.type),ne=v(re.internalFormat,oe,Q,re.normalized,re.colorSpace);St(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt(_),ne,_.width,_.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt(_),ne,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ne,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Et(R,_,H){const $=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const Z=n.get(_.depthTexture);if(Z.__renderTarget=_,(!Z.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),$){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,_.depthTexture.addEventListener("dispose",C)),Z.__webglTexture===void 0){Z.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),ke(i.TEXTURE_CUBE_MAP,_.depthTexture);const le=r.convert(_.depthTexture.format),Pe=r.convert(_.depthTexture.type);let de;_.depthTexture.format===On?de=i.DEPTH_COMPONENT24:_.depthTexture.format===li&&(de=i.DEPTH24_STENCIL8);for(let ce=0;ce<6;ce++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,de,_.width,_.height,0,le,Pe,null)}}else j(_.depthTexture,0);const re=Z.__webglTexture,oe=gt(_),Q=$?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,ne=_.depthTexture.format===li?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===On)St(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,Q,re,0,oe):i.framebufferTexture2D(i.FRAMEBUFFER,ne,Q,re,0);else if(_.depthTexture.format===li)St(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,Q,re,0,oe):i.framebufferTexture2D(i.FRAMEBUFFER,ne,Q,re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function $e(R){const _=n.get(R),H=R.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==R.depthTexture){const $=R.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),$){const Z=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,$.removeEventListener("dispose",Z)};$.addEventListener("dispose",Z),_.__depthDisposeCallback=Z}_.__boundDepthTexture=$}if(R.depthTexture&&!_.__autoAllocateDepthBuffer)if(H)for(let $=0;$<6;$++)Et(_.__webglFramebuffer[$],R,$);else{const $=R.texture.mipmaps;$&&$.length>0?Et(_.__webglFramebuffer[0],R,0):Et(_.__webglFramebuffer,R,0)}else if(H){_.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[$]),_.__webglDepthbuffer[$]===void 0)_.__webglDepthbuffer[$]=i.createRenderbuffer(),Xe(_.__webglDepthbuffer[$],R,!1);else{const Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=_.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,re)}}else{const $=R.texture.mipmaps;if($&&$.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Xe(_.__webglDepthbuffer,R,!1);else{const Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,re)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Je(R,_,H){const $=n.get(R);_!==void 0&&Se($.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&$e(R)}function lt(R){const _=R.texture,H=n.get(R),$=n.get(_);R.addEventListener("dispose",x);const Z=R.textures,re=R.isWebGLCubeRenderTarget===!0,oe=Z.length>1;if(oe||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=_.version,a.memory.textures++),re){H.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(_.mipmaps&&_.mipmaps.length>0){H.__webglFramebuffer[Q]=[];for(let ne=0;ne<_.mipmaps.length;ne++)H.__webglFramebuffer[Q][ne]=i.createFramebuffer()}else H.__webglFramebuffer[Q]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){H.__webglFramebuffer=[];for(let Q=0;Q<_.mipmaps.length;Q++)H.__webglFramebuffer[Q]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(oe)for(let Q=0,ne=Z.length;Q<ne;Q++){const le=n.get(Z[Q]);le.__webglTexture===void 0&&(le.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&St(R)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let Q=0;Q<Z.length;Q++){const ne=Z[Q];H.__webglColorRenderbuffer[Q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[Q]);const le=r.convert(ne.format,ne.colorSpace),Pe=r.convert(ne.type),de=v(ne.internalFormat,le,Pe,ne.normalized,ne.colorSpace,R.isXRRenderTarget===!0),ce=gt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,ce,de,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,H.__webglColorRenderbuffer[Q])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Xe(H.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ke(i.TEXTURE_CUBE_MAP,_);for(let Q=0;Q<6;Q++)if(_.mipmaps&&_.mipmaps.length>0)for(let ne=0;ne<_.mipmaps.length;ne++)Se(H.__webglFramebuffer[Q][ne],R,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,ne);else Se(H.__webglFramebuffer[Q],R,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);d(_)&&E(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){for(let Q=0,ne=Z.length;Q<ne;Q++){const le=Z[Q],Pe=n.get(le);let de=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(de=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(de,Pe.__webglTexture),ke(de,le),Se(H.__webglFramebuffer,R,le,i.COLOR_ATTACHMENT0+Q,de,0),d(le)&&E(de)}t.unbindTexture()}else{let Q=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Q=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Q,$.__webglTexture),ke(Q,_),_.mipmaps&&_.mipmaps.length>0)for(let ne=0;ne<_.mipmaps.length;ne++)Se(H.__webglFramebuffer[ne],R,_,i.COLOR_ATTACHMENT0,Q,ne);else Se(H.__webglFramebuffer,R,_,i.COLOR_ATTACHMENT0,Q,0);d(_)&&E(Q),t.unbindTexture()}R.depthBuffer&&$e(R)}function Ye(R){const _=R.textures;for(let H=0,$=_.length;H<$;H++){const Z=_[H];if(d(Z)){const re=w(R),oe=n.get(Z).__webglTexture;t.bindTexture(re,oe),E(re),t.unbindTexture()}}}const pt=[],Rt=[];function Vt(R){if(R.samples>0){if(St(R)===!1){const _=R.textures,H=R.width,$=R.height;let Z=i.COLOR_BUFFER_BIT;const re=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=n.get(R),Q=_.length>1;if(Q)for(let le=0;le<_.length;le++)t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,oe.__webglMultisampledFramebuffer);const ne=R.texture.mipmaps;ne&&ne.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglFramebuffer);for(let le=0;le<_.length;le++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),Q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,oe.__webglColorRenderbuffer[le]);const Pe=n.get(_[le]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Pe,0)}i.blitFramebuffer(0,0,H,$,0,0,H,$,Z,i.NEAREST),l===!0&&(pt.length=0,Rt.length=0,pt.push(i.COLOR_ATTACHMENT0+le),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(pt.push(re),Rt.push(re),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Rt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,pt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Q)for(let le=0;le<_.length;le++){t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.RENDERBUFFER,oe.__webglColorRenderbuffer[le]);const Pe=n.get(_[le]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,oe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.TEXTURE_2D,Pe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,oe.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){const _=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function gt(R){return Math.min(s.maxSamples,R.samples)}function St(R){const _=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function k(R){const _=a.render.frame;u.get(R)!==_&&(u.set(R,_),R.update())}function Nt(R,_){const H=R.colorSpace,$=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==Cr&&H!==Kn&&(qe.getTransfer(H)===it?($!==un||Z!==Jt)&&Fe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ze("WebGLTextures: Unsupported texture color space:",H)),_}function nt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=z,this.getTextureUnits=P,this.setTextureUnits=O,this.setTexture2D=j,this.setTexture2DArray=K,this.setTexture3D=q,this.setTextureCube=J,this.rebindTextures=Je,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=Vt,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=St,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function tv(i,e){function t(n,s=Kn){let r;const a=qe.getTransfer(s);if(n===Jt)return i.UNSIGNED_BYTE;if(n===Fo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Oo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Yu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===qu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===$u)return i.BYTE;if(n===Ku)return i.SHORT;if(n===Es)return i.UNSIGNED_SHORT;if(n===Io)return i.INT;if(n===bn)return i.UNSIGNED_INT;if(n===_n)return i.FLOAT;if(n===Mn)return i.HALF_FLOAT;if(n===ju)return i.ALPHA;if(n===Zu)return i.RGB;if(n===un)return i.RGBA;if(n===On)return i.DEPTH_COMPONENT;if(n===li)return i.DEPTH_STENCIL;if(n===Ju)return i.RED;if(n===ko)return i.RED_INTEGER;if(n===hi)return i.RG;if(n===Bo)return i.RG_INTEGER;if(n===zo)return i.RGBA_INTEGER;if(n===vr||n===Sr||n===yr||n===br)if(a===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===vr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===vr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Sr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===yr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===br)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Qa||n===eo||n===to||n===no)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Qa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===eo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===to)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===no)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===io||n===so||n===ro||n===ao||n===oo||n===wr||n===lo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===io||n===so)return a===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ro)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ao)return r.COMPRESSED_R11_EAC;if(n===oo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===wr)return r.COMPRESSED_RG11_EAC;if(n===lo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===co||n===uo||n===ho||n===fo||n===po||n===mo||n===go||n===_o||n===xo||n===vo||n===So||n===yo||n===bo||n===Mo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===co)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===uo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ho)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===po)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===mo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===go)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===_o)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===xo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===vo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===So)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===yo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===bo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Mo)return a===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Eo||n===To||n===Ao)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Eo)return a===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===To)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ao)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===wo||n===Ro||n===Rr||n===Co)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===wo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Rr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Co)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ts?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const nv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,iv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class sv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new ch(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new En({vertexShader:nv,fragmentShader:iv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Gt(new Br(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class rv extends jn{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,m=null,h=null,p=null,g=null;const y=typeof XRWebGLBinding<"u",f=new sv,d={},E=t.getContextAttributes();let w=null,v=null;const M=[],T=[],C=new xe;let x=null,A=null;const L=new jt;L.viewport=new _t;const U=new jt;U.viewport=new _t;const N=[L,U],z=new hm;let P=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let ee=M[V];return ee===void 0&&(ee=new la,M[V]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(V){let ee=M[V];return ee===void 0&&(ee=new la,M[V]=ee),ee.getGripSpace()},this.getHand=function(V){let ee=M[V];return ee===void 0&&(ee=new la,M[V]=ee),ee.getHandSpace()};function B(V){const ee=T.indexOf(V.inputSource);if(ee===-1)return;const ge=M[ee];ge!==void 0&&(ge.update(V.inputSource,V.frame,c||a),ge.dispatchEvent({type:V.type,data:V.inputSource}))}function G(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",j);for(let V=0;V<M.length;V++){const ee=T[V];ee!==null&&(T[V]=null,M[V].disconnect(ee))}P=null,O=null,f.reset();for(const V in d)delete d[V];if(e.setRenderTarget(w),p=null,h=null,m=null,s=null,v=null,Ne.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(C.width,C.height,!1),A!==null){const V=A.camera;V.fov=A.fov,V.zoom=A.zoom,V.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&Fe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){o=V,n.isPresenting===!0&&Fe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return m===null&&y&&(m=new XRWebGLBinding(s,t)),m},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",G),s.addEventListener("inputsourceschange",j),E.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(C),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,Oe=null,Se=null;E.depth&&(Se=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=E.stencil?li:On,Oe=E.stencil?Ts:bn);const Xe={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:r};m=this.getBinding(),h=m.createProjectionLayer(Xe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new hn(h.textureWidth,h.textureHeight,{format:un,type:Jt,depthTexture:new Rs(h.textureWidth,h.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const ge={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,ge),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new hn(p.framebufferWidth,p.framebufferHeight,{format:un,type:Jt,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ne.setContext(s),Ne.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function j(V){for(let ee=0;ee<V.removed.length;ee++){const ge=V.removed[ee],Oe=T.indexOf(ge);Oe>=0&&(T[Oe]=null,M[Oe].disconnect(ge))}for(let ee=0;ee<V.added.length;ee++){const ge=V.added[ee];let Oe=T.indexOf(ge);if(Oe===-1){for(let Xe=0;Xe<M.length;Xe++)if(Xe>=T.length){T.push(ge),Oe=Xe;break}else if(T[Xe]===null){T[Xe]=ge,Oe=Xe;break}if(Oe===-1)break}const Se=M[Oe];Se&&Se.connect(ge)}}const K=new D,q=new D;function J(V,ee,ge){K.setFromMatrixPosition(ee.matrixWorld),q.setFromMatrixPosition(ge.matrixWorld);const Oe=K.distanceTo(q),Se=ee.projectionMatrix.elements,Xe=ge.projectionMatrix.elements,Et=Se[14]/(Se[10]-1),$e=Se[14]/(Se[10]+1),Je=(Se[9]+1)/Se[5],lt=(Se[9]-1)/Se[5],Ye=(Se[8]-1)/Se[0],pt=(Xe[8]+1)/Xe[0],Rt=Et*Ye,Vt=Et*pt,gt=Oe/(-Ye+pt),St=gt*-Ye;if(ee.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(St),V.translateZ(gt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),Se[10]===-1)V.projectionMatrix.copy(ee.projectionMatrix),V.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const k=Et+gt,Nt=$e+gt,nt=Rt-St,R=Vt+(Oe-St),_=Je*$e/Nt*k,H=lt*$e/Nt*k;V.projectionMatrix.makePerspective(nt,R,_,H,k,Nt),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function be(V,ee){ee===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(ee.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let ee=V.near,ge=V.far;f.texture!==null&&(f.depthNear>0&&(ee=f.depthNear),f.depthFar>0&&(ge=f.depthFar)),z.near=U.near=L.near=ee,z.far=U.far=L.far=ge,(P!==z.near||O!==z.far)&&(s.updateRenderState({depthNear:z.near,depthFar:z.far}),P=z.near,O=z.far),z.layers.mask=V.layers.mask|6,L.layers.mask=z.layers.mask&-5,U.layers.mask=z.layers.mask&-3;const Oe=V.parent,Se=z.cameras;be(z,Oe);for(let Xe=0;Xe<Se.length;Xe++)be(Se[Xe],Oe);Se.length===2?J(z,L,U):z.projectionMatrix.copy(L.projectionMatrix),A===null&&V.isPerspectiveCamera&&(A={camera:V,fov:V.fov,zoom:V.zoom}),Me(V,z,Oe)};function Me(V,ee,ge){ge===null?V.matrix.copy(ee.matrixWorld):(V.matrix.copy(ge.matrixWorld),V.matrix.invert(),V.matrix.multiply(ee.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(ee.projectionMatrix),V.projectionMatrixInverse.copy(ee.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=ws*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(V){l=V,h!==null&&(h.fixedFoveation=V),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=V)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(z)},this.getCameraTexture=function(V){return d[V]};let Ce=null;function ke(V,ee){if(u=ee.getViewerPose(c||a),g=ee,u!==null){const ge=u.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let Oe=!1;ge.length!==z.cameras.length&&(z.cameras.length=0,Oe=!0);for(let $e=0;$e<ge.length;$e++){const Je=ge[$e];let lt=null;if(p!==null)lt=p.getViewport(Je);else{const pt=m.getViewSubImage(h,Je);lt=pt.viewport,$e===0&&(e.setRenderTargetTextures(v,pt.colorTexture,pt.depthStencilTexture),e.setRenderTarget(v))}let Ye=N[$e];Ye===void 0&&(Ye=new jt,Ye.layers.enable($e),Ye.viewport=new _t,N[$e]=Ye),Ye.matrix.fromArray(Je.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(Je.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(lt.x,lt.y,lt.width,lt.height),$e===0&&(z.matrix.copy(Ye.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Oe===!0&&z.cameras.push(Ye)}const Se=s.enabledFeatures;if(Se&&Se.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){m=n.getBinding();const $e=m.getDepthInformation(ge[0]);$e&&$e.isValid&&$e.texture&&f.init($e,s.renderState)}if(Se&&Se.includes("camera-access")&&y){e.state.unbindTexture(),m=n.getBinding();for(let $e=0;$e<ge.length;$e++){const Je=ge[$e].camera;if(Je){let lt=d[Je];lt||(lt=new ch,d[Je]=lt);const Ye=m.getCameraImage(Je);lt.sourceTexture=Ye}}}}for(let ge=0;ge<M.length;ge++){const Oe=T[ge],Se=M[ge];Oe!==null&&Se!==void 0&&Se.update(Oe,ee,c||a)}Ce&&Ce(V,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}const Ne=new gh;Ne.setAnimationLoop(ke),this.setAnimationLoop=function(V){Ce=V},this.dispose=function(){}}}const av=new ft,Mh=new Be;Mh.set(-1,0,0,0,1,0,0,0,1);function ov(i,e){function t(f,d){f.matrixAutoUpdate===!0&&f.updateMatrix(),d.value.copy(f.matrix)}function n(f,d){d.color.getRGB(f.fogColor.value,fh(i)),d.isFog?(f.fogNear.value=d.near,f.fogFar.value=d.far):d.isFogExp2&&(f.fogDensity.value=d.density)}function s(f,d,E,w,v){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?r(f,d):d.isMeshLambertMaterial?(r(f,d),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(r(f,d),m(f,d)):d.isMeshPhongMaterial?(r(f,d),u(f,d),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(r(f,d),h(f,d),d.isMeshPhysicalMaterial&&p(f,d,v)):d.isMeshMatcapMaterial?(r(f,d),g(f,d)):d.isMeshDepthMaterial?r(f,d):d.isMeshDistanceMaterial?(r(f,d),y(f,d)):d.isMeshNormalMaterial?r(f,d):d.isLineBasicMaterial?(a(f,d),d.isLineDashedMaterial&&o(f,d)):d.isPointsMaterial?l(f,d,E,w):d.isSpriteMaterial?c(f,d):d.isShadowMaterial?(f.color.value.copy(d.color),f.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(f,d){f.opacity.value=d.opacity,d.color&&f.diffuse.value.copy(d.color),d.emissive&&f.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(f.map.value=d.map,t(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.bumpMap&&(f.bumpMap.value=d.bumpMap,t(d.bumpMap,f.bumpMapTransform),f.bumpScale.value=d.bumpScale,d.side===Kt&&(f.bumpScale.value*=-1)),d.normalMap&&(f.normalMap.value=d.normalMap,t(d.normalMap,f.normalMapTransform),f.normalScale.value.copy(d.normalScale),d.side===Kt&&f.normalScale.value.negate()),d.displacementMap&&(f.displacementMap.value=d.displacementMap,t(d.displacementMap,f.displacementMapTransform),f.displacementScale.value=d.displacementScale,f.displacementBias.value=d.displacementBias),d.emissiveMap&&(f.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,f.emissiveMapTransform)),d.specularMap&&(f.specularMap.value=d.specularMap,t(d.specularMap,f.specularMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest);const E=e.get(d),w=E.envMap,v=E.envMapRotation;w&&(f.envMap.value=w,f.envMapRotation.value.setFromMatrix4(av.makeRotationFromEuler(v)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(Mh),f.reflectivity.value=d.reflectivity,f.ior.value=d.ior,f.refractionRatio.value=d.refractionRatio),d.lightMap&&(f.lightMap.value=d.lightMap,f.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,f.lightMapTransform)),d.aoMap&&(f.aoMap.value=d.aoMap,f.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,f.aoMapTransform))}function a(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,d.map&&(f.map.value=d.map,t(d.map,f.mapTransform))}function o(f,d){f.dashSize.value=d.dashSize,f.totalSize.value=d.dashSize+d.gapSize,f.scale.value=d.scale}function l(f,d,E,w){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.size.value=d.size*E,f.scale.value=w*.5,d.map&&(f.map.value=d.map,t(d.map,f.uvTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function c(f,d){f.diffuse.value.copy(d.color),f.opacity.value=d.opacity,f.rotation.value=d.rotation,d.map&&(f.map.value=d.map,t(d.map,f.mapTransform)),d.alphaMap&&(f.alphaMap.value=d.alphaMap,t(d.alphaMap,f.alphaMapTransform)),d.alphaTest>0&&(f.alphaTest.value=d.alphaTest)}function u(f,d){f.specular.value.copy(d.specular),f.shininess.value=Math.max(d.shininess,1e-4)}function m(f,d){d.gradientMap&&(f.gradientMap.value=d.gradientMap)}function h(f,d){f.metalness.value=d.metalness,d.metalnessMap&&(f.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,f.metalnessMapTransform)),f.roughness.value=d.roughness,d.roughnessMap&&(f.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,f.roughnessMapTransform)),d.envMap&&(f.envMapIntensity.value=d.envMapIntensity)}function p(f,d,E){f.ior.value=d.ior,d.sheen>0&&(f.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),f.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(f.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,f.sheenColorMapTransform)),d.sheenRoughnessMap&&(f.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,f.sheenRoughnessMapTransform))),d.clearcoat>0&&(f.clearcoat.value=d.clearcoat,f.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(f.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,f.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(f.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Kt&&f.clearcoatNormalScale.value.negate())),d.dispersion>0&&(f.dispersion.value=d.dispersion),d.retroreflectivity>0&&(f.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(f.iridescence.value=d.iridescence,f.iridescenceIOR.value=d.iridescenceIOR,f.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(f.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,f.iridescenceMapTransform)),d.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),d.transmission>0&&(f.transmission.value=d.transmission,f.transmissionSamplerMap.value=E.texture,f.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(f.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,f.transmissionMapTransform)),f.thickness.value=d.thickness,d.thicknessMap&&(f.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=d.attenuationDistance,f.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(f.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(f.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=d.specularIntensity,f.specularColor.value.copy(d.specularColor),d.specularColorMap&&(f.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,f.specularColorMapTransform)),d.specularIntensityMap&&(f.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,d){d.matcap&&(f.matcap.value=d.matcap)}function y(f,d){const E=e.get(d).light;f.referencePosition.value.setFromMatrixPosition(E.matrixWorld),f.nearDistance.value=E.shadow.camera.near,f.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function lv(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){const T=M.program;n.uniformBlockBinding(v,T)}function c(v,M){let T=s[v.id];T===void 0&&(f(v),T=u(v),s[v.id]=T,v.addEventListener("dispose",E));const C=M.program;n.updateUBOMapping(v,C);const x=e.render.frame;r[v.id]!==x&&(h(v),r[v.id]=x)}function u(v){const M=m();v.__bindingPointIndex=M;const T=i.createBuffer(),C=v.__size,x=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,C,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,T),T}function m(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const M=s[v.id],T=v.uniforms,C=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let x=0,A=T.length;x<A;x++){const L=T[x];if(Array.isArray(L))for(let U=0,N=L.length;U<N;U++)p(L[U],x,U,C);else p(L,x,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,M,T,C){if(y(v,M,T,C)===!0){const x=v.__offset,A=v.value;if(Array.isArray(A)){let L=0;for(let U=0;U<A.length;U++){const N=A[U],z=d(N);g(N,v.__data,L),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(L+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,v.__data)}}function g(v,M,T){typeof v=="number"||typeof v=="boolean"?M[0]=v:v.isMatrix3?(M[0]=v.elements[0],M[1]=v.elements[1],M[2]=v.elements[2],M[3]=0,M[4]=v.elements[3],M[5]=v.elements[4],M[6]=v.elements[5],M[7]=0,M[8]=v.elements[6],M[9]=v.elements[7],M[10]=v.elements[8],M[11]=0):ArrayBuffer.isView(v)?M.set(new v.constructor(v.buffer,v.byteOffset,M.length)):v.toArray(M,T)}function y(v,M,T,C){const x=v.value,A=M+"_"+T;if(C[A]===void 0)return typeof x=="number"||typeof x=="boolean"?C[A]=x:ArrayBuffer.isView(x)?C[A]=x.slice():C[A]=x.clone(),!0;{const L=C[A];if(typeof x=="number"||typeof x=="boolean"){if(L!==x)return C[A]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(L.equals(x)===!1)return L.copy(x),!0}}return!1}function f(v){const M=v.uniforms;let T=0;const C=16;for(let A=0,L=M.length;A<L;A++){const U=Array.isArray(M[A])?M[A]:[M[A]];for(let N=0,z=U.length;N<z;N++){const P=U[N],O=Array.isArray(P.value)?P.value:[P.value];for(let B=0,G=O.length;B<G;B++){const j=O[B],K=d(j),q=T%C,J=q%K.boundary,be=q+J;T+=J,be!==0&&C-be<K.storage&&(T+=C-be),P.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=T,T+=K.storage}}}const x=T%C;return x>0&&(T+=C-x),v.__size=T,v.__cache={},this}function d(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?Fe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(M.boundary=16,M.storage=v.byteLength):Fe("WebGLRenderer: Unsupported uniform value type.",v),M}function E(v){const M=v.target;M.removeEventListener("dispose",E);const T=a.indexOf(M.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function w(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:w}}const cv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let mn=null;function uv(){return mn===null&&(mn=new Dp(cv,16,16,hi,Mn),mn.name="DFG_LUT",mn.minFilter=Ot,mn.magFilter=Ot,mn.wrapS=Dn,mn.wrapT=Dn,mn.generateMipmaps=!1,mn.needsUpdate=!0),mn}class hv{constructor(e={}){const{canvas:t=Xf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:h=!1,outputBufferType:p=Jt}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const y=p,f=new Set([zo,Bo,ko]),d=new Set([Jt,bn,Es,Ts,Fo,Oo]),E=new Uint32Array(4),w=new Int32Array(4),v=new D;let M=null,T=null;const C=[],x=[];let A=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Sn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let U=!1,N=null,z=null,P=null,O=null;this._outputColorSpace=Xt;let B=0,G=0,j=null,K=-1,q=null;const J=new _t,be=new _t;let Me=null;const Ce=new He(0);let ke=0,Ne=t.width,V=t.height,ee=1,ge=null,Oe=null;const Se=new _t(0,0,Ne,V),Xe=new _t(0,0,Ne,V);let Et=!1;const $e=new Ko;let Je=!1,lt=!1;const Ye=new ft,pt=new D,Rt=new _t,Vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let gt=!1;function St(){return j===null?ee:1}let k=n;function Nt(S,I){return t.getContext(S,I)}let nt,R,_,H,$,Z,re,oe,Q,ne,le,Pe,de,ce,Le,Ie,ze,F,ue,te,he,_e,ie;try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:m};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Uo}`),t.addEventListener("webglcontextlost",ct,!1),t.addEventListener("webglcontextrestored",et,!1),t.addEventListener("webglcontextcreationerror",rn,!1),k===null){const I="webgl2";if(k=Nt(I,S),k===null)throw Nt(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}De()}catch(S){throw t.removeEventListener("webglcontextlost",ct,!1),t.removeEventListener("webglcontextrestored",et,!1),t.removeEventListener("webglcontextcreationerror",rn,!1),Ze("WebGLRenderer: "+S.message),S}function De(){nt=new u_(k),nt.init(),he=new tv(k,nt),R=new e_(k,nt,e,he),_=new Qx(k,nt),R.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),z=k.createFramebuffer(),P=k.createFramebuffer(),O=k.createFramebuffer(),H=new f_(k),$=new Bx,Z=new ev(k,nt,_,$,R,he,H),re=new c_(L),oe=new mm(k),_e=new Jg(k,oe),Q=new h_(k,oe,H,_e),ne=new m_(k,Q,oe,_e,H),F=new p_(k,R,Z),Le=new t_($),le=new kx(L,re,nt,R,_e,Le),Pe=new ov(L,$),de=new Hx,ce=new Kx(nt),ze=new Zg(L,re,_,ne,g,l),Ie=new Jx(L,ne,R),ie=new lv(k,H,R,_),ue=new Qg(k,nt,H),te=new d_(k,nt,H),H.programs=le.programs,L.capabilities=R,L.extensions=nt,L.properties=$,L.renderLists=de,L.shadowMap=Ie,L.state=_,L.info=H}y!==Jt&&(A=new __(y,t.width,t.height,o,s,r));const we=new rv(L,k);this.xr=we,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const S=nt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=nt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(S){S!==void 0&&(ee=S,this.setSize(Ne,V,!1))},this.getSize=function(S){return S.set(Ne,V)},this.setSize=function(S,I,Y=!0){if(we.isPresenting){Fe("WebGLRenderer: Can't change size while VR device is presenting.");return}Ne=S,V=I,t.width=Math.floor(S*ee),t.height=Math.floor(I*ee),Y===!0&&(t.style.width=S+"px",t.style.height=I+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,S,I)},this.getDrawingBufferSize=function(S){return S.set(Ne*ee,V*ee).floor()},this.setDrawingBufferSize=function(S,I,Y){Ne=S,V=I,ee=Y,t.width=Math.floor(S*Y),t.height=Math.floor(I*Y),this.setViewport(0,0,S,I)},this.setEffects=function(S){if(y===Jt){Ze("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let I=0;I<S.length;I++)if(S[I].isOutputPass===!0){Fe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(J)},this.getViewport=function(S){return S.copy(Se)},this.setViewport=function(S,I,Y,W){S.isVector4?Se.set(S.x,S.y,S.z,S.w):Se.set(S,I,Y,W),_.viewport(J.copy(Se).multiplyScalar(ee).round())},this.getScissor=function(S){return S.copy(Xe)},this.setScissor=function(S,I,Y,W){S.isVector4?Xe.set(S.x,S.y,S.z,S.w):Xe.set(S,I,Y,W),_.scissor(be.copy(Xe).multiplyScalar(ee).round())},this.getScissorTest=function(){return Et},this.setScissorTest=function(S){_.setScissorTest(Et=S)},this.setOpaqueSort=function(S){ge=S},this.setTransparentSort=function(S){Oe=S},this.getClearColor=function(S){return S.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(S=!0,I=!0,Y=!0){let W=0;if(S){let X=!1;if(j!==null){const me=j.texture.format;X=f.has(me)}if(X){const me=j.texture.type,Ee=d.has(me),pe=ze.getClearColor(),Te=ze.getClearAlpha(),Re=pe.r,Ge=pe.g,Ke=pe.b;Ee?(E[0]=Re,E[1]=Ge,E[2]=Ke,E[3]=Te,k.clearBufferuiv(k.COLOR,0,E)):(w[0]=Re,w[1]=Ge,w[2]=Ke,w[3]=Te,k.clearBufferiv(k.COLOR,0,w))}else W|=k.COLOR_BUFFER_BIT}I&&(W|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(W|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&k.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),N=S},this.dispose=function(){t.removeEventListener("webglcontextlost",ct,!1),t.removeEventListener("webglcontextrestored",et,!1),t.removeEventListener("webglcontextcreationerror",rn,!1),ze.dispose(),de.dispose(),ce.dispose(),$.dispose(),re.dispose(),ne.dispose(),_e.dispose(),ie.dispose(),le.dispose(),we.dispose(),we.removeEventListener("sessionstart",ul),we.removeEventListener("sessionend",hl),Zn.stop()};function ct(S){S.preventDefault(),Dr("WebGLRenderer: Context Lost."),U=!0}function et(){Dr("WebGLRenderer: Context Restored."),U=!1;const S=H.autoReset,I=Ie.enabled,Y=Ie.autoUpdate,W=Ie.needsUpdate,X=Ie.type;De(),H.autoReset=S,Ie.enabled=I,Ie.autoUpdate=Y,Ie.needsUpdate=W,Ie.type=X}function rn(S){Ze("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function dn(S){const I=S.target;I.removeEventListener("dispose",dn),Th(I)}function Th(S){Ah(S),$.remove(S)}function Ah(S){const I=$.get(S).programs;I!==void 0&&(I.forEach(function(Y){le.releaseProgram(Y)}),S.isShaderMaterial&&le.releaseShaderCache(S))}this.renderBufferDirect=function(S,I,Y,W,X,me){I===null&&(I=Vt);const Ee=X.isMesh&&X.matrixWorld.determinantAffine()<0,pe=Ch(S,I,Y,W,X);_.setMaterial(W,Ee);let Te=Y.index,Re=1;if(W.wireframe===!0){if(Te=Q.getWireframeAttribute(Y),Te===void 0)return;Re=2}const Ge=Y.drawRange,Ke=Y.attributes.position;let Ae=Ge.start*Re,tt=(Ge.start+Ge.count)*Re;me!==null&&(Ae=Math.max(Ae,me.start*Re),tt=Math.min(tt,(me.start+me.count)*Re)),Te!==null?(Ae=Math.max(Ae,0),tt=Math.min(tt,Te.count)):Ke!=null&&(Ae=Math.max(Ae,0),tt=Math.min(tt,Ke.count));const yt=tt-Ae;if(yt<0||yt===1/0)return;_e.setup(X,W,pe,Y,Te);let dt,ot=ue;if(Te!==null&&(dt=oe.get(Te),ot=te,ot.setIndex(dt)),X.isMesh)W.wireframe===!0?(_.setLineWidth(W.wireframeLinewidth*St()),ot.setMode(k.LINES)):ot.setMode(k.TRIANGLES);else if(X.isLine){let Ut=W.linewidth;Ut===void 0&&(Ut=1),_.setLineWidth(Ut*St()),X.isLineSegments?ot.setMode(k.LINES):X.isLineLoop?ot.setMode(k.LINE_LOOP):ot.setMode(k.LINE_STRIP)}else X.isPoints?ot.setMode(k.POINTS):X.isSprite&&ot.setMode(k.TRIANGLES);if(X.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))ot.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const Ut=X._multiDrawStarts,ye=X._multiDrawCounts,Bt=X._multiDrawCount,je=Te?oe.get(Te).bytesPerElement:1,Qt=$.get(W).currentProgram.getUniforms();for(let fn=0;fn<Bt;fn++)Qt.setValue(k,"_gl_DrawID",fn),ot.render(Ut[fn]/je,ye[fn])}else if(X.isInstancedMesh)ot.renderInstances(Ae,yt,X.count);else if(Y.isInstancedBufferGeometry){const Ut=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,ye=Math.min(Y.instanceCount,Ut);ot.renderInstances(Ae,yt,ye)}else ot.render(Ae,yt)};function cl(S,I,Y,W){N!==null&&S.isNodeMaterial&&N.setObject(W,S),Je===!0&&Le.setState(S,Y,!1),S.transparent===!0&&S.side===Ln&&S.forceSinglePass===!1?(S.side=Kt,S.needsUpdate=!0,Ls(S,I,W),S.side=ci,S.needsUpdate=!0,Ls(S,I,W),S.side=Ln):Ls(S,I,W)}this.compile=function(S,I,Y=null){Y===null&&(Y=S),N!==null&&N.renderStart(S,I,Y),T=ce.get(Y),T.init(I),x.push(T),Y.traverseVisible(function(X){X.isLight&&X.layers.test(I.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),S!==Y&&S.traverseVisible(function(X){X.isLight&&X.layers.test(I.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),T.setupLights(),N!==null&&N.updateLights(T.state.lightsArray),lt=this.localClippingEnabled,Je=Le.init(this.clippingPlanes,lt),Je===!0&&Le.setGlobalState(this.clippingPlanes,I),N!==null&&Ie.render(T.state.shadowsArray,Y,I);const W=new Set;return S.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const me=X.material;if(me)if(Array.isArray(me))for(let Ee=0;Ee<me.length;Ee++){const pe=me[Ee];cl(pe,Y,I,X),W.add(pe)}else cl(me,Y,I,X),W.add(me)}),T=x.pop(),N!==null&&N.renderEnd(),W},this.compileAsync=function(S,I,Y=null){const W=this.compile(S,I,Y);return new Promise(X=>{function me(){if(W.forEach(function(Ee){const Te=$.get(Ee).currentProgram;(Te===void 0||Te.isReady())&&W.delete(Ee)}),W.size===0){X(S);return}setTimeout(me,10)}nt.get("KHR_parallel_shader_compile")!==null?me():setTimeout(me,10)})};let Gr=null;function wh(S){Gr&&Gr(S)}function ul(){Zn.stop()}function hl(){Zn.start()}const Zn=new gh;Zn.setAnimationLoop(wh),typeof self<"u"&&Zn.setContext(self),this.setAnimationLoop=function(S){Gr=S,we.setAnimationLoop(S),S===null?Zn.stop():Zn.start()},we.addEventListener("sessionstart",ul),we.addEventListener("sessionend",hl),this.render=function(S,I){if(I!==void 0&&I.isCamera!==!0){Ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;N!==null&&N.renderStart(S,I);const Y=we.enabled===!0&&we.isPresenting===!0,W=A!==null&&(j===null||Y)&&A.begin(L,j);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),we.enabled===!0&&we.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(we.cameraAutoUpdate===!0&&we.updateCamera(I),I=we.getCamera()),S.isScene===!0&&S.onBeforeRender(L,S,I,j),T=ce.get(S,x.length),T.init(I),T.state.textureUnits=Z.getTextureUnits(),x.push(T),Ye.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),$e.setFromProjectionMatrix(Ye,xn,I.reversedDepth),lt=this.localClippingEnabled,Je=Le.init(this.clippingPlanes,lt),M=de.get(S,C.length),M.init(),C.push(M),we.enabled===!0&&we.isPresenting===!0){const Ee=L.xr.getDepthSensingMesh();Ee!==null&&Vr(Ee,I,-1/0,L.sortObjects)}Vr(S,I,0,L.sortObjects),M.finish(),N!==null&&N.updateLights(T.state.lightsArray),L.sortObjects===!0&&M.sort(ge,Oe),gt=we.enabled===!1||we.isPresenting===!1||we.hasDepthSensing()===!1,gt&&ze.addToRenderList(M,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Je===!0&&Le.beginShadows();const X=T.state.shadowsArray;if(Ie.render(X,S,I),Je===!0&&Le.endShadows(),(W&&A.hasRenderPass())===!1){const Ee=M.opaque,pe=M.transmissive;if(T.setupLights(),I.isArrayCamera){const Te=I.cameras;if(pe.length>0)for(let Re=0,Ge=Te.length;Re<Ge;Re++){const Ke=Te[Re];fl(Ee,pe,S,Ke)}gt&&ze.render(S);for(let Re=0,Ge=Te.length;Re<Ge;Re++){const Ke=Te[Re];dl(M,S,Ke,Ke.viewport)}}else pe.length>0&&fl(Ee,pe,S,I),gt&&ze.render(S),dl(M,S,I)}j!==null&&G===0&&(Z.updateMultisampleRenderTarget(j),Z.updateRenderTargetMipmap(j)),W&&A.end(L),S.isScene===!0&&S.onAfterRender(L,S,I),_e.resetDefaultState(),K=-1,q=null,x.pop(),x.length>0?(T=x[x.length-1],Z.setTextureUnits(T.state.textureUnits),Je===!0&&Le.setGlobalState(L.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?M=C[C.length-1]:M=null,N!==null&&N.renderEnd()};function Vr(S,I,Y,W){if(S.visible===!1)return;if(S.layers.test(I.layers)){if(S.isGroup)Y=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(I);else if(S.isLightProbeGrid)T.pushLightProbeGrid(S);else if(S.isLight)T.pushLight(S),S.castShadow&&T.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||S.intersectsFrustum($e)){W&&Rt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Ye);const Ee=ne.update(S),pe=S.material;pe.visible&&M.push(S,Ee,pe,Y,Rt.z,null,I)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||S.intersectsFrustum($e))){const Ee=ne.update(S),pe=S.material;if(W&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Rt.copy(S.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),Rt.copy(Ee.boundingSphere.center)),Rt.applyMatrix4(S.matrixWorld).applyMatrix4(Ye)),Array.isArray(pe)){const Te=Ee.groups;for(let Re=0,Ge=Te.length;Re<Ge;Re++){const Ke=Te[Re],Ae=pe[Ke.materialIndex];Ae&&Ae.visible&&M.push(S,Ee,Ae,Y,Rt.z,Ke,I)}}else pe.visible&&M.push(S,Ee,pe,Y,Rt.z,null,I)}}const me=S.children;for(let Ee=0,pe=me.length;Ee<pe;Ee++)Vr(me[Ee],I,Y,W)}function dl(S,I,Y,W){const{opaque:X,transmissive:me,transparent:Ee}=S;T.setupLightsView(Y),Je===!0&&Le.setGlobalState(L.clippingPlanes,Y),W&&_.viewport(J.copy(W)),X.length>0&&Ps(X,I,Y),me.length>0&&Ps(me,I,Y),Ee.length>0&&Ps(Ee,I,Y),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function fl(S,I,Y,W){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[W.id]===void 0){const Ae=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[W.id]=new hn(1,1,{generateMipmaps:!0,type:Ae?Mn:Jt,minFilter:oi,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:qe.workingColorSpace})}const me=T.state.transmissionRenderTarget[W.id],Ee=W.viewport||J;me.setSize(Ee.z*L.transmissionResolutionScale,Ee.w*L.transmissionResolutionScale);const pe=L.getRenderTarget(),Te=L.getActiveCubeFace(),Re=L.getActiveMipmapLevel();L.setRenderTarget(me),L.getClearColor(Ce),ke=L.getClearAlpha(),ke<1&&L.setClearColor(16777215,.5),L.clear(),gt&&ze.render(Y);const Ge=L.toneMapping;L.toneMapping=Sn;const Ke=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),T.setupLightsView(W),Je===!0&&Le.setGlobalState(L.clippingPlanes,W),Ps(S,Y,W),Z.updateMultisampleRenderTarget(me),Z.updateRenderTargetMipmap(me),nt.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let tt=0,yt=I.length;tt<yt;tt++){const dt=I[tt],{object:ot,geometry:Ut,material:ye,group:Bt}=dt;if(ye.side===Ln&&ot.layers.test(W.layers)){const je=ye.side;ye.side=Kt,ye.needsUpdate=!0,pl(ot,Y,W,Ut,ye,Bt),ye.side=je,ye.needsUpdate=!0,Ae=!0}}Ae===!0&&(Z.updateMultisampleRenderTarget(me),Z.updateRenderTargetMipmap(me))}L.setRenderTarget(pe,Te,Re),L.setClearColor(Ce,ke),Ke!==void 0&&(W.viewport=Ke),L.toneMapping=Ge}function Ps(S,I,Y){const W=I.isScene===!0?I.overrideMaterial:null;for(let X=0,me=S.length;X<me;X++){const Ee=S[X],{object:pe,geometry:Te,group:Re}=Ee;let Ge=Ee.material;Ge.allowOverride===!0&&W!==null&&(Ge=W),pe.layers.test(Y.layers)&&pl(pe,I,Y,Te,Ge,Re)}}function pl(S,I,Y,W,X,me){N!==null&&X.isNodeMaterial&&N.setObject(S,X),S.onBeforeRender(L,I,Y,W,X,me),S.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),X.onBeforeRender(L,I,Y,W,S,me),X.transparent===!0&&X.side===Ln&&X.forceSinglePass===!1?(X.side=Kt,X.needsUpdate=!0,L.renderBufferDirect(Y,I,W,X,S,me),X.side=ci,X.needsUpdate=!0,L.renderBufferDirect(Y,I,W,X,S,me),X.side=Ln):L.renderBufferDirect(Y,I,W,X,S,me),S.onAfterRender(L,I,Y,W,X,me)}function Ls(S,I,Y){I.isScene!==!0&&(I=Vt);const W=$.get(S),X=T.state.lights,me=T.state.shadowsArray,Ee=X.state.version,pe=le.getParameters(S,X.state,me,I,Y,T.state.lightProbeGridArray),Te=le.getProgramCacheKey(pe);let Re=W.programs;W.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?I.environment:null,W.fog=I.fog;const Ge=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;W.envMap=re.get(S.envMap||W.environment,Ge),W.envMapRotation=W.environment!==null&&S.envMap===null?I.environmentRotation:S.envMapRotation,Re===void 0&&(S.addEventListener("dispose",dn),Re=new Map,W.programs=Re);let Ke=Re.get(Te);if(Ke!==void 0){if(W.currentProgram===Ke&&W.lightsStateVersion===Ee)return gl(S,pe),Ke}else pe.uniforms=le.getUniforms(S),N!==null&&S.isNodeMaterial&&N.build(S,Y,pe),S.onBeforeCompile(pe,L),Ke=le.acquireProgram(pe,Te),Re.set(Te,Ke),W.uniforms=pe.uniforms;const Ae=W.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ae.clippingPlanes=Le.uniform),gl(S,pe),W.needsLights=Lh(S),W.lightsStateVersion=Ee,W.needsLights&&(Ae.ambientLightColor.value=X.state.ambient,Ae.lightProbe.value=X.state.probe,Ae.sunLights.value=X.state.sun,Ae.sunLightShadows.value=X.state.sunShadow,Ae.directionalLights.value=X.state.directional,Ae.directionalLightShadows.value=X.state.directionalShadow,Ae.spotLights.value=X.state.spot,Ae.spotLightShadows.value=X.state.spotShadow,Ae.rectAreaLights.value=X.state.rectArea,Ae.ltc_1.value=X.state.rectAreaLTC1,Ae.ltc_2.value=X.state.rectAreaLTC2,Ae.pointLights.value=X.state.point,Ae.pointLightShadows.value=X.state.pointShadow,Ae.hemisphereLights.value=X.state.hemi,Ae.sunShadowMatrix.value=X.state.sunShadowMatrix,Ae.sunShadowCascade.value=X.state.sunShadowCascade,Ae.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ae.spotLightMatrix.value=X.state.spotLightMatrix,Ae.spotLightMap.value=X.state.spotLightMap,Ae.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=T.state.lightProbeGridArray.length>0,W.currentProgram=Ke,W.uniformsList=null,Ke}function ml(S){if(S.uniformsList===null){const I=S.currentProgram.getUniforms();S.uniformsList=Tr.seqWithValue(I.seq,S.uniforms)}return S.uniformsList}function gl(S,I){const Y=$.get(S);Y.outputColorSpace=I.outputColorSpace,Y.batching=I.batching,Y.batchingColor=I.batchingColor,Y.instancing=I.instancing,Y.instancingColor=I.instancingColor,Y.instancingMorph=I.instancingMorph,Y.skinning=I.skinning,Y.morphTargets=I.morphTargets,Y.morphNormals=I.morphNormals,Y.morphColors=I.morphColors,Y.morphTargetsCount=I.morphTargetsCount,Y.numClippingPlanes=I.numClippingPlanes,Y.numIntersection=I.numClipIntersection,Y.vertexAlphas=I.vertexAlphas,Y.vertexTangents=I.vertexTangents,Y.toneMapping=I.toneMapping}function Rh(S,I){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;v.setFromMatrixPosition(I.matrixWorld);for(let Y=0,W=S.length;Y<W;Y++){const X=S[Y];if(X.texture!==null&&X.boundingBox.containsPoint(v))return X}return null}function Ch(S,I,Y,W,X){I.isScene!==!0&&(I=Vt),Z.resetTextureUnits();const me=I.fog,Ee=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?I.environment:null,pe=j===null?L.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:qe.workingColorSpace,Te=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Re=re.get(W.envMap||Ee,Te),Ge=W.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Ke=!!Y.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ae=!!Y.morphAttributes.position,tt=!!Y.morphAttributes.normal,yt=!!Y.morphAttributes.color;let dt=Sn;W.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(dt=L.toneMapping);const ot=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Ut=ot!==void 0?ot.length:0,ye=$.get(W),Bt=T.state.lights;if(Je===!0&&(lt===!0||S!==q)){const ut=S===q&&W.id===K;Le.setState(W,S,ut)}let je=!1;W.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Bt.state.version||ye.outputColorSpace!==pe||X.isBatchedMesh&&ye.batching===!1||!X.isBatchedMesh&&ye.batching===!0||X.isBatchedMesh&&ye.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&ye.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&ye.instancing===!1||!X.isInstancedMesh&&ye.instancing===!0||X.isSkinnedMesh&&ye.skinning===!1||!X.isSkinnedMesh&&ye.skinning===!0||X.isInstancedMesh&&ye.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&ye.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&ye.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&ye.instancingMorph===!1&&X.morphTexture!==null||ye.envMap!==Re||W.fog===!0&&ye.fog!==me||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==Le.numPlanes||ye.numIntersection!==Le.numIntersection)||ye.vertexAlphas!==Ge||ye.vertexTangents!==Ke||ye.morphTargets!==Ae||ye.morphNormals!==tt||ye.morphColors!==yt||ye.toneMapping!==dt||ye.morphTargetsCount!==Ut||!!ye.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(je=!0):(je=!0,ye.__version=W.version);let Qt=ye.currentProgram;je===!0&&(Qt=Ls(W,I,X),N&&W.isNodeMaterial&&N.onUpdateProgram(W,Qt,ye));let fn=!1,Bn=!1,xi=!1;const at=Qt.getUniforms(),xt=ye.uniforms;if(_.useProgram(Qt.program)&&(fn=!0,Bn=!0,xi=!0),W.id!==K&&(K=W.id,Bn=!0),ye.needsLights){const ut=Rh(T.state.lightProbeGridArray,X);ye.lightProbeGrid!==ut&&(ye.lightProbeGrid=ut,Bn=!0)}if(fn||q!==S){_.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),at.setValue(k,"projectionMatrix",S.projectionMatrix),at.setValue(k,"viewMatrix",S.matrixWorldInverse);const Hn=at.map.cameraPosition;Hn!==void 0&&Hn.setValue(k,pt.setFromMatrixPosition(S.matrixWorld)),R.logarithmicDepthBuffer&&at.setValue(k,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&at.setValue(k,"isOrthographic",S.isOrthographicCamera===!0),q!==S&&(q=S,Bn=!0,xi=!0)}if(ye.needsLights&&(Bt.state.sunShadowMap.length>0&&at.setValue(k,"sunShadowMap",Bt.state.sunShadowMap,Z),Bt.state.directionalShadowMap.length>0&&at.setValue(k,"directionalShadowMap",Bt.state.directionalShadowMap,Z),Bt.state.spotShadowMap.length>0&&at.setValue(k,"spotShadowMap",Bt.state.spotShadowMap,Z),Bt.state.pointShadowMap.length>0&&at.setValue(k,"pointShadowMap",Bt.state.pointShadowMap,Z)),X.isSkinnedMesh){at.setOptional(k,X,"bindMatrix"),at.setOptional(k,X,"bindMatrixInverse");const ut=X.skeleton;ut&&(ut.boneTexture===null&&ut.computeBoneTexture(),at.setValue(k,"boneTexture",ut.boneTexture,Z))}X.isBatchedMesh&&(at.setOptional(k,X,"batchingTexture"),at.setValue(k,"batchingTexture",X._matricesTexture,Z),at.setOptional(k,X,"batchingIdTexture"),at.setValue(k,"batchingIdTexture",X._indirectTexture,Z),at.setOptional(k,X,"batchingColorTexture"),X._colorsTexture!==null&&at.setValue(k,"batchingColorTexture",X._colorsTexture,Z));const zn=Y.morphAttributes;if((zn.position!==void 0||zn.normal!==void 0||zn.color!==void 0)&&F.update(X,Y,Qt),(Bn||ye.receiveShadow!==X.receiveShadow)&&(ye.receiveShadow=X.receiveShadow,at.setValue(k,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&I.environment!==null&&(xt.envMapIntensity.value=I.environmentIntensity),xt.dfgLUT!==void 0&&(xt.dfgLUT.value=uv()),Bn){if(at.setValue(k,"toneMappingExposure",L.toneMappingExposure),ye.needsLights&&Ph(xt,xi),me&&W.fog===!0&&Pe.refreshFogUniforms(xt,me),Pe.refreshMaterialUniforms(xt,W,ee,V,T.state.transmissionRenderTarget[S.id]),ye.needsLights&&ye.lightProbeGrid){const ut=ye.lightProbeGrid;xt.probesSH.value=ut.texture,xt.probesMin.value.copy(ut.boundingBox.min),xt.probesMax.value.copy(ut.boundingBox.max),xt.probesResolution.value.copy(ut.resolution)}Tr.upload(k,ml(ye),xt,Z)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Tr.upload(k,ml(ye),xt,Z),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&at.setValue(k,"center",X.center),at.setValue(k,"modelViewMatrix",X.modelViewMatrix),at.setValue(k,"normalMatrix",X.normalMatrix),at.setValue(k,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){const ut=W.uniformsGroups;for(let Hn=0,vi=ut.length;Hn<vi;Hn++){const xl=ut[Hn];ie.update(xl,Qt),ie.bind(xl,Qt)}}return Qt}function Ph(S,I){S.ambientLightColor.needsUpdate=I,S.lightProbe.needsUpdate=I,S.sunLights.needsUpdate=I,S.sunLightShadows.needsUpdate=I,S.directionalLights.needsUpdate=I,S.directionalLightShadows.needsUpdate=I,S.pointLights.needsUpdate=I,S.pointLightShadows.needsUpdate=I,S.spotLights.needsUpdate=I,S.spotLightShadows.needsUpdate=I,S.rectAreaLights.needsUpdate=I,S.hemisphereLights.needsUpdate=I}function Lh(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return G},this.getRenderTarget=function(){return j},this.setRenderTargetTextures=function(S,I,Y){const W=$.get(S);W.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),$.get(S.texture).__webglTexture=I,$.get(S.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:Y,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,I){const Y=$.get(S);Y.__webglFramebuffer=I,Y.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(S,I=0,Y=0){j=S,B=I,G=Y;let W=null,X=!1,me=!1;if(S){const pe=$.get(S);if(pe.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(k.FRAMEBUFFER,pe.__webglFramebuffer),J.copy(S.viewport),be.copy(S.scissor),Me=S.scissorTest,_.viewport(J),_.scissor(be),_.setScissorTest(Me),K=-1;return}else if(pe.__webglFramebuffer===void 0)Z.setupRenderTarget(S);else if(pe.__hasExternalTextures)Z.rebindTextures(S,$.get(S.texture).__webglTexture,$.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Ge=S.depthTexture;if(pe.__boundDepthTexture!==Ge){if(Ge!==null&&$.has(Ge)&&(S.width!==Ge.image.width||S.height!==Ge.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(S)}}const Te=S.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(me=!0);const Re=$.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Re[I])?W=Re[I][Y]:W=Re[I],X=!0):S.samples>0&&Z.useMultisampledRTT(S)===!1?W=$.get(S).__webglMultisampledFramebuffer:Array.isArray(Re)?W=Re[Y]:W=Re,J.copy(S.viewport),be.copy(S.scissor),Me=S.scissorTest}else J.copy(Se).multiplyScalar(ee).floor(),be.copy(Xe).multiplyScalar(ee).floor(),Me=Et;if(Y!==0&&(W=z),_.bindFramebuffer(k.FRAMEBUFFER,W)&&_.drawBuffers(S,W),_.viewport(J),_.scissor(be),_.setScissorTest(Me),X){const pe=$.get(S.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+I,pe.__webglTexture,Y)}else if(me){const pe=I;for(let Te=0;Te<S.textures.length;Te++){const Re=$.get(S.textures[Te]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+Te,Re.__webglTexture,Y,pe)}}else if(S!==null&&Y!==0){const pe=$.get(S.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,pe.__webglTexture,Y)}K=-1};function _l(S){const I=$.get(S);return(I.__readFormat!==S.format||I.__readType!==S.type)&&(I.__readFormat=S.format,I.__readType=S.type,I.__formatReadable=R.textureFormatReadable(S.format),I.__typeReadable=R.textureTypeReadable(S.type)),I}this.readRenderTargetPixels=function(S,I,Y,W,X,me,Ee,pe=0){if(!(S&&S.isWebGLRenderTarget)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=$.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ee!==void 0&&(Te=Te[Ee]),Te){_.bindFramebuffer(k.FRAMEBUFFER,Te);try{const Re=S.textures[pe],Ge=Re.format,Ke=Re.type;S.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+pe);const Ae=_l(Re);if(Ae.__formatReadable===!1){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ae.__typeReadable===!1){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=S.width-W&&Y>=0&&Y<=S.height-X&&k.readPixels(I,Y,W,X,he.convert(Ge),he.convert(Ke),me)}finally{const Re=j!==null?$.get(j).__webglFramebuffer:null;_.bindFramebuffer(k.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(S,I,Y,W,X,me,Ee,pe=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=$.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ee!==void 0&&(Te=Te[Ee]),Te)if(I>=0&&I<=S.width-W&&Y>=0&&Y<=S.height-X){_.bindFramebuffer(k.FRAMEBUFFER,Te);const Re=S.textures[pe],Ge=Re.format,Ke=Re.type;S.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+pe);const Ae=_l(Re);if(Ae.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ae.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const tt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,tt),k.bufferData(k.PIXEL_PACK_BUFFER,me.byteLength,k.STREAM_READ),k.readPixels(I,Y,W,X,he.convert(Ge),he.convert(Ke),0),k.bindBuffer(k.PIXEL_PACK_BUFFER,null);const yt=j!==null?$.get(j).__webglFramebuffer:null;_.bindFramebuffer(k.FRAMEBUFFER,yt);const dt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await $f(k,dt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,tt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,me),k.bindBuffer(k.PIXEL_PACK_BUFFER,null),k.deleteBuffer(tt),k.deleteSync(dt),me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,I=null,Y=0){const W=Math.pow(2,-Y),X=Math.floor(S.image.width*W),me=Math.floor(S.image.height*W),Ee=I!==null?I.x:0,pe=I!==null?I.y:0;Z.setTexture2D(S,0),k.copyTexSubImage2D(k.TEXTURE_2D,Y,0,0,Ee,pe,X,me),_.unbindTexture()},this.copyTextureToTexture=function(S,I,Y=null,W=null,X=0,me=0){let Ee,pe,Te,Re,Ge,Ke,Ae,tt,yt;const dt=S.isCompressedTexture?S.mipmaps[me]:S.image;if(Y!==null)Ee=Y.max.x-Y.min.x,pe=Y.max.y-Y.min.y,Te=Y.isBox3?Y.max.z-Y.min.z:1,Re=Y.min.x,Ge=Y.min.y,Ke=Y.isBox3?Y.min.z:0;else{const xt=Math.pow(2,-X);Ee=Math.floor(dt.width*xt),pe=Math.floor(dt.height*xt),S.isDataArrayTexture?Te=dt.depth:S.isData3DTexture?Te=Math.floor(dt.depth*xt):Te=1,Re=0,Ge=0,Ke=0}W!==null?(Ae=W.x,tt=W.y,yt=W.z):(Ae=0,tt=0,yt=0);const ot=he.convert(I.format),Ut=he.convert(I.type);let ye;I.isData3DTexture?(Z.setTexture3D(I,0),ye=k.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Z.setTexture2DArray(I,0),ye=k.TEXTURE_2D_ARRAY):(Z.setTexture2D(I,0),ye=k.TEXTURE_2D),_.activeTexture(k.TEXTURE0),_.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,I.flipY),_.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),_.pixelStorei(k.UNPACK_ALIGNMENT,I.unpackAlignment);const Bt=_.getParameter(k.UNPACK_ROW_LENGTH),je=_.getParameter(k.UNPACK_IMAGE_HEIGHT),Qt=_.getParameter(k.UNPACK_SKIP_PIXELS),fn=_.getParameter(k.UNPACK_SKIP_ROWS),Bn=_.getParameter(k.UNPACK_SKIP_IMAGES);_.pixelStorei(k.UNPACK_ROW_LENGTH,dt.width),_.pixelStorei(k.UNPACK_IMAGE_HEIGHT,dt.height),_.pixelStorei(k.UNPACK_SKIP_PIXELS,Re),_.pixelStorei(k.UNPACK_SKIP_ROWS,Ge),_.pixelStorei(k.UNPACK_SKIP_IMAGES,Ke);const xi=S.isDataArrayTexture||S.isData3DTexture,at=I.isDataArrayTexture||I.isData3DTexture;if(S.isDepthTexture){const xt=$.get(S),zn=$.get(I),ut=$.get(xt.__renderTarget),Hn=$.get(zn.__renderTarget);_.bindFramebuffer(k.READ_FRAMEBUFFER,ut.__webglFramebuffer),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,Hn.__webglFramebuffer);for(let vi=0;vi<Te;vi++)xi&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,$.get(S).__webglTexture,X,Ke+vi),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,$.get(I).__webglTexture,me,yt+vi)),k.blitFramebuffer(Re,Ge,Ee,pe,Ae,tt,Ee,pe,k.DEPTH_BUFFER_BIT,k.NEAREST);_.bindFramebuffer(k.READ_FRAMEBUFFER,null),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(X!==0||S.isRenderTargetTexture||$.has(S)){const xt=$.get(S),zn=$.get(I);_.bindFramebuffer(k.READ_FRAMEBUFFER,P),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,O);for(let ut=0;ut<Te;ut++)xi?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,xt.__webglTexture,X,Ke+ut):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,xt.__webglTexture,X),at?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,zn.__webglTexture,me,yt+ut):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,zn.__webglTexture,me),X!==0?k.blitFramebuffer(Re,Ge,Ee,pe,Ae,tt,Ee,pe,k.COLOR_BUFFER_BIT,k.NEAREST):at?k.copyTexSubImage3D(ye,me,Ae,tt,yt+ut,Re,Ge,Ee,pe):k.copyTexSubImage2D(ye,me,Ae,tt,Re,Ge,Ee,pe);_.bindFramebuffer(k.READ_FRAMEBUFFER,null),_.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else at?S.isDataTexture||S.isData3DTexture?k.texSubImage3D(ye,me,Ae,tt,yt,Ee,pe,Te,ot,Ut,dt.data):I.isCompressedArrayTexture?k.compressedTexSubImage3D(ye,me,Ae,tt,yt,Ee,pe,Te,ot,dt.data):k.texSubImage3D(ye,me,Ae,tt,yt,Ee,pe,Te,ot,Ut,dt):S.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,me,Ae,tt,Ee,pe,ot,Ut,dt.data):S.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,me,Ae,tt,dt.width,dt.height,ot,dt.data):k.texSubImage2D(k.TEXTURE_2D,me,Ae,tt,Ee,pe,ot,Ut,dt);_.pixelStorei(k.UNPACK_ROW_LENGTH,Bt),_.pixelStorei(k.UNPACK_IMAGE_HEIGHT,je),_.pixelStorei(k.UNPACK_SKIP_PIXELS,Qt),_.pixelStorei(k.UNPACK_SKIP_ROWS,fn),_.pixelStorei(k.UNPACK_SKIP_IMAGES,Bn),me===0&&I.generateMipmaps&&k.generateMipmap(ye),_.unbindTexture()},this.initRenderTarget=function(S){$.get(S).__webglFramebuffer===void 0&&Z.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?Z.setTextureCube(S,0):S.isData3DTexture?Z.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?Z.setTexture2DArray(S,0):Z.setTexture2D(S,0),_.unbindTexture()},this.resetState=function(){B=0,G=0,j=null,_.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=qe._getUnpackColorSpace()}}const Tu={type:"change"},il={type:"start"},Eh={type:"end"},mr=new Xo,Au=new Pn,dv=Math.cos(70*Mr.DEG2RAD),Tt=new D,Wt=2*Math.PI,rt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Fa=1e-6;class fv extends fm{constructor(e,t=null){super(e,t),this.state=rt.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Wi.ROTATE,MIDDLE:Wi.DOLLY,RIGHT:Wi.PAN},this.touches={ONE:Hi.ROTATE,TWO:Hi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new Yn,this._lastTargetPosition=new D,this._quat=new Yn().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Jc,this._sphericalDelta=new Jc,this._scale=1,this._panOffset=new D,this._rotateStart=new xe,this._rotateEnd=new xe,this._rotateDelta=new xe,this._panStart=new xe,this._panEnd=new xe,this._panDelta=new xe,this._dollyStart=new xe,this._dollyEnd=new xe,this._dollyDelta=new xe,this._dollyDirection=new D,this._mouse=new xe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=mv.bind(this),this._onPointerDown=pv.bind(this),this._onPointerUp=gv.bind(this),this._onContextMenu=Mv.bind(this),this._onMouseWheel=vv.bind(this),this._onKeyDown=Sv.bind(this),this._onTouchStart=yv.bind(this),this._onTouchMove=bv.bind(this),this._onMouseDown=_v.bind(this),this._onMouseMove=xv.bind(this),this._interceptControlDown=Ev.bind(this),this._interceptControlUp=Tv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=rt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Tu),this.update(),this.state=rt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;Tt.copy(t).sub(this.target),Tt.applyQuaternion(this._quat),this._spherical.setFromVector3(Tt),this.autoRotate&&this.state===rt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Wt:n>Math.PI&&(n-=Wt),s<-Math.PI?s+=Wt:s>Math.PI&&(s-=Wt),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Tt.setFromSpherical(this._spherical),Tt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Tt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Tt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new D(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Tt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(mr.origin.copy(this.object.position),mr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(mr.direction))<dv?this.object.lookAt(this.target):(Au.setFromNormalAndCoplanarPoint(this.object.up,this.target),mr.intersectPlane(Au,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Fa||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Fa||this._lastTargetPosition.distanceToSquared(this.target)>Fa?(this.dispatchEvent(Tu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Wt/60*this.autoRotateSpeed*e:Wt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Tt.setFromMatrixColumn(t,0),Tt.multiplyScalar(-e),this._panOffset.add(Tt)}_panUp(e,t){this.screenSpacePanning===!0?Tt.setFromMatrixColumn(t,1):(Tt.setFromMatrixColumn(t,0),Tt.crossVectors(this.object.up,Tt)),Tt.multiplyScalar(e),this._panOffset.add(Tt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Tt.copy(s).sub(this.target);let r=Tt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Wt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Wt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Wt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Wt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Wt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Wt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Wt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Wt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new xe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function pv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function mv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function gv(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Eh),this.state=rt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function _v(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Wi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=rt.DOLLY;break;case Wi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=rt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=rt.ROTATE}break;case Wi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=rt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=rt.PAN}break;default:this.state=rt.NONE}this.state!==rt.NONE&&this.dispatchEvent(il)}function xv(i){switch(this.state){case rt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case rt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case rt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function vv(i){this.enabled===!1||this.enableZoom===!1||this.state!==rt.NONE||(i.preventDefault(),this.dispatchEvent(il),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Eh))}function Sv(i){this.enabled!==!1&&this._handleKeyDown(i)}function yv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Hi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=rt.TOUCH_ROTATE;break;case Hi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=rt.TOUCH_PAN;break;default:this.state=rt.NONE}break;case 2:switch(this.touches.TWO){case Hi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=rt.TOUCH_DOLLY_PAN;break;case Hi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=rt.TOUCH_DOLLY_ROTATE;break;default:this.state=rt.NONE}break;default:this.state=rt.NONE}this.state!==rt.NONE&&this.dispatchEvent(il)}function bv(i){switch(this._trackPointer(i),this.state){case rt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case rt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case rt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case rt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=rt.NONE}}function Mv(i){this.enabled!==!1&&i.preventDefault()}function Ev(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Tv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Av=750,wv=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,ai=i=>new D(i[0],i[1],i[2]),Oa=(i,e,t)=>({x:i.x+(e.x-i.x)*t,y:i.y+(e.y-i.y)*t,z:i.z+(e.z-i.z)*t});function wu(i){const t=document.createElement("canvas");t.width=256,t.height=256;const n=t.getContext("2d");if(n){n.clearRect(0,0,256,256);const r=Math.max(1,i.length),a=Math.max(52,Math.min(150,460/Math.pow(r,.72)));n.font=`600 ${a}px "Segoe UI", system-ui, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillStyle="#ffffff",n.fillText(i,256/2,256/2+a*.07)}const s=new Ip(t);return s.colorSpace=Xt,s.anisotropy=4,s}class Rv{constructor(e,t,n){Ct(this,"container");Ct(this,"palette");Ct(this,"renderer");Ct(this,"scene");Ct(this,"camera");Ct(this,"controls");Ct(this,"grid");Ct(this,"hemi");Ct(this,"objects",new Map);Ct(this,"textureCache",new Map);Ct(this,"geometryCache",new Map);Ct(this,"rafId",0);Ct(this,"disposed",!1);Ct(this,"anim",null);Ct(this,"homePos",new D(9,10.5,14.5));Ct(this,"homeTarget",new D(0,.4,0));Ct(this,"tick",()=>{if(this.disposed||(this.rafId=requestAnimationFrame(this.tick),document.hidden))return;const e=this.anim;if(e){const t=performance.now(),n=Math.min(1,(t-e.start)/e.duration),s=wv(n);for(const r of e.entries)this.applyEntry(r,s,n>=1);for(const r of e.gone)r.opacity=1-s,this.writeLiveOpacity(r);e.camera&&(this.camera.position.lerpVectors(e.camera.fromPos,e.camera.toPos,s),this.controls.target.lerpVectors(e.camera.fromTgt,e.camera.toTgt,s)),e.controlsLocked?this.controls.enabled=!1:this.controls.enabled=!0,this.controls.update(),this.renderer.render(this.scene,this.camera),n>=1&&this.finishTween();return}this.controls.update(),this.renderer.render(this.scene,this.camera)});this.container=e,this.palette=t;const s=Math.max(e.clientWidth||8,1),r=Math.max(e.clientHeight||8,1),a=new hv({antialias:!0,alpha:!1});a.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),a.setSize(s,r,!1),a.outputColorSpace=Xt,a.shadowMap.enabled=!0,a.shadowMap.type=Uu,a.domElement.style.display="block",a.domElement.style.width="100%",a.domElement.style.height="100%",a.domElement.setAttribute("aria-label","3D scene"),e.appendChild(a.domElement),this.renderer=a,this.scene=new Mp,this.scene.background=new He(t.background),this.camera=new jt(50,s/r,.1,500),n?(this.homePos=ai(n.position),this.homeTarget=ai(n.target),this.camera.position.copy(this.homePos)):this.camera.position.copy(this.homePos),this.camera.lookAt(this.homeTarget),this.controls=new fv(this.camera,a.domElement),this.controls.target.copy(this.homeTarget),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=5,this.controls.maxDistance=55,this.controls.maxPolarAngle=Math.PI*.52,this.controls.update(),this.grid=new eu(72,36,t.gridLine,t.gridCenter);const o=this.grid.material;o.transparent=!0,o.opacity=.5,this.grid.position.y=-.04,this.scene.add(this.grid),this.hemi=new rm(16777215,t.background,.9),this.scene.add(this.hemi);const l=new cm(16777215,1.6);l.position.set(10,18,8),l.castShadow=!0,l.shadow.mapSize.set(1024,1024),l.shadow.camera.left=-20,l.shadow.camera.right=20,l.shadow.camera.top=20,l.shadow.camera.bottom=-20,l.shadow.camera.far=60,l.shadow.bias=-4e-4,this.scene.add(l);const c=new om(16777215,.35,50);c.position.set(-9,7,-7),this.scene.add(c),this.rafId=requestAnimationFrame(this.tick)}apply(e,t){const n=t==null?void 0:t.camera;return t!=null&&t.animate&&!Cv(n)?this.applyAnimated(e,t==null?void 0:t.duration,n):this.applyInstant(e,n)}resetCamera(){this.disposed||(this.camera.position.copy(this.homePos),this.controls.target.copy(this.homeTarget),this.controls.update())}setPalette(e){if(!this.disposed){this.palette=e,this.scene.background=new He(e.background),this.hemi.groundColor.set(e.background),this.rebuildGrid();for(const t of this.objects.values())t.kind==="grid"?this.rebuildVisual(t,t.spec):this.syncMaterialColor(t)}}focusAt(e){if(this.disposed)return;const t=new D().subVectors(this.camera.position,this.controls.target),n=t.length();t.normalize(),this.controls.target.set(e[0],e[1],e[2]),this.camera.position.copy(this.controls.target).addScaledVector(t,n),this.controls.update()}resize(e,t){if(this.disposed)return;const n=Math.max(e,1),s=Math.max(t,1);this.renderer.setSize(n,s,!1),this.camera.aspect=n/s,this.camera.updateProjectionMatrix()}dispose(){if(!this.disposed){this.disposed=!0,cancelAnimationFrame(this.rafId),this.anim=null,this.controls.dispose();for(const e of this.objects.values())this.scene.remove(e.root),this.disposeRoot(e);this.objects.clear();for(const e of this.textureCache.values())e.dispose();this.textureCache.clear();for(const e of this.geometryCache.values())e.dispose();this.geometryCache.clear(),this.scene.remove(this.grid),this.grid.geometry.dispose(),this.grid.material.dispose(),this.renderer.dispose(),this.renderer.domElement.parentElement===this.container&&this.container.removeChild(this.renderer.domElement)}}applyInstant(e,t){this.cancelTween();const n=new Set(e.map(s=>s.id));for(const[s,r]of Array.from(this.objects.entries()))n.has(s)||(this.scene.remove(r.root),this.disposeRoot(r),this.objects.delete(s));for(const s of e){const r=this.getOrCreateLive(s);this.syncSpec(r,s),this.writeTransform(r,s,!0),this.syncMaterialColor(r)}return t&&(this.camera.position.set(...t.position),this.controls.target.set(...t.target),this.controls.update()),Promise.resolve()}applyAnimated(e,t,n){this.cancelTween();const s=new Set(e.map(u=>u.id)),r=[];for(const[u,m]of Array.from(this.objects.entries()))s.has(u)||r.push(m);const a=[];for(const u of e){const m=this.objects.has(u.id),h=this.getOrCreateLive(u),p=this.captureTransform(h),g=this.targetTransform(u),y=m?p:{...g,scl:{x:.001,y:.001,z:.001},opacity:0};this.syncSpec(h,u),a.push({live:h,from:y,to:g,orbit:this.orbitInfoFrom(u)})}for(const u of a)this.syncMaterialColor(u.live);for(const u of r)this.syncMaterialColor(u);let o=null,l=!1;n&&(o={fromPos:this.camera.position.clone(),toPos:ai(n.position),fromTgt:this.controls.target.clone(),toTgt:ai(n.target)},l=!0);const c=Math.max(1,t??Av);return new Promise(u=>{this.anim={start:performance.now(),duration:c,entries:a,gone:r,camera:o,controlsLocked:l,resolve:u}})}applyEntry(e,t,n){const{live:s}=e;let r;if(e.orbit){const l=e.orbit,c=l.fromAngle+(l.toAngle-l.fromAngle)*t;r={x:l.cx+l.radius*Math.cos(c),y:l.y,z:l.cz+l.radius*Math.sin(c)}}else r=Oa(e.from.pos,e.to.pos,t);s.root.position.set(r.x,r.y,r.z);const a=Oa(e.from.rot,e.to.rot,t);s.root.rotation.set(a.x,a.y,a.z);const o=Oa(e.from.scl,e.to.scl,t);s.root.scale.set(o.x,o.y,o.z),s.opacity=e.from.opacity+(e.to.opacity-e.from.opacity)*t,s.emphasize=n?e.to.emphasize:e.from.emphasize,n?s.root.visible=e.to.visible:s.root.visible=e.from.visible||e.to.visible,this.writeLiveOpacity(s),this.writeEmissive(s)}finishTween(){const e=this.anim;if(e){this.anim=null;for(const t of e.gone)this.scene.remove(t.root),this.disposeRoot(t),this.objects.delete(t.id);e.camera&&(this.controls.enabled=!0),e.resolve()}}cancelTween(){if(!this.anim)return;const e=this.anim;this.anim=null,e.camera&&(this.controls.enabled=!0),e.resolve()}getOrCreateLive(e){const t=this.objects.get(e.id);if(t)return t;const{root:n,materials:s,geometry:r,arrow:a,spriteTexture:o}=this.buildRoot(e),l=e.tone??"muted",c={id:e.id,kind:e.kind,root:n,materials:s,spec:e,tone:l,opacity:1,emphasize:!1,geometry:r,lastKey:this.paramKey(e),arrow:a,spriteTexture:o};return this.objects.set(e.id,c),n.visible=!1,this.scene.add(n),c}buildRoot(e){var r;const t=e.tone??"muted",n=zs(this.palette,t,"muted"),s=new Gi;switch(s.name=e.id,e.kind){case"box":{const a=e.size??[1,1,1],o=this.geometry("box",`${a[0]}|${a[1]}|${a[2]}`,()=>new di(a[0],a[1],a[2])),l=new si({color:n,emissive:n,emissiveIntensity:.04,roughness:.45,metalness:.15}),c=new Gt(o,l);return c.castShadow=!0,c.receiveShadow=!0,s.add(c),{root:s,materials:[l],geometry:o,arrow:null,spriteTexture:null}}case"sphere":{const a=(((r=e.size)==null?void 0:r[0])??e.radius??.5)||.5,o=e.segments??32,l=this.geometry("sphere",`${a}|${o}`,()=>new Jo(a,o,o)),c=new si({color:n,emissive:n,emissiveIntensity:.1,roughness:.35,metalness:.2}),u=new Gt(l,c);return u.castShadow=!0,u.receiveShadow=!0,s.add(u),{root:s,materials:[c],geometry:l,arrow:null,spriteTexture:null}}case"glyph":{const a=e.label??"?";let o=this.textureCache.get(a);o||(o=wu(a),this.textureCache.set(a,o));const l=new Er({map:o,transparent:!0,depthWrite:!1,color:n}),c=new Fc(l),u=e.glyphScale??1;return c.scale.set(u,u,1),c.renderOrder=5,s.add(c),{root:s,materials:[l],geometry:null,arrow:null,spriteTexture:o}}case"ring":{const a=e.ringRadius??1,o=e.ringTube??.2,l=this.geometry("ring",`${a}|${o}`,()=>new Qo(a,o,12,72)),c=new si({color:n,emissive:n,emissiveIntensity:.12,roughness:.55,metalness:.2}),u=new Gt(l,c);return u.castShadow=!0,u.receiveShadow=!0,u.rotation.set(Math.PI/2,0,0),s.add(u),{root:s,materials:[c],geometry:l,arrow:null,spriteTexture:null}}case"arrow":{if(e.from&&e.to){const a=ai(e.from),o=ai(e.to),l=new D().subVectors(o,a),c=Math.max(l.length(),.001);l.normalize();const u=Math.min(1.2,Math.max(.45,c*.22)),m=new dm(l,a,c,n,u,Math.max(.18,u*.45));s.add(m);const h=[m.line.material,m.cone.material];return{root:s,materials:h,geometry:null,arrow:{helper:m,from:e.from,to:e.to},spriteTexture:null}}return{root:s,materials:[],geometry:null,arrow:null,spriteTexture:null}}case"arc":{const a=e.points??[],o=e.ringTube??.16,l=a.map(h=>h.join(",")).join("|"),c=this.geometry("arc",l,()=>{const h=new hh(a.map(p=>ai(p)),!1,"catmullrom",.5);return new el(h,Math.max(32,a.length*5),o,8,!1)}),u=new si({color:n,emissive:n,emissiveIntensity:.3,roughness:.5,metalness:.1}),m=new Gt(c,u);return m.castShadow=!0,s.add(m),{root:s,materials:[u],geometry:c,arrow:null,spriteTexture:null}}case"grid":return this.buildGrid(e);default:return{root:s,materials:[],geometry:null,arrow:null,spriteTexture:null}}}buildGrid(e){const t=e.grid,n=new Gi;n.name=e.id;const s=[],r=(t==null?void 0:t.height)??.12;return((t==null?void 0:t.layers)??[]).forEach((o,l)=>{const c=Math.max(1,o.rows),u=Math.max(1,o.cols),m=o.cellSize??1,h=o.gap??.14,p=this.geometry("cell",`${r}|${m}`,()=>new di(m,r,m)),g=m+h,y=m+h,f=(u-1)*g/2,d=(c-1)*y/2,E=l*(r+.32);o.cells.forEach((w,v)=>{if(w)for(let M=0;M<u;M++){const T=w[M];if(!T)continue;const C=M*g-f,x=v*y-d,A=T.tone??e.tone??"muted",L=zs(this.palette,A,"muted"),U=new Gt(p,new si({color:L,emissive:L,emissiveIntensity:T.emphasize?.42:.1,roughness:.42,metalness:.14,transparent:(T.opacity??1)<.999,opacity:T.opacity??1}));U.position.set(C,E+(T.visible??!0?0:-2),x),U.visible=T.visible??!0,U.castShadow=!0,U.receiveShadow=!0,n.add(U);const N=U.material;if(s.push(N),T.label){let z=this.textureCache.get(T.label);z||(z=wu(T.label),this.textureCache.set(T.label,z));const P=new Er({map:z,transparent:!0,depthWrite:!1,color:L,opacity:T.opacity??1}),O=new Fc(P),B=o.labelScale??.78,G=(T.label.length>1?.92:1.05)*m*B;O.scale.set(G,G,1),O.position.set(C,E+r+.09,x),O.renderOrder=6,n.add(O),s.push(P)}}})}),{root:n,materials:s,geometry:null,arrow:null,spriteTexture:null}}geometry(e,t,n){const s=`${e}|${t}`;let r=this.geometryCache.get(s);return r||(r=n(),this.geometryCache.set(s,r)),r}syncSpec(e,t){e.spec=t,e.tone=t.tone??e.tone??"muted";const n=this.paramKey(t);t.kind!=="glyph"&&t.kind!=="arrow"&&e.lastKey!==n&&this.rebuildVisual(e,t),e.arrow&&t.kind==="arrow"&&t.from&&t.to&&(e.arrow.from[0]!==t.from[0]||e.arrow.from[1]!==t.from[1]||e.arrow.from[2]!==t.from[2]||e.arrow.to[0]!==t.to[0]||e.arrow.to[1]!==t.to[1]||e.arrow.to[2]!==t.to[2])&&this.rebuildVisual(e,t)}paramKey(e){var t;switch(e.kind){case"box":return`box|${(e.size??[1,1,1]).map(n=>String(n)).join("|")}`;case"sphere":return`sphere|${((t=e.size)==null?void 0:t[0])??e.radius??.5}|${e.segments??32}`;case"ring":return`ring|${e.ringRadius??1}|${e.ringTube??.2}`;case"arc":return`arc|${(e.points??[]).map(n=>n.join(",")).join("|")}`;case"grid":return`grid|${JSON.stringify(e.grid)}`;default:return""}}rebuildVisual(e,t){const n=e.root;for(let r=n.children.length-1;r>=0;r--){const a=n.children[r];n.remove(a),this.disposeObject(a)}const s=this.buildRoot(t);for(const r of s.root.children)n.add(r);e.geometry=s.geometry,e.arrow=s.arrow,e.spriteTexture=s.spriteTexture,e.materials=s.materials,e.lastKey=this.paramKey(t),e.spec=t}captureTransform(e){return{pos:{x:e.root.position.x,y:e.root.position.y,z:e.root.position.z},rot:{x:e.root.rotation.x,y:e.root.rotation.y,z:e.root.rotation.z},scl:{x:e.root.scale.x,y:e.root.scale.y,z:e.root.scale.z},opacity:e.opacity,visible:e.root.visible,emphasize:e.emphasize}}targetTransform(e){var t,n,s,r,a,o;return{pos:{x:e.position[0],y:e.position[1],z:e.position[2]},rot:{x:Mr.degToRad(((t=e.rotation)==null?void 0:t[0])??0),y:Mr.degToRad(((n=e.rotation)==null?void 0:n[1])??0),z:Mr.degToRad(((s=e.rotation)==null?void 0:s[2])??0)},scl:{x:((r=e.scale)==null?void 0:r[0])??1,y:((a=e.scale)==null?void 0:a[1])??1,z:((o=e.scale)==null?void 0:o[2])??1},opacity:e.opacity??1,visible:e.visible??!0,emphasize:e.emphasize??!1}}writeTransform(e,t,n){const s=this.targetTransform(t),r=this.orbitInfoFrom(t);if(r&&n){const a=r.toAngle;e.root.position.set(r.cx+r.radius*Math.cos(a),r.y,r.cz+r.radius*Math.sin(a))}else e.root.position.set(s.pos.x,s.pos.y,s.pos.z);e.root.rotation.set(s.rot.x,s.rot.y,s.rot.z),e.root.scale.set(s.scl.x,s.scl.y,s.scl.z),e.opacity=s.opacity,e.emphasize=s.emphasize,e.root.visible=s.visible,this.writeLiveOpacity(e),this.writeEmissive(e)}orbitInfoFrom(e){const t=e.orbit;return t?{cx:t.center[0],cz:t.center[2],y:t.y,radius:t.radius,fromAngle:t.fromAngle,toAngle:t.toAngle}:null}syncMaterialColor(e){if(e.kind==="grid")return;const t=zs(this.palette,e.tone,"muted");for(const n of e.materials)n&&(n instanceof Er||n instanceof si)&&n.color.set(t);e.arrow&&e.arrow.helper.setColor(new He(t))}writeLiveOpacity(e){const t=Math.max(0,Math.min(1,e.opacity)),n=t<.999;for(const s of e.materials)s&&(s.transparent=n,s.opacity=t)}writeEmissive(e){if(e.kind!=="grid")for(const t of e.materials)t instanceof si&&(t.emissive.set(zs(this.palette,e.tone,"muted")),t.emissiveIntensity=e.emphasize?.55:.05)}rebuildGrid(){this.scene.remove(this.grid),this.grid.geometry.dispose(),this.grid.material.dispose(),this.grid=new eu(72,36,this.palette.gridLine,this.palette.gridCenter);const e=this.grid.material;e.transparent=!0,e.opacity=.5,this.grid.position.y=-.04,this.scene.add(this.grid)}disposeRoot(e){this.disposeObject(e.root),e.spriteTexture&&(e.spriteTexture=null)}disposeObject(e){e.traverse(t=>{const n=t;n.geometry&&n.geometry.dispose();const s=n.material;Array.isArray(s)?s.forEach(r=>r.dispose()):s&&s.dispose()})}}function Cv(i){return!!(i!=null&&i.instant)}const Pv=Ue.forwardRef(function({defaultCamera:e,theme:t,onReady:n,onFail:s},r){const a=Ue.useRef(null),o=Ue.useRef(null);return Ue.useImperativeHandle(r,()=>({apply(l,c){const u=o.current;return u?u.apply(l,c):Promise.resolve()},resetCamera(){var l;(l=o.current)==null||l.resetCamera()},focusAt(l){var c;(c=o.current)==null||c.focusAt(l)},toggleFullscreen(){var c;const l=a.current;l&&(document.fullscreenElement?document.exitFullscreen():(c=l.requestFullscreen)==null||c.call(l))}}),[]),Ue.useEffect(()=>{const l=a.current;if(!l)return;let c=!1,u=null;try{u=new Rv(l,mc(),e),o.current=u,n==null||n()}catch{s==null||s();return}const m=new ResizeObserver(()=>{!c&&o.current&&o.current.resize(l.clientWidth,l.clientHeight)});return m.observe(l),()=>{c=!0,m.disconnect(),u==null||u.dispose(),o.current=null}},[e]),Ue.useEffect(()=>{var l;(l=o.current)==null||l.setPalette(mc())},[t]),se.jsx("div",{ref:a,className:"sim3d-canvas",role:"img","aria-label":"3D scene"})}),Lv=[.25,.5,1,2,4],Dv=750,Nv={.25:2.6,.5:1.7,1:1,2:.58,4:.34},Uv={.25:520,.5:300,1:150,2:75,4:32},ka=(i,e)=>Math.round((i.duration??Dv)*Nv[e]);function Iv(){return typeof window>"u"||!window.matchMedia?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches}const Fv=i=>new Promise(e=>window.setTimeout(e,i));function Ba(i){var e;return!((e=i.camera)!=null&&e.instant)&&(i.duration??0)>0}function Ov(i,e){const[t,n]=Ue.useState(0),[s,r]=Ue.useState(!1),[a,o]=Ue.useState(1),[l,c]=Ue.useState(!1),[u,m]=Ue.useState(!1),h=Ue.useRef(0),p=Ue.useRef(!1),g=Ue.useRef(1),y=Ue.useRef(!1),f=Ue.useRef(!1),d=Ue.useRef(i),E=Ue.useRef(null);d.current=i,p.current=s,g.current=a,y.current=l,Ue.useEffect(()=>{f.current=Iv()},[]);const w=Ue.useCallback(j=>{h.current=j,n(j)},[]),v=Ue.useCallback(j=>{p.current=j,r(j)},[]);Ue.useEffect(()=>{const j=i.length>0?i[0].id:"",K=E.current;E.current=j,K!==null&&K!==j?(v(!1),w(0)):h.current>=i.length&&i.length>0&&w(Math.max(0,i.length-1))},[i,v,w]);const M=Ue.useCallback(async(j,K)=>{const q=d.current[j],J=e.current;!q||!J||(K&&Ba(q)&&!f.current?await J.apply(q.objects,{animate:!0,duration:ka(q,g.current),camera:q.camera}):J.apply(q.objects,{animate:!1,camera:q.camera}))},[e]),[,T]=Ue.useState(0);Ue.useEffect(()=>{!y.current||d.current.length===0||M(Math.min(h.current,d.current.length-1),!1)},[l,i,M,T]);const C=Ue.useCallback(j=>{const K=Math.min(Math.max(j,0),d.current.length-1);v(!1),w(K),M(K,!1)},[M,v,w]),x=Ue.useCallback(async j=>{const K=j+1,q=d.current[K],J=e.current;!q||!J||(Ba(q)&&!f.current?await J.apply(q.objects,{animate:!0,duration:ka(q,g.current),camera:q.camera}):J.apply(q.objects,{animate:!1,camera:q.camera}),!p.current&&w(K))},[w]),A=Ue.useCallback(()=>{h.current>=d.current.length-1||(v(!1),x(h.current))},[x,v]),L=Ue.useCallback(()=>{C(h.current-1)},[C]),U=Ue.useCallback(()=>{v(!1),w(0),M(0,!1)},[M,v,w]),N=Ue.useCallback(()=>{var j;(j=e.current)==null||j.resetCamera()},[e]),z=Ue.useCallback(()=>{if(p.current){v(!1);return}h.current>=d.current.length-1&&(w(0),M(0,!1)),v(!0)},[M,v,w]),P=Ue.useCallback(()=>{c(!0),T(j=>j+1)},[]),O=Ue.useCallback(()=>m(!0),[]),B=Ue.useCallback(j=>o(j),[]);Ue.useEffect(()=>{if(!s)return;(async()=>{let K=h.current;for(;K<d.current.length-1&&p.current;){const q=K+1,J=d.current[q],be=e.current;if(!J||!be)break;if(Ba(J)&&!f.current?await be.apply(J.objects,{animate:!0,duration:ka(J,g.current),camera:J.camera}):be.apply(J.objects,{animate:!1,camera:J.camera}),!p.current){w(q);break}if(w(q),await Fv(Uv[g.current]),!p.current)break}p.current&&v(!1)})()},[s]);const G=i.length;return{step:Math.min(t,Math.max(0,G-1)),playing:s,speed:a,ready:l,failed:u,atStart:t===0,atEnd:t>=Math.max(0,G-1),setReady:P,setFailed:O,setSpeed:B,goto:C,next:A,prev:L,restart:U,togglePlay:z,resetCamera:N}}function kv({playing:i,atStart:e,atEnd:t,speed:n,t:s,onPlayPause:r,onPrev:a,onNext:o,onRestart:l,onSpeed:c,onResetCamera:u,onFullscreen:m}){return se.jsx("div",{className:"sim3d-controls",children:se.jsxs("div",{className:"lab-controls",children:[se.jsxs("div",{className:"lab-controls-primary",children:[se.jsx("button",{type:"button",className:"lab-btn lab-btn-icon",onClick:l,disabled:e&&!i,title:s("simulation3d.common.restart"),"aria-label":s("simulation3d.common.restart"),children:"↺"}),se.jsx("button",{type:"button",className:"lab-btn lab-btn-icon",onClick:a,disabled:e,title:s("simulation3d.common.prev"),"aria-label":s("simulation3d.common.prev"),children:"‹"}),se.jsx("button",{type:"button",className:"lab-btn lab-btn-play",onClick:r,title:s(i?"simulation3d.common.pause":"simulation3d.common.play"),"aria-label":s(i?"simulation3d.common.pause":"simulation3d.common.play"),children:i?"❚❚":"▶"}),se.jsx("button",{type:"button",className:"lab-btn lab-btn-icon",onClick:o,disabled:t,title:s("simulation3d.common.next"),"aria-label":s("simulation3d.common.next"),children:"›"})]}),se.jsx("div",{className:"lab-controls-speed",role:"group","aria-label":s("simulation3d.common.speed"),children:Lv.map(h=>se.jsxs("button",{type:"button",className:`lab-btn lab-btn-seg${n===h?" is-active":""}`,onClick:()=>c(h),title:`${h}×`,children:[h,"×"]},h))}),se.jsx("button",{type:"button",className:"lab-btn sim3d-camera-btn",onClick:u,title:s("simulation3d.common.cameraReset"),children:s("simulation3d.common.cameraReset")}),se.jsx("button",{type:"button",className:"lab-btn sim3d-camera-btn",onClick:m,title:s("simulation3d.common.fullscreen"),"aria-label":s("simulation3d.common.fullscreen"),children:"⛶"})]})})}function Bv({steps:i,active:e,dir:t,t:n,onSelect:s}){const r=i.length-1;return se.jsxs("div",{className:"sim3d-timeline",dir:t,role:"tablist","aria-label":n("simulation3d.common.timeline")??"Timeline",children:[se.jsx("span",{className:"sim3d-timeline-progress","aria-hidden":"true",style:{width:r>0?`${e/r*100}%`:"0%"}}),i.map((a,o)=>{const l=Ha(n(a.titleKey),a.titleArgs);return se.jsxs("button",{type:"button",role:"tab","aria-selected":o===e,className:`sim3d-chip${o===e?" is-active":""}${o<e?" is-done":""}`,onClick:()=>s(o),title:l,"aria-label":l,children:[se.jsx("span",{className:`sim3d-chip-dot phase-${a.phase??"transform"}`}),se.jsx("span",{className:"sim3d-chip-num",children:o+1})]},a.id)})]})}function zv({steps:i,step:e,ctx:t}){const n=i[Math.min(e,i.length-1)];if(!n)return null;const{t:s}=t,r=Ha(s(n.titleKey),n.titleArgs),a=Ha(s(n.descKey),n.descArgs),o=n.meta;return se.jsxs("aside",{className:"sim3d-panel",children:[se.jsxs("div",{className:"sim3d-panel-kicker",children:[se.jsx("span",{children:s("simulation3d.common.currentStep")}),se.jsxs("span",{className:"sim3d-panel-count mono",dir:"ltr",children:[e+1," / ",i.length]})]}),se.jsx("h4",{className:"sim3d-panel-title",children:r}),se.jsx("p",{className:"sim3d-panel-label",children:s("simulation3d.common.happeningNow")}),se.jsx("p",{className:"sim3d-panel-desc",children:a}),o&&se.jsx(Hv,{meta:o,t:s}),t.result&&t.resultMatches&&se.jsx(vl,{label:s("simulation3d.common.executedResult"),value:typeof t.result.result=="string"||typeof t.result.result=="number"?String(t.result.result):"",tone:"output"}),t.demo&&se.jsx(vl,{label:s("simulation3d.common.demoInput"),value:String(t.inputs._demo??""),tone:"input"}),t.result&&!t.resultMatches&&se.jsx("p",{className:"lab-note lab-warn",children:s("simulation3d.common.staleResult")}),!t.result&&se.jsx("p",{className:"lab-note",children:s("simulation3d.common.runHint")})]})}function Hv({meta:i,t:e}){return se.jsxs("div",{className:"sim3d-inspector",children:[(i.event||i.operation)&&se.jsxs("div",{className:"sim3d-inspector-row",children:[i.event&&se.jsx("span",{className:`sim3d-event sim3d-event-${String(i.event).toLowerCase()}`,children:i.event.replace(/_/g," ")}),i.operation&&se.jsxs("span",{className:"sim3d-op",children:[e("simulation3d.inspector.operation"),": ",i.operation]}),i.level&&se.jsxs("span",{className:"sim3d-level",children:["· ",e(`simulation3d.level.${i.level}`)]})]}),i.formula&&se.jsx("div",{className:"sim3d-inspector-formula mono",dir:"ltr",children:i.formula}),i.changedValues&&i.changedValues.length>0&&se.jsxs("div",{className:"sim3d-changes",children:[se.jsx("div",{className:"sim3d-inspector-label",children:e("simulation3d.inspector.changes")}),se.jsx("table",{className:"sim3d-changes-table",children:se.jsx("tbody",{children:i.changedValues.map((t,n)=>se.jsxs("tr",{children:[se.jsx("td",{className:"sim3d-entity mono",dir:"ltr",children:t.entity}),se.jsx("td",{className:"sim3d-before mono",dir:"ltr",children:t.before}),se.jsx("td",{className:"sim3d-arrow","aria-hidden":"true",children:"→"}),se.jsx("td",{className:"sim3d-after mono",dir:"ltr",children:t.after}),t.reason&&se.jsx("td",{className:"sim3d-reason mono",dir:"ltr",children:t.reason})]},`${t.entity}-${n}`))})})]}),i.inputs&&Object.keys(i.inputs).length>0&&se.jsxs("div",{className:"sim3d-inspector-section",children:[se.jsx("div",{className:"sim3d-inspector-label",children:e("simulation3d.inspector.inputs")}),se.jsx(gr,{data:i.inputs})]}),i.outputs&&Object.keys(i.outputs).length>0&&se.jsxs("div",{className:"sim3d-inspector-section",children:[se.jsx("div",{className:"sim3d-inspector-label",children:e("simulation3d.inspector.outputs")}),se.jsx(gr,{data:i.outputs})]}),(i.stateBefore||i.stateAfter)&&se.jsxs("details",{className:"sim3d-inspector-state",children:[se.jsx("summary",{className:"sim3d-inspector-label",children:e("simulation3d.inspector.stateToggle")}),se.jsxs("div",{className:"sim3d-inspector-state-grid",children:[i.stateBefore&&se.jsxs("div",{className:"sim3d-state-col",children:[se.jsx("div",{className:"sim3d-state-cap",children:e("simulation3d.inspector.stateBefore")}),se.jsx(gr,{data:i.stateBefore})]}),i.stateAfter&&se.jsxs("div",{className:"sim3d-state-col",children:[se.jsx("div",{className:"sim3d-state-cap",children:e("simulation3d.inspector.stateAfter")}),se.jsx(gr,{data:i.stateAfter})]})]})]}),i.why&&se.jsx("p",{className:"sim3d-inspector-why",children:i.why})]})}function gr({data:i}){return se.jsx("div",{className:"sim3d-kv",children:Object.entries(i).map(([e,t])=>se.jsxs("div",{className:"sim3d-kv-item",children:[se.jsx("span",{className:"sim3d-kv-key mono",dir:"ltr",children:e}),se.jsx("span",{className:"sim3d-kv-val mono",dir:"ltr",children:t})]},e))})}function Gv({entries:i,t:e}){return i.length===0?null:se.jsx("div",{className:"sim3d-legend","aria-label":e("simulation3d.common.legend"),children:i.map(t=>se.jsxs("span",{className:"sim3d-legend-item",children:[se.jsx("span",{className:`sim3d-swatch sim3d-swatch-${t.tone}`,"aria-hidden":"true"}),se.jsx("span",{children:e(t.labelKey)})]},t.id))})}function Vv({t:i}){return se.jsxs("div",{className:"sim3d-status",children:[se.jsx("span",{className:"sim3d-hint",children:i("simulation3d.common.cameraHint")}),se.jsx("span",{className:"sim3d-kbd-hint",children:i("simulation3d.common.keyboard")})]})}function Wv({adapter:i,ctx:e}){const{t}=e,n=Ue.useMemo(()=>i.buildSteps(e),[i,e]),s=Ue.useRef(null),r=Ov(n,s),{step:a,playing:o,speed:l,failed:c,atStart:u,atEnd:m,setReady:h,setFailed:p,togglePlay:g,prev:y,next:f,restart:d,goto:E}=r,w=n[Math.min(a,Math.max(0,n.length-1))],v=t(`simulation.phase.${(w==null?void 0:w.phase)??"transform"}`),M=Ue.useCallback(()=>r.resetCamera(),[r]),T=Ue.useCallback(A=>r.setSpeed(A),[r]),C=Ue.useCallback(()=>{var A;return(A=s.current)==null?void 0:A.toggleFullscreen()},[]);Ue.useEffect(()=>{const A=L=>{var N;const U=L.target;U&&["INPUT","TEXTAREA","SELECT"].includes(U.tagName)||(L.code==="Space"?(L.preventDefault(),g()):L.key==="ArrowLeft"?(L.preventDefault(),y()):L.key==="ArrowRight"?(L.preventDefault(),f()):L.key==="R"&&L.shiftKey?d():(L.key==="f"||L.key==="F")&&((N=s.current)==null||N.toggleFullscreen()))};return window.addEventListener("keydown",A),()=>window.removeEventListener("keydown",A)},[g,y,f,d]);const x=Ue.useMemo(()=>{var A;return((A=i.getLegend)==null?void 0:A.call(i,e))??[]},[i,e]);return c||n.length===0?se.jsx("div",{className:"lab-root sim3d-root",children:se.jsx("div",{className:"sim3d-fallback",children:se.jsx("p",{className:"lab-note",children:t("simulation3d.common.webglUnsupported")})})}):se.jsxs("div",{className:"lab-root sim3d-root",children:[se.jsxs("header",{className:"lab-header",children:[se.jsxs("div",{className:"lab-header-main",children:[se.jsx("h3",{className:"lab-name",children:t(i.nameKey)}),se.jsxs("div",{className:"lab-tags",children:[se.jsx("span",{className:`lab-badge lab-phase-badge phase-${(w==null?void 0:w.phase)??"transform"}`,children:v}),i.educationalKey&&se.jsx("span",{className:"lab-badge lab-edu-badge",children:t("simulation3d.common.educational")}),e.demo&&se.jsx("span",{className:"lab-badge lab-demo-badge",children:t("simulation3d.common.demo")})]})]}),se.jsxs("div",{className:"lab-counter mono",dir:"ltr",children:[a+1," / ",n.length]})]}),se.jsx(Bv,{steps:n,active:a,dir:e.dir,t,onSelect:E}),se.jsx(kv,{playing:o,atStart:u,atEnd:m,speed:l,t,onPlayPause:g,onPrev:y,onNext:f,onRestart:d,onSpeed:T,onResetCamera:M,onFullscreen:C}),se.jsxs("div",{className:"lab-body sim3d-body",children:[se.jsxs("main",{className:"lab-main sim3d-main",children:[se.jsx(Pv,{ref:s,defaultCamera:i.defaultCamera,theme:e.theme,onReady:h,onFail:p}),se.jsx(Gv,{entries:x,t}),se.jsx(Vv,{t})]}),se.jsx(zv,{steps:n,step:a,ctx:e})]})]})}function Xv(){try{const i=document.createElement("canvas");return!!(i.getContext("webgl2")||i.getContext("webgl")||i.getContext("experimental-webgl"))}catch{return!1}}function qv({id:i,values:e,operation:t,result:n}){const{t:s}=Ru(),r=Ue.useMemo(Xv,[]),a=Ue.useMemo(()=>af(i),[i]),o=cf(a,i,e,t,n);return r?o.adapter?se.jsx(Wv,{adapter:o.adapter,ctx:o.ctx}):se.jsx("div",{className:"lab-root sim3d-root",children:se.jsx("div",{className:"sim3d-fallback",children:se.jsx("p",{className:"lab-note",children:s("simulation3d.common.unavailable")})})}):se.jsx("div",{className:"lab-root sim3d-root",children:se.jsxs("div",{className:"sim3d-fallback",children:[se.jsx("h3",{className:"sim3d-fallback-title",children:s("simulation3d.common.webglUnsupported")}),se.jsx("p",{className:"lab-note",children:s("simulation3d.common.webglHint")})]})})}export{qv as Simulation3DTab};
