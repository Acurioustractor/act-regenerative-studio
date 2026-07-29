# Handoff: Homepage Migration + Warm Editorial Extraction — 2026-04-20 (late session)

> Successor to `2026-04-20-design-system.md`. That session codified the two
> design languages and extracted 10 Bold Documentary components. This one
> picked up Option A (homepage audit) and Option B (Warm Editorial
> primitives) from that handoff.

## What we shipped (4 commits on main)

1. **`28e44e5`** — Homepage migration to Bold Documentary
   - `src/app/page.tsx` was 100% hand-rolled after the `4ce63c6` rebuild. All 5 sections now use design-system components:
     - §1 Hero → `DocHero` (extended)
     - §2 Flagship fields intro → `SectionHeader` (muted)
     - §3 Art callout → `EditorialSplit bg="dark"` + `SectionHeader onDark` + `DarkCTA`
     - §4 LCAA method → `SectionHeader align="center"` (extended)
     - §5 Invitation intro → `SectionHeader` (muted)
   - Bespoke patterns retained (flagship field image-overlay cards, art image grid, invitation path cards) — no reuse precedent, only 1 caller each.
   - `DocHero` extensions (additive, non-breaking for 5 flagship callers):
     - `fullHeight?: boolean` — sets `min-h-[100vh]` vs default `90vh`
     - `statsAfter?: ReactNode` — slot below CTAs with `mt-20`
     - `gradientStrength?: "default" | "strong"` — bright-video pages pass `"strong"` (darker overlay + brighter subhead + shadow on eyebrow/subhead). Default matches yesterday's ratified `/25` via stop.
   - `SectionHeader` extension:
     - `align?: "left" | "center"` — centered variant uses larger title scale + auto max-width on lede
   - Net: `page.tsx` 407 → 381 LOC.

2. **`9dacb57`** — Warm Editorial palette vars + `<WarmCard>` (phase 1)
   - Six core palette tokens added to `globals.css:22-28`:
     - `--we-olive` (`#2F3E2E`), `--we-olive-deep` (`#3A4A3D`)
     - `--we-brown` (`#4D3F33`), `--we-brown-deep` (`#4A4035`)
     - `--we-warm-brown` (`#6B5A45`), `--we-sand` (`#E3D4BA`)
   - `src/components/warm-editorial/WarmCard.tsx` — canonical card primitive with `title?` / `as?` / `headingLevel?` / `className?` props. When `title` is set, children wrap in `space-y-4`.
   - `terms/page.tsx` and `privacy/page.tsx` refactored to use `WarmCard` (8 cards total).
   - Also folded in a pre-existing unstaged `globals.css` change from before yesterday's session: extends the `full-bleed` CSS rule to handle ScrollReveal wrapper divs. Flagged in yesterday's handoff as "review at your convenience." Behavior is additive.

3. **`027b2b7`** — Site-wide hex → var sweep (phase 2)
   - 85 files touched. Pure token swap (958 insertions / 958 deletions — symmetric).
   - Touches: all ~47 Warm Editorial pages, plus shared components (`PageHero`, `CardGrid`, `LivingSystemStrip`, dashboard/admin/form/project-section components, `lib/projects/theme-styles.ts`).
   - Flagship pages (empathy-ledger/farm/goods/harvest/justicehub) unchanged — they don't use the Warm Editorial palette.
   - Caught a real bug before commit: the sed sweep initially matched hex values inside the palette definitions themselves, creating circular CSS var references (`--we-olive: var(--we-olive)`). Fixed before staging.

4. **`fd3fb6b`** — DESIGN.md sync + cleanup
   - `DESIGN.md` updated: Warm Editorial palette section now reflects CSS-var reality (core tokens vs. decorative page-scoped tones), card pattern points at `<WarmCard>`, components list includes it, four new decisions-log entries dated 2026-04-20.
   - Deleted `src/app/page-v1-backup.tsx` (1090 LOC, zero references confirmed).

## Current state

- **Bold Documentary components:** 10, all in `src/components/design-system/`. `DocHero` and `SectionHeader` now have more knobs but backwards-compatible defaults. Barrel at `index.ts`.
- **Warm Editorial components:** legacy (`PageHero`, `SectionHeading`, `CardGrid`, `LivingSystemStrip`) + new `WarmCard` in `src/components/warm-editorial/`.
- **Palette:** Bold Documentary in `--site-*` vars, Warm Editorial in `--we-*` vars. Both in `globals.css:5-28`.
- **Homepage:** ratified Bold Documentary.
- **DESIGN.md:** 486 lines → slightly more now. Authoritative.
- **Dev server:** `npm run dev -- -p 3300`. Port 3300 was held by a prior dev process during this session (PID 48935); Next hot-reloaded everything fine. If starting fresh, may need to kill that first.

## Not yet shipped / candidates for next stage

Pick one. Ranked by what's actually valuable vs. "could do":

### C) Visual QA walk (highest value — only you can do it)
I shipped a lot but only looked at one screenshot (homepage hero). Full-page walk needed on:
- **Homepage (`/`)** — confirm hero stats, flagship cards, art callout split, LCAA centering, invitation paths all render right at 1440px + mobile.
- **Flagship (`/empathy-ledger`, `/farm`, `/goods`, `/harvest`, `/justicehub`)** — confirm I didn't break anything via the hex → var sweep. I believe they weren't touched (different palette), but verify.
- **Warm Editorial spot-checks** — `terms`, `privacy` (refactored), `about` (has the one-off dual-entity gradient block I decided not to extract), `how-we-work`, `people`, `impact`, `ecosystem`. These went through the hex → var sweep. If any page looks wrong, the fix is almost certainly localized — a var name mismatch in one file, not a systemic issue.

**Starter:** `curl -s http://localhost:3300/terms | head -20` to confirm server's serving the refactor, then open the URLs in a browser.

### D) Dark mode planning
DESIGN.md line 481-ish still says dark mode is unplanned. If you want it, the question is:
- **Full dark theme** (flip `--site-bg` / `--site-ink` via `prefers-color-scheme` or a toggle)
- **Dark-section moments only** (what's shipping now — heroes + art callout are dark, everything else light)

The former is real work (every `#FAFAF7` over-dark → conditional, every `--site-surface` → conditional, test every flagship hero + Warm Editorial card + admin shell). The latter is already done. Write a short plan doc if you want to go down (a).

**Starter:** `thoughts/shared/plans/dark-mode.md` with user stories + which palette tokens need conditional values + migration strategy.

### E) Further Warm Editorial polish (if you really want to)
I considered and rejected these; re-evaluate if you disagree:
- `<WarmSection>` wrapper — 1 class (`space-y-16`), not worth the indirection
- `<WarmDualPanel>` — only 1 caller (`about/page.tsx` lines 109-143), classic premature abstraction
- Remaining bespoke decorative hex (gradient stops `#F6F1E7`/`#E7DDC7`/`#D7C4A2`, blob tints, hover-green `#4CAF50`) — intentionally kept literal since they're scoped to specific surfaces. Could be codified as `--we-gradient-start/mid/end` + `--we-hover-green` if they recur, but they don't.

### F) Homepage bespoke patterns — promote to primitives if they recur
- `<FieldCard>` — image-overlay project card (homepage §2 lead + 2×2 grid). Appears only on homepage today. Extract if another page wants it.
- `<PathGrid>` — three-column text-only link cards (homepage §5). Appears only on homepage.
- Stats strip — the pattern inside `statsAfter` slot could become `<InlineStats items=[{n, l}]>`. Three stats-shaped things live on the homepage alone; not enough.

## Context for next Claude

- **Don't mix Bold Documentary and Warm Editorial on one page.** DESIGN.md's routing rule is authoritative; consult it before adding any new page.
- **Palette extraction is done for the core Warm Editorial tokens.** If you're writing Warm Editorial code, use `text-[var(--we-olive)]` etc., never raw hex. The decorative gradient stops (`#F6F1E7` / `#E7DDC7` / `#D7C4A2`) and blob tints stay literal — they're intentionally page-scoped.
- **The homepage hero uses `gradientStrength="strong"`** because the aerial-fog video is bright in its upper third. If you add another bright-video hero, pass the same. Default `/25` stays for flagship pages (darker cinematic footage).
- **`DocHero` `statsAfter` slot is a general-purpose children slot** below the CTA row. Not limited to numeric stats — could hold anything you want under the hero text block.
- **`SectionHeader align="center"`** ups the title scale to `clamp(2.5rem,5vw,4.5rem)` (LCAA-style) vs. `clamp(2rem,4vw,3rem)` default. Don't use it for normal section headings — reserve for hero-equivalent centered blocks.
- **`terms/page.tsx` and `privacy/page.tsx` are the reference examples** for `<WarmCard>` usage. When converting another Warm Editorial page, look there.
- **`page.tsx` is ~381 LOC now; don't grow it with bespoke stuff.** If §2's `<FieldCard>` pattern starts appearing elsewhere, extract it — don't duplicate.
- **Dev server quirk:** port 3300 had a lingering process (PID 48935) during my session. It hot-reloaded fine. If you see EADDRINUSE on fresh start, that's why — `kill 48935` or pick a different port.
- **The pre-existing `globals.css` full-bleed wrapper fix was folded into my phase-1 commit** (`9dacb57`). It's now in history, no longer pending.
