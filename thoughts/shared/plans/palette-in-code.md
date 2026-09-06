# Palette in code

**Written:** 2026-09-07, from thoughts/shared/findings/brand-live-review-2026-09-07.md (infra).
**Goal:** which of the two design languages a route speaks is decided by code and enforced, and the colour a component paints is always a named token.

## Found
- Type is one stack site-wide. Colour was two documented palettes plus a third, undocumented one: 1,690 raw hex occurrences in public code, the top values (a gold, four sands, two barks, a sage) used hundreds of times and named nowhere.
- DESIGN.md assigned Bold Documentary to five flagship routes, four of which redirect. Nothing in code decided, so /art painted with both families at once.

## Rule
`src/lib/design/design-language.ts`: longest route prefix wins; unlisted routes are editorial. Documentary routes use `--site-*` (Tailwind forest / clay / ink), editorial routes use `--we-*` (Tailwind we-*), the shell uses `--site-*`.

## Enforcement
`scripts/check-palette.mjs` ratchets two counts per file against `config/palette-baseline.json`: raw hex, and tokens from the other language in a route's page code. Any file that gets worse fails. `--update` locks in an improvement. Runs in the pre-commit hook and CI.

## Steps
1. (this PR) Name the top values as `--we-*` tokens with the same hex, replace every use by codemod (no pixel moves), add the rule, the ratchet and its baseline, wire the check.
2. Work the raw-hex count down per page family, editorial first (the catalogue), `--update` after each pass. Unmapped leftovers below ten uses each are page-local and get a local token or a Tailwind class.
3. Work the foreign-token count down: /art and /harvest stop using the other family; shared components take a `language` prop or split.
4. When both counts reach zero, the ratchet becomes a hard zero and the baseline file goes.

## Not decided
- Whether `--we-sand-line` (#E1D3BA) and `--we-sand` (#E3D4BA) are one colour with a typo. Both kept exact for now.
- Geist Mono: the map lists it as the parent's data font and nothing loads it. Needs a use or a map edit.
