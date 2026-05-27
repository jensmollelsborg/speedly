# Pictet Skills — local editor app

A small Flask app for browsing, creating, and editing skills locally. The `SKILL.md` files under `../skills/` are the source of truth; the editor reads and writes them directly. After every save, the static `../catalogue/index.html` snapshot is regenerated so the offline demo stays in sync.

## Setup

```bash
pip install -r manage/requirements.txt
```

## Run

```bash
python3 manage/app.py
# → http://127.0.0.1:8765/
```

## What you can do

- **Browse** — `/` shows the full catalogue with the same visual language as the static page. Click any card to drill in.
- **View one skill** — `/skills/<name>` renders the frontmatter as a labelled table and the Markdown body inline.
- **Edit** — the Edit button opens a form for every frontmatter field plus a Markdown textarea with live preview.
- **Create** — `+ New skill` (top-right) opens a blank form. Submitting writes `skills/<name>/SKILL.md` and adds the card to the catalogue.
- **API** — `/api/skills` returns a JSON array of all parsed skills.

## How writes work

`POST /skills/<name>` and `POST /skills`:

1. The form payload is validated against the same rules as the build script (`catalogue/core.py:validate_frontmatter`). Field-level errors are shown inline; the form is re-rendered, file untouched.
2. On success, `manage/forms.py:write_skill` serialises the frontmatter in canonical field order and writes `skills/<name>/SKILL.md`.
3. `catalogue/core.py:render_static` is called to refresh `catalogue/index.html`. Commit both the SKILL.md and the regenerated index.html.

## Out of scope (V1)

- Delete-skill UI — easier to do manually with `rm -rf skills/<name>/`.
- Auth — this is a single-user local tool.
- Sign-off workflow, review dates, audit log.
- Git commits on save.

## File layout

```
manage/
├── app.py              Flask routes
├── forms.py            frontmatter writer
├── requirements.txt    flask
├── templates/
│   ├── layout.html
│   ├── catalogue.html
│   ├── skill_view.html
│   ├── skill_form.html
│   └── error.html
└── static/
    └── editor.js       live Markdown preview (uses marked.js from CDN)
```
