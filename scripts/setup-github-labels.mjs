#!/usr/bin/env node

/**
 * Setup GitHub Labels - ACT Ecosystem
 *
 * Applies consistent label taxonomy across all core ACT repositories.
 * Run this script to set up or update labels in all repos.
 *
 * Usage:
 *   node scripts/setup-github-labels.mjs
 *
 * Requires:
 *   - GitHub CLI (gh) authenticated
 *   - Or GITHUB_TOKEN environment variable
 */

import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

const ORG = 'Acurioustractor';

// Core ACT repositories
const REPOS = [
  'act-regenerative-studio',
  'empathy-ledger-v2',
  'justicehub-platform',
  'theharvest',
  'act-farm',
  'act-placemat',
  'goods-asset-tracker',
];

// Label taxonomy
const LABELS = {
  // Priority (Red scale)
  priority: [
    { name: 'priority: critical', color: 'b60205', description: 'Blocking production' },
    { name: 'priority: high', color: 'd93f0b', description: 'Important, do soon' },
    { name: 'priority: medium', color: 'fbca04', description: 'Normal priority' },
    { name: 'priority: low', color: '0e8a16', description: 'Nice to have' },
  ],

  // Type (Blue scale)
  type: [
    { name: 'type: bug', color: 'd73a4a', description: 'Something broken' },
    { name: 'type: feature', color: '0075ca', description: 'New capability' },
    { name: 'type: docs', color: '5319e7', description: 'Documentation' },
    { name: 'type: refactor', color: '7057ff', description: 'Code improvement' },
    { name: 'type: test', color: '1d76db', description: 'Testing' },
    { name: 'type: chore', color: 'fef2c0', description: 'Maintenance' },
  ],

  // Project (Purple scale)
  project: [
    { name: 'project: empathy-ledger', color: '8b5cf6', description: 'Empathy Ledger' },
    { name: 'project: justicehub', color: '7c3aed', description: 'JusticeHub' },
    { name: 'project: harvest', color: '6d28d9', description: 'The Harvest' },
    { name: 'project: act-farm', color: '5b21b6', description: 'ACT Farm' },
    { name: 'project: act-main', color: '4c1d95', description: 'ACT Main Website' },
    { name: 'project: placemat', color: '3b0764', description: 'ACT Placemat' },
    { name: 'project: goods', color: '2e1065', description: 'Goods Asset Register' },
    { name: 'project: ecosystem', color: '1e1b4b', description: 'Cross-project work' },
  ],

  // Effort (Green scale)
  effort: [
    { name: 'effort: 1h', color: 'c2e0c6', description: '~1 hour' },
    { name: 'effort: 4h', color: '77dd77', description: '~4 hours (half day)' },
    { name: 'effort: 1d', color: '228b22', description: '~1 day' },
    { name: 'effort: 3d', color: '006400', description: '~3 days' },
    { name: 'effort: 1w', color: '013220', description: '~1 week' },
  ],

  // Status (Mixed colors)
  status: [
    { name: 'status: blocked', color: 'd93f0b', description: 'Blocked by dependency' },
    { name: 'status: needs-review', color: 'fbca04', description: 'Ready for review' },
    { name: 'status: in-progress', color: '0366d6', description: 'Currently working on' },
    { name: 'status: help-wanted', color: '008672', description: 'Need help/collaboration' },
  ],

  // LCAA Method (ACT Brand colors)
  lcaa: [
    { name: 'lcaa: listen', color: 'e99695', description: 'Deep listening phase' },
    { name: 'lcaa: curiosity', color: 'f9d0c4', description: 'Research & prototyping' },
    { name: 'lcaa: action', color: 'c2e0c6', description: 'Building tangible solutions' },
    { name: 'lcaa: art', color: 'bfdadc', description: 'Creative expression' },
  ],

  // Special
  special: [
    { name: 'good first issue', color: '7057ff', description: 'Good for newcomers' },
    { name: 'breaking-change', color: 'd73a4a', description: 'Breaking API/interface' },
    { name: 'needs-decision', color: 'fbca04', description: 'Awaiting decision' },
    { name: 'wontfix', color: 'ffffff', description: 'Will not be addressed' },
    { name: 'duplicate', color: 'cfd3d7', description: 'Duplicate issue' },
    { name: 'epic', color: '8b5cf6', description: 'Large multi-task initiative' },
  ],
};

// Get GitHub token
function getGitHubToken() {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  try {
    const token = execSync('gh auth token', { encoding: 'utf8' }).trim();
    return token;
  } catch (error) {
    console.error('❌ GitHub authentication failed');
    console.error('Please run: gh auth login');
    console.error('Or set GITHUB_TOKEN environment variable');
    process.exit(1);
  }
}

// Create or update label
async function upsertLabel(octokit, repo, label) {
  try {
    // Try to get existing label
    await octokit.issues.getLabel({
      owner: ORG,
      repo,
      name: label.name,
    });

    // Update existing label
    await octokit.issues.updateLabel({
      owner: ORG,
      repo,
      name: label.name,
      color: label.color,
      description: label.description,
    });

    return 'updated';
  } catch (error) {
    if (error.status === 404) {
      // Create new label
      await octokit.issues.createLabel({
        owner: ORG,
        repo,
        name: label.name,
        color: label.color,
        description: label.description,
      });

      return 'created';
    }

    throw error;
  }
}

// Main execution
async function main() {
  console.log('🏷️  ACT Label Taxonomy Setup');
  console.log('=============================\n');

  const token = getGitHubToken();
  const octokit = new Octokit({ auth: token });

  // Flatten all labels
  const allLabels = Object.values(LABELS).flat();

  console.log(`📋 Applying ${allLabels.length} labels to ${REPOS.length} repositories\n`);

  const results = {};

  for (const repo of REPOS) {
    console.log(`\n📦 ${repo}`);
    results[repo] = { created: 0, updated: 0, errors: 0 };

    for (const label of allLabels) {
      try {
        const action = await upsertLabel(octokit, repo, label);

        if (action === 'created') {
          results[repo].created++;
          console.log(`  ✅ Created: ${label.name}`);
        } else {
          results[repo].updated++;
          console.log(`  ♻️  Updated: ${label.name}`);
        }

        // Rate limiting: pause between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results[repo].errors++;
        console.error(`  ❌ Error with ${label.name}: ${error.message}`);
      }
    }

    const { created, updated, errors } = results[repo];
    console.log(`  📊 ${created} created, ${updated} updated, ${errors} errors`);
  }

  // Summary
  console.log('\n=============================');
  console.log('📈 Summary\n');

  const totalCreated = Object.values(results).reduce((sum, r) => sum + r.created, 0);
  const totalUpdated = Object.values(results).reduce((sum, r) => sum + r.updated, 0);
  const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0);

  console.log(`✅ Labels created: ${totalCreated}`);
  console.log(`♻️  Labels updated: ${totalUpdated}`);
  if (totalErrors > 0) {
    console.log(`❌ Errors: ${totalErrors}`);
  }

  console.log('\n🎉 Label taxonomy setup complete!');
  console.log('\nLabel categories applied:');
  Object.keys(LABELS).forEach(category => {
    console.log(`  • ${category}: ${LABELS[category].length} labels`);
  });
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
