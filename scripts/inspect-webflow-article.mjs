import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiToken = process.env.WEBFLOW_API_TOKEN_JUSTICEHUB;
const collectionId = process.env.WEBFLOW_JUSTICEHUB_BLOG_COLLECTION_ID;

async function inspectArticle() {
  const url = `https://api.webflow.com/v2/collections/${collectionId}/items?limit=1`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'accept': 'application/json',
    },
  });

  const data = await response.json();
  const article = data.items[0];

  console.log(JSON.stringify(article, null, 2));
}

inspectArticle().catch(console.error);
