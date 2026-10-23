/* Cupmori (คัพมอริ) · ชงความรู้สึก เก็บวันของเรา */
(() => {
const $ = (s, r=document) => r.querySelector(s);
const app = $('#app');
const IMG = 'assets/img/';
const KEY = 'ggcafe.moodcup.v1';   /* storage key kept for continuity; schema version lives inside (db.v) */
const SCHEMA = 3;
const P = window.Platform, ENV = P.env, NOW = () => ENV.now();

/* ---------- data ---------- */
const BARISTAS = [
  { k:'pe', th:'เป๊ะ', prop:'หมวกแก๊ปแดง', q:'', greet:'สวัสดีค่า~ วันนี้มู้ดไหนดี? เป๊ะชงให้เอง!', tail:' ก๊าบ!', quirk:'หัวหน้าบาร์ประจำร้าน ยิ้มเก่งที่สุด' },
  { k:'berry',   th:'เบอร์รี่', prop:'หมวกเบเร่ต์',    q:'q-bounce', greet:'บองชูร์~ วันนี้เบอร์รี่ชงสไตล์ปารีสให้นะ', tail:' ซิลวูเปล้~', quirk:'ศิลปินลาเต้อาร์ตประจำร้าน' },
  { k:'moss',    th:'มอส',     prop:'ผ้าพันคอลายใบไม้', q:'q-nod',    greet:'สูดกลิ่นใบชาก่อน... อืม หอมจัง', tail:' ค่อยๆ นะ',   quirk:'สายมัทฉะตัวจริง ตีฟองนุ่มสุด' },
  { k:'momo',    th:'โมโม่',   prop:'แว่นกลม',        q:'q-nod',    greet:'โมโม่จดสูตรมาเป๊ะทุกกรัมเลยนะ!', tail:' ✎',  quirk:'ชั่งตวงละเอียดยิบทุกกรัม' },
  { k:'bobby',   th:'บ็อบบี้', prop:'ผ้ากันเปื้อน+โบว์ไท', q:'q-bounce', greet:'สวัสดีครับ! บาริสต้าบ็อบบี้พร้อมให้บริการ', tail:' ครับผม!', quirk:'เนี้ยบเหมือนบาร์มืออาชีพ' },
  { k:'snowy',   th:'สโนวี่',  prop:'โบว์ชมพู',       q:'q-heart',  greet:'วันนี้ใส่หัวใจเพิ่มให้นะคะ ♡', tail:' ♡',          quirk:'แอบวาดหัวใจให้ทุกแก้ว' },
  { k:'biscuit', th:'บิสกิต',  prop:'หมวกเชฟเบเกอร์',  q:'q-sway',   greet:'ขนมเพิ่งออกจากเตาเลย! ได้เครื่องดื่มคู่กันพอดี', tail:' หอมๆ~', quirk:'ชอบเสิร์ฟคุกกี้แถมเงียบๆ' },
  { k:'ash',     th:'แอช',     prop:'ผ้าพันคอไหมพรม',  q:'q-sleepy', greet:'หนาวๆ แบบนี้... ขอแก้วอุ่นๆ สักแก้วนะ', tail:' ...อุ่นจัง', quirk:'ง่วงนิดๆ แต่ชงอร่อยมาก' },
  { k:'avocado', th:'อาโวคาโด', prop:'ที่คาดผมเมล็ดกาแฟ', q:'q-bounce', greet:'วันนี้ต้องสดชื่น! ลุยกันเลยยย', tail:' เย้!',     quirk:'พลังเยอะ ชงไปเต้นไป' },
  { k:'plum',    th:'พลัม',    prop:'หมวกม่วงดอกไม้',  q:'q-sway',   greet:'คาเฟ่ของพลัมมีเวทมนตร์ความหวานนิดๆ ✦', tail:' ✦',     quirk:'โรยความหวานแบบเวทมนตร์' },
  { k:'rosie',   th:'โรซี่',   prop:'ดอกไม้บนหัว',     q:'q-heart',  greet:'ดอกไม้บานแล้ว มู้ดเราก็บานด้วยนะ', tail:' ✿',       quirk:'แต่งแก้วด้วยดอกไม้เสมอ' },
  { k:'puddle',  th:'พัดเดิ้ล', prop:'หูฟังสีส้ม',      q:'q-bop',    greet:'เปิดเพลงชิลๆ แล้ว... ชงไปฟังไปกันนะ ♪', tail:' ♪',    quirk:'โยกหัวตามจังหวะเพลง' },
];
const B = k => BARISTAS.find(b=>b.k===k) || BARISTAS[0];
/* launch roster: 5 ducks (Nadda, 23 Oct 2026). The other 7 stay in data for a later phase but are never shown. */
const LAUNCH_DUCKS = ['pe','berry','moss','momo','bobby'];
const LIVE = BARISTAS.filter(b=>LAUNCH_DUCKS.includes(b.k));
/* guests: unlocked by CUMULATIVE stamps (sample data excluded), permanent once unlocked */
const GUESTS = [
  { k:'frog',     th:'กบขาประจำ', at:3,  role:'ลูกค้าประจำ สั่งมัทฉะเสมอ', line:'วันนี้ก็มัทฉะเหมือนเดิมนะ~ อ๊บ!' },
  { k:'hedgehog', th:'เม่นจิ๋ว',   at:7,  role:'บาริสต้ารับเชิญ', helper:1, line:'วันนี้เม่นจิ๋วขอช่วยชงด้วยนะ ระวังหนามนิดนึง!' },
  { k:'otter',    th:'นากทะเล',   at:14, role:'ชอบวางแก้วไว้บนพุง', line:'โกโก้อุ่นๆ วางบนพุงแบบนี้แหละ สบายที่สุด' },
  { k:'sheep',    th:'แกะขนฟู',   at:30, role:'บาริสต้าฝึกหัด', helper:1, line:'แกะขนฟูจดออเดอร์ให้เองนะ ขอเวลาแป๊บ~' },
  { k:'redpanda', th:'แพนด้าแดง', at:60, role:'แขกพิเศษ เปิดเมนูลับ', line:'ชู่ว... วันนี้มีเมนูลับนะ บอกแค่เธอคนเดียว ✦' },
  /* festival guest: visits every day of World Bee Day week (17-23 May); stays in the collection after the first visit */
  { k:'bee',      th:'ผึ้งน้อย',   fest:'worldBeeDay', role:'แขกรับเชิญช่วงวันผึ้งโลก', line:'บั๊ซซ~ สัปดาห์นี้ขอน้ำผึ้งเพิ่มนิดนึงนะ' },
];
const STAMP_GUESTS = GUESTS.filter(g=>!g.fest);
const G = k => GUESTS.find(g=>g.k===k);
const RANDOM_BARISTA = true;

const MENU = [
  { k:'latte',      th:'ลาเต้',          p:75, cat:'coffee', img:'latte',       milk:1, art:1, desc:'เอสเปรสโซ่ + นมสตีมเนียนนุ่ม หอมละมุน' },
  { k:'americano',  th:'อเมริกาโน่',     p:65, cat:'coffee', img:'americano',   milk:0, art:0, desc:'ช็อตเข้มๆ เติมน้ำ สดชื่นตรงไปตรงมา' },
  { k:'cappuccino', th:'คาปูชิโน่',      p:75, cat:'coffee', img:'latte',       milk:1, art:1, foam:1, desc:'ฟองนมหนานุ่ม โรยผงโกโก้นิดๆ' },
  { k:'mocha',      th:'มอคค่า',         p:80, cat:'coffee', img:'mocha',       milk:1, art:1, choc:1, desc:'ช็อกโกแลต + เอสเปรสโซ่ หวานอุ่นใจ' },
  { k:'dirty',      th:'เดอร์ตี้',        p:85, cat:'coffee', img:'latte',       milk:1, art:0, temp:'iced', desc:'นมเย็นเฉียบ ราดช็อตร้อน เป็นชั้นสวย' },
  { k:'matchalatte',th:'มัทฉะลาเต้',     p:85, cat:'matcha', img:'icematcha',   milk:1, powder:'มัทฉะ', wt:[75,85], desc:'มัทฉะอุจิ ตีฟองนุ่ม + นมสด' },
  { k:'usucha',     th:'อุสุฉะ',          p:90, cat:'matcha', img:'usucha',      milk:0, powder:'มัทฉะ', wt:[75,85], temp:'hot', desc:'มัทฉะใสแบบพิธีชงชา เพียวๆ ละมุน' },
  { k:'strawmatcha',th:'สตรอว์เบอร์รีมัทฉะ', p:95, cat:'matcha', img:'strawmatcha', milk:1, powder:'มัทฉะ', wt:[75,85], temp:'iced', straw:1, desc:'สตรอว์เบอร์รีบด + นม + มัทฉะ 3 ชั้น' },
  { k:'hojicha',    th:'โฮจิฉะลาเต้',    p:85, cat:'other',  img:'hojicha',     milk:1, powder:'โฮจิฉะ', wt:[85,95], desc:'ชาเขียวคั่ว หอมควันอ่อนๆ อบอุ่น' },
  { k:'pumpkin',    th:'พัมพ์กิ้นลาเต้', p:95, cat:'coffee', img:'pumpkin', milk:1, art:1, temp:'hot', season:[9], badge:'🎃 ฮาโลวีน · ตุลาคมเท่านั้น', desc:'เมนูฮาโลวีน ฟักทองอบ + อบเชยอุ่นๆ บนเอสเปรสโซ่' },
  { k:'xmascocoa',  th:'โกโก้คริสต์มาส', p:90, cat:'other', img:'xmascocoa', milk:1, powder:'โกโก้', wt:[70,90], temp:'hot', season:[11], badge:'🎄 คริสต์มาส · ธันวาคมเท่านั้น', desc:'โกโก้เข้มข้น มาร์ชแมลโลว์ + เปปเปอร์มินต์ หอมหวานรับลมหนาว' },
  { k:'cocoa',      th:'โกโก้',           p:70, cat:'other',  img:'cocoa',       milk:1, powder:'โกโก้', wt:[70,90], desc:'โกโก้เข้มข้น + มาร์ชแมลโลว์' },
  { k:'honeylatte', th:'ฮันนี่ลาเต้', p:85, cat:'coffee', img:'latte', milk:1, art:1, season:[4], honey:1, badge:'🐝 วันผึ้งโลก · ช่วง 17–23 พ.ค.', desc:'ลาเต้หอมน้ำผึ้งดอกไม้ หวานละมุนแบบธรรมชาติ' },
  { k:'honeysoda',  th:'ฮันนี่เลมอนโซดา', p:75, cat:'other', img:'honeysoda', milk:0, temp:'iced', season:[4], honey:1, soda:1, badge:'🐝 วันผึ้งโลก · ช่วง 17–23 พ.ค.', desc:'โซดาซ่าๆ + น้ำผึ้ง + เลมอนสด สีทองสดชื่น' },
  { k:'secret',     th:'เมเปิลซินนามอนลาเต้', p:99, cat:'coffee', img:'secret', milk:1, art:0, temp:'hot', secret:'redpanda', badge:'✦ เมนูลับจากแพนด้าแดง', desc:'เมนูลับ: เมเปิลหอมๆ + อบเชย บนลาเต้ลายดาว' },
];
/* limited-time items are driven by the festival date engine (festivals.js), not by month numbers */
const secretOpen = m => !m.secret || !!(db.guests||{})[m.secret];
const menuNow = () => { const fm = Festivals.festivalMenu(NOW()); return MENU.filter(m => (!m.season || fm.includes(m.k)) && secretOpen(m)); };
const badgeIcon = m => m.secret ? '✦' : m.k==='pumpkin' ? '🎃' : m.k==='xmascocoa' ? '🎄' : m.honey ? '🐝' : '';
const M = k => MENU.find(m=>m.k===k) || MENU[0];
const isCoffee = m => m.cat==='coffee';
const CAT = { coffee:{th:'กาแฟ',c:'#C79A6B'}, matcha:{th:'มัทฉะ',c:'#9DBF6A'}, other:{th:'อื่นๆ',c:'#F2A7A0'} };
const TINT_BASE = { pumpkin:'#F6D9BE', xmascocoa:'#F3D3CF', glassmatcha:'#DCEBC7', icelatte:'#EEDCC8', hotmatcha:'#DCEBC7', latte:'#F3DCC4', americano:'#EBD9C8', mocha:'#ECD4C4', icematcha:'#DCEBC7', strawmatcha:'#F7D6E0', hojicha:'#EDD8C3', cocoa:'#EFDACE', usucha:'#D9EAD2' };
Object.assign(TINT_BASE,{ honeysoda:'#FBEBC0', honeylatte:'#F6E2BF', matcha:'#DCEBC7', matchalatte:'#E3EFD2', xmas:'#F3D3CF', secret:'#F6DCC6', decaf:'#E6DDF2' });
const TINT = new Proxy(TINT_BASE,{ get:(t,k)=> t[k] || t[String(k).split('-').pop()] || '#F8E6CF' });
const CUPS = [ {k:'tumbler',th:'แก้วใสทรงสูง'}, {k:'mug',th:'แก้วมัค'}, {k:'paper',th:'แก้วกระดาษ'}, {k:'glass',th:'แก้วใสทรงเตี้ย'} ];
const SLEEVES = [ {k:'none',c:null,th:'ไม่มี'}, {k:'peach',c:'#F8C4A4'}, {k:'butter',c:'#FFE08A'}, {k:'rose',c:'#F4A9B8'}, {k:'mint',c:'#BFE3C4'}, {k:'sky',c:'#B8DCF2'}, {k:'lilac',c:'#D5C4F0'}, {k:'gold',c:'#E9B949',th:'สีทอง'} ];
const STK = ['heart','star','flower','smile','leaf','bean','crown','duck'];   /* 'cat' removed (no cats) -> 'bean'; old entries migrated */
/* streak rewards (best all-time streak, sample data excluded) */
const REWARDS = [
  { d:7,  type:'sleeve',  k:'gold',  th:'ปลอกแก้วสีทอง' },
  { d:14, type:'sticker', k:'crown', th:'สติกเกอร์มงกุฎ' },
  { d:30, type:'sticker', k:'duck',  th:'สติกเกอร์น้องเป็ด' },
];
function bestStreak(){
  const ks=Object.keys(db.entries).filter(k=>!db.entries[k].demo).sort(); let best=0, run=0, prev=null;
  ks.forEach(k=>{ const d=parseKey(k); run = prev && Math.round((d-prev)/864e5)===1 ? run+1 : 1; best=Math.max(best,run); prev=d; }); return best;
}
const lockOf = (type,k) => { const r=REWARDS.find(x=>x.type===type&&x.k===k); return r && bestStreak()<r.d ? r : null; };
function metCounts(){ const c={}; Object.values(db.entries).forEach(e=>{ if(!e.demo && e.barista) c[e.barista]=(c[e.barista]||0)+1; }); return c; }
const STK_POS = [[6,10],[70,4],[2,62]];
const BEANS = [ {k:'light',th:'คั่วอ่อน · ฟรุตตี้'}, {k:'medium',th:'คั่วกลาง · บาลานซ์'}, {k:'dark',th:'คั่วเข้ม · ช็อกโกแลต'}, {k:'thai',th:'ดอยช้าง · เชียงราย'} ];
const GRINDS = [ {k:'fine',th:'ละเอียด (เอสเปรสโซ่)'}, {k:'medium',th:'กลาง'}, {k:'coarse',th:'หยาบ'} ];
const MILKS = [ {k:'fresh',th:'นมสด'}, {k:'oat',th:'โอ๊ตมิลค์'}, {k:'almond',th:'อัลมอนด์'}, {k:'soy',th:'นมถั่วเหลือง'} ];
const ARTS = [ {k:'heart',th:'หัวใจ'}, {k:'tulip',th:'ทิวลิป'}, {k:'rosetta',th:'โรเซตต้า'}, {k:'none',th:'ไม่วาด'} ];
const SYRUPS = [ {k:'none',th:'ไม่ใส่'}, {k:'vanilla',th:'วานิลลา'}, {k:'caramel',th:'คาราเมล'}, {k:'hazelnut',th:'เฮเซลนัท'}, {k:'brown',th:'น้ำตาลทรายแดง'} ];
const TOPS = [ {k:'none',th:'ไม่ใส่'}, {k:'whip',th:'วิปครีม'}, {k:'cheese',th:'ครีมชีสโฟม'}, {k:'boba',th:'ไข่มุก'}, {k:'dust',th:'โรยผง'} ];
const SIZES = [ {k:'S',th:'เล็ก 12oz',add:0,sc:.84}, {k:'M',th:'กลาง 16oz',add:10,sc:.93}, {k:'L',th:'ใหญ่ 22oz',add:20,sc:1} ];
/* ice = exact cube count 0-5; the drawn cup shows exactly that many cubes (v3). Old v1/v2 words map to counts. */
const ICES = [0,1,2,3,4,5].map(n=>({ k:String(n), n, th: n ? `${n} ก้อน` : 'ไม่ใส่น้ำแข็ง' }));
const ICE_LEGACY = { none:'0', less:'2', normal:'4', extra:'5' };
const iceN = d => { const v = d && d.ice!=null ? (ICE_LEGACY[d.ice] ?? d.ice) : '3'; const n = parseInt(v,10); return isNaN(n) ? 3 : Math.max(0, Math.min(5, n)); };
const SWEETS = [ {k:0,th:'ไม่หวาน 0%'}, {k:25,th:'หวานน้อย 25%'}, {k:50,th:'หวานกลาง 50%'}, {k:100,th:'หวานปกติ 100%'}, {k:120,th:'หวานมาก 120%'} ];
const TEMPS = [ {k:'hot',th:'☕ ร้อน'}, {k:'iced',th:'🧊 เย็น'} ];
const OPT_DEF = { temp:'hot', ice:'3', size:'M', sweet:50, milk:'fresh', decaf:0 };
const DECAFS = [ {k:0,th:'ปกติ'}, {k:1,th:'🌙 ดีแคฟ'} ];
const priceOf = d => M(d.drink).secret ? M(d.drink).p : (M(d.drink).p) + ((SIZES.find(z=>z.k===d.size)||SIZES[1]).add) + (d.milk && d.milk!=='fresh' && M(d.drink).milk ? 15 : 0);
const tempOf = d => M(d.drink).temp || d.temp || 'hot';
/* artwork follows the chosen cup (matcha/coffee variants are recolours of the same pencil drawings) */
const famOf = m => m.k==='pumpkin' ? 'pumpkin' : m.k==='xmascocoa' ? 'xmas' : ['matcha'].includes(m.cat) ? 'matcha' : m.k==='cocoa' ? 'cocoa' : 'coffee';
const CUP_ART = {
  tumbler:{ coffee:'icelatte', cocoa:'icelatte', matcha:'icematcha', straw:'strawmatcha' },
  glass:  { coffee:'mocha', cocoa:'mocha', matcha:'glassmatcha' },
  mug:    { coffee:'latte', cocoa:'cocoa', matcha:'hotmatcha', pumpkin:'pumpkin', xmas:'xmascocoa' },
  paper:  { coffee:'americano', cocoa:'americano', matcha:'americano', pumpkin:'americano', xmas:'americano' },
};
/* vessels: the cup IS the shape choice; every vessel shows the actual drink */
const VESSELS = {
  mug:  [ {k:'mug1',th:'มัคครีมโบว์ชมพู'}, {k:'mug2',th:'มัคสีชมพู'}, {k:'mug3',th:'มัคเขียวเดซี่'}, {k:'mug4',th:'มัคบับเบิ้ล'}, {k:'mug5',th:'มัคแก้วลอนผูกโบว์'}, {k:'mug6',th:'มัคลายจุดขอบชมพู'} ],
  glass:[ {k:'gl1',th:'แก้วทัมเบลอร์'}, {k:'gl2',th:'แก้วทรงสูง'}, {k:'gl3',th:'แก้วลอนซ้อน'}, {k:'gl4',th:'แก้วบับเบิ้ล'}, {k:'gl5',th:'แก้วทรงกระป๋อง'}, {k:'gl6',th:'แก้วร็อก'} ],
  bowl: [ {k:'bw1',th:'ยูกิ ชิโนะ'}, {k:'bw2',th:'โอริเบะ เขียว'}, {k:'bw3',th:'โอริเบะ ชิโนะ'}, {k:'bw4',th:'ไอวอรี่ กรีน'}, {k:'bw5',th:'เบจ กรีน'}, {k:'bw6',th:'บราวน์ กรีน ดริป'} ],
  straw:[ {k:'straw',th:'แก้วสตรอว์เบอร์รี'} ],
  secret:[ {k:'secretcup',th:'แก้วลายดาวเมนูลับ'} ],
  soda:[ {k:'sodaglass',th:'แก้วโซดาน้ำผึ้ง'} ],
};
const DECAF_MUG = {k:'decafmug',th:'มัคม่วงพระจันทร์ (ดีแคฟ)'};
const cupName = k => (CUPS.find(x=>x.k===k)||Object.values(VESSELS).flat().concat([DECAF_MUG]).find(x=>x.k===k)||{}).th;
/* a counted unit on its own (summary tiles, canvas): Thai unchanged; English gets cup/cups, shot/shots */
const unitOf = (th, n) => String(window.I18N ? I18N.t(`${n} ${th}`) : th).replace(/^\d+\s*/, '');
const VESSEL_KEYS = Object.values(VESSELS).flat().map(v=>v.k);
const vesselType = d => { const m=M(d.drink); if (m.secret) return 'secret'; if (m.soda) return 'soda'; if (m.k==='strawmatcha') return 'straw'; if (tempOf(d)==='iced') return 'glass'; return m.k==='usucha' ? 'bowl' : 'mug'; };
const VARIANT = {
  mug:  { honeylatte:'latte', latte:'latte', cappuccino:'latte', mocha:'mocha', americano:'americano', hojicha:'hojicha', cocoa:'cocoa', pumpkin:'pumpkin', xmascocoa:'xmas', matchalatte:'matcha' },
  glass:{ honeylatte:'latte', latte:'latte', cappuccino:'latte', dirty:'latte', mocha:'mocha', americano:'americano', matchalatte:'matcha', hojicha:'hojicha', cocoa:'cocoa' },
  bowl: { usucha:'usucha' },
};
const cupsFor = d => { const t=vesselType(d); return t==='mug' && d.decaf && isCoffee(M(d.drink)) ? [DECAF_MUG, ...VESSELS.mug] : VESSELS[t]; };
const fixCup = d => { const L=cupsFor(d); if (!L.some(v=>v.k===d.cup)) d.cup = L[0].k; };
const vesselArt = e => { if (e.cup==='sodaglass') return 'honeysoda'; if (e.cup==='secretcup') return 'secret'; if (e.cup==='decafmug') return 'decaf'; const t=VESSEL_KEYS.includes(e.cup) && e.cup!=='sodaglass' ? (e.cup==='straw'?'straw':e.cup.slice(0,2)==='gl'?'glass':e.cup.slice(0,2)==='bw'?'bowl':'mug') : null; if(!t) return null; if (t==='straw') return 'strawmatcha'; const v=VARIANT[t][M(e.drink).k]; return v ? `v-${e.cup}-${v}` : null; };
/* tidy overlays placed per drawing (percent of the 100×100 art box) */
function glassIce(cx, y, hw, sc){ const d=9.2*sc; return [[cx-hw*.45,y+1],[cx+hw*.4,y],[cx-hw*.02,y+d*.62],[cx-hw*.86,y+d*.5],[cx+hw*.82,y+d*.55]]; }
const ART_FX = {
  bw1:{steam:[16,[36,48,60]]}, bw2:{steam:[16,[36,48,60]]}, bw3:{steam:[16,[36,48,60]]}, bw4:{steam:[16,[36,48,60]]}, bw5:{steam:[18,[36,48,60]]}, bw6:{steam:[18,[36,48,60]]},
  mug1:{steam:[13,[26,37,48]]}, mug2:{steam:[13,[26,37,48]]}, mug3:{steam:[13,[28,39,50]]}, mug4:{steam:[15,[24,35,46]]}, mug5:{steam:[15,[28,39,50]]}, mug6:{steam:[13,[27,38,49]]},
  icelatte:{ ice:[[38,25],[56,23],[47,32],[64,31],[32,34],[54,40]] }, icematcha:{ ice:[[38,25],[56,23],[47,32],[64,31],[32,34],[54,40]] },
  strawmatcha:{ ice:[[38,19],[56,17],[47,26],[64,25],[32,28],[56,33]] },
  mocha:{ ice:[[36,51],[52,50],[66,52],[29,60],[71,60],[44,56]] }, glassmatcha:{ ice:[[36,51],[52,50],[66,52],[29,60],[71,60],[44,56]] },
  /* ice-free glass art (Phase 2): 5 cube slots at the liquid surface, s = cube scale, top = [cx, surfaceY, halfWidth], bot = pearl line */
  gl1:{ ice:glassIce(51,22,20,1), s:1, top:[51,21,22], bot:66 }, gl2:{ ice:glassIce(51,24,10,.8), s:.8, top:[51,23,12], bot:72 },
  gl3:{ ice:glassIce(50,18,17,.95), s:.95, top:[50,17,19], bot:70 }, gl4:{ ice:glassIce(48,19,13,.85), s:.85, top:[48,18,15], bot:74 },
  gl5:{ ice:glassIce(52,23,11,.8), s:.8, top:[52,22,13], bot:76 }, gl6:{ ice:glassIce(51,26,18,1), s:1, top:[51,25,21], bot:70 },
  honeysoda:{ ice:glassIce(51,26,19,1), s:1, top:[51,25,21], bot:68 },
  secret:{ steam:[13,[30,41,52]] }, decaf:{ steam:[14,[30,41,52]] },
  latte:{ steam:[22,[36,48,60]] }, pumpkin:{ steam:[22,[36,48,60]] }, xmascocoa:{ steam:[11,[38,50,62]] }, hotmatcha:{ steam:[22,[36,48,60]] }, cocoa:{ steam:[11,[38,50,62]] }, americano:{ steam:[15,[42,52,62]] },
};
function artFX(e){
  const im0=imgOf(e), fx = ART_FX[im0] || ART_FX[im0.split("-")[1]]; if (!fx) return '';
  let out='';
  if (tempOf(e)==='iced' && fx.ice){ const n=iceN(e), sc=fx.s||1;
    const rot=[-12,9,3,-16,14,-5];
    if (n) out += `<g filter="url(#wob)">${fx.ice.slice(0,n).map(([x,y],i)=>`<g class="cube" transform="translate(${x} ${y}) rotate(${rot[i]}) scale(${sc})" style="animation-delay:${i*.07}s"><rect x="-4.6" y="-4.6" width="9.2" height="9.2" rx="2.4" fill="rgba(255,255,255,.66)" stroke="#8A7262" stroke-width=".8" stroke-opacity=".8"/><rect x="-4.6" y="1.2" width="9.2" height="3.4" rx="1.6" fill="rgba(170,200,220,.28)"/><path d="M-2.8 -2.4 L-.4 -3.2" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></g>`).join('')}</g>`; }
  if (tempOf(e)==='hot' && fx.steam && !(e.topping && e.topping!=='none' && e.topping!=='boba')){ const [y,xs]=fx.steam;
    out += xs.map((x,i)=>{ const d=`M${x} ${y} q-4 -5 0 -10 q4 -5 0 -10`; return `<g class="steam" style="animation-delay:${i*.6}s"><path d="${d}" fill="none" stroke="#B49478" stroke-opacity=".45" stroke-width="3.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g>`; }).join(''); }
  out += toppingFX(e, fx) + sweetTag(e);
  return out ? `<svg class="artfx" viewBox="0 0 100 100" aria-hidden="true">${out}</svg>` : '';
}
/* toppings drawn on the real surface of the chosen vessel (so the cup shows what was actually made) */
function toppingFX(e, fx){
  const tp=e.topping; if (!tp || tp==='none') return '';
  let top = fx.top; if (!top && fx.steam){ const [y,xs]=fx.steam; top=[xs[1], y+7, (xs[2]-xs[0])*.75]; } if (!top) return '';
  const [cx,y,hw]=top, ink='#8A7262';
  if (tp==='whip') return `<g filter="url(#wob)">${[[-.55,1],[-.2,-1.5],[.2,-1.2],[.55,1],[0,-4.5]].map(([dx,dy],i)=>`<circle cx="${cx+dx*hw}" cy="${y+dy-2}" r="${hw*(i===4?.3:.36)}" fill="#FFFDF7" stroke="${ink}" stroke-width=".7"/>`).join('')}</g>`;
  if (tp==='cheese') return `<g filter="url(#wob)"><path d="M${cx-hw} ${y} q${hw*.5} -5 ${hw} -2 q${hw*.5} 3 ${hw} 0 l0 6 q-${hw} 4 -${hw*2} 0z" fill="#FFF3D6" stroke="${ink}" stroke-width=".7"/></g>`;
  if (tp==='dust') return `<g>${[...Array(14)].map((_,i)=>`<circle cx="${cx-hw*.8+((i*37)%17)/17*hw*1.6}" cy="${y-1+((i*13)%7)/7*3}" r=".9" fill="#7A5232" opacity=".7"/>`).join('')}</g>`;
  if (tp==='boba' && fx.bot) return `<g>${[...Array(9)].map((_,i)=>`<circle cx="${cx-hw*.75+(i%5)*hw*.38+(i>4?hw*.19:0)}" cy="${fx.bot-(i>4?4.2:0)}" r="2.6" fill="#4A3427" stroke="#2E2019" stroke-width=".5"/><circle cx="${cx-hw*.75+(i%5)*hw*.38+(i>4?hw*.19:0)-.8}" cy="${fx.bot-(i>4?4.2:0)-.9}" r=".7" fill="#fff" opacity=".6"/>`).join('')}</g>`;
  return '';
}
/* tiny paper tag: one sugar cube per sweetness step (0% = empty tag) */
function sweetTag(e){
  if (e.sweet==null) return ''; const n = ({0:0,25:1,50:2,100:3,120:4})[e.sweet] ?? 2;
  return `<g transform="translate(80 84)"><path d="M-9 -6 h18 v12 h-18z" fill="#FFFDF7" stroke="#8A7262" stroke-width=".7" transform="rotate(-6)"/>${[...Array(n)].map((_,i)=>`<rect x="${-7+i*3.7}" y="-2" width="3" height="3" rx=".6" fill="#FFF" stroke="#8A7262" stroke-width=".5" transform="rotate(-6)"/>`).join('')}</g>`;
}
const imgOf = e => { const va=vesselArt(e); if (va) return va; const m=M(e.drink), c=CUP_ART[e.cup]; if(!c) return m.img; return (m.k==='strawmatcha' && c.straw) || c[famOf(m)] || m.img; };
/* duck replies matching the mood */
const MOOD_REPLY = {
  happy:'ดีใจด้วยน้า~ วันสดใสแบบนี้ต้องฉลองด้วยแก้วโปรด',
  chill:'ชิลๆ ไปด้วยกันนะ จิบช้าๆ ไม่ต้องรีบ',
  love:'โอ๊ย หัวใจฟูไปหมด แก้วนี้ใส่ความหวานเพิ่มให้นะ ♡',
  excited:'ตื่นเต้นด้วยเลย! ขอให้วันนี้ปังๆ',
  tired:'วันนี้เหนื่อยแค่ไหน เล่าเท่าที่ไหวนะ พักจิบช้าๆ ก่อน เราอยู่ตรงนี้',
  busy:'ยุ่งแค่ไหนก็พักหายใจช้าๆ สักนิดนะ',
  calm:'ใจสงบดีจัง เก็บความรู้สึกนี้ไว้นานๆ นะ',
  sad:'มากอดกันก่อน วันนี้ไม่ต้องเก่งก็ได้นะ',
};
const replyFor = (e) => (MOOD_REPLY[e.mood] || 'แก้วนี้ชงด้วยใจเลยนะ ขอให้วันนี้เป็นวันที่ดี');
const THM = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const THD = ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'];

const STEP_TXT = {
  bean:  { t:'เลือกเมล็ดกาแฟ', h:'เลือกเมล็ดที่ชอบก่อนเริ่มชง', s:'เมล็ดนี้หอมมากเลย' },
  grind: { t:'บดเมล็ด', h:'เลือกความละเอียด แล้วกดค้างปุ่ม "บด" จนเต็ม', s:'เสียงบดนี่ฟังแล้วตื่นเลย' },
  tamp:  { t:'แทมป์ให้แน่น', h:'กดค้างเพื่อแทมป์ ปล่อยตรงไหนก็ได้ ถ้าอยู่ในโซนเขียวจะเรียบเนียนสุด', s:'กดเบาๆ แต่มั่นคงนะ' },
  shot:  { t:'ดึงช็อตเอสเปรสโซ่', h:'กดค้างให้กาแฟไหล แล้วปล่อยตอนเข็มอยู่ในโซนทอง', s:'ครีม่าสีคาราเมลสวยเลย' },
  milk:  { t:'เลือกนม & สตีม / เท', h:'เลือกนม แล้วกดค้าง ปล่อยในโซนที่ไฮไลต์จะได้นมพอดีที่สุด', s:'ฟังเสียงฟู่ๆ เบาๆ นะ' },
  art:   { t:'ลาเต้อาร์ต', h:'เลือกลาย แล้วกด "เทนม"', s:'ค่อยๆ เท ข้อมือนิ่งๆ' },
  syrup: { t:'ไซรัป / ซอส', h:'เติมความหวานนิดหน่อยไหม?', s:'หวานพอดีๆ กำลังน่ารัก' },
  sift:  { t:'ร่อนผง', h:'เลือกจำนวนช้อน แล้วแตะที่ตะแกรงให้ผงไม่เป็นก้อน', s:'ร่อนให้เนียนไม่มีก้อนนะ' },
  water: { t:'น้ำร้อนตามอุณหภูมิ', h:'ปรับอุณหภูมิ แล้วกด "เทน้ำ" (ช่วงที่แนะนำจะหอมที่สุด)', s:'ค่อยๆ เทนะ' },
  whisk: { t:'ตีด้วยฉะเซ็น', h:'วนนิ้วเป็นวงกลมในถ้วยด้านล่าง จนฟองนุ่ม', s:'วนๆ เบาๆ ฟองจะนุ่มขึ้นเรื่อยๆ' },
  milk2: { t:'เทนม', h:'เลือกนม แล้วกดค้างเพื่อเท ปล่อยในโซนทองจะพอดีแก้ว', s:'นมหอมมันกำลังดี' },
  soda:  { t:'เทโซดาน้ำผึ้ง', h:'กดค้างเพื่อเทโซดาลงบนน้ำผึ้ง ปล่อยในโซนทองจะซ่าพอดี', s:'ซ่าๆ หอมน้ำผึ้ง บั๊ซซ~' },
  ice:   { t:'ตักน้ำแข็ง', h:'แตะ "ตักน้ำแข็ง" ให้ครบตามที่สั่ง', s:'กริ๊งๆ เย็นชื่นใจ' },
  top:   { t:'ท็อปปิ้ง', h:'เพิ่มท็อปปิ้งให้แก้วนี้', s:'ท็อปปิ้งนี้ต้องโดน' },
  cup:   { t:'เลือกแก้ว', h:'เลือกแก้วที่ชอบสำหรับวันนี้', s:'แก้วนี้เข้ากับมู้ดเลย' },
  deco:  { t:'แต่งแก้ว', h:'ปลอกแก้ว + สติกเกอร์ (สูงสุด 3 ชิ้น)', s:'น่ารักขึ้นอีกเยอะ' },
  mood:  { t:'วันนี้ใจเป็นแก้วไหน?', h:'เลือกความรู้สึกวันนี้ เล่าเท่าที่ไหวนะ', s:'เล่าให้ฟังหน่อยสิ' },
};
const STEP_SHORT = {bean:'เมล็ด',grind:'บด',tamp:'แทมป์',shot:'ช็อต',milk:'สตีมนม',art:'อาร์ต',syrup:'ไซรัป',sift:'ร่อนผง',water:'น้ำร้อน',whisk:'ตีฟอง',milk2:'นม',soda:'โซดา',ice:'น้ำแข็ง',top:'ท็อปปิ้ง',cup:'แก้ว',deco:'แต่ง',mood:'มู้ด'};

/* ---------- storage ---------- */
/* all persistence goes through Platform.storage (localStorage on web). Data never leaves the device
   unless the user exports a backup file themselves. Schema: see HANDOFF.md §3. */
const SETTINGS_DEF = { reminder:null, reminderAsked:false, hemi:'auto', lastNudge:null, missShown:null, lang:'auto', reduceMotion:false, weatherOptIn:false, shareNote:false };
const obj = v => v && typeof v==='object' && !Array.isArray(v) ? v : {};
function migrate(d){
  d = d && typeof d==='object' && !Array.isArray(d) ? d : {};
  d.entries = d.entries && typeof d.entries==='object' ? d.entries : {};
  const from = d.v || 1;
  if (from < 2){
    Object.values(d.entries).forEach(e=>{ if (e && Array.isArray(e.stickers)) e.stickers = [...new Set(e.stickers.map(k=>k==='cat'?'bean':k))]; });
  }
  if (from < 3){
    /* v3: ice words -> exact cube counts; nothing else in old entries changes */
    Object.values(d.entries).forEach(e=>{ if (e && e.ice!=null && ICE_LEGACY[e.ice]!=null) e.ice = ICE_LEGACY[e.ice]; });
  }
  d.v = SCHEMA;
  d.guests = obj(d.guests);
  d.settings = Object.assign({}, SETTINGS_DEF, obj(d.settings));
  /* v3 additions (all optional, all earn-only): see HANDOFF.md §3 */
  d.beans = Math.max(0, Math.floor(+d.beans||0));          // spendable beans (earned only, never sold)
  d.beansEarned = Math.max(d.beans, Math.floor(+d.beansEarned||0));
  d.beanDay = obj(d.beanDay);                              // { k:'YYYY-MM-DD', mood:bool, extras:n }
  d.extras = Array.isArray(d.extras) ? d.extras.slice(-60) : [];   // extra cups (แก้วพิเศษ): never mood entries
  d.mystery = obj(d.mystery);                              // { 'YYYY-MM-DD': { h:'h07', by:'frog' } } served orders
  d.recipes = obj(d.recipes);                              // { 'r-latte': 'YYYY-MM-DD' }
  d.friends = obj(d.friends);                              // { frog: n } mystery orders served per regular
  d.decor = Object.assign({ owned:{}, place:{} }, obj(d.decor)); d.decor.owned=obj(d.decor.owned); d.decor.place=obj(d.decor.place);
  d.stories = Object.assign({ read:{} }, obj(d.stories)); d.stories.read=obj(d.stories.read);
  d.purchases = Object.assign({ owned:{}, tips:0 }, obj(d.purchases)); d.purchases.owned=obj(d.purchases.owned); d.purchases.tips=Math.max(0,+d.purchases.tips||0);
  return d;
}
function load(){
  const raw = P.storage.getJSON(KEY, null), fromV = raw ? (raw.v||1) : 0;
  /* one-time safety copy of the exact pre-migration data, per version step (v1 -> .bak-v1, v2 -> .bak-v2) */
  if (raw && fromV < SCHEMA && !P.storage.get(KEY+'.bak-v'+fromV)) P.storage.set(KEY+'.bak-v'+fromV, JSON.stringify(raw));
  const d = migrate(raw);
  if (fromV < SCHEMA) P.storage.setJSON(KEY, d);
  return d;
}
let db = load();
function save(){ P.storage.setJSON(KEY, db); }
const KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
function exportBackup(){
  P.file.saveJSON({ app:'cupmori', schema:SCHEMA, exportedAt:new Date().toISOString(), data:db }, `cupmori-backup-${todayKey()}.json`);
  toast('บันทึกไฟล์สำรองแล้ว เก็บไว้ในที่ปลอดภัยนะ',1);
}
/* validate + merge: unknown drinks / bad dates are skipped; same-day entries take the file's version */
function importBackup(file){ const obj = file;
  const src = obj && (obj.app==='cupmori' || obj.app==='moodcup') && obj.data ? obj.data : obj;   /* old Mood Cup backups still import */
  if (!src || typeof src!=='object' || typeof src.entries!=='object') throw new Error('ไฟล์นี้ไม่ใช่ไฟล์สำรองของ Cupmori');
  if ((src.v||1) > SCHEMA) throw new Error('ไฟล์สำรองมาจากเวอร์ชันใหม่กว่า กรุณาอัปเดตแอปก่อน');
  const inc = migrate(JSON.parse(JSON.stringify(src)));
  let n=0, skip=0;
  Object.entries(inc.entries).forEach(([k,e])=>{ if (KEY_RE.test(k) && e && MENU.some(m=>m.k===e.drink)){ db.entries[k]=e; n++; } else skip++; });
  Object.entries(inc.guests).forEach(([k,g])=>{ if (G(k) && !db.guests[k]) db.guests[k]=g; });
  /* v3 merge: union of discoveries/ownership, max of counters (nothing earned is ever lost by importing) */
  const RK=new Set(Content.RECIPES.map(r=>r.k)), DK=new Set(Content.DECOR.map(x=>x.k));
  Object.entries(inc.recipes).forEach(([k,v])=>{ if (RK.has(k) && !db.recipes[k]) db.recipes[k]=v; });
  Object.entries(inc.decor.owned).forEach(([k,v])=>{ if (DK.has(k) && !db.decor.owned[k]) db.decor.owned[k]=v; });
  Object.entries(inc.decor.place).forEach(([sl,k])=>{ if (db.decor.owned[k] && !db.decor.place[sl]) db.decor.place[sl]=k; });
  Object.entries(inc.stories.read).forEach(([k,v])=>{ if (!db.stories.read[k]) db.stories.read[k]=v; });
  Object.entries(inc.purchases.owned).forEach(([k,v])=>{ if (!db.purchases.owned[k]) db.purchases.owned[k]=v; });
  Object.entries(inc.mystery).forEach(([k,v])=>{ if (KEY_RE.test(k) && !db.mystery[k]) db.mystery[k]=v; });
  Object.entries(inc.friends).forEach(([k,v])=>{ db.friends[k]=Math.max(db.friends[k]||0, +v||0); });
  db.beans=Math.max(db.beans, inc.beans); db.beansEarned=Math.max(db.beansEarned, inc.beansEarned);
  db.purchases.tips=Math.max(db.purchases.tips, inc.purchases.tips);
  syncGuests(); save(); return { n, skip };
}
const pad = n => String(n).padStart(2,'0');
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayKey = () => keyOf(NOW());
const parseKey = k => { const [y,m,d] = k.split('-').map(Number); return new Date(y, m-1, d); };
const EN = () => I18N.lang==='en';
const thDate = d => EN() ? d.toLocaleDateString('en-GB',{ weekday:'short', day:'numeric', month:'long', year:'numeric' }) : `${THD[d.getDay()]} ${d.getDate()} ${THM[d.getMonth()]} ${d.getFullYear()+543}`;
const monthLabel = (m, y) => EN() ? `${new Date(y,m,1).toLocaleDateString('en-GB',{ month:'long' })} ${y}` : `${THM[m]} ${y+543}`;
const summaryTitle = (m, y) => EN() ? `${monthLabel(m,y)} in cups` : `สรุปเดือน${THM[m]} ${y+543}`;

/* ---------- progress: guests, streak, usual order, return greeting ---------- */
const realEntries = () => Object.entries(db.entries).filter(([,e])=>!e.demo);
const stampCount = () => realEntries().length;
/* unlock every guest whose threshold is reached; never re-lock. Returns newly unlocked guests. */
function syncGuests(){
  const n = stampCount(), out = [];
  STAMP_GUESTS.forEach(g=>{ if (n>=g.at && !db.guests[g.k]){ db.guests[g.k] = { on:todayKey(), at:g.at }; out.push(g); } });
  return out;
}
const unlockedGuests = () => GUESTS.filter(g=>db.guests[g.k]);
const nextGuest = () => STAMP_GUESTS.find(g=>!db.guests[g.k]);
/* deterministic daily visitor: ~1 in 3 days one unlocked guest drops by (never on the unlock day itself) */
function visitorFor(k){
  const fg = festGuest(parseKey(k)); if (fg) return fg;              /* festival guest visits every day of its festival */
  const L = unlockedGuests().filter(g=>!g.fest).filter(g=>db.guests[g.k].on!==k); if (!L.length) return null;
  let h=0; for (const c of k) h=(h*31+c.charCodeAt(0))>>>0;
  return h%3===0 ? L[(h>>>3)%L.length] : null;
}
function currentStreak(){ let cur=0; const d=NOW(); d.setHours(0,0,0,0); if(!db.entries[keyOf(d)] || db.entries[keyOf(d)].demo) d.setDate(d.getDate()-1); while (db.entries[keyOf(d)] && !db.entries[keyOf(d)].demo){ cur++; d.setDate(d.getDate()-1); } return cur; }
/* 'usual order': most frequent drink+options among the last 10 real cups (needs >= 2 repeats) */
const ORDER_KEYS = ['drink','temp','size','sweet','milk','ice','decaf'];
function usualOrder(){
  const last = realEntries().sort((a,b)=>a[0]<b[0]?1:-1).slice(0,10).map(([,e])=>e).filter(e=>{ const m=MENU.find(x=>x.k===e.drink); return m && menuNow().includes(m); });
  const c={}; last.forEach(e=>{ const o={drink:e.drink, temp:tempOf(e), size:e.size||'M', sweet:e.sweet??50, milk:e.milk||'fresh', ice:tempOf(e)==='iced'?String(iceN(e)):'3', decaf:e.decaf?1:0}; const k=JSON.stringify(o); c[k]=(c[k]||0)+1; });
  const top = Object.entries(c).sort((a,b)=>b[1]-a[1])[0];
  return top && top[1]>=2 ? JSON.parse(top[0]) : null;
}
const orderLine = o => { const m=M(o.drink); return [m.th, tempOf(o)==='iced'?'เย็น':'ร้อน', o.size, (SWEETS.find(x=>x.k===o.sweet)||{}).th, o.decaf?'ดีแคฟ':''].filter(Boolean).join(' · '); };
/* 'คิดถึงนะ': shown once when the user comes back after 3+ days away. Nothing is lost while away. */
function missGap(){
  const tk=todayKey(); if (db.entries[tk]) return 0;
  const ks = realEntries().map(([k])=>k).filter(k=>k<tk).sort(); if (!ks.length) return 0;
  return Math.round((parseKey(tk)-parseKey(ks[ks.length-1]))/864e5);
}
/* real time-of-day lighting; 'closing soon' from 22:00 until 05:00 */
function timeOfDay(d=NOW()){ const h=d.getHours(); return h>=5&&h<11?'morning':h<17&&h>=11?'day':h>=17&&h<20?'evening':'night'; }
const closingSoon = (d=NOW()) => { const h=d.getHours(); return h>=22 || h<5; };
function applyLighting(){ const ph=$('#phone'); if(!ph) return; ['morning','day','evening','night'].forEach(t=>ph.classList.toggle('tod-'+t, timeOfDay()===t)); ph.classList.toggle('closing', closingSoon()); }
const hemiNow = () => Festivals.hemisphere({ override:ENV.hemiOverride(), setting:db.settings.hemi, timeZone:ENV.timeZone(), region:ENV.region() });

/* ======================= Phase 2: cozy mechanics (Cupmori) =======================
   All small, all offline, nothing can be failed or lost. Data lives in db (schema v3). */
const C = window.Content;
const festGuest = (d=NOW()) => { const f = Festivals.active(d).find(f=>f.guest && G(f.guest)); return f ? G(f.guest) : null; };
/* weather: real only if the user opted in (Platform.weather); otherwise a gentle guess from season + timezone */
function weatherNow(){
  const real = db.settings.weatherOptIn ? P.weather.cached() : null; if (real) return real;
  const o = ENV.weather(); if (o) return o;
  const d = NOW(), se = Festivals.season(d, hemiNow().hemi).season, tz = ENV.timeZone()||'', mo = d.getMonth()+1;
  const monsoon = /^(Asia\/(Bangkok|Ho_Chi_Minh|Saigon|Yangon|Rangoon|Phnom_Penh|Vientiane|Kolkata|Calcutta|Dhaka|Manila|Kuala_Lumpur|Singapore|Jakarta))$/.test(tz);
  if (monsoon) return mo>=5 && mo<=10 ? 'rain' : 'sun';
  return se==='summer' ? 'sun' : se==='spring' ? 'sun' : 'cloud';
}
const WX = { sun:{th:'แดดใส',i:'☀'}, rain:{th:'ฝนพรำ',i:'☂'}, cloud:{th:'เมฆครึ้ม',i:'☁'} };
function ctxNow(){ const d=NOW(); return { tod:timeOfDay(d), season:Festivals.season(d, hemiNow().hemi).season, fest:Festivals.active(d).map(f=>f.k), weather:weatherNow() }; }
/* one matcher for mystery orders and recipes. Missing keys = don't care. */
function matchWant(w, d, cx={}){
  if (!w) return true; const m=M(d.drink), t=tempOf(d), n=t==='iced'?iceN(d):0;
  if (w.any && !w.any.some(x=>matchWant(x,d,cx))) return false;
  if (w.temp && t!==w.temp) return false;
  if (w.cat && m.cat!==w.cat) return false;
  if (w.notCat && m.cat===w.notCat) return false;
  if (w.drinks && !w.drinks.includes(m.k)) return false;
  if (w.sweetMax!=null && (d.sweet??50)>w.sweetMax) return false;
  if (w.sweetMin!=null && (d.sweet??50)<w.sweetMin) return false;
  if (w.milk!=null && !!m.milk!==w.milk) return false;
  if (w.milkType && !(m.milk && (d.milk||'fresh')===w.milkType)) return false;
  if (w.iceMin!=null && (t!=='iced' || n<w.iceMin)) return false;
  if (w.iceMax!=null && (t!=='iced' || n>w.iceMax)) return false;
  if (w.topping && (isCoffee(m) || d.topping!==w.topping)) return false;
  if (w.syrup && (!isCoffee(m) || d.syrup!==w.syrup)) return false;
  if (w.size && d.size!==w.size) return false;
  if (w.shotsMin && (!isCoffee(m) || (d.shots||0)<w.shotsMin)) return false;
  if (w.decaf && !(isCoffee(m) && d.decaf)) return false;
  if (w.art && !(m.art && t==='hot' && d.art && d.art!=='none')) return false;
  if (w.tod && cx.tod!==w.tod) return false;
  if (w.season && cx.season!==w.season) return false;
  if (w.weather && cx.weather!==w.weather) return false;
  if (w.fest && !w.fest.some(f=>(cx.fest||[]).includes(f))) return false;
  if (w.anyFest && !(cx.fest||[]).length) return false;
  return true;
}
const hashStr = s => { let h=2166136261; for (const c of s){ h^=c.charCodeAt(0); h=Math.imul(h,16777619)>>>0; } return h>>>0; };
/* daily mystery order: deterministic per local date (+ seed). A missed day simply rolls over to a new order. */
const MYSTERY_SEED = 'cupmori-mystery-v1';
function mysteryFor(k){
  const d=parseKey(k), fg=festGuest(d), h=hashStr(k+MYSTERY_SEED);
  const pool = fg && C.FEST_HINTS[fg.fest] ? C.FEST_HINTS[fg.fest] : C.HINTS;
  let i = h % pool.length;
  if (pool===C.HINTS){ const y=new Date(d); y.setDate(y.getDate()-1); if (i === hashStr(keyOf(y)+MYSTERY_SEED) % pool.length) i=(i+1)%pool.length; }
  const regs = unlockedGuests().filter(g=>!g.fest).map(g=>g.k);
  const by = fg ? fg.k : regs.length ? regs[(h>>>5) % regs.length] : 'pe';
  return { k, hint:pool[i], by, done:db.mystery[k] || null };
}
const mysteryToday = () => mysteryFor(todayKey());
const whoName = k => G(k) ? G(k).th : B(k).th;
const whoImg = k => G(k) ? `${IMG}g-${k}.webp` : bImg(k);
/* recipe book */
const recipeMatches = (d, cx) => C.RECIPES.filter(r=>matchWant(r.need, d, cx));
function discover(d){ const cx=ctxNow(), tk=todayKey(); const fresh=recipeMatches(d,cx).filter(r=>!db.recipes[r.k]); fresh.forEach(r=>db.recipes[r.k]=tk); return fresh; }
const recipePct = () => Math.round(Object.keys(db.recipes).filter(k=>C.RECIPES.some(r=>r.k===k)).length / C.RECIPES.length * 100);
/* beans: earned only. day bookkeeping resets per local day */
function beanDay(){ const tk=todayKey(); if (db.beanDay.k!==tk) db.beanDay={ k:tk, mood:false, extras:0 }; return db.beanDay; }
function earn(n){ n=Math.max(0,Math.floor(n)); db.beans+=n; db.beansEarned+=n; return n; }
const beanIcon = (sz=16) => `<svg class="beanic" width="${sz}" height="${sz}" viewBox="0 0 20 20" aria-hidden="true"><ellipse cx="10" cy="10" rx="6.6" ry="8.6" transform="rotate(28 10 10)" fill="#8A5A3B" stroke="#49342B" stroke-width="1.3"/><path d="M7.2 4.6 C11 8 9 12 12.8 15.4" fill="none" stroke="#F3D9B5" stroke-width="1.4" stroke-linecap="round"/></svg>`;
/* stories: friendship = visits on stamp days + mystery orders served (TOTALS only; never consecutive days) */
function friendship(k){ let n=db.friends[k]||0; realEntries().forEach(([,e])=>{ if (e.guest===k) n++; }); return n; }
function storyOpen(k, i){
  const st=C.STORIES[k]; if (!st) return false; const ep=st.eps[i]; if (!ep) return false;
  if (k==='pe') return stampCount()>=1;
  if (!db.guests[k]) return false;
  return friendship(k) >= ep.at;
}
const storyKey = (k,i) => `${k}:${i}`;
function unreadStories(){ const out=[]; Object.keys(C.STORIES).forEach(k=>C.STORIES[k].eps.forEach((_,i)=>{ if (storyOpen(k,i) && !db.stories.read[storyKey(k,i)]) out.push([k,i]); })); return out; }
/* decor: beans only, kept apart from paid cosmetics */
const DEC = k => C.DECOR.find(x=>x.k===k);
const tierOpen = t => t===1 || C.DECOR.filter(x=>x.tier===t-1 && db.decor.owned[x.k]).length >= 2;
/* paid cosmetics (Apple IAP via Platform.purchases); owned ids live in db.purchases.owned */
const owns = id => !!db.purchases.owned[id];
const PAID_STK = ['moon','cloud','note'];   /* 'cupmori.stickers.doodle' */
const stkList = () => owns('cupmori.stickers.doodle') ? STK.concat(PAID_STK) : STK;
/* craft stars for the EXTRA cup only (mood cups are never scored) */
function craftStars(){ const q=Object.values(S.q||{}); if (!q.length) return 3; const r=q.filter(v=>v==='perfect').length/q.length; return r>=.99?3:r>=.5?2:1; }

/* ---------- reminder (Platform.notify; in-app fallback banner) ---------- */
function applyReminder(){
  const t=db.settings.reminder;
  if (!t){ P.notify.cancel(); return; }
  P.notify.scheduleDaily(t, { title:'Cupmori ☕', body:I18N.t('วันนี้ใจเป็นแก้วไหน? แวะมาชงสักแก้วเมื่อพร้อมนะ'), shouldFire:()=>!db.entries[todayKey()] });
}
function reminderDue(){
  const t=db.settings.reminder, tk=todayKey(); if (!t || db.entries[tk] || db.settings.lastNudge===tk) return false;
  const [h,m]=t.split(':').map(Number), n=NOW(); return n.getHours()*60+n.getMinutes() >= h*60+m;
}
async function setReminder(t){
  db.settings.reminderAsked = true; db.settings.reminder = t || null; save();
  if (t){ const perm = await P.notify.requestPermission(); applyReminder();
    toast(perm==='granted' ? `ตั้งเตือนทุกวัน ${t} น. แล้ว` : `ตั้งเตือน ${t} น. แล้ว (จะเตือนในแอปตอนเปิด เพราะเครื่องนี้ไม่อนุญาตแจ้งเตือน)`,1);
  } else { applyReminder(); toast('ปิดการเตือนแล้ว',1); }
}
function reminderForm(t){ return `<div class="remform"><input type="time" id="remTime" value="${esc(t||'20:00')}" aria-label="เวลาเตือน"><button class="btn sm" data-act="rem-save">ตั้งเตือน</button><button class="btn sm soft hd" data-act="rem-off">${t?'ปิดการเตือน':'ไม่ต้องเตือน'}</button></div>`; }

/* ---------- state ---------- */
const S = { view:'home', calY:NOW().getFullYear(), calM:NOW().getMonth(), barista:null, draft:null, steps:[], si:0, cat:'coffee', edit:false };

/* ---------- helpers ---------- */
const ask = q => confirm(I18N.t(q));
const esc = s => String(s??'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars = arr => arr.map(([x,y,s,d])=>`<span class="star" style="left:${x}px;top:${y}px;font-size:${s||14}px;animation-delay:${d||0}s">★</span>`).join('');
function toast(t, ok){ if(!ok) SFX.play('oops',{vol:.22}); const el=$('#toast'); el.textContent=I18N.t(t); el.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>el.classList.remove('show'),2200); }
function bImg(k){ return `${IMG}b-${k}.webp`; }
function say(step){ const b=B(S.barista); const x=STEP_TXT[step]; return (x?x.s:b.greet) + b.tail; }
function stampHTML(e, o={}){
  const m = M(e.drink), sl = (SLEEVES.find(s=>s.k===e.sleeve)||SLEEVES[0]).c;
  return `<div class="stamp" style="--d:${TINT[imgOf(e)]};${sl?`--sl:${sl}`:''}">${sl?'<i class="ring"></i>':''}<img src="${IMG}d-${imgOf(e)}.webp" alt="${esc(m.th)}" style="transform:scale(${(SIZES.find(z=>z.k===e.size)||SIZES[2]).sc})">${(()=>{ const f=artFX(e); return f?f.replace('class="artfx"',`class="artfx" style="transform:scale(${(SIZES.find(z=>z.k===e.size)||SIZES[2]).sc})"`):''; })()}${(e.stickers||[]).map((k,i)=>`<span class="stk" style="left:${STK_POS[i][0]}%;top:${STK_POS[i][1]}%">${miniSticker(k)}</span>`).join('')}${o.face!==false && e.barista ? `<span class="bface"><img src="${bImg(e.barista)}" alt=""></span>`:''}</div>`;
}
function setTab(go){ document.querySelectorAll('#tabbar button').forEach(b=>b.classList.toggle('on', b.dataset.go===go)); }
function showTab(on){ $('#tabbar').classList.toggle('hide', !on); $('#tabfade').classList.toggle('hide', !on); app.classList.toggle('noTab', !on); }

/* counter scene: image + barista + counter-front layer (keeps barista behind the counter) */
const COUNTER = { ar:'612/819', duck:{l:44,t:39,w:39}, front:74.5, board:{l:42.5,t:13.2,w:54.5,h:25} };
const COUNTER_ART = ['pe','berry','moss','momo','bobby'];
function counterScene(b, extra='', o={}){
  const g = o.guest, src = g ? `scene-${g.k}` : `counter-${COUNTER_ART.includes(b.k)?b.k:'pe'}`;
  const alt = g ? `${g.th} มาเยี่ยมร้าน Cupmori` : `หน้าร้าน Cupmori กับบาริสต้า${b.th}`;
  const sign = o.sign && closingSoon() ? `<div class="closesign"><img src="${IMG}sign-closing.webp" alt=""><b>ใกล้ปิดร้าน</b></div>` : '';
  return `<div class="cs" style="aspect-ratio:${COUNTER.ar}"><img class="bg" src="${IMG}${src}.webp" alt="${esc(alt)}"><i class="tod" aria-hidden="true"></i>${sign}${extra}</div>`;
}
/* ---------- views ---------- */
function render(){
  const v = S.view;
  const tabbed = ['home','recipes','room'].includes(v); showTab(tabbed); setTab(tabbed?v:'start'); applyLighting(); applyMotion();
  if (v==='home'){ metFestGuest(); app.innerHTML = homeView(); }
  if (v==='recipes') app.innerHTML = recipesView();
  if (v==='room') app.innerHTML = roomView();
  if (v==='xdone') app.innerHTML = xdoneView();
  if (v==='cafe') app.innerHTML = cafeView();
  if (v==='brew') app.innerHTML = brewView();
  if (v==='done') app.innerHTML = doneView();
  app.firstElementChild && app.firstElementChild.classList.add('view');
  I18N.apply(app);
  if (v==='brew') bindStep();
}
function go(v){ S.view=v; app.scrollTop=0; render(); }

function homeView(){
  const tk = todayKey(), te = db.entries[tk], now = NOW();
  const hero = te ? `
    <div class="hero hd"><div class="hero-body"><div class="today">
      <div class="stampbig">${stampHTML(te)}</div>
      <div style="flex:1"><div class="sub">แก้ววันนี้ · ${thDate(now)}</div><div class="H" style="font-size:24px;margin:2px 0">${esc(M(te.drink).th)}</div>
      <div style="font-size:13px">บาริสต้าวันนี้: <b>${esc(B(te.barista).th)}</b> · มู้ด ${esc((MOODS.find(x=>x.k===te.mood)||{}).th||'-')}</div>
      <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-act="detail" data-k="${tk}">ดูแสตมป์</button><button class="btn sm soft hd" data-act="edit">แก้ไข</button></div></div>
    </div></div></div>` : `
    <div class="hero hd"><div class="hero-img">${counterScene(B('pe'),'',{sign:1})}${stars([[24,30,14],[330,40,12,.6]])}</div>
      <div class="hero-body"><div class="sub">${thDate(now)}</div><div class="H" style="margin:2px 0 4px">วันนี้ใจเป็นแก้วไหน?</div>
      <p style="line-height:1.6">${stampCount()?'เข้าร้าน เจอน้องเป็ดบาริสต้า แล้วชงแก้วของวันนี้เองทีละขั้น เก็บไว้เป็นแสตมป์ประจำวัน':'แก้วแรกของคุณ เริ่มได้เมื่อพร้อม'}</p>
      <button class="btn wide" style="margin-top:12px" data-go="start">เข้าร้าน ชงแก้ววันนี้ ☕</button></div></div>`;
  return `<div>
  <div class="top">${brandMark()}<button class="pill beans hd thin" data-go="room" aria-label="เมล็ดกาแฟ ${db.beans} เมล็ด · ไปแต่งร้าน">${beanIcon(18)}<b>${db.beans}</b></button></div>
  ${banners()}
  ${hero}
  ${mysteryCard()}
  ${guestProgress()}
  ${calendarHTML()}
  <div class="homeacts"><button class="btn sm yel" data-go="summary">สรุปเดือนนี้ ◔</button><button class="btn sm soft hd" data-act="extra">ชงแก้วพิเศษ ✦</button><button class="btn sm soft hd" data-act="demo">เติมข้อมูลตัวอย่าง</button><button class="btn sm soft hd" data-act="settings">ตั้งค่า & สำรองข้อมูล ⚙</button><button class="btn sm soft hd" data-act="about">เกี่ยวกับ & เครดิต</button></div>
  <div class="footnote">ข้อมูลเก็บในเครื่องนี้เท่านั้น · <a href="privacy.html">นโยบายความเป็นส่วนตัว</a> · <button data-act="reset">ล้างข้อมูล</button></div>
  </div>`;
}

function banners(){
  let h=''; const gap=missGap(), tk=todayKey();
  if (gap>=3 && db.settings.missShown!==tk){ const b=B(db.lastBarista||'pe');
    h += `<div class="banner miss hd thin"><img src="${bImg(b.k)}" alt=""><div><b>คิดถึงนะ</b> ดีใจที่ได้เจอกันอีกนะ<br><span class="sub">แสตมป์ แขก เมล็ดกาแฟ และของที่ได้มายังอยู่ครบ ไม่มีอะไรหายเลย ☕</span></div><button class="bx" data-act="miss-ok" aria-label="ปิด">✕</button></div>`; }
  const ur=unreadStories(); if (ur.length){ const [k,i]=ur[0];
    h += `<button class="banner letterb hd thin" data-act="story" data-k="${k}:${i}"><img src="${whoImg(k)}" alt=""><div><b>✉ จดหมายจาก${esc(whoName(k))}</b>${ur.length>1?` · และอีก ${ur.length-1} ฉบับ`:''}<br><span class="sub">"${esc(C.STORIES[k].eps[i].t)}" · แตะเพื่ออ่าน</span></div></button>`; }
  if ((S.bootGuests||[]).length) h += `<div class="banner unlockb hd thin"><img src="${IMG}g-${S.bootGuests[S.bootGuests.length-1].k}.webp" alt=""><div><b>แขกปลดล็อกแล้ว ${S.bootGuests.length} ตัว! ✦</b><br><span class="sub">${S.bootGuests.map(g=>esc(g.th)).join(' · ')} · ดูได้ที่ "สะสม"</span></div><button class="bx" data-act="bootg-ok" aria-label="ปิด">✕</button></div>`;
  if (reminderDue()) h += `<div class="banner nudge hd thin"><span class="big">⏰</span><div><b>ถึงเวลาแก้ววันนี้แล้ว</b><br><span class="sub">แวะมาชงสักแก้วไหม? ใช้เวลาแป๊บเดียว</span></div><button class="btn sm" data-go="start">ไปชง</button><button class="bx" data-act="nudge-ok" aria-label="ปิด">✕</button></div>`;
  return h;
}
function guestProgress(){
  const n=stampCount(), nx=nextGuest(), L=unlockedGuests();
  return `<div class="gprog hd thin"><div class="gfaces">${GUESTS.filter(g=>!g.fest||db.guests[g.k]).map(g=>`<img src="${IMG}g-${g.k}.webp" alt="${db.guests[g.k]?esc(g.th):'ยังไม่ปลดล็อก'}" class="${db.guests[g.k]?'':'lock'}">`).join('')}</div>
    <div class="sub" style="font-size:12.5px">${nx?`สะสมแล้ว ${n} แสตมป์ · อีก ${nx.at-n} แสตมป์ แขกคนใหม่จะมาเยี่ยมร้าน`:`แขกครบทั้ง ${L.length} ตัวแล้ว! แวะมาเยี่ยมร้านเรื่อยๆ นะ ✦`}</div></div>`;
}
function monthEntries(y,m){ return Object.entries(db.entries).filter(([k])=>{ const d=parseKey(k); return d.getFullYear()===y && d.getMonth()===m; }); }
function calendarHTML(){
  const y=S.calY, m=S.calM, first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate(), tk=todayKey(), now=NOW();
  const ents = monthEntries(y,m);
  const cnt = {coffee:0,matcha:0,other:0}; ents.forEach(([,e])=>cnt[M(e.drink).cat]++);
  const tot = ents.length || 1;
  let cells = THD.map(d=>`<div class="dw">${d.replace('.','')}</div>`).join('');
  for (let i=0;i<first;i++) cells += '<div></div>';
  for (let d=1; d<=days; d++){
    const k = `${y}-${pad(m+1)}-${pad(d)}`, e = db.entries[k], fut = new Date(y,m,d) > now;
    if (e) cells += `<button class="day f ${k===tk?'t':''}" style="--d:${TINT[imgOf(e)]};animation-delay:${(d%10)*.03}s" data-act="detail" data-k="${k}" aria-label="${d} ${esc(M(e.drink).th)}"><span class="n">${d}</span><img src="${IMG}d-${imgOf(e)}.webp" alt=""></button>`;
    else cells += `<div class="day e ${fut?'fut':''} ${k===tk?'t':''}" ${k===tk?'data-go="start" role="button"':''}>${d}</div>`;
  }
  return `<div class="calcard hd">
    <div class="calhead"><div><div class="H" style="font-size:24px">สมุดแสตมป์ก๊าบ</div><div style="font:600 14px var(--fb)">${monthLabel(m,y)} · สะสมแล้ว ${ents.length} แก้ว</div></div>
    <div class="calnav"><button class="chip hd" data-act="mprev" aria-label="เดือนก่อน">‹</button><button class="chip hd" data-act="mnext" aria-label="เดือนถัดไป">›</button></div></div>
    <div class="cal">${cells}</div>
    ${ents.length ? `<div style="display:flex;justify-content:space-between;font:600 14px var(--fb);margin-top:14px"><span>สัดส่วนเดือนนี้</span><span>กาแฟ ${Math.round(cnt.coffee/tot*100)}% · มัทฉะ ${Math.round(cnt.matcha/tot*100)}% · อื่นๆ ${Math.round(cnt.other/tot*100)}%</span></div>
    <div class="mix hd thin">${['coffee','matcha','other'].map(c=>`<i style="width:${cnt[c]/tot*100}%;background:${CAT[c].c}"></i>`).join('')}</div>` : `<div class="empty-hint" style="margin-top:12px">${stampCount()?'เดือนนี้ยังว่างอยู่ แก้วแรกของเดือน เริ่มได้เมื่อพร้อม':'แก้วแรกของคุณ เริ่มได้เมื่อพร้อม'}</div>`}
  </div>`;
}

/* ----- cafe / menu board ----- */
function enterCafe(extra){
  S.extra = !!extra; if (S.extra) S.edit = false;
  S.edit = !!db.entries[todayKey()] && S.edit;
  if (!S.edit){
    const last = db.lastBarista; let pick='pe';
    const pool = LIVE;
    if (RANDOM_BARISTA && pool.length>1) do { pick = pool[Math.floor(Math.random()*pool.length)].k; } while (pick===last);
    S.barista = pick; db.lastBarista = pick; save();
  }
  S.visitor = S.extra ? (G(mysteryToday().by) || null) : S.edit ? (db.entries[todayKey()].guest ? G(db.entries[todayKey()].guest) : null) : visitorFor(todayKey());
  metFestGuest();
  S.draft = Object.assign({ drink:'latte' }, OPT_DEF, S.draft||{});
  if (!menuNow().some(m=>m.k===S.draft.drink)) S.draft.drink='latte';
  S.cat = M(S.draft.drink).cat;
  go('cafe');
}
function cafeView(){
  const b = B(S.barista), sel = S.draft.drink, list = menuNow().filter(m=>m.cat===S.cat), cur = M(sel);
  const col = (cat, title) => `<div><h4>${title}</h4>${menuNow().filter(m=>cat.includes(m.cat)).map(m=>`<div class="r ${m.k===sel?'on':''}" data-act="pick" data-k="${m.k}"><span>${m.th.replace('สตรอว์เบอร์รีมัทฉะ','สตอฯ มัทฉะ')}</span><span>${m.p}</span></div>`).join('')}</div>`;
 const v = S.visitor, uo = !S.edit && !S.extra && usualOrder(), late = closingSoon(), my = S.extra && mysteryToday();
  const greet = my ? `<b>${esc(whoName(my.by))}</b> · ออเดอร์ลึกลับ<br>"${esc(my.hint.th)}"${my.done?'<br><span class="sub" style="font-size:12px">✓ วันนี้เสิร์ฟแล้ว ชงเล่นต่อได้เลย</span>':''}` : v ? `<b>${esc(v.th)}</b> · ${v.helper?'มาช่วยชงวันนี้':'แวะมาเยี่ยมร้าน'}<br>${esc(v.line)}<br><span class="sub" style="font-size:11.5px">บาริสต้าวันนี้: ${esc(b.th)}</span>` : `<b>${esc(b.th)}</b> · บาริสต้าวันนี้<br>${esc(late?'ดึกแล้ว ขอบคุณที่แวะมานะ ใกล้ปิดร้านแล้วแต่ยังชงให้ได้':b.greet)}`;
  return `<div>
  <div class="board-wrap">${counterScene(b, `<div class="chalk" style="left:${COUNTER.board.l}%;top:${COUNTER.board.t}%;width:300px;transform-origin:0 0;transform:scale(var(--bs,.7))"><div class="t">~ เมนูวันนี้ ~</div><div class="cols">${col(['coffee'],'COFFEE')}${col(['matcha','other'],'MATCHA & TEA')}</div></div>`, { guest:v, sign:1 })}
    <div class="bubble" style="left:12px;top:46%;max-width:46%">${greet}</div>
    <button class="chip hd" style="position:absolute;left:12px;top:14px;z-index:7;min-height:36px;background:#FFFDF7" data-act="home">✕ ออก</button>
  </div>
  <div class="menu-sheet">
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="H" style="font-size:24px">${S.extra?'แก้วพิเศษ ✦':S.edit?'แก้ไขแก้ววันนี้':'วันนี้ใจเป็นแก้วไหน?'}</div><div class="sub" style="font-size:12px">${esc(b.th)} · ${esc(b.prop)}</div></div>
    ${S.extra?`<div class="xnote hd thin">แก้วพิเศษไว้ลองสูตรและชงตามออเดอร์ลึกลับ ไม่บันทึกเป็นมู้ด · ได้ดาวฝีมือและเมล็ดกาแฟ</div>`:''}
    ${uo?`<button class="usual hd thin" data-act="usual"><img src="${IMG}d-${M(uo.drink).img}.webp" alt=""><span><b>เหมือนเดิมไหม?</b><br>${esc(orderLine(uo))}</span><i>→</i></button>`:''}
    ${late?`<div class="latehint hd thin"><img src="${IMG}d-decaf.webp" alt=""><span>ดึกแล้ว ถ้าอยากเลี่ยงคาเฟอีน ลองแบบ <b>ดีแคฟ</b> หรือโกโก้ดูไหม?</span>${isCoffee(cur)?`<button class="chip hd ${S.draft.decaf?'on':''}" data-act="opt-decaf" data-k="${S.draft.decaf?0:1}">${S.draft.decaf?'ดีแคฟแล้ว ✓':'เปลี่ยนเป็นดีแคฟ'}</button>`:''}</div>`:''}
    <div class="tabs">${Object.entries(CAT).map(([k,c])=>`<button class="hd ${S.cat===k?'on':''}" data-act="cat" data-k="${k}">${k==='matcha'?'มัทฉะ':k==='other'?'ชา & อื่นๆ':'กาแฟ'}</button>`).join('')}</div>
    <div class="items">${list.map(m=>`<button class="it hd ${m.k===sel?'on':''}" data-act="pick" data-k="${m.k}">${badgeIcon(m)?'<i class="seasonbadge">'+badgeIcon(m)+'</i>':''}<img src="${IMG}d-${m.img}.webp" alt=""><span>${m.th}</span><small>฿${m.p}</small></button>`).join('')}</div>
    <div class="desc hd thin">${cur.badge?`<div class="seasontag">${cur.badge}</div>`:''}<b>${cur.th}</b> — ${cur.desc}</div>
    ${optionsHTML()}
    <div class="sub" style="font-size:12px;margin-top:10px">ทำเองทีละขั้น ${buildSteps(cur,S.draft).length} สเต็ป: ${buildSteps(cur,S.draft).map(s=>STEP_SHORT[s]).join(' → ')}</div>
    <div class="sticky-foot" style="padding-left:0;padding-right:0"><button class="btn wide" data-act="startbrew">${S.extra?'ชงแก้วพิเศษ':'สั่ง'} ${cur.th} ${tempOf(S.draft)==='iced'?'เย็น':'ร้อน'}${S.draft.decaf&&isCoffee(cur)?' ดีแคฟ':''} · ฿${priceOf(S.draft)} →</button></div>
  </div></div>`;
}

function optionsHTML(){
  const d=S.draft, m=M(d.drink), t=tempOf(d);
  return `<div class="opts hd thin" id="opts"><div class="H" style="font-size:19px">ปรับแก้วของคุณ</div>
    <div class="lbl">ร้อน หรือ เย็น</div>${m.temp?`<div class="sub" style="font-size:13px">เมนูนี้เสิร์ฟแบบ${m.temp==='iced'?'เย็นเท่านั้น 🧊':'ร้อนเท่านั้น ☕'}</div>`:chips(TEMPS,t,'opt-temp')}
    ${t==='iced'?`<div class="lbl">น้ำแข็ง (ก้อน)</div>${chips(ICES,String(iceN(d)),'opt-ice')}`:''}
    ${isCoffee(m)?`<div class="lbl">กาแฟ</div>${chips(DECAFS,d.decaf?1:0,'opt-decaf')}`:''}
    <div class="lbl">ขนาดแก้ว</div>${chips(SIZES.map(z=>({k:z.k,th:`${z.th}${z.add?` +${z.add}`:''}`})),d.size,'opt-size')}
    <div class="lbl">ระดับความหวาน</div>${chips(SWEETS,d.sweet,'opt-sweet')}
    ${m.milk?`<div class="lbl">ชนิดนม</div>${chips(MILKS.map(x=>({k:x.k,th:x.th+(x.k!=='fresh'?' +15':'')})),d.milk,'opt-milk')}`:''}
  </div>`;
}
/* ----- brew ----- */
function buildSteps(m, d={}){
  const iced = (m.temp||d.temp)==='iced', ice = iced && iceN(d)>0 ? ['ice'] : [], x = S.extra;
  const tail = x ? ['cup'] : ['cup','deco','mood'];      /* extra cup (แก้วพิเศษ): no mood, never logged as a mood */
  if (m.soda) return ['soda', ...ice, 'top', ...tail];
  if (isCoffee(m)) return ['bean','grind','tamp','shot', ...(m.milk?['milk']:[]), ...(m.art&&!iced?['art']:[]), ...ice, 'syrup', ...tail];
  return ['sift','water','whisk', ...(m.milk?['milk2']:[]), ...ice, 'top', ...tail];
}
function startBrew(){
  const m = M(S.draft.drink), prev = S.edit ? db.entries[todayKey()] : null, o = S.draft;
  const opts = { temp:m.temp||o.temp||'hot', ice:String(iceN(o)), size:o.size||'M', sweet:o.sweet??50, milk:o.milk||'fresh', decaf:isCoffee(m)&&o.decaf?1:0, guest:S.visitor?S.visitor.k:undefined };
  const base = { drink:m.k, barista:S.barista, temp:m.temp||'hot', bean:'medium', grind:'fine', shots:2, milk:'fresh', art:'heart', syrup:'none', scoops:2, water:Math.round(((m.wt||[80,80])[0]+(m.wt||[80,80])[1])/2)-6, topping:'none', cup:m.temp==='iced'?'tumbler':'mug', sleeve:'none', stickers:[], mood:'', note:'' };
  S.draft = Object.assign(base, prev && prev.drink===m.k ? prev : {}, opts, { drink:m.k, barista:S.barista });
  fixCup(S.draft);
  S.draft.price = priceOf(S.draft);
  S.prog = {}; S.q = {};
  if (S.extra){ delete S.draft.guest; S.draft.stickers=[]; S.draft.sleeve='none'; }
  S.steps = buildSteps(m, S.draft); S.si = 0; S.icen = 0; S.wv = 0; S.tf = 0; go('brew');
}
const done = st => !!S.prog[st];
function stepReady(st){
  const d=S.draft;
  if (['grind','tamp','shot','sift','water','whisk'].includes(st)) return done(st);
  if (st==='milk' || st==='milk2') return done('milk');
  if (st==='soda') return done('soda');
  if (st==='art') return d.art==='none' || done('art');
  if (st==='mood') return !!d.mood;
  if (st==='ice') return done('ice');
  return true;
}
function brewView(){
  const m = M(S.draft.drink), st = S.steps[S.si], b = B(S.barista), x = STEP_TXT[st];
  const coffeeBg = isCoffee(m);
  const preview = ['cup','deco','mood'].includes(st);
  return `<div>
  <div class="bhead"><button class="x hd" data-act="quit" aria-label="ออก">✕</button><div style="text-align:center"><div style="font:700 19px var(--fd)">${esc(m.th)} <span style="font:500 14px var(--fb)">· บาร์ชง</span></div><div class="sub" style="font-size:11.5px">${S.extra?'แก้วพิเศษ · ':''}${coffeeBg?'บาริสต้า '+esc(b.th):'ชมพู ผู้ช่วยบาร์มัทฉะ'}</div></div><div style="font:600 14px var(--fb);width:38px;text-align:right">${S.si+1}/${S.steps.length}</div></div>
  <div class="steps">${S.steps.map((s,i)=>`<div class="st ${i<S.si?'d':i===S.si?'on':''}"><b class="hd thin">${i<S.si?'✓':i+1}</b>${STEP_SHORT[s]}</div>`).join('')}</div>
  <div class="stage hd" id="stage">
    ${preview ? `<div style="position:absolute;inset:0;background:radial-gradient(circle at 40% 45%,#FFF3D9,#F8E6CF)"></div><div class="preview" style="position:absolute;left:24px;top:30px;width:200px;height:200px;margin:0">${stampHTML(S.draft,{face:false})}</div>${stars([[24,20,14],[220,30,12,.5],[200,240,16,1]])}`
      : `<img class="bg ${coffeeBg?"coffee":"matcha"}" src="${IMG}${(['milk','art'].includes(st) && m.milk && tempOf(S.draft)==='hot')?"steam":coffeeBg?"coffee":"matcha"}.webp" alt="">`}
    ${preview?`<span class="duckglow"></span><img class="duck" src="${bImg(b.k)}" alt="">`:""}
    <div class="bubble" id="bub" ${preview?'style="left:auto;right:12px;top:12px;max-width:150px"':''}>${esc(say(st))}</div>
    <div class="fx" id="fx">${fxHTML(st)}</div>
  </div>
  <div class="ctrl"><div class="H">สเต็ป ${S.si+1} · ${x.t}</div><div class="sub" style="font-size:13px;margin-top:2px">${x.h}</div><div id="ctl">${ctrlHTML(st)}</div></div>
  <div class="bfoot"><button class="btn soft hd" data-act="back">← ${S.si? 'ย้อน':'เมนู'}</button><button class="btn" id="nextBtn" data-act="next" ${stepReady(st)?'':'disabled'}>${S.si===S.steps.length-1?(S.extra?'เสิร์ฟแก้วพิเศษ ✦':'เก็บแก้ววันนี้ ✦'):'ถัดไป →'}</button></div>
  </div>`;
}
const chips = (arr, cur, act, extra='') => `<div class="chips">${arr.map(o=>`<button class="chip hd ${String(o.k)===String(cur)?'on':''}" data-act="${act}" data-k="${o.k}" ${extra}>${o.th}</button>`).join('')}</div>`;
function gauge(id, val, zone){ return `<div class="gauge hd thin">${zone?`<div class="zone" style="left:${zone[0]}%;width:${zone[1]-zone[0]}%"></div>`:''}<i id="${id}" style="width:${val}%"></i></div>`; }
function ctrlHTML(st){
  const d = S.draft, m = M(d.drink), P = S.prog;
  switch(st){
    case 'bean': return `<div class="lbl">เมล็ดกาแฟ${d.decaf?' (ดีแคฟ)':''}</div>${chips(BEANS,d.bean,'set-bean')}${orderTag(d)}`;
    case 'grind': return `<div class="lbl">ความละเอียด</div>${chips(GRINDS,d.grind,'set-grind')}${gauge('g1',P.grind?100:(S.tmp||0))}<div class="gmeta"><span>${P.grind?'บดเสร็จแล้ว 18 g ✓':'ผงกาแฟ 0–18 g'}</span><span>${d.grind!=='fine'?'เอสเปรสโซ่ใช้แบบละเอียดดีสุดนะ':''}</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="grind">${P.grind?'บดใหม่':'กดค้างเพื่อบด ⚙'}</button>`;
    case 'tamp': return `${gauge('g1',P.tamp?P.tampv:0,[55,80])}<div class="gmeta"><span id="gm">${P.tamp?`แรงกด ${Math.round(P.tampv/5)} kg · ${S.q.tamp==='perfect'?'พอดีเป๊ะ! ✦':'ใช้ได้ ✓'}`:'แรงกด 0 kg'}</span><span>โซนเขียว 11–16 kg</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="tamp">${P.tamp?'แทมป์อีกครั้ง':'กดค้างเพื่อแทมป์ แล้วปล่อย'}</button>`;
    case 'shot': return `<div class="lbl">จำนวนช็อต</div><div class="chips">${[1,2,3,4].map(n=>`<button class="chip hd ${d.shots===n?'on':''}" style="width:62px;justify-content:center" data-act="set-shots" data-k="${n}" ${S.busy?'disabled':''}>${n} ช็อต</button>`).join('')}</div>${gauge('g1',P.shot?100/1.15:0,[76.5,88.7])}<div class="gmeta"><span id="gm">${P.shot?`ได้ ${d.shots} ช็อต (${d.shots*30} ml) ${d.shotq==='perfect'?'· เพอร์เฟกต์ ✦':'✓'}`:'กดค้าง แล้วปล่อยในโซนทอง'}</span><span>โซนทอง = ช็อตเพอร์เฟกต์</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="shot" ${S.busy?'disabled':''}>${P.shot?'กดค้างเพื่อดึงใหม่':'กดค้างเพื่อดึงช็อต ☕'}</button><button class="linkbtn" data-act="pull" ${S.busy?'disabled':''}>หรือแตะเพื่อดึงอัตโนมัติ</button>`;
    case 'milk': return `<div class="lbl">นม</div>${chips(MILKS,d.milk,'set-milk')}${d.temp==='hot'?`${gauge('g1',P.milk?P.milkv:0,[58,75])}<div class="gmeta"><span id="gm">${P.milk?`${Math.round(20+P.milkv*.6)}°C · ${S.q.milk==='perfect'?'นมเนียนนุ่ม ✦':'นมอุ่นแล้ว ✓'}`:'20°C'}</span><span>โซนเขียว 55–65°C</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="milk">${P.milk?'สตีมใหม่':'กดค้างเพื่อสตีมนม ♨'}</button>`:pourCtl(m.k==='dirty'?'กดค้างเทนมเย็น (ก่อนราดช็อต) 🥛':'กดค้างเพื่อเทนมเย็น 🥛')}`;
    case 'art': return `<div class="lbl">ลายลาเต้อาร์ต</div>${chips(ARTS,d.art,'set-art')}<button class="btn wide yel" style="margin-top:14px" data-act="pour" ${d.art==='none'?'disabled':''}>${P.art?'วาดสำเร็จ ✓ เทใหม่':'เทนม วาดลาย ♡'}</button>`;
    case 'syrup': return `<div class="lbl">ไซรัป${m.choc?' (มอคค่าใส่ซอสช็อกโกแลตแล้ว ✓)':''}</div>${chips(SYRUPS,d.syrup,'set-syrup')}<div class="lbl">ความหวาน</div>${chips(SWEETS,d.sweet,'set-sweet')}`;
    case 'sift': return `<div class="lbl">${m.powder} กี่ช้อน?</div>${chips([{k:1,th:'1 ช้อน · อ่อน'},{k:2,th:'2 ช้อน · กลาง'},{k:3,th:'3 ช้อน · เข้ม'}],d.scoops,'set-scoops')}${gauge('g1',Math.min(100,(P.siftn||0)*100/6))}<div class="gmeta"><span id="gm">${P.sift?'ผงเนียน ไม่มีก้อน ✓':`ร่อนแล้ว ${P.siftn||0}/6`}</span><span>แตะรัวๆ</span></div><button class="btn wide yel" style="margin-top:12px" data-act="sift">${P.sift?'ร่อนเสร็จแล้ว ✓':'แตะเพื่อเคาะตะแกรง ⋯'}</button>`;
    case 'water': { const [a,z]=m.wt; return `<div class="lbl">อุณหภูมิน้ำ: <b id="wt" style="color:var(--accD)">${d.water}°C</b> · แนะนำ ${a}–${z}°C</div><input class="range" type="range" min="60" max="100" value="${d.water}" data-act="set-water" aria-label="อุณหภูมิน้ำ"><div class="gmeta"><span>60°C</span><span>100°C</span></div><button class="btn wide yel" style="margin-top:10px" data-act="pourwater">${P.water?'เทน้ำแล้ว ✓ 70 ml':'เทน้ำร้อน 70 ml 💧'}</button>`; }
    case 'whisk': return `<div class="whiskpad hd thin" id="pad">${P.whisk?'ฟองนุ่มละเอียดแล้ว ✓':'วนนิ้วเป็นวงกลม ⟳ ในถ้วยนี้'}<span class="wz" id="wz" style="display:none"></span></div>${gauge('g1',P.whisk?100:(S.wv||0))}<div class="gmeta"><span id="gm">${P.whisk?'ฟอง 100% ✓':`ฟอง ${Math.round(S.wv||0)}%`}</span><button style="font:600 14px var(--fb);text-decoration:underline" class="holdbtn" data-hold="whisk">กดค้างให้ตีอัตโนมัติ</button></div>`;
    case 'milk2': return `<div class="lbl">นม${m.straw?' (มีสตรอว์เบอร์รีบดรองแก้วแล้ว ✓)':''}</div>${chips(MILKS,d.milk,'set-milk')}${pourCtl(d.temp==='iced'?'กดค้างเพื่อเทนมเย็น 🥛':'กดค้างเพื่อเทนมอุ่น 🥛')}${orderTag(d)}`;
    case 'soda': return `<div class="lbl">น้ำผึ้งรองก้นแก้วแล้ว ✓</div>${pourCtl('กดค้างเพื่อเทโซดา 🫧','soda')}${orderTag(d)}`;
    case 'ice': { const n=iceN(d); return `<div class="lbl">น้ำแข็ง (ก้อน)</div>${chips(ICES.filter(i=>i.n),String(n),'set-ice')}${gauge('g1',Math.min(100,(S.icen||0)*100/n))}<div class="gmeta"><span id="gm">${P.ice?`น้ำแข็ง ${n} ก้อน ✓`:`ตักแล้ว ${S.icen||0}/${n} ก้อน`}</span><span>แตะทีละก้อน</span></div><button class="btn wide yel" style="margin-top:12px" data-act="scoop">${P.ice?'น้ำแข็งครบแล้ว ✓':'ตักน้ำแข็ง 🧊'}</button>`; }
    case 'top': return `<div class="lbl">ท็อปปิ้ง</div>${chips(TOPS,d.topping,'set-top')}<div class="lbl">ความหวาน</div>${chips(SWEETS,d.sweet,'set-sweet')}`;
    case 'cup': { const L=cupsFor(d); return `<div class="cups" style="margin-top:12px;grid-template-columns:repeat(${Math.min(3,L.length)},1fr)">${L.map(c=>`<button class="cupopt hd ${d.cup===c.k?'on':''}" data-act="set-cup" data-k="${c.k}"><img src="${IMG}d-${imgOf(Object.assign({},d,{cup:c.k}))}.webp" alt="">${c.th}</button>`).join('')}</div><div class="sub" style="font-size:12px;margin-top:8px">${({glass:'เครื่องดื่มเย็น: เลือกทรงแก้วใสที่ชอบ',mug:'เครื่องดื่มร้อน: เลือกแก้วมัคเซรามิกที่ชอบ',bowl:'อุสุฉะ: เสิร์ฟในถ้วยชาวันแบบญี่ปุ่น เลือกลายเคลือบได้',straw:'เมนูนี้เสิร์ฟในแก้วใสทรงสูงแบบเดียว',secret:'เมนูลับเสิร์ฟในแก้วลายดาวใบพิเศษ'})[vesselType(d)]}${d.decaf&&vesselType(d)==='mug'?' · ดีแคฟมีมัคม่วงพระจันทร์ให้เลือกด้วย':''}</div>`; }
    case 'deco': return `<div class="lbl">สีปลอกแก้ว</div><div class="chips">${SLEEVES.map(s=>{ const L=lockOf('sleeve',s.k); return `<button class="sw hd thin ${s.c?'':'none'} ${d.sleeve===s.k?'on':''} ${L?'locked':''}" style="${s.c?`background:${s.c}`:''}" data-act="set-sleeve" data-k="${s.k}" aria-label="${s.th||s.k}${L?' (ล็อก)':''}">${L?'🔒':''}</button>`; }).join('')}</div><div class="lbl">สติกเกอร์ (${d.stickers.length}/3)</div><div class="chips">${stkList().map(k=>{ const L=lockOf('sticker',k); return `<button class="stkbtn hd thin ${d.stickers.includes(k)?'on':''} ${L?'locked':''}" data-act="stk" data-k="${k}" aria-label="${k}${L?' (ล็อก)':''}">${miniSticker(k)}${L?'<i class="lk">🔒</i>':''}</button>`; }).join('')}</div><div class="sub" style="font-size:11.5px;margin-top:8px">🔒 ของตกแต่งโบนัส: เคยสะสมติดกัน 7 / 14 / 30 วัน (นับสถิติดีที่สุด ขาดวันก็ไม่หาย)</div>`;
    case 'mood': return `<div class="chips" style="margin-top:12px">${MOODS.map(x=>`<button class="moodbtn hd thin ${d.mood===x.k?'on':''}" data-act="set-mood" data-k="${x.k}">${faceSVG(x.k,34)}${x.th}</button>`).join('')}</div><div class="lbl">โน้ตสั้นๆ (ไม่ใส่ก็ได้ · เก็บในเครื่องนี้เท่านั้น)</div><input id="note" class="noteline" type="text" maxlength="60" enterkeyhint="done" placeholder="เขียนนิดเดียวก็ได้นะ" value="${esc(d.note)}">`;
  }
  return '';
}
/* hold-to-pour gauge (cold milk / milk / soda): sweet spot 55-78% of the glass; any pour past 20% is fine */
const POUR_ZONE = [55,78];
function pourCtl(label, kind='milk'){ const P=S.prog, ok=P[kind]; return `${gauge('g1',ok?P[kind+'v']:0,POUR_ZONE)}<div class="gmeta"><span id="gm">${ok?(S.q[kind==='soda'?'soda':'pour']==='perfect'?'เทพอดีเป๊ะ ✦':'เทเรียบร้อย ✓'):'กดค้าง แล้วปล่อยในโซนทอง'}</span><span>โซนทอง = พอดีแก้ว</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="${kind==='soda'?'soda':'pour'}">${ok?'เทใหม่':label}</button>`; }
function pourFX(v, soda){ const f=Math.max(0,Math.min(1,v/100)), col=soda?'#F6DE8E':'#FBF4E8';
  return `<svg width="70" height="92" viewBox="0 0 70 92" style="filter:url(#wob)" aria-hidden="true"><path d="M10 8 L60 8 L55 84 Q54 88 49 88 L21 88 Q16 88 15 84Z" fill="#FFFDF7" stroke="#49342B" stroke-width="2.4"/><clipPath id="pc"><path d="M10 8 L60 8 L55 84 Q54 88 49 88 L21 88 Q16 88 15 84Z"/></clipPath>${soda?'<rect clip-path="url(#pc)" x="0" y="74" width="70" height="20" fill="#E2A83E"/>':''}<rect clip-path="url(#pc)" x="0" y="${88-80*f}" width="70" height="92" fill="${col}" opacity=".95"/><line x1="6" x2="64" y1="${88-80*POUR_ZONE[1]/100}" y2="${88-80*POUR_ZONE[1]/100}" stroke="#F5D778" stroke-width="2" stroke-dasharray="3 3"/><line x1="6" x2="64" y1="${88-80*POUR_ZONE[0]/100}" y2="${88-80*POUR_ZONE[0]/100}" stroke="#F5D778" stroke-width="2" stroke-dasharray="3 3"/>${soda?[...Array(6)].map((_,i)=>`<circle cx="${22+i*5}" cy="${84-((i*23)%60)*f}" r="1.6" fill="#fff" opacity=".8"/>`).join(''):''}</svg>`; }
function fxHTML(st){
  const d=S.draft, P=S.prog;
  if ((st==='milk' && d.temp!=='hot') || st==='milk2') return pourFX(P.milk?P.milkv:(S.tmp||0));
  if (st==='soda') return pourFX(P.soda?P.sodav:(S.tmp||0), true);
  if (st==='shot'){ const f = P.shot?1:(S.shotf||0); return `<svg width="70" height="80" viewBox="0 0 70 80" style="filter:url(#wob)"><path d="M12 14 L58 14 L53 72 Q52 76 47 76 L23 76 Q18 76 17 72Z" fill="#FFFDF7" stroke="#49342B" stroke-width="2.5"/><clipPath id="sc"><path d="M12 14 L58 14 L53 72 Q52 76 47 76 L23 76 Q18 76 17 72Z"/></clipPath><rect clip-path="url(#sc)" x="0" y="${76-62*f}" width="70" height="80" fill="#7A4527"/><rect clip-path="url(#sc)" x="0" y="${76-62*f}" width="70" height="7" fill="#D9A066"/><text x="35" y="10" text-anchor="middle" font-family="Mali" font-size="10" font-weight="700" fill="#49342B">${Math.round(f*d.shots)}/${d.shots}</text></svg>`; }
  if (st==='milk' && d.temp==='hot'){ const v=P.milk?P.milkv:(S.tmp||0); return thermo(20+v*.6); }
  if (st==='water'){ return thermo(d.water); }
  if (st==='ice'){ const n=iceN(d); return iceGlass(n, P.ice?n:(S.icen||0)); }
  if (st==='art' && d.art!=='none'){ return `<svg width="86" height="86" viewBox="-43 -43 86 86" style="filter:url(#wob)"><circle r="38" fill="#9A6A45" stroke="#49342B" stroke-width="2.5"/><g fill="#FFF6EA" style="opacity:${P.art?1:.0};transition:opacity .8s">${artPath(d.art)}</g></svg>`; }
  if (st==='whisk'){ const v=P.whisk?100:(S.wv||0); return `<svg width="86" height="50" viewBox="0 0 86 50" style="filter:url(#wob)"><ellipse cx="43" cy="25" rx="40" ry="20" fill="#7FA83A" stroke="#49342B" stroke-width="2.5"/><ellipse cx="43" cy="25" rx="36" ry="16" fill="#D7EBA0" opacity="${v/100}"/>${[...Array(9)].map((_,i)=>`<circle cx="${18+i*6}" cy="${20+(i%3)*5}" r="2.4" fill="#F7FBE4" opacity="${v/100}"/>`).join('')}</svg>`; }
  return '';
}
function orderTag(d){ const t=tempOf(d); return `<div class="otag hd thin">ออเดอร์: <b>${t==='iced'?'🧊 เย็น':'☕ ร้อน'}</b>${d.decaf?' · 🌙 ดีแคฟ':''}${t==='iced'?` · 🧊 ${(ICES[iceN(d)]).th}`:''} · ${(SIZES.find(z=>z.k===d.size)||{}).th} · ${(SWEETS.find(x=>x.k===d.sweet)||{}).th}${M(d.drink).milk?` · ${(MILKS.find(x=>x.k===d.milk)||{}).th}`:''}</div>`; }
function iceGlass(n, have){
  const e = Object.assign({}, S.draft, { ice:String(have), topping:'none', sweet:null }), fx = artFX(e);
  return `<div class="iceart"><div style="position:relative;width:100%;height:100%"><img src="${IMG}d-${imgOf(e)}.webp" alt="">${fx}</div><b>🧊 ${have}/${n}</b></div>`;
}
function thermo(t){ const f=Math.max(0,Math.min(1,(t-20)/80)); return `<svg width="40" height="96" viewBox="0 0 40 96" style="filter:url(#wob)"><rect x="13" y="6" width="14" height="66" rx="7" fill="#FFFDF7" stroke="#49342B" stroke-width="2.4"/><rect x="17" y="${68-56*f}" width="6" height="${56*f+6}" rx="3" fill="#E8896A"/><circle cx="20" cy="80" r="11" fill="#E8896A" stroke="#49342B" stroke-width="2.4"/><text x="20" y="95" text-anchor="middle" font-size="0">.</text></svg><div style="font:700 14px var(--fb);background:#FFFDF7;border-radius:8px;padding:0 6px;margin-top:2px">${Math.round(t)}°C</div>`; }
function artPath(a){
  if (a==='heart') return `<path d="M0 18 C-26 2 -18 -20 0 -8 C18 -20 26 2 0 18Z"/>`;
  if (a==='tulip') return `<ellipse cx="0" cy="-14" rx="14" ry="8"/><ellipse cx="0" cy="0" rx="17" ry="8"/><path d="M0 12 C-20 4 -16 -4 0 2 C16 -4 20 4 0 12Z"/><rect x="-1.5" y="10" width="3" height="18"/>`;
  return `${[-20,-12,-4,4,12].map((y,i)=>`<ellipse cx="0" cy="${y}" rx="${8+i*3}" ry="4"/>`).join('')}<rect x="-1.2" y="-26" width="2.4" height="50"/>`;
}
function refreshStep(){ const st=S.steps[S.si]; $('#ctl').innerHTML=ctrlHTML(st); $('#fx').innerHTML=fxHTML(st); $('#nextBtn').disabled=!stepReady(st); bindStep(); }
function speak(t){ const b=$('#bub'); if(b){ b.textContent=I18N.t(t)+I18N.t(B(S.barista).tail); b.style.animation='none'; void b.offsetWidth; b.style.animation=''; } }
function refreshPreview(){ const p=$('.preview'); if(p) p.innerHTML=stampHTML(S.draft,{face:false}); }

/* hold buttons + whisk pad */
function bindStep(){
  document.querySelectorAll('[data-hold]').forEach(btn=>{
    const kind=btn.dataset.hold; let t=null, v=0, stopLoop=()=>{};
    const startH = e => { e.preventDefault(); if (t || S.busy) return; btn.classList.add('active'); btn.setPointerCapture && e.pointerId!==undefined && btn.setPointerCapture(e.pointerId);
      SFX.buzz(8);
      if (kind==='grind') stopLoop=SFX.loop('grind',{vol:.22});
      if (kind==='milk') stopLoop=SFX.loop('froth',{vol:.2});
      if (kind==='pour'||kind==='soda'){ stopLoop=SFX.loop('pour',{vol:.18, rate:kind==='soda'?1.25:1}); S.prog[kind==='soda'?'soda':'milk']=false; v=0; }
      if (kind==='shot'){ S.prog.shot=false; v=0; S.shotT0=performance.now(); stopLoop=SFX.loop('pour',{vol:.14, rate:.8}); }
      if (kind==='whisk') stopLoop=SFX.loop('froth',{vol:.12, rate:1.4});
      if (kind==='grind'){ S.prog.grind=false; v=0; }
      if (kind==='tamp'){ S.prog.tamp=false; v=0; }
      if (kind==='milk'){ S.prog.milk=false; v=0; }
      t=setInterval(()=>{
        if (!btn.isConnected || S.view!=='brew'){ clearInterval(t); t=null; return; }
        if (kind==='whisk'){ if (S.prog.whisk){ clearInterval(t); t=null; stopLoop(); return; } S.wv=Math.min(100,(S.wv||0)+2.2); updWhisk(); return; }
        if (kind==='shot'){ const pv=v; v = (performance.now()-S.shotT0)/(S.draft.shots*900)*100; S.shotf=Math.min(1,v/100); const g=$('#g1'); if(g) g.style.width=Math.min(100,v/1.15)+'%'; const fx=$('#fx'); if(fx) fx.innerHTML=fxHTML('shot');
          const gm=$('#gm'); if(gm) gm.textContent = v<88?`กำลังดึง... ${Math.round(v)}%`:v<=102?'โซนทอง! ปล่อยเลย ✦':'เข้มเกินแล้ว ปล่อย!'; if (v>=88 && pv<88) SFX.buzz(15); if (v>=115) endH(); return; }
        v=Math.min(100, v + (kind==='grind'?3.2:kind==='tamp'?1.8:kind==='pour'||kind==='soda'?1.5:1.3));
        if (kind==='pour'||kind==='soda'){ const g=$('#g1'); if(g) g.style.width=v+'%'; S.tmp=v; const gm=$('#gm'); if(gm) gm.textContent = v<POUR_ZONE[0]?`กำลังเท... ${Math.round(v)}%`:v<=POUR_ZONE[1]?'โซนทอง! ปล่อยเลย ✦':'เกือบล้นแล้ว ปล่อยได้เลย'; if (v>=POUR_ZONE[0] && v-1.5<POUR_ZONE[0]) SFX.buzz(12); $('#fx').innerHTML=fxHTML(S.steps[S.si]); if (v>=100) endH(); return; }
        const g=$('#g1'); if(g) g.style.width=v+'%';
        if (kind==='tamp'){ $('#gm').textContent=`แรงกด ${Math.round(v/5)} kg`; }
        if (kind==='milk'){ $('#gm').textContent=`${Math.round(20+v*.6)}°C`; S.tmp=v; $('#fx').innerHTML=fxHTML('milk'); }
        if (kind==='grind' && v>=100){ endH(); }
        if (v>=100 && kind!=='grind'){ endH(); }
      }, 50);
    };
    const endH = () => { if(!t) return; clearInterval(t); t=null; btn.classList.remove('active'); stopLoop();
      if (kind==='shot'){ if (v<60){ S.shotf=0; toast('ช็อตยังไม่เต็มแก้ว กดค้างอีกนิดนะ',1); } else { S.prog.shot=true; S.shotf=1; S.draft.shotq = v>=88&&v<=102 ? 'perfect' : v>102 ? 'strong' : 'ok'; S.q.shot = S.draft.shotq==='perfect'?'perfect':'ok';
          if (S.draft.shotq==='perfect'){ SFX.play('chime',{vol:.25}); SFX.buzz([12,40,12]); speak('ช็อตเพอร์เฟกต์! ครีม่าสวยมาก'); } else { SFX.play('plop',{vol:.25}); speak(S.draft.shotq==='strong'?'เข้มหน่อย แต่หอมดีนะ':'ใช้ได้เลย ครั้งหน้าลองปล่อยในโซนทองนะ'); } } refreshStep(); return; }
      if (kind==='grind'){ if (v>=100){ S.prog.grind=true; SFX.buzz(10); speak('บดเสร็จ หอมฟุ้งเลย'); } else { S.tmp=v; toast('กดค้างจนเต็มนะ'); } S.tmp=0; }
      /* no fail states: any reasonable release is accepted; the zone only earns a 'perfect' (stars count in extra cups only) */
      if (kind==='tamp'){ if (v<10){ toast('กดค้างนานขึ้นอีกนิดนะ',1); } else { const pf=v>=55&&v<=80; S.prog.tamp=true; S.prog.tampv=v; S.q.tamp=pf?'perfect':'ok'; SFX.play('tap',{vol:.4, rate:.7}); SFX.buzz([10,30,10]); speak(pf?'แทมป์เรียบเนียนเป๊ะ!':v<55?'เบาไปนิด แต่ใช้ได้นะ':'แน่นไปหน่อย ไม่เป็นไรเลย'); } }
      if (kind==='milk'){ if (v<15){ S.tmp=0; toast('กดค้างอีกนิด นมยังเย็นอยู่เลย',1); } else { const pf=v>=58&&v<=75; S.prog.milk=true; S.prog.milkv=v; S.q.milk=pf?'perfect':'ok'; SFX.buzz(10); speak(pf?'นมเนียนนุ่ม ไมโครโฟมสวย':v<58?'อุ่นกำลังดื่มง่ายเลย':'ร้อนไปนิด แต่ยังหอมอยู่นะ'); } }
      if (kind==='pour'||kind==='soda'){ const key=kind==='soda'?'soda':'milk'; if (v<20){ S.tmp=0; toast('เทอีกนิดนะ ยังไม่ถึงครึ่งแก้วเลย',1); } else { const pf=v>=POUR_ZONE[0]&&v<=POUR_ZONE[1]; S.prog[key]=true; S.prog[key+'v']=v; S.q[kind==='soda'?'soda':'pour']=pf?'perfect':'ok'; SFX.buzz(10); speak(pf?'เทพอดีเป๊ะเลย ✦':v<POUR_ZONE[0]?'น้อยไปนิด แต่เข้มข้นดีนะ':'เต็มแก้วเลย ใจดีจัง'); } S.tmp=0; }
      if (kind==='whisk'){ return; }
      refreshStep();
    };
    btn.addEventListener('pointerdown', startH);
    ['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev, endH));
  });
  const pad=$('#pad');
  if (pad && !S.prog.whisk){
    /* circular swipe: progress follows the angle travelled around the bowl centre (~6 turns = 100%) */
    let lastA=null, stopW=()=>{}, turns=0; const wz=$('#wz');
    const ang = e => { const r=pad.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2, dx=e.clientX-cx, dy=e.clientY-cy; return Math.hypot(dx,dy) < 12 ? null : Math.atan2(dy,dx); };
    pad.addEventListener('pointerdown', e=>{ e.preventDefault(); lastA=ang(e); pad.setPointerCapture(e.pointerId); stopW=SFX.loop('froth',{vol:.12, rate:1.4}); });
    pad.addEventListener('pointermove', e=>{ if(lastA===undefined||!pad.hasPointerCapture(e.pointerId)) return; const r=pad.getBoundingClientRect(); wz.style.display='block'; wz.style.left=(e.clientX-r.left)+'px'; wz.style.top=(e.clientY-r.top)+'px';
      const a=ang(e); if (a===null) return; if (lastA===null){ lastA=a; return; }
      let d=a-lastA; if (d>Math.PI) d-=2*Math.PI; if (d<-Math.PI) d+=2*Math.PI; lastA=a;
      S.wv=Math.min(100,(S.wv||0)+Math.abs(d)*100/(10*Math.PI)); turns+=Math.abs(d); if (turns>2*Math.PI){ turns=0; SFX.buzz(6); } updWhisk(); if (S.prog.whisk) stopW(); });
    const upW = ()=>{ lastA=undefined; wz.style.display='none'; stopW(); };
    pad.addEventListener('pointerup', upW); pad.addEventListener('pointercancel', upW);
  }
}
function updWhisk(){
  const g=$('#g1'); if(g) g.style.width=S.wv+'%'; const gm=$('#gm'); if(gm) gm.textContent=`ฟอง ${Math.round(S.wv)}%`;
  const fx=$('#fx'); if(fx) fx.innerHTML=fxHTML('whisk');
  if (S.wv>=100 && !S.prog.whisk){ S.prog.whisk=true; speak('ฟองนุ่มละเอียดสวยมาก'); refreshStep(); }
}

/* ----- done ----- */
function doneView(){
  const e = db.entries[todayKey()], b=B(e.barista), m=M(e.drink);
  return `<div class="done"><div class="badge hd thin">Cupmori ✦</div>
  <div class="H xl" style="margin-top:14px">เก็บแก้ววันนี้ไว้แล้ว</div><div class="sub">${thDate(NOW())}</div>
  ${stampHTML(e)}
  <div class="H" style="font-size:24px">${esc(m.th)}</div>
  <div style="font-size:13.5px;margin-top:4px">บาริสต้าวันนี้: <b>${esc(b.th)}</b> (${esc(b.prop)})</div>
  <div class="greet hd thin" style="margin:14px 0 0;text-align:left"><img src="${bImg(b.k)}" alt=""><span>${e.note?`<span class="sub" style="font-size:12px">วันนี้เป็นไง: "${esc(e.note)}"</span><br>`:''}"${esc(replyFor(e))}${b.tail}"</span></div>
  ${S.moodBeans?`<div class="beanline">${beanIcon(18)} น้องเป็ดแบ่งเมล็ดกาแฟให้ ${S.moodBeans} เมล็ด ไว้แต่งร้านนะ</div>`:''}
  ${(S.newRecipes||[]).map(r=>recipeToast(r)).join('')}
  ${(S.newLetters||0)?`<button class="unlock hd thin" data-act="story" data-k="${unreadStories()[0].join(':')}" style="width:100%;text-align:left"><span class="big" style="font-size:30px">✉</span><div><b>มีจดหมายใหม่ ${S.newLetters} ฉบับ</b><br><span class="sub" style="font-size:12px">แตะเพื่ออ่าน · เก็บไว้ที่ "สะสม" ด้วย</span></div></button>`:''}
  ${(S.newGuests||[]).map(g=>`<div class="unlock hd thin"><img src="${IMG}g-${g.k}.webp" alt=""><div><div class="badge hd thin" style="font-size:11px;padding:2px 10px">แขกใหม่ปลดล็อก! ✦</div><b>${esc(g.th)}</b> · ${esc(g.role)}<br><span class="sub" style="font-size:12px">ครบ ${g.at} แสตมป์ · จะแวะมาเยี่ยมร้านในวันต่อๆ ไป${g.k==='redpanda'?' และเปิด "เมนูลับ" ให้แล้ว':''}</span></div></div>`).join('')}
  ${(()=>{ const c=currentStreak(); return c>=2?`<div class="sub" style="font-size:12.5px;margin-top:10px">ชงติดกัน ${c} วันแล้ว ✦ (ขาดวันก็ไม่เป็นไรนะ ของที่ได้แล้วอยู่ถาวร)</div>`:''; })()}
  ${S.askReminder?`<div class="remask hd thin"><b>ให้น้องเป็ดช่วยเตือนชงแก้วทุกวันไหม?</b><div class="sub" style="font-size:12px;margin:2px 0 8px">เลือกเวลาได้ จะเปลี่ยนหรือปิดภายหลังก็ได้ที่ "ตั้งค่า"</div>${reminderForm(null)}</div>`:''}
  <button class="btn wide yel" style="margin-top:16px" data-act="story-day" data-k="${todayKey()}">แชร์แก้ววันนี้ · สตอรี่ 9:16 ↗</button>
  <div style="display:flex;gap:10px;margin-top:10px"><button class="btn soft hd" style="flex:1" data-act="home">ดูสมุดแสตมป์</button><button class="btn" style="flex:1" data-go="summary">สรุปเดือนนี้ ◔</button></div>
  ${stars([[30,40,16],[330,70,12,.4],[40,330,12,.8],[320,300,16,1.2]])}</div>`;
}
function finish(){
  const n=$('#note'); if(n) S.draft.note=n.value.trim();
  if (S.extra) return finishExtra();
  const e = Object.assign({}, S.draft, { ts:Date.now() });
  if (!isCoffee(M(e.drink))) e.shots = 0;
  if (!e.guest) delete e.guest; if (!e.decaf) delete e.decaf; delete e.shotq;
  const before = new Set(unreadStories().map(x=>x.join(':')));
  db.entries[todayKey()] = e;
  const bd = beanDay(); S.moodBeans = 0; if (!bd.mood){ bd.mood = true; S.moodBeans = earn(C.BEANS_RULES.moodCup); }   /* flat thank-you, first save of the day only */
  S.newRecipes = discover(e);                                                                                      /* discovery only; no beans for mood cups */
  S.newGuests = syncGuests();
  S.newLetters = unreadStories().filter(x=>!before.has(x.join(':'))).length;
  S.askReminder = !db.settings.reminderAsked && stampCount()>=1;
  save();
  const d=NOW(); S.calY=d.getFullYear(); S.calM=d.getMonth();
  S.edit=false; S.draft=null; go('done'); if (!reduced()) confetti(); SFX.play('stamp',{vol:.4, delay:.25}); SFX.play('quack',{vol:.35, rate:1.25, delay:.9}); P.haptic.play('stamp');
}

/* ----- brand: wordmark (Mali Bold outlines) + a clear slot for the final logo (VI book pending) ----- */
function brandMark(){ return `<div class="logo" data-logo-slot="header"><img class="emblem" src="assets/brand/emblem.webp" alt=""><img class="wordmark" src="assets/brand/wordmark.svg" alt="Cupmori"></div>`; }
function applyMotion(){ const ph=$('#phone'); if (ph) ph.classList.toggle('rm', !!db.settings.reduceMotion || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)); }
const reduced = () => $('#phone') && $('#phone').classList.contains('rm');
/* festival guest: first visit during its festival = met (stays in the collection forever) */
function metFestGuest(){ const fg=festGuest(); if (fg && !db.guests[fg.k]){ db.guests[fg.k]={ on:todayKey(), fest:1 }; save(); S.bootGuests=(S.bootGuests||[]).concat([fg]); } }
/* ----- daily mystery order card (home) ----- */
function mysteryCard(){
  const my=mysteryToday(), done=my.done, hint=my.hint;
  return `<div class="mystery hd thin"><img src="${whoImg(my.by)}" alt=""><div class="mtx"><div class="sub">ออเดอร์ลึกลับวันนี้ · จาก${esc(whoName(my.by))}</div><b>"${esc(hint.th)}"</b>
    ${done?`<div class="sub ok">✓ เสิร์ฟแล้ว · "${esc(hint.reply)}"</div>`:`<div class="sub">ไม่มีหมดเวลา ชงเป็นแก้วพิเศษเมื่อไหร่ก็ได้ · +${C.BEANS_RULES.mystery} เมล็ด</div>`}</div>
    <button class="btn sm" data-act="extra">${done?'ชงเล่นอีกแก้ว':'ชงให้เลย'}</button></div>`;
}
/* ----- extra cup result ----- */
function finishExtra(){
  const d = Object.assign({}, S.draft, { ts:Date.now() }); if (!isCoffee(M(d.drink))) d.shots=0;
  const stars=craftStars(), bd=beanDay(), my=mysteryToday(), R=C.BEANS_RULES, paid = bd.extras < R.extraCupsPaidPerDay;
  const matched = !my.done && matchWant(my.hint.want, d, ctxNow());
  const before = new Set(unreadStories().map(x=>x.join(':')));
  const fresh = discover(d);
  let beans = paid ? R.extraStars[stars] : 0;
  if (matched){ beans += R.mystery; db.mystery[todayKey()] = { h:my.hint.k, by:my.by }; if (G(my.by)) db.friends[my.by]=(db.friends[my.by]||0)+1; }
  beans += fresh.length * R.newRecipe;
  bd.extras++; earn(beans);
  db.extras.push({ k:todayKey(), drink:d.drink, temp:tempOf(d), ice:d.ice, size:d.size, sweet:d.sweet, milk:d.milk, topping:d.topping, syrup:d.syrup, shots:d.shots, decaf:d.decaf||0, cup:d.cup, stars, mystery:matched?1:0, ts:d.ts });
  db.extras = db.extras.slice(-60);
  const letters = unreadStories().filter(x=>!before.has(x.join(':'))).length;
  S.xres = { d, stars, beans, matched, my, fresh, paid, letters };
  save(); S.draft=null; go('xdone');
  if (!reduced()) confetti(); SFX.play('chime',{vol:.3}); SFX.play('quack',{vol:.3, rate:1.3, delay:.6}); P.haptic.play('success');
}
const STAR_MSG = { 3:'ฝีมือเป๊ะทุกขั้นเลย!', 2:'อร่อยมาก ใกล้เป๊ะแล้วนะ', 1:'อร่อยในแบบของเราเองนะ ครั้งหน้าลองปล่อยในโซนทองดู' };
function recipeToast(r){ return `<div class="unlock hd thin recipe-new"><span class="rimg sm"><img src="${IMG}d-${r.img}.webp" alt=""></span><div><div class="badge hd thin" style="font-size:12px;padding:2px 10px">${r.secret?'ค้นพบสูตรลับ ✦':'ค้นพบสูตรใหม่ ✦'}</div><b>${esc(r.th)}</b><br><span class="sub">เก็บไว้ในสมุดสูตรแล้ว</span></div></div>`; }
function xdoneView(){
  const x=S.xres; if (!x) return homeView(); const m=M(x.d.drink), giver=x.my.by;
  return `<div class="done"><div class="badge hd thin">แก้วพิเศษ ✦</div>
  <div class="H xl" style="margin-top:14px">เสิร์ฟแล้ว!</div><div class="sub">${esc(m.th)} · ไม่บันทึกเป็นมู้ด</div>
  ${stampHTML(x.d,{face:false})}
  <div class="stars3" role="img" aria-label="ฝีมือ ${x.stars} จาก 3 ดาว">${[1,2,3].map(i=>`<span class="${i<=x.stars?'on':''}">★</span>`).join('')}</div>
  <div class="sub" style="margin-top:2px">${esc(STAR_MSG[x.stars])}</div>
  <div class="beanline">${beanIcon(18)} ${x.beans?`ได้เมล็ดกาแฟ +${x.beans} เมล็ด`:'วันนี้ครบโควตาเมล็ดจากแก้วพิเศษแล้ว ชงเล่นและค้นสูตรต่อได้เรื่อยๆ นะ'}</div>
  ${x.matched?`<div class="greet hd thin" style="margin:14px 0 0;text-align:left"><img src="${whoImg(giver)}" alt=""><span><b>ตรงออเดอร์ลึกลับ! ✦</b><br>${esc(whoName(giver))}: "${esc(x.my.hint.reply)}"</span></div>`
    : x.my.done && x.my.done.h ? '' : `<div class="sub" style="margin-top:10px">ยังไม่ตรงออเดอร์ลึกลับวันนี้ ไม่เป็นไรนะ ลองใหม่ได้เสมอ ไม่มีหมดเวลา</div>`}
  ${x.fresh.map(recipeToast).join('')}
  ${x.letters?`<button class="unlock hd thin" data-act="story" data-k="${unreadStories()[0].join(':')}" style="width:100%;text-align:left"><span class="big" style="font-size:30px">✉</span><div><b>มีจดหมายใหม่ ${x.letters} ฉบับ</b><br><span class="sub">แตะเพื่ออ่าน</span></div></button>`:''}
  <div style="display:flex;gap:10px;margin-top:16px"><button class="btn soft hd" style="flex:1" data-act="extra">ชงอีกแก้ว</button><button class="btn" style="flex:1" data-go="recipes">สมุดสูตร</button></div>
  <button class="btn soft hd wide" style="margin-top:10px" data-act="home">กลับหน้าแรก</button></div>`;
}
/* ----- recipe book ----- */
const TOD_TH = { morning:'ช่วงเช้า', day:'ช่วงกลางวัน', evening:'ช่วงเย็น', night:'ช่วงดึก' };
const SEASON_TH = { spring:'ใบไม้ผลิ', summer:'ฤดูร้อน', autumn:'ใบไม้ร่วง', winter:'ฤดูหนาว' };
function nowChips(){
  const cx=ctxNow(), w=WX[cx.weather], fest=Festivals.active(NOW());
  const src = db.settings.weatherOptIn && P.weather.cached() ? 'อากาศจริง' : 'เดาจากฤดู';
  return `<div class="nowchips"><span class="chip hd thin">${TOD_TH[cx.tod]}</span><span class="chip hd thin">${SEASON_TH[cx.season]}</span><span class="chip hd thin">${w.i} ${w.th} <small>(${src})</small></span>${fest.map(f=>`<span class="chip hd thin">✦ ${esc(f.th)}</span>`).join('')}</div>`;
}
function recipesView(){
  const n=C.RECIPES.filter(r=>db.recipes[r.k]).length, pct=recipePct();
  const card = r => { const ok=db.recipes[r.k]; return `<button class="rcard hd thin ${ok?'':'unk'} ${r.secret?'sec':''}" data-act="recipe" data-k="${r.k}" aria-label="${ok?esc(r.th):'สูตรที่ยังไม่ค้นพบ'}"><span class="rimg"><img src="${IMG}d-${r.img}.webp" alt=""></span><b>${ok?esc(r.th):r.secret?'สูตรลับ ✦':'???'}</b><small>${esc(r.hint)}</small></button>`; };
  return `<div class="page"><div class="top">${brandMark()}<button class="pill beans hd thin" data-go="room">${beanIcon(18)}<b>${db.beans}</b></button></div>
  <div class="H">สมุดสูตร</div><div class="sub">ผสมวัตถุดิบในแก้วไหนก็ได้ แล้วสูตรจะถูกค้นพบเอง · สูตรลับต้องชงให้ถูกช่วงเวลา</div>
  <div class="pctrow"><b>${pct}%</b><div class="mix hd thin" style="flex:1"><i style="width:${pct}%;background:#9DAE8D"></i></div><span>${n}/${C.RECIPES.length}</span></div>
  ${nowChips()}
  <div class="lbl">สูตรประจำร้าน</div><div class="rgrid">${C.RECIPES.filter(r=>!r.secret).map(card).join('')}</div>
  <div class="lbl">สูตรลับตามช่วงเวลา ✦</div><div class="rgrid">${C.RECIPES.filter(r=>r.secret).map(card).join('')}</div>
  <button class="btn wide" style="margin-top:16px" data-act="extra">ลองชงแก้วพิเศษ ✦</button>
  <div class="footnote">แก้วพิเศษไม่บันทึกเป็นมู้ด · แก้ววันนี้ก็ค้นพบสูตรได้เหมือนกัน</div></div>`;
}
function recipeSheet(k){
  const r=C.RECIPES.find(x=>x.k===k); if (!r) return; const ok=db.recipes[k];
  openSheet(`<div style="text-align:center"><div class="sub">${r.secret?'สูตรลับ ✦':'สูตรประจำร้าน'}</div><div class="H" style="margin:4px 0 12px">${ok?esc(r.th):'???'}</div>
  <span class="rimg big ${ok?'':'unk'}"><img src="${IMG}d-${r.img}.webp" alt=""></span>
  <div class="desc hd thin" style="text-align:left"><b>คำใบ้</b> — ${esc(r.hint)}</div>
  <div class="sub" style="margin-top:8px">${ok?`ค้นพบเมื่อ ${thDate(parseKey(ok))}`:'ยังไม่ค้นพบ ลองชงตามคำใบ้ดูนะ'}</div>
  <button class="btn wide" style="margin-top:14px" data-act="extra">ลองชงแก้วพิเศษ ✦</button></div>`);
}
/* ----- my café (decor with earned beans) + shop (Apple IAP) + tip jar ----- */
function decorArt(x, cls=''){
  if (x.art==='svg:frame') return `<svg class="${cls}" viewBox="0 0 100 80" aria-hidden="true"><rect x="4" y="4" width="92" height="72" rx="6" fill="#B98A5E" stroke="#49342B" stroke-width="3"/><rect x="14" y="14" width="72" height="52" rx="3" fill="#FFF8EC" stroke="#49342B" stroke-width="2"/><image href="${bImg('pe')}" x="26" y="14" width="48" height="52" preserveAspectRatio="xMidYMid slice" style="mix-blend-mode:multiply"/></svg>`;
  if (x.art==='svg:lights') return `<svg class="${cls}" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 Q100 34 200 10 Q300 34 400 6" fill="none" stroke="#49342B" stroke-width="2"/>${[...Array(13)].map((_,i)=>{ const t=i/12, X=t*400, Y=6+Math.sin(t*Math.PI*2)**2*18+4; return `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="5" fill="${['#F5D778','#E7AAA0','#9DAE8D','#C8BFDA'][i%4]}" stroke="#49342B" stroke-width="1.2"/>`; }).join('')}</svg>`;
  return `<img class="${cls}" src="${IMG}decor-${x.k}.webp" alt="">`;
}
function roomHTML(){
  const placed = Object.entries(db.decor.place).map(([sl,k])=>DEC(k)).filter(Boolean);
  return `<div class="room hd" role="img" aria-label="มุมร้านของฉัน"><img class="roombg" src="${IMG}room-bg.webp" alt="">${placed.map(x=>`<div class="ditem d-${x.k}" style="left:${x.pos[0]}%;top:${x.pos[1]}%;width:${x.pos[2]}%;z-index:${x.z}">${decorArt(x)}</div>`).join('')}
    <span class="logo-slot room-slot" data-logo-slot="room" aria-hidden="true"></span>${placed.length?'':'<div class="roomempty">มุมร้านยังโล่งๆ อยู่ ค่อยๆ แต่งทีละชิ้นนะ</div>'}</div>`;
}
function roomView(){
  const tiers=[1,2,3];
  return `<div class="page"><div class="top">${brandMark()}<span class="pill beans hd thin">${beanIcon(18)}<b>${db.beans}</b></span></div>
  <div class="H">ร้านของฉัน</div><div class="sub">แต่งร้านด้วยเมล็ดกาแฟที่ได้จากการชง · เมล็ดกาแฟหาได้จากการชงเท่านั้น ไม่มีขาย</div>
  ${roomHTML()}
  ${tiers.map(t=>{ const open=tierOpen(t); return `<div class="lbl">ชั้นที่ ${t}${open?'':` · 🔒 มีของชั้นที่ ${t-1} ครบ 2 ชิ้นก่อนนะ`}</div><div class="dgrid">${C.DECOR.filter(x=>x.tier===t).map(x=>{ const own=db.decor.owned[x.k], on=db.decor.place[x.slot]===x.k;
    return `<div class="dcard hd thin ${open?'':'locked'} ${on?'on':''}"><span class="dthumb">${decorArt(x)}</span><b>${esc(x.th)}</b>${own?`<button class="btn sm ${on?'soft hd':''}" data-act="decor-place" data-k="${x.k}">${on?'เก็บเข้าคลัง':'วางในร้าน'}</button>`:`<button class="btn sm" data-act="decor-buy" data-k="${x.k}" ${open?'':'disabled'}>${beanIcon(16)} ${x.price}</button>`}</div>`; }).join('')}</div>`; }).join('')}
  <div class="footnote">วางได้ช่องละ 1 ชิ้น (ของที่ใช้ช่องเดียวกันจะสลับกัน) · ของที่แลกแล้วอยู่ถาวร</div>
  ${shopHTML()}
  ${tipHTML()}</div>`;
}
function shopHTML(){
  const PR=P.purchases, avail=PR.available(), now=NOW();
  const launch = ENV.launchDate ? parseKey(ENV.launchDate) : null, openingLive = launch && now>=launch && (now-launch)/864e5 < 30;
  const btn = p => owns(p.id) ? `<span class="owned">มีแล้ว ✓</span>` : !p.ready ? `<span class="soon">เร็วๆ นี้</span>` : avail ? `<button class="btn sm" data-act="iap-buy" data-k="${p.id}">${PR.priceLabel(p)}</button>` : `<span class="soon">${PR.priceLabel(p)} · ในแอป iOS</span>`;
  const packs = PR.catalog.filter(p=>['stickers','cups','secret','decor'].includes(p.kind) || (p.kind==='opening' && openingLive));
  const fests = PR.catalog.filter(p=>p.kind==='festival');
  return `<div class="shop hd"><div class="H" style="font-size:24px">ของตกแต่งพิเศษ</div><div class="sub">ซื้อครั้งเดียวใช้ได้ตลอด · ของตกแต่งเท่านั้น ไม่มีผลกับการเล่น · ไม่มีกล่องสุ่ม · ไม่มีโฆษณา · ชำระผ่าน Apple</div>
    ${packs.map(p=>`<div class="srow"><div><b>${esc(p.th)}</b><div class="sub">${esc(p.desc||'')}</div></div>${btn(p)}</div>`).join('')}
    <div class="lbl">ของเทศกาล · ระหว่างเทศกาลใช้ฟรี หลังจบเทศกาลซื้อเก็บได้</div>
    <div class="festrow">${fests.map(p=>{ const live=Festivals.isLive(p.fest,now), past=Festivals.isPast(p.fest,now), f=Festivals.FESTIVALS.find(x=>x.k===p.fest)||{th:p.fest};
      return `<div class="fchip hd thin ${live?'live':''}"><b>${esc(f.th)}</b><small>${live?'ใช้ฟรีตอนนี้ ✦':owns(p.id)?'มีแล้ว ✓':past?(p.ready&&avail?`<button class="linkbtn" data-act="iap-buy" data-k="${p.id}">${PR.priceLabel(p)}</button>`:`${PR.priceLabel(p)} · เร็วๆ นี้`):'ยังไม่ถึงเทศกาล'}</small></div>`; }).join('')}</div>
    <button class="linkbtn" data-act="iap-restore">กู้คืนการซื้อ</button></div>`;
}
function tipHTML(){
  const PR=P.purchases, tips=PR.catalog.filter(p=>p.kind==='tip'), avail=PR.available();
  return `<div class="tipjar hd"><img src="${bImg('pe')}" alt=""><div><div class="H" style="font-size:22px">เลี้ยงกาแฟน้องเป็ด</div><div class="sub">ถ้าชอบร้านเล็กๆ นี้ เลี้ยงกาแฟน้องเป็ดได้นะ ไม่ปลดล็อกอะไร แค่น้องเป็ดดีใจมาก ♡ · ชำระผ่าน Apple เท่านั้น</div>
    <div class="chips" style="margin-top:8px">${tips.map(p=>`<button class="chip hd" data-act="iap-buy" data-k="${p.id}" ${avail?'':'disabled'}>${esc(p.th)} · ${PR.priceLabel(p)}</button>`).join('')}</div>
    ${avail?'':'<div class="sub" style="margin-top:6px">เลี้ยงกาแฟได้ในแอป iOS</div>'}${db.purchases.tips?`<div class="sub ok" style="margin-top:6px">ขอบคุณที่เคยเลี้ยงกาแฟ ${db.purchases.tips} ครั้งนะ ก๊าบ ♡</div>`:''}</div></div>`;
}
function tipThanks(){
  openSheet(`<div class="thanks" style="text-align:center"><div class="hearts" aria-hidden="true">${[...Array(7)].map((_,i)=>`<span style="left:${10+i*13}%;animation-delay:${i*.25}s">♡</span>`).join('')}</div><img src="${bImg('pe')}" alt="" style="width:160px;mix-blend-mode:multiply"><div class="H" style="margin-top:6px">ขอบคุณที่เลี้ยงกาแฟนะ!</div><p style="margin-top:6px">น้องเป็ดดีใจจนหางกระดิก ก๊าบ ก๊าบ ♡<br><span class="sub">ร้านเล็กๆ นี้อยู่ได้เพราะมีเธอแวะมานะ</span></p></div>`);
  SFX.play('quack',{vol:.4, rate:1.2}); SFX.play('quack',{vol:.3, rate:1.4, delay:.35}); P.haptic.play('success');
}
async function iapBuy(id){
  const PR=P.purchases, p=PR.catalog.find(x=>x.id===id); if (!p) return;
  const r = await PR.buy(id);
  if (r.status==='purchased'){ if (p.type==='consumable'){ db.purchases.tips++; save(); render(); tipThanks(); return; } db.purchases.owned[id]=todayKey(); save(); render(); toast(`ได้ "${p.th}" แล้ว ขอบคุณนะ ♡`,1); }
  else if (r.status==='pending') toast('รอการยืนยันจาก Apple นะ',1);
  else if (r.status==='unavailable') toast('การซื้อในแอปใช้ได้ในแอป iOS นะ',1);
}
/* ----- regulars' letters ----- */
function storyReader(key){
  const [k,i0]=key.split(':'), i=+i0, st=C.STORIES[k]; if (!st || !st.eps[i] || !storyOpen(k,i)) return;
  db.stories.read[key]=todayKey(); save(); const ep=st.eps[i], next=unreadStories()[0];
  openSheet(`<div class="letter"><div class="lhead"><img src="${whoImg(k)}" alt=""><div><div class="sub">จดหมายจาก${esc(whoName(k))} · ตอนที่ ${i+1}/${st.eps.length}</div><div class="H" style="font-size:26px">${esc(ep.t)}</div></div></div>
  <div class="lbody">${ep.body.split('\n').map(l=>`<p>${esc(l)}</p>`).join('')}</div>
  <div class="sub" style="font-size:12px;margin-top:10px">ร่างเนื้อเรื่อง (DRAFT) · รอคุณนัดดาตรวจ</div>
  <div style="display:flex;gap:10px;margin-top:14px">${next?`<button class="btn" style="flex:1" data-act="story" data-k="${next.join(':')}">ฉบับถัดไป ✉</button>`:''}<button class="btn soft hd" style="flex:1" data-act="close">เก็บจดหมาย</button></div></div>`);
  if (S.view==='home') { const y=app.scrollTop; render(); app.scrollTop=y; }
}
function storyShelf(){
  const ks=Object.keys(C.STORIES).filter(k=>k==='pe'||G(k));
  return `<div class="shelf">${ks.map(k=>{ const st=C.STORIES[k], met = k==='pe' ? stampCount()>=1 : !!db.guests[k], g=G(k), fr=k==='pe'?0:friendship(k);
    return `<div class="srow2 hd thin ${met?'':'unmet'}"><img src="${whoImg(k)}" alt=""><div style="flex:1"><b>${met?esc(st.th):'???'}</b><div class="eps">${st.eps.map((ep,i)=>{ const open=storyOpen(k,i), read=db.stories.read[storyKey(k,i)];
      return open?`<button class="ep hd thin ${read?'':'new'}" data-act="story" data-k="${k}:${i}" aria-label="ตอนที่ ${i+1} ${esc(ep.t)}">${read?'✉':'✉•'} ${i+1}</button>`:`<span class="ep lock" title="ปลดล็อกเมื่อ${met?`แวะมาเจอกันอีก ${ep.at-fr} ครั้ง`:'เจอกันครั้งแรก'}">🔒 ${i+1}</span>`; }).join('')}</div>
      <small class="sub">${k==='pe'?'จดหมายจากหัวหน้าบาร์':met?`มิตรภาพ ${fr} · นับจากวันที่แวะมาและออเดอร์ลึกลับที่ชงให้`:g&&g.fest?'มาเฉพาะช่วงวันผึ้งโลก (17–23 พ.ค.)':g?`มาเยี่ยมเมื่อครบ ${g.at} แสตมป์`:''}</small></div></div>`; }).join('')}</div>`;
}
/* ----- sheets ----- */
function openSheet(html){ $('#sheetBody').innerHTML=html; I18N.apply($('#sheetBody')); $('#sheet').classList.add('open'); $('#sheetBack').classList.add('open'); $('#sheet').scrollTop=0; }
function closeSheet(){ $('#sheet').classList.remove('open'); $('#sheetBack').classList.remove('open'); }
function detailSheet(k){
  const e=db.entries[k]; if(!e) return; const m=M(e.drink), b=B(e.barista), d=parseKey(k), mood=MOODS.find(x=>x.k===e.mood);
  const rows = [['เมนู',`${m.th} · ${tempOf(e)==='iced'?'เย็น':'ร้อน'}`], ...(e.size?[['ขนาด',`${(SIZES.find(z=>z.k===e.size)||{}).th}${e.price?` · ฿${e.price}`:''}`]]:[]), ...(tempOf(e)==='iced'?[['น้ำแข็ง',ICES[iceN(e)].th]]:[]), ...(e.sweet!==undefined?[['ความหวาน',(SWEETS.find(x=>x.k===e.sweet)||{}).th]]:[]), ...(isCoffee(m)?[['เมล็ด',(BEANS.find(x=>x.k===e.bean)||{}).th],['ช็อต',`${e.shots} ช็อต`]]:[['ผง',`${e.scoops} ช้อน · น้ำ ${e.water}°C`]]), ...(m.milk?[['นม',(MILKS.find(x=>x.k===e.milk)||{}).th]]:[]), ...(m.art&&tempOf(e)==='hot'?[['ลาเต้อาร์ต',(ARTS.find(x=>x.k===e.art)||{}).th]]:[]), ...(isCoffee(m)?[['ไซรัป',(SYRUPS.find(x=>x.k===e.syrup)||{}).th]]:[['ท็อปปิ้ง',(TOPS.find(x=>x.k===e.topping)||{}).th]]), ['แก้ว',(CUPS.find(x=>x.k===e.cup)||Object.values(VESSELS).flat().concat([DECAF_MUG]).find(x=>x.k===e.cup)||{}).th], ...(e.decaf?[['กาแฟ','ดีแคฟ']]:[]), ['บาริสต้า',`${b.th} (${b.prop})`], ...(e.guest&&G(e.guest)?[['แขกวันนั้น',G(e.guest).th]]:[])];
  openSheet(`<div style="text-align:center"><div class="sub">${thDate(d)}</div><div class="H" style="margin:4px 0 14px">${esc(m.th)}</div><div style="width:190px;margin:0 auto">${stampHTML(e)}</div>
  <div style="margin-top:14px;display:flex;align-items:center;justify-content:center;gap:8px;font:600 14px var(--fb)">${mood?faceSVG(mood.k,30)+'มู้ด '+mood.th:''}</div>${e.note?`<div class="desc hd thin" style="text-align:left"><span class="sub" style="font-size:12px">วันนี้เป็นไง</span><br>"${esc(e.note)}"</div>`:''}${e.mood?`<div class="sub" style="font-size:12.5px;margin-top:8px">${esc(B(e.barista).th)}: "${esc(replyFor(e))}"</div>`:''}</div>
  <dl class="kv">${rows.map(([a,c])=>`<dt>${a}</dt><dd>${esc(c||'-')}</dd>`).join('')}</dl>
  <div class="greet hd thin" style="margin:14px 0 0"><img src="${bImg(b.k)}" alt=""><span>บาริสต้าวันนี้: <b>${esc(b.th)}</b><br><span class="sub" style="font-size:12px">${esc(b.quirk)}</span></span></div>
  ${k===todayKey()?`<div style="display:flex;gap:10px;margin-top:16px"><button class="btn soft hd" style="flex:1" data-act="del">ลบแก้ววันนี้</button><button class="btn" style="flex:1" data-act="edit">แก้ไข / ชงใหม่</button></div>`:''}<button class="btn wide yel" style="margin-top:10px" data-act="story-day" data-k="${k}">การ์ดแก้ววันนั้น · สตอรี่ 9:16 ↗</button>`);
}
function aboutSheet(){
  openSheet(`<div class="H">เกี่ยวกับ Cupmori</div><div class="sub">คัพมอริ · ชงความรู้สึก เก็บวันของเรา</div><p style="line-height:1.6;margin-top:8px">Cupmori คือคาเฟ่เล็กๆ สำหรับทุกความรู้สึก ทุกวันเข้าร้าน เจอน้องเป็ดบาริสต้า ชงแก้ววันนี้เองทีละขั้น แล้วเก็บไว้เป็นแสตมป์ ข้อมูลทั้งหมดเก็บในเครื่องนี้เท่านั้น ไม่มีบัญชี ไม่มีโฆษณา</p>
  <p class="sub" style="margin-top:6px">ดาวน์โหลดฟรี · มีของตกแต่งให้ซื้อครั้งเดียวผ่าน Apple (ไม่มีผลกับการเล่น ไม่มีกล่องสุ่ม) · เมล็ดกาแฟหาได้จากการชงเท่านั้น ไม่มีขาย</p>
  <div class="lbl">น้องเป็ดบาริสต้าประจำร้าน (สุ่มมาชงให้ทุกวัน)</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">${LIVE.map(b=>`<div style="text-align:center;font:600 13px var(--fb)"><img src="${bImg(b.k)}" alt="" style="width:100%;aspect-ratio:1;object-fit:cover;mix-blend-mode:multiply;border-radius:14px">${b.th}</div>`).join('')}</div>
  <div class="lbl">เครดิต</div><ul style="font-size:14px;line-height:1.7;padding-left:18px">
  <li>ภาพประกอบใหม่ (แขก ฉากแขกในร้าน ผึ้งน้อย ห้องแต่งร้าน ของแต่งร้าน แก้วไม่มีน้ำแข็ง โซดาน้ำผึ้ง ฯลฯ): สร้างด้วย <b>Grok</b> ในสไตล์ดินสอสีเดียวกับร้าน</li><li>ภาพชุดแรกของร้าน (หน้าร้าน บาร์ แก้ว และน้องเป็ด): ภาพสไตล์ดินสอสีเดิมของโปรเจกต์ (ดู CREDITS.md)</li>
  <li>สติกเกอร์ หน้ามู้ด น้ำแข็ง ท็อปปิ้ง เกจ และกราฟ: SVG ที่เขียนด้วยโค้ด</li><li>ฟอนต์: Mali, Nunito, Noto Sans Thai (SIL Open Font License 1.1, ฝังในแอป)</li><li>เพลงโลไฟ: Seth_Makes_Sounds · เสียงบรรยากาศร้าน: Anya_Media (Freesound, CC0) · เสียงเอฟเฟกต์: Kenyset</li></ul>`);
}

/* ----- settings & backup ----- */
function settingsSheet(){
  const st=db.settings, h=hemiNow(), fest=Festivals.active(NOW()), se=Festivals.season(NOW(), h.hemi), perm=P.notify.permission();
  const TH_SEASON={spring:'ใบไม้ผลิ',summer:'ร้อน',autumn:'ใบไม้ร่วง',winter:'หนาว'};
  openSheet(`<div class="H">ตั้งค่า</div>
  <div class="lbl">เตือนชงแก้วทุกวัน</div><div class="sub" style="font-size:12.5px">${st.reminder?`ตอนนี้: ทุกวัน ${esc(st.reminder)} น.`:'ตอนนี้: ปิดอยู่'}${st.reminder&&perm!=='granted'?' · เครื่องนี้ไม่อนุญาตแจ้งเตือน จะเตือนในแอปตอนเปิดแทน':''}</div>${reminderForm(st.reminder)}
  <div class="lbl">ภาษา · Language</div>${chips([{k:'auto',th:`อัตโนมัติ (${I18N.deviceLang()==='en'?'English':'ไทย'})`},{k:'th',th:'ไทย'},{k:'en',th:'English'}],st.lang||'auto','set-lang')}
  <div class="lbl">ภาพเคลื่อนไหว</div><button class="vsw ${st.reduceMotion?'on':''}" data-act="rm-onoff" role="switch" aria-checked="${!!st.reduceMotion}"><i></i>ลดการเคลื่อนไหว (ไม่มีคอนเฟตตี้ ไอน้ำ และการเด้ง)</button>
  <div class="lbl">อากาศจริงสำหรับสูตรลับ</div><button class="vsw ${st.weatherOptIn?'on':''}" data-act="wx-onoff" role="switch" aria-checked="${!!st.weatherOptIn}"><i></i>ใช้ตำแหน่งโดยประมาณเพื่อดูอากาศวันนี้</button>
  <div class="sub" style="font-size:12.5px">ไม่บังคับ · ถ้าไม่เปิด แอปจะเดาอากาศจากฤดูกาลแทน · ตำแหน่งถูกปัดเป็นประมาณ 10 กม. ใช้ถามอากาศวันนี้เท่านั้น ไม่เก็บและไม่ส่งให้ใคร${st.weatherOptIn?` · วันนี้: ${(WX[weatherNow()]||{}).th||'-'}`:''}</div>
  <div class="lbl">การ์ดแชร์</div><button class="vsw ${st.shareNote?'on':''}" data-act="sharenote" role="switch" aria-checked="${!!st.shareNote}"><i></i>แสดงโน้ตส่วนตัวบนการ์ดแชร์ (ปิดไว้เป็นค่าเริ่มต้น)</button>
  <div class="lbl">การซื้อในแอป</div><button class="btn sm soft hd" data-act="iap-restore">กู้คืนการซื้อ</button>
  <div class="lbl">การสั่นตอบสนอง</div><button class="vsw ${P.haptic.enabled?'on':''}" data-act="haptic-onoff" role="switch" aria-checked="${P.haptic.enabled}"><i></i>สั่นเบาๆ ตอนชงและเก็บแสตมป์</button>
  <div class="lbl">ฤดูกาลตามซีกโลก</div>${chips([{k:'auto',th:`อัตโนมัติ (${h.source==='setting'?'ตั้งเอง':h.hemi==='S'?'ซีกโลกใต้':'ซีกโลกเหนือ'})`},{k:'N',th:'ซีกโลกเหนือ'},{k:'S',th:'ซีกโลกใต้'}],st.hemi,'set-hemi')}
  <div class="sub" style="font-size:12px;margin-top:6px">ตอนนี้: ฤดู${TH_SEASON[se.season]}${fest.length?` · เทศกาล: ${fest.map(f=>esc(f.th)).join(' + ')}`:''}</div>
  <div class="lbl">สำรอง & กู้คืนข้อมูล</div><div class="sub" style="font-size:12.5px">ข้อมูลอยู่ในเครื่องนี้เท่านั้น ถ้าเปลี่ยนเครื่องหรือล้างเบราว์เซอร์ ให้บันทึกไฟล์สำรองไว้ก่อน</div>
  <div style="display:flex;gap:10px;margin-top:8px"><button class="btn sm" data-act="backup">บันทึกไฟล์สำรอง ⤓</button><button class="btn sm soft hd" data-act="import">นำเข้าไฟล์สำรอง ⤒</button></div>
  <div class="lbl">ความเป็นส่วนตัว</div><div class="sub" style="font-size:12.5px">ไม่มีบัญชี ไม่มีโฆษณา ไม่มีการติดตาม · <a href="privacy.html">อ่านนโยบายความเป็นส่วนตัว</a></div>
  ${ENV.dev?devPanel():''}`);
}
function devPanel(){
  const d=NOW(), h=hemiNow();
  return `<div class="lbl">DEV · festival engine</div><pre class="devpre">${esc(JSON.stringify({ now:d.toString(), tz:ENV.timeZone(), region:ENV.region(), hemi:h, season:Festivals.season(d,h.hemi), active:Festivals.active(d).map(f=>f.k), weather:weatherNow(), mystery:mysteryToday().hint.k+' by '+mysteryToday().by, beans:db.beans, recipes:Object.keys(db.recipes).length, decor:db.decor, lang:I18N.lang, upcoming:Festivals.upcoming(d,90).map(f=>f.k+' '+keyOf(f.start)), stamps:stampCount(), guests:Object.keys(db.guests), usual:usualOrder(), tod:timeOfDay(), closing:closingSoon(), schema:db.v },null,1))}</pre>`;
}
/* ----- collection ----- */
function collectionSheet(){
  const met=metCounts(), nMet=LIVE.filter(b=>met[b.k]).length, best=bestStreak(), n=stampCount();
  openSheet(`<div class="sub">Cupmori · สะสม</div><div class="H">สมุดสะสมของฉัน</div>
  <div class="lbl" style="margin-top:12px">จดหมายจากขาประจำ · ปลดล็อกจากจำนวนครั้งที่เจอกัน (ไม่ต้องติดกัน)</div>
  ${storyShelf()}
  <div class="lbl" style="margin-top:16px">น้องเป็ดที่เคยเป็นบาริสต้าให้ (${nMet}/${LIVE.length})</div>
  <div class="ducks">${LIVE.map(b=>{ const n=met[b.k]||0; return `<div class="duckcard hd thin ${n?'':'unmet'}"><img src="${bImg(b.k)}" alt="${n?esc(b.th):'ยังไม่เจอ'}"><b>${n?esc(b.th):'???'}</b><small>${n?`เจอ ${n} ครั้ง`:'ยังไม่เจอ'}</small></div>`; }).join('')}</div>
  ${RANDOM_BARISTA?'':'<div class="sub" style="font-size:12px;margin-top:8px">ตอนนี้เป๊ะประจำบาร์ทุกวัน · น้องเป็ดตัวอื่นกำลังเตรียมผ้ากันเปื้อน จะเริ่มสุ่มมาเป็นบาริสต้าเร็วๆ นี้ ✿</div>'}
  <div class="lbl" style="margin-top:16px">แขกรับเชิญ · สะสมแล้ว ${n} แสตมป์ (ปลดล็อกแล้วอยู่ถาวร)</div>
  <div class="ducks">${GUESTS.map(g=>{ const ok=!!db.guests[g.k]; return `<div class="duckcard hd thin ${ok?'':'unmet'}"><img src="${IMG}g-${g.k}.webp" alt="${ok?esc(g.th):'ยังไม่ปลดล็อก'}"><b>${ok?esc(g.th):'???'}</b><small>${ok?esc(g.role):g.fest?'มาช่วงวันผึ้งโลก 17–23 พ.ค.':`ครบ ${g.at} แสตมป์ · อีก ${Math.max(0,g.at-n)}`}</small></div>`; }).join('')}</div>
  ${db.guests.redpanda?'<div class="sub" style="font-size:12px;margin-top:6px">✦ เมนูลับ "เมเปิลซินนามอนลาเต้" เปิดแล้วในหมวดกาแฟ</div>':''}
  <div class="lbl" style="margin-top:16px">ของตกแต่งโบนัสจากสตรีค · สถิติติดกันยาวสุด ${best} วัน</div>
  <div class="rewards">${REWARDS.map(r=>{ const ok=best>=r.d; return `<div class="reward hd thin ${ok?'ok':''}"><span class="ricon">${r.type==='sleeve'?`<i class="rsl" style="border-color:${SLEEVES.find(x=>x.k===r.k).c}"></i>`:miniSticker(r.k)}</span><div style="flex:1"><b>${r.th}</b><div class="sub" style="font-size:12px">${ok?'ปลดล็อกแล้ว ใช้ได้ที่ขั้น "แต่งแก้ว" ✓':`สะสมติดกัน ${r.d} วัน · อีก ${r.d-best} วัน`}</div><div class="mix hd thin" style="margin-top:6px;height:10px"><i style="width:${Math.min(100,best/r.d*100)}%;background:${ok?'#9DBF6A':'#F2C94C'}"></i></div></div></div>`; }).join('')}</div>
  <div class="sub" style="font-size:11.5px;margin-top:10px">* นับจากสถิติดีที่สุด ขาดวันไม่รีเซ็ตและไม่เสียอะไร · ข้อมูลตัวอย่างไม่นับรวม</div>`);
}
/* ----- summary ----- */
function stats(y,m){
  const ents = monthEntries(y,m).sort((a,b)=>a[0]<b[0]?-1:1);
  const cnt={coffee:0,matcha:0,other:0}, drinks={}, cups={}, bar={}, moods={}; let shots=0;
  ents.forEach(([,e])=>{ const mm=M(e.drink); cnt[mm.cat]++; drinks[mm.k]=(drinks[mm.k]||0)+1; cups[e.cup]=(cups[e.cup]||0)+1; bar[e.barista]=(bar[e.barista]||0)+1; if(e.mood) moods[e.mood]=(moods[e.mood]||0)+1; shots+=e.shots||0; });
  const top = o => Object.entries(o).sort((a,b)=>b[1]-a[1])[0];
  let best=0, run=0, prev=null;
  ents.forEach(([k])=>{ const d=parseKey(k); run = prev && (d-prev)/864e5===1 ? run+1 : 1; best=Math.max(best,run); prev=d; });
  let cur=0; const t=NOW(); t.setHours(0,0,0,0); let d=new Date(t); if(!db.entries[keyOf(d)]) d.setDate(d.getDate()-1);
  while (db.entries[keyOf(d)]){ cur++; d.setDate(d.getDate()-1); }
  return { n:ents.length, days:new Date(y,m+1,0).getDate(), cnt, shots, best, cur, drink:top(drinks), cup:top(cups), bar:top(bar), mood:top(moods), ents };
}
function donutSVG(cnt, size=150){
  const tot = cnt.coffee+cnt.matcha+cnt.other || 1, r=52, C=2*Math.PI*r; let off=0;
  const segs = ['coffee','matcha','other'].map(c=>{ const f=cnt[c]/tot; const s=`<circle r="${r}" fill="none" stroke="${CAT[c].c}" stroke-width="26" stroke-dasharray="${f*C} ${C}" stroke-dashoffset="${-off*C}" transform="rotate(-90)"/>`; off+=f; return f?s:''; }).join('');
  return `<svg width="${size}" height="${size}" viewBox="-75 -75 150 150"><g style="filter:url(#pencil)">${segs}</g><circle r="66" fill="none" stroke="#49342B" stroke-width="2" style="filter:url(#wob)" opacity=".7"/><circle r="38" fill="none" stroke="#49342B" stroke-width="2" style="filter:url(#wob)" opacity=".7"/></svg>`;
}
function summarySheet(){
  const y=S.calY, m=S.calM, s=stats(y,m), tot=s.n||1;
  if (!s.n){ openSheet(`<div class="H">${summaryTitle(m,y)}</div><p class="sub" style="margin:10px 0 16px">ยังไม่มีแสตมป์ในเดือนนี้เลย ลองชงแก้วแรก หรือเติมข้อมูลตัวอย่างดูก่อนก็ได้</p><button class="btn wide" data-act="demo">เติมข้อมูลตัวอย่าง</button>`); return; }
  const bb = B(s.bar[0]);
  openSheet(`<div class="sub">Cupmori · ชงความรู้สึก เก็บวันของเรา</div><div class="H">${summaryTitle(m,y)}</div>
  <div class="donutrow">${donutSVG(s.cnt)}<div class="legend">${['coffee','matcha','other'].map(c=>`<div><i style="background:${CAT[c].c}"></i>${CAT[c].th} ${Math.round(s.cnt[c]/tot*100)}% <span class="sub" style="font-size:12px">(${s.cnt[c]})</span></div>`).join('')}</div></div>
  <div class="tiles" style="margin-top:12px"><div class="tile hd thin">สะสม<b>${s.n}/${s.days}</b>วัน</div><div class="tile hd thin">ช็อตรวม<b>${s.shots}</b>${unitOf('ช็อต',s.shots)}</div><div class="tile hd thin">สตรีคยาวสุด<b>${s.best}</b>วันติด</div>
  <div class="tile hd thin">สตรีคตอนนี้<b>${s.cur}</b>วัน</div><div class="tile hd thin">เมนูโปรด<b style="font-size:16px">${esc(M(s.drink[0]).th)}</b>${s.drink[1]} แก้ว</div><div class="tile hd thin">แก้วโปรด<b style="font-size:16px">${esc(cupName(s.cup[0])||'-')}</b>${s.cup[1]} ครั้ง</div></div>
  <div class="greet hd thin" style="margin:12px 0 0"><img src="${bImg(bb.k)}" alt=""><span>บาริสต้าประจำเดือน: <b>${esc(bb.th)}</b> (${s.bar[1]} ครั้ง)<br><span class="sub" style="font-size:12px">${s.mood?`มู้ดยอดฮิต: ${esc(MOODS.find(x=>x.k===s.mood[0]).th)}`:''}</span></span></div>
  <div class="lbl" style="margin-top:16px">การ์ดแชร์ (PNG)</div><img class="sharecv" id="shareImg" alt="การ์ดสรุปเดือน"><div style="display:flex;gap:10px;margin-top:12px"><button class="btn wide" data-act="dl">ดาวน์โหลด PNG ⤓</button><button class="btn soft hd" data-act="share">แชร์ ↗</button></div><button class="btn wide yel" style="margin-top:10px" data-act="story-month">การ์ดสตอรี่ 9:16 (IG / TikTok) ✦</button>`);
  makeCard(y,m,s).then(url=>{ const im=$('#shareImg'); if(im) im.src=url; }).catch(err=>{ console.warn(err); });
}
/* Thai-safe wrapping: break on word segments (never inside a syllable/diacritic) */
function wrapText(x, str, X, Y, maxW, lh, maxLines){ str = I18N.t(str);
  const segs = typeof Intl!=='undefined' && Intl.Segmenter ? [...new Intl.Segmenter('th',{granularity:'word'}).segment(str)].map(s=>s.segment) : str.split(/(\s+)/);
  const lines=[]; let cur='';
  for (const sg of segs){ if (x.measureText(cur+sg).width>maxW && cur){ lines.push(cur); cur=sg.trimStart(); } else cur+=sg; }
  if (cur) lines.push(cur);
  const out=lines.slice(0,maxLines); if (lines.length>maxLines){ let l=out[maxLines-1]; while (l.length>1 && x.measureText(l+'…').width>maxW) l=l.slice(0,-1); out[maxLines-1]=l+'…'; }
  out.forEach((l,i)=>x.fillText(l,X,Y+i*lh));
}
/* canvas text that always fits its box: shrink, then ellipsis */
const fontsReady = () => Promise.all(['700 40px Mali','600 30px "Noto Sans Thai"','400 30px "Noto Sans Thai"','600 30px Nunito'].map(f=>document.fonts.load(f).catch(()=>null)));
function fitText(x, str, X, Y, maxW, px, w='700', fam='Mali', min=20){
  str = I18N.t(str); let f=px; x.font=`${w} ${f}px ${fam}`;
  while (x.measureText(str).width>maxW && f>min){ f-=2; x.font=`${w} ${f}px ${fam}`; }
  let t=str; if (x.measureText(t).width>maxW){ while (t.length>1 && x.measureText(t+'…').width>maxW) t=t.slice(0,-1); t+='…'; }
  x.fillText(t, X, Y); return f;
}
const loadImg = src => new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; });
let cardURL=null, cardBlob=null;
async function makeCard(y,m,s){
  await fontsReady();
  const W=1080,H=1350, c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d');
  const ink='#49342B';
  x.fillStyle='#FFF8EC'; x.fillRect(0,0,W,H);
  // paper grain
  for(let i=0;i<9000;i++){ x.fillStyle=`rgba(90,70,54,${Math.random()*.05})`; x.fillRect(Math.random()*W,Math.random()*H,2,2); }
  const wob = (fn) => { x.save(); fn(); x.restore(); };
  const rr = (X,Y,w,h,r,fill,stroke) => { x.beginPath(); const j=()=> (Math.random()-.5)*2.2; x.moveTo(X+r,Y+j()); x.lineTo(X+w-r,Y+j()); x.quadraticCurveTo(X+w,Y,X+w+j(),Y+r); x.lineTo(X+w+j(),Y+h-r); x.quadraticCurveTo(X+w,Y+h,X+w-r,Y+h+j()); x.lineTo(X+r,Y+h+j()); x.quadraticCurveTo(X,Y+h,X+j(),Y+h-r); x.lineTo(X+j(),Y+r); x.quadraticCurveTo(X,Y,X+r,Y); x.closePath(); if(fill){x.fillStyle=fill;x.fill();} if(stroke){x.strokeStyle=stroke;x.lineWidth=4;x.stroke();} };
  rr(30,30,W-60,H-60,48,null,ink);
  x.fillStyle='#F5D778'; [[90,110,22],[980,150,18],[960,1200,22],[110,1230,16],[700,90,14]].forEach(([a,b,r])=>{ x.font=`${r*2}px Mali`; x.fillText('★',a,b); });
  x.fillStyle=ink; x.textAlign='center';
  x.font='600 30px "Noto Sans Thai"'; x.fillText('Cupmori · ชงความรู้สึก เก็บวันของเรา',W/2,120);
  x.font='700 74px Mali'; x.fillText(summaryTitle(m,y),W/2,210);
  // donut
  const tot=s.n||1; let a0=-Math.PI/2; const cx=290, cy=440;
  ['coffee','matcha','other'].forEach(k=>{ const f=s.cnt[k]/tot; if(!f) return; x.beginPath(); x.strokeStyle=CAT[k].c; x.lineWidth=78; x.arc(cx,cy,135,a0,a0+f*Math.PI*2); x.stroke(); a0+=f*Math.PI*2; });
  x.lineWidth=4; x.strokeStyle=ink; x.beginPath(); x.arc(cx,cy,175,0,7); x.stroke(); x.beginPath(); x.arc(cx,cy,96,0,7); x.stroke();
  x.font='700 54px Mali'; x.fillText(`${s.n}`,cx,cy+12); x.font='600 24px "Nunito","Noto Sans Thai"'; x.fillText(unitOf('แก้ว',s.n),cx,cy+46);
  x.textAlign='left';
  ['coffee','matcha','other'].forEach((k,i)=>{ const yy=360+i*80; x.fillStyle=CAT[k].c; x.beginPath(); x.arc(540,yy-12,20,0,7); x.fill(); x.strokeStyle=ink; x.lineWidth=3; x.stroke(); x.fillStyle=ink; x.font='700 40px Mali'; x.fillText(`${CAT[k].th} ${Math.round(s.cnt[k]/tot*100)}%`,580,yy); });
  // tiles
  const tiles=[['สะสม',`${s.n}/${s.days}`,'วัน'],['ช็อตรวม',`${s.shots}`,unitOf('ช็อต',s.shots)],['สตรีคยาวสุด',`${s.best}`,'วันติด'],['เมนูโปรด',M(s.drink[0]).th,`${s.drink[1]} แก้ว`]];
  tiles.forEach((t,i)=>{ const X=70+i*240, Y=660; rr(X,Y,220,170,30,'#FFFDF7',ink); x.fillStyle=ink; x.textAlign='center'; x.font='600 24px "Nunito","Noto Sans Thai"'; x.fillText(t[0],X+110,Y+44); fitText(x,t[1],X+110,Y+112,196,58,'700','Mali'); x.font='600 22px "Nunito","Noto Sans Thai"'; x.fillText(t[2],X+110,Y+148); });
  // barista
  const bb=B(s.bar[0]); rr(70,870,940,150,40,'#FFE7A3',ink);
  try { const bi=await loadImg(bImg(bb.k)); x.save(); x.beginPath(); x.arc(160,945,62,0,7); x.closePath(); x.fillStyle='#FFFDF7'; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; x.drawImage(bi,98,872,124,124); x.restore(); } catch(e){}
  x.textAlign='left'; x.fillStyle=ink; x.font='600 26px "Nunito","Noto Sans Thai"'; x.fillText('บาริสต้าประจำเดือน',250,925); fitText(x,`${bb.th} · ${s.bar[1]} ครั้ง`,250,985,730,50,'700','Mali');
  // stamps grid
  const ents=s.ents.slice(0,33), cols=11, cell=84;
  const imgs = await Promise.all([...new Set(ents.map(([,e])=>imgOf(e)))].map(async k=>[k, await loadImg(`${IMG}d-${k}.webp`).catch(()=>null)]));
  const IM=Object.fromEntries(imgs);
  ents.forEach(([k,e],i)=>{ const col=i%cols,row=Math.floor(i/cols), X=82+col*cell+cell/2, Y=1080+row*cell+cell/2; const mm=M(e.drink);
    x.save(); x.beginPath(); x.arc(X,Y,37,0,7); x.fillStyle=TINT[imgOf(e)]; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; if(IM[imgOf(e)]) x.drawImage(IM[imgOf(e)],X-42,Y-42,84,84); x.restore();
    x.setLineDash([6,5]); x.strokeStyle=ink; x.lineWidth=2.5; x.beginPath(); x.arc(X,Y,38,0,7); x.stroke(); x.setLineDash([]); });
  x.textAlign='center'; x.font='600 24px "Nunito","Noto Sans Thai"'; x.fillStyle='#8A7262'; x.fillText('#Cupmori  #คัพมอริ',W/2,H-56);
  return new Promise(res=>c.toBlob(b=>{ cardBlob=b; if(cardURL) URL.revokeObjectURL(cardURL); cardURL=URL.createObjectURL(b); res(cardURL); },'image/png'));
}

/* ----- 9:16 story cards (IG / TikTok) ----- */
const svgImg = (svg) => loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replace(/ filter="url\(#wob\)"/g,'').replace(/ class="[^"]*"/g,'').replace(/ style="[^"]*"/g,'')));
function paper(x,W,H){
  x.fillStyle='#FFF8EC'; x.fillRect(0,0,W,H);
  let seed=7; const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; }; // deterministic grain: identical every export
  for(let i=0;i<14000;i++){ x.fillStyle=`rgba(90,70,54,${rnd()*.045})`; x.fillRect(rnd()*W,rnd()*H,2,2); }
}
function rrect(x,X,Y,w,h,r,fill,stroke,lw=4){ x.beginPath(); x.roundRect(X,Y,w,h,r); if(fill){x.fillStyle=fill;x.fill();} if(stroke){x.strokeStyle=stroke;x.lineWidth=lw;x.stroke();} }
async function drawStamp(x, e, cx, cy, R){
  const im=imgOf(e), art=await loadImg(`${IMG}d-${im}.webp`).catch(()=>null), sc=(SIZES.find(z=>z.k===e.size)||SIZES[2]).sc;
  x.save(); x.beginPath(); x.arc(cx,cy,R,0,7); x.fillStyle=TINT[im]||'#F8E6CF'; x.fill(); x.clip();
  x.globalCompositeOperation='multiply'; if(art){ const s2=R*2*sc; x.drawImage(art,cx-s2/2,cy-s2/2,s2,s2); } x.restore();
  const fx=artFX(e); if(fx){ const fi=await svgImg(fx).catch(()=>null); if(fi){ const s2=R*2*sc; x.drawImage(fi,cx-s2/2,cy-s2/2,s2,s2); } }
  x.setLineDash([14,11]); x.strokeStyle='#49342B'; x.globalAlpha=.55; x.lineWidth=5; x.beginPath(); x.arc(cx,cy,R+10,0,7); x.stroke(); x.setLineDash([]); x.globalAlpha=1;
  const sl=(SLEEVES.find(z=>z.k===e.sleeve)||{}).c; if(sl){ x.strokeStyle=sl; x.globalAlpha=.9; x.lineWidth=22; x.beginPath(); x.arc(cx,cy,R+30,0,7); x.stroke(); x.globalAlpha=1; }
  for (const [i,k] of (e.stickers||[]).entries()){ const si=await (STICKER_IMG[k] ? loadImg(STICKER_IMG[k]) : svgImg(miniSticker(k))).catch(()=>null); if(si){ const p=STK_POS[i]; x.drawImage(si, cx-R+p[0]/100*2*R, cy-R+p[1]/100*2*R, R*.48, R*.48); } }
}
async function storyCard(kind, key){
  await fontsReady();
  const W=1080,H=1920, c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'), ink='#49342B';
  paper(x,W,H); rrect(x,36,36,W-72,H-72,56,null,ink,5);
  x.fillStyle='#F5D778'; [[100,130,22],[960,170,18],[950,1780,22],[120,1800,16]].forEach(([a,b,r])=>{ x.font=`${r*2}px Mali`; x.fillText('★',a,b); });
  x.fillStyle=ink; x.textAlign='center'; x.font='700 40px Mali'; x.fillText('Cupmori',W/2,140); x.font='600 26px "Noto Sans Thai"'; x.fillText('ชงความรู้สึก เก็บวันของเรา',W/2,182);
  if (kind==='day'){
    const e=db.entries[key], m=M(e.drink), b=B(e.barista), mood=MOODS.find(z=>z.k===e.mood);
    fitText(x,'แก้ววันนี้',W/2,250,900,84); x.font='600 34px "Nunito","Noto Sans Thai"'; x.fillText(thDate(parseKey(key)),W/2,310);
    await drawStamp(x,e,W/2,700,300);
    x.fillStyle=ink; fitText(x,m.th,W/2,1135,900,92);
    const opt=[tempOf(e)==='iced'?'เย็น':'ร้อน', tempOf(e)==='iced'?ICES[iceN(e)].th:null, (SIZES.find(z=>z.k===e.size)||{}).th, (SWEETS.find(z=>z.k===e.sweet)||{}).th, m.milk?(MILKS.find(z=>z.k===e.milk)||{}).th:null].filter(Boolean).join(' · ');
    fitText(x,opt,W/2,1200,920,36,'600','"Nunito","Noto Sans Thai"');
    let y=1270;
    if (mood){ const fi=await svgImg(faceSVG(mood.k,90)).catch(()=>null); x.font='700 44px Mali'; const tw=x.measureText('มู้ด '+mood.th).width; const X0=W/2-(tw+110)/2; if(fi) x.drawImage(fi,X0,y,90,90); x.textAlign='left'; x.fillText('มู้ด '+mood.th,X0+110,y+62); x.textAlign='center'; y+=130; }
    if (e.note && db.settings.shareNote){ rrect(x,110,y,W-220,120,36,'#FFFDF7',ink,3); x.fillStyle=ink; fitText(x,`"${e.note}"`,W/2,y+76,W-280,44,'600','"Nunito","Noto Sans Thai"'); y+=160; }
    rrect(x,110,y,W-220,190,44,'#FFE7A3',ink,4);
    try{ const bi=await loadImg(bImg(b.k)); x.save(); x.beginPath(); x.arc(220,y+95,70,0,7); x.fillStyle='#FFFDF7'; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; x.drawImage(bi,150,y+25,140,140); x.restore(); }catch(err){}
    x.fillStyle=ink; x.textAlign='left'; x.font='600 30px "Nunito","Noto Sans Thai"'; x.fillText(`บาริสต้าวันนี้: ${b.th}`,320,y+70);
    x.font='500 30px "Nunito","Noto Sans Thai"'; wrapText(x, replyFor(e), 320, y+118, 620, 40, 2);
  } else {
    const [y0,m0]=key.split('-').map(Number), st=stats(y0,m0), tot=st.n||1;
    fitText(x,summaryTitle(m0,y0),W/2,270,920,84);
    let a0=-Math.PI/2; const cx=W/2, cy=640;
    ['coffee','matcha','other'].forEach(k=>{ const f=st.cnt[k]/tot; if(!f) return; x.beginPath(); x.strokeStyle=CAT[k].c; x.lineWidth=110; x.arc(cx,cy,200,a0,a0+f*Math.PI*2); x.stroke(); a0+=f*Math.PI*2; });
    x.lineWidth=5; x.strokeStyle=ink; x.beginPath(); x.arc(cx,cy,258,0,7); x.stroke(); x.beginPath(); x.arc(cx,cy,142,0,7); x.stroke();
    x.fillStyle=ink; x.font='700 96px Mali'; x.fillText(`${st.n}`,cx,cy+20); x.font='600 34px "Nunito","Noto Sans Thai"'; x.fillText(unitOf('แก้ว',st.n),cx,cy+70);
    x.font='700 38px Mali'; x.fillText(['coffee','matcha','other'].map(k=>`${CAT[k].th} ${Math.round(st.cnt[k]/tot*100)}%`).join('   '),W/2,980);
    const tiles=[['สะสม',`${st.n}/${st.days}`,'วัน'],['สตรีคยาวสุด',`${st.best}`,'วันติด'],['เมนูโปรด',st.drink?M(st.drink[0]).th:'-',st.drink?`${st.drink[1]} แก้ว`:'']];
    tiles.forEach((t,i)=>{ const X=90+i*310, Y=1040; rrect(x,X,Y,280,200,36,'#FFFDF7',ink,4); x.fillStyle=ink; x.textAlign='center'; x.font='600 28px "Nunito","Noto Sans Thai"'; x.fillText(t[0],X+140,Y+52); fitText(x,t[1],X+140,Y+128,248,66); x.font='600 26px "Nunito","Noto Sans Thai"'; x.fillText(t[2],X+140,Y+174); });
    if (st.bar){ const bb=B(st.bar[0]); rrect(x,90,1280,900,150,44,'#FFE7A3',ink,4); try{ const bi=await loadImg(bImg(bb.k)); x.save(); x.beginPath(); x.arc(180,1355,58,0,7); x.fillStyle='#FFFDF7'; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; x.drawImage(bi,122,1297,116,116); x.restore(); }catch(err){} x.fillStyle=ink; x.textAlign='left'; x.font='600 28px "Nunito","Noto Sans Thai"'; x.fillText('บาริสต้าประจำเดือน',270,1335); fitText(x,`${bb.th} · ${st.bar[1]} ครั้ง`,270,1395,690,46); x.textAlign='center'; }
    const ents=st.ents.slice(0,24), cols=8, cell=110;
    for (const [i,[k,e]] of ents.entries()){ const X=W/2-(cols*cell)/2+(i%cols)*cell+cell/2, Y=1520+Math.floor(i/cols)*cell; const im=imgOf(e), art=await loadImg(`${IMG}d-${im}.webp`).catch(()=>null);
      x.save(); x.beginPath(); x.arc(X,Y,48,0,7); x.fillStyle=TINT[im]||'#F8E6CF'; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; if(art) x.drawImage(art,X-54,Y-54,108,108); x.restore(); x.setLineDash([7,6]); x.strokeStyle=ink; x.lineWidth=3; x.beginPath(); x.arc(X,Y,50,0,7); x.stroke(); x.setLineDash([]); }
  }
  x.textAlign='center'; x.fillStyle='#8A7262'; x.font='600 30px "Nunito","Noto Sans Thai"'; x.fillText('#Cupmori  #คัพมอริ',W/2,H-80);
  return new Promise(res=>c.toBlob(res,'image/png'));
}
let story={blob:null,url:null,name:''};
async function storySheet(kind, key){
  openSheet(`<div class="H">${kind==='day'?'การ์ดแก้ววันนี้':'การ์ดสรุปเดือน'} · สตอรี่ 9:16</div><div class="sub" style="font-size:12.5px;margin:4px 0 10px">ขนาด 1080×1920 พร้อมลง IG / TikTok Story</div>${kind==='day'&&db.entries[key]&&db.entries[key].note?`<button class="vsw ${db.settings.shareNote?'on':''}" data-act="sharenote" data-k="${key}" role="switch" aria-checked="${!!db.settings.shareNote}"><i></i>แสดงโน้ตส่วนตัวบนการ์ด</button>`:''}<img class="storyimg" id="storyImg" alt="การ์ดสตอรี่"><div class="storyload" id="storyLoad">กำลังวาดการ์ด...</div><div style="display:flex;gap:10px;margin-top:12px"><button class="btn wide" data-act="story-share">แชร์ ↗</button><button class="btn soft hd" data-act="story-dl">ดาวน์โหลด ⤓</button></div>`);
  try { const b=await storyCard(kind,key); if(story.url) URL.revokeObjectURL(story.url); story={blob:b,url:URL.createObjectURL(b),name:`cupmori-${kind==='day'?'day':'month'}-${key}.png`}; const im=$('#storyImg'); if(im){ im.src=story.url; $('#storyLoad').remove(); } }
  catch(err){ console.warn(err); const l=$('#storyLoad'); if(l) l.textContent='สร้างการ์ดไม่สำเร็จ ลองใหม่อีกครั้ง'; }
}
function downloadBlob(blob,name){ P.share.download(blob,name); }
async function shareBlob(blob,url,name){
  const r = await P.share.png(blob, name);
  if (r==='downloaded') toast('เครื่องนี้แชร์ไฟล์ตรงไม่ได้ เลยดาวน์โหลด PNG ให้แทนนะ',1);
  if (r==='shared') P.haptic.play('success');
}
/* ----- demo ----- */
function demo(){
  const now=NOW(); let added=0;
  for (let i=1;i<=45;i++){
    const d=new Date(now); d.setDate(d.getDate()-i); const k=keyOf(d);
    if (db.entries[k] || Math.random()<.14) continue;
    const r=Math.random(), pool = (r<.45 ? MENU.filter(m=>m.cat==='coffee') : r<.82 ? MENU.filter(m=>m.cat==='matcha') : MENU.filter(m=>m.cat==='other')).filter(m=>!m.season);
    const m=pool[Math.floor(Math.random()*pool.length)], temp=m.temp||(Math.random()<.55?'iced':'hot');
    db.entries[k] = { drink:m.k, barista:LIVE[Math.floor(Math.random()*LIVE.length)].k, temp, bean:BEANS[Math.floor(Math.random()*4)].k, grind:'fine', shots:isCoffee(m)?1+Math.floor(Math.random()*3):0, milk:MILKS[Math.floor(Math.random()*4)].k, art:ARTS[Math.floor(Math.random()*3)].k, syrup:SYRUPS[Math.floor(Math.random()*5)].k, scoops:2, water:80, topping:TOPS[Math.floor(Math.random()*5)].k, cup:temp==='iced'?(Math.random()<.6?'tumbler':'glass'):(Math.random()<.6?'mug':'paper'), sleeve:SLEEVES[Math.floor(Math.random()*7)].k, size:SIZES[Math.floor(Math.random()*3)].k, ice:String(1+Math.floor(Math.random()*5)), sweet:SWEETS[Math.floor(Math.random()*5)].k, stickers:STK.filter(()=>Math.random()<.18).slice(0,3), mood:MOODS[Math.floor(Math.random()*8)].k, note:'', ts:+d, demo:true };
    added++;
  }
  save(); closeSheet(); S.calY=now.getFullYear(); S.calM=now.getMonth(); go('home'); toast(`เติมแสตมป์ตัวอย่าง ${added} วันแล้ว ✦`, 1);
}

/* ----- confetti ----- */
function confetti(){
  const cv=$('#confetti'), x=cv.getContext('2d'), r=cv.getBoundingClientRect(); cv.width=r.width*devicePixelRatio; cv.height=r.height*devicePixelRatio; x.scale(devicePixelRatio,devicePixelRatio);
  const cols=['#FFD866','#F8C4A4','#F4A9B8','#BFE3C4','#B8DCF2','#E8896A'];
  const P=[...Array(140)].map(()=>({x:r.width/2+(Math.random()-.5)*80,y:r.height*.35,vx:(Math.random()-.5)*9,vy:-Math.random()*10-4,s:5+Math.random()*7,c:cols[Math.floor(Math.random()*6)],a:Math.random()*6,va:(Math.random()-.5)*.3,star:Math.random()<.3}));
  let f=0; (function tick(){ x.clearRect(0,0,r.width,r.height); P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=.28; p.vx*=.99; p.a+=p.va; x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillStyle=p.c; if(p.star){ x.font=`${p.s*2}px Mali`; x.fillText('★',0,0);} else x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.66); x.restore(); }); if(++f<170) requestAnimationFrame(tick); else x.clearRect(0,0,r.width,r.height); })();
}

/* ---------- sound settings popover ---------- */
function renderVolPop(){
  const sl = (k, label, icon) => { const v=Math.round(SFX.vol(k)*100); return `<label class="vrow"><span>${icon} ${label}</span><input type="range" min="0" max="100" step="5" value="${v}" data-vol="${k}" aria-label="ระดับเสียง${label}"><b id="vv-${k}">${v}%</b></label>`; };
  $('#volPop').innerHTML = `<div class="vhead"><b>ตั้งค่าเสียง</b><button class="vx" data-act="bgm" aria-label="ปิด">✕</button></div>
    <button class="vsw ${SFX.bgm?'on':''}" data-act="bgm-onoff" role="switch" aria-checked="${SFX.bgm}"><i></i>เพลง & เสียงบรรยากาศร้าน</button>
    ${sl('music','เพลง',ICONS.note)}${sl('amb','เสียงร้าน',ICONS.cup)}
    <button class="vsw ${SFX.muted?'':'on'}" data-act="sfx-onoff" role="switch" aria-checked="${!SFX.muted}"><i></i>เสียงเอฟเฟกต์</button>
    ${sl('sfx','เอฟเฟกต์',ICONS.bell)}
    <div class="vnote">ตั้งค่าจะจำไว้ในเครื่องนี้</div>`;
}
function toggleVolPop(force){
  const p=$('#volPop'), open = force!==undefined ? force : p.hidden;
  if (open) renderVolPop(); p.hidden=!open; $('#bgmBtn').setAttribute('aria-expanded', open);
}
document.addEventListener('pointerdown', e=>{ const p=$('#volPop'); if(!p.hidden && !p.contains(e.target) && !e.target.closest('#bgmBtn')) toggleVolPop(false); });
document.addEventListener('input', e=>{ const k=e.target.dataset && e.target.dataset.vol; if(!k) return; const v=+e.target.value; SFX.setVol(k, v/100); $('#vv-'+k).textContent=v+'%'; });
document.addEventListener('change', e=>{ if (e.target.dataset && e.target.dataset.vol==='sfx') SFX.play('tap',{vol:.4}); });
/* ---------- sound mapping ---------- */
function sfxFor(a, t){
  if (a==='mute'||a==='bgm') return;
  const P=S.prog||{};
  if (a==='next') return SFX.play('next',{vol:.32, rate:1.15});
  if (a==='back'||a==='quit'||a==='home'||a==='close') return SFX.play('next',{vol:.22, rate:.95});
  if (a==='cat') return SFX.play('bubble',{vol:.22, rate:1.2});
  if (a==='pick') return SFX.play('blip',{vol:.35, rate:1.1});
  if (a==='startbrew') return SFX.play('chime',{vol:.22});
  if (a==='scoop'){ if(!P.ice){ SFX.play('clink',{vol:.35, rate:1+Math.random()*.25}); SFX.buzz(6); SFX.play('ice',{vol:.3, rate:1.5+Math.random()*.3, delay:.07}); } return; }
  if (a==='opt-temp'&&t.dataset.k==='iced'||a==='opt-ice'||a==='set-ice') return SFX.play('ice',{vol:.4, rate:1.3});
  if (a==='pourwater'||a==='coldmilk'||a==='pour') return SFX.play('pour',{vol:.3});
  if (a==='pull') return SFX.play('pour',{vol:.2, rate:.85});
  if (a==='sift') return SFX.play('tap',{vol:.3, rate:1+Math.random()*.4});
  if (a==='stk'||a==='set-mood') return SFX.play('plop',{vol:.25, rate:1.15});
  SFX.play('tap',{vol:.3, rate:1.1});
}
/* ---------- events ---------- */
document.addEventListener('click', ev=>{
  const g = ev.target.closest('[data-go]');
  if (g){ const v=g.dataset.go; closeSheet();
    if (v==='home') go('home');
    if (v==='start'){ S.extra=false; if (db.entries[todayKey()] && S.view!=='cafe'){ S.view='home'; render(); detailSheet(todayKey()); return; } S.edit=false; S.draft=null; enterCafe(); }
    if (v==='summary'){ if (S.view!=='home') go('home'); setTimeout(summarySheet, 60); }
    if (v==='collect'){ if (!['home','recipes','room'].includes(S.view)) go('home'); setTimeout(collectionSheet, 60); }
    if (v==='recipes') go('recipes');
    if (v==='room') go('room');
    return; }
  const t = ev.target.closest('[data-act]'); if (!t) return;
  const a=t.dataset.act, k=t.dataset.k, d=S.draft;
  sfxFor(a, t);
  const refresh = () => { refreshStep(); refreshPreview(); };
  switch(a){
    case 'close': closeSheet(); break;
    case 'mute': SFX.toggle(); break;
    case 'bgm': toggleVolPop(); break;
    case 'bgm-onoff': SFX.toggleBgm(); renderVolPop(); break;
    case 'sfx-onoff': SFX.toggle(); renderVolPop(); break;
    case 'opt-temp': case 'opt-ice': case 'opt-size': case 'opt-sweet': case 'opt-milk': {
      const f=a.slice(4); d[f] = f==='sweet' ? +k : k; const y=app.scrollTop; render(); app.scrollTop=y; break; }
    case 'set-sweet': d.sweet=+k; refresh(); break;
    case 'set-ice': d.ice=k; S.prog.ice=false; S.icen=Math.min(S.icen||0,iceN(d)); if(S.icen>=iceN(d)) S.prog.ice=true; refresh(); refreshPreview(); break;
    case 'scoop': { if (S.prog.ice) break; const n=iceN(d); S.icen=(S.icen||0)+1; if (S.icen>=n){ S.prog.ice=true; speak('น้ำแข็งเย็นเจี๊ยบ ครบแล้ว'); } refresh(); break; }
    case 'home': closeSheet(); S.draft=null; S.edit=false; S.extra=false; go('home'); break;
    case 'extra': closeSheet(); S.draft=null; S.edit=false; enterCafe(true); break;
    case 'recipe': recipeSheet(k); break;
    case 'story': storyReader(k); break;
    case 'decor-buy': { const x=DEC(k); if (!x || db.decor.owned[k]) break; if (!tierOpen(x.tier)){ toast(`มีของชั้นที่ ${x.tier-1} ครบ 2 ชิ้นก่อนนะ`,1); break; } if (db.beans < x.price){ toast(`ยังขาดอีก ${x.price-db.beans} เมล็ด · ชงแก้ววันนี้หรือแก้วพิเศษเพื่อสะสมนะ`,1); break; }
      db.beans-=x.price; db.decor.owned[k]=todayKey(); db.decor.place[x.slot]=k; save(); SFX.play('chime',{vol:.3}); P.haptic.play('success'); { const y=app.scrollTop; render(); app.scrollTop=y; } toast(`วาง "${x.th}" ในร้านแล้ว ✦`,1); break; }
    case 'decor-place': { const x=DEC(k); if (!x || !db.decor.owned[k]) break; if (db.decor.place[x.slot]===k) delete db.decor.place[x.slot]; else db.decor.place[x.slot]=k; save(); const y=app.scrollTop; render(); app.scrollTop=y; break; }
    case 'iap-buy': iapBuy(k); break;
    case 'iap-restore': P.purchases.restore().then(ids=>{ (ids||[]).forEach(id=>{ if (!db.purchases.owned[id]) db.purchases.owned[id]=todayKey(); }); save(); toast(ids&&ids.length?`กู้คืนแล้ว ${ids.length} รายการ`:'ไม่พบการซื้อที่ต้องกู้คืน (หรือยังไม่ได้อยู่ในแอป iOS)',1); if (S.view==='room') render(); }); break;
    case 'set-lang': db.settings.lang=k; save(); location.reload(); break;
    case 'rm-onoff': db.settings.reduceMotion=!db.settings.reduceMotion; save(); applyMotion(); settingsSheet(); break;
    case 'wx-onoff': if (db.settings.weatherOptIn){ db.settings.weatherOptIn=false; P.weather.forget(); save(); settingsSheet(); }
      else { db.settings.weatherOptIn=true; save(); P.weather.refresh().then(w=>{ if (!w){ db.settings.weatherOptIn=false; save(); toast('ไม่ได้รับสิทธิ์ตำแหน่ง ไม่เป็นไรนะ ใช้อากาศตามฤดูแทน',1); } else toast(`อากาศวันนี้: ${WX[w].th}`,1); if ($('#sheet').classList.contains('open')) settingsSheet(); }); } break;
    case 'sharenote': db.settings.shareNote=!db.settings.shareNote; save(); if (k) storySheet('day', k); else settingsSheet(); break;
    case 'mprev': S.calM--; if(S.calM<0){S.calM=11;S.calY--;} render(); break;
    case 'mnext': S.calM++; if(S.calM>11){S.calM=0;S.calY++;} render(); break;
    case 'detail': detailSheet(k); break;
    case 'about': aboutSheet(); break;
    case 'settings': settingsSheet(); break;
    case 'rem-save': { const v=($('#remTime')||{}).value||'20:00'; S.askReminder=false; setReminder(v).then(()=>{ if ($('#sheet').classList.contains('open')) settingsSheet(); else render(); }); break; }
    case 'rem-off': S.askReminder=false; setReminder(null).then(()=>{ if ($('#sheet').classList.contains('open')) settingsSheet(); else render(); }); break;
    case 'haptic-onoff': P.haptic.setEnabled(!P.haptic.enabled); P.haptic.play('light'); settingsSheet(); break;
    case 'set-hemi': db.settings.hemi=k; save(); settingsSheet(); break;
    case 'backup': exportBackup(); break;
    case 'import': P.file.pickJSON().then(obj=>{ if (!ask('นำเข้าไฟล์สำรอง? วันที่ซ้ำกันจะใช้ข้อมูลจากไฟล์')) return; const r=importBackup(obj); closeSheet(); go('home'); toast(`นำเข้า ${r.n} แก้วแล้ว${r.skip?` (ข้าม ${r.skip} รายการที่อ่านไม่ได้)`:''}`,1); }).catch(err=>{ if (err && err.message!=='none') toast(err.message && /Cupmori|เวอร์ชัน/.test(err.message) ? err.message : 'อ่านไฟล์สำรองไม่ได้'); }); break;
    case 'miss-ok': db.settings.missShown=todayKey(); save(); render(); break;
    case 'bootg-ok': S.bootGuests=[]; render(); break;
    case 'nudge-ok': db.settings.lastNudge=todayKey(); save(); render(); break;
    case 'usual': { const o=usualOrder(); if (o){ Object.assign(S.draft, o); S.cat=M(o.drink).cat; P.haptic.play('light'); const y=app.scrollTop; render(); app.scrollTop=y; toast('จัดให้เหมือนเดิมแล้ว ☕',1); } break; }
    case 'opt-decaf': { d.decaf=+k; const y=app.scrollTop; render(); app.scrollTop=y; break; }
    case 'demo': demo(); break;
    case 'reset': if (ask('ล้างแสตมป์ แขก และการตั้งค่าทั้งหมดในเครื่องนี้? (แนะนำให้บันทึกไฟล์สำรองก่อน)')){ db=migrate({}); save(); applyReminder(); go('home'); toast('ล้างข้อมูลแล้ว',1); } break;
    case 'del': if (ask('ลบแก้ววันนี้?')){ delete db.entries[todayKey()]; save(); closeSheet(); go('home'); toast('ลบแก้ววันนี้แล้ว',1); } break;
    case 'edit': { closeSheet(); const e=db.entries[todayKey()]; S.edit=true; S.barista=e.barista; S.draft={drink:e.drink, temp:e.temp, ice:String(iceN(e)), size:e.size||'M', sweet:e.sweet??50, milk:e.milk||'fresh'}; enterCafe(); break; }
    case 'cat': S.cat=k; S.draft.drink=menuNow().find(m=>m.cat===k).k; render(); break;
    case 'pick': { S.draft.drink=k; S.cat=M(k).cat; const y=app.scrollTop; render(); app.scrollTop=y; break; }
    case 'startbrew': startBrew(); break;
    case 'quit': if (ask('ออกจากบาร์ชง? แก้วนี้จะยังไม่ถูกบันทึก')){ S.draft=null; S.edit=false; go('home'); } break;
    case 'back': if (S.si===0){ S.draft={drink:d.drink}; go('cafe'); } else { S.si--; go('brew'); } break;
    case 'next': if (!stepReady(S.steps[S.si])) return; if (S.si===S.steps.length-1) finish(); else { const n=$('#note'); if(n) d.note=n.value; S.si++; S.tmp=0; go('brew'); } break;
    case 'set-bean': d.bean=k; refresh(); speak('เลือกได้ดีเลย'); break;
    case 'set-temp': d.temp=k; if(k==='iced'&&d.cup==='mug')d.cup='tumbler'; if(k==='hot'&&d.cup==='tumbler')d.cup='mug'; S.prog.milk=false; refresh(); break;
    case 'set-grind': d.grind=k; refresh(); break;
    case 'set-shots': d.shots=+k; S.prog.shot=false; S.shotf=0; refresh(); break;
    case 'pull': pull(); break;
    case 'set-milk': d.milk=k; refresh(); break;
    case 'set-art': d.art=k; S.prog.art=false; refresh(); break;
    case 'pour': S.prog.art=true; refresh(); speak(d.art==='heart'?'หัวใจสวยมากกก':'ลายสวยเหมือนมือโปร'); break;
    case 'set-syrup': d.syrup=k; refresh(); break;
    case 'set-scoops': d.scoops=+k; refresh(); break;
    case 'sift': if(!S.prog.sift){ S.prog.siftn=(S.prog.siftn||0)+1; if(S.prog.siftn>=6){ S.prog.sift=true; speak('ผงเนียนกริบเลย'); } refresh(); } break;
    case 'pourwater': { const [lo,hi]=M(d.drink).wt, pf=d.water>=lo&&d.water<=hi; S.prog.water=true; S.q.water=pf?'perfect':'ok'; speak(pf?'อุณหภูมิกำลังดี หอมเลย':d.water<lo?`อุ่นๆ ก็ดื่มง่ายนะ (ครั้งหน้าลอง ${lo}–${hi}°C)`:`ร้อนไปนิด อาจขมหน่อย (ครั้งหน้าลอง ${lo}–${hi}°C)`); refresh(); break; }
    case 'set-top': d.topping=k; refresh(); break;
    case 'set-cup': d.cup=k; refresh(); speak('แก้วนี้เข้ากับมู้ดเลย'); break;
    case 'set-sleeve': { const L=lockOf('sleeve',k); if (L){ toast(`ปลดล็อกเมื่อสะสมติดกัน ${L.d} วันนะ (ตอนนี้ ${bestStreak()} วัน)`); break; } d.sleeve=k; refresh(); break; }
    case 'stk': { const L=lockOf('sticker',k); if (L && !d.stickers.includes(k)){ toast(`ปลดล็อกเมื่อสะสมติดกัน ${L.d} วันนะ (ตอนนี้ ${bestStreak()} วัน)`); break; } const i=d.stickers.indexOf(k); if(i>=0) d.stickers.splice(i,1); else if(d.stickers.length<3) d.stickers.push(k); else toast('ติดได้สูงสุด 3 ชิ้นนะ'); refresh(); break; }
    case 'set-mood': { const n=$('#note'); if(n) d.note=n.value; d.mood=k; refresh(); speak(MOOD_REPLY[k]||'ขอบคุณที่เล่าให้ฟังนะ'); break; }
    case 'dl': if (cardBlob){ downloadBlob(cardBlob, `cupmori-${S.calY}-${pad(S.calM+1)}.png`); toast('ดาวน์โหลดการ์ดแล้ว',1); } else toast('กำลังสร้างการ์ด...',1); break;
    case 'story-day': storySheet('day', k||todayKey()); break;
    case 'story-month': storySheet('month', `${S.calY}-${S.calM}`); break;
    case 'story-share': if (story.blob) shareBlob(story.blob, story.url, story.name); else toast('กำลังวาดการ์ด...',1); break;
    case 'story-dl': if (story.blob){ downloadBlob(story.blob, story.name); toast('ดาวน์โหลดการ์ดแล้ว',1); } else toast('กำลังวาดการ์ด...',1); break;
    case 'share': if (cardBlob) shareBlob(cardBlob, cardURL, `cupmori-${S.calY}-${pad(S.calM+1)}.png`); else toast('กำลังสร้างการ์ด...',1); break;
  }
});
document.addEventListener('input', ev=>{ if (ev.target.dataset.act==='set-water'){ S.draft.water=+ev.target.value; S.prog.water=false; $('#wt').textContent=S.draft.water+'°C'; $('#fx').innerHTML=fxHTML('water'); $('#nextBtn').disabled=true; const b=document.querySelector('[data-act="pourwater"]'); if(b) b.textContent='เทน้ำร้อน 70 ml 💧'; } });
$('#sheetBack').addEventListener('click', closeSheet);
function pull(){
  if (S.busy) return; S.busy=true; S.prog.shot=false; S.shotf=0; refreshStep();
  const total=S.draft.shots*900, t0=performance.now();
  (function tick(now){ const f=Math.min(1,(now-t0)/total); S.shotf=f; $('#fx').innerHTML=fxHTML('shot'); const g=$('#g1'); if(g) g.style.width=f*100+'%'; const gm=$('#gm'); if(gm) gm.textContent=`กำลังดึงช็อตที่ ${Math.min(S.draft.shots,Math.floor(f*S.draft.shots)+1)}...`;
    if (f<1) requestAnimationFrame(tick); else { S.busy=false; S.prog.shot=true; S.draft.shotq='ok'; S.q.shot='ok'; SFX.play('plop',{vol:.25}); speak(S.draft.shots>=3?'เข้มสะใจ!':'ช็อตสวยงาม'); refreshStep(); } })(t0);
}
window.addEventListener('focus', ()=>{ if (S.view==='home' && !$('#sheet').classList.contains('open')) render(); });
setInterval(applyLighting, 60000);
/* catch up unlocks for stamps collected before Phase 1 (or imported); shown once on home */
S.bootGuests = syncGuests(); if (S.bootGuests.length) save();
/* translators / QC: every data table in one place (dev only) */
if (ENV.dev) window.CUPMORI_TABLES = { BARISTAS, GUESTS, MENU, CAT, CUPS, SLEEVES, REWARDS, BEANS, GRINDS, MILKS, ARTS, SYRUPS, TOPS, SIZES, ICES, SWEETS, TEMPS, DECAFS, VESSELS, DECAF_MUG, MOOD_REPLY, STEP_TXT, STEP_SHORT, THM, THD, WX, TOD_TH, SEASON_TH, STAR_MSG };
I18N.setLang(db.settings.lang);
applyReminder();
render();
/* opt-in real weather: refresh once per day in the background (never asks again after a 'no') */
if (db.settings.weatherOptIn) P.weather.refresh().then(w=>{ if (w && ['recipes'].includes(S.view)) render(); });
})();
