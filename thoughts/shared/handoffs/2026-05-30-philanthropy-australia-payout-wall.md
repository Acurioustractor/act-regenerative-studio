# Handoff: Philanthropy Australia positioning + Payout Wall accuracy

**Date:** 2026-05-30 (Sat) · **Branch:** `feat/confessions-lineage-qpw` · **PR:** #46 (open into main, NOT merged) · **By:** Ben + Claude

---

## Main goal

One spine, philanthropy accountability, two threads, both pointed at launch week:

1. **Public launch (Queensland Philanthropy Week, Mon 1 to Fri 5 June 2026).** The Payout Wall (`/art/the-payout-wall`) + Confessions (`/confessions`) + the QPW comms calendar are the public moment. The data behind them must be bulletproof.
2. **Institutional play (Philanthropy Australia).** Position ACT's open, cross-domain tools (CivicGraph, the Payout Wall, the donor-contractor data) to PA, the national peak body, as an accountability partner. PA's own funding map (Foundation Maps Australia) is member-gated, opt-in, Candid-owned, and incomplete by Candid's own admission. ACT's edge is open + cross-domain + a self-binding openness pledge a member-funded body cannot make.

## Done this session

**Strategy (`business/`):**
- `philanthropy-australia-positioning-brief.md` + `philanthropy-australia-deep-dive-addendum.md`, grounded on `deep-research-report.md` (Foundation Maps Australia).
- `showcase/`: `one-abn-demo-paul-ramsay.md` (live demo), `gifted-data-drop-power-loop.md` (+ `.provenance.md`), `leave-behind-deck.md` (3 pages: gap / pledge / offer), `README.md`.
- Recommended PA posture: **(a) accountability partner + (c) movement, never (b) vendor.** Lead with "we sell foundations nothing and represent none of them."

**Data + public-page fixes (PR #46):**
- Reconciled openness at source: **113 open / 98.9% no-door across 10,133 givers** (the public page had a stale 102 / 98.99%). Killed the "1 of 15 biggest" claim (raw top-15 had 2 open and is mislabelled).
- Fixed `scripts/build-payout-wall-data.mjs`: unique `id` tiebreaker (deterministic pagination), removed hardcoded `onlyOpenInTop15`, named cells now use the confirmed-grantmaker cut (Geoffrey Cumming, BHP, Paul Ramsay, Rio Tinto, not World Vision / universities). Regenerated `public/confessions/payout-wall.json`.
- Commits `f35e300` + `22adc10`, pushed, PR #46 open into main.

## Launch alignment (next week) — the review

- **QPW dates:** Mon 1 to Fri 5 June 2026 (launch Mon at Parliament House; Awards lunch Fri at City Hall). Comms calendar already in main (commit `fbca021`): Mon launch, Tue to Thu operator's-chair per flagship, Fri Friday Tape playback into the Payout Wall.
- **Critical path before launch:**
  1. **Merge PR #46** so the live Payout Wall serves 113 / 98.9% + clean named cells BEFORE the Friday playback points at it. (Tier 3, needs explicit go.)
  2. **Re-enable deploy Monday** (deploy was `disabled_manually`, see the launch-deploy-state memory + `handoffs/2026-05-29-launch-merge-deploy-fixes.md`).
  3. Confirm Tier-0 launch blockers (gold-phone line, QPW dates) from the launch-deploy-state memory are clear.
- **The PA play is post-QPW-ramp, not blocking next week.** QPW is the public spike; the PA pack is outreach during/after QPW toward the PA conference (Brisbane, 8 to 10 Sept 2026).

## Decisions needed

- Merge PR #46? (yes / when)
- Render the leave-behind deck into a designed one-pager for PA outreach? (optional)
- Greenlight the foundation-vs-operating-charity classifier as a follow-up project? (cleans the raw 10,133 / $12.95B universe, not just the named subset; synthesis gap #4)

## Key facts to carry (verified)

- **Openness: 113 / 98.9% no-door / 10,133 givers** (`foundations` table, 2026-05-30). Use this, never 102 / 98.99.
- Locked: $12.95B given, 45 give half, Gini 0.948, $43.3B under 5%/yr, 96.8% untraceable, donor-contractor ~15-16x. Provenance: `grantscope/output/foundation-power.provenance.md`.
- Guardrails: never name a closed foundation; PRF is the safe open-door example; distributional only; publish ACT's own openness + method + right-of-reply first.

## Pointers

- Memory: `project_philanthropy_australia_positioning`, `project_foundation_power_civicgraph`, `project_confessions_campaign`, `project_launch_deploy_state`.
- Related plans: `thoughts/shared/plans/confessions-qpw-comms-calendar-2026-06-01.md`, `qpw-practical-offerings-grantscope-2026-06-01.md`.
