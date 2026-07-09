# Oh My Juiceness — Live WordPress/Elementor Configuration

Updated 2026-07-09 after full revision deployment.

## Site Identity

| Setting | Value |
|---|---|
| Site URL | `https://ohmyjuiceness.com` |
| Site Name | Oh My Juiceness! |
| Tagline | (empty) |
| Permalink Structure | `/%postname%/` |
| WordPress Version | 7.0 |
| PHP Version | 8.2 |
| Elementor Kit ID | 9 (accent green: `#167A45`) |

## Active Theme

- **Hello Elementor 3.4.4** (active) — the standard blank canvas theme for Elementor-built sites.

## Active Plugins (13)

| Plugin | Slug |
|---|---|
| Akismet | `akismet/akismet.php` |
| Cloudflare | `cloudflare/cloudflare.php` |
| Duplicate Page | `duplicate-page/duplicatepage.php` |
| Elementor | `elementor/elementor.php` |
| Elementor Pro | `elementor-pro/elementor-pro.php` |
| Google Site Kit | `google-site-kit/google-site-kit.php` |
| Hostinger | `hostinger/hostinger.php` |
| Hostinger Easy Onboarding | `hostinger-easy-onboarding/hostinger-easy-onboarding.php` |
| LiteSpeed Cache | `litespeed-cache/litespeed-cache.php` |
| Post SMTP | `post-smtp/postman-smtp.php` |
| Site Reviews | `site-reviews/site-reviews.php` |
| UpdraftPlus | `updraftplus/updraftplus.php` |
| Wordfence | `wordfence/wordfence.php` |

## Pages (4)

| ID | Title | Slug | Build Method |
|---|---|---|---|
| 35 | Home | `/` | `omj_set_page_html` (text-editor widget) |
| 25 | About | `/about/` | `omj_set_page_html` (text-editor widget) |
| 21 | Contact Us | `/contact/` | Elementor Pro form + surgical edits |
| 3 | Privacy Policy | `/privacy-policy/` | Default WordPress |

## Theme Builder Templates

| ID | Title | Type |
|---|---|---|
| 79 | OMJ \| Default Header GREEN | header |
| 241 | OMJ Default Footer | footer |

## Custom mu-plugins

| Plugin | Purpose |
|---|---|
| `omj-brand.php` | Enqueues `omj-brand.css` design system site-wide |
| `omj-build.php` | Build helpers: `omj_set_page_html`, `omj_set_page_blocks`, `omj_set_theme_part`, `omj_ensure_page` |
| `hostinger-preview-domain.php` | Hostinger default (pre-existing) |

## Design System

- **CSS:** `wp-content/mu-plugins/omj-assets/omj-brand.css`
- **Palette:** Orange `#FF8E06`, Red-Orange `#E24F14`, Green `#167A45`, Dark Green `#0F5230`, Cream `#F7F5E9`, Text `#484544`
- **Fonts:** Augillion (display), Poppins (body)
- **Component classes:** `.omj-hero`, `.omj-section`, `.omj-btn`, `.omj-icon-tiles`, `.omj-stat-band`, `.omj-loc-grid`, `.omj-loc-card`, `.omj-header`, `.omj-footer`

## Current State

The site is fully built with a **product-first premium design**. All pages are authored in `build/` and deployable via the golden workflow. The design system CSS is live site-wide. Elementor Kit green has been reconciled to `#167A45`.

**Known limitation:** Elementor 4.1.4 HTML widget (`widgetType: html`) renders empty on frontend. Build helpers use `text-editor` widget type as a workaround.
