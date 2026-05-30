# Showcase — pitch artifacts for Philanthropy Australia

Built 2026-05-30. Pairs with the strategy brief (`../philanthropy-australia-positioning-brief.md`) and the PA deep-dive addendum (`../philanthropy-australia-deep-dive-addendum.md`).

## What's here

- **`one-abn-demo-paul-ramsay.md`** — a 90-second live walkthrough on civicgraph.app, ending on PRF's open door, showing the giving + contracts + donations join.
- **`gifted-data-drop-power-loop.md`** — a one-page distributional data cut (the donor-contractor loop) to gift as a contribution to the Blueprint. FMA structurally cannot produce it.
- **`gifted-data-drop-power-loop.provenance.md`** — every figure, its source, its status, and the caveats.

## How to use it in a PA meeting

Lead with the live demo (show, do not tell). Leave behind the data drop plus a three-page deck (the gap, the pledge, the offer). Propose the openness-score pilot with right of reply. Posture: accountability partner, never vendor (see the brief).

## Must-fix before anything goes external (the "lock the numbers" gate)

1. **Openness figure — RECONCILED + FIXED 2026-05-30.** Source of truth (`foundations`) = **113 open / 98.9% no-door** across 10,133 givers; all artifacts use this. `scripts/build-payout-wall-data.mjs` was fixed (unique `id` tiebreaker for deterministic pagination; removed the hardcoded `onlyOpenInTop15`) and the snapshot regenerated, so the public Payout Wall now serves 113 / 98.9% too. Never say "1 of 15 biggest givers" (the raw top-15 has two open and is mislabelled).
2. **Never use the raw top-15 giver list as a "foundations" cut.** It is ranked on `total_giving_annual` and is full of operating-charity mislabels (World Vision, universities, churches, legal aid). Any openness-of-15 claim must use the `reportable_in_power_map = true` cut and name only the open-door side.
3. **Reconcile the live donor-contractor report with the locked figures.** The live MV is entity-matched and dynamic; the locked figures are ABN-exact (2,068 suppliers / $431B).
4. **Cite primary sources.** Some CivicGraph/GrantScope coverage figures are live-site or README-sourced and marked unverified internally.

These are exactly the items in the brief's "Next actions" #1.
