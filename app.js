/* ก๊าบก๊าบคาเฟ่ · MOOD CUP */
(() => {
const $ = (s, r=document) => r.querySelector(s);
const app = $('#app');
const IMG = 'assets/img/';
const KEY = 'ggcafe.moodcup.v1';

/* ---------- data ---------- */
const BARISTAS = [
  { k:'pe', th:'เป๊ะ', prop:'หมวกแก๊ปแดง', q:'', greet:'สวัสดีค่า~ วันนี้มู้ดไหนดี? เป๊ะชงให้เอง!', tail:' ก๊าบ!', quirk:'หัวหน้าบาร์ประจำร้าน ยิ้มเก่งที่สุด' },
  { k:'sunny',   th:'ซันนี่',   prop:'หมวกกะลาสี',     q:'q-sway',   greet:'อะฮอย~ ยินดีต้อนรับขึ้นเรือคาเฟ่ของซันนี่!', tail:' ก๊าบ!',     quirk:'ชอบโยกตัวไปมาเหมือนอยู่บนเรือ' },
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
const RANDOM_BARISTA = false; // เปิดเมื่อ agy วาดน้องเป็ดครบ 12 ตัว

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
];
const menuNow = () => MENU.filter(m => !m.season || m.season.includes(new Date().getMonth()));
const M = k => MENU.find(m=>m.k===k) || MENU[0];
const isCoffee = m => m.cat==='coffee';
const CAT = { coffee:{th:'กาแฟ',c:'#C79A6B'}, matcha:{th:'มัทฉะ',c:'#9DBF6A'}, other:{th:'อื่นๆ',c:'#F2A7A0'} };
const TINT = { pumpkin:'#F6D9BE', xmascocoa:'#F3D3CF', glassmatcha:'#DCEBC7', icelatte:'#EEDCC8', hotmatcha:'#DCEBC7', latte:'#F3DCC4', americano:'#EBD9C8', mocha:'#ECD4C4', icematcha:'#DCEBC7', strawmatcha:'#F7D6E0', hojicha:'#EDD8C3', cocoa:'#EFDACE', usucha:'#D9EAD2' };
const CUPS = [ {k:'tumbler',th:'แก้วใสทรงสูง'}, {k:'mug',th:'แก้วมัค'}, {k:'paper',th:'แก้วกระดาษ'}, {k:'glass',th:'แก้วใสทรงเตี้ย'} ];
const SLEEVES = [ {k:'none',c:null,th:'ไม่มี'}, {k:'peach',c:'#F8C4A4'}, {k:'butter',c:'#FFE08A'}, {k:'rose',c:'#F4A9B8'}, {k:'mint',c:'#BFE3C4'}, {k:'sky',c:'#B8DCF2'}, {k:'lilac',c:'#D5C4F0'}, {k:'gold',c:'#E9B949',th:'สีทอง'} ];
const STK = ['heart','star','flower','smile','leaf','cat','crown','duck'];
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
const ICES = [ {k:'none',th:'ไม่ใส่น้ำแข็ง',n:0}, {k:'less',th:'น้ำแข็งน้อย',n:2}, {k:'normal',th:'ปกติ',n:4}, {k:'extra',th:'น้ำแข็งเยอะ',n:6} ];
const SWEETS = [ {k:0,th:'ไม่หวาน 0%'}, {k:25,th:'หวานน้อย 25%'}, {k:50,th:'หวานกลาง 50%'}, {k:100,th:'หวานปกติ 100%'}, {k:120,th:'หวานมาก 120%'} ];
const TEMPS = [ {k:'hot',th:'☕ ร้อน'}, {k:'iced',th:'🧊 เย็น'} ];
const OPT_DEF = { temp:'hot', ice:'normal', size:'M', sweet:50, milk:'fresh' };
const priceOf = d => M(d.drink).p + ((SIZES.find(z=>z.k===d.size)||SIZES[1]).add) + (d.milk && d.milk!=='fresh' && M(d.drink).milk ? 15 : 0);
const tempOf = d => M(d.drink).temp || d.temp || 'hot';
/* artwork follows the chosen cup (all agy pencil art; matcha/coffee variants are recolours of the same drawings) */
const famOf = m => m.k==='pumpkin' ? 'pumpkin' : m.k==='xmascocoa' ? 'xmas' : ['matcha'].includes(m.cat) ? 'matcha' : m.k==='cocoa' ? 'cocoa' : 'coffee';
const CUP_ART = {
  tumbler:{ coffee:'icelatte', cocoa:'icelatte', matcha:'icematcha', straw:'strawmatcha' },
  glass:  { coffee:'mocha', cocoa:'mocha', matcha:'glassmatcha' },
  mug:    { coffee:'latte', cocoa:'cocoa', matcha:'hotmatcha', pumpkin:'pumpkin', xmas:'xmascocoa' },
  paper:  { coffee:'americano', cocoa:'americano', matcha:'americano', pumpkin:'americano', xmas:'americano' },
};
const CUPS_BY_TEMP = { hot:['mug','paper'], iced:['tumbler','glass'] };
const cupsFor = d => CUPS.filter(c => CUPS_BY_TEMP[tempOf(d)].includes(c.k));
const fixCup = d => { if (!CUPS_BY_TEMP[tempOf(d)].includes(d.cup)) d.cup = tempOf(d)==='iced' ? 'tumbler' : 'mug'; };
/* tidy overlays placed per drawing (percent of the 100×100 art box) */
const ART_FX = {
  icelatte:{ ice:[[38,25],[56,23],[47,32],[64,31],[32,34],[54,40]] }, icematcha:{ ice:[[38,25],[56,23],[47,32],[64,31],[32,34],[54,40]] },
  strawmatcha:{ ice:[[38,19],[56,17],[47,26],[64,25],[32,28],[56,33]] },
  mocha:{ ice:[[36,51],[52,50],[66,52],[29,60],[71,60],[44,56]] }, glassmatcha:{ ice:[[36,51],[52,50],[66,52],[29,60],[71,60],[44,56]] },
  latte:{ steam:[22,[36,48,60]] }, pumpkin:{ steam:[22,[36,48,60]] }, xmascocoa:{ steam:[11,[38,50,62]] }, hotmatcha:{ steam:[22,[36,48,60]] }, cocoa:{ steam:[11,[38,50,62]] }, americano:{ steam:[15,[42,52,62]] },
};
function artFX(e){
  const fx = ART_FX[imgOf(e)]; if (!fx) return '';
  if (tempOf(e)==='iced' && fx.ice){ const n=(ICES.find(i=>i.k===(e.ice||'normal'))||ICES[2]).n; if(!n) return '';
    const rot=[-12,9,3,-16,14,-5];
    return `<svg class="artfx" viewBox="0 0 100 100" aria-hidden="true"><g filter="url(#wob)">${fx.ice.slice(0,n).map(([x,y],i)=>`<g class="cube" transform="translate(${x} ${y}) rotate(${rot[i]})" style="animation-delay:${i*.07}s"><rect x="-4.6" y="-4.6" width="9.2" height="9.2" rx="2.4" fill="rgba(255,255,255,.62)" stroke="#8A7262" stroke-width=".8" stroke-opacity=".8"/><rect x="-4.6" y="1.2" width="9.2" height="3.4" rx="1.6" fill="rgba(170,200,220,.28)"/><path d="M-2.8 -2.4 L-.4 -3.2" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></g>`).join('')}</g></svg>`; }
  if (tempOf(e)==='hot' && fx.steam){ const [y,xs]=fx.steam;
    return `<svg class="artfx" viewBox="0 0 100 100" aria-hidden="true">${xs.map((x,i)=>{ const d=`M${x} ${y} q-4 -5 0 -10 q4 -5 0 -10`; return `<g class="steam" style="animation-delay:${i*.6}s"><path d="${d}" fill="none" stroke="#B49478" stroke-opacity=".45" stroke-width="3.4" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g>`; }).join('')}</svg>`; }
  return '';
}
const imgOf = e => { const m=M(e.drink), c=CUP_ART[e.cup]; if(!c) return m.img; return (m.k==='strawmatcha' && c.straw) || c[famOf(m)] || m.img; };
/* duck replies matching the mood */
const MOOD_REPLY = {
  happy:'ดีใจด้วยน้า~ วันสดใสแบบนี้ต้องฉลองด้วยแก้วโปรด',
  chill:'ชิลๆ ไปด้วยกันนะ จิบช้าๆ ไม่ต้องรีบ',
  love:'โอ๊ย หัวใจฟูไปหมด แก้วนี้ใส่ความหวานเพิ่มให้นะ ♡',
  excited:'ตื่นเต้นด้วยเลย! ขอให้วันนี้ปังๆ',
  tired:'เหนื่อยหน่อยนะวันนี้ พักจิบอุ่นๆ ก่อน เป๊ะเป็นกำลังใจให้',
  busy:'ยุ่งแค่ไหนก็อย่าลืมหายใจลึกๆ นะ สู้ๆ',
  calm:'ใจสงบดีจัง เก็บความรู้สึกนี้ไว้นานๆ นะ',
  sad:'มากอดกันก่อน วันนี้ไม่เป็นไรนะ พรุ่งนี้จะดีขึ้น',
};
const replyFor = (e) => (MOOD_REPLY[e.mood] || 'แก้วนี้ชงด้วยใจเลยนะ ขอให้วันนี้เป็นวันที่ดี');
const THM = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const THD = ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'];

const STEP_TXT = {
  bean:  { t:'เลือกเมล็ดกาแฟ', h:'เลือกเมล็ดที่ชอบก่อนเริ่มชง', s:'เมล็ดนี้หอมมากเลย' },
  grind: { t:'บดเมล็ด', h:'เลือกความละเอียด แล้วกดค้างปุ่ม "บด" จนเต็ม', s:'เสียงบดนี่ฟังแล้วตื่นเลย' },
  tamp:  { t:'แทมป์ให้แน่น', h:'กดค้างเพื่อกดแทมป์ แล้วปล่อยตอนเข็มอยู่ในโซนเขียว', s:'กดเบาๆ แต่มั่นคงนะ' },
  shot:  { t:'ดึงช็อตเอสเปรสโซ่', h:'กดค้างให้กาแฟไหล แล้วปล่อยตอนเข็มอยู่ในโซนทอง', s:'ครีม่าสีคาราเมลสวยเลย' },
  milk:  { t:'เลือกนม & สตีม', h:'เลือกนม แล้วกดค้างสตีมให้ได้ 55–65°C', s:'ฟังเสียงฟู่ๆ เบาๆ นะ' },
  art:   { t:'ลาเต้อาร์ต', h:'เลือกลาย แล้วกด "เทนม"', s:'ค่อยๆ เท ข้อมือนิ่งๆ' },
  syrup: { t:'ไซรัป / ซอส', h:'เติมความหวานนิดหน่อยไหม?', s:'หวานพอดีๆ กำลังน่ารัก' },
  sift:  { t:'ร่อนผง', h:'เลือกจำนวนช้อน แล้วแตะที่ตะแกรงให้ผงไม่เป็นก้อน', s:'ร่อนให้เนียนไม่มีก้อนนะ' },
  water: { t:'น้ำร้อนตามอุณหภูมิ', h:'ปรับอุณหภูมิให้อยู่ในช่วงที่แนะนำ แล้วกด "เทน้ำ"', s:'ร้อนเกินจะขมนะ' },
  whisk: { t:'ตีด้วยฉะเซ็น', h:'วนนิ้วเป็นวงกลมในถ้วยด้านล่าง จนฟองนุ่ม', s:'วนๆ เบาๆ ฟองจะนุ่มขึ้นเรื่อยๆ' },
  milk2: { t:'เทนม', h:'เลือกนม แล้วเทลงแก้ว', s:'นมหอมมันกำลังดี' },
  ice:   { t:'ตักน้ำแข็ง', h:'แตะ "ตักน้ำแข็ง" ให้ครบตามที่สั่ง', s:'กริ๊งๆ เย็นชื่นใจ' },
  top:   { t:'ท็อปปิ้ง', h:'เพิ่มท็อปปิ้งให้แก้วนี้', s:'ท็อปปิ้งนี้ต้องโดน' },
  cup:   { t:'เลือกแก้ว', h:'เลือกแก้วที่ชอบสำหรับวันนี้', s:'แก้วนี้เข้ากับมู้ดเลย' },
  deco:  { t:'แต่งแก้ว', h:'ปลอกแก้ว + สติกเกอร์ (สูงสุด 3 ชิ้น)', s:'น่ารักขึ้นอีกเยอะ' },
  mood:  { t:'มู้ดวันนี้', h:'วันนี้รู้สึกแบบไหน? เขียนโน้ตสั้นๆ ก็ได้', s:'เล่าให้ฟังหน่อยสิ' },
};
const STEP_SHORT = {bean:'เมล็ด',grind:'บด',tamp:'แทมป์',shot:'ช็อต',milk:'สตีมนม',art:'อาร์ต',syrup:'ไซรัป',sift:'ร่อนผง',water:'น้ำร้อน',whisk:'ตีฟอง',milk2:'นม',ice:'น้ำแข็ง',top:'ท็อปปิ้ง',cup:'แก้ว',deco:'แต่ง',mood:'มู้ด'};

/* ---------- storage ---------- */
let db = load();
function load(){ try { return Object.assign({entries:{}}, JSON.parse(localStorage.getItem(KEY)) || {}); } catch(e){ return {entries:{}}; } }
function save(){ localStorage.setItem(KEY, JSON.stringify(db)); }
const pad = n => String(n).padStart(2,'0');
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayKey = () => keyOf(new Date());
const parseKey = k => { const [y,m,d] = k.split('-').map(Number); return new Date(y, m-1, d); };
const thDate = d => `${THD[d.getDay()]} ${d.getDate()} ${THM[d.getMonth()]} ${d.getFullYear()+543}`;

/* ---------- state ---------- */
const S = { view:'home', calY:new Date().getFullYear(), calM:new Date().getMonth(), barista:null, draft:null, steps:[], si:0, cat:'coffee', edit:false };

/* ---------- helpers ---------- */
const esc = s => String(s??'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars = arr => arr.map(([x,y,s,d])=>`<span class="star" style="left:${x}px;top:${y}px;font-size:${s||14}px;animation-delay:${d||0}s">★</span>`).join('');
function toast(t, ok){ if(!ok) SFX.play('oops',{vol:.22}); const el=$('#toast'); el.textContent=t; el.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>el.classList.remove('show'),2200); }
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
function counterScene(b, extra=''){
  return `<div class="cs" style="aspect-ratio:${COUNTER.ar}"><img class="bg" src="${IMG}counter.webp" alt="หน้าร้านก๊าบก๊าบคาเฟ่ กับบาริสต้าเป๊ะ">${extra}</div>`;
}
/* ---------- views ---------- */
function render(){
  const v = S.view;
  showTab(v==='home'); setTab(v==='home'?'home':'start');
  if (v==='home') app.innerHTML = homeView();
  if (v==='cafe') app.innerHTML = cafeView();
  if (v==='brew') app.innerHTML = brewView();
  if (v==='done') app.innerHTML = doneView();
  app.firstElementChild && app.firstElementChild.classList.add('view');
  if (v==='brew') bindStep();
}
function go(v){ S.view=v; app.scrollTop=0; render(); }

function homeView(){
  const tk = todayKey(), te = db.entries[tk], now = new Date();
  const hero = te ? `
    <div class="hero hd"><div class="hero-body"><div class="today">
      <div class="stampbig">${stampHTML(te)}</div>
      <div style="flex:1"><div class="sub">แก้ววันนี้ · ${thDate(now)}</div><div class="H" style="font-size:24px;margin:2px 0">${esc(M(te.drink).th)}</div>
      <div style="font-size:13px">บาริสต้าวันนี้: <b>${esc(B(te.barista).th)}</b> · มู้ด ${esc((MOODS.find(x=>x.k===te.mood)||{}).th||'-')}</div>
      <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-act="detail" data-k="${tk}">ดูแสตมป์</button><button class="btn sm soft hd" data-act="edit">แก้ไข</button></div></div>
    </div></div></div>` : `
    <div class="hero hd"><div class="hero-img">${counterScene(B('pe'))}<span class="credit">ภาพ: agy</span>${stars([[24,30,14],[330,40,12,.6]])}</div>
      <div class="hero-body"><div class="sub">${thDate(now)}</div><div class="H" style="margin:2px 0 4px">วันนี้มู้ดแบบไหนดี?</div>
      <p style="font-size:13.5px;line-height:1.5">เข้าร้าน เจอบาริสต้าน้องเป็ดสุ่มวันละตัว แล้วชงเครื่องดื่มเองทีละขั้น เก็บเป็นแสตมป์ประจำวัน</p>
      <button class="btn wide" style="margin-top:12px" data-go="start">เข้าร้าน ชงแก้ววันนี้ ☕</button></div></div>`;
  return `<div>
  <div class="top"><div class="logo"><img src="${IMG}b-pe.webp" alt="">ก๊าบก๊าบคาเฟ่</div><div class="pill hd thin">MOOD CUP</div></div>
  ${hero}
  ${calendarHTML()}
  <div class="homeacts"><button class="btn sm yel" data-go="summary">สรุปเดือนนี้ ◔</button><button class="btn sm soft hd" data-act="demo">เติมข้อมูลตัวอย่าง</button><button class="btn sm soft hd" data-act="about">เกี่ยวกับ & เครดิต</button></div>
  <div class="footnote">ข้อมูลเก็บในเครื่องนี้เท่านั้น · <button data-act="reset">ล้างข้อมูล</button></div>
  </div>`;
}

function monthEntries(y,m){ return Object.entries(db.entries).filter(([k])=>{ const d=parseKey(k); return d.getFullYear()===y && d.getMonth()===m; }); }
function calendarHTML(){
  const y=S.calY, m=S.calM, first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate(), tk=todayKey(), now=new Date();
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
    <div class="calhead"><div><div class="H" style="font-size:24px">สมุดแสตมป์ก๊าบ</div><div style="font:600 13px Mali">${THM[m]} ${y+543} · สะสมแล้ว ${ents.length} แก้ว</div></div>
    <div class="calnav"><button class="chip hd" data-act="mprev" aria-label="เดือนก่อน">‹</button><button class="chip hd" data-act="mnext" aria-label="เดือนถัดไป">›</button></div></div>
    <div class="cal">${cells}</div>
    ${ents.length ? `<div style="display:flex;justify-content:space-between;font:600 12px Mali;margin-top:14px"><span>สัดส่วนเดือนนี้</span><span>กาแฟ ${Math.round(cnt.coffee/tot*100)}% · มัทฉะ ${Math.round(cnt.matcha/tot*100)}% · อื่นๆ ${Math.round(cnt.other/tot*100)}%</span></div>
    <div class="mix hd thin">${['coffee','matcha','other'].map(c=>`<i style="width:${cnt[c]/tot*100}%;background:${CAT[c].c}"></i>`).join('')}</div>` : `<div class="empty-hint" style="margin-top:12px">ยังไม่มีแสตมป์เดือนนี้ ลองชงแก้วแรกหรือกด "เติมข้อมูลตัวอย่าง"</div>`}
  </div>`;
}

/* ----- cafe / menu board ----- */
function enterCafe(){
  S.edit = !!db.entries[todayKey()] && S.edit;
  if (!S.edit){
    const last = db.lastBarista; let pick='pe';
    if (RANDOM_BARISTA) do { pick = BARISTAS[1+Math.floor(Math.random()*(BARISTAS.length-1))].k; } while (pick===last);
    S.barista = pick; db.lastBarista = pick; save();
  }
  S.draft = Object.assign({ drink:'latte' }, OPT_DEF, S.draft||{});
  S.cat = M(S.draft.drink).cat;
  go('cafe');
}
function cafeView(){
  const b = B(S.barista), sel = S.draft.drink, list = menuNow().filter(m=>m.cat===S.cat), cur = M(sel);
  const col = (cat, title) => `<div><h4>${title}</h4>${menuNow().filter(m=>cat.includes(m.cat)).map(m=>`<div class="r ${m.k===sel?'on':''}" data-act="pick" data-k="${m.k}"><span>${m.th.replace('สตรอว์เบอร์รีมัทฉะ','สตอฯ มัทฉะ')}</span><span>${m.p}</span></div>`).join('')}</div>`;
  return `<div>
  <div class="board-wrap">${counterScene(b, `<div class="chalk" style="left:${COUNTER.board.l}%;top:${COUNTER.board.t}%;width:300px;transform-origin:0 0;transform:scale(var(--bs,.7))"><div class="t">~ เมนูวันนี้ ~</div><div class="cols">${col(['coffee'],'COFFEE')}${col(['matcha','other'],'MATCHA & TEA')}</div></div>`)}
    <div class="bubble" style="left:12px;top:46%;max-width:46%"><b>${esc(b.th)}</b> · บาริสต้าวันนี้<br>${esc(b.greet)}</div>
    <button class="chip hd" style="position:absolute;left:12px;top:14px;z-index:7;min-height:36px;background:#FFFDF7" data-act="home">✕ ออก</button>
    <span class="credit" style="bottom:66px">ภาพ: agy</span>
  </div>
  <div class="menu-sheet">
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="H" style="font-size:24px">${S.edit?'แก้ไขแก้ววันนี้':'เลือกเมนูมู้ดวันนี้'}</div><div class="sub" style="font-size:12px">${esc(b.th)} · ${esc(b.prop)}</div></div>
    <div class="tabs">${Object.entries(CAT).map(([k,c])=>`<button class="hd ${S.cat===k?'on':''}" data-act="cat" data-k="${k}">${k==='matcha'?'มัทฉะ':k==='other'?'ชา & อื่นๆ':'กาแฟ'}</button>`).join('')}</div>
    <div class="items">${list.map(m=>`<button class="it hd ${m.k===sel?'on':''}" data-act="pick" data-k="${m.k}">${m.season?'<i class="seasonbadge">'+(m.k==='pumpkin'?'🎃':'🎄')+'</i>':''}<img src="${IMG}d-${m.img}.webp" alt=""><span>${m.th}</span><small>฿${m.p}</small></button>`).join('')}</div>
    <div class="desc hd thin">${cur.badge?`<div class="seasontag">${cur.badge}</div>`:''}<b>${cur.th}</b> — ${cur.desc}</div>
    ${optionsHTML()}
    <div class="sub" style="font-size:12px;margin-top:10px">ทำเองทีละขั้น ${buildSteps(cur,S.draft).length} สเต็ป: ${buildSteps(cur,S.draft).map(s=>STEP_SHORT[s]).join(' → ')}</div>
    <div class="sticky-foot" style="padding-left:0;padding-right:0"><button class="btn wide" data-act="startbrew">สั่ง ${cur.th} ${tempOf(S.draft)==='iced'?'เย็น':'ร้อน'} · ฿${priceOf(S.draft)} →</button></div>
  </div></div>`;
}

function optionsHTML(){
  const d=S.draft, m=M(d.drink), t=tempOf(d);
  return `<div class="opts hd thin" id="opts"><div class="H" style="font-size:19px">ปรับแก้วของคุณ</div>
    <div class="lbl">ร้อน หรือ เย็น</div>${m.temp?`<div class="sub" style="font-size:13px">เมนูนี้เสิร์ฟแบบ${m.temp==='iced'?'เย็นเท่านั้น 🧊':'ร้อนเท่านั้น ☕'}</div>`:chips(TEMPS,t,'opt-temp')}
    ${t==='iced'?`<div class="lbl">ปริมาณน้ำแข็ง</div>${chips(ICES,d.ice,'opt-ice')}`:''}
    <div class="lbl">ขนาดแก้ว</div>${chips(SIZES.map(z=>({k:z.k,th:`${z.th}${z.add?` +${z.add}`:''}`})),d.size,'opt-size')}
    <div class="lbl">ระดับความหวาน</div>${chips(SWEETS,d.sweet,'opt-sweet')}
    ${m.milk?`<div class="lbl">ชนิดนม</div>${chips(MILKS.map(x=>({k:x.k,th:x.th+(x.k!=='fresh'?' +15':'')})),d.milk,'opt-milk')}`:''}
  </div>`;
}
/* ----- brew ----- */
function buildSteps(m, d={}){
  const iced = (m.temp||d.temp)==='iced', ice = iced && (d.ice||'normal')!=='none' ? ['ice'] : [];
  if (isCoffee(m)) return ['bean','grind','tamp','shot', ...(m.milk?['milk']:[]), ...(m.art&&!iced?['art']:[]), ...ice, 'syrup','cup','deco','mood'];
  return ['sift','water','whisk', ...(m.milk?['milk2']:[]), ...ice, 'top','cup','deco','mood'];
}
function startBrew(){
  const m = M(S.draft.drink), prev = S.edit ? db.entries[todayKey()] : null, o = S.draft;
  const opts = { temp:m.temp||o.temp||'hot', ice:o.ice||'normal', size:o.size||'M', sweet:o.sweet??50, milk:o.milk||'fresh' };
  const base = { drink:m.k, barista:S.barista, temp:m.temp||'hot', bean:'medium', grind:'fine', shots:2, milk:'fresh', art:'heart', syrup:'none', scoops:2, water:Math.round(((m.wt||[80,80])[0]+(m.wt||[80,80])[1])/2)-6, topping:'none', cup:m.temp==='iced'?'tumbler':'mug', sleeve:'none', stickers:[], mood:'', note:'' };
  S.draft = Object.assign(base, prev && prev.drink===m.k ? prev : {}, opts, { drink:m.k, barista:S.barista });
  fixCup(S.draft);
  S.draft.price = priceOf(S.draft);
  S.prog = {};
  S.steps = buildSteps(m, S.draft); S.si = 0; S.icen = 0; S.wv = 0; S.tf = 0; go('brew');
}
const done = st => !!S.prog[st];
function stepReady(st){
  const d=S.draft;
  if (['grind','tamp','shot','sift','water','whisk'].includes(st)) return done(st);
  if (st==='milk') return done('milk');
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
  <div class="bhead"><button class="x hd" data-act="quit" aria-label="ออก">✕</button><div style="text-align:center"><div style="font:400 19px Itim">${esc(m.th)} <span style="font:500 12px Mali">· บาร์ชง</span></div><div class="sub" style="font-size:11.5px">${coffeeBg?'บาริสต้า '+esc(b.th):'ชมพู ผู้ช่วยบาร์มัทฉะ'}</div></div><div style="font:600 12px Mali;width:38px;text-align:right">${S.si+1}/${S.steps.length}</div></div>
  <div class="steps">${S.steps.map((s,i)=>`<div class="st ${i<S.si?'d':i===S.si?'on':''}"><b class="hd thin">${i<S.si?'✓':i+1}</b>${STEP_SHORT[s]}</div>`).join('')}</div>
  <div class="stage hd" id="stage">
    ${preview ? `<div style="position:absolute;inset:0;background:radial-gradient(circle at 40% 45%,#FFF3D9,#F8E6CF)"></div><div class="preview" style="position:absolute;left:24px;top:30px;width:200px;height:200px;margin:0">${stampHTML(S.draft,{face:false})}</div>${stars([[24,20,14],[220,30,12,.5],[200,240,16,1]])}`
      : `<img class="bg ${coffeeBg?"coffee":"matcha"}" src="${IMG}${coffeeBg?"coffee":"matcha"}.webp" alt="">`}
    ${preview?`<span class="duckglow"></span><img class="duck" src="${bImg(b.k)}" alt="">`:""}
    <div class="bubble" id="bub" ${preview?'style="left:auto;right:12px;top:12px;max-width:150px"':''}>${esc(say(st))}</div>
    <div class="fx" id="fx">${fxHTML(st)}</div>
    <span class="credit">ภาพ: agy</span>
  </div>
  <div class="ctrl"><div class="H">สเต็ป ${S.si+1} · ${x.t}</div><div class="sub" style="font-size:13px;margin-top:2px">${x.h}</div><div id="ctl">${ctrlHTML(st)}</div></div>
  <div class="bfoot"><button class="btn soft hd" data-act="back">← ${S.si? 'ย้อน':'เมนู'}</button><button class="btn" id="nextBtn" data-act="next" ${stepReady(st)?'':'disabled'}>${S.si===S.steps.length-1?'เก็บแสตมป์ ✦':'ถัดไป →'}</button></div>
  </div>`;
}
const chips = (arr, cur, act, extra='') => `<div class="chips">${arr.map(o=>`<button class="chip hd ${String(o.k)===String(cur)?'on':''}" data-act="${act}" data-k="${o.k}" ${extra}>${o.th}</button>`).join('')}</div>`;
function gauge(id, val, zone){ return `<div class="gauge hd thin">${zone?`<div class="zone" style="left:${zone[0]}%;width:${zone[1]-zone[0]}%"></div>`:''}<i id="${id}" style="width:${val}%"></i></div>`; }
function ctrlHTML(st){
  const d = S.draft, m = M(d.drink), P = S.prog;
  switch(st){
    case 'bean': return `<div class="lbl">เมล็ดกาแฟ</div>${chips(BEANS,d.bean,'set-bean')}${orderTag(d)}`;
    case 'grind': return `<div class="lbl">ความละเอียด</div>${chips(GRINDS,d.grind,'set-grind')}${gauge('g1',P.grind?100:(S.tmp||0))}<div class="gmeta"><span>${P.grind?'บดเสร็จแล้ว 18 g ✓':'ผงกาแฟ 0–18 g'}</span><span>${d.grind!=='fine'?'เอสเปรสโซ่ใช้แบบละเอียดดีสุดนะ':''}</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="grind">${P.grind?'บดใหม่':'กดค้างเพื่อบด ⚙'}</button>`;
    case 'tamp': return `${gauge('g1',P.tamp?P.tampv:0,[55,80])}<div class="gmeta"><span id="gm">${P.tamp?`แรงกด ${Math.round(P.tampv/5)} kg · พอดีเป๊ะ! ✓`:'แรงกด 0 kg'}</span><span>โซนเขียว 11–16 kg</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="tamp">${P.tamp?'แทมป์อีกครั้ง':'กดค้างเพื่อแทมป์ แล้วปล่อย'}</button>`;
    case 'shot': return `<div class="lbl">จำนวนช็อต</div><div class="chips">${[1,2,3,4].map(n=>`<button class="chip hd ${d.shots===n?'on':''}" style="width:62px;justify-content:center" data-act="set-shots" data-k="${n}" ${S.busy?'disabled':''}>${n} ช็อต</button>`).join('')}</div>${gauge('g1',P.shot?100/1.15:0,[76.5,88.7])}<div class="gmeta"><span id="gm">${P.shot?`ได้ ${d.shots} ช็อต (${d.shots*30} ml) ${d.shotq==='perfect'?'· เพอร์เฟกต์ ✦':'✓'}`:'กดค้าง แล้วปล่อยในโซนทอง'}</span><span>โซนทอง = ช็อตเพอร์เฟกต์</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="shot" ${S.busy?'disabled':''}>${P.shot?'กดค้างเพื่อดึงใหม่':'กดค้างเพื่อดึงช็อต ☕'}</button><button class="linkbtn" data-act="pull" ${S.busy?'disabled':''}>หรือแตะเพื่อดึงอัตโนมัติ</button>`;
    case 'milk': return `<div class="lbl">นม</div>${chips(MILKS,d.milk,'set-milk')}${d.temp==='hot'?`${gauge('g1',P.milk?P.milkv:0,[58,75])}<div class="gmeta"><span id="gm">${P.milk?`${Math.round(20+P.milkv*.6)}°C · นมเนียนนุ่ม ✓`:'20°C'}</span><span>เป้าหมาย 55–65°C</span></div><button class="btn wide yel holdbtn" style="margin-top:12px" data-hold="milk">${P.milk?'สตีมใหม่':'กดค้างเพื่อสตีมนม ♨'}</button>`:`<div class="gmeta" style="margin-top:10px"><span>${m.k==='dirty'?'นมเย็นเฉียบ ก่อนราดช็อต':'แก้วเย็น ใส่นมเย็น + น้ำแข็ง'}</span></div><button class="btn wide yel" style="margin-top:10px" data-act="coldmilk">${P.milk?'เทนมแล้ว ✓':'เทนมเย็น 🥛'}</button>`}`;
    case 'art': return `<div class="lbl">ลายลาเต้อาร์ต</div>${chips(ARTS,d.art,'set-art')}<button class="btn wide yel" style="margin-top:14px" data-act="pour" ${d.art==='none'?'disabled':''}>${P.art?'วาดสำเร็จ ✓ เทใหม่':'เทนม วาดลาย ♡'}</button>`;
    case 'syrup': return `<div class="lbl">ไซรัป${m.choc?' (มอคค่าใส่ซอสช็อกโกแลตแล้ว ✓)':''}</div>${chips(SYRUPS,d.syrup,'set-syrup')}<div class="lbl">ความหวาน</div>${chips(SWEETS,d.sweet,'set-sweet')}`;
    case 'sift': return `<div class="lbl">${m.powder} กี่ช้อน?</div>${chips([{k:1,th:'1 ช้อน · อ่อน'},{k:2,th:'2 ช้อน · กลาง'},{k:3,th:'3 ช้อน · เข้ม'}],d.scoops,'set-scoops')}${gauge('g1',Math.min(100,(P.siftn||0)*100/6))}<div class="gmeta"><span id="gm">${P.sift?'ผงเนียน ไม่มีก้อน ✓':`ร่อนแล้ว ${P.siftn||0}/6`}</span><span>แตะรัวๆ</span></div><button class="btn wide yel" style="margin-top:12px" data-act="sift">${P.sift?'ร่อนเสร็จแล้ว ✓':'แตะเพื่อเคาะตะแกรง ⋯'}</button>`;
    case 'water': { const [a,z]=m.wt; return `<div class="lbl">อุณหภูมิน้ำ: <b id="wt" style="color:var(--accD)">${d.water}°C</b> · แนะนำ ${a}–${z}°C</div><input class="range" type="range" min="60" max="100" value="${d.water}" data-act="set-water" aria-label="อุณหภูมิน้ำ"><div class="gmeta"><span>60°C</span><span>100°C</span></div><button class="btn wide yel" style="margin-top:10px" data-act="pourwater">${P.water?'เทน้ำแล้ว ✓ 70 ml':'เทน้ำร้อน 70 ml 💧'}</button>`; }
    case 'whisk': return `<div class="whiskpad hd thin" id="pad">${P.whisk?'ฟองนุ่มละเอียดแล้ว ✓':'วนนิ้วเป็นวงกลม ⟳ ในถ้วยนี้'}<span class="wz" id="wz" style="display:none"></span></div>${gauge('g1',P.whisk?100:(S.wv||0))}<div class="gmeta"><span id="gm">${P.whisk?'ฟอง 100% ✓':`ฟอง ${Math.round(S.wv||0)}%`}</span><button style="font:600 12px Mali;text-decoration:underline" class="holdbtn" data-hold="whisk">กดค้างให้ตีอัตโนมัติ</button></div>`;
    case 'milk2': return `<div class="lbl">นม${m.straw?' (มีสตรอว์เบอร์รีบดรองแก้วแล้ว ✓)':''}</div>${chips(MILKS,d.milk,'set-milk')}<button class="btn wide yel" style="margin-top:12px" data-act="coldmilk">${P.milk?'เทนมแล้ว ✓':d.temp==='iced'?'เทนมเย็น 🥛':'เทนมอุ่น 🥛'}</button>${orderTag(d)}`;
    case 'ice': { const n=(ICES.find(i=>i.k===d.ice)||ICES[2]).n; return `<div class="lbl">ปริมาณน้ำแข็ง</div>${chips(ICES.filter(i=>i.n),d.ice,'set-ice')}${gauge('g1',Math.min(100,(S.icen||0)*100/n))}<div class="gmeta"><span id="gm">${P.ice?`น้ำแข็ง ${n} ก้อน ✓`:`ตักแล้ว ${S.icen||0}/${n} ก้อน`}</span><span>แตะทีละก้อน</span></div><button class="btn wide yel" style="margin-top:12px" data-act="scoop">${P.ice?'น้ำแข็งครบแล้ว ✓':'ตักน้ำแข็ง 🧊'}</button>`; }
    case 'top': return `<div class="lbl">ท็อปปิ้ง</div>${chips(TOPS,d.topping,'set-top')}<div class="lbl">ความหวาน</div>${chips(SWEETS,d.sweet,'set-sweet')}`;
    case 'cup': { const L=cupsFor(d); return `<div class="cups" style="margin-top:12px;grid-template-columns:repeat(${L.length},1fr)">${L.map(c=>`<button class="cupopt hd ${d.cup===c.k?'on':''}" data-act="set-cup" data-k="${c.k}"><img src="${IMG}d-${imgOf(Object.assign({},d,{cup:c.k}))}.webp" alt="">${c.th}</button>`).join('')}</div><div class="sub" style="font-size:12px;margin-top:8px">${tempOf(d)==='iced'?'เครื่องดื่มเย็น: เสิร์ฟในแก้วใส':'เครื่องดื่มร้อน: เสิร์ฟในแก้วมัคหรือแก้วกระดาษ'}</div>`; }
    case 'deco': return `<div class="lbl">สีปลอกแก้ว</div><div class="chips">${SLEEVES.map(s=>{ const L=lockOf('sleeve',s.k); return `<button class="sw hd thin ${s.c?'':'none'} ${d.sleeve===s.k?'on':''} ${L?'locked':''}" style="${s.c?`background:${s.c}`:''}" data-act="set-sleeve" data-k="${s.k}" aria-label="${s.th||s.k}${L?' (ล็อก)':''}">${L?'🔒':''}</button>`; }).join('')}</div><div class="lbl">สติกเกอร์ (${d.stickers.length}/3)</div><div class="chips">${STK.map(k=>{ const L=lockOf('sticker',k); return `<button class="stkbtn hd thin ${d.stickers.includes(k)?'on':''} ${L?'locked':''}" data-act="stk" data-k="${k}" aria-label="${k}${L?' (ล็อก)':''}">${miniSticker(k)}${L?'<i class="lk">🔒</i>':''}</button>`; }).join('')}</div><div class="sub" style="font-size:11.5px;margin-top:8px">🔒 ปลดล็อกของพิเศษเมื่อสะสมแสตมป์ติดกัน 7 / 14 / 30 วัน</div>`;
    case 'mood': return `<div class="chips" style="margin-top:12px">${MOODS.map(x=>`<button class="moodbtn hd thin ${d.mood===x.k?'on':''}" data-act="set-mood" data-k="${x.k}">${faceSVG(x.k,34)}${x.th}</button>`).join('')}</div><div class="lbl">วันนี้เป็นไง? (หนึ่งบรรทัด ไม่ใส่ก็ได้)</div><input id="note" class="noteline" type="text" maxlength="60" enterkeyhint="done" placeholder="เช่น ประชุมเยอะ แต่กาแฟอร่อย" value="${esc(d.note)}">`;
  }
  return '';
}
function fxHTML(st){
  const d=S.draft, P=S.prog;
  if (st==='shot'){ const f = P.shot?1:(S.shotf||0); return `<svg width="70" height="80" viewBox="0 0 70 80" style="filter:url(#wob)"><path d="M12 14 L58 14 L53 72 Q52 76 47 76 L23 76 Q18 76 17 72Z" fill="#FFFDF7" stroke="#5A4636" stroke-width="2.5"/><clipPath id="sc"><path d="M12 14 L58 14 L53 72 Q52 76 47 76 L23 76 Q18 76 17 72Z"/></clipPath><rect clip-path="url(#sc)" x="0" y="${76-62*f}" width="70" height="80" fill="#7A4527"/><rect clip-path="url(#sc)" x="0" y="${76-62*f}" width="70" height="7" fill="#D9A066"/><text x="35" y="10" text-anchor="middle" font-family="Mali" font-size="10" font-weight="700" fill="#5A4636">${Math.round(f*d.shots)}/${d.shots}</text></svg>`; }
  if (st==='milk' && d.temp==='hot'){ const v=P.milk?P.milkv:(S.tmp||0); return thermo(20+v*.6); }
  if (st==='water'){ return thermo(d.water); }
  if (st==='ice'){ const n=(ICES.find(i=>i.k===d.ice)||ICES[2]).n; return iceGlass(n, P.ice?n:(S.icen||0)); }
  if (st==='art' && d.art!=='none'){ return `<svg width="86" height="86" viewBox="-43 -43 86 86" style="filter:url(#wob)"><circle r="38" fill="#9A6A45" stroke="#5A4636" stroke-width="2.5"/><g fill="#FFF6EA" style="opacity:${P.art?1:.0};transition:opacity .8s">${artPath(d.art)}</g></svg>`; }
  if (st==='whisk'){ const v=P.whisk?100:(S.wv||0); return `<svg width="86" height="50" viewBox="0 0 86 50" style="filter:url(#wob)"><ellipse cx="43" cy="25" rx="40" ry="20" fill="#7FA83A" stroke="#5A4636" stroke-width="2.5"/><ellipse cx="43" cy="25" rx="36" ry="16" fill="#D7EBA0" opacity="${v/100}"/>${[...Array(9)].map((_,i)=>`<circle cx="${18+i*6}" cy="${20+(i%3)*5}" r="2.4" fill="#F7FBE4" opacity="${v/100}"/>`).join('')}</svg>`; }
  return '';
}
function orderTag(d){ const t=tempOf(d); return `<div class="otag hd thin">ออเดอร์: <b>${t==='iced'?'🧊 เย็น':'☕ ร้อน'}</b>${t==='iced'?` · ${(ICES.find(i=>i.k===d.ice)||{}).th}`:''} · ${(SIZES.find(z=>z.k===d.size)||{}).th} · ${(SWEETS.find(x=>x.k===d.sweet)||{}).th}${M(d.drink).milk?` · ${(MILKS.find(x=>x.k===d.milk)||{}).th}`:''}</div>`; }
function iceGlass(n, have){
  return `<div class="iceart"><img src="${IMG}d-${imgOf(Object.assign({},S.draft,{cup:'tumbler'}))}.webp" alt=""><b>🧊 ${have}/${n}</b></div>`;
}
function thermo(t){ const f=Math.max(0,Math.min(1,(t-20)/80)); return `<svg width="40" height="96" viewBox="0 0 40 96" style="filter:url(#wob)"><rect x="13" y="6" width="14" height="66" rx="7" fill="#FFFDF7" stroke="#5A4636" stroke-width="2.4"/><rect x="17" y="${68-56*f}" width="6" height="${56*f+6}" rx="3" fill="#E8896A"/><circle cx="20" cy="80" r="11" fill="#E8896A" stroke="#5A4636" stroke-width="2.4"/><text x="20" y="95" text-anchor="middle" font-size="0">.</text></svg><div style="font:700 13px Mali;background:#FFFDF7;border-radius:8px;padding:0 6px;margin-top:2px">${Math.round(t)}°C</div>`; }
function artPath(a){
  if (a==='heart') return `<path d="M0 18 C-26 2 -18 -20 0 -8 C18 -20 26 2 0 18Z"/>`;
  if (a==='tulip') return `<ellipse cx="0" cy="-14" rx="14" ry="8"/><ellipse cx="0" cy="0" rx="17" ry="8"/><path d="M0 12 C-20 4 -16 -4 0 2 C16 -4 20 4 0 12Z"/><rect x="-1.5" y="10" width="3" height="18"/>`;
  return `${[-20,-12,-4,4,12].map((y,i)=>`<ellipse cx="0" cy="${y}" rx="${8+i*3}" ry="4"/>`).join('')}<rect x="-1.2" y="-26" width="2.4" height="50"/>`;
}
function refreshStep(){ const st=S.steps[S.si]; $('#ctl').innerHTML=ctrlHTML(st); $('#fx').innerHTML=fxHTML(st); $('#nextBtn').disabled=!stepReady(st); bindStep(); }
function speak(t){ const b=$('#bub'); if(b){ b.textContent=t+B(S.barista).tail; b.style.animation='none'; void b.offsetWidth; b.style.animation=''; } }
function refreshPreview(){ const p=$('.preview'); if(p) p.innerHTML=stampHTML(S.draft,{face:false}); }

/* hold buttons + whisk pad */
function bindStep(){
  document.querySelectorAll('[data-hold]').forEach(btn=>{
    const kind=btn.dataset.hold; let t=null, v=0, stopLoop=()=>{};
    const startH = e => { e.preventDefault(); if (t || S.busy) return; btn.classList.add('active'); btn.setPointerCapture && e.pointerId!==undefined && btn.setPointerCapture(e.pointerId);
      SFX.buzz(8);
      if (kind==='grind') stopLoop=SFX.loop('grind',{vol:.22});
      if (kind==='milk') stopLoop=SFX.loop('froth',{vol:.2});
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
        v=Math.min(100, v + (kind==='grind'?3.2:kind==='tamp'?1.8:1.3));
        const g=$('#g1'); if(g) g.style.width=v+'%';
        if (kind==='tamp'){ $('#gm').textContent=`แรงกด ${Math.round(v/5)} kg`; }
        if (kind==='milk'){ $('#gm').textContent=`${Math.round(20+v*.6)}°C`; S.tmp=v; $('#fx').innerHTML=fxHTML('milk'); }
        if (kind==='grind' && v>=100){ endH(); }
        if (v>=100 && kind!=='grind'){ endH(); }
      }, 50);
    };
    const endH = () => { if(!t) return; clearInterval(t); t=null; btn.classList.remove('active'); stopLoop();
      if (kind==='shot'){ if (v<60){ S.shotf=0; toast('ช็อตอ่อนไป กดค้างนานขึ้นอีกนิด'); } else { S.prog.shot=true; S.shotf=1; S.draft.shotq = v>=88&&v<=102 ? 'perfect' : v>102 ? 'strong' : 'ok';
          if (S.draft.shotq==='perfect'){ SFX.play('chime',{vol:.25}); SFX.buzz([12,40,12]); speak('ช็อตเพอร์เฟกต์! ครีม่าสวยมาก'); } else { SFX.play('plop',{vol:.25}); speak(S.draft.shotq==='strong'?'เข้มหน่อย แต่หอมดีนะ':'ใช้ได้เลย ครั้งหน้าลองปล่อยในโซนทองนะ'); } } refreshStep(); return; }
      if (kind==='grind'){ if (v>=100){ S.prog.grind=true; SFX.buzz(10); speak('บดเสร็จ หอมฟุ้งเลย'); } else { S.tmp=v; toast('กดค้างจนเต็มนะ'); } S.tmp=0; }
      if (kind==='tamp'){ if (v>=55 && v<=80){ S.prog.tamp=true; S.prog.tampv=v; SFX.play('tap',{vol:.4, rate:.7}); SFX.buzz([10,30,10]); speak('แทมป์เรียบเนียนเป๊ะ!'); } else { S.tf=(S.tf||0)+1; if (S.tf>=3){ S.prog.tamp=true; S.prog.tampv=v; speak('เกือบแล้ว! ใช้ได้ๆ'); } else { toast(v<55?'เบาไปนิด ลองใหม่อีกที':'แน่นเกินไป ลองใหม่อีกที'); } } }
      if (kind==='milk'){ if (v>=58 && v<=75){ S.prog.milk=true; S.prog.milkv=v; SFX.buzz(10); speak('นมเนียนนุ่ม ไมโครโฟมสวย'); } else { S.tmp=0; toast(v<58?'ยังไม่อุ่นพอ ลองค้างนานขึ้น':'ร้อนเกินไป นมจะไหม้ ลองใหม่'); } }
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
  return `<div class="done"><div class="badge hd thin">STAMP COLLECTED! ✦</div>
  <div class="H xl" style="margin-top:14px">ได้แสตมป์วันนี้แล้ว!</div><div class="sub">${thDate(new Date())}</div>
  ${stampHTML(e)}
  <div class="H" style="font-size:24px">${esc(m.th)}</div>
  <div style="font-size:13.5px;margin-top:4px">บาริสต้าวันนี้: <b>${esc(b.th)}</b> (${esc(b.prop)})</div>
  <div class="greet hd thin" style="margin:14px 0 0;text-align:left"><img src="${bImg(b.k)}" alt=""><span>${e.note?`<span class="sub" style="font-size:12px">วันนี้เป็นไง: "${esc(e.note)}"</span><br>`:''}"${esc(replyFor(e))}${b.tail}"</span></div>
  <button class="btn wide yel" style="margin-top:16px" data-act="story-day" data-k="${todayKey()}">แชร์แก้ววันนี้ · สตอรี่ 9:16 ↗</button>
  <div style="display:flex;gap:10px;margin-top:10px"><button class="btn soft hd" style="flex:1" data-act="home">ดูสมุดแสตมป์</button><button class="btn" style="flex:1" data-go="summary">สรุปเดือนนี้ ◔</button></div>
  ${stars([[30,40,16],[330,70,12,.4],[40,330,12,.8],[320,300,16,1.2]])}</div>`;
}
function finish(){
  const n=$('#note'); if(n) S.draft.note=n.value.trim();
  const e = Object.assign({}, S.draft, { ts:Date.now() });
  if (!isCoffee(M(e.drink))) e.shots = 0;
  db.entries[todayKey()] = e; save();
  const d=new Date(); S.calY=d.getFullYear(); S.calM=d.getMonth();
  S.edit=false; S.draft=null; go('done'); confetti(); SFX.play('stamp',{vol:.4, delay:.25}); SFX.play('quack',{vol:.35, rate:1.25, delay:.9}); SFX.buzz([20,60,20,60,30]);
}

/* ----- sheets ----- */
function openSheet(html){ $('#sheetBody').innerHTML=html; $('#sheet').classList.add('open'); $('#sheetBack').classList.add('open'); $('#sheet').scrollTop=0; }
function closeSheet(){ $('#sheet').classList.remove('open'); $('#sheetBack').classList.remove('open'); }
function detailSheet(k){
  const e=db.entries[k]; if(!e) return; const m=M(e.drink), b=B(e.barista), d=parseKey(k), mood=MOODS.find(x=>x.k===e.mood);
  const rows = [['เมนู',`${m.th} · ${tempOf(e)==='iced'?'เย็น':'ร้อน'}`], ...(e.size?[['ขนาด',`${(SIZES.find(z=>z.k===e.size)||{}).th}${e.price?` · ฿${e.price}`:''}`]]:[]), ...(tempOf(e)==='iced'&&e.ice?[['น้ำแข็ง',(ICES.find(i=>i.k===e.ice)||{}).th]]:[]), ...(e.sweet!==undefined?[['ความหวาน',(SWEETS.find(x=>x.k===e.sweet)||{}).th]]:[]), ...(isCoffee(m)?[['เมล็ด',(BEANS.find(x=>x.k===e.bean)||{}).th],['ช็อต',`${e.shots} ช็อต`]]:[['ผง',`${e.scoops} ช้อน · น้ำ ${e.water}°C`]]), ...(m.milk?[['นม',(MILKS.find(x=>x.k===e.milk)||{}).th]]:[]), ...(m.art&&tempOf(e)==='hot'?[['ลาเต้อาร์ต',(ARTS.find(x=>x.k===e.art)||{}).th]]:[]), ...(isCoffee(m)?[['ไซรัป',(SYRUPS.find(x=>x.k===e.syrup)||{}).th]]:[['ท็อปปิ้ง',(TOPS.find(x=>x.k===e.topping)||{}).th]]), ['แก้ว',(CUPS.find(x=>x.k===e.cup)||{}).th], ['บาริสต้า',`${b.th} (${b.prop})`]];
  openSheet(`<div style="text-align:center"><div class="sub">${thDate(d)}</div><div class="H" style="margin:4px 0 14px">${esc(m.th)}</div><div style="width:190px;margin:0 auto">${stampHTML(e)}</div>
  <div style="margin-top:14px;display:flex;align-items:center;justify-content:center;gap:8px;font:600 14px Mali">${mood?faceSVG(mood.k,30)+'มู้ด '+mood.th:''}</div>${e.note?`<div class="desc hd thin" style="text-align:left"><span class="sub" style="font-size:12px">วันนี้เป็นไง</span><br>"${esc(e.note)}"</div>`:''}${e.mood?`<div class="sub" style="font-size:12.5px;margin-top:8px">${esc(B(e.barista).th)}: "${esc(replyFor(e))}"</div>`:''}</div>
  <dl class="kv">${rows.map(([a,c])=>`<dt>${a}</dt><dd>${esc(c||'-')}</dd>`).join('')}</dl>
  <div class="greet hd thin" style="margin:14px 0 0"><img src="${bImg(b.k)}" alt=""><span>บาริสต้าวันนี้: <b>${esc(b.th)}</b><br><span class="sub" style="font-size:12px">${esc(b.quirk)}</span></span></div>
  ${k===todayKey()?`<div style="display:flex;gap:10px;margin-top:16px"><button class="btn soft hd" style="flex:1" data-act="del">ลบแก้ววันนี้</button><button class="btn" style="flex:1" data-act="edit">แก้ไข / ชงใหม่</button></div>`:''}<button class="btn wide yel" style="margin-top:10px" data-act="story-day" data-k="${k}">การ์ดแก้ววันนั้น · สตอรี่ 9:16 ↗</button>`);
}
function aboutSheet(){
  openSheet(`<div class="H">เกี่ยวกับ & เครดิต</div><p style="font-size:14px;line-height:1.6;margin-top:8px">ก๊าบก๊าบคาเฟ่ · MOOD CUP คือสมุดสะสมมู้ดประจำวัน ทุกวันเข้าร้าน เจอบาริสต้าน้องเป็ดแบบสุ่ม ชงเครื่องดื่มเองทีละขั้น แล้วเก็บเป็นแสตมป์ ข้อมูลทั้งหมดเก็บใน localStorage ของเครื่องนี้เท่านั้น</p>
  <div class="lbl">น้องเป็ดที่จะมาเป็นบาริสต้าเร็วๆ นี้</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${BARISTAS.slice(1).map(b=>`<div style="text-align:center;font:600 11.5px Mali"><img src="${bImg(b.k)}" alt="" style="width:100%;aspect-ratio:1;object-fit:cover;mix-blend-mode:multiply;border-radius:14px">${b.th}</div>`).join('')}</div>
  <div class="lbl">เครดิตภาพ</div><ul style="font-size:13px;line-height:1.7;padding-left:18px">
  <li>หน้าร้าน บาร์กาแฟ บาร์มัทฉะ และแสตมป์เครื่องดื่ม: วาดด้วย <b>agy (Google Antigravity CLI)</b></li><li>บาริสต้าเป๊ะ: วาดด้วย agy · น้องเป็ดอีก 12 ตัว (ภาพในหน้านี้จากชีตตัวละคร Duckling Sort) กำลังวาดด้วย agy แล้วจะสุ่มมาเป็นบาริสต้า</li>
  <li>สติกเกอร์ หน้ามู้ด เส้นวาดมือ และกราฟ: SVG ที่เขียนด้วยโค้ด</li><li>ฟอนต์: Itim, Mali, Sriracha (Google Fonts)</li><li>เพลงโลไฟ: Seth_Makes_Sounds · เสียงบรรยากาศร้าน: Anya_Media (Freesound, CC0) · เสียงเอฟเฟกต์: Kenyset</li></ul>`);
}

/* ----- collection ----- */
function collectionSheet(){
  const met=metCounts(), nMet=BARISTAS.filter(b=>met[b.k]).length, best=bestStreak();
  openSheet(`<div class="sub">ก๊าบก๊าบคาเฟ่ · สะสม</div><div class="H">สมุดสะสมของฉัน</div>
  <div class="lbl" style="margin-top:12px">น้องเป็ดที่เคยเป็นบาริสต้าให้ (${nMet}/${BARISTAS.length})</div>
  <div class="ducks">${BARISTAS.map(b=>{ const n=met[b.k]||0; return `<div class="duckcard hd thin ${n?'':'unmet'}"><img src="${bImg(b.k)}" alt="${n?esc(b.th):'ยังไม่เจอ'}"><b>${n?esc(b.th):'???'}</b><small>${n?`เจอ ${n} ครั้ง`:'ยังไม่เจอ'}</small></div>`; }).join('')}</div>
  ${RANDOM_BARISTA?'':'<div class="sub" style="font-size:12px;margin-top:8px">ตอนนี้เป๊ะประจำบาร์ทุกวัน · น้องเป็ดตัวอื่นกำลังเตรียมผ้ากันเปื้อน จะเริ่มสุ่มมาเป็นบาริสต้าเร็วๆ นี้ ✿</div>'}
  <div class="lbl" style="margin-top:16px">รางวัลสตรีค · สถิติติดกันยาวสุด ${best} วัน</div>
  <div class="rewards">${REWARDS.map(r=>{ const ok=best>=r.d; return `<div class="reward hd thin ${ok?'ok':''}"><span class="ricon">${r.type==='sleeve'?`<i class="rsl" style="border-color:${SLEEVES.find(x=>x.k===r.k).c}"></i>`:miniSticker(r.k)}</span><div style="flex:1"><b>${r.th}</b><div class="sub" style="font-size:12px">${ok?'ปลดล็อกแล้ว ใช้ได้ที่ขั้น "แต่งแก้ว" ✓':`สะสมติดกัน ${r.d} วัน · อีก ${r.d-best} วัน`}</div><div class="mix hd thin" style="margin-top:6px;height:10px"><i style="width:${Math.min(100,best/r.d*100)}%;background:${ok?'#9DBF6A':'#F2C94C'}"></i></div></div></div>`; }).join('')}</div>
  <div class="sub" style="font-size:11.5px;margin-top:10px">* ข้อมูลตัวอย่างไม่นับรวมในสตรีคและการสะสม</div>`);
}
/* ----- summary ----- */
function stats(y,m){
  const ents = monthEntries(y,m).sort((a,b)=>a[0]<b[0]?-1:1);
  const cnt={coffee:0,matcha:0,other:0}, drinks={}, cups={}, bar={}, moods={}; let shots=0;
  ents.forEach(([,e])=>{ const mm=M(e.drink); cnt[mm.cat]++; drinks[mm.k]=(drinks[mm.k]||0)+1; cups[e.cup]=(cups[e.cup]||0)+1; bar[e.barista]=(bar[e.barista]||0)+1; if(e.mood) moods[e.mood]=(moods[e.mood]||0)+1; shots+=e.shots||0; });
  const top = o => Object.entries(o).sort((a,b)=>b[1]-a[1])[0];
  let best=0, run=0, prev=null;
  ents.forEach(([k])=>{ const d=parseKey(k); run = prev && (d-prev)/864e5===1 ? run+1 : 1; best=Math.max(best,run); prev=d; });
  let cur=0; const t=new Date(); t.setHours(0,0,0,0); let d=new Date(t); if(!db.entries[keyOf(d)]) d.setDate(d.getDate()-1);
  while (db.entries[keyOf(d)]){ cur++; d.setDate(d.getDate()-1); }
  return { n:ents.length, days:new Date(y,m+1,0).getDate(), cnt, shots, best, cur, drink:top(drinks), cup:top(cups), bar:top(bar), mood:top(moods), ents };
}
function donutSVG(cnt, size=150){
  const tot = cnt.coffee+cnt.matcha+cnt.other || 1, r=52, C=2*Math.PI*r; let off=0;
  const segs = ['coffee','matcha','other'].map(c=>{ const f=cnt[c]/tot; const s=`<circle r="${r}" fill="none" stroke="${CAT[c].c}" stroke-width="26" stroke-dasharray="${f*C} ${C}" stroke-dashoffset="${-off*C}" transform="rotate(-90)"/>`; off+=f; return f?s:''; }).join('');
  return `<svg width="${size}" height="${size}" viewBox="-75 -75 150 150"><g style="filter:url(#pencil)">${segs}</g><circle r="66" fill="none" stroke="#5A4636" stroke-width="2" style="filter:url(#wob)" opacity=".7"/><circle r="38" fill="none" stroke="#5A4636" stroke-width="2" style="filter:url(#wob)" opacity=".7"/></svg>`;
}
function summarySheet(){
  const y=S.calY, m=S.calM, s=stats(y,m), tot=s.n||1;
  if (!s.n){ openSheet(`<div class="H">สรุปเดือน${THM[m]} ${y+543}</div><p class="sub" style="margin:10px 0 16px">ยังไม่มีแสตมป์ในเดือนนี้เลย ลองชงแก้วแรก หรือเติมข้อมูลตัวอย่างดูก่อนก็ได้</p><button class="btn wide" data-act="demo">เติมข้อมูลตัวอย่าง</button>`); return; }
  const bb = B(s.bar[0]);
  openSheet(`<div class="sub">ก๊าบก๊าบคาเฟ่ · MOOD CUP</div><div class="H">สรุปเดือน${THM[m]} ${y+543}</div>
  <div class="donutrow">${donutSVG(s.cnt)}<div class="legend">${['coffee','matcha','other'].map(c=>`<div><i style="background:${CAT[c].c}"></i>${CAT[c].th} ${Math.round(s.cnt[c]/tot*100)}% <span class="sub" style="font-size:12px">(${s.cnt[c]})</span></div>`).join('')}</div></div>
  <div class="tiles" style="margin-top:12px"><div class="tile hd thin">สะสม<b>${s.n}/${s.days}</b>วัน</div><div class="tile hd thin">ช็อตรวม<b>${s.shots}</b>ช็อต</div><div class="tile hd thin">สตรีคยาวสุด<b>${s.best}</b>วันติด</div>
  <div class="tile hd thin">สตรีคตอนนี้<b>${s.cur}</b>วัน</div><div class="tile hd thin">เมนูโปรด<b style="font-size:16px">${esc(M(s.drink[0]).th)}</b>${s.drink[1]} แก้ว</div><div class="tile hd thin">แก้วโปรด<b style="font-size:16px">${esc((CUPS.find(c=>c.k===s.cup[0])||{}).th||'-')}</b>${s.cup[1]} ครั้ง</div></div>
  <div class="greet hd thin" style="margin:12px 0 0"><img src="${bImg(bb.k)}" alt=""><span>บาริสต้าประจำเดือน: <b>${esc(bb.th)}</b> (${s.bar[1]} ครั้ง)<br><span class="sub" style="font-size:12px">${s.mood?`มู้ดยอดฮิต: ${esc(MOODS.find(x=>x.k===s.mood[0]).th)}`:''}</span></span></div>
  <div class="lbl" style="margin-top:16px">การ์ดแชร์ (PNG)</div><img class="sharecv" id="shareImg" alt="การ์ดสรุปเดือน"><div style="display:flex;gap:10px;margin-top:12px"><button class="btn wide" data-act="dl">ดาวน์โหลด PNG ⤓</button><button class="btn soft hd" data-act="share">แชร์ ↗</button></div><button class="btn wide yel" style="margin-top:10px" data-act="story-month">การ์ดสตอรี่ 9:16 (IG / TikTok) ✦</button>`);
  makeCard(y,m,s).then(url=>{ const im=$('#shareImg'); if(im) im.src=url; }).catch(err=>{ console.warn(err); });
}
/* Thai-safe wrapping: break on word segments (never inside a syllable/diacritic) */
function wrapText(x, str, X, Y, maxW, lh, maxLines){
  const segs = typeof Intl!=='undefined' && Intl.Segmenter ? [...new Intl.Segmenter('th',{granularity:'word'}).segment(str)].map(s=>s.segment) : str.split(/(\s+)/);
  const lines=[]; let cur='';
  for (const sg of segs){ if (x.measureText(cur+sg).width>maxW && cur){ lines.push(cur); cur=sg.trimStart(); } else cur+=sg; }
  if (cur) lines.push(cur);
  const out=lines.slice(0,maxLines); if (lines.length>maxLines){ let l=out[maxLines-1]; while (l.length>1 && x.measureText(l+'…').width>maxW) l=l.slice(0,-1); out[maxLines-1]=l+'…'; }
  out.forEach((l,i)=>x.fillText(l,X,Y+i*lh));
}
/* canvas text that always fits its box: shrink, then ellipsis */
function fitText(x, str, X, Y, maxW, px, w='400', fam='Itim', min=20){
  let f=px; x.font=`${w} ${f}px ${fam}`;
  while (x.measureText(str).width>maxW && f>min){ f-=2; x.font=`${w} ${f}px ${fam}`; }
  let t=str; if (x.measureText(t).width>maxW){ while (t.length>1 && x.measureText(t+'…').width>maxW) t=t.slice(0,-1); t+='…'; }
  x.fillText(t, X, Y); return f;
}
const loadImg = src => new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; });
let cardURL=null, cardBlob=null;
async function makeCard(y,m,s){
  await Promise.all(['400 40px Itim','600 30px Mali','700 30px Mali','400 30px Sriracha'].map(f=>document.fonts.load(f)));
  const W=1080,H=1350, c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d');
  const ink='#5A4636';
  x.fillStyle='#FFF8EC'; x.fillRect(0,0,W,H);
  // paper grain
  for(let i=0;i<9000;i++){ x.fillStyle=`rgba(90,70,54,${Math.random()*.05})`; x.fillRect(Math.random()*W,Math.random()*H,2,2); }
  const wob = (fn) => { x.save(); fn(); x.restore(); };
  const rr = (X,Y,w,h,r,fill,stroke) => { x.beginPath(); const j=()=> (Math.random()-.5)*2.2; x.moveTo(X+r,Y+j()); x.lineTo(X+w-r,Y+j()); x.quadraticCurveTo(X+w,Y,X+w+j(),Y+r); x.lineTo(X+w+j(),Y+h-r); x.quadraticCurveTo(X+w,Y+h,X+w-r,Y+h+j()); x.lineTo(X+r,Y+h+j()); x.quadraticCurveTo(X,Y+h,X+j(),Y+h-r); x.lineTo(X+j(),Y+r); x.quadraticCurveTo(X,Y,X+r,Y); x.closePath(); if(fill){x.fillStyle=fill;x.fill();} if(stroke){x.strokeStyle=stroke;x.lineWidth=4;x.stroke();} };
  rr(30,30,W-60,H-60,48,null,ink);
  x.fillStyle='#F2C94C'; [[90,110,22],[980,150,18],[960,1200,22],[110,1230,16],[700,90,14]].forEach(([a,b,r])=>{ x.font=`${r*2}px Mali`; x.fillText('★',a,b); });
  x.fillStyle=ink; x.textAlign='center';
  x.font='600 30px Mali'; x.fillText('ก๊าบก๊าบคาเฟ่ · MOOD CUP',W/2,120);
  x.font='400 74px Itim'; x.fillText(`สรุปเดือน${THM[m]} ${y+543}`,W/2,210);
  // donut
  const tot=s.n||1; let a0=-Math.PI/2; const cx=290, cy=440;
  ['coffee','matcha','other'].forEach(k=>{ const f=s.cnt[k]/tot; if(!f) return; x.beginPath(); x.strokeStyle=CAT[k].c; x.lineWidth=78; x.arc(cx,cy,135,a0,a0+f*Math.PI*2); x.stroke(); a0+=f*Math.PI*2; });
  x.lineWidth=4; x.strokeStyle=ink; x.beginPath(); x.arc(cx,cy,175,0,7); x.stroke(); x.beginPath(); x.arc(cx,cy,96,0,7); x.stroke();
  x.font='400 54px Itim'; x.fillText(`${s.n}`,cx,cy+12); x.font='600 24px Mali'; x.fillText('แก้ว',cx,cy+46);
  x.textAlign='left';
  ['coffee','matcha','other'].forEach((k,i)=>{ const yy=360+i*80; x.fillStyle=CAT[k].c; x.beginPath(); x.arc(540,yy-12,20,0,7); x.fill(); x.strokeStyle=ink; x.lineWidth=3; x.stroke(); x.fillStyle=ink; x.font='700 40px Mali'; x.fillText(`${CAT[k].th} ${Math.round(s.cnt[k]/tot*100)}%`,580,yy); });
  // tiles
  const tiles=[['สะสม',`${s.n}/${s.days}`,'วัน'],['ช็อตรวม',`${s.shots}`,'ช็อต'],['สตรีคยาวสุด',`${s.best}`,'วันติด'],['เมนูโปรด',M(s.drink[0]).th,`${s.drink[1]} แก้ว`]];
  tiles.forEach((t,i)=>{ const X=70+i*240, Y=660; rr(X,Y,220,170,30,'#FFFDF7',ink); x.fillStyle=ink; x.textAlign='center'; x.font='600 24px Mali'; x.fillText(t[0],X+110,Y+44); fitText(x,t[1],X+110,Y+112,196,58,'400','Itim'); x.font='600 22px Mali'; x.fillText(t[2],X+110,Y+148); });
  // barista
  const bb=B(s.bar[0]); rr(70,870,940,150,40,'#FFE7A3',ink);
  try { const bi=await loadImg(bImg(bb.k)); x.save(); x.beginPath(); x.arc(160,945,62,0,7); x.closePath(); x.fillStyle='#FFFDF7'; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; x.drawImage(bi,98,872,124,124); x.restore(); } catch(e){}
  x.textAlign='left'; x.fillStyle=ink; x.font='600 26px Mali'; x.fillText('บาริสต้าประจำเดือน',250,925); fitText(x,`${bb.th} · ${s.bar[1]} ครั้ง`,250,985,730,50,'400','Itim');
  // stamps grid
  const ents=s.ents.slice(0,33), cols=11, cell=84;
  const imgs = await Promise.all([...new Set(ents.map(([,e])=>imgOf(e)))].map(async k=>[k, await loadImg(`${IMG}d-${k}.webp`).catch(()=>null)]));
  const IM=Object.fromEntries(imgs);
  ents.forEach(([k,e],i)=>{ const col=i%cols,row=Math.floor(i/cols), X=82+col*cell+cell/2, Y=1080+row*cell+cell/2; const mm=M(e.drink);
    x.save(); x.beginPath(); x.arc(X,Y,37,0,7); x.fillStyle=TINT[imgOf(e)]; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; if(IM[imgOf(e)]) x.drawImage(IM[imgOf(e)],X-42,Y-42,84,84); x.restore();
    x.setLineDash([6,5]); x.strokeStyle=ink; x.lineWidth=2.5; x.beginPath(); x.arc(X,Y,38,0,7); x.stroke(); x.setLineDash([]); });
  x.textAlign='center'; x.font='600 24px Mali'; x.fillStyle='#8A7262'; x.fillText('#ก๊าบก๊าบคาเฟ่  #MoodCup',W/2,H-56);
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
  x.setLineDash([14,11]); x.strokeStyle='#5A4636'; x.globalAlpha=.55; x.lineWidth=5; x.beginPath(); x.arc(cx,cy,R+10,0,7); x.stroke(); x.setLineDash([]); x.globalAlpha=1;
  const sl=(SLEEVES.find(z=>z.k===e.sleeve)||{}).c; if(sl){ x.strokeStyle=sl; x.globalAlpha=.9; x.lineWidth=22; x.beginPath(); x.arc(cx,cy,R+30,0,7); x.stroke(); x.globalAlpha=1; }
  for (const [i,k] of (e.stickers||[]).entries()){ const si=await svgImg(miniSticker(k)).catch(()=>null); if(si){ const p=STK_POS[i]; x.drawImage(si, cx-R+p[0]/100*2*R, cy-R+p[1]/100*2*R, R*.48, R*.48); } }
}
async function storyCard(kind, key){
  await Promise.all(['400 40px Itim','600 30px Mali','700 30px Mali'].map(f=>document.fonts.load(f)));
  const W=1080,H=1920, c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'), ink='#5A4636';
  paper(x,W,H); rrect(x,36,36,W-72,H-72,56,null,ink,5);
  x.fillStyle='#F2C94C'; [[100,130,22],[960,170,18],[950,1780,22],[120,1800,16]].forEach(([a,b,r])=>{ x.font=`${r*2}px Mali`; x.fillText('★',a,b); });
  x.fillStyle=ink; x.textAlign='center'; x.font='600 34px Mali'; x.fillText('ก๊าบก๊าบคาเฟ่ · MOOD CUP',W/2,150);
  if (kind==='day'){
    const e=db.entries[key], m=M(e.drink), b=B(e.barista), mood=MOODS.find(z=>z.k===e.mood);
    fitText(x,'แก้ววันนี้',W/2,250,900,84); x.font='600 34px Mali'; x.fillText(thDate(parseKey(key)),W/2,310);
    await drawStamp(x,e,W/2,700,300);
    x.fillStyle=ink; fitText(x,m.th,W/2,1135,900,92);
    const opt=[tempOf(e)==='iced'?'เย็น':'ร้อน', tempOf(e)==='iced'&&e.ice?(ICES.find(i=>i.k===e.ice)||{}).th:null, (SIZES.find(z=>z.k===e.size)||{}).th, (SWEETS.find(z=>z.k===e.sweet)||{}).th, m.milk?(MILKS.find(z=>z.k===e.milk)||{}).th:null].filter(Boolean).join(' · ');
    fitText(x,opt,W/2,1200,920,36,'600','Mali');
    let y=1270;
    if (mood){ const fi=await svgImg(faceSVG(mood.k,90)).catch(()=>null); x.font='700 44px Mali'; const tw=x.measureText('มู้ด '+mood.th).width; const X0=W/2-(tw+110)/2; if(fi) x.drawImage(fi,X0,y,90,90); x.textAlign='left'; x.fillText('มู้ด '+mood.th,X0+110,y+62); x.textAlign='center'; y+=130; }
    if (e.note){ rrect(x,110,y,W-220,120,36,'#FFFDF7',ink,3); x.fillStyle=ink; fitText(x,`"${e.note}"`,W/2,y+76,W-280,44,'600','Mali'); y+=160; }
    rrect(x,110,y,W-220,190,44,'#FFE7A3',ink,4);
    try{ const bi=await loadImg(bImg(b.k)); x.save(); x.beginPath(); x.arc(220,y+95,70,0,7); x.fillStyle='#FFFDF7'; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; x.drawImage(bi,150,y+25,140,140); x.restore(); }catch(err){}
    x.fillStyle=ink; x.textAlign='left'; x.font='600 30px Mali'; x.fillText(`บาริสต้าวันนี้: ${b.th}`,320,y+70);
    x.font='500 30px Mali'; wrapText(x, replyFor(e), 320, y+118, 620, 40, 2);
  } else {
    const [y0,m0]=key.split('-').map(Number), st=stats(y0,m0), tot=st.n||1;
    fitText(x,`สรุปเดือน${THM[m0]} ${y0+543}`,W/2,270,920,84);
    let a0=-Math.PI/2; const cx=W/2, cy=640;
    ['coffee','matcha','other'].forEach(k=>{ const f=st.cnt[k]/tot; if(!f) return; x.beginPath(); x.strokeStyle=CAT[k].c; x.lineWidth=110; x.arc(cx,cy,200,a0,a0+f*Math.PI*2); x.stroke(); a0+=f*Math.PI*2; });
    x.lineWidth=5; x.strokeStyle=ink; x.beginPath(); x.arc(cx,cy,258,0,7); x.stroke(); x.beginPath(); x.arc(cx,cy,142,0,7); x.stroke();
    x.fillStyle=ink; x.font='400 96px Itim'; x.fillText(`${st.n}`,cx,cy+20); x.font='600 34px Mali'; x.fillText('แก้ว',cx,cy+70);
    x.font='700 38px Mali'; x.fillText(['coffee','matcha','other'].map(k=>`${CAT[k].th} ${Math.round(st.cnt[k]/tot*100)}%`).join('   '),W/2,980);
    const tiles=[['สะสม',`${st.n}/${st.days}`,'วัน'],['สตรีคยาวสุด',`${st.best}`,'วันติด'],['เมนูโปรด',st.drink?M(st.drink[0]).th:'-',st.drink?`${st.drink[1]} แก้ว`:'']];
    tiles.forEach((t,i)=>{ const X=90+i*310, Y=1040; rrect(x,X,Y,280,200,36,'#FFFDF7',ink,4); x.fillStyle=ink; x.textAlign='center'; x.font='600 28px Mali'; x.fillText(t[0],X+140,Y+52); fitText(x,t[1],X+140,Y+128,248,66); x.font='600 26px Mali'; x.fillText(t[2],X+140,Y+174); });
    if (st.bar){ const bb=B(st.bar[0]); rrect(x,90,1280,900,150,44,'#FFE7A3',ink,4); try{ const bi=await loadImg(bImg(bb.k)); x.save(); x.beginPath(); x.arc(180,1355,58,0,7); x.fillStyle='#FFFDF7'; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; x.drawImage(bi,122,1297,116,116); x.restore(); }catch(err){} x.fillStyle=ink; x.textAlign='left'; x.font='600 28px Mali'; x.fillText('บาริสต้าประจำเดือน',270,1335); fitText(x,`${bb.th} · ${st.bar[1]} ครั้ง`,270,1395,690,46); x.textAlign='center'; }
    const ents=st.ents.slice(0,24), cols=8, cell=110;
    for (const [i,[k,e]] of ents.entries()){ const X=W/2-(cols*cell)/2+(i%cols)*cell+cell/2, Y=1520+Math.floor(i/cols)*cell; const im=imgOf(e), art=await loadImg(`${IMG}d-${im}.webp`).catch(()=>null);
      x.save(); x.beginPath(); x.arc(X,Y,48,0,7); x.fillStyle=TINT[im]||'#F8E6CF'; x.fill(); x.clip(); x.globalCompositeOperation='multiply'; if(art) x.drawImage(art,X-54,Y-54,108,108); x.restore(); x.setLineDash([7,6]); x.strokeStyle=ink; x.lineWidth=3; x.beginPath(); x.arc(X,Y,50,0,7); x.stroke(); x.setLineDash([]); }
  }
  x.textAlign='center'; x.fillStyle='#8A7262'; x.font='600 30px Mali'; x.fillText('#ก๊าบก๊าบคาเฟ่  #MoodCup',W/2,H-80);
  return new Promise(res=>c.toBlob(res,'image/png'));
}
let story={blob:null,url:null,name:''};
async function storySheet(kind, key){
  openSheet(`<div class="H">${kind==='day'?'การ์ดแก้ววันนี้':'การ์ดสรุปเดือน'} · สตอรี่ 9:16</div><div class="sub" style="font-size:12.5px;margin:4px 0 10px">ขนาด 1080×1920 พร้อมลง IG / TikTok Story</div><img class="storyimg" id="storyImg" alt="การ์ดสตอรี่"><div class="storyload" id="storyLoad">กำลังวาดการ์ด...</div><div style="display:flex;gap:10px;margin-top:12px"><button class="btn wide" data-act="story-share">แชร์ ↗</button><button class="btn soft hd" data-act="story-dl">ดาวน์โหลด ⤓</button></div>`);
  try { const b=await storyCard(kind,key); if(story.url) URL.revokeObjectURL(story.url); story={blob:b,url:URL.createObjectURL(b),name:`moodcup-${kind==='day'?'day':'month'}-${key}.png`}; const im=$('#storyImg'); if(im){ im.src=story.url; $('#storyLoad').remove(); } }
  catch(err){ console.warn(err); const l=$('#storyLoad'); if(l) l.textContent='สร้างการ์ดไม่สำเร็จ ลองใหม่อีกครั้ง'; }
}
function downloadBlob(url,name){ const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
async function shareBlob(blob,url,name){
  const f=new File([blob],name,{type:'image/png'});
  if (navigator.canShare && navigator.canShare({files:[f]})){ try { await navigator.share({files:[f],title:'MOOD CUP · ก๊าบก๊าบคาเฟ่'}); return; } catch(err){ if (err && err.name==='AbortError') return; } }
  downloadBlob(url,name); toast('เครื่องนี้แชร์ไฟล์ตรงไม่ได้ เลยดาวน์โหลดให้แทนนะ',1);
}
/* ----- demo ----- */
function demo(){
  const now=new Date(); let added=0;
  for (let i=1;i<=45;i++){
    const d=new Date(now); d.setDate(d.getDate()-i); const k=keyOf(d);
    if (db.entries[k] || Math.random()<.14) continue;
    const r=Math.random(), pool = (r<.45 ? MENU.filter(m=>m.cat==='coffee') : r<.82 ? MENU.filter(m=>m.cat==='matcha') : MENU.filter(m=>m.cat==='other')).filter(m=>!m.season);
    const m=pool[Math.floor(Math.random()*pool.length)], temp=m.temp||(Math.random()<.55?'iced':'hot');
    db.entries[k] = { drink:m.k, barista:BARISTAS[Math.floor(Math.random()*12)].k, temp, bean:BEANS[Math.floor(Math.random()*4)].k, grind:'fine', shots:isCoffee(m)?1+Math.floor(Math.random()*3):0, milk:MILKS[Math.floor(Math.random()*4)].k, art:ARTS[Math.floor(Math.random()*3)].k, syrup:SYRUPS[Math.floor(Math.random()*5)].k, scoops:2, water:80, topping:TOPS[Math.floor(Math.random()*5)].k, cup:temp==='iced'?(Math.random()<.6?'tumbler':'glass'):(Math.random()<.6?'mug':'paper'), sleeve:SLEEVES[Math.floor(Math.random()*7)].k, size:SIZES[Math.floor(Math.random()*3)].k, ice:ICES[1+Math.floor(Math.random()*3)].k, sweet:SWEETS[Math.floor(Math.random()*5)].k, stickers:STK.filter(()=>Math.random()<.18).slice(0,3), mood:MOODS[Math.floor(Math.random()*8)].k, note:'', ts:+d, demo:true };
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
    ${sl('music','เพลง','🎵')}${sl('amb','เสียงร้าน','☕')}
    <button class="vsw ${SFX.muted?'':'on'}" data-act="sfx-onoff" role="switch" aria-checked="${!SFX.muted}"><i></i>เสียงเอฟเฟกต์</button>
    ${sl('sfx','เอฟเฟกต์','🔔')}
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
    if (v==='start'){ if (db.entries[todayKey()] && S.view!=='cafe'){ S.view='home'; render(); detailSheet(todayKey()); return; } S.edit=false; S.draft=null; enterCafe(); }
    if (v==='summary'){ if (S.view!=='home') go('home'); setTimeout(summarySheet, 60); }
    if (v==='collect'){ if (S.view!=='home') go('home'); setTimeout(collectionSheet, 60); }
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
    case 'set-ice': d.ice=k; S.prog.ice=false; S.icen=Math.min(S.icen||0,(ICES.find(i=>i.k===k)||ICES[2]).n); if(S.icen>=(ICES.find(i=>i.k===k)||ICES[2]).n) S.prog.ice=true; refresh(); refreshPreview(); break;
    case 'scoop': { if (S.prog.ice) break; const n=(ICES.find(i=>i.k===d.ice)||ICES[2]).n; S.icen=(S.icen||0)+1; if (S.icen>=n){ S.prog.ice=true; speak('น้ำแข็งเย็นเจี๊ยบ ครบแล้ว'); } refresh(); break; }
    case 'home': closeSheet(); S.draft=null; S.edit=false; go('home'); break;
    case 'mprev': S.calM--; if(S.calM<0){S.calM=11;S.calY--;} render(); break;
    case 'mnext': S.calM++; if(S.calM>11){S.calM=0;S.calY++;} render(); break;
    case 'detail': detailSheet(k); break;
    case 'about': aboutSheet(); break;
    case 'demo': demo(); break;
    case 'reset': if (confirm('ล้างแสตมป์ทั้งหมดในเครื่องนี้?')){ db={entries:{}}; save(); go('home'); toast('ล้างข้อมูลแล้ว',1); } break;
    case 'del': if (confirm('ลบแก้ววันนี้?')){ delete db.entries[todayKey()]; save(); closeSheet(); go('home'); toast('ลบแก้ววันนี้แล้ว',1); } break;
    case 'edit': { closeSheet(); const e=db.entries[todayKey()]; S.edit=true; S.barista=e.barista; S.draft={drink:e.drink, temp:e.temp, ice:e.ice||'normal', size:e.size||'M', sweet:e.sweet??50, milk:e.milk||'fresh'}; enterCafe(); break; }
    case 'cat': S.cat=k; S.draft.drink=menuNow().find(m=>m.cat===k).k; render(); break;
    case 'pick': { S.draft.drink=k; S.cat=M(k).cat; const y=app.scrollTop; render(); app.scrollTop=y; break; }
    case 'startbrew': startBrew(); break;
    case 'quit': if (confirm('ออกจากบาร์ชง? แก้วนี้จะยังไม่ถูกบันทึก')){ S.draft=null; S.edit=false; go('home'); } break;
    case 'back': if (S.si===0){ S.draft={drink:d.drink}; go('cafe'); } else { S.si--; go('brew'); } break;
    case 'next': if (!stepReady(S.steps[S.si])) return; if (S.si===S.steps.length-1) finish(); else { const n=$('#note'); if(n) d.note=n.value; S.si++; S.tmp=0; go('brew'); } break;
    case 'set-bean': d.bean=k; refresh(); speak('เลือกได้ดีเลย'); break;
    case 'set-temp': d.temp=k; if(k==='iced'&&d.cup==='mug')d.cup='tumbler'; if(k==='hot'&&d.cup==='tumbler')d.cup='mug'; S.prog.milk=false; refresh(); break;
    case 'set-grind': d.grind=k; refresh(); break;
    case 'set-shots': d.shots=+k; S.prog.shot=false; S.shotf=0; refresh(); break;
    case 'pull': pull(); break;
    case 'set-milk': d.milk=k; refresh(); break;
    case 'coldmilk': S.prog.milk=true; speak('เทนมเย็นเรียบร้อย'); refresh(); break;
    case 'set-art': d.art=k; S.prog.art=false; refresh(); break;
    case 'pour': S.prog.art=true; refresh(); speak(d.art==='heart'?'หัวใจสวยมากกก':'ลายสวยเหมือนมือโปร'); break;
    case 'set-syrup': d.syrup=k; refresh(); break;
    case 'set-scoops': d.scoops=+k; refresh(); break;
    case 'sift': if(!S.prog.sift){ S.prog.siftn=(S.prog.siftn||0)+1; if(S.prog.siftn>=6){ S.prog.sift=true; speak('ผงเนียนกริบเลย'); } refresh(); } break;
    case 'pourwater': { const [lo,hi]=M(d.drink).wt; if (d.water<lo||d.water>hi){ toast(d.water<lo?`เย็นไป ลองปรับเป็น ${lo}–${hi}°C`:`ร้อนไป ชาจะขม ลองปรับเป็น ${lo}–${hi}°C`); return; } S.prog.water=true; speak('อุณหภูมิกำลังดี'); refresh(); break; }
    case 'set-top': d.topping=k; refresh(); break;
    case 'set-cup': d.cup=k; refresh(); speak('แก้วนี้เข้ากับมู้ดเลย'); break;
    case 'set-sleeve': { const L=lockOf('sleeve',k); if (L){ toast(`ปลดล็อกเมื่อสะสมติดกัน ${L.d} วันนะ (ตอนนี้ ${bestStreak()} วัน)`); break; } d.sleeve=k; refresh(); break; }
    case 'stk': { const L=lockOf('sticker',k); if (L && !d.stickers.includes(k)){ toast(`ปลดล็อกเมื่อสะสมติดกัน ${L.d} วันนะ (ตอนนี้ ${bestStreak()} วัน)`); break; } const i=d.stickers.indexOf(k); if(i>=0) d.stickers.splice(i,1); else if(d.stickers.length<3) d.stickers.push(k); else toast('ติดได้สูงสุด 3 ชิ้นนะ'); refresh(); break; }
    case 'set-mood': { const n=$('#note'); if(n) d.note=n.value; d.mood=k; refresh(); speak(MOOD_REPLY[k]||'ขอบคุณที่เล่าให้ฟังนะ'); break; }
    case 'dl': if (cardBlob){ const aEl=document.createElement('a'); aEl.href=cardURL; aEl.download=`moodcup-${S.calY}-${pad(S.calM+1)}.png`; document.body.appendChild(aEl); aEl.click(); aEl.remove(); toast('ดาวน์โหลดการ์ดแล้ว',1); } else toast('กำลังสร้างการ์ด...',1); break;
    case 'story-day': storySheet('day', k||todayKey()); break;
    case 'story-month': storySheet('month', `${S.calY}-${S.calM}`); break;
    case 'story-share': if (story.blob) shareBlob(story.blob, story.url, story.name); else toast('กำลังวาดการ์ด...',1); break;
    case 'story-dl': if (story.blob){ downloadBlob(story.url, story.name); toast('ดาวน์โหลดการ์ดแล้ว',1); } else toast('กำลังวาดการ์ด...',1); break;
    case 'share': if (cardBlob) shareBlob(cardBlob, cardURL, `moodcup-${S.calY}-${pad(S.calM+1)}.png`); else toast('กำลังสร้างการ์ด...',1); break;
  }
});
document.addEventListener('input', ev=>{ if (ev.target.dataset.act==='set-water'){ S.draft.water=+ev.target.value; S.prog.water=false; $('#wt').textContent=S.draft.water+'°C'; $('#fx').innerHTML=fxHTML('water'); $('#nextBtn').disabled=true; const b=document.querySelector('[data-act="pourwater"]'); if(b) b.textContent='เทน้ำร้อน 70 ml 💧'; } });
$('#sheetBack').addEventListener('click', closeSheet);
function pull(){
  if (S.busy) return; S.busy=true; S.prog.shot=false; S.shotf=0; refreshStep();
  const total=S.draft.shots*900, t0=performance.now();
  (function tick(now){ const f=Math.min(1,(now-t0)/total); S.shotf=f; $('#fx').innerHTML=fxHTML('shot'); const g=$('#g1'); if(g) g.style.width=f*100+'%'; const gm=$('#gm'); if(gm) gm.textContent=`กำลังดึงช็อตที่ ${Math.min(S.draft.shots,Math.floor(f*S.draft.shots)+1)}...`;
    if (f<1) requestAnimationFrame(tick); else { S.busy=false; S.prog.shot=true; S.draft.shotq='ok'; SFX.play('plop',{vol:.25}); speak(S.draft.shots>=3?'เข้มสะใจ!':'ช็อตสวยงาม'); refreshStep(); } })(t0);
}
render();
})();
