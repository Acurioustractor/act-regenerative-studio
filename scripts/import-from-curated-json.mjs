/**
 * Import Media from curated-2025.json
 *
 * Imports all media from the Year in Review curated JSON file into the
 * ACT Farm Innovation Studio media gallery.
 *
 * Media is stored in Supabase Storage at: photos/community/
 * Full URL pattern: https://tednluwflfhxyucgwigh.supabase.co/storage/v1/object/public/photos/community/{file-id}.{extension}
 *
 * Run with: node scripts/import-from-curated-json.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

dotenv.config({ path: '.env.local' });

// Target database (Innovation Studio uses tednluwflfhxyucgwigh)
const TARGET_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tednluwflfhxyucgwigh.supabase.co';
// Credentials come from the environment. They were hardcoded here as literal
// service_role JWTs in a PUBLIC repository until 2026-08-31. Both are now dead,
// because Supabase disabled legacy keys on these projects, and that was verified
// rather than assumed: a valid sb_secret_ key returns 200 on the same tables where
// both the committed key and a nonsense key return 401. They are removed anyway.
// A disabled key is one dashboard toggle from being live again, and git history
// keeps them regardless, so treat both as burned and never re-enable legacy keys.
//
// No fallback literal. A missing variable must stop the script, not silently reach
// for a credential nobody meant to ship.
const TARGET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!TARGET_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set. Export it before running this script.');
  process.exit(1);
}

const targetDb = createClient(TARGET_URL, TARGET_KEY);

// Path to curated JSON
const CURATED_JSON_PATH = '/Users/benknight/Code/ACT Placemat/apps/webflow-portfolio/data/curated-2025.json';

/**
 * Extract file ID from Supabase Storage URL
 */
function extractFileId(url) {
  if (!url) return null;
  const match = url.match(/photos\/community\/([^?]+)/);
  return match ? match[1] : null;
}

/**
 * Determine file type from extension
 */
function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExts = ['mp4', 'mov', 'webm', 'avi'];

  if (imageExts.includes(ext)) return 'photo';
  if (videoExts.includes(ext)) return 'video';
  return 'document';
}

/**
 * Import media from curated JSON
 */
async function importFromCuratedJson() {
  console.log('🎬 Starting media import from curated-2025.json...\n');

  try {
    // 1. Read JSON file
    console.log('1️⃣  Reading curated-2025.json...');
    const jsonContent = readFileSync(CURATED_JSON_PATH, 'utf8');
    const data = JSON.parse(jsonContent);

    console.log(`   Found ${data.entries.length} entries\n`);

    // 2. Extract all media URLs
    console.log('2️⃣  Extracting media URLs...');
    const mediaUrls = new Set();
    const mediaMetadata = new Map(); // url -> entry metadata

    for (const entry of data.entries) {
      // Hero images
      if (entry.heroImageUrl) {
        mediaUrls.add(entry.heroImageUrl);
        mediaMetadata.set(entry.heroImageUrl, {
          title: entry.editedTitle || entry.title,
          description: entry.editedDescription || entry.description,
          tags: entry.tags || [],
          type: entry.type,
          source: entry.source,
          date: entry.date,
          projectSlug: entry.projectSlug,
          isHero: true,
        });
      }

      // Hero videos
      if (entry.heroVideoUrl) {
        mediaUrls.add(entry.heroVideoUrl);
        mediaMetadata.set(entry.heroVideoUrl, {
          title: entry.editedTitle || entry.title,
          description: entry.editedDescription || entry.description,
          tags: entry.tags || [],
          type: entry.type,
          source: entry.source,
          date: entry.date,
          projectSlug: entry.projectSlug,
          isHero: true,
        });
      }

      // Photo galleries
      if (entry.photos && Array.isArray(entry.photos)) {
        for (const photo of entry.photos) {
          if (typeof photo === 'string') {
            mediaUrls.add(photo);
            mediaMetadata.set(photo, {
              title: entry.editedTitle || entry.title,
              tags: entry.tags || [],
              type: entry.type,
              source: entry.source,
              date: entry.date,
              projectSlug: entry.projectSlug,
              isHero: false,
            });
          }
        }
      }
    }

    console.log(`   Found ${mediaUrls.size} unique media files\n`);

    // 3. Import media items
    console.log('3️⃣  Importing media items...');
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const url of mediaUrls) {
      const fileId = extractFileId(url);
      if (!fileId) {
        console.log(`   ⚠️  Could not extract file ID from: ${url}`);
        errorCount++;
        continue;
      }

      // Check if already imported
      const { data: existing } = await targetDb
        .from('media_items')
        .select('id')
        .eq('source', 'year-in-review-2025')
        .eq('source_id', fileId)
        .single();

      if (existing) {
        skippedCount++;
        continue;
      }

      const metadata = mediaMetadata.get(url);
      const fileType = getFileType(fileId);

      // Create media item
      const mediaItem = {
        file_url: url,
        file_type: fileType,
        title: metadata?.title?.substring(0, 255) || fileId,
        alt_text: metadata?.title?.substring(0, 255) || '',
        caption: metadata?.description?.substring(0, 500),

        // Tagging
        manual_tags: metadata?.tags || [],
        impact_themes: [], // Can be enriched later
        project_slugs: metadata?.projectSlug ? [metadata.projectSlug] : [],

        // Metadata
        is_hero_image: metadata?.isHero || false,
        source: 'year-in-review-2025',
        source_id: fileId,

        // Timestamps
        created_at: metadata?.date || new Date().toISOString(),
      };

      const { error: insertError } = await targetDb
        .from('media_items')
        .insert(mediaItem);

      if (insertError) {
        console.error(`   ❌ Error importing ${fileId}:`, insertError.message);
        errorCount++;
      } else {
        importedCount++;
        if (importedCount % 10 === 0) {
          console.log(`   📥 Imported ${importedCount} items...`);
        }
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   📥 Imported: ${importedCount}`);
    console.log(`   ⏭️  Skipped (already imported): ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. View imported media: http://localhost:3001/admin/media-gallery`);
    console.log(`   2. Add impact_themes and additional tags via the UI`);
    console.log(`   3. Link media to projects using project_media_links table`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import
importFromCuratedJson();
