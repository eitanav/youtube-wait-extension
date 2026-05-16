const bypass = new Set();

const DEFAULT_SETTINGS = {
  enabled: true,
  showStats: true,
  enableCategories: true,
  idleSeconds: 10,         // 0 = ללא ספירת idle
  enableFinalChoice: true,
  movingCancel: true,
  graceMinutes: 30,        // 0 = ללא grace period
};

async function getSettings() {
  const data = await chrome.storage.local.get("settings");
  return { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
}

async function getGrace() {
  const { graceUntil = 0 } = await chrome.storage.local.get("graceUntil");
  return graceUntil;
}

async function setGrace(minutes) {
  if (!minutes) return chrome.storage.local.remove("graceUntil");
  await chrome.storage.local.set({ graceUntil: Date.now() + minutes * 60_000 });
}

// ===== מסך המתנה =====
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;
  let url;
  try { url = new URL(details.url); } catch { return; }
  if (!url.hostname.endsWith("youtube.com")) return;
  if (bypass.has(details.tabId)) { bypass.delete(details.tabId); return; }

  const settings = await getSettings();
  if (!settings.enabled) return;

  const graceUntil = await getGrace();
  const inGrace = graceUntil > Date.now();

  const params = new URLSearchParams();
  params.set("target", details.url);
  if (inGrace) params.set("quick", "1");

  const waitUrl = chrome.runtime.getURL("wait.html") + "?" + params.toString();
  chrome.tabs.update(details.tabId, { url: waitUrl });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id;

  if (msg?.type === "proceed" && tabId != null) {
    bypass.add(tabId);
    getSettings().then(s => {
      if (s.graceMinutes > 0) setGrace(s.graceMinutes);
      chrome.tabs.update(tabId, { url: msg.target });
    });
  } else if (msg?.type === "close" && tabId != null) {
    chrome.storage.local.remove("graceUntil");
    chrome.tabs.remove(tabId);
  } else if (msg?.type === "getStats") {
    getStats().then(sendResponse);
    return true;
  } else if (msg?.type === "getSettings") {
    getSettings().then(sendResponse);
    return true;
  } else if (msg?.type === "saveSettings") {
    chrome.storage.local.set({ settings: msg.settings }).then(() => sendResponse(true));
    return true;
  } else if (msg?.type === "logIntent") {
    logIntent(msg.category, msg.target);
  } else if (msg?.type === "resetGrace") {
    chrome.storage.local.remove("graceUntil").then(() => sendResponse(true));
    return true;
  }
});

// ===== מעקב זמן ביוטיוב =====
let activeYtTabId = null;
let activeStart = null;

function isYoutube(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname.endsWith("youtube.com") &&
           !url.startsWith(chrome.runtime.getURL(""));
  } catch { return false; }
}

function todayKey() { return "yt_" + new Date().toISOString().slice(0, 10); }

async function flushTime() {
  if (activeStart && activeYtTabId != null) {
    const elapsed = Date.now() - activeStart;
    activeStart = Date.now();
    const key = todayKey();
    const data = await chrome.storage.local.get(key);
    await chrome.storage.local.set({ [key]: (data[key] || 0) + elapsed });
  }
}

async function setActive(tabId, url) {
  await flushTime();
  if (isYoutube(url)) {
    activeYtTabId = tabId;
    activeStart = Date.now();
  } else {
    activeYtTabId = null;
    activeStart = null;
  }
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try { const tab = await chrome.tabs.get(tabId); await setActive(tabId, tab.url); } catch {}
});
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.url && tab.active) await setActive(tabId, info.url);
});
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (tabId === activeYtTabId) {
    await flushTime();
    activeYtTabId = null;
    activeStart = null;
  }
});
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await flushTime();
    activeYtTabId = null;
    activeStart = null;
  } else {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) await setActive(tab.id, tab.url);
  }
});

chrome.alarms.create("flush", { periodInMinutes: 0.25 });
chrome.alarms.onAlarm.addListener((a) => { if (a.name === "flush") flushTime(); });

async function getStats() {
  const today = todayKey();
  const all = await chrome.storage.local.get(null);
  const todayMs = all[today] || 0;
  let weekMs = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weekMs += all["yt_" + d.toISOString().slice(0, 10)] || 0;
  }
  return { todayMs, weekMs, graceUntil: all.graceUntil || 0 };
}

async function logIntent(category, target) {
  const data = await chrome.storage.local.get("intents");
  const intents = data.intents || [];
  intents.push({ category, target, ts: Date.now() });
  await chrome.storage.local.set({ intents: intents.slice(-200) });
}
