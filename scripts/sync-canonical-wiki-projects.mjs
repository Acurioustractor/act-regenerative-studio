import fs from 'node:fs/promises';
import path from 'node:path';

import { globSync } from 'glob';
import matter from 'gray-matter';

const SECTION_HEADINGS = ['What It Is', 'Overview', 'Purpose', 'Identity'];
const PROJECTS_OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/wiki-projects.generated.json'
);

function normalizeUrl(value) {
  if (!value) return null;

  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

function isGenericDeployHost(value) {
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

function resolvePublicSiteUrl(audit) {
  if (!audit) return null;

  const customDomain = normalizeUrl(audit.sources?.customDomain);
  if (customDomain) {
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

  return normalizeUrl(audit.canonicalUrl);
}

function normalizeWhitespace(value) {
  return value.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function normalizeMetadataValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value)
    .trim()
    .replace(/^`+|`+$/g, '')
    .trim();

  return normalized || null;
}

function normalizePathValue(value) {
  const normalized = normalizeMetadataValue(value);
  if (!normalized) return null;
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function inferCluster(relativePath, frontmatterCluster) {
  const explicit = normalizeMetadataValue(frontmatterCluster);
  if (explicit) return explicit;

  const segments = relativePath.split('/');
  return segments.length > 1 ? segments[0] : null;
}

function inferPublicSurface(frontmatterSurface, entityType) {
  const explicit = normalizeMetadataValue(frontmatterSurface);
  if (explicit) return explicit;

  const normalizedEntityType = normalizeMetadataValue(entityType);
  if (!normalizedEntityType) return 'project';
  if (normalizedEntityType.includes('work')) return 'work';
  if (normalizedEntityType.includes('hub')) return 'hub';
  return 'project';
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

function parseSummary(content) {
  const summaryMatch = content.match(/^>\s+(.+)$/m);
  return summaryMatch?.[1]?.trim() || null;
}

function extractSection(content, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sectionPattern = new RegExp(
    `^##\\s+${escapedHeading}\\s*$([\\s\\S]*?)(?=^##\\s+|\\Z)`,
    'm'
  );
  const match = content.match(sectionPattern);
  return match?.[1]?.trim() || null;
}

function parseMetadata(content, frontmatter = {}) {
  const metadataMatch = content.match(
    /\*\*Status:\*\*\s*([^|\n]+?)(?:\s*\|\s*\*\*Code:\*\*\s*([^|\n]+?))?(?:\s*\|\s*\*\*Tier:\*\*\s*([^|\n]+?))?\s*(?:\n|$)/
  );

  return {
    status: normalizeMetadataValue(metadataMatch?.[1] || frontmatter.status),
    code: normalizeMetadataValue(metadataMatch?.[2] || frontmatter.code),
    tier: normalizeMetadataValue(metadataMatch?.[3] || frontmatter.tier),
  };
}

async function loadProjectIdentityRules(wikiRoot) {
  const rulesPath = path.resolve(wikiRoot, '..', 'config', 'project-identity-rules.json');

  try {
    const raw = await fs.readFile(rulesPath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.entities || {};
  } catch {
    return {};
  }
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

async function loadProjectRecords(wikiRoot) {
  const urlAuditMap = await loadUrlAuditMap(wikiRoot);
  const identityRules = await loadProjectIdentityRules(wikiRoot);
  const projectFiles = globSync('projects/**/*.md', {
    cwd: wikiRoot,
    ignore: ['**/README.md', '**/_*.md'],
    nodir: true,
  });

  const records = await Promise.all(
    projectFiles.map(async (relativePath) => {
      const absolutePath = path.join(wikiRoot, relativePath);
      const [rawContent, stats] = await Promise.all([
        fs.readFile(absolutePath, 'utf8'),
        fs.stat(absolutePath),
      ]);

      const { content, data } = matter(rawContent);
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const overview =
        SECTION_HEADINGS.map((heading) => extractSection(content, heading)).find(Boolean) || null;
      const metadata = parseMetadata(content, data);
      const slug = path.basename(relativePath, '.md');
      const identityRule = identityRules[slug] || {};
      const audit = urlAuditMap.get(slug) || null;
      const canonicalSlug =
        normalizeMetadataValue(data.canonical_slug || identityRule.canonical_slug) || slug;
      const canonicalCode =
        normalizeMetadataValue(data.canonical_code || metadata.code || identityRule.canonical_code);
      const entityType =
        normalizeMetadataValue(data.entity_type || identityRule.entity_type) ||
        (canonicalCode ? 'project' : null);
      const taggingMode =
        normalizeMetadataValue(data.tagging_mode || identityRule.tagging_mode) ||
        (canonicalCode ? 'own-code' : null);
      const websiteSlug =
        normalizeMetadataValue(data.website_slug) || canonicalSlug || slug;
      const websitePath =
        normalizePathValue(data.website_path) || `/projects/${websiteSlug}`;
      const publicSurface = inferPublicSurface(data.public_surface, entityType);
      const cluster = inferCluster(relativePath, data.cluster);
      const parentProject =
        normalizeMetadataValue(data.parent_project) ||
        (taggingMode !== 'own-code' ? normalizeMetadataValue(identityRule.canonical_slug) : null);
      const empathyLedgerKey =
        normalizeMetadataValue(data.empathy_ledger_key || data.empathy_ledger_project) ||
        canonicalSlug;

      return {
        slug,
        title: titleMatch?.[1]?.trim() || slug,
        summary: stripMarkdown(parseSummary(content)),
        overview: stripMarkdown(overview),
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
      };
    })
  );

  return records.sort((left, right) => left.title.localeCompare(right.title));
}

async function loadUrlAuditMap(wikiRoot) {
  const auditPath = path.join(wikiRoot, 'decisions', 'url-audit-latest.json');

  try {
    const raw = await fs.readFile(auditPath, 'utf8');
    const parsed = JSON.parse(raw);
    const results = Array.isArray(parsed.results) ? parsed.results : [];
    return new Map(results.map((entry) => [entry.slug, entry]));
  } catch {
    return new Map();
  }
}

async function main() {
  const wikiRoot = await resolveCanonicalWikiRoot();

  if (!wikiRoot) {
    try {
      await fs.access(PROJECTS_OUTPUT_PATH);
      console.log(`canonical wiki not found, keeping existing snapshot at ${PROJECTS_OUTPUT_PATH}`);
      return;
    } catch {
      const emptySnapshot = {
        generatedAt: new Date().toISOString(),
        sourceRoot: null,
        projectCount: 0,
        projects: [],
      };
      await fs.writeFile(PROJECTS_OUTPUT_PATH, `${JSON.stringify(emptySnapshot, null, 2)}\n`);
      console.log(`canonical wiki not found, wrote empty snapshot to ${PROJECTS_OUTPUT_PATH}`);
      return;
    }
  }

  const projects = await loadProjectRecords(wikiRoot);
  const snapshot = {
    generatedAt: new Date().toISOString(),
    sourceRoot: wikiRoot,
    projectCount: projects.length,
    projects,
  };

  await fs.writeFile(PROJECTS_OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`synced ${projects.length} canonical wiki projects to ${PROJECTS_OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
