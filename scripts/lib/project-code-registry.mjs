import fs from 'node:fs/promises';
import path from 'node:path';

export const PROJECT_CODE_REGISTRY_OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/project-code-registry.generated.json'
);

export const WIKI_PROJECTS_PATH = path.resolve(
  process.cwd(),
  'src/data/wiki-projects.generated.json'
);

export const PROJECTS_TS_PATH = path.resolve(process.cwd(), 'src/data/projects.ts');

export function normalizeProjectLookupValue(value) {
  if (!value) return null;

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeMetadataValue(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value)
    .trim()
    .replace(/^`+|`+$/g, '')
    .trim();

  return normalized || null;
}

export function createEmptyProjectCodeRegistry() {
  return {
    generatedAt: new Date().toISOString(),
    sourceConfigPath: null,
    projectCount: 0,
    unresolvedWikiProjectSlugs: [],
    projects: [],
  };
}

export async function readJsonIfExists(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function loadProjectCodeRegistrySnapshot() {
  return readJsonIfExists(
    PROJECT_CODE_REGISTRY_OUTPUT_PATH,
    createEmptyProjectCodeRegistry()
  );
}

export function findProjectRegistryRecord(snapshot, projectSlug) {
  const normalizedSlug = normalizeProjectLookupValue(projectSlug);
  if (!normalizedSlug) return null;

  return (
    snapshot.projects.find((record) => {
      if (record.canonicalSlug === projectSlug) {
        return true;
      }

      return Array.isArray(record.lookupKeys)
        ? record.lookupKeys.includes(normalizedSlug)
        : false;
    }) || null
  );
}

export function getProjectKeyCandidates(projectSlug, wikiRecord, snapshot) {
  const record = findProjectRegistryRecord(snapshot, projectSlug);
  const candidates = new Set([
    projectSlug,
    wikiRecord?.code,
    wikiRecord?.title,
    wikiRecord?.slug,
  ]);

  for (const candidate of record?.queryAliases || record?.aliases || []) {
    candidates.add(candidate);
  }

  return Array.from(candidates)
    .map((value) => (value === null || value === undefined ? null : String(value).trim()))
    .filter(Boolean);
}

export function buildProjectSlugLookup(snapshot) {
  const lookup = new Map();

  for (const record of snapshot.projects || []) {
    if (!record?.canonicalSlug) continue;

    const values = new Set([
      record.canonicalSlug,
      record.code,
      record.name,
      ...(record.aliases || []),
      ...(record.lookupKeys || []),
    ]);

    for (const value of values) {
      const normalized = normalizeProjectLookupValue(value);
      if (!normalized) continue;
      if (!lookup.has(normalized)) {
        lookup.set(normalized, record.canonicalSlug);
      }
    }
  }

  return lookup;
}
