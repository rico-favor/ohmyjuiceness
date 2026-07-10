# OMJ Staging Revisions — Product-First Premium

**Date:** 2026-07-10
**Scope:** Staging pages only (`/home-staging/` ID 526, `/about-staging/` ID 528). Live pages untouched until client approval.
**Client brief:** Remove machine wrap artwork, enlarge product photography, standardize on the official white cup design, remove fruit-cup imagery, replace "The Cup" copy (Option 1), overall shift toward premium consumer-brand presentation.

---

## 1. Context & design truth

- The **official cup design** exists only as a design file: `build/assets/photos/cup-design.jpg` (white cup, orange vector fruit pattern, "oh my juiceness" front lockup, green Instagram QR + `@OHMYJUICENESS`). **No physical white-variant cup exists** — all product photography must be AI-generated from this reference.
- Real photos (`build/assets/photos/loc-greenhills.jpg`, `loc-uptown-2.jpg`) show the **orange variant** cups with domed orange lids — used only as hints for cup proportions, lid form, and real-world context. They are NOT the target design.
- **Quality benchmark:** `build/assets/generated-cups/omj-generated-cup-hero-landscape-v2.png` — approved example of a good generation (accurate logo, scannable-looking QR, believable condensation and lighting, OMJ orange/green palette).
- Generator: **codex-imagegen** (gpt-image-2 via `codex exec`), with `cup-design.jpg` as the base/reference image.

## 2. Asset generation

All generated assets land in `build/assets/generated-cups/`, are exported as JPG + WebP, imported to WP Media, and referenced with `/wp-content/uploads/2026/07/...` URLs (v3 prefix or similar to avoid CDN-cached filename collisions).

| # | New asset | Replaces (staging refs) | Requirements |
|---|---|---|---|
| 1 | Studio portrait cup | `v2-omj-generated-cup-studio.{jpg,webp}` — home-staging cup carousel + Paseo location card | White-design cup, full juice, clean premium studio backdrop, portrait ~1100×1400. Logo + QR rendered faithfully. |
| 2 | Cup with whole oranges | `v2-omj-generated-cup-oranges.{jpg,webp}` — home-staging cup carousel + about-staging | White-design cup surrounded by whole/cut oranges and leaves, square ~1250. |
| 3 | Catering / party cups | `v2-omj-generated-catering-cups.{jpg,webp}` — home-staging cup carousel | Multiple white-design cups, event/catering feel, **orange juice only** (no fruit products), landscape ~1536×1024. |
| 4 | Landscape hero | `v2-omj-hero-cup.{jpg,webp}` ×3 responsive sizes (768/1280/1920) — home-staging hero | First try reusing existing `omj-generated-cup-hero-landscape-v3.{png,jpg,webp}` (already generated with real design). Regenerate only if it fails review. Must keep a darker lower third for white hero text overlay. |
| 5 | Hand-held cup lifestyle shot — **⚠ PENDING CLIENT/RICO DECISION** | `ae14fe38…0007.jpg` (2025 real photo, old cup, orange heart) in "Fresh. Pure. Refreshing." section | Default: regenerate as hand holding the white-design cup, consistent premium look. Alternative: leave the real photo as-is (lifestyle, not product). |

**Generation acceptance criteria (each image):**
- Logo lockup legible and correctly spelled ("oh my juiceness", green/orange, orange-slice mark).
- QR block visually plausible (grid-like, green, with IG glyph) — does not need to actually scan, must not be distorted garbage.
- Cup geometry matches spec (tapered paper cup); no invented extra text on the cup.
- OMJ palette: orange #FF8E06/#F68B1F family, green #167A45, cream backdrops.

## 3. Removals (home-staging.html)

1. **Machine gallery** (`#omj-machine` carousel): delete the `v2-machine-vendo-1` slide — the flat orange vinyl-wrap artwork ("Your Daily Dose of Vitamin C"). 22 photo slides remain.
2. **Cup gallery** (`#omj-cup` carousel): delete the `v2-omj-generated-fresh-fruit-cup` slide entirely (OMJ sells orange juice only).

## 4. Larger imagery / less whitespace

- Machine gallery: `data-omj-per-view="3"` → `"2"` (and `data-omj-per-view-narrow` `3` → `2`).
- Cup gallery: `data-omj-per-view="2"` → `"1"` — one full-width product shot at a time; `data-omj-per-view-narrow` stays `1`.
- `omj-brand.css`: only minimal supporting tweaks if the wider slides need adjusted max-heights/aspect handling. No unrelated restyling.

## 5. Copy — "The Cup" section (Option 1, client-preferred)

- H2: `Premium Enough for Fresh-Squeezed Juice` → **`Designed for Fresh Juice.`**
- Intro: `New product photography brings finished, appetite-forward cup imagery to life in OMJ's orange and green palette.` → **`Our signature cup is designed to showcase what matters most—100% freshly squeezed orange juice, made to order and served fresh.`**
- Eyebrow `The Cup` stays.

## 6. Files touched

- `build/pages/home-staging.html` — removals, per-view changes, new image URLs, copy.
- `build/pages/about-staging.html` — cup-oranges image URL swap.
- `build/mu-plugins/omj-assets/omj-brand.css` — only if carousel sizing needs support.
- `build/assets/generated-cups/` — new generated assets.
- `wiki/log.md` — append change entry.

## 7. Deploy workflow (staging)

1. Generate + review assets locally (Rico eyeballs before upload).
2. Export JPG + WebP (and hero responsive sizes); `scp` to server; `wp media import`.
3. Update staging HTML files; `scp`; apply with the staging helper.
4. `wp elementor flush-css && wp litespeed-purge all`.
5. **Cloudflare purge** — required; LiteSpeed strips `?ver` so new assets won't propagate otherwise (token in `~/Git/gvbasketball/.env`).
6. Verify `/home-staging/` and `/about-staging/` in browser (Claude in Chrome), screenshot for the change report.

## 8. Error handling / risks

- **QR/logo fidelity is the #1 generation risk.** gpt-image-2 may mangle the wordmark or QR. Mitigation: generate multiple candidates per slot, pick the best; if text is consistently broken, composite the real logo/QR flat art over the generated cup as a fallback (last resort).
- Image regeneration is iterative — human review gate (Rico) before anything is uploaded.
- All changes staged on `/home-staging/` — live site carries zero risk this pass.

## 9. Out of scope

- Live `/home/` and `/about/` pages (deploy later on approval).
- Hero video (still awaiting client Veo clip).
- Any nav/footer/contact changes.

## 10. Open items needing Rico's attention

1. **Item 5 in §2 (hand-held lifestyle photo)** — regenerate with white-design cup (default) or keep the real 2025 photo? Not yet confirmed.
2. **Hero reuse** — confirm `cup-hero-landscape-v3` is good enough for the staging hero, or regenerate fresh.
3. **Review gate** — you review generated images locally before they're uploaded to WP Media.
