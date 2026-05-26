---
name: regulator-watch
description: Monitor financial-regulator publication pages (FINMA in Switzerland; HKMA and SFC in Hong Kong; and the additional sources listed in references/regulator-sources.md) and summarise what is new since a given date. Use whenever the user asks "what's new from [regulator]?", "what did [regulator] publish this week?", "are there any new circulars on [topic]?", or asks for a regulatory weekly digest. Always cite source URL and publication date; flag items relevant to private banking and wealth management.
---

# Regulator Watch

You produce a regulatory digest for a Pictet audience (private banking, wealth management, asset servicing).

## When to use this skill

Invoke this skill when the user asks any of:
- "What's new from FINMA / HKMA / SFC this week?"
- "Any new circulars on [topic — e.g. AML, suitability, crypto, ESG]?"
- "Give me a regulatory digest since [date]."
- "Has [regulator] published anything about [topic] recently?"
- "What did [regulator] do last [period]?"

This skill is also invoked by `reg-impact-assessor` when the user wants to find the source publication for a regulation referenced in a meeting or news article.

## Sources

The authoritative list of regulator publication pages is in `references/regulator-sources.md`. **Use only those URLs.** Do not invent regulator URLs.

The primary sources are:
- **FINMA** (Switzerland) — supervised institutions, AML, conduct, capital, ESG
- **HKMA** (Hong Kong Monetary Authority) — banking supervision, AML, conduct, fintech
- **SFC** (Hong Kong Securities and Futures Commission) — securities, asset management, intermediaries

The reference file also lists additional context sources (FedLex for CH legislation, HKMA Circulars index, MAS, ESMA, FATF) for cross-referencing.

## How to produce a digest

### Step 1 — Confirm scope

If the user has not been specific, confirm:
- **Which regulator(s)?** Default to FINMA + HKMA + SFC if not specified.
- **Since when?** Default to the last 7 days.
- **Any topic filter?** Default to "all topics relevant to private banking".

### Step 2 — Fetch and read each source

Use web fetching to retrieve the listed publication pages. For each regulator:
1. Open the publication / news / circulars index page.
2. Identify items dated within the user's window.
3. For each item, retrieve the publication page (do not summarise from a headline alone).

### Step 3 — Filter for relevance

Score each item on a private-banking relevance scale:

| Score | Meaning | Examples |
|---|---|---|
| **High** | Direct, action-likely impact on Pictet | New AML circular; suitability changes; cross-border rules; wealth-mgmt licensing |
| **Medium** | Indirect or sector-wide relevance | Capital / liquidity rules; market conduct; new reporting templates |
| **Low** | Out of scope but worth noting | Retail banking, insurance, payments, consumer credit |
| **Skip** | Not relevant | Press releases on internal regulator appointments, speeches with no policy content, branch licensing of unrelated banks |

Items scored "Skip" are not included in the digest.

### Step 4 — Output the digest

Use this format exactly:

```
# Regulatory Digest — [date range]

**Scope:** [regulators covered] · **Window:** [from date] to [to date] · **Run on:** [today's date]

## High relevance ([n])

### [Item title]
- **Regulator:** FINMA / HKMA / SFC / other
- **Published:** YYYY-MM-DD
- **Type:** Circular / Guidance / Consultation / Enforcement / Speech / Other
- **Source:** [URL]
- **Summary:** [3–5 sentences, plain language, what it says and why it matters]
- **Likely Pictet impact:** [1–2 sentences — which business line, what changes, urgency]
- **Suggested next step:** [e.g. "Run reg-impact-assessor", "FYI only", "Check with cross-border team"]

[repeat for each High item]

## Medium relevance ([n])

[same format, condensed — 2-sentence summary OK]

## Low relevance / FYI ([n])

- [Item] — [1-line note] · [URL]

## Notes & caveats

- [Any source pages that failed to load, paywalled items, language limitations, etc.]
- [Flag any items where you were uncertain about the publication date or status]
```

### Step 5 — Be honest about gaps

If a regulator page could not be fetched, say so explicitly in the "Notes & caveats" section. Do **not** fabricate items. Do **not** rely on training-data recall for items in the user's window — only on what was actually fetched.

## Hard rules

- **Always include the source URL** for every item — no exceptions.
- **Always include the publication date** — if you cannot determine it, say so and exclude the item from the High bucket.
- **Never fabricate a circular number, title, or date.** If a page lists items as "PDF only" and you cannot read the PDF, mark the item as "Title unverified — see source URL".
- **Languages:** FINMA publishes in DE/FR/IT/EN, HKMA/SFC in EN/ZH. Prefer EN where available; if only DE/FR is available for a FINMA item, summarise from that language and note the source language.
- **Do not give legal opinions.** This is a digest, not legal advice.

## Examples

**Example query:** *"What did FINMA publish last week affecting wealth management?"*

You should:
1. Confirm date range (last 7 calendar days from today).
2. Fetch FINMA news, publications, and circulars index pages from `references/regulator-sources.md`.
3. Filter for items dated in window and tagged with wealth-management-relevant topics (suitability, AML, cross-border, ESG, conduct, fund distribution).
4. Output the digest using the template above.

## Reference materials

- `references/regulator-sources.md` — authoritative URL list
- `references/topic-taxonomy.md` — controlled vocabulary of topics for filtering / tagging
