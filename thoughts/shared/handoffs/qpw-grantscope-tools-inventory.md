# GrantScope / CivicGraph — Grant-Finding Capabilities Inventory

**For:** Queensland Philanthropy Week (Mon 1 – Fri 5 June 2026) — what grant-FINDING tooling can be put in front of grantseekers/communities.
**Repo:** `/Users/benknight/Code/grantscope`
**Method:** Read-only code inspection. No scripts run. No LLM/API/data calls made.
**Date:** 2026-05-29

---

## TL;DR

The repo is one Next.js app (`apps/web`, the "CivicGraph"/"@grantscope/web" site) deployed to Vercel, plus a set of Node CLI scripts for back-of-house discovery, plus a published npm MCP server, plus a standalone HTML simulator.

The **demo-ready grant-finding surfaces for a public week are all in the deployed web app and the standalone HTML file** — they are read-only (or read-mostly) and don't require a grantseeker to incur API cost. The `discover` / `grant:*` / `funding-autoresearch` CLI scripts are **back-of-house pipeline jobs that scrape sites and call LLMs** — not grantseeker-facing, and cost money to run live.

---

## Capabilities table

| # | Capability | Type | How invoked | Reads | Cost to run live | Demo-able in public week |
|---|-----------|------|-------------|-------|------------------|--------------------------|
| 1 | **`/grants` grant finder** (search + filters + AI/semantic) | Deployed web page | URL `/grants?q=...` | Supabase `grant_opportunities` (public list) | Read-only DB; semantic add-on uses OpenAI only for long queries | **HIGH** — open, no login |
| 2 | **`/foundations` directory + drilldowns** | Deployed web page | URL `/foundations`, `/foundations/[id]`, named profiles | Supabase foundation tables | Read-only DB | **HIGH** — open, no login |
| 3 | **`grant-flow-simulator.html`** (Monte-Carlo grant portfolio sim) | Standalone HTML | Double-click / open in browser | Nothing (all client-side JS) | Zero — no network | **HIGH** — works offline, no backend |
| 4 | **`/discover`** (featured investigative reports + "ask for one") | Deployed web page | URL `/discover` | Static + report routes | Read-only | MED — it's reports, not a live finder |
| 5 | **`/start` intake** ("turn idea into an org" guide) | Deployed web page | URL `/start` → POST `/api/start` | Supabase (creates a session) | Writes a session row; no LLM at entry | MED — writes data, onboarding tone |
| 6 | **CivicGraph MCP server** (`civicgraph-mcp`) | npm/CLI MCP, wraps hosted API | `npx civicgraph-mcp` in an MCP client | Hosted `civicgraph.app/api/agent` | Hits hosted API (may meter/LLM `_ask`) | MED — needs MCP client; great for a technical audience |
| 7 | **`GET /api/grants/match`** (AI-scored matches for an org) | Deployed API (auth-gated) | Authed fetch; needs org profile | Supabase `org_profiles` + `grant_opportunities` (vector + heuristics) | Read-only DB; embeddings precomputed | LOW for public — requires login + org profile |
| 8 | **`scripts/grantscope-discovery.mjs`** (`discover`) | CLI pipeline | `pnpm discover` | `source_frontier` → scrapes sources → upserts grants | **Writes grants; runs source plugins.** `--dry-run`/`--resolve-sources-only` are read-only | LOW — back-of-house |
| 9 | **`scripts/discover-foundation-programs.mjs`** (`grant:programs:discover[:grounded]`, `grant:long-tail:discover`) | CLI pipeline | `pnpm grant:programs:discover` etc. | Foundation rows → scrapes websites → LLM extract → upserts | **COST: scrapes + calls Minimax/Gemini/Groq/Anthropic Haiku; writes DB** | LOW — back-of-house, costs money |
| 10 | **`scripts/snapshot-grant-frontier.mjs`** (`grant:frontier:snapshot`) | CLI job | `pnpm grant:frontier:snapshot` | `source_frontier` + `grant_opportunities` (aggregate SQL) | **Inserts** into `grant_frontier_source_snapshots`; **no LLM/external API** | LOW — ops telemetry, not user-facing |
| 11 | **`funding-benchmark:build`** | CLI job | `pnpm funding-benchmark:build` | Live Supabase (grants/foundations/charities) | Reads DB; writes local `data/funding-benchmark.json`; **no LLM** | LOW — internal eval input |
| 12 | **`funding-autoresearch`** | CLI agent loop | `pnpm funding-autoresearch` | Local benchmark + evaluator | **COST: calls Claude Sonnet 4.5 (OpenAI fallback)** to mutate ranking logic. Has `--dry-run` | LOW — internal R&D |

---

## Per-tool detail

### 1. `/grants` — the public grant finder  ⭐ most demo-able
- **What:** A server-rendered grant search/browse page. Accepts `?q=` query, plus filters for state (`AU-QLD`, `AU-NSW`, …, defined in-page), source, and program type via a `FilterBar` component. Ranks results by keyword hits (`rankGrantForFinder`/`termHitCount`) and dedupes/sorts via `grant-list-utils.ts`. For longer/question-style queries (>5 words or containing "?") OR explicit `searchMode=ai`, it upgrades to **semantic search** (`searchGrantsSemantic` from `@grant-engine/embeddings`, OpenAI embeddings, threshold 0.65).
- **Invoke:** Open `/grants` (and `/grants?q=youth%20justice%20queensland`). Public — **not** behind auth (middleware only protects `/home`, `/tracker`, `/foundations/tracker`, `/ops`, `/profile`, `/org`).
- **Reads:** Supabase `grant_opportunities` (public grants list table) directly via service client; future/no-deadline grants.
- **Cost:** Keyword/DB path is **read-only, zero LLM**. Semantic path calls OpenAI **only** when the query is long/question-like and `OPENAI_API_KEY` is set; otherwise it falls back to DB keyword search. So a grantseeker browsing/keyword-searching incurs no cost.
- **Demo:** Strongest live demo — "type your cause + your state, see live Australian grants." Works without login and without an API key (keyword mode).
- **Files:** `apps/web/src/app/grants/page.tsx`, `apps/web/src/app/grants/grant-list-utils.ts`, `apps/web/src/app/components/filter-bar.tsx`, `apps/web/src/app/api/search/semantic/route.ts` (auth-gated variant).

### 2. `/foundations` — funder directory + drilldowns
- **What:** Browse foundations, with dedicated profile pages (`/foundations/[id]`) and hand-built named profiles (Minderoo, Ian Potter, Rio Tinto, Ecstra, PRF), plus `/foundations/compare` and `/foundations/review-set`. Lets a grantseeker research *who funds what*. (`/foundations/tracker` is the one auth-gated sub-route.)
- **Invoke:** Open `/foundations`. Public.
- **Reads:** Supabase foundation tables (via `FoundationService`).
- **Cost:** Read-only.
- **Demo:** "Here's the funder landscape — click a foundation to see its giving." Good companion to `/grants`.
- **Files:** `apps/web/src/app/foundations/` (page.tsx, `[id]/`, `compare/`, named dirs).

### 3. `grant-flow-simulator.html` — Monte-Carlo grant portfolio simulator  ⭐ most demo-able
- **What:** A **fully self-contained** single-file HTML app (one inline `<script>`, **no external script/style refs, no fetch/API calls**). Inputs: applications per year, average grant-size target, org alignment score, portfolio diversity, and funder-type mix (Small/Medium/Large Foundation, Local/State/Federal ARC-NHMRC, Arts Council, Corporate Foundation). Outputs: total tracked funding by source, historical success rates by funding source, and a percentile breakdown (10th/median/90th) from a simulation. It models *grant-seeking strategy outcomes*, not a live grant list.
- **Invoke:** Double-click the file / open in any browser. No server, no internet.
- **Reads:** Nothing external — all data + math are embedded JS.
- **Cost:** Zero.
- **Demo:** Excellent walk-up / kiosk demo for a public week — works offline, no backend, no login, instant. Pair with `grant-flow-simulator-about.html` (a static explainer: "The Problem / What the Simulator Shows / How It Works / Where the Data Comes From / Why This Matters / A Note on the Simulation").
- **Files:** `/grant-flow-simulator.html`, `/grant-flow-simulator-about.html` (both repo root, both self-contained).

### 4. `/discover`
- **What:** A curated landing page of featured investigative reports (QLD Youth Justice, FECCA & ECCV) plus topic hints ("foundation giving to [your sector]", "ACCO vs mainstream NGO dollar share", etc.) inviting a user to request a report. It is a **reports showcase**, not a live grant-search box.
- **Invoke:** Open `/discover`. Public.
- **Cost:** Read-only.
- **Demo:** Good for "here's the depth of analysis we can produce," less good as a hands-on grant-finding tool.
- **Files:** `apps/web/src/app/discover/page.tsx`, `apps/web/src/app/api/discover/route.ts` (the API route is auth-gated and triggers GrantEngine discovery — *not* the public page's mechanism).

### 5. `/start` — innovation/org intake guide
- **What:** "Turn your idea into a real organisation" wizard. POSTs to `/api/start` to create a session, then routes to `/start/[intakeId]`.
- **Invoke:** Open `/start`. Public.
- **Cost:** Creates a session row (write). Entry step shows no LLM; deeper steps not traced.
- **Demo:** Onboarding/aspirational, tangential to grant-*finding*.
- **Files:** `apps/web/src/app/start/page.tsx`, `apps/web/src/app/start/[intakeId]/`, `apps/web/src/app/start/_components/`.

### 6. CivicGraph MCP server
- **What:** Published npm MCP (`npx civicgraph-mcp`) exposing CivicGraph as agent tools by wrapping the hosted `civicgraph.app/api/agent` endpoint. Grant-relevant tools: `civicgraph_search` (560K+ entities), `civicgraph_funding_deserts` (most underserved LGAs by SEIFA + funding shortfall), `civicgraph_ask` (plain-English question → generated SQL across contracts/grants/donations/charities/tax → AI explanation), plus `civicgraph_entity`, `civicgraph_power_index`, `civicgraph_revolving_door`.
- **Invoke:** `claude mcp add civicgraph -- npx civicgraph-mcp`, then call tools from an MCP client. Optional `CIVICGRAPH_API_KEY`.
- **Reads:** Hosted CivicGraph API (not the local DB).
- **Cost:** Calls a hosted endpoint; `civicgraph_ask` is LLM-backed (SQL gen + explanation) and may be metered.
- **Demo:** Great for a technical/agent audience; needs an MCP client set up, so not a walk-up public demo.
- **Files:** `mcp-server/index.mjs`, `mcp-server/README.md`.

### 7. `GET /api/grants/match` — AI-scored matches for an org
- **What:** Returns grant matches scored by vector similarity between the org's embedding and grant embeddings, combined with heuristics (geography, categories, amount fit). The "personalised" finder.
- **Invoke:** Authenticated fetch; requires the user to have an `org_profiles` row. Gated by `requireModule('grants')`.
- **Reads:** Supabase `org_profiles` + `grant_opportunities` (embeddings precomputed in DB).
- **Cost:** Read-only at request time (no live embedding call seen for the org if profile embedding exists).
- **Demo:** Powerful but **requires login + a completed org profile** — not a cold public demo. Could be pre-seeded with a demo org for a scripted walkthrough.
- **Files:** `apps/web/src/app/api/grants/match/route.ts`.

### 8. `discover` → `scripts/grantscope-discovery.mjs`
- **What:** Full multi-source grant discovery. Resolves an active source set from `source_frontier`, runs grant discovery plugins (via `GrantEngine`), and **upserts new grants** to Supabase.
- **Invoke:** `pnpm discover` (CLI). Flags: `--dry-run`, `--sources=...`, `--resolve-sources-only`, `--full-sweep`.
- **Reads/writes:** Reads `source_frontier`; writes `grant_opportunities`. `--dry-run` and `--resolve-sources-only` are read-only modes.
- **Cost:** Runs source plugins (network scraping). Treat as cost/side-effecting unless `--dry-run`/`--resolve-sources-only`.
- **Demo:** Back-of-house. Not a grantseeker tool. (A `--dry-run` could be shown to a technical audience as "how grants get found," but I did not run it.)

### 9. `grant:programs:discover` / `:grounded` / `grant:long-tail:discover` → `scripts/discover-foundation-programs.mjs`
- **What:** Targets foundations that have a website + description but few/no programs, scrapes their site for grants/fellowships/scholarships, and **LLM-extracts structured program data**, then upserts. The three package scripts differ only in flags (limit, grounded-search, long-tail frontier paging/metadata flag + agent id).
- **Invoke:** `pnpm grant:programs:discover` etc. (CLI). `--dry-run` and `--foundation-id`/`--foundation-name` for targeted runs.
- **Reads/writes:** Reads foundation rows; scrapes external websites; writes programs to Supabase.
- **Cost:** **Highest — incurs API cost.** Calls multiple LLM providers (Minimax default, plus Anthropic `claude-3-5-haiku`, Gemini, Groq fallbacks) and uses `FoundationScraper`. **Did not run.**
- **Demo:** Back-of-house pipeline; not safe to run live for cost reasons.

### 10. `grant:frontier:snapshot` → `scripts/snapshot-grant-frontier.mjs`
- **What:** Aggregates `source_frontier` + `grant_opportunities` (due-now, failing, recently-changed, never-succeeded, future-deadline counts), scores each source group, and **inserts** a row set into `grant_frontier_source_snapshots`. Pipeline-health telemetry.
- **Invoke:** `pnpm grant:frontier:snapshot` (CLI).
- **Reads/writes:** Reads two tables; **inserts** snapshot rows. **No LLM, no external API.**
- **Cost:** DB-only; writes data (so not strictly read-only, but no API spend).
- **Demo:** Ops dashboard fodder ("how fresh is our grant coverage"), not a grantseeker tool.

### 11. `funding-benchmark:build` → `scripts/funding-autoresearch/build-benchmark-set.mjs`
- **What:** Builds 50 real scenarios from live GrantScope data (grants, foundations, charities, social enterprises, place need-gaps) using archetypes + signal helpers; writes `scripts/funding-autoresearch/data/funding-benchmark.json`.
- **Invoke:** `pnpm funding-benchmark:build` (CLI).
- **Reads/writes:** Reads live Supabase; writes a **local JSON file**. **No LLM.**
- **Cost:** DB-read + local write; no API spend.
- **Demo:** Internal eval input, not user-facing.

### 12. `funding-autoresearch` → `scripts/funding-autoresearch/autoresearch.mjs`
- **What:** An agentic improvement loop that runs the fixed `evaluate.mjs` against the benchmark and uses an LLM to mutate the mutable `strategy.mjs` ranking logic. The harness covers grant discovery, foundation discovery, charity/social-enterprise delivery matching, and need-gap place search (per its README).
- **Invoke:** `pnpm funding-autoresearch` (CLI). `--budget=`, `--iterations=`, `--dry-run`.
- **Reads/writes:** Reads local benchmark + log; rewrites `strategy.mjs`.
- **Cost:** **Incurs API cost** — calls Claude `claude-sonnet-4-5` (OpenAI fallback). `--dry-run` available. **Did not run.**
- **Demo:** Internal R&D; not a public tool.

---

## "Most demo-able during the week" ranking

1. **`grant-flow-simulator.html`** — zero-backend, zero-cost, offline, instant. Perfect kiosk/walk-up. Pair with the about page. **Ready now.**
2. **`/grants` public grant finder** — open URL, search by cause + state, live grants from the DB. No login, keyword mode needs no API key. **Deployed; verify prod data freshness.**
3. **`/foundations` funder directory** — open URL, browse/【click into funders. No login. **Deployed.** Natural pairing with `/grants` to tell the full "find the grant → research the funder" story.

Honorable mentions for a *technical/agent* audience (not walk-up public): the **CivicGraph MCP server** (`civicgraph_search` / `funding_deserts` / `ask`) for a "ask Australian funding data in plain English" demo, and a **pre-seeded `/api/grants/match`** walkthrough if you set up a demo org + login in advance.

**Avoid running live during the week:** `discover`, `grant:programs:discover[:grounded]`, `grant:long-tail:discover`, `funding-autoresearch` — they scrape sites and/or call LLMs (cost + side effects). `grant:frontier:snapshot` and `funding-benchmark:build` are DB-only but write data and aren't user-facing.

## Deployment note
`vercel.json` deploys **`apps/web`** (Next.js) to Vercel; that's the only deployed app (the other workspace app, `apps/video`, isn't in the Vercel build). All capabilities #1–#7 live in `apps/web`; #1–#5 are public routes per `middleware.ts`. The CLI scripts (#8–#12), the MCP server (#6), and the HTML simulator (#3) are **not** part of the Vercel deploy — the simulator is just a file you open; the scripts/MCP run locally.

## Caveats / not verified
- I did not run any script, so write/cost claims for #8–#12 are inferred from code (imports, `fetch` targets, `.insert/.upsert`), not from execution.
- I did not confirm prod data volume/freshness in `grant_opportunities` — the `/grants` demo quality depends on that table being populated in production.
- `/start` deeper steps (beyond session creation) were not traced for LLM use.
