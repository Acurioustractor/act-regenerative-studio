#!/usr/bin/env node

/**
 * Test Notion Connection
 *
 * Checks what Notion databases and pages you have access to
 */

import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

console.log('🔍 Testing Notion Connection...\n');

async function testConnection() {
  try {
    // Test 1: List all accessible pages
    console.log('📄 Searching for accessible pages...\n');

    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      page_size: 20,
    });

    if (response.results.length === 0) {
      console.log('⚠️  No pages found. Make sure you:');
      console.log('   1. Created a Notion integration at https://www.notion.so/my-integrations');
      console.log('   2. Shared your pages with the integration');
      console.log('   3. Set NOTION_API_KEY in .env.local\n');
      return;
    }

    console.log(`✅ Found ${response.results.length} accessible pages:\n`);

    for (const page of response.results) {
      const title = getPageTitle(page);
      const type = page.parent.type;
      const lastEdited = new Date(page.last_edited_time).toLocaleDateString();

      console.log(`📄 ${title}`);
      console.log(`   Type: ${type === 'database_id' ? 'Database item' : 'Page'}`);
      console.log(`   Last edited: ${lastEdited}`);
      console.log(`   URL: ${page.url}`);
      console.log(`   ID: ${page.id}\n`);
    }

    // Test 2: List databases
    console.log('\n📊 Searching for accessible databases...\n');

    const dbResponse = await notion.search({
      filter: {
        property: 'object',
        value: 'database',
      },
      page_size: 20,
    });

    if (dbResponse.results.length > 0) {
      console.log(`✅ Found ${dbResponse.results.length} accessible databases:\n`);

      for (const db of dbResponse.results) {
        const title = getDatabaseTitle(db);
        const lastEdited = new Date(db.last_edited_time).toLocaleDateString();

        console.log(`📊 ${title}`);
        console.log(`   Last edited: ${lastEdited}`);
        console.log(`   URL: ${db.url}`);
        console.log(`   ID: ${db.id}`);

        // Show properties
        if (db.properties) {
          console.log(`   Properties:`);
          Object.entries(db.properties).forEach(([name, prop]) => {
            console.log(`      - ${name} (${prop.type})`);
          });
        }
        console.log('');
      }
    } else {
      console.log('ℹ️  No databases found (or none shared with integration)\n');
    }

    // Test 3: Sample page content
    if (response.results.length > 0) {
      console.log('\n📖 Sample page content (first page)...\n');
      const firstPage = response.results[0];

      try {
        const blocks = await notion.blocks.children.list({
          block_id: firstPage.id,
          page_size: 5,
        });

        console.log(`Content preview of "${getPageTitle(firstPage)}":\n`);

        if (blocks.results.length === 0) {
          console.log('   (Empty page)\n');
        } else {
          blocks.results.forEach((block, i) => {
            const text = getBlockText(block);
            if (text) {
              console.log(`   ${i + 1}. [${block.type}] ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
            }
          });
          console.log('');
        }
      } catch (error) {
        console.log(`   ⚠️  Couldn't fetch page content: ${error.message}\n`);
      }
    }

    console.log('\n✅ Connection test complete!');
    console.log('\nNext steps:');
    console.log('1. Review the pages above - these are what the scanner can access');
    console.log('2. Share more Notion pages with your integration if needed');
    console.log('3. Run the scanner: npm run dev → http://localhost:3999/admin/wiki-scanner');

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);

    if (error.code === 'unauthorized') {
      console.log('\nTroubleshooting:');
      console.log('1. Check NOTION_API_KEY is set correctly in .env.local');
      console.log('2. Verify the API key starts with "secret_"');
      console.log('3. Make sure the integration has Read content permission');
    }
  }
}

function getPageTitle(page) {
  try {
    const properties = page.properties;
    const titleProp = Object.values(properties).find(
      (prop) => prop.type === 'title'
    );

    if (!titleProp?.title?.[0]?.plain_text) {
      return 'Untitled';
    }

    return titleProp.title[0].plain_text;
  } catch (error) {
    return 'Untitled';
  }
}

function getDatabaseTitle(db) {
  try {
    if (!db.title?.[0]?.plain_text) {
      return 'Untitled Database';
    }
    return db.title[0].plain_text;
  } catch (error) {
    return 'Untitled Database';
  }
}

function getBlockText(block) {
  try {
    const type = block.type;
    const content = block[type];

    if (!content?.rich_text) {
      return '';
    }

    return content.rich_text.map(t => t.plain_text).join('');
  } catch (error) {
    return '';
  }
}

testConnection();
