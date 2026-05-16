const PRESETS = {
  vacation: {
    enabled: true,
    showStats: true,
    enableCategories: false,
    enableFinalChoice: false,
    movingCancel: false,
    idleSeconds: 0,
    graceMinutes: 60,
  },
  normal: {
    enabled: true,
    showStats: true,
    enableCategories: true,
    enableFinalChoice: true,
    movingCancel: true,
    idleSeconds: 10,
    graceMinutes: 30,
  },
  study: {
    enabled: true,
    showStats: true,
    enableCategories: true,
    enableFinalChoice: true,
    movingCancel: true,
    idleSeconds: 25,
    graceMinutes: 10,
  },
};

let settings = null;
let lang = "he";

function formatMs(ms) {
  const mins = Math.floor(ms / 60000);
  const minLabel = lang === "he" ? "דק'" : "min";
  if (mins < 60) return `${mins} ${minLabel}`;
  const h = Math.floor(mins / 60);
  return `${h}:${(mins % 60).toString().padStart(2, "0")}`;
}

function render() {
  document.querySelectorAll(".toggle").forEach(el => {
    el.classList.toggle("on", !!settings[el.dataset.key]);
  });
  document.getElementById("idle-slider").value = settings.idleSeconds;
  document.getElementById("idle-val").textContent = settings.idleSeconds;
  document.getElementById("grace-slider").value = settings.graceMinutes;
  document.getElementById("grace-val").textContent = settings.graceMinutes;

  document.querySelectorAll(".lang-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}

async function save() {
  chrome.runtime.sendMessage({ type: "saveSettings", settings });
}

(async () => {
  lang = await getLang();
  applyI18n(lang);

  settings = await new Promise(r => chrome.runtime.sendMessage({ type: "getSettings" }, r));
  render();

  const stats = await new Promise(r => chrome.runtime.sendMessage({ type: "getStats" }, r));
  if (stats) {
    document.getElementById("today").textContent = formatMs(stats.todayMs);
    document.getElementById("week").textContent = formatMs(stats.weekMs);

    const remaining = stats.graceUntil - Date.now();
    if (remaining > 0) {
      const banner = document.getElementById("grace-banner");
      banner.classList.add("active");
      const mins = Math.ceil(remaining / 60000);
      const template = t("popup.grace.remaining", lang);
      document.getElementById("grace-time").textContent = template.replace("{n}", mins);
    }
  }
})();

document.querySelectorAll(".toggle").forEach(t => {
  t.addEventListener("click", () => {
    const key = t.dataset.key;
    settings[key] = !settings[key];
    render();
    save();
  });
});

document.getElementById("idle-slider").addEventListener("input", (e) => {
  settings.idleSeconds = parseInt(e.target.value, 10);
  document.getElementById("idle-val").textContent = settings.idleSeconds;
  save();
});
document.getElementById("grace-slider").addEventListener("input", (e) => {
  settings.graceMinutes = parseInt(e.target.value, 10);
  document.getElementById("grace-val").textContent = settings.graceMinutes;
  save();
});

document.querySelectorAll(".preset").forEach(b => {
  b.addEventListener("click", () => {
    settings = { ...PRESETS[b.dataset.preset] };
    render();
    save();
  });
});

document.getElementById("end-grace").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "resetGrace" }, () => {
    document.getElementById("grace-banner").classList.remove("active");
  });
});

document.querySelectorAll(".lang-btn").forEach(b => {
  b.addEventListener("click", async () => {
    lang = b.dataset.lang;
    await setLang(lang);
    applyI18n(lang);
    render();
    // ריענון תוויות תלויות-לוקאל
    const stats = await new Promise(r => chrome.runtime.sendMessage({ type: "getStats" }, r));
    if (stats) {
      document.getElementById("today").textContent = formatMs(stats.todayMs);
      document.getElementById("week").textContent = formatMs(stats.weekMs);
      const remaining = stats.graceUntil - Date.now();
      if (remaining > 0) {
        const mins = Math.ceil(remaining / 60000);
        document.getElementById("grace-time").textContent =
          t("popup.grace.remaining", lang).replace("{n}", mins);
      }
    }
  });
});
