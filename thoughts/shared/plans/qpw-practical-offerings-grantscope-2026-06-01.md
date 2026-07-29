# QPW practical offerings: from the Payout Wall to the way through

**Window:** Queensland Philanthropy Week, Mon 1 to Fri 5 June 2026.
**Drafted:** 2026-05-29. Companion to `confessions-qpw-comms-calendar-2026-06-01.md`.
**Grounding:** read-only review + a live tool test of `/Users/benknight/Code/grantscope` (CivicGraph). Source briefs: `thoughts/shared/handoffs/qpw-grantscope-tools-inventory.md` and `qpw-grantscope-insights-inventory.md`. Verified figures: `grantscope/output/foundation-power.provenance.md`.

## The idea in one line
We spent the week showing the sector the locked doors. The same week, we hand communities the key. The Payout Wall is the provoke; CivicGraph's grant tools are the way through. That is the whole mission in one arc: free for communities, institutions pay so communities do not have to. The power take-off, made literal.

## The arc
1. **Provoke** (already built, `/confessions` + `/art/the-payout-wall`): the concentration and the closed doors. How it feels (the gold phone) next to how it is built (the data).
2. **Hand over the keys** (CivicGraph, this plan): the open doors, a grant finder, a place-based gap map, the foundation directory. Not "here is how broken it is," but "here is the money that is actually open to you, and how to find it."
3. **The week is a live test:** does handing communities the intelligence institutions hoard actually help them find money? We instrument it and find out.

---

## What is real (reviewed + tested 2026-05-29)

### Tools
| Tool | What it does | Where | Readiness |
|---|---|---|---|
| **Grant-flow simulator** | Self-contained Monte-Carlo: model "if I apply to N grants/yr at this alignment, what funding outcome is realistic." Makes the odds tangible. | `grantscope/grant-flow-simulator.html` (828 lines, **0 external refs**) | **Ready now.** Offline, zero-cost, no login. Kiosk / iPad / embed. |
| **Grant finder** | Keyword + filtered search (state, source, type, category, closing date) + sort, over the grant-opportunity DB. Sources include ARC, Brisbane Grants, Lotterywest, and 57 Foundation Programs. | `/grants` | **LIVE at `grantscope.vercel.app/grants`** (tested). Public. Two gaps below. |
| **Foundation directory** | Browse funders + profiles (`/foundations/[id]`, `/compare`). The "research the funder you found" companion, and the link to foundation programs. | `/foundations` | Deployed (same app). Confirm content. |
| **CivicGraph MCP** | `civicgraph_search`, `civicgraph_funding_deserts`, `civicgraph_ask` via `npx civicgraph-mcp`. | MCP client | For a technical audience only, not walk-up. |

### Live test of the grant finder (the honest result)
- It works: real search, filters, sort, ~1,000 active records, ~401 "open-ish," foundation programs included as a source.
- **But** a natural query, `youth justice queensland`, returned **0 open opportunities.** A grantseeker who searches and gets nothing is the worst possible QPW moment. This is fixable and must be fixed before we point anyone at it (see Readiness gate 2).

### Insights (verified, packageable)
All five are EXACT / provenance-locked unless noted. Use these, not the superseded numbers (see traps).
1. **98.9% of giving foundations have no public way to apply** (112 of 10,133 publish an open program).
2. **45 foundations decide where half of the $12.95B goes** (top 100 = 66.7%); giving is ~3x more unequal than household income (Gini 0.948).
3. **Only 1 of the 15 biggest givers has a public front door** (Paul Ramsay Foundation); the other 14 are invitation-only.
4. **$43.3B sits in foundations paying out under 5% a year; $15.6B moved nothing.** The US has a 5% legal floor. Australia has none.
5. **Local QLD hook:** ACCO funding retention in QLD youth justice collapsed 100% to 28.6% in four years; only ~13% of recent QLD youth-program announcements have a traceable funded line. (Live in production already.)

### The grantseeker-useful flip (the heart of the offer)
Pair the place-based **funding-gap score** (`get_funding_gaps()`: external-share x SEIFA disadvantage x remoteness) with the **open grant opportunities + foundation programs**. The power story ("here are the locked doors") becomes a community story: **"here are the underserved QLD postcodes, and here is the money actually open to apply for."** That is what we give people, not just what we expose.

---

## The week's offerings (concrete)

### 1. The bridge: Payout Wall to the way through (small build, our repo)
On `/art/the-payout-wall`, after the receipts, add one CTA: *"You have seen the locked doors. Here are the ones that are open."* linking to the grant finder (or a QPW landing). This is the single highest-value change: it turns the provoke into a hand-over and is a ~1 file edit in `act-regenerative-studio`. One comms beat mirrors it: *"We did not just count the locked doors. We built the key."*

### 2. The simulator as a walk-up (zero risk)
`grant-flow-simulator.html` at any ACT presence during the week: kiosk, iPad, or embedded behind a short link. Offline, no login, no cost. It is the best conversation-starter because it lets a funder OR a grantseeker feel the odds the concentration produces.

### 3. The grant finder as "find money open to you now"
A short link (e.g. from the QPW posts) to the finder, pre-framed for QLD. Requires Readiness gates 1 + 2 first. The test is simple: do real people, searching real needs, find real grants.

### 4. The insight pack (shareable, tied to tools)
The five verified insights as cards, each ending in a tool, not a dead end. Example: *"98.9% of foundations have no front door. Here are the 112 that do."* link to the finder. The QLD youth-justice card is the local opener.

### 5. "Tell us what you are looking for" (consented capture)
A one-field capture at the finder or landing ("what are you trying to fund?"). Consented, it (a) gives us the week's demand signal and (b) seeds the `funding-autoresearch` tool later. Never store identifying detail without consent.

---

## The test (what we are actually measuring)
**Hypothesis:** communities will use a free, open grant-intelligence tool if we put it in front of them when the sector's attention is on giving.

**Signals (low-friction, even just Vercel analytics + a short link):**
- Finder: sessions, searches, **0-result rate** (the key health metric after the youth-justice finding), opportunity click-throughs.
- Simulator: interactions / completed runs.
- Foundation directory: profile views, compare uses.
- Qualitative: any "I found something I did not know about." A single real story is worth more than the counts.

**The one test to run before the week:** re-run `youth justice queensland` (and 5 to 10 other realistic QLD community queries) on the finder. If they return 0, the week fails quietly. Fix via Readiness gate 2.

---

## Readiness gates + decisions needed (pre-week)
1. **Domain decision.** `civicgraph.au` and `civicgraph.com.au` do **not currently resolve/serve** (tested). The finder is only reachable at `grantscope.vercel.app`. **Decide:** point the branded domain before QPW, or knowingly use the Vercel URL in posts. A bare `vercel.app` URL is functional but reads as unfinished to a sector audience.
2. **Content readiness (the 0-results gap).** DIAGNOSED 2026-05-30. It was two problems:
   - **A search bug (fixed):** the finder matched the whole query as one contiguous substring, so every multi-word search returned nothing unless a grant contained that exact phrase. Fixed in grantscope **PR #48** (tokenise + read state names as a geo filter). `indigenous arts` 5 to 22, `first nations housing` 0 to 1, `youth justice queensland` 0 to 1. Merge PR #48 before the week.
   - **A data-coverage gap (the real limit):** of 7,438 open grants, coverage is rich on national (3,084), arts (2,267), environment (1,505), community (1,016), first nations (569), but thin on QLD-specific (254), housing (84), disability (89). There is only ~1 QLD/National community youth-justice grant open. No search fix conjures grants that are not there.
   - **What to do for the week:** (a) **scope the demo to covered queries** that return rich results: "first nations", "community arts", "environment", "regional", national programs. Do not demo "youth justice queensland" cold. (b) Optionally **enrich** QLD community + foundation-program coverage via the gated `grant:programs:discover` / `grant:long-tail:discover` pipeline (cost-incurring, see below), run deliberately before the week, not live.
3. **Provenance gates on every published number.** Use the locked cuts only.

## Traps (from the review, do not trip these)
- **Donor-contractor stat:** the README's "140 entities / 58x" is a different cut from the provenance-locked "2,068 suppliers / ~15-16x." Pick one per artifact, never mix.
- **Hoard:** use **$43.3B / $15.6B** (provenance). The synthesis doc's $105B / $25B are **superseded.**
- **WHY.md punchy stats** (0.5% to First Nations, 82% of tax benefit to top decile, Minderoo = 25%): **UNVERIFIED in-repo.** Externally citable to Treasury/ATO and strong, but attach the primary source before publishing; do not present as CivicGraph findings.

## Out of scope / do not do during the week
- **Do not run live** (LLM cost + DB writes): `grant:programs:discover[:grounded]`, `grant:long-tail:discover`, `funding-autoresearch`. These populate the finder; run them deliberately and gated as pre-week enrichment if we choose, never as a live demo.
- No new data production. Use what exists.
- Do not expose any private individual. Public foundations are fair game; name systems, not people.

## Smallest version that still lands
If time is short: ship offering #1 (the Payout-Wall-to-finder bridge) + #2 (the simulator kiosk) + the insight pack. Both tools are ready or near-ready, both are zero-cost, and together they complete the arc (provoke, then hand over the key) without needing the content-enrichment work.
