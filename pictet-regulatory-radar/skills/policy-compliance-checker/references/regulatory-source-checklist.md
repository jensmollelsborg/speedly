# Regulatory Source Pre-Flight Checklist

Before running the gap analysis, confirm the regulatory source is fit for purpose. A bad source produces a bad report — and the reviewer can't easily tell from the output if the source was wrong.

## Required before starting

- [ ] **Source is the current version.** Check the regulator's website for the latest amendment date. If you used a PDF, confirm the issue date on the cover matches.
- [ ] **Source language is appropriate.** FINMA: prefer EN; if working from DE/FR, note it in the output. HKMA/SFC: prefer EN.
- [ ] **Source applies to the entity type.** Confirm the circular is addressed to banks (not just insurers, not just SROs, not just SIBs).
- [ ] **Source applies to the jurisdiction.** Confirm the regulation's territorial scope includes the entity being audited.
- [ ] **Source is in force.** A consultation paper is not a binding requirement — flag this clearly if running against a draft.
- [ ] **Annexes and explanatory notes** that are part of the circular are also loaded if available.

## Required before classifying

- [ ] **Internal policy is the current version.** Match against the version field, not an old draft.
- [ ] **Internal policy is complete.** If the policy references annexes ("see Annex A"), confirm whether the annex is in the loaded content or whether its absence makes parts of the policy unverifiable.
- [ ] **Internal policy is in the same scope.** If the policy explicitly excludes group-internal arrangements and the regulation covers them, that's a scope mismatch to flag in the report — not a gap per requirement.

## During the check

- [ ] **Quote, don't paraphrase, when assigning status.** If you can't find an exact supporting quote in the internal policy, downgrade Covered → Partial.
- [ ] **Cross-references in the policy** (e.g. "see GRP-FIN-021") are Out-of-Scope-with-reviewer-action, not Covered.
- [ ] **Margin numbers / paragraph references** in the source citations — be specific.

## On output

- [ ] **DRAFT banner present.**
- [ ] **Scorecard counts add up** to the total requirement count.
- [ ] **Critical/High gaps surfaced** in the dedicated section at the top.
- [ ] **Open questions** captures every place you made an assumption or could not determine status.
