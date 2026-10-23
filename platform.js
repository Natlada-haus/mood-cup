/* Cupmori · platform adapters (framework-free, web fallbacks)
   Every device capability the app uses goes through window.Platform so a native
   shell (e.g. Swift/WKWebView bridge, written by P'Joe) can replace ONE object
   without touching app logic. See HANDOFF.md §4.
   - Platform.storage  : key/value persistence (web: localStorage)
   - Platform.notify   : daily reminder (web: Notification API while open + in-app fallback)
   - Platform.haptic   : light/medium/success/pattern (web: navigator.vibrate)
   - Platform.share    : share a PNG (web: Web Share API level 2 -> download fallback)
   - Platform.file     : export/import a JSON backup (web: download + <input type=file>)
   - Platform.env      : time zone / region / now() / weather() (debug overrides via URL)
   - Platform.purchases: StoreKit stub + product catalog (web: unavailable; ?iap=sim simulates for QC)  */
(() => {
const qs = new URLSearchParams(location.search);

/* ---------- storage ---------- */
const mem = {};
const storage = {
  get(key){ try { return localStorage.getItem(key); } catch (e) { return key in mem ? mem[key] : null; } },
  set(key, val){ try { localStorage.setItem(key, val); return true; } catch (e) { mem[key] = val; return false; } },
  remove(key){ try { localStorage.removeItem(key); } catch (e) {} delete mem[key]; },
  getJSON(key, def){ const s = storage.get(key); if (s == null) return def; try { return JSON.parse(s); } catch (e) { return def; } },
  setJSON(key, obj){ return storage.set(key, JSON.stringify(obj)); },
  keys(prefix=''){ const out = []; try { for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if (k && k.startsWith(prefix)) out.push(k); } } catch (e) { out.push(...Object.keys(mem).filter(k => k.startsWith(prefix))); } return out; },
};

/* ---------- haptics ---------- */
const PAT = { light:8, medium:16, heavy:28, success:[12,40,12], stamp:[20,60,20,60,30], warn:[30,40,30] };
const haptic = {
  enabled: storage.get('ggcafe.moodcup.haptic') !== '0',
  /* kind: 'light' | 'medium' | 'heavy' | 'success' | 'stamp' | 'warn' | number | number[] */
  play(kind){ if (!haptic.enabled) return; const p = typeof kind === 'string' ? PAT[kind] || PAT.light : kind; try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} },
  setEnabled(on){ haptic.enabled = !!on; storage.set('ggcafe.moodcup.haptic', on ? '1' : '0'); },
};

/* ---------- share / files ---------- */
function download(url, name){ const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
const share = {
  /* returns 'shared' | 'cancelled' | 'downloaded' */
  async png(blob, name, title='Cupmori'){
    const f = new File([blob], name, { type:'image/png' });
    if (navigator.canShare && navigator.canShare({ files:[f] })){
      try { await navigator.share({ files:[f], title }); return 'shared'; }
      catch (err){ if (err && err.name === 'AbortError') return 'cancelled'; }
    }
    const url = URL.createObjectURL(blob); download(url, name); setTimeout(() => URL.revokeObjectURL(url), 4000); return 'downloaded';
  },
  download(blob, name){ const url = URL.createObjectURL(blob); download(url, name); setTimeout(() => URL.revokeObjectURL(url), 4000); },
};
const file = {
  saveJSON(obj, name){ share.download(new Blob([JSON.stringify(obj, null, 1)], { type:'application/json' }), name); },
  pickJSON(){ return new Promise((res, rej) => {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json,.json';
    inp.onchange = () => { const f = inp.files && inp.files[0]; if (!f) return rej(new Error('none')); const r = new FileReader(); r.onload = () => { try { res(JSON.parse(r.result)); } catch (e) { rej(e); } }; r.onerror = rej; r.readAsText(f); };
    inp.click(); }); },
};

/* ---------- daily reminder ---------- */
/* Web cannot schedule a notification while the page is closed (no push server: local-first).
   So on web: (1) if permission granted and page open/background at reminder time -> Notification;
   (2) otherwise the app shows an in-app reminder banner next time it is opened after the time.
   Native: replace schedule/cancel with UNUserNotificationCenter (UNCalendarNotificationTrigger, repeats:true). */
let timer = null;
const notify = {
  supported: () => 'Notification' in window,
  permission: () => ('Notification' in window ? Notification.permission : 'unsupported'),
  async requestPermission(){ if (!('Notification' in window)) return 'unsupported'; try { return await Notification.requestPermission(); } catch (e) { return 'denied'; } },
  /* schedule daily at "HH:MM"; shouldFire() lets the app skip days already stamped */
  scheduleDaily(hhmm, { title, body, shouldFire } = {}){
    notify.cancel(); if (!hhmm) return;
    const tick = () => {
      const now = env.now(), [h, m] = hhmm.split(':').map(Number), at = new Date(now); at.setHours(h, m, 0, 0);
      if (at <= now) at.setDate(at.getDate() + 1);
      timer = setTimeout(() => { if (!shouldFire || shouldFire()) notify.showNow(title, body); tick(); }, Math.min(at - now, 2147483000));
    };
    tick();
  },
  cancel(){ clearTimeout(timer); timer = null; },
  showNow(title, body){
    if (notify.permission() !== 'granted') return false;
    try { new Notification(title, { body, icon:'assets/icons/cupmori-icon-192.png', tag:'cupmori-daily' }); return true; } catch (e) { return false; }
  },
};

/* ---------- environment (time, region, debug overrides) ---------- */
const env = {
  dev: qs.has('dev'),
  timeZone(){ try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } },
  region(){ const l = (navigator.languages && navigator.languages[0]) || navigator.language || ''; const m = l.match(/[-_]([A-Z]{2})\b/i); return m ? m[1].toUpperCase() : ''; },
  /* now(): real clock, unless ?date=YYYY-MM-DD and/or ?t=HH:MM are given (QC/testing only) */
  now(){
    const d = new Date(), qd = qs.get('date'), qt = qs.get('t');
    if (qd && /^\d{4}-\d{2}-\d{2}$/.test(qd)){ const [y, mo, da] = qd.split('-').map(Number); d.setFullYear(y, mo - 1, da); }
    if (qt && /^\d{1,2}:\d{2}$/.test(qt)){ const [h, mi] = qt.split(':').map(Number); d.setHours(h, mi, 0, 0); }
    return d;
  },
  hemiOverride: () => (qs.get('hemi') || '').toUpperCase() || null,
  /* QC override only: ?weather=rain|sun|cloud. Real weather = Platform.weather (opt-in). */
  weather(){ const w = qs.get('weather'); return ['rain','sun','cloud'].includes(w) ? w : null; },
  /* App launch date 'YYYY-MM-DD' for the Opening Day Set window (first 30 days). TENTATIVE: P'Joe sets it when the
     App Store date is final (or via ?launch=YYYY-MM-DD for QC). null = the Opening Day Set is not offered. */
  launchDate: (/^\d{4}-\d{2}-\d{2}$/.test(qs.get('launch') || '') ? qs.get('launch') : null),
};

/* ---------- weather (OPT-IN, approved by Nadda) ----------
   Only after the user switches it on in Settings. Asks for location once, rounds it to ~10 km, and asks for TODAY'S
   weather only. Nothing is stored except the result word ('sun'|'rain'|'cloud') for the current day.
   Web: Open-Meteo (free, no key; disclosed in the privacy policy). Native iOS: replace fetchFor() with WeatherKit
   (CoreLocation 'when in use', reduced accuracy is enough). Without permission the app uses a season/timezone guess. */
const WKEY = 'cupmori.weather';
const dayKey = () => { const d = env.now(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
const wmo = c => c == null ? null : (c >= 51 && c <= 67) || (c >= 80 && c <= 99) ? 'rain' : c <= 1 ? 'sun' : 'cloud';
const weather = {
  supported: () => !!(navigator.geolocation && window.fetch),
  cached(){ const v = storage.getJSON(WKEY, null); return v && v.day === dayKey() ? v.w : null; },
  forget(){ storage.remove(WKEY); },
  async fetchFor(lat, lon){
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(1)}&longitude=${lon.toFixed(1)}&current=weather_code&timezone=auto`;
    const r = await fetch(u, { cache:'no-store' }); if (!r.ok) throw new Error('weather'); const j = await r.json();
    return wmo(j && j.current ? j.current.weather_code : null);
  },
  /* returns 'sun'|'rain'|'cloud' or null (denied / offline). Safe to call once per day. */
  async refresh(){
    if (!weather.supported()) return null; const c = weather.cached(); if (c) return c;
    try {
      const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy:false, maximumAge:6 * 3600e3, timeout:10000 }));
      const w = await weather.fetchFor(pos.coords.latitude, pos.coords.longitude);
      if (w) storage.setJSON(WKEY, { day:dayKey(), w }); return w;
    } catch (e) { return null; }
  },
};

/* ---------- in-app purchases (StoreKit stub) ----------
   Free download · no ads · one-time cosmetic IAP only · no loot boxes · NO external payment links.
   Beans are earned only and are NEVER sold. Tips unlock nothing (a thank-you from the duck only).
   Prices APPROVED by Nadda (Oct 2026). THB tiers must still be confirmed in App Store Connect (Apple price tiers).
   Product IDs: prefix with the final bundle id if you prefer.
   type: 'non-consumable' | 'consumable' (tips). ready:false = art not produced yet (shown as "เร็วๆ นี้").
   Club subscription comes later and is NOT in this build. */
const PRICE_NOTE = 'approved · confirm THB tier in App Store Connect';
const CATALOG = [
  { id:'cupmori.stickers.doodle', kind:'stickers', type:'non-consumable', thb:29,  th:'สติกเกอร์ชุดดูเดิล', desc:'สติกเกอร์พระจันทร์ ก้อนเมฆ ตัวโน้ต สำหรับแต่งแก้ว', ready:true },
  { id:'cupmori.cups.pastel',     kind:'cups',     type:'non-consumable', thb:79,  th:'ชุดแก้วพาสเทล', desc:'แก้วลายใหม่ 4 ใบ (ภาพกำลังวาด)', ready:false },
  { id:'cupmori.secret.pack',     kind:'secret',   type:'non-consumable', thb:99,  th:'ชุดแก้วเมนูลับ', desc:'แก้วลายพิเศษสำหรับเมนูลับ (ภาพกำลังวาด)', ready:false },
  { id:'cupmori.decor.cozy',      kind:'decor',    type:'non-consumable', thb:149, th:'ชุดแต่งร้านโคซี่', desc:'ของแต่งร้านชุดพิเศษ แยกจากของที่แลกด้วยเมล็ดกาแฟ (ภาพกำลังวาด)', ready:false },
  { id:'cupmori.opening.set',     kind:'opening',  type:'non-consumable', thb:199, th:'ชุดวันเปิดร้าน', desc:'ชุดของที่ระลึกวันเปิดร้าน ขายเฉพาะ 30 วันแรกหลังเปิดตัว (ภาพกำลังวาด)', ready:false, window:30 },
  /* past festivals: free while the festival is live, buyable after it ends. One product per festival key (festivals.js). */
  ...['lunarNewYear','valentine','easter','songkran','worldBeeDay','pride','tanabata','midAutumn','oktoberfest','halloween','diwali','loyKrathong','christmas']
    .map(k => ({ id:`cupmori.fest.${k}`, kind:'festival', fest:k, type:'non-consumable', thb:29, th:'ชุดเทศกาล', desc:'ของแต่งเทศกาลที่ผ่านไปแล้ว (ระหว่างเทศกาลใช้ฟรี) · ภาพเทศกาลอยู่ใน Phase ถัดไป', ready:false })),
  /* tip jar "เลี้ยงกาแฟน้องเป็ด": consumable, unlocks nothing */
  { id:'cupmori.tip.small',  kind:'tip', type:'consumable', thb:29,  th:'เลี้ยงเอสเปรสโซ่น้องเป็ด', ready:true },
  { id:'cupmori.tip.medium', kind:'tip', type:'consumable', thb:99,  th:'เลี้ยงลาเต้น้องเป็ด', ready:true },
  { id:'cupmori.tip.large',  kind:'tip', type:'consumable', thb:199, th:'เลี้ยงเค้กกับกาแฟน้องเป็ด', ready:true },
].map(p => Object.assign({ priceNote:PRICE_NOTE }, p));
const SIM = qs.get('iap') === 'sim';
const purchases = {
  catalog: CATALOG,
  /* true when the store can sell (native). Web: false (unless ?iap=sim for QC). */
  available: () => SIM,
  /* localized price string from the store; web shows the suggested THB price */
  priceLabel: p => `฿${p.thb}`,
  /* returns { status:'purchased'|'cancelled'|'pending'|'unavailable', id }
     Native: StoreKit 2 -> Product.products(for:ids), product.purchase(), verify Transaction, transaction.finish() */
  async buy(id){ if (!CATALOG.some(p => p.id === id)) return { status:'unavailable', id }; return SIM ? { status:'purchased', id } : { status:'unavailable', id }; },
  /* returns owned non-consumable ids. Native: Transaction.currentEntitlements (+ AppStore.sync() on "Restore") */
  async restore(){ return []; },
};

window.Platform = { storage, haptic, share, file, notify, env, purchases, weather, name:'web' };
})();
