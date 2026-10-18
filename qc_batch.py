import sys, math
from playwright.sync_api import sync_playwright
W,H,tag = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
URL='http://localhost:8765/index.html'; errs=[]
def shot(pg,n): pg.wait_for_timeout(600); pg.screenshot(path=f'shots/{tag}-{n}.png')
def hold(pg,sel,ms):
    b=pg.locator(sel).first.bounding_box(); pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); pg.mouse.down(); pg.wait_for_timeout(ms); pg.mouse.up(); pg.wait_for_timeout(300)
def nxt(pg): pg.wait_for_selector('#nextBtn:not([disabled])',timeout=8000); pg.click('#nextBtn'); pg.wait_for_timeout(300)
def mk(br, when=None):
    ctx=br.new_context(viewport={'width':W,'height':H}, device_scale_factor=2 if W<500 else 1, accept_downloads=True)
    pg=ctx.new_page()
    if when: pg.clock.install(time=when)
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text)); pg.on('dialog',lambda d:d.accept())
    pg.goto(URL); pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(900); return ctx,pg
with sync_playwright() as p:
    br=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--mute-audio'])
    ctx,pg=mk(br)
    # menu with seasonal pumpkin (October)
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.wait_for_timeout(300); shot(pg,'40-menu-oct-board')
    print('pumpkin on menu', pg.locator('.it >> text="พัมพ์กิ้นลาเต้"').count())
    pg.click('.it >> text="พัมพ์กิ้นลาเต้"'); pg.locator('#opts').scroll_into_view_if_needed(); shot(pg,'41-pumpkin-order')
    pg.click('[data-act=startbrew]'); nxt(pg); hold(pg,'[data-hold=grind]',1900); nxt(pg)
    for i in range(3):
        if pg.locator('#nextBtn[disabled]').count(): hold(pg,'[data-hold=tamp]',1900)
    nxt(pg)
    # gesture: hold-to-pull, release in golden zone (2 shots -> 100% at 1.8s)
    b=pg.locator('[data-hold=shot]').bounding_box(); pg.evaluate('window.__t0=performance.now()'); pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); pg.mouse.down(); pg.wait_for_timeout(1300); pg.screenshot(path=f'shots/{tag}-42-shot-golden-zone.png'); t0=pg.evaluate('performance.now()-window.__t0'); pg.wait_for_timeout(50); pg.mouse.up(); pg.wait_for_timeout(400)
    print('held ms', t0); print('shot quality', pg.locator('#gm').inner_text()); shot(pg,'43-shot-perfect'); nxt(pg)
    hold(pg,'[data-hold=milk]',2800); nxt(pg); pg.click('[data-act=pour]'); nxt(pg); nxt(pg)
    print('cups offered', pg.eval_on_selector_all('[data-act=set-cup]','e=>e.map(x=>x.dataset.k)')); shot(pg,'44-pumpkin-cup'); nxt(pg)
    shot(pg,'45-deco-locks'); pg.click('[data-act=stk][data-k=crown]'); pg.wait_for_timeout(200); print('lock toast', pg.locator('#toast').inner_text()); nxt(pg)
    pg.click('[data-act=set-mood][data-k=tired]'); pg.fill('#note','ประชุมทั้งวันเลย'); shot(pg,'46-mood-reply'); print('reply', pg.locator('#bub').inner_text()); nxt(pg); pg.wait_for_timeout(1600); shot(pg,'47-done')
    pg.click('[data-act=story-day]'); pg.wait_for_selector('#storyImg[src]',timeout=15000); pg.wait_for_timeout(500); shot(pg,'48-story-day-sheet')
    src=pg.eval_on_selector('#storyImg','e=>e.src'); print('story size', pg.evaluate("s=>new Promise(r=>{const i=new Image();i.onload=()=>r([i.naturalWidth,i.naturalHeight]);i.src=s})",src))
    with pg.expect_download() as d: pg.click('[data-act=story-share]')
    d.value.save_as(f'shots/{tag}-story-day.png'); print('fallback download ok')
    pg.click('.sheet-x'); pg.click('[data-act=home]')
    # matcha whisk circular gesture
    pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(700)
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.click('[data-act=cat][data-k=matcha]'); pg.click('.it >> text="มัทฉะลาเต้"'); pg.click('[data-act=startbrew]')
    for i in range(6): pg.click('[data-act=sift]')
    nxt(pg); pg.fill('input[type=range]','80'); pg.dispatch_event('input[type=range]','input'); pg.click('[data-act=pourwater]'); nxt(pg)
    b=pg.locator('#pad').bounding_box(); cx,cy,r=b['x']+b['width']/2,b['y']+b['height']/2,b['width']*.33
    pg.mouse.move(cx+r,cy); pg.mouse.down()
    for i in range(1,150): a=i*0.25; pg.mouse.move(cx+r*math.cos(a), cy+r*math.sin(a))
    shot(pg,'49-whisk-circle'); pg.mouse.up(); print('whisk', pg.locator('#gm').inner_text(), 'next enabled', pg.locator('#nextBtn:not([disabled])').count())
    # home + demo + summary + collection
    pg.goto(URL); pg.wait_for_timeout(700); pg.click('[data-act=demo]'); pg.wait_for_timeout(500)
    pg.evaluate("document.getElementById('app').scrollTop=9999"); shot(pg,'50-home-bottom-nav')
    pg.click('#tabbar [data-go=summary]'); pg.wait_for_timeout(2500); pg.evaluate("document.getElementById('sheet').scrollTop=2000"); shot(pg,'51-summary-card')
    with pg.expect_download() as d: pg.click('[data-act=dl]')
    d.value.save_as(f'shots/{tag}-card-4x5.png')
    pg.click('[data-act=story-month]'); pg.wait_for_selector('#storyImg[src]',timeout=15000); pg.wait_for_timeout(500); shot(pg,'52-story-month-sheet')
    with pg.expect_download() as d: pg.click('[data-act=story-dl]')
    d.value.save_as(f'shots/{tag}-story-month.png'); pg.click('.sheet-x')
    pg.click('#tabbar [data-go=collect]'); pg.wait_for_timeout(600); shot(pg,'53-collection')
    pg.evaluate("document.getElementById('sheet').scrollTop=2000"); shot(pg,'54-collection-rewards')
    # streak unlock: 8 consecutive real days
    pg.evaluate("""(()=>{const k='ggcafe.moodcup.v1';const db={entries:{}};for(let i=0;i<8;i++){const d=new Date();d.setDate(d.getDate()-i);const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;db.entries[key]={drink:'latte',barista:'pe',temp:'hot',cup:'mug',size:'M',sweet:50,ice:'normal',milk:'fresh',sleeve:'gold',stickers:['heart'],mood:'happy',note:'',shots:2}};localStorage.setItem(k,JSON.stringify(db))})()""")
    pg.reload(); pg.wait_for_timeout(700); pg.click('#tabbar [data-go=collect]'); pg.wait_for_timeout(500); pg.evaluate("document.getElementById('sheet').scrollTop=2000"); shot(pg,'55-collection-unlocked')
    ctx.close()
    # December: christmas cocoa, no pumpkin
    ctx,pg=mk(br,'2026-12-10T10:00:00+07:00')
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.click('[data-act=cat][data-k=other]'); pg.wait_for_timeout(300)
    print('dec: xmas', pg.locator('.it >> text="โกโก้คริสต์มาส"').count(), 'pumpkin', pg.locator('text="พัมพ์กิ้นลาเต้"').count())
    pg.click('.it >> text="โกโก้คริสต์มาส"'); shot(pg,'56-dec-xmas-menu'); ctx.close()
    br.close()
print('ERRS', errs)
