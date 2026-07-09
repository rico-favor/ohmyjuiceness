# Oh My Juiceness — Live WordPress/Elementor Configuration

Pulled from `ohmyjuiceness.com` via SSH on 2026-07-09.

## Site Identity

| Setting | Value |
|---|---|
| Site URL | `https://ohmyjuiceness.com` |
| Site Name | Oh My Juiceness! |
| Tagline | (empty) |
| Permalink Structure | `/%postname%/` |
| WordPress Version | 7.0 |
| PHP Version | 8.2 |
| Elementor Kit ID | 9 |

## Active Theme

- **Hello Elementor 3.4.4** (active) — the standard blank canvas theme for Elementor-built sites.
- Inactive: TwentyTwentyFive 1.2, TwentyTwentyFour 1.3, TwentyTwentyThree 1.6.

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

| ID | Title | Slug | Status |
|---|---|---|---|
| 35 | Home | `/` | publish |
| 25 | About | `/about/` | publish |
| 21 | Contact Us | `/contact/` | publish |
| 3 | Privacy Policy | `/privacy-policy/` | publish |

## Posts (1)

| ID | Title | Slug | Status |
|---|---|---|---|
| 1 | Hello world! | `/hello-world/` | publish (default starter post) |

## Elementor Configuration

- **CPT support:** `post`, `page` (Elementor editor enabled on both)
- **Active Kit:** post ID 9
- **Global Colors / Fonts:** not yet customized (using Elementor defaults)
- **Theme Builder Templates:** none yet (no header/footer overrides)
- **Custom mu-plugins:** only `hostinger-preview-domain.php` (Hostinger default)

## Current State

This is a **vanilla WordPress + Elementor setup** with minimal content. The front end has not yet
been customized with the Oh My Juiceness brand. The site uses the default Elementor starter content
plus a few manually created pages (Home, About, Contact Us, Privacy Policy).

No custom CSS design system, no custom mu-plugins for page building, and no Elementor Theme Builder
templates exist yet. The `build/` directory in the local repo contains the scaffolding for the
custom build system that will be deployed.
