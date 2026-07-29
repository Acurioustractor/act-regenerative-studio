# QPW Insight Inventory — CivicGraph (grantscope)

**Purpose:** packageable, defensible philanthropy-power insights for Queensland Philanthropy Week (Mon 1 – Fri 5 June 2026). Framing: *who funds whom, where money + power sit, where the gaps are.* Public foundations are fair game; never expose private individuals.
**Source repo:** `/Users/benknight/Code/grantscope` · **Inventory run:** 2026-05-29 (read-only; no queries executed)
**Provenance rule applied:** VERIFIED = has a provenance doc / is query-backed in app · UNVERIFIED = asserted in positioning prose with no in-repo source.

---

## The locked core (verified, this is the spine)

Two files, produced in a prior session, are the verified core. **The provenance lock supersedes the synthesis where they disagree** — use the provenance numbers.

- `output/foundation-power.provenance.md` — hand-run read-only SQL against Supabase `tednluwflfhxyucgwigh`, 2026-05-29. **Authoritative.**
- `output/foundation-power-synthesis-2026-05-29.md` — narrative + campaign-ready phrasings. **Contains superseded "hoard" numbers** ($105B/$25B broad cut) — DO NOT publish those; the provenance doc corrects them to the reportable cut ($43.3B / $15.6B).

---

## Insight table

| # | Headline (one line) | Source / table | Provenance |
|---|---|---|---|
| 1 | **98.9% of foundations have no public way to apply** — only 112 of 10,133 giving foundations publish an open application program. | `foundations.open_programs` (jsonb non-empty) · provenance §2 | **VERIFIED** ✓ EXACT |
| 2 | **Only 1 of the 15 biggest givers has a public front door** (Paul Ramsay Foundation); the other 14 are invitation-only. | `foundations` top-15 by `total_giving_annual` · provenance §2 | **VERIFIED** ✓ EXACT |
| 3 | **45 foundations decide where half the money goes** — of $12.95B/yr across 10,133 foundations, top 45 = 50.1%, top 100 = 66.7%. | `foundations.total_giving_annual` (cumulative share) · provenance §1 | **VERIFIED** ✓ EXACT |
| 4 | **Foundation giving is ~3x more unequal than household income** — Gini 0.948 vs ~0.32. | computed on giving distribution · provenance §1 | **VERIFIED** ✓ EXACT |
| 5 | **96.8% of a year's giving can't be traced to a named recipient** — $415.5M lifetime traced (1965–2026) vs $12.95B in one year. | `foundation_grantees` (6,001 edges, 181 foundations) · provenance §3 | **VERIFIED** ✓ EXACT |
| 6 | **$43.3B sits in foundations paying out under 5%/yr; $15.6B moved nothing** in latest filing. US has a 5% legal floor, Australia has none. | `foundation_power_profiles.reportable_in_power_map=true` joined to ACNC net assets · provenance §4 | **VERIFIED** ✓ (reportable cut only; CORRECTED from synthesis) |
| 7 | **The closed door is a choice, not a size effect** — closed vs open foundations hold near-identical capital power (0.53 vs 0.57) but openness 0.42 vs 0.93. | `foundation_power_profiles.openness_score / capital_power_score` · synthesis §7 | **VERIFIED (indicative)** — query-backed but not in the strict provenance lock; re-run before headline use |
| 8 | **Chasing small funders is chasing <1% of the money** — the system is built around the few. | derivation from #3 distribution · synthesis bite-size | **VERIFIED** (follows from #3) |
| 9 | **Donor-contractor loop: a federal supplier that also donates holds ~15–16x more in contracts** than one that doesn't; 2,068 such suppliers; ~$431B total contract value held. | ABN-exact match `austender_contracts.supplier_abn` × `political_donations.donor_abn` · provenance §5 | **VERIFIED — FLOOR** (donor_abn only ~21% populated; publish "≈15–16x") |
| 10 | **"140 entities donate AND contract — $80M donated, $4.7B contracts, 58x return"** (README / live `/reports/donor-contractors`). | `mv_gs_donor_contractors` (live MV, app-rendered) | **VERIFIED-in-app but DIFFERENT CUT** — conflicts with #9; 140-entity/58x is a narrower cross-ref, the 2,068/15–16x is the provenance-locked one. **Do not mix the two on one page.** |
| 11 | **Interlocking boards: 11.7% of trustees hold 33.8% of all foundation board seats; one trustee slate is legal trustee of 475 trusts.** | `board_members` (raw text, not parsed person graph) · synthesis §8 | **UNVERIFIED / weakest layer** — "treat as indicative" per synthesis; do not publish as a hard number |
| 12 | **First Nations communities receive 0.5% of philanthropic funding.** | README "Why This Matters" | **UNVERIFIED** — no in-repo source; widely-cited external stat, needs a primary citation before use |
| 13 | **82% of the charitable-deduction tax benefit goes to the top income decile; 71% to people donating >$1M; $2.26B foregone revenue (2022–23).** | `WHY.md` (cites Treasury) | **UNVERIFIED in-repo** — attributed to Treasury but no provenance doc; verify against Treasury Tax Expenditures Statement before publishing |
| 14 | **Minderoo reported $4.9B donations/bequests in 2023 ≈ 25% of sector donation revenue.** | `WHY.md` | **UNVERIFIED in-repo** — names a private-family foundation; defensible only with ACNC AIS citation + right-of-reply |
| 15 | **Geographic distortion: WA average deductible claim $11,534 vs QLD $660, but WA median just $120** — a few mining mega-gifts skew the average. | `WHY.md` (ATO taxstats table) | **UNVERIFIED in-repo** — strong QPW angle if sourced to ATO Taxation Statistics; not query-backed here |
| 16 | **PAFs distributed $799M + PubAFs $487M = $1.287B structured giving (2022–23); environment + international together <5.3%.** | `WHY.md` (ATO ancillary-fund data) | **UNVERIFIED in-repo** — verify against ATO before publishing the category split |

### Place-based / allocation (the grantseeker-useful layer)

| # | Headline | Source / table | Provenance |
|---|---|---|---|
| P1 | **Funding gap score per postcode/LGA** — `external_share × disadvantage × remoteness`, surfaces the most underserved communities. | `mv_funding_by_postcode` + `get_funding_gaps()` RPC (`20260308_place_funding_views.sql`), SEIFA 2021 IRSD decile, remoteness | **VERIFIED (methodology exists in migration)** — a working, transparent formula; the underlying funding completeness is the caveat, not the method |
| P2 | **18,069 open grant opportunities + 2,472 linked foundation programs** — the "where money is actually open to apply" inventory. | `grant_opportunities`, `foundation_programs` (status='open', deadline, amount_min/max, categories, eligibility) | **VERIFIED (counts from README/MISSION)** — this is the constructive flip side of insight #1 |

---

## QLD-specific (best fit for *Queensland* Philanthropy Week)

| # | Headline | Source | Provenance |
|---|---|---|---|
| Q1 | **QLD youth justice: $1.15B in non-aggregate funding rows; $115.5M to community-controlled orgs; ACCO funding retention collapsed 100% → 28.6% (2020-21 → 2024-25).** | live flagship `/reports/youth-justice/qld/sector`; tables `justice_funding`, `v_acco_yj_retention_qld`, `mv_yj_report_acco_gap` (12%/88% ACCO split) | **VERIFIED-in-app** — flagship built on live DB views; shipped to prod (handoff `qld-youth-justice-flagship-2026-05-01.md`). Numbers are render-time live. |
| Q2 | **Only ~13% (3 of 23) of recent QLD youth-community-program announcements have a traceable funded line** in the data. | same flagship, §6.5 match-and-deliverer chain | **VERIFIED-in-app** (registry-pattern lookup against `justice_funding`) |
| Q3 | **Detention costs ≈$2,845/night, 72% return within 12 months (+5.9pp), detention spend +141% since 2017-18** — the cost-of-the-status-quo frame. | flagship "Outcome Math" block, `outcomes_metrics` | **VERIFIED-in-app** (note: some §25 outcome columns are proxy data per handoff) |
| Q4 | **QLD "crime prevention schools": $80M committed (4 sites); OHANA Education holds a $1.65M DYJVS contract; Men of Business named politically but no recorded amount.** | `thoughts/reports/qld-crime-prevention-schools-investigation-2026-04-10.md` | **VERIFIED-with-caveat** — public commitments + named providers + visible contract field are sourced (Hansard, ministerial statements); the *selection-process* allegation is explicitly NOT provable from local data |

---

## What's already locked vs what needs verification

**Locked — ship as-is (cite the 2026-05-29 run date, bake a static JSON snapshot, don't hit prod live):**
- Insights **1–6, 8, 9** — every figure reproduced by hand-run SQL with a provenance doc. These are the campaign spine.
- The **reportable hoard cut** ($43.3B / $15.6B) — use this, NOT the synthesis's $105B/$25B.
- The **place-gap methodology** (P1) and the **open-grants inventory** (P2) — both real, and they are the constructive "find money" counterweight.
- **QLD youth-justice flagship** (Q1–Q3) — already live in production, QLD-specific, the strongest local hook.

**Needs verification before any public claim:**
- **#7 (closed-door-is-a-choice)** — query-backed but outside the strict lock; re-run the openness-vs-power comparison.
- **#10 vs #9 donor-contractor conflict** — TWO different cuts of the same idea (140/58x vs 2,068/15–16x). Pick ONE per artifact and state the universe. The provenance-locked one is #9.
- **#11 board interlocks** — `board_members` is raw text, not a parsed person graph. Indicative only; do not publish hard percentages.
- **#12–#16 (the WHY.md stats: 0.5% First Nations, 82% top-decile tax benefit, Minderoo 25%, WA/QLD claim skew, PAF category split)** — all asserted in positioning prose with NO in-repo provenance. Several are externally citable (Treasury, ATO taxstats) and would be strong QPW material, but each needs its primary source attached before publishing. Do not present as CivicGraph findings.

**Publishing guardrails (from the provenance lock — non-negotiable before naming any foundation):**
1. Hoard stays distributional, never a named "hoarder" list.
2. Openness framed factually ("112 open / no public application route"), not as judgement ("secretive").
3. Donor-contractor: population-level, conservative floor, never assert causation.
4. Publish ACT's own openness score + scoring methodology + right-of-reply BEFORE naming any foundation "closed."
5. `reportable_in_power_map=true` filter is mandatory (strips mislabeled universities / housing / Native-Title trusts).

---

## Data shape notes (for whoever builds the artifact)

- `foundations` — `total_giving_annual`, `open_programs` (jsonb), `thematic_focus[]`, `geographic_focus[]` (e.g. `AU-QLD`), `target_recipients[]`, `endowment_size`, `giving_ratio`, `type` (PAF/PubAF/trust/corporate). **`geographic_focus` filter = the QLD subset.** Note: endowment_size populated on only ~27 foundations (lean on ACNC net-assets join for corpus).
- `foundation_power_profiles` — `openness_score`, `capital_power_score`, `gatekeeping_score`, `approachability_score`, `public_grant_surface` (bool), `reportable_in_power_map` (bool), `capital_holder_class`, `capital_source_class`. *Exclude `capital_source_class='unknown'` to say "foundations".*
- `grant_opportunities` (~18K) + `foundation_programs` (~2,472; status/deadline/amount_min/max/categories/eligibility) — the open-to-apply layer.
- `acnc_ais` — per-ABN per-year financials: `revenue_from_government`, `donations_and_bequests`, `total_revenue`, plus net-assets fields; `charity_size`, `staff_fte`, `staff_volunteers`. Use latest filing per ABN.
- `political_donations` — `donor_name`, `donor_abn` (only ~21% populated → floor), `donation_to`, `amount`, `financial_year`, `source_state` ('federal'/'QLD'/'NSW'/'VIC' — **QLD state donations are isolable**).
- `austender_contracts` — `supplier_abn`, `contract_value`, `buyer_name`, `category`, `supplier_acnc_match`/`supplier_oric_match` flags.
- Place layer: `mv_funding_by_postcode` (+ `get_funding_gaps()` RPC), `seifa_2021` (IRSD `decile_national`), `postcode_geo` (remoteness_2021, locality).

**Universe-reconciliation warning (from the lock):** CivicGraph's $12.95B = annual giving across its 10,133 AI-enriched foundations. That is a *different universe* from ACNC all-grant-makers $11.28B (2023) and total donations >$13B (2021). Always state which universe; never sum overlapping theme totals.
