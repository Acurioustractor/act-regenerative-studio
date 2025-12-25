/**
 * Test Webflow API Direct
 * Simple test without imports
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiToken = process.env.WEBFLOW_API_TOKEN_JUSTICEHUB;
const collectionId = process.env.WEBFLOW_JUSTICEHUB_BLOG_COLLECTION_ID;

console.log('🧪 Testing Webflow API (JusticeHub Blog)\n');

if (!apiToken || !collectionId) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

console.log(`Collection ID: ${collectionId}`);
console.log(`Token: ${apiToken.substring(0, 10)}...\n`);

try {
  const response = await fetch(
    `https://api.webflow.com/v2/collections/${collectionId}/items?limit=5`,
    {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'accept': 'application/json',
      },
    }
  );

  console.log(`Status: ${response.status} ${response.statusText}\n`);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Error:', error);
    process.exit(1);
  }

  const data = await response.json();
  console.log(`✅ Success! Found ${data.items?.length || 0} blog posts\n`);

  for (const item of data.items || []) {
    console.log(`\n📄 ${item.fieldData?.name || 'Untitled'}`);
    console.log(`   Slug: ${item.fieldData?.slug}`);
    console.log(`   Published: ${item.isArchived ? 'Archived' : item.isDraft ? 'Draft' : 'Published'}`);

    if (item.fieldData?.['description-short']) {
      console.log(`   Short: ${item.fieldData['description-short'].substring(0, 80)}...`);
    }

    if (item.fieldData?.tags) {
      console.log(`   Tags: ${item.fieldData.tags.join(', ')}`);
    }

    console.log(`   Fields: ${Object.keys(item.fieldData || {}).join(', ')}`);
  }

  console.log('\n✅ Test complete!');

} catch (error) {
  console.error('❌ Fetch failed:', error.message);
}
