#!/usr/bin/env node

/**
 * Migrate issues to Type field with intelligent detection
 *
 * Analyzes issue title, body, and labels to suggest the correct Type
 */

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Keyword patterns for intelligent Type detection
const TYPE_PATTERNS = {
  'Security': [
    /security/i,
    /vulnerability/i,
    /auth(entication)?/i,
    /permission/i,
    /\bxss\b/i,
    /sql injection/i,
    /csrf/i,
    /encryption/i,
    /\bpat\b/i,
    /credential/i
  ],
  'Bug': [
    /\bfix\b/i,
    /\bbug\b/i,
    /broken/i,
    /not working/i,
    /error/i,
    /issue/i,
    /problem/i,
    /crash/i
  ],
  'Data': [
    /database/i,
    /\btable\b/i,
    /column/i,
    /migration/i,
    /schema/i,
    /\bdb\b/i,
    /supabase/i,
    /postgres/i,
    /\bsql\b/i,
    /add.*table/i,
    /create.*table/i
  ],
  'Integration': [
    /integrate/i,
    /\bapi\b/i,
    /webhook/i,
    /connect/i,
    /sync/i,
    /vercel/i,
    /notion/i,
    /\bghl\b/i,
    /email/i,
    /notification/i,
    /third[- ]party/i,
    /external/i
  ],
  'UX/UI': [
    /\bui\b/i,
    /\bux\b/i,
    /mobile/i,
    /responsive/i,
    /design/i,
    /layout/i,
    /interface/i,
    /navigation/i,
    /\bmenu\b/i,
    /modal/i,
    /toast/i,
    /button/i
  ],
  'Configuration': [
    /config/i,
    /setup/i,
    /environment/i,
    /\benv\b/i,
    /settings/i,
    /\bids?\b.*form/i,
    /deploy/i,
    /pipeline/i
  ],
  'Research': [
    /research/i,
    /investigate/i,
    /explore/i,
    /spike/i,
    /\bpoc\b/i,
    /proof of concept/i,
    /feasibility/i,
    /evaluate/i
  ],
  'Documentation': [
    /\bdocs?\b/i,
    /documentation/i,
    /readme/i,
    /guide/i,
    /comment/i,
    /\bjsdoc\b/i
  ],
  'Testing': [
    /\btest/i,
    /testing/i,
    /\bqa\b/i,
    /automation/i,
    /\be2e\b/i,
    /unit test/i
  ],
  'Enhancement': [
    /improve/i,
    /enhance/i,
    /optimize/i,
    /better/i,
    /refine/i,
    /upgrade/i,
    /update(?!.*table)/i // "update" but not "update table"
  ],
  'Cleanup': [
    /remove/i,
    /delete/i,
    /clean.*up/i,
    /deprecated/i,
    /unused/i,
    /\btech debt\b/i
  ]
};

function detectType(issue) {
  const text = `${issue.title} ${issue.body || ''}`.toLowerCase();
  const labels = issue.labels?.map(l => l.name.toLowerCase()) || [];

  // Check for existing type label first
  const typeLabel = labels.find(l => l.startsWith('type:'));
  if (typeLabel) {
    const labelType = typeLabel.replace('type:', '').trim();
    // Map old label types to new types
    if (labelType === 'chore') {
      // Don't trust the chore label, analyze the content
    } else if (labelType === 'bug') return 'Bug';
    else if (labelType === 'feature') return 'Feature';
    else if (labelType === 'docs') return 'Documentation';
    else if (labelType === 'refactor') return 'Enhancement';
    else if (labelType === 'test') return 'Testing';
  }

  // Score each type based on keyword matches
  const scores = {};
  for (const [type, patterns] of Object.entries(TYPE_PATTERNS)) {
    scores[type] = 0;
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        scores[type]++;
      }
    }
  }

  // Get the highest scoring type
  const maxScore = Math.max(...Object.values(scores));

  if (maxScore > 0) {
    const bestType = Object.entries(scores).find(([_, score]) => score === maxScore)[0];
    return bestType;
  }

  // Default logic based on common patterns
  if (text.includes('implement') || text.includes('add') || text.includes('create')) {
    // Check if it's data-related
    if (text.includes('table') || text.includes('column') || text.includes('database')) {
      return 'Data';
    }
    // Check if it's UI-related
    if (text.includes('page') || text.includes('component') || text.includes('view')) {
      return 'UX/UI';
    }
    // Default to Feature
    return 'Feature';
  }

  // Fallback to Feature (most common)
  return 'Feature';
}

function getConfidence(issue, detectedType) {
  const text = `${issue.title} ${issue.body || ''}`.toLowerCase();
  const patterns = TYPE_PATTERNS[detectedType] || [];

  let matchCount = 0;
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      matchCount++;
    }
  }

  if (matchCount >= 2) return 'high';
  if (matchCount === 1) return 'medium';
  return 'low';
}

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
    if (field.name === 'Type') {
      fields.Type = field;
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
                  body
                  repository {
                    name
                  }
                  labels(first: 20) {
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

async function setTypeField(itemId, fieldId, optionId) {
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
  console.log('🔍 Intelligent Type Detection & Migration');
  console.log('='.repeat(50));
  console.log('');

  // Get Type field
  console.log('📊 Fetching Type field...');
  const fields = await getProjectFields();

  if (!fields.Type) {
    console.error('❌ Error: Type field not found in project');
    console.error('   Please create the Type field first in GitHub Project settings');
    process.exit(1);
  }

  const availableTypes = fields.Type.options.map(o => o.name);
  console.log(`✅ Found Type field with ${availableTypes.length} options`);
  console.log(`   Options: ${availableTypes.join(', ')}`);
  console.log('');

  // Check if all required types exist
  const requiredTypes = ['Security', 'Bug', 'Feature', 'Enhancement', 'Data',
                         'Integration', 'UX/UI', 'Configuration', 'Research',
                         'Documentation', 'Testing', 'Cleanup'];

  const missingTypes = requiredTypes.filter(t => !availableTypes.includes(t));
  if (missingTypes.length > 0) {
    console.error('⚠️  Warning: Some Type options are missing:');
    console.error(`   Missing: ${missingTypes.join(', ')}`);
    console.error('');
    console.error('   Please add them in GitHub Project settings:');
    console.error('   https://github.com/users/Acurioustractor/projects/1/settings');
    console.error('');
    console.error('   See: scripts/setup-type-field.md');
    console.error('');
    process.exit(1);
  }

  // Get all items
  console.log('📦 Fetching all project items...');
  const items = await getAllProjectItems();
  console.log(`✅ Found ${items.length} items`);
  console.log('');

  // Analyze and show preview
  console.log('🔍 Analyzing issues and detecting Types...');
  console.log('');

  const typeStats = {};
  const preview = [];

  for (const item of items) {
    if (!item.content) continue;

    const issue = {
      title: item.content.title,
      body: item.content.body,
      labels: item.content.labels?.nodes || []
    };

    const detectedType = detectType(issue);
    const confidence = getConfidence(issue, detectedType);

    typeStats[detectedType] = (typeStats[detectedType] || 0) + 1;

    if (preview.length < 10) {
      preview.push({
        number: item.content.number,
        repo: item.content.repository?.name || 'Unknown',
        title: item.content.title?.substring(0, 50) || 'Untitled',
        type: detectedType,
        confidence
      });
    }
  }

  // Show preview
  console.log('📊 Preview (first 10 issues):');
  console.log('');
  preview.forEach(p => {
    const confidenceIcon = p.confidence === 'high' ? '✅' : p.confidence === 'medium' ? '⚠️' : '❓';
    console.log(`${confidenceIcon} ${p.repo}#${p.number}: ${p.title}`);
    console.log(`   Type: ${p.type} (${p.confidence} confidence)`);
  });

  console.log('');
  console.log('📊 Type Distribution:');
  console.log('');
  Object.entries(typeStats)
    .sort(([, a], [, b]) => b - a)
    .forEach(([type, count]) => {
      const percentage = ((count / items.length) * 100).toFixed(1);
      console.log(`   ${type.padEnd(15)} ${count.toString().padStart(3)} issues (${percentage}%)`);
    });

  console.log('');
  console.log('='.repeat(50));
  console.log('🚀 Ready to migrate?');
  console.log('');
  console.log('This will set the Type field for all 149 issues.');
  console.log('Press Ctrl+C to cancel, or Enter to continue...');
  console.log('');

  // Wait for user confirmation
  await new Promise((resolve) => {
    process.stdin.once('data', () => {
      resolve();
    });
  });

  // Migrate
  console.log('');
  console.log('🔄 Migrating issues...');
  console.log('');

  let migrated = 0;
  let errors = 0;

  for (const item of items) {
    if (!item.content) continue;

    const issueNumber = item.content.number;
    const issueTitle = item.content.title?.substring(0, 40) || 'Untitled';
    const repoName = item.content.repository?.name || 'Unknown';

    const issue = {
      title: item.content.title,
      body: item.content.body,
      labels: item.content.labels?.nodes || []
    };

    const detectedType = detectType(issue);
    const typeOption = fields.Type.options.find(o => o.name === detectedType);

    if (!typeOption) {
      console.error(`❌ ${repoName}#${issueNumber}: Type "${detectedType}" not found in options`);
      errors++;
      continue;
    }

    try {
      await setTypeField(item.id, fields.Type.id, typeOption.id);
      console.log(`✅ ${repoName}#${issueNumber}: ${issueTitle} → ${detectedType}`);
      migrated++;

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
  console.log('');
  console.log(`  Total items: ${items.length}`);
  console.log(`  Migrated: ${migrated}`);
  console.log(`  Errors: ${errors}`);
  console.log('');
  console.log('📊 Final Type Distribution:');
  console.log('');
  Object.entries(typeStats)
    .sort(([, a], [, b]) => b - a)
    .forEach(([type, count]) => {
      const percentage = ((count / items.length) * 100).toFixed(1);
      console.log(`   ${type.padEnd(15)} ${count.toString().padStart(3)} issues (${percentage}%)`);
    });

  console.log('');
  console.log('✅ Type migration complete!');
  console.log('');
  console.log('View project: https://github.com/users/Acurioustractor/projects/1');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
