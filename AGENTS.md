# AGENTS.md — Oh My Juiceness site

Operational guide for updating **https://ohmyjuiceness.com** (WordPress on Hostinger). **Edit source in
`build/`, then deploy over SSH.**

**Docs map:**
- [`PROJECT_LOG.md`](PROJECT_LOG.md) — technical build log + changelog (source of truth for how it's built).

---

## 1. Connect (SSH + WP-CLI)

```bash
ssh omj                          # Hostinger account u907133977 (shared with gvbasketball)
# WordPress root (run all wp-cli from here):
cd /home/u907133977/domains/ohmyjuiceness.com/public_html
```

- **SSH alias:** `omj` → `u907133977@37.44.245.74:65002` (key: `~/.ssh/id_gvweb`)
- WP-CLI is installed (`wp ...`). PHP 8.2.
- SSH prints a harmless "post-quantum" warning to stderr; ignore it (filter with
  `2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"`).
- **Always back up before risky DB/file ops.** Use `wp db export` for full backups, or
  snapshot specific tables/options as needed.

---

## 2. The golden workflow (how updates work)

The front end follows the same pattern as gvbasketball: **hand-written HTML + CSS design system**,
mounted into Elementor by must-use plugins. You almost never touch the Elementor editor.
To change the site:

> **edit a file in `build/` → `scp` it to the server → apply with a helper → flush caches.**

After any change:
```bash
wp elementor flush-css && wp litespeed-purge all
```

### Deploy the design system (CSS)
```bash
DEST=/home/u907133977/domains/ohmyjuiceness.com/public_html/wp-content/mu-plugins
scp build/mu-plugins/omj-assets/omj-brand.css omj:$DEST/omj-assets/omj-brand.css
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && wp litespeed-purge all'
```

### Deploy a marketing page (HTML widget)
```bash
scp build/pages/about.html omj:~/about.html
ssh omj 'cd /home/u907133977/domains/ohmyjuiceness.com/public_html && \
  wp eval "echo omj_set_page_html(<ID>, file_get_contents(getenv(\"HOME\").\"/about.html\"));" && \
  wp elementor flush-css && wp litespeed-purge all && rm ~/about.html'
```

### Deploy header / footer or functional pages
Edit `build/templates/*.html` or `build/scripts/*.php`, `scp` to `~`, then `wp eval-file ~/<script>.php`.

---

## 3. Build helpers (in `mu-plugins/omj-build.php`)

| Helper | Use |
|---|---|
| `omj_set_page_html($id, $html)` | Page = one full-width HTML widget |
| `omj_set_page_blocks($id, $blocks)` | Page = ordered `['type'=>'html'\|'shortcode','content'=>..,'css'=>..]` widgets |
| `omj_set_theme_part($title,$type,$html)` | Theme Builder header/footer from HTML (`$type`=`header`\|`footer`) |
| `omj_set_theme_part_blocks($title,$type,$blocks)` | …from html/shortcode blocks |
| `omj_ensure_page($slug,$title)` | Idempotent page create |

---

## 4. Current site state

| Thing | Value |
|---|---|
| Platform | Hostinger Premium (shared) — same account as gvbasketball |
| WordPress | 7.0 · PHP 8.2 |
| Theme | Hello Elementor 3.4.4 (active) |
| Page builder | **Elementor 4.1.4 + Elementor Pro 3.29.2** |
| SSH alias | `omj` (user `u907133977`) |
| WP root | `/home/u907133977/domains/ohmyjuiceness.com/public_html` |
| Origin IP | `37.44.245.74` |

### Active plugins
Akismet, Cloudflare, Duplicate Page, Elementor + Pro, Hostinger (easy-onboarding), LiteSpeed Cache,
Post SMTP, Google Site Kit, Site Reviews, UpdraftPlus, Wordfence, Conditional Fields for Elementor Form.

---

## 5. Conventions

- All custom CSS classes are namespaced `omj-`.
- After meaningful changes, update `PROJECT_LOG.md` and commit (keep `.env` out of git).
- Never print secret values. Use `wp config set --quiet` and verify with `wp eval "echo strlen(CONST);"`.

---

## 6. SSH config reference

The `omj` alias is defined in `~/.ssh/config`:

```
Host omj
   HostName 37.44.245.74
   Port 65002
   User u907133977
   IdentityFile ~/.ssh/id_gvweb
```

This shares the same Hostinger account and SSH key as `gvweb` (gvbasketball.com).
