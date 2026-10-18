/* MOOD CUP · sound effects (Kenyset free SFX) — WebAudio, unlocked on first tap */
(() => {
const FILES = ['tap','plop','swoosh','ice','pop','pour','stamp','oops'];
const MKEY = 'ggcafe.moodcup.mute';
let ctx = null, buf = {}, muted = localStorage.getItem(MKEY) === '1', loading = null;
function unlock(){
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC();
  loading = Promise.all(FILES.map(n => fetch(`assets/sfx/${n}.mp3`).then(r => r.arrayBuffer()).then(a => new Promise((res) => ctx.decodeAudioData(a, b => { buf[n] = b; res(); }, () => res()))).catch(() => {})));
}
function play(n, o = {}){
  if (muted || !ctx || !buf[n]) return;
  try {
    const s = ctx.createBufferSource(), g = ctx.createGain();
    s.buffer = buf[n]; s.playbackRate.value = o.rate || 1; g.gain.value = o.vol ?? .6;
    s.connect(g); g.connect(ctx.destination); s.start(ctx.currentTime + (o.delay || 0));
  } catch (e) {}
}
function setMuted(v){ muted = v; localStorage.setItem(MKEY, v ? '1' : '0'); paint(); if (!v) { unlock(); setTimeout(() => play('pop', {vol:.5}), 120); } }
function paint(){ const b = document.getElementById('muteBtn'); if (b){ b.textContent = muted ? '🔇' : '🔊'; b.setAttribute('aria-label', muted ? 'เปิดเสียง' : 'ปิดเสียง'); b.classList.toggle('off', muted); } }
['pointerdown','keydown','touchstart'].forEach(ev => window.addEventListener(ev, unlock, { capture:true, passive:true }));
window.SFX = { play, unlock, get muted(){ return muted; }, toggle(){ setMuted(!muted); }, paint };
document.addEventListener('DOMContentLoaded', paint); paint();
})();
