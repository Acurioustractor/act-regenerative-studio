#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const baseUrl = (process.env.LAUNCH_READY_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const withBuild = process.argv.includes('--with-build');

const requiredScripts = {
  dev: 'next dev -p 3001',
  start: 'next start -p 3001',
  'check:brand': 'node scripts/check-brand-wiki.mjs',
  'check:copy': 'node scripts/check-public-copy.mjs',
  'check:forms': 'node scripts/check-form-payloads.mjs',
  'check:launch': 'node scripts/check-launch-site.mjs',
  'check:redirects': 'node scripts/check-launch-redirects.mjs',
  'media:audit': 'node scripts/media-audit.mjs',
};

const generatedDataFiles = [
  'src/data/wiki-flagship-project-packs.generated.json',
  'src/data/wiki-pages.generated.json',
  'src/data/wiki-projects.generated.json',
];

const steps = [];
const failures = [];

function recordStep(name, status, detail = '') {
  steps.push({ name, status, detail });
  const suffix = detail ? `: ${detail}` : '';
  console.log(`${status === 'pass' ? 'PASS' : 'FAIL'} ${name}${suffix}`);
}

function runCommand(name, command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    failures.push(`${name}: exited ${result.status ?? 'without status'}`);
    recordStep(name, 'fail');
    return false;
  }

  recordStep(name, 'pass');
  return true;
}

function checkPackageScripts() {
  const packagePath = path.join(repoRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const missing = [];

  for (const [scriptName, expected] of Object.entries(requiredScripts)) {
    if (pkg.scripts?.[scriptName] !== expected) {
      missing.push(`${scriptName} expected "${expected}", got "${pkg.scripts?.[scriptName] || 'missing'}"`);
    }
  }

  if (missing.length > 0) {
    failures.push(...missing.map((item) => `package scripts: ${item}`));
    recordStep('package launch scripts', 'fail', `${missing.length} issue(s)`);
    return false;
  }

  recordStep('package launch scripts', 'pass', 'dev/start pinned to 3001 and launch gates present');
  return true;
}

function checkGeneratedJson() {
  const conflictPattern = /<<<<<<<|=======|>>>>>>>/;

  for (const relativePath of generatedDataFiles) {
    const absolutePath = path.join(repoRoot, relativePath);
    let source;

    try {
      source = fs.readFileSync(absolutePath, 'utf8');
    } catch (error) {
      failures.push(`${relativePath}: ${error.message}`);
      recordStep('generated wiki JSON', 'fail', `could not read ${relativePath}`);
      return false;
    }

    if (conflictPattern.test(source)) {
      failures.push(`${relativePath}: contains merge conflict markers`);
      recordStep('generated wiki JSON', 'fail', `${relativePath} has conflict markers`);
      return false;
    }

    try {
      JSON.parse(source);
    } catch (error) {
      failures.push(`${relativePath}: invalid JSON: ${error.message}`);
      recordStep('generated wiki JSON', 'fail', `${relativePath} is invalid JSON`);
      return false;
    }
  }

  recordStep('generated wiki JSON', 'pass', 'valid JSON and no conflict markers');
  return true;
}

async function checkServerReachable() {
  try {
    const response = await fetch(`${baseUrl}/`, { redirect: 'follow' });
    if (response.status !== 200) {
      failures.push(`${baseUrl}/ returned ${response.status}`);
      recordStep('local production server', 'fail', `expected 200, got ${response.status}`);
      return false;
    }

    recordStep('local production server', 'pass', `${baseUrl}/ returned 200`);
    return true;
  } catch (error) {
    failures.push(
      `local production server: ${error.message}. Start or restart the built site with "npm run start" before running this gate.`
    );
    recordStep('local production server', 'fail', error.message);
    return false;
  }
}

checkPackageScripts();
checkGeneratedJson();

if (withBuild) {
  runCommand('production build', 'npm', ['run', 'build']);
}

runCommand('public copy check', 'npm', ['run', 'check:copy']);
runCommand('type check', 'npx', ['tsc', '--noEmit']);

if (await checkServerReachable()) {
  runCommand('brand and wiki check', 'npm', ['run', 'check:brand']);
  runCommand('route launch check', 'npm', ['run', 'check:launch']);
  runCommand('legacy redirect check', 'npm', ['run', 'check:redirects']);
  runCommand('media audit', 'npm', ['run', 'media:audit']);
  runCommand('form safety check', 'npm', ['run', 'check:forms']);
}

if (failures.length > 0) {
  console.error('');
  console.error(`Launch-ready gate failed against ${baseUrl}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('');
console.log(`Launch-ready gate passed against ${baseUrl}`);
console.log(`Checked ${steps.length} launch requirements${withBuild ? ', including production build' : ''}.`);
