---
date: 2026-04-20T23:30:00Z
purpose: Self-contained prompt to paste after /clear to resume this work stream
---

# Bootstrap prompt for the next session

Paste everything below this line as your next message after `/clear`.

---

Resuming the **ultimate-project-pages** work stream on ACT Regenerative Studio (`/Users/benknight/Code/act-regenerative-studio`).

**Full handoff ledger:** `thoughts/shared/handoffs/ultimate-project-pages/current.md`. Read it first — it has every shipped item and the open options.

**Project at a glance**
- Next.js 15 + Supabase + TypeScript + Tailwind. Dev server runs on **port 3300** (not 3001 — CLAUDE.md is out of date). Test harness: `npm run build && npm run dev`.
- Sibling repos used by this work: `/Users/benknight/Code/act-global-infrastructure/wiki` (markdown wiki, source of truth), `/Users/benknight/Code/empathy-ledger-v2` (sibling Next.js app providing storyteller + transcript APIs), `/Users/benknight/Code/act-ecosystem` (project-codes.json).

**What this session shipped (don't re-do)**

1. Visual QA + 5 follow-through fixes (deleted 19 stale redirects in `next.config.js`, per-project `<title>` via `generateMetadata`, `ScrollReveal` SSR fix, Descript CDN host, `inferMediaKind` URL sniffing).
2. Empathy Ledger storyteller + transcript integration — sync scripts, typed reader libs with consent gates, `TranscriptsSection` component wired into `/projects/[slug]`, `/storytellers` + `/storytellers/[id]` pages, "Storytellers" in main nav, cross-linked from `CommunityVoicesSection`. Snapshots are empty (no `EMPATHY_LEDGER_API_KEY` in env yet).
3. New site-scoped transcripts endpoint added to `empathy-ledger-v2/src/app/api/v1/sites/[siteSlug]/transcripts/route.ts` — scopes via `gallery_syndication_consent`, replaces the JusticeHub-only `/api/v1/content-hub/transcripts`. Sync script prefers it, falls back on 404. **Not deployed yet.**
4. Wiki → Supabase connection — 3-tier resolver in `canonical-site-wiki.ts` (Supabase → live filesystem at `../act-global-infrastructure/wiki` → build-time snapshot). Seed script at `scripts/seed-wiki-to-supabase.mjs` (run via `npm run seed:wiki-to-supabase`, 328 pages). Wiki editing live at `/wiki/[slug]/edit` (server action, gated on `WIKI_EDIT_TOKEN` env).
5. **Wiki is now source of truth for project pages.** Five fields auto-flow from `wiki/projects/<slug>.md` to `/projects/[slug]`: LCAA (Listen/Curiosity/Action/Art), pull-quote + author, stats (`## By the Numbers`), Key People (`## Key People`), and Backlinks (`## Backlinks`) which drive both the new "Connected in the wiki" block AND the existing "Related Projects" card grid (replacing theme heuristic). Research loop is automatic: edit any wiki doc, refresh the project page, changes appear — no sync command, no rebuild.

**Key source files to know**
- `src/lib/wiki/project-lcaa.ts` — all wiki project-doc extractors (LCAA, quote, stats, keyPeople, backlinks)
- `src/lib/wiki/canonical-site-wiki.ts` — 3-tier wiki resolver
- `src/lib/projects/get-project-data.ts` — central data fetcher; wiki wins over static `projects.ts` for every merged field
- `src/lib/empathy-ledger-storytellers.ts` + `src/lib/empathy-ledger-transcripts.ts` — storyteller + transcript readers with consent gates
- `src/components/projects/TranscriptsSection.tsx`, `ProjectKeyPeopleSection.tsx` — new render surfaces
- `src/app/storytellers/page.tsx` + `src/app/storytellers/[id]/page.tsx` — storyteller-first pages
- `src/app/wiki/[slug]/edit/page.tsx` — server-action wiki editor
- `scripts/sync-el-{storytellers,transcripts}.mjs` + `scripts/seed-wiki-to-supabase.mjs`

**Blocked on external action (not your job this session unless user asks)**
- `EMPATHY_LEDGER_API_KEY` not in env → storyteller/transcript snapshots stay empty
- `empathy-ledger-v2` new transcripts endpoint not deployed yet → site-scoped feed returns 404
- Supabase `wiki_pages` table empty → Supabase tier is dormant until seed runs

**Open options the user can pick from (all defined in the ledger)**
1. Wiki search UI
2. Cluster-based sister projects block (easy — `wikiData.cluster` already extracted)
3. Match `keyPeople.name` → storyteller profiles (ties the two surfaces tighter)
4. Populate EL snapshots (requires user to provide API key + deploy EL)
5. Seed wiki_pages Supabase (one command)
6. Replace `WIKI_EDIT_TOKEN` with real session auth
7. More LCAA content authoring in wiki docs (user's content work, not code)

**Session pattern the user likes**
- Short replies. Ship fast. User says "next" a lot — that means pick the most obvious next item and ship it.
- Don't ask for permission before small, reversible edits.
- Do ask before: destructive ops (rm, git reset, force push), external API calls to non-localhost, creating new top-level abstractions.
- User values terminology: *wiki is source of truth*, *research loop is automatic*, *storyteller is the center of gravity*.
- No emojis in responses or code unless user asks.

**Start by doing**: read the ledger `thoughts/shared/handoffs/ultimate-project-pages/current.md`, then ask the user which option (1–7 above) they want to work on, or if they want to go in a new direction. Don't start coding until they pick.

**Uncommitted state**: this session's work is uncommitted. If the user says "commit" or "ship", make a single logical commit covering the wiki-source-of-truth refactor, or several smaller commits by logical groups. Otherwise leave the tree alone.
