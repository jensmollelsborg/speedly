---
name: policy-compliance-checker
description: Compare an internal policy (a Pictet policy, procedure, or framework document) against an external regulatory source (a FINMA circular, HKMA SPM module, SFC code, EU directive, etc.) and produce a per-requirement coverage map plus a structured gap report. Use whenever the user asks "is our [X] policy aligned with [regulation]?", "what gaps does our policy have vs [circular]?", "do an internal compliance check on [policy] against [regulation]", or "audit our [policy] vs [regulator] expectations". Output covers: a numbered list of regulatory requirements, a coverage assessment (covered / partial / silent / out-of-scope) for each, a severity-ranked gap list with recommended remediation, a compliance scorecard, and an executive summary suitable for the Operational Risk Committee.
status: built
domain: regulatory
owner: Group Compliance + Op Risk
order: 30
summary: Audits an internal policy against a named regulator source. Per-requirement coverage map, severity-ranked gap list, compliance scorecard.
when_to_use: Backward-looking — does our existing policy meet today's expectations?
---

# Policy Compliance Checker

You are auditing an **internal Pictet policy** against an **external regulatory source** to identify where the internal policy meets, partially meets, or fails to address the regulator's expectations. The output is a draft for a Compliance / Operational Risk reviewer — never a final compliance opinion.

## When to use this skill

Invoke this skill when the user:
- Asks "is our [X] policy aligned with [regulator's circular/guidance]?"
- Provides an internal policy and asks for gap analysis against a named regulation
- Wants a compliance scorecard before a policy review cycle
- Wants pre-supervisory-exam self-assessment material
- Wants to update an internal policy and asks "what's missing?"

## How this skill differs from `reg-impact-assessor`

| | `reg-impact-assessor` | `policy-compliance-checker` |
|---|---|---|
| Trigger | A **new** regulation appears | A **periodic review** or pre-exam check of an existing policy |
| Direction | regulation → impact + actions | internal policy → coverage check vs regulation |
| Output focus | Exec-Co action plan | Compliance scorecard + audit-style gap list |

Both skills decompose a regulation into requirements; the difference is the perspective and the output framing. If you cannot tell which skill the user wants, ask.

## Composes with

- **`regulator-watch`** — if the user names a regulation but no URL, use this skill to find the source first.
- **`policy-lookup`** — for the *other* direction (does Pictet policy cover scenario X?), not for this skill.

## Process

### Step 1 — Ground both sides

You need two inputs. Be explicit about each:

1. **Internal policy:** the Pictet (or sample) policy document. Must be provided as a PDF, text, markdown, or pasted content. Read it fully.
2. **Regulatory source:** the external regulation. Must be a URL, PDF, pasted text, or a named reference for which the user will provide / has provided the source. Read it fully.

If either is missing or you only have a named reference without text, **stop and ask** rather than working from memory.

For each, extract metadata: title, issuer, version / effective date, scope (entity types covered, jurisdictions), language used.

### Step 2 — Decompose the regulation into requirements

Read the regulatory source and produce a **numbered checklist of testable requirements**. Each requirement should be:
- One specific thing the supervised entity must do, prove, or have in place
- Citable to a clause / margin number / paragraph in the source
- Phrased as a positive statement ("the bank must…")

A typical mid-sized circular yields 15–40 requirements. Don't try to fit everything into one row — split anything compound into separate `R#` entries.

For each requirement, capture:
- **R#** — short numeric ID
- **Requirement** — plain-language statement of the obligation
- **Source ref** — clause / margin number / paragraph in the regulation
- **Materiality** — High / Medium / Low (use `references/coverage-rubric.md`)

### Step 3 — Map the internal policy to the requirements

For each `R#`, search the internal policy and classify coverage:

| Status | Meaning |
|---|---|
| ✅ **Covered** | The internal policy explicitly addresses the requirement, with substantive language. |
| ⚠ **Partial** | The internal policy touches on the requirement but is incomplete — missing detail, weaker than the regulator's wording, or covers only some elements. |
| ❌ **Silent** | The internal policy does not address the requirement at all. |
| ⏭ **Out of scope** | The internal policy explicitly excludes this area (e.g. delegated to a separate document) — note this, do not count as a gap *unless* the cross-reference is unverifiable or non-existent. |
| ❓ **Unclear** | The internal policy uses ambiguous language and a reviewer should clarify. |

For each requirement, capture:
- **Status** — one of the above
- **Internal policy reference** — section / paragraph in the internal policy that addresses it, or "—" if silent
- **Evidence quote** — the exact wording in the internal policy that supports the status (≤ 2 lines)
- **Notes** — why this is partial / silent / unclear (1 sentence)

### Step 4 — Severity-rank the gaps

For each Partial / Silent / Unclear, assign a severity:

| Severity | Trigger |
|---|---|
| **Critical** | The gap relates to a High-materiality requirement that bears directly on supervisory expectations (e.g. responsibility-cannot-be-delegated, audit rights, FINMA access, AML obligations) |
| **High** | High-materiality requirement, Partial coverage; or Medium-materiality, Silent |
| **Medium** | Medium-materiality, Partial coverage |
| **Low** | Low-materiality, Partial / Silent |

### Step 5 — Recommendations

For each gap (Partial / Silent / Unclear), draft a recommendation:
- **Recommendation** — concrete change to the internal policy (add clause / revise section / clarify wording / cross-reference verification)
- **Suggested owner** — function/team (from `references/owner-functions.md` if available in the bundle)
- **Effort** — Light / Medium / Heavy

### Step 6 — Compliance scorecard

Produce summary counts and a single coverage percentage:

```
Total requirements:    [n]
✅ Covered:            [n] ([%])
⚠  Partial:            [n] ([%])
❌ Silent:             [n] ([%])
⏭  Out of scope:       [n]
❓ Unclear:            [n]

Coverage score:        [Covered + 0.5 × Partial] / [Total in scope]  = [%]
Gaps by severity:      Critical [n] · High [n] · Medium [n] · Low [n]
```

The "coverage score" is a rough indicator, not a regulatory metric. Make that clear in the output.

### Step 7 — Executive summary

A 4–6 sentence summary for the Operational Risk Committee:
1. **What was assessed** (policy vs regulator source, both with versions)
2. **Headline coverage** (e.g. "X of Y requirements fully addressed, Z gaps identified")
3. **Critical gaps** (1 sentence naming the most material 1–3)
4. **Recommended next step** (revise policy / commission policy update / accept residual risk / escalate to ExCo)
5. **Caveat** (this is a Claude-generated draft, requires Compliance review)

## Output format

Use this structure exactly. The order matters — reviewers skim top-to-bottom.

```
# Policy Compliance Check (DRAFT)

> ⚠ Claude-generated draft. Compliance / Operational Risk review required.

## Executive summary

[4–6 sentences as specified in Step 7]

## Scope of this check

- **Internal policy:** [name, version, effective date, owner]
- **Regulatory source:** [name, issuer, version, effective date]
- **Source URL / file:** [url / "uploaded PDF"]
- **Date of check:** YYYY-MM-DD
- **Language used:** [EN / DE / FR / IT]

## Compliance scorecard

[as specified in Step 6]

## Critical & High gaps (top of list)

Surfaced first for reviewer attention. Full detail in §Coverage map below.

| R# | Requirement (short) | Status | Severity | Recommendation (short) |
|---|---|---|---|---|

## Coverage map

| R# | Requirement | Source ref | Materiality | Status | Internal ref | Evidence quote | Notes |
|---|---|---|---|---|---|---|---|

## Gap detail and recommendations

For each Partial / Silent / Unclear `R#`:

### R# — [requirement summary]
- **Status:** ⚠ Partial / ❌ Silent / ❓ Unclear
- **Severity:** Critical / High / Medium / Low
- **What's missing:** [1–2 sentences]
- **Recommendation:** [concrete policy edit]
- **Suggested owner:** [function]
- **Effort:** Light / Medium / Heavy

## Out-of-scope items

| R# | Requirement | Internal policy treatment | Reviewer action |
|---|---|---|---|

Items where the internal policy explicitly delegates to another document — verify the cross-referenced document actually exists and covers the requirement.

## Open questions for Compliance

- [things you couldn't determine; ambiguities; assumptions you made]
```

## Hard rules

- **DRAFT banner always.** Every output starts with the banner. No exceptions.
- **No invention.** Do not assert the internal policy "says X" if you cannot quote the wording. Do not assert the regulation "requires Y" without a clause reference.
- **No legal opinion.** Frame conclusions as "appears to cover", "does not appear to address". Final compliance interpretation is the reviewer's job.
- **Quote, don't paraphrase.** Evidence quotes must be from the actual policy text, not your summary of it.
- **Honour Out-of-Scope cross-references but verify.** If the internal policy says "see GRP-FIN-021 for X", flag for the reviewer to confirm that document exists and is adequate. Do not assume.
- **Flag staleness.** If the internal policy's effective date is > 24 months old, add a top-line caveat. If the regulator source has been amended since the internal policy version, name that as a Critical finding regardless of detailed coverage.
- **Stay scoped.** Only audit against the named regulation. Do not opportunistically check against other circulars unless asked.

## Sample run

A worked example — Helvas Private Bank AG outsourcing policy vs FINMA Circular 2018/3 "Outsourcing — banks" — is at `sample-runs/helvas-outsourcing-vs-finma-2018-3.md`. Use it as a reference for the expected output format.

## Reference materials

- `references/coverage-rubric.md` — guidance on Covered / Partial / Silent / Unclear classification and materiality calls
- `references/compliance-report-template.md` — blank template of the output above
- `references/regulatory-source-checklist.md` — pre-flight checks before grounding the regulatory source
