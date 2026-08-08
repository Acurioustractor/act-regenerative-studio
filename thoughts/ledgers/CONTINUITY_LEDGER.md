# ACT Regenerative Studio - Continuity Ledger

> Last Updated: 2026-08-09
> Session: consent enforcement closed on the detail route, media URLs made host-neutral
> Full handoff: `thoughts/shared/handoffs/2026-08-09-consent-enforcement-and-media-urls.md`

## Active Context

### DO THIS FIRST — one migration is loaded and not run
`docs/integrations/empathy-ledger/host-relative-media-urls-2026-08-08.sql`

244 URLs across 40 articles, rewriting stored bodies to host-relative. Its
prerequisite is **met**: PR #501 is merged and deployed, confirmed on the wire
(production returns 5 absolute `/api/media` URLs, 0 host-relative).

**Code first, data second — not the reverse.** Migrating before the read path
absolutizes would emit host-relative URLs to every partner, which resolve
against the partner's own domain and 404. That is the JusticeHub
eight-broken-images bug recorded in `src/lib/media/serve-absolutize.test.ts`.

After: confirm consumers still receive absolute URLs, then `npm run check:media`
(baseline 0 dead across 21 story pages).

### Current Goals
- [ ] Run the migration above.
- [ ] **Elder review for eleven weighted articles across four communities.** Kristy
      Bloomfield's is recorded for Oonchiumpa. Jimmy Frank is in the system and one
      block away; Palm Island, Quandamooka and Kalkadoon have no approver identity.
      Run blocks from `docs/integrations/empathy-ledger/record-elder-review.sql`.
      **This needs people, not code — it is the real blocker.**
- [ ] **Article-level elder review queue in Empathy Ledger** — the fields exist, no
      UI writes them, so every approval arrives as hand-written SQL. This is what
      actually unblocks the item above. Another session was committing to that repo
      hourly on 2026-08-08; **coordinate before starting**.
- [ ] Conversation date for Kristy's approval — `elder_approved_at` currently holds
      the recording time, and the audit row says so.
- [ ] 6 rows in `stories` carry a hardcoded `empathyledger.com` host on
      `/api/v1/content-hub/stories/[id]`. Deliberately out of scope for #501.
- [ ] 2,164 project photographs: 118 captioned, 0 credited. Unpublishable until that
      changes. Not a design backlog.
- [ ] `primaryProject` and `themes` still empty across the corpus; `publishedAt` is
      still a migration artifact. No date is printed anywhere as a result.
- [ ] Cleanup (deletions, left for Ben): remote branch `fix/host-relative-media-urls`
      and worktree `~/Code/el-wt-hosturl`.

### CORRECTIONS carried forward
1. **Query `syndication_consent` before believing the wiki.** Empathy Ledger is the
   system of record. Already written into CLAUDE.md:65-67; no wiki record was found
   still contradicting it. Note the table lives in project `yvnuayzslukamizrlhwb`
   ("Empathy Ledger Enhanced"), **not** `tednluwflfhxyucgwigh` ("Empathy Ledger").
2. **Trace the logic; do not infer behaviour from an observed response.** This
   session I wrongly reported that the detail route enforced consent, because
   revoked articles returned 403. They returned 403 from a `visibility='private'`
   check; the route never queried consent at all. The two correlated perfectly
   across the whole table. Correlation that clean is still not causation.

### Recently Shipped (2026-08-08 evening)
Five landings, each verified on a live surface rather than at the merge:
ACT #75 (Field Notes 01 essay filed) · EL #496 (consent ledger governs the article
detail route — production had been serving 40,469 characters of body to a site with
no consent row) · EL #497 (a governed storage URL serves gated or not at all) ·
EL #501 (absolutize body media URLs on read, not at rest) · 34 JusticeHub featured
images registered and serving real bytes. Vercel Data Cache purged, which was the
cause of production serving content matching nothing in the database.
`check:media` 200 live / 0 dead across 21 story pages afterwards.

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
