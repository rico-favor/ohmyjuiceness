> **📦 ARCHIVED — DONE (2026-07-10) — live polish pass complete.**
> Frozen 2026-07-10; see [`archive/README.md`](../README.md). Internal links may be stale.

# OMJ Staging v2 — Live Polish Pass Handoff (2026-07-10)

You are picking up a **live-staging polish pass** on ohmyjuiceness.com. The staging v2 deploy is DONE and verified working (see §2). Your job is a focused visual-defect pass on the two live staging pages, driven by Rico's punch list in §1. You fix ON THE LIVE SERVER (mu-plugin CSS and/or page JSON), keep the repo copies in sync, and verify with screenshots.

## 1. Rico's punch list (verbatim intent — this is the work)

1. **Extra padding around images** — "maybe Elementor-enforced". Force `padding: 0` where it appears, **especially the hero**: the hero must be truly full-bleed, edge-to-edge, like the local preview (`build/preview/home.html`). On staging it renders inside Elementor wrappers that add gutters.
2. **Pink/red borders** on some images, on carousel icons/arrows/dots, and on buttons — remove them. (Confirmed visible in my final capture: thin pink outlines around machine-gallery tiles, cup slides, dots row, and the hero buttons. Screenshot: `final3-home-1280.png` in the QA shots dir, §6.)
3. **contact-staging has stray issues** — review https://ohmyjuiceness.com/contact-staging/ and clean it up. Known strays I can already point to:
   - The text section above the form is **left over from the previous round**: it uses **emoji icon tiles** (`.omj-icon-tile__emoji` — 🍊💧🚫⚡), which violate the project's hard no-emoji rule (inline SVG only), and its content overlaps/duplicates what the current design says elsewhere. Source file: `build/pages/contact-staging.html` (everything above the `<!-- OMJ:IGQR-START -->` block is old-round content).
   - Check spacing between the old text section, the IGQR block, and the cloned form; check heading fonts render (Carnero is registered live via Elementor custom fonts; Augillion/Poppins are self-hosted in the mu-plugin CSS).

## 2. What is deployed and where (state as of commit `49c5b75`)

| Thing | Where |
|---|---|
| Staging pages | Home = **page 526** (`/home-staging/`), Contact = **page 530** (`/contact-staging/`). About-staging (528) is ABANDONED — do not touch; Rico keeps the live Elementor About page. Never touch live pages 35/25/21. |
| Page content mechanism | Elementor `text-editor` widget holding raw HTML (HTML widget renders empty on Elementor 4.1.4 — known bug). Built by helpers in `wp-content/mu-plugins/omj-build.php` (`omj_set_page_html`). |
| Page HTML sources (repo) | `build/pages/home-staging.html`, `build/pages/contact-staging.html`. Server copies in `~/omj-staging-pages/` (SSH). Update scripts already on server: `~/update-home-staging.php`, `~/update-contact-staging.php` — run with `wp eval-file` from the WP root. |
| CSS | `wp-content/mu-plugins/omj-assets/omj-brand.css` = design system (sections 1–12) + staging interaction layer (sections 13–22) + self-hosted @font-face block (Augillion + Poppins). Repo copy: `build/mu-plugins/omj-assets/omj-brand.css` — **byte-identical to server right now; keep it that way** (edit locally, `scp` up). |
| JS | `wp-content/mu-plugins/omj-assets/{omj-preview.js, omj-map.js, leaflet/}` — enqueued by `omj-brand.php` on pages 526/530 (leaflet+map on 526 only). omj-map.js on the server uses absolute `/wp-content/uploads/2026/07/v2-*` image URLs (repo deploy copy: `build/mu-plugins/omj-assets/omj-map.js`). |
| Images | 84 files in WP media as `/wp-content/uploads/2026/07/v2-<basename>` (jpg+webp+`-800` variants). |
| SSH / WP root | alias `omj`, root `/home/u907133977/domains/ohmyjuiceness.com/public_html`. wp-cli available. |

## 3. Likely root causes (leads, verify in devtools before fixing)

- **Padding**: `create-staging.php`'s `omj_stage_text_section()` builds the wrapping Elementor section with `'settings' => []` → default **boxed** layout: `.elementor-section-boxed .elementor-container { max-width: <kit width> }` plus default column/widget gaps (`.elementor-widget-wrap { padding: 10px }` era styles / `--e-column-margin`). That's what's constraining the hero and padding images. Two fix options:
  a. **Scoped CSS** (probably fastest, survives page re-pushes): in omj-brand.css add e.g.
     `.page-id-526 .elementor-section .elementor-container { max-width: none; } .page-id-526 .elementor-widget-text-editor, .page-id-526 .elementor-widget-wrap { padding: 0; }` — scope to `.page-id-526` / `.page-id-530` ONLY (do not restyle the rest of the site), and verify nothing else on those pages breaks.
  b. Set section layout `full_width` + zero gaps in the section JSON inside the update scripts, then re-run them.
- **Pink borders**: NOT from our preview CSS (local preview has none — compare local screenshots). Suspects to check in devtools: WP global styles on `img`/`figure` inside `.elementor-widget-text-editor`; Site Reviews or theme CSS; LiteSpeed lazy-load placeholder styling (`img[data-lazyloaded]`); an Elementor kit global border. Find the actual matched rule, then kill it scoped to the two page IDs.
- **Elementor-enforced img rules**: `.elementor-widget-text-editor img { ... }` also sets things like `height:auto` that can fight `aspect-ratio` tiles — check the cup/machine carousels at 1280 & 375 after your fixes.

## 4. Hard constraints

- **Do not clobber the photo-filter CSS**: a parallel session added branded photo filters (`brightness(136%) contrast(92%) saturate(137%)`, scoped to home/contact page IDs) inside omj-brand.css. It must survive your edits. Before ANY css push: `md5` local vs server; if they differ, fetch server, reconcile, THEN edit.
- Repo hygiene: every server change must land in the repo copies too (`build/mu-plugins/**`, `build/pages/**`), committed per task on `main`, message ending `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- No emoji anywhere in shipped markup — inline SVG only (24×24 viewBox, stroke currentColor).
- Scope every override to `.page-id-526` / `.page-id-530`. The live pages (35/25/21) must render exactly as before your pass.
- Subagent policy: codex CLI is OUT of budget — use Claude subagents if you delegate, but this pass is small enough to do directly.

## 5. Cache & verification gotchas (these WILL bite you otherwise)

- After ANY change: `wp litespeed-purge all` (and `wp elementor flush-css` if you touched page JSON). Page HTML/CSS is aggressively cached.
- LiteSpeed **Delay-JS** holds most scripts until first user interaction. Our three scripts opt out via a `data-no-optimize` filter in `omj-brand.php` — don't remove it. When screenshotting, either simulate an interaction (mouse move/keypress) or expect `.omj-anim` content invisible.
- Full-page screenshots at fast programmatic scroll catch lazy images mid-load and unrevealed sections — **scroll in ~500px steps with ~200ms waits, two passes, re-reading `scrollHeight`**, then screenshot. 35 of 35 `.omj-anim` should report `.is-inview` on home-staging.
- `curl` against the site needs a Chrome UA string (403 for non-browser UAs).
- Server fetches of pages: LiteSpeed serves per-URL cache — add a throwaway query param to bust.

## 6. Tooling you can reuse

- Playwright is installed at `/private/tmp/claude-501/-Users-rico-Git-ohmyjuiceness/313311ea-4e06-45b0-b314-fdf6561b31dd/scratchpad/shots/` (capture.mjs = basic full-page + console-error capture; verify-matrix.mjs = multi-width matrix). QA screenshots from the deploy session (incl. `final3-home-1280.png` showing the pink borders) are in `/private/tmp/claude-501/-Users-rico-Git-ohmyjuiceness/bc95cffc-5513-41c2-878e-41477ae1da47/scratchpad/shots/`. If tmp was wiped, recreate capture.mjs from `docs/superpowers/handoff/capture.mjs`.
- The local preview (`python3 -m http.server 8792 --directory build/preview`, then `home.html`) is the visual ground truth for how home-staging SHOULD look — no extra padding, no borders, full-bleed hero.

## 7. Definition of done

1. Hero on `/home-staging/` is full-bleed with zero enforced padding at 375/768/1280/1440.
2. No pink/red borders on any image, carousel control, or button on either staging page.
3. `/contact-staging/` strays fixed: no emoji tiles (SVG or removal), sane spacing around IGQR + form, fonts correct.
4. Live pages 35/25/21 visually unchanged (spot-check screenshots before/after).
5. Photo-filter CSS still present and effective on both staging pages.
6. Repo copies in sync with server; work committed; caches purged; before/after screenshots saved and shown to Rico, leading with what changed.
7. Append an entry to `.superpowers/sdd/progress.md` (gitignored — local ledger).

## 8. Wider context (read if needed)

- Session ledger: `.superpowers/sdd/progress.md` · Project log: `PROJECT_LOG.md` (§Changelog 2026-07-10) · Client flags: `docs/2026-07-10-client-flags.md` · Previous full handoff: `docs/2026-07-10-omj-staging-v2-handoff.md`.
- Pending beyond this pass (not yours unless told): IGQR block insert into LIVE page 21 (one command, awaiting Rico's approval of contact-staging); About page picture swaps in Elementor (client-directed, assets listed in client-flags doc).
