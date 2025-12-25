/**
 * Import Media from Webflow Portfolio Database
 *
 * Imports all media (images, videos, video links) from the ACT Placemat webflow-portfolio
 * database into the ACT Farm Innovation Studio media gallery.
 *
 * Run with: node scripts/import-portfolio-media.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Source database (webflow-portfolio uses yvnuayzslukamizrlhwb - storyteller Supabase)
const SOURCE_URL = 'https://yvnuayzslukamizrlhwb.supabase.co';
const SOURCE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bnVheXpzbHVrYW1penJsaHdiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI0NDg1MCwiZXhwIjoyMDcxODIwODUwfQ.natmxpGJM9oZNnCAeMKo_D3fvkBz9spwwzhw7vbkT0k';

// Target database (Innovation Studio uses tednluwflfhxyucgwigh)
const TARGET_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tednluwflfhxyucgwigh.supabase.co';
const TARGET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZG5sdXdmbGZoeHl1Y2d3aWdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM0NjIyOSwiZXhwIjoyMDY3OTIyMjI5fQ.wyizbOWRxMULUp6WBojJPfey1ta8-Al1OlZqDDIPIHo';

if (!SOURCE_KEY || !TARGET_URL || !TARGET_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const sourceDb = createClient(SOURCE_URL, SOURCE_KEY);
const targetDb = createClient(TARGET_URL, TARGET_KEY);

async function importMedia() {
  console.log('🎬 Starting media import from webflow-portfolio...\n');

  try {
    // 1. Import media_items (photos, documents, uploaded videos)
    console.log('1️⃣  Importing media_items (from media_items table)...');
    const { data: sourceMedia, error: mediaError } = await sourceDb
      .from('media_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (mediaError) {
      console.error('❌ Error fetching source media:', mediaError);
      throw mediaError;
    }

    console.log(`   Found ${sourceMedia?.length || 0} media items in source database`);

    let importedCount = 0;
    let skippedCount = 0;

    for (const item of sourceMedia || []) {
      // Check if already imported
      const { data: existing } = await targetDb
        .from('media_items')
        .select('id')
        .eq('source', 'webflow-portfolio')
        .eq('source_id', item.id)
        .single();

      if (existing) {
        skippedCount++;
        continue;
      }

      // Map fields from source to target schema
      const targetItem = {
        // Keep original ID for consistency
        id: item.id,

        // File references
        file_url: item.file_url,
        thumbnail_url: item.thumbnail_url || item.compressed_url,

        // Media type
        file_type: item.file_type || 'photo',
        mime_type: item.mime_type,
        file_size_bytes: item.file_size,

        // Dimensions
        width: item.dimensions?.width,
        height: item.dimensions?.height,
        duration_seconds: item.dimensions?.duration,
        blurhash: item.blurhash,

        // Metadata
        title: item.title,
        description: item.description,
        alt_text: item.alt_text,
        credit: item.photographer,
        caption: item.caption,

        // Tags
        manual_tags: item.manual_tags || [],
        impact_themes: item.impact_themes || [],
        project_slugs: [], // Will map project_ids separately

        // Hero flag
        is_hero_image: false,

        // Source tracking
        source: 'webflow-portfolio',
        source_id: item.id,

        // Timestamps
        created_at: item.created_at,
        created_by: item.created_by,
      };

      const { error: insertError } = await targetDb
        .from('media_items')
        .insert(targetItem);

      if (insertError) {
        console.error(`   ❌ Error importing ${item.id}:`, insertError.message);
      } else {
        importedCount++;
      }
    }

    console.log(`   ✅ Imported ${importedCount} media items`);
    console.log(`   ⏭️  Skipped ${skippedCount} already imported\n`);

    // 2. Import review_videos (YouTube, Loom, Vimeo links)
    console.log('2️⃣  Importing video embeds...');
    const { data: sourceVideos, error: videosError } = await sourceDb
      .from('review_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (videosError) {
      console.error('❌ Error fetching source videos:', videosError);
      throw videosError;
    }

    console.log(`   Found ${sourceVideos?.length || 0} video embeds in source database`);

    let videosImported = 0;
    let videosSkipped = 0;

    for (const video of sourceVideos || []) {
      // Check if already imported
      const { data: existingVideo } = await targetDb
        .from('video_embeds')
        .select('id')
        .eq('video_id', video.video_id)
        .eq('platform', video.platform)
        .single();

      if (existingVideo) {
        videosSkipped++;
        continue;
      }

      const targetVideo = {
        id: video.id,
        platform: video.platform,
        video_id: video.video_id,
        embed_url: video.embed_url,
        thumbnail_url: video.thumbnail_url,
        title: video.title,
        description: video.description,
        duration_seconds: video.duration_seconds,
        link_type: video.link_type || 'standalone',
        link_id: video.link_id,
        display_order: video.display_order || 0,
        is_featured: video.is_featured || false,
        autoplay: video.autoplay || false,
        created_at: video.created_at,
      };

      const { error: videoInsertError } = await targetDb
        .from('video_embeds')
        .insert(targetVideo);

      if (videoInsertError) {
        console.error(`   ❌ Error importing video ${video.id}:`, videoInsertError.message);
      } else {
        videosImported++;
      }
    }

    console.log(`   ✅ Imported ${videosImported} video embeds`);
    console.log(`   ⏭️  Skipped ${videosSkipped} already imported\n`);

    // 3. Import media links (relationships)
    console.log('3️⃣  Importing media links...');
    const { data: sourceLinks, error: linksError } = await sourceDb
      .from('review_media_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (linksError) {
      console.error('❌ Error fetching source links:', linksError);
      throw linksError;
    }

    console.log(`   Found ${sourceLinks?.length || 0} media links in source database`);

    let linksImported = 0;
    let linksSkipped = 0;

    for (const link of sourceLinks || []) {
      // Check if already imported
      const { data: existingLink } = await targetDb
        .from('project_media_links')
        .select('id')
        .eq('media_id', link.media_id)
        .eq('link_type', link.link_type)
        .eq('link_id', link.link_id)
        .single();

      if (existingLink) {
        linksSkipped++;
        continue;
      }

      const targetLink = {
        id: link.id,
        media_id: link.media_id,
        link_type: link.link_type,
        link_id: link.link_id,
        display_order: link.display_order || 0,
        caption: link.caption,
        alt_text: link.alt_text,
        is_hero: link.is_hero || false,
        is_featured: link.is_featured || false,
        created_at: link.created_at,
      };

      const { error: linkInsertError } = await targetDb
        .from('project_media_links')
        .insert(targetLink);

      if (linkInsertError) {
        console.error(`   ❌ Error importing link ${link.id}:`, linkInsertError.message);
      } else {
        linksImported++;
      }
    }

    console.log(`   ✅ Imported ${linksImported} media links`);
    console.log(`   ⏭️  Skipped ${linksSkipped} already imported\n`);

    // Summary
    console.log('✨ Import complete!\n');
    console.log('📊 Summary:');
    console.log(`   Media Items: ${importedCount} imported, ${skippedCount} skipped`);
    console.log(`   Video Embeds: ${videosImported} imported, ${videosSkipped} skipped`);
    console.log(`   Media Links: ${linksImported} imported, ${linksSkipped} skipped\n`);
    console.log('🎉 All media successfully imported from webflow-portfolio!');

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

importMedia();
