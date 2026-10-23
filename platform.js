/* MOOD CUP · platform adapters (framework-free, web fallbacks)
   Every device capability the app uses goes through window.Platform so a native
   shell (e.g. Swift/WKWebView bridge, written by P'Joe) can replace ONE object
   without touching app logic. See HANDOFF.md §4.
   - Platform.storage  : key/value persistence (web: localStorage)
   - Platform.notify   : daily reminder (web: Notification API while open + in-app fallback)
   - Platform.haptic   : light/medium/success/pattern (web: navigator.vibrate)
   - Platform.share    : share a PNG (web: Web Share API level 2 -> download fallback)
   - Platform.file     : export/import a JSON backup (web: download + <input type=file>)
   - Platform.env      : time zone / region / now() (debug overrides via URL)  */
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
  async png(blob, name, title='MOOD CUP · ก๊าบก๊าบคาเฟ่'){
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
    try { new Notification(title, { body, icon:'assets/icons/icon-192.png', tag:'moodcup-daily' }); return true; } catch (e) { return false; }
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
};

window.Platform = { storage, haptic, share, file, notify, env, name:'web' };
})();
