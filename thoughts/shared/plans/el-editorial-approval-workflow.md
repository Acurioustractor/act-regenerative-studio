# EL → ACT Site Editorial Approval Workflow

**Status:** Proposal · 2026-04-22
**Owner:** Ben + Claude (carries between EL repo and ACT repo)
**Goal:** New stories captured in Empathy Ledger only flow to the ACT site after the team explicitly marks them as "approved for ACT platform." Today the ACT sync pulls everything matching the project/org, which is fine while volume is small but won't hold as EL grows.

## Why this matters

EL is the source of truth for stories, photos, video, and storyteller context across the ACT ecosystem. As EL onboards more partners, not every story belongs on the public ACT marketing site — some are draft, some are sensitive, some are scoped to a specific funder or research context.

Right now the sync (`scripts/sync-el-*.mjs`) calls EL's `/api/v1/content-hub/*` endpoints with `organization_id` and `project_slug` filters and accepts everything that comes back. We need a curation layer the team can drive without code changes.

## Three-layer plan

### Layer 1 — EL data model (in `empathy-ledger-v2` repo)

Add an approval column to each surfaced entity:

```sql
-- Stories
ALTER TABLE stories ADD COLUMN approved_for_act_site BOOLEAN DEFAULT FALSE;
ALTER TABLE stories ADD COLUMN approved_for_act_site_at TIMESTAMPTZ;
ALTER TABLE stories ADD COLUMN approved_for_act_site_by UUID REFERENCES profiles(id);

-- Same triple on media, transcripts, and any other entity the ACT site syndicates.
CREATE INDEX stories_approved_for_act_site_idx
  ON stories (approved_for_act_site)
  WHERE approved_for_act_site = TRUE;
```

Why three columns and not just a flag:
- **Audit trail** — who marked it, when, so we can roll back a bad approval.
- **Sort signal** — newly approved items can surface first in the public sync.
- **Soft-revert** — flipping the bool back to FALSE keeps the timestamps for debugging.

A separate `act_site_approvals` table is overkill for a single boolean; if other consumer sites (e.g. `justicehub.org.au`) ever want their own approval state we can generalise to `(entity_id, entity_type, site_slug, approved_at, approved_by)` then.

### Layer 2 — Content Hub API contract

The endpoints already accept `organization_id` and `project_slug`. Add an opt-in filter:

```
GET /api/v1/content-hub/stories?organization_id=...&approved_for=act-regenerative-studio
GET /api/v1/content-hub/media?organization_id=...&approved_for=act-regenerative-studio
```

When `approved_for` is present, the endpoint must filter `WHERE approved_for_act_site = TRUE`. The site_slug binding lets us extend later without breaking ACT's call shape.

A second, admin-only endpoint exposes the queue of unapproved items for the ACT admin page:

```
GET /api/v1/content-hub/pending?site=act-regenerative-studio&organization_id=...
  → returns stories + media that match an ACT-mapped project/org and have approved_for_act_site = FALSE
```

This endpoint must require an EL admin or "act-editor" role token.

### Layer 3 — ACT consumer changes (this repo)

1. **Sync scripts honour the flag**
   `scripts/sync-el-media.mjs`, `scripts/sync-el-editorial.mjs`, `scripts/sync-el-storytellers.mjs` all add `approved_for=act-regenerative-studio` to their fetch URLs (behind a feature flag env so we can roll out without breaking the existing snapshot).

   ```js
   const APPROVAL_GATE = process.env.EL_APPROVAL_GATE === 'true';
   const approvedParam = APPROVAL_GATE
     ? `&approved_for=${EMPATHY_LEDGER_SITE_SLUG}`
     : '';
   ```

   Initial rollout: gate OFF. Backfill all existing stories as `approved = TRUE` in EL (one-time SQL). Then flip gate ON for new content moving forward.

2. **Admin queue page** (`/admin/pending-el-stories`) shows the unapproved items. For each row:
   - Story / media title + excerpt
   - Linked org / project
   - Submitted-at timestamp
   - "Open in EL" deep link
   - "Approve for ACT site" button (POSTs to a new ACT API route that proxies to EL with admin creds)

3. **Visual cue on the EL Connections panel** when an admin opens a project page: items pulled from the approved pool show a small green check; the panel also exposes a "Review pending for this project" link that deep-links to `/admin/pending-el-stories?project=<slug>`.

## Phasing

| Phase | Work | Repo | Blocking? |
|------|------|------|-----------|
| 0 | Scaffold ACT admin page with empty state and route | `act-regenerative-studio` | No |
| 1 | Schema migration + backfill all existing rows as approved | `empathy-ledger-v2` | Yes for phase 2 |
| 2 | Content Hub `approved_for` filter + `/pending` endpoint | `empathy-ledger-v2` | Yes for phase 3 |
| 3 | ACT sync flag + admin queue wired to live API | `act-regenerative-studio` | — |
| 4 | UI cues in EL Connections panel + per-project deep links | `act-regenerative-studio` | — |

## Open questions

- Should "approved" cascade to media that's attached to an approved story? Probably yes — flagging a story should auto-flag the assets it ships with, but media that was uploaded outside the story stays unapproved.
- Do we want an "approved by Elder / community lead" tier above team approval for stories from First Nations partners? Plausibly yes for some orgs (MMEIC, Mounty Yarns) — but adding tiers can come in a v2; the boolean is the foundation.
- Sync cadence: when a story is approved, do we wait for the next scheduled sync or trigger an immediate refetch? Webhook from EL → ACT `/api/sync/el-bump` would close the loop but adds complexity. Phase 3 uses scheduled sync; webhook is phase 5.

## Proof-of-concept order

1. (this commit) Scaffold the admin page with a clear "waiting on EL API" empty state so the route exists and the link can ship.
2. Open issue in `empathy-ledger-v2` for the schema migration; reference this doc.
3. Once the API is live, swap the empty state for a real fetch; remove the `EL_APPROVAL_GATE` env once it's been on for a full week without regressions.
