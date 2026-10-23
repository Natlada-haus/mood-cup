"""Phase 1 QC: headless Chromium walk-through of key screens -> .qc/*.png, fails on console errors.
usage: python3 tools/qc_phase1.py [base_url]   (default http://localhost:8765/)"""
import sys, json, os
from playwright.sync_api import sync_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.qc'); os.makedirs(OUT, exist_ok=True)
errs = []
KEY = 'ggcafe.moodcup.v1'
SEED = """(o) => { const pad=n=>String(n).padStart(2,'0'); const base=new Date(o.today+'T12:00:00'); const E={};
  const drinks=['latte','americano','matchalatte','cocoa','hojicha','mocha'];
  for (let i=o.from;i<o.from+o.n;i++){ const d=new Date(base); d.setDate(d.getDate()-i); const k=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const dr = o.usual && i<o.from+4 ? 'latte' : drinks[i%drinks.length];
    E[k]={drink:dr,barista:['pe','berry','moss','momo','bobby'][i%5],temp:o.usual&&i<o.from+4?'iced':'hot',size:'M',sweet:50,milk:'fresh',ice:'less',bean:'medium',grind:'fine',shots:2,art:'heart',syrup:'none',scoops:2,water:80,topping:'none',cup:o.usual&&i<o.from+4?'gl2':'mug1',sleeve:'peach',stickers:o.cat&&i===o.from?['cat','heart']:['heart'],mood:'happy',note:'',ts:+d}; }
  const db = o.v1 ? {entries:E} : {v:2,entries:E,guests:o.guests||{},settings:Object.assign({reminderAsked:true},o.settings||{})};
  localStorage.setItem('KEYX', JSON.stringify(db)); }""".replace('KEYX', KEY)
def hold(pg, sel, ms):
    b = pg.locator(sel).first.bounding_box(); pg.mouse.move(b['x']+b['width']/2, b['y']+b['height']/2); pg.mouse.down(); pg.wait_for_timeout(ms); pg.mouse.up(); pg.wait_for_timeout(250)
def nxt(pg):
    pg.wait_for_selector('#nextBtn:not([disabled])', timeout=8000); pg.click('#nextBtn'); pg.wait_for_timeout(300)
def shot(pg, n, full=False):
    pg.wait_for_timeout(600); pg.screenshot(path=f'{OUT}/{n}.png', full_page=full)
def sheet_shot(pg, n):
    pg.wait_for_timeout(700); pg.locator('#sheet').screenshot(path=f'{OUT}/{n}.png')
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx = br.new_context(viewport={'width':390,'height':844}, device_scale_factor=2, accept_downloads=True)
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.on('console', lambda m: m.type == 'error' and errs.append('console.error '+m.text))
    pg.on('dialog', lambda d: d.accept())
    def open_(q='', seed=None):
        pg.goto(BASE+'index.html'+q); pg.evaluate('localStorage.clear()')
        if seed: pg.evaluate(SEED, seed)
        pg.goto(BASE+'index.html'+q); pg.wait_for_timeout(1500)
    # 0 splash
    pg.goto(BASE+'index.html?t=09:00', wait_until='domcontentloaded'); pg.wait_for_timeout(150); pg.screenshot(path=f'{OUT}/00-launch-splash.png')
    # 1 first run, morning
    open_('?t=09:00&date=2026-10-23'); shot(pg, '01-home-first-run-morning')
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); shot(pg, '02-cafe-menu-5duck-halloween')
    pg.click('.it >> text=ลาเต้'); pg.click('[data-act=startbrew]')
    pg.click('[data-act=set-bean][data-k=thai]'); nxt(pg)
    hold(pg, '[data-hold=grind]', 1900); nxt(pg)
    for _ in range(4):
        if pg.locator('#nextBtn[disabled]').count(): hold(pg, '[data-hold=tamp]', 1900)
    nxt(pg)
    pg.click('[data-act=pull]'); pg.wait_for_timeout(2300); nxt(pg)
    hold(pg, '[data-hold=milk]', 2800)
    if pg.locator('#nextBtn[disabled]').count(): hold(pg, '[data-hold=milk]', 2600)
    nxt(pg)
    pg.click('[data-act=pour]'); nxt(pg)
    nxt(pg)  # syrup
    nxt(pg)  # cup
    pg.click('[data-act=stk][data-k=bean]'); pg.click('[data-act=stk][data-k=heart]'); shot(pg, '03-deco-bean-sticker'); nxt(pg)
    pg.click('[data-act=set-mood][data-k=happy]'); nxt(pg)
    pg.wait_for_timeout(1500); shot(pg, '04-done-first-cup-reminder-ask')
    pg.fill('#remTime', '20:30'); pg.click('[data-act=rem-save]'); pg.wait_for_timeout(800)
    st = pg.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')).settings"); assert st['reminder'] == '20:30' and st['reminderAsked'], st
    pg.click('[data-act=story-day]'); pg.wait_for_timeout(2500); sheet_shot(pg, '05-story-card-bean')
    # 2 unlock: 2 real stamps already -> 3rd cup unlocks frog
    open_('?t=14:00&date=2026-10-23', {'today':'2026-10-23','from':1,'n':2})
    pg.evaluate("""() => { const db=JSON.parse(localStorage.getItem('%s')); db.entries['2026-10-23']=Object.assign({},Object.values(db.entries)[0]); localStorage.setItem('%s',JSON.stringify(db)); }""" % (KEY, KEY))
    # finish a quick cocoa to trigger syncGuests from the real flow
    pg.evaluate("""() => { const db=JSON.parse(localStorage.getItem('%s')); delete db.entries['2026-10-23']; localStorage.setItem('%s',JSON.stringify(db)); }""" % (KEY, KEY))
    pg.reload(); pg.wait_for_timeout(1200)
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.click('[data-act=cat][data-k=other]'); pg.click('.it >> text=โกโก้'); pg.click('[data-act=startbrew]')
    for _ in range(6): pg.click('[data-act=sift]')
    nxt(pg); pg.click('[data-act=pourwater]'); nxt(pg); hold(pg, '[data-hold=whisk]', 3200); nxt(pg)
    pg.click('[data-act=coldmilk]'); nxt(pg); nxt(pg); nxt(pg); nxt(pg)
    pg.click('[data-act=set-mood][data-k=chill]'); nxt(pg); pg.wait_for_timeout(1500); shot(pg, '06-done-guest-unlocked-frog')
    g = pg.evaluate(f"JSON.parse(localStorage.getItem('{KEY}')).guests"); assert 'frog' in g, g
    # 3 all guests unlocked (60 stamps), secret menu + collection + usual order
    allg = {k:{'on':'2026-09-01','at':a} for k,a in [('frog',3),('hedgehog',7),('otter',14),('sheep',30),('redpanda',60)]}
    open_('?t=16:00&date=2026-10-23', {'today':'2026-10-23','from':1,'n':62,'guests':allg,'usual':True})
    shot(pg, '07-home-all-guests')
    pg.click('[data-go=collect]'); sheet_shot(pg, '08-collection-5ducks-guests')
    pg.click('[data-act=close]'); pg.click('text=เข้าร้าน ชงแก้ววันนี้'); shot(pg, '09-cafe-usual-order')
    pg.click('[data-act=usual]'); pg.wait_for_timeout(400)
    assert pg.evaluate("document.querySelector('[data-act=startbrew]').textContent").find('เย็น') >= 0
    pg.click('.it >> text=เมเปิลซินนามอนลาเต้'); shot(pg, '10-cafe-secret-menu')
    # 4 guest visit scene: find a date whose visitor is set
    for day in range(1, 29):
        q = f'?t=10:00&date=2026-11-{day:02d}'
        open_(q, {'today':f'2026-11-{day:02d}','from':1,'n':62,'guests':allg})
        pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.wait_for_timeout(500)
        if 'scene-' in pg.evaluate("document.querySelector('.cs .bg').src"): shot(pg, '11-cafe-guest-visit'); break
    # 5 night: closing sign + decaf
    open_('?t=22:40&date=2026-10-23', {'today':'2026-10-23','from':1,'n':5})
    shot(pg, '12-home-night-closing')
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.click('[data-act=opt-decaf][data-k="1"] >> nth=0'); shot(pg, '13-cafe-night-decaf')
    pg.click('[data-act=startbrew]'); assert pg.locator('text=ดีแคฟ').count() > 0
    # 6 miss-you greeting + in-app reminder fallback
    open_('?t=21:00&date=2026-10-23', {'today':'2026-10-23','from':6,'n':10,'settings':{'reminder':'20:00'}})
    shot(pg, '14-home-miss-you-and-reminder')
    # 7 migration v1 (cat sticker -> bean) + settings/dev + backup
    open_('?t=12:00&date=2026-10-23&dev=1', {'today':'2026-10-23','from':1,'n':4,'cat':True,'v1':True})
    db = pg.evaluate(f"JSON.parse(localStorage.getItem('{KEY}'))")
    assert db['v'] == 2 and not any('cat' in (e.get('stickers') or []) for e in db['entries'].values()), 'migration'
    assert pg.evaluate(f"!!localStorage.getItem('{KEY}.bak-v1')")
    pg.click('[data-act=settings]'); sheet_shot(pg, '15-settings-dev-festivals')
    with pg.expect_download() as dl: pg.click('[data-act=backup]')
    path = dl.value.path(); bk = json.load(open(path)); assert bk['app'] == 'moodcup' and bk['schema'] == 2
    pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(1000)
    pg.click('[data-act=settings]')
    with pg.expect_file_chooser() as fc: pg.click('[data-act=import]')
    fc.value.set_files(path); pg.wait_for_timeout(1200)
    n = pg.evaluate(f"Object.keys(JSON.parse(localStorage.getItem('{KEY}')).entries).length"); assert n == 4, n
    shot(pg, '16-home-after-import')
    # 8 festival overlap (Halloween + Diwali 2027) + southern hemisphere
    open_('?date=2027-10-29&hemi=S&dev=1&t=11:00'); pg.click('[data-act=settings]'); sheet_shot(pg, '17-dev-overlap-halloween-diwali-south')
    txt = pg.inner_text('#sheet'); assert 'halloween' in txt and 'diwali' in txt
    # 9 privacy page
    pg.goto(BASE+'privacy.html'); pg.wait_for_timeout(500); shot(pg, '18-privacy', full=True)
    br.close()
print('ERRORS:', len(errs)); [print(' ', e) for e in errs]
sys.exit(1 if errs else 0)
