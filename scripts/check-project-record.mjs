#!/usr/bin/env node
// Fails when src/data/project-code-registry.generated.json is behind the infra
// record. Regenerates into a temp file and compares everything but generatedAt.
// Usage: node scripts/check-project-record.mjs   (npm run check:project-record)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const committedPath = 'src/data/project-code-registry.generated.json';
const tmp = join(mkdtempSync(join(tmpdir(), 'project-record-')), 'registry.json');

execFileSync('node', ['scripts/sync-project-code-registry.mjs'], {
  stdio: ['ignore', 'ignore', 'inherit'],
  env: { ...process.env, PROJECT_CODE_REGISTRY_OUTPUT: tmp },
});

if (!existsSync(tmp)) {
  console.log('project record: infra config not found beside this repo (set ACT_PROJECT_CODES_PATH), nothing to compare');
  process.exit(0);
}

const strip = (raw) => {
  const j = JSON.parse(raw);
  delete j.generatedAt;
  return j;
};
const fresh = strip(readFileSync(tmp, 'utf8'));
const committed = strip(readFileSync(committedPath, 'utf8'));

if (!fresh.guarded) {
  console.log('project record: infra package not present, nothing to compare against');
  process.exit(0);
}
if (fresh.projectCount === 0) {
  console.error('project record: fresh snapshot is empty, refusing to compare');
  process.exit(1);
}

const a = JSON.stringify(fresh);
const b = JSON.stringify(committed);
if (a === b) {
  console.log(`project record: ${committedPath} matches the infra record (${fresh.projectCount} projects)`);
  process.exit(0);
}

const freshBy = new Map(fresh.projects.map((p) => [p.code, p]));
const commBy = new Map(committed.projects.map((p) => [p.code, p]));
const changed = [];
for (const [code, p] of freshBy) if (JSON.stringify(p) !== JSON.stringify(commBy.get(code))) changed.push(code);
for (const code of commBy.keys()) if (!freshBy.has(code)) changed.push(`${code} (removed)`);
console.error(`project record: ${committedPath} is behind the infra record. ${changed.length} project(s) differ:`);
console.error('  ' + changed.join(' '));
console.error('run: npm run sync:project-codes');
process.exit(1);
