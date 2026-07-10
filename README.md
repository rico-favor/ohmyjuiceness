# Oh My Juiceness — Website Repository

**Oh My Juiceness** is a custom-built website for a fresh juice bar chain in Manila, Philippines. This repository contains the build system, design assets, and deployment scripts for the live WordPress site at **https://ohmyjuiceness.com**.

## Project Overview

The site features:
- **Home page** with full-bleed hero imagery and location gallery
- **About page** with brand story and product showcase
- **Contact page** with location details and embedded contact form
- **Responsive design** optimized for mobile-first delivery
- **Brand consistency** using a custom design system (green + orange palette)

## Tech Stack

- **CMS**: WordPress on Hostinger
- **Page Builder**: Elementor (for theme templates only)
- **Frontend**: Custom HTML + CSS (decoupled from Elementor editor)
- **Deployment**: PHP build helpers + SSH automation
- **Asset Management**: Custom mu-plugins for CSS/HTML injection

## Repository Structure

```
build/                          # Local build source of truth
├── pages/                       # HTML page templates
│   ├── home-staging.html        # Live home page
│   ├── about.html               # Live about page
│   ├── contact-staging.html     # Live contact page
│   └── about-staging.html       # Staging preview
├── assets/                      # CSS, fonts, images
│   ├── css/                     # Brand stylesheet
│   ├── fonts/                   # Local font files
│   └── img/                     # Photos and SVG icons
├── mu-plugins/                  # WordPress PHP helpers
│   ├── omj-brand.php           # CSS enqueue + redirects
│   └── omj-build.php           # Page/block setter functions
├── scripts/                     # Deployment automation
│   ├── deploy.php              # Ship build to live site
│   ├── create-staging.php      # Create staging pages
│   └── revert.php              # Rollback to old pages
└── templates/                   # Header/footer templates

archive/                        # Frozen historical material
├── revisions/                   # Client revision briefs & raw photos
├── build-preview/              # Deprecated standalone previews
├── docs/                        # Completed reports & handoffs
└── root-assets/                # Working artifacts

wiki/                           # Persistent knowledge base
├── index.md                     # Wiki overview
├── architecture.md              # Build workflow & page structure
├── design-system.md             # Colors, typography, CSS
├── hosting.md                   # Server credentials & config
└── log.md                       # Chronological project history

docs/                           # Active deliverables
├── 2026-07-10-client-flags.md  # Open items awaiting client
└── superpowers/                # Planning, specs, tools

JULY-CHANGES.html              # Current client-facing report
AGENTS.md                       # Local Claude Code instructions
```

## Key Pages & Deployment

### Live Pages

| Page | WordPress ID | Slug | Source | Built With |
|------|---|---|---|---|
| **Home** | 526 | `/` | `build/pages/home-staging.html` | Custom HTML |
| **About** | 25 | `/about/` | `build/pages/about.html` | Custom HTML |
| **Contact** | 530 | `/contact/` | `build/pages/contact-staging.html` + form widget | Hybrid |
| **Privacy Policy** | 3 | `/privacy-policy/` | Default WordPress | — |

### Theme Builder (Elementor)

| Template | ID | Type |
|---|---|---|
| Default Header | 79 | header |
| Default Footer | 241 | footer |

## Build & Deployment

### Local Workflow

1. **Edit source files** in `build/pages/`, `build/assets/`, etc.
2. **Build HTML/CSS locally** (files are ready to deploy as-is)
3. **Test in browser** before shipping
4. **Run deployment script** to upload to Hostinger

### Deployment Process

```bash
# Deploy home page
php build/scripts/deploy.php home

# Deploy all pages
php build/scripts/deploy.php all
```

The deployment script:
1. Connects via SSH to Hostinger
2. Uploads HTML + CSS to `/wp-content/mu-plugins/omj-assets/`
3. Calls WordPress build helpers to inject pages with `omj_set_page_html()`
4. Updates Elementor page/block metadata

### Custom WordPress Helpers

Located in `/wp-content/mu-plugins/omj-build.php`:

```php
// Set entire page as single HTML widget
omj_set_page_html($page_id, $html)

// Set page as ordered block array
omj_set_page_blocks($page_id, [
    ['type'=>'html', 'content'=>$html1, 'css'=>$css1],
    ['type'=>'shortcode', 'content'=>'[my_shortcode]'],
])

// Set theme templates
omj_set_theme_part($title, 'header'|'footer', $html)
```

> **⚠️ Known Issue**: Elementor 4.1.4's native HTML widget renders empty. Workaround: build helpers wrap custom HTML inside `text-editor` widget type.

## Brand Design System

See [`wiki/design-system.md`](wiki/design-system.md) for full specs. Quick reference:

**Colors**:
- Primary Green: `#3ba55d` (logo, accents)
- Bright Orange: `#ff6b35` (CTAs, highlights)
- Neutral Gray: `#2d2d2d` (text)

**Typography**:
- Headlines: Poppins Bold
- Body: Inter Regular
- Fonts loaded locally in `build/assets/fonts/`

**Layout**:
- Mobile-first, 320px+
- Breakpoints: 768px (tablet), 1024px (desktop)
- Utility CSS in `build/assets/css/omj-brand.css`

## Wiki & Documentation

The repository includes a **persistent LLM wiki** for long-term knowledge:

- **[Hosting & Access](wiki/hosting.md)** — Server credentials, plugins, env config
- **[Architecture & Workflows](wiki/architecture.md)** — Build system details, page IDs, deployment
- **[Design System](wiki/design-system.md)** — Colors, typography, CSS classes
- **[Project Log](wiki/log.md)** — Chronological ledger of all tasks and releases

> See [`wiki/index.md`](wiki/index.md) for full index.

## Archive

Material from completed work is frozen in `archive/` and does **not** affect the live site:

- `revisions/` — Client briefs & raw photos (input material)
- `build-preview/` — Old standalone previews (deprecated, drifted)
- `docs/` — Completed handoff plans & specs

The live source of truth is always `build/pages/*.html` and `build/mu-plugins/omj-assets/omj-brand.css`.

## Development Notes

### No package.json / Build Tool

This is **not** a Node/npm project. Pages are plain HTML + CSS, built locally in `build/` and deployed via PHP scripts. No build step needed.

### Screenshot & QA

- Use `docs/superpowers/handoff/capture.mjs` (Playwright) to auto-generate QA screenshots
- Screenshots serve as visual regression tests before deployment
- See `JULY-CHANGES.html` (root) for the current client report

### Staging & Testing

Create staging previews for client review:

```bash
php build/scripts/create-staging.php
```

This generates pages at `/about-staging/`, `/contact-staging/` (linked from main pages for comparison).

> ⚠️ **Post go-live warning**: Do not rerun `create-staging.php` without review. Use `omj_set_page_html(page_id, $html)` instead.

## Git Workflow

- **Main branch** is production-ready
- **Commits** follow the format: `feat:`, `fix:`, `docs:`, `chore:` (see recent commits)
- **CLAUDE.md** & **AGENTS.md** contain Claude Code instructions for automated tasks

## Quick Links

| Resource | Purpose |
|---|---|
| [`wiki/`](wiki/) | Knowledge base for long-term reference |
| [`JULY-CHANGES.html`](JULY-CHANGES.html) | Current client deliverable report |
| [`docs/2026-07-10-client-flags.md`](docs/2026-07-10-client-flags.md) | Open client action items |
| [`AGENTS.md`](AGENTS.md) | Local Claude Code automation rules |
| [`archive/README.md`](archive/README.md) | What's in archive, why |

## Contact & Support

- **Live Site**: https://ohmyjuiceness.com
- **Project Owner**: Rico Tiongson
- **Email**: techteam@favor.church
- **CMS Hosting**: Hostinger (WordPress + Elementor)

---

**Last Updated**: 2026-07-10 | **Status**: Live ✅ | **Built with**: Custom HTML + CSS + WordPress
