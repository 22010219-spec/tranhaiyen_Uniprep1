// --- 1. Clean Event Delegation for Expanding Windows ---
document.addEventListener('click', (e) => {
  const win = e.target.closest('.win');
  if (!win) return;
  
  const isExpanded = win.getAttribute('aria-expanded') === 'true';
  win.setAttribute('aria-expanded', !isExpanded);
  
  const tapme = win.querySelector('.tapme');
  if (tapme) tapme.textContent = isExpanded ? 'Close' : 'Open';
});

// --- 2. Generating Interests, Strengths, DNA, Quiz ---
const interests = [
  { title: "BIOLOGY", file: "cells and systems", tick: "var(--green-700)", items: ["How the body actually works"], desc: "The one subject I would still read with no test coming up. It is also the reason medicine is the plan and not just a phase." },
  { title: "DESIGN", file: "structure", tick: "var(--orange-deep)", items: ["Layout, colour, composition"], desc: "Basically problem solving that is also allowed to look good. It scratches the same part of my brain as biology, just with better colours." },
  { title: "ART", file: "hand made", tick: "var(--pink)", items: ["Drawing, mostly for myself"], desc: "This is how I think something through slowly. Also the fastest way I know to come back from a rough study block." },
  { title: "PHOTOGRAPHY", file: "light", tick: "", items: ["Framing and timing"], desc: "A camera makes you notice details you would otherwise walk right past, which turns out to be a useful habit for someone going into science." },
  { title: "SCIENCE", file: "minus physics", tick: "var(--green-700)", items: ["Chemistry especially", "Physics, less so"], desc: "Chemistry is the other half of the medicine plan, so it gets real effort. Physics and I have an understanding that we stay out of each other's way." },
  { title: "VOLLEYBALL", file: "on court", tick: "var(--tomato)", items: ["Fast decisions, on my feet"], desc: "The thing that stops my whole life from being a desk and a textbook. It keeps the energetic side of me actually used." }
];

const cardsContainer = document.getElementById('cards');
if (cardsContainer) {
  cardsContainer.innerHTML = interests.map(int => `
    <div class="win" tabindex="0" role="button" aria-expanded="false">
      <div class="chrome">
        <i class="dot3"></i><i class="dot3"></i><i class="dot3"></i>
        ${int.tick ? `<i class="tick" style="background: ${int.tick}"></i>` : ''}
        <span class="label">${int.file}</span>
      </div>
      <div class="in">
        <h3>${int.title}</h3>
        <ul>${int.items.map(i => `<li>${i}</li>`).join('')}</ul>
        <div class="extra">
          <div>
            <div class="extra-inner">
              <p>${int.desc}</p>
            </div>
          </div>
        </div>
        <div class="tapme">Open</div>
      </div>
    </div>
  `).join('');
}

const strengths = [
  { name: "Focus & Discipline", val: 90, c: "var(--green-700)" },
  { name: "Scientific Reasoning", val: 85, c: "var(--amber)" },
  { name: "Creative Expression", val: 75, c: "var(--highlight)" }
];

const barsContainer = document.getElementById('bars');
if (barsContainer) {
  barsContainer.innerHTML = strengths.map(s => `
    <div>
      <div class="bar-top"><h3>${s.name}</h3><em>${s.val}%</em></div>
      <div class="track"><div class="fill" style="width: 0; --c: ${s.c}"></div></div>
    </div>
  `).join('');
  
  setTimeout(() => {
    document.querySelectorAll('.fill').forEach((el, i) => {
      el.style.width = strengths[i].val + '%';
    });
  }, 300);
}

// Fixed DNA Animation
const rungsGroup = document.getElementById('rungs');
if (rungsGroup) {
  let rungsHTML = '';
  for(let i=0; i<10; i++) {
    const y = 16 + (i * 11);
    rungsHTML += `<path d="M14 ${y} L46 ${y}" class="rung" style="animation-delay: ${i * 0.2}s" />`;
  }
  rungsGroup.innerHTML = rungsHTML;
}

// 5-Question Quiz Restored
const quizData = [
  { q: "What MBTI personality type am I according to the test?", opts: ["INTJ", "ENFP", "ISTP", "ESFJ"], a: 1 },
  { q: "Which of these is one of my main study methods?", opts: ["All-nighters", "Highlighting everything", "Pomodoro timer", "Group study"], a: 2 },
  { q: "Which two subjects currently take up most of my time?", opts: ["Math & Physics", "Biology & Chemistry", "Art & History", "English & Literature"], a: 1 },
  { q: "Why am I focusing on getting a good IELTS score?", opts: ["To become a teacher", "To write a book", "To study abroad", "Just for fun"], a: 2 },
  { q: "What is my ultimate career goal?", opts: ["Professional volleyball player", "Photographer", "Software Engineer", "Doctor"], a: 3 }
];

const quizBody = document.getElementById('quizBody');
let currentQ = 0;
let score = 0;

function renderQuiz() {
  if (!quizBody) return;
  if (currentQ >= quizData.length) {
    quizBody.innerHTML = `
      <div class="qscore">You scored ${score} out of ${quizData.length}!</div>
      <p>${score === 5 ? "Perfect memory! You really paid attention." : "Thanks for playing along!"}</p>
      <button class="btn qagain" id="restartQuiz" type="button">Try Again</button>
    `;
    document.getElementById('restartQuiz').addEventListener('click', () => {
      currentQ = 0; score = 0; renderQuiz();
    });
    return;
  }
  
  const q = quizData[currentQ];
  quizBody.innerHTML = `
    <div class="qcount">Question ${currentQ + 1} of ${quizData.length}</div>
    <div class="qprompt">${q.q}</div>
    <div class="qopts">
      ${q.opts.map((opt, i) => `<button class="qopt" data-idx="${i}" type="button">${opt}</button>`).join('')}
    </div>
    <div style="display:none; margin-top:16px;" id="qNextWrap">
      <button class="btn qnext" id="nextBtn" type="button">Next Question</button>
    </div>
  `;
  
  const opts = quizBody.querySelectorAll('.qopt');
  const nextWrap = document.getElementById('qNextWrap');
  
  opts.forEach(btn => {
    btn.addEventListener('click', function() {
      if (nextWrap.style.display !== 'none') return;
      opts.forEach(b => b.setAttribute('disabled', 'true'));
      
      const idx = parseInt(this.getAttribute('data-idx'));
      if (idx === q.a) {
        this.classList.add('correct');
        score++;
      } else {
        this.classList.add('wrong');
        opts[q.a].classList.add('correct');
      }
      nextWrap.style.display = 'block';
    });
  });
  
  document.getElementById('nextBtn').addEventListener('click', () => {
    currentQ++;
    renderQuiz();
  });
}
renderQuiz();

// --- 3. Battery Slider Logic ---
const batteryInput = document.getElementById('battery');
const batteryRead = document.getElementById('batteryRead');
if (batteryInput && batteryRead) {
    const updateBattery = () => {
      const val = batteryInput.value;
      let text = "";
      if (val < 30) text = "<b>Recharging</b> Mostly hanging out with my sketchbook and a good playlist.";
      else if (val < 70) text = "<b>In the middle</b> Happy with a small group of friends.";
      else text = "<b>High energy</b> Ready to go out and talk to everyone.";
      batteryRead.innerHTML = text;
    }
    batteryInput.addEventListener('input', updateBattery);
    updateBattery();
}

// --- 4. Smooth Scroll ---
document.querySelectorAll('nav a, .stop').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = btn.getAttribute('href') || btn.dataset.go;
    const target = document.querySelector(targetId);
    if(target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// --- 5. Theme Swapper (Fluorescence) ---
const swapBtn = document.getElementById('swap');
if(swapBtn) {
  swapBtn.addEventListener('click', () => {
      const root = document.documentElement;
      if (root.getAttribute('data-theme') === 'dark') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'dark');
  });
}

// --- 6. ENFP Animated Sparks ---
const animCore = document.getElementById('enfpAnim');
if (animCore) {
    for(let i=0; i<8; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        const size = Math.random() * 8 + 6;
        const angle = (i / 8) * Math.PI * 2;
        const dist = 60;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';
        spark.style.background = ['var(--highlight)', 'var(--yellow)', 'var(--orange)', 'var(--green-700)'][i%4];
        spark.style.left = `calc(50% - ${size/2}px + ${Math.cos(angle)*dist}px)`;
        spark.style.top = `calc(50% - ${size/2}px + ${Math.sin(angle)*dist}px)`;
        spark.style.animationDelay = (Math.random() * 2) + 's';
        animCore.appendChild(spark);
    }
}

// --- 7. Microscope Focus & Fixed Canvas Animation ---
const fovInner = document.getElementById('inner');
const focusInput = document.getElementById('focus');
const focusRead = document.getElementById('focusRead');
const canvas = document.getElementById('cells');

if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = 440; canvas.height = 440;
  
  const cells = Array.from({length: 15}).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 40 + 20, 
      vx: (Math.random() - 0.5) * 0.4, 
      vy: (Math.random() - 0.5) * 0.4  
  }));

  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark' || 
           (!document.documentElement.hasAttribute('data-theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function animateCells() {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      
      if (isDarkMode()) {
          ctx.fillStyle = 'rgba(246, 214, 130, 0.15)'; // var(--yellow) fill
          ctx.strokeStyle = 'rgba(231, 154, 51, 0.4)'; // var(--amber) stroke
      } else {
          ctx.fillStyle = 'rgba(232, 84, 140, 0.1)'; // var(--pink) fill
          ctx.strokeStyle = 'rgba(232, 84, 140, 0.25)'; // var(--pink) stroke
      }
      
      ctx.lineWidth = 3;
      
      cells.forEach(c => {
          c.x += c.vx;
          c.y += c.vy;
          
          if(c.x < -c.r) c.x = canvas.width + c.r;
          if(c.x > canvas.width + c.r) c.x = -c.r;
          if(c.y < -c.r) c.y = canvas.height + c.r;
          if(c.y > canvas.height + c.r) c.y = -c.r;

          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
          ctx.fill();
          ctx.stroke();
      });
      requestAnimationFrame(animateCells);
  }
  animateCells();
}

if (focusInput && fovInner) {
    focusInput.addEventListener('input', (e) => {
      const val = e.target.value;
      focusRead.textContent = val + '%';
      const blurVal = 14 - (val / 100 * 14);
      const sharpVal = 0.22 + (val / 100 * 0.78);
      fovInner.style.setProperty('--blur', `${blurVal}px`);
      fovInner.style.setProperty('--sharp', sharpVal);
    });
}

// --- 8. Timer Logic ---
let timeLeft = 25 * 60;
let isRunning = false;
let isBreak = false;
let timerInterval;

const timeDisplay = document.getElementById('faceTime');
const modeDisplay = document.getElementById('faceMode');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const modeBtn = document.getElementById('modeBtn');
const timerPointer = document.getElementById('pointer');

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    if(timeDisplay) timeDisplay.textContent = `${m}:${s}`;
    
    if(timerPointer) {
        const total = isBreak ? 5 * 60 : 25 * 60;
        const percent = 1 - (timeLeft / total);
        timerPointer.style.transform = `translate(0,18px) rotate(${percent * 360}deg)`;
    }
}

if(startBtn) {
  startBtn.addEventListener('click', () => {
      if(isRunning) {
          clearInterval(timerInterval);
          startBtn.textContent = 'Start';
      } else {
          timerInterval = setInterval(() => {
              if(timeLeft > 0) {
                  timeLeft--;
                  updateTimerDisplay();
              } else {
                  clearInterval(timerInterval);
                  startBtn.textContent = 'Start';
                  isRunning = false;
              }
          }, 1000);
          startBtn.textContent = 'Pause';
      }
      isRunning = !isRunning;
  });
}

if(resetBtn) {
  resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'Start';
      timeLeft = isBreak ? 5 * 60 : 25 * 60;
      updateTimerDisplay();
  });
}

if(modeBtn) {
  modeBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'Start';
      isBreak = !isBreak;
      timeLeft = isBreak ? 5 * 60 : 25 * 60;
      modeDisplay.textContent = isBreak ? 'BREAK' : 'FOCUS';
      modeBtn.textContent = isBreak ? 'Switch to focus' : 'Switch to break';
      updateTimerDisplay();
  });
}

// --- 9. Calendar Interactive Logic ---
const calDays = document.getElementById('calDays');
const testModal = document.getElementById('testModal');
const saveTestBtn = document.getElementById('saveTestBtn');
const cancelTestBtn = document.getElementById('cancelTestBtn');
const inputName = document.getElementById('testName');
const inputWeight = document.getElementById('testWeight');
const inputSubject = document.getElementById('testSubject');
let activeDayElement = null;

if (calDays && testModal) {
  for(let i = 0; i < 2; i++) {
    const emptyDay = document.createElement('div');
    calDays.appendChild(emptyDay);
  }
  
  for(let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'cal-day';
    day.textContent = i;
    day.addEventListener('click', () => {
      activeDayElement = day;
      testModal.style.display = 'flex';
      inputName.value = ''; inputWeight.value = ''; inputSubject.value = '';
      inputName.focus();
    });
    calDays.appendChild(day);
  }

  cancelTestBtn.addEventListener('click', () => testModal.style.display = 'none');
  saveTestBtn.addEventListener('click', () => {
    if (activeDayElement && inputName.value.trim() !== '') {
      activeDayElement.classList.add('has-test');
      activeDayElement.title = `Test: ${inputName.value}\nSubject: ${inputSubject.value}\nWeight: ${inputWeight.value}`;
    }
    testModal.style.display = 'none';
  });
}