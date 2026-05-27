# Policy Compliance Check (DRAFT)

> ⚠ **Claude-generated draft. Compliance / Operational Risk review required before any reliance.**
>
> ⚠ **Source caveat:** FINMA Circular 2018/3 was not fetched live during this run (FINMA's index page is JS-rendered and direct PDF URLs returned 404). Requirements below are reconstructed from publicly-known structural knowledge of the consolidated circular (in force since 1 April 2019, amended 4 November 2020). **The reviewer must cross-check each `R#` against the current circular text before relying on this report.**

## Executive summary

This is a gap-analysis of **Helvas Private Bank AG — Group Outsourcing Policy v3.2** (GRP-POL-OPR-014, effective 1 March 2025) against the structural requirements of **FINMA Circular 2018/3 "Outsourcing — banks"**. The policy covers **11 of 27 in-scope requirements** fully (≈59% coverage score), **10 partially**, and is **silent on 6**, with **1 area explicitly delegated** to a separate group document. The most material gaps are the **absence of any sub-outsourcing controls** (Critical), **silence on FINMA / supervisory audit and access rights in the written agreement** (Critical), **no requirement for a pre-outsourcing risk analysis** (Critical), and **only cursory treatment of cross-border outsourcing** despite the bank's likely HK / other-jurisdiction booking activity (Critical). Recommendation: commission a policy revision targeting Sections 5 (Written Agreement), 7 (Information Security), and the addition of new sections on Sub-Outsourcing, Cross-Border Outsourcing, and Pre-Outsourcing Risk Analysis. Drafting effort: **medium programme of work**, roughly 4–6 weeks with Compliance, Op Risk, Legal, and DPO input.

## Scope of this check

- **Internal policy:** Helvas Private Bank AG — Group Outsourcing Policy v3.2 (GRP-POL-OPR-014), effective 1 March 2025, owner: Group Head of Operational Risk
- **Regulatory source:** FINMA Circular 2018/3 "Outsourcing — banks" (consolidated version in force since 4 Nov 2020 amendments)
- **Source URL / file:** Not fetched live — see source caveat above
- **Date of check:** 2026-05-26
- **Language used:** EN (internal policy provided in EN; FINMA reference circular structurally cited)

## Compliance scorecard

```
Total requirements:    27 (1 additional item out of scope)
✅ Covered:            11  (41%)
⚠  Partial:            10  (37%)
❌ Silent:              6  (22%)
⏭  Out of scope:       1
❓ Unclear:            0

Coverage score:        (11 + 0.5 × 10) / 27   =  59%
Gaps by severity:      Critical 7 · High 6 · Medium 3 · Low 0
```

**Note:** the coverage score is a rough indicator only. A score of 59% with 7 Critical findings is materially worse than the same score with 0 Critical findings — judge by the severity profile, not the headline percentage.

## Critical & High gaps (top of list)

| R# | Requirement (short) | Status | Severity | Recommendation (short) |
|---|---|---|---|---|
| R5 | Pre-outsourcing risk analysis (operational, legal, reputational, concentration, BC, compliance) | ❌ Silent | Critical | Add new §4.0 "Pre-Outsourcing Risk Analysis" covering all six risk dimensions, with documented sign-off |
| R14 | Contract must grant audit / access rights to FINMA and/or its agents | ❌ Silent | Critical | Add to §5.2 contract minimums; add cross-reference in §9 |
| R15 | Contract must reserve the Bank's right to issue instructions to provider | ❌ Silent | Critical | Add to §5.2 contract minimums |
| R17 | Contract must address sub-outsourcing controls (consent, notice, chain audit) | ❌ Silent | Critical | Add to §5.2 contract minimums; cross-reference new sub-outsourcing section |
| R20 | Sub-outsourcing controls — consent, equivalent standards, chain of audit | ❌ Silent | Critical | Add new §X "Sub-Outsourcing" covering consent regime, equivalence requirement, audit-chain preservation |
| R21 | Cross-border outsourcing — information access, audit, supervisor access, client-data protection | ⚠ Partial | Critical | Expand §7 or add new §X "Cross-Border Outsourcing" covering all four dimensions; align with FINMA expectations on supervisor access |
| R26 | Reporting / notification of significant outsourcing to FINMA | ❌ Silent | Critical | Add new §X "Supervisory Reporting" referencing the existing supervisory return and crisis-notification obligations |
| R3 | Documented materiality assessment per arrangement | ⚠ Partial | High | Make materiality assessment an explicit, documented step in §2 or §3; define triggers for re-assessment |
| R6 | Selection due diligence — covers financial, qualifications, organisational/technical capabilities, experience, reputation | ⚠ Partial | High | Expand §4.1 to include organisational/technical capabilities (beyond infosec) and provider reputation |
| R11 | Contract — banking secrecy (heightened obligation, not just generic confidentiality) | ⚠ Partial | High | Strengthen §5.2 confidentiality clause to explicitly invoke Art. 47 Banking Act banking secrecy and equivalent obligations on provider personnel |
| R12 | Contract — data protection clauses | ⚠ Partial | High | Add explicit data-protection clause requirements to §5.2 (not only via §7.2 cross-reference) |
| R16 | Contract — termination including supervisory crisis | ⚠ Partial | High | Expand §5.2 termination clause to enumerate scenarios: provider material breach, supervisory directive, provider regulated-status change, M&A, sub-outsourcing chain change |
| R24 | Internal audit covers outsourced functions | ⚠ Partial | High | Explicit statement that outsourced functions are in the internal audit annual planning scope; not only register access |

## Coverage map

Full per-requirement detail. Where Status = Covered, evidence quote is the supporting wording from the Helvas policy.

| R# | Requirement | Source ref | Materiality | Status | Internal ref | Evidence quote | Notes |
|---|---|---|---|---|---|---|---|
| R1 | Outsourcing defined as ongoing delegation of activity bank would otherwise perform | Mn ~3-4 | High | ✅ Covered | §1.1, §2.1 | "the delegation of a recurring business activity to an external service provider on an ongoing basis" | Definition is sound; scope exclusions in §1.3 are reasonable |
| R2 | Material outsourcing defined by impact: financial soundness, regulatory compliance, continuity, client confidentiality | Mn ~10-13 | High | ⚠ Partial | §2.3 | "significant impact on the Bank's ability to serve clients, meet regulatory obligations, or maintain financial soundness" | Missing: explicit reference to client confidentiality as a materiality factor |
| R3 | Documented materiality assessment for each outsourcing | Mn ~14-16 | High | ⚠ Partial | §3.2 (implied) | "Material outsourcing arrangements require, in addition, approval from the Group Operational Risk Committee" | Materiality is referenced but no requirement to *document* the assessment or define re-assessment triggers |
| R4 | Central inventory of significant outsourcing with counterparty, services, materiality, last review | Mn 17 | Medium | ⚠ Partial | §10.1 | "central register of all outsourcing arrangements, recording the counterparty, the service description, the contract dates, and the relationship owner" | Missing fields: materiality status, last review date, risk rating |
| R5 | Risk analysis before outsourcing — operational, legal, reputational, concentration, BC, compliance | Mn ~19-22 | High | ❌ Silent | — | — | No section on pre-outsourcing risk analysis. §4 covers provider due diligence, which is selection, not risk analysis |
| R6 | Selection DD — financial, qualifications, organisational/technical, experience, reputation | Mn ~24-25 | High | ⚠ Partial | §4.1 | "financial soundness… professional experience… references from at least two comparable clients… information security posture" | Missing: organisational and technical capabilities (beyond infosec), provider reputation as a distinct factor |
| R7 | Ongoing monitoring of provider performance | Mn 26-27 | Medium | ✅ Covered | §6.3 | "at least an annual review of the service provider's performance" | Annual cadence aligns with regulator expectation |
| R8 | Written contract before service commencement | Mn 28 | High | ✅ Covered | §5.1 | "Every outsourcing arrangement shall be governed by a written contract signed by both parties before service commencement" | — |
| R9 | Contract — description of services | Mn 29 | Medium | ✅ Covered | §5.2 | "a description of the services provided" | — |
| R10 | Contract — service levels / KPIs | Mn 30 | Medium | ✅ Covered | §5.2 | "service levels and key performance indicators" | — |
| R11 | Contract — banking secrecy (Art. 47 BA equivalence) | Mn ~31, 41-43 | High | ⚠ Partial | §5.2, §7.1 | "confidentiality obligations of the service provider" / "the Bank's information security standards, which are aligned with ISO 27001" | Confidentiality is generic; no explicit invocation of Swiss banking secrecy regime, no provision for equivalent obligations on provider personnel |
| R12 | Contract — data protection clauses | Mn ~31 | High | ⚠ Partial | §7.2 (cross-ref only) | "transfer of client-identifying data outside Switzerland is subject to a separate cross-border data review under the Group Data Protection Policy" | Cross-references DPO policy but contract minimums in §5.2 are silent on data protection clauses |
| R13 | Contract — audit rights for the Bank | Mn ~32 | High | ✅ Covered | §9.1 | "the right to audit the provider's compliance with the contract, either directly or through a third party appointed by the Bank" | Direct and via-third-party — meets expectation |
| R14 | Contract — audit / access rights for FINMA or its agents | Mn ~32, 44 | High | ❌ Silent | — | — | §9 covers Bank's audit rights only; no FINMA / supervisor access provision |
| R15 | Contract — right to issue instructions to provider | Mn ~33 | High | ❌ Silent | — | — | Not addressed |
| R16 | Contract — termination including supervisory crisis | Mn ~34 | High | ⚠ Partial | §5.2 | "the right of the Bank to terminate the contract" | Generic right to terminate — does not enumerate triggers (breach, supervisory directive, M&A, regulated-status change, sub-outsourcing chain change) |
| R17 | Contract — sub-outsourcing controls | Mn ~35, 47-51 | High | ❌ Silent | — | — | Contract minimums in §5.2 do not reference sub-outsourcing |
| R18 | Contract — law and jurisdiction | Mn ~36 | Medium | ✅ Covered | §5.2 | "the law and jurisdiction applicable to the contract" | — |
| R19 | Bank retains full regulatory responsibility | Mn 38-39 | High | ✅ Covered | §6.1 | "The Bank remains fully responsible to its clients, counterparties and supervisors for any outsourced function. Outsourcing does not transfer regulatory responsibility" | Excellent — explicit, plain, and well-placed |
| R20 | Sub-outsourcing — consent, equivalent standards, chain of audit | Mn 47-51 | High | ❌ Silent | — | — | No reference to sub-outsourcing anywhere in the policy |
| R21 | Cross-border outsourcing — info access, audit, supervisor access, client-data protection | Mn 52-58 | High | ⚠ Partial | §7.2 | "transfer of client-identifying data outside Switzerland is subject to a separate cross-border data review under the Group Data Protection Policy" | Addresses cross-border *data* only; silent on cross-border *outsourcing*: information access, audit rights preservation, FINMA supervisor access |
| R22 | Provider must have BCP, tested at least annually | Mn ~59-60 | High | ✅ Covered | §8.1 | "service provider shall maintain a documented business continuity plan, tested at least annually" | — |
| R23 | Bank's own contingency for provider failure with defined recovery period | Mn ~61-62 | Medium | ⚠ Partial | §8.2 | "the Bank shall maintain its own contingency arrangements ensuring that critical functions can be sustained for a defined recovery period" | "Defined recovery period" is referenced but the period itself is not specified in the policy and there is no reference to where it is defined — ambiguity |
| R24 | Internal audit covers outsourced functions | Mn 63-66 | High | ⚠ Partial | §10.2 | "register shall be updated at least annually and made available to the internal auditors on request" | Register access is not the same as outsourced functions being in audit scope; no statement that internal audit's plan includes outsourced activities |
| R25 | Group-internal outsourcing — reduced but not zero requirements | Mn 67-72 | High | ⏭ Out of scope | §2.2 | "Group-internal service arrangements are out of scope of this document and are governed separately by the intra-group services framework (see GRP-FIN-021)" | **Reviewer action required: verify GRP-FIN-021 exists and adequately covers FINMA's expectations for group-internal outsourcing (responsibility, FINMA access, sub-outsourcing).** |
| R26 | Reporting / notification of significant outsourcing to FINMA | Mn 73-76 | High | ❌ Silent | — | — | No reference to supervisory reporting or notification obligations |
| R27 | Approval governance — material outsourcing requires escalated approval | General | High | ✅ Covered | §3.2, §3.3 | "Material outsourcing arrangements require, in addition, approval from the Group Operational Risk Committee… GEB shall be informed… on a quarterly basis" | Two-level approval + ExBoard awareness is appropriate |
| R28 | Documentation retention for due diligence and contract documentation | General | Medium | ✅ Covered | §4.2 | "retained for the duration of the contract and for five years thereafter" | 5-year retention meets typical regulatory expectation |

## Gap detail and recommendations

### R5 — Pre-outsourcing risk analysis
- **Status:** ❌ Silent
- **Severity:** Critical
- **What's missing:** The policy moves directly from approval (§3) to provider selection (§4) without any requirement to conduct a documented risk analysis before deciding to outsource. FINMA expects the bank to assess operational, legal, reputational, concentration, business-continuity, and compliance risks *before* signing a contract.
- **Recommendation:** Add a new §4.0 "Pre-Outsourcing Risk Analysis" placed before the existing §4 (Selection). Require that for each proposed outsourcing — and at least for all material outsourcings — a documented risk analysis covering the six dimensions above is completed and signed off by the responsible Business Line Head (and the Op Risk Committee for material arrangements) before the procurement / contracting phase commences.
- **Suggested owner:** Group Operational Risk (policy owner), in consultation with Group Compliance
- **Effort:** Medium

### R14 — Contract: FINMA / supervisor audit and access rights
- **Status:** ❌ Silent
- **Severity:** Critical
- **What's missing:** The §5.2 contract minimums and §9 audit-rights clauses cover the Bank's own audit rights but not FINMA's right of access — direct or indirect — to information, premises, and personnel of the service provider relating to the outsourced function. This is a near-universal FINMA expectation.
- **Recommendation:** Add to §5.2 contract minimums: "the right of FINMA or its appointed agent to access information, premises, and personnel of the service provider relating to the outsourced function." Add a cross-reference in §9. Confirm the wording with Legal.
- **Suggested owner:** Legal, with Group Compliance sign-off
- **Effort:** Light (textual change; will require contract template update)

### R15 — Contract: right to issue instructions
- **Status:** ❌ Silent
- **Severity:** Critical
- **What's missing:** The contract minimums do not preserve the Bank's right to issue instructions to the provider on the outsourced function. Without this, the Bank cannot demonstrate operational control — a structural FINMA expectation.
- **Recommendation:** Add to §5.2: "the Bank's right to issue binding instructions to the service provider in respect of the outsourced function."
- **Suggested owner:** Legal, with Group Operational Risk
- **Effort:** Light

### R17 — Contract: sub-outsourcing controls
- **Status:** ❌ Silent
- **Severity:** Critical
- **What's missing:** §5.2 does not reference sub-outsourcing at all, which means the contract template is silent on the Bank's right to consent (or refuse consent), to be notified, and to inherit audit rights through the chain.
- **Recommendation:** Add to §5.2: "sub-outsourcing terms: the service provider's obligation to obtain the Bank's prior written consent before sub-outsourcing any material component of the services, the provider's obligation to flow down equivalent obligations to sub-contractors, and the Bank's audit rights extending through the chain." Cross-reference to the new §X (sub-outsourcing) per R20 below.
- **Suggested owner:** Legal
- **Effort:** Light (textual change in §5.2; coordinated with R20 substantive section)

### R20 — Sub-outsourcing controls (substantive section)
- **Status:** ❌ Silent
- **Severity:** Critical
- **What's missing:** No policy-level treatment of sub-outsourcing exists. FINMA expects the Bank to retain visibility and control over the sub-contracting chain, including consent regimes for sub-outsourcing of significant components, equivalence of obligations down the chain, and audit-rights preservation.
- **Recommendation:** Add a new §X "Sub-Outsourcing" covering: (a) requirement for provider to seek consent before sub-outsourcing significant components; (b) provider's obligation to flow down equivalent obligations; (c) audit-rights preservation; (d) reporting to relationship owner / Op Risk on changes to sub-contractor base; (e) materiality test for which sub-outsourcings trigger Bank consent.
- **Suggested owner:** Group Operational Risk, with Legal and Group Compliance
- **Effort:** Medium

### R21 — Cross-border outsourcing
- **Status:** ⚠ Partial (one dimension addressed; three silent)
- **Severity:** Critical
- **What's missing:** §7.2 addresses cross-border data flows only. The policy is silent on cross-border outsourcing as a category, where FINMA has explicit expectations on information access, audit-rights preservation, supervisor access, and client-data protection.
- **Recommendation:** Expand §7 or add a new §X "Cross-Border Outsourcing" with four sub-sections: (a) information access — the Bank must demonstrate it can obtain information from the foreign provider; (b) audit rights — preserved in the foreign jurisdiction including in case of insolvency; (c) FINMA / supervisor access — confirmed in writing; (d) client-data protection — cross-reference to Data Protection Policy with additional safeguards for booking centres (incl. HK).
- **Suggested owner:** Group Compliance and DPO, with Cross-Border Compliance
- **Effort:** Heavy (substantive new content)

### R26 — Supervisory reporting / FINMA notification
- **Status:** ❌ Silent
- **Severity:** Critical
- **What's missing:** No reference to the Bank's obligation to inform FINMA of significant outsourcing arrangements (e.g. via supervisory returns) and to notify FINMA of material disruption or termination.
- **Recommendation:** Add a new §X "Supervisory Reporting" referencing (a) the standing supervisory-return treatment of significant outsourcing; (b) ad-hoc notification triggers (provider failure, material breach, intent to terminate a material arrangement).
- **Suggested owner:** Regulatory Reporting, with Group Compliance
- **Effort:** Light (mostly cross-referencing existing reporting framework)

### R3 — Documented materiality assessment
- **Status:** ⚠ Partial
- **Severity:** High
- **What's missing:** Materiality is implicit in the approval routing (§3.2) but the policy does not require a documented assessment, does not define the criteria for materiality (other than the definition in §2.3, which lacks a methodology), and does not specify re-assessment triggers.
- **Recommendation:** Add a sub-section in §3 making the materiality assessment a documented step in the approval workflow, with a defined trigger set (volume thresholds, criticality assessment, dependency analysis) and a requirement to re-assess on contract renewal, scope change, or sub-outsourcing change.
- **Suggested owner:** Group Operational Risk
- **Effort:** Medium

### R6 — Selection due diligence completeness
- **Status:** ⚠ Partial
- **Severity:** High
- **What's missing:** §4.1 covers financial soundness, professional experience, references, and infosec — but is silent on organisational and technical capabilities beyond infosec (BCP capabilities, scale, geographic resilience) and on provider reputation (regulatory standing, enforcement history, market reputation).
- **Recommendation:** Expand §4.1 bullet list to add: "organisational and technical capabilities, including service scaling, geographic resilience and operational maturity" and "reputation, including any past or pending supervisory action, enforcement history, and market reputation."
- **Suggested owner:** Group Operational Risk
- **Effort:** Light

### R11 — Banking secrecy
- **Status:** ⚠ Partial
- **Severity:** High
- **What's missing:** §5.2 references "confidentiality obligations" generically; §7.1 references ISO 27001 alignment. Neither expressly invokes Swiss banking secrecy (Art. 47 Banking Act) or imposes equivalent obligations on the provider's personnel.
- **Recommendation:** Strengthen §5.2 confidentiality clause to: "confidentiality obligations of the service provider equivalent to those imposed on Bank employees under Art. 47 of the Banking Act, with the provider undertaking to bind its personnel to corresponding obligations and to take such obligations into account in disciplinary procedures." Add a cross-reference in §7.
- **Suggested owner:** Legal, with Group Compliance
- **Effort:** Light

### R12 — Contract data protection clauses
- **Status:** ⚠ Partial
- **Severity:** High
- **What's missing:** Data protection clauses are not in the §5.2 contract minimums; the policy relies on §7.2's cross-reference to the Group Data Protection Policy. Contract minimums should be explicit.
- **Recommendation:** Add to §5.2: "data protection obligations consistent with the Federal Act on Data Protection and, where applicable, GDPR; standard contractual clauses where data are transferred to non-adequate jurisdictions; data breach notification obligations of the service provider."
- **Suggested owner:** DPO, with Legal
- **Effort:** Light

### R16 — Termination triggers
- **Status:** ⚠ Partial
- **Severity:** High
- **What's missing:** §5.2 grants the Bank a generic right to terminate, but does not enumerate the regulator-relevant scenarios where termination is expected to be possible (material breach, supervisory directive, change in provider's regulated status, M&A, sub-outsourcing chain change).
- **Recommendation:** Expand §5.2 termination clause to enumerate the above scenarios and align with the supervisory-directive trigger in particular.
- **Suggested owner:** Legal, with Group Compliance
- **Effort:** Light

### R24 — Internal audit covers outsourced functions
- **Status:** ⚠ Partial
- **Severity:** High
- **What's missing:** §10.2 grants internal auditors register access "on request" — but does not require that the internal audit plan include outsourced functions in its scope. FINMA expects outsourced functions to be in the audit universe.
- **Recommendation:** Add to §10 or a new §X "Internal Audit": "Internal Audit shall include outsourced functions, including material sub-outsourced components, in its risk-based audit planning. The Vendor Management Office shall provide the central register and supporting documentation to Internal Audit annually and on request."
- **Suggested owner:** Group Internal Audit, with Group Operational Risk
- **Effort:** Light

### R2 — Materiality definition completeness
- **Status:** ⚠ Partial
- **Severity:** Medium
- **What's missing:** §2.3 captures three of the four typical materiality factors (financial soundness, regulatory obligations, client service / continuity) but is silent on **client confidentiality** as a materiality factor in its own right.
- **Recommendation:** Amend §2.3 to add "or to maintain client confidentiality and the protection of client data."
- **Suggested owner:** Group Operational Risk
- **Effort:** Light

### R4 — Inventory content completeness
- **Status:** ⚠ Partial
- **Severity:** Medium
- **What's missing:** §10.1 specifies register content as counterparty, services, contract dates, relationship owner. Missing: materiality classification, last review date, risk rating, sub-contractor visibility.
- **Recommendation:** Expand §10.1 register minimum-fields list to add: materiality classification, last performance-review date, risk rating, primary sub-contractor(s) where material.
- **Suggested owner:** Vendor Management Office, with Group Operational Risk
- **Effort:** Light (policy-text change; system-side enrichment is separate)

### R23 — Defined recovery period
- **Status:** ⚠ Partial (Unclear language)
- **Severity:** Medium
- **What's missing:** §8.2 refers to "a defined recovery period" without specifying the period or stating where it is defined. The reader does not know whether this is per arrangement (set by the relationship owner), per criticality tier (set by the BCP policy), or undefined.
- **Recommendation:** Either set out a tiered recovery-period framework in the policy (e.g. by criticality tier) or cross-reference the BCP policy that defines it. Either way, eliminate the ambiguity.
- **Suggested owner:** Group Operational Risk, with BCP function
- **Effort:** Light

## Out-of-scope items

| R# | Requirement | Internal policy treatment | Reviewer action |
|---|---|---|---|
| R25 | Group-internal outsourcing — reduced but not zero requirements | §2.2 explicitly excludes group-internal arrangements, delegating to GRP-FIN-021 (intra-group services framework) | **Verify that GRP-FIN-021 exists, is in force, and adequately covers FINMA expectations for group-internal outsourcing including responsibility, FINMA access, sub-outsourcing controls, and BCP. If GRP-FIN-021 is silent on FINMA-relevant aspects, this becomes a Critical gap.** |

## Open questions for Compliance

- The Helvas policy is dated 1 March 2025 — i.e. ~14 months old at time of check, within the freshness window. However, the next review is scheduled for Q1 2027, which means this gap report could feed directly into that review cycle.
- The policy is silent on **whether subsidiaries outside Switzerland (HK, SG, LU, etc.) apply this policy** beyond the §1.2 fallback ("stricter local rules prevail"). FINMA's expectations on cross-border outsourcing apply to Swiss entities; jurisdictional fit for HK / SG branches needs separate verification.
- The treatment of **cloud-based service providers** is not differentiated — FINMA's supervisory communications since 2018 have addressed cloud outsourcing specifically (esp. FINMA Guidance 05/2018 and subsequent industry communications). Reviewer should consider whether a cloud-specific addendum is warranted.
- The policy structure refers to **Annexes (template DD questionnaire, template clauses, escalation matrix)** as "maintained separately and not reproduced here." The compliance check above does not assess the annexes; some Partial findings in §5.2 (R11, R12, R16, R17) may be upgraded to Covered if the template clauses already contain the language. Reviewer should request the annexes.
- Source verification: FINMA Circular 2018/3 requirement references in this report are reconstructed from public structural knowledge, not a live fetch of the current circular text. **All `R#` items should be cross-checked against the in-force version of the circular before the report is taken forward.**
