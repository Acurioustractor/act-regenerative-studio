#!/usr/bin/env node

/**
 * Create 8 high-priority TODO issues manually
 * Uses GitHub CLI to avoid rate limiting
 */

import { execSync } from 'child_process';

const HIGH_PRIORITY_TODOS = [
  {
    repo: 'act-regenerative-studio',
    title: 'Security vulnerability in auth flow',
    body: `## Issue
Security vulnerability found in authentication flow that needs immediate attention.

## Impact
Could allow unauthorized access to protected resources.

## Priority
🔴 HIGH - Security issue

## Next Steps
- [ ] Identify specific vulnerability in auth flow
- [ ] Review auth middleware implementation
- [ ] Implement security fix
- [ ] Add security tests
- [ ] Conduct security audit

## Context
Found during TODO migration from codebase. This is a critical security issue that should be addressed before production deployment.

## Labels
\`type: security\`, \`priority: high\`, \`lcaa: action\``,
    labels: ['type: security', 'priority: high', 'lcaa: action'],
  },
  {
    repo: 'act-regenerative-studio',
    title: 'Add input validation to prevent SQL injection',
    body: `## Issue
Need to implement comprehensive input validation to prevent SQL injection attacks.

## Impact
SQL injection is a critical vulnerability that could allow attackers to:
- Access unauthorized data
- Modify or delete data
- Execute administrative operations

## Priority
🔴 HIGH - Security issue

## Next Steps
- [ ] Audit all database queries for injection vulnerabilities
- [ ] Implement parameterized queries throughout codebase
- [ ] Add input validation middleware
- [ ] Add SQL injection tests
- [ ] Review Supabase client usage for security

## Context
Found during TODO migration. Critical security issue requiring immediate attention.

## Labels
\`type: security\`, \`priority: high\`, \`lcaa: action\``,
    labels: ['type: security', 'priority: high', 'lcaa: action'],
  },
  {
    repo: 'act-regenerative-studio',
    title: 'Add rate limiting to prevent brute force attacks',
    body: `## Issue
Need to implement rate limiting on authentication endpoints and other sensitive routes to prevent brute force attacks.

## Impact
Without rate limiting:
- Authentication endpoints vulnerable to brute force
- API abuse possible
- DDoS attacks easier

## Priority
🟡 MEDIUM - Security hardening

## Next Steps
- [ ] Research rate limiting libraries (upstash/ratelimit, Vercel Edge Config)
- [ ] Implement rate limit middleware for auth endpoints
- [ ] Add rate limit headers to responses
- [ ] Configure rate limits per endpoint type
- [ ] Add tests for rate limit behavior
- [ ] Document rate limit policy

## Context
Found during TODO migration. Important for production security.

## Effort
Estimated: 3h

## Labels
\`type: security\`, \`priority: medium\`, \`effort: 3h\`, \`lcaa: action\``,
    labels: ['type: security', 'priority: medium', 'effort: 3h', 'lcaa: action'],
  },
  {
    repo: 'act-regenerative-studio',
    title: 'Critical - fix before production',
    body: `## Issue
Critical issue explicitly marked in code that must be fixed before production deployment.

## Impact
Blocking production deployment.

## Priority
🔴 CRITICAL

## Next Steps
- [ ] Locate the specific TODO in codebase
- [ ] Identify the critical issue
- [ ] Implement fix
- [ ] Test thoroughly
- [ ] Verify production readiness

## Context
Found during TODO migration. Explicitly marked as critical by developer.

## Labels
\`type: bug\`, \`priority: critical\`, \`lcaa: action\``,
    labels: ['type: bug', 'priority: critical', 'lcaa: action'],
  },
  {
    repo: 'justicehub-platform',
    title: 'Implement actual authentication',
    body: `## Issue
Need to implement real authentication system for JusticeHub platform.

## Impact
Currently using placeholder/mock authentication, which is not suitable for production.

## Priority
🟡 MEDIUM - Core functionality

## Next Steps
- [ ] Choose authentication strategy (NextAuth, Supabase Auth, custom)
- [ ] Implement authentication flow
- [ ] Add session management
- [ ] Implement protected routes
- [ ] Add authentication tests
- [ ] Update documentation

## Context
Found during TODO migration. Authentication is fundamental infrastructure.

## Effort
Estimated: 1d

## Labels
\`type: feature\`, \`priority: medium\`, \`effort: 1d\`, \`lcaa: action\``,
    labels: ['type: feature', 'priority: medium', 'effort: 1d', 'lcaa: action'],
  },
  {
    repo: 'justicehub-platform',
    title: 'Re-enable auth check once session handling is fixed',
    body: `## Issue
Authentication check is currently disabled, indicating a temporary bypass that creates a security risk.

## Impact
🚨 Authentication is currently bypassed, creating a security vulnerability.

## Priority
🟡 MEDIUM - Security risk

## Next Steps
- [ ] Fix session handling issues
- [ ] Re-enable authentication checks
- [ ] Test authentication flow thoroughly
- [ ] Verify no bypasses remain
- [ ] Add integration tests

## Context
Found during TODO migration. Auth is temporarily disabled, which is a security risk.

## Labels
\`type: bug\`, \`priority: medium\`, \`security\`, \`lcaa: action\``,
    labels: ['type: bug', 'priority: medium', 'security', 'lcaa: action'],
  },
  {
    repo: 'theharvest',
    title: 'Fix workflow trigger API signature',
    body: `## Issue
Workflow trigger API signature is incorrect, causing integration failures.

## Impact
Workflow automation is broken, affecting:
- Automated processes
- Integration with other services
- User workflows

## Priority
🟡 MEDIUM - Infrastructure broken

## Next Steps
- [ ] Review workflow trigger API documentation
- [ ] Update API signature to match spec
- [ ] Test workflow triggers
- [ ] Update any dependent code
- [ ] Add integration tests

## Context
Found during TODO migration. Workflow integrations are critical for automation.

## Effort
Estimated: 3h

## Labels
\`type: bug\`, \`priority: medium\`, \`effort: 3h\`, \`lcaa: action\``,
    labels: ['type: bug', 'priority: medium', 'effort: 3h', 'lcaa: action'],
  },
  {
    repo: 'act-farm',
    title: 'Fix workflow trigger API signature',
    body: `## Issue
Workflow trigger API signature is incorrect, causing integration failures.

## Impact
Workflow automation is broken, affecting:
- Automated processes
- Integration with other services
- User workflows

## Priority
🟡 MEDIUM - Infrastructure broken

## Next Steps
- [ ] Review workflow trigger API documentation
- [ ] Update API signature to match spec
- [ ] Test workflow triggers
- [ ] Update any dependent code
- [ ] Add integration tests

## Context
Found during TODO migration. Same issue as in The Harvest - workflow integrations are critical.

## Effort
Estimated: 3h

## Labels
\`type: bug\`, \`priority: medium\`, \`effort: 3h\`, \`lcaa: action\``,
    labels: ['type: bug', 'priority: medium', 'effort: 3h', 'lcaa: action'],
  },
];

console.log('🚀 Creating 8 High-Priority TODO Issues');
console.log('========================================\n');

const createdIssues = [];

for (const [index, todo] of HIGH_PRIORITY_TODOS.entries()) {
  const issueNum = index + 1;
  console.log(`📝 Creating issue ${issueNum}/8: ${todo.title}`);
  console.log(`   Repository: ${todo.repo}`);

  try {
    // Create issue using gh CLI
    const labelsArg = todo.labels.map(l => `--label "${l}"`).join(' ');
    const bodyFile = `/tmp/issue-body-${Date.now()}.md`;

    // Write body to temp file
    execSync(`cat > "${bodyFile}" << 'EOF'\n${todo.body}\nEOF`, { encoding: 'utf-8' });

    // Create issue
    const command = `gh issue create --repo Acurioustractor/${todo.repo} --title "${todo.title}" --body-file "${bodyFile}" ${labelsArg}`;

    const issueUrl = execSync(command, { encoding: 'utf-8' }).trim();

    // Clean up temp file
    execSync(`rm "${bodyFile}"`);

    console.log(`   ✅ Created: ${issueUrl}\n`);

    createdIssues.push({
      repo: todo.repo,
      title: todo.title,
      url: issueUrl,
    });

    // Delay to avoid rate limiting (2 seconds between issues)
    if (index < HIGH_PRIORITY_TODOS.length - 1) {
      console.log('   ⏱️  Waiting 2 seconds to avoid rate limits...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}\n`);
  }
}

console.log('\n🎉 Summary');
console.log('===========\n');
console.log(`✅ Created ${createdIssues.length}/8 high-priority issues\n`);

if (createdIssues.length > 0) {
  console.log('📋 Created Issues:');
  createdIssues.forEach(({ repo, title, url }) => {
    console.log(`   • ${repo}: ${title}`);
    console.log(`     ${url}`);
  });
}

console.log('\n📊 Next Steps:');
console.log('1. Review issues on Projects board: https://github.com/users/Acurioustractor/projects/1');
console.log('2. Tomorrow: Run automated migration for remaining ~76 TODOs');
console.log('3. Update code files with issue references (if needed)');

console.log('\n🌾 Building the farm, one issue at a time! 🌾\n');
