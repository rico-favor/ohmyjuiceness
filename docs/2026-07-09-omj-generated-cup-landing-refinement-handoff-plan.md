# OMJ Generated Cup Imagery + Landing Refinement Handoff Plan

Date: 2026-07-09  
Site: https://ohmyjuiceness.com  
Working target: `/home-staging/` first, not live Home  
Primary source files:
- `build/pages/home-staging.html`
- `build/pages/about-staging.html`
- `build/pages/contact-staging.html`
- `build/mu-plugins/omj-assets/omj-brand.css`
- `build/scripts/create-staging.php`
- `build/assets/photos/MANIFEST.md`
- `PROJECT_LOG.md`
- `docs/2026-07-09-client-report.html`

## Objective

Remove all visible use of the cup blueprint/spec-sheet image:

`https://ohmyjuiceness.com/wp-content/uploads/2026/07/omj-2026-cup-design.jpg`

Replace it with generated, premium cup imagery inspired by the OMJ cup direction, without showing the actual blueprint, dieline, layout grid, QR specs, annotations, or technical sheet.

Also refine the whole landing page experience using `ui-ux-pro-max`, then self-verify the look and feel before redeploying staging.

## Skills To Load

1. `imagegen`
   - Path: `/Users/rico/.codex/skills/imagegen/SKILL.md`
   - Purpose: generate replacement cup/product images using the OpenAI Image API.
   - Requirement: `OPENAI_API_KEY` must be set locally before live generation.

2. `ui-ux-pro-max`
   - Path: `/Users/rico/.codex/skills/ui-ux-pro-max/SKILL.md`
   - Purpose: guide landing-page refinement, UX polish, image treatment, responsiveness, and verification.

## References

- `docs/superpowers/specs/2026-07-09-omj-revisions-design.md`
- `docs/superpowers/plans/2026-07-09-omj-revisions.md`
- `docs/2026-07-09-client-report.html`
- `docs/PAGE-STRUCTURE.md`
- `docs/LIVE-SITE-CONFIG.md`
- `PROJECT_LOG.md`
- Current staging pages:
  - https://ohmyjuiceness.com/home-staging/
  - https://ohmyjuiceness.com/about-staging/
  - https://ohmyjuiceness.com/contact-staging/

## Current Problem Areas

1. `build/pages/home-staging.html` currently uses the blueprint image in:
   - “The Cup” section
   - “What’s Next” section

2. `docs/2026-07-09-client-report.html` currently describes the cup blueprint/spec art as an asset used.

3. The generated cup imagery promised in the earlier report was not actually generated. This follow-up must create those assets and replace the blueprint visually.

4. Emoji value-prop icons are allowed by the earlier OMJ client spec, but `ui-ux-pro-max` generally advises SVG icons for professional UI. Treat this as a conscious exception unless the client asks to remove the emojis.

## Implementation Plan

### 1. Confirm Baseline + Protect Live Site

- Run `git status --short --branch`.
- Confirm work is on staging files only.
- Do not update page IDs 35, 25, or 21.
- Keep Elementor header/footer untouched; do not add header/footer markup into page HTML.
- Before any WordPress write, take a backup:

```bash
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && \
  db=~/omj-backup-$(date +%F-%H%M).sql && \
  mu=~/omj-muplugins-$(date +%F-%H%M).tgz && \
  DB_NAME=$(wp config get DB_NAME) && \
  DB_USER=$(wp config get DB_USER) && \
  DB_PASS=$(wp config get DB_PASSWORD) && \
  DB_HOST=$(wp config get DB_HOST) && \
  MYSQL_PWD="$DB_PASS" mysqldump -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" > "$db" && \
  tar czf "$mu" wp-content/mu-plugins && \
  ls -lh "$db" "$mu"'
```

### 2. Run `ui-ux-pro-max` Design Pass

Run the design-system search:

```bash
python3 /Users/rico/.codex/skills/ui-ux-pro-max/scripts/search.py \
  "fresh juice vending machine premium fruit brand landing page" \
  --design-system \
  -f markdown \
  -p "Oh My Juiceness"
```

Run supporting checks:

```bash
python3 /Users/rico/.codex/skills/ui-ux-pro-max/scripts/search.py \
  "landing page animation accessibility responsive image polish" \
  --domain ux \
  -n 6

python3 /Users/rico/.codex/skills/ui-ux-pro-max/scripts/search.py \
  "premium product landing page responsive layout" \
  --stack html-tailwind
```

Apply the useful findings, but keep approved OMJ brand decisions:

- Keep OMJ orange `#FF8E06` and green `#167A45`.
- Keep Augillion + Poppins.
- Keep product-first hero.
- Use scroll-story structure: hero → machine proof → why OMJ → product/cup → numbers → locations → what’s next → franchise → contact/final CTA.
- Avoid overcomplicating navigation or hiding contact routes.
- Use restrained motion only if useful; respect `prefers-reduced-motion`.
- Use image optimization and consistent responsive image treatment.

### 3. Generate Replacement Cup Images With `imagegen`

Use the blueprint only as a private style/reference input if needed. Do not display the blueprint on the site.

Create final outputs under:

`build/assets/generated-cups/`

Recommended final image set:

| File | Purpose | Section |
|---|---|---|
| `omj-generated-cup-studio.jpg` | Hero/product proof: single premium OMJ-inspired orange juice cup | “The Cup” |
| `omj-generated-cup-oranges.jpg` | Cup with whole oranges and condensation | “The Cup” |
| `omj-generated-fresh-fruit-cup.jpg` | Fresh-fruit cup concept, not blueprint/spec sheet | “What’s Next” |
| `omj-generated-catering-cups.jpg` | Multiple premium cups/tray for catering teaser | “What’s Next” |

Generation constraints:

- Show generated cup/product photography only.
- Do not show a blueprint, dieline, spec sheet, layout grid, QR code sheet, annotations, color chips, typography notes, or flat design board.
- Avoid fake unreadable blocks of text.
- Avoid watermarks.
- Keep OMJ-inspired orange/green palette.
- Prefer clean product photography, premium studio lighting, condensation, fresh oranges, white/cream backdrop.
- If logo text is unreliable, use abstract OMJ-inspired orange/green fruit pattern instead of attempting exact logo text.

Example batch prompt file:

```bash
mkdir -p tmp/imagegen build/assets/generated-cups
cat > tmp/imagegen/omj-cups.jsonl <<'JSONL'
{"prompt":"Premium studio product photo of a white paper cup of fresh orange juice inspired by the Oh My Juiceness orange-and-deep-green brand palette, subtle orange fruit pattern on the cup, condensation, whole oranges nearby, clean cream background, soft commercial lighting, no blueprint, no spec sheet, no QR code, no annotations, no watermark, no readable text","use_case":"product-mockup","composition":"single cup centered, 3/4 angle, generous clean negative space","quality":"high","size":"1024x1024","output_format":"png"}
{"prompt":"Premium product photo of a branded orange juice cup with orange lid and straw, whole oranges and orange slices around it, deep green accent styling, fresh condensation, clean white-to-cream studio surface, no blueprint, no dieline, no technical sheet, no QR code, no annotations, no watermark, no readable text","use_case":"product-mockup","composition":"cup foreground, oranges behind, polished landing-page asset","quality":"high","size":"1024x1024","output_format":"png"}
{"prompt":"Fresh fruit cup concept for a premium fresh-fruit brand, clear cup filled with colorful cut fruit, orange-and-deep-green brand accents, clean studio product photography, bright natural freshness, no blueprint, no technical sheet, no QR code, no annotations, no watermark, no readable text","use_case":"product-mockup","composition":"single clear fruit cup, close product crop, cream background","quality":"high","size":"1024x1024","output_format":"png"}
{"prompt":"Premium catering scene with several fresh fruit cups and orange juice cups arranged on a clean cream surface, orange and deep green accents, fresh oranges and fruit slices, sophisticated studio lighting, no blueprint, no layout grid, no technical annotations, no QR code, no watermark, no readable text","use_case":"product-mockup","composition":"small group of cups, editorial product composition for landing page","quality":"high","size":"1536x1024","output_format":"png"}
JSONL
```

Run:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export IMAGE_GEN="$CODEX_HOME/skills/imagegen/scripts/image_gen.py"

python "$IMAGE_GEN" generate-batch \
  --input tmp/imagegen/omj-cups.jsonl \
  --out-dir build/assets/generated-cups \
  --concurrency 3
```

After generation:

- Inspect each output visually.
- Reject anything that looks like a blueprint/spec sheet.
- Reject anything with bad text/logos, watermarks, distorted cups, or uncanny product details.
- Keep 2-4 final images.
- Delete `tmp/imagegen/omj-cups.jsonl`.

If `OPENAI_API_KEY` is missing, stop and ask the operator to set it locally. Do not ask anyone to paste the key in chat.

### 4. Optimize Generated Images

Convert final generated assets to web-friendly JPEG/WebP copies:

```bash
for f in build/assets/generated-cups/*.{png,jpg,jpeg}; do
  [ -f "$f" ] || continue
  base="${f%.*}"
  magick "$f" -resize '1600x1600>' -strip -quality 84 "${base}.jpg"
done
```

Verify target sizes:

```bash
du -h build/assets/generated-cups/*
```

Target:

- Most images under 400KB.
- Hero/large section images ideally under 500KB if visually justified.
- No raw multi-megabyte generated PNGs should be used directly in page HTML.

### 5. Upload Generated Images to WordPress Media

```bash
for f in build/assets/generated-cups/*.jpg; do scp "$f" omj:~/; done

ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && \
  for f in ~/omj-generated-*.jpg; do \
    id=$(wp media import "$f" --porcelain); \
    printf "%s|%s|%s\n" "$(basename "$f")" "$id" "$(wp eval "echo wp_get_attachment_url($id);")"; \
  done'
```

Record every filename, media ID, and URL in:

- `build/assets/photos/MANIFEST.md`
- `PROJECT_LOG.md`
- `docs/2026-07-09-client-report.html`

### 6. Remove Blueprint From Staging HTML

Remove every use of:

`https://ohmyjuiceness.com/wp-content/uploads/2026/07/omj-2026-cup-design.jpg`

From:

- `build/pages/home-staging.html`
- `docs/2026-07-09-client-report.html`
- Any other docs or staging source that describes it as a displayed site asset.

Replace the “The Cup” section with generated cup product images.

Replace the “What’s Next” blueprint/spec-sheet image with generated fresh fruit cup/catering imagery.

Verification command:

```bash
rg -n "omj-2026-cup-design|cup-design\\.jpg|blueprint|spec sheet|dieline" \
  build/pages docs PROJECT_LOG.md
```

Expected:

- No blueprint URL in page HTML.
- Docs may mention the blueprint only as an internal reference that must not be displayed.

### 7. Refine Landing Page Experience

Use `ui-ux-pro-max` guidance to refine the overall page, not just replace images.

Recommended refinements:

1. Hero
   - Keep product/machine lead.
   - Ensure first viewport has strong product signal and no duplicate page title.
   - Keep CTA hierarchy clear: “Find a Machine” primary, “Watch It Squeeze” secondary.

2. Machine section
   - Make the machine proof clearer and tighter.
   - Reduce long inline copy.
   - If adding motion, keep it subtle and optional.

3. Why OMJ
   - Keep the client-approved emoji proof points unless explicitly changed.
   - Ensure tiles have stable height, no layout shift, and good mobile wrapping.

4. Cup/product section
   - Use generated cup images only.
   - Remove all blueprint/spec visuals.
   - Use consistent image class treatment: `object-fit`, stable aspect ratio, 8px radius, restrained shadow.

5. What’s Next
   - Use generated cup/fresh-fruit product imagery.
   - Frame this as fresh fruit experiences, not a blueprint preview.

6. Locations
   - Keep four cards.
   - Preserve Directions/Open in Maps.
   - Confirm no horizontal scroll at mobile widths.

7. Franchise + CTA
   - Keep `/contact-staging/?inquiry=franchising` on staging.
   - For live rollout later, switch to `/contact/?inquiry=franchising`.

### 8. Deploy Staging Only

Deploy CSS and staging pages:

```bash
DEST=/home/u907133977/domains/ohmyjuiceness.com/public_html/wp-content/mu-plugins
scp build/mu-plugins/omj-assets/omj-brand.css omj:$DEST/omj-assets/omj-brand.css
scp build/pages/home-staging.html build/pages/about-staging.html build/pages/contact-staging.html build/scripts/create-staging.php omj:~/

ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && \
  wp eval-file ~/create-staging.php && \
  wp elementor flush-css && \
  wp litespeed-purge all'
```

Do not run live page update commands for page IDs 35, 25, or 21.

### 9. Self-Verify Look And Feel

Required checks:

```bash
# Blueprint no longer appears in rendered staging.
curl -L -s https://ohmyjuiceness.com/home-staging/ | rg -n "omj-2026-cup-design|blueprint|spec sheet|dieline" && exit 1 || echo "blueprint absent"

# Required copy still present.
curl -L -s https://ohmyjuiceness.com/home-staging/ | rg -q "Freshly Squeezed\\. Every Cup\\. Every Time\\."
curl -L -s https://ohmyjuiceness.com/home-staging/ | rg -q "Fresh Fruit Experiences"
curl -L -s https://ohmyjuiceness.com/home-staging/ | rg -q "Own an OMJ Machine"

# Live Home still untouched by staging headline.
curl -L -s https://ohmyjuiceness.com/ | rg -q "Freshly Squeezed\\. Every Cup\\. Every Time\\." && exit 1 || echo "live home staging headline absent"
```

Visual QA:

- Desktop: 1440px and 1024px.
- Tablet: 768px.
- Mobile: 375px.
- Confirm:
  - No blueprint image is visible.
  - Generated cup images feel premium and consistent with OMJ.
  - Images do not stretch awkwardly.
  - CTAs remain visible and tappable.
  - Header/footer are Elementor-provided only.
  - No horizontal scroll.
  - Text does not overlap images.
  - Page still feels product-first within 5 seconds.

Optional screenshot artifacts:

- Save QA screenshots under `docs/qa/omj-generated-cups/`.
- Do not commit huge raw screenshots unless needed.

### 10. Documentation + Commit

Update:

- `PROJECT_LOG.md`
- `build/assets/photos/MANIFEST.md`
- `docs/2026-07-09-client-report.html`
- This handoff plan, if implementation notes change.

Commit message suggestion:

```bash
git add build/pages/home-staging.html build/pages/about-staging.html build/pages/contact-staging.html \
  build/mu-plugins/omj-assets/omj-brand.css \
  build/assets/generated-cups build/assets/photos/MANIFEST.md \
  PROJECT_LOG.md docs/

git commit -m "feat: replace blueprint with generated cup imagery"
git push origin main
```

## Done Criteria

- No visible blueprint/spec-sheet image remains on `/home-staging/`.
- `rg` finds no blueprint URL in staging page HTML.
- Generated cup images are saved locally, committed, uploaded to WordPress, and recorded in the manifest.
- Page uses generated cup/product images, not the technical cup design sheet.
- Landing page has been refined using `ui-ux-pro-max` guidance.
- Visual QA passes at 375px, 768px, 1024px, and 1440px.
- The live Home page remains untouched.
- `PROJECT_LOG.md` and client report clearly describe the generated image replacement.

## Assumptions

- The cup blueprint may be used as an internal style reference, but must not be shown publicly.
- Exact OMJ logo text on generated images is not required unless the output can render it cleanly; abstract brand-inspired orange/green cup patterns are acceptable.
- Staging CTAs should stay on staging URLs until the client approves live rollout.

## Implementation Notes

- The local Image API CLI path was attempted first, but the account returned `billing_hard_limit_reached`.
- Fallback session image generation produced four filesystem assets under `~/.codex/generated_images/019f46de-1b30-71d0-9201-500652fce7c0/`.
- Optimized deployable JPG/WebP copies were saved under `build/assets/generated-cups/`.
- WordPress media imports:
  - `omj-generated-catering-cups.jpg` → ID 552
  - `omj-generated-cup-oranges.jpg` → ID 553
  - `omj-generated-cup-studio.jpg` → ID 554
  - `omj-generated-fresh-fruit-cup.jpg` → ID 555
