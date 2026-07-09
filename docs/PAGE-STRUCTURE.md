# Oh My Juiceness — Page Structure Summary

Updated 2026-07-09 after full revision deployment.

## Home (ID 35, slug `/`)

**Built via `omj_set_page_html(35, …)` — single text-editor Elementor widget containing all 10 sections.**

Sections:
1. **Hero:** Full-bleed video (poster fallback), headline "Freshly Squeezed. Every Cup. Every Time.", subhead, "Find a Machine" + "Watch It Squeeze" buttons
2. **The Machine:** 3-photo grid (oranges → squeezing → cup)
3. **Why OMJ:** 5 emoji icon tiles (100% Fresh Oranges · No Water Added · No Added Sugar · Served Fresh · Ready in Under 60 Seconds)
4. **Product Showcase:** Machine-only + lifestyle shots
5. **By the Numbers:** Green stat band (500,000+ oranges · thousands of cups · multiple locations · 100% fresh)
6. **Find a Machine:** 4 location cards with Directions + Open in Maps (Greenhills, Eastwood, Uptown BGC, Parqal)
7. **What's Next:** Fresh-fruit teaser (Fruitty Dippy / fruit cups / catering)
8. **Own an OMJ Machine:** Franchise CTA → /contact/?inquiry=franchising
9. **Questions?:** Contact Us CTA
10. **Final CTA:** "Ready for Real Orange Juice?" + Find a Machine + Contact Us

## About (ID 25, slug `/about/`)

**Built via `omj_set_page_html(25, …)`.**

Sections:
1. **Hero:** Orange horizontal logo + "About Us" heading
2. **Our Story:** Short origin line + scannable Why OMJ bullets (Real oranges · Nothing artificial · Freshly squeezed in under a minute)
3. **The Machine:** 2-photo grid (machine with oranges, vending machine)
4. **Franchise CTA:** Green band, "Own an OMJ Machine" → /contact/?inquiry=franchising

## Contact Us (ID 21, slug `/contact/`)

Elementor container layout (kept existing Elementor Pro form). Sections:
1. **Hero:** OMJ Icon, "We'd love to hear from you!" heading, intro text + email
2. **Contact Form + Locations:**
   - **Contact Us** heading (OMJ-Green)
   - **Form** (Elementor Pro Form, id "contactus"):
     - Fields: Name, Inquiry Type (I want to order online / Rent a machine / Franchising / Others), Message, Email, Mobile, reCAPTCHA v3
     - Sends to: contactus@ohmyjuiceness.com, BCC: ginovictorino@ymail.com
   - **Locations:** Uptown Mall BGC, Parqal Mall Paranaque, Greenhills San Juan, Eastwood Quezon City
   - **Instagram:** @ohmyjuiceness
   - **Inquiry preselect:** Script reads `?inquiry=franchising` from URL to preselect Inquiry Type

## Header (ID 79)

Green bar, logo (media 83), nav (Home / About / Contact), primary CTA button "Contact Us" → `/contact/`. **No "Order Now."**

## Footer (ID 241)

Green footer, OMJ logo, Instagram @ohmyjuiceness link + QR, copyright "© 2026 Oh My Juiceness. All Rights Reserved."

## Privacy Policy (ID 3, slug `/privacy-policy/`)

Default WordPress page — no changes.

## Staging Revision Preview (created 2026-07-09)

These pages preview the revision round without replacing live Home/About/Contact:

| ID | Slug | Purpose |
|---|---|---|
| 526 | `/home-staging/` | Product-first Home revision preview |
| 528 | `/about-staging/` | Shorter About story, no bottle imagery |
| 530 | `/contact-staging/` | Contact copy/location fixes, with live form behavior documented |

The staging pages are deployed by `build/scripts/create-staging.php` and use `build/pages/*-staging.html`. They contain body content only; Elementor Theme Builder supplies the site header/footer.

## Brand Assets (Media IDs)

| Asset | ID |
|---|---|
| Site Logo (green horizontal) | 83 |
| Favicon (orange slice) | 59 |
| Orange horizontal logo | 151 |
| OMJ Icon (white BG) | 397 |
| OMJ Icon (orange BG) | 94 |
| Hero poster | 507 |
| Machine vendo | 484 |
| Machine parqal | 497 |
| Greenhills location | 481 |
| Eastwood location | 482 |
| Uptown location | 486 |
| Parqal location | 493 |
| IG QR | 490 |
| OMJ Icon (new upload) | 491 |
