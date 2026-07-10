# OMJ Staging v2 — Client Flags (2026-07-10)

Items needing client (OMJ) input/confirmation before or shortly after launch:

1. **Real stat-band numbers** — the home page's "500,000+ oranges squeezed / thousands of cups served" figures are placeholders written to demonstrate the design; no actual stats were provided. Client to send true counts (or publishable figures) to swap in.
2. **Augillion font license** — the display font file in use is `Augillion-DEMO.ttf` (demo license). Needs a purchased license or a swap before production launch. (The site also registers Carnero W04 Bold via Elementor; we hold that ttf too.)
3. **Eastwood photos need reshoot** — best available files are 640×480; used at capped sizes but visibly softer than the other locations' photos.
4. **Exact floor/spot per mall** — no public info exists for machine placement (site + socials searched). Map popups/cards say mall + city only. Client to provide e.g. "3F, near the cinema lobby" per location.
5. **Hero cup wordmark** — the generated hero cup's stylized "oh my juiceness" script could be misread as "juiceless". Confirm client is happy or regenerate.
6. **Contact form "I want to order online" option** — present in the live form (staging clones it). Confirm whether to keep, since online ordering isn't offered.
7. **About page picture swaps (client-directed)** — the live Elementor about page stays; swap its bottle photo for a cup shot and the vendo render for a real machine photo (assets ready: `build/preview/assets/img/cups/omj-generated-cup-studio.jpg`, `build/preview/assets/img/machine/abaca-machine.jpg`).

## Decisions taken this round (2026-07-10, per Rico)
- Home: franchise "Own an OMJ Machine" section hidden (recoverable via `OMJ:FRANCHISE-HIDDEN` markers); "Questions?" section removed; stat band above the cup section; machine grid → 3-up/1-up gallery carousel; cup carousel captionless 2-up/1-up; FPR checklist says "No Added Preservatives"; near-duplicate Parqal kids shots merged to one slide.
- Map popups: location title + photos + Directions only; short addresses live on the location cards.
- About: keep the live Elementor page (preview rebuilds discarded); pictures to be edited in place.
