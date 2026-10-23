"""Ice-free glass vessels (Phase 2): the old glass art had 2-3 ice cubes painted in, so the cube count could not match the
player's choice. Grok redrew each glass (latte) without ice (/workspace/mc-art/p2/glN-noice.jpg); this script fits it to the
old framing and derives the other drinks with the SAME colour mapping the old recolours used (a quadratic RGB fit learned
pixel-by-pixel from old latte -> old drink). The app then draws exactly 0-5 cubes on top (ART_FX in app.js)."""
import numpy as np
from PIL import Image
from pathlib import Path
RAW = Path('/workspace/mc-art/p2'); OLD = Path('/workspace/mc-art/ice/orig'); OUT = Path(__file__).resolve().parent.parent / 'assets/img'
BG = np.array([255, 248, 236], float)
def bbox(a, thr=38):
    d = np.abs(a.astype(float) - np.median(a[:8, :8].reshape(-1, 3), 0)).sum(-1) > thr
    ys, xs = np.where(d); return xs.min(), ys.min(), xs.max(), ys.max()
def feats(x):
    r, g, b = x[:, 0], x[:, 1], x[:, 2]
    return np.stack([np.ones_like(r), r, g, b, r*r, g*g, b*b, r*g, r*b, g*b], 1)
for n in range(1, 7):
    old = np.array(Image.open(OLD / f'd-v-gl{n}-latte.webp').convert('RGB'))
    new = Image.open(RAW / f'gl{n}-noice.jpg').convert('RGB'); na = np.array(new)
    ob, nb = bbox(old), bbox(na)
    s = (ob[3] - ob[1]) / (nb[3] - nb[1])
    new = new.resize((round(new.width * s), round(new.height * s)), Image.LANCZOS); na = np.array(new); nb = bbox(na)
    canvas = Image.new('RGB', (300, 300), tuple(int(v) for v in np.median(old[:8, :8].reshape(-1, 3), 0)))
    ox = round((ob[0] + ob[2]) / 2 - (nb[0] + nb[2]) / 2); oy = round(ob[3] - nb[3])
    canvas.paste(new, (ox, oy)); lat = np.array(canvas).astype(float) / 255
    Image.fromarray((lat * 255).astype(np.uint8)).save(OUT / f'd-v-gl{n}-latte.webp', quality=88, method=6)
    o = old.reshape(-1, 3).astype(float) / 255
    for drink in ['americano', 'cocoa', 'hojicha', 'matcha', 'mocha']:
        tgt = np.array(Image.open(OLD / f'd-v-gl{n}-{drink}.webp').convert('RGB')).reshape(-1, 3).astype(float) / 255
        W, *_ = np.linalg.lstsq(feats(o), tgt, rcond=None)
        res = (feats(lat.reshape(-1, 3)) @ W).clip(0, 1).reshape(300, 300, 3)
        bgc = np.median(lat[:8, :8].reshape(-1, 3), 0); dist = np.abs(lat - bgc).sum(-1)
        m = np.clip((dist - .03) / .06, 0, 1)[..., None]           # paper stays paper; only the drawing is recoloured
        res = res * m + bgc * (1 - m)
        Image.fromarray((res * 255).astype(np.uint8)).save(OUT / f'd-v-gl{n}-{drink}.webp', quality=88, method=6)
    print('gl', n, 'scale', round(s, 3))

# --- World Bee Day art (Grok, Oct 2026): portrait 300x300, counter scene 747x1000, honey soda fitted to the gl1 framing ---
Image.open(RAW / 'g-bee.jpg').convert('RGB').resize((300, 300), Image.LANCZOS).save(OUT / 'g-bee.webp', quality=88, method=6)
Image.open(RAW / 'scene-bee.jpg').convert('RGB').resize((747, 1000), Image.LANCZOS).save(OUT / 'scene-bee.webp', quality=86, method=6)
old = np.array(Image.open(OLD / 'd-v-gl1-latte.webp').convert('RGB')); ob = bbox(old)
hs = Image.open(RAW / 'd-honeysoda.jpg').convert('RGB'); nb = bbox(np.array(hs)); s = (ob[3] - ob[1]) / (nb[3] - nb[1])
hs = hs.resize((round(hs.width * s), round(hs.height * s)), Image.LANCZOS); nb = bbox(np.array(hs))
c = Image.new('RGB', (300, 300), tuple(int(v) for v in np.median(old[:8, :8].reshape(-1, 3), 0)))
c.paste(hs, (round((ob[0] + ob[2]) / 2 - (nb[0] + nb[2]) / 2), round(ob[3] - nb[3]))); c.save(OUT / 'd-honeysoda.webp', quality=88, method=6)
print('bee art ok')
