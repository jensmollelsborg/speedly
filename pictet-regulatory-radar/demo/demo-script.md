# Hero Demo Script — Regulatory Radar

**Length:** ~3 minutes. **Audience:** fellow Pictet innovation-competition participants. **Goal:** they immediately understand the time saved and want it for their own team.

---

## 0. Opening line (15 seconds)

> "It's Monday morning. The Head of Wealth Management Switzerland wants a 1-page brief on what FINMA published last week affecting wealth management, and whether our policies already cover it. Normally that's 3–4 hours of work for a compliance analyst. We're going to do it in 2 minutes — and the analyst still reviews the output."

Set up the screen with Claude.ai open, skills bundle installed.

---

## 1. Act I — Find what's new (45 seconds)

**Type into Claude.ai:**

> "What did FINMA publish last week that's relevant to wealth management? Use regulator-watch."

What the audience sees:
- Claude invokes the **regulator-watch** skill
- Fetches the FINMA news / circulars / consultations pages
- Returns a digest with 2–3 High-relevance items, each with title, date, source URL, summary, Pictet-impact note

**Talking point:**
> "Notice three things: it cites every source, it filters for what's actually relevant to us — no retail-banking noise — and it tells me where to dig deeper."

---

## 2. Act II — Drill into one item (60 seconds)

**Type into Claude.ai:**

> "Take the top item and do an impact assessment for Pictet. Use reg-impact-assessor."

What the audience sees:
- Claude invokes **reg-impact-assessor**
- Fetches the source document, decomposes it into 4–6 numbered requirements
- Begins gap analysis — and calls `policy-lookup` to check existing Pictet policy

**Talking point (while it runs):**
> "Here's the composition. The impact assessor is calling the policy-lookup skill to check our internal policies. Two skills, talking to each other, doing the work an analyst does by hand."

---

## 3. Act III — The deliverable (45 seconds)

What the audience sees on screen:
- The completed impact assessment with all 7 sections (Source, Scope, Requirements, Gap analysis, Actions, Board summary, Open questions)
- "DRAFT" banner clearly at the top

**Talking point — pointing at the screen:**
> "Look at section 6. That's the Exec-Co summary, ready to drop into a paper. Look at section 5 — every action has a suggested owner and an effort estimate, working back from the regulator's deadline. And look at section 7 — the open questions Claude was honest about not being sure on. That's what makes this safe: it draws a clear line between what it knows and what a human still needs to decide."

---

## 4. Close — the library story (30 seconds)

Switch to **`catalogue/index.html`** in the browser (full‑screen). Scroll slowly through:

1. **The hero KPIs** — "4 built, 23 on the roadmap, 7 owning functions, 6 domains" — point at this on screen.
2. **Governance principles** — point at #3 (Functions own their skills) and #4 (Drafts, not decisions).
3. **The catalogue grid** — click the **Built** filter pill so only the four demo'd skills remain, then click **All** to show the full ambition. Optionally click **Regulatory** to show domain grouping.

> "What you saw is four skills out of a library we can grow. Universal skills like policy-lookup work for any team — HR, IT, Legal — anywhere there's a policy corpus. Domain skills are owned by the function that knows the topic. Compliance owns the regulatory skills. AML will own KYC. Legal will own contracts. The governance model is what makes this safe at scale: every skill has a named owner, every skill cites or refuses, every skill outputs drafts not decisions, and every skill is reviewed quarterly."

**Final line:**

> "Two minutes of compute for what's currently a half‑day of analyst work — and the analyst is now reviewing, not retyping. That's the win. The catalogue you see in front of you is how we make it safe to do that across the bank."

---

## Pre-demo checklist

- [ ] **Pick the demo regulation** — a real recent FINMA circular or consultation. Ideal: published in the last 2 weeks, plausibly wealth-management-relevant. *(Backup: have a second one ready in case the first doesn't fetch cleanly.)*
- [ ] **Sanity-check `regulator-watch`** the day before by running the exact prompt; if FINMA's news page has been restructured, update `references/regulator-sources.md`.
- [ ] **Pre-load `policy-lookup` with real or sanitised Pictet policy excerpts** — the bundled `sample-policies.md` is illustrative and won't impress a Pictet audience.
- [ ] **Have the impact-assessment template open in a side window** so you can flip to it if the demo runs slow.
- [ ] **Open `catalogue/index.html` in a second browser tab** ahead of the demo, in full‑screen mode. Test the filter pills (All / Built / Regulatory) — they should work offline since the file is self‑contained.
- [ ] **Rehearse with one colleague at least once.** Time it. If it's over 3:30, cut Act I narration.
- [ ] **Backup screen recording** — capture a clean run the night before in case live demo hits a network issue.

## Q&A — likely questions and answers

**Q: What happens if Claude hallucinates a requirement?**
A: The impact-assessor skill is explicit that it draws only from the source document and outputs a DRAFT. The gap-analysis line "Unknown — needs SME input" is a feature: the model is instructed to flag uncertainty rather than paper over it. And the final reviewer is a compliance officer, not the model.

**Q: Where does the client data go?**
A: For this demo, no client data. The skills work with public regulator pages and policy excerpts. Production rollout would use Pictet's approved AI environment per Data Protection §7 — the `policy-lookup` skill specifically reminds users not to paste client data into public AI tools.

**Q: How do other teams add their own skills?**
A: The library map describes a contribution model — one markdown template, function sign-off, central review. Phase 3 of the rollout is teams authoring locally with central governance only.

**Q: Why Claude.ai and not Claude Code?**
A: Claude.ai works for non-technical users — compliance officers, RMs, HR — without anyone needing a terminal. The same skill files can run in Claude Code later if a technical team wants them; the markdown is portable.

**Q: How current is this? Will it be out of date in 3 months?**
A: The regulator source URLs and policy index need quarterly review — that's in the governance model. The skill instructions themselves are stable.
