/**
 * Simple Notion test - just check what's available
 */

import pkg from '@notionhq/client';
const { Client } = pkg;
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

console.log('Client created:', typeof notion);
console.log('Top-level properties:', Object.keys(notion));
console.log('\nDatabases namespace:', notion.databases ? 'EXISTS' : 'MISSING');
if (notion.databases) {
  console.log('Databases methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(notion.databases)));
}

console.log('\nPages namespace:', notion.pages ? 'EXISTS' : 'MISSING');
if (notion.pages) {
  console.log('Pages methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(notion.pages)));
}

// Try to query
const dbId = process.env.NOTION_PROJECTS_DATABASE_ID;
console.log(`\nAttempting to query database: ${dbId}`);

try {
  const response = await notion.databases.query({
    database_id: dbId,
    page_size: 1,
  });
  console.log('✅ Success! Results:', response.results.length);
} catch (error) {
  console.error('❌ Error:', error.message);
}
