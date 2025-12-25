import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const apiToken = process.env.WEBFLOW_API_TOKEN_JUSTICEHUB;
const collectionId = process.env.WEBFLOW_JUSTICEHUB_BLOG_COLLECTION_ID;

console.log('📰 Importing JusticeHub Articles to Enrichment System\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAllArticles() {
  let offset = 0;
  const limit = 100;
  let allArticles = [];

  while (true) {
    const url = `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}`;
    console.log(`Fetching batch: offset=${offset}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Error: ${response.status}`);
      break;
    }

    const data = await response.json();
    const items = data.items || [];

    if (items.length === 0) break;
    allArticles = allArticles.concat(items);

    if (items.length < limit) break;
    offset += limit;
  }

  return allArticles;
}

async function importArticles() {
  const articles = await fetchAllArticles();
  const published = articles.filter(a => !a.isDraft && !a.isArchived);

  console.log(`\n✅ Found ${published.length} published articles\n`);

  let importedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const article of published) {
    try {
      const title = article.fieldData?.name || article.name || 'Untitled';
      const slug = article.fieldData?.slug || article.slug;
      const content = article.fieldData?.['post-body'] || '';
      const excerpt = article.fieldData?.['post-summary'] || '';
      const featuredImage = article.fieldData?.['main-image']?.url || null;
      const tags = article.fieldData?.tags || [];
      const author = article.fieldData?.['author-name'] || 'JusticeHub Team';
      const publishedDate = article.fieldData?.['published-date'] || article.createdOn;

      // Check if already imported
      const { data: existing } = await supabase
        .from('enrichment_reviews')
        .select('id')
        .eq('project_slug', 'justicehub')
        .eq('enrichment_type', 'blog_links')
        .contains('ai_generated', { slug })
        .single();

      if (existing) {
        console.log(`⏭️  Skipped: ${title.substring(0, 60)}... (already imported)`);
        skippedCount++;
        continue;
      }

      // Import as enrichment (approved state)
      const enrichment = {
        project_slug: 'justicehub',
        project_title: 'JusticeHub',
        enrichment_type: 'blog_links',
        ai_generated: {
          title,
          slug,
          excerpt,
          url: `https://yj.yourjustice.org.au/blog/${slug}`,
          featuredImage,
          tags,
          author,
          publishedDate,
          source: 'webflow',
          sourceId: article.id,
        },
        original_data: {
          webflowArticle: article,
        },
        confidence: 1.0,
        status: 'approved', // Auto-approve Webflow imports
        reviewed_at: new Date().toISOString(),
        reasoning: 'Auto-imported from verified Webflow CMS source',
      };

      const { error } = await supabase
        .from('enrichment_reviews')
        .insert(enrichment);

      if (error) {
        console.error(`❌ Error importing "${title}":`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Imported: ${title.substring(0, 60)}...`);
        importedCount++;
      }

    } catch (err) {
      console.error(`❌ Exception:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Imported: ${importedCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📄 Total processed: ${published.length}`);
}

importArticles().catch(console.error);
