> **📦 ARCHIVED — DONE — revision implementation plan (executed).**
> Frozen 2026-07-10; see [`archive/README.md`](../README.md). Internal links may be stale.

# Oh My Juiceness Website Revisions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the client's 10-point revision brief — a product-first premium redesign of Home plus About/Contact/header/footer fixes, franchise + fresh-fruit sections — built in `build/` and deployed via the AGENTS.md golden workflow.

**Architecture:** Activate the documented mu-plugin build system, then author each page as hand-written HTML mounted into an Elementor HTML widget (`omj_set_page_html`) and the header/footer as Theme Builder parts (`omj_set_theme_part`). A real `omj-brand.css` design system replaces the current stub. Contact keeps its Elementor Pro form (edited surgically). Every deploy is preceded by a full `wp db export` backup and followed by cache flushing.

**Tech Stack:** WordPress 7.0, PHP 8.2, Elementor + Elementor Pro, Hello Elementor theme, LiteSpeed Cache, WP-CLI over SSH (`omj` alias). Local tooling: `sips`/ImageMagick (photo processing), `codex-imagegen` skill, WebSearch (Maps verification).

## Global Constraints

- **SSH:** `ssh omj` → account `u907133977`; WP root `/home/u907133977/domains/ohmyjuiceness.com/public_html` — run all `wp` from there. Filter the SSH stderr noise with `2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"`.
- **Deploy asset CSS:** `scp` to `wp-content/mu-plugins/omj-assets/omj-brand.css`. **Deploy pages:** `scp` HTML to `~`, apply with `wp eval "echo omj_set_page_html(<ID>, file_get_contents(...));"`.
- **After every change:** `wp elementor flush-css && wp litespeed-purge all`.
- **Before every live write:** `wp db export ~/omj-backup-$(date +%F-%H%M).sql` on the server.
- **Namespacing:** all custom CSS classes prefixed `omj-`.
- **Colors (blend palette, verbatim):** Orange `#FF8E06`; Red-Orange accent `#E24F14`; Green `#167A45`; Dark-Green `#0F5230`; Cream bg `#F7F5E9`; Text `#484544`; White `#FFFFFF`.
- **Fonts:** Augillion (display), Poppins (body) — no font swap.
- **Value-prop icons (verbatim copy):** 🍊 100% Fresh Oranges · 💧 No Water Added · 🚫 No Added Sugar · ❄️ Served Fresh · ⚡ Ready in Under 60 Seconds.
- **Locations (4, verbatim):** Greenhills, Eastwood, Uptown BGC, Parqal.
- **Never:** print secret values; add people above the hero fold; use bottle imagery; make a delivery/"delivered around the metro" claim; use "Order Now".
- **Page IDs:** Home 35, About 25, Contact 21, Privacy 3. **Elementor Kit ID:** 9.

---

## Task 1: Backup + activate the mu-plugin build system

**Files:**
- Deploy: `build/mu-plugins/omj-brand.php`, `build/mu-plugins/omj-build.php` → server `wp-content/mu-plugins/`
- Reference: [`AGENTS.md`](../../../AGENTS.md) §2–3

**Interfaces:**
- Produces: live PHP helpers `omj_set_page_html($id,$html)`, `omj_set_page_blocks`, `omj_set_theme_part($title,$type,$html)`, `omj_ensure_page` callable via `wp eval`.

- [ ] **Step 1: Verify local plugin files exist and are non-empty**

Run: `wc -l build/mu-plugins/omj-brand.php build/mu-plugins/omj-build.php`
Expected: both > 0 lines. (If `omj-build.php` lacks the helpers listed in AGENTS.md §3, stop and report — the helpers must exist before proceeding.)

- [ ] **Step 2: Take a full DB + mu-plugins backup on the server**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp db export ~/omj-backup-$(date +%F-%H%M).sql && tar czf ~/omj-muplugins-$(date +%F-%H%M).tgz wp-content/mu-plugins' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
```
Expected: a `.sql` and `.tgz` created in `~`.

- [ ] **Step 3: Deploy the mu-plugins**

```bash
DEST=/home/u907133977/domains/ohmyjuiceness.com/public_html/wp-content/mu-plugins
ssh omj "mkdir -p $DEST/omj-assets"
scp build/mu-plugins/omj-brand.php omj:$DEST/omj-brand.php
scp build/mu-plugins/omj-build.php omj:$DEST/omj-build.php
```

- [ ] **Step 4: Verify the helpers are callable**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp eval "echo function_exists(\"omj_set_page_html\") && function_exists(\"omj_set_theme_part\") ? \"OK\" : \"MISSING\";"' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
```
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add build/mu-plugins/omj-brand.php build/mu-plugins/omj-build.php PROJECT_LOG.md
git commit -m "chore: activate omj mu-plugin build system on live site"
```

---

## Task 2: Real design-system CSS + reconcile Elementor Kit green

**Files:**
- Modify: `build/mu-plugins/omj-assets/omj-brand.css` (replace stub)
- Deploy: → server `wp-content/mu-plugins/omj-assets/omj-brand.css`

**Interfaces:**
- Produces: CSS custom properties (`--omj-orange`, `--omj-red-orange`, `--omj-green`, `--omj-dark-green`, `--omj-cream`, `--omj-text`, `--omj-white`) and component classes consumed by all page tasks: `.omj-section`, `.omj-hero`, `.omj-btn` / `.omj-btn--primary` / `.omj-btn--ghost`, `.omj-eyebrow`, `.omj-h1`/`.omj-h2`, `.omj-icon-tiles`, `.omj-stat-band`, `.omj-loc-grid`/`.omj-loc-card`.

- [ ] **Step 1: Replace the CSS stub with real tokens + components**

Write `build/mu-plugins/omj-assets/omj-brand.css` with the token block using the Global Constraints colors, plus the component classes named in Interfaces (buttons: pill radius, orange primary / green-outline ghost; `.omj-icon-tiles` responsive grid; `.omj-stat-band` green background with large numerals; `.omj-loc-grid` responsive 4-up cards; hero full-viewport with bottom gradient overlay + `object-fit:cover` video). Mobile breakpoints md 768 / lg 1025 to match the kit.

- [ ] **Step 2: Deploy the CSS**

```bash
DEST=/home/u907133977/domains/ohmyjuiceness.com/public_html/wp-content/mu-plugins
scp build/mu-plugins/omj-assets/omj-brand.css omj:$DEST/omj-assets/omj-brand.css
```

- [ ] **Step 3: Point the Elementor Kit green to `#167A45`**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp eval "\$k=get_post_meta(9,\"_elementor_page_settings\",true); echo is_array(\$k)?\"kit-ok\":\"check-kit\";"' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
```
Then update the `accent` system color and `OMJ-Green` custom color (id `dcf100f`) from `#2D8762` → `#167A45` in the kit settings (via `wp eval` editing `_elementor_page_settings` on post 9, or Elementor → Site Settings if a UI session is available). Expected: kit green renders `#167A45`.

- [ ] **Step 4: Flush caches and verify the stylesheet is live**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp elementor flush-css && wp litespeed-purge all' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
curl -s "https://ohmyjuiceness.com/wp-content/mu-plugins/omj-assets/omj-brand.css" | grep -c "167A45"
```
Expected: `curl` returns ≥1 (token present in the served file).

- [ ] **Step 5: Commit**

```bash
git add build/mu-plugins/omj-assets/omj-brand.css
git commit -m "feat: real omj design system (blend palette, components)"
```

---

## Task 3: Photo pipeline — rotate, crop, minify, upload

**Files:**
- Create: `build/assets/photos/` (processed web images)
- Source: `revisions/*.jpeg`, `revisions/omjeastwood/*.jpeg`, `revisions/other-assets/*`

**Interfaces:**
- Produces: a manifest `build/assets/photos/MANIFEST.md` mapping each processed file → WP media ID + URL, consumed by all page tasks.

- [ ] **Step 1: Inventory + fix orientation**

Auto-rotate EXIF-rotated shots so all are upright. Example (ImageMagick):
```bash
mkdir -p build/assets/photos
magick revisions/omj-parqal2.jpeg -auto-orient build/assets/photos/parqal-machine-full.jpg
```
Do this for the machine shots chosen per location (Greenhills, Uptown, Parqal/Abaca, Eastwood).

- [ ] **Step 2: Produce machine-only crops (no people) + a few consented lifestyle crops**

Crop each hero/product image to the machine/oranges/cup, removing people. Keep 1–2 consented lifestyle shots (e.g. an Eastwood family shot) for the product showcase. Name clearly: `hero-*`, `machine-*`, `product-*`, `loc-greenhills`, `loc-eastwood`, `loc-uptown`, `loc-parqal`.

- [ ] **Step 3: Minify to web size**

Resize longest edge to ~1600px, optimize quality:
```bash
for f in build/assets/photos/*.jpg; do magick "$f" -resize '1600x1600>' -strip -quality 82 "$f"; done
```
Verify each result is < ~400 KB: `du -h build/assets/photos/*`.

- [ ] **Step 4: Upload to WP media and capture IDs**

```bash
for f in build/assets/photos/*.jpg; do scp "$f" omj:~/; done
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && for f in ~/hero-* ~/machine-* ~/product-* ~/loc-*; do wp media import "$f" --porcelain; done' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
```
Record each returned attachment ID.

- [ ] **Step 5: Write the manifest + verify URLs resolve**

Write `build/assets/photos/MANIFEST.md` (filename → media ID → URL). Spot-check: `curl -sI "<one media URL>" | head -1` → `HTTP/2 200`.

- [ ] **Step 6: Commit**

```bash
git add build/assets/photos
git commit -m "feat: processed + minified location/product photos with media manifest"
```

---

## Task 4: Fresh-fruit placeholder imagery (codex-imagegen)

**Files:**
- Create: `build/assets/photos/freshfruit-*.jpg` + manifest entries

**Interfaces:**
- Consumes: `revisions/omj-cup-design.jpg` (brand art reference), Task 3 manifest format.
- Produces: 2–3 fresh-fruit visuals (Fruitty Dippy / fruit cup / catering) for Home §7, added to `MANIFEST.md`.

- [ ] **Step 1: Generate imagery via the codex-imagegen skill**

Invoke `codex-imagegen` with prompts styled from the cup design: OMJ orange/green palette, clean white background, e.g. "chocolate-dipped fresh fruit skewers, premium studio product photo, white background, orange and deep-green brand accents" and "fresh cut fruit cup, condensation, bright, premium." Save into `build/assets/photos/`.

- [ ] **Step 2: Quality gate**

View each output. If quality is good enough for a full §7 section, use as product tiles; if not, downgrade §7 to a text-forward teaser (per spec §11 fallback) and note the decision in `PROJECT_LOG.md`.

- [ ] **Step 3: Minify + upload + manifest (same commands as Task 3 steps 3–5)**

- [ ] **Step 4: Commit**

```bash
git add build/assets/photos
git commit -m "feat: fresh-fruit teaser placeholder imagery"
```

---

## Task 5: Verify Google Maps links for the 4 locations

**Files:**
- Create: `build/assets/locations.md` (name, address, verified Maps URL, directions URL)

**Interfaces:**
- Produces: `LOCATIONS` data (name + `maps_url` + `directions_url`) consumed by Home §6 (Task 9) and Contact (Task 11).

- [ ] **Step 1: Look up each location**

WebSearch each: "Oh My Juiceness Greenhills", "…Eastwood", "…Uptown Mall BGC", "…Parqal Aseana". Capture the official Google Maps place URL for each.

- [ ] **Step 2: Verify each URL resolves to the right place**

For each, confirm the Maps URL loads the expected mall/venue (open/fetch and check the place name + area). Build the Directions variant as `https://www.google.com/maps/dir/?api=1&destination=<place>`.

- [ ] **Step 3: Record + commit**

Write `build/assets/locations.md`. If a location's exact machine spot can't be verified, record the mall-level pin and flag it for client confirmation.
```bash
git add build/assets/locations.md
git commit -m "docs: verified google maps links for 4 machine locations"
```

---

## Task 6: Hero video deliverable (Veo prompt + source image + poster)

**Files:**
- Create: `build/assets/hero/veo-prompt.md`, `build/assets/hero/hero-poster.jpg`

**Interfaces:**
- Produces: a poster image (media ID) used by the Home hero `<video poster>` (Task 8) until the client supplies the clip.

- [ ] **Step 1: Pick the best source frame**

Choose a machine/squeezing frame (e.g. the Parqal/Abaca shot showing the juicer chamber + oranges). Copy to `build/assets/hero/hero-source.jpg`.

- [ ] **Step 2: Write the Veo prompt**

Write `build/assets/hero/veo-prompt.md`: an image-to-video prompt for Gemini Veo — "Slow cinematic close-up of the Oh My Juiceness machine squeezing fresh whole oranges; bright juice pours into a branded cup; condensation, warm premium lighting, shallow depth of field, no people, 6–8s loop-friendly, muted." Include aspect-ratio guidance (16:9 desktop / center-safe for 9:16 crop).

- [ ] **Step 3: Prepare a poster still**

Produce `hero-poster.jpg` (minified, 1600px) from the source frame; upload to WP media (Task 3 upload pattern); record the ID.

- [ ] **Step 4: Commit**

```bash
git add build/assets/hero
git commit -m "feat: hero Veo prompt + source image + poster fallback"
```

---

## Task 7: Header + footer theme parts (sitewide)

**Files:**
- Create: `build/templates/header.html`, `build/templates/footer.html`
- Deploy: via `omj_set_theme_part`

**Interfaces:**
- Consumes: brand CSS (Task 2), IG QR/icon assets.
- Produces: live header (logo + nav + **Contact Us** button, no "Order Now") and footer (**© 2026 Oh My Juiceness**, IG @ohmyjuiceness).

- [ ] **Step 1: Locate the current header/"Order Now" source**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp eval "echo get_option(\"elementor_active_kit\");" && wp post list --post_type=elementor_library --fields=ID,post_title,post_status' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
```
Determine whether the header is a Theme Builder part, kit setting, or in-page markup; note it in `PROJECT_LOG.md`.

- [ ] **Step 2: Author `header.html` and `footer.html`**

Header: green bar, logo (media 83), nav (WP menu 19), primary pill button **Contact Us** → `/contact/`. **No "Order Now."** Footer: OMJ logo, IG icon linking to `@ohmyjuiceness`, copyright **"© 2026 Oh My Juiceness. All Rights Reserved."**

- [ ] **Step 3: Deploy the parts**

```bash
scp build/templates/header.html omj:~/header.html
scp build/templates/footer.html omj:~/footer.html
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp eval "echo omj_set_theme_part(\"OMJ Header\",\"header\",file_get_contents(getenv(\"HOME\").\"/header.html\")); echo omj_set_theme_part(\"OMJ Footer\",\"footer\",file_get_contents(getenv(\"HOME\").\"/footer.html\"));" && wp elementor flush-css && wp litespeed-purge all && rm ~/header.html ~/footer.html' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
```

- [ ] **Step 4: Verify**

```bash
curl -s https://ohmyjuiceness.com/ | grep -io "order now" | head -1   # expect: empty
curl -s https://ohmyjuiceness.com/ | grep -o "© 2026 Oh My Juiceness"  # expect: match
```

- [ ] **Step 5: Commit**

```bash
git add build/templates/header.html build/templates/footer.html PROJECT_LOG.md
git commit -m "feat: header (Contact Us CTA, no Order Now) + footer (2026 copyright)"
```

---

## Task 8: Home page — top half (hero → product showcase) + close comments

**Files:**
- Create: `build/pages/home.html` (sections 1–4 authored now; extended in Task 9)
- Deploy: `omj_set_page_html(35, …)`

**Interfaces:**
- Consumes: brand CSS (Task 2), photo manifest (Task 3), hero poster (Task 6), icon copy (Global Constraints).
- Produces: `build/pages/home.html` — later tasks append sections 5–10 to this same file.

- [ ] **Step 1: Author sections 1–4**

In `build/pages/home.html`:
- **§1 Hero** — `<video autoplay muted loop playsinline poster="<hero-poster URL>">` full-bleed with gradient overlay; `<h1 class="omj-h1">Freshly Squeezed. Every Cup. Every Time.</h1>`; subhead `Made from whole oranges. No sugar. No water. No concentrates.`; buttons `Find a Machine` (`#omj-find`) + `Watch it squeeze` (`#omj-machine`). No people.
- **§2 The Machine** (`id="omj-machine"`) — machine photos (oranges inside → squeezing → cup) + short caption.
- **§3 Why OMJ** — `.omj-icon-tiles` with the 5 verbatim emoji bullets.
- **§4 Product showcase** — cold-cup / condensation / oranges crops + up to 2 consented lifestyle shots.

- [ ] **Step 2: Backup, deploy, close comments on Home**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp db export ~/omj-backup-$(date +%F-%H%M).sql' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
scp build/pages/home.html omj:~/home.html
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp post update 35 --comment_status=closed && wp eval "echo omj_set_page_html(35, file_get_contents(getenv(\"HOME\").\"/home.html\"));" && wp elementor flush-css && wp litespeed-purge all && rm ~/home.html' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
```

- [ ] **Step 3: Verify rendered output**

```bash
curl -s https://ohmyjuiceness.com/ > /tmp/omj-home.html
grep -o "Freshly Squeezed. Every Cup. Every Time." /tmp/omj-home.html   # expect match
grep -io "leave a reply" /tmp/omj-home.html | head -1                    # expect empty
grep -o "Ready in Under 60 Seconds" /tmp/omj-home.html                   # expect match
```
Also load the page in a browser: hero video area present with poster, no people, machine section high up.

- [ ] **Step 4: Commit**

```bash
git add build/pages/home.html
git commit -m "feat: home hero + machine + why-omj + product (sections 1-4)"
```

---

## Task 9: Home page — bottom half (stats → final CTA)

**Files:**
- Modify: `build/pages/home.html` (append sections 5–10)
- Deploy: `omj_set_page_html(35, …)`

**Interfaces:**
- Consumes: locations data (Task 5), fresh-fruit imagery (Task 4), photo manifest (Task 3).
- Produces: complete Home page.

- [ ] **Step 1: Append sections 5–10**

- **§5 By the Numbers** — `.omj-stat-band`: `500,000+ oranges squeezed` · `Thousands of cups served` · `Multiple Metro Manila locations` · `100% fresh`.
- **§6 Find a Machine** (`id="omj-find"`) — `.omj-loc-grid` with 4 `.omj-loc-card` (Greenhills, Eastwood, Uptown BGC, Parqal): photo + name + **Directions** (`directions_url`) + **Open in Maps** (`maps_url`) from Task 5.
- **§7 What's Next** — fresh-fruit teaser (Fruitty Dippy / fruit cups / catering) using Task 4 imagery; "fresh fruit experiences" framing.
- **§8 Own an OMJ Machine** — heading `Own an OMJ Machine`, subhead `Join the fastest-growing fresh juice concept in the Philippines.`, button **Join the Waitlist** → `/contact/?inquiry=franchising` (real machine photo, not the AI render).
- **§9 Questions?** — heading `Questions?` + **Contact Us** button → `/contact/`.
- **§10 Final CTA** — `Ready for Real Orange Juice?` / `Find the nearest OMJ machine today.` + **Find a Machine** (`#omj-find`) + **Contact Us**.

- [ ] **Step 2: Backup + deploy (same pattern as Task 8 step 2, without the comment-status change)**

- [ ] **Step 3: Verify**

```bash
curl -s https://ohmyjuiceness.com/ > /tmp/omj-home2.html
for s in "500,000+ oranges squeezed" "Own an OMJ Machine" "Join the Waitlist" "Ready for Real Orange Juice?"; do grep -o "$s" /tmp/omj-home2.html; done
grep -o 'maps.google\|google.com/maps' /tmp/omj-home2.html | head -1   # expect a maps link present
```
Browser check: 4 location cards with working Directions/Maps buttons; waitlist button preselects Franchising on the contact form.

- [ ] **Step 4: Commit**

```bash
git add build/pages/home.html
git commit -m "feat: home stats, find-a-machine, fresh-fruit, franchise, CTA (sections 5-10)"
```

---

## Task 10: About page rebuild

**Files:**
- Create: `build/pages/about.html`
- Deploy: `omj_set_page_html(25, …)`

**Interfaces:**
- Consumes: brand CSS, photo manifest.
- Produces: rebuilt About with no bottle image, scannable Why OMJ, relabeled franchise CTA.

- [ ] **Step 1: Author `about.html`**

- Hero + brand intro (no bottle image anywhere).
- **Why OMJ** scannable bullets: `Real oranges` · `Nothing artificial` · `Freshly squeezed in under a minute` + a **single-sentence origin line** replacing the long founder paragraph.
- Drop the hidden Team + Quotation sections.
- Franchise CTA relabeled **Own an OMJ Machine** → `/contact/?inquiry=franchising`.

- [ ] **Step 2: Backup + deploy**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp db export ~/omj-backup-$(date +%F-%H%M).sql' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
scp build/pages/about.html omj:~/about.html
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp eval "echo omj_set_page_html(25, file_get_contents(getenv(\"HOME\").\"/about.html\"));" && wp elementor flush-css && wp litespeed-purge all && rm ~/about.html' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
```

- [ ] **Step 3: Verify**

```bash
curl -s https://ohmyjuiceness.com/about/ > /tmp/omj-about.html
grep -io "traveled around the world" /tmp/omj-about.html | head -1   # expect empty (long story gone)
grep -o "Own an OMJ Machine" /tmp/omj-about.html                      # expect match
```
Browser: confirm no bottle image.

- [ ] **Step 4: Commit**

```bash
git add build/pages/about.html
git commit -m "feat: rebuild About (scannable Why OMJ, no bottle, franchise relabel)"
```

---

## Task 11: Contact page fixes (preserve the Pro form)

**Files:**
- Modify: Contact page (ID 21) — surgical edits to the value-prop card + locations only
- Reference: [`docs/PAGE-STRUCTURE.md`](../../PAGE-STRUCTURE.md) §Contact

**Interfaces:**
- Consumes: locations data (Task 5).
- Produces: corrected value-prop copy + current locations; Elementor Pro form logic untouched; a small `?inquiry=franchising` preselect script (consumed by the Home §8 and About waitlist buttons).

- [ ] **Step 1: Backup + inspect the current Elementor data**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp db export ~/omj-backup-$(date +%F-%H%M).sql && wp post meta get 21 _elementor_data > ~/contact-data.json && echo saved' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
scp omj:~/contact-data.json build/pages/contact-data.backup.json
```

- [ ] **Step 2: Apply targeted text edits**

Edit the value-prop list so **"No Added Preservatives"** is one line (fix "no added Preservatives"), and **remove the "Delivered Around the Metro"** item. Update the locations list to the 4 current locations. Do this via `wp post meta update 21 _elementor_data '<edited json>'` (edit the JSON string in place — do not rebuild the form widget) OR, if a UI session is available, in the Elementor editor. Keep the Elementor Pro Form widget, Inquiry-Type select, reCAPTCHA, and email routing unchanged.

- [ ] **Step 3: Add the Franchising preselect script**

So the Home §8 / About "Join the Waitlist" links (`/contact/?inquiry=franchising`) land with the Inquiry-Type select set to Franchising, add a tiny script to the contact page (HTML widget above the form, or an `omj-brand`-enqueued snippet):
```html
<script>
document.addEventListener('DOMContentLoaded',function(){
  var p=new URLSearchParams(location.search).get('inquiry');
  if(!p)return;
  var sel=document.querySelector('form.elementor-form select');
  if(!sel)return;
  Array.from(sel.options).forEach(function(o){
    if(o.text.toLowerCase().indexOf(p.toLowerCase())>-1){sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}
  });
});
</script>
```
Verify the select label text actually contains "Franchising" (per PAGE-STRUCTURE.md the option is "Franchising"); adjust the match if the form uses different wording.

- [ ] **Step 4: Flush + verify**

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp elementor flush-css && wp litespeed-purge all' 2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"
curl -s https://ohmyjuiceness.com/contact/ > /tmp/omj-contact.html
grep -io "delivered around the metro" /tmp/omj-contact.html | head -1   # expect empty
grep -o "No Added Preservatives" /tmp/omj-contact.html                   # expect match
```
Browser: load `/contact/?inquiry=franchising` and confirm the select shows Franchising; submit a test inquiry to confirm the form still sends.

- [ ] **Step 5: Commit**

```bash
git add build/pages/contact-data.backup.json build/scripts/inquiry-preselect.html PROJECT_LOG.md
git commit -m "fix: contact value-props + locations + franchising preselect"
```

---

## Task 12: Full-site verification + docs update

**Files:**
- Modify: `PROJECT_LOG.md`, `docs/PAGE-STRUCTURE.md`, `docs/LIVE-SITE-CONFIG.md`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a verified site + updated documentation.

- [ ] **Step 1: Run the 10-point verification checklist**

Confirm against the brief, one line each: (1) hero = product/oranges/video, no people; (2) machine section high; (3) short scannable copy; (4) emoji icons replace checkmarks; (5) product shown prominently; (6) Find-a-Machine with 4 working Directions/Maps; (7) no "Leave a Reply"; (8) "Own an OMJ Machine" + waitlist; (9) stats present; (10) final CTA present. Also: no "Order Now", footer "© 2026 Oh My Juiceness", no bottle image, no delivery claim.

- [ ] **Step 2: Cross-device + cache check**

Load Home/About/Contact on desktop + mobile widths; confirm hero video autoplays muted (poster until client's clip lands) and layout holds. Re-run `wp litespeed-purge all`.

- [ ] **Step 3: Update docs**

Update `PROJECT_LOG.md` changelog (this revision round), refresh `docs/PAGE-STRUCTURE.md` (new section structure) and `docs/LIVE-SITE-CONFIG.md` (correct the stale "vanilla/minimal" note — pages are now built via the mu-plugin system).

- [ ] **Step 4: Final commit**

```bash
git add PROJECT_LOG.md docs/
git commit -m "docs: log OMJ revision round + refresh page-structure/live-config"
```

---

## Deferred / client-dependent (tracked, not blocking)

- Client supplies the **Veo hero video**; swap the `<video>` source in when delivered (poster ships meanwhile).
- **Eastwood/Paseo** machine-spot precision on Maps if only mall-level pins verify (Task 5 flags).
- Full **Fruitty Dippy product pages / e-commerce**, real **online ordering/delivery**, dedicated **waitlist infra** — future rounds.
