# Architecture & Build Workflow

The front-end design is decoupled from Elementor editor, using hand-written HTML and a centralized CSS design system. These files are built in `build/` locally, then uploaded over SSH to Hostinger and applied using custom PHP WordPress build helpers.

## Custom mu-plugins

Custom WordPress logic resides in `/wp-content/mu-plugins/`:

| Plugin | Purpose |
|---|---|
| `omj-brand.php` | Enqueues the custom brand stylesheet (`omj-brand.css`) site-wide. |
| `omj-build.php` | Exposes build helpers to programmatically inject HTML widgets and template structures. |

## Build Helpers (in `omj-build.php`)

| Helper | Use |
|---|---|
| `omj_set_page_html($id, $html)` | Page = one full-width HTML widget |
| `omj_set_page_blocks($id, $blocks)` | Page = ordered `['type'=>'html'\|'shortcode','content'=>..,'css'=>..]` widgets |
| `omj_set_theme_part($title,$type,$html)` | Theme Builder header/footer from HTML (`$type`=`header`\|`footer`) |
| `omj_set_theme_part_blocks($title,$type,$blocks)` | …from html/shortcode blocks |
| `omj_ensure_page($slug,$title)` | Idempotent page create |

> [!NOTE]
> Elementor 4.1.4's HTML widget (`widgetType: html`) renders empty on the frontend due to a known bug. As a workaround, the build helpers wrap custom HTML inside a `text-editor` widget type.

## Page Structures

### Live Pages

At go-live (2026-07-10, commit `fb5a895`) the v2 staging pages 526/530 were promoted **in place** to serve `/` and `/contact/` (front page = 526; `contact` slug moved to 530). The old Home (35) and Contact (21) are Draft but recoverable (`build/scripts/revert.php`). `/home-staging/` and `/contact-staging/` 301-redirect to the live URLs (see `omj-brand.php`).

| ID | Title | Slug | Build Method / Source |
|---|---|---|---|
| 526 | Home (promoted staging) | `/` | `omj_set_page_html(526, …)` <- `build/pages/home-staging.html` |
| 25 | About | `/about/` | `omj_set_page_html` <- `build/pages/about.html` |
| 530 | Contact (promoted staging) | `/contact/` | fragment via `build/scripts/update-contact-fragment.php` <- `build/pages/contact-staging.html` + cloned Elementor Pro form widget |
| 3 | Privacy Policy | `/privacy-policy/` | Default WordPress theme page |
| 35 | Old Home | — (draft) | retired at go-live |
| 21 | Old Contact | — (draft) | retired at go-live; still holds the source form widget cloned into 530 |

> [!WARNING]
> Do **not** rerun `build/scripts/create-staging.php` post-go-live: it looks pages up by the retired `home-staging`/`contact-staging` slugs and would create duplicate pages. Use `omj_set_page_html(526, …)` for home and `update-contact-fragment.php` for contact.

### Staging Preview Pages

| ID | Title | Slug | Build Source |
|---|---|---|---|
| 528 | OMJ About Staging — New Design Preview | `/about-staging/` | `build/pages/about-staging.html` |

`build/preview/` (standalone local previews) has drifted from the deployed fragments since go-live and is reference-only; the canonical sources are `build/pages/*-staging.html` + `build/mu-plugins/omj-assets/omj-brand.css`.

### Theme Builder Templates

Managed via Elementor Theme Builder.

| ID | Title | Type |
|---|---|---|
| 79 | OMJ \| Default Header GREEN | header |
| 241 | OMJ Default Footer | footer |

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
