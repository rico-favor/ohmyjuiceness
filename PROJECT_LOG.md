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
