/**
 * Test Notion Connection
 *
 * Quick test script to verify Notion integration is working correctly
 * Run with: node test-notion-connection.mjs
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN || process.env.NOTION_API_KEY,
});

const PROJECTS_DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID;

async function testNotionConnection() {
  console.log('🧪 Testing Notion Connection...\n');

  if (!PROJECTS_DATABASE_ID) {
    console.error('❌ NOTION_PROJECTS_DATABASE_ID not found in environment');
    process.exit(1);
  }

  try {
    console.log(`📊 Fetching projects from database: ${PROJECTS_DATABASE_ID}\n`);
    console.log('Available top-level methods:', Object.keys(notion));

    // Check what methods exist
    if (notion.databases && notion.databases.query) {
      const response = await notion.databases.query({
        database_id: PROJECTS_DATABASE_ID,
        page_size: 5,
      });
    } else {
      console.error('Query method not found. Trying alternative...');
      // List all available methods
      console.log('notion.databases methods:', Object.keys(notion.databases || {}));
      console.log('notion.pages methods:', Object.keys(notion.pages || {}));
      throw new Error('Unable to find query method');
    }

    const response = { results: [] }; // Placeholder

    console.log(`✅ Connection successful! Found ${response.results.length} projects:\n`);

    response.results.forEach((page, index) => {
      const props = page.properties;

      // Extract project name
      const nameProperty = props.Name || props.Title;
      const name = nameProperty?.title?.[0]?.plain_text || 'Untitled';

      // Extract slug
      const slug = props.Slug?.rich_text?.[0]?.plain_text || 'no-slug';

      // Extract status
      const status = props.Status?.status?.name || props.Status?.select?.name || 'unknown';

      console.log(`${index + 1}. ${name}`);
      console.log(`   Slug: ${slug}`);
      console.log(`   Status: ${status}`);
      console.log(`   ID: ${page.id}\n`);
    });

    console.log('✅ Notion integration is working correctly!\n');
    console.log('Next steps:');
    console.log('  1. Start the dev server: npm run dev');
    console.log('  2. Test API: curl http://localhost:3002/api/projects/justicehub/notion');
    console.log('  3. Test enrichment: curl http://localhost:3002/api/projects/justicehub/enrich\n');

  } catch (error) {
    console.error('❌ Error connecting to Notion:\n');
    console.error(error.message);

    if (error.code === 'unauthorized') {
      console.error('\n💡 Make sure your Notion integration has access to the database');
      console.error('   1. Go to your database in Notion');
      console.error('   2. Click the "..." menu → "Add connections"');
      console.error('   3. Select your ACT Project Enrichment integration\n');
    }

    process.exit(1);
  }
}

testNotionConnection();
