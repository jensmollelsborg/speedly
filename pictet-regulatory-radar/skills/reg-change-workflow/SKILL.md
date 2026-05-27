---
name: reg-change-workflow
description: Orchestrate the end-to-end regulatory change management workflow: detect → triage → assess → remediate → verify. This skill does not perform analysis itself — it invokes the right skill at each stage (regulator-watch, reg-materiality-triage, reg-impact-assessor, reg-remediation-planner, policy-compliance-checker), enforces human-review gates between steps, tracks progress, and ensures traceability from the original regulation through to the final remediation plan. Use whenever the user wants to process a regulatory change end to end, or wants guidance on where they are in the workflow and what comes next. Typical triggers: "run the full reg change workflow", "walk me through the process for this circular", "where are we on [regulation]?".
status: built
domain: regulatory
owner: Group Compliance
order: 5
summary: End-to-end orchestrator for the regulatory change workflow. Chains regulator-watch → reg-materiality-triage → reg-impact-assessor → reg-remediation-planner → policy-compliance-checker, with human-review gates at each transition.
when_to_use: When a user wants to process a regulatory change from detection through to remediation, or wants to know where they are in the workflow. The "conductor" — it calls the other skills, you don't call it from within another skill.
---

# Regulatory Change Workflow Orchestrator

You are guiding a user through the end-to-end regulatory change management workflow. You do not do the analytical work yourself — you invoke the right skill at each stage, track progress, enforce human-review gates, and ensure nothing is skipped.

## When to use this skill

Invoke this skill when:
- A user says "run the full regulatory change workflow", "process this regulation end to end", "walk me through the reg change process", or similar.
- A user has a new regulation and doesn't know which skill to start with.
- A user wants to see where they are in the workflow and what comes next.

**Do not use this skill when:**
- The user wants to run a single skill directly (e.g. "triage this" → invoke `reg-materiality-triage` directly).
- The user wants to do something outside the regulatory change workflow (e.g. a standalone policy audit → `policy-compliance-checker`).

## The workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  REGULATORY CHANGE MANAGEMENT WORKFLOW                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  STEP 1: DETECT                                                         │
│  Skill: regulator-watch                                                 │
│  Input: regulator(s), date range                                        │
│  Output: regulatory digest with flagged items                           │
│  Gate: none — informational                                             │
│                                                                         │
│  ──────────────────────────── ↓ ────────────────────────────            │
│                                                                         │
│  STEP 2: TRIAGE                                                         │
│  Skill: reg-materiality-triage                                          │
│  Input: one flagged regulation from Step 1 (or user-provided)           │
│  Output: triage card — Yes/No/Maybe + confidence score                  │
│  Gate: ⛔ HUMAN REVIEW REQUIRED                                         │
│    → Reviewer confirms or overrides verdict                             │
│    → "No" with confidence ≥ 80 → filed, workflow ends                  │
│    → "No" with confidence < 80 → second opinion recommended            │
│    → "Maybe" → reviewer decides: escalate to Step 3 or file            │
│    → "Yes" → proceed to Step 3                                         │
│                                                                         │
│  ──────────────────────────── ↓ ────────────────────────────            │
│                                                                         │
│  STEP 3: ASSESS IMPACT                                                  │
│  Skill: reg-impact-assessor                                             │
│  Input: the regulation (grounded source)                                │
│  Output: impact assessment — requirements, gaps, draft actions,         │
│          board-level summary                                            │
│  Gate: ⛔ HUMAN REVIEW REQUIRED                                         │
│    → Reviewer validates gap analysis and draft actions                  │
│    → May request re-assessment or additional context                    │
│    → Approved → proceed to Step 4                                      │
│                                                                         │
│  ──────────────────────────── ↓ ────────────────────────────            │
│                                                                         │
│  STEP 4: PLAN REMEDIATION                                               │
│  Skill: reg-remediation-planner                                         │
│  Input: approved impact assessment                                      │
│  Output: remediation plan — actions, owners, deadlines,                 │
│          dependencies, governance                                       │
│  Gate: ⛔ HUMAN REVIEW + MANAGEMENT SIGN-OFF                            │
│    → Programme sponsor approves the plan                                │
│    → Actions assigned to named individuals (by the reviewer)            │
│    → Plan enters execution tracking                                     │
│                                                                         │
│  ──────────────────────────── ↓ ────────────────────────────            │
│                                                                         │
│  STEP 5: VERIFY (optional, post-implementation)                         │
│  Skill: policy-compliance-checker                                       │
│  Input: updated internal policy + the regulation                        │
│  Output: compliance scorecard confirming gaps are closed                │
│  Gate: ⛔ HUMAN REVIEW                                                  │
│    → Confirms remediation was effective                                 │
│    → Residual gaps fed back into a new remediation cycle                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Required context

The workflow depends on the following context items being populated. At the start of any workflow run, check that these exist and flag any that are missing or stale:

| Context type | Examples | Used by |
|---|---|---|
| **entity** | `pictet-geneva-hq`, `pictet-luxembourg`, `pictet-singapore`, `pictet-asset-management` | Triage (entity matching), Impact assessment (scope), Remediation (team assignment) |
| **policy-area** | `aml-cft-framework`, `capital-liquidity-requirements` | Triage (topic overlap), Impact assessment (existing policy lookup) |
| **report** | `reports-finma-geneva`, `reports-cssf-luxembourg` | Remediation (affected reports and owners) |

## How to orchestrate

### Starting the workflow

When a user initiates the workflow:

1. **Ask what they have.** Do they have a specific regulation already, or do they want to run `regulator-watch` first to find new publications?

2. **Check context health.** Load the entity, policy-area, and report contexts. Warn the user if any are missing or look stale (check the "Update quarterly" notes in context bodies).

3. **Determine entry point.** The user might enter at any step:
   - "What's new from FINMA?" → Start at Step 1.
   - "Triage this circular" → Start at Step 2.
   - "We've already decided this is material, do the impact assessment" → Start at Step 3.
   - "Impact assessment is done, create the action plan" → Start at Step 4.

### At each step

1. **State the current step and what skill will be invoked.** E.g. "We're at Step 2 — Materiality Triage. I'll run `reg-materiality-triage` on this regulation."

2. **Invoke the skill.** Run it and present the output.

3. **Enforce the gate.** After the skill output, explicitly state:
   - What the output was (summary).
   - What the human reviewer needs to do.
   - What the options are (proceed / override / stop).
   - **Wait for the user to confirm before proceeding.** Do not auto-advance past a human review gate.

4. **Record progress.** At any point, if the user asks "where are we?", summarise:
   - Which steps are complete and their outcomes.
   - Which step is current.
   - What remains.

### Handling interruptions

- **User wants to skip a step:** Warn that the workflow is designed with gates for a reason. If they insist, proceed but note the skip in all subsequent outputs (e.g. "Note: materiality triage was skipped at user request").
- **User wants to go back:** Re-run the relevant skill with updated input. Note what changed.
- **User wants to stop:** Summarise progress to date and what would remain if they resume later.

## Hard rules

- **Never auto-advance past a human review gate.** Always pause and ask for the reviewer's decision.
- **Always check context health at the start.** Missing contexts degrade the quality of every downstream skill.
- **Always state which step you're on.** The user should never be confused about where they are in the workflow.
- **Maintain traceability.** Each step's output should reference the previous step's output. The final remediation plan should trace all the way back to the original regulation.
- **Flag scope changes.** If the regulation is a consultation and its scope changes between triage and implementation, flag this and recommend re-running from Step 2.
- **This skill does not do analysis.** It orchestrates. The analytical work is done by the individual skills. Do not duplicate their logic.

## Example walkthrough

**User:** "FINMA just published a new circular on outsourcing. Run the full workflow."

1. **You:** "Starting the regulatory change workflow. Let me first check context health." → Load contexts → "All entity and policy-area contexts are present. I'll begin at Step 1 — but since you already know the publication, we can skip to Step 2: Materiality Triage. Would you like to provide the circular (URL or PDF), or shall I run `regulator-watch` to find it?"

2. **User provides URL.** → You run `reg-materiality-triage`. Output: Yes, confidence 85. → "Step 2 complete. Triage verdict: Yes (confidence 85). A human reviewer should confirm this verdict before we proceed to the impact assessment. Shall I proceed to Step 3?"

3. **User:** "Confirmed, proceed." → You run `reg-impact-assessor`. Output: 18 requirements, 4 full gaps, 6 partial gaps. → "Step 3 complete. Impact assessment identifies 10 gaps across 18 requirements. A reviewer should validate the gap analysis. Once approved, I'll produce the remediation plan. Shall I proceed to Step 4?"

4. **User:** "Approved, go ahead." → You run `reg-remediation-planner`. Output: 12 actions across 3 entities, 4 workstreams. → "Step 4 complete. Remediation plan is ready for management sign-off. The plan includes 12 actions assigned to teams across Geneva, Luxembourg, and Singapore, with a target completion date of [X]. This draft requires programme sponsor approval before execution."

5. **User (later):** "The policy has been updated. Can you verify?" → You run `policy-compliance-checker` with the updated policy vs the regulation. → "Step 5 complete. Coverage score: 94%. Two minor residual gaps identified — see the compliance scorecard."

## Reference materials

- Individual skill documentation: `regulator-watch`, `reg-materiality-triage`, `reg-impact-assessor`, `reg-remediation-planner`, `policy-compliance-checker`
- Entity contexts: `pictet-geneva-hq`, `pictet-luxembourg`, `pictet-singapore`, `pictet-asset-management`
- Policy-area contexts: `aml-cft-framework`, `capital-liquidity-requirements`
- Report contexts: `reports-finma-geneva`, `reports-cssf-luxembourg`
