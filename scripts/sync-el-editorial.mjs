import fs from 'node:fs/promises';
import path from 'node:path';

import dotenv from 'dotenv';
import pLimit from 'p-limit';

import {
  buildProjectSlugLookup,
  loadProjectCodeRegistrySnapshot,
  normalizeProjectLookupValue,
} from './lib/project-code-registry.mjs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const EMPATHY_LEDGER_URL =
  process.env.EMPATHY_LEDGER_URL ||
  process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL ||
  'http://localhost:3030';

const EMPATHY_LEDGER_SITE_SLUG =
  process.env.EMPATHY_LEDGER_SITE_SLUG || 'act-regenerative-studio';

const EMPATHY_LEDGER_EDITORIAL_DESTINATION =
  process.env.EMPATHY_LEDGER_EDITORIAL_DESTINATION || 'act_el';

const DEFAULT_TIMEOUT_MS = Number.parseInt(
  process.env.EMPATHY_LEDGER_SYNC_TIMEOUT_MS || '8000',
  10
);

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  'src/data/empathy-ledger-editorial.generated.json'
);

const PROJECT_EDITORIAL_RECIPES_PATH = path.resolve(
  process.cwd(),
  'src/data/project-editorial-recipes.json'
);

const WIKI_PROJECTS_PATH = path.resolve(
  process.cwd(),
  'src/data/wiki-projects.generated.json'
);

const PROJECTS_TS_PATH = path.resolve(process.cwd(), 'src/data/projects.ts');

const IGNORED_PROJECT_KEYS = new Set([
  'act-main',
  'act-main-website',
  'act-place',
  'act-studio',
  'a-curious-tractor',
  'curious-tractor',
  'main-site',
]);

function createEmptySnapshot() {
  return {
    generatedAt: new Date().toISOString(),
    sourceUrl: null,
    siteSlug: EMPATHY_LEDGER_SITE_SLUG,
    featuredHomeArticleSlugs: [],
    featuredHomeProjectSlugs: [],
    featuredHomeMediaProjectSlugs: [],
    featuredHomeProjectMediaOverrides: {},
    articleCount: 0,
    projectArticleCounts: {},
    projectEditorial: {},
    articles: [],
  };
}

async function writeSnapshot(snapshot) {
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
}

async function keepExistingSnapshot(reason) {
  try {
    await fs.access(OUTPUT_PATH);
    console.log(`${reason}, keeping existing EL editorial snapshot at ${OUTPUT_PATH}`);
    return;
  } catch {
    const emptySnapshot = createEmptySnapshot();
    await writeSnapshot(emptySnapshot);
    console.log(`${reason}, wrote empty EL editorial snapshot to ${OUTPUT_PATH}`);
  }
}

async function loadWikiProjectRecords() {
  try {
    const raw = await fs.readFile(WIKI_PROJECTS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.projects) ? parsed.projects : [];
  } catch {
    return [];
  }
}

async function loadStaticProjectRecords() {
  const raw = await fs.readFile(PROJECTS_TS_PATH, 'utf8');
  const records = [];
  const pattern =
    /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"/g;

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

async function loadProjectEditorialRecipes() {
  try {
    const raw = await fs.readFile(PROJECT_EDITORIAL_RECIPES_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function fetchProjectEditorialRecipes() {
  const url = new URL('/api/v1/content-hub/editorial', EMPATHY_LEDGER_URL);
  url.searchParams.set('destination', EMPATHY_LEDGER_EDITORIAL_DESTINATION);
  url.searchParams.set('site', EMPATHY_LEDGER_SITE_SLUG);

  const payload = await fetchJson(url.toString());
  return {
    featuredHomeArticleSlugs: Array.isArray(payload?.featuredHomeArticleSlugs)
      ? payload.featuredHomeArticleSlugs
      : [],
    featuredHomeProjectSlugs: Array.isArray(payload?.featuredHomeProjectSlugs)
      ? payload.featuredHomeProjectSlugs
      : [],
    featuredHomeMediaProjectSlugs: Array.isArray(payload?.featuredHomeMediaProjectSlugs)
      ? payload.featuredHomeMediaProjectSlugs
      : [],
    featuredHomeProjectMediaOverrides:
      payload?.featuredHomeProjectMediaOverrides &&
      typeof payload.featuredHomeProjectMediaOverrides === 'object'
        ? payload.featuredHomeProjectMediaOverrides
        : {},
    projectEditorial:
      payload?.projectEditorial && typeof payload.projectEditorial === 'object'
        ? payload.projectEditorial
        : {},
  };
}

function buildProjectLookup(records) {
  const lookup = new Map();

  for (const record of records) {
    const candidates = new Set([
      record.slug,
      record.title,
      record.code,
    ]);

    for (const candidate of candidates) {
      const normalized = normalizeProjectLookupValue(candidate);
      if (!normalized) continue;
      lookup.set(normalized, record.slug);
    }
  }

  return lookup;
}

function buildHeaders() {
  const headers = {};
  if (process.env.EMPATHY_LEDGER_API_KEY) {
    headers['X-API-Key'] = process.env.EMPATHY_LEDGER_API_KEY;
  }
  return headers;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: buildHeaders(),
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
}

async function fetchAllSiteArticles() {
  const articles = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = new URL('/api/v1/content-hub/articles', EMPATHY_LEDGER_URL);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', '100');
    url.searchParams.set('destination', EMPATHY_LEDGER_EDITORIAL_DESTINATION);

    const payload = await fetchJson(url.toString());
    const pageItems = Array.isArray(payload.articles) ? payload.articles : [];
    articles.push(...pageItems);

    hasMore = Boolean(payload.pagination?.hasMore);
    page += 1;
  }

  return articles;
}

async function fetchArticleDetail(slug) {
  const url = new URL(`/api/v1/content-hub/articles/${slug}`, EMPATHY_LEDGER_URL);
  return fetchJson(url.toString());
}

function resolveProjectSlugs(detail, article, projectLookup, projectEditorialRecipes) {
  const candidates = [
    detail.primaryProject,
    ...(Array.isArray(detail.relatedProjects) ? detail.relatedProjects : []),
  ];

  const resolved = [];

  for (const candidate of candidates) {
    const normalized = normalizeProjectLookupValue(candidate);
    if (!normalized || IGNORED_PROJECT_KEYS.has(normalized)) continue;
    const slug = projectLookup.get(normalized);
    if (slug && !resolved.includes(slug)) {
      resolved.push(slug);
    }
  }

  const articleSlug = article.slug || detail.slug;

  for (const [projectSlug, recipe] of Object.entries(projectEditorialRecipes)) {
    if (!recipe || !Array.isArray(recipe.featuredArticleSlugs)) continue;
    if (recipe.featuredArticleSlugs.includes(articleSlug) && !resolved.includes(projectSlug)) {
      resolved.push(projectSlug);
    }
  }

  return resolved;
}

function buildProjectEditorialManifest(articles, projectEditorialRecipes) {
  const manifest = {};

  for (const [projectSlug, recipe] of Object.entries(projectEditorialRecipes)) {
    const relatedArticles = articles.filter((article) =>
      article.relatedProjectSlugs.includes(projectSlug)
    );

    if (!relatedArticles.length) {
      manifest[projectSlug] = {
        sectionEyebrow: recipe.sectionEyebrow || 'Field writing',
        sectionTitle: recipe.sectionTitle || 'Writing connected to this project',
        sectionDescription:
          recipe.sectionDescription ||
          'These articles live in the ACT editorial layer and can be syndicated across the ecosystem without becoming duplicate pages.',
        articleCount: 0,
        leadArticleSlug: null,
        supportingArticleSlugs: [],
        featuredArticleSlugs: [],
      };
      continue;
    }

    const priority = new Map(
      (Array.isArray(recipe.featuredArticleSlugs) ? recipe.featuredArticleSlugs : []).map(
        (slug, index) => [slug, index]
      )
    );

    const sorted = [...relatedArticles].sort((left, right) => {
      const leftPriority = priority.has(left.slug) ? priority.get(left.slug) : Number.MAX_SAFE_INTEGER;
      const rightPriority = priority.has(right.slug) ? priority.get(right.slug) : Number.MAX_SAFE_INTEGER;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      const leftTime = new Date(
        left.publishedAt || left.updatedAt || left.createdAt || 0
      ).getTime();
      const rightTime = new Date(
        right.publishedAt || right.updatedAt || right.createdAt || 0
      ).getTime();

      return rightTime - leftTime;
    });

    manifest[projectSlug] = {
      sectionEyebrow: recipe.sectionEyebrow || 'Field writing',
      sectionTitle: recipe.sectionTitle || 'Writing connected to this project',
      sectionDescription:
        recipe.sectionDescription ||
        'These articles live in the ACT editorial layer and can be syndicated across the ecosystem without becoming duplicate pages.',
      articleCount: sorted.length,
      leadArticleSlug: sorted[0]?.slug || null,
      supportingArticleSlugs: sorted.slice(1, 4).map((article) => article.slug),
      featuredArticleSlugs: sorted.slice(0, 4).map((article) => article.slug),
    };
  }

  return manifest;
}

function sortByPublishedDateDesc(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(
      left.publishedAt || left.updatedAt || left.createdAt || 0
    ).getTime();
    const rightTime = new Date(
      right.publishedAt || right.updatedAt || right.createdAt || 0
    ).getTime();
    return rightTime - leftTime;
  });
}

async function main() {
  try {
    const [
      wikiRecords,
      staticRecords,
      localProjectEditorialRecipes,
      projectCodeRegistry,
    ] = await Promise.all([
      loadWikiProjectRecords(),
      loadStaticProjectRecords(),
      loadProjectEditorialRecipes(),
      loadProjectCodeRegistrySnapshot(),
    ]);

    let projectEditorialRecipes = localProjectEditorialRecipes;
    let featuredHomeArticleSlugs = [];
    let featuredHomeProjectSlugs = [];
    let featuredHomeMediaProjectSlugs = [];
    let featuredHomeProjectMediaOverrides = {};

    try {
      const remoteEditorialManifest = await fetchProjectEditorialRecipes();
      if (remoteEditorialManifest.featuredHomeArticleSlugs.length > 0) {
        featuredHomeArticleSlugs = remoteEditorialManifest.featuredHomeArticleSlugs;
      }
      if (remoteEditorialManifest.featuredHomeProjectSlugs.length > 0) {
        featuredHomeProjectSlugs = remoteEditorialManifest.featuredHomeProjectSlugs;
      }
      if (remoteEditorialManifest.featuredHomeMediaProjectSlugs.length > 0) {
        featuredHomeMediaProjectSlugs =
          remoteEditorialManifest.featuredHomeMediaProjectSlugs;
      }
      if (
        remoteEditorialManifest.featuredHomeProjectMediaOverrides &&
        Object.keys(remoteEditorialManifest.featuredHomeProjectMediaOverrides).length > 0
      ) {
        featuredHomeProjectMediaOverrides =
          remoteEditorialManifest.featuredHomeProjectMediaOverrides;
      }
      if (Object.keys(remoteEditorialManifest.projectEditorial).length > 0) {
        projectEditorialRecipes = remoteEditorialManifest.projectEditorial;
      }
    } catch (error) {
      console.warn(
        `[sync:el-editorial] failed to load EL editorial manifest, using local fallback: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    const mergedRecords = new Map();
    for (const record of staticRecords) {
      mergedRecords.set(record.slug, record);
    }
    for (const record of wikiRecords) {
      mergedRecords.set(record.slug, {
        ...mergedRecords.get(record.slug),
        ...record,
      });
    }

    const projectLookup =
      Array.isArray(projectCodeRegistry.projects) &&
      projectCodeRegistry.projects.length > 0
        ? buildProjectSlugLookup(projectCodeRegistry)
        : buildProjectLookup(Array.from(mergedRecords.values()));
    const siteArticles = await fetchAllSiteArticles();

    const limit = pLimit(6);
    const detailedArticles = await Promise.all(
      siteArticles.map((article) =>
        limit(async () => {
          try {
            const detail = await fetchArticleDetail(article.slug);
            const relatedProjectSlugs = resolveProjectSlugs(
              detail,
              article,
              projectLookup,
              projectEditorialRecipes
            );

            return {
              id: detail.id || article.id,
              title: detail.title || article.title,
              slug: detail.slug || article.slug,
              subtitle: detail.subtitle || article.subtitle || null,
              excerpt: detail.excerpt || article.excerpt || null,
              content: detail.content || article.content || null,
              authorName: detail.authorName || 'ACT Team',
              authorBio: detail.authorBio || null,
              articleType: detail.articleType || null,
              primaryProject: detail.primaryProject || null,
              relatedProjects: Array.isArray(detail.relatedProjects)
                ? detail.relatedProjects
                : [],
              relatedProjectSlugs,
              publishedAt: detail.publishedAt || article.publishedAt || null,
              createdAt: article.createdAt || null,
              updatedAt: article.updatedAt || null,
              tags: Array.isArray(detail.tags) ? detail.tags : [],
              themes: Array.isArray(detail.themes) ? detail.themes : [],
              featuredImageUrl: detail.featuredImageUrl || null,
              featuredImageAlt: detail.featuredImageAlt || null,
              storyteller: detail.storyteller || null,
              media: detail.media || {
                photoCount: 0,
                videoCount: 0,
                photoPreviews: [],
                videoPreviews: [],
              },
              ctas: Array.isArray(detail.ctas) ? detail.ctas : [],
              visibility: detail.visibility || 'public',
              canonicalUrl: `${EMPATHY_LEDGER_URL}/articles/${detail.slug || article.slug}`,
              localPath: `/blog/${detail.slug || article.slug}`,
              syndicationDestinations: Array.isArray(article.syndicationDestinations)
                ? article.syndicationDestinations
                : [],
            };
          } catch (error) {
            console.warn(
              `[sync:el-editorial] failed to hydrate article ${article.slug}: ${
                error instanceof Error ? error.message : String(error)
              }`
            );

            return {
              id: article.id,
              title: article.title,
              slug: article.slug,
              subtitle: null,
              excerpt: article.excerpt || null,
              content: article.content || null,
              authorName: 'ACT Team',
              authorBio: null,
              articleType: null,
              primaryProject: null,
              relatedProjects: [],
              relatedProjectSlugs: [],
              publishedAt: article.publishedAt || null,
              createdAt: article.createdAt || null,
              updatedAt: article.updatedAt || null,
              tags: [],
              themes: [],
              featuredImageUrl: null,
              featuredImageAlt: null,
              storyteller: null,
              media: {
                photoCount: 0,
                videoCount: 0,
                photoPreviews: [],
                videoPreviews: [],
              },
              ctas: [],
              visibility: 'public',
              canonicalUrl: `${EMPATHY_LEDGER_URL}/articles/${article.slug}`,
              localPath: `/blog/${article.slug}`,
              syndicationDestinations: Array.isArray(article.syndicationDestinations)
                ? article.syndicationDestinations
                : [],
            };
          }
        })
      )
    );

    const articles = sortByPublishedDateDesc(detailedArticles);
    const projectArticleCounts = {};

    for (const article of articles) {
      for (const slug of article.relatedProjectSlugs) {
        projectArticleCounts[slug] = (projectArticleCounts[slug] || 0) + 1;
      }
    }

    const projectEditorial = buildProjectEditorialManifest(
      articles,
      projectEditorialRecipes
    );

    const snapshot = {
      generatedAt: new Date().toISOString(),
      sourceUrl: EMPATHY_LEDGER_URL,
      siteSlug: EMPATHY_LEDGER_SITE_SLUG,
      editorialDestination: EMPATHY_LEDGER_EDITORIAL_DESTINATION,
      featuredHomeArticleSlugs,
      featuredHomeProjectSlugs,
      featuredHomeMediaProjectSlugs,
      featuredHomeProjectMediaOverrides,
      articleCount: articles.length,
      projectArticleCounts,
      projectEditorial,
      articles,
    };

    await writeSnapshot(snapshot);
    console.log(
      `synced EL editorial snapshot for ${articles.length} articles across ${Object.keys(projectArticleCounts).length} projects`
    );
  } catch (error) {
    await keepExistingSnapshot(
      `[sync:el-editorial] ${
        error instanceof Error ? error.message : 'Failed to build snapshot'
      }`
    );
  }
}

await main();
