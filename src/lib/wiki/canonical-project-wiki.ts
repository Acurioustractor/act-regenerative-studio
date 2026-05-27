import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';

import { glob } from 'glob';
import matter from 'gray-matter';

import snapshot from '@/data/wiki-projects.generated.json';

export type CanonicalWikiSource = 'live-wiki' | 'snapshot';

export interface CanonicalWikiProjectRecord {
  slug: string;
  title: string;
  summary: string | null;
  overview: string | null;
  status: string | null;
  code: string | null;
  tier: string | null;
  canonicalSlug: string;
  canonicalCode: string | null;
  entityType: string | null;
  taggingMode: string | null;
  cluster: string | null;
  parentProject: string | null;
  websiteSlug: string;
  relativePath: string;
  websitePath: string;
  projectPagePath: string;
  publicSurface: string;
  empathyLedgerKey: string | null;
  publicSiteUrl: string | null;
  canonicalUrl: string | null;
  repoUrl: string | null;
  deployUrl: string | null;
  modifiedAt: string | null;
}

export interface CanonicalWikiProjectMatch extends CanonicalWikiProjectRecord {
  source: CanonicalWikiSource;
}

interface CanonicalWikiProjectsSnapshot {
  generatedAt: string;
  sourceRoot: string | null;
  projectCount: number;
  projects: CanonicalWikiProjectRecord[];
}

const SNAPSHOT = snapshot as CanonicalWikiProjectsSnapshot;

const SECTION_HEADINGS = [
  'What It Is',
  'Overview',
  'Purpose',
  'Identity',
];

const PROJECT_SLUG_ALIASES: Record<string, string[]> = {
  'goods-tennant-creek': ['goods'],
  'goods-on-country': ['goods'],
};

let liveRecordPromise: Promise<CanonicalWikiProjectRecord[] | null> | null = null;

type UrlAuditResult = {
  slug: string;
  canonicalUrl?: string | null;
  repo?: {
    url?: string | null;
  } | null;
  sources?: {
    customDomain?: string | null;
    repoHomepage?: string | null;
    deployUrl?: string | null;
  } | null;
};

function normalizeValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeMetadataValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value)
    .trim()
    .replace(/^`+|`+$/g, '')
    .trim();

  return normalized || null;
}

function normalizePathValue(value: unknown): string | null {
  const normalized = normalizeMetadataValue(value);
  if (!normalized) return null;
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function inferCluster(relativePath: string, frontmatterCluster: unknown): string | null {
  const explicit = normalizeMetadataValue(frontmatterCluster);
  if (explicit) return explicit;

  const segments = relativePath.split('/');
  return segments.length > 1 ? segments[0] : null;
}

function inferPublicSurface(frontmatterSurface: unknown, entityType: string | null): string {
  const explicit = normalizeMetadataValue(frontmatterSurface);
  if (explicit) return explicit;

  const normalizedEntityType = normalizeMetadataValue(entityType);
  if (!normalizedEntityType) return 'project';
  if (normalizedEntityType.includes('work')) return 'work';
  if (normalizedEntityType.includes('hub')) return 'hub';
  return 'project';
}

function parseSummary(content: string): string | null {
  const summaryMatch = content.match(/^>\s+(.+)$/m);
  return summaryMatch?.[1]?.trim() || null;
}

function extractSection(content: string, heading: string): string | null {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sectionPattern = new RegExp(
    `^##\\s+${escapedHeading}\\s*$([\\s\\S]*?)(?=^##\\s+|\\Z)`,
    'm'
  );
  const match = content.match(sectionPattern);

  if (!match?.[1]) {
    return null;
  }

  const cleaned = match[1]
    .trim()
    .replace(/\n{3,}/g, '\n\n');

  return cleaned || null;
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

function parseMetadata(
  content: string,
  frontmatter: Record<string, unknown> = {}
): Pick<CanonicalWikiProjectRecord, 'status' | 'code' | 'tier'> {
  const metadataMatch = content.match(
    /\*\*Status:\*\*\s*([^|\n]+?)(?:\s*\|\s*\*\*Code:\*\*\s*([^|\n]+?))?(?:\s*\|\s*\*\*Tier:\*\*\s*([^|\n]+?))?\s*(?:\n|$)/
  );

  return {
    status: normalizeMetadataValue(metadataMatch?.[1] || frontmatter.status),
    code: normalizeMetadataValue(metadataMatch?.[2] || frontmatter.code),
    tier: normalizeMetadataValue(metadataMatch?.[3] || frontmatter.tier),
  };
}

type IdentityRuleEntry = {
  entity_type?: string | null;
  tagging_mode?: string | null;
  canonical_slug?: string | null;
  canonical_code?: string | null;
};

async function loadProjectIdentityRules(wikiRoot: string): Promise<Record<string, IdentityRuleEntry>> {
  const rulesPath = path.resolve(wikiRoot, '..', 'config', 'project-identity-rules.json');

  try {
    const raw = await fs.readFile(rulesPath, 'utf8');
    const parsed = JSON.parse(raw) as { entities?: Record<string, IdentityRuleEntry> };
    return parsed.entities || {};
  } catch {
    return {};
  }
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

function normalizeUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

function isGenericDeployHost(value: string | null | undefined): boolean {
  if (!value) return false;

  try {
    const host = new URL(value).hostname.toLowerCase();
    return (
      host === 'localhost' ||
      host.endsWith('.vercel.app') ||
      host.endsWith('.netlify.app') ||
      host.endsWith('.pages.dev') ||
      host.endsWith('.webflow.io')
    );
  } catch {
    return false;
  }
}

function resolvePublicSiteUrl(audit: UrlAuditResult | null): string | null {
  if (!audit) return null;

  const customDomain = normalizeUrl(audit.sources?.customDomain);
  if (customDomain && !isGenericDeployHost(customDomain)) {
    return customDomain;
  }

  const deployUrl = normalizeUrl(audit.sources?.deployUrl);
  if (deployUrl && !isGenericDeployHost(deployUrl)) {
    return deployUrl;
  }

  const repoHomepage = normalizeUrl(audit.sources?.repoHomepage);
  if (repoHomepage && !isGenericDeployHost(repoHomepage)) {
    return repoHomepage;
  }

  // Filter the final fallback too: a preview/deploy host in canonicalUrl must
  // not become a public-facing "Project website" link.
  const canonicalUrl = normalizeUrl(audit.canonicalUrl);
  return canonicalUrl && !isGenericDeployHost(canonicalUrl) ? canonicalUrl : null;
}

async function loadUrlAuditMap(wikiRoot: string): Promise<Map<string, UrlAuditResult>> {
  const auditPath = path.join(wikiRoot, 'decisions', 'url-audit-latest.json');

  try {
    const raw = await fs.readFile(auditPath, 'utf8');
    const parsed = JSON.parse(raw) as { results?: UrlAuditResult[] };
    const results = Array.isArray(parsed.results) ? parsed.results : [];

    return new Map(results.map((entry) => [entry.slug, entry]));
  } catch {
    return new Map();
  }
}

// Collapse records that resolve to the same slug (e.g. a project referenced
// from more than one cluster folder). Prefer the shallower path, which is the
// canonical top-level definition.
function dedupeCanonicalRecordsBySlug(
  records: CanonicalWikiProjectRecord[]
): CanonicalWikiProjectRecord[] {
  const bySlug = new Map<string, CanonicalWikiProjectRecord>();
  for (const record of records) {
    const existing = bySlug.get(record.slug);
    if (
      !existing ||
      record.relativePath.split('/').length < existing.relativePath.split('/').length
    ) {
      bySlug.set(record.slug, record);
    }
  }
  return [...bySlug.values()];
}

async function buildLiveCanonicalProjectRecords(): Promise<CanonicalWikiProjectRecord[] | null> {
  const wikiRoot = await resolveCanonicalWikiRoot();

  if (!wikiRoot) {
    return null;
  }

  const projectFiles = await glob('projects/**/*.md', {
    cwd: wikiRoot,
    // Provenance sidecars (*.provenance.md) are metadata, never public projects.
    ignore: ['**/README.md', '**/_*.md', '**/*.provenance.md'],
    nodir: true,
  });
  const urlAuditMap = await loadUrlAuditMap(wikiRoot);
  const identityRules = await loadProjectIdentityRules(wikiRoot);

  const records = await Promise.all(
    projectFiles.map(async (relativePath) => {
      const absolutePath = path.join(wikiRoot, relativePath);
      const [rawContent, stats] = await Promise.all([
        fs.readFile(absolutePath, 'utf8'),
        fs.stat(absolutePath),
      ]);

      const { content, data } = matter(rawContent);

      // Skip internal R&D Tax Incentive registers and provenance docs — they
      // live inside project folders but are compliance artifacts, not public
      // projects. Keyed on frontmatter so renamed files stay excluded.
      if (
        data?.type === 'provenance' ||
        data?.claim_total_aud != null ||
        data?.ausindustry_registration != null
      ) {
        return null;
      }

      const titleMatch = content.match(/^#\s+(.+)$/m);
      const overviewSection =
        SECTION_HEADINGS.map((heading) => extractSection(content, heading)).find(Boolean) || null;
      const baseSlug = path.basename(relativePath, '.md');
      const metadata = parseMetadata(content, data);
      const identityRule = identityRules[baseSlug] || {};
      const audit = urlAuditMap.get(baseSlug) || null;
      const canonicalSlug =
        normalizeMetadataValue(data.canonical_slug || identityRule.canonical_slug) || baseSlug;
      const canonicalCode =
        normalizeMetadataValue(data.canonical_code || metadata.code || identityRule.canonical_code);
      const entityType =
        normalizeMetadataValue(data.entity_type || identityRule.entity_type) ||
        (canonicalCode ? 'project' : null);
      const taggingMode =
        normalizeMetadataValue(data.tagging_mode || identityRule.tagging_mode) ||
        (canonicalCode ? 'own-code' : null);
      const websiteSlug =
        normalizeMetadataValue(data.website_slug) || canonicalSlug || baseSlug;
      const websitePath =
        normalizePathValue(data.website_path) || `/projects/${websiteSlug}`;
      const publicSurface = inferPublicSurface(data.public_surface, entityType);
      const cluster = inferCluster(relativePath, data.cluster);
      const parentProject =
        normalizeMetadataValue(data.parent_project) ||
        (taggingMode !== 'own-code'
          ? normalizeMetadataValue(identityRule.canonical_slug)
          : null);
      const empathyLedgerKey =
        normalizeMetadataValue(data.empathy_ledger_key || data.empathy_ledger_project) ||
        canonicalSlug;

      return {
        slug: baseSlug,
        title: titleMatch?.[1]?.trim() || baseSlug,
        summary: stripMarkdown(parseSummary(content)),
        overview: stripMarkdown(overviewSection),
        status: metadata.status,
        code: metadata.code,
        tier: metadata.tier,
        canonicalSlug,
        canonicalCode,
        entityType,
        taggingMode,
        cluster,
        parentProject,
        websiteSlug,
        relativePath,
        websitePath,
        projectPagePath: `/projects/${websiteSlug}`,
        publicSurface,
        empathyLedgerKey,
        publicSiteUrl: resolvePublicSiteUrl(audit),
        canonicalUrl: normalizeUrl(audit?.canonicalUrl),
        repoUrl: normalizeUrl(audit?.repo?.url),
        deployUrl: normalizeUrl(audit?.sources?.deployUrl),
        modifiedAt: stats.mtime.toISOString(),
      } satisfies CanonicalWikiProjectRecord;
    })
  );

  return dedupeCanonicalRecordsBySlug(
    records.filter((record): record is NonNullable<typeof record> => record !== null)
  ).sort((left, right) => left.title.localeCompare(right.title));
}

async function getLiveCanonicalProjectRecords(): Promise<CanonicalWikiProjectRecord[] | null> {
  if (!liveRecordPromise) {
    liveRecordPromise = buildLiveCanonicalProjectRecords().catch(() => null);
  }

  return liveRecordPromise;
}

function matchProjectRecord(
  records: CanonicalWikiProjectRecord[],
  projectSlug: string,
  projectTitle?: string
): CanonicalWikiProjectRecord | null {
  const normalizedSlug = normalizeValue(projectSlug);
  const aliasCandidates = PROJECT_SLUG_ALIASES[projectSlug] || [];
  const candidateKeys = new Set([
    normalizedSlug,
    ...aliasCandidates.map(normalizeValue),
  ]);
  const normalizedTitle = projectTitle ? normalizeValue(projectTitle) : null;

  const exactRecord =
    records.find(
      (record) =>
        candidateKeys.has(normalizeValue(record.slug)) ||
        candidateKeys.has(normalizeValue(record.canonicalSlug)) ||
        candidateKeys.has(normalizeValue(record.websiteSlug))
    ) ||
    records.find((record) => candidateKeys.has(normalizeValue(record.relativePath.replace(/\.md$/, ''))));

  if (exactRecord) {
    return exactRecord;
  }

  if (normalizedTitle) {
    const titleMatch = records.find((record) => normalizeValue(record.title) === normalizedTitle);
    if (titleMatch) {
      return titleMatch;
    }
  }

  return null;
}

function getSnapshotRecords(): CanonicalWikiProjectRecord[] {
  return Array.isArray(SNAPSHOT.projects) ? SNAPSHOT.projects : [];
}

export async function getCanonicalWikiProject(
  projectSlug: string,
  projectTitle?: string
): Promise<CanonicalWikiProjectMatch | null> {
  const liveRecords = await getLiveCanonicalProjectRecords();

  if (liveRecords && liveRecords.length > 0) {
    const liveRecord = matchProjectRecord(liveRecords, projectSlug, projectTitle);
    if (liveRecord) {
      return {
        ...liveRecord,
        source: 'live-wiki',
      };
    }
  }

  const snapshotRecord = matchProjectRecord(getSnapshotRecords(), projectSlug, projectTitle);

  if (!snapshotRecord) {
    return null;
  }

  return {
    ...snapshotRecord,
    source: 'snapshot',
  };
}

export async function getCanonicalWikiProjectRecords(): Promise<CanonicalWikiProjectRecord[]> {
  const liveRecords = await getLiveCanonicalProjectRecords();
  return liveRecords && liveRecords.length > 0 ? liveRecords : getSnapshotRecords();
}
