from PIL import Image
import os
A='/workspace/projects/mood-cup/assets/art'; O='/workspace/projects/mood-cup/assets/img'
def sv(im,name,size,q=82):
    im=im.convert('RGB'); im.thumbnail((size,size),Image.LANCZOS); im.save(f'{O}/{name}.webp',quality=q,method=6)
for f in os.listdir(A):
    if f.startswith('b-') and f.endswith('.png'): sv(Image.open(f'{A}/{f}'),f[:-4],420)
for f,n,s in [('bg-counter.png','counter',900),('bg-coffee.png','coffee',800),('bg-matcha.png','matcha',800)]:
    if os.path.exists(f'{A}/{f}'): sv(Image.open(f'{A}/{f}'),n,s)
st=Image.open(f'{A}/stamps.png').convert('RGB'); W,H=st.size
names=['icematcha','latte','americano','mocha','strawmatcha','hojicha','cocoa','usucha']
for i,k in enumerate(names):
    c,r=i%4,i//4; cw,ch=W/4,H/2; cx,cy=(c+.5)*cw,(r+.5)*ch; s=min(cw,ch)*.98
    sv(st.crop((int(cx-s/2),int(cy-s/2),int(cx+s/2),int(cy+s/2))),'d-'+k,300,85)
row=st.crop((0,0,W,H//2)); sv(row,'stamps-row',760)
if os.path.exists(f'{A}/cups.png'):
    cp=Image.open(f'{A}/cups.png').convert('RGB'); W,H=cp.size
    for i,k in enumerate(['tumbler','mug','paper','glass']):
        cw=W/4; s=min(cw,H)*.98; cx=(i+.5)*cw; cy=H/2
        sv(cp.crop((int(cx-s/2),int(cy-s/2),int(cx+s/2),int(cy+s/2))),'cup-'+k,260,85)
if os.path.exists(f'{A}/b-sunny.png'):
    im=Image.open(f'{A}/b-sunny.png').convert('RGB'); im.thumbnail((180,180)); im.save(f'{O}/icon.png')
print(sorted(os.listdir(O)))
