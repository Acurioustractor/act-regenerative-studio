#!/usr/bin/env node

/**
 * Migrate GitHub labels to Project fields
 *
 * Migrates:
 * - effort: * labels → Effort field
 * - priority: * labels → Priority field
 *
 * Keeps labels for backward compatibility
 */

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Label → Field value mappings
const EFFORT_MAPPING = {
  'effort: 1h': '1h',
  'effort: 3h': '3h',
  'effort: 4h': '3h', // Map 4h to closest option (3h)
  'effort: 1d': '1d',
  'effort: 3d': '3d',
  'effort: 1w': '1w',
  'effort: 2w': '2w'
};

const PRIORITY_MAPPING = {
  'priority: critical': 'Critical',
  'priority: high': 'High',
  'priority: medium': 'Medium',
  'priority: low': 'Low'
};

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
            }
          }
        }
      }
    }
  `;

  const result = await octokit.graphql(query, { projectId: PROJECT_ID });
  const fields = {};

  result.node.fields.nodes.forEach(field => {
    if (field.name === 'Effort' || field.name === 'Priority') {
      fields[field.name] = field;
    }
  });

  return fields;
}

async function addPriorityOption(fieldId, optionName) {
  // Note: Adding options requires project admin permissions
  // This might not work via API - may need manual UI step
  const mutation = `
    mutation($projectId: ID!, $fieldId: ID!, $name: String!) {
      addProjectV2SingleSelectOption(input: {
        projectId: $projectId
        fieldId: $fieldId
        name: $name
      }) {
        option {
          id
          name
        }
      }
    }
  `;

  try {
    const result = await octokit.graphql(mutation, {
      projectId: PROJECT_ID,
      fieldId: fieldId,
      name: optionName
    });
    return result.addProjectV2SingleSelectOption.option;
  } catch (error) {
    throw new Error(`Failed to add option: ${error.message}`);
  }
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
                  labels(first: 50) {
                    nodes {
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

async function setFieldValue(itemId, fieldId, optionId) {
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
  console.log('🔄 Label → Field Migration');
  console.log('='.repeat(50));
  console.log('');
  console.log('This will migrate:');
  console.log('  - effort: * labels → Effort field');
  console.log('  - priority: * labels → Priority field');
  console.log('');
  console.log('Labels will be kept for backward compatibility.');
  console.log('');

  // Step 1: Get project fields
  console.log('📊 Fetching project fields...');
  const fields = await getProjectFields();

  if (!fields.Effort || !fields.Priority) {
    console.error('❌ Error: Effort or Priority field not found');
    process.exit(1);
  }

  console.log(`✅ Found Effort field (${fields.Effort.options.length} options)`);
  console.log(`✅ Found Priority field (${fields.Priority.options.length} options)`);
  console.log('');

  // Step 2: Check if Critical option exists, add if needed
  const hasCritical = fields.Priority.options.some(o => o.name === 'Critical');

  if (!hasCritical) {
    console.log('⚠️  "Critical" option not found in Priority field');
    console.log('🔧 Attempting to add "Critical" option...');

    try {
      const newOption = await addPriorityOption(fields.Priority.id, 'Critical');
      console.log(`✅ Added "Critical" option (${newOption.id})`);

      // Refresh fields to get new option
      const updatedFields = await getProjectFields();
      fields.Priority = updatedFields.Priority;
    } catch (error) {
      console.error('❌ Could not add "Critical" option via API');
      console.error('   Please add it manually in GitHub UI:');
      console.error('   https://github.com/users/Acurioustractor/projects/1/settings');
      console.error('');
      console.error('   Error:', error.message);
      console.error('');
      console.log('⏸️  Continuing migration without Critical option...');
    }
  } else {
    console.log('✅ "Critical" option already exists');
  }
  console.log('');

  // Step 3: Get all project items
  console.log('📦 Fetching all project items...');
  const items = await getAllProjectItems();
  console.log(`✅ Found ${items.length} items`);
  console.log('');

  // Step 4: Migrate
  console.log('🔄 Starting migration...');
  console.log('');

  let effortMigrated = 0;
  let priorityMigrated = 0;
  let effortSkipped = 0;
  let prioritySkipped = 0;
  let errors = 0;

  for (const item of items) {
    if (!item.content) {
      continue;
    }

    const issueNumber = item.content.number;
    const issueTitle = item.content.title?.substring(0, 40) || 'Untitled';
    const repoName = item.content.repository?.name || 'Unknown';
    const labels = item.content.labels?.nodes.map(l => l.name) || [];

    let updated = false;

    try {
      // Migrate Effort
      for (const [labelName, fieldValue] of Object.entries(EFFORT_MAPPING)) {
        if (labels.includes(labelName)) {
          const option = fields.Effort.options.find(o => o.name === fieldValue);
          if (option) {
            await setFieldValue(item.id, fields.Effort.id, option.id);
            console.log(`✅ ${repoName}#${issueNumber}: Effort = ${fieldValue}`);
            effortMigrated++;
            updated = true;
            break; // Only use first matching label
          }
        }
      }

      // Migrate Priority
      for (const [labelName, fieldValue] of Object.entries(PRIORITY_MAPPING)) {
        if (labels.includes(labelName)) {
          const option = fields.Priority.options.find(o => o.name === fieldValue);
          if (option) {
            await setFieldValue(item.id, fields.Priority.id, option.id);
            console.log(`✅ ${repoName}#${issueNumber}: Priority = ${fieldValue}`);
            priorityMigrated++;
            updated = true;
            break; // Only use first matching label
          } else if (fieldValue === 'Critical') {
            console.log(`⚠️  ${repoName}#${issueNumber}: Skipping Critical (option not available)`);
            prioritySkipped++;
          }
        }
      }

      if (!updated) {
        // No labels to migrate for this item
        effortSkipped++;
        prioritySkipped++;
      }

      // Rate limiting
      if (updated) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (error) {
      errors++;
      console.error(`❌ ${repoName}#${issueNumber}: ${error.message}`);
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Migration Summary:');
  console.log('');
  console.log('Effort:');
  console.log(`  ✅ Migrated: ${effortMigrated}`);
  console.log(`  ⏭️  Skipped (no label): ${effortSkipped}`);
  console.log('');
  console.log('Priority:');
  console.log(`  ✅ Migrated: ${priorityMigrated}`);
  console.log(`  ⏭️  Skipped (no label): ${prioritySkipped}`);
  console.log('');
  console.log(`❌ Errors: ${errors}`);
  console.log('');
  console.log('✅ Migration complete!');
  console.log('');
  console.log('📝 Note: Labels have been kept for backward compatibility');
  console.log('');
  console.log('View project: https://github.com/users/Acurioustractor/projects/1');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
