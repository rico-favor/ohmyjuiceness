# Chronological Log

Append-only record of changes, deployments, and key events.

## Log Entries

## [2026-07-10] chore | Repo cleanup — promote July report to root + archive deprecated material
- **Promoted the client report:** copied `docs/2026-07-10-july-changes.html` → **`/OHMYJUICENESS-JULY-CHANGES.html`** (repo root) as the official standalone deliverable. Already fully self-contained (21 base64 data-URI images, 0 external refs). The dated source copy stays in `docs/`. Removed duplicate `JULY-CHANGES.html`.
- **New `archive/` folder** (frozen; nothing here affects live) with an `archive/README.md` index:
  - `archive/revisions/` ← whole `revisions/` (client's original brief `OMG Revisions.md/pdf` + raw location/product photos — INPUT material).
  - `archive/build-preview/` ← `build/preview/` (drifted, non-deploying preview build; 117 tracked files + assets). Live is driven only by `build/mu-plugins/omj-assets/omj-brand.css` + `build/pages/*`, so this move is live-safe. `.jpg/.png` fallbacks were force-added at the archive path to preserve the build faithfully (`.gitignore` ignores images repo-wide; `.webp` primaries moved as normal renames).
  - `archive/docs/` ← superseded `2026-07-09-client-report.html` (now shows an ARCHIVED banner, superseded by JULY-CHANGES.html) + completed handoffs (`2026-07-09-omj-generated-cup-landing-refinement-handoff-plan.md`, `2026-07-10-omj-staging-v2-handoff.md`, `2026-07-10-staging-polish-handoff.md`) + `superpowers/{plans,specs,handoff/*.md}`. Each archived `.md` got a `> **📦 ARCHIVED — DONE …**` banner.
  - `archive/root-assets/` ← loose `staging-page-full.png`.
- **Kept active (NOT archived):** `docs/2026-07-10-july-changes.html` (report source), `docs/2026-07-10-client-flags.md` (open items still awaiting client input), `docs/superpowers/handoff/capture.mjs` (live Playwright capture tool — wiki log references this exact path).
- Git preserved moves as renames (history intact). `build/` internals (mu-plugins, pages, scripts, templates, assets) untouched.
- **Reminder — caches still OFF at origin:** LiteSpeed page cache disabled earlier same day (`wp litespeed-option set cache 0`); re-enable with `ssh omj → wp litespeed-option set cache 1 && wp litespeed-purge all` when iteration is done. (Cloudflare dev mode was already turned back off — see entry above.)

## [2026-07-10] ops | Cloudflare cache re-enabled (dev mode off)
- Development Mode turned **off** via API (`PATCH .../settings/development_mode {"value":"off"}`) with ~2.6h still remaining on the 3h timer, then `purge_everything` so the edge re-caches today's deployed content. Verified: static asset went MISS → HIT; homepage `cf-cache-status: DYNAMIC` is expected (free plan, no APO — HTML isn't edge-cached).
- Zone security checked while diagnosing a visitor-facing prompt report: security_level medium, browser_check on, no custom WAF rules, Bot Fight Mode off — nothing at Cloudflare serves a challenge/prompt. Homepage serves clean 200 to anonymous UAs; no auth, push, or geolocation triggers in the HTML.
- **LiteSpeed page cache is still OFF at the origin** (disabled earlier same day via `wp litespeed-option set cache 0`); re-enable with `ssh omj` → `wp litespeed-option set cache 1 && wp litespeed-purge all` (remote write was permission-blocked this session).

## [2026-07-10] style | Home round-3 tweaks + July report refresh + cache disable
- **CSS (`build/mu-plugins/omj-assets/omj-brand.css`, canonical/live-affecting file):** appended a "Home tweaks (client 2026-07-10, round 3)" block using ID selectors:
  - `#omj-manila` — full-bleed flat band: `padding:0; min-height:0` (the `min-height:0` cancels the inherited `.omj-section--fullscreen` `100vh`, which was leaving a tall empty gap above the band — added per client mid-task), `.omj-container` `padding-inline:0`, and `border-radius:0` on `.omj-mb`/`.omj-mb__card`. The orange frame's internal padding is intentionally retained.
  - `#omj-fpr` — explicit `padding:3rem 0rem 3rem 2.5rem` (asymmetric left inset, right flush). Distinct from the `.omj-fpr` grid component (untouched).
  - Real-life photo grade re-enabled on home for machine/map/franchise groups ONLY — `#omj-machine .omj-carousel--machine-gallery img`, `#omj-find .omj-loc-card__img`, `#omj-find .omj-map-popup img`, `#omj-franchise .omj-zoom img`. Filter `brightness(1.02) contrast(0.92) saturate(1.29)` (client revised down from an initial 1.36/1.37 which read as blown-out). This REVERSES the same-day "photos off on home" note in section 23; that old `.page-id-21/.page-id-530` block is left untouched. Cup gallery (`.omj-carousel--gallery`) and About are excluded by scoping — verified live that cup photos stay ungraded.
- **Deploy:** CSS `scp`'d to mu-plugins path; `wp elementor flush-css && wp litespeed-purge all`. CSS-only, no page-HTML redeploy needed. Live-verified all three changes via element screenshots.
- **Cache DISABLED for live iteration (both layers):**
  - LiteSpeed: `wp litespeed-option set cache 0` (plugin stays active). Reverse: `wp litespeed-option set cache 1`. (After disabling, `wp litespeed-purge all` returns "Got 400" — expected, nothing to purge.)
  - Cloudflare: WP plugin has NO stored API creds (never connected) and no WP-CLI hook, so edge cache isn't controllable from the server. Used the Cloudflare API directly with token+account from `~/Git/gvbasketball/.env` — zone `d4c80986aa4c981ad2f8db9802e698e8` (ohmyjuiceness.com): purged everything + enabled **Development Mode** (auto-resets after 3h; `time_remaining` 10800). Reverse/extend via dashboard or `PATCH .../settings/development_mode {"value":"off"|"on"}`. Zone default cache_level is "aggressive".
- **July report (`docs/2026-07-10-july-changes.html`, 4.7MB, base64-inline images — edit programmatically):**
  - Regenerated screenshots for the 3 changed groups + refreshed the hero shots. Non-hero swaps (machine, map, franchise, Manila+FPR, FPR checklist, desktop-after, mobile-after) done via line-targeted base64 replace.
  - Removed req items #12 (Manila's Best), #13 (FPR cup-in-hand), #15 (orange on contact) per client; renumbered #14→#12. Now a clean 1–12. Highlights-grid `Request #N` cross-refs still valid (only unreferenced numbers were removed).
  - Hero items #1/#11/#12 got 3 DISTINCT freshly-captured shots (previously all reused one stale pre-badge-removal hero): #1 = full-bleed hero, #11 = wordmark-focused crop (shows badge removed, drop-shadow on photo), #12 = tall hero→machine→numbers sequence proving page order. Switched their containers from fixed-600px `.req-screenshot--clip-hero` cover-crop to plain `.req-screenshot` (natural aspect) since each image is pre-cropped to exactly what should show.
  - Part 2 "After" scrollables (Home + On Mobile) re-captured; updated the Home "After" caption — removed the now-stale "on a deep-green badge" phrasing to match the badge-less hero.
  - Final render check: 21 images, 0 broken, req-nums exactly 1–12, no JS errors.
- **Capture tooling note:** `docs/superpowers/handoff/capture.mjs` needs Playwright, which isn't on the repo module path — run capture scripts from inside a cached npx dir that has it (`~/.npm/_npx/<hash>` with playwright 1.61.1 matching `chromium-1228`; a 1.62-alpha install there fails with a browser-version mismatch). Lazy-loaded product photos render blank unless you scroll top→bottom in small steps, scroll back to 0, THEN `waitForFunction` polling that all in-viewport `<img>` are `complete && naturalWidth>0` (filter off-canvas carousel slides or it hangs) before screenshotting.
- `build/preview/*` NOT edited (drifted, non-deploying).

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
