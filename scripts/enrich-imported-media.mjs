/**
 * Enrich Imported Media Metadata
 *
 * Adds impact_themes, improves alt text/captions, and links media to project pages
 * based on content analysis and existing tags.
 *
 * Run with: node scripts/enrich-imported-media.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const TARGET_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tednluwflfhxyucgwigh.supabase.co';
const TARGET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const db = createClient(TARGET_URL, TARGET_KEY);

/**
 * Impact theme mappings based on keywords in title/description/tags
 */
const THEME_KEYWORDS = {
  'regenerative-agriculture': [
    'farm', 'agriculture', 'harvest', 'planting', 'soil', 'permaculture',
    'reforest', 'green harvest', 'food', 'seeds'
  ],
  'social-justice': [
    'justice', 'equity', 'rights', 'freedom', 'fair', 'dignity',
    'displacement', 'refugee', 'homelessness', 'laundry', 'basic right'
  ],
  'indigenous-leadership': [
    'indigenous', 'elder', 'aboriginal', 'first nations', 'cultural',
    'country', 'mission beach', 'pakkinjalki kari'
  ],
  'youth-empowerment': [
    'youth', 'young people', 'education', 'learning', 'student',
    'playground', 'diagrama', 'la zarza'
  ],
  'community-building': [
    'community', 'partnership', 'collaboration', 'connection', 'engagement',
    'smart recovery', 'retreat', 'gathering'
  ],
  'innovation': [
    'innovation', 'technology', 'digital', 'ai', 'platform', 'build',
    'gold.phone', 'empathy ledger', 'hacking'
  ],
  'storytelling': [
    'story', 'stories', 'narrative', 'voices', 'storyteller',
    'empathy ledger', 'conversation'
  ],
  'health-wellness': [
    'health', 'wellness', 'wellbeing', 'mental health', 'recovery',
    'therapeutic', 'healing', 'smart recovery'
  ],
  'environmental-stewardship': [
    'environment', 'sustainability', 'conservation', 'climate',
    'restoration', 'habitat', 'biodiversity', 'land'
  ],
  'economic-opportunity': [
    'economic', 'employment', 'opportunity', 'funding', 'business',
    'enterprise', 'income', 'investment'
  ],
};

/**
 * Project slug mappings based on keywords
 */
const PROJECT_KEYWORDS = {
  'justicehub': ['justice', 'service', 'support', 'family', 'contained'],
  'empathy-ledger': ['empathy ledger', 'storyteller', 'stories', 'voices', 'narrative'],
  'green-harvest-first-sprouts': ['green harvest', 'witta', 'bcv reforest', 'planting', 'seeds'],
  'project-love-confit-pathways': ['project love', 'confit pathways', 'youth justice'],
  'global-laundry-alliance': ['laundry', 'washing', 'dignity', 'clean clothes', 'pakkinjalki kari'],
  'smart-recovery-partnership': ['smart recovery', 'smart', 'wellness', 'mental health'],
  'gold-phone': ['gold.phone', 'communication', 'pay phone', 'nostalgic'],
  'diagrama-spain-visit': ['diagrama', 'spain', 'la zarza', 'england'],
};

/**
 * Detect impact themes from text
 */
function detectImpactThemes(text) {
  const textLower = text.toLowerCase();
  const themes = new Set();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        themes.add(theme);
        break; // Only add theme once
      }
    }
  }

  return Array.from(themes);
}

/**
 * Detect project slugs from text
 */
function detectProjectSlugs(text, existingSlugs = []) {
  const textLower = text.toLowerCase();
  const slugs = new Set(existingSlugs);

  for (const [slug, keywords] of Object.entries(PROJECT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        slugs.add(slug);
        break;
      }
    }
  }

  return Array.from(slugs);
}

/**
 * Improve alt text for accessibility
 */
function generateAltText(item) {
  if (!item.title) return '';

  // If title is descriptive, use it
  if (item.title.length > 20 && item.title.length < 150) {
    return item.title;
  }

  // Build descriptive alt text
  let alt = item.title;

  // Add context from themes
  const themes = item.impact_themes || [];
  if (themes.length > 0) {
    const themeContext = themes[0].replace(/-/g, ' ');
    alt = `${alt} - ${themeContext} initiative`;
  }

  return alt.substring(0, 255);
}

/**
 * Improve caption with context
 */
function generateCaption(item) {
  if (!item.description) return item.caption || '';

  // Use first sentence or first 200 chars
  let caption = item.description;
  const firstSentence = caption.match(/^[^.!?]+[.!?]/);

  if (firstSentence) {
    caption = firstSentence[0];
  } else if (caption.length > 200) {
    caption = caption.substring(0, 197) + '...';
  }

  return caption;
}

/**
 * Enrich all imported media
 */
async function enrichMedia() {
  console.log('🎨 Starting media enrichment...\n');

  try {
    // 1. Get all imported media
    console.log('1️⃣  Fetching imported media...');
    const { data: mediaItems, error: fetchError } = await db
      .from('media_items')
      .select('*')
      .eq('source', 'year-in-review-2025')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching media:', fetchError);
      return;
    }

    console.log(`   Found ${mediaItems.length} items to enrich\n`);

    // 2. Enrich each item
    console.log('2️⃣  Enriching metadata...');
    let enrichedCount = 0;
    let linkCount = 0;

    for (const item of mediaItems) {
      // Combine title, description, and tags for analysis
      const analysisText = [
        item.title || '',
        item.description || '',
        item.caption || '',
        ...(item.manual_tags || []),
      ].join(' ');

      // Detect impact themes
      const detectedThemes = detectImpactThemes(analysisText);

      // Detect project slugs
      const detectedSlugs = detectProjectSlugs(analysisText, item.project_slugs || []);

      // Generate better alt text
      const newAltText = generateAltText({
        ...item,
        impact_themes: detectedThemes,
      });

      // Generate better caption
      const newCaption = generateCaption(item);

      // Update item if changes detected
      const hasChanges =
        detectedThemes.length > 0 ||
        detectedSlugs.length > (item.project_slugs?.length || 0) ||
        (newAltText && newAltText !== item.alt_text) ||
        (newCaption && newCaption !== item.caption);

      if (hasChanges) {
        const updates = {
          impact_themes: detectedThemes.length > 0 ? detectedThemes : item.impact_themes || [],
          project_slugs: detectedSlugs,
          alt_text: newAltText || item.alt_text,
          caption: newCaption || item.caption,
        };

        const { error: updateError } = await db
          .from('media_items')
          .update(updates)
          .eq('id', item.id);

        if (updateError) {
          console.error(`   ❌ Error updating ${item.id}:`, updateError.message);
        } else {
          enrichedCount++;
          console.log(`   ✅ Enriched: ${item.title.substring(0, 50)}...`);
          console.log(`      Themes: ${detectedThemes.join(', ')}`);
          if (detectedSlugs.length > 0) {
            console.log(`      Projects: ${detectedSlugs.join(', ')}`);
          }
        }

        // Create project_media_links for new slugs
        for (const slug of detectedSlugs) {
          // Check if link already exists
          const { data: existingLink } = await db
            .from('project_media_links')
            .select('*')
            .eq('media_id', item.id)
            .eq('link_type', 'project_page')
            .eq('link_id', slug)
            .single();

          if (!existingLink) {
            const { error: linkError } = await db
              .from('project_media_links')
              .insert({
                media_id: item.id,
                link_type: 'project_page',
                link_id: slug,
                display_order: 0,
              });

            if (!linkError) {
              linkCount++;
            }
          }
        }
      }
    }

    console.log(`\n✅ Enrichment complete!`);
    console.log(`   🎨 Items enriched: ${enrichedCount}`);
    console.log(`   🔗 Project links created: ${linkCount}`);

    // 3. Show summary
    console.log('\n📊 Enrichment summary:');

    const { data: enrichedItems } = await db
      .from('media_items')
      .select('impact_themes, project_slugs')
      .eq('source', 'year-in-review-2025');

    const themeCount = {};
    const projectCount = {};

    for (const item of enrichedItems || []) {
      for (const theme of item.impact_themes || []) {
        themeCount[theme] = (themeCount[theme] || 0) + 1;
      }
      for (const slug of item.project_slugs || []) {
        projectCount[slug] = (projectCount[slug] || 0) + 1;
      }
    }

    console.log('\n🎯 Impact Themes:');
    for (const [theme, count] of Object.entries(themeCount).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${theme}: ${count} items`);
    }

    console.log('\n📁 Project Links:');
    for (const [slug, count] of Object.entries(projectCount).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${slug}: ${count} items`);
    }

    console.log('\n💡 Next steps:');
    console.log('   1. Review enriched media at http://localhost:3001/admin/media-gallery');
    console.log('   2. Manually adjust any incorrect theme or project assignments');
    console.log('   3. Add additional context to captions as needed');
    console.log('   4. Use MediaPicker component to add media to project pages');

  } catch (error) {
    console.error('❌ Enrichment failed:', error);
    process.exit(1);
  }
}

// Run enrichment
enrichMedia();
