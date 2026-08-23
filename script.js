const startBtn = document.getElementById("startBtn");
const audioHint = document.getElementById("audioHint");
const dontClick = document.getElementById("dontClick");
const surprise = document.getElementById("surprise");
const confetti = document.getElementById("confetti");

const audio = {
  song1: document.getElementById("song1"),
  song2: document.getElementById("song2")
};

const cards = {
  song1: document.querySelector('[data-audio="song1"]').closest(".music-card"),
  song2: document.querySelector('[data-audio="song2"]').closest(".music-card")
};

const buttons = document.querySelectorAll(".play-btn");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function setButton(songKey, playing) {
  const button = document.querySelector(`[data-audio="${songKey}"]`);
  if (!button) return;
  button.innerHTML = playing ? "<span>Ⅱ</span> Pause" : "<span>▶</span> Play";
  cards[songKey].classList.toggle("playing", playing);
}

function stopOtherSongs(activeKey) {
  Object.entries(audio).forEach(([key, player]) => {
    if (key !== activeKey) {
      player.pause();
      setButton(key, false);
    }
  });
}

async function playSong(songKey) {
  const player = audio[songKey];
  stopOtherSongs(songKey);

  if (player.paused) {
    try {
      await player.play();
      setButton(songKey, true);
    } catch (error) {
      setButton(songKey, false);
      console.warn("Playback could not start:", error);
    }
  } else {
    player.pause();
    setButton(songKey, false);
  }
}

buttons.forEach(button => {
  button.addEventListener("click", () => playSong(button.dataset.audio));
});

Object.entries(audio).forEach(([key, player]) => {
  player.addEventListener("timeupdate", () => {
    const card = cards[key];
    const fill = card.querySelector(".progress span");
    const times = card.querySelectorAll(".time span");
    const percent = player.duration ? (player.currentTime / player.duration) * 100 : 0;
    fill.style.width = `${percent}%`;
    times[0].textContent = formatTime(player.currentTime);
    times[1].textContent = formatTime(player.duration);
  });

  player.addEventListener("ended", () => {
    setButton(key, false);
    const fill = cards[key].querySelector(".progress span");
    fill.style.width = "0%";
  });
});

const birthdaySong = document.getElementById("birthdaySong");
birthdaySong.loop = true;

startBtn.addEventListener("click", async () => {
  // This button plays ONLY the Happy Birthday tune.
  // Kailove (song1) and Kabhi Kabhi Aditi (song2) remain untouched
  // until their own Play buttons are clicked.
  document.body.classList.add("started");

  try {
    await birthdaySong.play();
    audioHint.textContent = "Happy Birthday music is playing. 🎂";
  } catch {
    audioHint.textContent = "Your birthday note is ready. 🎂";
  }

  // Reveal the note only after the button has been clicked.
  document.querySelector(".message-section").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

dontClick.addEventListener("click", () => {
  birthdaySong.pause();
  birthdaySong.currentTime = 0;
  surprise.classList.remove("hidden");
  surprise.scrollIntoView({ behavior: "smooth", block: "start" });
  launchConfetti();
  revealAll();
  dontClick.textContent = "😄 I KNEW YOU WOULD CLICK!";
  dontClick.disabled = true;
  dontClick.style.cursor = "default";
});

function launchConfetti() {
  const fragments = 110;
  const symbols = ["✦", "•", "♥", "✧"];
  for (let i = 0; i < fragments; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--x", `${(Math.random() - .5) * 260}px`);
    piece.style.setProperty("--r", `${Math.random() * 900 - 450}deg`);
    piece.style.animationDelay = `${Math.random() * .55}s`;
    piece.style.fontSize = `${8 + Math.random() * 12}px`;
    piece.style.color = ["#f4d58a", "#f29ac8", "#c49aff", "#fff"][Math.floor(Math.random() * 4)];
    confetti.appendChild(piece);
    setTimeout(() => piece.remove(), 3400);
  }
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

function revealAll() {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

revealAll();
