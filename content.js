/* Cupmori · content tables (pure data, no logic, no DOM). Writers can edit this file without touching app.js.
   ALL Thai copy marked DRAFT is a first draft for Nadda's review (tone: gentle, short, never judging the user's mood).
   Rules kept here: no cats anywhere · no health/energy claims · no timers · nothing is ever lost. See HANDOFF.md §6. */
(() => {

/* ---------- Daily mystery order (DRAFT copy) ----------
   One regular per local day leaves a hint. want = what a matching cup needs (all keys optional):
   temp 'hot'|'iced' · cat 'coffee'|'matcha'|'other' · drinks [menu keys] · sweetMax / sweetMin (0-120)
   milk true|false (has milk) · milkType 'oat'|'soy'|'almond'|'fresh' · iceMin / iceMax (cubes 0-5) · topping key · decaf 1
   reply = what the regular says when the cup matches. Any other cup gets a kind line and the order stays open (no fail). */
const HINTS = [
  { k:'h01', th:'วันนี้เหนื่อยมาก อยากได้อะไรอุ่นๆ หวานน้อย', want:{ temp:'hot', sweetMax:25 }, reply:'อุ่นกำลังดี หวานแค่ปลายลิ้น ขอบคุณนะ' },
  { k:'h02', th:'ข้างนอกร้อนจัง ขออะไรเย็นๆ น้ำแข็งเยอะๆ หน่อย', want:{ temp:'iced', iceMin:4 }, reply:'น้ำแข็งกริ๊งๆ แบบนี้แหละที่อยากได้' },
  { k:'h03', th:'อยากได้อะไรเขียวๆ ที่ทำให้ใจนิ่งๆ', want:{ cat:'matcha' }, reply:'สีเขียวนุ่มๆ มองแล้วใจเย็นลงเลย' },
  { k:'h04', th:'วันนี้อยากได้ช็อกโกแลตแบบอุ่นๆ เหมือนผ้าห่ม', want:{ drinks:['cocoa','mocha','xmascocoa'], temp:'hot' }, reply:'หอมช็อกโกแลตเหมือนได้ห่มผ้าห่มเลย' },
  { k:'h05', th:'ขอกาแฟเพียวๆ ไม่ใส่นม ไม่หวาน', want:{ cat:'coffee', milk:false, sweetMax:0 }, reply:'ตรงไปตรงมาแบบนี้ ชอบที่สุด' },
  { k:'h06', th:'ช่วงนี้ลองดื่มนมโอ๊ตอยู่ อะไรก็ได้ที่ใส่นมโอ๊ต', want:{ milkType:'oat' }, reply:'นมโอ๊ตหอมมันๆ เข้ากันดีจัง' },
  { k:'h07', th:'อยากได้อะไรหวานๆ ฉลองเล็กๆ ให้ตัวเอง', want:{ sweetMin:100 }, reply:'หวานฉ่ำสมกับวันฉลองเล็กๆ เลย' },
  { k:'h08', th:'อยากได้ชาที่หอมกลิ่นคั่วๆ อุ่นๆ', want:{ drinks:['hojicha'] }, reply:'กลิ่นคั่วหอมฟุ้ง เหมือนนั่งข้างเตาผิงเลย' },
  { k:'h09', th:'เย็นนี้อยากได้อะไรเย็นๆ ที่มีนมด้วย', want:{ temp:'iced', milk:true }, reply:'เย็นๆ มันๆ ชื่นใจมาก' },
  { k:'h10', th:'ดึกแล้ว ขออะไรที่ไม่มีคาเฟอีนได้ไหม', want:{ any:[{ decaf:1 },{ drinks:['cocoa','xmascocoa'] }] }, reply:'ขอบคุณที่ใส่ใจนะ คืนนี้จะได้นอนสบายๆ' },
  { k:'h11', th:'อยากได้อะไรที่มีฟองนุ่มๆ ข้างบน', want:{ any:[{ drinks:['cappuccino'] },{ topping:'cheese' },{ topping:'whip' }] }, reply:'ฟองนุ่มฟูเหมือนก้อนเมฆ' },
  { k:'h12', th:'วันนี้ขอแบบเรียบง่าย น้ำแข็งน้อยๆ พอ', want:{ temp:'iced', iceMax:2 }, reply:'น้ำแข็งพอดีๆ รสไม่จาง ถูกใจเลย' },
  { k:'h13', th:'อยากได้อะไรสีชมพูๆ น่ารักๆ', want:{ drinks:['strawmatcha'] }, reply:'สีชมพูกับเขียว น่ารักจนไม่กล้าดื่ม' },
  { k:'h14', th:'ขอกาแฟใส่นม หวานกลางๆ กำลังดี', want:{ cat:'coffee', milk:true, sweetMin:50, sweetMax:50 }, reply:'กลมกล่อมกำลังดีเลย' },
  { k:'h15', th:'อยากได้อะไรที่มีไข่มุกให้เคี้ยวเล่น', want:{ topping:'boba' }, reply:'ไข่มุกหนึบๆ เคี้ยวเพลินเลย' },
  { k:'h16', th:'ขอมัทฉะแบบไม่หวานเลย อยากได้รสชาแท้ๆ', want:{ cat:'matcha', sweetMax:0 }, reply:'ขมนิดๆ หอมชาแท้ๆ แบบนี้แหละ' },
  { k:'h17', th:'อากาศเย็นๆ แบบนี้ อยากได้แก้วร้อนใบใหญ่', want:{ temp:'hot', size:'L' }, reply:'แก้วใหญ่อุ่นมือ กอดไว้ได้นานๆ' },
  { k:'h18', th:'อยากได้แก้วเล็กๆ จิบนิดเดียวพอ', want:{ size:'S' }, reply:'แก้วจิ๋วน่ารัก จิบพอดีๆ' },
  { k:'h19', th:'วันนี้อยากได้อะไรใส่นมถั่วเหลือง', want:{ milkType:'soy' }, reply:'นมถั่วเหลืองหอมๆ นุ่มดีจัง' },
  { k:'h20', th:'ขอลาเต้ร้อนที่มีลายสวยๆ บนหน้าแก้ว', want:{ drinks:['latte','cappuccino','mocha'], temp:'hot', art:true }, reply:'ลายสวยจนต้องถ่ายรูปก่อนดื่ม' },
  { k:'h21', th:'อยากได้อะไรที่มีวิปครีมเยอะๆ', want:{ topping:'whip' }, reply:'วิปครีมฟูๆ ใจฟูตามเลย' },
  { k:'h22', th:'วันนี้ขอแบบเข้มๆ หน่อย', want:{ cat:'coffee', shotsMin:3 }, reply:'เข้มสะใจ ตาสว่างเลย (แต่ยังพักได้นะ)' },
  { k:'h23', th:'อยากได้อะไรเย็นๆ ที่ไม่ใช่กาแฟ', want:{ temp:'iced', notCat:'coffee' }, reply:'สดชื่นแบบไม่ต้องพึ่งกาแฟ' },
  { k:'h24', th:'ขออะไรอุ่นๆ ที่ไม่ใช่กาแฟ', want:{ temp:'hot', notCat:'coffee' }, reply:'อุ่นๆ เบาๆ สบายท้อง' },
  { k:'h25', th:'อยากได้น้ำแข็งพอดีๆ สามก้อน', want:{ temp:'iced', iceMin:3, iceMax:3 }, reply:'สามก้อนเป๊ะ! จำได้ด้วย ขอบคุณนะ' },
  { k:'h26', th:'อยากได้อะไรที่มีคาราเมลหอมๆ', want:{ syrup:'caramel' }, reply:'คาราเมลหอมหวาน ละลายใจเลย' },
  { k:'h27', th:'ขอกลิ่นวานิลลาอ่อนๆ หน่อย', want:{ syrup:'vanilla' }, reply:'วานิลลาหอมละมุน เหมือนขนมอบ' },
  { k:'h28', th:'อยากได้อะไรที่โรยผงข้างบนนิดๆ', want:{ topping:'dust' }, reply:'โรยผงบางๆ น่ารักเป็นระเบียบ' },
  { k:'h29', th:'อยากได้มัทฉะใส่นม เย็นๆ', want:{ drinks:['matchalatte','strawmatcha'], temp:'iced' }, reply:'มัทฉะนมเย็นๆ คู่หูที่ดีที่สุด' },
  { k:'h30', th:'วันนี้ไม่รู้จะสั่งอะไร ชงแก้วที่เธอชอบให้หน่อย', want:{}, reply:'แก้วที่เธอชอบ ก็กลายเป็นแก้วที่ชอบไปด้วยแล้ว' },
  { k:'h31', th:'อยากได้อะไรใส่ครีมชีสโฟมเค็มๆ มันๆ', want:{ topping:'cheese' }, reply:'ครีมชีสเค็มๆ มันๆ ฟินมาก' },
  { k:'h32', th:'ขออะไรที่หวานน้อย ใส่นมอัลมอนด์', want:{ milkType:'almond', sweetMax:25 }, reply:'นมอัลมอนด์หอมถั่วๆ หวานน้อยกำลังดี' },
];
/* festival guests bring their own orders (World Bee Day week: the bee) */
const FEST_HINTS = {
  worldBeeDay: [
    { k:'hb1', th:'บั๊ซซ~ อยากได้อะไรหอมน้ำผึ้ง อุ่นๆ หน่อย', want:{ drinks:['honeylatte'], temp:'hot' }, reply:'หอมน้ำผึ้งเหมือนอยู่ในสวนดอกไม้เลย บั๊ซซ~' },
    { k:'hb2', th:'บินมาไกล คอแห้งจัง ขอซ่าๆ สีทองๆ', want:{ drinks:['honeysoda'] }, reply:'ซ่าสดชื่น ปีกพร้อมบินต่อแล้ว ขอบคุณนะ' },
    { k:'hb3', th:'ขออะไรหวานน้อยๆ ให้ความหวานมาจากน้ำผึ้งพอ', want:{ drinks:['honeylatte','honeysoda'], sweetMax:25 }, reply:'หวานกำลังดี หวานแบบดอกไม้เลย' },
    { k:'hb4', th:'อยากได้อะไรเย็นๆ ใส่น้ำแข็งสักสองสามก้อน', want:{ temp:'iced', iceMin:2, iceMax:3 }, reply:'เย็นพอดีๆ เหมือนลมใต้ต้นไม้' },
  ],
};

/* ---------- Recipe book ----------
   need = same keys as mystery-order 'want' plus context: tod 'morning'|'day'|'evening'|'night' · season 'spring'|'summer'|'autumn'|'winter'
   fest [festival keys from festivals.js] · weather 'rain'|'sun'|'cloud' (user tap on web; WeatherKit later) · anyFest true.
   Recipes are discovered by brewing any cup that fits; secret:1 ones also need the moment (time/season/weather/festival).
   img = existing drink art used for the card (silhouette until discovered). hint = shown under the silhouette (DRAFT). */
const RECIPES = [
  { k:'r-latte', th:'ลาเต้ร้อนคลาสสิก', img:'latte', need:{ drinks:['latte'], temp:'hot' }, hint:'ลาเต้ร้อนแก้วแรกของร้าน' },
  { k:'r-icelatte', th:'ลาเต้เย็นนมสด', img:'icelatte', need:{ drinks:['latte'], temp:'iced', milkType:'fresh' }, hint:'ลาเต้ เย็น นมสด' },
  { k:'r-vanilla', th:'วานิลลาลาเต้', img:'latte', need:{ drinks:['latte','cappuccino'], syrup:'vanilla' }, hint:'ลาเต้ + กลิ่นขนมอบ' },
  { k:'r-caramel', th:'คาราเมลลาเต้เย็น', img:'icelatte', need:{ drinks:['latte','dirty'], temp:'iced', syrup:'caramel' }, hint:'ลาเต้เย็น + ซอสสีทอง' },
  { k:'r-brownsugar', th:'ลาเต้น้ำตาลทรายแดง', img:'icelatte', need:{ drinks:['latte','dirty'], syrup:'brown' }, hint:'ลาเต้ + น้ำตาลที่ไม่ขาว' },
  { k:'r-hazelmocha', th:'มอคค่าเฮเซลนัท', img:'mocha', need:{ drinks:['mocha'], syrup:'hazelnut' }, hint:'มอคค่า + ถั่วหอมๆ' },
  { k:'r-oatflat', th:'โอ๊ตลาเต้ละมุน', img:'latte', need:{ drinks:['latte','cappuccino'], milkType:'oat' }, hint:'ลาเต้ + นมจากธัญพืช' },
  { k:'r-black', th:'อเมริกาโน่เข้มเพียว', img:'americano', need:{ drinks:['americano'], sweetMax:0, shotsMin:3 }, hint:'อเมริกาโน่ ไม่หวาน ช็อตเยอะ' },
  { k:'r-dirtyoat', th:'เดอร์ตี้โอ๊ต', img:'icelatte', need:{ drinks:['dirty'], milkType:'oat' }, hint:'เดอร์ตี้ + นมจากธัญพืช' },
  { k:'r-cheesematcha', th:'มัทฉะครีมชีส', img:'icematcha', need:{ drinks:['matchalatte'], topping:'cheese' }, hint:'มัทฉะลาเต้ + ฟองเค็มๆ มันๆ' },
  { k:'r-bobamatcha', th:'มัทฉะไข่มุก', img:'icematcha', need:{ drinks:['matchalatte'], temp:'iced', topping:'boba' }, hint:'มัทฉะเย็น + เม็ดหนึบ' },
  { k:'r-hojiboba', th:'โฮจิฉะไข่มุก', img:'hojicha', need:{ drinks:['hojicha'], topping:'boba' }, hint:'ชาคั่ว + เม็ดหนึบ' },
  { k:'r-soyhoji', th:'โฮจิฉะนมถั่ว', img:'hojicha', need:{ drinks:['hojicha'], milkType:'soy' }, hint:'ชาคั่ว + นมถั่วเหลือง' },
  { k:'r-whipcocoa', th:'โกโก้วิปครีม', img:'cocoa', need:{ drinks:['cocoa'], topping:'whip' }, hint:'โกโก้ + ก้อนเมฆขาว' },
  { k:'r-almondcocoa', th:'โกโก้อัลมอนด์', img:'cocoa', need:{ drinks:['cocoa'], milkType:'almond' }, hint:'โกโก้ + นมถั่วหอมๆ' },
  { k:'r-strawcloud', th:'สตรอว์เบอร์รีมัทฉะวิป', img:'strawmatcha', need:{ drinks:['strawmatcha'], topping:'whip' }, hint:'สามชั้นสีชมพู + วิปครีม' },
  { k:'r-honeylatte', th:'ฮันนี่ลาเต้', img:'latte', need:{ drinks:['honeylatte'] }, hint:'ลาเต้ + ของหวานจากดอกไม้ (ช่วงวันผึ้งโลก)' },
  { k:'r-honeysoda', th:'ฮันนี่เลมอนโซดา', img:'honeysoda', need:{ drinks:['honeysoda'] }, hint:'โซดาสีทอง + เลมอน (ช่วงวันผึ้งโลก)' },
  /* secret recipes: tied to a moment */
  { k:'s-moon', secret:1, th:'ลาเต้แสงจันทร์', img:'decaf', need:{ cat:'coffee', decaf:1, tod:'night' }, hint:'กาแฟที่ไม่ทำให้นอนไม่หลับ ตอนดึก' },
  { k:'s-sunrise', secret:1, th:'อุสุฉะยามเช้า', img:'usucha', need:{ drinks:['usucha'], tod:'morning' }, hint:'ชาพิธีชง ตอนแดดเพิ่งขึ้น' },
  { k:'s-rain', secret:1, th:'โกโก้วันฝนพรำ', img:'cocoa', need:{ drinks:['cocoa'], temp:'hot', weather:'rain' }, hint:'โกโก้ร้อน ตอนฝนตก' },
  { k:'s-sunny', secret:1, th:'อเมริกาโน่แดดจ้า', img:'americano', need:{ drinks:['americano'], temp:'iced', weather:'sun', iceMin:5 }, hint:'กาแฟเย็นน้ำแข็งเต็มแก้ว วันแดดจ้า' },
  { k:'s-spring', secret:1, th:'มัทฉะสตรอว์เบอร์รีหน้าใบไม้ผลิ', img:'strawmatcha', need:{ drinks:['strawmatcha'], season:'spring' }, hint:'สีชมพูเขียว ตอนดอกไม้บาน' },
  { k:'s-autumn', secret:1, th:'โฮจิฉะใบไม้ร่วง', img:'hojicha', need:{ drinks:['hojicha'], temp:'hot', season:'autumn' }, hint:'ชาคั่วร้อน ตอนใบไม้เปลี่ยนสี' },
  { k:'s-snow', secret:1, th:'โกโก้หิมะแรก', img:'cocoa', need:{ drinks:['cocoa','xmascocoa'], topping:'whip', season:'winter' }, hint:'โกโก้วิปครีม ฤดูหนาว' },
  { k:'s-lantern', secret:1, th:'ลาเต้โคมไฟ', img:'latte', need:{ cat:'coffee', fest:['midAutumn','loyKrathong','diwali'] }, hint:'กาแฟ ช่วงเทศกาลแห่งแสงไฟ' },
  { k:'s-meadow', secret:1, th:'โซดาทุ่งดอกไม้', img:'honeysoda', need:{ drinks:['honeysoda'], tod:'morning', iceMax:2 }, hint:'โซดาสีทอง น้ำแข็งน้อย ตอนเช้าๆ' },
  { k:'s-festival', secret:1, th:'แก้วเทศกาล', img:'pumpkin', need:{ anyFest:true }, hint:'แก้วไหนก็ได้ ระหว่างมีเทศกาล' },
];

/* ---------- Regulars' stories (DRAFT copy for Nadda) ----------
   Unlock by TOTAL counts only, never consecutive days:
   ep.at = friendship points needed (visits on stamp days + mystery orders served for that regular).
   ep 1 opens when the regular is unlocked (cumulative stamps). 'pe' prologue opens at the first stamp. */
const STORIES = {
  pe: { th:'เป๊ะ', eps:[
    { at:0, t:'จดหมายใบแรกจากเคาน์เตอร์', body:'ขอบคุณที่แวะมานะ ร้านเล็กๆ นี้เปิดไว้ให้ทุกความรู้สึก จะสดใสหรือเหนื่อยแค่ไหน ก็มีแก้วรออยู่เสมอ\nเดี๋ยวจะมีขาประจำแวะมาเรื่อยๆ ทีละคน ถ้าใครทิ้งจดหมายไว้ เป๊ะจะวางไว้ตรงนี้ให้นะ ก๊าบ!' } ] },
  frog: { th:'กบขาประจำ', eps:[
    { at:0, t:'มัทฉะแก้วเดิม', body:'"มัทฉะเหมือนเดิมนะ" กบพูดประโยคเดิมทุกครั้ง แล้วก็นั่งที่เดิมข้างหน้าต่าง\nวันนี้กบยิ้มกว้างกว่าทุกที "ที่ชอบร้านนี้ เพราะไม่มีใครถามว่าทำไมสั่งเหมือนเดิมเลย"' },
    { at:1, t:'ร่มคันเล็ก', body:'ฝนตกปรอยๆ กบเดินเข้ามาพร้อมร่มใบบัวคันจิ๋ว ที่ไม่ได้กันฝนเลยสักนิด\n"กบชอบฝนนะ แต่ก็อยากถือร่มเหมือนคนอื่นบ้าง" แล้วก็หัวเราะ อ๊บๆ' },
    { at:3, t:'บ่อน้ำบ้านเกิด', body:'กบเล่าว่าบ้านเกิดเป็นบ่อเล็กๆ หลังวัด ตอนเย็นจะมีเสียงระฆังกับเสียงเพื่อนๆ ร้องเพลง\n"มาอยู่เมืองแล้วบางวันก็คิดถึง แต่แก้วมัทฉะตรงนี้ทำให้รู้สึกเหมือนได้กลับบ้านนิดๆ"' },
    { at:6, t:'ลองแก้วใหม่', body:'วันนี้กบเงียบไปนาน แล้วพูดเบาๆ ว่า "ขอลองอย่างอื่นบ้างได้ไหม"\nพอได้แก้วใหม่ กบจิบคำแรกแล้วตาโต "อร่อยจัง… แต่พรุ่งนี้ขอมัทฉะเหมือนเดิมนะ"' } ] },
  hedgehog: { th:'เม่นจิ๋ว', eps:[
    { at:0, t:'ผู้ช่วยตัวจิ๋ว', body:'เม่นจิ๋วยืนเขย่งหลังเคาน์เตอร์ "ขอช่วยได้ไหม เม่นล้างแก้วเก่งนะ"\nแก้วใบแรกรอดมาได้ แต่ฟองน้ำโดนหนามจนเป็นรูพรุน ทุกคนหัวเราะกันทั้งร้าน' },
    { at:1, t:'ถุงมือผ้า', body:'วันนี้เม่นใส่ถุงมือผ้าสีเหลืองมาด้วย "จะได้ไม่ทำฟองน้ำพังอีก"\nถุงมือหลวมจนแก้วลื่นไปนิดนึง แต่เม่นรับไว้ทัน แล้วยิ้มภูมิใจสุดๆ' },
    { at:3, t:'ลายหัวใจที่ไม่เหมือนหัวใจ', body:'เม่นลองวาดลาเต้อาร์ตครั้งแรก ออกมาเป็นรูปอะไรก็ไม่รู้\n"มันคือหัวใจที่กำลังเขิน" เม่นอธิบายจริงจัง และนั่นกลายเป็นลายโปรดของร้านไปแล้ว' },
    { at:6, t:'ม้วนตัวงีบ', body:'บ่ายๆ ร้านเงียบ เม่นม้วนตัวกลมงีบอยู่บนผ้ากันเปื้อน\nไม่มีใครปลุก เพราะที่นี่ใครจะพักตอนไหนก็ได้ ตื่นมาเม่นบอกว่า "ฝันว่าชงกาแฟให้ทั้งป่าเลย"' } ] },
  otter: { th:'นากทะเล', eps:[
    { at:0, t:'แก้วบนพุง', body:'นากรับโกโก้ไปแล้วนอนหงาย วางแก้วไว้บนพุงอย่างชำนาญ\n"แบบนี้แหละ อุ่นทั้งมือ อุ่นทั้งพุง" แล้วก็หลับตาพริ้ม' },
    { at:1, t:'หินก้อนโปรด', body:'นากหยิบหินกลมเกลี้ยงก้อนเล็กออกมาจากกระเป๋าใต้แขน\n"พกติดตัวตลอด วันไหนใจไม่นิ่ง กำไว้แป๊บนึงก็ดีขึ้น" แล้วยื่นให้ลองจับดู มันอุ่นนิดๆ' },
    { at:3, t:'จับมือตอนหลับ', body:'นากเล่าว่าที่ทะเล นากจะจับมือกันตอนหลับ จะได้ไม่ลอยห่างกัน\n"ที่นี่ไม่มีคลื่น แต่ก็ดีใจที่มีที่ให้กลับมาเรื่อยๆ นะ"' },
    { at:6, t:'ของขวัญจากทะเล', body:'นากวางเปลือกหอยสีชมพูไว้ข้างเครื่องชงกาแฟ\n"ไว้ให้ร้านนะ ถ้าเอาไปแนบหูจะได้ยินเสียงคลื่น" ตั้งแต่วันนั้น เปลือกหอยก็อยู่ตรงนั้นตลอดมา' } ] },
  sheep: { th:'แกะขนฟู', eps:[
    { at:0, t:'บาริสต้าฝึกหัด', body:'แกะขนฟูจดออเดอร์ช้ามาก ช้าจนลูกค้าเผลอยิ้ม\n"ขอโทษนะ อยากจดให้ครบทุกคำ เพราะทุกแก้วสำคัญ" แล้วก็โชว์สมุดที่เขียนด้วยลายมือกลมๆ' },
    { at:1, t:'ขนฟูหลังฝนตก', body:'วันฝนตก ขนแกะพองขึ้นอีกเท่าตัว ประตูร้านแทบจะเข้าไม่ได้\nเป๊ะเลยเอาไดร์มาเป่าให้ แกะนั่งนิ่งๆ ตาปรือ "อุ่นจัง… เหมือนโดนกอด"' },
    { at:3, t:'ผ้าพันคอถักมือ', body:'แกะถักผ้าพันคอจากขนตัวเองให้ทุกคนในร้าน เส้นละสี\n"ไม่ต้องใส่ก็ได้นะ แค่อยากให้รู้ว่าคิดถึง" แต่ทุกคนก็ใส่กันทั้งวัน' },
    { at:6, t:'ออเดอร์ที่จำได้', body:'วันนี้แกะไม่ต้องเปิดสมุดเลย "แก้วเดิมใช่ไหม หวานเท่าเดิม น้ำแข็งเท่าเดิม"\nถูกหมดทุกอย่าง แกะยิ้มจนแก้มแดง "จำได้เพราะอยากจำนะ"' } ] },
  redpanda: { th:'แพนด้าแดง', eps:[
    { at:0, t:'เมนูลับ', body:'แพนด้าแดงกระซิบ "ชู่ว… วันนี้มีเมนูลับนะ" แล้วยื่นกระดาษโน้ตเล็กๆ ที่มีรูปดาวมาให้\n"เมเปิลกับอบเชย ลองดูสิ บอกแค่เธอคนเดียว"' },
    { at:1, t:'หางฟูกันหนาว', body:'แพนด้าแดงม้วนหางมาพันตัวเหมือนผ้าห่ม\n"หางนี้มีไว้กันหนาว แต่บางทีก็ใช้แกล้งปิดหน้าตอนเขินนะ" แล้วก็ทำให้ดูจริงๆ' },
    { at:3, t:'สมุดสูตรเก่า', body:'แพนด้าแดงเปิดสมุดสูตรเล่มเก่าที่หน้ากระดาษเหลืองแล้ว\n"คุณยายเขียนไว้ บางสูตรต้องชงตอนฝนตก บางสูตรต้องชงตอนดึก ลองหาดูนะ ยังมีอีกเยอะ"' },
    { at:6, t:'ดาวบนแก้ว', body:'ก่อนกลับ แพนด้าแดงวาดดาวดวงเล็กไว้บนแก้วของเธอ\n"ดาวนี้แปลว่าเธอเป็นขาประจำของร้านแล้วนะ" แล้วโบกหางลาเบาๆ' } ] },
  /* festival guest: friendship from visits during World Bee Day weeks (any year) + bee orders served */
  bee: { th:'ผึ้งน้อย', eps:[
    { at:0, t:'แขกตัวจิ๋วกับโถน้ำผึ้ง', body:'ผึ้งน้อยบินเข้ามาพร้อมโถน้ำผึ้งใบจิ๋ว วางลงบนเคาน์เตอร์เบาๆ\n"สัปดาห์นี้เป็นสัปดาห์ของพวกเรานะ ขอฝากน้ำผึ้งไว้ใส่เครื่องดื่มให้ทุกคน บั๊ซซ~"' },
    { at:2, t:'แผนที่ดอกไม้', body:'ผึ้งน้อยกางแผนที่ที่วาดด้วยละอองเกสร มีจุดเล็กๆ เต็มไปหมด\n"ตรงนี้ดอกทานตะวัน ตรงนี้ดอกมะลิ แล้วตรงนี้… ร้านนี้ เพราะที่นี่หอมเหมือนกัน"' },
    { at:4, t:'เพลงของปีก', body:'ก่อนกลับ ผึ้งน้อยกระพือปีกเป็นจังหวะช้าๆ เหมือนฮัมเพลง\n"ปีกเราเล็ก แต่ถ้าค่อยๆ บินทุกวัน ก็ไปได้ไกลนะ ปีหน้าเจอกันใหม่ บั๊ซซ~"' } ] },
};

/* ---------- Café decor bought with EARNED beans only (beans are never sold) ----------
   tier 2 opens after owning any 2 tier-1 items, tier 3 after any 2 tier-2 items. slot = where it sits in "มุมร้านของฉัน".
   pos = [left%, top%, width%] inside the 4:3 room; z = layer. art 'svg:*' = drawn in code. */
const DECOR = [
  { k:'succulent',  th:'กระบองเพชรจิ๋วริมหน้าต่าง', tier:1, price:25,  slot:'sill',    pos:[58.5,46.5,7.5], z:3 },
  { k:'frame',      th:'กรอบรูปน้องเป็ด',          tier:1, price:30,  slot:'wall',    pos:[9,14,17],   z:2, art:'svg:frame' },
  { k:'paperlamp',  th:'โคมกระดาษสีเนย',            tier:1, price:35,  slot:'ceiling', pos:[30,0,15],   z:4 },
  { k:'lights',     th:'ไฟประดับเส้นเล็ก',          tier:1, price:40,  slot:'ceiling', pos:[0,0,100],   z:4, art:'svg:lights' },
  { k:'floorlamp',  th:'โคมไฟตั้งพื้น',              tier:2, price:70,  slot:'lamp',    pos:[41,30,13],  z:3 },
  { k:'monstera',   th:'มอนสเตอร่าใบใหญ่',          tier:2, price:80,  slot:'corner',  pos:[85,37,20],  z:5 },
  { k:'table2',     th:'โต๊ะตัวที่สอง',             tier:2, price:110, slot:'table',   pos:[27,58,40],  z:6 },
  { k:'windowseat', th:'ม้านั่งริมหน้าต่าง',        tier:3, price:150, slot:'window',  pos:[50,57,46],  z:4 },
  { k:'pastrycase', th:'อัปเกรดเคาน์เตอร์ขนม',      tier:3, price:180, slot:'counter', pos:[-2,48,40],  z:5 },
];

/* ---------- Bean economy (earn only; no IAP for beans, ever) ---------- */
const BEANS_RULES = {
  moodCup: 5,                 // flat thank-you for the day's mood cup (never scored, never judged)
  extraStars: [0, 2, 4, 6],   // extra cup (แก้วพิเศษ) by craft stars 1..3
  mystery: 12,                // extra cup that matches today's mystery order
  newRecipe: 8,               // first discovery made in an extra cup
  extraCupsPaidPerDay: 3,     // extra cups after this still brew and still discover, just no beans that day
};

window.Content = { HINTS, FEST_HINTS, RECIPES, STORIES, DECOR, BEANS_RULES };
})();
