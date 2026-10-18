/* MOOD CUP · sound: SFX (Kenyset) + background music & café ambience (CC0)
   WebAudio, unlocked on first tap; music/ambience fade in/out and pause when tab hidden */
(() => {
const FILES = ['tap','blip','bubble','chime','next','plop','ice','pour','stamp','oops'];
const LOOPS = { music:{src:'assets/bgm/music.mp3', len:24.0, vol:.25}, amb:{src:'assets/bgm/ambience.mp3', len:58.0, vol:.15} };
const PAD = .5; // seconds of wrap-around padding baked into the loop files
const MKEY = 'ggcafe.moodcup.mute', BKEY = 'ggcafe.moodcup.bgm';
let ctx = null, buf = {}, muted = localStorage.getItem(MKEY) === '1', bgmOn = localStorage.getItem(BKEY) !== '0';
const bgm = { music:{}, amb:{} }; let bgmLoaded = false, bgmLoading = false;
const decode = (url) => fetch(url).then(r => r.arrayBuffer()).then(a => new Promise(res => ctx.decodeAudioData(a, res, () => res(null)))).catch(() => null);
function unlock(){
  if (ctx) { if (ctx.state === 'suspended' && !document.hidden) ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC();
  FILES.forEach(n => decode(`assets/sfx/${n}.mp3`).then(b => { if (b) buf[n] = b; }));
  if (bgmOn) startBgm();
}
function play(n, o = {}){
  if (muted || !ctx || !buf[n] || document.hidden) return;
  try {
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = buf[n]; s.playbackRate.value = o.rate || 1; g.gain.value = o.vol ?? .4;
    s.connect(g); g.connect(ctx.destination); s.start(ctx.currentTime + (o.delay || 0));
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
    const B = bgm[k]; if (!B.buf || B.src) { if (B.src) fadeTo(k, L.vol, 2); return; }
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = B.buf; s.loop = true; s.loopStart = PAD; s.loopEnd = PAD + L.len;
    g.gain.value = 0; s.connect(g); g.connect(ctx.destination); s.start(0, PAD);
    B.src = s; B.gain = g; fadeTo(k, L.vol, k === 'music' ? 3 : 2);
  });
}
function stopBgm(sec = 1.2){
  if (!ctx) return;
  Object.keys(LOOPS).forEach(k => { const B = bgm[k]; if (!B.src) return; fadeTo(k, 0, sec); const s = B.src; B.src = null; setTimeout(() => { try { s.stop(); } catch (e) {} }, sec * 1000 + 80); });
}
function setMuted(v){ muted = v; localStorage.setItem(MKEY, v ? '1' : '0'); paint(); if (!v) { unlock(); setTimeout(() => play('bubble', {vol:.3}), 120); } }
function setBgm(v){ bgmOn = v; localStorage.setItem(BKEY, v ? '1' : '0'); paint(); if (v) { unlock(); startBgm(); } else stopBgm(); }
function paint(){
  const b = document.getElementById('muteBtn'); if (b){ b.textContent = muted ? '🔇' : '🔊'; b.title = b.ariaLabel = muted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์'; b.classList.toggle('off', muted); }
  const m = document.getElementById('bgmBtn'); if (m){ m.textContent = '🎵'; m.title = m.ariaLabel = bgmOn ? 'ปิดเพลงและเสียงบรรยากาศร้าน' : 'เปิดเพลงและเสียงบรรยากาศร้าน'; m.classList.toggle('off', !bgmOn); }
}
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) { stopBgm(.6); setTimeout(() => { if (document.hidden) ctx.suspend(); }, 700); }
  else { ctx.resume().then(() => { if (bgmOn) startBgm(); }); }
});
['pointerdown','keydown','touchstart'].forEach(ev => window.addEventListener(ev, unlock, { capture:true, passive:true }));
window.SFX = { play, unlock, get muted(){ return muted; }, get bgm(){ return bgmOn; }, get playing(){ return !!bgm.music.src; }, toggle(){ setMuted(!muted); }, toggleBgm(){ setBgm(!bgmOn); }, paint };
document.addEventListener('DOMContentLoaded', paint); paint();
})();
