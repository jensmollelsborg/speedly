# Pictet Regulatory Radar — Claude Skills Bundle

A four-skill demonstrator built for the Pictet internal innovation competition. The skills compose into a "Monday morning regulatory radar": find what's new from FINMA / HKMA / SFC, assess the impact on Pictet, cross-check existing internal policy, and audit internal policies against current regulator expectations.

This bundle is the Phase 0 / competition entry. See `library-map.md` for the broader Pictet-wide Claude skills library it would scale into, or open the rendered HTML catalogue at `catalogue/index.html` for the demo‑grade view.

## What's in here

```
pictet-regulatory-radar/
├── README.md                          ← you are here
├── library-map.md                     ← taxonomy of universal + domain skills (the "slide")
├── catalogue/
│   ├── template.html                  ← page template with {{placeholders}}
│   ├── build.py                       ← reads skills/**/SKILL.md → renders index.html
│   ├── serve.py                       ← tiny static server for local preview
│   └── index.html                     ← generated; open in any browser
├── demo/
│   └── demo-script.md                 ← 3-minute hero demo walkthrough
└── skills/                            ← single source of truth (27 skills)
    ├── policy-lookup/                 ← universal · built
    │   ├── SKILL.md
    │   └── references/
    │       ├── policy-index.md
    │       └── sample-policies.md     ← REPLACE with real Pictet excerpts before demo
    ├── regulator-watch/               ← regulatory · built
    │   ├── SKILL.md
    │   └── references/
    │       ├── regulator-sources.md
    │       └── topic-taxonomy.md
    ├── reg-impact-assessor/           ← regulatory · built
    │   ├── SKILL.md
    │   └── references/…
    ├── policy-compliance-checker/     ← regulatory · built
    │   ├── SKILL.md
    │   ├── references/…
    │   └── sample-runs/
    │       └── helvas-outsourcing-vs-finma-2018-3.md  ← worked example
    └── <23 roadmap stubs>/SKILL.md    ← frontmatter + description, no body yet
```

Each `SKILL.md` carries catalogue metadata in its YAML frontmatter:

```yaml
---
name: regulator-watch
description: Monitor financial-regulator publication pages…   # Claude invocation desc
status: built              # built | roadmap
domain: regulatory         # universal | regulatory | aml | wealth | legal | ops | hr
owner: Group Compliance
order: 10                  # sort key within a (status, priority) bucket
summary: Monitors FINMA, HKMA and SFC publication pages…      # short card text
when_to_use: "What's new from FINMA this week?" — Monday-morning routine.
# priority: high           # roadmap only — high | medium | low
---
```

## Three ways to work with the catalogue

| Tool | What it does | When |
|---|---|---|
| `python3 catalogue/build.py` | Renders the static `catalogue/index.html` snapshot from `skills/**/SKILL.md` | Before a commit or a demo |
| `python3 manage/app.py` | Local Flask editor — view, create, and edit skills + contexts in a browser on `http://127.0.0.1:8765/` | Day-to-day authoring |
| `python3 mcp_server/server.py` | MCP server exposing 21 CRUD + lookup tools to Claude | Authoring or bulk operations through Claude (Desktop or Code) |

Both share `catalogue/core.py` for schema, parsing, validation, and HTML
rendering. The static build is stdlib-only (no installs); the editor adds one
dependency, Flask:

```bash
pip install -r manage/requirements.txt
python3 manage/app.py
```

The editor regenerates `catalogue/index.html` after every save, so the static
snapshot stays in sync with the live tree.

## The four skills

| Skill | Type | When to invoke |
|---|---|---|
| `policy-lookup` | Universal | "Does our policy cover X?" — searches loaded Pictet policy excerpts with citations |
| `regulator-watch` | Domain · Regulatory | "What's new from FINMA / HKMA / SFC?" — fetches publication pages, filters for private-banking relevance |
| `reg-impact-assessor` | Domain · Regulatory | "Assess the impact of this *new* regulation" — decomposes into requirements, runs gap analysis, drafts action plan and Exec-Co summary |
| `policy-compliance-checker` | Domain · Regulatory | "Audit this *internal policy* against [regulation]" — produces per-requirement coverage map, severity-ranked gap list, and compliance scorecard for Op Risk Committee |

**`reg-impact-assessor` vs `policy-compliance-checker`** — both compare a policy and a regulation, but in different directions and for different use cases:

- `reg-impact-assessor` — forward-looking. A new regulation arrives → what's the impact, what do we change? Output is action-oriented for ExCo.
- `policy-compliance-checker` — backward-looking. We have an existing policy → is it aligned with current regulator expectations? Output is audit-oriented for Op Risk Committee or pre-supervisory-exam self-assessment.

The compositions:
- **Daily flow:** `regulator-watch` finds new items → `reg-impact-assessor` analyses one → `policy-lookup` checks internal policy.
- **Periodic flow:** `policy-compliance-checker` audits an internal policy vs a regulator source → identifies gaps → those gaps feed the policy review cycle.

## Installing in Claude.ai

Each skill folder is independent. Two ways to deploy:

### Option A — upload each skill folder separately (recommended)

For each of `skills/policy-lookup/`, `skills/regulator-watch/`, `skills/reg-impact-assessor/`, and `skills/policy-compliance-checker/`:

1. Zip the folder (so the zip contains `SKILL.md` and `references/` at the root).
2. In Claude.ai → Settings → Capabilities → Skills, upload the zip.
3. Confirm the skill appears in the skill list and the description renders correctly.

### Option B — upload the full bundle

Zip the entire `pictet-regulatory-radar/skills/` directory and upload as a single skills package, if your Claude.ai environment supports bundle uploads.

## Before the demo (checklist)

1. **Replace illustrative content with real excerpts.** `skills/policy-lookup/references/sample-policies.md` ships with *fictional* Pictet-style excerpts for demonstration. Replace with sanitised real excerpts (Compliance-approved) and update `policy-index.md`.
2. **Verify regulator URLs.** Open each URL in `skills/regulator-watch/references/regulator-sources.md` to confirm none have moved.
3. **Pick the demo regulation** (see `demo/demo-script.md` for criteria).
4. **Dry-run the full demo** at least once end-to-end and time it.

## Hard rules (apply across all three skills)

- **Cite or refuse.** Every factual claim has a source or an explicit "I don't know".
- **Drafts, not decisions.** All outputs are clearly marked as drafts requiring human review.
- **No client data.** These skills are not built for use with confidential client information. `policy-lookup` actively reminds users of this.
- **Languages.** Designed to work in EN; FINMA content may be DE/FR/IT and is summarised in EN with the source language noted.

## Governance (one-pager)

- Each skill has an **owner function** (defined in `library-map.md`).
- Owners sign off before a skill goes live and review **quarterly**.
- Source references (regulator URLs, policy index) need quarterly verification — they rot fast.
- Contribution path is single: markdown template → function sign-off → central review → publish.

## Beyond the competition

`library-map.md` lists ~25 additional skills across universal (drafting, summarising, translation, tone) and domain (AML, wealth, legal, ops, HR) layers, with a phased rollout from MVP through federated authorship.
