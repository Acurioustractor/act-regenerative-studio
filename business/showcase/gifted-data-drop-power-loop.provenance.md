# Provenance — The Power Loop (donor-contractor data drop)

**Artifact:** `gifted-data-drop-power-loop.md`
**Run (locked):** 2026-05-29 · **Compiled for PA:** 2026-05-30
**Source of truth:** `grantscope/output/foundation-power.provenance.md` section 5 ("Donor-contractor loop"), Supabase project `tednluwflfhxyucgwigh` (CivicGraph). Datasets: AusTender (federal contracts), AEC (political donations), ACNC (charities).
**Live backing:** `civicgraph.app/reports/donor-contractors` (dynamic; reads the `mv_gs_donor_contractors` materialized view).

## Figures

| Figure in the drop | Value | Status | Source |
|---|---|---|---|
| Federal suppliers that also donate to parties | 2,068 | FLOOR (ABN-exact; `political_donations.donor_abn` ~21% filled) | provenance section 5 |
| Avg contract value, donor vs non-donor supplier | ~$208.6M vs ~$12.8M | EXACT (naive ABN-exact) | provenance section 5 |
| Multiple, published range | ≈15 to 16x | 16x naive / 15.1x entity-match | provenance section 5 |
| Total contract value held by donor-suppliers | ~$431B | EXACT | provenance section 5 |

## Caveats (do not overclaim)

- **Floor, not ceiling.** ~21% donor-ABN coverage means the overlap and the dollar totals understate reality.
- **Distributional only.** No causation. No named list in the gifted artifact (provenance guardrail 3).
- **Live vs locked.** The live report computes its entity count and dollar sums dynamically from `mv_gs_donor_contractors` and uses entity-matching, so the live count and totals may differ from the locked ABN-exact 2,068 / $431B. Reconcile the live MV against the locked provenance before quoting a single number out loud; quote the locked figures in print.

## Guardrails carried from the provenance lock

1. Population-level, ≈15 to 16x, conservative floor; never assert causation; never publish a named list.
2. Publish ACT's own openness score plus a one-page scoring methodology plus right-of-reply before naming any foundation closed.
3. Cite the 2026-05-29 run date; use the static snapshot; do not hit prod live for published numbers.

## Sibling discrepancy to fix before any PA use (not in this artifact, but flag it)

RECONCILED 2026-05-30 against the source (`foundations` table): **113 open / 98.9% no-door** across 10,133 givers. The provenance's 112 was right (now 113). The public Payout Wall snapshot was 102 / 98.99% (stale undercount); the generator was fixed (unique `id` tiebreaker, removed hardcoded `onlyOpenInTop15`) and regenerated 2026-05-30, so it now serves 113 too. Use **113 of 10,133, about 98.9%**. Do not use "1 of the 15 biggest givers" (hardcoded to 1 in the snapshot; the raw top-15 actually has two open and is mislabelled).
