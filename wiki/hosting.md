# Hosting & Access

Details on server environment, connection settings, and active plugins.

## Server Connection

The site is hosted on Hostinger Premium (shared), under the same account as gvbasketball. All operations are run over SSH.

- **SSH Alias:** `omj` (defined in `~/.ssh/config`)
  - **HostName:** `37.44.245.74`
  - **Port:** `65002`
  - **User:** `u907133977`
  - **IdentityFile:** `~/.ssh/id_gvweb`
- **WordPress Root:** `/home/u907133977/domains/ohmyjuiceness.com/public_html`
- **PHP Version:** 8.2
- **WP-CLI:** Installed and active (`wp ...`)

## Site Identity

| Setting | Value |
|---|---|
| Site URL | `https://ohmyjuiceness.com` |
| Site Name | Oh My Juiceness! |
| Tagline | (empty) |
| WordPress | 7.0 |
| Theme | Hello Elementor 3.4.4 |
| Page Builder | Elementor 4.1.4 + Elementor Pro 3.29.2 |
| Elementor Kit ID | 9 (accent green: `#167A45`) |

## Active Plugins

| Plugin | Slug | Version | Status |
|---|---|---|---|
| Akismet | `akismet/akismet.php` | 5.7 | active |
| Cloudflare | `cloudflare/cloudflare.php` | 4.14.3 | active |
| Duplicate Page | `duplicate-page/duplicatepage.php` | 4.5.9 | active |
| Elementor | `elementor/elementor.php` | 4.1.4 | active |
| Elementor Pro | `elementor-pro/elementor-pro.php` | 3.29.2 | active |
| Google Site Kit | `google-site-kit/google-site-kit.php` | 1.181.0 | active |
| Hostinger | `hostinger/hostinger.php` | 3.0.70 | active |
| Hostinger Easy Onboarding | `hostinger-easy-onboarding/hostinger-easy-onboarding.php` | 2.1.29 | active |
| LiteSpeed Cache | `litespeed-cache/litespeed-cache.php` | 7.8.1 | active |
| Post SMTP | `post-smtp/postman-smtp.php` | 3.9.5 | active |
| Site Reviews | `site-reviews/site-reviews.php` | 8.0.12 | active |
| UpdraftPlus | `updraftplus/updraftplus.php` | 1.26.5 | active |
| Wordfence | `wordfence/wordfence.php` | 8.2.2 | active |
| Conditional Fields for Elementor Form | `conditional-fields-for-elementor-form/cf-ef.php` | 1.7.2 | inactive |
