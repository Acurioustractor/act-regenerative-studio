#!/usr/bin/env node

/**
 * Test Notion Database Access
 * Tests access to specific databases using database IDs
 */

import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({
  auth: process.env.NOTION_API_KEY || process.env.NOTION_TOKEN,
});

const databases = {
  projects: process.env.NOTION_PROJECTS_DATABASE_ID,
  actions: process.env.NOTION_ACTIONS_DATABASE_ID,
  people: process.env.NOTION_PEOPLE_DATABASE_ID,
  organizations: process.env.NOTION_ORGANIZATIONS_DATABASE_ID,
};

console.log('🔍 Testing Notion Database Access...\n');
console.log(`Using token: ${(process.env.NOTION_API_KEY || process.env.NOTION_TOKEN)?.substring(0, 10)}...\n`);

async function testDatabase(name, databaseId) {
  if (!databaseId) {
    console.log(`⏭️  Skipping ${name} - no database ID\n`);
    return;
  }

  console.log(`📊 Testing ${name} database (${databaseId})...`);

  try {
    // Get database info
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    console.log(`✅ ${name} database accessible!`);
    console.log(`   Title: ${database.title?.[0]?.plain_text || 'Untitled'}`);
    console.log(`   URL: ${database.url}`);
    console.log(`   Properties:`);

    if (database.properties) {
      Object.entries(database.properties).forEach(([propName, prop]) => {
        console.log(`      - ${propName} (${prop.type})`);
      });
    }

    // Query database for pages
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 5,
    });

    console.log(`   Pages found: ${response.results.length}`);

    if (response.results.length > 0) {
      console.log(`   Sample pages:`);
      response.results.forEach((page, i) => {
        const title = getPageTitle(page);
        console.log(`      ${i + 1}. ${title}`);
      });
    }

    console.log('');
    return true;
  } catch (error) {
    console.log(`❌ Failed to access ${name} database`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code}\n`);
    return false;
  }
}

function getPageTitle(page) {
  try {
    const properties = page.properties;

    // Try to find title property
    const titleProp = Object.values(properties).find(
      (prop) => prop.type === 'title'
    );

    if (!titleProp?.title?.[0]?.plain_text) {
      // Try Name property
      const nameProp = properties.Name || properties.name;
      if (nameProp?.title?.[0]?.plain_text) {
        return nameProp.title[0].plain_text;
      }
      return 'Untitled';
    }

    return titleProp.title[0].plain_text;
  } catch (error) {
    return 'Untitled';
  }
}

async function main() {
  const results = {};

  for (const [name, databaseId] of Object.entries(databases)) {
    results[name] = await testDatabase(name, databaseId);
  }

  console.log('\n📊 Summary:');
  console.log('─'.repeat(50));

  const accessible = Object.entries(results).filter(([_, success]) => success);
  const total = Object.keys(results).length;

  console.log(`Accessible databases: ${accessible.length}/${total}`);

  if (accessible.length > 0) {
    console.log('\n✅ You have access to:');
    accessible.forEach(([name]) => {
      console.log(`   - ${name}`);
    });

    console.log('\n🎉 Great! The Notion integration is working.');
    console.log('\nNext steps:');
    console.log('1. Start dev server: npm run dev');
    console.log('2. Open admin: http://localhost:3999/admin/wiki-scanner');
    console.log('3. Click "Scan Notion Now"');
  } else {
    console.log('\n⚠️  No databases accessible.');
    console.log('\nTroubleshooting:');
    console.log('1. Check if NOTION_API_KEY or NOTION_TOKEN is valid');
    console.log('2. Verify database IDs are correct');
    console.log('3. Make sure integration has access to these databases');
    console.log('\nTo get a new API key:');
    console.log('https://www.notion.so/my-integrations');
  }
}

main();
