// תרגומים לכל מחרוזות התוסף
const STRINGS = {
  he: {
    // wait page
    "wait.title": "רגע לפני שאתה נכנס...",
    "wait.subtitle": "נשום. תחשוב. למה אתה פה?",
    "stats.today": "היום ביוטיוב",
    "stats.week": "השבוע:",

    // category screen
    "cat.title": "למה אתה נכנס ליוטיוב?",
    "cat.subtitle": "בחר בכנות - זה רק בינך לבין עצמך",
    "cat.learn": "📚 ללמוד משהו ספציפי",
    "cat.tech-news": "📰 חדשות טכנולוגיה",
    "cat.music": "🎵 מוזיקה לרקע",
    "cat.sent": "🎬 סרטון ששלחו לי",
    "cat.work": "💼 משהו לעבודה / דחוף",
    "cat.news": "🌍 חדשות / אקטואליה",
    "cat.hobby": "🎨 תחביב / עניין אישי",
    "cat.waste": "🕳️ סתם, לבזבז זמן",

    // countdown
    "count.title": "שב בשקט",
    "count.subtitle": "אל תזיז את העכבר, אל תיגע במקלדת. רגע אחד של נוכחות.",
    "count.hint.prefix": "כל תנועה ",
    "count.hint.bold": "מאפסת את הספירה",
    "count.intent.prefix": "באת בשביל: ",

    // quick (grace)
    "quick.title": "ממשיך לראות? 👀",
    "quick.subtitle": "אתה בתוך חלון 30 הדקות שאישרת קודם. רק לוודא שאתה עוד מתכוון.",
    "quick.yes.label": "כן, ממשיך ⏯️",
    "quick.yes.desc": "חזרה לסרטונים, מאריך את ה-30 דק'",
    "quick.no.label": "לא, מספיק 🌳",
    "quick.no.desc": "סגור את הכרטיסייה",

    // choice
    "choice.title": "אז... להיכנס ליוטיוב?",
    "choice.yes.label": "כן, קח את היום שלי 🕳️",
    "choice.yes.desc": "אני מוותר על השעתיים הקרובות מרצוני החופשי",
    "choice.no.label": "לא, יש לי חיים 🌳",
    "choice.no.desc": "סגור את הכרטיסייה הזאת מיד",

    "exit": "× יציאה",
    "exit.title": "יציאה דחופה",

    // puns
    "pun.waste.0": "🎣 האלגוריתם רעב. אתה הפיתיון.",
    "pun.waste.1": "📺 'סרטון אחד' זה אף פעם לא סרטון אחד",
    "pun.waste.2": "🧠 המוח שלך אמר תודה אם תסגור עכשיו",
    "pun.music.0": "🎵 Spotify קיים. גם רדיו. סתם אומר.",
    "pun.music.1": "🎧 תוך 3 דקות תהיה בסרטון על קוסמולוגיה",
    "pun.learn.0": "📖 אולי ספר? סתם זרקתי רעיון",
    "pun.learn.1": "✍️ ידע אמיתי דורש גם הפסקות",
    "pun.default.0": "⏳ כל דקה שעוברת היא דקה שלא תחזור",
    "pun.default.1": "🌅 השמש בחוץ. היא לא תהיה שם לנצח.",
    "pun.default.2": "💤 רגע, באמת התכוונת להיכנס או שזה רפלקס?",

    // popup
    "popup.title": "🎬 YouTube Wait",
    "popup.subtitle": "שלוט בכמה חיכוך אתה רוצה",
    "popup.stat.today": "היום",
    "popup.stat.week": "השבוע",
    "popup.grace.prefix": "🟢 grace פעיל: ",
    "popup.grace.end": "סיים עכשיו",
    "popup.grace.remaining": "עוד {n} דק'",
    "popup.section.preset": "פריסט מהיר",
    "popup.preset.vacation": "חופש",
    "popup.preset.normal": "רגיל",
    "popup.preset.study": "לימודים",
    "popup.section.features": "פונקציות",
    "popup.enabled.title": "תוסף פעיל",
    "popup.enabled.desc": "כיבוי כולל של מסך ההמתנה",
    "popup.stats.title": "📊 מעקב זמן",
    "popup.stats.desc": "הצגת זמן בזבוז יומי/שבועי",
    "popup.categories.title": "🎯 בחירת קטגוריה",
    "popup.categories.desc": "\"למה אתה נכנס?\" לפני הכניסה",
    "popup.finalchoice.title": "🎭 מסך בחירה סופי",
    "popup.finalchoice.desc": "כן/לא עם פאן בסוף",
    "popup.movecancel.title": "🏃 כפתור יציאה נסתר",
    "popup.movecancel.desc": "קופץ למיקום אקראי",
    "popup.idle.title": "⏱️ ספירת idle",
    "popup.idle.unit": "שנ'",
    "popup.idle.desc": "0 = ללא ספירה",
    "popup.grace.title": "🕐 Grace period",
    "popup.grace.unit": "דק'",
    "popup.grace.desc": "אחרי \"כן\" - חלון של גישה חופשית",
    "popup.section.language": "שפה",
    "popup.footer": "השינויים נשמרים אוטומטית",
  },

  en: {
    // wait page
    "wait.title": "Hold up before you go in...",
    "wait.subtitle": "Breathe. Think. Why are you here?",
    "stats.today": "Today on YouTube",
    "stats.week": "This week:",

    // category
    "cat.title": "Why are you opening YouTube?",
    "cat.subtitle": "Be honest — it's between you and yourself",
    "cat.learn": "📚 Learn something specific",
    "cat.tech-news": "📰 Tech news",
    "cat.music": "🎵 Background music",
    "cat.sent": "🎬 A video someone sent me",
    "cat.work": "💼 Work / urgent",
    "cat.news": "🌍 News / current affairs",
    "cat.hobby": "🎨 Hobby / personal interest",
    "cat.waste": "🕳️ Just killing time",

    // countdown
    "count.title": "Sit still",
    "count.subtitle": "Don't move the mouse, don't touch the keyboard. One moment of presence.",
    "count.hint.prefix": "Any movement ",
    "count.hint.bold": "resets the counter",
    "count.intent.prefix": "You came for: ",

    // quick
    "quick.title": "Still watching? 👀",
    "quick.subtitle": "You're inside the 30-min window you approved. Just making sure you still mean it.",
    "quick.yes.label": "Yes, keep going ⏯️",
    "quick.yes.desc": "Back to videos, extends the 30 min",
    "quick.no.label": "No, enough 🌳",
    "quick.no.desc": "Close the tab",

    // choice
    "choice.title": "So... entering YouTube?",
    "choice.yes.label": "Yes, take my day 🕳️",
    "choice.yes.desc": "I willingly forfeit the next two hours",
    "choice.no.label": "No, I have a life 🌳",
    "choice.no.desc": "Close this tab right now",

    "exit": "× Exit",
    "exit.title": "Emergency exit",

    // puns
    "pun.waste.0": "🎣 The algorithm's hungry. You're the bait.",
    "pun.waste.1": "📺 'Just one video' is never just one video",
    "pun.waste.2": "🧠 Your brain would thank you if you closed now",
    "pun.music.0": "🎵 Spotify exists. So does radio. Just saying.",
    "pun.music.1": "🎧 In 3 minutes you'll be on a cosmology video",
    "pun.learn.0": "📖 Maybe a book? Just throwing it out there",
    "pun.learn.1": "✍️ Real knowledge needs breaks too",
    "pun.default.0": "⏳ Every minute that passes won't come back",
    "pun.default.1": "🌅 The sun's out. It won't be there forever.",
    "pun.default.2": "💤 Wait — did you actually mean to come here, or was that a reflex?",

    // popup
    "popup.title": "🎬 YouTube Wait",
    "popup.subtitle": "Control how much friction you want",
    "popup.stat.today": "Today",
    "popup.stat.week": "Week",
    "popup.grace.prefix": "🟢 grace active: ",
    "popup.grace.end": "End now",
    "popup.grace.remaining": "{n} min left",
    "popup.section.preset": "Quick preset",
    "popup.preset.vacation": "Vacation",
    "popup.preset.normal": "Normal",
    "popup.preset.study": "Study",
    "popup.section.features": "Features",
    "popup.enabled.title": "Extension active",
    "popup.enabled.desc": "Master switch for the wait screen",
    "popup.stats.title": "📊 Time tracking",
    "popup.stats.desc": "Show daily/weekly time wasted",
    "popup.categories.title": "🎯 Category selection",
    "popup.categories.desc": "\"Why are you entering?\" before entry",
    "popup.finalchoice.title": "🎭 Final choice screen",
    "popup.finalchoice.desc": "Yes/no with a pun at the end",
    "popup.movecancel.title": "🏃 Hidden exit button",
    "popup.movecancel.desc": "Jumps to random positions",
    "popup.idle.title": "⏱️ Idle countdown",
    "popup.idle.unit": "sec",
    "popup.idle.desc": "0 = disabled",
    "popup.grace.title": "🕐 Grace period",
    "popup.grace.unit": "min",
    "popup.grace.desc": "After \"yes\" — free access window",
    "popup.section.language": "Language",
    "popup.footer": "Changes save automatically",
  },
};

async function getLang() {
  const { lang } = await chrome.storage.local.get("lang");
  return lang || "he";
}

async function setLang(lang) {
  await chrome.storage.local.set({ lang });
}

function t(key, lang) {
  return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.he[key] || key;
}

function applyI18n(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key, lang);
    if (val) el.textContent = val;
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.dataset.i18nTitle, lang);
  });
}
