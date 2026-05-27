# Pictet Skills Catalogue — Browser View

`index.html` is the rendered, demo-grade view of the Pictet Claude Skills Catalogue. It is generated from the `SKILL.md` files under `../skills/` by `build.py`. Open the generated HTML in any modern browser — no server needed.

## Open it

```bash
open pictet-regulatory-radar/catalogue/index.html
```

Or drag the file onto Chrome / Safari / Firefox. For projection, use the browser's full-screen mode (`⌘+Shift+F` in Chrome on macOS).

## Rebuilding after edits

```bash
python3 pictet-regulatory-radar/catalogue/build.py
```

The script walks `../skills/**/SKILL.md`, validates the frontmatter (`name`, `status`, `domain`, `owner`, `summary`, `when_to_use`, optional `priority` and `order`), groups by domain in canonical order, computes the hero KPIs and filter-pill counts, and writes `index.html` from `template.html`. Commit the generated HTML so the offline demo still works without running Python.

## Editing skills

To edit skill metadata or body in a browser instead of a text editor, run the local Flask app under `../manage/`:

```bash
pip install -r pictet-regulatory-radar/manage/requirements.txt
python3 pictet-regulatory-radar/manage/app.py    # http://127.0.0.1:8765/
```

The editor reads and writes the same `SKILL.md` files, regenerates `index.html` after every save, and validates against the same frontmatter contract this build script enforces.

## What's in the page

- **Hero KPIs** — built / roadmap counts, owning functions, domains covered (all auto-computed)
- **Governance principles** — the seven rules every skill is built and reviewed against
- **The catalogue** — filterable by status (Built / Roadmap), layer (Universal / Domain) and individual domains. Search matches skill names live.
- **Lifecycle** — 5 steps from author to quarterly review
- **Phased rollout** — Phase 0 (today) through Phase 3 (federated authorship)

## Where the content comes from

Each card is rendered from a SKILL.md frontmatter block under `../skills/<name>/SKILL.md`. To change an owner or description, edit the frontmatter and rerun `build.py`. Do not edit `index.html` directly — the next build will overwrite your change. Edit `template.html` only for structural changes (hero copy, governance text, lifecycle, phasing).

## Print / PDF

The page has a print stylesheet baked in. Use the browser's "Print → Save as PDF" if you want a hand-out. The filter bar, search input, and top-bar meta are hidden in print.
