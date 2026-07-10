# Design System

Summary of site-wide brand styling, color palettes, typography, and Elementor Site Settings configurations.

## Color Palette

### System Colors
| Role | ID | Color |
|---|---|---|
| Primary | `primary` | `#FF8E06` (OMJ Orange) |
| Secondary | `secondary` | `#F7F5E9` (Cream/Off-white) |
| Text | `text` | `#484544` (Warm dark gray) |
| Accent | `accent` | `#167A45` (OMJ Green) |

### Custom Colors
| Name | ID | Color |
|---|---|---|
| OMJ-White | `eaa2dbc` | `#FFFFFF` |
| OMJ-Orange | `d202595` | `#FF8E06` |
| OMJ-Red-Orange | `fe34f6d` | `#E24F14` |
| OMJ-Green | `dcf100f` | `#167A45` |
| OMJ-Dark-Green | `6028203` | `#0F5230` |
| OMJ-Mustard-Yellow | `a6f8ea4` | `#F9B710` |
| OMJ-Light-Blue | `65548d4` | `#9ADBEF` |
| Full Transparency | `a274f70` | `#E9612C00` |
| Site BG | `4d87a07` | `#F5F4E7` |
| Beige BG | `21ebaa4` | `#F5F4E7` |
| Pink BG | `9182bce` | `#FCE4F7` |

## Typography

### System Fonts
| Role | Font | Weight | Size | Transform | Line Height |
|---|---|---|---|---|---|
| Primary (headings) | **Augillion** | 400 | 100px (65 tablet / 36 mobile) | — | 0.8em |
| Secondary | **Carnero W04** | 700 | 36px (24 tablet / 22 mobile) | UPPERCASE | 1.1em |
| Body Text | **Poppins** | 400 | 18px (16 tablet / 14 mobile) | none | 1.5em |
| Accent Text | **Poppins** | 700 | 36px (28 tablet / 24 mobile) | — | 1em |

### Custom Typography
| Name | Font | Weight | Size | Style | Notes |
|---|---|---|---|---|---|
| Special Headline | Poppins | 400 | 22px (18t/16m) | italic, capitalize | Letter-spacing 10px (5t/2m) |
| Accent Text Small | Poppins | 400 | 14px (12t) | uppercase, italic, underline | Letter-spacing 2px |
| Features Title | Carnero W04 | 400 | 22px (18t) | uppercase | Letter-spacing 5px (2t/0.5m) |
| Nav Menu | Poppins | 500 | 16px (14t) | none | Letter-spacing 1.5px (1t/0.5m) |
| Body Text Small | Poppins | 400 | 16px (14t/12m) | none | Line-height 1.5em |
| Info Title | Poppins | 600 | 18px (16t/14m) | capitalize | — |

## Elementor Site Settings (Kit 9)

- **Body Background:** `#F5F4E7` (warm beige)
- **Header Width:** `full-width`
- **Header Logo Width:** `220px` (`180px` tablet / `150px` mobile)
- **Header Menu:** WP Menu ID 19, dropdown: mobile, Font: Poppins 500, 16px, `#FFFFFF`
- **Footer Width:** `full-width`
- **Footer Logo Width:** `220px` (`180px` tablet / `150px` mobile)
- **Footer Copyright:** `"© 2026 Oh My Juiceness. All Rights Reserved."`
- **Container Width:** `1680px`
- **Container Padding:** `0px` all
- **Viewport Breakpoints:** md: `768px`, lg: `1025px`

## Custom Brand CSS (`omj-brand.css`)

All custom CSS classes are namespaced with `omj-`. The main classes defined are:
- `.omj-hero`: For hero banners and layout wrappers.
- `.omj-btn`: Customized buttons utilizing the brand color scheme.
- `.omj-icon-tiles`: Interactive or layout tiles showcasing features.
- `.omj-stat-band`: Stats layout with clean grid styles.
- `.omj-loc-grid`: Layout grid for locations.
- `.omj-loc-card`: Custom styles for individual location elements.
- `.omj-header` / `.omj-footer`: Chrome wrapper styling override.

## Photo Filters
Photo filters are applied to real-life photos across Home and Contact pages to establish consistent visuals:
`filter: brightness(136%) contrast(92%) saturate(137%);`
