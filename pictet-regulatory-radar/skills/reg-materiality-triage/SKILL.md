---
name: reg-materiality-triage
description: Screen a new or changed regulation for materiality to Pictet. Use whenever a regulatory change has been identified (by regulator-watch, by a user, or by an external alert) and the first question is "does this actually affect us?" — before running a full impact assessment. Produces a structured triage card with a yes/no/maybe verdict, a confidence score (0–100), a rationale, and a recommendation for the human reviewer. The human reviewer approves, overrides, or escalates before the workflow proceeds. Typical trigger phrases: "is this relevant to us?", "should we look at this?", "triage this circular", "quick materiality check on [regulation]".
status: built
domain: regulatory
owner: Group Compliance
order: 15
summary: Lightweight first-pass screening of a regulatory change: is it material to Pictet? Outputs a yes/no/maybe verdict with a confidence score and a structured brief for human review.
when_to_use: Sits between regulator-watch (step 1) and reg-impact-assessor (step 3). Use before committing to a full impact assessment — the gate that decides whether to invest that effort.
---

# Regulation Materiality Triage

You are performing a fast, structured materiality screening for a Pictet audience. The output is a triage card — not a full impact assessment. A human reviewer will decide whether to proceed to `reg-impact-assessor`.

## When to use this skill

Invoke this skill when:
- `regulator-watch` has flagged a new publication and the user (or workflow) asks "is this material?"
- A user shares a regulation and wants a quick relevance check before committing to a full assessment.
- The user asks "should we look at this?", "is this relevant?", "triage this", or "quick materiality check".

**Do not use this skill when:**
- The user already knows the regulation is material and wants a full impact assessment → use `reg-impact-assessor`.
- The user wants to audit an existing policy → use `policy-compliance-checker`.

## Position in the workflow

```
regulator-watch → [YOU ARE HERE] reg-materiality-triage → reg-impact-assessor → reg-remediation-planner
                                    ↓
                              Human review gate
```

This skill is the **gateway**. Nothing downstream should run without a human-reviewed triage decision.

## Composes with

- **`regulator-watch`** — upstream; provides the regulatory change to triage.
- **`reg-impact-assessor`** — downstream; invoked only if triage verdict is "Yes" or reviewer-escalated "Maybe".
- **Context: entity items** — used to determine which Pictet entities fall in scope.
- **Context: policy-area items** — used to check whether the regulation's topic overlaps with known policy areas.

## Process

### Step 1 — Ground the source

Same grounding rules as `reg-impact-assessor` Step 1:
- If given a URL: fetch and read.
- If given a PDF or text: read it.
- If given a name only: ask for the source, or invoke `regulator-watch` to locate it.
- **Never triage from memory alone.** You must have the actual text.

Extract metadata:
- Regulator, jurisdiction, document type, status, publication date, effective date (if stated), comment deadline (if consultation).

### Step 2 — Identify the scope of application

From the regulation's text, determine:
1. **Entity types in scope** — banks, securities firms, asset managers, fund management companies, intermediaries, insurers, etc.
2. **Jurisdictions** — which jurisdictions does this regulation apply in?
3. **Topic area** — AML, capital, liquidity, conduct, suitability, outsourcing, ESG, data protection, cross-border, etc.

### Step 3 — Match against Pictet context

Load relevant entity contexts (`pictet-geneva-hq`, `pictet-luxembourg`, `pictet-singapore`, `pictet-asset-management`, etc.) and policy-area contexts (`aml-cft-framework`, `capital-liquidity-requirements`, etc.).

For each Pictet entity, assess:
- **In scope?** Does this entity hold the licence type / operate in the jurisdiction targeted by the regulation?
- **Topic overlap?** Does the regulation's topic area intersect with business activities of this entity?

### Step 4 — Score and verdict

Assign a **materiality verdict** and a **confidence score**:

| Verdict | Criteria | Confidence guidance |
|---|---|---|
| **Yes** | At least one Pictet entity is clearly in scope by licence type and jurisdiction, AND the topic area is directly relevant to Pictet's business activities. | 80–100: regulation explicitly names entity types and jurisdictions matching Pictet. 60–79: strong inference but some ambiguity (e.g. "banks and securities firms" — Pictet is both). |
| **Maybe** | Scope is ambiguous (e.g. regulation targets "financial institutions" without specifics), OR the topic is adjacent but not core (e.g. retail payments rule that might affect custody), OR the regulation is a consultation that may change. | 40–59: reasonable arguments both ways. 20–39: unlikely but cannot rule out. |
| **No** | No Pictet entity falls in scope (wrong jurisdiction, wrong entity type, wrong business activity), OR the regulation is explicitly not applicable (e.g. insurance-only, retail-only). | 80–100: clearly out of scope. 60–79: very likely out of scope but edge case exists. |

**Confidence score** (0–100) reflects how certain you are in the verdict, not how material the regulation is. A "Yes" with confidence 65 means "I think it applies but there's meaningful ambiguity." A "No" with confidence 95 means "I'm very confident this doesn't apply."

### Step 5 — Draft the triage card

Use this format exactly:

```
# Regulation Materiality Triage (DRAFT)

> ⚠ Claude-generated triage. Human review required before proceeding.

## Verdict

| | |
|---|---|
| **Materiality** | ✅ Yes / ⚠ Maybe / ❌ No |
| **Confidence** | [0–100] |
| **Recommended action** | Proceed to impact assessment / Review and decide / File — no action needed |

## Source

- **Regulator:** [name]
- **Document:** [title and reference]
- **Type:** [Circular / Consultation / Law / Guidance]
- **Status:** [in force / consultation / draft]
- **Published:** YYYY-MM-DD
- **Effective date:** YYYY-MM-DD (or "not yet determined")
- **Source URL:** [URL]

## Rationale

### Why this verdict?

[3–5 sentences explaining the reasoning. Be explicit about which Pictet entities are in/out of scope and why. Name the entity contexts consulted.]

### Entities assessed

| Entity | In scope? | Reason |
|---|---|---|
| Geneva HQ | Yes / No / Unclear | [1 sentence] |
| Luxembourg | Yes / No / Unclear | [1 sentence] |
| Singapore | Yes / No / Unclear | [1 sentence] |
| Asset Management | Yes / No / Unclear | [1 sentence] |

### Topic overlap

| Policy area | Overlap? | Notes |
|---|---|---|
| [e.g. AML/CFT] | Direct / Indirect / None | [1 sentence] |
| [e.g. Capital] | Direct / Indirect / None | [1 sentence] |

## Key uncertainties

- [Things that lower confidence — ambiguous scope language, consultation status, pending implementation details, etc.]

## For the reviewer

- [ ] Confirm or override the verdict
- [ ] If "Yes" or escalated "Maybe": trigger `reg-impact-assessor`
- [ ] If "No" with confidence < 80: consider a second opinion from [suggested team]
- [ ] File this triage card in the regulatory change log
```

## Hard rules

- **Always require human review.** The triage card is a recommendation, not a decision. Make this explicit in every output.
- **Never skip the context check.** Always load and consult the entity and policy-area contexts. If contexts are missing or incomplete, say so and lower your confidence score accordingly.
- **State your confidence honestly.** Do not default to high confidence. If the regulation's scope language is vague, reflect that. A confidence of 45 is a perfectly valid output.
- **No legal interpretation.** "Appears to be in scope" not "is in scope."
- **Be fast.** This is a screening, not an assessment. The entire triage card should be producible from a single read of the regulation. Do not decompose into numbered requirements — that's `reg-impact-assessor`'s job.
- **Flag consultation status.** If the regulation is a consultation paper, note that scope and requirements may change. This should push the verdict toward "Maybe" unless the scope is already clearly applicable.

## Examples

**Example 1:** FINMA publishes a new circular on operational resilience for banks.
- Geneva HQ: in scope (bank). Luxembourg: likely in scope if CSSF adopts similar (flag as "Unclear"). Singapore: not directly (FINMA circular), but MAS may follow (flag). PAM: likely out of scope (not a bank).
- Verdict: **Yes**, confidence **85**. Proceed to impact assessment.

**Example 2:** SFC publishes guidance on virtual asset trading platforms.
- Geneva HQ: not in scope (not SFC-supervised, not a trading platform). Luxembourg: not in scope. Singapore: not in scope (MAS, not SFC). PAM: not in scope.
- Verdict: **No**, confidence **90**. File — no action.

**Example 3:** FATF publishes updated guidance on beneficial ownership for trusts.
- Geneva HQ: in scope (trust services, AMLA). Luxembourg: likely in scope (trust-related services via EU AMLD). Singapore: in scope (MAS AML). PAM: maybe (fund structures).
- Verdict: **Yes**, confidence **70** (FATF guidance is non-binding; depends on local transposition). Proceed to impact assessment; flag timeline uncertainty.

## Reference materials

- Entity contexts: `pictet-geneva-hq`, `pictet-luxembourg`, `pictet-singapore`, `pictet-asset-management`
- Policy-area contexts: `aml-cft-framework`, `capital-liquidity-requirements`
- `references/topic-taxonomy.md` — for topic classification
- `references/materiality-rubric.md` — for materiality guidance
