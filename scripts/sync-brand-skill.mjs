#!/usr/bin/env node
/**
 * Shared Claude skills come from act-global-infrastructure; this repo only checks or takes them.
 *
 *   node scripts/sync-brand-skill.mjs           # check (exit 1 on drift)   npm run check:skills
 *   node scripts/sync-brand-skill.mjs --apply   # take upstream             npm run sync:skills
 *
 * The rule, the manifest and the tool live upstream: act-global-infrastructure/config/shared-skills.json
 * and scripts/sync-skills.mjs. Upstream location: $ACT_INFRA_DIR, else ../act-global-infrastructure,
 * else ~/Code/act-global-infrastructure.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const infra = [process.env.ACT_INFRA_DIR, resolve(repo, '..', 'act-global-infrastructure'), resolve(homedir(), 'Code', 'act-global-infrastructure')].filter(Boolean).find((p) => existsSync(resolve(p, 'scripts/sync-skills.mjs')));
if (!infra) {
  console.log('shared skills: act-global-infrastructure not found beside this repo; nothing to compare (set ACT_INFRA_DIR)');
  process.exit(0);
}
const r = spawnSync('node', [resolve(infra, 'scripts/sync-skills.mjs'), '--repo', repo, '--as', 'act-regenerative-studio', ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
