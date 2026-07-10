You are working in the repo at the current directory (/Users/rico/Git/ohmyjuiceness). Build `build/preview/about.html` — the About page of a standalone preview site. Do NOT run git commands.

## Context
`build/preview/home.html` already exists and is the pattern reference: copy its `<head>` structure (fonts/css/js includes, favicon — but NOT leaflet/omj-map.js, About has no map), its header/footer chrome markup, and its section/animation conventions exactly (`.omj-anim--*` classes, `[data-omj-stagger]`, `[data-omj-carousel]`, `[data-lightbox]`, `.omj-zoom` wrappers, `<picture>` webp+jpg). Shared CSS: `assets/css/omj-brand.css` + `assets/css/omj-preview.css` (read both; do not edit either — if something truly can't be done with existing classes, add a tiny scoped `<style>` in the page head under `/* about-page-only */`). Design tokens: orange #FF8E06, red-orange #E24F14, green #167A45, dark-green #0F5230, cream #F7F5E9, text #484544.

Title: `About — Oh My Juiceness`. Meta description about fresh-squeezed orange juice machines in Metro Manila. Header nav: About gets `aria-current="page"`, links home.html/about.html/contact.html.

Page content wrapped in `<!-- OMJ:FRAGMENT-START -->` / `<!-- OMJ:FRAGMENT-END -->`.

## Sections (7)
1. **Hero** (cream, centered): `assets/img/brand/logo-orange.png` as `.omj-page-icon`-style intro image (max-width ~340px, fade-in-down), H1 "Fresh Juice, Made Simple" (fade-in-down), one-liner (fade-in, delay): "Real oranges, squeezed the moment you order — no bottles, no shortcuts."
2. **Our Story** (white, 2-col: text left, image right; stacks mobile): eyebrow "Our Story", H2 "From One Machine to a Fresh Fruit Movement" (fade-in-up); 2 short paragraphs (slide-in-left): "OMJ started with a simple question: why is it so hard to get a genuinely fresh cup of orange juice? One machine later, the answer was rolling into malls across Metro Manila." / "Every cup is squeezed on the spot from whole oranges you can see in the machine. No water, no sugar, no concentrates — just fruit."; image right (slide-in-right, zoom+lightbox group "about-story"): `assets/img/people/omj-process-parqal-kids.jpg` (portrait — cap max-width ~420px, radius), alt "Kids getting fresh orange juice from an OMJ machine at Parqal".
3. **Fresh. Pure. Refreshing.** (white or cream — pick the alternation that reads best after section 2): copy the ENTIRE `.omj-fpr` block from home.html verbatim (same words, same 5 checklist items, same animations).
4. **The Experience** (cream): eyebrow "The Experience", H2 "No Bottles. No Cartons. Just the Machine." (fade-in-up), intro "Skip the shelf. OMJ juice never sits in storage — it exists only after you press the button."; 2-col image grid ([data-omj-stagger], zoom + `data-lightbox="about-experience"`): `assets/img/machine/abaca-machine.jpg` and `assets/img/machine/parqal-machine.jpg` (both portrait 1600×2133 — uniform tiles aspect-ratio 4/5 object-fit cover; reuse the same approach home.html's machine grid uses, including its scoping class if that helps).
5. **Real people, real machines** (white): eyebrow "Out in the Wild", H2 "Fresh Squeezed, Every Day" (fade-in-up); a 4-tile mosaic grid ([data-omj-stagger], each tile fade-in-up, zoom + `data-lightbox="about-life"`, aspect 4/3 cover): `assets/img/locations/greenhills/loc-greenhills-01.jpg`, `assets/img/locations/eastwood/loc-eastwood-02.jpg` (use the -800 file if that's the naming on disk — CHECK the actual filenames in build/preview/assets/img/locations/eastwood/), `assets/img/locations/uptown/loc-uptown-01.jpg`, `assets/img/locations/parqal/loc-parqal-02.jpg`. Real alts describing each scene.
6. **The Cup carousel** (cream): eyebrow "The Cup", H2 "Premium Enough for Fresh-Squeezed Juice"; COPY home.html's cup carousel block (same 4 slides/captions/modifier classes, `data-lightbox="cups"`), intro shortened to one line.
7. **Franchise CTA** (green band, centered): H2 white "Own an OMJ Machine", one line white "Bring fresh-squeezed juice to your neighborhood — join the waitlist.", button `.omj-btn--primary` "Join the Waitlist" → `contact.html?inquiry=franchising`.

## Verification (do all)
- Every referenced local asset resolves on disk (script the check; zero missing).
- `python3 -m http.server 8897 --directory build/preview` background; curl 200 on about.html; kill server.
- Unique ids; no nested interactive elements (no button inside a).
- Print summary of files changed.
