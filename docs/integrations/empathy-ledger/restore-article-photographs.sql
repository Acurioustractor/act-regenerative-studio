-- Restore the photographs in Empathy Ledger article bodies.
--
-- Run against the Empathy Ledger Enhanced project (yvnuayzslukamizrlhwb).
-- Written 2026-08-07. Nothing here deletes or uploads anything; it rewrites
-- URLs in article HTML from a retired serving route to the current one.
--
--
-- WHAT HAPPENED
--
-- Every one of Empathy Ledger's fifteen storage buckets is now private, and
-- media is served through the application at /api/media/<id>/file, which mints
-- a signed URL and 302s to it. That is the right architecture for media that
-- carries consent: it means access can be withdrawn, which a public bucket can
-- never offer.
--
-- The migration rewrote the structured fields. It did not rewrite the HTML
-- bodies of articles, which still embed the old
-- .../storage/v1/object/public/media/<path> form. Those now answer 400 at
-- origin, on Empathy Ledger's own article pages and on every syndication
-- destination, A Curious Tractor included.
--
--
-- WHY IT LOOKS PARTLY FINE, AND WHY THAT IS THE WORST PART
--
-- Some photographs still appear. Every one of them is a Cloudflare cache hit
-- with max-age=3600, verified by response headers: cf-cache-status HIT for the
-- ones that render, BYPASS for the ones that do not. Nothing is being served
-- from origin. Those images are echoes of the last time the bucket was public,
-- kept alive only by traffic, and they will go dark as they age out.
--
-- The site is not partly working. It is entirely broken and partly cached.
--
--
-- NOTHING IS LOST
--
-- All 166 photographs the ACT site references are present in storage.objects
-- and all 166 resolve to a media_assets row. Across Empathy Ledger's own
-- articles the figure is 244 dead URLs in 40 articles, of which 244 map. There
-- is no unmappable remainder and no re-upload to do.
--
--
-- BEFORE RUNNING
--
-- 1. Take a backup of the column. This is the whole undo:
--
--      create table articles_content_backup_20260807 as
--      select id, slug, content from articles
--      where content like '%/storage/v1/object/public/media/%';
--
-- 2. Run the dry run below and read the numbers.
-- 3. Run the update.
-- 4. Re-run the dry run. remaining_dead should be 0.
--
-- The update is idempotent: it only matches the old URL form, so running it
-- twice changes nothing the second time.


-- ---------------------------------------------------------------------------
-- DRY RUN. Read-only. Shows what would change and proves every URL maps.
-- ---------------------------------------------------------------------------
with hits as (
  select a.id, a.slug,
         (regexp_matches(
            a.content,
            'https://yvnuayzslukamizrlhwb\.supabase\.co/storage/v1/object/public/media/([^"'')\s]+)',
            'g'))[1] as storage_path
  from articles a
  where a.content like '%/storage/v1/object/public/media/%'
)
select
  count(*)                as dead_url_occurrences,
  count(distinct h.slug)  as articles_affected,
  count(m.id)             as occurrences_with_a_media_id,
  count(*) - count(m.id)  as occurrences_with_no_mapping   -- must be 0
from hits h
left join media_assets m on m.storage_path = h.storage_path;


-- ---------------------------------------------------------------------------
-- THE REWRITE. Run only when occurrences_with_no_mapping is 0.
--
-- Iterates because one article holds many distinct URLs and a single
-- regexp_replace cannot look each one up. Bounded by the number of distinct
-- (article, path) pairs, a few hundred, so it finishes in seconds.
-- ---------------------------------------------------------------------------
do $$
declare
  target record;
  replaced int := 0;
begin
  for target in
    select distinct a.id as article_id, m.id as media_id, m.storage_path
    from articles a
    join media_assets m
      on position(
           'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/'
           || m.storage_path in a.content
         ) > 0
    where a.content like '%/storage/v1/object/public/media/%'
  loop
    update articles
       set content = replace(
             content,
             'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/'
               || target.storage_path,
             'https://empathyledger.com/api/media/' || target.media_id || '/file'
           )
     where id = target.article_id;
    replaced := replaced + 1;
  end loop;
  raise notice 'rewrote % (article, photograph) pairs', replaced;
end $$;


-- ---------------------------------------------------------------------------
-- VERIFY. remaining_dead must be 0; now_on_the_signed_route should be ~244.
-- ---------------------------------------------------------------------------
select
  count(*) filter (where content like '%/storage/v1/object/public/media/%') as remaining_dead,
  count(*) filter (where content like '%/api/media/%')                      as now_on_the_signed_route
from articles;


-- ---------------------------------------------------------------------------
-- AFTERWARDS
--
-- The signed route is not cacheable the way a public bucket was, because each
-- response 302s to a URL that expires. Watch article page load times; if they
-- suffer, the answer is a longer signature lifetime or a CDN in front of
-- /api/media, not a return to public buckets.
--
-- On the ACT side, re-run `npm run sync:el-editorial` to pick up the rewritten
-- bodies, then `npm run check:media`, and lower the baseline in
-- scripts/check-editorial-media.mjs from 107 towards 0.
-- ---------------------------------------------------------------------------
