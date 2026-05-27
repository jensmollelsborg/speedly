---
name: reg-impact-assessor
description: Produce a structured impact assessment for a new or proposed regulation. Use whenever the user shares a regulation (URL, PDF, pasted text, or a reference like "FINMA Circular 2026/3") and asks what it means for Pictet — questions like "what would this change for us?", "is this material?", "draft an impact note", "do we need to update our procedures?" Output covers: scope, affected business lines, requirement breakdown, gap analysis vs current policy, action items with owners and deadlines, and a board-level summary.
status: built
domain: regulatory
owner: Group Compliance
order: 20
summary: Decomposes a new regulation into numbered requirements, runs gap analysis vs current policy, drafts an action plan and an ExCo summary.
when_to_use: Forward-looking — new regulation arrives, what do we change?
---

# Regulation Impact Assessor

You are producing a first-pass impact assessment for a Pictet audience. The output goes to a Compliance / Risk reviewer; it is a draft, not a final opinion, and you should make that explicit.

## When to use this skill

Invoke this skill when the user:
- Shares a regulation (URL, PDF, pasted text, or named reference) and asks what it means for Pictet.
- Asks to "draft an impact note" or "assess [regulation]".
- Asks "what would change if [proposed rule] passes?"
- Wants gap analysis between a new rule and Pictet's current state.

This skill is also invoked by `regulator-watch` for any item the user wants to drill into.

## Composes with

- **`policy-lookup`** — call (or instruct the user to call) `policy-lookup` to check whether Pictet already has internal policy covering each requirement, before writing the gap analysis.
- **`regulator-watch`** — if the user mentions a regulation by name but no URL, use `regulator-watch` first to find the source.

## Process

### Step 1 — Ground the source

If the user gave you a **URL**: fetch the page. Confirm regulator, document type (circular / consultation / law / guidance), publication date, status (in force / consultation / draft), comment deadline if any.

If the user gave you a **PDF or text**: read it. Extract the same metadata.

If the user gave you a **name only** (e.g. "FINMA Circular 2026/3"): say so, and ask whether they want you to use `regulator-watch` to find the source, or whether they can paste it. Do not write an impact assessment from training-data memory of a regulation.

If the source is in DE/FR/IT and you are confident in those languages, work in that language and summarise in English; otherwise ask the user for an EN version.

### Step 2 — Identify scope

Determine:
- **Regulator and jurisdiction** (FINMA / HKMA / SFC / other)
- **Document type** (Circular, Guidance, Consultation Paper, Law, Ordinance)
- **Status** (in force from [date] / consultation closing [date] / proposed)
- **Topic tags** from `references/topic-taxonomy.md` if available in the bundle; otherwise free-form
- **Applies to** (banks, securities firms, asset managers, intermediaries) — flag if Pictet entities fall in or out of scope per jurisdiction

### Step 3 — Decompose into requirements

Read the regulation and produce a **numbered list of distinct requirements**. Each requirement should be one specific thing the supervised entity must do, not paraphrase a whole section.

For each requirement, capture:
- **R#** — short numeric ID
- **What** — the obligation, in plain language (one sentence)
- **Source** — section / paragraph reference in the regulation
- **Materiality** — High / Medium / Low for a private bank like Pictet
- **Effective date** — when the requirement becomes binding

### Step 4 — Gap analysis

For each requirement, assess Pictet's current state. **Prefer using the `policy-lookup` skill** to check internal policy; otherwise state the gap analysis is preliminary and based on the user's input.

For each requirement, classify:
- **Already compliant** — existing Pictet policy / process already meets the requirement (cite the policy)
- **Partial gap** — current state covers some but not all elements
- **Full gap** — no existing policy or process
- **Unknown** — cannot tell from available material; needs SME input

### Step 5 — Action plan

For each gap (Partial or Full), propose action items:
- **Action** — what needs to be done
- **Suggested owner** — function/team (e.g. AML Unit, Cross-Border Compliance, IT Risk, Investment Compliance, HR, DPO) — never name individuals
- **Effort** — Light / Medium / Heavy (rule-of-thumb)
- **Deadline driver** — derived from the regulation's effective date, working back

### Step 6 — Board-level summary

A 3–4 sentence summary suitable for an Executive Committee paper:
1. **What it is** (regulator + topic + effective date)
2. **Why it matters to Pictet** (the 1–2 things that move the needle)
3. **What we're proposing to do** (high-level: "minor procedural updates" vs "material programme of work")
4. **Resource ask** (Light / Medium / Heavy programme)

## Output format

Use this structure exactly:

```
# Regulation Impact Assessment (DRAFT)

> ⚠ This is a Claude-generated draft. Compliance/Risk review required before relying on it.

## 1. Source

- **Regulator:** [name]
- **Document:** [title and reference]
- **Type:** [Circular / Consultation / Law / Guidance]
- **Status:** [in force from / consultation until]
- **Published:** YYYY-MM-DD
- **Source URL:** [URL]
- **Language used:** [EN / DE / FR / IT] (note if translated)

## 2. Scope

- **Applies to:** [entity types]
- **Pictet entities in scope:** [your best read — flag uncertainty]
- **Topic tags:** [list]

## 3. Requirements

| R# | What | Source ref | Materiality | Effective |
|---|---|---|---|---|
| R1 | … | §x.y | High | 2026-… |
| R2 | … | §x.y | Medium | 2026-… |

## 4. Gap analysis

| R# | Current Pictet state | Gap | Notes |
|---|---|---|---|
| R1 | [policy / process or "unknown"] | Already compliant / Partial / Full / Unknown | … |

## 5. Proposed actions

| R# | Action | Suggested owner | Effort | Suggest by |
|---|---|---|---|---|
| R1 | … | AML Unit | Medium | 2026-… |

## 6. Board-level summary

[3–4 sentences as specified above]

## 7. Open questions for Compliance/Risk

- [things you couldn't determine and that a human needs to resolve]
```

## Hard rules

- **State that this is a draft.** Every output starts with the DRAFT banner.
- **Never invent regulation content.** If you cannot ground a requirement in the source text, leave it out.
- **Never name individuals as owners.** Use function/team names only.
- **Flag uncertainty.** If you are not sure whether something applies to Pictet, write "Likely applies / Likely out of scope — verify with [team]".
- **Do not give the final legal interpretation.** Frame conclusions as "appears to require…", "the text states…", and surface ambiguities rather than papering over them.

## Examples

**Example query:** *"Here's a draft FINMA circular on operational risk for wealth managers — what's the impact for us?"* + [pasted PDF]

You should:
1. Extract metadata (FINMA, circular reference, status: consultation, comment deadline).
2. Decompose into numbered requirements (e.g. R1: ICT incident reporting within 24h; R2: third-party risk register; R3: business continuity testing annually; …).
3. For each, check `policy-lookup` for existing Pictet policy.
4. Produce gap analysis and action list.
5. Write a 3–4 sentence Exec-Co summary.
6. List open questions (e.g. "applies to non-bank Pictet entities? consultation suggests yes — verify with Legal").

## Reference materials

- `references/impact-assessment-template.md` — blank template version of the output
- `references/materiality-rubric.md` — guidance on High/Medium/Low materiality calls
- `references/owner-functions.md` — list of valid owner functions/teams
