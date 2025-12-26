#!/usr/bin/env node

/**
 * Bulk assign Sprint field based on Priority
 *
 * Strategy:
 * - Priority: Critical → Sprint 4 (current sprint)
 * - Priority: High → Sprint 4 (current sprint)
 * - Priority: Medium → Sprint 5 (next sprint)
 * - Priority: Low → Backlog
 * - No priority → Backlog
 */

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';

// Configure sprint names here
const CURRENT_SPRINT = 'Sprint 4';
const NEXT_SPRINT = 'Sprint 5';
const BACKLOG = 'Backlog';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getProjectFields() {
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
              ... on ProjectV2Field {
                id
                name
                dataType
              }
            }
          }
        }
      }
    }
  `;

  const result = await octokit.graphql(query, { projectId: PROJECT_ID });
  const fields = {};

  result.node.fields.nodes.forEach(field => {
    if (field.name === 'Priority' || field.name === 'Sprint') {
      fields[field.name] = field;
    }
  });

  return fields;
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
              fieldValues(first: 20) {
                nodes {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    field {
                      ... on ProjectV2SingleSelectField {
                        name
                      }
                    }
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

async function setSprintField(itemId, fieldId, sprintValue) {
  const mutation = `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { text: $value }
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
    value: sprintValue
  });
}

function getPriorityFromItem(item) {
  const priorityField = item.fieldValues.nodes.find(
    fv => fv.field && fv.field.name === 'Priority'
  );
  return priorityField ? priorityField.name : null;
}

function getSprintFromPriority(priority) {
  if (!priority) return BACKLOG;

  switch (priority.toLowerCase()) {
    case 'critical':
      return CURRENT_SPRINT;
    case 'high':
      return CURRENT_SPRINT;
    case 'medium':
      return NEXT_SPRINT;
    case 'low':
      return BACKLOG;
    default:
      return BACKLOG;
  }
}

async function main() {
  console.log('🏃 Bulk Assign Sprints Based on Priority');
  console.log('='.repeat(50));
  console.log('');
  console.log('Sprint Assignment Strategy:');
  console.log(`  Critical/High → ${CURRENT_SPRINT}`);
  console.log(`  Medium        → ${NEXT_SPRINT}`);
  console.log(`  Low/None      → ${BACKLOG}`);
  console.log('');

  // Get fields
  console.log('📊 Fetching project fields...');
  const fields = await getProjectFields();

  if (!fields.Priority || !fields.Sprint) {
    console.error('❌ Error: Priority or Sprint field not found');
    process.exit(1);
  }

  console.log('✅ Found Priority field');
  console.log('✅ Found Sprint field');
  console.log('');

  // Get all items
  console.log('📦 Fetching all project items...');
  const items = await getAllProjectItems();
  console.log(`✅ Found ${items.length} items`);
  console.log('');

  // Assign sprints
  console.log('🏃 Assigning sprints...');
  console.log('');

  const stats = {
    [CURRENT_SPRINT]: 0,
    [NEXT_SPRINT]: 0,
    [BACKLOG]: 0,
    errors: 0
  };

  for (const item of items) {
    if (!item.content) {
      continue;
    }

    const issueNumber = item.content.number;
    const issueTitle = item.content.title?.substring(0, 40) || 'Untitled';
    const repoName = item.content.repository?.name || 'Unknown';

    const priority = getPriorityFromItem(item);
    const sprint = getSprintFromPriority(priority);

    try {
      await setSprintField(item.id, fields.Sprint.id, sprint);

      console.log(`✅ ${repoName}#${issueNumber}: Priority=${priority || 'None'} → Sprint=${sprint}`);
      stats[sprint]++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      stats.errors++;
      console.error(`❌ ${repoName}#${issueNumber}: ${error.message}`);
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Summary:');
  console.log('');
  console.log(`Sprint Assignments:`);
  console.log(`  ${CURRENT_SPRINT}: ${stats[CURRENT_SPRINT]} issues`);
  console.log(`  ${NEXT_SPRINT}: ${stats[NEXT_SPRINT]} issues`);
  console.log(`  ${BACKLOG}: ${stats[BACKLOG]} issues`);
  console.log('');
  console.log(`❌ Errors: ${stats.errors}`);
  console.log('');
  console.log('✅ Sprint assignment complete!');
  console.log('');
  console.log('Next: Create a "Current Sprint" view filtered by Sprint = "Sprint 4"');
  console.log('View project: https://github.com/users/Acurioustractor/projects/1');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
