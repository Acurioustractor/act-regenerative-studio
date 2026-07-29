# CivicGraph grant-finder: do-it-today plan + uniqueness/effort verdict

**For:** Ben Knight, A Curious Tractor / CivicGraph
**Date:** 2026-05-29. From a 4-agent workflow (speed-up analysis + 2 web-research sweeps + synthesis).

## 1. Do all QLD enrichment today

**Decisive finding:** the scraper's politeness delay (2000ms) is **process-global, not per-foundation** — `discover-foundation-programs.mjs` builds one shared `FoundationScraper`, so every fetch in a process is serialised ≥2s apart **regardless of `--concurrency`**. Raising concurrency in one process does NOT speed scraping; throughput comes from **multiple processes**. (Also confirmed: `--frontier-pages` and `--grounded-search` are no-op flags; no per-state sharding exists outside `--full-sweep`; PR #51's frontier resilience is what makes a long multi-iteration run survivable.)

**Plan:** run on the **orchestrator host** (the sandbox IP throttles to "fetch failed"; the server runs discovery fine), as **4 parallel processes**, each looping the QLD agent ~5x with a distinct `--agent-id` (the `last_scraped_at` walk gives near-disjoint slices of the ~737). Stagger ~45s apart.

```bash
cd /path/to/grantscope && for i in 1 2 3 4 5; do \
  node --env-file=.env scripts/discover-foundation-programs.mjs \
    --geo=AU-QLD --limit=40 --concurrency=2 --rescan-days=14 \
    --frontier-window-hours=48 --agent-id=discover-foundation-programs-qld-a \
    --agent-name="Discover QLD A"; done
# Panes B/C/D: identical, started +45s / +90s / +135s, --agent-id=...-qld-b / -c / -d
```
Then **one** sync at the end:
```bash
node --env-file=.env scripts/sync-foundation-programs.mjs --cleanup-invalid --frontier-window-hours=72
```
**Cost ~$20–45 LLM + ~$1–3 embeddings. Wall-clock ~4–6.5h (today).** Freeze heavy analytical jobs during the window; if "fetch failed" appears, drop to 3 processes. **QLD only today** — national is 10–20x the pool (hundreds of $, re-triggers the throttle); do it once QLD proves the pattern. Caveat: this only reaches foundations already geo-tagged QLD; mis-tagged QLD funders remain a pre-existing coverage gap.

## 2. Is it unique?

**Yes — the combination is genuinely novel in Australia. No standing tool joins these silos.** The four datasets (ACNC financials, AEC donations, AusTender contracts, GrantConnect grants) are all public, free, ABN-keyed — but sit in **separate silos with no tool joining them**. CivicGraph's unified entity graph appears unduplicated nationally.

**Closest prior art:**
- **Foundation Maps Australia** (Philanthropy Australia + Candid) — nearest "who funds whom" AU tool, but members-only/paywalled, voluntary opt-in, **grants only** (no contracts/donations/ACNC-wide ingest).
- **LittleSis** (US) — closest in spirit (relationship power-mapping), but US-only, hand-curated, no AU procurement/grants.

**The three sharp edges (genuinely differentiated):**
1. **Donor-contractor overlap as a live queryable surface** (entities that donate to parties AND hold gov contracts). In AU this exists only as one-off journalism (Crikey/CPI), not a standing tool. **Sharpest differentiator — lead with it.**
2. **Open vs closed application-door classification.** No comparator does this; Candid/360Giving catalogue grants already made, none classify funders by whether their door is open.
3. **Free + community-governed**, where the richest AU tool (FMA) is members-only.

**Honesty flags (self-reported, verify before public use):** (a) full four-way ABN linkage; (b) explicit open/closed-door classification. Confirm both hold up before leaning on them publicly. *(Note: I can verify both against the DB directly — the open/closed-door data backs the Payout Wall, so (b) is real; (a) is checkable via the relationship counts.)*

## 3. Effort + how to make it unique

**Invest here (the white space):**
1. **The cross-referenced entity graph, donor-contractor first.** The moat — the one thing no AU tool offers as a standing surface; collapses two currently-gated markets (opportunity finders + funder data) into one. Proven media pull.
2. **Open/closed door + free foundation-program indexing.** Philanthropic depth is the weakest spot in every *free* AU tool (gov portals carry zero philanthropic coverage; depth needs paid Our Community / Strategic Grants / PA membership). The QLD run above is step one here.
3. **Free-for-communities positioning** at 18k+ opportunities (2.5–3x the largest commercial DB). Compare like-for-like (their figures are live/open counts).

**Do NOT rebuild (table-stakes / existing tools win):** alerts, eligibility matching, calendars, tracking; single-jurisdiction gov feeds (GrantConnect, business.gov.au — aggregate/link, don't re-source); raw registry data (ACNC/AEC/AusTender — the value is the *join*, not re-holding it).

**Effort verdict:** high-worth, focused bet. Differentiation is real and AU-unique but rests almost entirely on the **entity-graph cross-reference layer** (concentrate engineering there; treat finder/alerting as commodity parity features). Validate the two self-claims early; the public story depends on them.

## 4. Verification of the two self-claims (queried directly, 2026-05-29)

**Claim 2 (open vs closed door): VERIFIED.** 113 of 11,010 foundations have an open application program (~99% closed); `foundation_power_profiles` classifies 10,114 (9,028 reportable). Backs the Payout Wall. Lean on it freely.

**Claim 1 (four-way ABN linkage): real in the data, but "linked graph" overstates it.**
- Graph is real + large: 597,234 entities, 347,047 with ABN, 1,587,148 relationships (10 types), ~25 source datasets (acnc, austender, aec_donations, foundations, ndis, lobbying...), 20,594 entities cross-referenced across 2+ datasets.
- Donor-contractor overlap is REAL via ABN join: **2,078 ABNs** both donate to parties and hold federal contracts; ~$8.5B donated, ~$431B in contracts (~51x ratio, consistent with the README's "58x"). The README's "140" is a stricter subset.
- BUT only **5** of the 2,078 are RESOLVED into unified entities carrying both source_datasets (only 2 entities span all four datasets). The cross-reference is computable today (direct ABN join); the entity-RESOLUTION layer that makes it a clean "linked graph" is incomplete. A resolution problem, not a data problem.

**Messaging guidance:**
- Safe (verifiable now): "2,078 entities both donate to parties and hold federal contracts"; "99% of foundations have no open door"; "we cross-reference ~25 public datasets by ABN".
- Soften: "our graph links every entity four ways" reads as overclaim; frame as cross-referencing, not fully-resolved linkage, until resolution improves.
- The fix that turns 5 into 2,078 linked donor-contractors is the highest-leverage engineering (it realises the moat). Scoped in `civicgraph-entity-resolution-fix-2026-05-29.md`.
