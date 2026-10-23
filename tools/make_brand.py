"""Brand assets from the Cupmori CI book (cupmori-ci.pdf): emblem (duck in a sage cup), CI app icon, and a TEMPORARY
wordmark set in Mali Bold as SVG outlines (no font needed at runtime). The final logo comes with the VI book: swap
assets/brand/* and the [data-logo-slot] elements, nothing else references the logo."""
from pathlib import Path
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
ROOT = Path(__file__).resolve().parent.parent; SRC = Path('/workspace/mc-art/p2'); OUT = ROOT / 'assets/brand'; OUT.mkdir(exist_ok=True)
em = Image.open(SRC / 'ci-emblem.png').convert('RGBA'); em = em.crop(em.getbbox())
em.thumbnail((256, 256), Image.LANCZOS); em.save(OUT / 'emblem.webp', quality=90, method=6)
ic = Image.open(SRC / 'ci-appicon.png').convert('RGB')
ic.resize((1024, 1024), Image.LANCZOS).save(OUT / 'appicon-ci-1024.webp', quality=90, method=6)   # review copy; App Store PNG is exported from the CI source
f = TTFont(ROOT / 'assets/fonts/Mali-Bold.woff2'); gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
x = 0; paths = []; bp = BoundsPen(gs)
for ch in 'Cupmori':
    g = cmap[ord(ch)]; pen = SVGPathPen(gs); gs[g].draw(pen)
    paths.append(f'<path transform="translate({x} 0)" d="{pen.getCommands()}"/>')
    from fontTools.pens.transformPen import TransformPen
    gs[g].draw(TransformPen(bp, (1, 0, 0, 1, x, 0))); x += gs[g].width
x0, y0, x1, y1 = bp.bounds; pad = 20
w, h = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0 - pad} {-y1 - pad} {w} {h}" role="img" aria-label="Cupmori"><title>Cupmori</title><g fill="#49342B" transform="scale(1 -1)">{"".join(paths)}</g></svg>'
(OUT / 'wordmark.svg').write_text(svg); print('wordmark', round(w), 'x', round(h), 'em', em.size)
