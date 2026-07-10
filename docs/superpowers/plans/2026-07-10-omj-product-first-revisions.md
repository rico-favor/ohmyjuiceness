# OMJ Product-First Revisions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize all cup product photography on the official white cup design, enlarge both home galleries, remove the machine-wrap and fruit-cup images, swap in Option-1 copy, and deploy to staging + live home (with backup) — then produce JULY-CHANGES-v2.html.

**Architecture:** Static HTML fragments in `build/pages/` are mounted into Elementor pages via mu-plugin helpers (`omj_set_page_html`). Images are AI-generated locally (codex-imagegen), processed to JPG+WebP with ImageMagick, and imported to WP Media. Deploys go over SSH alias `omj`.

**Tech Stack:** codex-imagegen (gpt-image-2), ImageMagick 7 (`/opt/homebrew/bin/magick`), WP-CLI over SSH, Cloudflare purge API, Claude in Chrome for visual verification.

**Spec:** `docs/superpowers/specs/2026-07-10-omj-product-first-revisions-design.md`

## Global Constraints

- Design truth for the cup: `build/assets/photos/cup-design.jpg` (white cup, orange vector pattern, "oh my juiceness" lockup, green IG QR + `@OHMYJUICENESS`). No physical white cup exists — everything is generated.
- Quality benchmark: `build/assets/generated-cups/omj-generated-cup-hero-landscape-v2.png`.
- **RICO REVIEW GATE:** Rico must approve every generated image locally BEFORE anything is uploaded to WP Media.
- **Backup before live deploy** of home page (ID 35) is mandatory.
- New upload filenames use the `v3-` prefix (avoids CDN filename collisions with cached `v2-*`).
- Brand palette: orange `#FF8E06`/`#F68B1F`, green `#167A45`, cream `#F7F5E9`. All CSS classes namespaced `omj-`.
- Copy is exactly the client's Option 1 — verbatim, including the em-dash: `Designed for Fresh Juice.` / `Our signature cup is designed to showcase what matters most—100% freshly squeezed orange juice, made to order and served fresh.`
- After any server change: `wp elementor flush-css && wp litespeed-purge all` + Cloudflare purge (zone `d4c80986aa4c981ad2f8db9802e698e8`, token `CLOUDFLARE_API_TOKEN` in `~/Git/gvbasketball/.env`, command in `wiki/hosting.md` "CDN Caching").
- SSH noise filter: append `2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"` to ssh/scp commands when output matters.
- Never print secret values.

---

### Task 1: Generate the three cup product images

**Files:**
- Create: `build/assets/generated-cups/v3-omj-cup-studio.png` (1024×1536 portrait)
- Create: `build/assets/generated-cups/v3-omj-cup-oranges.png` (1024×1024 square)
- Create: `build/assets/generated-cups/v3-omj-catering-cups.png` (1536×1024 landscape)

**Interfaces:**
- Consumes: `build/assets/photos/cup-design.jpg` (design reference), `build/assets/generated-cups/omj-generated-cup-hero-landscape-v2.png` (quality benchmark), `build/assets/photos/loc-uptown-2.jpg` (real-world cup proportion hint only — its orange cups are NOT the target design).
- Produces: three approved PNGs with the exact filenames above, consumed by Task 2.

- [ ] **Step 1: Invoke the codex-imagegen skill** (read it first; it defines the `codex exec` invocation). Generate each image with `cup-design.jpg` as the reference image. Prompts:

  **v3-omj-cup-studio** (portrait 1024×1536):
  > Photorealistic premium product photography of a tall white paper cup filled to the brim with fresh orange juice. The cup design matches the attached reference sheet exactly: white matte base, scattered flat orange vector illustrations (orange slices, whole oranges with leaf stems, juice splash droplets in brand orange #F68B1F), front logo lockup "oh my juiceness" in green and orange rounded lowercase lettering above an orange half-slice splash icon, and below it a small green Instagram QR code with "@OHMYJUICENESS" caption. Clean warm cream studio backdrop, soft daylight, subtle condensation on the cup, faint reflection on the surface. No lid, juice surface visible with fine bubbles. No extra text anywhere. Centered, generous margins.

  **v3-omj-cup-oranges** (square 1024×1024):
  > Photorealistic premium product photography of a white paper cup of fresh orange juice matching the attached cup design reference exactly (white base, flat orange vector fruit pattern, "oh my juiceness" green-and-orange logo lockup, small green Instagram QR with @OHMYJUICENESS). The cup sits among whole fresh oranges with green leaves and one cut orange half, on a warm cream surface. Soft natural light, condensation droplets, appetizing and premium. No extra text.

  **v3-omj-catering-cups** (landscape 1536×1024):
  > Photorealistic premium product photography of several white paper cups of freshly squeezed orange juice arranged on a serving tray for an event, every cup matching the attached cup design reference exactly (white base, flat orange vector fruit pattern, "oh my juiceness" green-and-orange logo lockup, green Instagram QR). Bright celebratory but elegant setting, fresh oranges and green leaves as accents, warm light. Orange juice only — no other fruit, no food. No extra text.

- [ ] **Step 2: Self-check each output against acceptance criteria** — logo spelled "oh my juiceness" (green "oh my juice", orange tail elements per reference), QR is a plausible green grid with IG glyph (not distorted garbage), tapered paper-cup geometry, no invented text. Regenerate failing candidates (max ~3 attempts each; if the wordmark/QR never lands, note the compositing fallback from the spec §8 and surface it to Rico).

- [ ] **Step 3: RICO REVIEW GATE.** Present all three PNGs (plus `omj-generated-cup-hero-landscape-v3.{png,jpg}` for hero confirmation — see Task 2) and STOP for approval. Do not proceed to Task 2 until Rico approves each image or requests regeneration.

- [ ] **Step 4: Commit approved assets**

```bash
git add build/assets/generated-cups/v3-omj-cup-studio.png build/assets/generated-cups/v3-omj-cup-oranges.png build/assets/generated-cups/v3-omj-catering-cups.png
git commit -m "feat(assets): generate v3 cup product photography from official cup design"
```

---

### Task 2: Produce web derivatives (JPG + WebP, hero responsive sizes)

**Files:**
- Create: `build/assets/generated-cups/v3-omj-cup-studio.{jpg,webp}`
- Create: `build/assets/generated-cups/v3-omj-cup-oranges.{jpg,webp}`
- Create: `build/assets/generated-cups/v3-omj-catering-cups.{jpg,webp}`
- Create: `build/assets/generated-cups/v3-omj-hero-cup.{jpg,webp}` + `v3-omj-hero-cup-768.{jpg,webp}` + `v3-omj-hero-cup-1280.{jpg,webp}`

**Interfaces:**
- Consumes: Task 1 PNGs; hero source `build/assets/generated-cups/omj-generated-cup-hero-landscape-v3.png` (1536×1024, Rico-approved in Task 1 Step 3).
- Produces: the exact filenames above; Task 3 hard-codes these names in HTML, Task 4 uploads them.

- [ ] **Step 1: Generate derivatives** (match existing pipeline quality settings: jpg q82, webp q78, Lanczos + light unsharp):

```bash
cd /Users/rico/Git/ohmyjuiceness/build/assets/generated-cups
M=/opt/homebrew/bin/magick
for n in v3-omj-cup-studio v3-omj-cup-oranges v3-omj-catering-cups; do
  "$M" "$n.png" -filter Lanczos -unsharp 0x0.6 -quality 82 "$n.jpg"
  "$M" "$n.png" -filter Lanczos -unsharp 0x0.6 -quality 78 "$n.webp"
done
"$M" omj-generated-cup-hero-landscape-v3.png -filter Lanczos -unsharp 0x0.6 -quality 82 v3-omj-hero-cup.jpg
"$M" omj-generated-cup-hero-landscape-v3.png -filter Lanczos -unsharp 0x0.6 -quality 78 v3-omj-hero-cup.webp
for w in 768 1280; do
  "$M" omj-generated-cup-hero-landscape-v3.png -filter Lanczos -resize "${w}x" -unsharp 0x0.6 -quality 82 "v3-omj-hero-cup-${w}.jpg"
  "$M" omj-generated-cup-hero-landscape-v3.png -filter Lanczos -resize "${w}x" -unsharp 0x0.6 -quality 78 "v3-omj-hero-cup-${w}.webp"
done
ls -la v3-*
```

Expected: 14 `v3-*` files.

- [ ] **Step 2: Verify dimensions**

```bash
/opt/homebrew/bin/magick identify build/assets/generated-cups/v3-*.jpg
```

Expected: studio 1024×1536, oranges 1024×1024, catering 1536×1024, hero 1536×1024 / 1280×853 / 768×512.

- [ ] **Step 3: Commit**

```bash
git add build/assets/generated-cups/v3-*
git commit -m "feat(assets): v3 web derivatives (jpg/webp + hero responsive sizes)"
```

---

### Task 3: Edit staging HTML (removals, per-view, image swaps, copy)

**Files:**
- Modify: `build/pages/home-staging.html`
- Modify: `build/pages/about-staging.html:39`

**Interfaces:**
- Consumes: `v3-*` filenames from Task 2 (as `/wp-content/uploads/2026/07/v3-...` URLs).
- Produces: final staging fragments consumed verbatim by Task 4 (staging) and Task 5 (live promotion of home).

All edits below are in `build/pages/home-staging.html` unless noted. Current line numbers refer to the file as of commit `eb6288e`.

- [ ] **Step 1: Hero swap (lines 5–8).** Replace the `v2-omj-hero-cup` URLs/dimensions with v3:

```html
  <picture>
    <source type="image/webp" srcset="/wp-content/uploads/2026/07/v3-omj-hero-cup-768.webp 768w, /wp-content/uploads/2026/07/v3-omj-hero-cup-1280.webp 1280w, /wp-content/uploads/2026/07/v3-omj-hero-cup.webp 1536w" sizes="100vw">
    <img class="omj-hero__poster" src="/wp-content/uploads/2026/07/v3-omj-hero-cup.jpg" srcset="/wp-content/uploads/2026/07/v3-omj-hero-cup-768.jpg 768w, /wp-content/uploads/2026/07/v3-omj-hero-cup-1280.jpg 1280w, /wp-content/uploads/2026/07/v3-omj-hero-cup.jpg 1536w" sizes="100vw" alt="Cup of freshly squeezed OMJ orange juice in the official OMJ cup, surrounded by oranges and leaves" loading="eager" decoding="async" width="1536" height="1024">
  </picture>
  <video class="omj-hero__video" autoplay muted loop playsinline poster="/wp-content/uploads/2026/07/v3-omj-hero-cup.jpg">
```

- [ ] **Step 2: Machine gallery — remove wrap artwork + enlarge (lines 27, 32).**
  - Delete the entire `v2-machine-vendo-1` slide `<div class="omj-carousel__slide">…</div>` (line 32).
  - On the carousel opener (line 27) change `data-omj-per-view="3" data-omj-per-view-narrow="3"` → `data-omj-per-view="2" data-omj-per-view-narrow="2"`.

- [ ] **Step 3: Cup section copy + size (lines 144–146).**
  - H2: `Premium Enough for Fresh-Squeezed Juice` → `Designed for Fresh Juice.`
  - Intro `<p>`: replace full text with `Our signature cup is designed to showcase what matters most&mdash;100% freshly squeezed orange juice, made to order and served fresh.`
  - Carousel opener (line 146): `data-omj-per-view="2"` → `data-omj-per-view="1"` (narrow stays `1`).

- [ ] **Step 4: Cup carousel slides (lines 148–187).**
  - Slide 1: swap `v2-omj-generated-cup-studio.{webp,jpg}` → `v3-omj-cup-studio.{webp,jpg}`, `width="1024" height="1536"`.
  - Slide 2: swap `v2-omj-generated-cup-oranges.{webp,jpg}` → `v3-omj-cup-oranges.{webp,jpg}`, `width="1024" height="1024"`.
  - Slide 3 (fresh-fruit-cup, lines 168–177): **delete the whole slide**.
  - Slide 4: swap `v2-omj-generated-catering-cups.{webp,jpg}` → `v3-omj-catering-cups.{webp,jpg}`, `width="1536" height="1024"`.

- [ ] **Step 5: Paseo location card (line 377).** Swap `v2-omj-generated-cup-studio.{webp,jpg}` → `v3-omj-cup-studio.{webp,jpg}`, `width="1024" height="1536"`.

- [ ] **Step 6: about-staging.html line 39.** Swap `https://ohmyjuiceness.com/wp-content/uploads/2026/07/omj-generated-cup-oranges.jpg` → `https://ohmyjuiceness.com/wp-content/uploads/2026/07/v3-omj-cup-oranges.jpg`.

- [ ] **Step 7: Verify no stale references and structure intact**

```bash
grep -c 'omj-carousel__slide"' build/pages/home-staging.html   # expected: 45 (was 47; two slides removed)
grep -n "fresh-fruit-cup\|machine-vendo-1\|v2-omj-generated-cup\|v2-omj-hero-cup\|appetite-forward" build/pages/home-staging.html build/pages/about-staging.html
```

Expected: second grep returns nothing.

- [ ] **Step 8: Check carousel sizing in `omj-brand.css`** around line 1387 (`.omj-carousel[data-omj-per-view] .omj-carousel__slide`). The per-view basis is computed in `omj-preview.js`, so 2-up/1-up should work without CSS changes. Only if the 1-up cup slides render overly tall, add a max-height clamp scoped to `.omj-carousel--gallery` (e.g. `.omj-carousel--gallery .omj-carousel__slide img { max-height: min(78vh, 720px); width: auto; margin-inline: auto; }`). Otherwise touch nothing.

- [ ] **Step 9: Commit**

```bash
git add build/pages/home-staging.html build/pages/about-staging.html build/mu-plugins/omj-assets/omj-brand.css
git commit -m "feat(staging): v3 cup imagery, larger galleries, remove wrap art + fruit cup, Option 1 copy"
```

---

### Task 4: Upload media + deploy to staging + verify

**Files:**
- Modify (server): WP Media library, staging pages 526/528.

**Interfaces:**
- Consumes: Task 2 derivatives, Task 3 fragments.
- Produces: live-verified staging pages; the same fragment is promoted in Task 5.

- [ ] **Step 1: Upload and import media** (14 files; `wp media import` lands them in `uploads/2026/07/` keeping filenames):

```bash
scp build/assets/generated-cups/v3-*.jpg build/assets/generated-cups/v3-*.webp omj:~/ 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp media import ~/v3-*.jpg ~/v3-*.webp --skip-copy=false && rm ~/v3-*.jpg ~/v3-*.webp'
```

Expected: "Imported file ..." ×14. Then spot-check one URL: `curl -sI https://ohmyjuiceness.com/wp-content/uploads/2026/07/v3-omj-cup-studio.jpg | head -1` → `HTTP/2 200`.

- [ ] **Step 2: Deploy staging fragments** (create-staging.php reads `~/omj-staging-pages/`):

```bash
ssh omj 'mkdir -p ~/omj-staging-pages'
scp build/pages/home-staging.html build/pages/about-staging.html build/pages/contact-staging.html omj:~/omj-staging-pages/
scp build/scripts/create-staging.php omj:~/create-staging.php
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp eval-file ~/create-staging.php && wp elementor flush-css && wp litespeed-purge all'
```

- [ ] **Step 3: Cloudflare purge** (command documented in `wiki/hosting.md` "CDN Caching"; token from `~/Git/gvbasketball/.env` — do not echo it):

```bash
set -a; source ~/Git/gvbasketball/.env; set +a
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/d4c80986aa4c981ad2f8db9802e698e8/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

Expected: `"success":true`.

- [ ] **Step 4: Visual verification (Claude in Chrome).** Open `https://ohmyjuiceness.com/home-staging/`, check: hero shows the v3 cup; machine gallery is 2-up with no wrap artwork; cup section reads "Designed for Fresh Juice." with 1-up large images and no fruit cup; Paseo card shows the v3 studio cup. Open `/about-staging/` and confirm the v3 cup-oranges image. Screenshot each revised section (saved to scratchpad) for the Task 6 report. **Surface screenshots to Rico.**

---

### Task 5: Backup live home, then promote

**Files:**
- Create: `backups/2026-07-10-home-35-elementor-data.json`
- Create: `backups/2026-07-10-home-live-fragment.html` (copy of pre-change `build/pages/home.html`)
- Modify: `build/pages/home.html` (becomes the promoted fragment)

**Interfaces:**
- Consumes: verified `build/pages/home-staging.html` from Task 4.
- Produces: live home (ID 35) running the new design; rollback = restore saved `_elementor_data` via `omj_set_page_html`-equivalent or `wp post meta update`.

- [ ] **Step 1: Backup (server + local)**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp db export ~/omj-backup-$(date +%Y%m%d)-pre-home-promote.sql && wp post meta get 35 _elementor_data --format=json > ~/home-35-elementor-data.json && echo BACKUP-OK'
scp omj:~/home-35-elementor-data.json backups/2026-07-10-home-35-elementor-data.json
cp build/pages/home.html backups/2026-07-10-home-live-fragment.html
```

Expected: `BACKUP-OK`; both local backup files exist and are non-empty (`ls -la backups/`).

- [ ] **Step 2: RICO CHECKPOINT.** Staging verified (Task 4 screenshots) and backups confirmed. Confirm go-live with Rico before this step's deploy. *(Rico pre-authorized live deploy in the spec, but this is the last cheap abort point — pause only if Task 4 revealed anything off.)*

- [ ] **Step 3: Promote to live home (ID 35)** — the home fragment only (strip nothing; the staging file IS the fragment):

```bash
cp build/pages/home-staging.html build/pages/home.html
scp build/pages/home.html omj:~/home.html
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp eval "echo omj_set_page_html(35, file_get_contents(getenv(\"HOME\").\"/home.html\"));" && wp elementor flush-css && wp litespeed-purge all && rm ~/home.html'
```

- [ ] **Step 4: Cloudflare purge** (same command as Task 4 Step 3). Expected `"success":true`.

- [ ] **Step 5: Verify live.** Claude in Chrome → `https://ohmyjuiceness.com/` hard-check the same five points as Task 4 Step 4, plus map + location cards + franchise section still render and `window.OMJMap.focus` buttons work. Screenshot revised sections.

- [ ] **Step 6: Commit**

```bash
git add backups/2026-07-10-home-35-elementor-data.json backups/2026-07-10-home-live-fragment.html build/pages/home.html
git commit -m "feat(live): promote product-first home revision to live (ID 35) with pre-deploy backups"
```

---

### Task 6: JULY-CHANGES-v2.html report + wiki log

**Files:**
- Create: `docs/JULY-CHANGES-v2.html`
- Modify: `wiki/log.md` (append entry at top of entries)

**Interfaces:**
- Consumes: screenshots from Tasks 4–5; format template `docs/2026-07-10-july-changes.html`.
- Produces: client-facing change report; nothing downstream.

- [ ] **Step 1: Write `docs/JULY-CHANGES-v2.html`** following the structure/styling of `docs/2026-07-10-july-changes.html` (read it first), with inline screenshots embedded the same way that file does. Sections: (1) machine wrap artwork removed, (2) larger gallery imagery (2-up machine / 1-up cup), (3) new standard cup photography from the official cup design (hero, studio, oranges, catering, Paseo card, about page), (4) fruit cup removed — juice-only lineup, (5) new "Designed for Fresh Juice." copy, (6) live home promoted. **MUST include a highlighted "Client action" callout:** the "Fresh. Pure. Refreshing." lifestyle photo still shows the old cup — updated lifestyle photography with the new cup design is the client's own follow-up, as this is the final revision round.

- [ ] **Step 2: Append `wiki/log.md` entry** in house format:

```markdown
## [2026-07-10] deploy | Product-first revision v2 (staging + live home)
**Deployed:**
- Generated v3 cup photography from official cup design (`cup-design.jpg`): hero, studio, cup-oranges, catering (WP media `v3-*`).
- Home: machine gallery 2-up (wrap-artwork slide removed), cup gallery 1-up (fruit-cup slide removed), "Designed for Fresh Juice." copy (client Option 1).
- About-staging: cup-oranges swapped to v3.
- Live home (ID 35) promoted from staging; backups in `backups/` + server `~/omj-backup-*-pre-home-promote.sql`.
- Client report: `docs/JULY-CHANGES-v2.html` (flags lifestyle photo as client follow-up).
```

- [ ] **Step 3: Commit**

```bash
git add docs/JULY-CHANGES-v2.html wiki/log.md
git commit -m "docs: JULY-CHANGES-v2 client report + wiki log for product-first revision"
```
