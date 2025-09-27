let currentQuestion = 1;
const totalQuestions = 8;
function updateProgress() {
  const progressFill = document.getElementById("progressFill");
  const percentage = (currentQuestion / totalQuestions) * 100;
  progressFill.style.width = percentage + "%";
}

function disappearNo(button) {
  button.style.opacity = "0";
  button.style.transform = "scale(0) rotate(720deg)";
  button.style.pointerEvents = "none";

  createMagicSparkles(button);

  const container = document.querySelector(".journey-container");
  container.style.animation = "none";
  container.style.transform = "translateY(0px) rotateY(2deg)";
  setTimeout(() => {
    container.style.animation = "containerFloat 8s ease-in-out infinite";
  }, 300);

  setTimeout(() => {
    if (button.textContent.includes("Not really")) {
      showTemporaryMessage("Well, you're about to witness some! ✨", button);
    } else if (button.textContent.includes("not sure")) {
      showTemporaryMessage("Your heart knows the truth... 💕", button);
    } else if (button.textContent.includes("Maybe")) {
      showTemporaryMessage("Today is that someday! 💖", button);
    } else if (button.textContent.includes("need time")) {
      showTemporaryMessage("Time stopped when I met you... ⏰💕", button);
    }
  }, 500);
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

  setTimeout(() => {
    currentQ.classList.add("hidden");

    const nextQ = document.getElementById("question" + questionNumber);
    nextQ.classList.remove("hidden");

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
    const celebration = document.getElementById("celebration");
    celebration.style.display = "flex";
    celebration.style.animation = "epicEntrance 1.5s ease-out";

    // Create MEGA celebration effects
    createMegaCelebration();
    createVictoryExplosion();

    // Epic screen effects
    document.body.style.animation = "screenShake 1.5s ease-in-out";

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
  const heartsContainer = document.getElementById("floatingHearts");
  const hearts = ["💖", "💕", "💗", "💓", "💝", "💘", "❤️"];

  function createHeartWave() {
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent = hearts[i % hearts.length];
      heart.style.left = Math.random() * 100 + "%";
      heart.style.animationDuration = 4 + Math.random() * 2 + "s";
      heart.style.fontSize = 1.5 + Math.random() + "rem";
      heart.style.animationDelay = Math.random() * 2 + "s";
      heartsContainer.appendChild(heart);

      setTimeout(() => heart.remove(), 6000);
    }
  }

  function createSparkles() {
    const fireworksContainer = document.getElementById("fireworks");
    const sparkles = ["✨", "⭐", "🌟", "💫", "🔮"];

    for (let i = 0; i < 12; i++) {
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
    const petalsContainer = document.getElementById("rosePetals");
    const petals = ["🌹", "🌺", "🌸", "💐", "🥀"];

    for (let i = 0; i < 8; i++) {
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
    const fireworksContainer = document.getElementById("fireworks");

    for (let i = 0; i < 6; i++) {
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

  const heartInterval = setInterval(() => {
    if (document.getElementById("celebration").style.display === "flex") {
      createHeartWave();
    } else {
      clearInterval(heartInterval);
    }
  }, 4500);

  const sparkleInterval = setInterval(() => {
    if (document.getElementById("celebration").style.display === "flex") {
      createSparkles();
      createGoldenStars();
    } else {
      clearInterval(sparkleInterval);
    }
  }, 3500);

  const petalInterval = setInterval(() => {
    if (document.getElementById("celebration").style.display === "flex") {
      createRosePetals();
    } else {
      clearInterval(petalInterval);
    }
  }, 7000);
}

updateProgress();

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
