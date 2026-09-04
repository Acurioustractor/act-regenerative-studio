-- Fill the editorial fields Empathy Ledger already has, on the articles this
-- site carries.
--
-- Run against the Empathy Ledger Enhanced project (yvnuayzslukamizrlhwb).
-- Proposed and APPLIED 2026-09-05 (Ben: "apply"). Backup table:
-- articles_editorial_backup_20260905, 30 rows, every article tagged act_el
-- whatever its status. Step 1 changed 18 rows (15 public, 3 private), step 2
-- changed 18. Verified on the live content-hub feed afterwards, not on the
-- row counts alone.
--
-- Nothing here publishes, unpublishes, or touches
-- consent. It sets four editorial columns on the 22 articles tagged for this
-- site (act_el in syndication_destinations): published_at, primary_project,
-- related_projects, and the themes and tags facets.
--
--
-- WHY
--
-- Twenty of the 22 came in from the old Webflow blog on 2026-01-10 and were
-- given the import day as their publish date. The site therefore shows no
-- date on any of them and cannot order the stories index by when a piece was
-- written. The real dates survived the import: import_metadata carries
-- original_publish_date for every one, from 2023-03-22 to 2025-11-09.
-- Eighteen were live on Webflow (was_published = true). Two, History's wounds
-- and Wilya Janta, were unpublished drafts there and first met a reader here
-- on 2026-03-25, so that date stands for those two and step 1 leaves them.
--
-- Project attribution lives in the wrong place. Empathy Ledger holds
-- related_projects = {act-main} on almost every article, a placeholder the
-- site's sync ignores by name, while the real attribution sits in this
-- repository at src/data/project-editorial-recipes.json and
-- src/data/field-assignments.ts. The wiki's Living Website Operating System
-- says that recipe layer is transitional and belongs in Empathy Ledger. Step
-- 2 is the move: the same attributions, written where they belong, in
-- Empathy Ledger's own project slugs. The site's sync unions both sources,
-- so nothing changes on the site until the recipes are thinned afterwards.
--
-- Themes and tags are empty on 18 of the 22. The one article written in
-- Empathy Ledger directly, What the Road Corrects, sets the convention:
-- themes are short lowercase phrases, tags are kebab-case and name the
-- projects. The values in step 2 follow it and are a PROPOSAL drawn from
-- titles, excerpts and the recipes. Edit them before running. The site will
-- treat them as browse facets, not as truth about anyone.
--
--
-- WHAT THIS DOES NOT TOUCH
--
-- - What the Road Corrects: complete already, excluded by every WHERE.
-- - The three private articles (consent revoked 2026-07-29: Vireak, Nhat,
--   A Story of Resilience and Advocacy): step 1 corrects their dates, step 2
--   leaves them alone. They stay private. Nothing here can change that.
-- - The four the site withholds by editorial decision (edition-1,
--   from-bolivia-to-brisbane, powering-change, spain-diagrama-trip-reflection,
--   see config/withdrawn-editorial.json): attributed like the rest, because
--   the attribution is true whether or not this site shows them.
-- - visibility, status, syndication_destinations, consent rows, content.
--
--
-- BEFORE RUNNING
--
-- 1. Take the backup. This is the whole undo:
--
--    create table articles_editorial_backup_20260905 as
--    select id, slug, published_at, primary_project, related_projects, themes, tags
--    from articles where 'act_el' = any(syndication_destinations);
--
-- 2. Run the DRY RUN at the foot of this file and read it.
-- 3. Run the transaction below.
-- 4. Re-sync this site (npm run sync:el-editorial), confirm /stories orders by
--    date, then thin src/data/project-editorial-recipes.json so it carries
--    section copy only.

begin;

-- 1. Dates. Only where the import day is still standing in for the real one.
update articles a
set published_at = (a.import_metadata->>'original_publish_date')::timestamptz
where 'act_el' = any(a.syndication_destinations)
  and a.source_platform = 'webflow'
  and a.import_metadata->>'was_published' = 'true'
  and a.import_metadata->>'original_publish_date' is not null
  and a.published_at::date = date '2026-01-09';

-- 2. Attribution and facets. One statement per article so any line can be
--    edited or struck. Facets are only written where they are empty.
create temp table proposed (slug text primary key, primary_project text, related text[], themes text[], tags text[]) on commit drop;
insert into proposed values
  ('wilya-janta-a-paradigm-shift-in-housing-for-remote-aboriginal-communities', 'goods-on-country', '{goods-on-country}', '{making,community authority,housing}', '{goods,housing,wilya-janta}'),
  ('historys-wounds-and-tomorrows-possibilities', 'goods-on-country', '{goods-on-country}', '{community authority,place,making}', '{goods,oonchiumpa}'),
  ('oonchiumpa-what-happens-when-community-leads', 'empathy-ledger', '{empathy-ledger,justicehub}', '{community authority,storytelling,justice alternatives}', '{empathy-ledger,justicehub,oonchiumpa}'),
  ('spain-diagrama-trip-reflection', 'justicehub', '{justicehub}', '{justice alternatives,listening}', '{justicehub,diagrama,trip-notes}'),
  ('naidoc-with-jimmy', 'goods-on-country', '{goods-on-country}', '{making,community authority,listening}', '{goods,tennant-creek,naidoc}'),
  ('the-weight-of-silence-and-the-audacity-to-imagine-reflections-on-fear-hope-and-the-long-game-of-human-liberation', 'act-main', '{}', '{fear and hope,listening}', '{essay,series}'),
  ('life-is-hard-but-its-not', 'act-main', '{}', '{listening}', '{essay,personal}'),
  ('at-the-speed-of-ceremony-learning-partnership-on-palm-island', 'goods-on-country', '{goods-on-country}', '{making,ceremony,community authority}', '{goods,palm-island}'),
  ('the-raucous-revolution', 'act-main', '{}', '{curiosity,raucousness}', '{studio,origin,values}'),
  ('contained-where-policy-meets-flesh', 'justicehub', '{justicehub}', '{justice alternatives,art as encounter}', '{justicehub,contained,art}'),
  ('powering-change-a-curious-tractors-journey', 'act-main', '{the-harvest,black-cockatoo-valley}', '{beautiful obsolescence,regeneration}', '{studio,origin,power-take-off}'),
  ('beyond-bars-joe-kwons-journey-to-reshape-society', 'justicehub', '{justicehub}', '{justice alternatives,lived experience}', '{justicehub,profile}'),
  ('from-bolivia-to-brisbane', 'justicehub', '{justicehub}', '{justice alternatives,art as encounter}', '{justicehub,contained,origin}'),
  ('its-overwhelming-isnt-it', 'act-main', '{}', '{fear and hope}', '{essay,personal}'),
  ('conversation-camp', 'black-cockatoo-valley', '{black-cockatoo-valley}', '{listening,place,hospitality}', '{conversation-camp,place}'),
  ('justicehub-a-platform-for-community-led-justice-solutions', 'justicehub', '{justicehub}', '{justice alternatives,community authority}', '{justicehub,platform}'),
  ('edition-1-sowing-seeds-of-connection-2', 'the-harvest', '{the-harvest,black-cockatoo-valley}', '{place,hospitality,regeneration}', '{newsletter-archive,harvest,farm}'),
  ('the-tapestry-of-dignity-witnessing-the-birth-of-the-global-laundry-alliance', 'goods-on-country', '{goods-on-country}', '{making,dignity,collaboration}', '{goods,global-laundry-alliance,orange-sky}');

update articles a
set primary_project = p.primary_project,
    related_projects = p.related,
    themes = case when coalesce(array_length(a.themes, 1), 0) = 0 then p.themes else a.themes end,
    tags   = case when coalesce(array_length(a.tags, 1), 0) = 0 then p.tags else a.tags end
from proposed p
where a.slug = p.slug
  and 'act_el' = any(a.syndication_destinations)
  and a.visibility = 'public'
  and a.slug <> 'what-the-road-corrects';

-- Applied 2026-09-05: 18 rows from step 1 (15 public + 3 private), 18 from step 2.
commit;


-- DRY RUN. Run this alone, before the transaction, and read every row.
-- select a.slug,
--        a.published_at::date as date_now,
--        (a.import_metadata->>'original_publish_date')::date as date_proposed,
--        a.related_projects as related_now, p.related as related_proposed,
--        a.themes as themes_now, p.themes as themes_proposed,
--        a.visibility
-- from articles a left join proposed p on p.slug = a.slug
-- where 'act_el' = any(a.syndication_destinations) and a.status = 'published'
-- order by coalesce((a.import_metadata->>'original_publish_date')::timestamptz, a.published_at) desc;
