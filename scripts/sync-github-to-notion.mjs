#!/usr/bin/env node

/**
 * Sync GitHub Projects to Notion Database
 *
 * Fetches all items from ACT Ecosystem Development GitHub Project
 * and syncs them to Notion database with bidirectional mapping.
 */

import { Client } from '@notionhq/client';
import { graphql } from '@octokit/graphql';

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const GITHUB_PROJECT_ID = process.env.GITHUB_PROJECT_ID || 'PVT_kwHOCOopjs4BLVik';
const GITHUB_ORG = 'Acurioustractor';

// Initialize clients
const notion = new Client({ auth: NOTION_TOKEN });
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

// Status mapping
const STATUS_MAPPING = {
  'Backlog': '📋 Backlog',
  'Todo': '📝 Todo',
  'In Progress': '🏗️ In Progress',
  'In Review': '👀 In Review',
  'Done': '✅ Done',
  'Blocked': '🚫 Blocked'
};

/**
 * Fetch all items from GitHub Project
 */
async function fetchGitHubProjectItems() {
  console.log('Fetching GitHub Project items...');

  const query = `
    query($projectId: ID!, $after: String) {
      node(id: $projectId) {
        ... on ProjectV2 {
          items(first: 100, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              content {
                ... on Issue {
                  id
                  number
                  title
                  body
                  state
                  url
                  createdAt
                  updatedAt
                  assignees(first: 10) {
                    nodes {
                      login
                      name
                    }
                  }
                  labels(first: 20) {
                    nodes {
                      name
                    }
                  }
                  repository {
                    name
                    owner {
                      login
                    }
                  }
                  comments {
                    totalCount
                  }
                }
                ... on PullRequest {
                  id
                  number
                  title
                  body
                  state
                  url
                  createdAt
                  updatedAt
                  assignees(first: 10) {
                    nodes {
                      login
                      name
                    }
                  }
                  labels(first: 20) {
                    nodes {
                      name
                    }
                  }
                  repository {
                    name
                    owner {
                      login
                    }
                  }
                  comments {
                    totalCount
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
                  ... on ProjectV2ItemFieldTextValue {
                    text
                    field {
                      ... on ProjectV2Field {
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldDateValue {
                    date
                    field {
                      ... on ProjectV2FieldCommon {
                        name
                      }
                    }
                  }
                  ... on ProjectV2ItemFieldMilestoneValue {
                    milestone {
                      title
                      dueOn
                    }
                    field {
                      ... on ProjectV2FieldCommon {
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
  let after = null;

  while (hasNextPage) {
    const response = await graphqlWithAuth(query, {
      projectId: GITHUB_PROJECT_ID,
      after
    });

    const items = response.node.items.nodes;
    allItems = allItems.concat(items);

    hasNextPage = response.node.items.pageInfo.hasNextPage;
    after = response.node.items.pageInfo.endCursor;
  }

  console.log(`Fetched ${allItems.length} items from GitHub Project`);
  return allItems;
}

/**
 * Extract field value from GitHub Project item
 */
function getFieldValue(item, fieldName) {
  const field = item.fieldValues.nodes.find(
    f => f.field && f.field.name === fieldName
  );

  if (!field) return null;

  // Handle different field types
  if (field.name) return field.name; // Single select
  if (field.text) return field.text; // Text
  if (field.date) return field.date; // Date
  if (field.milestone) return field.milestone; // Milestone object

  return null;
}

/**
 * Check if page exists in Notion by GitHub ID
 */
async function findNotionPage(githubRepo, githubNumber) {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Repository',
            select: {
              equals: githubRepo
            }
          },
          {
            property: 'GitHub ID',
            number: {
              equals: githubNumber
            }
          }
        ]
      }
    });

    return response.results.length > 0 ? response.results[0] : null;
  } catch (error) {
    console.error(`Error finding Notion page: ${error.message}`);
    return null;
  }
}

/**
 * Create properties object for Notion page
 */
function buildNotionProperties(item) {
  const content = item.content;
  if (!content) return null;

  const status = getFieldValue(item, 'Status') || 'Todo';
  const actProject = getFieldValue(item, 'ACT Project') || 'ACT Main';
  const lcaaPhase = getFieldValue(item, 'LCAA Phase');
  const priority = getFieldValue(item, 'Priority');
  const effort = getFieldValue(item, 'Effort');
  const sprint = getFieldValue(item, 'Sprint');
  const dueDate = getFieldValue(item, 'Due Date');
  const milestone = getFieldValue(item, 'Milestone');

  const labels = content.labels?.nodes.map(l => l.name) || [];

  // Auto-detect type from labels
  const typeLabel = labels.find(l => ['feature', 'bug', 'task', 'epic'].includes(l.toLowerCase()));
  let type = 'Task'; // Default
  if (typeLabel) {
    type = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);
  } else if (labels.some(l => l.toLowerCase().includes('enhancement'))) {
    type = 'Feature';
  } else if (labels.some(l => l.toLowerCase().includes('documentation'))) {
    type = 'Task';
  }

  const properties = {
    'Title': {
      title: [{ text: { content: content.title || 'Untitled' } }]
    },
    'GitHub URL': {
      url: content.url
    },
    'GitHub ID': {
      number: content.number
    },
    'Repository': {
      select: { name: content.repository.name }
    },
    'Created': {
      date: { start: content.createdAt }
    },
    'Updated': {
      date: { start: content.updatedAt }
    },
    'Comments Count': {
      number: content.comments?.totalCount || 0
    },
    'Last Synced': {
      date: { start: new Date().toISOString() }
    }
  };

  // Add optional fields only if they have values
  if (status) {
    properties['Status'] = { select: { name: STATUS_MAPPING[status] || status } };
  }

  if (actProject) {
    properties['ACT Project'] = { select: { name: actProject } };
  }

  if (lcaaPhase) {
    properties['LCAA Phase'] = { select: { name: lcaaPhase } };
  }

  if (priority) {
    properties['Priority'] = { select: { name: priority } };
  }

  if (effort) {
    properties['Effort'] = { select: { name: effort } };
  }

  if (sprint) {
    properties['Sprint'] = { select: { name: sprint } };
  }

  if (dueDate) {
    properties['Due Date'] = { date: { start: dueDate } };
  }

  if (milestone) {
    properties['Milestone'] = { select: { name: milestone.title } };
  }

  if (type) {
    properties['Type'] = { select: { name: type.charAt(0).toUpperCase() + type.slice(1) } };
  }

  if (labels.length > 0) {
    properties['Labels'] = { multi_select: labels.map(l => ({ name: l })) };
  }

  if (content.body) {
    properties['Description'] = {
      rich_text: [{ text: { content: content.body.substring(0, 2000) } }]
    };
  }

  return properties;
}

/**
 * Create new page in Notion
 */
async function createNotionPage(item) {
  const properties = buildNotionProperties(item);
  if (!properties) return null;

  try {
    const response = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties
    });

    console.log(`✅ Created Notion page for ${item.content.repository.name}#${item.content.number}`);
    return response;
  } catch (error) {
    console.error(`❌ Error creating Notion page: ${error.message}`);
    return null;
  }
}

/**
 * Update existing Notion page
 */
async function updateNotionPage(pageId, item) {
  const properties = buildNotionProperties(item);
  if (!properties) return null;

  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties
    });

    console.log(`🔄 Updated Notion page for ${item.content.repository.name}#${item.content.number}`);
    return response;
  } catch (error) {
    console.error(`❌ Error updating Notion page: ${error.message}`);
    return null;
  }
}

/**
 * Main sync function
 */
async function sync() {
  console.log('Starting GitHub → Notion sync...\n');

  try {
    // Fetch all GitHub Project items
    const items = await fetchGitHubProjectItems();

    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    // Process each item
    for (const item of items) {
      if (!item.content) {
        skipped++;
        continue;
      }

      const { repository, number } = item.content;
      const repoName = repository.name;

      // Check if page exists in Notion
      const existingPage = await findNotionPage(repoName, number);

      if (existingPage) {
        // Update existing page
        const result = await updateNotionPage(existingPage.id, item);
        if (result) {
          updated++;
        } else {
          errors++;
        }
      } else {
        // Create new page
        const result = await createNotionPage(item);
        if (result) {
          created++;
        } else {
          errors++;
        }
      }

      // Rate limit: 3 requests per second for Notion
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    console.log('\n=== Sync Complete ===');
    console.log(`Total items: ${items.length}`);
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);

  } catch (error) {
    console.error(`\n❌ Sync failed: ${error.message}`);
    process.exit(1);
  }
}

// Run sync
sync();
