# Pictet Skills Catalogue — Browser View

`index.html` is the rendered, demo‑grade view of the Pictet Claude Skills Catalogue. It is a **single self‑contained file** — no build, no server, no external assets. Open it in any modern browser.

## Open it

```bash
# from anywhere
open pictet-regulatory-radar/catalogue/index.html
```

Or drag the file onto Chrome / Safari / Firefox.

For projecting on a large screen, use the browser's full‑screen mode (`⌘+Shift+F` in Chrome on macOS).

## What's in it

- **Hero KPIs** — 4 built, 23 on the roadmap, 7 owning functions, 6 domains
- **Governance principles** — the seven rules every skill is built and reviewed against
- **The catalogue** — filterable by status (Built / Roadmap), layer (Universal / Domain) and individual domains. Search box matches skill names live.
- **Lifecycle** — 5 steps from author to quarterly review
- **Phased rollout** — Phase 0 (today) through Phase 3 (federated authorship)

## Where the content comes from

The catalogue mirrors `library-map.md`. If you update the markdown taxonomy, update the HTML to match. The markdown is the working source of truth; the HTML is the polished deliverable.

## Customising before the demo

The data is inline in `index.html` — no separate JSON. Search for the skill name and edit in place if you need to:
- Change an owner (look for `<span class="owner">…</span>` blocks)
- Adjust a description (the `<p class="skill-desc">` line)
- Move a skill between Built and Roadmap (toggle `data-status="built"` ↔ `data-status="roadmap"` on the `<article>` and switch the `<span class="status …">` class)

## Print / PDF

The page has a print stylesheet baked in. Use the browser's "Print → Save as PDF" if you want a hand‑out. The filter bar, search input, and top‑bar meta are hidden in print.
