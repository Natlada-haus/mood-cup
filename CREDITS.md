# Credits · ก๊าบก๊าบคาเฟ่ MOOD CUP

## Artwork
- **Phase 1 artwork (Oct 2026) — made with Grok image generation**, matched to the café's pencil style using the existing art as reference, then resized/cut out with `tools/process_phase1.py`:
  guests `g-frog`, `g-hedgehog`, `g-otter`, `g-sheep`, `g-redpanda` · guest counter scenes `scene-*` · secret-menu cup `d-secret` · decaf cup `d-decaf` · closing-soon sign `sign-closing` · coffee-bean sticker `stk-bean` (replaces the old cat sticker) · app icon `assets/icons/icon-*.png` / `assets/img/icon.png` · launch screen `assets/img/launch.webp`, `assets/icons/launch-*.png`.
- **agy is no longer used** for this project. Earlier artwork (café counters, coffee/matcha bars, drink stamps and cup variants, duck baristas) was created before Phase 1 and is kept as-is; `d-icelatte`, `d-hotmatcha`, `d-glassmatcha`, `d-pumpkin`, `d-xmascocoa` and the `d-v-*` vessel images are code recolours/variants of those drink drawings.
- Stickers (except the bean), mood faces, hand-drawn lines and charts: SVG written in code.

## Background audio (CC0 1.0, public domain; commercial use OK, no attribution required)
| File | Source | Author | License |
|---|---|---|---|
| `assets/bgm/music.mp3` (lo-fi loop, 24 s) | https://freesound.org/people/Seth_Makes_Sounds/sounds/587897/ ("lofi.wav") | Seth_Makes_Sounds | CC0 1.0 https://creativecommons.org/publicdomain/zero/1.0/ |
| `assets/bgm/ambience.mp3` (café ambience loop, 58 s) | https://freesound.org/people/Anya_Media/sounds/437461/ ("QUIET CAFE, CHATTER, MILK FROTHING MACHINE") | Anya_Media | CC0 1.0 https://creativecommons.org/publicdomain/zero/1.0/ |

Both were level-matched, made seamless (crossfaded loop seam + 0.5 s wrap padding used by WebAudio loopStart/loopEnd) and re-encoded (music stereo 80 kbps, ambience mono 64 kbps).

## Step ASMR sounds (Freesound, CC0 1.0 — commercial use OK, no attribution required)
| File | Source | Author |
|---|---|---|
| `assets/sfx/grind.mp3` (grinder loop) | https://freesound.org/people/-Hero_of_the_Winds-/sounds/127910/ | -Hero_of_the_Winds- |
| `assets/sfx/froth.mp3` (milk frother loop, also whisk) | https://freesound.org/people/Yuval/sounds/192768/ | Yuval |
| `assets/sfx/clink.mp3` (ice in glass) | https://freesound.org/people/13GPanska_Gorbusinova_Anna/sounds/377995/ | 13GPanska_Gorbusinova_Anna |
| `assets/sfx/quack.mp3` (stamp "ก๊าบ") | https://freesound.org/people/Mikes-MultiMedia/sounds/418509/ | Mikes-MultiMedia |
License for all four: CC0 1.0 https://creativecommons.org/publicdomain/zero/1.0/ (excerpted, looped, level-matched, re-encoded mono 48–64 kbps).

## Sound effects
From the Kenyset free SFX pack (`/workspace/assets/sfx/kenyset/`), re-encoded mono 64 kbps:
tap ← soft-pop-sfx-433612 · blip ← ui-sounds-pack-3-7-359721 · bubble ← bubble-254777 · chime ← new-notification-013-363676 · next ← pop-2-269283 · plop ← creatorshome-plop-333525 · ice ← bubble_pop_1-476367 · pour ← flowing-water-sound-effect-418728 (2.2 s excerpt) · stamp ← happy-message-ping-351298 · oops ← notification-pluck-off-269290

## Fonts
Itim, Mali, Sriracha (Google Fonts, SIL OFL).
