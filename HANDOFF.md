# Cupmori (คัพมอริ) · Phase 2 handoff for P'Joe (iOS build)

**Cupmori** · ชงความรู้สึก เก็บวันของเรา · *A little cafe for every feeling.*
Branch: `app-phase1` · `main` is untouched (live site). Status: Phase 2 is feature-complete on the web. Festival decor art and paid-pack art are still to come (see §7).
The repo is still a **clean, framework-free web project**: no Capacitor, no build step, no native plugins. Everything that touches the device sits behind `window.Platform` in `platform.js`. Swap that one object for a native bridge and the app logic stays the same.

Direction: a cute casual app first (it also works as a portfolio piece). Co-brands and real-café systems are a **later plan**, and nothing co-brand is in this build.

---

## 0. P'Joe to-do (before submission)
- [ ] **Name is final: Cupmori** (Nadda confirmed). Register **cupmori.com** and **cupmori.app** now (RDAP suggests both are free). Social handle set: **@cupmoriapp**.
- [ ] **Trademark** (Legal's preliminary check; *this is not legal advice*): no CUPMORI or คัพมอริ marks were found in Thai DIP or WIPO. Recommendation: file in **Thailand, classes 9 and 41, for both CUPMORI and คัพมอริ**, after a Thai trademark agent reviews registration **251113366 (MORI)** and the class 9 results. **US:** before launching there, a lawyer should check for a conflict with **franky, Inc.'s MORI application (99894903)**.
- [ ] **Privacy policy placeholders**: fill `[PROVIDER NAME]`, `[CONTACT EMAIL]`, `[EFFECTIVE DATE]` in `PRIVACY.md` + `privacy.html`, then host the page at a public URL for App Store Connect.
- [ ] **Launch date** (tentative; you set it). The festival engine is date-agnostic. Pass the App Store release date as `Platform.env.launchDate` (`?launch=YYYY-MM-DD` on web). It only controls the 30-day **Opening Day Set** window; `null` = not offered.
- [ ] **THB price tiers**: prices are approved (§5). Confirm the matching Apple price tiers in App Store Connect.
- [ ] **Apple Small Business Program**: apply (15% commission instead of 30%) before the first IAP goes live.
- [ ] **WeatherKit + privacy label check**: replace the Open-Meteo call with WeatherKit (§4), add the WeatherKit capability, and re-check the App Privacy answers for approximate location (§8).
- [ ] Apple Developer Program fee (check the current price on developer.apple.com).

## Open decisions
1. **Trademark/name check**: the CI check was preliminary (see §0 for Legal's findings).
2. **VI book / logo**: pending. The CI (palette, fonts, voice) is applied. The wordmark is built from Mali Bold (`assets/brand/wordmark.svg`), and a logo slot is reserved (`data-logo-slot` on the home header and side panel). Drop the final logo in there.
3. **App icon**: keep the current duck icon (`assets/icons/icon-*.png`, used by the manifest) or switch to the CI emblem icon (`assets/brand/appicon-ci-1024.webp`)?
4. Southern-hemisphere first-snow timing (engine: 1–14 June, flagged `firstSnowSouthUnconfirmed`).
5. Story drafts (§6) are Thai drafts awaiting Nadda's review (marked "ร่างเนื้อเรื่อง (DRAFT)" in the reader).

---

## 1. Architecture
```
index.html            shell: 5-tab bar, bottom sheet, toast, confetti, splash, side brand panel (wide screens)
  platform.js         window.Platform: storage / notify / haptic / share / file / env / purchases / weather   ← swap for native
  festivals.js        window.Festivals: pure date engine (astronomical lunar dates, seasons, hemisphere)
  i18n-en.js          window.I18N_EN: English dictionary (GENERATED, see §9)
  i18n.js             window.I18N: Thai source → English, MutationObserver + canvas wrapper
  content.js          window.Content: mystery hints, recipes, stories, decor, bean rules (pure data)
  sfx.js              window.SFX: WebAudio SFX + BGM loops
  art.js              SVG stickers, mood faces, MOODS
  app.js              all app logic + views (template strings → #app), one click handler (data-act / data-go)
style.css             all styling; CI variables at the top, Phase 2 components at the bottom
assets/fonts/         Mali-Bold, Nunito, NotoSansThai (woff2, bundled, OFL licences next to them)
assets/brand/         emblem.webp, wordmark.svg, appicon-ci-1024.webp
tools/                process_* (art pipelines), make_brand.py, build_i18n_en.py, qc_phase1.py, qc_phase2.py
```
All scripts and the CSS are loaded with `?v=10`. Bump it on every release so caches refresh.

Views: `home` (stamp calendar, mystery card, letters banner, beans pill) · `cafe` (mood cup, or extra-cup mode via `enterCafe(true)`) · `brew` (mini-game steps) · `done` / `xdone` · `recipes` · `room` (decor + shop + tip jar). Sheets: detail, collection (incl. story shelf), story reader, recipe detail, summary, share card, settings, about.
Tab bar: แสตมป์ / ชงวันนี้ / สูตร / ร้าน / สะสม.
Time: always `NOW()` (= `Platform.env.now()`). Debug overrides on web: `?date=YYYY-MM-DD&t=HH:MM`.

## 2. Product rules (please keep)
- **Store model:** free download plus one-time cosmetic IAP. No ads, no loot boxes, no paid gameplay advantage. **No external payment links** (no Buy Me a Coffee etc.). Club subscription comes **later** and is not built.
- **Beans are earn-only and are never sold.** There is no IAP for beans, and paid cosmetics are kept separate from bean decor.
- Tip jar "เลี้ยงกาแฟน้องเป็ด" goes through Apple IAP only and unlocks **nothing**, just a thank-you from the duck.
- Past festivals: free while the festival is live, buyable afterwards (฿29 each).
- No punishment, no timers, no lives. Missing a day never takes anything away. The mystery order has no timer and rolls over.
- **Mood cups are never judged**: no stars, only a gentle duck reaction. Stars and beans apply only to the **extra cup (แก้วพิเศษ)**, which is never logged as a mood.
- No health claims, no forced happiness, no guilt (CI voice §10). No cats anywhere. The Halloween guest is the ghost only.
- Local-first: no account, no server, no analytics. Weather is **opt-in**.

## 3. Data model (schema v3)
Main key: `ggcafe.moodcup.v1` (name kept for continuity; the version is `db.v`). Before each migration a raw copy is written to `ggcafe.moodcup.v1.bak-v<from>`.
Other keys: `ggcafe.moodcup.mute|bgm|vol` (sfx.js), `ggcafe.moodcup.haptic`, `cupmori.weather` (`{day, w}`, today only).
```js
{
  v: 3,
  entries: { "YYYY-MM-DD": { drink, barista, guest?, temp, ice: "0".."5", size, sweet, milk, decaf?, bean, grind, shots, shotq,
                             art, syrup, scoops, water, topping, cup, sleeve, stickers[], mood, note, price, ts, demo? } },
  guests:  { frog: { on, at }, bee: {...} },             // permanent
  settings:{ reminder: "20:00"|null, reminderAsked, hemi, lastNudge, missShown,
             lang: "auto"|"th"|"en", reduceMotion: false, weatherOptIn: false, shareNote: false },
  lastBarista,
  beans: 0, beansEarned: 0,                               // balance / lifetime
  beanDay: { k: "YYYY-MM-DD", mood: bool, extras: n },    // daily earning caps
  extras:  [ { k, drink, stars, ts, mystery?, recipes? } ],   // last 60 extra cups (never mood entries)
  mystery: { "YYYY-MM-DD": { h: hintId, by: guestKey } }, // served mystery orders
  recipes: { recipeKey: "YYYY-MM-DD" },                   // discovered
  friends: { guestKey: n },                               // bonus friendship (mystery orders served for that guest)
  decor:   { owned: { k: true }, place: { slot: k } },
  stories: { read: { "guest:ep": true } },
  purchases: { owned: { productId: true }, tips: n }
}
```
Migration v2→v3 (`migrate()`): ice words become cube counts (none→0, less→2, normal→4, extra→5) and the v3 fields are added with safe defaults. It is idempotent and tested by `qc_phase2.py`.
Backup file: `{ app:"cupmori", schema:3, data }` (`"moodcup"` files are still accepted). Import merges by taking the **union** of recipes/decor/stories/purchases/mystery and the **max** of beans/friends/tips.

## 4. Platform adapters (`platform.js`)
| Adapter | Web now | Native |
|---|---|---|
| storage | localStorage | UserDefaults / file (mirror the DB; WebKit data can be purged) |
| notify (daily reminder, default **20:00**) | Notification API + in-app banner | `UNCalendarNotificationTrigger` |
| haptic | `navigator.vibrate` | UIImpact/UINotificationFeedbackGenerator |
| share / file | Web Share / download / file input | UIActivityViewController / UIDocumentPicker |
| env | Date, Intl, `?date ?t ?hemi ?launch ?lang ?iap=sim ?dev=1` | real clock; `launchDate` = App Store release date |
| **weather** (opt-in) | geolocation rounded to 0.1° (~10 km) → Open-Meteo `weather_code` → `'sun'|'rain'|'cloud'`, cached for today only | **WeatherKit** + CoreLocation *when in use*, reduced accuracy. Keep it opt-in; without permission the app guesses from the season/time zone |
| **purchases** | catalog + `?iap=sim` simulator | **StoreKit 2** (§5) |

## 5. IAP catalog & StoreKit mapping (prices approved; confirm THB tiers in App Store Connect)
| Product ID | Type | THB | What |
|---|---|---|---|
| `cupmori.stickers.doodle` | non-consumable | 29 | Doodle sticker pack (moon, cloud, note). **Art ready** |
| `cupmori.fest.<festivalKey>` ×13 | non-consumable | 29 | Past-festival decor (free while live). Art: next phase |
| `cupmori.cups.pastel` | non-consumable | 79 | Pastel cup set (art pending) |
| `cupmori.secret.pack` | non-consumable | 99 | Secret-menu cup pack (art pending) |
| `cupmori.decor.cozy` | non-consumable | 149 | Cosy café decor set (art pending) |
| `cupmori.opening.set` | non-consumable | 199 | Opening Day Set, **first 30 days after launch only** (`launchDate`) |
| `cupmori.tip.small/medium/large` | consumable | 29 / 99 / 199 | Tip jar "เลี้ยงกาแฟน้องเป็ด" (unlocks nothing) |

Festival keys: lunarNewYear, valentine, easter, songkran, worldBeeDay, pride, tanabata, midAutumn, oktoberfest, halloween, diwali, loyKrathong, christmas.
StoreKit 2: `Product.products(for: ids)` → show `displayPrice` (replace `priceLabel`) → `product.purchase()` → verify the `Transaction` → `finish()` → return `{status:'purchased'}` to `Platform.purchases.buy`. Restore = `AppStore.sync()` + `Transaction.currentEntitlements` → `restore()` returns owned non-consumable ids. Items with `ready:false` show "เร็วๆ นี้" (soon) and cannot be bought.
**Apply for the Apple Small Business Program (15%).**

## 6. The five Phase-2 mechanics (build priority: stories > recipes > mystery > decor > mini-game)
1. **Regulars' stories** (`Content.STORIES`, `storyOpen()`, `storyReader`): 3–5 letters per guest (Peh, frog, hedgehog, otter, sheep, red panda, bee). They unlock by **friendship = total visits + mystery orders served** (`at:0/1/3/6…`), never by consecutive days. Unread letters show as a banner on home, and the shelf is in Collection. *Thai drafts for Nadda's review.*
2. **Recipe book** (`Content.RECIPES`, `discover()`, `recipePct()`): 28 recipes (house + secret). Secrets are tied to time of day, weather, season or festival (e.g. Rainy-Day Cocoa, Moonlight Latte, Meadow Soda for Bee Day). Undiscovered ones show as silhouettes, with a completion %.
3. **Mystery order** (`mysteryFor()`, seed `cupmori-mystery-v1`): one warm Thai hint a day (32 general + 4 Bee Day), deterministic per date and never the same as yesterday. No timer, can't fail, rolls over. Brewing a match in an extra cup gives +12 beans, +1 friendship and a thank-you line.
4. **Decor** (`Content.DECOR`, room view): 9 items in 3 tiers (plants/frame/lamps → floor lamp, monstera, second table → window seat, pastry counter). You need 2 items from the previous tier to unlock the next. Paid only with earned beans. Placed slots are saved (`decor.place`) and kept separate from paid cosmetics.
5. **Brewing mini-game**: exact ice cubes 0–5 that you can see, sweetness tag, hold-to-pour milk/soda with a gold sweet spot, toppings (whip, cheese foam, dust, boba) drawn on the real cup art. Every step is no-fail, and quality only changes the extra-cup stars (`craftStars`).
**Beans:** mood cup +5 (first save of the day) · extra cup 1/2/3★ → +2/+4/+6 (first 3 extras a day) · mystery +12 · new recipe +8. Earn-only.

## 7. Assets (new in Phase 2; all Grok-generated in the café's pencil style unless noted; see CREDITS.md)
| File | Use |
|---|---|
| `assets/img/g-bee.webp`, `scene-bee.webp` (747×1000) | World Bee Day guest portrait + counter scene |
| `assets/img/d-honeysoda.webp` | honey lemon soda glass |
| `assets/img/d-v-gl{1..6}-{latte,americano,cocoa,hojicha,matcha,mocha}.webp` | glasses regenerated **ice-free** so the code-drawn cubes match the order |
| `assets/img/room-bg.webp`, `decor-{succulent,paperlamp,floorlamp,monstera,table2,windowseat,pastrycase}.webp` | café room + decor (frame and fairy lights are SVG) |
| `assets/brand/emblem.webp`, `appicon-ci-1024.webp` | CI emblem / candidate icon |
| `assets/brand/wordmark.svg` | wordmark outlined from Mali Bold (code, `tools/make_brand.py`) |
Still to come: festival decor sets, the pastel/secret/cosy/opening pack art (`ready:false`), and the Halloween ghost guest.

## 8. Privacy & App Store checklist
- **Privacy label**: no data collected by the developer. Weather: when the user opts in, an approximate location (rounded ~10 km) is sent **only** to the weather provider for today's forecast and is not stored. With WeatherKit, Apple's own WeatherKit disclosure applies. Re-check whether App Store Connect wants "Coarse Location – App Functionality, not linked, no tracking" for your final implementation. Purchases are handled by Apple.
- `docs/ios/PrivacyInfo.xcprivacy`: tracking false, UserDefaults reason `CA92.1`. Add entries if you add SDKs.
- Permissions: notifications (when a reminder is set), location *when in use* (only if weather is switched on), photo-library add (only if you save cards to Photos).
- **Age rating**: 4+ (cute café, no violence, no gambling, no loot boxes, no user-generated content shared online).
- **Screenshots** (6.9" and 6.5" iPhone, Thai + English): 1 home with stamp calendar + mystery card · 2 café counter with duck barista · 3 brewing (hold-to-pour gauge) · 4 cup with ice/toppings + gentle duck reply · 5 recipe book · 6 decorated café room · 7 a regular's letter · 8 monthly recap / share card.
- In-app purchases are listed in App Store Connect with review screenshots; restore button is in Settings and the shop.
- Fonts are bundled (OFL), so there are no third-party requests except the opt-in weather.

## 9. Language (Thai default + English)
Thai is the source and the default. English is picked automatically when the device language starts with `en`. Settings → ภาษา · Language forces ไทย/English (the app reloads), and `?lang=en` works for QC.
`i18n.js` translates every rendered Thai string through `I18N.t()`: exact match → `{}` templates → separators (`·`, `→`, `/`, `+`, `:`) → quotes/parentheses/numbers. A MutationObserver covers the DOM (text + alt/aria/placeholder/title), and canvas `fillText`/`measureText` are wrapped. Unknown strings go to `I18N.missing` (QC lists them).
**Edit English in `tools/i18n-en/*.txt`** (`ไทย ⇒ English`, `{}` = slot), then run `python3 tools/build_i18n_en.py`. For a native SwiftUI port, export the same table to `Localizable.strings`.

## 10. CI (applied)
Palette: Cream `#FFF8EC`, Cocoa `#49342B`, Sage `#9DAE8D`, Forest `#526744` (primary buttons, Paper text), Butter `#F5D778`, Terracotta `#BD7258` (decoration only), Blush `#E7AAA0`, Lavender `#C8BFDA`. Fonts: Mali Bold (display), Nunito (English), Noto Sans Thai (body), body text 16/1.6. Card radius 24, button radius 16, touch targets ≥ 48 px. Reduce-motion option. Wood only behind images. The share card hides the personal note by default.
Voice: start "วันนี้ใจเป็นแก้วไหน?" · tired "วันนี้เหนื่อยแค่ไหน เล่าเท่าที่ไหวนะ" · back "ดีใจที่ได้เจอกันอีกนะ" · saved "เก็บแก้ววันนี้ไว้แล้ว" · empty "แก้วแรกของคุณ เริ่มได้เมื่อพร้อม" · note "เขียนนิดเดียวก็ได้นะ".

## 11. Festivals (`festivals.js`, date-agnostic)
Lunar New Year, Mid-Autumn, Diwali and Loy Krathong are **computed astronomically** (Meeus new/full moons). The verified `LUNAR` table (2026–2030) overrides the computed dates, so the engine works for any year (spot-checked 2031–2040; known edge: 2023 Loy Krathong is one day off because of a leap month, which is outside the launch window). **May = World Bee Day** (window 17–23 May): the bee guest visits and the honey menu appears (honey latte, honey lemon soda). `Festivals.isLive(k, date)` / `isPast(k, date)` drive the free-while-live store rule. There is no Mother's Day.

## 12. Retention targets (from `/workspace/projects/_research/cupmori-retention-v1.md`)
Floor = Adjust 2024 iOS all-category medians: **D1 27%, D7 14%, D30 8%**. Stretch: **D30 10%** (Tsuki on iOS). Add basic D1/D7/D30 cohort measurement (privacy-preserving, e.g. App Store Connect App Analytics) before judging the stories/decor loop. Review about 6 weeks after launch.

## 13. Testing
`python3 -m http.server 8765`, then:
- `python3 tools/qc_phase2.py` covers the v2→v3 migration (+ safety copy), exact ice cubes, a mood cup without stars, extra cup stars/beans, mystery match, recipe discovery, decor buying/placing, story unlocks, simulated IAP + tip, Bee Day guest + honey soda secret, the festival engine for future years, reduce motion, share-card note hidden, and a full English crawl. It writes `.qc2/*.png`, `qc.json` and `i18n-missing.json` and fails on any console error.
- `python3 tools/qc_phase1.py` is the Phase 1 regression.
Debug params: `?date= ?t= ?hemi=N|S ?lang=en|th ?launch=YYYY-MM-DD ?iap=sim ?weather=sun|rain|cloud ?dev=1`.
