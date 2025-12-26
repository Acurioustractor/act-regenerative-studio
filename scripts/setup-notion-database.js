#!/usr/bin/env node

/**
 * Setup Notion Database for GitHub Issues
 *
 * Creates a new Notion database with all required properties
 * for syncing with GitHub Issues and Projects
 */

const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function createIssuesDatabase() {
  console.log('🏗️  Creating Notion database for GitHub Issues...\n');

  try {
    // You need to provide a parent page ID where the database will be created
    // Get this from your Notion workspace URL
    const parentPageId = process.env.NOTION_PARENT_PAGE_ID;

    if (!parentPageId) {
      console.error('❌ Error: NOTION_PARENT_PAGE_ID not set');
      console.log('\nTo get your parent page ID:');
      console.log('1. Open Notion in browser');
      console.log('2. Create or open a page where you want the database');
      console.log('3. Copy the page URL: https://notion.so/workspace/PAGE_ID?v=...');
      console.log('4. Extract PAGE_ID from URL');
      console.log('5. Run: export NOTION_PARENT_PAGE_ID=PAGE_ID');
      console.log('6. Run this script again\n');
      process.exit(1);
    }

    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: parentPageId,
      },
      title: [
        {
          type: 'text',
          text: {
            content: 'ACT Development Issues',
          },
        },
      ],
      properties: {
        // Title (required)
        'Title': {
          title: {},
        },

        // Status (Kanban columns)
        'Status': {
          select: {
            options: [
              { name: '📋 Todo', color: 'gray' },
              { name: '⏳ In Progress', color: 'blue' },
              { name: '✅ Done', color: 'green' },
              { name: '🚫 Blocked', color: 'red' },
            ],
          },
        },

        // Priority
        'Priority': {
          select: {
            options: [
              { name: '🔴 Critical', color: 'red' },
              { name: '🟠 High', color: 'orange' },
              { name: '🟡 Medium', color: 'yellow' },
              { name: '🟢 Low', color: 'green' },
            ],
          },
        },

        // Type
        'Type': {
          select: {
            options: [
              { name: 'Security', color: 'red' },
              { name: 'Bug', color: 'red' },
              { name: 'Feature', color: 'purple' },
              { name: 'Enhancement', color: 'blue' },
              { name: 'Data', color: 'yellow' },
              { name: 'Integration', color: 'orange' },
              { name: 'UX/UI', color: 'pink' },
              { name: 'Configuration', color: 'gray' },
              { name: 'Research', color: 'brown' },
              { name: 'Documentation', color: 'green' },
              { name: 'Testing', color: 'blue' },
              { name: 'Cleanup', color: 'gray' },
            ],
          },
        },

        // ACT Project
        'ACT Project': {
          select: {
            options: [
              { name: 'ACT Main', color: 'blue' },
              { name: 'Empathy Ledger', color: 'purple' },
              { name: 'JusticeHub', color: 'orange' },
              { name: 'The Harvest', color: 'green' },
              { name: 'Goods', color: 'yellow' },
              { name: 'ACT Farm', color: 'brown' },
            ],
          },
        },

        // Milestone
        'Milestone': {
          select: {
            options: [
              { name: 'Security Hardening', color: 'red' },
              { name: 'Data Architecture Complete', color: 'yellow' },
              { name: 'Empathy Ledger Core', color: 'purple' },
              { name: 'Goods Asset Register MVP', color: 'yellow' },
              { name: 'Integration Platform', color: 'orange' },
              { name: 'JusticeHub Alpha', color: 'orange' },
              { name: 'Testing & Quality', color: 'blue' },
              { name: 'The Harvest Website', color: 'green' },
            ],
          },
        },

        // Sprint
        'Sprint': {
          select: {
            options: [
              { name: 'Backlog', color: 'gray' },
              { name: 'Sprint 4', color: 'blue' },
              { name: 'Sprint 5', color: 'blue' },
              { name: 'Sprint 6', color: 'blue' },
              { name: 'Sprint 7', color: 'blue' },
            ],
          },
        },

        // Assignee
        'Assignee': {
          people: {},
        },

        // Due Date
        'Due Date': {
          date: {},
        },

        // Start Date
        'Start Date': {
          date: {},
        },

        // Effort estimate
        'Effort': {
          select: {
            options: [
              { name: '30m', color: 'green' },
              { name: '1h', color: 'green' },
              { name: '2h', color: 'blue' },
              { name: '4h', color: 'blue' },
              { name: '1d', color: 'yellow' },
              { name: '2d', color: 'orange' },
              { name: '1w', color: 'red' },
            ],
          },
        },

        // LCAA Phase
        'LCAA Phase': {
          select: {
            options: [
              { name: 'Listen', color: 'blue' },
              { name: 'Curiosity', color: 'yellow' },
              { name: 'Action', color: 'orange' },
              { name: 'Art', color: 'purple' },
            ],
          },
        },

        // GitHub Issue Number
        'GitHub Issue #': {
          number: {},
        },

        // GitHub URL
        'GitHub URL': {
          url: {},
        },

        // Repository
        'Repository': {
          select: {
            options: [
              { name: 'act-regenerative-studio', color: 'blue' },
              { name: 'empathy-ledger-v2', color: 'purple' },
              { name: 'justicehub-platform', color: 'orange' },
              { name: 'harvest-community-hub', color: 'green' },
              { name: 'goods-asset-tracker', color: 'yellow' },
              { name: 'act-farm', color: 'brown' },
            ],
          },
        },

        // Description (from GitHub issue body)
        'Description': {
          rich_text: {},
        },

        // Last Synced
        'Last Synced': {
          date: {},
        },
      },
    });

    console.log('✅ Database created successfully!\n');
    console.log('📋 Database Details:');
    console.log(`   ID: ${database.id}`);
    console.log(`   URL: https://notion.so/${database.id.replace(/-/g, '')}`);
    console.log('\n💾 Add this to your .env.local:');
    console.log(`   NOTION_ISSUES_DATABASE_ID=${database.id}`);
    console.log('\n🎯 Next steps:');
    console.log('   1. Open the database in Notion');
    console.log('   2. Create these views:');
    console.log('      - Kanban (group by Status)');
    console.log('      - Sprint Board (filter by Sprint, group by Status)');
    console.log('      - Timeline (calendar by Due Date)');
    console.log('      - My Tasks (filter by Assignee)');
    console.log('   3. Run sync script to import GitHub issues');
    console.log('\n');

    return database.id;
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    if (error.code === 'object_not_found') {
      console.error('\nThe parent page ID is invalid or you don\'t have access to it.');
      console.error('Make sure:');
      console.error('1. The page exists in your Notion workspace');
      console.error('2. Your integration has access to the page');
      console.error('3. You\'ve shared the page with your integration');
    }
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createIssuesDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { createIssuesDatabase };
