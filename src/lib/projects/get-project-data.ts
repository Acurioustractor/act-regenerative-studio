/**
 * Unified Project Data Fetcher
 * Merges: static data + canonical wiki + vignettes + cover images + ecosystem
 * Handles graceful fallbacks when sources are unavailable
 */

import { cache } from 'react';

import { projects, type Project, type ProjectTheme } from '@/data/projects';
import { getProjectVignettes, type ProjectVignette } from './get-project-vignettes';
import { getCoverImage, type CoverImage, getProjectMedia } from './get-cover-image';
import { getFeaturedContentForProject, type FeaturedContentResponse } from '@/lib/empathy-ledger-featured';
import {
  getProjectSourcePacket,
  type ProjectSourcePacket,
} from '@/lib/empathy-ledger-source-packets';
import { getProjectBySlug as getEcosystemProject, type EcosystemProject } from '@/lib/ecosystem';
import { getCanonicalWikiProject, type CanonicalWikiProjectMatch } from '@/lib/wiki/canonical-project-wiki';
import { getFlagshipProjectPack } from '@/lib/wiki/flagship-project-packs';
import {
  getProjectLCAA,
  getProjectWikiQuote,
  getProjectWikiStats,
  getProjectKeyPeople,
  getProjectBacklinks,
  type ProjectWikiPerson,
  type ProjectWikiBacklink,
} from '@/lib/wiki/project-lcaa';
import type { ACTFlagshipProjectPack } from '@/types/shared/act-flagship-project-pack';

const PROJECT_WEBSITE_ALIASES: Record<string, string> = {
  'black-cockatoo-valley': 'act-farm',
};

const LOCAL_COVER_IMAGE_OVERRIDES: Record<
  string,
  {
    url: string;
    alt: string;
  }
> = {
  'black-cockatoo-valley': {
    url: '/media/field-stills/black-cockatoo-valley-farm-aerial.jpg',
    alt: 'Black Cockatoo Valley aerial moving through fog above the canopy',
  },
  'the-harvest': {
    url: '/media/field-stills/harvest-witta-aerial.jpg',
    alt: 'The Harvest aerial over the Witta site and surrounding fields',
  },
  'empathy-ledger': {
    url: '/media/field-stills/empathy-ledger-community-story.jpg',
    alt: 'Community storytelling conversation connected to Empathy Ledger',
  },
};

const LOCAL_COVER_VIDEO_OVERRIDES: Record<
  string,
  {
    url: string;
    posterUrl?: string | null;
    title: string;
  }
> = {
  justicehub: {
    url: '/media/field-videos/justicehub-container.mp4',
    posterUrl: '/media/field-stills/justicehub-container.jpg',
    title: 'CONTAINED installation open and close',
  },
  'goods-on-country': {
    url: '/media/field-videos/goods-community-build.mp4',
    posterUrl: '/media/field-stills/goods-community-build.jpg',
    title: 'Community stretch bed build in remote Australia',
  },
  'black-cockatoo-valley': {
    url: '/media/field-videos/hero-farm-aerial.mp4',
    posterUrl: '/media/field-stills/hero-farm-aerial.jpg',
    title: 'Black Cockatoo Valley aerial through morning fog',
  },
  'the-harvest': {
    url: '/media/field-videos/harvest-witta-aerial.mp4',
    posterUrl: '/media/field-stills/harvest-witta-aerial.jpg',
    title: 'The Harvest aerial over Witta',
  },
  'empathy-ledger': {
    url: '/media/field-videos/empathy-ledger-elder-trip.mp4',
    posterUrl: '/media/field-stills/empathy-ledger-elder-trip.jpg',
    title: 'Elders walking to boat for Hull River trip',
  },
};

export interface EnrichedProject extends Project {
  // Enriched cover image with source tracking
  coverImage: CoverImage | null;
  coverVideo: {
    url: string;
    posterUrl?: string | null;
    title: string;
  } | null;

  // Vignettes from compendium
  vignettes: ProjectVignette[];

  // Ecosystem data (from act-ecosystem repository)
  ecosystemData?: EcosystemProject;

  // Canonical ACT wiki data
  wikiData?: CanonicalWikiProjectMatch;
  flagshipPack?: ACTFlagshipProjectPack;

  // Dedicated project website / code surfaces
  projectWebsiteUrl: string | null;
  projectRepoUrl: string | null;

  // Empathy Ledger featured content
  empathyLedgerContent: FeaturedContentResponse | null;
  sourcePacket?: ProjectSourcePacket;

  // Media gallery items
  mediaGallery: Array<{
    id: string;
    url: string;
    thumbnailUrl?: string;
    type: string;
    title?: string;
    alt?: string;
    caption?: string;
    credit?: string;
    isHero: boolean;
    isFeatured: boolean;
    source?: 'media_gallery' | 'empathy_ledger';
  }>;

  // Key people from wiki ## Key People section
  keyPeople: ProjectWikiPerson[];

  // Editorially-curated backlinks from wiki ## Backlinks section
  wikiBacklinks: ProjectWikiBacklink[];

  // Computed fields
  hasLCAAContent: boolean;
  hasStats: boolean;
  hasQuote: boolean;
  hasVideo: boolean;
}

function normalizeExternalUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}

function firstNonEmpty(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return null;
}

function isHubWebsite(value: string | null | undefined): boolean {
  if (!value) return false;

  try {
    const host = new URL(value).hostname.toLowerCase();
    return (
      host === 'act.place' ||
      host === 'www.act.place' ||
      host === 'act-regenerative-studio.vercel.app' ||
      host === 'localhost'
    );
  } catch {
    return false;
  }
}

function resolveProjectWebsiteUrl(
  wikiUrl: string | null | undefined,
  ecosystemUrl: string | null | undefined
): string | null {
  const preferred = normalizeExternalUrl(wikiUrl);
  if (preferred && !isHubWebsite(preferred)) {
    return preferred;
  }

  const fallback = normalizeExternalUrl(ecosystemUrl);
  if (fallback && !isHubWebsite(fallback)) {
    return fallback;
  }

  return null;
}

function mapEmpathyLedgerMediaToGallery(
  content: FeaturedContentResponse | null
): EnrichedProject['mediaGallery'] {
  if (!content) return [];

  return content.media.items.map((item) => ({
    id: item.id,
    url: item.url,
    thumbnailUrl: item.thumbnail_url || item.preview_url || undefined,
    type: item.kind,
    title: item.title || undefined,
    alt: item.alt || item.title || undefined,
    caption: item.caption || undefined,
    credit: item.credit || undefined,
    isHero: item.is_hero,
    isFeatured: item.is_featured,
    source: 'empathy_ledger',
  }));
}

function mergeMediaGallery(
  primary: EnrichedProject['mediaGallery'],
  secondary: EnrichedProject['mediaGallery']
): EnrichedProject['mediaGallery'] {
  const merged = new Map<string, EnrichedProject['mediaGallery'][number]>();

  for (const item of [...primary, ...secondary]) {
    const key = item.url || item.id;
    if (!merged.has(key)) {
      merged.set(key, item);
    }
  }

  return Array.from(merged.values());
}

function mapSourcePacketMediaToGallery(
  packet: ProjectSourcePacket | null
): EnrichedProject['mediaGallery'] {
  if (!packet?.media_assets?.length) return [];

  return packet.media_assets
    .filter((item) => Boolean(item.uri_or_path))
    .map((item) => ({
      id: item.asset_id,
      url: item.uri_or_path,
      type: item.kind || 'image',
      alt: item.alt_text || undefined,
      caption: item.caption || undefined,
      isHero: false,
      isFeatured: true,
      source: 'empathy_ledger',
    }));
}

function getEmpathyLedgerCover(
  content: FeaturedContentResponse | null,
  projectTitle: string
): CoverImage | null {
  const hero = content?.media.hero;
  if (!hero || hero.kind !== 'image') {
    return null;
  }

  return {
    url: hero.url,
    alt: hero.alt || hero.title || `${projectTitle} cover`,
    source: 'empathy_ledger',
  };
}

function getSourcePacketCover(
  packet: ProjectSourcePacket | null,
  projectTitle: string
): CoverImage | null {
  const hero = packet?.media_assets?.find((item) => item.kind === 'image' && item.uri_or_path);
  if (!hero) {
    return null;
  }

  return {
    url: hero.uri_or_path,
    alt: hero.alt_text || packet?.narrative?.headline || `${projectTitle} cover`,
    source: 'empathy_ledger',
  };
}

/**
 * Get a project by slug with all enrichment data
 */
export const getProjectData = cache(async function getProjectData(
  slug: string
): Promise<EnrichedProject | null> {
  // 1. Get base static data (optional — wiki data fills the gap)
  const staticProject = projects.find((p) => p.slug === slug);

  // 2. Pre-fetch wiki data to resolve fallback title
  const wikiDataPreFetch = await getCanonicalWikiProject(slug, staticProject?.title).catch(() => null);

  // If no static project AND no wiki data, this project doesn't exist
  if (!staticProject && !wikiDataPreFetch) {
    return null;
  }

  // Build a synthetic static project from wiki data when static is missing
  const baseProject: Project = staticProject || {
    slug,
    title: wikiDataPreFetch?.title || slug,
    theme: 'earth' as ProjectTheme,
    tagline: wikiDataPreFetch?.summary || '',
    description: wikiDataPreFetch?.overview || '',
    focus: wikiDataPreFetch?.tier ? [wikiDataPreFetch.tier] : [],
  };

  // 3. Fetch all enrichment data in parallel
  const [
    wikiData,
    flagshipPack,
    websiteAliasWikiData,
    vignettes,
    coverImage,
    empathyLedgerContent,
    sourcePacket,
    mediaGallery,
    ecosystemData,
    wikiLCAA,
    wikiQuote,
    wikiStats,
    wikiKeyPeople,
    wikiBacklinks,
  ] = await Promise.all([
    // Canonical ACT wiki enrichment (reuse pre-fetch)
    Promise.resolve(wikiDataPreFetch),

    // Canonical flagship pack enrichment
    getFlagshipProjectPack(slug).catch(() => null),

    // Optional alias for project spoke site resolution
    PROJECT_WEBSITE_ALIASES[slug]
      ? getCanonicalWikiProject(PROJECT_WEBSITE_ALIASES[slug]).catch(() => null)
      : Promise.resolve(null),

    // Vignettes
    getProjectVignettes(slug, { limit: 3, sortBy: 'alma_score' }).catch(() => []),

    // Cover image with fallback chain
    getCoverImage(slug, baseProject.title, baseProject.heroImage).catch(() => null),

    // Empathy Ledger featured content
    getFeaturedContentForProject(slug, { type: 'all', limit: 10 }).catch(() => null),

    // Empathy Ledger source packet snapshot
    getProjectSourcePacket(slug).catch(() => null),

    // Media gallery
    getProjectMedia(slug, { limit: 12, includeHero: false }).catch(() => []),

    // Ecosystem data (from act-ecosystem repository)
    getEcosystemProject(slug).catch(() => null),

    // LCAA content extracted from wiki project doc (source of truth).
    // Research loop: canonical-site-wiki reads live — new wiki content appears
    // on next request without a rebuild.
    getProjectLCAA(slug).catch(() => null),

    // Pull-quote (epigraph) + stats extracted from wiki project doc.
    getProjectWikiQuote(slug).catch(() => null),
    getProjectWikiStats(slug).catch(() => []),

    // ## Key People section — people attached to the project in its wiki doc.
    getProjectKeyPeople(slug).catch(() => [] as ProjectWikiPerson[]),

    // ## Backlinks section — editorially-curated wiki cross-references.
    getProjectBacklinks(slug).catch(() => [] as ProjectWikiBacklink[]),
  ]);

  // 3. Merge and return enriched project
  const empathyLedgerMedia = mapEmpathyLedgerMediaToGallery(empathyLedgerContent);
  const sourcePacketMedia = mapSourcePacketMediaToGallery(sourcePacket);
  const mergedMediaGallery = mergeMediaGallery(
    mergeMediaGallery(empathyLedgerMedia, sourcePacketMedia),
    mediaGallery
  );
  const empathyLedgerCover = getEmpathyLedgerCover(
    empathyLedgerContent,
    baseProject.title
  );
  const sourcePacketCover = getSourcePacketCover(sourcePacket, baseProject.title);
  const localCoverOverride = LOCAL_COVER_IMAGE_OVERRIDES[slug];
  const localCoverVideoOverride = LOCAL_COVER_VIDEO_OVERRIDES[slug] || null;
  const resolvedWebsiteUrl = resolveProjectWebsiteUrl(
    wikiData?.publicSiteUrl || websiteAliasWikiData?.publicSiteUrl,
    ecosystemData?.production_url
  );
  const resolvedRepoUrl =
    flagshipPack?.implementation.primaryRepo?.githubUrl ||
    wikiData?.repoUrl ||
    websiteAliasWikiData?.repoUrl ||
    (ecosystemData?.github_repo
      ? `https://github.com/${ecosystemData.github_repo}`
      : null);

  // LCAA merge: wiki content wins when present; fall back to baseProject static.
  const mergedListen = wikiLCAA?.listen ?? baseProject.listen ?? undefined;
  const mergedCuriosity = wikiLCAA?.curiosity ?? baseProject.curiosity ?? undefined;
  const mergedAction = wikiLCAA?.action ?? baseProject.action ?? undefined;
  const mergedArt = wikiLCAA?.art ?? baseProject.art ?? undefined;

  // Quote + stats merge: wiki wins when present; fall back to baseProject static.
  const mergedQuote = wikiQuote
    ? {
        text: wikiQuote.text,
        author: wikiQuote.author || baseProject.quote?.author || '',
        role: wikiQuote.role || baseProject.quote?.role || '',
      }
    : baseProject.quote;
  const mergedStats =
    wikiStats && wikiStats.length > 0 ? wikiStats : baseProject.stats;

  return {
    ...baseProject,
    listen: mergedListen,
    curiosity: mergedCuriosity,
    action: mergedAction,
    art: mergedArt,
    quote: mergedQuote,
    stats: mergedStats,
    keyPeople: wikiKeyPeople || [],
    wikiBacklinks: wikiBacklinks || [],
    tagline:
      firstNonEmpty(flagshipPack?.summary, wikiData?.summary, baseProject.tagline) ||
      baseProject.tagline,
    description:
      firstNonEmpty(
        flagshipPack?.overview,
        flagshipPack?.whatItIs,
        flagshipPack?.systemPosition,
        wikiData?.overview,
        baseProject.description
      ) || baseProject.description,
    coverImage: localCoverOverride
      ? {
          url: localCoverOverride.url,
          alt: localCoverOverride.alt,
          source: 'static',
        }
      : coverImage?.source === 'media_gallery'
        ? coverImage
        : empathyLedgerCover || sourcePacketCover || coverImage,
    coverVideo: localCoverVideoOverride,
    vignettes,
    wikiData: wikiData || undefined,
    flagshipPack: flagshipPack || undefined,
    sourcePacket: sourcePacket || undefined,
    projectWebsiteUrl: resolvedWebsiteUrl,
    projectRepoUrl: resolvedRepoUrl,
    ecosystemData: ecosystemData || undefined,
    empathyLedgerContent,
    mediaGallery: mergedMediaGallery,
    // Computed fields
    hasLCAAContent: !!(mergedListen || mergedCuriosity || mergedAction || mergedArt),
    hasStats: !!(mergedStats && mergedStats.length > 0),
    hasQuote: !!mergedQuote,
    hasVideo:
      !!baseProject.videoUrl ||
      mergedMediaGallery.some((item) => item.type.startsWith('video') || item.type === 'video'),
  };
});

/**
 * Get minimal project data for listing pages (no async enrichment)
 */
export function getProjectBasicData(slug: string): Project | null {
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * Get all project slugs for static generation.
 * Merges static projects + canonical wiki projects so wiki-only
 * projects also get pages generated.
 */
export function getAllProjectSlugs(): string[] {
  const staticSlugs = new Set(projects.map((p) => p.slug));

  // Add wiki project slugs that aren't already in static data
  try {
    const snapshot = require('@/data/wiki-projects.generated.json') as {
      projects: Array<{ slug: string }>;
    };
    for (const wp of snapshot.projects) {
      staticSlugs.add(wp.slug);
    }
  } catch {
    // Snapshot not available — fall back to static only
  }

  return [...staticSlugs];
}

/**
 * Get projects grouped by theme
 */
export function getProjectsByTheme(): Record<ProjectTheme, Project[]> {
  const grouped: Record<ProjectTheme, Project[]> = {
    earth: [],
    justice: [],
    goods: [],
    valley: [],
    harvest: [],
  };

  for (const project of projects) {
    grouped[project.theme].push(project);
  }

  return grouped;
}

/**
 * Get related projects for a given project, preferring editorially-curated
 * wiki backlinks. Falls back to theme-heuristic matches to fill remaining slots.
 *
 * wikiBacklinkSlugs: optional list from project.wikiBacklinks — when provided,
 * backlinks that match a known project slug are used first (in wiki order).
 */
export function getRelatedProjects(
  slug: string,
  limit: number = 3,
  wikiBacklinkSlugs?: readonly string[]
): Project[] {
  const current = projects.find((p) => p.slug === slug);
  if (!current) return [];

  // 1. Wiki-curated connections first, preserving the wiki author's order.
  const ordered: Project[] = [];
  const seen = new Set<string>([slug]);
  if (wikiBacklinkSlugs?.length) {
    for (const backlinkSlug of wikiBacklinkSlugs) {
      if (seen.has(backlinkSlug)) continue;
      const match = projects.find((p) => p.slug === backlinkSlug);
      if (match) {
        ordered.push(match);
        seen.add(match.slug);
        if (ordered.length >= limit) return ordered;
      }
    }
  }

  // 2. Top up with same-theme projects to fill remaining slots.
  const sameTheme = projects.filter(
    (p) => p.theme === current.theme && !seen.has(p.slug)
  );
  for (const project of sameTheme) {
    ordered.push(project);
    seen.add(project.slug);
    if (ordered.length >= limit) return ordered;
  }

  // 3. Last resort: any remaining projects.
  const others = projects.filter((p) => !seen.has(p.slug));
  for (const project of others) {
    ordered.push(project);
    if (ordered.length >= limit) return ordered;
  }

  return ordered;
}

// Re-export theme styles for server components that import from this file
export { themeStyles, type ThemeStyle } from './theme-styles';
