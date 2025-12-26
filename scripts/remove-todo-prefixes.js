#!/usr/bin/env node

/**
 * Remove [TODO]: prefix from all issue titles
 *
 * Changes:
 * "[TODO]: Fix the bug" → "Fix the bug"
 * "[TODO]: Implement feature" → "Implement feature"
 */

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const OWNER = 'Acurioustractor';

const REPOS = [
  'goods-asset-tracker',
  'empathy-ledger-v2',
  'justicehub-platform',
  'the-harvest-website',
  'act-farm',
  'act-placemat',
  'act-regenerative-studio',
  'act-project-template'
];

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function cleanTitle(title) {
  // Remove [TODO]: prefix (case-insensitive)
  const cleaned = title.replace(/^\[TODO\]:\s*/i, '');

  // Capitalize first letter if needed
  if (cleaned.length > 0 && cleaned[0] === cleaned[0].toLowerCase()) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

async function processRepo(repo) {
  console.log('');
  console.log(`📦 Processing: ${repo}`);

  try {
    // Get all open issues
    const { data: issues } = await octokit.issues.listForRepo({
      owner: OWNER,
      repo: repo,
      state: 'open',
      per_page: 100
    });

    const issuesOnly = issues.filter(i => !i.pull_request);

    if (issuesOnly.length === 0) {
      console.log('   No open issues found.');
      return { processed: 0, cleaned: 0, skipped: 0 };
    }

    let cleaned = 0;
    let skipped = 0;

    for (const issue of issuesOnly) {
      const originalTitle = issue.title;
      const newTitle = await cleanTitle(originalTitle);

      if (originalTitle === newTitle) {
        skipped++;
        continue; // No change needed
      }

      console.log(`   #${issue.number}:`);
      console.log(`      Before: ${originalTitle}`);
      console.log(`      After:  ${newTitle}`);

      try {
        await octokit.issues.update({
          owner: OWNER,
          repo: repo,
          issue_number: issue.number,
          title: newTitle
        });

        console.log(`      ✅ Updated`);
        cleaned++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`      ❌ Error: ${error.message}`);
      }
    }

    return { processed: issuesOnly.length, cleaned, skipped };

  } catch (error) {
    console.error(`   ❌ Error fetching issues: ${error.message}`);
    return { processed: 0, cleaned: 0, skipped: 0 };
  }
}

async function main() {
  console.log('🧹 Remove [TODO]: Prefixes from Issue Titles');
  console.log('='.repeat(50));
  console.log('');
  console.log('This will clean up issue titles by removing [TODO]: prefix.');
  console.log('');

  let totalProcessed = 0;
  let totalCleaned = 0;
  let totalSkipped = 0;

  for (const repo of REPOS) {
    const result = await processRepo(repo);
    totalProcessed += result.processed;
    totalCleaned += result.cleaned;
    totalSkipped += result.skipped;
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Summary:');
  console.log(`  Total issues processed: ${totalProcessed}`);
  console.log(`  Titles cleaned: ${totalCleaned}`);
  console.log(`  Already clean: ${totalSkipped}`);
  console.log('');
  console.log('✅ Cleanup complete!');
  console.log('');
  console.log('View project: https://github.com/users/Acurioustractor/projects/1');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
