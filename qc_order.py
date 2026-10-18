import sys
from playwright.sync_api import sync_playwright
W,H,tag = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
MATRIX = len(sys.argv)>4
URL='http://localhost:8765/index.html'
errs=[]; cups=[]; final_cup=['mug']
def shot(pg,n,full=False): pg.wait_for_timeout(600); pg.screenshot(path=f'shots/{tag}-{n}.png', full_page=full)
def hold(pg,sel,ms):
    b=pg.locator(sel).first.bounding_box(); pg.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2); pg.mouse.down(); pg.wait_for_timeout(ms); pg.mouse.up(); pg.wait_for_timeout(250)
def nxt(pg):
    try: pg.wait_for_selector('#nextBtn:not([disabled])',timeout=8000)
    except Exception:
        pg.screenshot(path=f'shots/{tag}-STUCK.png'); errs.append('stuck at '+cur(pg)); return
    pg.click('#nextBtn'); pg.wait_for_timeout(300)
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
        elif 'น้ำร้อน' in c: wv=pg.evaluate("(()=>{const m=document.querySelector('#ctl .lbl').textContent.match(/(\\d+)–(\\d+)/);return String(Math.round((+m[1]+ +m[2])/2))})()"); pg.fill('input[type=range]',wv); pg.dispatch_event('input[type=range]','input'); pg.click('[data-act=pourwater]')
        elif 'ตีฟอง' in c: hold(pg,'[data-hold=whisk]',3000)
        elif c.endswith('นม') : pg.click('[data-act=coldmilk]')
        elif 'น้ำแข็ง' in c:
            pg.click('[data-act=scoop]'); pg.click('[data-act=scoop]'); shot(pg, f'{name}-ice-mid')
            for i in range(6):
                if pg.locator('#nextBtn[disabled]').count(): pg.click('[data-act=scoop]')
            shot(pg, f'{name}-ice-done')
        elif 'แก้ว' in c:
            for cup in pg.eval_on_selector_all('[data-act=set-cup]','els=>els.map(e=>e.dataset.k)'):
                pg.click(f'[data-act=set-cup][data-k={cup}]'); pg.wait_for_timeout(250)
                src=pg.evaluate("document.querySelector('.preview .stamp>img').getAttribute('src')")
                cups.append((name,cup,src.split('/')[-1]))
                pg.screenshot(path=f'shots/{tag}-{name}-cup-{cup}.png')
            fc=final_cup[0] if pg.locator(f'[data-act=set-cup][data-k={final_cup[0]}]').count() else cup
            pg.click(f'[data-act=set-cup][data-k={fc}]'); shot(pg, f'{name}-cup')
        elif 'มู้ด' in c:
            pg.click('[data-act=set-mood][data-k=happy]'); pg.fill('#note','วันนี้ทดสอบ'); nxt(pg); pg.wait_for_timeout(1500); shot(pg, f'{name}-done'); return
        nxt(pg)
    errs.append('flow did not finish '+name)
with sync_playwright() as p:
    br=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--autoplay-policy=user-gesture-required','--mute-audio'])
    pg=br.new_page(viewport={'width':W,'height':H}, device_scale_factor=2 if W<500 else 1)
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e))); pg.on('console',lambda m: m.type in('error','warning') and errs.append(m.type+' '+m.text))
    pg.on('dialog',lambda d:d.accept())
    order(pg,'coffee','ลาเต้','iced','extra','L','25','oat'); shot(pg,'20-hot-iced')
    pg.wait_for_timeout(2500); print('bgm playing', pg.evaluate("SFX.playing"))
    pg.click('#bgmBtn'); pg.click('[data-act=bgm-onoff]'); pg.wait_for_timeout(1500); print('bgm after toggle', pg.evaluate("[SFX.bgm,SFX.playing]")); shot(pg,'29-bgm-off')
    pg.click('[data-act=bgm-onoff]'); pg.mouse.click(30,700); pg.wait_for_timeout(800)
    pg.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))"); pg.wait_for_timeout(1200)
    print('hidden playing', pg.evaluate("SFX.playing"))
    pg.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))"); pg.wait_for_timeout(1500)
    print('visible playing', pg.evaluate("SFX.playing"))
    final_cup[0]='gl2'
    st=pg.evaluate("[!!window.SFX, SFX.muted]"); print('sfx',st)
    brew(pg,True,'21-coffee-iced')
    final_cup[0]='mug3'
    order(pg,'coffee','ลาเต้','hot',None,'S','50'); shot(pg,'22-coffee-hot-order'); brew(pg,True,'23-coffee-hot')
    final_cup[0]='gl4'
    order(pg,'matcha','มัทฉะลาเต้','iced','less','M','0','soy'); shot(pg,'24-matcha-iced-order'); brew(pg,False,'25-matcha-iced')
    final_cup[0]='mug5'
    order(pg,'matcha','มัทฉะลาเต้','hot',None,'M','100'); brew(pg,False,'26-matcha-hot')
    pg.click('[data-act=home]'); pg.click('.hero [data-act=detail]'); shot(pg,'27-detail')
    print('detail img', pg.evaluate("document.querySelector('.sheet .stamp>img').getAttribute('src')"))
    pg.click('.sheet-x'); pg.click('#muteBtn'); shot(pg,'28-muted'); print('muted', pg.evaluate("SFX.muted"))
    pg.click('#muteBtn'); print('ctx', pg.evaluate("1"))
    # volume popover
    pg.click('#bgmBtn'); pg.wait_for_timeout(300)
    pg.fill('input[data-vol=music]','40'); pg.dispatch_event('input[data-vol=music]','input')
    pg.fill('input[data-vol=sfx]','70'); pg.dispatch_event('input[data-vol=sfx]','input'); shot(pg,'30-volume')
    print('vols', pg.evaluate("[SFX.vol('music'),SFX.vol('amb'),SFX.vol('sfx'), localStorage.getItem('ggcafe.moodcup.vol')]"))
    pg.reload(); pg.wait_for_timeout(800); pg.click('#bgmBtn'); print('after reload', pg.eval_on_selector('input[data-vol=music]','e=>e.value')); pg.mouse.click(30,400)
    if MATRIX:
        for cat,item,temps in [('coffee','ลาเต้',['hot','iced']),('coffee','อเมริกาโน่',['hot','iced']),('coffee','คาปูชิโน่',['hot','iced']),('coffee','มอคค่า',['hot','iced']),('coffee','เดอร์ตี้',[None]),('matcha','มัทฉะลาเต้',['hot','iced']),('matcha','อุสุฉะ',[None]),('matcha','สตรอว์เบอร์รีมัทฉะ',[None]),('other','โฮจิฉะลาเต้',['hot','iced']),('other','โกโก้',['hot','iced']),('coffee','พัมพ์กิ้นลาเต้',[None])]:
            for t in temps:
                order(pg,cat,item,t,None,'M','50'); brew(pg, cat=='coffee', f'x-{item}-{t}')
    br.close()
print('CUPS'); [print(' ',c) for c in cups]
print('ERRS', errs)
