/**
 * Import Video Embeds from curated-2025.json
 *
 * Imports external video embeds (Descript, YouTube, Vimeo, Loom) from the
 * Year in Review curated JSON file into the video_embeds table.
 *
 * Run with: node scripts/import-video-embeds.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

// Target database
const TARGET_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tednluwflfhxyucgwigh.supabase.co';
const TARGET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZG5sdXdmbGZoeHl1Y2d3aWdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM0NjIyOSwiZXhwIjoyMDY3OTIyMjI5fQ.wyizbOWRxMULUp6WBojJPfey1ta8-Al1OlZqDDIPIHo';

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
    };
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return {
      platform: 'vimeo',
      video_id: vimeoMatch ? vimeoMatch[1] : null,
      embed_url: vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}` : url,
    };
  }

  // Loom
  if (url.includes('loom.com')) {
    const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
    return {
      platform: 'loom',
      video_id: loomMatch ? loomMatch[1] : null,
      embed_url: loomMatch ? `https://www.loom.com/embed/${loomMatch[1]}` : url,
    };
  }

  // Descript
  if (url.includes('descript.com')) {
    const descriptMatch = url.match(/descript\.com\/view\/([a-zA-Z0-9]+)/);
    return {
      platform: 'descript',
      video_id: descriptMatch ? descriptMatch[1] : null,
      embed_url: url, // Descript uses direct view URLs
    };
  }

  // Direct video file
  if (url.match(/\.(mp4|webm|mov|avi)(\?|$)/i)) {
    return {
      platform: 'direct',
      video_id: url.split('/').pop().split('?')[0],
      embed_url: url,
    };
  }

  return null;
}

/**
 * Import video embeds from curated JSON
 */
async function importVideoEmbeds() {
  console.log('🎬 Starting video embed import from curated-2025.json...\n');

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

    console.log(`   Found ${videoData.length} video embeds\n`);

    // 3. Import video embeds
    console.log('3️⃣  Importing video embeds...');
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const video of videoData) {
      // Check if already imported
      const { data: existing } = await targetDb
        .from('video_embeds')
        .select('id')
        .eq('platform', video.platform)
        .eq('video_id', video.video_id)
        .single();

      if (existing) {
        skippedCount++;
        continue;
      }

      // Create video embed
      const videoEmbed = {
        platform: video.platform,
        video_id: video.video_id,
        embed_url: video.embed_url,
        title: video.title?.substring(0, 255) || '',
        description: video.description?.substring(0, 1000),
        link_type: video.link_type,
        link_id: video.link_id,
        is_featured: video.is_featured,
      };

      const { error: insertError } = await targetDb
        .from('video_embeds')
        .insert(videoEmbed);

      if (insertError) {
        console.error(`   ❌ Error importing ${video.video_id}:`, insertError.message);
        errorCount++;
      } else {
        importedCount++;
        console.log(`   ✅ Imported ${video.platform} video: ${video.title?.substring(0, 50)}...`);
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
