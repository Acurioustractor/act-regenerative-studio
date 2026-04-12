import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/living-ecosystem-canon.generated.json'
);

async function resolveCanonPath() {
  const candidates = [
    process.env.ACT_LIVING_ECOSYSTEM_CANON_PATH,
    path.resolve(process.cwd(), '../act-global-infrastructure/config/living-ecosystem-canon.json'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isFile()) {
        return candidate;
      }
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

function createEmptySnapshot() {
  return {
    _meta: {
      description: 'Living ecosystem canon snapshot unavailable',
      version: '0.0.0',
      updated: null,
      classification_values: [],
      kind_values: [],
      surface_role_values: [],
      verification_status_values: [],
    },
    systems: {},
    surfaces: {},
    ownership_rules: {},
  };
}

async function writeSnapshot(snapshot) {
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
}

async function keepExistingSnapshot(reason) {
  try {
    await fs.access(OUTPUT_PATH);
    console.log(`${reason}, keeping existing living ecosystem canon snapshot at ${OUTPUT_PATH}`);
    return;
  } catch {
    await writeSnapshot(createEmptySnapshot());
    console.log(`${reason}, wrote empty living ecosystem canon snapshot to ${OUTPUT_PATH}`);
  }
}

async function main() {
  const canonPath = await resolveCanonPath();

  if (!canonPath) {
    await keepExistingSnapshot('living ecosystem canon not found');
    return;
  }

  const raw = await fs.readFile(canonPath, 'utf8');
  const parsed = JSON.parse(raw);

  await writeSnapshot(parsed);
  console.log(`synced living ecosystem canon to ${OUTPUT_PATH}`);
}

main().catch(async (error) => {
  await keepExistingSnapshot(`living ecosystem canon sync failed: ${error.message}`);
  process.exit(1);
});
