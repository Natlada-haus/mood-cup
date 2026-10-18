import sys
from playwright.sync_api import sync_playwright
W,H,tag = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
URL='http://localhost:8765/index.html'
errs=[]
def shot(pg,n,full=False): pg.wait_for_timeout(600); pg.screenshot(path=f'shots/{tag}-{n}.png', full_page=full)
def hold(pg,sel,ms):
    b=pg.locator(sel).first.bounding_box(); pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); pg.mouse.down(); pg.wait_for_timeout(ms); pg.mouse.up(); pg.wait_for_timeout(250)
def nxt(pg):
    pg.wait_for_selector('#nextBtn:not([disabled])',timeout=8000); pg.click('#nextBtn'); pg.wait_for_timeout(300)
def cur(pg): return pg.evaluate("document.querySelector('.st.on')?.textContent||''")
def order(pg, cat, item, temp, ice=None, size='L', sweet='25', milk=None):
    pg.goto(URL); pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(800)
    pg.click('text=เข้าร้าน ชงแก้ววันนี้'); pg.wait_for_timeout(300)
    pg.click(f'[data-act=cat][data-k={cat}]'); pg.click(f'.it >> text="{item}"')
    if temp: pg.click(f'[data-act=opt-temp][data-k={temp}]')
    if ice: pg.click(f'[data-act=opt-ice][data-k={ice}]')
    pg.click(f'[data-act=opt-size][data-k={size}]'); pg.click(f'[data-act=opt-sweet][data-k="{sweet}"]')
    if milk: pg.click(f'[data-act=opt-milk][data-k={milk}]')
    pg.locator('#opts').scroll_into_view_if_needed()
def brew(pg, coffee, name):
    pg.click('[data-act=startbrew]'); pg.wait_for_timeout(300)
    for _ in range(14):
        c=cur(pg)
        if 'เมล็ด' in c: pass
        elif 'บด' in c: hold(pg,'[data-hold=grind]',1900)
        elif 'แทมป์' in c:
            for i in range(3):
                if pg.locator('#nextBtn[disabled]').count(): hold(pg,'[data-hold=tamp]',1900)
        elif 'ช็อต' in c: pg.click('[data-act=pull]'); pg.wait_for_timeout(2000)
        elif 'สตีมนม' in c:
            if pg.locator('[data-hold=milk]').count(): hold(pg,'[data-hold=milk]',2800)
            else: pg.click('[data-act=coldmilk]')
        elif 'อาร์ต' in c: pg.click('[data-act=pour]')
        elif 'ร่อนผง' in c:
            for i in range(6): pg.click('[data-act=sift]')
        elif 'น้ำร้อน' in c: pg.fill('input[type=range]','80'); pg.dispatch_event('input[type=range]','input'); pg.click('[data-act=pourwater]')
        elif 'ตีฟอง' in c: hold(pg,'[data-hold=whisk]',3000)
        elif c.endswith('นม') : pg.click('[data-act=coldmilk]')
        elif 'น้ำแข็ง' in c:
            pg.click('[data-act=scoop]'); pg.click('[data-act=scoop]'); shot(pg, f'{name}-ice-mid')
            for i in range(6):
                if pg.locator('#nextBtn[disabled]').count(): pg.click('[data-act=scoop]')
            shot(pg, f'{name}-ice-done')
        elif 'แก้ว' in c: shot(pg, f'{name}-cup')
        elif 'มู้ด' in c:
            pg.click('[data-act=set-mood][data-k=happy]'); nxt(pg); pg.wait_for_timeout(1500); shot(pg, f'{name}-done'); return
        nxt(pg)
    errs.append('flow did not finish '+name)
with sync_playwright() as p:
    br=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=user-gesture-required'])
    pg=br.new_page(viewport={'width':W,'height':H}, device_scale_factor=2 if W<500 else 1)
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e))); pg.on('console',lambda m: m.type in('error','warning') and errs.append(m.type+' '+m.text))
    pg.on('dialog',lambda d:d.accept())
    order(pg,'coffee','ลาเต้','iced','extra','L','25','oat'); shot(pg,'20-hot-iced'); 
    st=pg.evaluate("[!!window.SFX, SFX.muted]"); print('sfx',st)
    brew(pg,True,'21-coffee-iced')
    order(pg,'coffee','ลาเต้','hot',None,'S','50'); shot(pg,'22-coffee-hot-order'); brew(pg,True,'23-coffee-hot')
    order(pg,'matcha','มัทฉะลาเต้','iced','less','M','0','soy'); shot(pg,'24-matcha-iced-order'); brew(pg,False,'25-matcha-iced')
    order(pg,'matcha','มัทฉะลาเต้','hot',None,'M','100'); brew(pg,False,'26-matcha-hot')
    pg.click('[data-act=home]'); pg.click('.hero [data-act=detail]'); shot(pg,'27-detail')
    pg.click('.sheet-x'); pg.click('#muteBtn'); shot(pg,'28-muted'); print('muted', pg.evaluate("SFX.muted"))
    pg.click('#muteBtn'); print('ctx', pg.evaluate("1"))
    br.close()
print('ERRS', errs)
