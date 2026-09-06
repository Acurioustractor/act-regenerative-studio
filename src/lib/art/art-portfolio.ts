/**
 * Art Portfolio Data Layer
 *
 * Defines the 10 art projects in the ACT portfolio and hydrates them
 * with media from the Empathy Ledger featured snapshot.
 */

import { cache } from 'react';
import {
  getFeaturedContentForProject,
  type FeaturedContentResponse,
  type FeaturedMediaItem,
  type FeaturedStoryteller,
  type FeaturedStory,
} from '@/lib/empathy-ledger-featured';
import { cleanMediaAlt } from '@/lib/media/alt-text';

export type ArtMedium =
  | 'photography'
  | 'installation'
  | 'interactive'
  | 'performance'
  | 'sculpture'
  | 'painting'
  | 'exhibition'
  | 'residency'
  | 'making'
  | 'film';

export type ArtTag =
  | 'community-portrait'
  | 'cultural-preservation'
  | 'participatory'
  | 'public-art'
  | 'social-practice'
  | 'immersive'
  | 'justice-art'
  | 'documentary'
  | 'digital';

export type ArtStatus = 'exhibited' | 'active' | 'ideation' | 'concept';

export interface ArtProjectConfig {
  slug: string;
  /** Slug(s) to look up in the EL snapshot (may differ from canonical slug) */
  elSlugs: string[];
  title: string;
  quote: string;
  description: string;
  mediums: ArtMedium[];
  tags: ArtTag[];
  status: ArtStatus;
  lcaaStages?: string[];
  location?: string;
  year?: string;
  photoCount: number;
  storytellerCount: number;
  connectedProject?: string;
  connectedProjectHref?: string;
  /**
   * The work's own public site, when it has one. Distinct from
   * `connectedProjectHref`, which says what ACT project this art sits inside
   * and renders as "Part of X". A work with its own wall or exhibition site is
   * not part of that site; the site IS the work, and a page describing it that
   * does not link to it is a review of something the reader cannot go and see.
   */
  externalSite?: { label: string; url: string };
  philosophy?: string;
  impact?: string;
  /**
   * Local looping hero video for video-led works that have no Empathy Ledger
   * photo media. Used as the card thumbnail and the detail-page hero.
   */
  /**
   * fit: 'contain' letterboxes the video instead of cropping it. Use for film
   * with burned-in captions, which object-cover cuts mid-word in the 4/3 card
   * and 21/9 hero frames.
   */
  heroVideo?: { url: string; posterUrl?: string; alt?: string; fit?: 'cover' | 'contain' };
  /**
   * Direct Empathy Ledger link for this art piece. Use when the art work
   * doesn't map cleanly to a parent ACT project slug. Takes precedence over
   * the ACT-project fallback when rendering the EL Connections panel.
   */
  empathyLedger?: {
    orgSlug: string;
    elProjectSlugs?: string[];
    notes?: string;
  };
}

export interface HydratedArtProject extends ArtProjectConfig {
  media: FeaturedMediaItem[];
  heroImage: FeaturedMediaItem | null;
  storytellers: FeaturedStoryteller[];
  stories: FeaturedStory[];
  elContent: FeaturedContentResponse | null;
}

import artPiecesSnapshot from '@/data/art-pieces.generated.json';
import { ART_OVERRIDES } from './art-overrides';

/**
 * Every piece on /art comes from src/data/art-pieces.generated.json, which
 * scripts/sync-art-pieces.mjs builds from the ACT project record (identity)
 * and each piece's wiki page (prose). Nothing about a piece is typed here;
 * src/lib/art/art-overrides.ts holds the few presentation extras.
 *
 * photoCount and storytellerCount start at 0 and are filled from Empathy
 * Ledger when the piece is hydrated, so the numbers on the page are live.
 */
interface GeneratedArtPiece {
  code: string;
  slug: string;
  aliases: string[];
  title: string;
  quote: string;
  description: string;
  philosophy: string | null;
  impact: string | null;
  mediums: string[];
  tags: string[];
  status: string;
  lcaaStages: string[];
  year: string | null;
  location: string | null;
  connectedProject: string | null;
  connectedProjectHref: string | null;
  elSlugs: string[];
}

const ART_MEDIUMS: ReadonlySet<string> = new Set<ArtMedium>([
  'photography', 'installation', 'interactive', 'performance', 'sculpture',
  'painting', 'exhibition', 'residency', 'making', 'film',
]);
const ART_TAGS: ReadonlySet<string> = new Set<ArtTag>([
  'community-portrait', 'cultural-preservation', 'participatory', 'public-art',
  'social-practice', 'immersive', 'justice-art', 'documentary', 'digital',
]);
const ART_STATUSES: ReadonlySet<string> = new Set<ArtStatus>(['exhibited', 'active', 'ideation', 'concept']);

function toConfig(piece: GeneratedArtPiece): ArtProjectConfig {
  const override = ART_OVERRIDES[piece.slug] || {};
  return {
    slug: piece.slug,
    elSlugs: piece.elSlugs,
    title: piece.title,
    quote: piece.quote,
    description: piece.description,
    mediums: piece.mediums.filter((m): m is ArtMedium => ART_MEDIUMS.has(m)),
    tags: piece.tags.filter((t): t is ArtTag => ART_TAGS.has(t)),
    status: (ART_STATUSES.has(piece.status) ? piece.status : 'active') as ArtStatus,
    lcaaStages: piece.lcaaStages.length ? piece.lcaaStages : undefined,
    location: piece.location || undefined,
    year: piece.year || undefined,
    photoCount: 0,
    storytellerCount: 0,
    connectedProject: override.connectedProject ?? piece.connectedProject ?? undefined,
    connectedProjectHref: override.connectedProjectHref ?? piece.connectedProjectHref ?? undefined,
    philosophy: piece.philosophy || undefined,
    impact: piece.impact || undefined,
    heroVideo: override.heroVideo,
    externalSite: override.externalSite,
    empathyLedger: override.empathyLedger,
  };
}

const ART_PROJECTS: ArtProjectConfig[] = (
  (artPiecesSnapshot as unknown as { pieces: GeneratedArtPiece[] }).pieces
).map(toConfig);

/** Old studio slugs still resolve to the piece they were published under. */
const ART_SLUG_ALIASES: Record<string, string> = Object.fromEntries(
  (artPiecesSnapshot as unknown as { pieces: GeneratedArtPiece[] }).pieces.flatMap((p) =>
    p.aliases.map((alias) => [alias, p.slug] as const)
  )
);

export function getArtProjectConfigs(): ArtProjectConfig[] {
  return ART_PROJECTS;
}

/**
 * Get a single art project config by slug.
 */
export function getArtProjectConfigBySlug(
  slug: string
): ArtProjectConfig | null {
  const canonical = ART_SLUG_ALIASES[slug] || slug;
  return ART_PROJECTS.find((project) => project.slug === canonical) || null;
}

/**
 * Get all valid art project slugs (for generateStaticParams).
 */
export function getAllArtSlugs(): string[] {
  return ART_PROJECTS.map((project) => project.slug);
}

/**
 * Hydrate a single art project with EL featured content.
 */
async function hydrateArtProject(
  config: ArtProjectConfig
): Promise<HydratedArtProject> {
  let elContent: FeaturedContentResponse | null = null;

  for (const elSlug of config.elSlugs) {
    elContent = await getFeaturedContentForProject(elSlug, {
      limit: 10,
      mediaLimit: 24,
    });
    if (elContent) break;
  }

  const cleanItem = (
    item: FeaturedMediaItem,
    index: number
  ): FeaturedMediaItem => {
    const fallbackAlt =
      index === 0
        ? `${config.title} artwork documentation`
        : `${config.title} artwork documentation ${index + 1}`;
    return {
      ...item,
      alt: cleanMediaAlt(item.alt || item.title, fallbackAlt) || fallbackAlt,
    };
  };

  const media = (elContent?.media.items || []).map(cleanItem);
  const heroImage = elContent?.media.hero
    ? cleanItem(elContent.media.hero, 0)
    : media[0] || null;
  const storytellers = elContent?.featured.storytellers || [];
  const stories = elContent?.featured.stories || [];

  return {
    ...config,
    photoCount: elContent?.meta?.media_count ?? media.length,
    storytellerCount: elContent?.meta?.storyteller_count ?? storytellers.length,
    media,
    heroImage,
    storytellers,
    stories,
    elContent,
  };
}

/**
 * Get all art projects hydrated with EL content (cached per request).
 */
export const getAllArtProjects = cache(
  async (): Promise<HydratedArtProject[]> => {
    const hydrated = await Promise.all(
      ART_PROJECTS.map((config) => hydrateArtProject(config))
    );
    return hydrated;
  }
);

/**
 * Get a single hydrated art project by slug.
 */
export const getArtProject = cache(
  async (slug: string): Promise<HydratedArtProject | null> => {
    const config = getArtProjectConfigBySlug(slug);
    if (!config) return null;
    return hydrateArtProject(config);
  }
);

/**
 * Split art projects into featured (have media or storytellers) and emerging.
 */
export function splitFeaturedAndEmerging(
  projects: HydratedArtProject[]
): { featured: HydratedArtProject[]; emerging: HydratedArtProject[] } {
  const featured: HydratedArtProject[] = [];
  const emerging: HydratedArtProject[] = [];

  for (const project of projects) {
    if (
      project.status === 'ideation' ||
      project.status === 'concept' ||
      (project.media.length === 0 &&
        project.storytellerCount === 0 &&
        project.stories.length === 0 &&
        !project.heroVideo)
    ) {
      emerging.push(project);
    } else {
      featured.push(project);
    }
  }

  return { featured, emerging };
}
