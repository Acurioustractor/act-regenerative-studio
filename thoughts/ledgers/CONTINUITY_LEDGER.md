# ACT Regenerative Studio - Continuity Ledger

> Last Updated: 2026-08-08
> Session: photographs restored, first elder review recorded, tooling trimmed
> Full handoff: `thoughts/shared/handoffs/2026-08-08-photographs-consent-and-tooling.md`

## Active Context

### Current Goals
- [ ] **Elder review for eleven weighted articles across four communities.** Kristy
      Bloomfield's is recorded for Oonchiumpa. Jimmy Frank is in the system and one
      block away; Palm Island, Quandamooka and Kalkadoon have no approver identity.
      Run blocks from `docs/integrations/empathy-ledger/record-elder-review.sql`.
- [ ] **Two builds in Empathy Ledger for consent to be end to end**: an article-level
      elder review queue (the fields exist, no UI writes them), and consent
      enforcement on `/api/v1/content-hub/articles/[slug]` (the list route does it,
      the detail route does not, so a revoke does not stop it serving).
- [ ] Conversation date for Kristy's approval — `elder_approved_at` currently holds
      the recording time, and the audit row says so.
- [ ] 2,164 project photographs: 118 captioned, 0 credited. Unpublishable until that
      changes. Not a design backlog.
- [ ] `primaryProject` and `themes` still empty across the corpus; `publishedAt` is
      still a migration artifact. No date is printed anywhere as a result.

### CORRECTION carried forward
An earlier pass raised a consent RED claiming no approval covered public-web
publication. It was wrong — it read the wiki decision records rather than the
database. **Empathy Ledger is the system of record; query `syndication_consent`
first.** The wiki records contradict it and should be made to defer to it.

### Recently Shipped (2026-08-08)
107 dead photographs → 0 across all 21 live story pages, verified twice. First real
elder review recorded in Empathy Ledger with provenance. Two false public claims
removed from /stories. Hero text measurably AA-compliant. CLAUDE.md 20.5K → 9.4K with
three false facts corrected. Nine skills made findable, three synced. Ten PRs merged
across two repos; zero open here.

### Key Patterns Discovered
- This project uses **Supabase** with pgvector for storage
- Already has a `.claude/skills/` directory with project-specific skills
- Uses Next.js 15 + React 19 + TypeScript
- LCAA methodology (Listen, Curiosity, Action, Art) drives all work

### Architecture Notes
- **Living Wiki**: Knowledge extraction from Gmail, Notion, Calendar
- **Multi-Project Hub**: Empathy Ledger, JusticeHub, Harvest, BCV, Goods
- **GHL Integration**: CRM automation for all projects

## Memory System

### How to Recall
```bash
cd $CLAUDE_PROJECT_DIR/opc && PYTHONPATH=. uv run python scripts/core/recall_learnings.py --query "your search" --k 5
```

### How to Store
```bash
cd $CLAUDE_PROJECT_DIR/opc && PYTHONPATH=. uv run python scripts/core/store_learning.py \
  --session-id "session-id" \
  --type WORKING_SOLUTION \
  --content "what you learned" \
  --context "what it relates to" \
  --tags "tag1,tag2" \
  --confidence high
```

## Blocked Items
None. The editorial gaps above are decisions rather than blockers.

## Traps
- **Tests need a running server.** Port 3001 is often occupied by another session; a
  run against the wrong one produces failures that read as "the middleware is broken".
  Use `TEST_BASE_URL`. The suite has a preflight that says so.
- **`npm run build` runs eight sync scripts** that hit Empathy Ledger and Notion and
  rewrite generated JSON. Use `npx next build` to check compilation only.
- **Generated data files are rewritten on every build.** Never edit
  `src/data/*.generated.json` by hand; use the overlay pattern in
  `src/data/field-assignments.ts`.
- **The shell is zsh**, which does not word-split unquoted variables.

## Handoff Notes
Read `thoughts/shared/handoffs/2026-07-29-launch-hardening-and-field-graph.md` first.
It carries the reasoning, not just the outcome.
