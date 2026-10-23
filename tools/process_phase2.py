"""Phase 2 art: Grok raw files (/workspace/mc-art/p2, outside the repo) -> assets/img/decor-*.webp (alpha) + room-bg.webp.
Cut-outs use rembg (u2net); paired sheets are split down the middle first."""
import sys
from pathlib import Path
from PIL import Image
from rembg import remove, new_session
RAW = Path('/workspace/mc-art/p2'); OUT = Path(__file__).resolve().parent.parent / 'assets/img'
ses = new_session('u2net')
def cut(im, name, maxw):
    o = remove(im, session=ses); bb = o.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox(); o = o.crop(bb)
    if o.width > maxw: o = o.resize((maxw, round(o.height * maxw / o.width)), Image.LANCZOS)
    o.save(OUT / f'decor-{name}.webp', quality=82, method=6); print(name, o.size)
bg = Image.open(RAW / 'room-bg.jpg').convert('RGB').resize((960, 720), Image.LANCZOS); bg.save(OUT / 'room-bg.webp', quality=80, method=6); print('room-bg', bg.size)
for n, w in [('windowseat', 520), ('table2', 460), ('pastrycase', 480)]:
    cut(Image.open(RAW / f'decor-{n}.jpg').convert('RGB'), n, w)
for f, (l, r), (wl, wr) in [('plants', ('monstera', 'succulent'), (300, 160)), ('lamps', ('paperlamp', 'floorlamp'), (220, 220))]:
    im = Image.open(RAW / f'decor-{f}.jpg').convert('RGB'); W, H = im.size; mid = W * (0.56 if f == 'plants' else 0.5)
    cut(im.crop((0, 0, int(mid), H)), l, wl); cut(im.crop((int(mid), 0, W, H)), r, wr)
