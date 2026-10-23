/* MOOD CUP · festival & season date engine (no art; decor registry is empty in Phase 1)
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
const lunar = (k, y) => { const v = LUNAR[k][y]; return v ? D(y, v[0], v[1]) : null; };

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

/* Mother's Day mode is an OPEN DECISION for Nadda: 'intl' (2nd Sunday of May), 'th' (12 Aug), 'both' */
const CONFIG = { mothersDay:'intl' };

/* Each festival: k, th (Thai name), en, range(y) -> [start, end] (inclusive, local dates) or null.
   menu: limited-time MENU keys tied to this festival (existing art only). decor: [] (Phase 2 art). */
const FESTIVALS = [
  { k:'lunarNewYear', th:'ตรุษจีน', en:'Lunar New Year', range:y => { const d = lunar('lunarNewYear', y); return d && [addDays(d, -2), addDays(d, 7)]; } },
  { k:'valentine', th:'วาเลนไทน์', en:"Valentine's Day", range:y => [D(y, 2, 10), D(y, 2, 14)] },
  { k:'easter', th:'อีสเตอร์', en:'Easter', range:y => { const d = easter(y); return [addDays(d, -7), addDays(d, 1)]; } },
  { k:'songkran', th:'สงกรานต์', en:'Songkran', range:y => [D(y, 4, 11), D(y, 4, 15)] },
  { k:'mothersDayIntl', th:'วันแม่ (สากล)', en:"Mother's Day", when:() => CONFIG.mothersDay !== 'th', range:y => { const d = nthWeekday(y, 5, 0, 2); return [addDays(d, -5), d]; } },
  { k:'mothersDayTH', th:'วันแม่ (ไทย)', en:"Mother's Day (TH)", when:() => CONFIG.mothersDay !== 'intl', range:y => [D(y, 8, 7), D(y, 8, 12)] },
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
  if (mm === 10){ s.flags.push('autumnToWinter'); if (d >= 20) s.flags.push('firstSnow'); } // November: leaves -> first snow late month
  if (hemi === 'S' && s.flags.includes('firstSnow')) s.flags.push('firstSnowSouthUnconfirmed'); // OPEN DECISION (see HANDOFF)
  return s;
}

/* ---------- queries ---------- */
function rangesFor(f, y){ return [y - 1, y].map(yy => f.range(yy)).filter(Boolean); } // y-1 covers ranges crossing New Year
function active(date){
  const t = dayOnly(date), y = t.getFullYear();
  return FESTIVALS.filter(f => (!f.when || f.when()) && rangesFor(f, y).some(([a, b]) => t >= dayOnly(a) && t <= dayOnly(b)))
    .map(f => { const [a, b] = rangesFor(f, y).find(([a, b]) => t >= dayOnly(a) && t <= dayOnly(b)); return { k:f.k, th:f.th, en:f.en, start:a, end:b, menu:f.menu || [], decor:[] }; });
}
function upcoming(date, days=60){
  const t = dayOnly(date), out = [];
  FESTIVALS.forEach(f => { if (f.when && !f.when()) return; [t.getFullYear(), t.getFullYear() + 1].forEach(y => { const r = f.range(y); if (r && dayOnly(r[0]) > t && (r[0] - t) / 864e5 <= days) out.push({ k:f.k, th:f.th, start:r[0], end:r[1] }); }); });
  return out.sort((a, b) => a.start - b.start);
}
/* menu keys available today because a festival is active */
const festivalMenu = date => [...new Set(active(date).flatMap(f => f.menu))];
const hasLunarData = y => Object.values(LUNAR).every(t => t[y]);

window.Festivals = { FESTIVALS, LUNAR, CONFIG, easter, oktoberfest, hemisphere, season, active, upcoming, festivalMenu, hasLunarData };
})();
