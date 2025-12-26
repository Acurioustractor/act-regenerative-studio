const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getProjectFields() {
  const query = `
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          fields(first: 20) {
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

  console.log('📊 Current GitHub Project Fields:');
  console.log('='.repeat(50));
  console.log('');

  result.node.fields.nodes.forEach(field => {
    console.log(`Field: ${field.name}`);
    console.log(`  Type: ${field.dataType}`);
    if (field.options) {
      const optionNames = field.options.map(o => o.name).join(', ');
      console.log(`  Options: ${optionNames}`);
    }
    console.log('');
  });
}

getProjectFields().catch(console.error);
