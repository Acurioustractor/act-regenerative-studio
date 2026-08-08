-- Record elder review against the articles syndicated to act-regenerative-studio.
--
-- Run against the Empathy Ledger project (yvnuayzslukamizrlhwb).
-- Written 2026-08-08. This writes to a consent ledger, so read the whole header.
--
--
-- WHY THIS FILE EXISTS AND WHY IT IS NOT ALREADY FILLED IN
--
-- syndication_consent has the columns for elder review and every one of the 40
-- rows for this site has them empty: requires_elder_approval false,
-- elder_approved false, elder_approved_by null, cultural_permission_level null.
-- Twelve live articles carry culturally weighted material. So a real approval
-- currently has nowhere to go, and this is the path.
--
-- It is deliberately not pre-filled. `elder_approved_by` is a uuid, not a note:
-- the schema itself insists that an approval is attached to an identified
-- person. Writing a row that says approved without saying truthfully by whom,
-- when, and in what setting would manufacture the audit trail the ledger exists
-- to hold. The governing rule from the Oonchiumpa decision is that verbal
-- consent in conversation IS first-class at ACT, and that the written record is
-- the witness writing it down promptly and accurately. That is what the
-- variables below are for.
--
--
-- ONE UPDATE PER COMMUNITY, NOT ONE FOR EVERYTHING
--
-- The twelve articles sit with at least five different authorities: Bwgcolman
-- (Palm Island), Quandamooka, Kalkadoon, Warumungu (Tennant Creek) and Arrernte
-- (Mparntwe). A single blanket UPDATE would record one person as having
-- approved another community's material, which is both false and the precise
-- failure OCAP exists to prevent. Each block below stands alone. Run only the
-- blocks you have an actual approval for; leave the rest untouched.
--
-- The Oonchiumpa precedent covers one case: where the person approving holds
-- Traditional Owner authority for the Country the stories are from, their
-- approval satisfies elder review for their org's material. Where they do not,
-- org approval is not a substitute and a separate elder review is needed.
--
--
-- KNOWN IDENTITIES (verified present in storytellers, 2026-08-08)
--
--   Kristy Bloomfield  b59a1f4c-94fd-4805-a2c5-cac0922133e0
--   Tanya Turner       dc85700d-f139-46fa-9074-6afee55ea801
--   Jimmy Frank        dda39576-ae9e-49e6-9bf9-70fcb45835ba
--
-- Anyone else giving approval needs their storyteller id looked up first. Do not
-- invent one and do not reuse a near-match.
--
--
-- BEFORE RUNNING
--   1. Fill the variables in each block you intend to run.
--   2. Run the DRY RUN and read which articles it names.
--   3. Run the block.
--   4. Run the VERIFY at the foot.


-- ---------------------------------------------------------------------------
-- DRY RUN. Read-only. Shows current elder-review state per live article.
-- ---------------------------------------------------------------------------
select a.slug,
       sc.status,
       sc.requires_elder_approval,
       sc.elder_approved,
       s.display_name as elder_approved_by,
       sc.elder_approved_at,
       sc.cultural_permission_level
from articles a
join syndication_consent sc
  on sc.article_id = a.id
 and sc.site_id = (select id from syndication_sites where slug = 'act-regenerative-studio')
left join storytellers s on s.id = sc.elder_approved_by
where a.syndication_enabled and a.status = 'published' and a.visibility = 'public'
order by a.slug;


-- ---------------------------------------------------------------------------
-- BLOCK A — Arrernte / Mparntwe (Oonchiumpa)
--
-- Precedent already recorded: Kristy Bloomfield is a Traditional Owner of
-- Mparntwe and Oonchiumpa operates on her Country, so her approval is elder
-- review in the OCAP sense for Oonchiumpa material.
-- ---------------------------------------------------------------------------
-- \set approver_id 'b59a1f4c-94fd-4805-a2c5-cac0922133e0'
-- \set approved_on '2026-__-__'
-- \set channel     'verbal in conversation, witnessed by Ben Knight'

/*
update syndication_consent sc
   set requires_elder_approval  = true,
       elder_approved           = true,
       elder_approved_by        = 'b59a1f4c-94fd-4805-a2c5-cac0922133e0'::uuid,
       elder_approved_at        = 'YYYY-MM-DD'::timestamptz,
       cultural_permission_level = 'community-approved',
       updated_at               = now()
  from articles a
 where sc.article_id = a.id
   and sc.site_id = (select id from syndication_sites where slug = 'act-regenerative-studio')
   and a.slug in ('oonchiumpa-what-happens-when-community-leads');
*/


-- ---------------------------------------------------------------------------
-- BLOCK B — Warumungu / Tennant Creek (Wilya Janta, NAIDOC with Jimmy)
-- Approver must hold authority for that Country. Jimmy Frank leads this work.
-- ---------------------------------------------------------------------------
/*
update syndication_consent sc
   set requires_elder_approval  = true,
       elder_approved           = true,
       elder_approved_by        = 'dda39576-ae9e-49e6-9bf9-70fcb45835ba'::uuid,
       elder_approved_at        = 'YYYY-MM-DD'::timestamptz,
       cultural_permission_level = 'community-approved',
       updated_at               = now()
  from articles a
 where sc.article_id = a.id
   and sc.site_id = (select id from syndication_sites where slug = 'act-regenerative-studio')
   and a.slug in (
     'wilya-janta-a-paradigm-shift-in-housing-for-remote-aboriginal-communities',
     'naidoc-with-jimmy'
   );
*/


-- ---------------------------------------------------------------------------
-- BLOCK C — Bwgcolman / Palm Island
-- No approver identity recorded yet. Look one up before filling this in.
--   at-the-speed-of-ceremony-learning-partnership-on-palm-island
-- ---------------------------------------------------------------------------


-- ---------------------------------------------------------------------------
-- BLOCK D — Quandamooka
--   between-waters-and-worlds-a-day-on-quandamooka-country
-- ---------------------------------------------------------------------------


-- ---------------------------------------------------------------------------
-- BLOCK E — Kalkadoon / Mount Isa
--   seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country
-- ---------------------------------------------------------------------------


-- ---------------------------------------------------------------------------
-- BLOCK F — not tied to one community
--
-- These six mention Elders or Country without sitting with one authority. They
-- may need no elder review at all, or may need one per piece. That is a
-- judgement to make with the people concerned, not a default to apply:
--   the-spirit-must-be-strong
--   historys-wounds-and-tomorrows-possibilities
--   the-kids-are-not-alright-...
--   justicehub-a-platform-for-community-led-justice-solutions
--   the-power-of-indigenous-storytelling-a-community-perspective
--   life-is-hard-but-its-not
-- ---------------------------------------------------------------------------


-- ---------------------------------------------------------------------------
-- AUDIT. Run once per block, with the same facts, so the ledger carries the
-- provenance and not only the flag.
-- ---------------------------------------------------------------------------
/*
insert into syndication_audit_log (site_id, action, details, created_at)
select (select id from syndication_sites where slug = 'act-regenerative-studio'),
       'elder_review_recorded',
       jsonb_build_object(
         'community',   'Arrernte / Mparntwe',
         'approver',    'Kristy Bloomfield',
         'approver_id', 'b59a1f4c-94fd-4805-a2c5-cac0922133e0',
         'given_on',    'YYYY-MM-DD',
         'channel',     'verbal in conversation',
         'witnessed_by','Ben Knight',
         'scope',       'in the approver''s own words, if remembered',
         'articles',    jsonb_build_array('oonchiumpa-what-happens-when-community-leads')
       ),
       now();
*/


-- ---------------------------------------------------------------------------
-- VERIFY
-- ---------------------------------------------------------------------------
select count(*) filter (where sc.elder_approved)            as elder_approved,
       count(*) filter (where sc.requires_elder_approval)   as flagged_as_requiring,
       count(*) filter (where sc.elder_approved_by is null
                          and sc.elder_approved)            as approved_but_unattributed  -- must be 0
from syndication_consent sc
where sc.site_id = (select id from syndication_sites where slug = 'act-regenerative-studio');
