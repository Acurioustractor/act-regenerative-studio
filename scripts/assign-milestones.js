#!/usr/bin/env node

/**
 * Bulk assign milestones to issues with intelligent rules
 * Also sets Due Dates and Start Dates based on milestone
 */

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const OWNER = 'Acurioustractor';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Milestone assignment rules
const MILESTONE_RULES = {
  'Security Hardening': {
    priority: 1, // Highest priority
    conditions: (issue, type, actProject, priority) => {
      // Security issues from any ACT project, or Bugs
      return type === 'Security' || type === 'Bug';
    },
    dueDate: '2025-01-31',
    startDate: 'today',
    repos: ['empathy-ledger-v2', 'act-regenerative-studio', 'justicehub-platform']
  },

  'Data Architecture Complete': {
    priority: 2,
    conditions: (issue, type, actProject, priority) => {
      return type === 'Data';
    },
    dueDate: '2025-02-15',
    startDate: 'milestone-minus-2weeks',
    repos: ['empathy-ledger-v2', 'act-regenerative-studio']
  },

  'Empathy Ledger Core': {
    priority: 3,
    conditions: (issue, type, actProject, priority) => {
      return actProject === 'Empathy Ledger' && type === 'Enhancement';
    },
    dueDate: '2025-02-28',
    startDate: 'when-sprint-assigned',
    repos: ['empathy-ledger-v2']
  },

  'Goods Asset Register MVP': {
    priority: 4,
    conditions: (issue, type, actProject, priority) => {
      return actProject === 'Goods';
    },
    dueDate: '2025-03-15',
    startDate: 'when-sprint-assigned',
    repos: ['goods-asset-tracker']
  },

  'Integration Platform': {
    priority: 5,
    conditions: (issue, type, actProject, priority) => {
      // Match Integration work OR any ACT Main work (except Security/Bug/Data)
      if (type === 'Integration') return true;
      if (actProject === 'ACT Main' && type !== 'Security' && type !== 'Bug' && type !== 'Data') return true;
      return false;
    },
    dueDate: '2025-03-31',
    startDate: 'when-sprint-assigned',
    repos: ['act-regenerative-studio', 'empathy-ledger-v2']
  },

  'JusticeHub Alpha': {
    priority: 6,
    conditions: (issue, type, actProject, priority) => {
      // Match JusticeHub work (any type except Security)
      return actProject === 'JusticeHub' && type !== 'Security';
    },
    dueDate: '2025-04-30',
    startDate: 'when-sprint-assigned',
    repos: ['justicehub-platform']
  },

  'Testing & Quality': {
    priority: 7,
    conditions: (issue, type, actProject, priority) => {
      return type === 'Testing';
    },
    dueDate: '2025-06-30',
    startDate: 'when-sprint-assigned',
    repos: ['goods-asset-tracker', 'empathy-ledger-v2']
  },

  'The Harvest Website': {
    priority: 8,
    conditions: (issue, type, actProject, priority) => {
      return actProject === 'The Harvest';
    },
    dueDate: '2025-05-15',
    startDate: 'when-sprint-assigned',
    repos: ['harvest-community-hub']
  }
};

function calculateStartDate(rule, priority, dueDate) {
  if (rule.startDate === 'today') {
    return new Date().toISOString().split('T')[0];
  }

  if (rule.startDate === 'milestone-minus-2weeks') {
    const date = new Date(dueDate);
    date.setDate(date.getDate() - 14);
    return date.toISOString().split('T')[0];
  }

  // 'when-sprint-assigned' means don't set start date yet
  return null;
}

function calculateDueDate(rule, priority) {
  const milestoneDate = new Date(rule.dueDate);

  // Critical: Due same day as milestone
  if (priority === 'Critical') {
    return milestoneDate.toISOString().split('T')[0];
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

  // Low: Same as milestone (no rush)
  return rule.dueDate;
}

async function getIssueMetadata(repo, issueNumber) {
  const { data: issue } = await octokit.issues.get({
    owner: OWNER,
    repo,
    issue_number: issueNumber
  });

  const labels = issue.labels.map(l => l.name);

  // Extract metadata from labels
  const typeLabel = labels.find(l => l.startsWith('type:'));
  const priorityLabel = labels.find(l => l.startsWith('priority:'));
  const projectLabel = labels.find(l => l.startsWith('project:'));

  let type = typeLabel ? typeLabel.replace('type:', '').trim() : 'Unknown';
  let priority = priorityLabel ? priorityLabel.replace('priority:', '').trim() : 'Low';
  let actProject = projectLabel ? projectLabel.replace('project:', '').trim() : 'Unknown';

  // Map label values to proper field values
  const typeMap = {
    'chore': 'Enhancement',
    'bug': 'Bug',
    'feature': 'Feature',
    'docs': 'Documentation',
    'refactor': 'Enhancement',
    'test': 'Testing'
  };

  const priorityMap = {
    'critical': 'Critical',
    'high': 'High',
    'medium': 'Medium',
    'low': 'Low'
  };

  const projectMap = {
    'empathy-ledger': 'Empathy Ledger',
    'justicehub': 'JusticeHub',
    'harvest': 'The Harvest',
    'act-farm': 'ACT Farm',
    'act-main': 'ACT Main',
    'placemat': 'ACT Placemat',
    'goods': 'Goods',
    'ecosystem': 'Cross-Project'
  };

  type = typeMap[type.toLowerCase()] || type;
  priority = priorityMap[priority.toLowerCase()] || priority;
  actProject = projectMap[actProject.toLowerCase()] || actProject;

  return { type, priority, actProject, issue };
}

function determineMilestone(repo, type, actProject, priority) {
  // Try each rule in priority order
  for (const [milestoneName, rule] of Object.entries(MILESTONE_RULES)) {
    // Check if this milestone applies to this repo
    if (!rule.repos.includes(repo)) {
      continue;
    }

    // Check if conditions match
    if (rule.conditions(null, type, actProject, priority)) {
      return milestoneName;
    }
  }

  return null;
}

async function processRepo(repo) {
  console.log('');
  console.log(`📦 Processing: ${repo}`);

  try {
    // Get all open issues
    const { data: issues } = await octokit.issues.listForRepo({
      owner: OWNER,
      repo,
      state: 'open',
      per_page: 100
    });

    const issuesOnly = issues.filter(i => !i.pull_request);

    if (issuesOnly.length === 0) {
      console.log('   No open issues found.');
      return { processed: 0, assigned: 0, datesSet: 0 };
    }

    let assigned = 0;
    let datesSet = 0;

    for (const issue of issuesOnly) {
      const { type, priority, actProject } = await getIssueMetadata(repo, issue.number);

      const milestoneName = determineMilestone(repo, type, actProject, priority);

      if (!milestoneName) {
        console.log(`   #${issue.number}: No milestone rule matched (Type: ${type}, Project: ${actProject})`);
        continue;
      }

      const rule = MILESTONE_RULES[milestoneName];
      const dueDate = calculateDueDate(rule, priority);
      const startDate = calculateStartDate(rule, priority, rule.dueDate);

      console.log(`   #${issue.number}: ${issue.title.substring(0, 40)}`);
      console.log(`      Milestone: ${milestoneName}`);
      console.log(`      Due: ${dueDate}`);
      if (startDate) {
        console.log(`      Start: ${startDate}`);
      }

      try {
        // Get milestone number (need to fetch milestones to get number)
        const { data: milestones } = await octokit.issues.listMilestones({
          owner: OWNER,
          repo,
          state: 'open'
        });

        const milestone = milestones.find(m => m.title === milestoneName);

        if (!milestone) {
          console.log(`      ⚠️  Milestone "${milestoneName}" not found in ${repo}`);
          console.log(`      Please create it first!`);
          continue;
        }

        // Update issue with milestone
        await octokit.issues.update({
          owner: OWNER,
          repo,
          issue_number: issue.number,
          milestone: milestone.number
        });

        console.log(`      ✅ Assigned milestone`);
        assigned++;

        // Note: GitHub doesn't support setting due_date/start_date via API
        // These are GitHub Project fields, not issue fields
        // We'll handle dates in the project field update below

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`      ❌ Error: ${error.message}`);
      }
    }

    return { processed: issuesOnly.length, assigned, datesSet };

  } catch (error) {
    console.error(`   ❌ Error fetching issues: ${error.message}`);
    return { processed: 0, assigned: 0, datesSet: 0 };
  }
}

async function main() {
  console.log('🎯 Intelligent Milestone Assignment');
  console.log('='.repeat(50));
  console.log('');
  console.log('This will assign milestones to all issues based on:');
  console.log('  - Issue Type (Security, Bug, Enhancement, etc.)');
  console.log('  - ACT Project (Goods, Empathy Ledger, etc.)');
  console.log('  - Priority (Critical, High, Medium, Low)');
  console.log('');
  console.log('Milestones must be created first! See: scripts/CREATE_MILESTONES.md');
  console.log('');

  const repos = [
    'goods-asset-tracker',
    'empathy-ledger-v2',
    'justicehub-platform',
    'the-harvest-website',
    'act-farm',
    'act-regenerative-studio'
  ];

  let totalProcessed = 0;
  let totalAssigned = 0;
  let totalDatesSet = 0;

  for (const repo of repos) {
    const result = await processRepo(repo);
    totalProcessed += result.processed;
    totalAssigned += result.assigned;
    totalDatesSet += result.datesSet;
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Summary:');
  console.log(`  Total issues processed: ${totalProcessed}`);
  console.log(`  Milestones assigned: ${totalAssigned}`);
  console.log(`  Dates set: ${totalDatesSet}`);
  console.log('');

  if (totalAssigned < totalProcessed) {
    const unassigned = totalProcessed - totalAssigned;
    console.log(`⚠️  ${unassigned} issues could not be assigned`);
    console.log('   Reasons:');
    console.log('   - Milestone not created in repo');
    console.log('   - No matching rule for issue type/project');
    console.log('');
  }

  console.log('✅ Milestone assignment complete!');
  console.log('');
  console.log('📝 Note: Due Dates and Start Dates are set in GitHub Project fields,');
  console.log('   not as issue properties. Run the project field sync script next.');
  console.log('');
  console.log('Next: node scripts/sync-milestone-dates.js');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
