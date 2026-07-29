# Handoff: Design System Codification — 2026-04-20

## What we shipped (3 commits on main)

1. **`2ecfee4`** — Bold Documentary foundation
   - DESIGN.md rewritten (125 → 351 lines) to match what was shipping
   - Extracted 6 components: `DocHero`, `SectionHeader`, `HairlineGrid` + `HairlineCell`, `LeadVoice`, `PrinciplesList`, `DarkCTA`
   - Refactored 5 flagship pages: empathy-ledger, farm, goods, harvest, justicehub (-338 LOC)

2. **`ed00758`** — Two design languages documented
   - Recognized that 33 non-flagship pages use a different aesthetic (Warm Editorial) — not a drift, intentional hierarchy
   - DESIGN.md now documents **Bold Documentary** (flagship projects + homepage) AND **Warm Editorial** (meta/legal/directory pages)
   - Added a routing-rule table for "which language per page"
   - Warm Editorial palette codified: `#2F3E2E` olive, `#4D3F33` brown, `#6B5A45` warm-brown, `#E3D4BA` sand, etc.
   - Shared Warm Editorial components: `PageHero`, `SectionHeading`, `CardGrid`, `LivingSystemStrip` (17 pages)

3. **`d23199d`** — 4 more Bold Documentary components
   - `ReadingLede`, `PhotoBreak`, `EditorialSplit`, `ComparisonStatPair`
   - Refactored all 5 flagship pages to use them

## Current state

- **`src/components/design-system/`** has 10 components + barrel `index.ts`. Complete coverage of every recurring Bold Documentary pattern.
- **`src/components/`** (legacy Warm Editorial): `PageHero`, `SectionHeading`, `CardGrid`, `LivingSystemStrip` — untouched, 33 pages still use them correctly
- **`DESIGN.md`** (486 lines): the authoritative map. Start there for any new page.
- **Dev server:** was on `http://localhost:3300` in that session; may need restart

## Not yet shipped / candidates for next stage

Pick one. Ranked roughly by leverage:

### A) Homepage audit (smallest, highest info value — start here)
Recent commits include `4ce63c6 feat: rebuild homepage — 5 sections, new field videos, editorial layout`. Nobody has verified whether `src/app/page.tsx` uses the new `src/components/design-system/` exports or is hand-rolled. Per the routing rule, homepage = Bold Documentary. If it's hand-rolled, there's likely more component reuse available. If it already uses them, great — confirm and move on.

**Starter:** Read `src/app/page.tsx`, check imports, compare sections to available design-system components. ~15min.

### B) Warm Editorial primitives extraction
Warm Editorial pages have a systematic hardcoded pattern:
```
<div className="rounded-3xl border border-[#E3D4BA] bg-white/80 p-8 text-sm leading-7 text-[#4D3F33]">
  <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">...</h2>
  <p className="mt-4">...</p>
</div>
```
Used identically in `terms/page.tsx` (4×), `privacy/page.tsx`, and scattered elsewhere. Extract as `<WarmCard title="..." children={...}>` or similar. Also worth: `<WarmSection>` wrapper (`space-y-16 space-y-20` rhythm), `<WarmDualPanel>` for the "Foundation / Ventures" style dual-entity block seen in about/page.tsx.

**Also worth:** Extract Warm Editorial palette to CSS vars (`--we-olive`, `--we-brown`, `--we-sand`, etc.) so future palette adjustments happen in one place. Currently every page hardcodes `#2F3E2E`, `#4D3F33`, `#E3D4BA`, etc.

~45min including refactoring a few pages.

### C) Visual QA walk of flagship pages
I only captured hero screenshots during the session. Full-page walk on `localhost:3300/{empathy-ledger,farm,goods,harvest,justicehub}` would catch:
- The dark-section opacity ratification change (/70 → /60) — is there any regression?
- Spacing drift from the EditorialSplit refactor
- Any spec mismatch on responsive breakpoints

~30min + your eyes.

### D) Dark mode planning
DESIGN.md still says "Dark mode: Not planned." If you want to spec it (flip to a full dark theme vs. the current dark-section-moments approach), that's a design question that wants a short plan doc before implementation.

### E) Remaining legacy-era items
- `src/app/globals.css` has unstaged changes from before my session — not mine to commit. Review at your convenience.
- `page-v1-backup.tsx` exists in src/app — safe to delete if you're confident nothing references it. (`git grep page-v1-backup` returns zero outside the file itself.)

## Context for next Claude

- This codebase intentionally runs two coexisting design languages — DON'T try to migrate one to the other blindly. Read DESIGN.md first.
- `src/components/design-system/` = Bold Documentary (new)
- `src/components/PageHero.tsx` et al = Warm Editorial (legacy, still used)
- Legacy `PageHero` has totally different API (actions[], description, panelClassName, children slot) from new `DocHero` (eyebrow, title, subhead, primaryCta, secondaryCta). Don't confuse them.
- Font vars are loaded in `src/app/layout.tsx:10-20`: `--font-display` = Fraunces, `--font-body` = Source Serif 4, `--font-sans` = Work Sans.
- Supabase MCP used for data; flagship pages fetch via `getProjectData(slug)` from `src/lib/projects/get-project-data`.
- `leadStory.excerpt` can be null — guard with `leadStory?.excerpt ? ... : null`.
- Dev server: `npm run dev -- -p 3300` (port 3002 is taken by a different local project).
