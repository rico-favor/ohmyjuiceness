# Archive

Frozen material moved out of the active tree on **2026-07-10**. Nothing here affects
the live site or the current deliverable. Kept for provenance/history only.

The live-affecting source of truth remains in `build/mu-plugins/omj-assets/omj-brand.css`
and `build/pages/*.html`; the current client deliverable is `/JULY-CHANGES.html` (root).

## What's here

### `revisions/` — original client source material (INPUT)
The client's 10-point revision brief and the raw location/product photos that seeded the
July work: `OMG Revisions.md` / `OMG Revisions.pdf` plus the `omj-*.jpeg` shoot files and
`omjeastwood/`, `other-assets/`. Historical input, not maintained.

### `build-preview/` — drifted preview build (DEPRECATED, non-deploying)
The standalone `home/about/contact.html` preview pages + their `assets/`. These were a
local screenshot/QA harness; they drifted from the deployed pages and never affected the
live site (only `build/mu-plugins/omj-assets/omj-brand.css` and `build/pages/*` deploy).
Superseded by the live site itself.

### `docs/` — completed reports, handoffs, plans & specs (DONE)
- `2026-07-09-client-report.html` — **SUPERSEDED** by `/JULY-CHANGES.html`.
- `2026-07-09-omj-generated-cup-landing-refinement-handoff-plan.md` — DONE.
- `2026-07-10-omj-staging-v2-handoff.md` — DONE (staging v2 shipped).
- `2026-07-10-staging-polish-handoff.md` — DONE (live polish pass complete).
- `superpowers/plans/`, `superpowers/specs/`, `superpowers/handoff/*.md` — the plan, design
  specs, and codex/global-constraints prompts for the completed revision + staging-v2 work.
  (The live capture tool `capture.mjs` was intentionally kept at
  `docs/superpowers/handoff/capture.mjs`.)

### `root-assets/`
Loose working artifacts from the repo root: `staging-page-full.png` (a QA capture).

## Still active (NOT archived)
- `/JULY-CHANGES.html` — current client-facing report (root, standalone).
- `docs/2026-07-10-july-changes.html` — its source copy.
- `docs/2026-07-10-client-flags.md` — open items awaiting client input (stats, font license,
  photo reshoots, machine floor/spot). Live until the client resolves them.
- `docs/superpowers/handoff/capture.mjs` — Playwright capture tool, still used.
