# CivicGraph next phase: make it unique + test against other tools

**Resume point.** Saved 2026-05-29. Read this first to pick the CivicGraph work back up.

## Where we are (done this session)
Shipped the grant-finder + entity-graph fixes to grantscope `main` (7 PRs, #48-#54, all merged + verified):
- Search works (tokenize + state-as-geo): `youth justice queensland` 0→1, `indigenous arts` 5→22.
- Targeting hits real grantmakers, not universities (#50).
- **QLD community grants enriched + live in the finder** (17, geo-tagged + unique-URL'd: Lady Bowen Trust, QCoal, Port Curtis Aboriginal Trust, Together For Humanity, John Villiers, etc.).
- **Donor-contractor moat realized in the entity graph: 5 → 2,076 linked entities** (four-way entities 2 → 494).
- Both strategy-brief claims verified: open/closed-door SOLID (113/11,010 open); four-way ABN linkage real (graph: 597k entities, 1.59M relationships, ~25 datasets).

Detailed state + numbers: memory `project-grantscope-grant-finder`. Docs in `thoughts/shared/plans/`: `civicgraph-grant-finder-strategy-2026-05-29.md` (the differentiation brief + verified numbers + messaging guidance), `civicgraph-entity-resolution-fix-2026-05-29.md` (root cause + the fix), `qpw-practical-offerings-grantscope-2026-06-01.md`. Tool/insight inventories: `thoughts/shared/handoffs/qpw-grantscope-*.md`.

## Do first (immediate blocker — server ops)
Two cron agents are merged but seeded **disabled**. On the orchestrator host: deploy `main` → `pm2 restart orchestrator` → 
```sql
UPDATE agent_schedules SET enabled = true
WHERE agent_id IN ('discover-foundation-programs-qld', 'reconcile-entity-source-datasets');
```
Until this runs, QLD enrichment (~40 foundations/12h through the 737) and daily drift-healing don't run. **The finder + graph need to be at full strength before the head-to-head testing below is fair.**

## Phase A — make it unique (differentiation)
Landscape is verified: no AU tool joins these public-but-siloed datasets; closest is Foundation Maps Australia (Philanthropy Australia + Candid), which is members-only, opt-in, grants-only. Invest here, in priority:
1. **Donor-contractor overlap as the hero, queryable surface** (now 2,076 linked). Build the public view/page. **Extend the entity-resolution reconciliation** (`reconcile-entity-source-datasets.mjs` SOURCES list) to acnc, justice_funding, ndis, ato_tax so the graph fully realizes (surfaces charity-contractor etc., pushes the 494 four-way higher).
2. **Open-vs-closed door + free foundation-program indexing** (the Payout Wall + the finder). The free, open angle no AU tool has.
3. **Free-for-communities** at scale (18k+ opportunities, 2.5-3x the largest commercial DB).
- Do NOT rebuild: alerts/eligibility/calendars/tracking (table-stakes); single-jurisdiction gov feeds (GrantConnect, business.gov.au); raw registry re-holding (the value is the join).
- Harden the ingest scripts (the brief's Option B) so the source_datasets drift never recurs at source.
- Messaging: "we cross-reference ~25 public datasets by ABN" + "2,078 entities donate AND hold federal contracts" + "99% of foundations have no open door" are all verifiable. Soften "links every entity four ways" until resolution is extended.

## Phase B — test against other tools (head-to-head)
The landscape research is done (in the strategy brief). The next step is **hands-on head-to-head testing**, once the crons are live:
- **Tools to test against:** SmartyGrants, GrantConnect, business.gov.au grant finder, The Grants Hub, GrantGuru, Strategic Grants, Foundation Maps Australia. (For the graph specifically: Candid / Foundation Directory, 360Giving / GrantNav, LittleSis.)
- **Tests:**
  1. *Grantseeker queries:* run a real set (QLD youth, community, first-nations, arts, disability) on CivicGraph's `/grants` vs each tool. Compare coverage + relevance of OPEN opportunities.
  2. *Funder research / who-funds-whom:* "who funds X", "who is connected to Y", "which entities donate AND hold contracts" — answers CivicGraph can give that the finders cannot.
  3. *Open/closed door + donor-contractor:* unique, no comparator. Document the gap.
- **Output:** a comparison matrix (CivicGraph vs each: coverage | open-opps | funder/entity data | cross-reference | price) to confirm/refine the differentiation + the public messaging.
- Could run this as a workflow (parallel: one agent per tool doing the same query set, then synthesize the matrix).

## Open / optional
- Extend reconciliation SOURCES (acnc, justice_funding, ndis, ato_tax).
- Harden ingest scripts (Option B).
- QPW practical offerings (the comms calendar + the finder demo) — `qpw-practical-offerings-grantscope-2026-06-01.md` + `confessions-qpw-comms-calendar-2026-06-01.md`; gated on confirming the gold-phone line answers.
- 8 unrelated sync edge cases (source+name dup, decimal-in-int amount) — backlog.
