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

| ID | Title | Slug | Build Method / Source |
|---|---|---|---|
| 35 | Home | `/` | `omj_set_page_html` -> `build/preview/home.html` (10 sections) |
| 25 | About | `/about/` | `omj_set_page_html` -> `build/pages/about.html` |
| 21 | Contact Us | `/contact/` | Elementor Pro form + custom franchising preselect script |
| 3 | Privacy Policy | `/privacy-policy/` | Default WordPress theme page |

### Staging Preview Pages

These pages are deployed via `build/scripts/create-staging.php` and contain only body HTML (`build/pages/*-staging.html`). Header/footer chrome are inherited from Elementor Theme Builder.

| ID | Title | Slug | Build Source |
|---|---|---|---|
| 526 | OMJ Home Staging — New Design Preview | `/home-staging/` | `build/pages/home-staging.html` |
| 528 | OMJ About Staging — New Design Preview | `/about-staging/` | `build/pages/about-staging.html` |
| 530 | OMJ Contact Staging — New Design Preview | `/contact-staging/` | `build/pages/contact-staging.html` |

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
