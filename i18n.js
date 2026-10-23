/* Cupmori · i18n (framework-free)
   Thai is the source language and the default. English is picked automatically when the device language is English
   (Settings can force ไทย / English; ?lang=en for QC). Every Thai string in the UI goes through I18N.t():
   - a MutationObserver translates text nodes + alt / aria-label / placeholder / title as soon as they are rendered
   - toast / speak / confirm / canvas text call I18N.t() directly (canvas fillText + measureText are wrapped)
   Dictionary: i18n-en.js (window.I18N_EN). Keys with {} are templates: 'อีก {} วัน' -> 'in {0} days'.
   Captured parts are translated recursively, so names inside sentences translate too. */
(() => {
const THAI = /[\u0E00-\u0E7F]/;
const DICT = window.I18N_EN || {};
const PATS = Object.keys(DICT).filter(k => k.includes('{}')).sort((a, b) => b.replace(/\{\}/g, '').length - a.replace(/\{\}/g, '').length)
  .map(k => [new RegExp('^' + k.split('{}').map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('([\\s\\S]+?)') + '$'), DICT[k]]);
const WIDE = /\n| · /; const PATS_WIDE = PATS.filter(p => WIDE.test(p[0].source.replace(/\\/g, ''))), PATS_NARROW = PATS.filter(p => !PATS_WIDE.includes(p));
const missing = new Set();
const qs = new URLSearchParams(location.search);
/* device rule (Nadda): Thai by default; English when the device language is English */
const deviceLang = () => { const l = ((navigator.languages && navigator.languages[0]) || navigator.language || 'th').toLowerCase(); return l.startsWith('en') ? 'en' : 'th'; };
let lang = 'th';
function tr(core, quiet){
  if (!THAI.test(core)) return core;
  if (DICT[core] != null) return DICT[core];
  /* templates that span a ' · ' or a line break first, then split on those, then the remaining templates */
  const tryPats = list => { for (const [re, tpl] of list){ const m = core.match(re); if (m) return tpl.replace(/\{(\d)\}/g, (_, i) => t(m[+i + 1], quiet)); } return null; };
  let r = tryPats(PATS_WIDE); if (r != null) return r;
  for (const sep of ['\n', ' · ']) if (core.includes(sep)) return core.split(sep).map(x => t(x, quiet)).join(sep);
  r = tryPats(PATS_NARROW); if (r != null) return r;
  for (const sep of [' → ', ' / ', ' + ', ' – ', ': ']) if (core.includes(sep)) return core.split(sep).map(x => t(x, quiet)).join(sep);
  let m;
  if ((m = core.match(/^"([\s\S]+)"$/))) return '"' + t(m[1], quiet) + '"';
  if ((m = core.match(/^([\s\S]*?)\s*\(([^()]+)\)$/))) return (m[1] ? t(m[1], quiet) + ' ' : '') + '(' + t(m[2], quiet) + ')';
  if ((m = core.match(/^(\d+)\s+(\S[\s\S]*)$/))) return m[1] + ' ' + t(m[2], quiet);
  if ((m = core.match(/^(\S[\s\S]*?)\s+(\d+(?:%|oz)?)$/))) return t(m[1], quiet) + ' ' + m[2];
  if (!quiet) missing.add(core); return core;
}
function t(s, quiet){
  if (lang !== 'en' || s == null) return s; s = String(s); if (!THAI.test(s)) return s;
  const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/); return m[1] + tr(m[2], quiet) + m[3];
}
const ATTRS = ['alt', 'aria-label', 'placeholder', 'title'];
function apply(root){
  if (lang !== 'en' || !root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())){ const p = n.parentNode && n.parentNode.nodeName; if (p === 'SCRIPT' || p === 'STYLE') continue; if (THAI.test(n.nodeValue)){ const v = t(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; } }
  const els = root.querySelectorAll ? root.querySelectorAll('[alt],[aria-label],[placeholder],[title]') : [];
  [root, ...els].forEach(el => { if (!el.getAttribute) return; ATTRS.forEach(a => { const v = el.getAttribute(a); if (v && THAI.test(v)){ const w = t(v); if (w !== v) el.setAttribute(a, w); } }); });
}
let obs = null;
function observe(){
  if (obs) obs.disconnect(); if (lang !== 'en') return;
  obs = new MutationObserver(list => { for (const r of list){
    if (r.type === 'characterData'){ const o = r.target.nodeValue; if (THAI.test(o)){ const v = t(o); if (v !== o) r.target.nodeValue = v; } }
    else if (r.type === 'attributes'){ const v = r.target.getAttribute(r.attributeName); if (v && THAI.test(v)){ const w = t(v); if (w !== v) r.target.setAttribute(r.attributeName, w); } }
    else r.addedNodes.forEach(nd => { if (nd.nodeType === 3){ if (THAI.test(nd.nodeValue)){ const v = t(nd.nodeValue); if (v !== nd.nodeValue) nd.nodeValue = v; } } else if (nd.nodeType === 1) apply(nd); });
  } });
  obs.observe(document.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:ATTRS });
}
/* canvas (share cards) */
const C2 = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
if (C2){ const f = C2.fillText, m = C2.measureText; C2.fillText = function(s, ...a){ return f.call(this, t(s), ...a); }; C2.measureText = function(s){ return m.call(this, t(s, true)); }; }
function setLang(pref){
  const q = qs.get('lang'); lang = q === 'en' || q === 'th' ? q : (pref === 'en' || pref === 'th') ? pref : deviceLang();
  document.documentElement.lang = lang; document.documentElement.classList.toggle('en', lang === 'en');
  document.title = lang === 'en' ? 'Cupmori · A little cafe for every feeling' : 'Cupmori · ชงความรู้สึก เก็บวันของเรา';
  apply(document.body); observe();
}
window.I18N = { t, apply, setLang, deviceLang, missing, get lang(){ return lang; } };
})();
