# CivicGraph Entity Resolution Fix — donor-contractor overlap not resolved

**Date:** 2026-05-29
**Repo:** `/Users/benknight/Code/grantscope`
**DB:** Supabase `tednluwflfhxyucgwigh`
**Status:** Scoping brief (read-only investigation; no code/DB changes made)

---

## The problem (verified)

A raw ABN join (`political_donations.donor_abn = austender_contracts.supplier_abn`)
finds **2,078 distinct ABNs** that both donate to parties AND hold federal contracts —
the "donor-contractor moat" finding.

The unified `gs_entities` table resolves only **2** of those into a single entity whose
`source_datasets` carries BOTH a donation label (`aec_donations`/`donations`) and a
contract label (`austender`/`austender_contracts`/`contracts`).

### Live DB confirmation (queried `tednluwflfhxyucgwigh`, read-only)

```
dc_abns_total          : 2078
dc_abns_in_gs_entities : 2072   ← 99.7% ALREADY have an entity
carry_both             : 2
only_contract_side     : 723    (entity tagged austender/contracts only)
only_donation_side     : 561    (entity tagged aec_donations/donations only)
```

Distinct `source_datasets` among those 2,072 entities (top rows):
```
['austender']                       621   ← ABN is in BOTH tables, entity records ONLY contract
['aec_donations']                   329   ← ABN is in BOTH tables, entity records ONLY donation
['modern_slavery']                  319
['aec_donations','modern_slavery']  217   ← multi-element arrays exist ONLY where an
['ato_tax','modern_slavery']        200      ingest script explicitly read-then-merged
['acnc']                             78
[] (empty)                            67
...
```

This **rules out** two hypotheses:
- **Not "entities missing"** — 2,072/2,078 exist.
- **Not "ABN normalization mismatch"** — both ingest paths strip whitespace
  (`.replace(/\s/g, '')`) and the join is done on `gs_entities.abn` itself, which matches.

---

## Root cause: `source_datasets` is written **once** and never merged on ABN conflict

The entity graph is built by several scripts. The two that own donations + contracts
**both upsert with `ignoreDuplicates: true`** keyed on `gs_id`/`abn`, and they write a
**single-element** `source_datasets` array. The FIRST dataset to create an entity for a
given ABN wins; every later dataset's claim for the same ABN is **silently dropped by
Postgres** (the conflicting row is skipped, so its `source_datasets` is never appended).

Whichever pipeline ran first for a given ABN set the array:
- austender-first → `['austender']`, donation pass later is a no-op → 723 "only_contract_side"
- donation-first → `['aec_donations']`, austender pass later is a no-op → 561 "only_donation_side"

The 2 that carry both are accidental — created in a single `engine-entity-resolution.mjs`
run where the ABN appeared in multiple source tables *before the entity existed* (that
script merges datasets **in memory**, but only for ABNs **not yet** in `gs_entities`).

### Exact offending code

1. **`scripts/engine-entity-resolution.mjs`** ("THE CORE AGENT")
   - L173: `source_datasets: info.datasets || []` (good, merges in-memory)…
   - L182: `.upsert(entities, { onConflict: 'abn', ignoreDuplicates: true })`
   - …but L103/113/123/133 only add an ABN to the work set **`if (!existingAbns.has(abn))`**.
     So once an entity exists, this script never revisits it to add a newly-seen dataset.

2. **`scripts/build-entity-graph.mjs`** (master builder)
   - Suppliers L289 `source_datasets: ['austender']` + L296 `ignoreDuplicates: true`
   - Donors   L350 `source_datasets: ['aec_donations']` + L357 `ignoreDuplicates: true`
   - Each section hardcodes a one-element array and skips on conflict — never merges.

3. **`scripts/backfill-austender-entities.mjs`**
   - L107 `source_datasets: ['austender']` + L112 `ignoreDuplicates: true` (capped 1000/run).

4. **`scripts/overnight-linkage-sweep.mjs`** L147/202/261 — same `['<source>']` + create-only.

### Why the donor side is doubly starved

`gs_entities` donor rows depend on **`political_donations.donor_abn`** being populated.
That column is filled only by `resolve-donation-abns*.mjs` / `link-donation-abns.mjs` /
`resolve-donor-entities.mjs`, all of which backfill an ABN **only when a donor name already
matches an existing entity name**. None of them create an entity or touch `source_datasets`.
`resolve-donor-entities.mjs` builds donation **edges** in `gs_relationships` but only when
*both* endpoints already exist — it never adds `aec_donations` to a contractor's
`source_datasets`.

**Contrast — scripts that already do it right** (read-then-merge, so their datasets DO show
up in multi-element arrays above): `ingest-social-traders.mjs` (L391), `ingest-supply-nation.mjs`
(L270), `import-modern-slavery.mjs` (L210), `import-lobbying-register.mjs` (L367),
`migrations/link-ndis-providers.sql` (`array_append`). These prove the correct pattern is
already used elsewhere in the same codebase.

---

## Fix options

### Option A (RECOMMENDED) — ABN-keyed `source_datasets` reconciliation pass
A single idempotent SQL backfill that, for every ABN, unions the datasets it actually
appears in across the source tables and writes the merged array + count onto the entity.
No ingest rewrite needed; fixes the existing 2,072 and any future drift when re-run.

Sketch (run as a migration / one-off; re-runnable):
```sql
WITH abn_src AS (
  SELECT supplier_abn AS abn, 'austender'::text AS ds FROM austender_contracts WHERE supplier_abn IS NOT NULL
  UNION
  SELECT donor_abn,           'aec_donations'   FROM political_donations  WHERE donor_abn   IS NOT NULL
  UNION
  SELECT recipient_abn,       'justice_funding' FROM justice_funding      WHERE recipient_abn IS NOT NULL
  UNION
  SELECT abn,                 'acnc'            FROM acnc_charities        WHERE abn IS NOT NULL
  -- add ato_tax, ndis, modern_slavery, etc. as desired
), merged AS (
  SELECT abn, array_agg(DISTINCT ds ORDER BY ds) AS datasets FROM abn_src GROUP BY abn
)
UPDATE gs_entities e
SET source_datasets = (
      SELECT array_agg(DISTINCT d ORDER BY d)
      FROM unnest(coalesce(e.source_datasets,'{}') || m.datasets) AS d
    ),
    source_count = (
      SELECT count(DISTINCT d)
      FROM unnest(coalesce(e.source_datasets,'{}') || m.datasets) AS d
    )
FROM merged m
WHERE e.abn = m.abn
  AND NOT (e.source_datasets @> m.datasets);   -- only touch rows that actually change
```
- **Effort:** **S** (one SQL script + a dry-run count; ~half a day incl. verification).
- **Risk:** Low. Touches only `source_datasets`/`source_count`; gated by `@>` so it's a
  no-op on already-correct rows; fully re-runnable. Main risk = deciding the canonical
  label set (the DB mixes `austender`/`contracts` and `aec_donations`/`donations`) — pick
  one canonical token per source and normalize in the same pass to avoid splitting counts.
  Use the existing `pg_cron`/`exec_sql` path or run via MCP migration.

### Option B — fix the ingest/build scripts to upsert-merge instead of ignore-duplicates
Change the four create-only scripts to the read-then-merge pattern already used by
`ingest-social-traders.mjs` (or `ON CONFLICT (abn) DO UPDATE SET source_datasets =
(SELECT array_agg(DISTINCT d) FROM unnest(gs_entities.source_datasets || EXCLUDED.source_datasets) d)`),
and remove the `if (!existingAbns.has(abn))` gate in `engine-entity-resolution.mjs` so it
re-evaluates existing entities.
- **Effort:** **M** (4 scripts, each with batched upserts; needs the SQL-merge expression
  or a fetch-merge loop; plus a one-time backfill anyway for already-created rows).
- **Risk:** Medium. `array_agg` subselect inside a 500-row upsert is awkward in supabase-js
  (likely needs raw SQL via `exec_sql`), and removing the existence gate makes the "core
  agent" rescan ~350K entities every run (slower). Best paired with Option A for backfill,
  so this is really "A + harden ingest" — do it only if you want future runs self-healing.

### Option C (fast interim) — derived view / `gs_relationships` overlap, no entity merge
Materialized view surfacing the donor-contractor overlap directly from the raw tables,
e.g. `mv_donor_contractors AS SELECT abn, donor totals, contract totals FROM the join`,
and/or insert `gs_relationships` rows (`relationship_type='donor_and_contractor'`) for the
2,078 pairs so the UI/graph can show the moat now without fixing `source_datasets`.
- **Effort:** **S** (one MV + refresh, or one INSERT…SELECT into `gs_relationships`).
- **Risk:** Low, but it's a band-aid — `gs_entities.source_datasets`/`source_count` stay
  wrong, so anything that reads those (entity profile, dataset facets, "appears in N
  datasets") still under-reports. Good for an immediate public-facing number; doesn't fix
  the resolution layer.

---

## Recommendation

**Ship Option A now** (S, low risk) to correct `source_datasets`/`source_count` for all
2,072 existing entities — that alone turns "2 carry both" into ~2,072 and is the literal
ask. If you want the pipeline to stop re-introducing the drift, follow with **Option B**
on `engine-entity-resolution.mjs` + `build-entity-graph.mjs` (M) as a hardening step.
Option C only if a dashboard number is needed before A lands.

Canonicalization note for whoever implements A: settle the duplicate labels first —
`austender` vs `contracts`, `aec_donations` vs `donations`, `abr`/`ato_tax` — and normalize
to one token per source inside the same pass, or the merged `source_count` will still be
inflated/split.

---

## Files referenced
- `scripts/engine-entity-resolution.mjs` (L103-138 work-set gate, L173 array, L182 ignoreDuplicates) — primary
- `scripts/build-entity-graph.mjs` (L284-298 suppliers, L344-358 donors) — primary
- `scripts/backfill-austender-entities.mjs` (L99-112)
- `scripts/overnight-linkage-sweep.mjs` (L147/202/261)
- `scripts/resolve-donor-entities.mjs` (edges only, both-endpoints-must-exist)
- `scripts/resolve-donation-abns-v2.mjs` / `link-donation-abns.mjs` (fill donor_abn only)
- `scripts/import-aec-donations.mjs` / `sync-austender-contracts.mjs` (source ingest; never write gs_entities)
- Correct-pattern exemplars: `ingest-social-traders.mjs` L391, `ingest-supply-nation.mjs` L270, `import-modern-slavery.mjs` L210, `migrations/link-ndis-providers.sql`
