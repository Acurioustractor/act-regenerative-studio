# Flagship hero stats — provenance check

**Date:** 2026-05-29
**Method:** Source-checked the hardcoded hero stats on the 5 flagship hubs against the live Supabase DBs — Empathy Ledger (`tednluwflfhxyucgwigh`), Empathy Ledger Enhanced (`yvnuayzslukamizrlhwb`, the one the site's media comes from), and Goods (`cwsyhpiuepvdjtxaozwf`). Every figure is hardcoded in the page files with no in-repo source.

**Verdict:** Mixed — not fabricated. Most have a traceable basis; several are stale (the DBs have grown), are curated subsets whose definition isn't stated, or are unverified.

## Empathy Ledger — `src/app/empathy-ledger/page.tsx`
| Stat shown | Live DB | Verdict |
|---|---|---|
| 412 storytellers | `project_storytellers` = **426** (Enhanced) | ✓ Real, now ~426. Refresh or round ("400+"). |
| 251 interviews recorded | `el_transcripts` = 52 (primary EL) | ⚠ Doesn't reconcile — confirm what "interviews" counts. |
| 588K words transcribed | not measured | ⚠ Unverified. |
| 20 organisations | `organizations` = 50 (Enhanced) / 104,422 (primary) | ⚠ Likely "orgs actively using EL" subset — say so. |

## JusticeHub — `src/app/justicehub/page.tsx`
| Stat shown | Live DB | Verdict |
|---|---|---|
| 1,000+ alternative models | not in these DBs (JusticeHub platform) | ⚠ Verify on the JH platform. |
| $94.6B funding tracked | not in these DBs (JH/ALMA funding) | ⚠ Verify on the JH platform. |
| 98,418 organisations | org/funder directory ~**104,422** (primary EL) | ✓ Same dataset; now ~104k. Refresh or round. |
| 97x cheaper | $1.3M / $14K = 92.8x | ✓ Derived; rounds to ~93x, not 97x. Recompute. |

## Goods on Country — `src/app/goods/page.tsx`
| Stat shown | Live DB | Verdict |
|---|---|---|
| 389 products deployed | 369 beds + 20 machines (lived story) | ✓ Narrative point-in-time total. |
| 8 communities | `communities` = 27 (Goods DB) | ⚠ "8" likely active-deployment subset — define. |
| 9,225 kg plastic diverted | not measured | ⚠ Unverified. |
| 1,000+ lives impacted | not measured | ⚠ Estimate — mark as approximate. |
| 33 community storytellers | not measured | ⚠ Unverified. |

## Recommendation before launch
1. **Refresh the verifiable counts** (412→426; recompute 97x; reconcile 98,418) — or switch to round, "+"-suffixed figures so they don't read as stale precision.
2. **Define the curated subsets** — "20 partner organisations", "8 active communities" — so the smaller number reads as intentional, not contradicting the larger directory.
3. **Source or soften the unverified ones** (251 interviews, 588K words, 9,225kg, 1,000+ lives) — confirm with the team or label as approximate.
4. Left **unchanged in code** pending your call — these are editorial claims ACT must stand behind.
