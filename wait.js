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

const PUN_KEYS = {
  waste: ["pun.waste.0", "pun.waste.1", "pun.waste.2"],
  music: ["pun.music.0", "pun.music.1"],
  learn: ["pun.learn.0", "pun.learn.1"],
  default: ["pun.default.0", "pun.default.1", "pun.default.2"],
};

let settings = null;
let lang = "he";
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
  const minLabel = lang === "he" ? "דק'" : "min";
  const hrLabel = lang === "he" ? "שע'" : "h";
  if (mins < 60) return `${mins} ${minLabel}`;
  const h = Math.floor(mins / 60);
  return `${h}:${(mins % 60).toString().padStart(2, "0")} ${hrLabel}`;
}

(async () => {
  lang = await getLang();
  applyI18n(lang);

  settings = await new Promise(r => chrome.runtime.sendMessage({ type: "getSettings" }, r));
  const stats = await new Promise(r => chrome.runtime.sendMessage({ type: "getStats" }, r));

  if (settings.showStats && stats) {
    todayEl.textContent = formatMs(stats.todayMs);
    weekEl.textContent = formatMs(stats.weekMs);
  } else {
    statsBar.style.display = "none";
  }

  startFlow();
})();

function startFlow() {
  if (!settings.movingCancel) cancelBtn.style.opacity = "0.5";

  if (quickMode) {
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

document.getElementById("categories").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;
  chosenCategory = btn.dataset.cat;
  chrome.runtime.sendMessage({ type: "logIntent", category: chosenCategory, target });
  const catLabel = t("cat." + chosenCategory, lang);
  intentEl.textContent = t("count.intent.prefix", lang) + catLabel;
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

function showChoiceOrProceed() {
  if (!settings.enableFinalChoice) {
    chrome.runtime.sendMessage({ type: "proceed", target });
    return;
  }
  showView("choice");
  const keys = PUN_KEYS[chosenCategory] || PUN_KEYS.default;
  const key = keys[Math.floor(Math.random() * keys.length)];
  punEl.textContent = t(key, lang);
}

document.getElementById("yes").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "proceed", target });
});
document.getElementById("no").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "close" });
});

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
