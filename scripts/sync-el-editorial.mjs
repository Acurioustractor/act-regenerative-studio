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

// Local consent-withdrawal tombstone. Article slugs or storyteller ids listed
// here are never published, and the rule is enforced even when Empathy Ledger
// is unreachable and we fall back to the existing snapshot. A withdrawal must
// be a positive local signal we honor during an outage, not something we can
// only learn by reaching the source.
const WITHDRAWN_PATH = path.resolve(
  process.cwd(),
  'config/withdrawn-editorial.json'
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

async function loadWithdrawnTombstone() {
  try {
    const parsed = JSON.parse(await fs.readFile(WITHDRAWN_PATH, 'utf8'));
    return {
      slugs: new Set(Array.isArray(parsed.slugs) ? parsed.slugs : []),
      storytellerIds: new Set(
        Array.isArray(parsed.storytellerIds) ? parsed.storytellerIds : []
      ),
    };
  } catch {
    return { slugs: new Set(), storytellerIds: new Set() };
  }
}

function isWithdrawn(article, tombstone) {
  const storytellerId = article.storyteller?.id;
  return (
    tombstone.slugs.has(article.slug) ||
    (storytellerId && tombstone.storytellerIds.has(storytellerId))
  );
}

function recomputeProjectArticleCounts(articles) {
  const counts = {};
  for (const article of articles) {
    for (const slug of article.relatedProjectSlugs || []) {
      counts[slug] = (counts[slug] || 0) + 1;
    }
  }
  return counts;
}

// Drop any withdrawn articles and keep the derived counts honest. Returns the
// filtered article list plus how many were removed, for logging.
function enforceWithdrawals(articles, tombstone) {
  const kept = [];
  let removed = 0;
  for (const article of articles) {
    if (isWithdrawn(article, tombstone)) {
      removed += 1;
      console.log(
        `[sync:el-editorial] consent withdrawn: removing ${article.slug} (honored regardless of Empathy Ledger reachability)`
      );
    } else {
      kept.push(article);
    }
  }
  return { kept, removed };
}

async function keepExistingSnapshot(reason, tombstone = { slugs: new Set(), storytellerIds: new Set() }) {
  let existing;
  try {
    existing = JSON.parse(await fs.readFile(OUTPUT_PATH, 'utf8'));
  } catch {
    await writeSnapshot(createEmptySnapshot());
    console.log(`${reason}, wrote empty EL editorial snapshot to ${OUTPUT_PATH}`);
    return;
  }

  // Even when Empathy Ledger is unreachable, locally-recorded withdrawals must
  // still take effect, so a storyteller who withdrew during the outage is never
  // left published in the kept snapshot.
  const articles = Array.isArray(existing.articles) ? existing.articles : [];
  const { kept, removed } = enforceWithdrawals(articles, tombstone);
  if (removed > 0) {
    await writeSnapshot({
      ...existing,
      articles: kept,
      articleCount: kept.length,
      projectArticleCounts: recomputeProjectArticleCounts(kept),
    });
    console.log(
      `${reason}, kept existing EL editorial snapshot and enforced ${removed} consent withdrawal(s)`
    );
    return;
  }

  console.log(`${reason}, keeping existing EL editorial snapshot at ${OUTPUT_PATH}`);
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

  const payload = await fetchJson(url.toString(), false);
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

async function fetchJson(url, useAuth = true) {
  const response = await fetch(url, {
    headers: useAuth ? buildHeaders() : {},
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

    // ACT publishes this snapshot to the open web, so it must consume the
    // anonymous public feed. An integration API key may legitimately see
    // community-scoped records, but that access must never promote them into
    // ACT's public static build.
    const payload = await fetchJson(url.toString(), false);
    const pageItems = Array.isArray(payload.articles) ? payload.articles : [];
    articles.push(...pageItems);

    hasMore = Boolean(payload.pagination?.hasMore);
    page += 1;
  }

  return articles;
}

async function fetchArticleDetail(slug) {
  const url = new URL(`/api/v1/content-hub/articles/${slug}`, EMPATHY_LEDGER_URL);
  return fetchJson(url.toString(), false);
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
  // Loaded before the try so withdrawals are enforced on the fall-back path too.
  const withdrawn = await loadWithdrawnTombstone();
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
    const publiclyPublishedArticles = siteArticles.filter((article) => {
      if (article.visibility === 'public') return true;
      console.warn(
        `[sync:el-editorial] withholding ${article.slug}: destination approval does not override article visibility (${article.visibility || 'unset'})`
      );
      return false;
    });

    const limit = pLimit(6);
    const detailedArticles = await Promise.all(
      publiclyPublishedArticles.map((article) =>
        limit(async () => {
          try {
            const detail = await fetchArticleDetail(article.slug);
            const relatedProjectSlugs = resolveProjectSlugs(
              detail,
              article,
              projectLookup,
              projectEditorialRecipes
            );

            // Consent + credit: a person-voiced piece (one with a storyteller)
            // must never ship under the generic "ACT Team" byline, which erases
            // the storyteller. Prefer the storyteller's name; if none resolves,
            // withhold the article until attribution is set in Empathy Ledger
            // rather than publish it misattributed.
            const resolvedAuthor =
              detail.authorName || detail.storyteller?.displayName || '';
            if (detail.storyteller && !resolvedAuthor) {
              console.warn(
                `[sync:el-editorial] withholding ${article.slug}: person-voiced (has a storyteller) but no author name resolved; set attribution in Empathy Ledger to publish`
              );
              return null;
            }

            return {
              id: detail.id || article.id,
              title: detail.title || article.title,
              slug: detail.slug || article.slug,
              subtitle: detail.subtitle || article.subtitle || null,
              excerpt: detail.excerpt || article.excerpt || null,
              content: detail.content || article.content || null,
              authorName: resolvedAuthor || 'ACT Team',
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
              // Photographs come from the LIST response, not the detail one.
              //
              // Empathy Ledger gates media behind /api/media/<id>/file, which
              // mints a signed URL, so a person who withdraws consent can
              // actually take their photograph down. The gate is applied by
              // resolveAssetUrl, and only when it is handed the
              // gatedByStoragePath map that the list route builds.
              //
              // /api/v1/content-hub/articles/[slug] never builds that map and
              // calls resolveAssetUrl without it, so it returns raw
              // /storage/v1/object/public/media/ URLs. Measured 2026-08-07 on
              // conversation-camp: the list route returns 8 of 8 photographs
              // gated, the detail route 0 of 8. Because detail won this merge,
              // every photograph in our snapshot was the ungated form, pointing
              // at a bucket that is now private and answers 400.
              //
              // So the ungated URLs were both broken and, when they worked,
              // uncancellable. Preferring the list fixes both. Detail remains
              // the fallback, and is still the only source of `content`, which
              // the list response does not carry at all.
              //
              // Reversible once the [slug] route passes the map: at that point
              // the two agree and this preference stops mattering.
              featuredImageUrl: article.featuredImageUrl || detail.featuredImageUrl || null,
              featuredImageAlt: detail.featuredImageAlt || article.featuredImageAlt || null,
              storyteller: detail.storyteller || null,
              media: (article.media?.photoPreviews?.length || article.media?.videoPreviews?.length)
                ? article.media
                : detail.media || {
                    photoCount: 0,
                    videoCount: 0,
                    photoPreviews: [],
                    videoPreviews: [],
                  },
              ctas: Array.isArray(detail.ctas) ? detail.ctas : [],
              visibility: detail.visibility || 'public',
              canonicalUrl: `${EMPATHY_LEDGER_URL}/articles/${detail.slug || article.slug}`,
              localPath: `/stories/${detail.slug || article.slug}`,
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
              localPath: `/stories/${article.slug}`,
              syndicationDestinations: Array.isArray(article.syndicationDestinations)
                ? article.syndicationDestinations
                : [],
            };
          }
        })
      )
    );

    // Drop articles withheld for missing attribution (null) before sorting, then
    // enforce consent withdrawals on the fresh build too.
    const hydrated = detailedArticles.filter(Boolean);
    const { kept: articles } = enforceWithdrawals(
      sortByPublishedDateDesc(hydrated),
      withdrawn
    );

    // The featured list comes straight from the Empathy Ledger admin manifest
    // and was never filtered against the tombstone, so a withdrawn slug could
    // sit in it. Today that is masked by the curated home picks in
    // empathy-ledger-editorial.ts, which win over this list, but a withdrawal
    // must not depend on an override in another file continuing to exist.
    featuredHomeArticleSlugs = featuredHomeArticleSlugs.filter((slug) => {
      if (!withdrawn.slugs.has(slug)) return true;
      console.log(
        `[sync:el-editorial] consent withdrawn: dropping ${slug} from featuredHomeArticleSlugs`
      );
      return false;
    });
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
      }`,
      withdrawn
    );
  }
}

await main();
