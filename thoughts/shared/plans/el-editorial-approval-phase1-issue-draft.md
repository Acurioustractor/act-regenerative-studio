# Draft: GitHub Issue for empathy-ledger-v2

**Target:** `Acurioustractor/empathy-ledger-v2`
**Title:** Phase 1: approved_for_act_site flag on stories + media (schema + backfill)
**Status:** Drafted 2026-04-23 — awaiting user to post (guardrail blocked auto-create)

**Paste command (once you're ready):**

```bash
gh issue create --repo Acurioustractor/empathy-ledger-v2 \
  --title "Phase 1: approved_for_act_site flag on stories + media (schema + backfill)" \
  --body-file thoughts/shared/plans/el-editorial-approval-phase1-issue-draft.md
```

(If you do this, strip the heading + metadata lines above first, or replace `--body-file` with a `--body` heredoc of the body only.)

---

## Body

## Context

The ACT Regenerative Studio site (`act-regenerative-studio`) syncs stories and media from EL via the Content Hub endpoints using `organization_id` / `project_slug` filters. Today the sync pulls **everything** that matches — fine at current volume, but it won't hold as EL onboards more partners whose stories may be draft, sensitive, or scoped to a specific context.

We need an editorial approval gate so the ACT team can explicitly mark which EL content flows to the public ACT site.

Full design doc (3 layers, 5 phases) lives in the ACT repo at `thoughts/shared/plans/el-editorial-approval-workflow.md`.

**This issue covers Phase 1 only:** schema + backfill. Phases 2–5 will track separately (`/content-hub` API changes, ACT consumer sync flag, admin queue, UI cues).

## Phase 0 (already shipped in ACT repo)

- `/admin/pending-el-stories` route scaffolded with an honest "waiting on EL API" empty state (`src/app/admin/pending-el-stories/page.tsx`)

## Phase 1 scope (this issue)

### Schema migration

Add three columns to `stories` and `media`:

```sql
ALTER TABLE stories ADD COLUMN approved_for_act_site BOOLEAN DEFAULT FALSE;
ALTER TABLE stories ADD COLUMN approved_for_act_site_at TIMESTAMPTZ;
ALTER TABLE stories ADD COLUMN approved_for_act_site_by UUID REFERENCES profiles(id);

ALTER TABLE media ADD COLUMN approved_for_act_site BOOLEAN DEFAULT FALSE;
ALTER TABLE media ADD COLUMN approved_for_act_site_at TIMESTAMPTZ;
ALTER TABLE media ADD COLUMN approved_for_act_site_by UUID REFERENCES profiles(id);

CREATE INDEX stories_approved_for_act_site_idx
  ON stories (approved_for_act_site) WHERE approved_for_act_site = TRUE;
CREATE INDEX media_approved_for_act_site_idx
  ON media (approved_for_act_site) WHERE approved_for_act_site = TRUE;
```

Why three columns instead of a single bool:
- **Audit** — who approved, when
- **Sort signal** — newly approved items can surface first in the sync
- **Soft-revert** — flipping back to FALSE keeps the timestamps for debugging

### One-time backfill

All existing rows get marked approved so we don't regress the current sync when Phase 3 flips the `EL_APPROVAL_GATE` env on in the ACT repo:

```sql
UPDATE stories
  SET approved_for_act_site = TRUE,
      approved_for_act_site_at = NOW()
  WHERE created_at < NOW();

UPDATE media
  SET approved_for_act_site = TRUE,
      approved_for_act_site_at = NOW()
  WHERE created_at < NOW();
```

`approved_for_act_site_by` stays NULL on backfill (no specific reviewer).

### Out of scope for this issue

- The `approved_for=act-regenerative-studio` query parameter on `/api/v1/content-hub/*` → separate issue (Phase 2)
- The admin-only `/api/v1/content-hub/pending` endpoint → Phase 2
- Multi-tier approval (Elder / community-lead vs team) → possible v2 once the boolean is proven

## Acceptance

- Migration runs cleanly on dev + prod
- Backfill marks every existing `stories` and `media` row as approved
- Partial index in place so `WHERE approved_for_act_site = TRUE` stays fast
- No change to existing API behavior yet (Phase 2 will read the new columns)

## Cross-repo reference

- ACT design doc: `thoughts/shared/plans/el-editorial-approval-workflow.md`
- ACT scaffolded admin page: `src/app/admin/pending-el-stories/page.tsx`
