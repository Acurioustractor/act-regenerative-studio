#!/usr/bin/env node

/**
 * Suggest LCAA phases for GitHub issues based on title/content
 * Uses simple keyword matching to categorize issues
 */

const { Octokit } = require('@octokit/rest');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_PROJECT_TOKEN;
const PROJECT_ID = 'PVT_kwHOCOopjs4BLVik';
const OWNER = 'Acurioustractor';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN or GH_PROJECT_TOKEN environment variable required');
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Keyword patterns for each phase
const PHASE_PATTERNS = {
  'Listen': [
    /research/i,
    /discover/i,
    /understand/i,
    /interview/i,
    /consult/i,
    /gather/i,
    /explore requirements/i,
    /user needs/i,
    /community/i,
    /feedback/i
  ],
  'Curiosity': [
    /prototype/i,
    /experiment/i,
    /test/i,
    /try/i,
    /explore/i,
    /investigate/i,
    /poc/i,
    /proof of concept/i,
    /spike/i,
    /feasibility/i
  ],
  'Action': [
    /implement/i,
    /build/i,
    /create/i,
    /add/i,
    /develop/i,
    /fix/i,
    /\[todo\]/i,
    /deploy/i,
    /integrate/i,
    /update/i
  ],
  'Art': [
    /design/i,
    /polish/i,
    /refine/i,
    /story/i,
    /documentation/i,
    /onboarding/i,
    /ux/i,
    /ui/i,
    /landing page/i,
    /branding/i
  ]
};

function suggestPhase(title, body = '') {
  const text = `${title} ${body}`.toLowerCase();

  const scores = {
    'Listen': 0,
    'Curiosity': 0,
    'Action': 0,
    'Art': 0
  };

  // Check patterns
  for (const [phase, patterns] of Object.entries(PHASE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        scores[phase]++;
      }
    }
  }

  // Default to Action if no clear match (most TODOs are Action)
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    return { phase: 'Action', confidence: 'low', reason: 'Default (implementation task)' };
  }

  const phase = Object.entries(scores).find(([_, score]) => score === maxScore)[0];
  const confidence = maxScore >= 2 ? 'high' : maxScore === 1 ? 'medium' : 'low';

  return { phase, confidence, reason: `Matched ${maxScore} keyword(s)` };
}

async function analyzeIssues() {
  console.log('🎨 LCAA Phase Suggestion Tool');
  console.log('='.repeat(50));
  console.log('');
  console.log('Analyzing issues and suggesting LCAA phases...');
  console.log('');

  const repos = [
    'goods-asset-tracker',
    'empathy-ledger-v2',
    'justicehub-platform',
    'the-harvest-website',
    'act-farm',
    'act-placemat',
    'act-regenerative-studio',
    'act-project-template'
  ];

  const suggestions = [];

  for (const repo of repos) {
    try {
      const { data: issues } = await octokit.issues.listForRepo({
        owner: OWNER,
        repo,
        state: 'open',
        per_page: 100
      });

      const issuesOnly = issues.filter(i => !i.pull_request);

      for (const issue of issuesOnly) {
        const suggestion = suggestPhase(issue.title, issue.body);
        suggestions.push({
          repo,
          number: issue.number,
          title: issue.title.substring(0, 60),
          ...suggestion
        });
      }
    } catch (error) {
      console.error(`Error fetching ${repo}: ${error.message}`);
    }
  }

  // Group by phase
  const byPhase = {
    'Listen': [],
    'Curiosity': [],
    'Action': [],
    'Art': []
  };

  suggestions.forEach(s => byPhase[s.phase].push(s));

  // Display results
  console.log('📊 Suggested LCAA Phase Distribution:');
  console.log('');
  for (const [phase, items] of Object.entries(byPhase)) {
    const icon = phase === 'Listen' ? '🎧' : phase === 'Curiosity' ? '🔍' : phase === 'Action' ? '⚡' : '🎨';
    console.log(`${icon} ${phase}: ${items.length} issues`);
  }
  console.log('');

  // Show samples from each phase
  console.log('='.repeat(50));
  console.log('Sample Issues by Phase:');
  console.log('='.repeat(50));

  for (const [phase, items] of Object.entries(byPhase)) {
    if (items.length === 0) continue;

    const icon = phase === 'Listen' ? '🎧' : phase === 'Curiosity' ? '🔍' : phase === 'Action' ? '⚡' : '🎨';
    console.log('');
    console.log(`${icon} ${phase.toUpperCase()}:`);
    console.log('-'.repeat(50));

    items.slice(0, 5).forEach(item => {
      console.log(`  ${item.repo}#${item.number}: ${item.title}`);
      console.log(`    Confidence: ${item.confidence} (${item.reason})`);
    });

    if (items.length > 5) {
      console.log(`  ... and ${items.length - 5} more`);
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('');
  console.log('💡 Recommendations:');
  console.log('');
  console.log('1. Most issues are likely Action (implementation)');
  console.log('2. Review high-confidence suggestions first');
  console.log('3. For Empathy Ledger TODOs, most are Action unless:');
  console.log('   - Related to design/UX → Art');
  console.log('   - Related to testing/prototyping → Curiosity');
  console.log('   - Related to research/requirements → Listen');
  console.log('');
  console.log('Next: Manually review and set phases in GitHub Project UI');
  console.log('https://github.com/users/Acurioustractor/projects/1');
}

analyzeIssues().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
