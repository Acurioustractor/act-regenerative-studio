# ACT Regenerative Studio - Continuity Ledger

> Last Updated: 2026-07-29
> Session: launch hardening, field graph, repo cleanup
> Full handoff: `thoughts/shared/handoffs/2026-07-29-launch-hardening-and-field-graph.md`

## Active Context

### Current Goals
- [ ] Editorial work against the Empathy Ledger API — the field graph is the spine,
      the content is what is thin. See the handoff's last section.
- [ ] Decide whether EL's taxonomy should be able to express "art AND justice", or
      whether `src/data/field-assignments.ts` stays the permanent home for that
      judgement. EL has no art project, so Art can only be populated locally.
- [ ] Seven articles still attach to no field; reasons recorded in
      `DELIBERATELY_UNASSIGNED`. Art has 3 pieces and opens the homepage.
- [ ] `primaryProject` and `themes` are empty on all 29 articles despite existing in
      the schema; `publishedAt` is a migration artifact (21 of 29 share one timestamp).

### Recently Shipped (2026-07-29)
Site is live and verified: 25 launch routes at 200, admin and prototypes gated behind
`ACT_INTERNAL_TOKEN` (404/401), 0 WCAG AA contrast violations, every link resolving,
field videos on Supabase, 53 tests green in CI against a real server.

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
