// SATHRYX Festival of Lights — all interactions run locally in the browser.
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let toastTimer;
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}

// Ambient particle field and celebratory fireworks.
const ambient=$("#ambientCanvas"), ctx=ambient.getContext("2d");
let particles=[], bursts=[], lanterns=[];
function resizeAmbient(){ambient.width=innerWidth*devicePixelRatio;ambient.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
addEventListener("resize",resizeAmbient);resizeAmbient();
for(let i=0;i<65;i++)particles.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.4,a:Math.random()*.45+.08,s:Math.random()*.25+.08});
function launchFireworks(x=innerWidth*(.2+Math.random()*.6),y=innerHeight*(.15+Math.random()*.35)){
 const colors=["#ffd166","#ff4fc8","#32d9ff","#9b72ff","#70f0b0"];
 for(let i=0;i<65;i++){let angle=Math.PI*2*i/65+Math.random()*.08,speed=1.1+Math.random()*3.5;bursts.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:55+Math.random()*25,color:colors[Math.floor(Math.random()*colors.length)],r:1+Math.random()*2})}
}
function animateAmbient(){
 ctx.clearRect(0,0,innerWidth,innerHeight);
 particles.forEach(p=>{p.y-=p.s;p.a+=Math.random()*.012-.006;if(p.y<0)p.y=innerHeight;ctx.globalAlpha=Math.max(.05,p.a);ctx.fillStyle="#c6a8ff";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});
 bursts=bursts.filter(b=>b.life>0);
 bursts.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.vy+=.025;b.vx*=.985;b.vy*=.985;b.life--;ctx.globalAlpha=Math.min(1,b.life/35);ctx.fillStyle=b.color;ctx.shadowBlur=12;ctx.shadowColor=b.color;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill()});
 lanterns=lanterns.filter(l=>l.y>-100);
 lanterns.forEach(l=>{l.y-=l.speed;l.x+=Math.sin(l.y/40)*.35;ctx.globalAlpha=Math.min(.9,(innerHeight-l.y)/100);ctx.font="24px sans-serif";ctx.fillText("🏮",l.x,l.y)});
 ctx.globalAlpha=1;ctx.shadowBlur=0;requestAnimationFrame(animateAmbient)
}
animateAmbient();
function celebrate(){for(let i=0;i<4;i++)setTimeout(()=>launchFireworks(innerWidth*(.15+Math.random()*.7),innerHeight*(.12+Math.random()*.4)),i*260)}
$("#heroCelebrate").addEventListener("click",()=>{celebrate();toast("A little sparkle, just for you ✨")});
$("#fireworksBtn").addEventListener("click",()=>{celebrate();toast("The sky is glowing! 🎆")});
$("#finaleFireworks").addEventListener("click",()=>{celebrate();toast("Keep shining. Happy Diwali! 🪔")});
$("#lanternBtn").addEventListener("click",()=>{for(let i=0;i<5;i++)lanterns.push({x:innerWidth*(.15+Math.random()*.7),y:innerHeight+Math.random()*100,speed:.8+Math.random()*1.1});toast("Your wishes are on their way 🏮")});

// Diya counter and local session display.
let diyaCount=0;
$("#lightDiya").addEventListener("click",()=>{diyaCount++;$("#diyaCount").textContent=diyaCount;const d=document.createElement("div");d.className="mini-diya";d.innerHTML="<i></i>";$("#diyaRow").appendChild(d);if($("#diyaRow").children.length>8)$("#diyaRow").removeChild($("#diyaRow").firstElementChild);launchFireworks(innerWidth*.24,innerHeight*.68);toast("Diya lit. May its light travel far! 🪔")});

// Sound toggle uses a tiny generated tone, no audio file or external service.
let audioCtx=null,soundOn=false,soundTimer=null;
$("#soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("#soundToggle").textContent=soundOn?"♫̸":"♫";$("#soundToggle").style.color=soundOn?"#32d9ff":"";if(soundOn){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();let notes=[523.25,659.25,783.99,659.25],i=0;soundTimer=setInterval(()=>{if(!soundOn)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=notes[i++%notes.length];g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.04);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.5);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.52)},650);toast("Gentle celebration tones enabled")}catch(e){toast("Sound is not available in this browser")}}else{clearInterval(soundTimer);toast("Sound muted")}});

// Greeting card live preview, themes, PNG export and native share.
const themeClasses=["theme-violet","theme-sunset","theme-emerald","theme-midnight"];
function updateCard(){$("#previewFrom").textContent=$("#fromName").value.trim()||"SATHRYX";$("#previewTo").textContent=$("#toName").value.trim()?"FOR "+$("#toName").value.trim():"WITH LOVE";$("#previewMessage").textContent=$("#wishMessage").value.trim()||"Wishing you a bright and beautiful Diwali."}
["fromName","toName","wishMessage"].forEach(id=>$("#"+id).addEventListener("input",updateCard));
$$(".swatch").forEach(btn=>btn.addEventListener("click",()=>{$$(".swatch").forEach(b=>b.classList.remove("active"));btn.classList.add("active");$("#greetingCard").classList.remove(...themeClasses);$("#greetingCard").classList.add("theme-"+btn.dataset.theme)}));
function roundedRect(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
function makeGreetingImage(){
 const c=document.createElement("canvas");c.width=1200;c.height=1500;const g=c.getContext("2d");
 const themes={violet:["#60378e","#130d25"],sunset:["#b94a48","#24112d"],emerald:["#20866e","#101b2a"],midnight:["#5057a7","#101323"]};const t=$(".swatch.active")?.dataset.theme||"violet";
 let grad=g.createLinearGradient(0,0,1200,1500);grad.addColorStop(0,themes[t][0]);grad.addColorStop(1,themes[t][1]);g.fillStyle=grad;g.fillRect(0,0,1200,1500);
 const glow=g.createRadialGradient(600,360,10,600,360,650);glow.addColorStop(0,"#ffd16655");glow.addColorStop(1,"#ffd16600");g.fillStyle=glow;g.fillRect(0,0,1200,1500);
 g.strokeStyle="#fff2c477";g.lineWidth=3;g.strokeRect(55,55,1090,1390);g.strokeStyle="#ffffff33";g.strokeRect(75,75,1050,1350);
 g.textAlign="center";g.fillStyle="#ffd98c";g.font="90px serif";g.fillText("✺",600,290);g.font="30px sans-serif";g.letterSpacing="10px";g.fillText("A FESTIVAL OF LIGHT",600,390);
 g.fillStyle="#fff8e9";g.font="bold 150px Georgia";g.fillText("Happy",600,590);
 const gold=g.createLinearGradient(250,0,950,0);gold.addColorStop(0,"#fff0b0");gold.addColorStop(.5,"#ffc36b");gold.addColorStop(1,"#ff83c7");g.fillStyle=gold;g.font="italic bold 190px Georgia";g.fillText("Diwali",600,780);
 g.fillStyle="#ffd47c";g.font="45px sans-serif";g.fillText("✦  ━━━━━━━━━━━  ✦",600,900);
 g.fillStyle="#f7e7f2";g.font="34px sans-serif";const words=($("#wishMessage").value.trim()||"Wishing you a bright and beautiful Diwali.").split(" ");let lines=[],line="";words.forEach(w=>{let test=line?line+" "+w:w;if(g.measureText(test).width>850){lines.push(line);line=w}else line=test});if(line)lines.push(line);lines.slice(0,4).forEach((l,i)=>g.fillText(l,600,1000+i*58));
 g.fillStyle="#ffdfa0";g.font="26px sans-serif";g.fillText($("#toName").value.trim()?"FOR "+$("#toName").value.trim().toUpperCase():"WITH LOVE",600,1290);
 g.fillStyle="#fff";g.font="bold 42px sans-serif";g.letterSpacing="6px";g.fillText(($("#fromName").value.trim()||"SATHRYX").toUpperCase(),600,1360);
 g.fillStyle="#ffd98c";g.font="36px serif";g.fillText("✦   ·   ✧   ·   ✦",600,1430);
 return c;
}
$("#downloadCard").addEventListener("click",()=>{const a=document.createElement("a");a.download="SATHRYX-Diwali-Greeting.png";a.href=makeGreetingImage().toDataURL("image/png");a.click();toast("Your greeting card is ready to share! ✨")});
$("#shareCard").addEventListener("click",async()=>{const message=`${$("#previewTo").textContent}\n${$("#previewMessage").textContent}\n— ${$("#previewFrom").textContent}\nHappy Diwali from SATHRYX ✨`;try{if(navigator.share)await navigator.share({title:"SATHRYX — Happy Diwali",text:message});else if(navigator.clipboard){await navigator.clipboard.writeText(message);toast("Greeting copied. Paste it into your favourite app!")}else toast("Use Download greeting card to save your design")}catch(e){if(e.name!=="AbortError")toast("Sharing is not supported here")}});

// Rangoli drawing canvas with mirrored strokes and undo snapshots.
const rc=$("#rangoliCanvas"),rctx=rc.getContext("2d");let brush="#ff4fc8",drawing=false,last=null,history=[];
function rangoliBackground(){rctx.fillStyle="#0d0a17";rctx.fillRect(0,0,rc.width,rc.height);rctx.strokeStyle="#ffffff0b";rctx.lineWidth=1;for(let x=0;x<rc.width;x+=45){rctx.beginPath();rctx.moveTo(x,0);rctx.lineTo(x,rc.height);rctx.stroke()}for(let y=0;y<rc.height;y+=45){rctx.beginPath();rctx.moveTo(0,y);rctx.lineTo(rc.width,y);rctx.stroke()}rctx.strokeStyle="#ffffff18";rctx.beginPath();rctx.arc(rc.width/2,rc.height/2,115,0,Math.PI*2);rctx.stroke();rctx.beginPath();rctx.arc(rc.width/2,rc.height/2,180,0,Math.PI*2);rctx.stroke()}
rangoliBackground();
function point(e){const b=rc.getBoundingClientRect();return{x:(e.clientX-b.left)*rc.width/b.width,y:(e.clientY-b.top)*rc.height/b.height}}
function drawLine(a,b){const size=Number($("#brushSize").value);rctx.lineCap="round";rctx.lineJoin="round";rctx.strokeStyle=brush;rctx.lineWidth=size;rctx.shadowColor=brush;rctx.shadowBlur=12;rctx.beginPath();rctx.moveTo(a.x,a.y);rctx.lineTo(b.x,b.y);rctx.stroke();if($("#symmetry").checked){const cx=rc.width/2;rctx.beginPath();rctx.moveTo(2*cx-a.x,a.y);rctx.lineTo(2*cx-b.x,b.y);rctx.stroke()}rctx.shadowBlur=0}
rc.addEventListener("pointerdown",e=>{drawing=true;rc.setPointerCapture(e.pointerId);last=point(e);history.push(rctx.getImageData(0,0,rc.width,rc.height));if(history.length>15)history.shift();$("#canvasHint").style.display="none";drawLine(last,{x:last.x+.1,y:last.y+.1})});
rc.addEventListener("pointermove",e=>{if(!drawing)return;const p=point(e);drawLine(last,p);last=p});
["pointerup","pointercancel","lostpointercapture"].forEach(ev=>rc.addEventListener(ev,()=>{drawing=false;last=null}));
$$(".brush-color").forEach(b=>b.addEventListener("click",()=>{$$(".brush-color").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");brush=b.dataset.color}));
$("#undoDraw").addEventListener("click",()=>{if(history.length)rctx.putImageData(history.pop(),0,0);else toast("Nothing to undo yet")});
$("#clearDraw").addEventListener("click",()=>{history.push(rctx.getImageData(0,0,rc.width,rc.height));rangoliBackground();$("#canvasHint").style.display="block";toast("Fresh canvas. Let your creativity flow!")});
$("#saveRangoli").addEventListener("click",()=>{const a=document.createElement("a");a.download="SATHRYX-Rangoli-Art.png";a.href=rc.toDataURL("image/png");a.click();toast("Your rangoli artwork is saved!")});

// Local wish wall: user-submitted entries stay on this device.
const WISH_KEY="sathryx_diwali_wishes_v1";
function getWishes(){try{return JSON.parse(localStorage.getItem(WISH_KEY)||"[]")}catch(e){return[]}}
function renderWishes(){const wishes=getWishes();$("#wishCount").textContent=`${wishes.length} ${wishes.length===1?"WISH":"WISHES"}`;$("#wishList").innerHTML="";if(!wishes.length){$("#wishList").innerHTML='<div class="empty-wishes">✧ Your wish could be the first light here. ✧</div>';return}wishes.slice(0,30).forEach(w=>{const card=document.createElement("article");card.className="wish-item";const p=document.createElement("p"),strong=document.createElement("strong"),small=document.createElement("small");p.textContent=w.message;strong.textContent="✦ "+w.name;small.textContent=w.date;card.append(p,strong,small);$("#wishList").appendChild(card)})}
$("#wishForm").addEventListener("submit",e=>{e.preventDefault();const name=$("#wishAuthor").value.trim(),message=$("#wishText").value.trim();if(!name||!message)return;const wishes=getWishes();wishes.unshift({name,message,date:new Date().toLocaleDateString()});try{localStorage.setItem(WISH_KEY,JSON.stringify(wishes.slice(0,50)));renderWishes();$("#wishForm").reset();toast("Your light has been added to the wall. ✨")}catch(err){toast("Storage is full. Please clear a few browser items and try again.")}});
renderWishes();

// Mobile navigation and gentle reveal effects.
$("#menuBtn").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$$('#mainNav a').forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.animation="fadeUp .7s both";observer.unobserve(entry.target)}}),{threshold:.08});$$(".feature-card,.section-heading,.panel,.finale-content").forEach(el=>observer.observe(el))}

// Keep the cinematic hero video muted and looping for reliable autoplay.
const heroVideo=$(".hero-video");
if(heroVideo){heroVideo.muted=true;heroVideo.loop=true;heroVideo.playsInline=true;const playHero=()=>heroVideo.play().catch(()=>{});playHero();document.addEventListener("visibilitychange",()=>{if(!document.hidden)playHero()})}
