> **📦 ARCHIVED — DONE (2026-07-10) — staging v2 built, deployed, and verified.**
> Frozen 2026-07-10; see [`archive/README.md`](../README.md). Internal links may be stale.

# OMJ Staging v2 — Handoff to Next Agent (2026-07-10)

You are picking up mid-implementation of the ohmyjuiceness.com "staging v2" revision. Read this fully before acting. The immediate trigger: a `codex exec` **gpt-5.6-sol revision batch is finishing** (or just finished) — your first job is to verify it, then continue the pending queue below.

**Durable copies** of the tmp-dir artifacts referenced below live in `docs/superpowers/handoff/`: `codex-home-fixbatch2-prompt.md` (the in-flight sol batch), `codex-about-prompt.md` (next codex job), `global-constraints.md` (per-task constraints given to every implementer), `capture.mjs` (Playwright QA script). Prefer these if the `/private/tmp/...` paths are gone.

## 1. What this project is

Three standalone preview pages in `build/preview/` (home.html, about.html, contact.html) that Rico screenshots/inspects locally BEFORE deploying to the live WP site's staging slugs (`ohmyjuiceness.com/{home,about,contact}-staging/`). The live site currently shows the ORIGINAL design (a revert was applied server-side via `build/scripts/revert.php`).

Authoritative docs:
- Approved plan: `/Users/rico/.claude/plans/you-are-working-on-keen-ember.md`
- Spec: `docs/superpowers/specs/2026-07-10-omj-staging-v2-design.md` (commit d8e5e5e)
- Progress ledger: `.superpowers/sdd/progress.md`
- Prior plan-phase docs: `docs/superpowers/specs/2026-07-09-omj-revisions-design.md` (client-locked decisions), `docs/2026-07-09-client-report.html`

## 2. Locked decisions (user-confirmed — do not relitigate)

1. **Home = merge**: original site's feel (entrance animations, chunky buttons, logo) + staging's product-first structure & real photos. Testimonials dropped. Hero H1 = "Freshly Squeezed. Every Cup. Every Time."
2. Hero image = generated premium cup shot (done, committed).
3. "Fresh. Pure. Refreshing." animated treatment on BOTH home and about, with staging checklist copy, SVG icons (no emoji anywhere).
4. About = full recreation (original about is placeholder template content w/ fake team — never reproduce it). No team section.
5. Cup carousel = ONLY the 4 existing generated cups (`build/preview/assets/img/cups/`). Rico explicitly likes the carousel + generated cups.
6. Media UX site-wide: hover zoom 1.05 + lightbox with prev/next; prefers-reduced-motion + `?motion=reduce` test hook.
7. Location photos: graded (done), per-location carousels (done); map = **interactive Leaflet** (user rejected the earlier SVG map as "awkward"; Google Maps only if an API key is provided — none available, CARTO/OSM tiles in use).
8. Contact = scraped original live page + IG QR section; form neutralized locally; deploy = append QR block (between `<!-- OMJ:IGQR-START/END -->`) to live page ID 21.
9. **Delegation directive (memory: `codex-cli-delegation-tiers`)**: HTML/components + images go to **codex CLI**, NOT Claude subagents: `gpt-5.6-sol`≈Opus (heavy design), `gpt-5.6-terra`≈Sonnet (default), `gpt-5.6-luna`=cheap mechanical; images via codex imagegen `-m gpt-5.5`. Claude (you) = orchestrator + screenshot QA + requirements control. Pattern: write prompt file → `codex exec --sandbox workspace-write -m <tier> --output-last-message <result.txt> "$(cat prompt.md)"` (run via Bash background). Always pass `-m` (config default model is unsupported).
10. Work directly on `main`; commit per task with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`; images under `build/preview/assets/img/**` ARE committed (scoped .gitignore exception exists).

## 3. State: done & committed

| Commit | What |
|---|---|
| d8e5e5e | Design spec doc |
| 2b735ba | `build/preview/` scaffold; fonts (Augillion-DEMO.ttf, poppins-{400,500,600}.woff2); `assets/css/{omj-brand.css copy, contact-original.css, home-original-reference.css}`; logos/QR/cups copied |
| 4f9c667 | Image pipeline: rule-of-thirds recrops + brand grade + derivatives (script `build/scripts/process-preview-images.sh`, log `build/preview/assets/img/CROPS.md`); .gitignore exception `!build/preview/assets/img/**` |
| 93269db | `assets/css/omj-preview.css` (§13–18: anims/carousel/lightbox/FPR/zoom + PREVIEW-ONLY chrome) + `assets/js/omj-preview.js` (IO anims, carousels, lightbox w/ focus trap, nav, `?inquiry=` preselect). Contracts: `.omj-anim--{fade-in,fade-in-down,fade-in-up,slide-in-left,slide-in-right,pulse}`, `[data-omj-stagger]`, `[data-omj-carousel="Label"]`, `[data-lightbox="group"]`, `.omj-zoom` |
| e90b27e | Generated hero (`assets/img/hero/omj-hero-cup*.{jpg,webp}` 1920/1280/768) + (now unused) SVG map partial |
| efcce00 | home.html v1 (9 sections) |
| 8d991d8 | Home fix batch 1 (codex sol): original-style buttons, Leaflet map + citrus divIcon pins + popup carousels, hero scrim, real machine photos (abaca/parqal graded into `assets/img/machine/`), cup-carousel height cap, orange logo in chrome, font fixes in contact-original.css |
| 457486a | contact.html from scraped original + IG QR + fixes (see §5 research: cfemail, elementor-invisible, Eastwood swap) |
| d5c1b20 | Contact IG QR section rebuilt (A/B: claude-CLI-opus variant won) |

## 4. IN FLIGHT right now

**Codex gpt-5.6-sol revision batch 2** — prompt: `/private/tmp/claude-501/-Users-rico-Git-ohmyjuiceness/313311ea-4e06-45b0-b314-fdf6561b31dd/scratchpad/sdd/codex-home-fixbatch2-prompt.md`, result lands at `.../codex-home-fixbatch2-result.txt` (same dir). It is applying Rico's latest feedback:
- **Fix A**: cups carousel must show the FULL cup with headroom (object-fit contain + cream backdrop, not cover-crop).
- **Fix B**: map popup rework — Directions button text was rendering BLUE (Leaflet default link color; must be white-on-green, high specificity), popup top/title was clipping (autoPanPaddingTopLeft ~ L.point(24,72)), add per-location detail lines (VERBATIM strings in the prompt and §5.7 below) + italic "Look for the bright orange machine!", expose `window.OMJMap.focus(key)` → flyTo(latlng,16) + openPopup.
- **Fix C**: location cards — remove "Directions" button (keep "Open in Maps"), add one-line minimal address under names (short strings in §5.7), add 44×44 circular icon button calling `OMJMap.focus('{key}')` + smooth-scroll `#omj-map-live` into view.

**YOUR FIRST ACTIONS**: read the result.txt; screenshot-verify (see §6 tooling): cup slides show whole cup; popup title + white button text visible; card icon zooms map; no console errors; then COMMIT (message style: `fix: map popup details, cup carousel headroom, minimal location cards`).

## 5. Research findings (hard-won — trust these)

1. **Original button DNA** (extracted from `assets/css/home-original-reference.css`, widget rules `.elementor-element-121c36e/bf0d34c`): Poppins 700, `line-height:1em`, `letter-spacing:1px`, `border-radius:15px`, flat brand colors, **hard offset shadow `2px 5px 0 0 <color>`, hover `2px 6px`**, uppercase labels. Implemented in omj-preview.css §19 (primary orange w/ #0F5230 shadow; green #167A45; ghost white-border). Rico loves these — don't regress.
2. **Fonts**: original display font = **Carnero W04 Bold** (`assets/fonts/Carnero-W04-Bold.ttf`, downloaded); Augillion is DEMO-licensed (client flag). **Poppins is broken on the LIVE site** — its @font-face URLs point at dead dev domain `oh-my-juiceness.local`. In `contact-original.css` I stripped those blocks and appended local Poppins 400/500/600. Cross-origin font loads from ohmyjuiceness.com CORS-fail on localhost — always self-host.
3. **Scrape gotchas** (contact.html): (a) Cloudflare email obfuscation — real address decodes to `contactus@ohmyjuiceness.com` (XOR-decoded from data-cfemail); (b) `.elementor-invisible{visibility:hidden}` is removed by Elementor JS we stripped — contact.html has an inline IO reveal shim replicating `_animation` from data-settings; (c) live site 403s non-browser UAs — always curl with a Chrome UA string.
4. **Eastwood location corrected**: original contact listed "San Antonio Plaza, Makati" — brief replaced it with Eastwood; contact.html says "Eastwood Mall, Quezon City".
5. **Eastwood photos are 640×480 max** (never upscale past 800w). Client flag: needs reshoot.
6. **Map**: Leaflet 1.9.4 vendored `assets/vendor/leaflet/`; tiles = CARTO Voyager (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`, subdomains 'abcd', OSM+CARTO attribution) — brand-warm, user called it "brilliant". Coords: Greenhills 14.6015643,121.0515546 · Eastwood 14.6105509,121.0799139 · Uptown 14.5564554,121.0542316 · Parqal 14.5266712,120.989381. scrollWheelZoom OFF.
7. **Location details**: NO public floor-level info exists (web search exhausted; site/socials silent). Verbatim popup lines: Greenhills "Greenhills Shopping Center, Ortigas Ave., San Juan City" · Eastwood "Eastwood Mall, 116 Eastwood Ave., Bagumbayan, Quezon City" · Uptown "Uptown Mall, 9th Ave. cor. 36th St., Bonifacio Global City, Taguig" · Parqal "Parqal Mall — Abaca Building, D. Macapagal Blvd., Aseana City, Parañaque" (Abaca verified from client's own photo filenames). Card short lines: "Greenhills Shopping Center, San Juan" / "Eastwood Mall, Quezon City" / "Uptown Mall, BGC, Taguig" / "Parqal Mall (Abaca Bldg.), Parañaque". **Client flag: exact floor/spot per mall.**
8. **Hero cup wordmark**: generated hero's cup shows a stylized "oh my juiceness" — verify with client it doesn't read "juiceless".
9. **codex quirks**: default model in config unsupported (always `-m`); imagegen refs `-i` must come AFTER the prompt and not with `--sandbox read-only`; codex leaves stray versioned copies in build/assets/generated-cups/ (untracked leftovers `omj-generated-clear-cup-hero.webp`, `omj-generated-cup-hero-landscape-v3.webp` — ignore or clean).
10. **A/B experiment precedent**: for the contact QR section Rico had me compare my direct fix vs `claude -p --model opus --dangerously-skip-permissions` (claude CLI = separate token pool); opus variant won on spacing. He may ask for this pattern again.

## 6. Verification tooling (screenshots)

The in-IDE preview pane was unreliable (tiny window). Use **headless Playwright** instead:
- Serve: `python3 -m http.server 8792 --directory build/preview` (background).
- Capture script (scrolls to trigger IO reveals, collects console errors, full-page shot): `/private/tmp/claude-501/-Users-rico-Git-ohmyjuiceness/313311ea-4e06-45b0-b314-fdf6561b31dd/scratchpad/shots/capture.mjs` (playwright npm-installed in that dir; recreate if tmp was wiped — ~40 lines, scroll loop then `fullPage` screenshot + stats JSON).
- Known capture artifacts (NOT bugs): lazy images in horizontal carousel tracks only load when swiped near; full-page shots can catch images mid-load — assert `naturalWidth>0` after scroll+wait before declaring a bug.
- View screenshots with the Read tool; you are the visual QA gate. Check at 1280 AND 375 wide.

## 7. Pending queue (in order)

1. **Verify + commit sol batch 2** (§4).
2. **Rebuild about.html via codex terra** — prompt READY at `.../scratchpad/sdd/codex-about-prompt.md` (same tmp dir; if tmp wiped, reconstruct from spec §"about blueprint": 7 sections — hero w/ orange logo + "Fresh Juice, Made Simple"; Our Story 2-col w/ kids photo; FPR block copied from home; The Experience 2-grid machine photos; Real-photos 4-tile mosaic; cup carousel copy of home's; green franchise CTA → contact.html?inquiry=franchising). IMPORTANT: it copies home.html's cup-carousel + FPR blocks — run only AFTER sol batch 2 is committed so it clones the fixed pattern. Then screenshot-QA + commit.
3. **Full verification matrix** (all 3 pages × 375/768/1280/1440): interactions (carousel arrows/dots/swipe, lightbox open/arrows/Esc/focus-restore, map popups + OMJMap.focus, anchors, `contact.html?inquiry=franchising` preselect, `?motion=reduce`), zero console errors, zero failed local requests, no horizontal scroll. Fix-loop via codex luna/terra for anything found.
4. **Docs**: update PROJECT_LOG.md (it has uncommitted edits from before — review `git diff PROJECT_LOG.md`); finalize CROPS.md if needed; write client-flags list (Augillion license, Eastwood reshoot, floor/spot info needed, hero wordmark check, "I want to order online" option still in contact form).
5. **Deploy to live WP staging slugs** + verify live. Deploy mapping:
   - Upload new images to WP media (names in MANIFEST.md pattern; loop like `build/assets/photos/MANIFEST.md` documents; use wp-cli via SSH — creds in `.env`, see `build/scripts/create-staging.php` + `docs/LIVE-SITE-CONFIG.md`).
   - Port fragments: content between `<!-- OMJ:FRAGMENT-START/END -->` in home/about → `build/pages/{home,about}-staging.html` with `src` search-replace `assets/img/...` → `/wp-content/uploads/2026/07/...`; append omj-preview.css §13+ onto `build/mu-plugins/omj-assets/omj-brand.css` deploy copy (PREVIEW-ONLY block stays out); ship omj-preview.js + omj-map.js + vendored leaflet as enqueued assets (extend `omj-brand.php` mu-plugin) — NOTE: leaflet css/js and map init are new to the WP side; plan enqueues before porting.
   - Contact: deploy = insert the OMJ:IGQR block into live page 21 (create-staging.php clones the real form into contact-staging; the preview's neutralized form is NOT deployed).
   - After deploy: screenshot the live staging URLs (curl UA caveat) + spot-check interactions; purge LiteSpeed cache (`wp litespeed-purge all` or per LIVE-SITE-CONFIG.md).
6. **Ledger + report**: append to `.superpowers/sdd/progress.md` as you complete steps; final summary to Rico with client-flags list.

## 8. Behavioral notes for working with Rico

- He inspects screenshots himself — always show, and lead with what changed.
- He interrupts with taste feedback mid-flight; fold it in as revision batches (he likes batch-style "fix batch" commits).
- Be frank about what's subpar; he rewards honest quality control.
- Progress updates "from time to time" — short, concrete, commit-anchored.
- Don't regenerate what's already approved (hero, grading, buttons, map tiles, QR section).
