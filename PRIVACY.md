# Privacy Policy — YouTube Wait

**Last updated: 2026-05-16**

## Short version

This extension does **not** collect, transmit, or share any user data. Everything stays in your browser, on your device.

## What the extension stores

The extension uses `chrome.storage.local` (Chrome's built-in local storage, scoped to the extension and bound to your browser profile) to keep:

- **Your settings** — language preference, toggles, slider values, preset choice.
- **Daily time-on-YouTube counters** — how many milliseconds the active YouTube tab was focused, keyed by date (e.g. `yt_2026-05-16`).
- **Intent log** — the last 200 category choices you made on the wait screen (e.g. `learn`, `music`, `waste`) with the target URL and timestamp.
- **Grace timestamp** — when your current 30-minute "yes, proceed" window expires.

All of this lives **only** in your browser profile. The extension does not:

- Send any of this data to any server.
- Share it with any third party.
- Sync it to a cloud (unless you have Chrome Sync enabled for extension storage — in which case it syncs through your own Google account only).
- Show ads.
- Use analytics, telemetry, or crash reporting.

## What the extension watches

- **Navigation events to `*.youtube.com`** — used to intercept the navigation and show the wait screen. The URL is read locally and never leaves your device.
- **Tab focus changes** — to count how long a YouTube tab is the active, focused tab. Only the duration is recorded; no page content is inspected.

## External resources

The extension loads **Google Fonts** stylesheets from `fonts.googleapis.com` and `fonts.gstatic.com` to render the Orbitron / Heebo / Inter fonts. Google may log these font requests; this is governed by [Google's privacy policy](https://policies.google.com/privacy). No personal data is sent in these requests beyond what any browser sends when loading a public font.

## Permissions explained

| Permission | Why it's needed |
|------------|----------------|
| `webNavigation` | Detect navigation to youtube.com before the page loads, to show the wait screen. |
| `tabs` | Redirect the tab to the wait screen and close the tab when you choose "No, I have a life". |
| `storage` | Save your settings and local statistics. |
| `alarms` | Periodically save tracking data so it isn't lost on browser close. |
| `host_permissions: *://*.youtube.com/*` | Apply the wait screen specifically to YouTube. |

## Your data, your control

- **Clear everything** — right-click the extension icon → **Manage Extension** → **Site access** → or remove the extension. Removing the extension wipes all `chrome.storage.local` data.
- **Reset settings** — in the popup, the three preset buttons (Vacation / Normal / Study) overwrite all toggles.
- **End grace window** — in the popup, the "End now" button cancels the active 30-minute pass.

## Contact

Open an issue at [github.com/eitanav/youtube-wait-extension/issues](https://github.com/eitanav/youtube-wait-extension/issues).

## Changes

This policy may be updated; the date at the top reflects the last change. The repository's git history shows the full edit log.
