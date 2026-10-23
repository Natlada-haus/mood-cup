/* ===== MOOD CUP — illustration library (pure SVG strings) ===== */
const DRINKS = {
  coffee:     { th:'กาแฟ',   en:'COFFEE',     sub:'Bold & Cozy',   color:'#6B3E26', top:'#8A5332', bg:'#F2C48D', chip:'#C8915F', desc:'เข้มข้น ปลุกพลัง พร้อมลุยทั้งวัน' },
  matcha:     { th:'มัทฉะ',  en:'MATCHA',     sub:'Smooth & Calm', color:'#6E9A2E', top:'#86B23C', bg:'#D4E000', chip:'#86B23C', desc:'นุ่มละมุน ใจสงบ ชิลแบบญี่ปุ่น' },
  cocoa:      { th:'โกโก้',  en:'COCOA',      sub:'Warm Hug',      color:'#5A3324', top:'#74442F', bg:'#E8B9A1', chip:'#8C5A40', desc:'อบอุ่นเหมือนได้กอดตัวเอง' },
  strawberry: { th:'นมชมพู', en:'PINK MILK',  sub:'Sweet & Happy', color:'#F27BA8', top:'#F798BC', bg:'#F49AC1', chip:'#F27BA8', desc:'หวานสดใส วันนี้ขอน่ารักหน่อย' },
  thaitea:    { th:'ชาไทย',  en:'THAI TEA',   sub:'Fun & Fiery',   color:'#E2722B', top:'#EE8B45', bg:'#FFB772', chip:'#E2722B', desc:'สีส้มสดใส พลังเต็มร้อย' },
};
const MILK = '#FFF6EA';
const CUPS = {
  tall:  { th:'แก้วใสทรงสูง', en:'TUMBLER', clear:true,  top:70,  liq:96,  hw:60, body:'M40 70 L160 70 L148 240 Q147 248 139 248 L61 248 Q53 248 52 240 Z', sl:[150,196], stk:[[78,128],[122,214],[100,172]] },
  glass: { th:'แก้วใสทรงเตี้ย', en:'ROCKS',  clear:true,  top:118, liq:140, hw:54, body:'M46 118 L154 118 L146 238 Q145 246 137 246 L63 246 Q55 246 54 238 Z', sl:[176,214], stk:[[76,160],[124,228],[100,196]] },
  mug:   { th:'แก้วมัคเซรามิก', en:'MUG',     clear:false, top:100, liq:100, hw:58, body:'M42 100 L158 100 L155 220 Q152 246 126 246 L74 246 Q48 246 45 220 Z', sl:[160,200], stk:[[74,136],[126,226],[100,180]] },
  paper: { th:'แก้วกระดาษ', en:'TO-GO',    clear:false, top:84,  liq:84,  hw:54, body:'M46 84 L154 84 L142 242 Q141 248 135 248 L65 248 Q59 248 58 242 Z', sl:[140,196], stk:[[78,118],[120,220],[100,168]] },
};
const SLEEVES = [
  { k:'none',     th:'ไม่มี',   c:null },
  { k:'pink',     th:'ชมพู',    c:'#F49AC1' },
  { k:'lime',     th:'มะนาว',   c:'#D4E000' },
  { k:'matcha',   th:'เขียวเข้ม', c:'#2F3A1E' },
  { k:'cream',    th:'ครีม',    c:'#F6E7C8' },
  { k:'lavender', th:'ลาเวนเดอร์', c:'#C9B6F2' },
  { k:'sky',      th:'ฟ้า',     c:'#9ED4F5' },
];
const TOPPINGS = [
  { k:'whip',     th:'วิปครีม' },
  { k:'drizzle',  th:'ซอสคาราเมล' },
  { k:'sprinkle', th:'เม็ดสี' },
  { k:'berry',    th:'สตรอว์เบอร์รี' },
  { k:'boba',     th:'ไข่มุก' },
];
const STICKERS = [
  { k:'heart', th:'หัวใจ' }, { k:'star', th:'ดาว' }, { k:'flower', th:'ดอกไม้' },
  { k:'smile', th:'ยิ้ม' }, { k:'leaf', th:'ใบชา' }, { k:'bean', th:'เมล็ดกาแฟ' },
];
const MOODS = [
  { k:'happy',   th:'สดใส',     c:'#FFD84D', m:'smile' },
  { k:'chill',   th:'ชิลๆ',     c:'#BFE3A0', m:'flat' },
  { k:'love',    th:'อินเลิฟ',  c:'#FFA6C9', m:'love' },
  { k:'excited', th:'ตื่นเต้น', c:'#FFB772', m:'open' },
  { k:'tired',   th:'เหนื่อยนิด', c:'#C9D3E6', m:'tired' },
  { k:'busy',    th:'ยุ่งมาก',   c:'#F2A08A', m:'wave' },
  { k:'calm',    th:'สงบ',      c:'#CDE6E0', m:'calm' },
  { k:'sad',     th:'เศร้าหน่อย', c:'#AFC8F0', m:'sad' },
];
const MILKS = {
  coffee: [{k:'none',th:'อเมริกาโน่'},{k:'fresh',th:'นมสด'},{k:'oat',th:'โอ๊ตมิลค์'},{k:'foam',th:'ฟองนมนุ่ม'}],
  matcha: [{k:'none',th:'มัทฉะเพียว'},{k:'fresh',th:'นมสด'},{k:'oat',th:'โอ๊ตมิลค์'},{k:'soy',th:'นมถั่วเหลือง'}],
  other:  [{k:'fresh',th:'นมสด'},{k:'oat',th:'โอ๊ตมิลค์'},{k:'none',th:'ไม่ใส่นม'}],
};
const SWEET = [{k:0,th:'ไม่หวาน'},{k:1,th:'หวานน้อย'},{k:2,th:'ปกติ'},{k:3,th:'หวานฉ่ำ'}];

let __uid = 0;
const uid = () => 'u' + (++__uid) + Math.random().toString(36).slice(2,6);

function shade(hex, amt){ // amt -1..1
  let c = hex.replace('#',''); if(c.length===3) c=c.split('').map(x=>x+x).join('');
  let n = parseInt(c,16), r=n>>16, g=(n>>8)&255, b=n&255;
  const f = v => Math.max(0,Math.min(255, Math.round(amt<0 ? v*(1+amt) : v+(255-v)*amt)));
  return '#' + [f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('');
}

/* ---------- stickers ---------- */
function stickerSVG(k, x, y, s=1){
  const t = `transform="translate(${x} ${y}) scale(${s})"`;
  const st = 'stroke="#fff" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke"';
  switch(k){
    case 'heart': return `<g ${t}><path d="M0 11 C-17 0 -13 -15 0 -7 C13 -15 17 0 0 11Z" fill="#FF6FA5" ${st}/><ellipse cx="-5" cy="-5" rx="3" ry="2" fill="#fff" opacity=".7"/></g>`;
    case 'star': return `<g ${t}><path d="M0 -14 L4.1 -4.6 L14 -4.3 L6.3 2.2 L8.8 12 L0 6.6 L-8.8 12 L-6.3 2.2 L-14 -4.3 L-4.1 -4.6Z" fill="#FFD23F" ${st}/><circle cx="-3" cy="-3" r="2" fill="#fff" opacity=".7"/></g>`;
    case 'flower': return `<g ${t}>${[0,72,144,216,288].map(a=>`<circle cx="${(Math.cos(a*Math.PI/180)*8).toFixed(1)}" cy="${(Math.sin(a*Math.PI/180)*8).toFixed(1)}" r="7" fill="#FFB0D0" stroke="#fff" stroke-width="3" paint-order="stroke"/>`).join('')}<circle r="5.5" fill="#FFCF3F"/></g>`;
    case 'smile': return `<g ${t}><circle r="13" fill="#FFE066" ${st}/><circle cx="-4.5" cy="-2" r="1.8" fill="#2F3A1E"/><circle cx="4.5" cy="-2" r="1.8" fill="#2F3A1E"/><path d="M-5 3 Q0 8 5 3" stroke="#2F3A1E" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="-8" cy="3" r="2.2" fill="#FF8FB5" opacity=".7"/><circle cx="8" cy="3" r="2.2" fill="#FF8FB5" opacity=".7"/></g>`;
    case 'leaf': return `<g ${t}><path d="M-12 10 C-14 -6 0 -14 13 -12 C13 2 4 13 -12 10Z" fill="#8DBB3F" ${st}/><path d="M-10 8 Q0 0 9 -9" stroke="#5E8A22" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`;
    case 'crown': return `<g ${t}><path d="M-13 8 L-14 -8 L-6 -1 L0 -12 L6 -1 L14 -8 L13 8Z" fill="#FFD23F" ${st}/><circle cx="0" cy="-12" r="2.6" fill="#FF8FB5"/><circle cx="-14" cy="-8" r="2.2" fill="#9FD8F0"/><circle cx="14" cy="-8" r="2.2" fill="#9FD8F0"/><rect x="-11" y="3" width="22" height="3" rx="1.5" fill="#F2A93B"/></g>`;
    case 'duck': return `<g ${t}><path d="M-11 4 Q-12 -6 -4 -8 Q-4 -15 3 -15 Q10 -15 10 -8 L15 -7 Q15 -3 9 -3 Q14 2 11 8 Q6 13 -3 12 Q-12 11 -11 4Z" fill="#FFE066" ${st}/><circle cx="4" cy="-10" r="1.7" fill="#2F3A1E"/><path d="M10 -8 L15 -7 Q15 -4 10 -4Z" fill="#F7A14A"/><circle cx="1" cy="-6" r="2" fill="#FF9DB8" opacity=".7"/></g>`;
  }
  return '';
}
/* bitmap stickers (pencil art). 'bean' replaced the old cat sticker in Phase 1 (no cats). */
const STICKER_IMG = { bean:'assets/img/stk-bean.webp' };
function miniSticker(k){ if (STICKER_IMG[k]) return `<svg viewBox="-18 -18 36 36" class="ico"><image href="${STICKER_IMG[k]}" x="-15.5" y="-16" width="31" height="32"/></svg>`; return `<svg viewBox="-18 -18 36 36" class="ico">${stickerSVG(k,0,0,1)}</svg>`; }

/* ---------- mood faces ---------- */
function faceSVG(k, size=40){
  const m = MOODS.find(x=>x.k===k) || MOODS[0];
  const ink = '#2F3A1E';
  const mouths = {
    smile:`<path d="M-7 3 Q0 11 7 3" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    flat:`<path d="M-6 5 Q0 7 6 5" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    love:`<path d="M-7 3 Q0 11 7 3" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    open:`<path d="M-6 3 Q0 13 6 3Z" fill="${ink}"/>`,
    tired:`<path d="M-5 7 Q0 4 5 7" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    wave:`<path d="M-7 6 Q-3.5 2 0 6 Q3.5 10 7 6" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    calm:`<path d="M-5 4 Q0 8 5 4" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    sad:`<path d="M-6 8 Q0 2 6 8" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
  };
  let eyes = `<circle cx="-6" cy="-3" r="2.3" fill="${ink}"/><circle cx="6" cy="-3" r="2.3" fill="${ink}"/>`;
  if (m.m==='love') eyes = `<path d="M-6 -1 C-10 -4 -8.5 -8 -6 -5.5 C-3.5 -8 -2 -4 -6 -1Z M6 -1 C2 -4 3.5 -8 6 -5.5 C8.5 -8 10 -4 6 -1Z" fill="#FF4F8B"/>`;
  if (m.m==='calm' || m.m==='tired') eyes = `<path d="M-9 -3 Q-6 0 -3 -3 M3 -3 Q6 0 9 -3" stroke="${ink}" stroke-width="2.3" fill="none" stroke-linecap="round"/>`;
  if (m.m==='open') eyes = `<path d="M-9 -2 L-5 -5 L-9 -8 M9 -2 L5 -5 L9 -8" stroke="${ink}" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const sweat = m.m==='wave' ? `<path d="M11 -12 Q14 -7 11 -5 Q8 -7 11 -12Z" fill="#7CC6F2"/>` : '';
  const tear = m.m==='sad' ? `<path d="M-7 1 Q-5 5 -7 7 Q-9 5 -7 1Z" fill="#7CC6F2"/>` : '';
  return `<svg viewBox="-17 -17 34 34" width="${size}" height="${size}" class="face"><circle r="15" fill="${m.c}"/><ellipse cx="-5" cy="-9" rx="5" ry="2.6" fill="#fff" opacity=".55"/>${eyes}${mouths[m.m]}<circle cx="-10" cy="3" r="2.6" fill="#FF8FB5" opacity=".55"/><circle cx="10" cy="3" r="2.6" fill="#FF8FB5" opacity=".55"/>${sweat}${tear}</svg>`;
}

/* ---------- the cup ---------- */
function cupSVG(d, o={}){
  const u = uid();
  const cup = CUPS[d.cup || 'tall'];
  const dr = DRINKS[d.drink || 'matcha'];
  const sleeve = (SLEEVES.find(s=>s.k===d.sleeve)||SLEEVES[0]).c;
  const tops = d.toppings || [];
  const hasMilk = d.milk && d.milk !== 'none';
  const iced = d.temp === 'iced';
  const level = o.empty ? 0 : 1;
  const mini = !!o.mini;
  const cls = o.fill ? 'liq fill-anim' : 'liq';
  let s = `<svg viewBox="0 0 200 270" class="cup-svg ${o.cls||''}" xmlns="http://www.w3.org/2000/svg"><defs>
    <clipPath id="b${u}"><path d="${cup.body}"/></clipPath>
    <linearGradient id="sh${u}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>
    <linearGradient id="lq${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dr.top}"/><stop offset="1" stop-color="${dr.color}"/></linearGradient>
    <linearGradient id="mk${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(dr.top,.72)}"/><stop offset=".35" stop-color="${MILK}"/><stop offset="1" stop-color="#FFFDF8"/></linearGradient>
    <radialGradient id="wh${u}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#FFF7EA"/><stop offset="1" stop-color="#EBDDC6"/></radialGradient>
    <linearGradient id="cp${u}" x1="0" x2="1"><stop offset="0" stop-color="${d.cup==='paper'?'#FFFDF8':'#FFF8EE'}"/><stop offset="1" stop-color="${d.cup==='paper'?'#EFE7DA':'#F1E4CF'}"/></linearGradient>
    ${mini?'':`<filter id="bl${u}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>`}
  </defs>`;
  s += `<ellipse cx="100" cy="254" rx="66" ry="9" fill="#2F3A1E" opacity="${mini?.18:.28}" ${mini?'':`filter="url(#bl${u})"`}/>`;

  // steam
  if (d.temp === 'hot' && !mini){
    const sy = (tops.includes('whip') ? cup.top-60 : cup.top-14);
    s += `<g class="steam" opacity=".75">${[-22,0,22].map((dx,i)=>`<path d="M${100+dx} ${sy} q-9 -14 0 -26 q9 -12 0 -26" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" style="animation-delay:${i*.45}s"/>`).join('')}</g>`;
  }
  // straw (behind front wall)
  const strawC = sleeve && sleeve!=='#F6E7C8' ? sleeve : '#F49AC1';
  if (cup.clear){
    s += `<g><rect x="112" y="${cup.top-62}" width="13" height="${248-cup.top+40}" rx="6.5" transform="rotate(12 118 ${cup.top})" fill="${strawC}"/><rect x="114.5" y="${cup.top-62}" width="3.5" height="${248-cup.top+30}" rx="2" transform="rotate(12 118 ${cup.top})" fill="#fff" opacity=".55"/></g>`;
  }
  // mug handle
  if (d.cup === 'mug'){
    const hc = sleeve || '#F1E4CF';
    s += `<path d="M152 128 C196 124 198 204 146 204" stroke="${shade(hc,-.12)}" stroke-width="17" fill="none" stroke-linecap="round"/><path d="M152 128 C196 124 198 204 146 204" stroke="${hc}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M162 138 C180 142 182 170 176 182" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>`;
  }

  if (cup.clear){
    const L = cup.liq, mid = L + (248-L)*0.46;
    s += `<g clip-path="url(#b${u})"><path d="${cup.body}" fill="#fff" opacity=".28"/>`;
    if (level){
      s += `<g class="${cls}">`;
      if (d.drink==='strawberry' && hasMilk){
        s += `<rect x="0" y="${L}" width="200" height="${270-L}" fill="url(#lq${u})"/><path d="M0 ${mid+14} Q50 ${mid+4} 100 ${mid+14} T200 ${mid+14} L200 270 L0 270Z" fill="${shade(dr.color,.55)}"/>`;
      } else if (hasMilk){
        s += `<rect x="0" y="${L}" width="200" height="${270-L}" fill="url(#lq${u})"/><path d="M0 ${mid} Q30 ${mid-10} 60 ${mid-2} T120 ${mid-4} T200 ${mid-2} L200 270 L0 270Z" fill="url(#mk${u})"/>`;
        if (d.milk==='foam') s += `<rect x="0" y="${L-2}" width="200" height="14" fill="#F6E9D6"/>`;
      } else {
        s += `<rect x="0" y="${L}" width="200" height="${270-L}" fill="url(#lq${u})"/>`;
      }
      s += `<rect x="0" y="${L}" width="200" height="5" fill="#fff" opacity=".25"/>`;
      if (iced){
        s += [[70,L+6,-12],[104,L+2,8],[132,L+14,20],[86,L+30,4]].map(([x,y,r])=>`<g transform="rotate(${r} ${x+12} ${y+12})"><rect x="${x}" y="${y}" width="26" height="26" rx="6" fill="#fff" opacity=".38" stroke="#fff" stroke-opacity=".8" stroke-width="2"/><rect x="${x+4}" y="${y+4}" width="8" height="5" rx="2.5" fill="#fff" opacity=".8"/></g>`).join('');
      }
      if (tops.includes('boba')){
        s += [[66,236],[84,240],[102,238],[120,240],[136,236],[74,224],[94,226],[112,225],[130,224],[84,212],[104,213],[122,212]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8.5" fill="#3A2216"/><circle cx="${x-2.5}" cy="${y-3}" r="2.4" fill="#fff" opacity=".5"/>`).join('');
      }
      s += `</g>`;
    }
    s += sleeveBand(cup, sleeve) + (d.stickers||[]).map((k,i)=>stickerSVG(k, cup.stk[i][0], cup.stk[i][1], 1.05)).join('');
    s += `<rect x="0" y="0" width="200" height="270" fill="url(#sh${u})"/></g>`;
    s += `<path d="${cup.body}" fill="none" stroke="#fff" stroke-opacity=".95" stroke-width="3.5"/>`;
    s += `<path d="M${100-cup.hw+12} ${cup.top+14} L${100-cup.hw+22} ${236}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/><path d="M${100-cup.hw+28} ${cup.top+18} L${100-cup.hw+31} ${cup.top+60}" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>`;
    s += `<ellipse cx="100" cy="${cup.top}" rx="${cup.hw}" ry="7" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="3.5"/>`;
  } else {
    s += `<path d="${cup.body}" fill="url(#cp${u})"/>`;
    s += `<g clip-path="url(#b${u})">${sleeveBand(cup, sleeve)}${(d.stickers||[]).map((k,i)=>stickerSVG(k, cup.stk[i][0], cup.stk[i][1], 1.05)).join('')}<rect x="0" y="0" width="200" height="270" fill="url(#sh${u})"/></g>`;
    s += `<path d="M${100-cup.hw+12} ${cup.top+16} L${100-cup.hw+20} ${226}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6"/>`;
    if (d.cup==='mug'){
      s += `<ellipse cx="100" cy="${cup.top}" rx="58" ry="12" fill="${shade('#F1E4CF',-.1)}"/><ellipse cx="100" cy="${cup.top+1.5}" rx="52" ry="9" fill="${level?`url(#lq${u})`:'#d9c9ae'}" class="${level&&o.fill?'liq-top fill-anim':''}"/>`;
      if (level && hasMilk && !tops.includes('whip')){
        s += `<ellipse cx="100" cy="${cup.top+1.5}" rx="34" ry="5.6" fill="${MILK}" opacity=".95"/><path d="M100 ${cup.top+5.5} C88 ${cup.top-1} 92 ${cup.top-6} 100 ${cup.top-2} C108 ${cup.top-6} 112 ${cup.top-1} 100 ${cup.top+5.5}Z" fill="${dr.top}" opacity=".85"/>`;
      }
    } else {
      // to-go lid
      s += `<path d="M38 86 Q38 76 48 75 L152 75 Q162 76 162 86 Z" fill="#FFFDF8" stroke="#E6DCCB" stroke-width="2"/><path d="M50 75 Q52 60 70 58 L130 58 Q148 60 150 75Z" fill="#FFFFFF" stroke="#E6DCCB" stroke-width="2"/><rect x="108" y="54" width="18" height="7" rx="3.5" fill="#E6DCCB"/><path d="M58 70 L142 70" stroke="#fff" stroke-width="3" opacity=".8"/><ellipse cx="100" cy="86" rx="62" ry="3" fill="#2F3A1E" opacity=".08"/>`;
    }
  }

  // toppings on top
  const surf = d.cup==='paper' ? 60 : (cup.clear ? cup.top : cup.top);
  const hasWhip = tops.includes('whip') && level;
  if (hasWhip){
    const y = surf;
    const puffs = [[66,y-4,20],[100,y-6,24],[134,y-4,20],[82,y-22,18],[118,y-22,18],[100,y-38,16],[100,y-52,9]];
    s += `<g class="whip">${puffs.map(([x,yy,r])=>`<circle cx="${x}" cy="${yy}" r="${r}" fill="url(#wh${u})"/>`).join('')}<path d="M78 ${y-26} Q92 ${y-14} 104 ${y-28} M90 ${y-44} Q102 ${y-34} 110 ${y-46}" stroke="#E8D8BF" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
  }
  const crown = hasWhip ? surf-40 : surf-4;
  if (tops.includes('drizzle') && level){
    const y = hasWhip ? surf-30 : surf-2;
    s += `<path d="M62 ${y+10} Q72 ${y-8} 82 ${y+8} T102 ${y+4} T122 ${y+8} T140 ${y+6}" stroke="#B66A26" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M80 ${y+6} l0 10 M118 ${y+6} l0 13" stroke="#B66A26" stroke-width="4.5" stroke-linecap="round"/>`;
  }
  if (tops.includes('sprinkle') && level){
    const cols = ['#FF6FA5','#FFD23F','#7CC6F2','#8DBB3F','#C9B6F2'];
    const pts = hasWhip ? [[74,surf-14,20],[92,surf-34,-30],[110,surf-18,60],[126,surf-30,10],[100,surf-50,-50],[138,surf-8,40],[62,surf-6,-20],[86,surf-4,80],[116,surf-42,30]] : [[72,surf-2,20],[90,surf-6,-30],[110,surf-2,60],[128,surf-6,10],[100,surf-10,-50]];
    s += pts.map(([x,y,r],i)=>`<rect x="${x}" y="${y}" width="9" height="3.6" rx="1.8" fill="${cols[i%5]}" transform="rotate(${r} ${x} ${y})"/>`).join('');
  }
  if (tops.includes('berry') && level){
    const y = crown - 8;
    s += `<g transform="translate(${hasWhip?100:82} ${y})"><path d="M0 18 C-15 8 -15 -6 0 -4 C15 -6 15 8 0 18Z" fill="#F0354E"/><path d="M-6 -2 C-9 4 -6 10 -2 12" stroke="#fff" stroke-width="2.4" fill="none" opacity=".45" stroke-linecap="round"/>${[[-5,4],[4,2],[0,9],[6,9],[-6,10]].map(([a,b])=>`<ellipse cx="${a}" cy="${b}" rx="1" ry="1.5" fill="#FFE07A"/>`).join('')}<path d="M0 -4 L-8 -10 L-3 -6 L0 -13 L3 -6 L8 -10Z" fill="#5FA032"/></g>`;
  }
  s += `</svg>`;
  return s;
}
function sleeveBand(cup, c){
  if (!c) return '';
  const [a,b] = cup.sl;
  return `<rect x="0" y="${a}" width="200" height="${b-a}" fill="${c}"/><path d="M0 ${a+5} H200 M0 ${b-5} H200" stroke="#fff" stroke-width="1.6" stroke-dasharray="4 4" opacity=".75"/>${[30,60,90,120,150,180].map((x,i)=>`<circle cx="${x+(i%2?8:0)}" cy="${(a+b)/2}" r="2.6" fill="#fff" opacity=".45"/>`).join('')}`;
}

/* ---------- espresso machine ---------- */
function machineSVG(shots){
  return `<svg viewBox="0 0 320 330" class="machine" xmlns="http://www.w3.org/2000/svg"><defs>
  <linearGradient id="mb" x1="0" x2="1"><stop offset="0" stop-color="#FFF8EC"/><stop offset=".55" stop-color="#FBEBD3"/><stop offset="1" stop-color="#E9D2B0"/></linearGradient>
  <linearGradient id="chr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F4F0"/><stop offset=".45" stop-color="#B9BBB2"/><stop offset=".55" stop-color="#8E9187"/><stop offset="1" stop-color="#D9DAD3"/></linearGradient>
  <linearGradient id="chrh" x1="0" x2="1"><stop offset="0" stop-color="#9C9F95"/><stop offset=".3" stop-color="#F6F6F2"/><stop offset="1" stop-color="#8E9187"/></linearGradient>
  <linearGradient id="esp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C88A4C"/><stop offset=".25" stop-color="#7A4527"/><stop offset="1" stop-color="#3D2014"/></linearGradient>
  <filter id="mblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
  <clipPath id="shotc"><path d="M136 214 L184 214 L180 262 Q179 268 173 268 L147 268 Q141 268 140 262Z"/></clipPath>
  </defs>
  <ellipse cx="160" cy="306" rx="140" ry="12" fill="#2F3A1E" opacity=".3" filter="url(#mblur)"/>
  <rect x="34" y="44" width="252" height="256" rx="34" fill="url(#mb)"/>
  <rect x="34" y="44" width="252" height="256" rx="34" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
  <rect x="26" y="26" width="268" height="44" rx="20" fill="#2F3A1E"/>
  <rect x="40" y="31" width="150" height="6" rx="3" fill="#fff" opacity=".18"/>
  <g transform="translate(212 6)"><path d="M0 0 h26 l-3 20 h-20z" fill="#F49AC1"/><path d="M34 2 h22 l-3 18 h-16z" fill="#D4E000"/></g>
  <rect x="104" y="84" width="112" height="44" rx="14" fill="#1E2612"/>
  <rect x="104" y="84" width="112" height="44" rx="14" fill="none" stroke="#3E4A2A" stroke-width="3"/>
  <text x="160" y="114" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="21" fill="#D4E000" class="m-disp">${shots} SHOT${shots>1?'S':''}</text>
  ${[[70,106],[250,106]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="17" fill="url(#chrh)"/><circle cx="${x}" cy="${y}" r="10" fill="#2F3A1E"/><rect x="${x-1.8}" y="${y-9}" width="3.6" height="8" rx="1.8" fill="#D4E000"/>`).join('')}
  <circle cx="160" cy="150" r="5" fill="#F49AC1"/>
  <rect x="122" y="160" width="76" height="20" rx="8" fill="url(#chr)"/>
  <rect x="110" y="178" width="100" height="16" rx="8" fill="#2F3A1E"/>
  <rect x="196" y="181" width="88" height="11" rx="5.5" fill="#2F3A1E" transform="rotate(-6 196 186)"/>
  <rect x="146" y="193" width="9" height="9" rx="2" fill="url(#chrh)"/><rect x="165" y="193" width="9" height="9" rx="2" fill="url(#chrh)"/>
  <g class="streams"><rect class="stream" x="148" y="200" width="5" height="64" rx="2.5" fill="url(#esp)"/><rect class="stream" x="167" y="200" width="5" height="64" rx="2.5" fill="url(#esp)"/></g>
  <path d="M60 150 L60 236 Q60 246 70 248" stroke="url(#chrh)" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="62" y="268" width="196" height="20" rx="10" fill="url(#chr)"/>
  ${[90,110,130,150,170,190,210,230].map(x=>`<rect x="${x}" y="273" width="10" height="3" rx="1.5" fill="#7d8075" opacity=".6"/>`).join('')}
  <g class="shotglass">
    <g clip-path="url(#shotc)"><rect x="120" y="214" width="80" height="60" fill="#fff" opacity=".3"/>
      <g class="shot-liq" style="transform:scaleY(${Math.min(1, shots? 0 : 0)})"><rect x="120" y="214" width="80" height="60" fill="url(#esp)"/><rect x="120" y="214" width="80" height="8" fill="#D9A066"/></g>
    </g>
    <path d="M136 214 L184 214 L180 262 Q179 268 173 268 L147 268 Q141 268 140 262Z" fill="none" stroke="#fff" stroke-width="3"/>
    <path d="M143 222 L146 258" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".65"/>
  </g>
  </svg>`;
}

/* ---------- matcha bowl + chasen ---------- */
function bowlSVG(){
  return `<svg viewBox="0 0 320 290" class="bowl" xmlns="http://www.w3.org/2000/svg"><defs>
  <linearGradient id="bw" x1="0" x2="1"><stop offset="0" stop-color="#5C6B3C"/><stop offset=".35" stop-color="#8A9A5E"/><stop offset=".7" stop-color="#6A7A45"/><stop offset="1" stop-color="#3F4B27"/></linearGradient>
  <linearGradient id="bwd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3E9D2"/><stop offset="1" stop-color="#D8C9A6"/></linearGradient>
  <radialGradient id="mt" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#9CC84A"/><stop offset="1" stop-color="#4F7A1E"/></radialGradient>
  <radialGradient id="fm" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#E4F2A6"/><stop offset="1" stop-color="#A9CD58"/></radialGradient>
  <filter id="bblur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
  <clipPath id="bwc"><ellipse cx="160" cy="132" rx="100" ry="22"/></clipPath>
  </defs>
  <ellipse cx="160" cy="270" rx="120" ry="12" fill="#2F3A1E" opacity=".3" filter="url(#bblur)"/>
  <rect x="112" y="240" width="96" height="24" rx="10" fill="#4A5730"/>
  <path d="M46 128 Q44 250 160 252 Q276 250 274 128 Z" fill="url(#bw)"/>
  <path d="M46 128 Q46 176 70 196 Q92 168 120 186 Q150 160 176 186 Q206 166 232 190 Q262 172 274 128Z" fill="url(#bwd)" opacity=".95"/>
  <path d="M68 150 Q72 210 120 230" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".28"/>
  <g class="bowl-face"><circle cx="138" cy="212" r="4" fill="#1E2612"/><circle cx="182" cy="212" r="4" fill="#1E2612"/><path d="M152 220 Q160 228 168 220" stroke="#1E2612" stroke-width="3.2" fill="none" stroke-linecap="round"/><ellipse cx="124" cy="224" rx="8" ry="5" fill="#FF8FB5" opacity=".6"/><ellipse cx="196" cy="224" rx="8" ry="5" fill="#FF8FB5" opacity=".6"/></g>
  <ellipse cx="160" cy="128" rx="114" ry="28" fill="#EADDBF"/>
  <ellipse cx="160" cy="130" rx="104" ry="23" fill="#3A4423"/>
  <g clip-path="url(#bwc)">
    <ellipse cx="160" cy="134" rx="100" ry="22" fill="url(#mt)"/>
    <g class="foam" style="opacity:0"><ellipse cx="160" cy="134" rx="100" ry="22" fill="url(#fm)"/>
      ${Array.from({length:26},(_,i)=>{const a=i*2.4, r=10+ (i*7)%80; return `<circle cx="${(160+Math.cos(a)*r).toFixed(1)}" cy="${(134+Math.sin(a)*r*0.2).toFixed(1)}" r="${2+(i%3)}" fill="#F6FBDF" opacity=".85"/>`}).join('')}
    </g>
    <path class="swirl" d="M110 134 Q160 116 210 134 Q160 150 120 136" stroke="#C6E07F" stroke-width="3" fill="none" opacity=".0"/>
  </g>
  </svg>`;
}
function chasenSVG(){
  let tines = '';
  for (let i=0;i<15;i++){ const x = 30 + i*4; const bend = (x-58)*0.9; tines += `<path d="M${x} 92 Q${x+bend*0.3} 128 ${58+bend*1.25} 160" stroke="${i%2?'#E8D19C':'#D9BC7F'}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; }
  return `<svg viewBox="0 0 116 170" class="chasen-svg" xmlns="http://www.w3.org/2000/svg">
  <rect x="44" y="2" width="28" height="94" rx="12" fill="#E2C58A"/><rect x="48" y="6" width="7" height="84" rx="3.5" fill="#fff" opacity=".45"/>
  <rect x="42" y="34" width="32" height="5" rx="2.5" fill="#C7A566"/><rect x="40" y="86" width="36" height="10" rx="5" fill="#2F3A1E"/>
  ${tines}<ellipse cx="58" cy="140" rx="22" ry="10" fill="#E8D19C" opacity=".35"/></svg>`;
}

/* ---------- pour carton (other drinks) ---------- */
function cartonSVG(dr){
  return `<svg viewBox="0 0 140 170" class="carton" xmlns="http://www.w3.org/2000/svg">
  <path d="M30 50 L70 18 L110 50 L110 160 Q110 166 104 166 L36 166 Q30 166 30 160Z" fill="#FFFDF8"/>
  <path d="M30 50 L70 18 L110 50Z" fill="${dr.color}"/><rect x="58" y="6" width="24" height="16" rx="4" fill="${shade(dr.color,-.15)}"/>
  <rect x="30" y="98" width="80" height="44" fill="${dr.color}" opacity=".9"/>
  <circle cx="58" cy="78" r="3.5" fill="#2F3A1E"/><circle cx="82" cy="78" r="3.5" fill="#2F3A1E"/><path d="M64 84 Q70 90 76 84" stroke="#2F3A1E" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="50" cy="86" rx="6" ry="4" fill="#FF8FB5" opacity=".6"/><ellipse cx="90" cy="86" rx="6" ry="4" fill="#FF8FB5" opacity=".6"/>
  <text x="70" y="126" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="14" fill="#fff">${dr.en}</text>
  <path d="M38 56 L38 156" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  <path d="M110 50 L110 160" stroke="#000" stroke-width="10" opacity=".06"/></svg>`;
}
