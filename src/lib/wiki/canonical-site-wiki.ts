import 'server-only';

import { cache } from 'react';
import fs from 'node:fs/promises';
import path from 'node:path';

import { glob } from 'glob';
import matter from 'gray-matter';

import snapshot from '@/data/wiki-pages.generated.json';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export type CanonicalWikiPageSource = 'supabase' | 'live-wiki' | 'snapshot';

export interface CanonicalWikiPageRecord {
  title: string;
  excerpt: string | null;
  content: string;
  sectionId: string;
  sectionTitle: string;
  stem: string;
  path: string;
  relativePath: string;
  modifiedAt: string | null;
}

export interface CanonicalWikiPageMatch extends CanonicalWikiPageRecord {
  source: CanonicalWikiPageSource;
}

export interface CanonicalWikiPageListItem {
  title: string;
  excerpt: string | null;
  sectionId: string;
  sectionTitle: string;
  stem: string;
  path: string;
  relativePath: string;
  modifiedAt: string | null;
}

interface CanonicalWikiPagesSnapshot {
  generatedAt: string | null;
  sourceRoot: string | null;
  pageCount: number;
  pages: CanonicalWikiPageRecord[];
}

const SNAPSHOT = snapshot as CanonicalWikiPagesSnapshot;

const CANONICAL_SECTION_ORDER = [
  'concepts',
  'projects',
  'sources',
  'communities',
  'people',
  'stories',
  'art',
  'research',
  'technical',
  'finance',
  'decisions',
  'synthesis',
] as const;

const CANONICAL_SECTION_TITLES: Record<string, string> = {
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
};

const LEGACY_ALIASES: Record<string, string> = {
  act: 'concepts/act-identity',
  'the-farm': 'projects/act-farm',
  'the-studio': 'projects/act-studio',
  'the-harvest': 'projects/the-harvest',
  goods: 'projects/goods-on-country',
  justicehub: 'projects/justicehub',
  'empathy-ledger': 'projects/empathy-ledger',
  contained: 'projects/contained',
  picc: 'projects/picc',
};

let livePagePromise: Promise<CanonicalWikiPageRecord[] | null> | null = null;

interface SupabaseWikiRow {
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  page_type: string | null;
  updated_at: string | null;
  status: string | null;
}

function supabasePageTypeToSection(pageType: string | null): string {
  switch (pageType) {
    case 'principle':
    case 'method':
    case 'practice':
    case 'procedure':
      return 'concepts';
    case 'guide':
      return 'research';
    case 'template':
      return 'technical';
    default:
      return 'concepts';
  }
}

function supabaseRowToRecord(row: SupabaseWikiRow): CanonicalWikiPageRecord {
  const slugClean = row.slug.replace(/^\/+|\/+$/g, '');
  const hasSection = slugClean.includes('/');
  const sectionId = hasSection
    ? slugClean.split('/')[0]
    : supabasePageTypeToSection(row.page_type);
  const sectionTitle = CANONICAL_SECTION_TITLES[sectionId] || sectionId;
  const stem = slugClean.split('/').pop() || slugClean;

  return {
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    sectionId,
    sectionTitle,
    stem,
    path: slugClean,
    relativePath: hasSection ? `${slugClean}.md` : `${sectionId}/${slugClean}.md`,
    modifiedAt: row.updated_at,
  };
}

const getSupabaseCanonicalWikiPages = cache(
  async (): Promise<CanonicalWikiPageRecord[] | null> => {
    const client = getSupabaseServerClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('wiki_pages')
        .select('slug, title, content, excerpt, page_type, updated_at, status')
        .eq('status', 'active');
      if (error || !data) return null;
      const rows = data as SupabaseWikiRow[];
      return rows.map(supabaseRowToRecord);
    } catch {
      return null;
    }
  }
);

function normalizeValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function relativePathToPagePath(relativePath: string): string {
  const normalized = relativePath.replaceAll('\\', '/').replace(/\.md$/, '');
  const parts = normalized.split('/');
  const stem = parts[parts.length - 1];
  const parent = parts[parts.length - 2];

  if (parent && stem === parent) {
    return parts.slice(0, -1).join('/');
  }

  return normalized;
}

function stripMarkdown(value: string | null): string | null {
  if (!value) return null;

  return value
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^>\s*/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function parseExcerpt(content: string): string | null {
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

function removeLeadingTitle(content: string): string {
  return content
    .replace(/^#\s+.+\n+/m, '')
    .trim();
}

async function resolveCanonicalWikiRoot(): Promise<string | null> {
  const candidates = [
    process.env.ACT_CANONICAL_WIKI_ROOT,
    path.resolve(process.cwd(), '../act-global-infrastructure/wiki'),
  ].filter(Boolean) as string[];

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

async function buildLiveCanonicalWikiPages(): Promise<CanonicalWikiPageRecord[] | null> {
  const wikiRoot = await resolveCanonicalWikiRoot();

  if (!wikiRoot) {
    return null;
  }

  const pageFiles = await glob('*.md', {
    cwd: wikiRoot,
    nodir: true,
  });

  const sectionFiles = await glob('{concepts,projects,sources,communities,people,stories,art,research,technical,finance,decisions,synthesis}/**/*.md', {
    cwd: wikiRoot,
    ignore: ['**/README.md', '**/index.md', '**/_*.md'],
    nodir: true,
  });

  const targets = [...pageFiles.filter((file) => file === 'index.md'), ...sectionFiles];

  const records = await Promise.all(
    targets.map(async (relativePath) => {
      const absolutePath = path.join(wikiRoot, relativePath);
      const [rawContent, stats] = await Promise.all([
        fs.readFile(absolutePath, 'utf8'),
        fs.stat(absolutePath),
      ]);

      const { content } = matter(rawContent);
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const cleanedContent = removeLeadingTitle(content);
      const pathKey = relativePath === 'index.md' ? 'index' : relativePathToPagePath(relativePath);
      const stem = pathKey.split('/').pop() || pathKey;
      const sectionId = relativePath === 'index.md' ? 'overview' : relativePath.split('/')[0];

      return {
        title: titleMatch?.[1]?.trim() || stem,
        excerpt: parseExcerpt(content),
        content: cleanedContent,
        sectionId,
        sectionTitle: CANONICAL_SECTION_TITLES[sectionId] || 'Overview',
        stem,
        path: pathKey,
        relativePath,
        modifiedAt: stats.mtime.toISOString(),
      } satisfies CanonicalWikiPageRecord;
    })
  );

  return records.sort((left, right) => left.title.localeCompare(right.title));
}

async function getLiveCanonicalWikiPages(): Promise<CanonicalWikiPageRecord[] | null> {
  if (!livePagePromise) {
    livePagePromise = buildLiveCanonicalWikiPages().catch(() => null);
  }

  return livePagePromise;
}

function getSnapshotPages(): CanonicalWikiPageRecord[] {
  return Array.isArray(SNAPSHOT.pages) ? SNAPSHOT.pages : [];
}

function matchPageRecord(
  records: CanonicalWikiPageRecord[],
  slugOrPath: string
): CanonicalWikiPageRecord | null {
  const normalizedInput = slugOrPath.trim().replace(/^\/+|\/+$/g, '').replace(/\.md$/i, '');
  const aliased = LEGACY_ALIASES[normalizedInput] || normalizedInput;
  const normalizedAliased = normalizeValue(aliased);

  const exactPath =
    records.find((record) => normalizeValue(record.path) === normalizedAliased) ||
    records.find((record) => normalizeValue(record.relativePath.replace(/\.md$/, '')) === normalizedAliased);

  if (exactPath) {
    return exactPath;
  }

  const stem = aliased.split('/').pop() || aliased;
  const stemMatches = records.filter((record) => normalizeValue(record.stem) === normalizeValue(stem));

  if (stemMatches.length === 1) {
    return stemMatches[0];
  }

  return null;
}

export async function getCanonicalWikiPages(): Promise<CanonicalWikiPageRecord[]> {
  const [supabasePages, livePages] = await Promise.all([
    getSupabaseCanonicalWikiPages(),
    getLiveCanonicalWikiPages(),
  ]);
  // Merge: live filesystem (Obsidian) wins on slug conflict.
  // Supabase fills in slugs not on disk; snapshot is final fallback when no live tier.
  const byPath = new Map<string, CanonicalWikiPageRecord>();
  if (supabasePages) {
    for (const record of supabasePages) byPath.set(record.path, record);
  }
  const primary =
    livePages && livePages.length > 0 ? livePages : getSnapshotPages();
  for (const record of primary) byPath.set(record.path, record);
  return Array.from(byPath.values());
}

export async function getCanonicalWikiPage(
  slugOrPath: string
): Promise<CanonicalWikiPageMatch | null> {
  // Live filesystem (Obsidian) is source of truth — try it first.
  const livePages = await getLiveCanonicalWikiPages();
  if (livePages?.length) {
    const liveMatch = matchPageRecord(livePages, slugOrPath);
    if (liveMatch) {
      return { ...liveMatch, source: 'live-wiki' };
    }
  }

  // Supabase is a warm mirror — covers slugs not on disk (deployed environments
  // without the canonical wiki repo mounted, or pages authored elsewhere).
  const supabasePages = await getSupabaseCanonicalWikiPages();
  if (supabasePages?.length) {
    const match = matchPageRecord(supabasePages, slugOrPath);
    if (match) {
      return { ...match, source: 'supabase' };
    }
  }

  const snapshotMatch = matchPageRecord(getSnapshotPages(), slugOrPath);
  if (!snapshotMatch) {
    return null;
  }
  return { ...snapshotMatch, source: 'snapshot' };
}

export async function filterCanonicalWikiPages(options?: {
  query?: string;
  section?: string;
  project?: string;
}): Promise<CanonicalWikiPageRecord[]> {
  const pages = await getCanonicalWikiPages();
  let filtered = [...pages];

  if (options?.section && options.section !== 'all') {
    filtered = filtered.filter((page) => page.sectionId === options.section);
  }

  if (options?.project && options.project !== 'all') {
    const token = normalizeValue(options.project);
    const aliases = new Set([
      token,
      normalizeValue(LEGACY_ALIASES[options.project] || ''),
      normalizeValue(options.project.replace(/^the-/, '')),
    ]);

    filtered = filtered.filter((page) => {
      const haystack = normalizeValue(`${page.path} ${page.title} ${page.content}`);
      return [...aliases].some((alias) => alias && haystack.includes(alias));
    });
  }

  if (options?.query) {
    const query = normalizeValue(options.query).replace(/-/g, ' ');
    filtered = filtered.filter((page) => {
      const haystack = `${page.title} ${page.excerpt || ''} ${page.content}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  return filtered;
}

export function getCanonicalWikiSections(pages: CanonicalWikiPageRecord[]) {
  const groups = new Map<string, { id: string; title: string; count: number }>();

  for (const page of pages) {
    if (!groups.has(page.sectionId)) {
      groups.set(page.sectionId, {
        id: page.sectionId,
        title: page.sectionTitle,
        count: 0,
      });
    }

    const group = groups.get(page.sectionId);
    if (group) {
      group.count += 1;
    }
  }

  return [...groups.values()].sort((left, right) => {
    const leftIndex = CANONICAL_SECTION_ORDER.indexOf(left.id as (typeof CANONICAL_SECTION_ORDER)[number]);
    const rightIndex = CANONICAL_SECTION_ORDER.indexOf(right.id as (typeof CANONICAL_SECTION_ORDER)[number]);
    const leftRank = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const rightRank = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
    return leftRank - rightRank;
  });
}

/**
 * Lightweight list of all wiki pages for index/search views.
 * Strips the heavy `content` field so the payload stays small when passed to
 * a client component. Falls through Supabase → live filesystem → snapshot.
 * Pages are returned sorted by title (case-insensitive).
 */
export async function listAllWikiPages(): Promise<CanonicalWikiPageListItem[]> {
  const pages = await getCanonicalWikiPages();
  const items: CanonicalWikiPageListItem[] = pages
    // Obsidian convention: underscore-prefixed files are drafts/templates/scratch.
    // Filter defensively in case any upstream source tier (snapshot, Supabase) leaks them.
    .filter((page) => !page.stem.startsWith('_') && !page.relativePath.split('/').some((seg) => seg.startsWith('_')))
    .map((page) => ({
      title: page.title,
      excerpt: page.excerpt,
      sectionId: page.sectionId,
      sectionTitle: page.sectionTitle,
      stem: page.stem,
      path: page.path,
      relativePath: page.relativePath,
      modifiedAt: page.modifiedAt,
    }));
  return items.sort((left, right) =>
    left.title.localeCompare(right.title, 'en', { sensitivity: 'base' })
  );
}

export async function renderCanonicalWikiMarkdown(content: string): Promise<string> {
  const pages = await getCanonicalWikiPages();

  const withWikilinks = content.replace(/\[\[([^\]]+)\]\]/g, (_match, inner) => {
    const [target, label] = inner.split('|');
    const resolved = matchPageRecord(pages, target.trim());
    const displayText = (label || target).trim();

    if (!resolved) {
      return displayText;
    }

    return `[${displayText}](/wiki/${resolved.stem})`;
  });

  // Resolve raw Obsidian-style markdown links: [text](../sources/foo.md) or [text](foo.md#anchor).
  // External links (http/https/mailto) pass through untouched; unresolved .md targets
  // degrade to plain text so we never ship broken hrefs to the browser.
  return withWikilinks.replace(
    /\[([^\]]+)\]\(([^)\s]+?\.md)(#[^)]*)?\)/g,
    (_match, label, mdPath, anchor) => {
      if (/^(https?:|mailto:|\/\/)/i.test(mdPath)) return _match;
      const resolved = matchPageRecord(pages, mdPath);
      if (!resolved) return label;
      return `[${label}](/wiki/${resolved.stem}${anchor || ''})`;
    }
  );
}
