"""Phase 2 (Cupmori) QC: headless Chromium walk-through of every new mechanic -> .qc2/*.png
Checks: 0 console errors, v2 -> v3 migration (+ .bak-v2 safety copy), exact ice cube count, beans, mystery, recipes,
decor, stories, IAP sim + tip thank-you, World Bee Day, reduce motion, English (lists untranslated strings).
usage: python3 tools/qc_phase2.py [base_url]   (default http://localhost:8765/)"""
import sys, json, os
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = os.path.join(ROOT, '.qc2'); os.makedirs(OUT, exist_ok=True)
KEY = 'ggcafe.moodcup.v1'; errs = []; checks = []; missing = set()
def ok(cond, name):
    checks.append(('PASS' if cond else 'FAIL') + ' ' + name); print(checks[-1])
V2SEED = """(o) => { const pad=n=>String(n).padStart(2,'0'); const base=new Date(o.today+'T12:00:00'); const E={};
  const drinks=['latte','americano','matchalatte','cocoa','hojicha','mocha'], ices=['none','less','normal','extra'];
  for (let i=o.from;i<o.from+o.n;i++){ const d=new Date(base); d.setDate(d.getDate()-i); const k=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    E[k]={drink:drinks[i%6],barista:['pe','berry','moss','momo','bobby'][i%5],temp:i%2?'iced':'hot',size:'M',sweet:50,milk:'fresh',ice:ices[i%4],bean:'medium',grind:'fine',shots:2,art:'heart',syrup:'none',scoops:2,water:80,topping:'none',cup:i%2?'gl1':'mug1',sleeve:'peach',stickers:['heart'],mood:'happy',note:i===o.from?'ประชุมเยอะ':'',ts:+d, guest: o.guestEvery && i%o.guestEvery===0 ? o.guestKey : undefined}; }
  const db = Object.assign({v:2,entries:E,guests:o.guests||{},settings:{reminderAsked:true}}, o.extra||{});
  localStorage.setItem('KEYX', JSON.stringify(db)); }""".replace('KEYX', KEY)
def hold(pg, sel, ms):
    pg.locator(sel).first.evaluate("e=>e.scrollIntoView({block:'center'})"); pg.wait_for_timeout(250)
    b = pg.locator(sel).first.bounding_box(); pg.mouse.move(b['x']+b['width']/2, b['y']+b['height']/2); pg.mouse.down(); pg.wait_for_timeout(ms); pg.mouse.up(); pg.wait_for_timeout(300)
def nxt(pg):
    pg.wait_for_selector('#nextBtn:not([disabled])', timeout=8000); pg.click('#nextBtn'); pg.wait_for_timeout(350)
def shot(pg, n, full=False):
    pg.wait_for_timeout(650); pg.screenshot(path=f'{OUT}/{n}.png', full_page=full)
def sheet_shot(pg, n):
    pg.wait_for_timeout(800); pg.locator('#sheet').screenshot(path=f'{OUT}/{n}.png')
def close_sheet(pg):
    if pg.locator('#sheet.open').count(): pg.click('#sheet .sheet-x'); pg.wait_for_timeout(400)
def db(pg): return pg.evaluate(f"JSON.parse(localStorage.getItem('{KEY}'))")
def view_shot(pg, n):
    """full scroll height of #app as one tall image"""
    pg.wait_for_timeout(700); h = pg.evaluate("document.querySelector('#app').scrollHeight")
    pg.set_viewport_size({'width':390, 'height':min(max(844, h), 4000)}); pg.wait_for_timeout(500); pg.screenshot(path=f'{OUT}/{n}.png'); pg.set_viewport_size({'width':390, 'height':844})
def brew_cocoa_whip(pg):
    """non-coffee path: sift, water, whisk, milk pour, topping"""
    for _ in range(6): pg.click('[data-act=sift]'); pg.wait_for_timeout(60)
    nxt(pg); pg.click('[data-act=pourwater]'); nxt(pg)
    hold(pg, '[data-hold=whisk]', 2600); nxt(pg)
    hold(pg, '[data-hold=pour]', 1750); nxt(pg)
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx = br.new_context(viewport={'width':390,'height':844}, device_scale_factor=2, accept_downloads=True, locale='th-TH')
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.on('console', lambda m: m.type == 'error' and errs.append('console.error '+m.text))
    pg.on('dialog', lambda d: d.accept())
    def open_(q='', seed=None, keep=False):
        pg.goto(BASE+'index.html'+q)
        if not keep: pg.evaluate('localStorage.clear()')
        if seed: pg.evaluate(V2SEED, seed)
        pg.goto(BASE+'index.html'+q); pg.wait_for_timeout(1400)
    # ---------- 1. v2 -> v3 migration ----------
    pg.goto(BASE+'index.html?date=2026-10-23&t=10:00'); pg.evaluate('localStorage.clear()'); pg.evaluate(V2SEED, {'today':'2026-10-23','from':1,'n':8,'guests':{'frog':{'on':'2026-10-18','at':3}}})
    raw = pg.evaluate(f"localStorage.getItem('{KEY}')")
    pg.goto(BASE+'index.html?date=2026-10-23&t=10:00'); pg.wait_for_timeout(1400)
    d = db(pg); bak = pg.evaluate(f"localStorage.getItem('{KEY}.bak-v2')")
    ok(d['v'] == 3, 'migration: schema v3'); ok(bak == raw, 'migration: .bak-v2 is the exact pre-migration copy')
    ok(len(d['entries']) == 8, 'migration: all 8 entries kept')
    ices = sorted(set(e['ice'] for e in d['entries'].values())); ok(ices == ['0','2','4','5'], f'migration: ice words -> cube counts {ices}')
    ok(d['beans'] == 0 and d['decor'] == {'owned':{}, 'place':{}} and d['guests'].get('frog'), 'migration: v3 fields added, guests kept')
    ok(d['settings']['lang'] == 'auto' and d['settings']['shareNote'] is False, 'migration: new settings defaults (share note hidden)')
    shot(pg, '01-home-migrated-v2-user')
    # ---------- 2. mood cup: iced latte with exactly 3 cubes, gentle reaction, no stars, +5 beans ----------
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.wait_for_timeout(700)
    pg.click('.it >> text=ลาเต้'); pg.click('[data-act=opt-temp][data-k=iced]'); pg.click('[data-act=opt-ice][data-k="3"]'); shot(pg, '02-cafe-ice-0-5-chips')
    pg.click('[data-act=startbrew]'); pg.wait_for_timeout(400)
    nxt(pg); hold(pg, '[data-hold=grind]', 1900); nxt(pg)
    hold(pg, '[data-hold=tamp]', 600); nxt(pg)               # light tamp: accepted (no fail state)
    pg.click('[data-act=pull]'); pg.wait_for_timeout(2300); nxt(pg)
    hold(pg, '[data-hold=pour]', 2000); shot(pg, '03-brew-hold-to-pour-milk'); nxt(pg)
    for _ in range(3): pg.click('[data-act=scoop]'); pg.wait_for_timeout(120)
    shot(pg, '04-brew-ice-exactly-3')
    cubes = pg.evaluate("document.querySelectorAll('#fx .cube').length"); ok(cubes == 3, f'ice step shows exactly 3 cubes ({cubes})')
    nxt(pg); pg.click('[data-act=set-sweet][data-k="25"]'); nxt(pg)
    pg.click('[data-act=set-cup][data-k=gl3]'); pg.wait_for_timeout(300)
    cubes = pg.evaluate("document.querySelector('.preview').querySelectorAll('.cube').length"); ok(cubes == 3, f'cup preview (gl3) shows exactly 3 cubes ({cubes})'); shot(pg, '05-cup-gl3-3-cubes'); nxt(pg)
    pg.click('[data-act=stk][data-k=heart]'); nxt(pg)
    pg.click('[data-act=set-mood][data-k=tired]'); pg.fill('#note', 'งานเยอะ'); nxt(pg); pg.wait_for_timeout(1500)
    shot(pg, '06-done-mood-cup-gentle-no-stars')
    ok(pg.locator('.stars3').count() == 0, 'mood cup: no stars shown'); d = db(pg)
    ok(d['beans'] == 5, f"mood cup: +5 beans ({d['beans']})"); ok(not any(x.get('k') for x in d['extras']), 'mood cup not logged as extra')
    # editing the same day gives no extra beans
    # ---------- 3. extra cup + mystery order (2026-10-23 hint: whipped cream) ----------
    pg.click('[data-act=home]'); pg.wait_for_timeout(600); shot(pg, '07-home-mystery-card')
    hint = pg.evaluate("document.querySelector('.mystery b').textContent"); print('mystery hint:', hint)
    pg.click('.mystery [data-act=extra]'); pg.wait_for_timeout(700); shot(pg, '08-cafe-extra-cup')
    pg.click('[data-act=cat][data-k=other]'); pg.click('.it >> text=โกโก้'); pg.click('[data-act=startbrew]'); pg.wait_for_timeout(400)
    ok('mood' not in pg.evaluate("[...document.querySelectorAll('.steps .st')].map(x=>x.textContent).join(',')"), 'extra cup: no mood step')
    brew_cocoa_whip(pg); pg.click('[data-act=set-top][data-k=whip]'); nxt(pg)
    shot(pg, '09-extra-cup-whip-on-mug'); nxt(pg); pg.wait_for_timeout(1500)
    shot(pg, '10-extra-done-stars-mystery-recipe')
    d = db(pg); ok(len(d['extras']) == 1 and d['extras'][0]['stars'] in (1,2,3), f"extra cup logged with stars {d['extras'][0]['stars']}")
    ok(d['mystery'].get('2026-10-23'), 'mystery order served (whip)'); ok('r-whipcocoa' in d['recipes'], 'recipe discovered: r-whipcocoa')
    ok(len(d['entries']) == 9, 'extra cup did not add a mood entry'); print('beans now', d['beans'])
    # ---------- 4. recipe book ----------
    pg.click('[data-go=recipes]'); pg.wait_for_timeout(700); view_shot(pg, '11-recipe-book')
    pg.click('[data-act=recipe][data-k=r-whipcocoa]'); sheet_shot(pg, '12-recipe-detail'); close_sheet(pg)
    # ---------- 5. decor with beans ----------
    pg.evaluate(f"(()=>{{ const d=JSON.parse(localStorage.getItem('{KEY}')); d.beans=800; localStorage.setItem('{KEY}', JSON.stringify(d)); }})()")
    open_('?date=2026-10-23&t=16:00', keep=True); pg.click('#tabbar [data-go=room]'); pg.wait_for_timeout(600)
    for k in ['succulent','frame','paperlamp','floorlamp','monstera','table2','windowseat','pastrycase']:
        pg.click(f'[data-act=decor-buy][data-k={k}]'); pg.wait_for_timeout(250)
    d = db(pg); ok(len(d['decor']['owned']) == 8 and d["beans"] == 800-25-30-35-70-80-110-150-180, f"decor bought, beans {d['beans']}")
    pg.evaluate("document.querySelector('#app').scrollTop=0"); shot(pg, '13-room-decorated'); view_shot(pg, '14-room-full-shop-tip')
    # ---------- 6. stories ----------
    open_('?date=2026-10-23&t=11:00', {'today':'2026-10-23','from':1,'n':16,'guestEvery':2,'guestKey':'frog','guests':{'frog':{'on':'2026-10-01','at':3},'hedgehog':{'on':'2026-10-10','at':7},'otter':{'on':'2026-10-20','at':14}}})
    shot(pg, '15-home-letter-banner'); pg.click('.letterb'); sheet_shot(pg, '16-story-letter'); close_sheet(pg)
    pg.click('#tabbar [data-go=collect]'); sheet_shot(pg, '17-collection-story-shelf'); close_sheet(pg)
    d = db(pg); ok(len(d['stories']['read']) == 1, 'story marked read')
    # ---------- 7. IAP (simulated) + tip jar ----------
    open_('?date=2026-10-23&t=11:00&iap=sim', keep=True); pg.click('#tabbar [data-go=room]'); pg.wait_for_timeout(500)
    pg.click('[data-act=iap-buy][data-k="cupmori.stickers.doodle"]'); pg.wait_for_timeout(500)
    pg.click('[data-act=iap-buy][data-k="cupmori.tip.small"]'); sheet_shot(pg, '18-tip-thank-you'); close_sheet(pg)
    d = db(pg); ok(d['purchases']['owned'].get('cupmori.stickers.doodle') and d['purchases']['tips'] == 1, 'IAP sim: sticker pack owned, tip counted (unlocks nothing)')
    view_shot(pg, '19-shop-after-purchase')
    # ---------- 8. World Bee Day (any year) ----------
    open_('?date=2027-05-20&t=09:30', {'today':'2027-05-20','from':1,'n':5})
    shot(pg, '20-bee-day-home'); ok(db(pg)['guests'].get('bee'), 'bee met during World Bee Day')
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.wait_for_timeout(800); shot(pg, '21-bee-day-cafe-honey-menu')
    pg.click('[data-act=cat][data-k=other]'); pg.click('.it >> text=ฮันนี่เลมอนโซดา'); pg.click('[data-act=opt-ice][data-k="2"]'); pg.click('[data-act=startbrew]'); pg.wait_for_timeout(400)
    hold(pg, '[data-hold=soda]', 1750); shot(pg, '22-honey-soda-pour'); nxt(pg)
    for _ in range(2): pg.click('[data-act=scoop]'); pg.wait_for_timeout(120)
    nxt(pg); nxt(pg); shot(pg, '23-honey-soda-cup-2-cubes'); nxt(pg); nxt(pg); pg.click('[data-act=set-mood][data-k=happy]'); nxt(pg); pg.wait_for_timeout(1400)
    shot(pg, '24-honey-soda-done'); d = db(pg); ok('r-honeysoda' in d['recipes'] and 's-meadow' in d['recipes'], 'honey soda + secret meadow recipe (morning, <=2 ice) discovered')
    # festival engine any year
    for dd, k in [('2031-01-23','lunarNewYear'), ('2035-09-16','midAutumn'), ('2040-05-20','worldBeeDay'), ('2029-11-20','loyKrathong')]:
        pg.goto(BASE+f'index.html?date={dd}&dev=1'); pg.wait_for_timeout(700)
        act = pg.evaluate("Festivals.active(Platform.env.now()).map(f=>f.k)"); ok(k in act, f'festival engine {dd}: {k} in {act}')
    # ---------- 9. settings: reduce motion, weather opt-in fallback ----------
    open_('?date=2026-10-23&t=10:00', keep=True); pg.click('[data-act=settings]'); pg.wait_for_timeout(500); pg.click('[data-act=rm-onoff]'); pg.wait_for_timeout(300)
    ok(pg.evaluate("document.querySelector('#phone').classList.contains('rm')"), 'reduce motion applied'); sheet_shot(pg, '25-settings-lang-motion-weather')
    close_sheet(pg)
    # ---------- 10. share card: note hidden by default ----------
    open_('?date=2026-10-23&t=10:00', {'today':'2026-10-23','from':0,'n':3}); pg.click('[data-act=detail][data-k="2026-10-23"]'); pg.wait_for_timeout(500)
    pg.click('#sheet [data-act=story-day]'); pg.wait_for_timeout(2600); sheet_shot(pg, '26-share-card-note-hidden')
    # ---------- 11. English ----------
    for q, name, act in [('?date=2026-10-23&t=10:00&lang=en', '27-en-home', None)]:
        open_(q, {'today':'2026-10-23','from':1,'n':16,'guestEvery':2,'guestKey':'frog','guests':{'frog':{'on':'2026-10-01','at':3},'hedgehog':{'on':'2026-10-10','at':7}}})
        shot(pg, name)
    def crawl_en():
        pg.goto(BASE+'index.html?date=2026-10-23&t=10:00&lang=en&iap=sim'); pg.wait_for_timeout(1200)
        pg.click('#tabbar [data-go=start]'); pg.wait_for_timeout(700); shot(pg, '28-en-cafe')
        pg.click('[data-act=startbrew]'); pg.wait_for_timeout(500); shot(pg, '29-en-brew')
        pg.click('[data-act=quit]'); pg.wait_for_timeout(500)
        pg.click('.mystery [data-act=extra]'); pg.wait_for_timeout(600); pg.click('[data-act=cat][data-k=other]'); pg.click('[data-act=pick][data-k=cocoa]'); pg.click('[data-act=startbrew]'); pg.wait_for_timeout(400)
        brew_cocoa_whip(pg); pg.click('[data-act=set-top][data-k=whip]'); nxt(pg); nxt(pg); pg.wait_for_timeout(1300); shot(pg, '30-en-extra-done')
        pg.click('[data-go=recipes]'); pg.wait_for_timeout(600); view_shot(pg, '31-en-recipes')
        pg.click('#tabbar [data-go=room]'); pg.wait_for_timeout(600); view_shot(pg, '32-en-room')
        pg.click('#tabbar [data-go=collect]'); sheet_shot(pg, '33-en-collection')
        pg.click('#sheet [data-act=story]'); sheet_shot(pg, '34-en-story'); close_sheet(pg)
        pg.click('#tabbar [data-go=home]'); pg.wait_for_timeout(400)
        for act, n in [('settings','35-en-settings'), ('about','36-en-about')]:
            pg.click(f'[data-act={act}]'); sheet_shot(pg, n); close_sheet(pg)
        pg.click('[data-go=summary]'); pg.wait_for_timeout(2500); sheet_shot(pg, '37-en-summary'); close_sheet(pg)
        pg.click('[data-act=detail]'); pg.wait_for_timeout(500); sheet_shot(pg, '38-en-detail')
        pg.click('#sheet [data-act=story-day]'); pg.wait_for_timeout(2600); sheet_shot(pg, '39-en-share-card')
    crawl_en()
    missing |= set(pg.evaluate("[...I18N.missing]"))
    # visible Thai left in English mode (DOM)
    thai_left = pg.evaluate(r"""(()=>{ const out=new Set(); const w=document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())){ if(/[\u0E00-\u0E7F]/.test(n.nodeValue) && n.parentNode.closest && !n.parentNode.closest('script')) out.add(n.nodeValue.trim()); } return [...out]; })()""")
    missing |= set(thai_left)
    br.close()
json.dump(sorted(missing), open(os.path.join(OUT, 'i18n-missing.json'), 'w'), ensure_ascii=False, indent=0)
print('untranslated strings:', len(missing))
print('\n'.join(errs) if errs else 'console errors: 0')
json.dump({'checks':checks, 'errors':errs, 'untranslated':len(missing)}, open(os.path.join(OUT, 'qc.json'), 'w'), ensure_ascii=False, indent=1)
sys.exit(1 if errs or any(c.startswith('FAIL') for c in checks) else 0)
