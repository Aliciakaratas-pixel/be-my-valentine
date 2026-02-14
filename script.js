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
  audio.play().catch(() => { });
}

audio.addEventListener("ended", () => {
  loadTrack(currentTrack + 1);
  audio.play().catch(() => { });
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
  audio.play().catch(() => { });
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
  if (!musicStarted) {
    playMusic();
    document.getElementById("music-toggle").textContent = "⏸️";
  }
  showScreen("screen-celebrate");
  startHeartRain();

  setTimeout(() => {
    const btn = document.getElementById("btn-start-adventure");
    btn.style.display = "inline-block";
    btn.style.animation = "fadeInUp 0.6s ease, pulse 1.5s ease-in-out infinite";
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

  const shuffled = [...puzzleSolution].sort(() => Math.random() - 0.5);

  shuffled.forEach((word) => {
    const el = createWordEl(word);
    wordBank.appendChild(el);
  });

  function createWordEl(word) {
    const el = document.createElement("div");
    el.className = "puzzle-word";
    el.textContent = word;
    el.draggable = true;

    el.addEventListener("click", () => {
      if (el.parentElement === wordBank) {
        dropZone.appendChild(el);
      } else {
        wordBank.appendChild(el);
      }
      updateCheckBtn();
    });

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

  checkBtn.onclick = () => {
    const words = [...dropZone.querySelectorAll(".puzzle-word")].map((el) => el.textContent);
    if (words.join(" ") === puzzleSolution.join(" ")) {
      feedback.textContent = "⭐ Perfect! You revealed the love letter! 💗";
      feedback.style.color = "#10b981";
      setTimeout(() => goToTask(2), 2000);
    } else {
      feedback.textContent = "💭 Not quite right... try again!";
      feedback.style.color = "#ef4444";
      setTimeout(() => (feedback.textContent = ""), 2000);
    }
  };
}

// ========== TASK 2: MEMORY MATCH (bigger grid – 8 pairs = 16 tiles) ==========
const memoryEmojis = ["🌹", "💝", "🍫", "💌", "🧸", "💍", "🦋", "🌸"];

function initTask2() {
  const grid = document.getElementById("memory-grid");
  const feedback = document.getElementById("memory-feedback");
  grid.innerHTML = "";
  feedback.textContent = "";

  const pairs = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = 0;
  let locked = false;

  pairs.forEach((emoji) => {
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
            feedback.textContent = "🌸 Amazing memory! All pairs found! ⭐";
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

// ========== TASK 3: SECRET CODE (longer message) ==========
// Sentences on separate lines for readability
const cipherLines = [
  "I LOVE YOU MY BABY",
  "BABY BELL",
  "WE HAVE SO MUCH CHEESE",
  "GOODNESS",
];
const cipherAnswer = cipherLines.join(" ");
const cipherMap = {
  I: "🦋",
  L: "🌸",
  O: "🌙",
  V: "🍀",
  E: "🔥",
  Y: "🌊",
  U: "🦄",
  M: "⭐",
  B: "🌺",
  A: "💫",
  D: "🎀",
  H: "🧸",
  S: "💎",
  C: "🌈",
  W: "🪻",
  G: "🍄",
  N: "🫧",
};

function initTask3() {
  const cluesEl = document.getElementById("cipher-clues");
  const puzzleEl = document.getElementById("cipher-puzzle");
  const feedback = document.getElementById("cipher-feedback");
  const checkBtn = document.getElementById("cipher-check");
  cluesEl.innerHTML = "";
  puzzleEl.innerHTML = "";
  feedback.textContent = "";

  Object.entries(cipherMap).forEach(([letter, emoji]) => {
    const clue = document.createElement("span");
    clue.className = "cipher-clue";
    clue.textContent = `${emoji} = ${letter}`;
    cluesEl.appendChild(clue);
  });

  // Render each sentence on its own line
  cipherLines.forEach((line) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = "cipher-line";
    lineDiv.style.display = "flex";
    lineDiv.style.flexWrap = "wrap";
    lineDiv.style.gap = "4px";
    lineDiv.style.justifyContent = "center";
    lineDiv.style.marginBottom = "10px";

    const words = line.split(" ");
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

        input.addEventListener("input", () => {
          if (input.value.length === 1) {
            const allInputs = [...puzzleEl.querySelectorAll(".cipher-input")];
            const idx = allInputs.indexOf(input);
            if (idx < allInputs.length - 1) allInputs[idx + 1].focus();
          }
        });

        group.appendChild(emoji);
        group.appendChild(input);
        lineDiv.appendChild(group);
      });

      if (wi < words.length - 1) {
        const space = document.createElement("div");
        space.className = "cipher-space";
        lineDiv.appendChild(space);
      }
    });

    puzzleEl.appendChild(lineDiv);
  });

  checkBtn.onclick = () => {
    const inputs = [...puzzleEl.querySelectorAll(".cipher-input")];
    const answer = inputs.map((inp) => inp.value.toUpperCase()).join("");
    const correct = cipherAnswer.replace(/ /g, "");

    if (answer === correct) {
      feedback.textContent = "💗 You cracked the code! 🧀🌸";
      feedback.style.color = "#10b981";
      // 🧀 CHEESE FIREWORK!
      launchCheeseFirework();
      setTimeout(() => goToTask(4), 3000);
    } else {
      feedback.textContent = "🔐 Not quite... check the clues again!";
      feedback.style.color = "#ef4444";
      setTimeout(() => (feedback.textContent = ""), 2000);
    }
  };
}

// ========== TASK 4: BLOW THE BALLOON ==========
const PUFFS_NEEDED = 20;

function initTask4() {
  const balloon = document.getElementById("balloon");
  const puffCountEl = document.getElementById("puff-count");
  const blowBtn = document.getElementById("btn-blow");
  const feedback = document.getElementById("balloon-feedback");

  let puffs = 0;
  balloon.style.width = "80px";
  balloon.style.height = "80px";
  balloon.classList.remove("popped");
  balloon.style.opacity = "1";
  balloon.style.transform = "scale(1)";
  puffCountEl.textContent = "0";
  feedback.textContent = "";

  // Update face size
  const face = balloon.querySelector(".moon-face");
  const eyes = balloon.querySelector(".moon-eyes");
  const smile = balloon.querySelector(".moon-smile");

  blowBtn.onclick = () => {
    puffs++;
    puffCountEl.textContent = puffs;

    // Grow balloon
    const size = 80 + (puffs * 8);
    balloon.style.width = size + "px";
    balloon.style.height = size + "px";

    // Scale face with balloon
    const faceScale = 1 + puffs * 0.06;
    if (eyes) eyes.style.fontSize = (0.7 + puffs * 0.04) + "rem";
    if (smile) smile.style.fontSize = (0.9 + puffs * 0.05) + "rem";

    // Wobble animation
    balloon.style.transform = `scale(${1 + Math.sin(puffs) * 0.05}) rotate(${(Math.random() - 0.5) * 6}deg)`;
    setTimeout(() => {
      balloon.style.transform = "scale(1) rotate(0deg)";
    }, 200);

    // Change shadow glow as it grows
    const glow = Math.min(puffs * 2, 40);
    balloon.style.boxShadow = `0 4px ${glow}px rgba(255, 183, 0, ${0.3 + puffs * 0.02})`;

    if (puffs >= PUFFS_NEEDED) {
      // Pop!
      blowBtn.disabled = true;
      setTimeout(() => {
        balloon.classList.add("popped");
        feedback.textContent = "🌙 The moon is shining bright for you! ⭐💗";
        feedback.style.color = "#10b981";

        // Scatter small stars
        for (let i = 0; i < 15; i++) {
          const star = document.createElement("div");
          star.textContent = ["⭐", "🌟", "✨", "💫"][Math.floor(Math.random() * 4)];
          star.style.cssText = `
            position: fixed;
            font-size: ${1 + Math.random()}rem;
            left: ${40 + Math.random() * 20}%;
            top: ${30 + Math.random() * 20}%;
            pointer-events: none;
            z-index: 100;
            animation: heartFall ${2 + Math.random() * 2}s linear forwards;
          `;
          document.body.appendChild(star);
          setTimeout(() => star.remove(), 4000);
        }

        setTimeout(() => goToTask(5), 2500);
      }, 300);
    }
  };
}

// ========== TASK 5: PICTURE PUZZLE (Jigsaw) ==========
function initTask5() {
  const grid = document.getElementById("jigsaw-grid");
  const feedback = document.getElementById("jigsaw-feedback");
  const videoReveal = document.getElementById("video-reveal");
  const video = document.getElementById("reveal-video");
  grid.innerHTML = "";
  feedback.textContent = "";
  videoReveal.style.display = "none";

  // Create a 3x3 jigsaw from the video's first frame
  // We use colored gradient pieces as a visual puzzle
  const colors = [
    "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    "linear-gradient(135deg, #ffecd2, #fcb69f)",
    "linear-gradient(135deg, #f6d365, #fda085)",
    "linear-gradient(135deg, #84fab0, #8fd3f4)",
    "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    "linear-gradient(135deg, #d4fc79, #96e6a1)",
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(135deg, #ff9a9e, #fecfef)",
  ];

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const labels = ["💗", "🌸", "⭐", "🦋", "💜", "🌙", "🌺", "💕", "✨"];

  // Create correct order reference and shuffle
  const correctOrder = [...Array(9).keys()]; // 0-8
  let currentOrder = [...correctOrder].sort(() => Math.random() - 0.5);

  // Make sure it's actually shuffled
  while (currentOrder.every((v, i) => v === i)) {
    currentOrder.sort(() => Math.random() - 0.5);
  }

  let selectedIndex = null;

  currentOrder.forEach((pieceIdx, gridPos) => {
    const piece = document.createElement("div");
    piece.className = "jigsaw-piece";
    piece.dataset.piece = pieceIdx;
    piece.dataset.gridPos = gridPos;
    piece.style.background = colors[pieceIdx];
    piece.textContent = labels[pieceIdx];
    piece.style.display = "flex";
    piece.style.alignItems = "center";
    piece.style.justifyContent = "center";
    piece.style.fontSize = "1.8rem";
    piece.style.fontWeight = "bold";
    piece.style.color = "rgba(255,255,255,0.8)";
    piece.style.textShadow = "0 2px 8px rgba(0,0,0,0.15)";

    piece.addEventListener("click", () => {
      const allPieces = [...grid.querySelectorAll(".jigsaw-piece")];

      if (selectedIndex === null) {
        // Select first piece
        selectedIndex = gridPos;
        piece.classList.add("selected");
      } else if (selectedIndex === gridPos) {
        // Deselect
        selectedIndex = null;
        piece.classList.remove("selected");
      } else {
        // Swap pieces
        const prevPiece = allPieces[selectedIndex];
        prevPiece.classList.remove("selected");

        // Swap in DOM
        const parent = grid;
        const pieces = [...parent.children];
        const idx1 = selectedIndex;
        const idx2 = gridPos;

        // Swap the piece data
        const tempBg = prevPiece.style.background;
        const tempText = prevPiece.textContent;
        const tempData = prevPiece.dataset.piece;

        prevPiece.style.background = piece.style.background;
        prevPiece.textContent = piece.textContent;
        prevPiece.dataset.piece = piece.dataset.piece;

        piece.style.background = tempBg;
        piece.textContent = tempText;
        piece.dataset.piece = tempData;

        selectedIndex = null;

        // Check if solved
        const allCorrect = [...grid.querySelectorAll(".jigsaw-piece")].every(
          (p, i) => parseInt(p.dataset.piece) === i
        );

        if (allCorrect) {
          // Mark all correct
          allPieces.forEach((p) => p.classList.add("correct"));
          feedback.textContent = "🌸 Puzzle complete! Here's your surprise! 💗";
          feedback.style.color = "#10b981";

          setTimeout(() => {
            grid.style.display = "none";
            videoReveal.style.display = "block";
            video.play().catch(() => { });
          }, 1500);

          // When video ends, go to next task
          video.addEventListener("ended", () => {
            setTimeout(() => goToTask(6), 1500);
          });

          // Also add a skip button
          setTimeout(() => {
            if (!document.getElementById("skip-video-btn")) {
              const skipBtn = document.createElement("button");
              skipBtn.id = "skip-video-btn";
              skipBtn.className = "btn btn-next";
              skipBtn.textContent = "Continue to Final Letter 💌";
              skipBtn.style.marginTop = "12px";
              skipBtn.addEventListener("click", () => {
                video.pause();
                goToTask(6);
              });
              videoReveal.appendChild(skipBtn);
            }
          }, 3000);
        }
      }
    });

    grid.appendChild(piece);
  });
}

// ========== TASK 6: FINAL LOVE LETTER ==========
const loveLetter = `My Loveletter to you

You made it to the final page my love. Have you been enjoying it so far? Do you like the music?
Take a second to take in how lovable and wonderful you are.
My love for you goes deeply and I can't help but wanting to find ways to show you how my heart feels for you.
I am so grateful for each and every day with you.

You are good. You are caring. You are warm hearted. You will be a good doctor. But most of all you are a Wonderful person.
A beloved son, a thought upon brother, a funny Mario kart uncle, a cherished and thoughtful grandchild\u2026 \u2026and my personal favorite, The most outstanding, well mannered and caring love of my life.

Happy Valentine's Day 💝`;

function initTask6() {
  const textEl = document.getElementById("typewriter-text");
  const celebration = document.getElementById("final-celebration");
  textEl.textContent = "";
  textEl.classList.remove("done");
  celebration.style.display = "none";

  let i = 0;
  const speed = 60; // Slower typewriter

  function typeWriter() {
    if (i < loveLetter.length) {
      textEl.textContent += loveLetter.charAt(i);
      i++;
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

    // Scroll to top of adventure screen
    document.getElementById("screen-adventure").scrollTop = 0;

    switch (num) {
      case 1: initTask1(); break;
      case 2: initTask2(); break;
      case 3: initTask3(); break;
      case 4: initTask4(); break;
      case 5: initTask5(); break;
      case 6: initTask6(); break;
    }
  }
}

// ========== CONFETTI (stars, hearts, flowers – no party poppers) ==========
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors = ["#ff6b9d", "#ee4488", "#a855f7", "#f472b6", "#fbbf24", "#f9a8d4", "#c084fc", "#f87171"];

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
      shape: Math.random() > 0.5 ? "heart" : "star",
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

        if (c.shape === "heart") {
          // Draw mini heart shape
          ctx.beginPath();
          ctx.moveTo(0, -c.w / 4);
          ctx.bezierCurveTo(-c.w / 2, -c.w / 2, -c.w / 2, c.w / 4, 0, c.w / 2);
          ctx.bezierCurveTo(c.w / 2, c.w / 4, c.w / 2, -c.w / 2, 0, -c.w / 4);
          ctx.fill();
        } else {
          // Draw star
          const spikes = 5;
          const outerR = c.w / 2;
          const innerR = outerR / 2;
          ctx.beginPath();
          for (let s = 0; s < spikes * 2; s++) {
            const r = s % 2 === 0 ? outerR : innerR;
            const a = (s * Math.PI) / spikes - Math.PI / 2;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        }

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

// ========== CHEESE FIREWORK 🧀 ==========
function launchCheeseFirework() {
  const cheeses = ["🧀", "🧀", "🧀", "🧈", "🫕", "🧀"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    el.textContent = cheeses[Math.floor(Math.random() * cheeses.length)];

    const angle = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.5;
    const distance = 150 + Math.random() * 250;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    const size = 1.2 + Math.random() * 1.5;
    const dur = 1 + Math.random() * 0.8;

    el.style.position = "fixed";
    el.style.left = centerX + "px";
    el.style.top = centerY + "px";
    el.style.fontSize = size + "rem";
    el.style.pointerEvents = "none";
    el.style.zIndex = "10000";
    el.style.opacity = "1";
    el.style.transform = "translate(0px, 0px) rotate(0deg)";
    document.body.appendChild(el);

    // Force browser to render initial position, then animate
    const delay = 10 + i * 5;
    setTimeout(() => {
      el.style.transition = `all ${dur}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      el.style.transform = `translate(${endX}px, ${endY}px) rotate(${Math.random() * 720}deg)`;
      el.style.opacity = "0";
    }, delay);

    setTimeout(() => el.remove(), (dur + 1) * 1000 + delay);
  }
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
