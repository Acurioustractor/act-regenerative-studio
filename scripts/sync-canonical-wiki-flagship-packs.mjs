import fs from 'node:fs/promises';
import path from 'node:path';

import {
  resolveCanonicalWikiRoot,
  buildFlagshipProjectPackSnapshot,
} from './lib/wiki-flagship-project-packs.mjs';

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/wiki-flagship-project-packs.generated.json'
);

async function main() {
  const explicitWikiRoot =
    process.env.ACT_CANONICAL_WIKI_ROOT ||
    path.resolve(process.cwd(), '../act-global-infrastructure/wiki');
  const wikiRoot = await resolveCanonicalWikiRoot(
    path.resolve(explicitWikiRoot, '..')
  );

  if (!wikiRoot) {
    try {
      await fs.access(OUTPUT_PATH);
      console.log(`canonical wiki not found, keeping existing flagship pack snapshot at ${OUTPUT_PATH}`);
      return;
    } catch {
      const emptySnapshot = {
        generatedAt: new Date().toISOString(),
        sourceRoot: null,
        packCount: 0,
        packs: [],
      };
      await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(emptySnapshot, null, 2)}\n`);
      console.log(`canonical wiki not found, wrote empty flagship pack snapshot to ${OUTPUT_PATH}`);
      return;
    }
  }

  const snapshot = await buildFlagshipProjectPackSnapshot({ wikiRoot });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`synced ${snapshot.packCount} flagship project packs to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
