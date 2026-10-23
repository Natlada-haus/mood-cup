"""Process Phase 1 Grok-generated art (raw JPGs in /workspace/mc-art/raw) into app assets.
Same conventions as the existing pipeline: RGB on cream paper, webp q80-85,
portraits 300x300, counter scenes 747x1000. Overlays/stickers get alpha via border flood-fill."""
import os, sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
RAW = sys.argv[1] if len(sys.argv) > 1 else '/workspace/mc-art/raw'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'assets/img'); ICO = os.path.join(ROOT, 'assets/icons')
CREAM = (255, 247, 234)
def op(n): return Image.open(os.path.join(RAW, n)).convert('RGB')
def webp(im, name, size, q=82):
    im = im.copy(); im.thumbnail(size, Image.LANCZOS); im.save(os.path.join(IMG, name), quality=q, method=6); return im.size
def cutout(im, thr=34, pad=0.06):
    a = np.asarray(im).astype(int)
    border = np.concatenate([a[:6].reshape(-1,3), a[-6:].reshape(-1,3), a[:,:6].reshape(-1,3), a[:,-6:].reshape(-1,3)])
    bg = np.median(border, axis=0)
    near = np.abs(a - bg).sum(-1) < thr
    lab, _ = ndimage.label(near)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:,0], lab[:,-1]]))) - {0}
    bgm = np.isin(lab, list(edge))
    fg = ndimage.binary_opening(~bgm, iterations=2)
    fg = ndimage.binary_fill_holes(fg)
    alpha = Image.fromarray((fg*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
    rgba = im.convert('RGBA'); rgba.putalpha(alpha)
    ys, xs = np.where(fg); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    p = int(max(y1-y0, x1-x0)*pad)
    return rgba.crop((max(0,x0-p), max(0,y0-p), min(im.width,x1+p), min(im.height,y1+p)))
out = {}
for k in ['frog','hedgehog','otter','sheep','redpanda']:
    out[f'g-{k}'] = webp(op(f'g-{k}.jpg'), f'g-{k}.webp', (300,300))
    out[f'scene-{k}'] = webp(op(f's-{k}.jpg').resize((747,1000), Image.LANCZOS), f'scene-{k}.webp', (747,1000), 80)
out['d-secret'] = webp(op('d-secret.jpg'), 'd-secret.webp', (300,300), 85)
out['d-decaf'] = webp(op('d-decaf.jpg'), 'd-decaf.webp', (300,300), 85)
sg = cutout(op('sign-closing.jpg'), thr=30, pad=0.02); sg.thumbnail((420,420), Image.LANCZOS); sg.save(os.path.join(IMG,'sign-closing.webp'), quality=88, method=6); out['sign-closing'] = sg.size
st = cutout(op('stk-bean.jpg'), thr=30, pad=0.04); st.thumbnail((160,160), Image.LANCZOS); st.save(os.path.join(IMG,'stk-bean.webp'), quality=90, method=6); out['stk-bean'] = st.size
# app icon: square, full-bleed, no alpha (fill the generator's rounded white corners with paper cream)
ic = np.asarray(op('app-icon.jpg')).copy()
near_white = (ic.min(-1) > 246)
lab, _ = ndimage.label(near_white)
corners = {lab[0,0], lab[0,-1], lab[-1,0], lab[-1,-1]} - {0}
mask = ndimage.binary_dilation(np.isin(lab, list(corners)), iterations=3)
ic[mask] = CREAM
icon = Image.fromarray(ic).resize((1024,1024), Image.LANCZOS)
icon.save(os.path.join(ICO, 'icon-1024.png'))
for s in (512, 192, 180, 32):
    icon.resize((s,s), Image.LANCZOS).save(os.path.join(ICO, f'icon-{s}.png'))
icon.resize((180,180), Image.LANCZOS).save(os.path.join(IMG, 'icon.png'))
out['icon'] = icon.size
# launch screen: web splash + 2732 square cream canvas with the art centred (safe under aspect-fill)
la = op('launch.jpg')
webp(la.resize((1080,1920), Image.LANCZOS), 'launch.webp', (1080,1920), 82)
sq = Image.new('RGB', (2732,2732), CREAM); h = 2133; w = int(la.width*h/la.height)
sq.paste(la.resize((w,h), Image.LANCZOS), ((2732-w)//2, (2732-h)//2)); sq.save(os.path.join(ICO, 'launch-2732.png'))
la.resize((1290,2796), Image.LANCZOS).save(os.path.join(ICO, 'launch-1290x2796.png'))
out['launch'] = la.size
for k, v in out.items(): print(k, v)
