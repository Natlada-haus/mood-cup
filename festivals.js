/* Cupmori · festival & season date engine (no art; decor registry is empty in Phase 1)
   - Real calendar dates each year (lunar festivals from a verified table, rule-based ones computed)
   - Overlaps: active() returns EVERY festival active on a date -> the app shows all decor sets
   - Seasons are hemisphere-aware; the southern hemisphere uses the theme from 6 months away
   Pure functions, no DOM, no storage: easy to port to Swift. See HANDOFF.md §5.  */
(() => {
const D = (y, m, d) => new Date(y, m - 1, d);
const addDays = (dt, n) => { const x = new Date(dt); x.setDate(x.getDate() + n); return x; };
const dayOnly = dt => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
const nthWeekday = (y, m, wd, n) => { const first = D(y, m, 1); return D(y, m, 1 + ((wd - first.getDay() + 7) % 7) + (n - 1) * 7); };

/* Lunar / lunisolar dates (verified Oct 2026; extend this table yearly — see HANDOFF.md) */
const LUNAR = {
  lunarNewYear:{ 2026:[2,17], 2027:[2,6],  2028:[1,26], 2029:[2,13], 2030:[2,3] },   // Chinese New Year day 1
  midAutumn:   { 2026:[9,25], 2027:[9,15], 2028:[10,3], 2029:[9,22], 2030:[9,12] },  // 15th day, 8th lunar month
  diwali:      { 2026:[11,8], 2027:[10,29],2028:[10,17],2029:[11,5], 2030:[10,26] }, // Lakshmi Puja (New Delhi)
  loyKrathong: { 2026:[11,24],2027:[11,13],2028:[11,1], 2029:[11,20],2030:[11,9] },  // full moon, 12th Thai lunar month
};
/* Any year: astronomical new/full moons (Meeus ch. 49, main periodic terms; accurate to a few minutes), then each
   festival's rule. The verified LUNAR table above wins when it has the year; everything else is computed, so the
   engine works for ANY launch date / any year. Computed dates can differ by a day in rare years (leap months,
   local almanac choices); extend the table yearly for exactness. */
const RAD = Math.PI / 180;
function moonPhaseJDE(k){ // k integer = new moon, k+0.5 = full moon (k counted from 2000-01-06)
  const T = k / 1236.85, E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = (2.5534 + 29.10535670 * k - 0.0000014 * T * T) * RAD, Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T * T) * RAD;
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T * T) * RAD, Om = (124.7746 - 1.56375588 * k + 0.0020672 * T * T) * RAD;
  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T;
  const full = Math.abs(k % 1) > 0.25;
  jde += full
    ? -0.40614 * Math.sin(Mp) + 0.17302 * E * Math.sin(M) + 0.01614 * Math.sin(2 * Mp) + 0.01043 * Math.sin(2 * F) + 0.00734 * E * Math.sin(Mp - M) - 0.00515 * E * Math.sin(Mp + M) + 0.00209 * E * E * Math.sin(2 * M) - 0.00111 * Math.sin(Mp - 2 * F) - 0.00057 * Math.sin(Mp + 2 * F) + 0.00056 * E * Math.sin(2 * Mp + M) - 0.00042 * Math.sin(3 * Mp) + 0.00042 * E * Math.sin(M + 2 * F) + 0.00038 * E * Math.sin(M - 2 * F) - 0.00024 * E * Math.sin(2 * Mp - M) - 0.00017 * Math.sin(Om)
    : -0.40720 * Math.sin(Mp) + 0.17241 * E * Math.sin(M) + 0.01608 * Math.sin(2 * Mp) + 0.01039 * Math.sin(2 * F) + 0.00739 * E * Math.sin(Mp - M) - 0.00514 * E * Math.sin(Mp + M) + 0.00208 * E * E * Math.sin(2 * M) - 0.00111 * Math.sin(Mp - 2 * F) - 0.00057 * Math.sin(Mp + 2 * F) + 0.00056 * E * Math.sin(2 * Mp + M) - 0.00042 * Math.sin(3 * Mp) + 0.00042 * E * Math.sin(M + 2 * F) + 0.00038 * E * Math.sin(M - 2 * F) - 0.00024 * E * Math.sin(2 * Mp - M) - 0.00017 * Math.sin(Om);
  return jde;
}
const jdeToUTC = jde => new Date((jde - 2440587.5) * 864e5 - 69e3);           // TT -> UTC (deltaT ~69 s)
const localDay = (utc, tzHours) => { const t = new Date(utc.getTime() + tzHours * 36e5); return { d:D(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()), h:t.getUTCHours() + t.getUTCMinutes() / 60 }; };
/* all new (phase 0) or full (phase .5) moons in [from, to) as UTC instants */
function moons(from, to, phase){
  const out = []; let k = Math.floor((from.getFullYear() + from.getMonth() / 12 - 2000) * 12.3685) - 1 + phase;
  for (;; k++){ const t = jdeToUTC(moonPhaseJDE(k)); if (t >= to) break; if (t >= from) out.push(t); }
  return out;
}
const lastBefore = (list, d, tz) => list.map(t => localDay(t, tz).d).filter(x => x <= d).pop();
const COMPUTE = {
  /* month 1 contains the 'Rain Water' solar term (~19 Feb): CNY = last new moon (China time) on or before 19 Feb */
  lunarNewYear: y => lastBefore(moons(D(y, 1, 1), D(y, 3, 1), 0), D(y, 2, 19), 8),
  /* month 8 contains the autumn equinox (~23 Sep): Mid-Autumn = its new moon + 14 days (China time) */
  midAutumn: y => addDays(lastBefore(moons(D(y, 8, 1), D(y, 10, 1), 0), D(y, 9, 23), 8), 14),
  /* Lakshmi Puja: the Kartika new moon (India time) between 17 Oct and 15 Nov; before ~15:00 IST it is observed the day before */
  diwali: y => { const t = moons(D(y, 10, 10), D(y, 11, 20), 0).find(t => { const l = localDay(t, 5.5).d; return l >= D(y, 10, 17) && l <= D(y, 11, 16); }); if (!t) return null; const l = localDay(t, 5.5); return l.h < 15 ? addDays(l.d, -1) : l.d; },
  /* 15th waxing day of the 12th Thai lunar month: the full moon (Thai time; the day before when it falls before ~18:00)
     between 30 Oct and 28 Nov. Thai leap-month years can shift this by a month: keep the table updated. */
  loyKrathong: y => moons(D(y, 10, 20), D(y, 12, 5), 0.5).map(t => { const l = localDay(t, 7); return l.h < 18 ? addDays(l.d, -1) : l.d; }).find(d => d >= D(y, 10, 30) && d <= D(y, 11, 28)) || null,
};
const lunar = (k, y) => { const v = LUNAR[k][y]; if (v) return D(y, v[0], v[1]); try { return COMPUTE[k](y) || null; } catch (e) { return null; } };

/* Easter (Gregorian, anonymous algorithm / Computus) */
function easter(y){
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
    g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
    l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return D(y, mo, da);
}
/* Oktoberfest: starts on the Saturday 15 days before the first Sunday of October; ends that Sunday,
   or on 3 Oct (German Unity Day) when the first Sunday is 1 or 2 Oct */
function oktoberfest(y){
  const sun = nthWeekday(y, 10, 0, 1);
  return [addDays(sun, -15), sun.getDate() < 3 ? D(y, 10, 3) : sun];
}

/* Each festival: k, th (Thai name), en, range(y) -> [start, end] (inclusive, local dates) or null.
   menu: limited-time MENU keys tied to this festival (existing art only). decor: [] (Phase 2 art). */
const FESTIVALS = [
  { k:'lunarNewYear', th:'ตรุษจีน', en:'Lunar New Year', range:y => { const d = lunar('lunarNewYear', y); return d && [addDays(d, -2), addDays(d, 7)]; } },
  { k:'valentine', th:'วาเลนไทน์', en:"Valentine's Day", range:y => [D(y, 2, 10), D(y, 2, 14)] },
  { k:'easter', th:'อีสเตอร์', en:'Easter', range:y => { const d = easter(y); return [addDays(d, -7), addDays(d, 1)]; } },
  { k:'songkran', th:'สงกรานต์', en:'Songkran', range:y => [D(y, 4, 11), D(y, 4, 15)] },
  /* May: World Bee Day (20 May, approved by Nadda, Oct 2026). Mother's Day stays removed. The bee guest visits all week. */
  { k:'worldBeeDay', th:'วันผึ้งโลก', en:'World Bee Day', menu:['honeylatte','honeysoda'], guest:'bee', range:y => [D(y, 5, 17), D(y, 5, 23)] },
  { k:'pride', th:'Pride', en:'Pride Month', range:y => [D(y, 6, 1), D(y, 6, 30)] },
  { k:'tanabata', th:'ทานาบาตะ', en:'Tanabata', range:y => [D(y, 7, 1), D(y, 7, 7)] },
  { k:'midAutumn', th:'ไหว้พระจันทร์', en:'Mid-Autumn', range:y => { const d = lunar('midAutumn', y); return d && [addDays(d, -5), addDays(d, 1)]; } },
  { k:'oktoberfest', th:'Oktoberfest', en:'Oktoberfest', range:y => oktoberfest(y) },
  { k:'halloween', th:'ฮาโลวีน', en:'Halloween', menu:['pumpkin'], range:y => [D(y, 10, 1), D(y, 10, 31)] },
  { k:'diwali', th:'ดิวาลี', en:'Diwali', range:y => { const d = lunar('diwali', y); return d && [addDays(d, -2), addDays(d, 2)]; } },
  { k:'loyKrathong', th:'ลอยกระทง', en:'Loy Krathong', range:y => { const d = lunar('loyKrathong', y); return d && [addDays(d, -3), addDays(d, 1)]; } },
  { k:'christmas', th:'คริสต์มาส', en:'Christmas', menu:['xmascocoa'], range:y => [D(y, 12, 1), D(y, 12, 26)] },
];

/* ---------- hemisphere ---------- */
const SOUTH_TZ = /^(Australia\/|Antarctica\/|Pacific\/(Auckland|Chatham|Fiji|Tongatapu|Apia|Noumea|Efate|Port_Moresby)|America\/(Argentina|Santiago|Sao_Paulo|Montevideo|Asuncion|La_Paz|Lima|Punta_Arenas|Campo_Grande|Cuiaba|Porto_Velho|Recife|Bahia|Maceio|Fortaleza|Belem)|Africa\/(Johannesburg|Maputo|Harare|Lusaka|Windhoek|Gaborone|Maseru|Mbabane|Lubumbashi|Blantyre|Luanda)|Indian\/(Mauritius|Reunion|Antananarivo))/;
const SOUTH_REGION = new Set(['AU','NZ','AR','CL','UY','PY','BO','PE','BR','ZA','NA','BW','ZW','ZM','MZ','MG','MU','LS','SZ','FJ','PG','NC','TO','WS','VU']);
/* returns { hemi:'N'|'S', source } — override > user setting > time zone > region > default N */
function hemisphere({ override, setting, timeZone, region } = {}){
  if (override === 'N' || override === 'S') return { hemi:override, source:'override' };
  if (setting === 'N' || setting === 'S') return { hemi:setting, source:'setting' };
  if (timeZone) return { hemi:SOUTH_TZ.test(timeZone) ? 'S' : 'N', source:'timezone' };
  if (region) return { hemi:SOUTH_REGION.has(region) ? 'S' : 'N', source:'region' };
  return { hemi:'N', source:'default' };
}

/* ---------- seasons ---------- */
/* Northern months -> theme. Southern hemisphere: use the theme of (month + 6). */
const NORTH_SEASON = ['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter'];
function season(date, hemi='N'){
  const m = date.getMonth(), mm = hemi === 'S' ? (m + 6) % 12 : m, d = date.getDate();
  const s = { season:NORTH_SEASON[mm], themeMonth:mm, hemi, flags:[] };
  if (mm === 3) s.flags.push('springPicnic');                    // April (N) / October (S): picnic + frog cousin (Phase 2 art)
  if (mm === 10){ s.flags.push('autumnToWinter'); if (hemi === 'N' && d >= 20) s.flags.push('firstSnow'); } // November theme: leaves -> first snow late month (north)
  /* South: the plan moves the first-snow gimmick to early southern winter (around June) — NOT CONFIRMED by Nadda (see HANDOFF) */
  if (hemi === 'S' && m === 5 && d <= 14) s.flags.push('firstSnow', 'firstSnowSouthUnconfirmed');
  return s;
}

/* ---------- queries ---------- */
function rangesFor(f, y){ return [y - 1, y].map(yy => f.range(yy)).filter(Boolean); } // y-1 covers ranges crossing New Year
function active(date){
  const t = dayOnly(date), y = t.getFullYear();
  return FESTIVALS.filter(f => (!f.when || f.when()) && rangesFor(f, y).some(([a, b]) => t >= dayOnly(a) && t <= dayOnly(b)))
    .map(f => { const [a, b] = rangesFor(f, y).find(([a, b]) => t >= dayOnly(a) && t <= dayOnly(b)); return { k:f.k, th:f.th, en:f.en, start:a, end:b, menu:f.menu || [], guest:f.guest || null, decor:[] }; });
}
function upcoming(date, days=60){
  const t = dayOnly(date), out = [];
  FESTIVALS.forEach(f => { if (f.when && !f.when()) return; [t.getFullYear(), t.getFullYear() + 1].forEach(y => { const r = f.range(y); if (r && dayOnly(r[0]) > t && (r[0] - t) / 864e5 <= days) out.push({ k:f.k, th:f.th, en:f.en, start:r[0], end:r[1] }); }); });
  return out.sort((a, b) => a.start - b.start);
}
/* menu keys available today because a festival is active */
const festivalMenu = date => [...new Set(active(date).flatMap(f => f.menu))];
const hasLunarData = y => Object.values(LUNAR).every(t => t[y]);   // true = verified table; false = computed (still works)
/* has festival k already ended this year (for 'past festival' IAP: free while live, buyable after) */
function isPast(k, date){ const f = FESTIVALS.find(x => x.k === k); if (!f) return false; const r = f.range(date.getFullYear()); return !!r && dayOnly(r[1]) < dayOnly(date); }
const isLive = (k, date) => active(date).some(f => f.k === k);

window.Festivals = { FESTIVALS, LUNAR, COMPUTE, lunar, isPast, isLive, easter, oktoberfest, hemisphere, season, active, upcoming, festivalMenu, hasLunarData };
})();
