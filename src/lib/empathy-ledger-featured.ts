/**
 * Empathy Ledger Project Live Feed
 *
 * Priority:
 * 1. Site-scoped v2 syndication feed (API key + site slug required)
 * 2. Content Hub fallback (broader ecosystem content)
 *
 * This keeps the ACT studio site tied to consented, site-safe media and
 * stories where available, while still degrading gracefully in local or
 * partially configured environments.
 */

import { cache } from 'react';
import {
  EMPATHY_LEDGER_PUBLIC_URL,
  EMPATHY_LEDGER_SITE_SLUG,
  fetchEmpathyLedgerJson,
} from '@/lib/empathy-ledger-runtime';
import featuredSnapshot from '@/data/empathy-ledger-featured.generated.json';
import projectCodeRegistry from '@/data/project-code-registry.generated.json';

export interface FeaturedStoryteller {
  storyteller_id: string;
  full_name: string | null;
  display_name: string | null;
  bio: string | null;
  profile_image_url: string | null;
  current_organization: string | null;
  current_role: string | null;
  featured_bio: string | null;
  custom_tagline: string | null;
  featured_priority: number;
  featured_story_count: number;
  opted_in_at: string;
  approved_at: string;
}

export interface FeaturedStory {
  story_id: string;
  story_title: string;
  excerpt: string | null;
  themes: string[] | null;
  featured_image_url: string | null;
  video_url: string | null;
  audio_url: string | null;
  submitted_at: string;
  storyteller_id: string;
  storyteller_name: string | null;
  storyteller_display_name: string | null;
  storyteller_image: string | null;
  featured_priority: number;
  featured_as_hero: boolean;
  relevance_score: number | null;
  ai_reasoning: string | null;
  story_url: string | null;
  content_url: string | null;
}

export interface FeaturedMediaItem {
  id: string;
  url: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  type: string;
  kind: 'image' | 'video' | 'audio' | 'other';
  title: string | null;
  alt: string | null;
  caption: string | null;
  credit: string | null;
  is_hero: boolean;
  is_featured: boolean;
  source: 'site-syndication' | 'content-hub';
}

export interface FeaturedContentResponse {
  project: {
    slug: string;
    title: string;
    organization: string | null;
    focus_areas: string[] | null;
    themes: string[] | null;
    project_id?: string | null;
    organization_id?: string | null;
  };
  featured: {
    storytellers: FeaturedStoryteller[];
    stories: FeaturedStory[];
  };
  media: {
    items: FeaturedMediaItem[];
    hero: FeaturedMediaItem | null;
  };
  meta: {
    storyteller_count: number;
    story_count: number;
    media_count: number;
    gallery_count: number;
    fetched_at: string;
    source: 'site-syndication' | 'content-hub';
    site_slug: string | null;
  };
}

interface FeaturedContentSnapshot {
  generatedAt: string;
  sourceUrl: string | null;
  sourceOrganizationId: string | null;
  projectCount: number;
  projects: Record<string, FeaturedContentResponse | null>;
}

interface ProjectCodeRegistrySnapshot {
  projects: Array<{
    code: string;
    canonicalSlug: string;
    aliases?: string[];
  }>;
}

interface SiteProjectRecord {
  id: string;
  name: string;
  description: string | null;
  projectCode: string | null;
  status: string | null;
  organizationId: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  galleries: Array<{
    id: string;
    title: string;
    slug: string | null;
    coverImage: string | null;
    photoCount: number | null;
    status: string | null;
  }>;
  storytellerCount: number;
  storyCount: number;
  createdAt: string;
}

interface SiteStoryRecord {
  id: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  themes: string[];
  publishedAt: string | null;
  culturalLevel: string | null;
  projectId: string | null;
  storyteller: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
    culturalBackground: string | null;
  } | null;
  consent: {
    approvedAt: string | null;
    culturalPermissionLevel: string | null;
  } | null;
  contentUrl: string | null;
}

interface SiteStorytellerProfile {
  id: string;
  display_name?: string | null;
  displayName?: string | null;
  bio: string | null;
  cultural_background?: string | null;
  culturalBackground?: string | null;
  location: string | null;
  role: string | null;
  is_elder?: boolean;
  isElder?: boolean;
  profile_image_url?: string | null;
  profileImageUrl?: string | null;
}

interface SiteMediaRecord {
  id: string;
  title: string | null;
  description: string | null;
  contentType: string | null;
  url: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  altText: string | null;
  galleryCaption: string | null;
  projectId: string | null;
  sourceType?: string | null;
  isHero?: boolean | null;
}

const FEATURED_CONTENT_SNAPSHOT =
  featuredSnapshot as unknown as FeaturedContentSnapshot;

const PROJECT_CODE_REGISTRY =
  projectCodeRegistry as unknown as ProjectCodeRegistrySnapshot;

function getProjectKeyCandidates(projectSlug: string): string[] {
  const registryRecord =
    PROJECT_CODE_REGISTRY.projects.find(
      (record) => record.canonicalSlug === projectSlug
    ) || null;

  return Array.from(
    new Set([projectSlug, registryRecord?.code, ...(registryRecord?.aliases || [])])
  ).filter(Boolean) as string[];
}

async function fetchJson<T>(url: string): Promise<T | null> {
  return fetchEmpathyLedgerJson<T>(url, { revalidate: 300 });
}

function inferMediaKind(type: string | null | undefined): FeaturedMediaItem['kind'] {
  const normalized = (type || '').toLowerCase();

  if (normalized.startsWith('video')) return 'video';
  if (normalized.startsWith('audio')) return 'audio';
  if (
    normalized.startsWith('image') ||
    normalized === 'photo' ||
    normalized === 'image'
  ) {
    return 'image';
  }

  return 'other';
}

function normalizeThemes(
  themes: Array<string | { name?: string | null }> | null | undefined
): string[] {
  if (!Array.isArray(themes)) {
    return [];
  }

  return themes
    .map((theme) => {
      if (typeof theme === 'string') {
        return theme;
      }

      return theme?.name || null;
    })
    .filter((theme): theme is string => !!theme);
}

function sliceFeaturedContentResponse(
  response: FeaturedContentResponse,
  limits: { storyLimit: number; mediaLimit: number; storytellerLimit: number }
): FeaturedContentResponse {
  const stories = response.featured.stories.slice(0, limits.storyLimit);
  const storytellers = response.featured.storytellers.slice(
    0,
    limits.storytellerLimit
  );
  const mediaItems = response.media.items.slice(0, limits.mediaLimit);
  const hero =
    mediaItems.find((item) => item.is_hero) ||
    (response.media.hero &&
    mediaItems.some((item) => item.id === response.media.hero?.id)
      ? response.media.hero
      : null) ||
    mediaItems[0] ||
    null;

  return {
    ...response,
    featured: {
      storytellers,
      stories,
    },
    media: {
      items: mediaItems,
      hero,
    },
  };
}

function getSnapshotFeaturedContent(
  projectSlug: string,
  limits: { storyLimit: number; mediaLimit: number; storytellerLimit: number }
): FeaturedContentResponse | null | undefined {
  if (!Object.prototype.hasOwnProperty.call(FEATURED_CONTENT_SNAPSHOT.projects, projectSlug)) {
    return undefined;
  }

  const response = FEATURED_CONTENT_SNAPSHOT.projects[projectSlug];
  if (!response) {
    return null;
  }

  return sliceFeaturedContentResponse(response, limits);
}

function dedupeStorytellers(
  stories: FeaturedStory[],
  storytellerProfiles: SiteStorytellerProfile[],
  organizationName: string | null,
  fetchedAt: string
): FeaturedStoryteller[] {
  const storyCounts = new Map<string, number>();

  for (const story of stories) {
    storyCounts.set(
      story.storyteller_id,
      (storyCounts.get(story.storyteller_id) || 0) + 1
    );
  }

  const profilesById = new Map<string, SiteStorytellerProfile>();
  for (const profile of storytellerProfiles) {
    profilesById.set(profile.id, profile);
  }

  const storytellerIds = Array.from(
    new Set(stories.map((story) => story.storyteller_id).filter(Boolean))
  );

  return storytellerIds.map((storytellerId, index) => {
    const profile = profilesById.get(storytellerId);
    const firstStory = stories.find((story) => story.storyteller_id === storytellerId);
    const name =
      profile?.displayName ||
      profile?.display_name ||
      firstStory?.storyteller_display_name ||
      firstStory?.storyteller_name ||
      null;

    const culturalBackground =
      profile?.culturalBackground || profile?.cultural_background || null;
    const role = profile?.role || null;

    return {
      storyteller_id: storytellerId,
      full_name: name,
      display_name: name,
      bio: profile?.bio || null,
      profile_image_url:
        profile?.profileImageUrl || profile?.profile_image_url || firstStory?.storyteller_image || null,
      current_organization: organizationName,
      current_role: role,
      featured_bio: profile?.bio || null,
      custom_tagline:
        role || culturalBackground || ((profile?.isElder || profile?.is_elder) ? 'Elder' : null),
      featured_priority: index + 1,
      featured_story_count: storyCounts.get(storytellerId) || 0,
      opted_in_at: firstStory?.submitted_at || fetchedAt,
      approved_at: firstStory?.submitted_at || fetchedAt,
    };
  });
}

function mapSiteStoriesToFeatured(stories: SiteStoryRecord[]): FeaturedStory[] {
  return stories.map((story, index) => ({
    story_id: story.id,
    story_title: story.title,
    excerpt: story.excerpt,
    themes: story.themes || [],
    featured_image_url: story.imageUrl,
    video_url: null,
    audio_url: null,
    submitted_at: story.publishedAt || new Date().toISOString(),
    storyteller_id: story.storyteller?.id || '',
    storyteller_name: story.storyteller?.displayName || null,
    storyteller_display_name: story.storyteller?.displayName || null,
    storyteller_image: story.storyteller?.avatarUrl || null,
    featured_priority: index + 1,
    featured_as_hero: index === 0,
    relevance_score: null,
    ai_reasoning: 'Site-scoped consented story from Empathy Ledger syndication.',
    story_url: `${EMPATHY_LEDGER_PUBLIC_URL}/stories/${story.id}`,
    content_url: story.contentUrl || null,
  }));
}

function mapSiteMediaToFeatured(media: SiteMediaRecord[]): FeaturedMediaItem[] {
  const explicitHeroId =
    media.find((item) => item.isHero)?.id ||
    media.find((item) => item.sourceType === 'hero_asset')?.id ||
    null;
  let heroAssigned = false;

  return media.map((item) => {
    const kind = inferMediaKind(item.contentType);
    const isHero =
      (explicitHeroId ? item.id === explicitHeroId : !heroAssigned && kind === 'image') &&
      kind === 'image';
    if (isHero) {
      heroAssigned = true;
    }

    return {
      id: item.id,
      url: item.url,
      thumbnail_url: item.thumbnailUrl,
      preview_url: item.previewUrl,
      type: item.contentType || kind,
      kind,
      title: item.title,
      alt: item.altText,
      caption: item.galleryCaption || item.description,
      credit: null,
      is_hero: isHero,
      is_featured: isHero,
      source: 'site-syndication',
    };
  });
}

async function fetchSiteScopedProjectFeed(
  projectSlug: string,
  limits: { storyLimit: number; mediaLimit: number; storytellerLimit: number }
): Promise<FeaturedContentResponse | null> {
  if (!process.env.EMPATHY_LEDGER_API_KEY) {
    return null;
  }

  const searchParams = new URLSearchParams({
    storyLimit: String(limits.storyLimit),
    mediaLimit: String(limits.mediaLimit),
    storytellerLimit: String(limits.storytellerLimit),
  });

  const candidateKeys = getProjectKeyCandidates(projectSlug);

  let payload: {
    project: SiteProjectRecord;
    stories: SiteStoryRecord[];
    storytellers: SiteStorytellerProfile[];
    media: SiteMediaRecord[];
    meta: {
      storyCount: number;
      storytellerCount: number;
      mediaCount: number;
      galleryCount: number;
      fetchedAt: string;
    };
  } | null = null;

  for (const candidateKey of candidateKeys) {
    payload = await fetchJson<{
      project: SiteProjectRecord;
      stories: SiteStoryRecord[];
      storytellers: SiteStorytellerProfile[];
      media: SiteMediaRecord[];
      meta: {
        storyCount: number;
        storytellerCount: number;
        mediaCount: number;
        galleryCount: number;
        fetchedAt: string;
      };
    }>(
      `/api/v2/sites/${EMPATHY_LEDGER_SITE_SLUG}/projects/${candidateKey}?${searchParams.toString()}`
    );

    if (payload) {
      break;
    }
  }

  if (!payload) {
    return null;
  }

  const featuredStories = mapSiteStoriesToFeatured(payload.stories || []);
  const featuredStorytellers = dedupeStorytellers(
    featuredStories,
    payload.storytellers || [],
    payload.project.name,
    payload.meta.fetchedAt
  );
  const featuredMedia = mapSiteMediaToFeatured(payload.media || []);

  return {
    project: {
      slug: payload.project.projectCode || projectSlug,
      title: payload.project.name,
      organization: payload.project.name,
      focus_areas: null,
      themes: null,
      project_id: payload.project.id,
      organization_id: payload.project.organizationId,
    },
    featured: {
      storytellers: featuredStorytellers,
      stories: featuredStories,
    },
    media: {
      items: featuredMedia,
      hero: featuredMedia.find((item) => item.is_hero) || featuredMedia[0] || null,
    },
    meta: {
      storyteller_count: payload.meta.storytellerCount,
      story_count: payload.meta.storyCount,
      media_count: payload.meta.mediaCount,
      gallery_count: payload.meta.galleryCount,
      fetched_at: payload.meta.fetchedAt,
      source: 'site-syndication',
      site_slug: EMPATHY_LEDGER_SITE_SLUG,
    },
  };
}

async function fetchContentHubFallback(
  projectSlug: string,
  limits: { storyLimit: number; mediaLimit: number; storytellerLimit: number }
): Promise<FeaturedContentResponse | null> {
  const candidateKeys = getProjectKeyCandidates(projectSlug);

  let storiesPayload: {
    stories: Array<{
      id: string;
      title: string;
      summary?: string | null;
      authorName?: string | null;
      authorId?: string | null;
      publishedAt?: string | null;
      themes?: string[];
    }>;
  } | null = null;
  let storytellersPayload: {
    storytellers: Array<{
      id: string;
      displayName?: string | null;
      bio?: string | null;
      avatarUrl?: string | null;
      culturalBackground?: string | null;
      elderStatus?: boolean;
    }>;
  } | null = null;
  let mediaPayload: {
    media: Array<{
      id: string;
      url: string;
      thumbnailUrl?: string | null;
      title?: string | null;
      description?: string | null;
      altText?: string | null;
      mediaType?: string | null;
      attributionText?: string | null;
      sourceType?: string | null;
      projectId?: string | null;
      isHero?: boolean | null;
    }>;
  } | null = null;

  for (const candidateKey of candidateKeys) {
    const [candidateStories, candidateStorytellers, candidateMedia] =
      await Promise.all([
        fetchJson<{
          stories: Array<{
            id: string;
            title: string;
            summary?: string | null;
            authorName?: string | null;
            authorId?: string | null;
            publishedAt?: string | null;
            themes?: string[];
          }>;
        }>(
          `/api/v1/content-hub/stories?project=${candidateKey}&limit=${limits.storyLimit}`
        ),
        fetchJson<{
          storytellers: Array<{
            id: string;
            displayName?: string | null;
            bio?: string | null;
            avatarUrl?: string | null;
            culturalBackground?: string | null;
            elderStatus?: boolean;
          }>;
        }>(
          `/api/v1/content-hub/storytellers?project=${candidateKey}&limit=${limits.storytellerLimit}`
        ),
        fetchJson<{
          media: Array<{
            id: string;
            url: string;
            thumbnailUrl?: string | null;
            title?: string | null;
            description?: string | null;
            altText?: string | null;
            mediaType?: string | null;
            attributionText?: string | null;
            sourceType?: string | null;
            projectId?: string | null;
            isHero?: boolean | null;
          }>;
        }>(
          `/api/v1/content-hub/media?project=${candidateKey}&limit=${limits.mediaLimit}`
        ),
      ]);

    const hasCandidateContent =
      (candidateStories?.stories?.length || 0) > 0 ||
      (candidateStorytellers?.storytellers?.length || 0) > 0 ||
      (candidateMedia?.media?.length || 0) > 0;

    if (hasCandidateContent) {
      storiesPayload = candidateStories;
      storytellersPayload = candidateStorytellers;
      mediaPayload = candidateMedia;
      break;
    }
  }

  const stories = (storiesPayload?.stories || []).map((story, index) => ({
    story_id: story.id,
    story_title: story.title,
    excerpt: story.summary || null,
    themes: normalizeThemes(story.themes),
    featured_image_url: null,
    video_url: null,
    audio_url: null,
    submitted_at: story.publishedAt || new Date().toISOString(),
    storyteller_id: story.authorId || `story-${index}`,
    storyteller_name: story.authorName || null,
    storyteller_display_name: story.authorName || null,
    storyteller_image: null,
    featured_priority: index + 1,
    featured_as_hero: index === 0,
    relevance_score: null,
    ai_reasoning: 'Content Hub fallback content from Empathy Ledger.',
    story_url: `${EMPATHY_LEDGER_PUBLIC_URL}/stories/${story.id}`,
    content_url: null,
  }));

  const storytellers = (storytellersPayload?.storytellers || []).map(
    (storyteller, index) => ({
      storyteller_id: storyteller.id,
      full_name: storyteller.displayName || null,
      display_name: storyteller.displayName || null,
      bio: storyteller.bio || null,
      profile_image_url: storyteller.avatarUrl || null,
      current_organization: null,
      current_role: null,
      featured_bio: storyteller.bio || null,
      custom_tagline:
        storyteller.culturalBackground ||
        (storyteller.elderStatus ? 'Elder' : null) ||
        null,
      featured_priority: index + 1,
      featured_story_count: stories.filter(
        (story) => story.storyteller_id === storyteller.id
      ).length,
      opted_in_at: new Date().toISOString(),
      approved_at: new Date().toISOString(),
    })
  );

  const mediaItems = (mediaPayload?.media || []).map((item, index) => {
    const kind = inferMediaKind(item.mediaType);
    const isHero = Boolean(item.isHero) || (item.sourceType === 'hero_asset' && kind === 'image');
    return {
      id: item.id,
      url: item.url,
      thumbnail_url: item.thumbnailUrl || null,
      preview_url: item.thumbnailUrl || null,
      type: item.mediaType || kind,
      kind,
      title: item.title || null,
      alt: item.altText || null,
      caption: item.description || null,
      credit: item.attributionText || null,
      is_hero: isHero || (index === 0 && kind === 'image'),
      is_featured: isHero || (index === 0 && kind === 'image'),
      source: 'content-hub' as const,
    };
  });

  if (stories.length === 0 && storytellers.length === 0 && mediaItems.length === 0) {
    return null;
  }

  return {
    project: {
      slug: projectSlug,
      title: projectSlug,
      organization: null,
      focus_areas: null,
      themes: null,
      project_id: null,
      organization_id: null,
    },
    featured: {
      storytellers,
      stories,
    },
    media: {
      items: mediaItems,
      hero: mediaItems.find((item) => item.is_hero) || mediaItems[0] || null,
    },
    meta: {
      storyteller_count: storytellers.length,
      story_count: stories.length,
      media_count: mediaItems.length,
      gallery_count: 0,
      fetched_at: new Date().toISOString(),
      source: 'content-hub',
      site_slug: null,
    },
  };
}

/**
 * Fetch consented project stories, storytellers, and media for the ACT studio site.
 */
type FeaturedContentOptions = {
  type?: 'storytellers' | 'stories' | 'all';
  limit?: number;
  mediaLimit?: number;
};

const getFeaturedContentForProjectCached = cache(
  async (
    projectSlug: string,
    serializedOptions: string
  ): Promise<FeaturedContentResponse | null> => {
    const options = JSON.parse(serializedOptions) as FeaturedContentOptions;
    const { limit = 10, mediaLimit = 12 } = options;
    const limits = {
      storyLimit: limit,
      mediaLimit,
      storytellerLimit: Math.min(limit, 12),
    };

    const snapshotResponse = getSnapshotFeaturedContent(projectSlug, limits);
    if (snapshotResponse !== undefined) {
      return snapshotResponse;
    }

    try {
      return (
        (await fetchSiteScopedProjectFeed(projectSlug, limits)) ||
        (await fetchContentHubFallback(projectSlug, limits))
      );
    } catch (error) {
      console.error(
        `Error fetching live Empathy Ledger content for project ${projectSlug}:`,
        error
      );
      return null;
    }
  }
);

export async function getFeaturedContentForProject(
  projectSlug: string,
  options: FeaturedContentOptions = {}
): Promise<FeaturedContentResponse | null> {
  const serializedOptions = JSON.stringify({
    type: options.type ?? 'all',
    limit: options.limit ?? 10,
    mediaLimit: options.mediaLimit ?? 12,
  });

  return getFeaturedContentForProjectCached(projectSlug, serializedOptions);
}

export async function getFeaturedStorytellersForProject(
  projectSlug: string,
  limit: number = 5
): Promise<FeaturedStoryteller[]> {
  const response = await getFeaturedContentForProject(projectSlug, {
    type: 'storytellers',
    limit,
  });

  return response?.featured.storytellers || [];
}

export async function getFeaturedStoriesForProject(
  projectSlug: string,
  limit: number = 3
): Promise<FeaturedStory[]> {
  const response = await getFeaturedContentForProject(projectSlug, {
    type: 'stories',
    limit,
  });

  return response?.featured.stories || [];
}

export async function getHeroStoryForProject(
  projectSlug: string
): Promise<FeaturedStory | null> {
  const stories = await getFeaturedStoriesForProject(projectSlug, 1);
  return stories.length > 0 && stories[0].featured_as_hero
    ? stories[0]
    : null;
}

export async function projectHasFeaturedContent(
  projectSlug: string
): Promise<boolean> {
  const response = await getFeaturedContentForProject(projectSlug, { limit: 1 });
  if (!response) return false;

  return (
    response.meta.storyteller_count > 0 ||
    response.meta.story_count > 0 ||
    response.meta.media_count > 0
  );
}

export async function getAllFeaturedContent(): Promise<
  Record<string, FeaturedContentResponse>
> {
  return Object.fromEntries(
    Object.entries(FEATURED_CONTENT_SNAPSHOT.projects).filter(
      (entry): entry is [string, FeaturedContentResponse] => Boolean(entry[1])
    )
  );
}
