# AGENTS.md — Oh My Juiceness Schema

Operational guide for updating **https://ohmyjuiceness.com** (WordPress on Hostinger).
This file acts as the LLM Wiki Schema. It defines conventions, workflows, and the documentation map.

## 1. Documentation Map (LLM Wiki)

Detailed configurations, history, and specifications are stored in the [Wiki Index](wiki/index.md):
- [wiki/index.md](wiki/index.md) — Main directory map.
- [wiki/log.md](wiki/log.md) — Chronological, append-only change history.
- [wiki/hosting.md](wiki/hosting.md) — Server environment, access info, and active plugins.
- [wiki/architecture.md](wiki/architecture.md) — Build structure, helpers, and page maps.
- [wiki/design-system.md](wiki/design-system.md) — Color palette, typography, and CSS specs.

---

## 2. Connect (SSH & WP-CLI)

```bash
ssh omj                          # Hostinger account u907133977
# WordPress root (run all wp-cli from here):
cd /home/u907133977/domains/ohmyjuiceness.com/public_html
```

- **SSH alias:** `omj` → `u907133977@37.44.245.74:65002` (key: `~/.ssh/id_gvweb`)
- SSH prints a post-quantum warning to stderr; filter with: `2>&1 | grep -v "post-quantum\|store now\|upgraded. See\|vulnerable"`.
- Always run `wp db export` or backup specific tables before performing database/file modifications.

### Local SSH Config Reference (`~/.ssh/config`)
```
Host omj
   HostName 37.44.245.74
   Port 65002
   User u907133977
   IdentityFile ~/.ssh/id_gvweb
```

---

## 3. The Golden Workflow

The frontend is built using **hand-written HTML/CSS** mounted into Elementor using custom mu-plugins.
To update the site: **edit a file in `build/` → `scp` it to the server → apply with a helper → flush caches.**

Always flush caches after any changes:
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

## 4. Wiki Operations

### Ingest
When completing a task or introducing a new asset:
1. Document the changes in local files (`build/`, `wiki/`).
2. Add a structured entry to [wiki/log.md](wiki/log.md) starting with `## [YYYY-MM-DD] type | title`.
3. Update [wiki/index.md](wiki/index.md) if a new wiki page is added.

### Query
To search for information/history:
- Use specific target file reads on `wiki/*.md` instead of parsing all documentation at once.
- Check the log timeline (`grep "^## \[" wiki/log.md | tail -n 10`) for recent deployment context.

### Lint
Ensure there are no orphan pages in `wiki/`, broken internal links, or mismatches between local staging templates and the wiki descriptions.

---

## 5. Conventions

- All custom CSS classes are namespaced `omj-`.
- Keep `.env` out of git.
- Never output or print secret values to screens or logs.
