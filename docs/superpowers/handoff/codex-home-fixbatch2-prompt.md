You are working in the repo at the current directory (/Users/rico/Git/ohmyjuiceness). Apply revision batch 2 to the standalone preview page `build/preview/home.html`, `build/preview/assets/js/omj-map.js`, and `build/preview/assets/css/omj-preview.css` (append/modify inside its existing `/* 19. Home fix batch */` section or add `/* 20. Map & carousel revisions */`). Never edit omj-brand.css. Do NOT run git commands. Design tokens: orange #FF8E06, red-orange #E24F14, green #167A45, dark-green #0F5230, cream #F7F5E9, text #484544.

## Fix A — Cup carousel: full cup with headroom (client feedback: top of cup is cut off)
The cups carousel (`.omj-carousel--gallery` in home.html section "The Cup") currently crops slides with object-fit cover, cutting the cup's top. Change the slide media treatment so the ENTIRE cup is visible with comfortable headroom: use `object-fit: contain` with a soft cream backdrop (`background:#F7F5E9`) on the slide media box (keep aspect-ratio ~3/2, max-height 560px). Ensure the contain letterboxing looks intentional (slight inner padding, rounded corners preserved). Check all 4 slides' source images are fully visible.

## Fix B — Map popup rework (client feedback)
In `omj-map.js` + CSS:
1. The "Directions" button inside popups renders with BLUE text — Leaflet's default `.leaflet-popup-content a` color is winning. Make popup action buttons white text on green (#167A45), hover dark-green, with enough CSS specificity (scope under `.omj-map-popup`; `!important` acceptable here).
2. The popup's top (location title) can clip beyond the map container edge when opened. Fix: reduce popup media height a bit if needed and set marker `bindPopup` options `autoPan: true, autoPanPaddingTopLeft: L.point(24, 72)` (or equivalent) so the full popup incl. title is always visible.
3. Add a location-detail line to each popup, under the title, Poppins 400 0.85rem #484544 (data below — use VERBATIM), followed by an italic playful line 0.8rem: "Look for the bright orange machine!"
   - Greenhills: "Greenhills Shopping Center, Ortigas Ave., San Juan City"
   - Eastwood: "Eastwood Mall, 116 Eastwood Ave., Bagumbayan, Quezon City"
   - Uptown BGC: "Uptown Mall, 9th Ave. cor. 36th St., Bonifacio Global City, Taguig"
   - Parqal: "Parqal Mall — Abaca Building, D. Macapagal Blvd., Aseana City, Parañaque"
4. Expose a focus API on window: `window.OMJMap = { focus(key) }` where key ∈ greenhills|eastwood|uptown|parqal — it should `map.flyTo(latlng, 16)` and open that marker's popup.

## Fix C — Location cards: minimal + map-integrated (client feedback)
In home.html's 4 `.omj-loc-card`s:
1. REMOVE the "Directions" button (redundant); KEEP "Open in Maps" with its existing URL.
2. Add a one-line minimal detail under the location name, Poppins 0.85rem #484544 (VERBATIM):
   - Greenhills: "Greenhills Shopping Center, San Juan"
   - Eastwood: "Eastwood Mall, Quezon City"
   - Uptown BGC: "Uptown Mall, BGC, Taguig"
   - Parqal: "Parqal Mall (Abaca Bldg.), Parañaque"
3. Add a small circular icon button next to "Open in Maps" (44×44, cream bg, green orange-slice/pin SVG icon, aria-label "Show {Name} on the map") that calls `OMJMap.focus('{key}')` AND smooth-scrolls the map (`#omj-map-live`) into view first. Style hover consistent with the button system (hard shadow optional at this size).
4. Keep the card carousels and lightbox wiring untouched.

## Verification (do all)
- `node --check` both JS files.
- Serve `python3 -m http.server 8899 --directory build/preview` (background), curl 200 home.html, kill server.
- Confirm: no remaining "Directions" text button in the four cards; popup CSS includes the white-text rule; OMJMap.focus defined; cups carousel uses contain treatment.
- Print one line per file changed.
