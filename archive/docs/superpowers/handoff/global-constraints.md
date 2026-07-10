> **📦 ARCHIVED — DONE — binding constraints for the completed staging-v2 batch.**
> Frozen 2026-07-10; see [`archive/README.md`](../README.md). Internal links may be stale.

# OMJ Staging v2 — Global Constraints (binding for every task)

## Repo & paths
- Repo: /Users/rico/Git/ohmyjuiceness (work on `main`; commit per task with conventional messages ending in `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`)
- Deliverables live in `build/preview/` exactly per this layout:
  - `home.html`, `about.html`, `contact.html` (standalone full pages)
  - `assets/css/omj-brand.css` (verbatim copy of build/mu-plugins/omj-assets/omj-brand.css — NEVER edit/fork it)
  - `assets/css/omj-preview.css` (new styles: numbered sections 13–18 + a `/* PREVIEW-ONLY */` block at bottom for fonts/chrome/form-facsimile)
  - `assets/js/omj-preview.js` (single IIFE, vanilla JS, no external libraries)
  - `assets/fonts/`, `assets/img/{hero,cups,machine,locations/{greenhills,uptown,parqal,eastwood},people,brand}/`
- IMPORTANT: `.gitignore` ignores *.jpg/*.jpeg/*.png repo-wide (except logo/). Image files will be untracked — that is expected; do NOT force-add images. Commit only HTML/CSS/JS/MD/fonts(woff2/ttf are not ignored).

## Design system (client-locked)
- Tokens (already in omj-brand.css): orange #FF8E06, red-orange #E24F14, green #167A45, dark-green #0F5230, cream #F7F5E9, text #484544, white.
- Fonts: Augillion (display, local ttf) + Poppins 400/500/600 (body, local woff2). @font-face lives in omj-preview.css PREVIEW-ONLY block.
- Reuse existing `omj-` classes from omj-brand.css (`.omj-section--cream/green/white`, `.omj-h1/h2`, `.omj-btn--primary/ghost/green`, `.omj-container`, `.omj-loc-card`, `.omj-img-grid`, `.omj-eyebrow`, `.omj-stat-band`…). New classes follow the same `omj-` BEM-ish naming.

## Hard quality rules
- NO emoji as icons anywhere — inline SVG only (24×24 viewBox, stroke currentColor).
- All entrance animations via `.omj-anim` utility classes + IntersectionObserver; `prefers-reduced-motion: reduce` (and `?motion=reduce` query param) must reveal everything instantly with no transforms.
- All interactive targets ≥44×44px; visible `:focus-visible` states; real `<button>`/`<a>` elements; alt text on every meaningful image; `cursor: pointer` on clickables.
- Images referenced with RELATIVE paths (`assets/img/...`) using `<picture>` with webp source + jpg fallback and `srcset` where variants exist; `loading="lazy"` below the fold, `loading="eager"` for hero.
- Page content that will deploy to WordPress must sit between `<!-- OMJ:FRAGMENT-START -->` and `<!-- OMJ:FRAGMENT-END -->` comments; everything outside (head, header/footer chrome) is preview-only scaffolding.
- No horizontal scroll at 375/768/1280/1440px. Zero console errors.

## Animation vocabulary (replicating original Elementor feel)
`.omj-anim` base: opacity 0 → 1, transform → none, `.55s cubic-bezier(.22,.61,.36,1)`, delay via `--omj-anim-delay`. Variants: `--fade-in` (opacity only), `--fade-in-down` (translateY(-28px)), `--fade-in-up` (translateY(28px)), `--slide-in-left` (translateX(-56px)), `--slide-in-right` (translateX(56px)), `--pulse` (one-shot scale pulse on reveal, hero primary button only). Parent `[data-omj-stagger]` auto-assigns incremental 0.1s delays to `.omj-anim` children.

## Report contract (implementers)
Write your full report to the report file path given in your dispatch. Return ONLY: STATUS (DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED), commit SHAs, one-line verification summary, concerns list (if any).
