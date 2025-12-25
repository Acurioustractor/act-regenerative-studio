import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const TARGET_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tednluwflfhxyucgwigh.supabase.co';
const TARGET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const db = createClient(TARGET_URL, TARGET_KEY);

async function checkImportedMedia() {
  console.log('📊 Checking imported media...\n');

  // Get all media items from year-in-review source
  const { data: yearInReview, error } = await db
    .from('media_items')
    .select('*')
    .eq('source', 'year-in-review-2025')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`✅ Found ${yearInReview.length} imported media items from Year in Review 2025\n`);

  // Show breakdown
  const byType = {};
  const byTags = {};
  const heroImages = [];

  for (const item of yearInReview) {
    // Count by type
    byType[item.file_type] = (byType[item.file_type] || 0) + 1;

    // Count by tags
    for (const tag of item.manual_tags || []) {
      byTags[tag] = (byTags[tag] || 0) + 1;
    }

    // Collect hero images
    if (item.is_hero_image) {
      heroImages.push({
        title: item.title,
        url: item.file_url,
        projects: item.project_slugs,
      });
    }
  }

  console.log('📁 By file type:');
  for (const [type, count] of Object.entries(byType)) {
    console.log(`   ${type}: ${count}`);
  }

  console.log('\n🏷️  By tags:');
  for (const [tag, count] of Object.entries(byTags).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${tag}: ${count}`);
  }

  console.log(`\n🖼️  Hero images: ${heroImages.length}`);
  for (const hero of heroImages.slice(0, 5)) {
    console.log(`   - ${hero.title.substring(0, 50)}...`);
    if (hero.projects.length > 0) {
      console.log(`     Projects: ${hero.projects.join(', ')}`);
    }
  }

  console.log('\n📸 Sample media items:');
  for (const item of yearInReview.slice(0, 3)) {
    console.log(`   - ${item.title.substring(0, 60)}...`);
    console.log(`     Type: ${item.file_type} | Tags: ${item.manual_tags.join(', ')}`);
    console.log(`     URL: ${item.file_url.substring(0, 80)}...`);
  }
}

checkImportedMedia();
