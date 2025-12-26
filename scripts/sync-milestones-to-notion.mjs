#!/usr/bin/env node

/**
 * Milestone Sync Script
 *
 * Fetches all milestones from 6 GitHub repositories and syncs to
 * Notion Milestone Roadmap database.
 *
 * Run every 6 hours via GitHub Action or manually
 */

import { Client } from '@notionhq/client';
import { Octokit } from '@octokit/rest';

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = 'Acurioustractor';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_MILESTONE_ROADMAP_ID = process.env.NOTION_MILESTONE_ROADMAP_ID;

// Repositories to scan
const REPOSITORIES = [
  { name: 'empathy-ledger-v2', displayName: 'Empathy Ledger' },
  { name: 'justicehub-platform', displayName: 'JusticeHub' },
  { name: 'harvest-community-hub', displayName: 'The Harvest' },
  { name: 'act-farm', displayName: 'ACT Farm' },
  { name: 'goods-asset-tracker', displayName: 'Goods' },
  { name: 'act-regenerative-studio', displayName: 'ACT Studio' },
];

// Initialize clients
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const notion = NOTION_TOKEN ? new Client({ auth: NOTION_TOKEN }) : null;

console.log('🚀 Milestone Sync Script Starting...');
console.log(`📚 Scanning ${REPOSITORIES.length} repositories`);

/**
 * Fetch all milestones from a repository
 */
async function fetchMilestonesForRepo(owner, repo) {
  try {
    const { data: milestones } = await octokit.rest.issues.listMilestones({
      owner,
      repo,
      state: 'all', // Include open and closed
      per_page: 100,
    });

    console.log(`  ✅ ${repo}: ${milestones.length} milestones`);
    return milestones.map(m => ({
      ...m,
      repository: repo,
    }));
  } catch (error) {
    console.error(`  ❌ ${repo}: ${error.message}`);
    return [];
  }
}

/**
 * Fetch milestones from all repositories
 */
async function fetchAllMilestones() {
  console.log('\n📥 Fetching milestones from all repositories...');

  const allMilestones = [];

  for (const repo of REPOSITORIES) {
    const milestones = await fetchMilestonesForRepo(GITHUB_ORG, repo.name);
    allMilestones.push(...milestones.map(m => ({
      ...m,
      repositoryDisplayName: repo.displayName,
    })));
  }

  console.log(`\n✅ Total milestones fetched: ${allMilestones.length}`);
  return allMilestones;
}

/**
 * Calculate milestone progress
 */
function calculateProgress(milestone) {
  const total = milestone.open_issues + milestone.closed_issues;
  const completed = milestone.closed_issues;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    open: milestone.open_issues,
    progress,
  };
}

/**
 * Determine milestone status
 */
function determineMilestoneStatus(milestone) {
  if (milestone.state === 'closed') {
    return 'Done';
  }

  const { total, completed } = calculateProgress(milestone);

  if (total === 0) {
    return 'Planned';
  }

  if (completed > 0) {
    return 'In Progress';
  }

  return 'Planned';
}

/**
 * Sync milestone to Notion
 */
async function syncMilestoneToNotion(milestone) {
  if (!notion || !NOTION_MILESTONE_ROADMAP_ID) {
    return null;
  }

  const progress = calculateProgress(milestone);
  const status = determineMilestoneStatus(milestone);
  const now = new Date().toISOString();

  // Search for existing milestone page
  const existingPages = await notion.databases.query({
    database_id: NOTION_MILESTONE_ROADMAP_ID,
    filter: {
      and: [
        {
          property: 'Milestone',
          title: {
            equals: milestone.title,
          },
        },
        {
          property: 'Repository',
          select: {
            equals: milestone.repository,
          },
        },
      ],
    },
  });

  const pageProperties = {
    'Milestone': {
      title: [{ text: { content: milestone.title } }],
    },
    'Repository': {
      select: { name: milestone.repository },
    },
    'Description': {
      rich_text: milestone.description
        ? [{ text: { content: milestone.description.substring(0, 2000) } }]
        : [],
    },
    'Due Date': milestone.due_on
      ? { date: { start: milestone.due_on.split('T')[0] } }
      : null,
    'Status': {
      select: { name: status },
    },
    'Last Synced': {
      date: { start: now.split('T')[0] },
    },
  };

  // Remove null properties
  Object.keys(pageProperties).forEach(key => {
    if (pageProperties[key] === null) {
      delete pageProperties[key];
    }
  });

  try {
    if (existingPages.results.length > 0) {
      // Update existing page
      const pageId = existingPages.results[0].id;
      await notion.pages.update({
        page_id: pageId,
        properties: pageProperties,
      });
      return { action: 'updated', milestone: milestone.title };
    } else {
      // Create new page
      await notion.pages.create({
        parent: { database_id: NOTION_MILESTONE_ROADMAP_ID },
        properties: pageProperties,
      });
      return { action: 'created', milestone: milestone.title };
    }
  } catch (error) {
    console.error(`  ❌ Error syncing "${milestone.title}":`, error.message);
    return { action: 'error', milestone: milestone.title, error: error.message };
  }
}

/**
 * Sync all milestones to Notion
 */
async function syncAllMilestonesToNotion(milestones) {
  if (!notion || !NOTION_MILESTONE_ROADMAP_ID) {
    console.log('\n⚠️  Notion not configured, skipping...');
    return [];
  }

  console.log('\n📝 Syncing milestones to Notion...');

  const results = [];

  for (const milestone of milestones) {
    const result = await syncMilestoneToNotion(milestone);
    if (result) {
      results.push(result);
      const symbol = result.action === 'created' ? '➕' : result.action === 'updated' ? '🔄' : '❌';
      console.log(`  ${symbol} ${result.milestone} (${result.action})`);
    }
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  try {
    // 1. Fetch all milestones
    const milestones = await fetchAllMilestones();

    if (milestones.length === 0) {
      console.log('\n⚠️  No milestones found across all repositories');
      process.exit(0);
    }

    // 2. Sync to Notion
    const results = await syncAllMilestonesToNotion(milestones);

    // 3. Summary
    const created = results.filter(r => r.action === 'created').length;
    const updated = results.filter(r => r.action === 'updated').length;
    const errors = results.filter(r => r.action === 'error').length;

    console.log('\n✨ Milestone Sync Complete!');
    console.log(`   Total Milestones: ${milestones.length}`);
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);

    // List milestones by repository
    console.log('\n📊 Milestones by Repository:');
    const byRepo = {};
    milestones.forEach(m => {
      const repo = m.repositoryDisplayName;
      byRepo[repo] = (byRepo[repo] || 0) + 1;
    });
    Object.entries(byRepo).forEach(([repo, count]) => {
      console.log(`   ${repo}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
