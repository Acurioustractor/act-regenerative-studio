-- Register the 34 unregistered featured images so they serve through the gated
-- route, and point each article at its new asset.
--
-- Run against the Empathy Ledger project: yvnuayzslukamizrlhwb
-- (Supabase dashboard -> SQL editor). Safe to re-run: both statements are
-- idempotent.
--
--
-- WHY THESE 34 ARE BROKEN RIGHT NOW
--
-- Their featured image lives in articles.import_metadata->>'featuredImageUrl'
-- as a raw URL under /storage/v1/object/public/media/. The `media` bucket is no
-- longer public, so that URL returns 400 NoSuchBucket. The objects themselves
-- are all still in the bucket (verified: 34 of 34 present in storage.objects).
-- They are simply unregistered in media_assets, so nothing can sign a URL for
-- them, and the article has no featured_image_id to fall back to.
--
-- All 34 are consumed by JusticeHub. None are on the ACT site.
--
--
-- WHAT THIS ASSERTS
--
-- requires_consent = false, visibility = 'public'. Same shape the earlier
-- `ungoverned-public-media-backfill-2026-07-30` used for this same class of
-- file, and it is what makes evaluateMediaGate() return 'publishable':
--   visibility='public' AND (requires_consent=false OR consent_obtained
--   OR consent_granted OR contained_consent)
--
-- Ben confirmed 2026-08-08 that these images carry no people and are cleared
-- for use. alt_text is provisional and flagged as such. elder_review_status
-- stays 'unreviewed', which the gate treats as neutral (only
-- 'sacred_no_publish' is a hard no).


-- 1. Register the assets.
with parsed as (
  select a.slug,
         split_part(split_part(a.import_metadata->>'featuredImageUrl','/storage/v1/object/public/media/',2),'?',1) as sp
  from articles a
  where a.status='published' and a.featured_image_id is null
    and a.import_metadata->>'featuredImageUrl' like '%/storage/v1/object/public/media/%'
), unreg as (
  select distinct p.sp
  from parsed p
  where not exists (select 1 from media_assets ma where ma.storage_path = p.sp)
)
insert into media_assets (
  original_filename, file_size, file_type, media_type, mime_type,
  storage_bucket, storage_path, tenant_id, uploader_id,
  privacy_level, visibility, requires_consent, status,
  alt_text, metadata
)
select
  regexp_replace(u.sp, '^.*/', ''),
  coalesce((o.metadata->>'size')::bigint, 0),
  'image', 'image',
  coalesce(o.metadata->>'mimetype', 'image/jpeg'),
  'media', u.sp,
  'bf17d0a9-2b12-4e4a-982e-09a8b1952ec6'::uuid,   -- same tenant as the 2026-07-30 backfill
  'd0a162d2-282e-4653-9d12-aa934c9dfa4e'::uuid,   -- same backfill operator
  'public', 'public', false, 'active',
  'Undescribed image: ' || regexp_replace(regexp_replace(u.sp,'^.*/',''), '\.[^.]+$', ''),
  jsonb_build_object(
    'bucket','media',
    'backfill','featured-image-backfill-2026-08-08',
    'reviewed', false,
    'tenant_source','referenced_by_published_writing',
    'alt_text_provisional', true,
    'uploader_is_backfill_operator', true
  )
from unreg u
join storage.objects o on o.bucket_id='media' and o.name = u.sp
returning id, storage_path;


-- 2. Point each article at its newly registered asset.
--    The detail route prefers featured_image_id over the raw import_metadata
--    URL, so this is what actually fixes the rendered image.
update articles a
set featured_image_id = ma.id
from media_assets ma
where a.status='published'
  and a.featured_image_id is null
  and a.import_metadata->>'featuredImageUrl' like '%/storage/v1/object/public/media/%'
  and ma.storage_path = split_part(
        split_part(a.import_metadata->>'featuredImageUrl','/storage/v1/object/public/media/',2), '?', 1);


-- 3. Verify: expect still_broken = 0, now_wired = 34.
select
  count(*) filter (where a.featured_image_id is null)     as still_broken,
  count(*) filter (where a.featured_image_id is not null) as now_wired
from articles a
where a.status='published'
  and a.import_metadata->>'featuredImageUrl' like '%/storage/v1/object/public/media/%';
