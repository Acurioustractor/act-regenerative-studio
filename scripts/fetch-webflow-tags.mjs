import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiToken = process.env.WEBFLOW_API_TOKEN_JUSTICEHUB;
const siteId = process.env.WEBFLOW_JUSTICEHUB_SITE_ID;

console.log('🏷️  Fetching Webflow Tags\n');

// Webflow v2 doesn't have a direct tags endpoint, so we need to extract unique tags from items
const collectionId = process.env.WEBFLOW_JUSTICEHUB_BLOG_COLLECTION_ID;

async function fetchTags() {
  const url = `https://api.webflow.com/v2/collections/${collectionId}/items?limit=100`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error: ${response.status}`);
    return;
  }

  const data = await response.json();
  const items = data.items || [];

  // Extract all unique tag IDs and names
  const tagMap = new Map();

  for (const item of items) {
    const tags = item.fieldData?.tags || [];
    console.log(`Article: ${item.fieldData?.name}`);
    console.log(`Tags (raw):`, tags);
    console.log('');
  }
}

fetchTags().catch(console.error);
