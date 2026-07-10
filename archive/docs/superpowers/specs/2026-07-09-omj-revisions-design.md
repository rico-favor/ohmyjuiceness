> **📦 ARCHIVED — DONE — design spec for the completed revision work.**
> Frozen 2026-07-10; see [`archive/README.md`](../README.md). Internal links may be stale.

# Oh My Juiceness — Website Revision Design Spec

**Date:** 2026-07-09
**Status:** Approved (design), pending implementation plan
**Site:** https://ohmyjuiceness.com (WordPress 7.0 + Elementor Pro on Hostinger)
**Source of truth for build mechanics:** [`AGENTS.md`](../../../AGENTS.md), [`PROJECT_LOG.md`](../../../PROJECT_LOG.md)

---

## 1. Background & problem

The client reviewed the live site and delivered a 10-point revision brief (`revisions/OMG Revisions.pdf`)
plus inline photo annotations. Core complaint: the site reads generic, leads with **people** instead of
**product**, hides the vending machine (the actual competitive advantage), and has too much long-form text.
The client wants a **premium, product-first experience** — "open the site and within 5 seconds think *I want
to try that*" — modeled on brands like Apple.

The client also flagged a longer-term direction: evolve OMJ from "a vending-machine company" into a broader
**fresh-fruit brand** (Fruitty Dippy, chocolate-dipped fruit, fresh fruit cups, seasonal offerings, catering).

### Current live state (verified 2026-07-09)
- The live site is fully built and styled, but authored **directly in Elementor + raw HTML** in `post_content`.
- The `build/` mu-plugin "design system" (`omj-brand.php`, `omj-build.php`, `omj-assets/omj-brand.css`) is
  **scaffolded locally but not deployed** — `omj-brand.css` is a stub with placeholder tokens.
- Pages: Home (ID 35, raw HTML), About (ID 25, Elementor), Contact Us (ID 21, Elementor), Privacy Policy (ID 3).
- Elementor Kit ID 9 defines the live palette/typography.

---

## 2. Decisions locked with client

| # | Decision | Choice |
|---|---|---|
| 1 | Build approach | **Rebuild via the `build/` HTML-widget system** (deploy the documented golden workflow) |
| 2 | Scope | **Full**: Home + About + Contact + header/footer + franchise + fresh-fruit positioning |
| 3 | Hero media | Autoplay muted looping **video slot**; client generates the clip via Gemini Veo from a **prompt + source image we deliver**; poster-image fallback until then |
| 4 | "Order Online" / "Order Now" | **No online ordering / no delivery.** "Order" routes to the contact form; "Order Now" removed from header |
| 5 | Fresh-fruit pivot depth | **Positioning + teaser** as floor; build a fuller "What's Next" section using cup-design art + `codex-imagegen` placeholder imagery if quality holds |
| 6 | Brand colors | **Blend**: keep Orange `#FF8E06`, adopt cup-spec deep green `#167A45` (replacing `#2D8762`) |
| 7 | Stats | Use the brief's numbers **as-is** (approved copy) |
| 8 | Header primary CTA | **Contact Us** |
| 9 | Live locations | **4**: Greenhills, Eastwood, Uptown BGC, Parqal (Maps links to be found + verified) |
| 10 | Machine photos | **Mix**: machine-only crops for hero/product + a few consented lifestyle shots |
| 11 | Franchise "Join the Waitlist" | Routes to **contact form with Franchising preselected** |
| 12 | About "Our Story" | Replace long paragraph with scannable **Why OMJ** bullets + one-line origin |
| 13 | Home page flow | **Flow A — Product-first premium** (10-section order below) |
| 14 | Hero treatment | **Full-bleed video**, headline centered over subtle gradient |

---

## 3. Design system (`build/mu-plugins/omj-assets/omj-brand.css`)

Replace the stub with a real, namespaced (`omj-`) design system.

### Color tokens
| Token | Value | Use |
|---|---|---|
| `--omj-orange` | `#FF8E06` | primary brand / buttons |
| `--omj-red-orange` | `#E24F14` | accents, final CTA, hovers |
| `--omj-green` | `#167A45` | headings, header/footer, brand green (cup-spec, replaces `#2D8762`) |
| `--omj-dark-green` | `#0F5230` | green hover/depth |
| `--omj-cream` | `#F7F5E9` | page background |
| `--omj-text` | `#484544` | body text |
| `--omj-white` | `#FFFFFF` | — |

Also update **Elementor Kit ID 9** accent green to `#167A45` so native widgets (contact form, etc.) stay on-brand.

### Typography
Keep the existing licensed kit fonts: **Augillion** (display headings) + **Poppins** (body). No font swap —
premium feel derives from spacing, restraint, imagery, and hierarchy.

### Value-prop icons
Replace all green checkmarks with the brief's emoji set, styled as clean pill/tile bullets:
🍊 100% Fresh Oranges · 💧 No Water Added · 🚫 No Added Sugar · ❄️ Served Fresh · ⚡ Ready in Under 60 Seconds.

---

## 4. Home page (ID 35) — Flow A

Rebuilt as one hand-written HTML document mounted via `omj_set_page_html(35, …)`. Sections in order:

1. **Hero** *(rev 1, 5)* — full-bleed autoplay **muted looping** `<video playsinline>` (squeezing/pour) with
   poster fallback; subtle dark bottom gradient for legibility. Headline **"Freshly Squeezed. Every Cup. Every
   Time."**; subhead **"Made from whole oranges. No sugar. No water. No concentrates."**; buttons **Find a
   Machine** (scrolls to §6) + **Watch it squeeze** (scrolls to §2). **No people.**
2. **The Machine** *(rev 2)* — moved high. Shows oranges inside → squeezing process → finished cup. Real
   machine photography; short caption copy.
3. **Why OMJ** *(rev 3, 4)* — the 5 premium emoji bullets as tiles. Short, scannable.
4. **Product showcase** *(rev 5)* — cold cup with condensation, whole oranges, vibrant close-ups; machine-only
   crops + a couple consented lifestyle shots.
5. **By the Numbers** *(rev 9)* — 500,000+ oranges squeezed · thousands of cups served · multiple Metro Manila
   locations · 100% fresh. Green band.
6. **Find a Machine** *(rev 6)* — prominent. 4 location cards (Greenhills, Eastwood, Uptown BGC, Parqal), each
   with a location photo, name, and **Directions** + **Open in Maps** buttons (verified Google Maps URLs).
7. **What's Next** *(pivot)* — fresh-fruit teaser: Fruitty Dippy / fresh fruit cups / catering. Uses cup-design
   orange illustration art + `codex-imagegen` placeholder imagery. Framed as "fresh fruit experiences," not
   "more vending machines."
8. **Own an OMJ Machine** *(rev 8)* — heading **"Own an OMJ Machine"**, subhead **"Join the fastest-growing
   fresh juice concept in the Philippines,"** button **Join the Waitlist** → contact form (Franchising
   preselected). Uses a **real machine photo** (replacing the AI-render the client rejected).
9. **Questions?** *(rev 7)* — Contact Us block (heading "Questions?" + link/button to contact). **Replaces the
   "Leave a Reply" blog comment form**, which is removed.
10. **Final CTA** *(rev 10)* — **"Ready for Real Orange Juice? Find the nearest OMJ machine today."** with
    **Find a Machine** + **Contact Us** buttons.

Footer follows (see §7).

---

## 5. About page (ID 25)

- **Remove the bottle image** ("we don't offer in bottles").
- Replace the long founder paragraph with scannable **Why OMJ** bullets (real oranges · nothing artificial ·
  freshly squeezed in under a minute) + a **single-sentence origin line**.
- Drop the hidden **Team** and **Quotation** sections.
- Relabel franchise CTA to **Own an OMJ Machine** (consistent with Home §8).
- Re-author via the HTML-widget system for version control, matching the new design tokens.

---

## 6. Contact page (ID 21)

- Value-prop card fixes: **"No Added Preservatives"** on a single line (not "no added Preservatives");
  **remove "Delivered Around the Metro"** ("we don't deliver").
- Update the locations list to the current **4** (Greenhills, Eastwood, Uptown BGC, Parqal).
- **Keep** the working Elementor Pro form, Inquiry-Type select, reCAPTCHA v3, and email routing
  (contactus@ohmyjuiceness.com, BCC ginovictorino@ymail.com) unchanged.

---

## 7. Header / footer (sitewide)

- **Remove "Order Now"** button; primary header CTA → **Contact Us**.
- Footer copyright: **"© 2024 Juiceito. All Rights Reserved."** → **"© 2026 Oh My Juiceness. All Rights
  Reserved."**
- Instagram link/QR → **@ohmyjuiceness**.
- Implemented via `omj_set_theme_part()` (Theme Builder header/footer) so it's version-controlled.

---

## 8. Asset pipeline

| Task | Detail |
|---|---|
| Rotate | Auto-correct the 90°-rotated location shots (Parqal, Uptown, Abaca) |
| Crop | Produce machine-only crops (remove people) for hero/product; retain a few consented lifestyle shots |
| Minify | Resize all photos to web size (~1600px longest edge, quality-optimized JPEG/WebP) before upload |
| Upload | Push processed images to WP media library |
| Fresh-fruit art | Generate Fruitty Dippy / fruit-cup placeholder imagery via `codex-imagegen`, styled from `revisions/omj-cup-design.jpg` |
| Maps links | Look up **and verify** Google Maps URLs for all 4 locations (WebSearch + confirm) |
| Hero video | Deliver a ready-to-paste **Gemini Veo prompt + a chosen source image** from the machine photos; hero ships with a poster image until the client provides the clip |
| QR / logo | Use provided IG QR + white-BG circular icon; source files in the client's Google Drive folder |

Source assets: `revisions/` (location photos, cup design), `revisions/omjeastwood/` (Eastwood photos),
`revisions/other-assets/` (QR codes, icon, vending-machine renders), and the client Drive folder
(`https://drive.google.com/drive/folders/1dsV6iJ-uqO_CuVm-cgxWdT2KpHDw5zW3`).

---

## 9. Out of scope (this round)

- Full Fruitty Dippy / fresh-fruit **product pages or e-commerce** (teaser section only).
- Any **real online ordering or delivery** integration.
- New **franchise/waitlist infrastructure** beyond the existing contact form.
- Elementor Pro plugin update (noted available; not part of this work).

---

## 10. Success criteria

- Home leads with product/oranges/juice/machine — **no people above the fold**; the machine appears high on the page.
- All 10 revision points implemented and individually verifiable against the brief.
- Every page authored in `build/` and deployable via the AGENTS.md golden workflow; no orphaned live-only edits.
- Green checkmarks replaced with the emoji icon set; "Order Now" gone; footer year/name corrected.
- 4 Find-a-Machine cards with working, verified Directions / Open-in-Maps links.
- No "Leave a Reply" form anywhere; no bottle imagery; no "delivered around the metro" claim.
- Design tokens applied consistently; Elementor Kit green reconciled to `#167A45`.
- Full DB backup taken before any live write; caches flushed (`wp elementor flush-css && wp litespeed-purge all`) after deploys.

---

## 11. Open items to resolve during implementation

- Verified Google Maps URLs for the 4 locations (agent to confirm).
- Confirm `codex-imagegen` fresh-fruit output quality is good enough for a full §7 section vs. teaser-only fallback.
- Client to supply the Veo-generated hero video (poster fallback ships meanwhile).
