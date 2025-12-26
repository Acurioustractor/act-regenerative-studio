#!/usr/bin/env node

/**
 * Bulk set LCAA Phase to "Action" for all items in GitHub Project
 * This is a one-time operation to initialize the LCAA Phase field
 */

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getLCAAPhaseField() {
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
  const field = result.node.fields.nodes.find(f => f.name === 'LCAA Phase');

  if (!field) {
    throw new Error('LCAA Phase field not found in project');
  }

  return field;
}

async function getAllProjectItems() {
  const query = `
    query($projectId: ID!, $cursor: String) {
      node(id: $projectId) {
        ... on ProjectV2 {
          items(first: 100, after: $cursor) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              content {
                ... on Issue {
                  number
                  title
                  repository {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  let allItems = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const result = await octokit.graphql(query, {
      projectId: PROJECT_ID,
      cursor
    });

    const items = result.node.items.nodes;
    allItems = allItems.concat(items);

    hasNextPage = result.node.items.pageInfo.hasNextPage;
    cursor = result.node.items.pageInfo.endCursor;
  }

  return allItems;
}

async function setLCAAPhase(itemId, fieldId, optionId) {
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
  console.log('⚡ Bulk Set LCAA Phase to "Action"');
  console.log('='.repeat(50));
  console.log('');
  console.log('This will set LCAA Phase = "Action" for ALL items in the project.');
  console.log('');

  // Get LCAA Phase field configuration
  console.log('📊 Fetching LCAA Phase field...');
  const lcaaField = await getLCAAPhaseField();
  const actionOption = lcaaField.options.find(o => o.name === 'Action');

  if (!actionOption) {
    console.error('❌ Error: "Action" option not found in LCAA Phase field');
    console.log('Available options:', lcaaField.options.map(o => o.name).join(', '));
    process.exit(1);
  }

  console.log(`✅ Found LCAA Phase field`);
  console.log(`   Options: ${lcaaField.options.map(o => o.name).join(', ')}`);
  console.log(`   Will set to: Action (${actionOption.id})`);
  console.log('');

  // Get all project items
  console.log('📦 Fetching all project items...');
  const items = await getAllProjectItems();
  console.log(`✅ Found ${items.length} items in project`);
  console.log('');

  // Update each item
  let updated = 0;
  let errors = 0;

  console.log('⚡ Setting LCAA Phase to "Action" for all items...');
  console.log('');

  for (const item of items) {
    if (!item.content) {
      continue; // Skip items without content
    }

    const issueNumber = item.content.number;
    const issueTitle = item.content.title?.substring(0, 50) || 'Untitled';
    const repoName = item.content.repository?.name || 'Unknown';

    try {
      await setLCAAPhase(item.id, lcaaField.id, actionOption.id);
      updated++;
      console.log(`✅ ${repoName}#${issueNumber}: ${issueTitle}`);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      errors++;
      console.error(`❌ ${repoName}#${issueNumber}: ${error.message}`);
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Summary:');
  console.log(`  Total items: ${items.length}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Errors: ${errors}`);
  console.log('');
  console.log('✅ Bulk update complete!');
  console.log('');
  console.log('View project: https://github.com/users/Acurioustractor/projects/1');
  console.log('');
  console.log('Next: Manually adjust any items that should be Listen, Curiosity, or Art');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
