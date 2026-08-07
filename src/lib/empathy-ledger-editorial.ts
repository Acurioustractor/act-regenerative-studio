import 'server-only';

import { cache } from 'react';

import { fetchEmpathyLedgerJson } from '@/lib/empathy-ledger-runtime';
import editorialSnapshot from '@/data/empathy-ledger-editorial.generated.json';
import withdrawnTombstone from '../../config/withdrawn-editorial.json';

export interface EditorialArticle {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string | null;
  authorName: string;
  authorBio: string | null;
  articleType: string | null;
  primaryProject: string | null;
  relatedProjects: string[];
  relatedProjectSlugs: string[];
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  tags: string[];
  themes: string[];
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  storyteller: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
  } | null;
  media: {
    photoCount: number;
    videoCount: number;
    // The sync emits { url, title, alt_text }; older shapes carried
    // { url, alt, caption }. Declare the union of what actually arrives so
    // consumers stop reading fields that are never there.
    photoPreviews: Array<{
      url: string;
      alt?: string | null;
      alt_text?: string | null;
      title?: string | null;
      caption?: string | null;
    }>;
    videoPreviews: Array<{
      url: string;
      thumbnailUrl: string | null;
      caption: string | null;
    }>;
  };
  ctas: Array<{
    id?: string;
    position?: string | null;
    ctaType?: string | null;
    buttonText?: string | null;
    description?: string | null;
    icon?: string | null;
    style?: string | null;
    urlTemplate?: string | null;
    actionType?: string | null;
  }>;
  visibility: string;
  canonicalUrl: string;
  localPath: string;
  syndicationDestinations: string[];
}

export interface ProjectEditorialManifest {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  articleCount: number;
  leadArticleSlug: string | null;
  supportingArticleSlugs: string[];
  featuredArticleSlugs: string[];
}

export interface EditorialMediaOverride {
  kind: "image" | "video";
  url: string;
  posterUrl?: string | null;
  alt?: string | null;
}

interface EditorialSnapshot {
  generatedAt: string | null;
  sourceUrl: string | null;
  siteSlug: string | null;
  editorialDestination?: string | null;
  featuredHomeArticleSlugs?: string[];
  featuredHomeProjectSlugs?: string[];
  featuredHomeMediaProjectSlugs?: string[];
  featuredHomeProjectMediaOverrides?: Record<string, EditorialMediaOverride>;
  articleCount: number;
  projectArticleCounts: Record<string, number>;
  projectEditorial?: Record<string, ProjectEditorialManifest>;
  articles: EditorialArticle[];
}

const SITE_SLUG = process.env.EMPATHY_LEDGER_SITE_SLUG || 'act-regenerative-studio';

/**
 * Consent gate, applied to BOTH the baked snapshot and the live read.
 *
 * The sync script enforces the withdrawal tombstone, the attribution rule and
 * visibility when it bakes the snapshot — but since 01091b9 the live read wins
 * over the baked copy, so a rule enforced only at build time is a rule the
 * production site does not have. Everything the sync withholds must be
 * withheld again here, at the one place both paths converge.
 */
const WITHDRAWN = {
  slugs: new Set<string>(Array.isArray(withdrawnTombstone.slugs) ? withdrawnTombstone.slugs : []),
  storytellerIds: new Set<string>(
    Array.isArray(withdrawnTombstone.storytellerIds) ? withdrawnTombstone.storytellerIds : []
  ),
};

/**
 * Excerpts arrive from Empathy Ledger as whatever the editor stored — sometimes
 * plain text, sometimes a truncated HTML fragment ("<p><em>There is a version…
 * </p><h"). Every consumer renders the excerpt as text (list ledes, meta
 * descriptions), so reduce it to plain text once, at this boundary, for both
 * the baked and the live path.
 */
function plainTextExcerpt(excerpt: string | null | undefined): string | null {
  if (!excerpt) return null;
  if (!excerpt.includes('<') && !excerpt.includes('&')) return excerpt;
  const text = excerpt
    .replace(/<[^>]*$/, ' ') // truncation can cut mid-tag; drop the stub
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#0?39;|&apos;|&#8217;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return text || null;
}

function withPlainExcerpt(article: EditorialArticle): EditorialArticle {
  return { ...article, excerpt: plainTextExcerpt(article.excerpt) };
}

/**
 * Articles read at /stories/[slug] since the route unification (2026-08-07),
 * but baked snapshots regenerated before it carry /blog/ paths. Rewritten here
 * at the serving boundary so every consumer (field pages, story stream,
 * sitemap, admin previews) links the same way regardless of snapshot age.
 */
function sitePath(localPath: string | null | undefined, slug: string): string {
  if (!localPath) return `/stories/${slug}`;
  return localPath.replace(/^\/blog\//, '/stories/');
}

function withSitePath(article: EditorialArticle): EditorialArticle {
  return { ...article, localPath: sitePath(article.localPath, article.slug) };
}

function passesConsentGate(article: EditorialArticle): boolean {
  if (WITHDRAWN.slugs.has(article.slug)) return false;
  const storytellerId = article.storyteller?.id;
  if (storytellerId && WITHDRAWN.storytellerIds.has(storytellerId)) return false;

  // A person-voiced piece (one with a storyteller) must never ship without a
  // resolvable name: publishing it under a blank or generic byline erases the
  // storyteller. Same rule as scripts/sync-el-editorial.mjs.
  const resolvedAuthor = article.authorName || article.storyteller?.displayName || '';
  if (article.storyteller && !resolvedAuthor) return false;

  // The live content-hub response may omit visibility entirely; absent is not
  // the same as restricted, so only an explicit non-public value withholds.
  if (article.visibility && article.visibility !== 'public') return false;

  return true;
}

function applyConsentGate(snapshot: EditorialSnapshot): EditorialSnapshot {
  const articles = snapshot.articles
    .filter(passesConsentGate)
    .map(withPlainExcerpt)
    .map(withSitePath);
  const projectArticleCounts: Record<string, number> = {};
  for (const article of articles) {
    for (const slug of article.relatedProjectSlugs || []) {
      projectArticleCounts[slug] = (projectArticleCounts[slug] || 0) + 1;
    }
  }
  return { ...snapshot, articles, articleCount: articles.length, projectArticleCounts };
}

const SNAPSHOT = applyConsentGate(editorialSnapshot as unknown as EditorialSnapshot);

const BAKED_BY_SLUG = new Map(SNAPSHOT.articles.map((article) => [article.slug, article]));

/**
 * Editorial read live from Empathy Ledger, falling back to the copy baked at
 * build time.
 *
 * This module used to serve the baked copy and nothing else, which meant a
 * storyteller who withdrew consent stayed published here until somebody
 * rebuilt, with no upper bound on how long that took. Reading live puts a number
 * on it, and the number is the revalidate window.
 *
 * The baked snapshot stays as the fallback rather than being deleted. If
 * Empathy Ledger is unreachable the site keeps working on yesterday's content,
 * which is the right failure: a site that goes blank helps nobody, and the
 * withdrawal it might be missing is exactly the case the fallback is bounded
 * for.
 */
async function fetchEditorialLive(): Promise<EditorialSnapshot | null> {
  const [manifest, articles] = await Promise.all([
    fetchEmpathyLedgerJson<Partial<EditorialSnapshot>>(
      `/api/v1/content-hub/editorial?site=${encodeURIComponent(SITE_SLUG)}`,
      { revalidate: 300 }
    ),
    fetchEmpathyLedgerJson<{ articles?: EditorialArticle[] }>(
      `/api/v1/content-hub/articles?destination=${encodeURIComponent(SITE_SLUG)}&limit=100`,
      { revalidate: 300 }
    ),
  ]);

  if (!manifest || !Array.isArray(articles?.articles)) return null;

  return {
    ...SNAPSHOT,
    ...manifest,
    articles: articles.articles.map(normaliseLiveArticle),
    articleCount: articles.articles.length,
    projectEditorial: normaliseProjectEditorial(manifest.projectEditorial),
  } as EditorialSnapshot;
}

/**
 * Same problem as normaliseLiveArticle, one level up.
 *
 * `ProjectEditorialManifest` declares supportingArticleSlugs and
 * featuredArticleSlugs as non-optional string[], and the live manifest does not
 * always carry them. /projects/empathy-ledger was the page that proved it: it
 * crashed the build on `manifest.supportingArticleSlugs.map` of undefined.
 *
 * Guarding the one call site would have fixed today's crash and left the next
 * consumer to find the next one. The arrays are filled here instead, where live
 * data enters.
 */
function normaliseProjectEditorial(
  projectEditorial: EditorialSnapshot['projectEditorial'] | undefined
): EditorialSnapshot['projectEditorial'] {
  if (!projectEditorial) return SNAPSHOT.projectEditorial;
  return Object.fromEntries(
    Object.entries(projectEditorial).map(([slug, manifest]) => [
      slug,
      {
        ...manifest,
        supportingArticleSlugs: manifest?.supportingArticleSlugs ?? [],
        featuredArticleSlugs: manifest?.featuredArticleSlugs ?? [],
      },
    ])
  ) as EditorialSnapshot['projectEditorial'];
}

/**
 * Give a live article the same shape as a baked one.
 *
 * The content-hub endpoint returns a SUBSET of EditorialArticle. Measured
 * 2026-07-30, it omits nine fields the baked snapshot carries, including
 * `relatedProjectSlugs`, `relatedProjects`, `localPath`, `content`, `authorBio`,
 * `canonicalUrl`, `createdAt` and `updatedAt`.
 *
 * The old code passed the response straight through with `as EditorialSnapshot`,
 * a type assertion claiming a shape the API does not provide. So the moment this
 * site actually read live — which it started doing in 01091b9 — every page calling
 * `article.relatedProjectSlugs.includes(...)` or `article.localPath` crashed on
 * undefined, and the whole production build failed at prerender. Eight pages, and
 * it had been failing on every build since.
 *
 * The assertion was the bug. A cast tells the compiler to stop checking; it does
 * not make the data arrive. So the fields are filled here, at the one place live
 * data enters, rather than guarded at each of the dozens of places they are read.
 *
 * Missing fields fall back to the BAKED copy of the same article first, and
 * only then to empty defaults. Nulling them out was itself a serving bug: the
 * live list omits `content`, so whenever the live read succeeded every article
 * page rendered "this story has no public body yet" while the full body sat in
 * the snapshot. Live wins field-by-field where it actually sends a value; the
 * baked article fills the rest. An article withdrawn at the source cannot leak
 * back in through this merge, because it is absent from the live list entirely
 * and this function never runs for it.
 *
 * `localPath` is derived the same way the sync script derives it, because a URL
 * on this site is this site's concern and not something Empathy Ledger should
 * be asked to know.
 */
function normaliseLiveArticle(liveArticle: Partial<EditorialArticle> & { slug: string }): EditorialArticle {
  const baked = BAKED_BY_SLUG.get(liveArticle.slug);
  // JSON.parse never produces undefined values, so spreading the live article
  // last overrides exactly the fields the API actually sent.
  const article = { ...baked, ...liveArticle };
  return {
    ...article,
    localPath: sitePath(article.localPath, article.slug),
    // Arrays default to empty, never undefined: every consumer of these calls
    // .includes, .length, .map or .slice on them without checking.
    relatedProjectSlugs: article.relatedProjectSlugs ?? [],
    relatedProjects: article.relatedProjects ?? [],
    tags: article.tags ?? [],
    themes: article.themes ?? [],
    ctas: article.ctas ?? [],
    syndicationDestinations: article.syndicationDestinations ?? [],
    // Nullable scalars: absent and empty are different, and null is what the
    // generator writes when it has nothing.
    content: article.content ?? null,
    authorBio: article.authorBio ?? null,
    authorName: article.authorName ?? '',
    canonicalUrl: article.canonicalUrl ?? null,
    createdAt: article.createdAt ?? null,
    updatedAt: article.updatedAt ?? null,
    subtitle: article.subtitle ?? null,
    excerpt: plainTextExcerpt(article.excerpt),
    primaryProject: article.primaryProject ?? null,
    articleType: article.articleType ?? null,
    featuredImageUrl: article.featuredImageUrl ?? null,
    featuredImageAlt: article.featuredImageAlt ?? null,
  } as EditorialArticle;
}

function isEditorialArticle(
  article: EditorialArticle | undefined
): article is EditorialArticle {
  return Boolean(article);
}

function sortByPublishedDateDesc<T extends { publishedAt: string | null; updatedAt?: string | null; createdAt?: string | null }>(
  items: T[]
): T[] {
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

/**
 * The copy baked at build time, read synchronously.
 *
 * Some consumers want the whole corpus without making every caller async, and
 * that is a legitimate need: the field graph and the static-params list are
 * build-time facts. They must use this rather than the live read, so that
 * "which pages exist" stays a property of the build while "what is on them"
 * comes from the request.
 */
export function getBakedEditorialSnapshot(): EditorialSnapshot {
  return SNAPSHOT;
}

export const getEditorialSnapshot = cache(async (): Promise<EditorialSnapshot> => {
  const live = await fetchEditorialLive();
  // The gate runs on the live result too: a withdrawal recorded locally must
  // hold even when the source is still serving the article.
  return live ? applyConsentGate(live) : SNAPSHOT;
});

export const getSiteEditorialArticles = cache(
  async (limit = 60): Promise<EditorialArticle[]> => {
    const snapshot = await getEditorialSnapshot();
    return sortByPublishedDateDesc(snapshot.articles).slice(0, limit);
  }
);

export const getProjectEditorialArticles = cache(
  async (projectSlug: string, limit = 6): Promise<EditorialArticle[]> => {
    const snapshot = await getEditorialSnapshot();
    const manifest = snapshot.projectEditorial?.[projectSlug];
    const articles = snapshot.articles.filter((article) =>
      article.relatedProjectSlugs.includes(projectSlug)
    );
    const orderedArticles =
      manifest?.featuredArticleSlugs?.length
        ? manifest.featuredArticleSlugs
            .map((slug) => articles.find((article) => article.slug === slug))
            .filter(isEditorialArticle)
        : sortByPublishedDateDesc(articles);

    const seen = new Set(orderedArticles.map((article) => article.slug));
    const remainder = sortByPublishedDateDesc(articles).filter(
      (article) => !seen.has(article.slug)
    );

    return [...orderedArticles, ...remainder].slice(0, limit);
  }
);

export const getEditorialArticleBySlug = cache(
  async (slug: string): Promise<EditorialArticle | null> => {
    const snapshot = await getEditorialSnapshot();
    return snapshot.articles.find((article) => article.slug === slug) || null;
  }
);

/**
 * Deliberately the baked copy, not the live read. This feeds generateStaticParams
 * at build time, where a live fetch would make the set of pre-rendered routes
 * depend on whatever the API happened to return during the build. Which pages
 * exist is a build-time fact; what is on them is a request-time one.
 */
export function getEditorialArticleStaticSlugs(): string[] {
  return SNAPSHOT.articles.map((article) => article.slug);
}

export function getEditorialProjectArticleCount(projectSlug: string): number {
  return SNAPSHOT.projectArticleCounts[projectSlug] || 0;
}

export const getProjectEditorialManifest = cache(
  async (projectSlug: string): Promise<ProjectEditorialManifest | null> => {
    const snapshot = await getEditorialSnapshot();
    return snapshot.projectEditorial?.[projectSlug] || null;
  }
);

export const getProjectEditorialFeature = cache(
  async (
    projectSlug: string
  ): Promise<{
    manifest: ProjectEditorialManifest | null;
    leadArticle: EditorialArticle | null;
    supportingArticles: EditorialArticle[];
  }> => {
    const snapshot = await getEditorialSnapshot();
    const manifest = snapshot.projectEditorial?.[projectSlug] || null;

    if (!manifest) {
      return {
        manifest: null,
        leadArticle: null,
        supportingArticles: [],
      };
    }

    const leadArticle = manifest.leadArticleSlug
      ? snapshot.articles.find((article) => article.slug === manifest.leadArticleSlug) || null
      : null;

    const supportingArticles = manifest.supportingArticleSlugs
      .map((slug) => snapshot.articles.find((article) => article.slug === slug))
      .filter(isEditorialArticle);

    return {
      manifest,
      leadArticle,
      supportingArticles,
    };
  }
);

export const getHomeEditorialFeature = cache(
  async (): Promise<{
    leadArticle: EditorialArticle | null;
    supportingArticles: EditorialArticle[];
    featuredProjectSlugs: string[];
    featuredMediaProjectSlugs: string[];
    featuredProjectMediaOverrides: Record<string, EditorialMediaOverride>;
  }> => {
    const snapshot = await getEditorialSnapshot();
    const featuredSlugs = Array.isArray(snapshot.featuredHomeArticleSlugs)
      ? snapshot.featuredHomeArticleSlugs
      : [];
    const featuredProjectSlugs = Array.isArray(snapshot.featuredHomeProjectSlugs)
      ? snapshot.featuredHomeProjectSlugs
      : [];
    const featuredMediaProjectSlugs = Array.isArray(
      snapshot.featuredHomeMediaProjectSlugs
    )
      ? snapshot.featuredHomeMediaProjectSlugs
      : [];
    const featuredProjectMediaOverrides =
      snapshot.featuredHomeProjectMediaOverrides || {};

    // Curated home picks: these win over the EL admin featuredHomeArticleSlugs.
    // Use this list to keep the three home story cards intentional while EL
    // admin curation catches up. Order = lead, supporting-1, supporting-2.
    const HOME_CURATED_SLUGS = [
      "seeds-of-change-walking-with-elders-and-youth-on-kalkadoon-country",
      "historys-wounds-and-tomorrows-possibilities",
      "life-is-hard-but-its-not",
    ];

    const curatedArticles = HOME_CURATED_SLUGS
      .map((slug) => snapshot.articles.find((article) => article.slug === slug))
      .filter(isEditorialArticle);

    const adminPrioritized = featuredSlugs
      .map((slug) => snapshot.articles.find((article) => article.slug === slug))
      .filter(isEditorialArticle);

    const seen = new Set([
      ...curatedArticles.map((a) => a.slug),
      ...adminPrioritized.map((a) => a.slug),
    ]);
    const fallbackArticles = sortByPublishedDateDesc(snapshot.articles).filter(
      (article) => !seen.has(article.slug)
    );
    const allOrdered = [
      ...curatedArticles,
      ...adminPrioritized,
      ...fallbackArticles,
    ];

    // Home cards are image-led. If any pick has no featured image, push it
    // below the image-having ones so we never ship a dark empty column.
    const withImages = allOrdered.filter((article) => !!article.featuredImageUrl);
    const withoutImages = allOrdered.filter((article) => !article.featuredImageUrl);
    const orderedArticles = [...withImages, ...withoutImages];

    return {
      leadArticle: orderedArticles[0] || null,
      supportingArticles: orderedArticles.slice(1, 3),
      featuredProjectSlugs,
      featuredMediaProjectSlugs,
      featuredProjectMediaOverrides,
    };
  }
);
