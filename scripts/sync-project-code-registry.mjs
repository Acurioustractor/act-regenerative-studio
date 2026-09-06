import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  PROJECT_CODE_REGISTRY_OUTPUT_PATH,
  PROJECTS_TS_PATH,
  WIKI_PROJECTS_PATH,
  createEmptyProjectCodeRegistry,
  normalizeMetadataValue,
  normalizeProjectLookupValue,
  readJsonIfExists,
} from './lib/project-code-registry.mjs';

const CONFIG_PATH_CANDIDATES = [
  process.env.ACT_PROJECT_CODES_PATH,
  path.resolve(process.cwd(), '../act-global-infrastructure/config/project-codes.json'),
  path.resolve(process.cwd(), '../act-ecosystem/config/project-codes.json'),
].filter(Boolean);

function titleToSlug(value) {
  return normalizeProjectLookupValue(value);
}

function buildAliasSet(project) {
  const aliases = new Set([
    project.code,
    project.canonical_slug,
    project.name,
    ...(project.slug_aliases || []),
    ...(project.legacy_codes || []),
    ...(project.ghl_tags || []),
    ...(project.notion_pages || []),
    ...(project.xero_tracking_aliases || []),
    project.syndication_slug
      ? String(project.syndication_slug).replace(/_/g, '-')
      : null,
  ]);

  if (project.xero_tracking) {
    aliases.add(project.xero_tracking);
    const [, trackingLabel] = String(project.xero_tracking).split('—');
    if (trackingLabel?.trim()) {
      aliases.add(trackingLabel.trim());
    }
  }

  return Array.from(aliases)
    .map(normalizeMetadataValue)
    .filter(Boolean);
}

function buildQueryAliasSet(project) {
  const aliases = [
    project.canonical_slug,
    project.code,
    ...(project.legacy_codes || []),
    ...(project.slug_aliases || []),
    project.name,
    ...(project.ghl_tags || []).slice(0, 2),
    ...(project.notion_pages || []).slice(0, 2),
    project.syndication_slug
      ? String(project.syndication_slug).replace(/_/g, '-')
      : null,
  ];

  return Array.from(new Set(aliases))
    .map(normalizeMetadataValue)
    .filter(Boolean)
    .slice(0, 4);
}

async function resolveConfigPath() {
  for (const candidate of CONFIG_PATH_CANDIDATES) {
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

async function loadStaticProjectRecords() {
  const raw = await fs.readFile(PROJECTS_TS_PATH, 'utf8');
  const records = [];
  const pattern = /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"/g;

  let match = pattern.exec(raw);
  while (match) {
    records.push({
      slug: match[1],
      title: match[2],
    });
    match = pattern.exec(raw);
  }

  return records;
}

function buildRecordMaps(records) {
  const bySlug = new Map();
  const byCode = new Map();
  const byTitle = new Map();

  for (const record of records) {
    if (record.slug) {
      bySlug.set(record.slug, record);
      const normalizedSlug = normalizeProjectLookupValue(record.slug);
      if (normalizedSlug) bySlug.set(normalizedSlug, record);
    }

    if (record.code) {
      const normalizedCode = normalizeProjectLookupValue(record.code);
      if (normalizedCode) byCode.set(normalizedCode, record);
    }

    if (record.title) {
      const normalizedTitle = normalizeProjectLookupValue(record.title);
      if (normalizedTitle) byTitle.set(normalizedTitle, record);
    }
  }

  return { bySlug, byCode, byTitle };
}

function resolveMatchedRecord(project, maps) {
  const explicitSlug = normalizeMetadataValue(project.canonical_slug);
  if (explicitSlug && maps.bySlug.has(explicitSlug)) {
    return maps.bySlug.get(explicitSlug);
  }

  const allCodes = [project.code, ...(project.legacy_codes || [])];
  for (const code of allCodes) {
    const normalizedCode = normalizeProjectLookupValue(code);
    if (!normalizedCode) continue;
    if (maps.byCode.has(normalizedCode)) {
      return maps.byCode.get(normalizedCode);
    }
  }

  const aliases = buildAliasSet(project);
  for (const alias of aliases) {
    const normalizedAlias = normalizeProjectLookupValue(alias);
    if (!normalizedAlias) continue;

    if (maps.bySlug.has(normalizedAlias)) {
      return maps.bySlug.get(normalizedAlias);
    }

    if (maps.byTitle.has(normalizedAlias)) {
      return maps.byTitle.get(normalizedAlias);
    }
  }

  return null;
}

async function keepExistingSnapshot(reason) {
  try {
    await fs.access(PROJECT_CODE_REGISTRY_OUTPUT_PATH);
    console.log(
      `${reason}, keeping existing project code registry at ${PROJECT_CODE_REGISTRY_OUTPUT_PATH}`
    );
    return;
  } catch {
    const emptySnapshot = createEmptyProjectCodeRegistry();
    await fs.writeFile(
      PROJECT_CODE_REGISTRY_OUTPUT_PATH,
      `${JSON.stringify(emptySnapshot, null, 2)}\n`
    );
    console.log(
      `${reason}, wrote empty project code registry to ${PROJECT_CODE_REGISTRY_OUTPUT_PATH}`
    );
  }
}

/**
 * Load the registry through @act/projects when the infra checkout is beside this
 * repo. The package parses config/project-codes.json with its schema and guards,
 * so a malformed file fails here instead of producing a half-built snapshot.
 * Falls back to the raw JSON (no guards) when the package is absent, e.g. on
 * Vercel, where the build keeps the committed snapshot anyway.
 */
async function loadConfig(configPath) {
  const packageEntry = path.resolve(path.dirname(configPath), '../packages/act-projects/src/index.mjs');
  try {
    await fs.access(packageEntry);
  } catch {
    console.warn(`@act/projects not found at ${packageEntry}; reading project-codes.json without guards`);
    return { config: await readJsonIfExists(configPath, null), guarded: false };
  }
  const mod = await import(pathToFileURL(packageEntry).href);
  const { projects, gaps } = mod.loadProjects({ path: configPath });
  if (gaps.length) {
    console.warn(`@act/projects reports ${gaps.length} gap(s); run pnpm projects:check in the infra repo`);
  }
  return { config: { projects }, guarded: true };
}

async function main() {
  const configPath = await resolveConfigPath();

  if (!configPath) {
    await keepExistingSnapshot('project codes config not found');
    return;
  }

  const { config, guarded } = await loadConfig(configPath);
  if (!config?.projects || typeof config.projects !== 'object') {
    await keepExistingSnapshot(`project codes config unreadable at ${configPath}`);
    return;
  }

  const wikiSnapshot = await readJsonIfExists(WIKI_PROJECTS_PATH, { projects: [] });
  const staticProjects = await loadStaticProjectRecords();
  const wikiRecords = Array.isArray(wikiSnapshot.projects) ? wikiSnapshot.projects : [];

  const wikiMaps = buildRecordMaps(wikiRecords);
  const staticMaps = buildRecordMaps(staticProjects);

  const projects = Object.values(config.projects).map((project) => {
    const wikiMatch = resolveMatchedRecord(project, wikiMaps);
    const staticMatch = resolveMatchedRecord(project, staticMaps);

    const canonicalSlug =
      normalizeMetadataValue(project.canonical_slug) ||
      wikiMatch?.slug ||
      staticMatch?.slug ||
      titleToSlug(project.name);

    const aliases = new Set([
      canonicalSlug,
      wikiMatch?.slug,
      staticMatch?.slug,
      ...buildAliasSet(project),
    ]);
    const queryAliases = new Set([
      canonicalSlug,
      wikiMatch?.slug,
      staticMatch?.slug,
      ...buildQueryAliasSet(project),
    ]);

    if (wikiMatch?.code && wikiMatch.code !== project.code) {
      aliases.add(wikiMatch.code);
      queryAliases.add(wikiMatch.code);
    }

    const normalizedAliases = Array.from(aliases)
      .map(normalizeMetadataValue)
      .filter(Boolean);
    const normalizedQueryAliases = Array.from(queryAliases)
      .map(normalizeMetadataValue)
      .filter(Boolean);

    const lookupKeys = Array.from(
      new Set(
        normalizedAliases
          .map(normalizeProjectLookupValue)
          .filter(Boolean)
      )
    );

    return {
      code: project.code,
      name: project.name,
      status: project.status || null,
      tier: project.tier || null,
      category: project.category || null,
      canonicalSlug,
      wikiSlug: wikiMatch?.slug || null,
      staticSlug: staticMatch?.slug || null,
      aliases: normalizedAliases,
      queryAliases: normalizedQueryAliases,
      lookupKeys,
      legacyCodes: Array.isArray(project.legacy_codes)
        ? project.legacy_codes.map(normalizeMetadataValue).filter(Boolean)
        : [],
      notionPages: Array.isArray(project.notion_pages) ? project.notion_pages : [],
      ghlTags: Array.isArray(project.ghl_tags) ? project.ghl_tags : [],
      xeroTracking: project.xero_tracking || null,
      productionUrl: project.production_url || project.sites?.find((s) => s.role === 'primary')?.production_url || null,
      syndicationSlug: project.syndication_slug || project.empathy_ledger?.syndication_slug || null,
      // Typed blocks from @act/projects (PR infra#235..#238). Absent when the
      // file was read without the package.
      internal: Boolean(project.internal),
      parentProject: project.parent_project || null,
      wikiPath: project.wiki_path || null,
      sites: (project.sites || []).map((s) => ({
        role: s.role || 'primary',
        productionUrl: s.production_url || null,
        vercelProjectId: s.vercel_project_id || null,
        vercelProjectName: s.vercel_project_name || null,
        githubRepo: s.github_repo || null,
      })),
      notion: { pageId: project.notion?.page_id || project.notion_page_id || null },
      empathyLedger: {
        tracked: project.empathy_ledger?.tracked !== false,
        projectId: project.empathy_ledger?.project_id || null,
        projectKey: project.empathy_ledger?.project_key || null,
        partnerCodes: project.empathy_ledger?.partner_codes || [],
      },
      art: project.art
        ? { media: project.art.media || [], tags: project.art.tags || [], pieceSlug: project.art.piece_slug }
        : null,
    };
  });

  const mappedSlugs = new Set(
    projects.map((project) => project.wikiSlug).filter(Boolean)
  );
  const unresolvedWikiProjectSlugs = wikiRecords
    .filter((record) => record.slug && !mappedSlugs.has(record.slug))
    .map((record) => record.slug)
    .sort();

  const snapshot = {
    generatedAt: new Date().toISOString(),
    sourceConfigPath: configPath,
    guarded,
    projectCount: projects.length,
    unresolvedWikiProjectSlugs,
    projects: projects.sort((left, right) => left.name.localeCompare(right.name)),
  };

  const outputPath = process.env.PROJECT_CODE_REGISTRY_OUTPUT || PROJECT_CODE_REGISTRY_OUTPUT_PATH;
  await fs.writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(`synced ${projects.length} canonical project codes to ${outputPath}${guarded ? '' : ' (unguarded)'}`);
  console.log(
    `resolved wiki slugs for ${wikiRecords.length - unresolvedWikiProjectSlugs.length}/${wikiRecords.length} wiki projects`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
