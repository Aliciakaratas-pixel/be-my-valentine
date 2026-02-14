/* ===================================
   Valentine's Day Website – Script
   =================================== */

// ========== PLAYLIST ==========
const playlist = [
  { title: "Last Night on Earth", src: "music/Last Night on Earth.mp3" },
  { title: "Nothing's Gonna Change My Love For You", src: "music/Nothings Gonna Change My Love For You.mp3" },
  { title: "Shower", src: "music/Shower.mp3" },
  { title: "Somewhere In Neverland", src: "music/Somewhere In Neverland.mp3" },
  { title: "That's Amore", src: "music/That's Amore.mp3" },
  { title: "With Me", src: "music/With Me.mp3" },
];

let currentTrack = 0;
const audio = new Audio();
audio.volume = 0.35;
let musicStarted = false;

function loadTrack(index) {
  currentTrack = index % playlist.length;
  audio.src = playlist[currentTrack].src;
  document.getElementById("music-title").textContent = playlist[currentTrack].title;
}

function playMusic() {
  if (!musicStarted) {
    loadTrack(0);
    musicStarted = true;
  }
  audio.play().catch(() => {});
}

audio.addEventListener("ended", () => {
  loadTrack(currentTrack + 1);
  audio.play().catch(() => {});
});

document.getElementById("music-toggle").addEventListener("click", () => {
  if (audio.paused) {
    playMusic();
    document.getElementById("music-toggle").textContent = "⏸️";
  } else {
    audio.pause();
    document.getElementById("music-toggle").textContent = "🎵";
  }
});

document.getElementById("music-skip").addEventListener("click", () => {
  loadTrack(currentTrack + 1);
  audio.play().catch(() => {});
  document.getElementById("music-toggle").textContent = "⏸️";
});

// ========== SCREEN MANAGEMENT ==========
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ========== SCREEN 1: ASK ==========
const noMessages = [
  "Are you sure? 🥺",
  "Think again... 💭",
  "Pretty please? 🙏",
  "My heart is breaking... 💔",
  "You're making me sad! 😢",
  "I'll be the best valentine ever! 🌹",
  "Just say yes already! 💕",
  "I promise it'll be fun! 🎉",
  "Don't be like that... 🥹",
  "One more chance? 💝",
  "I brought chocolates! 🍫",
  "I won't give up! 💪",
  "You know you want to! 😏",
  "Last chance... or I'll ask again! 😤",
  "Okay, but what if I say please? 🥰",
];

let noCount = 0;
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");

btnNo.addEventListener("click", () => {
  noCount++;

  // Grow the Yes button
  const scale = 1 + noCount * 0.2;
  const paddingH = 16 + noCount * 4;
  const paddingW = 40 + noCount * 12;
  const fontSize = 1.2 + noCount * 0.15;
  btnYes.style.padding = `${paddingH}px ${paddingW}px`;
  btnYes.style.fontSize = `${fontSize}rem`;
  btnYes.style.transform = `scale(${Math.min(scale, 2.5)})`;

  // Shrink the No button
  const noScale = Math.max(1 - noCount * 0.08, 0.4);
  btnNo.style.transform = `scale(${noScale})`;

  // Show toast
  const msg = noMessages[Math.min(noCount - 1, noMessages.length - 1)];
  showToast(msg);

  // Start music on first interaction
  if (!musicStarted) {
    playMusic();
    document.getElementById("music-toggle").textContent = "⏸️";
  }
});

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ========== YES BUTTON → CELEBRATE ==========
btnYes.addEventListener("click", () => {
  // Start music
  if (!musicStarted) {
    playMusic();
    document.getElementById("music-toggle").textContent = "⏸️";
  }
  showScreen("screen-celebrate");
  startHeartRain();

  // Show adventure button after animations
  setTimeout(() => {
    document.getElementById("btn-start-adventure").style.display = "inline-block";
    document.getElementById("btn-start-adventure").style.animation = "fadeInUp 0.6s ease, pulse 1.5s ease-in-out infinite";
  }, 2800);
});

// ========== HEART RAIN ==========
function startHeartRain() {
  const container = document.getElementById("heart-rain-container");
  const hearts = ["💕", "💗", "💖", "💝", "❤️", "💘", "🩷", "🤍", "💜"];
  let count = 0;
  const interval = setInterval(() => {
    if (count > 60) { clearInterval(interval); return; }
    const heart = document.createElement("div");
    heart.className = "rain-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (1 + Math.random() * 2) + "rem";
    heart.style.animationDuration = (2.5 + Math.random() * 3) + "s";
    heart.style.animationDelay = Math.random() * 0.5 + "s";
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
    count++;
  }, 100);
}

// ========== START ADVENTURE ==========
document.getElementById("btn-start-adventure").addEventListener("click", () => {
  showScreen("screen-adventure");
  initTask1();
});

// ========== TASK 1: LOVE LETTER PUZZLE ==========
const puzzleSolution = ["You", "are", "the", "most", "beautiful", "thing", "that", "ever", "happened", "to", "me"];

function initTask1() {
  const dropZone = document.getElementById("puzzle-drop-zone");
  const wordBank = document.getElementById("puzzle-word-bank");
  const checkBtn = document.getElementById("puzzle-check");
  const feedback = document.getElementById("puzzle-feedback");

  dropZone.innerHTML = "";
  wordBank.innerHTML = "";
  feedback.textContent = "";

  // Shuffle words
  const shuffled = [...puzzleSolution].sort(() => Math.random() - 0.5);

  shuffled.forEach((word) => {
    const el = createWordEl(word);
    wordBank.appendChild(el);
  });

  // Click to move between bank and dropzone
  function createWordEl(word) {
    const el = document.createElement("div");
    el.className = "puzzle-word";
    el.textContent = word;
    el.draggable = true;

    // Click to toggle placement
    el.addEventListener("click", () => {
      if (el.parentElement === wordBank) {
        dropZone.appendChild(el);
      } else {
        wordBank.appendChild(el);
      }
      updateCheckBtn();
    });

    // Drag and drop
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "");
      el.classList.add("dragging");
      setTimeout(() => el.style.opacity = "0.4", 0);
    });

    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
      el.style.opacity = "1";
    });

    return el;
  }

  [dropZone, wordBank].forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const dragging = document.querySelector(".dragging");
      if (dragging) zone.appendChild(dragging);
      updateCheckBtn();
    });
  });

  function updateCheckBtn() {
    const placed = dropZone.querySelectorAll(".puzzle-word").length;
    checkBtn.disabled = placed !== puzzleSolution.length;
  }

  checkBtn.addEventListener("click", () => {
    const words = [...dropZone.querySelectorAll(".puzzle-word")].map((el) => el.textContent);
    if (words.join(" ") === puzzleSolution.join(" ")) {
      feedback.textContent = "🎉 Perfect! You revealed the love letter!";
      feedback.style.color = "#10b981";
      setTimeout(() => goToTask(2), 2000);
    } else {
      feedback.textContent = "💭 Not quite right... try again!";
      feedback.style.color = "#ef4444";
      setTimeout(() => (feedback.textContent = ""), 2000);
    }
  });
}

// ========== TASK 2: MEMORY MATCH ==========
const memoryEmojis = ["🌹", "💝", "🍫", "💌", "🧸", "💍"];

function initTask2() {
  const grid = document.getElementById("memory-grid");
  const feedback = document.getElementById("memory-feedback");
  grid.innerHTML = "";
  feedback.textContent = "";

  const pairs = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = 0;
  let locked = false;

  pairs.forEach((emoji, i) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.emoji = emoji;
    card.innerHTML = `<span class="card-front">${emoji}</span><span class="card-back">💗</span>`;

    card.addEventListener("click", () => {
      if (locked || card.classList.contains("flipped") || card.classList.contains("matched")) return;

      card.classList.add("flipped");
      flipped.push(card);

      if (flipped.length === 2) {
        locked = true;
        const [a, b] = flipped;

        if (a.dataset.emoji === b.dataset.emoji) {
          a.classList.add("matched");
          b.classList.add("matched");
          matched++;
          flipped = [];
          locked = false;

          if (matched === memoryEmojis.length) {
            feedback.textContent = "🎉 Amazing memory! All pairs found!";
            feedback.style.color = "#10b981";
            setTimeout(() => goToTask(3), 2000);
          }
        } else {
          setTimeout(() => {
            a.classList.remove("flipped");
            b.classList.remove("flipped");
            flipped = [];
            locked = false;
          }, 800);
        }
      }
    });

    grid.appendChild(card);
  });
}

// ========== TASK 3: SECRET CODE ==========
const cipherAnswer = "I LOVE YOU";
const cipherMap = {
  I: "🦋",
  L: "🌸",
  O: "🌙",
  V: "⭐",
  E: "🔥",
  Y: "🌊",
  U: "🦄",
};

function initTask3() {
  const cluesEl = document.getElementById("cipher-clues");
  const puzzleEl = document.getElementById("cipher-puzzle");
  const feedback = document.getElementById("cipher-feedback");
  const checkBtn = document.getElementById("cipher-check");
  cluesEl.innerHTML = "";
  puzzleEl.innerHTML = "";
  feedback.textContent = "";

  // Show cipher key
  Object.entries(cipherMap).forEach(([letter, emoji]) => {
    const clue = document.createElement("span");
    clue.className = "cipher-clue";
    clue.textContent = `${emoji} = ${letter}`;
    cluesEl.appendChild(clue);
  });

  // Build puzzle
  const words = cipherAnswer.split(" ");
  words.forEach((word, wi) => {
    [...word].forEach((letter) => {
      const group = document.createElement("div");
      group.className = "cipher-letter-group";

      const emoji = document.createElement("span");
      emoji.className = "cipher-emoji";
      emoji.textContent = cipherMap[letter] || "❓";

      const input = document.createElement("input");
      input.className = "cipher-input";
      input.maxLength = 1;
      input.dataset.answer = letter;

      // Auto-advance to next input
      input.addEventListener("input", () => {
        if (input.value.length === 1) {
          const next = input.parentElement.nextElementSibling?.querySelector(".cipher-input")
            || input.closest(".cipher-puzzle")?.querySelectorAll(".cipher-input")[
              [...input.closest(".cipher-puzzle").querySelectorAll(".cipher-input")].indexOf(input) + 1
            ];
          if (next) next.focus();
        }
      });

      group.appendChild(emoji);
      group.appendChild(input);
      puzzleEl.appendChild(group);
    });

    // Add space between words
    if (wi < words.length - 1) {
      const space = document.createElement("div");
      space.className = "cipher-space";
      puzzleEl.appendChild(space);
    }
  });

  checkBtn.onclick = () => {
    const inputs = [...puzzleEl.querySelectorAll(".cipher-input")];
    const answer = inputs.map((inp) => inp.value.toUpperCase()).join("");
    const correct = cipherAnswer.replace(/ /g, "");

    if (answer === correct) {
      feedback.textContent = "🎉 You cracked the code! I LOVE YOU! ❤️";
      feedback.style.color = "#10b981";
      setTimeout(() => goToTask(4), 2000);
    } else {
      feedback.textContent = "🔐 Not quite... check the clues again!";
      feedback.style.color = "#ef4444";
      setTimeout(() => (feedback.textContent = ""), 2000);
    }
  };
}

// ========== TASK 4: HIDDEN HEARTS ==========
function initTask4() {
  const scene = document.getElementById("hidden-hearts-scene");
  const feedback = document.getElementById("hearts-feedback");
  const foundEl = document.getElementById("hearts-found");
  feedback.textContent = "";
  foundEl.textContent = "0";

  // Clear previous hearts and decorations
  scene.querySelectorAll(".hidden-heart, .scene-tree, .scene-cloud, .scene-flower, .scene-house").forEach((el) => el.remove());

  // Add decorative elements
  const decorations = [
    { class: "scene-tree", emoji: "🌳", positions: [{ left: "5%", bottom: "10%" }, { left: "82%", bottom: "8%" }, { left: "45%", bottom: "5%" }] },
    { class: "scene-cloud", emoji: "☁️", positions: [{ left: "15%", top: "10%" }, { left: "65%", top: "5%" }, { left: "40%", top: "15%" }] },
    { class: "scene-flower", emoji: "🌸", positions: [{ left: "20%", bottom: "5%" }, { left: "60%", bottom: "12%" }, { left: "35%", bottom: "2%" }, { left: "75%", bottom: "3%" }] },
    { class: "scene-house", emoji: "🏡", positions: [{ left: "55%", bottom: "18%" }] },
  ];

  decorations.forEach((dec) => {
    dec.positions.forEach((pos) => {
      const el = document.createElement("div");
      el.className = dec.class;
      el.textContent = dec.emoji;
      Object.assign(el.style, pos);
      scene.appendChild(el);
    });
  });

  // Place 5 hidden hearts in tricky spots
  const heartPositions = [
    { left: "12%", top: "35%", opacity: "0.45" },
    { left: "78%", top: "60%", opacity: "0.4" },
    { left: "42%", top: "22%", opacity: "0.35" },
    { left: "65%", top: "75%", opacity: "0.5" },
    { left: "28%", top: "68%", opacity: "0.4" },
  ];

  let found = 0;

  heartPositions.forEach((pos, i) => {
    const heart = document.createElement("div");
    heart.className = "hidden-heart";
    heart.textContent = "💗";
    heart.style.left = pos.left;
    heart.style.top = pos.top;
    heart.style.opacity = pos.opacity;

    heart.addEventListener("click", () => {
      if (heart.classList.contains("found")) return;
      heart.classList.add("found");
      found++;
      foundEl.textContent = found;

      if (found === 5) {
        feedback.textContent = "🎉 You found all the hearts! Eagle eyes!";
        feedback.style.color = "#10b981";
        setTimeout(() => goToTask(5), 2000);
      }
    });

    scene.appendChild(heart);
  });
}

// ========== TASK 5: FINAL LOVE LETTER ==========
const loveLetter = `My dearest Valentine,

From the moment you came into my life, everything changed. Your smile lights up my darkest days, and your laughter is the sweetest melody I've ever heard.

Every moment with you feels like a beautiful dream I never want to wake up from. You are my sunshine, my moonlight, and every star in between.

Today and every day, I choose you. I love you more than words could ever express.

Forever yours 💝`;

function initTask5() {
  const textEl = document.getElementById("typewriter-text");
  const celebration = document.getElementById("final-celebration");
  textEl.textContent = "";
  textEl.classList.remove("done");
  celebration.style.display = "none";

  let i = 0;
  const speed = 35;

  function typeWriter() {
    if (i < loveLetter.length) {
      textEl.textContent += loveLetter.charAt(i);
      i++;
      // Scroll the letter container
      textEl.parentElement.scrollTop = textEl.parentElement.scrollHeight;
      setTimeout(typeWriter, speed);
    } else {
      textEl.classList.add("done");
      setTimeout(() => {
        celebration.style.display = "block";
        launchConfetti();
        startHeartRain();
      }, 500);
    }
  }

  typeWriter();
}

// ========== TASK NAVIGATION ==========
let currentTask = 1;

function goToTask(num) {
  document.querySelector(".active-task")?.classList.remove("active-task");
  currentTask = num;

  const taskEl = document.getElementById(`task-${num}`);
  if (taskEl) {
    taskEl.classList.add("active-task");

    // Initialize the task
    switch (num) {
      case 1: initTask1(); break;
      case 2: initTask2(); break;
      case 3: initTask3(); break;
      case 4: initTask4(); break;
      case 5: initTask5(); break;
    }
  }
}

// ========== CONFETTI ==========
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors = ["#ff6b9d", "#ee4488", "#a855f7", "#f472b6", "#fbbf24", "#34d399", "#60a5fa", "#f87171"];

  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.1,
      drift: (Math.random() - 0.5) * 1,
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    confetti.forEach((c) => {
      c.y += c.speed;
      c.x += c.drift + Math.sin(c.angle) * 0.5;
      c.angle += c.spin;

      if (c.y < canvas.height + 20) {
        alive = true;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
    });

    frame++;
    if (alive && frame < 300) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// ========== WINDOW RESIZE ==========
window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// ========== PRELOAD FIRST TRACK TITLE ==========
loadTrack(0);
