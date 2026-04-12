import fs from 'node:fs/promises';
import path from 'node:path';

const BACKEND_URL = process.env.NOTION_BACKEND_URL || 'http://localhost:4000';
const DEFAULT_TIMEOUT_MS = Number.parseInt(
  process.env.NOTION_BACKEND_FETCH_TIMEOUT_MS || '1500',
  10
);

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/notion-projects.generated.json'
);

function createEmptySnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    sourceUrl: null,
    lastUpdated: null,
    totalCount: 0,
    projects: [],
  };
}

async function writeSnapshot(snapshot) {
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
}

async function keepExistingSnapshot(reason) {
  try {
    await fs.access(OUTPUT_PATH);
    console.log(`${reason}, keeping existing Notion snapshot at ${OUTPUT_PATH}`);
    return;
  } catch {
    const emptySnapshot = createEmptySnapshot();
    await writeSnapshot(emptySnapshot);
    console.log(`${reason}, wrote empty Notion snapshot to ${OUTPUT_PATH}`);
  }
}

async function fetchProjectsFromBackend() {
  const response = await fetch(`${BACKEND_URL}/api/real/projects`, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const payload = await response.json();

  if (!payload.projects || !Array.isArray(payload.projects)) {
    throw new Error('Invalid data format received from Notion backend');
  }

  return payload;
}

async function main() {
  try {
    const payload = await fetchProjectsFromBackend();
    const snapshot = {
      generatedAt: new Date().toISOString(),
      sourceUrl: BACKEND_URL,
      lastUpdated: payload.lastUpdated || new Date().toISOString(),
      totalCount: payload.totalCount || payload.projects.length,
      projects: payload.projects,
    };

    await writeSnapshot(snapshot);
    console.log(`synced ${snapshot.totalCount} Notion projects to ${OUTPUT_PATH}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Notion backend unavailable';
    await keepExistingSnapshot(`Notion backend unavailable (${message})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
