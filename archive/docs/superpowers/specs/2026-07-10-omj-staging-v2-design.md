> **📦 ARCHIVED — DONE — design spec for the shipped staging v2.**
> Frozen 2026-07-10; see [`archive/README.md`](../README.md). Internal links may be stale.

# OMJ Staging v2 — Design Spec

## Context

The July 9 staging pages (`build/pages/*-staging.html`, deployed at ohmyjuiceness.com/{home,about,contact}-staging/) landed subpar: pixelated padded hero, lost entrance animations, weak emoji-tile "Why OMJ" sections, awkward crops, no carousels/lightboxes. The live site currently shows the **original** design (revert.php was applied). Rico wants a v2 built as **standalone local HTML pages** he can screenshot and interact with before any deployment.

## Locked Decisions

1. **Home = merge**: original home as skeleton (entrance animations, button styles, logo treatment, feel) + staging's real photography & copy; drop brief-removed items (Order Now, Leave a Reply, "Delivered Around the Metro") **and Testimonials**. Fold in all four staging sections: The Cup carousel, Find a Machine, The Machine, By the Numbers + Franchise. Hero H1 = **"Freshly Squeezed. Every Cup. Every Time."** (client-brief headline; the "original feel" comes from motion/buttons/logo, not old copy).

2. **Hero image**: regenerate as a high-res **generated premium cup shot** (OMJ cup + fresh OJ + oranges, brand palette, edge-to-edge full-bleed, no padding, not yellow-washed, ≥1920w), composed to double as the future Veo video poster.

3. **"Fresh. Pure. Refreshing." treatment on BOTH home and about**: original's big animated 3-word headline + checklist design, with staging copy (100% Fresh Oranges · No Water Added · No Added Sugar · Served Fresh · Ready in Under 60 Seconds). **SVG check icons, not emoji.**

4. **About = full recreation** (original about is placeholder template content — fake team, bottle-era imagery). No team section (no real assets). Rule-of-thirds/headroom recrops from raw high-res sources.

5. **Cup carousel**: only the existing 4 generated cup images (`build/assets/generated-cups/`).

6. **Media UX site-wide**: subtle hover zoom (scale 1.05) + click lightbox with prev/next; `prefers-reduced-motion` respected.

7. **Location photos**: conservative saturation/grade passes (ImageMagick) — professional, brand-warm, not fake; **per-location carousels** (Greenhills×2, Uptown×3, Parqal×4(+abaca), Eastwood curated ~6–8); plus an **artistic stylized SVG Metro Manila map** with orange-slice pins linking to the cards.

8. **Contact preview = scraped original live /contact page + IG QR section injected** (pixel-faithful; local copy of its LiteSpeed CSS; form non-submitting locally). Keep `?inquiry=` preselect. Deploy path later = append QR section to live page 21.

9. **Entrance animations**: replicate Elementor vocabulary (fadeIn, fadeInDown, slideInLeft/Right, pulse, staggered, ~550ms ease) via IntersectionObserver.

## Discovered Constraints / Risks

- **Eastwood raws are 640×480 only** (`revisions/omjeastwood/*.jpeg`). Cap at card size (~800w max), curate best; flag to client for reshoot.
- **Augillion font file is `Augillion-DEMO.ttf`** (demo license) served from live uploads; original live site's display font is actually Carnero W04. Previews use Augillion per the locked design spec — flag licensing before final launch.
- Original contact form has an "I want to order online" inquiry option contradicting the no-online-ordering decision — keep as-is (contact is "unchanged"), flag to client.
- Hero generation via `codex exec` gpt-image-2 (**codex-imagegen skill**; codex CLI v0.142.5 present). Prior OpenAI billing limit was hit once — retry/fallback risk.
- Scraped live pages already saved in scratchpad: `live-{home,about,contact}.html` + staging variants (`/private/tmp/claude-501/-Users-rico-Git-ohmyjuiceness/313311ea-4e06-45b0-b314-fdf6561b31dd/scratchpad/`). Re-scrape needs browser UA (site 403s default fetchers).
- `docs/PAGE-STRUCTURE.md` is stale (describes revision as live; it isn't). Trust scrapes.

## File Layout

```
build/preview/
├── home.html · about.html · contact.html      # standalone full pages
└── assets/
    ├── css/omj-brand.css                      # verbatim copy of build/mu-plugins/omj-assets/omj-brand.css (don't fork)
    ├── css/omj-preview.css                    # NEW — sections 13–18 + /* PREVIEW-ONLY */ block
    ├── css/contact-original.css               # downloaded LiteSpeed combined CSS (contact page only)
    ├── js/omj-preview.js                      # animations, carousels, lightbox, nav, ?inquiry= preselect
    ├── fonts/  (Augillion-DEMO.ttf, poppins-{400,500,600}.woff2)
    └── img/    (hero/, cups/, machine/, locations/{greenhills,uptown,parqal,eastwood}/, people/, brand/)
```

**Deploy mapping (kept mechanical, executed later, out of scope now):** page content wrapped in `<!-- OMJ:FRAGMENT-START/END -->` comments → future `build/pages/*-staging.html` fragments; `omj-preview.css` §13–18 append onto omj-brand.css; `/* PREVIEW-ONLY */` block (fonts, chrome, form facsimile) is not ported; img filenames match intended WP media names so upload is a loop + `src` search-replace; `<!-- OMJ:FORM-SLOT -->` marks where `create-staging.php` clones the real Elementor form.

## Page Blueprints

### home.html — 9 sections

**Chrome**: green fixed header (green logo, Home/About/Contact, orange Contact CTA — no Order Now) + footer.

1. **Hero** — full-bleed generated cup `<picture>`, min-h 100vh, H1 "Freshly Squeezed. Every Cup. Every Time." (fadeInDown), staging subhead (fadeIn), **Find a Machine** (primary, pulse-once) + **See More** (ghost → #omj-machine).

2. **Fresh. Pure. Refreshing.** — F.P.R. component, staging checklist copy.

3. **The Machine** (cream) — staging copy; graded machine-vendo-1, machine-parqal, cup-studio; zoom+lightbox.

4. **The Cup carousel** (white) — 4 generated cups; fresh-fruit/catering slides carry the "Fresh Fruit Experiences / Party With Us" teaser copy as captions (absorbs What's-Next section).

5. **By the Numbers** (green band) — stats fadeInUp staggered.

6. **Find a Machine** `#omj-find` (cream) — **SVG map** + 4 loc-cards w/ per-location carousels + existing verified Directions/Maps buttons (from `home-staging.html:90-131`).

7. **Own an OMJ Machine** (white) — real machine photo, Join the Waitlist → `contact.html?inquiry=franchising`.

8. **Questions?** (cream)

9. **Final CTA** (green)

**Checkpoint: screenshot home.html for Rico sign-off before building about/contact.**

### SVG Metro Manila Map

Inline stylized flat-vector (viewBox 760×560): cream bay, white land, soft green boundary strokes, Pasig hint; 4 orange-slice pins (favicon motif) at plausible relative positions (Greenhills/San Juan center-north, Eastwood/QC upper-right, Uptown/Taguig center-south, Parqal/Parañaque lower-left on bay); pins = `<a href="#loc-*">` w/ hover scale 1.15, staggered pop-in, ripple pulse (reduced-motion off); decorative geometry `aria-hidden`, pins labeled.

### about.html — 7 sections

Hero (orange logo, "Fresh Juice, Made Simple") → Our Story (kids photo recrop, slideInRight) → **F.P.R.** → The Experience "No Bottles. No Cartons. Just the Machine." (2-grid graded machines) → Real-photos band (3–4 graded lifestyle shots, lightbox) → Cup carousel (short intro) → Franchise CTA (green).

### contact.html — scraped original + QR

Start from scratchpad `live-contact.html`: localize the LiteSpeed CSS link + font/image URLs enough to render offline-faithfully (keep remaining asset URLs absolute to live where harmless); neutralize form submit (preventDefault + "preview only" notice); inject **Instagram QR section** ("@ohmyjuiceness", ig-qr.jpg ~200px in a cream card, linked, fadeInUp) after the form section; keep/port `?inquiry=` preselect and verify it against the original form's select.

## Shared Components & Styling

### Animations (§13)

`.omj-anim` (opacity 0 + transform, `.55s cubic-bezier(.22,.61,.36,1)`, `--omj-anim-delay`); variants `--fade-in-down/up`, `--slide-in-left/right`, one-shot `--pulse`; `.is-inview` reveals. JS IntersectionObserver (threshold .15, rootMargin -10%), auto-stagger children of `[data-omj-stagger]`; reduced-motion → reveal instantly (plus `?motion=reduce` test hook).

### Carousel (§14)

Scroll-snap track (native touch/swipe), 44px arrow buttons, dots (12px in 44px hit areas), rAF-throttled dot sync, ARIA carousel roles. Used by The Cup + each location card.

### Lightbox (§15)

Single shared overlay `rgba(15,82,48,.92)`, groups via `data-lightbox="greenhills"`, arrow keys, Esc/backdrop close, focus trap + restore, scroll lock, 1600w swaps.

### F.P.R. Component (§16)

2-col grid (stack <768px); 3 words in Augillion `clamp(3rem,8vw,5.5rem)` (orange/green/red-orange) slideInLeft staggered; checklist with inline SVG check-circles slideInRight staggered.

### Metro Map (§17)

(See SVG Metro Manila Map section above.)

### Zoom (§18)

`.omj-zoom img { transition: transform .4s } :hover/:focus-within → scale(1.05)`.

### JavaScript

`omj-preview.js` (~250 lines, IIFE, no deps): initAnimations / initCarousels / initLightbox / initNavToggle / initInquiryPreselect (port from `build/pages/contact-staging.html:48-61`, target `form.omj-form select` with `.elementor-form` fallback).

## Verification

### Testing Matrix

**375px / 768px / 1280px / 1440px × 3 pages** (`preview_screenshot` + `preview_snapshot`):
- Headings, alt text, labels present and correct
- Visual layout matches design intent at each breakpoint

### Interactions

- Carousel next/prev + `scrollLeft` assert + dot sync
- Lightbox open/ArrowRight/Esc/focus-restore
- Anchor scrolls (e.g., hero CTA → #omj-machine)
- Map pin → card
- `contact.html?inquiry=franchising` preselects Franchising
- `?motion=reduce` reveals all `.omj-anim` on load

### Quality Gates

- `preview_console_logs level=error` empty
- `preview_network filter=failed` zero 404s
- `preview_inspect` hero font-family = Augillion, button heights ≥44px
- Verify hero image: ≥1920w; corner-crop variance proves no letterbox; histogram not yellow-uniform (compare vs cup-studio); no AI text gibberish

### Deliverable

Present screenshots to Rico for interactive inspection. (Deployment is a later, separate step.)
