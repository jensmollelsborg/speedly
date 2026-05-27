---
name: reg-remediation-planner
description: Produce a final, actionable remediation plan following a completed impact assessment (from reg-impact-assessor). Maps each identified gap to specific Pictet teams across all affected entities, with concrete actions, deadlines derived from the regulation's effective date, dependencies between actions, and escalation governance. Use whenever the impact assessment is done and the next question is "who needs to do what, by when?" Typical trigger phrases: "create the action plan", "assign the remediation actions", "who does what?", "draft the implementation plan", "turn this into a project plan".
status: built
domain: regulatory
owner: Group Compliance
order: 25
summary: Turns an impact assessment into a signed-off-ready remediation plan: actions mapped to entity-level teams, deadlines, dependencies, workstreams, timeline, and governance. The final deliverable of the regulatory change workflow.
when_to_use: Last step in the workflow — after reg-impact-assessor has identified gaps and a reviewer has approved. Use to produce the "who does what by when" plan that people actually execute.
---

# Regulation Remediation Planner

You are producing a final, actionable remediation plan following a completed impact assessment. The output assigns concrete actions to specific Pictet teams, with deadlines, dependencies, and escalation paths. This is the last skill in the regulatory change workflow — its output is what people actually execute.

## When to use this skill

Invoke this skill when:
- `reg-impact-assessor` has been run and the user wants to turn the gap analysis and draft actions into a formal remediation plan.
- The user says "create the action plan", "who needs to do what?", "assign the actions", "draft the remediation plan", or "generate the implementation plan".
- A reviewer has approved the impact assessment and wants to move to execution.

**Do not use this skill when:**
- No impact assessment has been done yet → use `reg-impact-assessor` first.
- The user only wants a quick materiality check → use `reg-materiality-triage`.

## Position in the workflow

```
regulator-watch → reg-materiality-triage → reg-impact-assessor → [YOU ARE HERE] reg-remediation-planner
                        ↓                        ↓                                    ↓
                  Human review              Human review                        Human review
```

This skill consumes the output of `reg-impact-assessor` and produces the final deliverable.

## Composes with

- **`reg-impact-assessor`** — upstream; provides the requirements, gap analysis, and draft action items that this skill formalises.
- **Context: entity items** — used to map actions to the correct entity-level teams.
- **Context: policy-area items** — used to identify internal policy owners who must update their documents.
- **Context: report items** — used to determine if any regulatory reports are affected and who owns them.

## Process

### Step 1 — Ingest the impact assessment

The input is the output of `reg-impact-assessor`. If the user hasn't provided it in the conversation, ask for it. Extract:
- The regulation's metadata (regulator, title, effective date, status).
- The numbered requirements list.
- The gap analysis (which requirements have Partial / Full / Unknown gaps).
- The draft action items with suggested owners and effort.

If the impact assessment was produced earlier in the same conversation, use that directly.

### Step 2 — Enrich actions with context

For each gap identified in the impact assessment:

1. **Identify the responsible entity/entities.** Load entity contexts and match each gap to the entities in scope. An action may need to be executed separately at multiple entities (e.g. "update AML policy" may need Geneva, Luxembourg, and Singapore each to update their local procedures).

2. **Identify the responsible team.** Cross-reference the action's topic with entity contexts (the "Internal owners" section) and policy-area contexts. Be specific: not just "Compliance" but "Compliance Luxembourg" or "AML Unit (Geneva)".

3. **Identify affected reports.** Load report contexts. If the regulation changes a reporting requirement, map it to the specific report and its owner.

4. **Identify dependencies.** Some actions must happen in sequence:
   - Group-level policy must be updated before entity-level procedures.
   - IT/system changes may need to precede process changes.
   - Training can only happen after procedures are finalised.
   Flag these as dependencies in the plan.

5. **Set deadlines.** Work backwards from the regulation's effective date:
   - If effective date is known: subtract buffer for testing/training (typically 1–3 months depending on effort).
   - If consultation: set a "respond to consultation" deadline, then a provisional implementation timeline.
   - If no date: flag as "deadline TBD — monitor for final publication".

### Step 3 — Categorise actions

Group actions into workstreams:

| Workstream | Examples |
|---|---|
| **Policy & Procedures** | Update group policy, update entity-level procedures, draft new policy sections |
| **Systems & Data** | IT changes, data model updates, new reporting fields, system configuration |
| **Training & Awareness** | Staff training, updated job aids, communication to front office |
| **Reporting** | New or modified regulatory reports, internal MI changes |
| **Governance** | Committee terms of reference updates, escalation path changes, new approval workflows |
| **External** | Regulator notification, external audit updates, industry body engagement |

### Step 4 — Produce the remediation plan

Use this format exactly:

```
# Regulation Remediation Plan (DRAFT)

> ⚠ Claude-generated draft. Compliance/Risk review and management sign-off required before execution.

## 1. Regulation summary

- **Regulator:** [name]
- **Document:** [title and reference]
- **Effective date:** YYYY-MM-DD (or "consultation — closing [date]")
- **Materiality triage verdict:** [Yes / Maybe — confidence X]
- **Impact assessment date:** YYYY-MM-DD
- **Source:** [URL]

## 2. Programme overview

| | |
|---|---|
| **Total actions** | [n] |
| **Entities affected** | [list] |
| **Workstreams** | [list] |
| **Programme effort** | Light / Medium / Heavy |
| **Target completion** | YYYY-MM-DD (or "TBD — pending effective date") |
| **Programme sponsor (suggested)** | [function — e.g. Group Compliance, Group Risk] |

## 3. Action plan by workstream

### 3.1 Policy & Procedures

| # | Action | Requirement ref | Entity | Owner | Effort | Depends on | Deadline | Status |
|---|---|---|---|---|---|---|---|---|
| A1 | [specific action] | R1, R3 | Geneva HQ | Group Compliance | Medium | — | YYYY-MM-DD | Not started |
| A2 | [specific action] | R1 | Luxembourg | Compliance LU | Light | A1 | YYYY-MM-DD | Not started |

### 3.2 Systems & Data

[same table format]

### 3.3 Training & Awareness

[same table format]

### 3.4 Reporting

[same table format]

### 3.5 Governance

[same table format]

### 3.6 External

[same table format]

## 4. Entity-level summary

For each affected entity, a one-paragraph summary of what changes for them:

### Geneva HQ
[2–3 sentences: what actions fall to this entity, who owns them locally, key deadline]

### Luxembourg
[same]

### Singapore
[same]

### Asset Management
[same]

## 5. Timeline

| Milestone | Date | Owner | Notes |
|---|---|---|---|
| Impact assessment approved | YYYY-MM-DD | [reviewer] | |
| Group policy draft updated | YYYY-MM-DD | [owner] | |
| Entity procedures updated | YYYY-MM-DD | [owners] | Depends on group policy |
| System changes deployed | YYYY-MM-DD | [owner] | If applicable |
| Training completed | YYYY-MM-DD | [owner] | |
| Go-live / compliance date | YYYY-MM-DD | All | Regulation effective date |
| Post-implementation review | YYYY-MM-DD | [sponsor] | 3 months post go-live |

## 6. Escalation and governance

- **Programme sponsor:** [suggested function]
- **Reporting cadence:** [suggested — e.g. monthly to Op Risk Committee]
- **Escalation triggers:** [e.g. milestone missed by >2 weeks, scope change from regulator, resource conflict]
- **Sign-off required from:** [list of functions that must approve the plan]

## 7. Open items and risks

| # | Item | Risk / Impact | Owner | Target resolution |
|---|---|---|---|---|
| O1 | [e.g. "Effective date not yet confirmed"] | Timeline may shift | Group Compliance | Monitor regulator |
| O2 | [e.g. "IT capacity for Q3 uncertain"] | System changes delayed | IT Risk | Escalate to CTO |

## 8. Appendix — Traceability

| Action # | Requirement # | Gap status | Impact assessment action # |
|---|---|---|---|
| A1 | R1, R3 | Full gap | IA-1 |
| A2 | R1 | Partial gap | IA-1 |

[Maps every action back to the impact assessment for audit trail.]
```

## Hard rules

- **DRAFT banner always.** This plan requires management sign-off before execution.
- **Never name individuals.** Use function/team names only (e.g. "Compliance Luxembourg", "AML Unit (Geneva)", "Finance Singapore"). The reviewer assigns named individuals.
- **Always trace back to requirements.** Every action must reference the requirement(s) from the impact assessment. If an action cannot be traced, it should not be in the plan.
- **Always load entity, policy-area, and report contexts.** Do not guess at team names or report owners — use the context data. If a context is missing, flag it as an open item.
- **Be specific in actions.** "Update AML policy" is too vague. "Add section on enhanced due diligence for virtual asset service providers to Group AML/CFT Policy §4.3" is good. "Review and update" is a smell — say what specifically needs reviewing and what the expected change is.
- **Flag resource conflicts.** If multiple actions fall to the same team with overlapping deadlines, note this as a risk.
- **Include post-implementation review.** Every plan should have a milestone for checking whether the changes actually achieved compliance, typically 3 months after go-live.
- **No legal interpretation.** Frame as "the regulation appears to require…" and "we recommend…", not "you must…".

## Examples

**Example:** Following an impact assessment of a new FINMA circular on operational resilience:
- A1: Update Group Operational Resilience Policy to include new ICT incident reporting requirements (R1, R2) → Group Compliance → Medium → deadline: 3 months before effective date.
- A2: Configure incident reporting workflow in ServiceNow to meet 24-hour notification window (R2) → IT Risk → Heavy → depends on A1 → deadline: 2 months before effective date.
- A3: Update Singapore Branch Operating Manual §7.2 to cross-reference new group policy (R1) → Compliance Singapore → Light → depends on A1 → deadline: 1 month before effective date.
- A4: Deliver training to front office and operations on new incident escalation process (R2, R3) → Compliance (all entities) → Light → depends on A1, A2 → deadline: 2 weeks before effective date.

## Reference materials

- Entity contexts: `pictet-geneva-hq`, `pictet-luxembourg`, `pictet-singapore`, `pictet-asset-management`
- Policy-area contexts: `aml-cft-framework`, `capital-liquidity-requirements`
- Report contexts: `reports-finma-geneva`, `reports-cssf-luxembourg`
- `references/owner-functions.md` — list of valid owner functions/teams
- `references/effort-sizing-guide.md` — guidance on Light/Medium/Heavy effort classification
