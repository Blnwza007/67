const CONFIG = {
  correctUsername: "kuaitun",       
  correctBirthday: "2026-07-04",   
  recipientName: "Namkhing",
  finalMessage:
`สุขสันต์วันเกิดย้อนหลัง ฉันพลาดเองที่จำวันเกิดมึงผิด จะไม่มีขอผิดพลาดแบบนี้แล้วก็ก็ก็ก็ ขอให้มีความสุข สอบติม.4โรงเรียนที่หวัง และไรว่ะปกติเขาอวยพรไรมั้ง อ่ออออย่ากดดันตัวเองเกินไปละ ชีวิตราบรื่น ขอให้สมหวังในเรื่องที่ต้องการ แล้วก็อีกไม่นานก็จะจบม.3ละใช่ชีวิตม.ต้นให้คุ้มเหอะ และก็ขอไข่ตุ๋นเป็นแฟนเลยเดี่ยวกูชาวย ปล.อย่าลืมเชิญกูถ้าแต่งงานกับไข่ตุ๋นสุดหล่อน่ะ สุดท้ายนี้ ขอให้อยู่กับไขข่ตุ๋นไปนานๆ`
};

const screens = {
  login: document.getElementById('screen-login'),
  loading: document.getElementById('screen-loading'),
  envelope: document.getElementById('screen-envelope'),
  final: document.getElementById('screen-final'),
};
function showScreen(name){
  Object.values(screens).forEach(s=>s.classList.remove('active'));
  screens[name].classList.add('active');
}

/* ---------- Toast helper ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toastEl.classList.remove('show'), 2200);
}

/* ---------- SCREEN 1: LOGIN ---------- */
const loginError = document.getElementById('login-error');
document.getElementById('btn-login').addEventListener('click', ()=>{
  const u = document.getElementById('input-username').value.trim().toLowerCase();
  const b = document.getElementById('input-birthday').value;
  if(u === CONFIG.correctUsername.toLowerCase() && b === CONFIG.correctBirthday){
    loginError.textContent = '';
    startLoading();
  }else{
    loginError.textContent = 'ชื่อผู้ใช้หรือรหัสวันเกิดไม่ถูกต้อง ลองใหม่นะ 🙃';
    screens.login.classList.add('shake');
    setTimeout(()=>screens.login.classList.remove('shake'), 400);
  }
});

/* ---------- SCREEN 2: LOADING ---------- */
const loadingPhrases = [
  "กำลังขุดคอกหมู...",
  "กำลังสร้างคำอวยพร...",
  "กำลังโหลด 108%...",
  "กำลังปลุกซองอวยพรให้ตื่น...",
  "แอบซ่อนเซอร์ไพรส์...",
  "เกือบเสร็จแล้ว..."
];
let pigClickCount = 0;
document.getElementById('pig-emoji').addEventListener('click', ()=>{
  pigClickCount++;
  if(pigClickCount === 5){
    triggerEasterEgg();
  }
});

function startLoading(){
  showScreen('loading');
  const textEl = document.getElementById('loading-text');
  const bar = document.getElementById('bar-fill');
  let pct = 0;
  let phraseIdx = 0;
  document.querySelector('.footer-note').style.display = 'none';
  textEl.textContent = loadingPhrases[0];
  const interval = setInterval(()=>{
    pct += Math.random()*18 + 8;
    if(pct >= 100){
      pct = 100;
      clearInterval(interval);
      setTimeout(startEnvelopeChase, 500);
    }
    bar.style.width = pct + '%';
    phraseIdx = Math.min(loadingPhrases.length-1, Math.floor(pct/17));
    textEl.textContent = loadingPhrases[phraseIdx];
  }, 380);
}

/* ---------- SCREEN 3: ENVELOPE CHASE ---------- */
const envelope = document.getElementById('envelope');
const zone = document.getElementById('envelope-zone');
const chaseHint = document.getElementById('chase-hint');
const missCounterEl = document.getElementById('miss-counter');

let requiredDodges = 0;
let currentMisses = 0;
let catchable = false;

function startEnvelopeChase(){
  showScreen('envelope');
  requiredDodges = Math.floor(Math.random() * 6) + 5; // 5-10
  currentMisses = 0;
  catchable = false;
  envelope.classList.remove('catchable', 'opened');
  placeEnvelope(true);
  chaseHint.textContent = 'ลองแตะซองดูสิ...';
  missCounterEl.textContent = '';
}

function placeEnvelope(center){
  const zw = zone.clientWidth;
  const zh = zone.clientHeight;
  const ew = envelope.offsetWidth;
  const eh = envelope.offsetHeight;
  let x, y;
  if(center){
    x = zw/2 - ew/2;
    y = zh/2 - eh/2;
  }else{
    x = Math.random() * (zw - ew);
    y = Math.random() * (zh - eh);
  }
  envelope.style.left = x + 'px';
  envelope.style.top = y + 'px';
}

function dodgeAway(){
  currentMisses++;
  const dodgeLines = [
    "ฮ่าๆ จับไม่ทันหรอก😛",
    "ช้าไปแล้วว",
    "อุ๊ย เกือบจับได้้",
    "ลองอีกทีสิิ",
    "อาจจะยังง~"
  ];
  chaseHint.textContent = dodgeLines[Math.floor(Math.random()*dodgeLines.length)];
  placeEnvelope(false);
  if(currentMisses >= requiredDodges){
    catchable = true;
    envelope.classList.add('catchable');
    chaseHint.textContent = 'เอาล่ะ จับได้แล้ว! กดเลย 🎯';
  }
}

envelope.addEventListener('click', ()=>{
  if(catchable){
    openQuestionModal();
  }else{
    dodgeAway();
  }
});
// Also dodge if the cursor merely hovers close, to feel "alive"
zone.addEventListener('mousemove', (e)=>{
  if(catchable) return;
  const rect = envelope.getBoundingClientRect();
  const zoneRect = zone.getBoundingClientRect();
  const cx = e.clientX - zoneRect.left;
  const cy = e.clientY - zoneRect.top;
  const ex = rect.left - zoneRect.left + rect.width/2;
  const ey = rect.top - zoneRect.top + rect.height/2;
  const dist = Math.hypot(cx-ex, cy-ey);
  if(dist < 55 && Math.random() < 0.35){
    dodgeAway();
  }
});

/* ---------- YES/NO MODAL ---------- */
const overlay = document.getElementById('overlay-question');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const modalBtns = document.querySelector('.modal-btns');

function openQuestionModal(){
  overlay.classList.add('active');
  btnNo.style.left = '';
  btnNo.style.top = '';
  btnNo.style.position = 'static';
}
function fleeNoButton(){
  const wrapRect = modalBtns.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();
  const maxX = wrapRect.width - btnRect.width;
  btnNo.style.position = 'absolute';
  btnNo.style.left = Math.max(0, Math.random() * maxX) + 'px';
  btnNo.style.top = (Math.random() * 6 - 3) + 'px';
}
btnNo.addEventListener('mouseenter', fleeNoButton);
btnNo.addEventListener('touchstart', (e)=>{ e.preventDefault(); fleeNoButton(); });
btnNo.addEventListener('click', (e)=>{
  e.preventDefault();
  fleeNoButton();
  showToast('ไม่มีทางเลือกอื่นนะ 😏');
});

btnYes.addEventListener('click', ()=>{
  overlay.classList.remove('active');
  openEnvelopeFinale();
});

/* ---------- ENVELOPE OPEN + FIREWORKS + MUSIC ---------- */
function openEnvelopeFinale(){
  envelope.classList.add('opened');
  chaseHint.textContent = 'กำลังเปิดซอง... 🎊';
  setTimeout(()=>{
    document.getElementById('final-message').textContent = CONFIG.finalMessage;
    document.getElementById('final-title').textContent = `สุขสันต์วันเกิด ${CONFIG.recipientName}! 🎉🐷`;
    showScreen('final');
    startFireworks();
    playHBDTune();
  }, 1000);
}

/* Replay */
document.getElementById('btn-replay').addEventListener('click', ()=>{
  document.getElementById('input-username').value = '';
  document.getElementById('input-birthday').value = '';
  showScreen('login');
});

/* ---------- Fireworks (canvas) ---------- */
function startFireworks(){
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  function resize(){
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  resize();
  let particles = [];
  const colors = ['#FF6F91','#FFC94A','#B8E3C4','#FFC2D1','#8AC6D1'];

  function burst(x, y){
    const count = 36;
    for(let i=0;i<count;i++){
      const angle = (Math.PI*2*i)/count + Math.random()*0.3;
      const speed = Math.random()*3.2 + 1.5;
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 60 + Math.random()*20,
        color: colors[Math.floor(Math.random()*colors.length)]
      });
    }
  }

  let running = true;
  let burstTimer = setInterval(()=>{
    burst(Math.random()*canvas.width, Math.random()*canvas.height*0.6 + canvas.height*0.1);
  }, 550);

  function loop(){
    if(!running) return;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    particles.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.life -= 1;
      ctx.globalAlpha = Math.max(p.life/80, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.6, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p=>p.life > 0);
    requestAnimationFrame(loop);
  }
  loop();
  burst(canvas.width/2, canvas.height/2);

  setTimeout(()=>{ clearInterval(burstTimer); }, 9000);
  setTimeout(()=>{ running = false; }, 12000);
}

/* ---------- Happy Birthday tune (synthesized, public-domain melody) ---------- */
function playHBDTune(){
  try{
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const noteFreq = {
      'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,'G4':392.00,
      'A4':440.00,'A#4':466.16,'B4':493.88,'C5':523.25
    };
    const unit = 0.42;
    const melody = [
      ['C4',0.5],['C4',0.5],['D4',1],['C4',1],['F4',1],['E4',2],
      ['C4',0.5],['C4',0.5],['D4',1],['C4',1],['G4',1],['F4',2],
      ['C4',0.5],['C4',0.5],['C5',1],['A4',1],['F4',1],['E4',1],['D4',2],
      ['A#4',0.5],['A#4',0.5],['A4',1],['F4',1],['G4',1],['F4',2]
    ];
    let t = ctx.currentTime + 0.1;
    melody.forEach(([note, dur])=>{
      const freq = noteFreq[note];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.28, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur*unit*0.95);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur*unit);
      t += dur*unit;
    });
  }catch(err){
    console.warn('Audio not available:', err);
  }
}

/* ---------- Easter Egg ---------- */
function triggerEasterEgg(){
  showToast('🥚 เจอ Easter Egg แล้ว! ฝนหมูกำลังจะตก!');
  spawnPigRain();
}
function spawnPigRain(){
  const app = document.getElementById('app');
  for(let i=0;i<24;i++){
    setTimeout(()=>{
      const pig = document.createElement('div');
      pig.textContent = '🐷';
      pig.style.position = 'absolute';
      pig.style.left = Math.random()*95 + '%';
      pig.style.top = '-40px';
      pig.style.fontSize = (Math.random()*18+16) + 'px';
      pig.style.zIndex = 50;
      pig.style.transition = 'transform 2.4s linear, top 2.4s linear';
      pig.style.pointerEvents = 'none';
      app.appendChild(pig);
      requestAnimationFrame(()=>{
        pig.style.top = '110%';
        pig.style.transform = `translateX(${(Math.random()*60-30)}px) rotate(${Math.random()*360}deg)`;
      });
      setTimeout(()=>pig.remove(), 2600);
    }, i*80);
  }
}

/* Secret key phrase easter egg: typing "หมู" anywhere also triggers rain */
let typedBuffer = '';
window.addEventListener('keydown', (e)=>{
  if(e.key.length === 1){
    typedBuffer += e.key;
    typedBuffer = typedBuffer.slice(-10);
  }
});