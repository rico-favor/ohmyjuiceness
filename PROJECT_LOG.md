# Oh My Juiceness — Website Build Log & Runbook

Live site: **https://ohmyjuiceness.com** — a WordPress + Elementor website on Hostinger.

This document is the source of truth for how the site is built and how to change it. The actual
custom source lives in [`build/`](build/) (also deployed to the live server's `wp-content/`).

---

## 1. Hosting & access

| Thing | Value |
|---|---|
| Platform | Hostinger Premium (shared) — same account as gvbasketball |
| WordPress | 7.0 · PHP 8.2 |
| Theme | Hello Elementor 3.4.4 (active) |
| Page builder | **Elementor 4.1.4 + Elementor Pro 3.29.2** |
| SSH alias | `omj` (user `u907133977`) |
| WP root | `/home/u907133977/domains/ohmyjuiceness.com/public_html` |
| Origin IP | `37.44.245.74` |

All work is done over SSH + WP-CLI. Secrets live in the local `.env` (gitignored).

---

## 2. Active plugins

| Plugin | Version | Status |
|---|---|---|
| Akismet | 5.7 | active |
| Cloudflare | 4.14.3 | active |
| Conditional Fields for Elementor Form | 1.7.2 | inactive |
| Duplicate Page | 4.5.9 | active |
| Elementor | 4.1.4 | active |
| Elementor Pro | 3.29.2 | active (update available: 4.1.2) |
| Google Site Kit | 1.181.0 | active |
| Hostinger | 3.0.70 | active |
| Hostinger Easy Onboarding | 2.1.29 | active |
| LiteSpeed Cache | 7.8.1 | active |
| Post SMTP | 3.9.5 | active |
| Site Reviews | 8.0.12 | active |
| UpdraftPlus | 1.26.5 | active |
| Wordfence | 8.2.2 | active |

---

## 3. Architecture (to be built)

The front end will follow the same pattern as gvbasketball: **hand-crafted HTML + a shared CSS
design system**, mounted inside Elementor so pages stay Elementor-native. Must-use plugins:

- **`wp-content/mu-plugins/omj-brand.php`** → enqueues the design system CSS site-wide
- **`wp-content/mu-plugins/omj-build.php`** → build helpers (page/theme-part setters)
- Additional mu-plugins as needed for forms, email branding, etc.

---

## 4. Changelog

### 2026-07-10 — Branded Photo Filters (Home & Contact pages)

- Applied CSS-based photo filters to all real-life photos (hero banner, grid/process images, location cards, popup carousels) scoped strictly to the Home and Contact pages (both live and staging WordPress page IDs and local preview).
- Filter specifications: `brightness(136%) contrast(92%) saturate(137%)`.
- Modified `build/mu-plugins/omj-assets/omj-brand.css`, `build/preview/assets/css/omj-brand.css`, and `build/preview/assets/css/omj-preview.css`.
- Updated `build/preview/home.html` body element with `class="home page-id-35"` to enable local preview page scoping.
- Deployed branding styles to production server and flushed Elementor and LiteSpeed Cache.

### 2026-07-10 — Staging v2 preview: revision batches 2–3, About rebuild

**Preview pages (`build/preview/`, not yet deployed):**
- `e27245a` — Revision batch 2 (codex sol + orchestrator QA): cup carousel shows the full cup (contain on cream), map popups gained per-location detail + autoPan fixes, location cards slimmed to name + short address + "Open in Maps" + a 44×44 map-focus button (`OMJMap.focus`). Orchestrator fixed two popup-clipping bugs (open after `flyTo` `moveend`; `popup.update()` after carousel injection).
- `fb189a6` — about.html v1 (codex terra, 7 sections) — superseded same-day by client feedback.
- `ba53931` — Revision batch 3 (codex sol, client feedback round 3): franchise section hidden behind `OMJ:FRANCHISE-HIDDEN` markers, "No Added Sugar" → "No Added Preservatives", balanced FPR gutters, machine grid → 3-up/1-up gallery carousel over all real photos (new `data-omj-per-view` carousel support), captionless 2-up cup carousel, stat band moved above cups, popup = title + photos + Directions, "Questions?" section removed, duplicate Parqal kids slide merged out.
- About v2/v3 (`9456c6b`, `e3204ab`): rebuilt pegged to the live `/about`, then restyled to the client's reference screenshot (oval-masked cup, orange display headings, sticker icon). **Discarded same-day by client decision: the live Elementor about page stays as-is; only its pictures will be swapped (bottle → cup, vendo render → real machine photo). About is excluded from staging deploy.** Preview work remains in git history.

### 2026-07-10 — OMJ clear cup hero asset

**Generated asset:**
- Created a new premium landscape product image for future OMJ hero/marketing use:
  - `build/assets/generated-cups/omj-generated-clear-cup-hero.png`
  - `build/assets/generated-cups/omj-generated-clear-cup-hero.jpg`
  - `build/assets/generated-cups/omj-generated-clear-cup-hero.webp`
- Prompt targeted a clear OMJ-inspired branded cup with fresh orange juice, condensation, oranges/leaves around the base, cream-to-warm-orange backdrop, and a darker lower third for white text overlays.
- Output dimensions: 1536×1024.

### 2026-07-09 — Repository initialized
- Created local git repo with SSH config, AGENTS.md, and build scaffolding.
- SSH alias `omj` added to `~/.ssh/config` (same Hostinger account as `gvweb`).
- Verified live site: vanilla WordPress 7.0, Hello Elementor, Elementor Pro, standard plugin set.
- No changes made to the live site in this session.

### 2026-07-09 — Full website revision (10-point client brief)

**Deployed:**
- `omj-brand.php` + `omj-build.php` mu-plugins (activated on live server)
- `omj-brand.css` design system: blend palette (`--omj-orange` #FF8E06, `--omj-green` #167A45, `--omj-red-orange` #E24F14, `--omj-dark-green` #0F5230, `--omj-cream` #F7F5E9), component classes (hero, buttons, icon tiles, stat band, location grid)
- Elementor Kit ID 9: accent green reconciled from #2D8762 → #167A45

**Home page (ID 35) — Flow A, 10 sections:**
1. Hero — full-bleed video (poster fallback) with headline "Freshly Squeezed. Every Cup. Every Time."
2. The Machine — oranges → squeezing → cup photo grid
3. Why OMJ — 5 emoji icon tiles (100% Fresh Oranges, No Water Added, No Added Sugar, Served Fresh, Ready in Under 60 Seconds)
4. Product showcase — machine-only + lifestyle crops
5. By the Numbers — green stat band (500,000+ oranges, thousands of cups, multiple locations, 100% fresh)
6. Find a Machine — 4 location cards with verified Google Maps links (Greenhills, Eastwood, Uptown BGC, Parqal)
7. What's Next — fresh-fruit teaser (Fruitty Dippy / fruit cups / catering)
8. Own an OMJ Machine — franchise CTA → /contact/?inquiry=franchising
9. Questions? — contact CTA
10. Final CTA — "Ready for Real Orange Juice?"

**About page (ID 25):** Rebuilt — no bottle image, scannable Why OMJ bullets, one-line origin, franchise relabeled "Own an OMJ Machine"
**Contact page (ID 21):** Locations fixed (Eastwood replaces San Antonio), franchising preselect script added
**Header (ID 79):** Green bar, logo, nav, "Contact Us" CTA — no "Order Now"
**Footer (ID 241):** Green footer, @ohmyjuiceness IG, "© 2026 Oh My Juiceness. All Rights Reserved."

**Photos processed:** 27 location/product photos (auto-oriented, resized to ≤1600px, uploaded to WP media)
**Hero deliverable:** Veo prompt + source image + poster fallback (client to supply video)
**Maps links:** Verified for all 4 locations (mall-level pins)
**Old content removed:** "Order Now" button, "Leave a Reply" form, "Coming After Summer" popup, bottle imagery, "Delivered Around the Metro" claim
**Elementor fix:** HTML widget rendering issue resolved by switching to text-editor widget type

**Key finding:** Elementor 4.1.4 HTML widget (`widgetType: html`) renders empty on frontend. Workaround: use `text-editor` widget with `editor` setting key. Updated `omj-build.php` accordingly.

### 2026-07-09 — Staging-only revision rebuild

**Client constraint:** Do not replace the live Home page directly. Recreate the revision work on staging preview slugs.

**Backups created before WordPress writes:**
- `~/omj-backup-2026-07-09-1159.sql`
- `~/omj-muplugins-2026-07-09-1159.tgz`

**Created/updated staging pages only:**
- `/home-staging/` (page ID 526)
- `/about-staging/` (page ID 528)
- `/contact-staging/` (page ID 530)

**Implementation notes:**
- Added `build/pages/home-staging.html`, `build/pages/about-staging.html`, and `build/pages/contact-staging.html`.
- Added `build/scripts/create-staging.php`, which deploys staging page body HTML only and does not update live page IDs 35, 25, or 21. Header/footer are intentionally not hard-coded because Elementor Theme Builder owns the site chrome.
- Used supplied client images as-is (auto-oriented/resized for web, not cropped) and uploaded WordPress media IDs 516-525.
- Added CSS-only image treatment for visual consistency: shared 8px radius, subtle shadow, stable aspect ratios, and object-fit cropping for image grids/location cards.
- Moved staging image presentation out of inline styles where practical: the hero uses `.omj-hero__poster`, page icons use `.omj-page-icon`, and contact staging links stay inside `/contact-staging/`.
- Hid the default Hello Elementor page title on staging page IDs 526, 528, and 530 so the preview starts with the intended page content beneath the Elementor header.
- Processed/minified staging images are in `build/assets/omj-revision/`; selected live-uploaded files range from 60K to 372K after resizing/compression.
- Updated `docs/2026-07-09-client-report.html` as a staging review report.

### 2026-07-09 — Staging cup imagery refinement

**Staging only:**
- Generated 4 premium cup/fresh-fruit concept assets to replace visible technical cup/spec-sheet imagery on `/home-staging/`.
- Imported generated assets to WordPress Media:
  - `omj-generated-catering-cups.jpg` → ID 552
  - `omj-generated-cup-oranges.jpg` → ID 553
  - `omj-generated-cup-studio.jpg` → ID 554
  - `omj-generated-fresh-fruit-cup.jpg` → ID 555
- Updated `build/pages/home-staging.html`:
  - Machine grid now ends with generated cup photography instead of `cup-design-staging.jpg`.
  - Product section retitled to "The Cup" and uses generated cup imagery.
  - "What's Next" uses generated fresh fruit/catering product imagery instead of a technical preview card.
- Updated `build/pages/about-staging.html` to remove the staging cup-design image.
- Removed inherited page-level header/footer markup from staging page HTML so Elementor theme parts own header/footer rendering.
- Refined `omj-brand.css` for stable image aspect ratios, lighter hover states, focus-visible outlines, mobile overflow protection, and `prefers-reduced-motion`.

**Operational notes:**
- OpenAI Image API CLI attempt was blocked by account billing hard limit; fallback session image generation produced filesystem assets under `~/.codex/generated_images/019f46de-1b30-71d0-9201-500652fce7c0/`, then optimized JPG/WebP copies were saved in `build/assets/generated-cups/`.
- Backup taken before media import: `~/omj-backup-2026-07-09-1245.sql` and `~/omj-muplugins-2026-07-09-1245.tgz`.
