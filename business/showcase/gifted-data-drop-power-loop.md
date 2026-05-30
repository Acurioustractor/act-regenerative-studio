# The Power Loop
### A gifted data cut for Philanthropy Australia, from A Curious Tractor

**One sentence.** Using only open public records, joined on a single ABN spine, we can show a pattern no grants map can: the entities that donate to political parties also hold vastly more in government contracts.

## The finding (population-level, distributional)

- Across federal data, **2,068 government suppliers also donate to political parties**. This is a floor: the political-donations source carries a donor ABN on only about 21% of records, so the true overlap is larger.
- Suppliers that donate hold, on average, roughly **15 to 16 times** the federal contract value of suppliers that do not. (About $208.6M versus about $12.8M per supplier on a strict ABN-exact match; a confidence-gated entity match lands at about 15.1x. We publish the range, ≈15 to 16x.)
- Donor-suppliers together hold on the order of **$431B** in federal contract value.
- **It is live and drillable.** The same analysis runs on `civicgraph.app/reports/donor-contractors` ("Donate. Win Contracts. Repeat."), cross-referencing AEC political donations against AusTender contracts by ABN, down to the named entity, the parties they gave to, and the departments they sell to.

## Why a grants map cannot produce this

Foundation Maps Australia shows grants that funders volunteer to report. It has no procurement layer, no political-donation layer, and no entity spine to join them. The loop between who funds parties and who wins public contracts is invisible to a grants-only tool by design, not by oversight.

## Method and limits (so it survives a hostile read)

- **Sources:** AusTender (federal contracts), AEC (political donations), ACNC (charities), joined in CivicGraph. Hand-verified run dated 2026-05-29, Supabase project `tednluwflfhxyucgwigh`.
- **Matching:** ABN-exact is the conservative floor; the entity-confidence match (≈15.1x) accounts for name and ABN variants.
- **Distributional and population-level.** It makes no claim about any individual supplier and asserts no causation. This gifted artifact names no one; the live tool lets a user drill to public named records if they choose.
- Every figure here is a **floor** because of the ~21% donor-ABN coverage.

## The offer

This is one cut. We can run the equivalent for any sector, or for any of the Blueprint's priority areas, on open records, with the method published and a standing right of reply. The aim is not to embarrass. It is to make the system legible enough to improve, which is what doubling structured giving by 2030 will require.

---
*Provenance: see `gifted-data-drop-power-loop.provenance.md`. Every figure traces to `grantscope/output/foundation-power.provenance.md` (the locked, hand-verified collection, run 2026-05-29). Distributional only; no named list; no causation asserted.*
