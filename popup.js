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

function formatMs(ms) {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} דק'`;
  const h = Math.floor(mins / 60);
  return `${h}:${(mins % 60).toString().padStart(2, "0")}`;
}

function render() {
  // טוגלים
  document.querySelectorAll(".toggle").forEach(t => {
    t.classList.toggle("on", !!settings[t.dataset.key]);
  });
  // sliders
  document.getElementById("idle-slider").value = settings.idleSeconds;
  document.getElementById("idle-val").textContent = settings.idleSeconds;
  document.getElementById("grace-slider").value = settings.graceMinutes;
  document.getElementById("grace-val").textContent = settings.graceMinutes;
}

async function save() {
  chrome.runtime.sendMessage({ type: "saveSettings", settings });
}

// טען הגדרות וסטטיסטיקה
chrome.runtime.sendMessage({ type: "getSettings" }, (s) => {
  settings = s;
  render();
});

chrome.runtime.sendMessage({ type: "getStats" }, (stats) => {
  if (!stats) return;
  document.getElementById("today").textContent = formatMs(stats.todayMs);
  document.getElementById("week").textContent = formatMs(stats.weekMs);

  const remaining = stats.graceUntil - Date.now();
  if (remaining > 0) {
    const banner = document.getElementById("grace-banner");
    banner.classList.add("active");
    const mins = Math.ceil(remaining / 60000);
    document.getElementById("grace-time").textContent = `עוד ${mins} דק'`;
  }
});

// טוגלים
document.querySelectorAll(".toggle").forEach(t => {
  t.addEventListener("click", () => {
    const key = t.dataset.key;
    settings[key] = !settings[key];
    render();
    save();
  });
});

// sliders
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

// presets
document.querySelectorAll(".preset").forEach(b => {
  b.addEventListener("click", () => {
    settings = { ...PRESETS[b.dataset.preset] };
    render();
    save();
  });
});

// סיום grace
document.getElementById("end-grace").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "resetGrace" }, () => {
    document.getElementById("grace-banner").classList.remove("active");
  });
});
