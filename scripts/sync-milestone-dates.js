#!/usr/bin/env node

/**
 * Sync Due Dates and Start Dates in GitHub Project based on milestones
 *
 * GitHub milestones have due dates, but GitHub Project fields need separate updates
 */

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Milestone due dates
const MILESTONE_DATES = {
  'Security Hardening': {
    due: '2025-01-31',
    startImmediate: true // Security issues start today
  },
  'Data Architecture Complete': {
    due: '2025-02-15',
    startBeforeDue: 14 // Start 2 weeks before due
  },
  'Empathy Ledger Core': {
    due: '2025-02-28',
    startOnSprint: true // Start when added to sprint
  },
  'Goods Asset Register MVP': {
    due: '2025-03-15',
    startOnSprint: true
  },
  'Integration Platform': {
    due: '2025-03-31',
    startOnSprint: true
  },
  'JusticeHub Alpha': {
    due: '2025-04-30',
    startOnSprint: true
  },
  'The Harvest Website': {
    due: '2025-05-15',
    startOnSprint: true
  },
  'Testing & Quality': {
    due: '2025-06-30',
    startOnSprint: true
  }
};

function calculateDueDate(milestoneName, priority) {
  const milestoneConfig = MILESTONE_DATES[milestoneName];
  if (!milestoneConfig) return null;

  const milestoneDate = new Date(milestoneConfig.due);

  // Critical: Due same day as milestone
  if (priority === 'Critical') {
    return milestoneConfig.due;
  }

  // High: Due 1 week before milestone (buffer)
  if (priority === 'High') {
    milestoneDate.setDate(milestoneDate.getDate() - 7);
    return milestoneDate.toISOString().split('T')[0];
  }

  // Medium: Due 2 weeks before milestone
  if (priority === 'Medium') {
    milestoneDate.setDate(milestoneDate.getDate() - 14);
    return milestoneDate.toISOString().split('T')[0];
  }

  // Low: Same as milestone
  return milestoneConfig.due;
}

function calculateStartDate(milestoneName, priority) {
  const milestoneConfig = MILESTONE_DATES[milestoneName];
  if (!milestoneConfig) return null;

  // Start immediately for security/critical
  if (milestoneConfig.startImmediate || priority === 'Critical') {
    return new Date().toISOString().split('T')[0];
  }

  // Start X days before due date
  if (milestoneConfig.startBeforeDue) {
    const dueDate = new Date(milestoneConfig.due);
    dueDate.setDate(dueDate.getDate() - milestoneConfig.startBeforeDue);
    return dueDate.toISOString().split('T')[0];
  }

  // Start when added to sprint (don't set yet)
  if (milestoneConfig.startOnSprint) {
    return null;
  }

  return null;
}

async function getProjectFields() {
  const query = `
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          fields(first: 30) {
            nodes {
              ... on ProjectV2Field {
                id
                name
                dataType
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                dataType
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
  const fields = {};

  result.node.fields.nodes.forEach(field => {
    fields[field.name] = field;
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
                  milestone {
                    title
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

async function setDateField(itemId, fieldId, dateValue) {
  const mutation = `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: Date!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { date: $value }
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
    value: dateValue
  });
}

function getPriorityFromItem(item) {
  const priorityField = item.fieldValues.nodes.find(
    fv => fv.field && fv.field.name === 'Priority'
  );
  return priorityField ? priorityField.name : 'Low';
}

async function main() {
  console.log('📅 Sync Milestone Dates to Project Fields');
  console.log('='.repeat(50));
  console.log('');
  console.log('This will set Due Date and Start Date fields based on:');
  console.log('  - Issue Milestone');
  console.log('  - Issue Priority');
  console.log('');

  // Get project fields
  console.log('📊 Fetching project fields...');
  const fields = await getProjectFields();

  if (!fields['Due Date'] || !fields['Start Date']) {
    console.error('❌ Error: Due Date or Start Date fields not found in project');
    console.error('   Please add these fields in GitHub Project settings');
    console.error('   Field type: Date');
    process.exit(1);
  }

  console.log('✅ Found Due Date field');
  console.log('✅ Found Start Date field');
  console.log('');

  // Get all items
  console.log('📦 Fetching all project items...');
  const items = await getAllProjectItems();
  console.log(`✅ Found ${items.length} items`);
  console.log('');

  // Sync dates
  console.log('📅 Syncing dates...');
  console.log('');

  const stats = {
    dueSet: 0,
    startSet: 0,
    noMilestone: 0,
    errors: 0
  };

  for (const item of items) {
    if (!item.content) {
      continue;
    }

    const issueNumber = item.content.number;
    const issueTitle = item.content.title?.substring(0, 40) || 'Untitled';
    const repoName = item.content.repository?.name || 'Unknown';
    const milestone = item.content.milestone?.title;

    if (!milestone) {
      stats.noMilestone++;
      continue;
    }

    const priority = getPriorityFromItem(item);
    const dueDate = calculateDueDate(milestone, priority);
    const startDate = calculateStartDate(milestone, priority);

    console.log(`${repoName}#${issueNumber}: ${issueTitle}`);
    console.log(`   Milestone: ${milestone} | Priority: ${priority}`);

    try {
      // Set Due Date
      if (dueDate) {
        await setDateField(item.id, fields['Due Date'].id, dueDate);
        console.log(`   ✅ Due Date: ${dueDate}`);
        stats.dueSet++;
      }

      // Set Start Date (if applicable)
      if (startDate) {
        await setDateField(item.id, fields['Start Date'].id, startDate);
        console.log(`   ✅ Start Date: ${startDate}`);
        stats.startSet++;
      } else {
        console.log(`   ⏸️  Start Date: Not set (starts when added to Sprint)`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      stats.errors++;
      console.error(`   ❌ Error: ${error.message}`);
    }

    console.log('');
  }

  console.log('='.repeat(50));
  console.log('Summary:');
  console.log('');
  console.log(`  Total items: ${items.length}`);
  console.log(`  Due Dates set: ${stats.dueSet}`);
  console.log(`  Start Dates set: ${stats.startSet}`);
  console.log(`  No milestone: ${stats.noMilestone}`);
  console.log(`  Errors: ${stats.errors}`);
  console.log('');
  console.log('✅ Date sync complete!');
  console.log('');
  console.log('View project: https://github.com/users/Acurioustractor/projects/1');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
