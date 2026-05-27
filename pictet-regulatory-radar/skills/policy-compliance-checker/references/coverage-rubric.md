# Coverage Rubric

Heuristics for classifying each regulatory requirement against the internal policy. Use these consistently across runs of the skill — they are calibrated so two reviewers running the same check would land in the same buckets.

## Coverage status

### ✅ Covered

Use **Covered** when the internal policy contains substantive language addressing the requirement. Substantive means:
- A clear obligation, prohibition, threshold, or process is stated
- The wording matches or exceeds the regulator's expectation
- The policy is at the right level of specificity (a procedure, control owner, or measurable criterion — not just an aspirational sentence)

Example: regulator requires "the bank must retain documentation for at least 5 years"; policy says "documentation shall be retained for the duration of the contract and for five years thereafter" → Covered.

### ⚠ Partial

Use **Partial** when the internal policy addresses the topic but is incomplete:
- Covers some but not all elements of a multi-element requirement
- Weaker wording (e.g. "may" where regulator says "must")
- Right principle but missing the specific threshold / frequency / counterparty / scope
- Mentions the requirement only by cross-reference to a document that exists but is not part of this check

Example: regulator requires "selection due diligence covering financial soundness, professional qualifications, organisational and technical capabilities, experience, and reputation"; policy covers four of five but is silent on technical capabilities → Partial.

### ❌ Silent

Use **Silent** when the internal policy does not address the requirement at all — no relevant section, no cross-reference, no even-tangential treatment.

Example: regulator requires that the bank be notified before a service provider sub-outsources significant components; policy makes no mention of sub-outsourcing → Silent.

### ⏭ Out of scope

Use **Out of scope** when the internal policy *explicitly* excludes the topic (e.g. delegates to another named document, scopes out a category of arrangement). This is not a gap *if* the cross-reference is verifiable. **Always flag for the reviewer to verify the referenced document exists and covers the requirement.**

Example: policy §2.2 says "Group-internal service arrangements are out of scope of this document and are governed separately by the intra-group services framework (see GRP-FIN-021)" — the requirement is "Out of scope" within this policy. Add a Reviewer action: "Verify GRP-FIN-021 exists and adequately covers FINMA expectations for group-internal outsourcing."

### ❓ Unclear

Use **Unclear** when the internal policy uses ambiguous or undefined language that a reviewer should clarify. This is itself a finding — ambiguity in a policy creates risk.

Example: policy says "appropriate" / "adequate" / "as necessary" without further definition where the regulator expects a specific threshold or process.

## Materiality (for ranking requirements)

| Materiality | Indicators |
|---|---|
| **High** | Directly bears on supervisory expectations: responsibility cannot be delegated; audit/FINMA access; AML; banking secrecy; sub-outsourcing controls; risk analysis before outsourcing; written contract minimums |
| **Medium** | Operational expectations: BCP testing frequency; periodic review cadence; documentation retention; performance reporting |
| **Low** | Process-level expectations: format of register; approval routing within the bank; archival mechanics |

Materiality combined with status yields severity (see SKILL.md Step 4).

## Status calls in tricky cases

- **Stronger internal policy than regulator** — still ✅ Covered. Note the over-coverage if it creates unnecessary operational burden, but it is not a gap.
- **Internal policy contradicts regulator** — ⚠ Partial or even ❌ Silent depending on whether the contradiction is partial. Always escalate as a Critical finding regardless of materiality bucket.
- **Internal policy references an annex / template not provided** — ⚠ Partial. Add a Reviewer action: "Inspect [annex] to upgrade this finding to Covered or keep as gap."
- **Regulator requirement is itself conditional ("if material…")** — apply the policy's own materiality scope. If the policy never defines "material" but the regulator-driven requirement only bites in material cases, classify based on what the policy does when material outsourcing is present.

## What NOT to flag

- Items the regulator addresses to the regulator itself, not the bank (e.g. "FINMA may grant exemptions").
- Items addressed to a different entity type that the bank is not (e.g. requirements for insurers when checking a bank policy).
- Editorial / definitional sections of the regulation with no operative content.
