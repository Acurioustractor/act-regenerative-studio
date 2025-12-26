#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function checkUnmatched() {
  const query = `
    query {
      node(id: "${PROJECT_ID}") {
        ... on ProjectV2 {
          items(first: 100) {
            nodes {
              id
              content {
                ... on Issue {
                  number
                  title
                  repository { name }
                  milestone { title }
                }
              }
              fieldValues(first: 20) {
                nodes {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    field { ... on ProjectV2SingleSelectField { name } }
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

  const result = await octokit.graphql(query);
  const items = result.node.items.nodes;

  const noMilestone = items.filter(item =>
    item.content && !item.content.milestone
  );

  console.log(`\nIssues without milestones: ${noMilestone.length}\n`);
  console.log('First 15 unmatched issues:\n');

  noMilestone.slice(0, 15).forEach(item => {
    const repo = item.content.repository.name;
    const num = item.content.number;
    const title = item.content.title.substring(0, 50);

    const type = item.fieldValues.nodes.find(f => f.field?.name === 'Type')?.name || 'Unknown';
    const project = item.fieldValues.nodes.find(f => f.field?.name === 'ACT Project')?.name || 'Unknown';

    console.log(`${repo}#${num}: ${title}`);
    console.log(`   Type: ${type} | Project: ${project}`);
    console.log('');
  });

  // Group by Type and Project
  const grouped = {};
  noMilestone.forEach(item => {
    const type = item.fieldValues.nodes.find(f => f.field?.name === 'Type')?.name || 'Unknown';
    const project = item.fieldValues.nodes.find(f => f.field?.name === 'ACT Project')?.name || 'Unknown';
    const key = `${project} / ${type}`;
    grouped[key] = (grouped[key] || 0) + 1;
  });

  console.log('\nBreakdown by Project/Type:');
  Object.entries(grouped)
    .sort(([, a], [, b]) => b - a)
    .forEach(([key, count]) => {
      console.log(`  ${key}: ${count} issues`);
    });
}

checkUnmatched().catch(console.error);
