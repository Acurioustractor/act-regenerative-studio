#!/usr/bin/env node

/**
 * Migrate TODOs to GitHub Issues - ACT Ecosystem
 *
 * Scans all core ACT codebases for TODO/FIXME comments and creates
 * GitHub issues for each one. Replaces in-code TODOs with issue references.
 *
 * Usage:
 *   node scripts/migrate-todos-to-github.mjs [--dry-run]
 *
 * Requires:
 *   - GitHub CLI (gh) authenticated
 *   - Or GITHUB_TOKEN environment variable
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

const ORG = 'Acurioustractor';

// Core ACT repositories with local paths
const ACT_REPOS = {
  'ACT Farm and Regenerative Innovation Studio': 'act-regenerative-studio',
  'empathy-ledger-v2': 'empathy-ledger-v2',
  'JusticeHub': 'justicehub-platform',
  'The Harvest': 'theharvest',
  'ACT Farm/act-farm': 'act-farm',
  'ACT Placemat': 'act-placemat',
  'Goods Asset Register': 'goods-asset-tracker',
};

// Get GitHub token
function getGitHubToken() {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  try {
    const token = execSync('gh auth token', { encoding: 'utf8' }).trim();
    return token;
  } catch (error) {
    console.error('❌ GitHub authentication failed');
    console.error('Please run: gh auth login');
    console.error('Or set GITHUB_TOKEN environment variable');
    process.exit(1);
  }
}

// Extract TODOs from code
async function extractTodos(codebasePath) {
  const files = globSync(`${codebasePath}/**/*.{ts,tsx,js,jsx,md}`, {
    ignore: [
      `${codebasePath}/**/node_modules/**`,
      `${codebasePath}/**/.next/**`,
      `${codebasePath}/**/dist/**`,
      `${codebasePath}/**/build/**`,
      `${codebasePath}/**/docs/archive/**`,
      `${codebasePath}/**/.claude/skills/*/archive/**`,
    ],
    nodir: true,  // Only return files, not directories
  });

  const todos = [];

  for (const file of files) {
    // Skip directories (glob sometimes returns them)
    if (fs.statSync(file).isDirectory()) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Match TODO: or FIXME: comments
      const todoMatch = line.match(/\/\/\s*TODO:?\s*(.+)/i);
      const fixmeMatch = line.match(/\/\/\s*FIXME:?\s*(.+)/i);
      const mdTodoMatch = line.match(/<!--\s*TODO:?\s*(.+?)\s*-->/i);

      const match = todoMatch || fixmeMatch || mdTodoMatch;
      if (!match) return;

      const type = todoMatch ? 'TODO' : fixmeMatch ? 'FIXME' : 'TODO';
      const description = match[1].trim();

      // Skip if it's already referencing an issue
      if (description.match(/see issue #\d+/i)) return;
      if (description.match(/github\.com.*issues\/\d+/i)) return;

      todos.push({
        file: path.relative(codebasePath, file),
        line: index + 1,
        type,
        description,
        context: lines.slice(Math.max(0, index - 2), index + 3).join('\n'),
      });
    });
  }

  return todos;
}

// Create GitHub issue
async function createIssue(octokit, repo, todo, codebasePath, dryRun = false) {
  const labels = ['type: chore', 'effort: 1h'];
  if (todo.type === 'FIXME') {
    labels.push('type: bug');
    labels.push('priority: medium');
  } else {
    labels.push('priority: low');
  }

  // Determine project label from repo
  const projectLabelMap = {
    'act-regenerative-studio': 'project: act-main',
    'empathy-ledger-v2': 'project: empathy-ledger',
    'justicehub-platform': 'project: justicehub',
    'theharvest': 'project: harvest',
    'act-farm': 'project: act-farm',
    'act-placemat': 'project: placemat',
    'goods-asset-tracker': 'project: goods',
  };
  if (projectLabelMap[repo]) {
    labels.push(projectLabelMap[repo]);
  }

  const body = `
## 📝 Migrated from Code TODO

**File:** \`${todo.file}:${todo.line}\`

**Type:** ${todo.type}

**Original comment:**
\`\`\`typescript
${todo.context}
\`\`\`

---

**Next Steps:**
- [ ] Review the TODO and create an implementation plan
- [ ] Update acceptance criteria if needed
- [ ] Implement the fix/feature
- [ ] Remove or update the in-code comment

---
*Auto-migrated by \`migrate-todos-to-github.mjs\`*
*Part of ACT GitHub PM infrastructure improvement*
  `.trim();

  if (dryRun) {
    console.log(`  [DRY RUN] Would create issue:`);
    console.log(`    Title: [TODO]: ${todo.description.slice(0, 80)}`);
    console.log(`    Labels: ${labels.join(', ')}`);
    return null;
  }

  try {
    const issue = await octokit.issues.create({
      owner: ORG,
      repo,
      title: `[TODO]: ${todo.description.slice(0, 80)}`,
      body,
      labels,
    });

    console.log(`  ✅ Created issue #${issue.data.number}: ${todo.description.slice(0, 60)}...`);
    return issue.data.number;
  } catch (error) {
    console.error(`  ❌ Failed to create issue: ${error.message}`);
    return null;
  }
}

// Replace TODO in code with issue reference
function replaceTodoWithIssue(filePath, lineNum, issueNumber, repo, dryRun = false) {
  if (dryRun) {
    console.log(`  [DRY RUN] Would update ${filePath}:${lineNum} with issue #${issueNumber}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const originalLine = lines[lineNum - 1];

  // Replace TODO/FIXME with issue reference
  lines[lineNum - 1] = originalLine.replace(
    /(\/\/\s*(?:TODO|FIXME):?\s*)(.+)/i,
    `$1See issue #${issueNumber} in ${repo}: $2`
  );

  // Also handle markdown TODOs
  lines[lineNum - 1] = lines[lineNum - 1].replace(
    /(<!--\s*TODO:?\s*)(.+?)(\s*-->)/i,
    `$1See issue #${issueNumber} in ${repo}: $2$3`
  );

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`  📝 Updated ${filePath}:${lineNum}`);
}

// Main execution
async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('🔍 ACT TODO Migration to GitHub Issues');
  console.log('======================================\n');

  if (dryRun) {
    console.log('🧪 DRY RUN MODE - No changes will be made\n');
  }

  const token = getGitHubToken();
  const octokit = new Octokit({ auth: token });

  const results = {};

  // Scan all codebases
  console.log('📂 Scanning codebases for TODOs...\n');

  for (const [codebaseName, repoName] of Object.entries(ACT_REPOS)) {
    const fullPath = `/Users/benknight/Code/${codebaseName}`;

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Skipping ${codebaseName} (not found at ${fullPath})`);
      continue;
    }

    console.log(`📦 ${codebaseName}...`);
    const todos = await extractTodos(fullPath);

    console.log(`  Found ${todos.length} TODOs`);
    results[repoName] = { path: fullPath, todos };
  }

  const totalTodos = Object.values(results).reduce((sum, r) => sum + r.todos.length, 0);
  console.log(`\n🎯 Total TODOs found: ${totalTodos}\n`);

  if (totalTodos === 0) {
    console.log('✨ No TODOs to migrate - codebase is clean!');
    return;
  }

  // Create issues
  console.log('📝 Creating GitHub issues...\n');

  let created = 0;
  let updated = 0;

  for (const [repoName, { path: codebasePath, todos }] of Object.entries(results)) {
    if (todos.length === 0) continue;

    console.log(`\n📦 Processing ${repoName} (${todos.length} TODOs)...`);

    for (const todo of todos) {
      const issueNumber = await createIssue(octokit, repoName, todo, codebasePath, dryRun);

      if (issueNumber) {
        const fullFilePath = path.join(codebasePath, todo.file);
        replaceTodoWithIssue(fullFilePath, todo.line, issueNumber, repoName, dryRun);
        created++;
        updated++;
      }

      // Rate limiting: pause between requests (GitHub API: 5000 requests/hour)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n======================================');
  console.log('📊 Summary\n');

  if (dryRun) {
    console.log(`Would create ${totalTodos} GitHub issues`);
    console.log(`Would update ${totalTodos} code files`);
    console.log('\nRun without --dry-run to execute migration');
  } else {
    console.log(`✅ Issues created: ${created}`);
    console.log(`📝 Files updated: ${updated}`);

    console.log('\n🎉 Migration complete!');
    console.log('\nBreakdown by repository:');
    Object.entries(results).forEach(([repo, { todos }]) => {
      if (todos.length > 0) {
        console.log(`  • ${repo}: ${todos.length} TODOs → GitHub issues`);
      }
    });

    console.log('\n📍 Next steps:');
    console.log('  1. Review created issues on GitHub');
    console.log('  2. Add them to the unified Projects board');
    console.log('  3. Prioritize and assign as needed');
    console.log('  4. Commit the updated code files with issue references');
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
