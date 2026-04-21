import fs from 'node:fs/promises';
import path from 'node:path';

import { globSync } from 'glob';
import matter from 'gray-matter';

const SECTION_TITLES = {
  concepts: 'Concepts',
  projects: 'Projects',
  sources: 'Sources',
  communities: 'Communities',
  people: 'People',
  stories: 'Stories',
  art: 'Art',
  research: 'Research',
  technical: 'Technical',
  finance: 'Finance',
  decisions: 'Decisions',
  synthesis: 'Synthesis',
  overview: 'Overview',
};

const OUTPUT_PATH = path.resolve(process.cwd(), 'src/data/wiki-pages.generated.json');

function relativePathToPagePath(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
  const parts = normalized.split('/');
  const stem = parts[parts.length - 1];
  const parent = parts[parts.length - 2];

  if (parent && stem === parent) {
    return parts.slice(0, -1).join('/');
  }

  return normalized;
}

function normalizeWhitespace(value) {
  return value.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function stripMarkdown(value) {
  if (!value) return null;

  return normalizeWhitespace(
    value
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^>\s*/gm, '')
  );
}

function parseExcerpt(content) {
  const summaryMatch = content.match(/^>\s+(.+)$/m);
  if (summaryMatch?.[1]) {
    return stripMarkdown(summaryMatch[1]);
  }

  const firstParagraph = content
    .split('\n\n')
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk && !chunk.startsWith('#') && !chunk.startsWith('**'));

  return stripMarkdown(firstParagraph || null);
}

function removeLeadingTitle(content) {
  return content.replace(/^#\s+.+\n+/m, '').trim();
}

async function resolveCanonicalWikiRoot() {
  const candidates = [
    process.env.ACT_CANONICAL_WIKI_ROOT,
    path.resolve(process.cwd(), '../act-global-infrastructure/wiki'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isDirectory()) {
        return candidate;
      }
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

async function loadWikiPages(wikiRoot) {
  const rootFiles = globSync('*.md', {
    cwd: wikiRoot,
    nodir: true,
  }).filter((file) => file === 'index.md');

  const sectionFiles = globSync('{concepts,projects,sources,communities,people,stories,art,research,technical,finance,decisions,synthesis}/**/*.md', {
    cwd: wikiRoot,
    ignore: ['**/README.md', '**/index.md', '**/_*.md'],
    nodir: true,
  });

  const targets = [...rootFiles, ...sectionFiles];

  const pages = await Promise.all(
    targets.map(async (relativePath) => {
      const absolutePath = path.join(wikiRoot, relativePath);
      const [rawContent, stats] = await Promise.all([
        fs.readFile(absolutePath, 'utf8'),
        fs.stat(absolutePath),
      ]);

      const { content } = matter(rawContent);
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const pathKey = relativePath === 'index.md' ? 'index' : relativePathToPagePath(relativePath);
      const stem = pathKey.split('/').pop() || pathKey;
      const sectionId = relativePath === 'index.md' ? 'overview' : relativePath.split('/')[0];

      return {
        title: titleMatch?.[1]?.trim() || stem,
        excerpt: parseExcerpt(content),
        content: removeLeadingTitle(content),
        sectionId,
        sectionTitle: SECTION_TITLES[sectionId] || 'Overview',
        stem,
        path: pathKey,
        relativePath,
        modifiedAt: stats.mtime.toISOString(),
      };
    })
  );

  return pages.sort((left, right) => left.title.localeCompare(right.title));
}

async function main() {
  const wikiRoot = await resolveCanonicalWikiRoot();

  if (!wikiRoot) {
    try {
      await fs.access(OUTPUT_PATH);
      console.log(`canonical wiki not found, keeping existing snapshot at ${OUTPUT_PATH}`);
      return;
    } catch {
      const emptySnapshot = {
        generatedAt: new Date().toISOString(),
        sourceRoot: null,
        pageCount: 0,
        pages: [],
      };
      await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(emptySnapshot, null, 2)}\n`);
      console.log(`canonical wiki not found, wrote empty snapshot to ${OUTPUT_PATH}`);
      return;
    }
  }

  const pages = await loadWikiPages(wikiRoot);
  const payload = {
    generatedAt: new Date().toISOString(),
    sourceRoot: wikiRoot,
    pageCount: pages.length,
    pages,
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`synced ${pages.length} canonical wiki pages to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
