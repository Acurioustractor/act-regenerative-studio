import 'server-only';

import { cache } from 'react';

import editorialSnapshot from '@/data/empathy-ledger-editorial.generated.json';

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
    photoPreviews: Array<{
      url: string;
      alt: string | null;
      caption: string | null;
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

const SNAPSHOT = editorialSnapshot as unknown as EditorialSnapshot;

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

export const getEditorialSnapshot = cache(() => SNAPSHOT);

export const getSiteEditorialArticles = cache(
  async (limit = 60): Promise<EditorialArticle[]> => {
    const snapshot = getEditorialSnapshot();
    return sortByPublishedDateDesc(snapshot.articles).slice(0, limit);
  }
);

export const getProjectEditorialArticles = cache(
  async (projectSlug: string, limit = 6): Promise<EditorialArticle[]> => {
    const snapshot = getEditorialSnapshot();
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
    const snapshot = getEditorialSnapshot();
    return snapshot.articles.find((article) => article.slug === slug) || null;
  }
);

export function getEditorialArticleStaticSlugs(): string[] {
  return SNAPSHOT.articles.map((article) => article.slug);
}

export function getEditorialProjectArticleCount(projectSlug: string): number {
  return SNAPSHOT.projectArticleCounts[projectSlug] || 0;
}

export const getProjectEditorialManifest = cache(
  async (projectSlug: string): Promise<ProjectEditorialManifest | null> => {
    const snapshot = getEditorialSnapshot();
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
    const snapshot = getEditorialSnapshot();
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
    const snapshot = getEditorialSnapshot();
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
