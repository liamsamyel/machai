const settings = {
  herName: "Risecel",
  myName: "Liam",

  openingMessage: "There are a few things I want you to know.",
  instructionMessage: "Click the stars.",

  finalMessage: "If I had to choose one universe to stay in, I'd still choose the one where I met you.",

  musicFile: "your-song.mp3",

  backgroundStarCount: 420,
  shootingStarFrequency: 0.0016,
  parallaxIntensity: 18,
  animationIntensity: 1,

  colors: {
    background: "#04060d",
    star: "#f4f2ea",
    accent: "#b9c4ee",
  },
};

const reasons = [
    {title: "Talking to you", message: "I love how talking to you can make a normal day feel less boring."  },
    {title: "Your messages", message: "I love how I sometimes smile at my phone before I even open your message."},
    {title: "Your laugh", message: "I love your laugh, especially when something catches you off guard."},
    {title: "Your excitement", message: "I love when you get excited and start talking more than usual. I could listen to that version of you for a long time."},
    {title: "Your sleepy side", message: "I love your sleepy side. There's something about the way you are when you're tired that I find really endearing."},
    {title: "When you get shy", message: "I love when you get shy. I don't think you realize how cute you are in those moments."},
    {title: "Your little habits", message: "I love your little habits, especially the ones you probably don't even realize I notice."},
    {title: "Your random thoughts", message: "I love your random thoughts. Somehow, I never get tired of hearing whatever happens to be on your mind."},
    {title: "Our stupid conversations", message: "I love our stupid conversations that somehow last forever." },
    {title: "Our little jokes", message: "I love the jokes that probably wouldn't make sense to anyone else, but somehow make perfect sense to us."},
    {title: "Teasing you", message: "I love when we tease each other. Even when you're pretending to be annoyed with me." },
    {title: "Making you laugh", message: "I love making you laugh. There's something about knowing I made your day a little better that makes me happy too."},
    {title: "How naturally it happened", message: "I love that I didn't have to force myself to fall for you. Somewhere along the way, caring about you just happened."},
    {title: "How important you became", message: "I love how quickly you became important to me. I don't think I even noticed it happening until you already were."},
    {title: "Thinking of you", message: "I love that random things can remind me of you. Sometimes it's something so small that I wouldn't even be able to explain why it made me think of you."},
    {title: "Your happiness", message: "I love how much your happiness matters to me. Seeing you genuinely happy makes me happy too."},
    {title: "Being proud of you", message: "I love seeing you proud of yourself. I hope you know that I'll always be proud of you too."},
    {title: "Believing in you", message: "I love believing in you, even when you aren't feeling very confident. Sometimes I wish you could see yourself the way I see you."},
    {title: "Your honesty", message: "I love your honesty, especially when you tell me what you're actually feeling instead of pretending everything is okay."},
    {title: "Our late nights", message: "I love our late-night conversations, especially when we keep saying we're going to sleep and somehow continue talking."},
    {title: "Five minutes becoming an hour", message: "I love when a five-minute conversation turns into an hour and neither of us really notices." },
    {title: "When you miss me", message: "I love the way I feel when you say you miss me. It's such a simple thing, but it means more to me than you probably realize."},
    {title: "When you check on me", message: "I love when you check on me, especially when you somehow notice that something is wrong before I even say anything."},
    {title: "The little ways you care", message: "I love the little ways you show me that you care. They don't have to be big for me to notice them."},
    {title: "Becoming better", message: "I love that loving you makes me want to become better. Not because you ask me to, but because you make the effort feel worth it."},
    {title: "Taking care of your heart", message: "I love that I want to understand you instead of judging you, and that I genuinely want to handle your heart carefully."},
    {title: "The future", message: "I love hearing about the things you want to accomplish. I love imagining you reaching the goals you've talked about." },
    {title: "Ordinary days", message: "I love the thought of having ordinary days with you. I don't need some huge romantic moment to be happy with you." },
    {title: "Choosing you", message: "They say love is a choice, and that's my reason why. Out of everyone I could've chosen, I chose you, and I would choose you again and again." }
];

const canvas = document.getElementById("skyCanvas");
const ctx = canvas.getContext("2d");

const state = {
  width: 0,
  height: 0,
  dpr: Math.min(window.devicePixelRatio || 1, 2),
  backgroundStars: [],
  specialStars: [],
  particles: [],
  shootingStars: [],
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  parallax: { x: 0, y: 0 },
  discoveredCount: 0,
  totalStars: reasons.length,
  hoveredStar: null,
  activeStar: null,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  isTouch: "ontouchstart" in window,
  hasStarted: false,
  completionTriggered: false,
  time: 0,
};

function resizeCanvas() {
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = state.width * state.dpr;
  canvas.height = state.height * state.dpr;
  canvas.style.width = state.width + "px";
  canvas.style.height = state.height + "px";
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

function createBackgroundStars() {
  state.backgroundStars = [];
  const count = settings.backgroundStarCount;
  for (let i = 0; i < count; i++) {
    state.backgroundStars.push({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.25,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
      phase: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.6 + 0.2,
    });
  }
}

function drawBackgroundStars(delta) {
  for (const star of state.backgroundStars) {
    const twinkle = state.reducedMotion
      ? 0
      : Math.sin(state.time * star.twinkleSpeed + star.phase) * 0.35;
    const alpha = Math.max(0, Math.min(1, star.baseAlpha + twinkle));
    const px = star.x + state.parallax.x * star.depth;
    const py = star.y + state.parallax.y * star.depth;

    ctx.beginPath();
    ctx.fillStyle = `rgba(244, 242, 234, ${alpha})`;
    ctx.arc(px, py, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createSpecialStars() {
  state.specialStars = [];
  const margin = 0.1;
  const count = reasons.length;

  const cols = Math.ceil(Math.sqrt(count * (state.width / state.height)));
  const rows = Math.ceil(count / cols);
  const cellW = state.width / cols;
  const cellH = state.height / rows;

  const positions = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (positions.length >= count) break;
      const jitterX = (Math.random() - 0.5) * cellW * 0.7;
      const jitterY = (Math.random() - 0.5) * cellH * 0.7;
      let x = c * cellW + cellW / 2 + jitterX;
      let y = r * cellH + cellH / 2 + jitterY;
      x = Math.min(Math.max(x, state.width * margin), state.width * (1 - margin));
      y = Math.min(Math.max(y, state.height * margin * 0.6), state.height * (1 - margin * 0.6));
      positions.push({ x, y });
    }
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  reasons.forEach((reason, i) => {
    const pos = positions[i] || { x: Math.random() * state.width, y: Math.random() * state.height };
    state.specialStars.push({
        id: i,
        x: pos.x,
        y: pos.y,
        baseR: Math.random() * 1.1 + 3.2,
        hoverT: 0,
        discoveredT: 0,
        discovered: false,
        phase: Math.random() * Math.PI * 2,
        reason,
    });
  });
}

function drawSpecialStars() {
  for (const star of state.specialStars) {
    const px = star.x + state.parallax.x * 0.9;
    const py = star.y + state.parallax.y * 0.9;

    const twinkle = state.reducedMotion ? 0 : Math.sin(state.time * 0.01 + star.phase) * 0.15;
    const glowStrength = 0.35 + star.discoveredT * 0.5 + star.hoverT * 0.4 + twinkle;
    const radius = star.baseR + star.hoverT * 1.8 + star.discoveredT * 0.6;

    const glowRadius = radius * (9 + star.discoveredT * 4 + star.hoverT * 3);
    const gradient = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
    gradient.addColorStop(0, `rgba(185, 196, 238, ${0.35 * glowStrength})`);
    gradient.addColorStop(1, "rgba(185, 196, 238, 0)");
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = `rgba(244, 242, 234, ${0.75 + glowStrength * 0.25})`;
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
//asbdjvh
function getConstellationEdges() {
  const edges = [];
  for (let i = 0; i < state.specialStars.length - 1; i++) {
    edges.push([i, i + 1]);
  }
  return edges;
}

let constellationEdges = [];

function drawConstellation() {
  for (const [aIdx, bIdx] of constellationEdges) {
    const a = state.specialStars[aIdx];
    const b = state.specialStars[bIdx];
    if (!a.discovered || !b.discovered) continue;

    const ax = a.x + state.parallax.x * 0.9;
    const ay = a.y + state.parallax.y * 0.9;
    const bx = b.x + state.parallax.x * 0.9;
    const by = b.y + state.parallax.y * 0.9;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(185, 196, 238, 0.28)";
    ctx.lineWidth = 0.8;
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
}

function spawnParticles(x, y) {
  const count = state.reducedMotion ? 0 : 14;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
    const speed = Math.random() * 1.4 + 0.6;
    state.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: Math.random() * 0.02 + 0.015,
      r: Math.random() * 1.2 + 0.5,
    });
  }
}

function updateAndDrawParticles() {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.life -= p.decay;

    if (p.life <= 0) {
      state.particles.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(244, 242, 234, ${p.life})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function maybeSpawnShootingStar() {
  if (state.reducedMotion) return;
  if (Math.random() < settings.shootingStarFrequency) {
    const startX = Math.random() * state.width * 0.6 + state.width * 0.2;
    const startY = Math.random() * state.height * 0.25;
    const angle = Math.PI * 0.22;
    state.shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * 9,
      vy: Math.sin(angle) * 9,
      life: 1,
      length: Math.random() * 70 + 60,
    });
  }
}

function updateAndDrawShootingStars() {
  for (let i = state.shootingStars.length - 1; i >= 0; i--) {
    const s = state.shootingStars[i];
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.02;

    if (s.life <= 0 || s.x > state.width + 100 || s.y > state.height + 100) {
      state.shootingStars.splice(i, 1);
      continue;
    }

    const tailX = s.x - s.vx * (s.length / 9);
    const tailY = s.y - s.vy * (s.length / 9);
    const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
    gradient.addColorStop(0, `rgba(244, 242, 234, ${s.life})`);
    gradient.addColorStop(1, "rgba(244, 242, 234, 0)");

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.2;
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
  }
}

function getSpecialStarAt(x, y, radius) {
  let closest = null;
  let closestDist = Infinity;
  for (const star of state.specialStars) {
    const px = star.x + state.parallax.x * 0.9;
    const py = star.y + state.parallax.y * 0.9;
    const dist = Math.hypot(px - x, py - y);
    if (dist < radius && dist < closestDist) {
      closest = star;
      closestDist = dist;
    }
  }
  return closest;
}

function handlePointerMove(clientX, clientY) {
  state.mouse.targetX = clientX;
  state.mouse.targetY = clientY;

  if (state.isTouch) return;

  const hovered = getSpecialStarAt(clientX, clientY, 26);
  if (hovered !== state.hoveredStar) {
    state.hoveredStar = hovered;
    canvas.style.cursor = hovered ? "pointer" : "default";
  }
}

function handlePointerDown(clientX, clientY) {
  const hitRadius = state.isTouch ? 34 : 24;
  const star = getSpecialStarAt(clientX, clientY, hitRadius);
  if (star) {
    onStarActivated(star);
  }
}

canvas.addEventListener("mousemove", (e) => handlePointerMove(e.clientX, e.clientY));
canvas.addEventListener("click", (e) => handlePointerDown(e.clientX, e.clientY));

canvas.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      handlePointerMove(t.clientX, t.clientY);
    }
  },
  { passive: true }
);

canvas.addEventListener(
  "touchend",
  (e) => {
    if (e.changedTouches.length > 0) {
      const t = e.changedTouches[0];
      handlePointerDown(t.clientX, t.clientY);
    }
  },
  { passive: true }
);

document.body.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

const modal = document.getElementById("reasonModal");
const modalCard = modal.querySelector(".modal__card");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");

function openModal(star) {
  modalTitle.textContent = star.reason.title;
  modalMessage.textContent = star.reason.message;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  state.activeStar = star;
  window.requestAnimationFrame(() => modalCard.focus());
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  state.activeStar = null;
}

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

const discoveredCountEl = document.getElementById("discoveredCount");
const totalCountEl = document.getElementById("totalCount");
const discoveryCounterEl = document.getElementById("discoveryCounter");

function onStarActivated(star) {
  if (!star.discovered) {
    star.discovered = true;
    state.discoveredCount += 1;
    discoveredCountEl.textContent = state.discoveredCount;

    const px = star.x + state.parallax.x * 0.9;
    const py = star.y + state.parallax.y * 0.9;
    spawnParticles(px, py);

    if (state.discoveredCount >= state.totalStars && !state.completionTriggered) {
      state.completionTriggered = true;
      setTimeout(triggerCompletionSequence, 900);
    }
  }
  openModal(star);
}

function runOpeningSequence() {
  const line1 = document.getElementById("openingLine1");
  const line2 = document.getElementById("openingLine2");
  line1.textContent = settings.openingMessage;
  line2.textContent = settings.instructionMessage;

  totalCountEl.textContent = state.totalStars;

  setTimeout(() => line1.classList.add("is-visible"), 900);
  setTimeout(() => line2.classList.add("is-visible"), 2600);
  setTimeout(() => discoveryCounterEl.classList.add("is-visible"), 3200);
  setTimeout(() => document.getElementById("musicButton").classList.add("is-visible"), 3200);

  setTimeout(() => {
    line1.classList.add("is-faded");
    line2.classList.add("is-faded");
  }, 7200);
}

function triggerCompletionSequence() {
  const completionEl = document.getElementById("completionSequence");
  completionEl.classList.add("is-visible");
  completionEl.setAttribute("aria-hidden", "false");

  const lines = completionEl.querySelectorAll(".completion-line");
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("is-visible"), 700 + i * 2200);
  });

  const totalDelay = 700 + lines.length * 2200 + 1800;
  setTimeout(() => {
    completionEl.style.transition = "opacity 2s ease";
    completionEl.style.opacity = "0";
    setTimeout(() => {
      completionEl.classList.remove("is-visible");
      runFinalGalaxyScene();
    }, 2000);
  }, totalDelay);
}

function runFinalGalaxyScene() {
  const finalScene = document.getElementById("finalScene");
  finalScene.classList.add("is-visible");
  finalScene.setAttribute("aria-hidden", "false");

  const preLines = finalScene.querySelectorAll(".final-line");
  preLines.forEach((line, i) => {
    setTimeout(() => line.classList.add("is-visible"), 800 + i * 1900);
  });

  const finalMessageEl = document.getElementById("finalScene").querySelector(".final-scene__message");
  document.getElementById("finalMessage").textContent = settings.finalMessage;
  document.getElementById("finalSignatureName").textContent = settings.myName;

  const stayButton = document.getElementById("stayButton");
  const revealDelay = 800 + preLines.length * 1900 + 1400;

  setTimeout(() => {
    finalMessageEl.classList.add("is-visible");
  }, revealDelay);

  setTimeout(() => {
    stayButton.classList.add("is-visible");
    stayButton.removeAttribute("aria-hidden");
  }, revealDelay + 2000);
}

const stayButton = document.getElementById("stayButton");
stayButton.addEventListener("click", () => {
  const finalScene = document.getElementById("finalScene");
  finalScene.style.transition = "opacity 2.5s ease";
  finalScene.style.opacity = "0";

  setTimeout(() => {
    finalScene.classList.remove("is-visible");
    finalScene.setAttribute("aria-hidden", "true");

    const returnNote = document.getElementById("returnNote");
    returnNote.classList.add("is-visible");
    returnNote.removeAttribute("aria-hidden");
  }, 2500);
});

const musicButton = document.getElementById("musicButton");
const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.src = settings.musicFile;

let isMusicPlaying = false;

musicButton.addEventListener("click", () => {
  if (isMusicPlaying) {
    backgroundMusic.pause();
    isMusicPlaying = false;
  } else {
    backgroundMusic.play().catch(() => {
    });
    isMusicPlaying = true;
  }
  musicButton.setAttribute("aria-pressed", String(isMusicPlaying));
  musicButton.setAttribute("aria-label", isMusicPlaying ? "Pause music" : "Play music");
});


function updateParallax() {
  state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.06;
  state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.06;

  if (state.reducedMotion) {
    state.parallax.x = 0;
    state.parallax.y = 0;
    return;
  }

  const normX = (state.mouse.x / state.width - 0.5) * 2;
  const normY = (state.mouse.y / state.height - 0.5) * 2;
  state.parallax.x = -normX * settings.parallaxIntensity;
  state.parallax.y = -normY * settings.parallaxIntensity;
}

function updateStarInteractionStates() {
  for (const star of state.specialStars) {
    const isHovered = star === state.hoveredStar;
    const hoverTarget = isHovered ? 1 : 0;
    star.hoverT += (hoverTarget - star.hoverT) * 0.15;

    const discoveredTarget = star.discovered ? 1 : 0;
    star.discoveredT += (discoveredTarget - star.discoveredT) * 0.08;
  }
}

function render() {
  state.time += 1 * settings.animationIntensity;

  ctx.clearRect(0, 0, state.width, state.height);

  updateParallax();
  updateStarInteractionStates();

  drawBackgroundStars();
  drawConstellation();
  drawSpecialStars();

  maybeSpawnShootingStar();
  updateAndDrawShootingStars();
  updateAndDrawParticles();

  requestAnimationFrame(render);
}

function init() {
  resizeCanvas();
  createBackgroundStars();
  createSpecialStars();
  constellationEdges = getConstellationEdges();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createBackgroundStars();
    createSpecialStars();
    constellationEdges = getConstellationEdges();
  });

  runOpeningSequence();
  requestAnimationFrame(render);
}

init();