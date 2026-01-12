/**
 * Sync .env file entries into Bitwarden Secrets Manager.
 *
 * Usage:
 *   node scripts/sync-env-to-bitwarden.mjs --env /path/to/.env.local
 *
 * Notes:
 * - Uses BWS_ACCESS_TOKEN from environment.
 * - If only one Bitwarden project exists, it is used automatically.
 * - Skips blank values to avoid overwriting secrets with empty strings.
 */

import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';

const args = process.argv.slice(2);
const envArgIndex = args.indexOf('--env');
const envPath = envArgIndex >= 0 ? args[envArgIndex + 1] : '/Users/benknight/Code/empathy-ledger-v2/.env.local';

const ALIAS_KEYS = {
  EL_SUPABASE_URL: 'NEXT_PUBLIC_SUPABASE_URL',
  EL_SUPABASE_SERVICE_ROLE_KEY: 'SUPABASE_SERVICE_ROLE_KEY',
};

function runBws(argsList) {
  return execFileSync('bws', argsList, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
}

function parseEnv(text) {
  const result = {};
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const cleaned = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const eqIndex = cleaned.indexOf('=');
    if (eqIndex === -1) continue;

    const key = cleaned.slice(0, eqIndex).trim();
    let value = cleaned.slice(eqIndex + 1);

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

function resolveProjectId() {
  const raw = runBws(['project', 'list', '-o', 'json']);
  const projects = JSON.parse(raw);

  if (!projects.length) {
    throw new Error('No Bitwarden projects found for this access token.');
  }

  if (projects.length > 1) {
    const names = projects.map((project) => `${project.name} (${project.id})`).join(', ');
    throw new Error(`Multiple Bitwarden projects found. Please choose one: ${names}`);
  }

  return projects[0].id;
}

function loadExistingSecretIds(projectId) {
  const raw = runBws(['secret', 'list', projectId, '-o', 'json']);
  const secrets = JSON.parse(raw);
  const map = new Map();

  for (const secret of secrets) {
    map.set(secret.key, secret.id);
  }

  return map;
}

async function syncEnv() {
  const envText = readFileSync(envPath, 'utf8');
  const entries = parseEnv(envText);

  for (const [aliasKey, sourceKey] of Object.entries(ALIAS_KEYS)) {
    if (!entries[aliasKey] && entries[sourceKey]) {
      entries[aliasKey] = entries[sourceKey];
    }
  }

  const projectId = resolveProjectId();
  const existing = loadExistingSecretIds(projectId);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const [key, value] of Object.entries(entries)) {
    if (value === '') {
      skipped += 1;
      continue;
    }

    const existingId = existing.get(key);

    if (existingId) {
      runBws(['secret', 'edit', '--value', value, existingId, '-o', 'none']);
      updated += 1;
    } else {
      runBws(['secret', 'create', key, value, projectId, '-o', 'none']);
      created += 1;
    }
  }

  console.log('✅ Bitwarden sync complete');
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped (empty): ${skipped}`);
}

try {
  syncEnv();
} catch (error) {
  console.error('❌ Sync failed:', error.message);
  process.exit(1);
}
