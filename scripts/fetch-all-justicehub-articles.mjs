import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiToken = process.env.WEBFLOW_API_TOKEN_JUSTICEHUB;
const collectionId = process.env.WEBFLOW_JUSTICEHUB_BLOG_COLLECTION_ID;

console.log('📰 Fetching ALL JusticeHub Articles\n');

async function fetchAllArticles() {
  let offset = 0;
  const limit = 100;
  let allArticles = [];

  while (true) {
    const url = `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}`;
    console.log(`Fetching batch: offset=${offset}, limit=${limit}`);

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

    console.log(`  ✅ Got ${items.length} articles in this batch`);

    if (items.length === 0) break;

    allArticles = allArticles.concat(items);

    // Check if there are more
    if (items.length < limit) {
      console.log(`  📄 No more articles (got ${items.length} < ${limit})`);
      break;
    }

    offset += limit;
  }

  console.log(`\n✅ Total articles fetched: ${allArticles.length}\n`);

  // Analyze status
  const published = allArticles.filter(a => !a.isDraft && !a.isArchived);
  const drafts = allArticles.filter(a => a.isDraft);
  const archived = allArticles.filter(a => a.isArchived);

  console.log('📊 Article Status:');
  console.log(`   Published: ${published.length}`);
  console.log(`   Drafts: ${drafts.length}`);
  console.log(`   Archived: ${archived.length}`);

  console.log('\n📰 Sample Published Articles:\n');
  for (const article of published.slice(0, 10)) {
    const name = article.fieldData && article.fieldData.name ? article.fieldData.name : 'Untitled';
    const slug = article.fieldData && article.fieldData.slug ? article.fieldData.slug : 'no-slug';
    const tagCount = article.fieldData && article.fieldData.tags ? article.fieldData.tags.length : 0;

    console.log(`   - ${name}`);
    console.log(`     Slug: ${slug}`);
    if (tagCount > 0) {
      console.log(`     Tags: ${tagCount} tags`);
    }
  }

  if (published.length > 10) {
    console.log(`   ... and ${published.length - 10} more`);
  }
}

fetchAllArticles().catch(console.error);
