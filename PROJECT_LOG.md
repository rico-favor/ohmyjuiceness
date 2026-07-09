# Oh My Juiceness — Website Build Log & Runbook

Live site: **https://ohmyjuiceness.com** — a WordPress + Elementor website on Hostinger.

This document is the source of truth for how the site is built and how to change it. The actual
custom source lives in [`build/`](build/) (also deployed to the live server's `wp-content/`).

---

## 1. Hosting & access

| Thing | Value |
|---|---|
| Platform | Hostinger Premium (shared) — same account as gvbasketball |
| WordPress | 7.0 · PHP 8.2 |
| Theme | Hello Elementor 3.4.4 (active) |
| Page builder | **Elementor 4.1.4 + Elementor Pro 3.29.2** |
| SSH alias | `omj` (user `u907133977`) |
| WP root | `/home/u907133977/domains/ohmyjuiceness.com/public_html` |
| Origin IP | `37.44.245.74` |

All work is done over SSH + WP-CLI. Secrets live in the local `.env` (gitignored).

---

## 2. Active plugins

| Plugin | Version | Status |
|---|---|---|
| Akismet | 5.7 | active |
| Cloudflare | 4.14.3 | active |
| Conditional Fields for Elementor Form | 1.7.2 | inactive |
| Duplicate Page | 4.5.9 | active |
| Elementor | 4.1.4 | active |
| Elementor Pro | 3.29.2 | active (update available: 4.1.2) |
| Google Site Kit | 1.181.0 | active |
| Hostinger | 3.0.70 | active |
| Hostinger Easy Onboarding | 2.1.29 | active |
| LiteSpeed Cache | 7.8.1 | active |
| Post SMTP | 3.9.5 | active |
| Site Reviews | 8.0.12 | active |
| UpdraftPlus | 1.26.5 | active |
| Wordfence | 8.2.2 | active |

---

## 3. Architecture (to be built)

The front end will follow the same pattern as gvbasketball: **hand-crafted HTML + a shared CSS
design system**, mounted inside Elementor so pages stay Elementor-native. Must-use plugins:

- **`wp-content/mu-plugins/omj-brand.php`** → enqueues the design system CSS site-wide
- **`wp-content/mu-plugins/omj-build.php`** → build helpers (page/theme-part setters)
- Additional mu-plugins as needed for forms, email branding, etc.

---

## 4. Changelog

### 2026-07-09 — Repository initialized
- Created local git repo with SSH config, AGENTS.md, and build scaffolding.
- SSH alias `omj` added to `~/.ssh/config` (same Hostinger account as `gvweb`).
- Verified live site: vanilla WordPress 7.0, Hello Elementor, Elementor Pro, standard plugin set.
- No changes made to the live site in this session.

### 2026-07-09 — Full website revision (10-point client brief)

**Deployed:**
- `omj-brand.php` + `omj-build.php` mu-plugins (activated on live server)
- `omj-brand.css` design system: blend palette (`--omj-orange` #FF8E06, `--omj-green` #167A45, `--omj-red-orange` #E24F14, `--omj-dark-green` #0F5230, `--omj-cream` #F7F5E9), component classes (hero, buttons, icon tiles, stat band, location grid)
- Elementor Kit ID 9: accent green reconciled from #2D8762 → #167A45

**Home page (ID 35) — Flow A, 10 sections:**
1. Hero — full-bleed video (poster fallback) with headline "Freshly Squeezed. Every Cup. Every Time."
2. The Machine — oranges → squeezing → cup photo grid
3. Why OMJ — 5 emoji icon tiles (100% Fresh Oranges, No Water Added, No Added Sugar, Served Fresh, Ready in Under 60 Seconds)
4. Product showcase — machine-only + lifestyle crops
5. By the Numbers — green stat band (500,000+ oranges, thousands of cups, multiple locations, 100% fresh)
6. Find a Machine — 4 location cards with verified Google Maps links (Greenhills, Eastwood, Uptown BGC, Parqal)
7. What's Next — fresh-fruit teaser (Fruitty Dippy / fruit cups / catering)
8. Own an OMJ Machine — franchise CTA → /contact/?inquiry=franchising
9. Questions? — contact CTA
10. Final CTA — "Ready for Real Orange Juice?"

**About page (ID 25):** Rebuilt — no bottle image, scannable Why OMJ bullets, one-line origin, franchise relabeled "Own an OMJ Machine"
**Contact page (ID 21):** Locations fixed (Eastwood replaces San Antonio), franchising preselect script added
**Header (ID 79):** Green bar, logo, nav, "Contact Us" CTA — no "Order Now"
**Footer (ID 241):** Green footer, @ohmyjuiceness IG, "© 2026 Oh My Juiceness. All Rights Reserved."

**Photos processed:** 27 location/product photos (auto-oriented, resized to ≤1600px, uploaded to WP media)
**Hero deliverable:** Veo prompt + source image + poster fallback (client to supply video)
**Maps links:** Verified for all 4 locations (mall-level pins)
**Old content removed:** "Order Now" button, "Leave a Reply" form, "Coming After Summer" popup, bottle imagery, "Delivered Around the Metro" claim
**Elementor fix:** HTML widget rendering issue resolved by switching to text-editor widget type

**Key finding:** Elementor 4.1.4 HTML widget (`widgetType: html`) renders empty on frontend. Workaround: use `text-editor` widget with `editor` setting key. Updated `omj-build.php` accordingly.
