# Pictet Claude Skills Library — Map

A taxonomy for an organisation-wide Claude skills library. Universal skills are reusable across all teams. Domain skills encode the knowledge of a specific function and are governed by that function's subject-matter experts.

---

## Built for the competition

These four skills compose into the **Regulatory Radar** demo (see `demo/demo-script.md`) and supporting policy-audit workflow.

| Skill | Layer | What it does |
|---|---|---|
| `policy-lookup` | Universal | Answers "does our policy cover X?" with citations to internal documents. |
| `regulator-watch` | Domain · Regulatory | Monitors FINMA / HKMA / SFC; produces digests filtered for private-banking relevance. |
| `reg-impact-assessor` | Domain · Regulatory | Decomposes a new regulation into requirements, runs gap analysis vs current policy, drafts an action plan and Exec-Co summary. |
| `policy-compliance-checker` | Domain · Regulatory | Audits an internal policy against a named regulator source; produces a per-requirement coverage map, severity-ranked gap list, and compliance scorecard for Op Risk Committee. |

---

## Universal skills (cross-team)

Build once, used everywhere. Each one is a clear, narrow capability — not a "do everything" assistant.

| Skill | Purpose | Priority |
|---|---|---|
| `policy-lookup` | Cited answers from any internal-policy corpus | **Built** |
| `document-summariser` | Structured summary of a long PDF / report (TL;DR + section bullets + key figures) | High |
| `meeting-notes-extractor` | From notes / transcript → decisions, actions, owners, deadlines | High |
| `client-comms-drafter` | Draft client communications in Pictet's voice (Eng/Fr/De/It); enforces tone and disclaimer rules | High |
| `multilingual-translator` | EN / FR / DE / IT translation tuned for banking and legal text | Medium |
| `pictet-tone-checker` | Reviews a draft for tone, jargon, prohibited claims, missing disclaimers | Medium |
| `data-tidy` | Clean and normalise a pasted table; never leaves the chat (no exfiltration) | Medium |
| `slide-skeleton` | Turn a 1-pager into a 5-slide outline + speaker notes | Low |

---

## Domain skills

Each domain is owned by a function. Skills are reviewed and signed off by that function before publication.

### Regulatory — owner: Group Compliance

| Skill | Purpose | Priority |
|---|---|---|
| `regulator-watch` | FINMA / HKMA / SFC publication digest | **Built** |
| `reg-impact-assessor` | New-regulation impact note (forward-looking: new reg → action plan) | **Built** |
| `policy-compliance-checker` | Periodic policy audit (backward-looking: policy → coverage vs reg) | **Built** |
| `return-filer-helper` | Walkthroughs for periodic returns (HKMA MA(BS), FINMA self-assessments) — checklist + common errors | High |
| `consultation-responder` | Drafts a Pictet response to a regulator consultation (structured, balanced, position-checked) | Medium |
| `circular-translator` | Plain-English / plain-French rewrite of a regulator circular for a business audience | Medium |

### AML / Financial Crime — owner: AML Unit

| Skill | Purpose | Priority |
|---|---|---|
| `kyc-file-summariser` | Structured summary of a KYC file: red flags, missing fields, source-of-wealth gaps | High |
| `pep-screening-explainer` | Explains why a name surfaced in screening and what next steps look like | High |
| `transaction-narrative` | From a flagged transaction → factual narrative for L1 reviewer | Medium |

### Wealth / Portfolio — owner: Investment Compliance & Front Office

| Skill | Purpose | Priority |
|---|---|---|
| `portfolio-narrative-generator` | Client-facing quarterly portfolio commentary (drafts only) | High |
| `suitability-checker` | Given a proposed trade + client profile → suitability review | High |
| `cross-border-checker` | Given an RM action + client jurisdiction → green/amber/red on cross-border policy | High |

### Legal / Contracts — owner: Legal

| Skill | Purpose | Priority |
|---|---|---|
| `contract-redliner` | Compares a counterparty draft against Pictet templates and highlights deviations | High |
| `nda-extractor` | From an NDA → term length, restricted use, jurisdiction, governing law, key obligations | Medium |
| `enforcement-precedent-finder` | Searches public FINMA / HKMA enforcement decisions for similar fact patterns | Medium |

### Operations & Tech — owner: COO / IT Risk

| Skill | Purpose | Priority |
|---|---|---|
| `incident-write-up` | Structured post-incident report from raw notes | Medium |
| `vendor-risk-questionnaire` | First-draft answers for vendor security questionnaires | Medium |

### HR & People — owner: HR

| Skill | Purpose | Priority |
|---|---|---|
| `policy-Q&A` | Same as `policy-lookup` but scoped to HR policies — leave handbook, mobility, conduct | Medium |
| `role-description-drafter` | Draft a role description from a 1-line brief, using Pictet conventions | Low |

---

## Governance principles

These principles are what makes a library safe to scale across a regulated bank.

1. **One skill, one capability.** A skill that does five things is a bad skill. Decompose.
2. **Cite or refuse.** Any skill producing facts cites the source or says "I don't know".
3. **Functions own their skills.** Compliance owns `regulator-watch`; AML owns `kyc-file-summariser`. Sign-off is a hard gate before a skill goes live.
4. **Drafts, not decisions.** Skills draft; humans decide. Output formats lead with "DRAFT" banners.
5. **No client data in unapproved tools.** The library is deployed on Pictet-approved AI environments only (see Data Protection §7). The `policy-lookup` skill enforces this in its own instructions.
6. **Quarterly review.** Every skill has an owner who reviews it quarterly. Stale references rot fast.
7. **One contribution path.** A markdown template, a review checklist, a single shared repository.

---

## Phasing

| Phase | When | Scope |
|---|---|---|
| **0** — Competition demo | Now | The 3 built skills + this library map |
| **1** — MVP rollout | +1 month | Top 4 universal skills, top 2 per domain; pilot with 2–3 teams |
| **2** — Scale | +3 months | Full universal layer; domain skills as functions sign off |
| **3** — Federated | +6 months | Skills authored locally by business teams; central governance only |
