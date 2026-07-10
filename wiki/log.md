# Chronological Log

Append-only record of changes, deployments, and key events.

## Log Entries

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
