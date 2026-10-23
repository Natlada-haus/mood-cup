/* Cupmori · sound: SFX (Kenyset) + background music & café ambience (CC0)
   WebAudio, unlocked on first tap; music/ambience fade in/out and pause when tab hidden */
/* line icons for system controls (VI v1.1: no emoji as system icons) */
window.ICONS = {note: `<svg class="ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>`, spk: `<svg class="ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/></svg>`, mute: `<svg class="ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>`, cup: `<svg class="ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3c-1 1 1 2 0 3M12 3c-1 1 1 2 0 3"/></svg>`, bell: `<svg class="ico" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>`};

(() => {
const FILES = ['tap','blip','bubble','chime','next','plop','ice','pour','stamp','oops','grind','froth','clink','quack'];
const LOOPS = { music:{src:'assets/bgm/music.mp3', len:24.0, vol:.25}, amb:{src:'assets/bgm/ambience.mp3', len:58.0, vol:.15} };
const PAD = .5; // seconds of wrap-around padding baked into the loop files
const MKEY = 'ggcafe.moodcup.mute', BKEY = 'ggcafe.moodcup.bgm', VKEY = 'ggcafe.moodcup.vol';
const vols = Object.assign({ music:1, amb:1, sfx:1 }, (() => { try { return JSON.parse(localStorage.getItem(VKEY)) || {}; } catch (e) { return {}; } })());
let sfxBus = null;
let ctx = null, buf = {}, muted = localStorage.getItem(MKEY) === '1', bgmOn = localStorage.getItem(BKEY) !== '0';
const bgm = { music:{}, amb:{} }; let bgmLoaded = false, bgmLoading = false;
const decode = (url) => fetch(url).then(r => r.arrayBuffer()).then(a => new Promise(res => ctx.decodeAudioData(a, res, () => res(null)))).catch(() => null);
function unlock(){
  if (ctx) { if (ctx.state === 'suspended' && !document.hidden) ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC();
  sfxBus = ctx.createGain(); sfxBus.gain.value = vols.sfx; sfxBus.connect(ctx.destination);
  FILES.forEach(n => decode(`assets/sfx/${n}.mp3`).then(b => { if (b) buf[n] = b; }));
  if (bgmOn) startBgm();
}
function play(n, o = {}){
  if (muted || !ctx || !buf[n] || document.hidden) return;
  try {
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = buf[n]; s.playbackRate.value = o.rate || 1; g.gain.value = o.vol ?? .4;
    s.connect(g); g.connect(sfxBus); s.start(ctx.currentTime + (o.delay || 0));
  } catch (e) {}
}
async function loadBgm(){
  if (bgmLoaded || bgmLoading) return; bgmLoading = true;
  await Promise.all(Object.entries(LOOPS).map(async ([k, L]) => { bgm[k].buf = await decode(L.src); }));
  bgmLoaded = true; bgmLoading = false;
}
function fadeTo(k, v, sec){ const g = bgm[k].gain; if (!g) return; const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(v, t + sec); }
async function startBgm(){
  if (!ctx) return; await loadBgm(); if (!bgmOn || document.hidden) return;
  Object.entries(LOOPS).forEach(([k, L]) => {
    const B = bgm[k]; if (!B.buf || B.src) { if (B.src) fadeTo(k, L.vol*vols[k], 2); return; }
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = B.buf; s.loop = true; s.loopStart = PAD; s.loopEnd = PAD + L.len;
    g.gain.value = 0; s.connect(g); g.connect(ctx.destination); s.start(0, PAD);
    B.src = s; B.gain = g; fadeTo(k, L.vol*vols[k], k === 'music' ? 3 : 2);
  });
}
function stopBgm(sec = 1.2){
  if (!ctx) return;
  Object.keys(LOOPS).forEach(k => { const B = bgm[k]; if (!B.src) return; fadeTo(k, 0, sec); const s = B.src; B.src = null; setTimeout(() => { try { s.stop(); } catch (e) {} }, sec * 1000 + 80); });
}
/* looping step sound (grinder / frother) while a finger is held; returns stop() */
function loop(n, o = {}){
  if (muted || !ctx || !buf[n] || document.hidden) return () => {};
  try {
    const s = ctx.createBufferSource(), g = ctx.createGain(), t = ctx.currentTime, v = o.vol ?? .3;
    s.buffer = buf[n]; s.loop = true; s.playbackRate.value = o.rate || 1;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .12);
    s.connect(g); g.connect(sfxBus); s.start();
    let done = false;
    return () => { if (done) return; done = true; const t2 = ctx.currentTime; g.gain.cancelScheduledValues(t2); g.gain.setValueAtTime(g.gain.value, t2); g.gain.linearRampToValueAtTime(0, t2 + .18); setTimeout(() => { try { s.stop(); } catch (e) {} }, 260); };
  } catch (e) { return () => {}; }
}
/* light haptics where supported (Android Chrome); silent with SFX muted */
/* haptics go through the platform adapter (own on/off setting; native shell can swap it) */
function buzz(p){ if (window.Platform) return window.Platform.haptic.play(p); if (!navigator.vibrate) return; try { navigator.vibrate(p); } catch (e) {} }
function setVol(k, v){
  vols[k] = Math.max(0, Math.min(1, v)); localStorage.setItem(VKEY, JSON.stringify(vols));
  if (!ctx) return;
  if (k === 'sfx') { sfxBus.gain.setTargetAtTime(vols.sfx, ctx.currentTime, .03); }
  else if (bgm[k] && bgm[k].src) fadeTo(k, LOOPS[k].vol * vols[k], .15);
}
function setMuted(v){ muted = v; localStorage.setItem(MKEY, v ? '1' : '0'); paint(); if (!v) { unlock(); setTimeout(() => play('bubble', {vol:.3}), 120); } }
function setBgm(v){ bgmOn = v; localStorage.setItem(BKEY, v ? '1' : '0'); paint(); if (v) { unlock(); startBgm(); } else stopBgm(); }
function paint(){
  const b = document.getElementById('muteBtn'); if (b){ b.innerHTML = muted ? ICONS.mute : ICONS.spk; b.title = b.ariaLabel = muted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'; b.classList.toggle('off', muted); }
  const m = document.getElementById('bgmBtn'); if (m){ m.innerHTML = ICONS.note; m.title = m.ariaLabel = bgmOn ? 'ปิดเพลงและเสียงบรรยากาศร้าน' : 'เปิดเพลงและเสียงบรรยากาศร้าน'; m.classList.toggle('off', !bgmOn); }
}
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) { stopBgm(.6); setTimeout(() => { if (document.hidden) ctx.suspend(); }, 700); }
  else { ctx.resume().then(() => { if (bgmOn) startBgm(); }); }
});
['pointerdown','keydown','touchstart'].forEach(ev => window.addEventListener(ev, unlock, { capture:true, passive:true }));
window.SFX = { play, loop, buzz, unlock, setVol, setBgm, setMuted, vol:k => vols[k], get muted(){ return muted; }, get bgm(){ return bgmOn; }, get playing(){ return !!bgm.music.src; }, toggle(){ setMuted(!muted); }, toggleBgm(){ setBgm(!bgmOn); }, paint };
document.addEventListener('DOMContentLoaded', paint); paint();
})();
