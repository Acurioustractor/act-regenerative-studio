-- Make stored article bodies host-relative, so a domain move does not mean
-- rewriting stored content.
--
-- Run against the Empathy Ledger project: yvnuayzslukamizrlhwb
--
--
-- RUN THIS ONLY AFTER THE CODE IS DEPLOYED TO PRODUCTION
--
-- The order is the opposite of the featured-image backfill, and it is not
-- optional. The read path has to absolutize before the data becomes relative:
--
--   code first, then data -> consumers keep receiving absolute URLs throughout
--   data first, then code -> every consumer receives `/api/media/...`, resolves
--                            it against its OWN domain, and 404s. That is
--                            exactly the JusticeHub eight-broken-images bug
--                            recorded in serve-absolutize.test.ts.
--
-- The code change is a no-op against today's data (absolute URLs pass through
-- untouched), so there is no rush between the two steps. Verify the deploy is
-- live, then run this.
--
--
-- WHAT IT CHANGES
--
-- 244 URLs across 40 published articles, written by the 2026-08-07 migration as
-- `https://empathyledger.com/api/media/<id>/file`. After this they are stored
-- `/api/media/<id>/file` and absolutized per-environment on read by
-- absolutizeServeUrlsInHtml(), which is the convention absolutizeServeUrl()
-- already documents for the catalog's avatar and display URLs.
--
-- Only attribute-initial occurrences are rewritten, matching the code exactly,
-- so prose that happens to mention the URL is left alone.
--
-- Reversible: articles_content_backup_20260807 still exists, and the reverse
-- rewrite is the same statement with the two arguments swapped.


-- 1. Count first. Expect 40 articles / 244 occurrences before, 0 after.
select
  count(*) filter (where content like '%"https://empathyledger.com/api/media/%')  as articles_absolute,
  coalesce(sum((select count(*) from regexp_matches(content,'"https://empathyledger\.com/api/media/','g'))), 0) as occurrences_absolute,
  count(*) filter (where content like '%"/api/media/%')                            as articles_relative
from articles
where status='published';


-- 2. Rewrite. Double-quoted and single-quoted attribute values both.
update articles
set content = replace(
      replace(content, '"https://empathyledger.com/api/media/', '"/api/media/'),
      '''https://empathyledger.com/api/media/', '''/api/media/'
    ),
    updated_at = now()
where status='published'
  and (content like '%"https://empathyledger.com/api/media/%'
    or content like '%''https://empathyledger.com/api/media/%');


-- 3. Verify: expect articles_absolute = 0, occurrences_absolute = 0,
--    articles_relative = 40.
select
  count(*) filter (where content like '%"https://empathyledger.com/api/media/%')  as articles_absolute,
  coalesce(sum((select count(*) from regexp_matches(content,'"https://empathyledger\.com/api/media/','g'))), 0) as occurrences_absolute,
  count(*) filter (where content like '%"/api/media/%')                            as articles_relative
from articles
where status='published';


-- 4. Then confirm on the wire, not in the table. A consumer must still receive
--    an ABSOLUTE url:
--
--    curl -s -H "X-API-Key: $EMPATHY_LEDGER_API_KEY" \
--      "https://empathyledger.com/api/v1/content-hub/articles/the-spirit-must-be-strong" \
--      | grep -o 'src="[^"]*/api/media/[^"]*"' | head -3
--
--    Expect https://empathyledger.com/api/media/<id>/file, NOT /api/media/<id>/file.
--    And re-run the ACT gate, which renders the real pages: npm run check:media
--    (baseline 0 dead across 21 story pages).


-- NOT IN SCOPE, recorded so it is not lost: 6 rows in `stories` carry the same
-- hardcoded host in their content, served by /api/v1/content-hub/stories/[id],
-- which this change does not touch. Separate table, separate surface, and
-- leaving them absolute keeps their behaviour exactly as it is today.
