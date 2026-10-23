# MOOD CUP · Phase 1 handoff for P'Joe (iOS build)

Branch: `app-phase1` · Status: Phase 1 feature-complete on the web, **excluding festival art**.
This repo is deliberately a **clean, framework-free web project**: no Capacitor, no native plugins, no build step.
You can wrap it however you like (WKWebView shell, or port screens to SwiftUI). Everything that touches the device sits behind `window.Platform` in `platform.js`. Swap that one object for a native bridge and the app logic stays the same.

---

## 1. Architecture

```
index.html            shell: tab bar, bottom sheet, toast, confetti canvas, splash; loads the scripts in this order:
  platform.js         window.Platform: storage / notify / haptic / share / file / env   ← swap for native
  festivals.js        window.Festivals: pure date engine (festivals, seasons, hemisphere)  ← port or reuse in JSContext
  sfx.js              window.SFX: WebAudio SFX + BGM loops (haptics forwarded to Platform.haptic)
  art.js              SVG stickers, mood faces, MOODS, STICKER_IMG (bitmap stickers)
  app.js              all app logic + views (string templates -> #app innerHTML), one click handler using data-act / data-go
style.css             all styling (Phase 1 additions are at the bottom under "===== Phase 1 =====")
privacy.html          in-app privacy page (generated from PRIVACY.md)
manifest.webmanifest  PWA manifest (web only)
tools/process_phase1.py   raw Grok art -> app assets (sizes/alpha/icon/launch)
tools/qc_phase1.py        headless QC walk-through -> .qc/*.png, exits 1 on console errors
docs/ios/PrivacyInfo.xcprivacy  draft privacy manifest (see §8)
```

Flow: `home` (calendar, banners, guest progress) → `cafe` (random duck or guest visit, chalk menu, options, usual order) → `brew` (step-by-step mini-games) → `done` (stamp, unlocks, reminder ask, share). Sheets: detail, collection, summary, story card, settings, about.

`app.js` keeps the state in `S` (view state) and `db` (persisted). Rendering is `render()` → `homeView()/cafeView()/brewView()/doneView()`. There is no framework and no virtual DOM.

Time: always use `NOW()` (= `Platform.env.now()`), never `new Date()`. On web it accepts the debug URL overrides `?date=YYYY-MM-DD` and `?t=HH:MM`. A native port should pass the real clock.

## 2. Product rules baked into the code (please keep)
- Business model: the app has nothing to sell. Physical merch runs separately alongside the app (no shop/links in the app). Real-café co-brands (incl. the Catherine Farm idea) are **on hold**, and nothing co-brand is in the build.
- No loot boxes, no paid features / IAP, no ads, no health or energy claims (decaf copy is only "ถ้าอยากเลี่ยงคาเฟอีน…").
- Local-first: no account, no server, no analytics. Data leaves the device only through user-initiated share/backup.
- No cats anywhere (art, stickers, text). The old `cat` sticker is migrated to `bean`.
- Guests unlock by **cumulative** stamps 3/7/14/30/60 and **never re-lock**. Streaks give cosmetics only and use the **best** streak, so missing a day never takes anything away.
- Sample data (`demo:true`) never counts for unlocks or streaks.

## 3. Data model & storage keys

All keys go through `Platform.storage` (localStorage on web).

| Key | Owner | Value |
|---|---|---|
| `ggcafe.moodcup.v1` | app.js | main DB JSON (name kept for continuity; **schema version is `db.v`**, currently `2`) |
| `ggcafe.moodcup.v1.bak-v1` | app.js | one-time raw copy of a v1 DB taken right before migrating to v2 |
| `ggcafe.moodcup.mute` | sfx.js | `'1'` = SFX muted |
| `ggcafe.moodcup.bgm` | sfx.js | `'0'` = music/ambience off |
| `ggcafe.moodcup.vol` | sfx.js | JSON `{music, amb, sfx}` 0..1 |
| `ggcafe.moodcup.haptic` | platform.js | `'0'` = haptics off |

DB (schema v2):
```js
{
  v: 2,
  entries: {                       // one cup per local calendar day, key "YYYY-MM-DD"
    "2026-10-23": {
      drink: "latte",              // MENU key (incl. "secret" once unlocked)
      barista: "pe",               // duck key (launch roster: pe, berry, moss, momo, bobby)
      guest: "frog",               // optional: guest who visited that day
      temp: "hot"|"iced", ice, size: "S"|"M"|"L", sweet: 0|25|50|100|120, milk, decaf: 1 (optional),
      bean, grind, shots, shotq, art, syrup, scoops, water, topping,
      cup: "mug1".."mug6"|"gl1".."gl6"|"bw1".."bw6"|"straw"|"secretcup"|"decafmug"|legacy "mug"/"tumbler"/"paper"/"glass",
      sleeve, stickers: ["heart","bean",...max 3], mood, note (<=60 chars), price, ts, demo?: true
    }
  },
  guests: { frog: { on: "2026-10-23", at: 3 }, ... },   // permanent unlocks
  settings: { reminder: "20:30"|null, reminderAsked: bool, hemi: "auto"|"N"|"S", lastNudge: "YYYY-MM-DD"|null, missShown: "YYYY-MM-DD"|null },
  lastBarista: "berry"
}
```
Migration (`migrate()` in app.js): v1 → v2 maps sticker `cat`→`bean` (deduped), adds `guests` and `settings`. On boot `syncGuests()` back-fills unlocks for users who already had stamps. It is idempotent, so you can call it again any time.

Backup/import: `exportBackup()` writes `{ app:"moodcup", schema:2, exportedAt, data: db }`. `importBackup()` accepts that file (or a raw DB). It refuses newer schemas, validates the date keys and drink keys, merges (when a date exists in both, the file's entry wins), unions the guests, and re-runs `syncGuests()`.

## 4. Platform adapters to swap for native (`platform.js`)

| Adapter | Web implementation (now) | Native replacement suggestion |
|---|---|---|
| `Platform.storage.get/set/remove/getJSON/setJSON/keys` | localStorage, falls back to memory | UserDefaults (or a file in Application Support). If you keep WKWebView, localStorage persists in the app container, but iOS can purge WebKit data, so mirror the DB to native storage |
| `Platform.notify.requestPermission/permission/scheduleDaily(hhmm,{title,body,shouldFire})/cancel/showNow` | Notification API only while the page is open + **in-app reminder banner** (`reminderDue()`) when the app is opened after the reminder time | `UNUserNotificationCenter` with `UNCalendarNotificationTrigger(dateMatching:{hour,minute}, repeats:true)`. To honour "skip days already stamped" (`shouldFire`), cancel today's request after a stamp, or schedule the next 7 single-day requests and refresh them on app open/stamp |
| `Platform.haptic.play(kind)` / `setEnabled` | `navigator.vibrate` (iOS Safari ignores it) | `UIImpactFeedbackGenerator` (light/medium/heavy), `UINotificationFeedbackGenerator` (success/warn), short sequence for `stamp`. Kinds used: `light`, `success`, `stamp`, plus raw ms numbers/arrays from the brew steps (map them to light/medium) |
| `Platform.share.png(blob,name)` → `'shared'|'cancelled'|'downloaded'` | Web Share API level 2 with files, otherwise PNG download | `UIActivityViewController` with the PNG data (story cards are 1080×1920, month card 1080×1350) |
| `Platform.share.download(blob,name)` | `<a download>` | save to Photos (`PHPhotoLibrary`, needs NSPhotoLibraryAddUsageDescription) or share sheet |
| `Platform.file.saveJSON(obj,name)` / `pickJSON()` | download / `<input type=file>` | `UIDocumentPickerViewController` (export + import) |
| `Platform.env.now/timeZone/region/hemiOverride/dev` | Date + Intl; URL overrides for QC | `Date()`, `TimeZone.current.identifier`, `Locale.current.region`; drop the overrides in release |

Only `app.js` and `sfx.js` call these, and always via `window.Platform`. Search the code for `P.` and `Platform.`.

## 5. Festival & season date engine (`festivals.js`)
Pure functions with no DOM or storage. Easy to port to Swift, or run as-is in a JSContext.
- `Festivals.active(date)` returns **all** festivals active on that day as `[{k, th, en, start, end, menu:[], decor:[]}]`. Overlaps are intentional: the UI should show **every** active decor set. Example: 29 Oct 2027 = Halloween + Diwali.
- `Festivals.upcoming(date, days)`, `Festivals.festivalMenu(date)`: limited-time MENU keys. `pumpkin` is tied to Halloween and `xmascocoa` to Christmas, which replaced the old month-number check.
- `Festivals.season(date, hemi)` returns `{season, themeMonth, hemi, flags}`. Southern hemisphere uses the theme from 6 months away. Flags: `springPicnic` (April N / October S), `autumnToWinter` (November theme), `firstSnow` (north: from 20 Nov; south: 1–14 June, per the plan's "around June", unconfirmed → also sets `firstSnowSouthUnconfirmed`).
- `Festivals.hemisphere({override, setting, timeZone, region})` picks in this order: URL override, then user setting (Settings → ฤดูกาลตามซีกโลก), then time zone (regex of southern zones), then region code, then N. **No location permission needed.**
- Rule-based dates: Easter (Computus), Oktoberfest (Saturday 15 days before the 1st Sunday of Oct → that Sunday, or 3 Oct), plus fixed windows (Valentine 10–14 Feb, Songkran 11–15 Apr, Pride June, Tanabata 1–7 Jul, Halloween October, Christmas 1–26 Dec).
- **No Mother's Day** (neither the May international date nor Thai 12 Aug): Nadda removed it from the calendar. May currently has no festival on purpose.
- Lunar table `LUNAR` (verified Oct 2026, **2026–2030 only**): Lunar New Year, Mid-Autumn, Diwali (Lakshmi Puja, New Delhi), Loy Krathong. For years missing from the table these festivals simply don't fire. `Festivals.hasLunarData(year)` lets you warn. **Add 2031+ before 2031.**
- Display windows (e.g. LNY −2…+7 days, Loy Krathong −3…+1) are in each `range()`. Tweak them freely.
- `decor:[]` is empty: festival art is Phase 2. Hook point: when the art exists, map `k → [assets]` and render the overlays in `counterScene()`.
- Debug: `?date=2027-10-29&hemi=S&dev=1` → Settings shows the engine JSON.

## 6. Feature map (where things live in app.js)
| Feature | Functions |
|---|---|
| 5-duck random barista (never the same twice in a row) | `LAUNCH_DUCKS`, `LIVE`, `enterCafe()` (other 7 ducks remain in `BARISTAS` but are never shown) |
| Guests + visits + secret menu | `GUESTS`, `syncGuests()`, `visitorFor()` (deterministic ~1 in 3 days, not on the unlock day), `counterScene(...,{guest})`, `MENU.secret` + `secretOpen()` |
| Cosmetic streak bonuses | `REWARDS`, `bestStreak()`, `lockOf()`, `currentStreak()` (display only) |
| "คิดถึงนะ" greeting | `missGap()` (≥3 days away, once per day) in `banners()` |
| Daily reminder | asked after the first real cup (`S.askReminder`), `reminderForm()`, `setReminder()`, `applyReminder()`, `reminderDue()`; Settings sheet to change/turn off |
| Time-of-day lighting / closing soon / decaf | `timeOfDay()`, `applyLighting()` (classes `tod-*` on `#phone`), `closingSoon()` (22:00–05:00) + `.closesign`, `DECAFS`, `DECAF_MUG` |
| Usual order "เหมือนเดิมไหม?" | `usualOrder()` (mode of the last 10 real cups, ≥2 repeats, only if still on the menu), `data-act="usual"` |
| Backup / import / reset | `exportBackup()`, `importBackup()`, Settings sheet |
| Share | `storyCard()`, `makeCard()`, `shareBlob()` → `Platform.share` |

## 7. Asset list
All raster art sits on cream paper and is drawn with `mix-blend-mode: multiply` (except the alpha cut-outs).

Phase 1 (16 Grok images; raw files outside the repo; processed with `tools/process_phase1.py`):
| # | File(s) | Size | Use |
|---|---|---|---|
| 1–5 | `assets/img/g-frog|hedgehog|otter|sheep|redpanda.webp` | 300×300 | guest portraits (collection, banners, unlock card) |
| 6–10 | `assets/img/scene-frog|hedgehog|otter|sheep|redpanda.webp` | 747×1000 | guest-visit counter scenes (same layout as `counter-*`, so the chalk menu overlay lines up) |
| 11 | `assets/img/d-secret.webp` | 300×300 | secret menu cup (maple cinnamon latte) |
| 12 | `assets/img/d-decaf.webp` | 300×300 | decaf mug / late-night hint |
| 13 | `assets/img/sign-closing.webp` | 420×388, alpha | "ใกล้ปิดร้าน" sign (text is HTML) |
| 14 | `assets/img/stk-bean.webp` | 155×160, alpha | bean sticker (replaces cat) |
| 15 | `assets/icons/icon-1024.png` (+512/192/180/32, `assets/img/icon.png` 180) | 1024² full-bleed, no alpha | app icon: use 1024 for the App Store / asset catalog; iOS applies the corner mask |
| 16 | `assets/img/launch.webp` (1080×1920), `assets/icons/launch-2732.png` (art centred on cream, safe under aspect-fill), `assets/icons/launch-1290x2796.png` | | launch screen. For a storyboard, use cream `#FFF7EA` background + the centred image |

Existing assets (unchanged): `counter-{pe,berry,moss,momo,bobby}.webp`, `b-*.webp` (13 duck portraits; only 5 used), `coffee/matcha/steam.webp` brew stages, `d-*.webp` drinks + `d-v-*` vessel variants, `stamps-row.webp`, `assets/sfx/*.mp3`, `assets/bgm/*.mp3` (CC0, see CREDITS.md).
Fonts: Itim, Mali, Sriracha come from Google Fonts on web. **Bundle them (SIL OFL) in the iOS app** so it works offline and makes no third-party request.

## 8. Privacy policy & privacy manifest notes
- Policy text: `PRIVACY.md` (Thai + English summary) and the in-app page `privacy.html` (Settings and the footer link to it). Before publishing, fill in the **provider name, contact email and effective date**, and host the page at a public URL for App Store Connect.
- App Privacy "nutrition label": **Data Not Collected** is accurate as long as there are no analytics/crash SDKs and no server. Notes stay on the device.
- `docs/ios/PrivacyInfo.xcprivacy` is a draft: `NSPrivacyTracking=false`, no tracking domains, no collected data types, and the UserDefaults required-reason API with reason `CA92.1`. If you add file-timestamp, disk-space or system-boot-time APIs or any SDK, add their entries. Re-check Apple's current required-reason list when you submit.
- Permissions: notifications only (asked when the user sets a reminder). Do **not** request location: hemisphere comes from time zone/region. Photo-library add permission is needed only if you save cards straight to Photos.
- Age rating: cute content; Halloween is ghosts only, and the Halloween art is not in Phase 1.

## 9. Open decisions (for Nadda)
1. Hiding the 7 deferred ducks entirely (current build) vs showing them as "coming soon".
2. Southern-hemisphere **first-snow** timing (plan says around June; engine uses 1–14 June, flagged `firstSnowSouthUnconfirmed`).
3. May festival slot: currently empty. Waiting on Nadda: possibly **World Bee Day (20 May)** using the planned bee art. Not built yet.
4. Halloween guest: little ghost vs mini Krasue vs both (art is Phase 2).
5. Launch languages: Thai only vs Thai + English (all UI strings are Thai inline today; an English pass needs a string table).
6. Sign-in provider (none today; local-only) and whether any sync is wanted later.
7. Location permission: current answer is "not needed".
8. Launch date and Apple Developer Program payment (99 USD/yr; confirm the current price on developer.apple.com before paying).
9. Privacy policy: provider name, contact email, hosting URL.
10. Reminder default time (20:00 suggested in the picker).

## 10. Testing
- `python3 -m http.server 8765` then `python3 tools/qc_phase1.py` walks through first run → full latte brew → reminder → story card → guest unlock → all guests/secret menu/usual order → guest visit → 22:40 closing + decaf → miss-you + in-app reminder → v1→v2 migration → backup export/import → festival overlap (south) → privacy page. It asserts on the data and fails on any console error.
- Debug params: `?date=`, `?t=`, `?hemi=N|S`, `?dev=1`.
