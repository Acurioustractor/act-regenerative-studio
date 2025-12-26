#!/usr/bin/env node

/**
 * Bulk add all existing issues to GitHub Project
 * Sets ACT Project field based on repository
 */

const { Octokit } = require('@octokit/rest');
const readline = require('readline');

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';
const OWNER = 'Acurioustractor';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  console.error('Run: export GITHUB_TOKEN=ghp_...');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Repository mappings
const REPO_TO_PROJECT = {
  'goods-asset-tracker': 'Goods',
  'empathy-ledger-v2': 'Empathy Ledger',
  'justicehub-platform': 'JusticeHub',
  'the-harvest-website': 'The Harvest',
  'act-farm': 'ACT Farm',
  'act-placemat': 'ACT Placemat',
  'act-regenerative-studio': 'ACT Main',
  'act-project-template': 'Cross-Project'
};

const REPOS = Object.keys(REPO_TO_PROJECT);

async function confirm(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function getACTProjectField() {
  const query = `
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          fields(first: 20) {
            nodes {
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const result = await octokit.graphql(query, { projectId: PROJECT_ID });
  const field = result.node.fields.nodes.find(f => f.name === 'ACT Project');

  if (!field) {
    throw new Error('ACT Project field not found in project');
  }

  return field;
}

async function getAllOpenIssues(repo) {
  try {
    const { data } = await octokit.issues.listForRepo({
      owner: OWNER,
      repo: repo,
      state: 'open',
      per_page: 100
    });
    return data.filter(issue => !issue.pull_request); // Exclude PRs
  } catch (error) {
    console.error(`   ❌ Error fetching issues: ${error.message}`);
    return [];
  }
}

async function addIssueToProject(issueNodeId) {
  const mutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {
        projectId: $projectId
        contentId: $contentId
      }) {
        item {
          id
        }
      }
    }
  `;

  try {
    const result = await octokit.graphql(mutation, {
      projectId: PROJECT_ID,
      contentId: issueNodeId
    });
    return result.addProjectV2ItemById.item.id;
  } catch (error) {
    if (error.message.includes('already exists')) {
      return null; // Already in project
    }
    throw error;
  }
}

async function setACTProjectField(itemId, fieldId, optionId) {
  const mutation = `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { singleSelectOptionId: $optionId }
      }) {
        projectV2Item {
          id
        }
      }
    }
  `;

  await octokit.graphql(mutation, {
    projectId: PROJECT_ID,
    itemId,
    fieldId,
    optionId
  });
}

async function main() {
  console.log('🏷️  ACT Ecosystem - Bulk Add Issues to Project');
  console.log('='.repeat(50));
  console.log('');
  console.log('This will:');
  console.log('  1. Find all open issues across ACT repositories');
  console.log('  2. Add them to GitHub Project');
  console.log('  3. Set ACT Project field based on repository');
  console.log('');

  const shouldContinue = await confirm('Continue?');
  if (!shouldContinue) {
    console.log('Cancelled.');
    return;
  }

  console.log('');
  console.log('📊 Fetching ACT Project field configuration...');
  const actProjectField = await getACTProjectField();
  console.log(`✅ Found field: ${actProjectField.name}`);
  console.log(`   Options: ${actProjectField.options.map(o => o.name).join(', ')}`);
  console.log('');

  let totalIssues = 0;
  let addedToProject = 0;
  let fieldsSet = 0;
  let alreadyInProject = 0;
  let errors = 0;

  for (const repo of REPOS) {
    const actProjectValue = REPO_TO_PROJECT[repo];
    console.log('');
    console.log(`📦 Processing: ${repo}`);
    console.log(`   ACT Project: ${actProjectValue}`);

    // Find the option ID for this ACT Project value
    const option = actProjectField.options.find(o => o.name === actProjectValue);
    if (!option) {
      console.log(`   ⚠️  Warning: No option found for "${actProjectValue}"`);
      continue;
    }

    // Get all open issues
    const issues = await getAllOpenIssues(repo);
    console.log(`   Found ${issues.length} open issues`);

    for (const issue of issues) {
      totalIssues++;
      console.log(`   #${issue.number}: ${issue.title.substring(0, 50)}...`);

      try {
        // Add to project
        const itemId = await addIssueToProject(issue.node_id);

        if (itemId) {
          addedToProject++;
          console.log(`      ✅ Added to project`);

          // Set ACT Project field
          await setACTProjectField(itemId, actProjectField.id, option.id);
          fieldsSet++;
          console.log(`      ✅ ACT Project set to: ${actProjectValue}`);
        } else {
          alreadyInProject++;
          console.log(`      ℹ️  Already in project`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        errors++;
        console.error(`      ❌ Error: ${error.message}`);
      }
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Summary:');
  console.log(`  Total issues found: ${totalIssues}`);
  console.log(`  Added to project: ${addedToProject}`);
  console.log(`  Already in project: ${alreadyInProject}`);
  console.log(`  Fields set: ${fieldsSet}`);
  console.log(`  Errors: ${errors}`);
  console.log('');
  console.log('✅ Backfill complete!');
  console.log('');
  console.log('View project: https://github.com/users/Acurioustractor/projects/1');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
