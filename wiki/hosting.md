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

## CDN Caching (Cloudflare) — deploy gotcha

Static assets under `wp-content/mu-plugins/omj-assets/` are edge-cached by Cloudflare for 7 days, and LiteSpeed's "remove query strings" (`optm-qs_rm=1`) strips the `?ver=filemtime` cache-buster from enqueued URLs — so uploading a new `omj-map.js`/`omj-brand.css` does NOT reach visitors until the file is purged from Cloudflare.

- The WP Cloudflare plugin and LiteSpeed CDN settings hold **no** API credentials; `wp litespeed-purge all` fails with `Got 400`.
- Working purge: Cloudflare API token in `~/Git/gvbasketball/.env` (`CLOUDFLARE_API_TOKEN`, same account). Zone ID for ohmyjuiceness.com: `d4c80986aa4c981ad2f8db9802e698e8`.

```bash
source ~/Git/gvbasketball/.env
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/d4c80986aa4c981ad2f8db9802e698e8/purge_cache" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
  --data '{"files":["https://ohmyjuiceness.com/wp-content/mu-plugins/omj-assets/omj-map.js"]}'
```

After any asset upload: purge the touched asset URLs (and `/`, `/contact/` if page HTML changed), then verify with `curl -sI <url> | grep cf-cache-status`.

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
