const entryGate = document.getElementById("entryGate");
const enterJourneyButton = document.getElementById("enterJourney");
const journeyContainer = document.getElementById("journeyContainer");
const cosmicSky = document.getElementById("cosmicSky");
const ambientLayer = document.getElementById("ambientLayer");
const starlightLayer = document.getElementById("starlightLayer");
const celestialHaze = document.querySelector(".celestial-haze");
const celebration = document.getElementById("celebration");
const hasMatchMedia = typeof window !== "undefined" && typeof window.matchMedia === "function";
const prefersReducedMotion = hasMatchMedia
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : { matches: false };
const devicePixelRatioSafe = Math.min(window.devicePixelRatio || 1, 1.8);

if (celebration) {
  celebration.dataset.active = celebration.dataset.active ?? "false";
}

let gateHasOpened = false;
let shootingInterval;
let resizeTimeout;
let lastSeedSize = { width: window.innerWidth, height: window.innerHeight };
let currentQuestion = 1;
const totalQuestions = 8;
const celebrationIntervals = [];

const isCelebrationActive = () => celebration && celebration.dataset.active === "true";

const trackCelebrationInterval = (id) => {
  celebrationIntervals.push(id);
  return id;
};

const clearCelebrationIntervals = () => {
  while (celebrationIntervals.length) {
    clearInterval(celebrationIntervals.pop());
  }
};

const registerCelebrationLoop = (callback, interval, cap) => {
  let runs = 0;
  const id = setInterval(() => {
    if (!isCelebrationActive() || runs >= cap) {
      clearInterval(id);
      const index = celebrationIntervals.indexOf(id);
      if (index !== -1) {
        celebrationIntervals.splice(index, 1);
      }
      return;
    }
    callback();
    runs += 1;
  }, interval);
  trackCelebrationInterval(id);
};

const parallaxState = {
  enabled: !prefersReducedMotion.matches,
  targetX: 0,
  targetY: 0,
  currentX: 0,
  currentY: 0,
  listenersActive: false,
  rafId: null,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const pointerMoveHandler = (event) => {
  if (!parallaxState.enabled) return;
  const pointerX = event.clientX / window.innerWidth - 0.5;
  const pointerY = event.clientY / window.innerHeight - 0.5;
  parallaxState.targetX = clamp(pointerX, -0.5, 0.5);
  parallaxState.targetY = clamp(pointerY, -0.5, 0.5);
};

const pointerLeaveHandler = () => {
  parallaxState.targetX = 0;
  parallaxState.targetY = 0;
};

const applyParallaxTransforms = (time) => {
  const ease = 0.08;
  parallaxState.currentX += (parallaxState.targetX - parallaxState.currentX) * ease;
  parallaxState.currentY += (parallaxState.targetY - parallaxState.currentY) * ease;

  const motionEnabled = parallaxState.enabled && !prefersReducedMotion.matches;
  const floatAmplitude = motionEnabled ? 1 : 0;
  const floatX = floatAmplitude ? Math.cos(time * 0.00022) * 4.5 : 0;
  const floatY = floatAmplitude ? Math.sin(time * 0.00027) * 6.5 : 0;

  const offsetX = parallaxState.currentX * 38 + floatX;
  const offsetY = parallaxState.currentY * 24 + floatY;

  if (journeyContainer) {
    journeyContainer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) rotateX(${parallaxState.currentY * -10}deg) rotateY(${parallaxState.currentX * 12}deg)`;
    journeyContainer.style.setProperty('--glowOpacity', String(Math.min(0.55, Math.abs(parallaxState.currentX) + Math.abs(parallaxState.currentY) + 0.25)));
  }

  if (ambientLayer) {
    const ambientX = parallaxState.currentX * -55 - floatX * 0.4;
    const ambientY = parallaxState.currentY * -32 - floatY * 0.3;
    ambientLayer.style.transform = `translate3d(${ambientX}px, ${ambientY}px, 0)`;
  }

  if (starlightLayer) {
    const starlightX = parallaxState.currentX * -25 - floatX * 0.2;
    const starlightY = parallaxState.currentY * -18 - floatY * 0.15;
    starlightLayer.style.transform = `translate3d(${starlightX}px, ${starlightY}px, 0)`;
  }

  if (cosmicSky) {
    const skyX = parallaxState.currentX * 12;
    const skyY = parallaxState.currentY * 18;
    cosmicSky.style.transform = `translate3d(${skyX}px, ${skyY}px, 0)`;
  }
};

const parallaxLoop = (time) => {
  applyParallaxTransforms(time);
  parallaxState.rafId = requestAnimationFrame(parallaxLoop);
};

const startParallaxLoop = () => {
  if (parallaxState.rafId !== null) return;
  parallaxState.rafId = requestAnimationFrame(parallaxLoop);
};

const enableParallaxListeners = () => {
  if (parallaxState.listenersActive || prefersReducedMotion.matches) return;
  window.addEventListener('pointermove', pointerMoveHandler, { passive: true });
  window.addEventListener('pointerleave', pointerLeaveHandler);
  parallaxState.listenersActive = true;
};

const disableParallaxListeners = () => {
  if (!parallaxState.listenersActive) return;
  window.removeEventListener('pointermove', pointerMoveHandler);
  window.removeEventListener('pointerleave', pointerLeaveHandler);
  parallaxState.listenersActive = false;
  parallaxState.targetX = 0;
  parallaxState.targetY = 0;
  parallaxState.currentX = 0;
  parallaxState.currentY = 0;
  if (journeyContainer) {
    journeyContainer.style.transform = 'translate3d(0px, 0px, 0)';
    journeyContainer.style.setProperty('--glowOpacity', '0.2');
  }
  if (ambientLayer) ambientLayer.style.transform = 'translate3d(0px, 0px, 0)';
  if (starlightLayer) starlightLayer.style.transform = 'translate3d(0px, 0px, 0)';
  if (cosmicSky) cosmicSky.style.transform = 'translate3d(0px, 0px, 0)';
};

const updateParallaxMode = () => {
  parallaxState.enabled = !prefersReducedMotion.matches;
  if (!parallaxState.enabled) {
    parallaxState.targetX = 0;
    parallaxState.targetY = 0;
  }
  if (parallaxState.enabled) {
    enableParallaxListeners();
  } else {
    disableParallaxListeners();
  }
};

const getViewportPadding = () => Math.min(32, Math.max(20, Math.round(window.innerWidth * 0.04)));

const clampButtonToViewport = (button) => {
  if (!button || button.parentElement !== document.body) return;
  const padding = getViewportPadding();
  const width = button.offsetWidth;
  const height = button.offsetHeight;
  const maxLeft = Math.max(padding, window.innerWidth - width - padding);
  const maxTop = Math.max(padding, window.innerHeight - height - padding);
  const currentRect = button.getBoundingClientRect();
  const left = Math.min(maxLeft, Math.max(padding, parseFloat(button.style.left) || currentRect.left));
  const top = Math.min(maxTop, Math.max(padding, parseFloat(button.style.top) || currentRect.top));
  button.style.left = `${left}px`;
  button.style.top = `${top}px`;
};

const ensureNoButtonPlaceholder = (button, rect, computed) => {
  if (button._placeholder) {
    button._placeholder.style.width = `${rect.width}px`;
    button._placeholder.style.height = `${rect.height}px`;
    return;
  }
  button._originParent = button.parentElement;
  button._originNextSibling = button.nextElementSibling;
  const placeholder = document.createElement('span');
  placeholder.className = 'no-btn-placeholder';
  placeholder.style.display = 'inline-flex';
  placeholder.style.width = `${rect.width}px`;
  placeholder.style.height = `${rect.height}px`;
  placeholder.style.visibility = 'hidden';
  const flexValue = computed.flex && computed.flex !== '0 1 auto' ? computed.flex : '0 0 auto';
  placeholder.style.flex = flexValue;
  placeholder.style.margin = computed.margin;
  placeholder.style.pointerEvents = 'none';
  button._placeholder = placeholder;
  if (button._originParent) {
    button._originParent.insertBefore(placeholder, button);
  }
};

const moveNoButtonRandomly = (button) => {
  if (!button) return;
  const padding = getViewportPadding();
  const width = button.offsetWidth;
  const height = button.offsetHeight;
  const maxLeft = Math.max(padding, window.innerWidth - width - padding);
  const maxTop = Math.max(padding, window.innerHeight - height - padding);
  const targetLeft = Math.random() * (maxLeft - padding) + padding;
  const targetTop = Math.random() * (maxTop - padding) + padding;
  const clampedLeft = Math.min(maxLeft, Math.max(padding, targetLeft));
  const clampedTop = Math.min(maxTop, Math.max(padding, targetTop));
  button.style.left = `${clampedLeft}px`;
  button.style.top = `${clampedTop}px`;
  const rotate = (Math.random() - 0.5) * 14;
  const scale = 1 + (Math.random() - 0.5) * 0.05;
  button.style.transform = `translate3d(0, 0, 0) scale(${scale}) rotate(${rotate}deg)`;
};

const restoreNoButton = (button) => {
  if (!button || !button._placeholder || !button._originParent) return;
  const placeholder = button._placeholder;
  const parent = button._originParent;
  const nextSibling = button._originNextSibling;
  if (parent) {
    if (nextSibling && nextSibling.parentNode === parent) {
      parent.insertBefore(button, nextSibling);
    } else {
      parent.appendChild(button);
    }
  }
  placeholder.remove();
  button._placeholder = null;
  button._originParent = null;
  button._originNextSibling = null;
  button.style.position = '';
  button.style.margin = '';
  button.style.width = '';
  button.style.height = '';
  button.style.left = '';
  button.style.top = '';
  button.style.zIndex = '';
  button.style.transition = '';
  button.style.transform = '';
  button.style.pointerEvents = '';
  button.classList.remove('evading');
};

const restoreNoButtons = (scope) => {
  const buttons = document.querySelectorAll('.no-btn');
  buttons.forEach((button) => {
    if (scope && button._originParent !== scope) return;
    restoreNoButton(button);
  });
};

const vanishNoButtons = (scope) => {
  const buttons = document.querySelectorAll('.no-btn');
  buttons.forEach((button) => {
    const origin = button._originParent;
    const belongsToScope = !scope
      || (origin && (origin === scope || scope.contains(origin)))
      || scope.contains(button);

    if (!belongsToScope) return;

    if (button._placeholder) {
      button._placeholder.remove();
      button._placeholder = null;
    }

    button._originParent = null;
    button._originNextSibling = null;
    button.style.pointerEvents = 'none';
    button.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    button.style.opacity = '0';
    button.style.transform = 'translate3d(0, 20px, 0) scale(0.6)';

    setTimeout(() => {
      if (button.parentElement) {
        button.parentElement.removeChild(button);
      }
    }, 320);
  });
};

const getStarCount = () => {
  const base = Math.max(60, Math.floor(window.innerWidth * devicePixelRatioSafe * 0.045));
  const tuned = window.innerWidth > 1400 ? Math.min(base, 160) : Math.min(base, 140);
  return prefersReducedMotion.matches ? Math.floor(tuned * 0.6) : tuned;
};

function createStarField() {
  if (!cosmicSky) return;
  const starTotal = getStarCount();
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starTotal; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    const size = (Math.random() * 2 + 1).toFixed(2);
    const delay = Math.random() * 8;
    const duration = 5 + Math.random() * 6;
    star.style.setProperty("--size", `${size}px`);
    star.style.setProperty("--delay", `${delay.toFixed(2)}s`);
    star.style.animationDuration = `${duration.toFixed(2)}s`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    fragment.appendChild(star);
  }

  if (cosmicSky.replaceChildren) {
    cosmicSky.replaceChildren(fragment);
  } else {
    cosmicSky.innerHTML = "";
    cosmicSky.appendChild(fragment);
  }
}

function seedAmbientLayers() {
  if (!ambientLayer || !starlightLayer) return;
  ambientLayer.innerHTML = "";
  starlightLayer.innerHTML = "";

  const compact = window.innerWidth < 768;
  const orbTotal = prefersReducedMotion.matches
    ? compact
      ? 4
      : 6
    : compact
      ? 7
      : 10;
  const trailTotal = prefersReducedMotion.matches
    ? compact
      ? 4
      : 7
    : compact
      ? 8
      : 12;

  const orbFragment = document.createDocumentFragment();
  for (let i = 0; i < orbTotal; i += 1) {
    const orb = document.createElement("span");
    orb.className = "orb";
    const size = prefersReducedMotion.matches ? 100 + Math.random() * 80 : 120 + Math.random() * 140;
    orb.style.setProperty("--size", `${size}px`);
    orb.style.left = `${Math.random() * 100}%`;
    orb.style.top = `${Math.random() * 100}%`;
    orb.style.setProperty("--delay", `${Math.random() * 6}s`);
    orbFragment.appendChild(orb);
  }
  ambientLayer.appendChild(orbFragment);

  const trailFragment = document.createDocumentFragment();
  for (let i = 0; i < trailTotal; i += 1) {
    const trail = document.createElement("span");
    trail.className = "trail";
    trail.style.left = `${Math.random() * 100}%`;
    trail.style.top = `${Math.random() * 60}%`;
    trail.style.setProperty("--length", `${140 + Math.random() * 160}px`);
    trail.style.setProperty("--delay", `${Math.random() * 5}s`);
    trailFragment.appendChild(trail);
  }
  starlightLayer.appendChild(trailFragment);
}

function igniteStarField() {
  if (!cosmicSky) return;
  cosmicSky.classList.add("lit");
  const stars = cosmicSky.querySelectorAll(".star");
  stars.forEach((star, index) => {
    setTimeout(() => {
      star.classList.add("luminescent");
    }, index * 18 + Math.random() * 60);
  });
}

function unveilAmbientLayers() {
  const orbs = ambientLayer ? ambientLayer.querySelectorAll(".orb") : [];
  const trails = starlightLayer ? starlightLayer.querySelectorAll(".trail") : [];

  orbs.forEach((orb, index) => {
    setTimeout(() => orb.classList.add("active"), index * 160);
  });

  trails.forEach((trail, index) => {
    setTimeout(() => trail.classList.add("active"), index * 140 + 400);
  });
}

function launchShootingStar() {
  if (!cosmicSky) return;
  const star = document.createElement("span");
  star.className = "shooting-star";
  const startX = 70 + Math.random() * 25;
  const startY = 5 + Math.random() * 20;
  const duration = prefersReducedMotion.matches ? 3.2 + Math.random() * 1 : 3 + Math.random() * 1.8;
  const dx = -320 - Math.random() * 200;
  const dy = 180 + Math.random() * 220;
  const angle = -15 - Math.random() * 10;

  star.style.left = `${startX}vw`;
  star.style.top = `${startY}vh`;
  star.style.setProperty("--duration", `${duration}s`);
  star.style.setProperty("--dx", `${dx}px`);
  star.style.setProperty("--dy", `${dy}px`);
  star.style.setProperty("--angle", `${angle}deg`);

  cosmicSky.appendChild(star);
  setTimeout(() => star.remove(), duration * 1000 + 600);
}

function beginCosmicShow() {
  if (shootingInterval) clearInterval(shootingInterval);
  igniteStarField();
  unveilAmbientLayers();
  if (celestialHaze) celestialHaze.classList.add("visible");
  const intervalDelay = prefersReducedMotion.matches ? 9000 : 5200;
  shootingInterval = setInterval(() => {
    if (!document.hidden) {
      launchShootingStar();
    }
  }, intervalDelay);
  if (!prefersReducedMotion.matches) {
    setTimeout(() => !document.hidden && launchShootingStar(), 900);
  }
}

function openGate() {
  if (gateHasOpened || !entryGate) return;
  gateHasOpened = true;
  entryGate.classList.add("opening");

  setTimeout(() => {
    entryGate.classList.add("hidden");
    journeyContainer?.classList.add("revealed");
    beginCosmicShow();
  }, 1400);

  setTimeout(() => {
    if (entryGate && entryGate.parentElement) {
      entryGate.parentElement.removeChild(entryGate);
    }
  }, 2200);
}

createStarField();
seedAmbientLayers();
startParallaxLoop();
updateParallaxMode();

if (enterJourneyButton) {
  enterJourneyButton.addEventListener("click", openGate);
}

if (entryGate) {
  setTimeout(() => {
    if (!gateHasOpened) {
      entryGate.classList.add("active-glow");
    }
  }, 1600);

  setTimeout(() => {
    if (!gateHasOpened) {
      openGate();
    }
  }, 9000);
}

const handleMotionPreferenceChange = () => {
  restoreNoButtons();
  updateParallaxMode();
  createStarField();
  seedAmbientLayers();
  if (gateHasOpened) beginCosmicShow();
};

if (prefersReducedMotion.addEventListener) {
  prefersReducedMotion.addEventListener("change", handleMotionPreferenceChange);
} else if (prefersReducedMotion.addListener) {
  prefersReducedMotion.addListener(handleMotionPreferenceChange);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (shootingInterval) {
      clearInterval(shootingInterval);
      shootingInterval = undefined;
    }
  } else if (gateHasOpened) {
    beginCosmicShow();
  }
});

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const widthDelta = Math.abs(window.innerWidth - lastSeedSize.width);
    const heightDelta = Math.abs(window.innerHeight - lastSeedSize.height);
    if (widthDelta < 80 && heightDelta < 80) {
      return;
    }
    lastSeedSize = { width: window.innerWidth, height: window.innerHeight };
    createStarField();
    seedAmbientLayers();
    document.querySelectorAll('.no-btn.evading').forEach((button) => clampButtonToViewport(button));
    if (gateHasOpened) {
      requestAnimationFrame(beginCosmicShow);
    }
  }, 280);
});

function updateProgress() {
  const progressFill = document.getElementById("progressFill");
  const percentage = (currentQuestion / totalQuestions) * 100;
  progressFill.style.width = percentage + "%";
}

function disappearNo(button) {
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const computed = window.getComputedStyle(button);
  ensureNoButtonPlaceholder(button, rect, computed);

  if (button.parentElement !== document.body) {
    document.body.appendChild(button);
    button.style.position = 'fixed';
    button.style.margin = '0';
    button.style.width = `${rect.width}px`;
    button.style.height = `${rect.height}px`;
    button.style.zIndex = '1200';
    button.style.transition = 'left 0.3s ease, top 0.3s ease, transform 0.25s ease';
  }

  button.classList.add('evading');
  button.style.pointerEvents = 'none';
  moveNoButtonRandomly(button);
  clampButtonToViewport(button);
  createMagicSparkles(button);

  if (parallaxState.enabled) {
    parallaxState.targetX = clamp(parallaxState.targetX + (Math.random() - 0.5) * 0.12, -0.5, 0.5);
    parallaxState.targetY = clamp(parallaxState.targetY - 0.08, -0.5, 0.5);
  }

  setTimeout(() => {
    button.style.pointerEvents = 'auto';
  }, 260);
}

function createMagicSparkles(button) {
  const rect = button.getBoundingClientRect();
  const colors = ["#ff6b6b", "#4ecdc4", "#ff8e8e"];

  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement("div");
    sparkle.style.position = "fixed";
    sparkle.style.left = rect.left + rect.width / 2 + "px";
    sparkle.style.top = rect.top + rect.height / 2 + "px";
    sparkle.style.width = "4px";
    sparkle.style.height = "4px";
    sparkle.style.background = colors[i % colors.length];
    sparkle.style.borderRadius = "50%";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "1001";

    const angle = (i * 45 * Math.PI) / 180;
    const distance = 40;
    const endX = rect.left + rect.width / 2 + Math.cos(angle) * distance;
    const endY = rect.top + rect.height / 2 + Math.sin(angle) * distance;

    sparkle.animate(
      [
        { transform: "translate(0, 0) scale(0)", opacity: 1 },
        {
          transform: `translate(${endX - rect.left - rect.width / 2}px, ${
            endY - rect.top - rect.height / 2
          }px) scale(1)`,
          opacity: 0,
        },
      ],
      {
        duration: 600,
        easing: "ease-out",
      }
    );

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }
}

function showTemporaryMessage(message, button) {
  const messageElement = document.createElement("div");
  messageElement.style.position = "absolute";
  messageElement.style.bottom = "-50px";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translateX(-50%)";
  messageElement.style.background = "linear-gradient(45deg, #ff6b6b, #4ecdc4)";
  messageElement.style.webkitBackgroundClip = "text";
  messageElement.style.backgroundClip = "text";
  messageElement.style.webkitTextFillColor = "transparent";
  messageElement.style.fontSize = "1.1rem";
  messageElement.style.fontWeight = "600";
  messageElement.style.textAlign = "center";
  messageElement.style.animation = "fadeInUp 0.5s ease";
  messageElement.textContent = message;

  button.parentElement.style.position = "relative";
  button.parentElement.appendChild(messageElement);

  setTimeout(() => {
    messageElement.style.animation = "fadeOut 0.5s ease";
    setTimeout(() => messageElement.remove(), 500);
  }, 2500);
}

function nextQuestion(questionNumber) {
  const currentQ = document.getElementById("question" + currentQuestion);
  currentQ.style.transform = "translateY(-30px)";
  currentQ.style.opacity = "0";

  vanishNoButtons(currentQ);
  setTimeout(() => {
    currentQ.classList.add("hidden");

    const nextQ = document.getElementById("question" + questionNumber);
    nextQ.classList.remove("hidden");
    restoreNoButtons(nextQ);

    setTimeout(() => {
      nextQ.classList.add("active");
      currentQuestion = questionNumber;
      updateProgress();
    }, 100);
  }, 400);

  createCelebrationParticles();
}

function createCelebrationParticles() {
  const hearts = ["💖", "💕", "💗"];

  for (let i = 0; i < 5; i++) {
    const heart = document.createElement("div");
    heart.textContent = hearts[i % hearts.length];
    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = "1.5rem";
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "999";
    heart.style.animation = "floatUp 2.5s ease-out forwards";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}

function showFinalSurprise() {
  // LEGENDARY entrance sequence!

  restoreNoButtons();

  // Epic rainbow flash sequence
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#f39c12",
    "#e74c3c",
    "#9b59b6",
  ];
  let colorIndex = 0;

  const flashInterval = setInterval(() => {
    document.body.style.background = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
  }, 100);

  setTimeout(() => {
    clearInterval(flashInterval);
    document.body.style.background = "";
  }, 800);

  // Show celebration with dramatic entrance
  setTimeout(() => {
    if (!celebration) return;
    celebration.style.display = "flex";
    celebration.style.animation = "epicEntrance 1.5s ease-out";
    celebration.dataset.active = "true";

    // Create MEGA celebration effects
    createMegaCelebration();
    createVictoryExplosion();

    // Epic screen effects
    document.body.style.animation = "screenShake 1.5s ease-in-out";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 1600);

    // Victory sound simulation with visual feedback
    createVictoryPulse();
  }, 900);
}

function createVictoryExplosion() {
  const explosionEmojis = ["🎉", "🎊", "✨", "💥", "🌟", "💫", "🎆", "🎇"];

  for (let i = 0; i < 30; i++) {
    const emoji = document.createElement("div");
    emoji.textContent =
      explosionEmojis[Math.floor(Math.random() * explosionEmojis.length)];
    emoji.style.position = "fixed";
    emoji.style.left = "50%";
    emoji.style.top = "50%";
    emoji.style.fontSize = "2rem";
    emoji.style.pointerEvents = "none";
    emoji.style.zIndex = "1000";

    const angle = (Math.PI * 2 * i) / 30;
    const distance = 150 + Math.random() * 100;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;

    emoji.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(0) rotate(0deg)",
          opacity: 1,
        },
        {
          transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(1.5) rotate(720deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 2000,
        easing: "ease-out",
      }
    );

    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 2000);
  }
}

function createVictoryPulse() {
  let pulseCount = 0;
  const maxPulses = 5;

  const pulseInterval = setInterval(() => {
    const pulse = document.createElement("div");
    pulse.style.position = "fixed";
    pulse.style.left = "50%";
    pulse.style.top = "50%";
    pulse.style.width = "20px";
    pulse.style.height = "20px";
    pulse.style.border = "3px solid #ff6b6b";
    pulse.style.borderRadius = "50%";
    pulse.style.transform = "translate(-50%, -50%)";
    pulse.style.pointerEvents = "none";
    pulse.style.zIndex = "999";

    pulse.animate(
      [
        { transform: "translate(-50%, -50%) scale(0)", opacity: 1 },
        { transform: "translate(-50%, -50%) scale(15)", opacity: 0 },
      ],
      {
        duration: 1000,
        easing: "ease-out",
      }
    );

    document.body.appendChild(pulse);
    setTimeout(() => pulse.remove(), 1000);

    pulseCount++;
    if (pulseCount >= maxPulses) {
      clearInterval(pulseInterval);
    }
  }, 200);
}
function createMegaCelebration() {
  if (!isCelebrationActive()) return;
  clearCelebrationIntervals();

  const heartsContainer = document.getElementById("floatingHearts");
  const fireworksContainer = document.getElementById("fireworks");
  const petalsContainer = document.getElementById("rosePetals");
  if (!heartsContainer || !fireworksContainer || !petalsContainer) {
    return;
  }
  const hearts = ["💖", "💕", "💗", "💓", "💝", "💘", "❤️"];

  function createHeartWave() {
    const total = prefersReducedMotion.matches ? 8 : 15;
    for (let i = 0; i < total; i += 1) {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent = hearts[i % hearts.length];
      heart.style.left = Math.random() * 100 + "%";
      heart.style.animationDuration = 4 + Math.random() * (prefersReducedMotion.matches ? 1 : 2) + "s";
      heart.style.fontSize = 1.4 + Math.random() * (prefersReducedMotion.matches ? 0.6 : 1.1) + "rem";
      heart.style.animationDelay = Math.random() * 2 + "s";
      heartsContainer.appendChild(heart);

      setTimeout(() => heart.remove(), 6000);
    }
  }

  function createSparkles() {
    const sparkles = ["✨", "⭐", "🌟", "💫", "🔮"];

    const total = prefersReducedMotion.matches ? 6 : 12;
    for (let i = 0; i < total; i += 1) {
      const sparkle = document.createElement("div");
      sparkle.textContent = sparkles[i % sparkles.length];
      sparkle.style.position = "absolute";
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 100 + "%";
      sparkle.style.fontSize = 1 + Math.random() * 0.8 + "rem";
      sparkle.style.animation = "sparkleExplosion 3s ease-out infinite";
      sparkle.style.animationDelay = Math.random() * 3 + "s";
      fireworksContainer.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 3000);
    }
  }

  function createRosePetals() {
    const petals = ["🌹", "🌺", "🌸", "💐", "🥀"];

    const total = prefersReducedMotion.matches ? 4 : 8;
    for (let i = 0; i < total; i += 1) {
      const petal = document.createElement("div");
      petal.className = "rose-petal";
      petal.textContent = petals[i % petals.length];
      petal.style.left = Math.random() * 100 + "%";
      petal.style.animationDuration = 6 + Math.random() * 3 + "s";
      petal.style.fontSize = 1.8 + Math.random() * 0.7 + "rem";
      petal.style.animationDelay = Math.random() * 2 + "s";
      petalsContainer.appendChild(petal);

      setTimeout(() => petal.remove(), 9000);
    }
  }

  function createGoldenStars() {
    const total = prefersReducedMotion.matches ? 3 : 6;
    for (let i = 0; i < total; i += 1) {
      const star = document.createElement("div");
      star.textContent = "⭐";
      star.style.position = "absolute";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.fontSize = "2rem";
      star.style.color = "#ffd700";
      star.style.filter = "drop-shadow(0 0 10px #ffd700)";
      star.style.animation = "starTwinkle 4s ease-in-out infinite";
      star.style.animationDelay = Math.random() * 4 + "s";
      fireworksContainer.appendChild(star);

      setTimeout(() => star.remove(), 4000);
    }
  }

  // Start all effects
  createHeartWave();
  createSparkles();
  createRosePetals();
  createGoldenStars();

  const heartMax = prefersReducedMotion.matches ? 2 : 4;
  const sparkleMax = prefersReducedMotion.matches ? 2 : 4;
  const petalMax = prefersReducedMotion.matches ? 1 : 3;

  registerCelebrationLoop(createHeartWave, 4500, heartMax);
  registerCelebrationLoop(() => {
    createSparkles();
    createGoldenStars();
  }, 3600, sparkleMax);
  registerCelebrationLoop(createRosePetals, 7200, petalMax);
}

updateProgress();

document.querySelectorAll('.no-btn').forEach((button) => {
  button.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') {
      event.preventDefault();
      disappearNo(button);
    }
  });
});

const style = document.createElement("style");
style.textContent = `
            @keyframes sparkleExplosion {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { transform: scale(1.8) rotate(180deg); opacity: 1; }
                100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }
            @keyframes screenShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-15px) rotate(1deg); }
                75% { transform: translateX(15px) rotate(-1deg); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-30px); }
            }
            @keyframes starTwinkle {
                0%, 100% { 
                    transform: scale(1) rotate(0deg); 
                    opacity: 0.8; 
                    filter: drop-shadow(0 0 10px #ffd700);
                }
                25% { 
                    transform: scale(1.3) rotate(90deg); 
                    opacity: 1; 
                    filter: drop-shadow(0 0 20px #ffd700);
                }
                50% { 
                    transform: scale(0.8) rotate(180deg); 
                    opacity: 0.9; 
                    filter: drop-shadow(0 0 15px #ffd700);
                }
                75% { 
                    transform: scale(1.1) rotate(270deg); 
                    opacity: 1; 
                    filter: drop-shadow(0 0 25px #ffd700);
                }
            }
        `;
document.head.appendChild(style);
