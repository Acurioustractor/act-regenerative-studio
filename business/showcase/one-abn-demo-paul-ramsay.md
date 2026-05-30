# One-ABN live demo — Paul Ramsay Foundation
### A 90-second walkthrough for a Philanthropy Australia meeting

## Why this subject

Paul Ramsay Foundation (PRF) is the single best demo entity. It is a top-15 giver (about $183M a year) and one of the very few large givers with a public application door (just 113 of 10,133 givers publish one). Naming PRF is guardrail-safe because we name it on the OPEN side. Its wealth traces to Ramsay Health Care, which both donates to political parties and holds federal contracts, so the same entity lineage carries all three threads (giving, donations, contracts) on one ABN spine. The arc ends on the positive, the open door, which sets a collaborative tone rather than an accusatory one.

## The aha

One screen, one entity, three datasets nobody else joins: where the money came from (contracts and donations) and where it goes (grants). Foundation Maps Australia can show none of the first two.

## The arc (90 seconds)

1. **(0:00 to 0:30) Open the foundation.** `civicgraph.app/foundations/prf`. "This is Paul Ramsay Foundation, a top-15 Australian giver, and the rare one with an open application program, the gold door. Here is what it gives, where it goes, who sits on the board, and which boards interlock with others." Point at: giving total, the open program, grantees (call out the percent community-controlled), board interlocks.
2. **(0:30 to 1:00) Follow the wealth to the join.** Search "Ramsay Health Care" (ABN 36 003 184 889). "The foundation's wealth traces to Ramsay Health Care. On the same ABN spine you see what a grants map never could: this company donates to both major parties (14 donations across the ALP and the Liberal and National parties) and holds federal government contracts (Defence, TAFE NSW). The amounts here are modest. The point is that the giving, the donations, and the contracts are one connected record." Step 3 carries the scale.
3. **(1:00 to 1:30) Zoom out to the system.** `civicgraph.app/reports/donor-contractors` ("Donate. Win Contracts. Repeat."). "PRF's open door is the exception. Here is the pattern: the entities that donate to parties also hold the contracts, joined from AEC and AusTender by ABN, drillable to the named record. Foundation Maps cannot see any of this, because it is grants-only and funder-supplied."

## Close line (ACT voice)

"We sell foundations nothing and represent none of them, and we publish our own openness score first. This is the open, cross-domain picture your Blueprint needs, and we will give you a cut of it for any priority area, with a right of reply built in."

## Pre-flight checklist (click-test the morning of)

- [ ] `civicgraph.app/foundations/prf` loads and shows giving, the open program, grantees, and board.
- [x] VERIFIED 2026-05-30: Ramsay Health Care (ABN 36 003 184 889) is in the donor-contractor set: 14 donations / $428.9K to both major parties, and 9 contracts / $796.4K (Defence, TAFE NSW). Amounts are modest, so frame step 2 as "the join exists, and it hedges both sides", not "huge contracts".
- [ ] `civicgraph.app/reports/donor-contractors` loads with current totals.
- [x] RECONCILED 2026-05-30 at the source (`foundations` table): 113 open / 98.9% no-door. Say "113 of 10,133, about 98.9% with no public way to apply." Do NOT say "1 of 15" (the raw top-15 has two open and is mislabelled). The public snapshot's 102 is an undercount to fix.
- [ ] Confirm the live domain (`civicgraph.app`) serves these routes.
- [ ] Have the gifted data drop (The Power Loop) ready as the leave-behind.

## Reference

- Routes (from the CivicGraph app): `/foundations/prf` (curated), `/entity/[gsId]` and `/entity/[gsId]/funding-flow` (any entity, the join view), `/reports/donor-contractors` (systemic). PRF foundation id: `4ee5baca-c898-4318-ae2b-d79b95379cc7`.
- Guardrails: name PRF on the open side only. Keep all "closed door" framing distributional and structural, never a named closed list, until ACT's openness scoring methodology and right-of-reply are public (provenance guardrails 2 and 4).
