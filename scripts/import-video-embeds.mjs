/**
 * Import Video Links from curated-2025.json into video_links
 *
 * Imports external video links (Descript, YouTube, Vimeo, Loom) from the
 * Year in Review curated JSON file into the video_links table.
 *
 * Run with: node scripts/import-video-embeds.mjs [--platform=descript] [--tag=compendium-2026]
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const args = process.argv.slice(2);
const platformArg = args.find((arg) => arg.startsWith('--platform='));
const includeAll = args.includes('--all');
const tagArg = args.find((arg) => arg.startsWith('--tag='));
const platformFilter = includeAll ? null : (platformArg ? platformArg.split('=')[1] : 'descript');
const tagSlug = tagArg ? tagArg.split('=')[1] : null;

// Target database (Empathy Ledger Enhanced preferred)
const TARGET_URL =
  process.env.EL_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const TARGET_KEY =
  process.env.EL_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!TARGET_URL || !TARGET_KEY) {
  console.error('Missing EL_SUPABASE_URL/EL_SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_ROLE_KEY).');
  process.exit(1);
}

const targetDb = createClient(TARGET_URL, TARGET_KEY);

const CURATED_JSON_PATH = '/Users/benknight/Code/ACT Placemat/apps/webflow-portfolio/data/curated-2025.json';

/**
 * Detect video platform and extract video ID
 */
function parseVideoUrl(url) {
  if (!url) return null;

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?]+)/);
    return {
      platform: 'youtube',
      video_id: youtubeMatch ? youtubeMatch[1] : null,
      embed_url: youtubeMatch ? `https://www.youtube.com/embed/${youtubeMatch[1]}` : url,
      video_url: url,
    };
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return {
      platform: 'vimeo',
      video_id: vimeoMatch ? vimeoMatch[1] : null,
      embed_url: vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}` : url,
      video_url: url,
    };
  }

  // Loom
  if (url.includes('loom.com')) {
    const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    return {
      platform: 'loom',
      video_id: loomMatch ? loomMatch[1] : null,
      embed_url: loomMatch ? `https://www.loom.com/embed/${loomMatch[1]}` : url,
      video_url: url,
    };
  }

  // Descript
  if (url.includes('descript.com')) {
    const descriptMatch = url.match(/descript\.com\/view\/([a-zA-Z0-9]+)/);
    return {
      platform: 'descript',
      video_id: descriptMatch ? descriptMatch[1] : null,
      embed_url: descriptMatch ? `https://share.descript.com/embed/${descriptMatch[1]}` : url,
      video_url: url,
    };
  }

  // Direct video file
  if (url.match(/\.(mp4|webm|mov|avi)(\?|$)/i)) {
    return {
      platform: 'direct',
      video_id: url.split('/').pop().split('?')[0],
      embed_url: url,
      video_url: url,
    };
  }

  return null;
}

/**
 * Import video embeds from curated JSON
 */
async function ensureTag(tag) {
  if (!tag) return null;
  const slug = tag.toLowerCase();
  const { data: existing, error } = await targetDb
    .from('tags')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.warn('Failed to check tags:', error.message);
  }

  if (existing?.id) return existing.id;

  const { data: created, error: insertError } = await targetDb
    .from('tags')
    .insert({
      name: tag,
      slug,
      category: 'project',
      tenant_id: null,
    })
    .select('id')
    .single();

  if (insertError) {
    console.warn('Failed to create tag:', insertError.message);
    return null;
  }

  return created.id;
}

async function importVideoEmbeds() {
  console.log('🎬 Starting video link import from curated-2025.json...\n');
  if (platformFilter) {
    console.log(`🔎 Filtering platform: ${platformFilter}\n`);
  }
  if (tagSlug) {
    console.log(`🏷️  Tagging videos with: ${tagSlug}\n`);
  }

  try {
    // 1. Read JSON file
    console.log('1️⃣  Reading curated-2025.json...');
    const jsonContent = readFileSync(CURATED_JSON_PATH, 'utf8');
    const data = JSON.parse(jsonContent);

    console.log(`   Found ${data.entries.length} entries\n`);

    // 2. Extract all video URLs
    console.log('2️⃣  Extracting video URLs...');
    const videoData = [];

    for (const entry of data.entries) {
      if (entry.heroVideoUrl) {
        const parsed = parseVideoUrl(entry.heroVideoUrl);
        if (parsed && parsed.video_id) {
          if (platformFilter && parsed.platform !== platformFilter) {
            continue;
          }
          videoData.push({
            ...parsed,
            title: entry.editedTitle || entry.title,
            description: entry.editedDescription || entry.description,
            link_type: 'timeline_entry',
            link_id: entry.id,
            is_featured: true,
            projectSlug: entry.projectSlug,
          });
        }
      }
    }

    console.log(`   Found ${videoData.length} video links\n`);

    const tagId = await ensureTag(tagSlug);

    // 3. Import video links
    console.log('3️⃣  Importing video links...');
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const video of videoData) {
      // Check if already imported
      const { data: existing } = await targetDb
        .from('video_links')
        .select('id')
        .eq('video_url', video.video_url || video.embed_url)
        .maybeSingle();

      if (existing) {
        skippedCount++;
        if (tagId) {
          const { error: tagError } = await targetDb
            .from('video_link_tags')
            .insert({
              video_link_id: existing.id,
              tag_id: tagId,
              source: 'batch',
            });
          if (tagError && tagError.code !== '23505') {
            console.warn(`   ⚠️  Tagging failed for ${video.video_id}:`, tagError.message);
          }
        }
        continue;
      }

      // Create video embed
      const videoLink = {
        title: video.title?.substring(0, 255) || '',
        description: video.description?.substring(0, 1000),
        video_url: video.video_url || video.embed_url,
        embed_url: video.embed_url,
        platform: video.platform,
        project_code: video.projectSlug || null,
        status: 'active',
      };

      const { data: inserted, error: insertError } = await targetDb
        .from('video_links')
        .insert(videoLink)
        .select('id')
        .single();

      if (insertError) {
        console.error(`   ❌ Error importing ${video.video_id}:`, insertError.message);
        errorCount++;
      } else {
        importedCount++;
        console.log(`   ✅ Imported ${video.platform} video: ${video.title?.substring(0, 50)}...`);

        if (tagId) {
          const { error: tagError } = await targetDb
            .from('video_link_tags')
            .insert({
              video_link_id: inserted.id,
              tag_id: tagId,
              source: 'batch',
            });
          if (tagError && tagError.code !== '23505') {
            console.warn(`   ⚠️  Tagging failed for ${video.video_id}:`, tagError.message);
          }
        }
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   📥 Imported: ${importedCount}`);
    console.log(`   ⏭️  Skipped (already imported): ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run import
importVideoEmbeds();
