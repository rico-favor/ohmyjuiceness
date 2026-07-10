# Chronological Log

Append-only record of changes, deployments, and key events.

## Log Entries

## [2026-07-10] deploy | July Changes #4 — Premium icons replace generic checkmarks
- Home (page 526, serves `/`): replaced the single `#omj-icon-check-circle` SVG symbol with 5 distinct 24×24 line-art icons in the inline sprite — `#omj-icon-orange` (orange fruit + leaf), `#omj-icon-droplet` (droplet with strike), `#omj-icon-leaf-shield` (leaf-shield), `#omj-icon-cup` (juice cup + straw), `#omj-icon-timer` (stopwatch).
- Each `<li>` in `.omj-fpr__list` now uses its own `<use href="…">` and an SVG modifier class (`.omj-fpr__icon--orange` / `--green` / `--red-orange`) cycling brand vars.
- CSS: added per-icon color modifier rules after `.omj-fpr__list svg`; extended `.omj-fpr--on-green` override to reset all three modifier classes to white.
- Old `#omj-icon-check-circle` removed (confirmed unused elsewhere via grep).
- Files changed: `build/pages/home-staging.html`, `build/mu-plugins/omj-assets/omj-brand.css`, `build/preview/home.html`, `build/preview/assets/css/omj-brand.css`.
- Deployed: CSS → mu-plugins remote path; HTML → `omj_set_page_html(526, …)`; caches flushed (`wp elementor flush-css && wp litespeed-purge all`).


- July report (`docs/2026-07-10-july-changes.html`): Embedded screenshots directly inside 13 out of the 15 request cards under the "Your Original Requests" and "Your Follow-Up Refinements" sections to provide visual proof for each item.
- Base64 embedding: Reused the existing base64-encoded full-page and section screenshots present in the file to keep the report fully self-contained and portable.
- Refined clips & mapping:
  - Fixed Request 1 (Hero Redesign), Request 11 (Logo as Hero), and Request 14 (Machine First, Numbers Second) to show the full Hero section properly (increased clipping height from 180px to 380px).
  - Corrected Request 4 (Premium Icons Instead of Checkmarks) to display the Fresh Pure Refreshing checklist section (containing the green checkmarks) instead of the local values icon.
  - Adjusted Request 8 (Own an OMJ Machine) clipping height to 380px (from 200px) and centered it on the franchise section to display the entire block on mobile.
- Styling: Added `.req-screenshot` CSS styling with clipping masks (e.g. `req-screenshot--clip-hero`, `req-screenshot--clip-checklist`, `req-screenshot--clip-franchise`) to cleanly format and crop the screenshots.

## [2026-07-10] deploy | Round-two refinements (hero wordmark, section restore/reorder, contact icon)
- Home (page 526, serves `/`): hero H1 text replaced with the horizontal orange wordmark (uploads `2025/05/OMJ-Assets_Horizontal-Logo-Orange-cropped-*`) on a solid `--omj-dark-green` badge — orange-on-dark-green measures 4.03:1 (WCAG 1.4.11 ≥3:1; verified by pixel sampling; no translucent scrim passes over the white cup). Hero content bottom-anchored.
- Section order now: hero → Machine → stat band → NEW `#omj-manila` (Manila's Best orange-band/cream-card + FPR checklist paired with the `2025/05/ae14fe38-…-0007.jpg` cup-in-hand graphic, lightbox-enabled) → Cup → Find → Franchise → CTA.
- Contact (page 530, serves `/contact/`): orange icon (`2025/04/OMJ-Assets_Icon-Orange-BG-300x300.png`) restored as `.omj-igqr__brandmark` at the top of the IGQR fragment; applied via new `build/scripts/update-contact-fragment.php` (targeted text-editor widget replace — do NOT rerun `create-staging.php`, it looks up retired staging slugs).
- CSS: `omj-brand.css` section 25 (hero logo badge, `.omj-mb`, `.omj-fpr--media` + its own <768px 1-col rule since section 16's mobile override loses the cascade).
- Backups on server: `~/omj-526-elementor-bak-2026-07-10.json`, `~/omj-530-elementor-bak-2026-07-10.json`, `~/omj-brand.css.bak-2026-07-10` (`wp db export` fails on this host — exits 255 at bootstrap).
- July report refreshed: Round Two section (requests 11–15), placeholder-stats flag (client to supply real numbers), re-captured live screenshots (capture note: pass `?motion=reduce` and scroll slowly or IO reveals/lazy images render blank).
- `build/preview/` NOT updated this round (drifted; canonical sources are `build/pages/*-staging.html` + mu-plugin CSS).

## [2026-07-10] update | Branded Photo Filters (Home & Contact pages)
- Applied CSS-based photo filters to all real-life photos (hero banner, grid/process images, location cards, popup carousels) scoped strictly to the Home and Contact pages (both live and staging WordPress page IDs and local preview).
- Filter specifications: `brightness(136%) contrast(92%) saturate(137%)`.
- Modified `build/mu-plugins/omj-assets/omj-brand.css`, `build/preview/assets/css/omj-brand.css`, and `build/preview/assets/css/omj-preview.css`.
- Updated `build/preview/home.html` body element with `class="home page-id-35"` to enable local preview page scoping.
- Deployed branding styles to production server and flushed Elementor and LiteSpeed Cache.

## [2026-07-10] update | Staging v2 preview: revision batches 2–3, About rebuild
**Preview pages (`build/preview/`):**
- Revision batch 2: cup carousel containment, map popup location detail + autoPan, slimmed location cards with Open in Maps and 44x44 focus button.
- Revision batch 3: franchise section hidden via markers, "No Added Preservatives", 3-up/1-up gallery carousel, captionless 2-up cup carousel, stat band moved above cups, popup Directions.
- About v2/v3: rebuilt pegged to live `/about` but discarded by client (retained only cup/real machine photo swap).

## [2026-07-10] asset | OMJ clear cup hero asset
**Generated asset:**
- Created a new premium landscape product image for future OMJ hero/marketing use:
  - `build/assets/generated-cups/omj-generated-clear-cup-hero.png`
  - `build/assets/generated-cups/omj-generated-clear-cup-hero.jpg`
  - `build/assets/generated-cups/omj-generated-clear-cup-hero.webp`
- Prompt targeted a clear OMJ-inspired branded cup with fresh orange juice, condensation, oranges/leaves around the base, cream-to-warm-orange backdrop, and a darker lower third for white text overlays.
- Output dimensions: 1536×1024.

## [2026-07-09] init | Repository initialized
- Created local git repo with SSH config, AGENTS.md, and build scaffolding.
- SSH alias `omj` added to `~/.ssh/config` (same Hostinger account as `gvweb`).
- Verified live site: vanilla WordPress 7.0, Hello Elementor, Elementor Pro, standard plugin set.
- No changes made to the live site in this session.

## [2026-07-09] deploy | Full website revision (10-point client brief)
**Deployed:**
- `omj-brand.php` + `omj-build.php` mu-plugins (activated on live server)
- `omj-brand.css` design system: blend palette (`--omj-orange` #FF8E06, `--omj-green` #167A45, `--omj-red-orange` #E24F14, `--omj-dark-green` #0F5230, `--omj-cream` #F7F5E9), component classes (hero, buttons, icon tiles, stat band, location grid)
- Elementor Kit ID 9: accent green reconciled from #2D8762 → #167A45
- Home page (ID 35) — Flow A, 10 sections.
- About page (ID 25) rebuilt.
- Contact page (ID 21) Eastwood location and franchise preselect script.
- Header (ID 79) and Footer (ID 241) templates updated.
- Processed 27 location/product photos.
- Removed old/deprecated content (Order Now button, Coming After Summer popup, bottle imagery).
- Key finding: Elementor 4.1.4 HTML widget renders empty. Workaround: use `text-editor` widget type.

## [2026-07-09] deploy | Staging-only revision rebuild
**Staging only:**
- Created staging pages `/home-staging/` (ID 526), `/about-staging/` (ID 528), `/contact-staging/` (ID 530).
- Backups created: `~/omj-backup-2026-07-09-1159.sql` and `~/omj-muplugins-2026-07-09-1159.tgz`.
- Added preview files in `build/pages/`.
- Created deployment helper script `build/scripts/create-staging.php`.

## [2026-07-09] update | Staging cup imagery refinement
**Staging only:**
- Generated 4 premium cup/fresh-fruit concept assets to replace technical/spec-sheet imagery.
- Imported generated assets to WordPress Media: IDs 552-555.
- Updated `/home-staging/` and `/about-staging/` layouts to use these.
- Refined `omj-brand.css` for mobile overflow, outlines, and smooth transitions.
