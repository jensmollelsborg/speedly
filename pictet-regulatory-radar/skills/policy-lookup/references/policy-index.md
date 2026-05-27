# Pictet Policy Index

This file lists every policy document loaded into the `policy-lookup` skill. **Keep this file in sync** whenever you add, remove, or update a policy excerpt in `references/`.

| Policy | File | Effective date | Owner | Coverage |
|---|---|---|---|---|
| Cross-Border Activities Policy | `sample-policies.md` §1 | 2024-03-15 | Group Compliance | RM activities targeting clients in other jurisdictions |
| AML / CDD Policy | `sample-policies.md` §2 | 2025-01-01 | AML Unit | Client due diligence, source-of-wealth, ongoing monitoring |
| Suitability & Appropriateness Policy | `sample-policies.md` §3 | 2024-09-01 | Investment Compliance | MiFID II / FinSA suitability checks |
| Data Protection & Confidentiality | `sample-policies.md` §4 | 2024-06-01 | DPO | Client data, GDPR/nLPD, banking secrecy |
| Code of Conduct | `sample-policies.md` §5 | 2025-02-01 | HR / Legal | Personal conduct, conflicts of interest, outside activities |
| ESG Investment Policy | `sample-policies.md` §6 | 2025-04-01 | Sustainability Office | ESG screening, exclusions, climate disclosures |

## Staleness

Flag any policy with an effective date older than 2026-05-26 minus 24 months (i.e. before 2024-05-26) as potentially stale.

## How to update

1. Add the policy excerpt to a markdown file under `references/`.
2. Add a row to the table above.
3. Save and re-upload the skill bundle to Claude.ai.
