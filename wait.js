const params = new URLSearchParams(location.search);
const target = params.get("target");
const quickMode = params.get("quick") === "1";

const views = {
  category: document.getElementById("view-category"),
  countdown: document.getElementById("view-countdown"),
  choice: document.getElementById("view-choice"),
  quick: document.getElementById("view-quick"),
};
const countEl = document.getElementById("count");
const intentEl = document.getElementById("your-intent");
const targetEl = document.getElementById("target");
const punEl = document.getElementById("pun");
const cancelBtn = document.getElementById("cancel");
const todayEl = document.getElementById("today-time");
const weekEl = document.getElementById("week-time");
const statsBar = document.getElementById("stats-bar");

targetEl.textContent = target || "";

const CATEGORY_LABELS = {
  learn: "📚 ללמוד משהו ספציפי",
  "tech-news": "📰 חדשות טכנולוגיה",
  music: "🎵 מוזיקה לרקע",
  sent: "🎬 סרטון ששלחו לי",
  work: "💼 משהו לעבודה / דחוף",
  news: "🌍 חדשות / אקטואליה",
  hobby: "🎨 תחביב / עניין אישי",
  waste: "🕳️ סתם, לבזבז זמן",
};

const PUNS_BY_CATEGORY = {
  waste: [
    "🎣 האלגוריתם רעב. אתה הפיתיון.",
    "📺 'סרטון אחד' זה אף פעם לא סרטון אחד",
    "🧠 המוח שלך אמר תודה אם תסגור עכשיו",
  ],
  music: ["🎵 Spotify קיים. גם רדיו. סתם אומר.", "🎧 תוך 3 דקות תהיה בסרטון על קוסמולוגיה"],
  learn: ["📖 אולי ספר? סתם זרקתי רעיון", "✍️ ידע אמיתי דורש גם הפסקות"],
  default: [
    "⏳ כל דקה שעוברת היא דקה שלא תחזור",
    "🌅 השמש בחוץ. היא לא תהיה שם לנצח.",
    "💤 רגע, באמת התכוונת להיכנס או שזה רפלקס?",
  ],
};

let settings = null;
let chosenCategory = null;

function showView(name) {
  for (const v of Object.values(views)) {
    if (v) v.classList.remove("active");
  }
  if (views[name]) views[name].classList.add("active");
  else console.error("[YT Wait] missing view:", name);
}

function formatMs(ms) {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} דק'`;
  const h = Math.floor(mins / 60);
  return `${h}:${(mins % 60).toString().padStart(2, "0")} שע'`;
}

// ===== bootstrap =====
chrome.runtime.sendMessage({ type: "getSettings" }, (s) => {
  settings = s;
  chrome.runtime.sendMessage({ type: "getStats" }, (stats) => {
    if (settings.showStats && stats) {
      todayEl.textContent = formatMs(stats.todayMs);
      weekEl.textContent = formatMs(stats.weekMs);
    } else {
      statsBar.style.display = "none";
    }
    startFlow();
  });
});

function startFlow() {
  if (!settings.movingCancel) {
    cancelBtn.style.opacity = "0.5";
  }

  if (quickMode) {
    // grace period - שאלה מהירה בלבד
    showView("quick");
    document.getElementById("quick-yes").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "proceed", target });
    });
    document.getElementById("quick-no").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "close" });
    });
    return;
  }

  if (settings.enableCategories) {
    showView("category");
  } else {
    chosenCategory = "default";
    goToCountdownOrNext();
  }
}

// ===== מסך 1: קטגוריה =====
document.getElementById("categories").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  chosenCategory = btn.dataset.cat;
  chrome.runtime.sendMessage({ type: "logIntent", category: chosenCategory, target });
  intentEl.textContent = "באת בשביל: " + CATEGORY_LABELS[chosenCategory];
  goToCountdownOrNext();
});

function goToCountdownOrNext() {
  if (settings.idleSeconds > 0) {
    showView("countdown");
    startIdleCountdown(settings.idleSeconds);
  } else {
    showChoiceOrProceed();
  }
}

// ===== מסך 2: ספירה idle =====
let tickHandle = null;

function startIdleCountdown(maxSec) {
  let remaining = maxSec;
  countEl.textContent = remaining;

  const reset = () => {
    if (remaining < maxSec) {
      countEl.classList.add("reset");
      setTimeout(() => countEl.classList.remove("reset"), 300);
    }
    remaining = maxSec;
    countEl.textContent = remaining;
  };

  ["mousemove", "mousedown", "keydown", "touchstart", "wheel", "scroll"]
    .forEach(ev => window.addEventListener(ev, reset, { passive: true }));

  tickHandle = setInterval(() => {
    remaining--;
    countEl.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(tickHandle);
      showChoiceOrProceed();
    }
  }, 1000);
}

// ===== מסך 3: בחירה =====
function showChoiceOrProceed() {
  if (!settings.enableFinalChoice) {
    chrome.runtime.sendMessage({ type: "proceed", target });
    return;
  }
  showView("choice");
  const pool = PUNS_BY_CATEGORY[chosenCategory] || PUNS_BY_CATEGORY.default;
  punEl.textContent = pool[Math.floor(Math.random() * pool.length)];
}

document.getElementById("yes").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "proceed", target });
});
document.getElementById("no").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "close" });
});

// ===== כפתור יציאה דחופה =====
function repositionCancel() {
  if (!settings || !settings.movingCancel) return;
  const margin = 20;
  const w = window.innerWidth - cancelBtn.offsetWidth - margin * 2;
  const h = window.innerHeight - cancelBtn.offsetHeight - margin * 2;
  cancelBtn.style.left = (margin + Math.random() * w) + "px";
  cancelBtn.style.top = (margin + Math.random() * h) + "px";
}
setTimeout(repositionCancel, 100);
setInterval(repositionCancel, 2000);

cancelBtn.addEventListener("click", () => {
  if (tickHandle) clearInterval(tickHandle);
  chrome.runtime.sendMessage({ type: "proceed", target });
});
