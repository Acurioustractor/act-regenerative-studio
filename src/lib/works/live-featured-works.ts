import { cache } from "react";

import {
  getProjectData,
  type EnrichedProject,
} from "@/lib/projects/get-project-data";
import { getProjectFieldMedia } from "@/lib/projects/get-project-field-media";

export interface FeaturedWorkConfig {
  slug: string;
  title: string;
  href: string;
  medium: string;
  place: string;
  collaborators: string;
  connectedTo: string;
  connectedHref?: string;
  fallbackDescription: string;
  fallbackQuote: string;
}

export interface FeaturedWorkPreviewMedia {
  kind: "image" | "video" | "audio" | "other";
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  alt: string | null;
  caption: string | null;
}

export interface LiveFeaturedWork {
  slug: string;
  title: string;
  href: string;
  medium: string;
  place: string;
  collaborators: string;
  connectedTo: string;
  description: string;
  quote: string;
  previewMedia: FeaturedWorkPreviewMedia | null;
  supportingMedia: Array<{
    url: string;
    alt: string;
    eyebrow?: string;
  }>;
  live: {
    storyCount: number;
    storytellerCount: number;
    mediaCount: number;
    galleryCount: number;
    source: "site-syndication" | "content-hub" | null;
    siteSlug: string | null;
    fetchedAt: string | null;
  };
  project: EnrichedProject | null;
}

export interface FeaturedWorkVoiceFragment {
  text: string;
  attribution: string;
  href: string;
}

export interface FeaturedWorkCollaborator {
  key: string;
  name: string;
  role: string;
  description: string;
  href: string;
  relatedWorks: string[];
  avatarUrl: string | null;
  source: "storyteller" | "work-config";
}

export const featuredWorkConfigs: FeaturedWorkConfig[] = [
  {
    slug: "gold-phone",
    title: "Gold.Phone",
    href: "/projects/gold-phone",
    medium: "Interactive voice work",
    place: "Distributed / digital",
    collaborators: "Empathy Ledger / ACT Studio",
    connectedTo: "Empathy Ledger",
    connectedHref: "/projects/empathy-ledger",
    fallbackDescription:
      "A participatory work where voice arrives as encounter rather than content, allowing testimony to move through space slowly and with tension.",
    fallbackQuote: "Move your cursor over a voice particle to hear it.",
  },
  {
    slug: "contained",
    title: "Contained",
    href: "/projects/contained",
    medium: "Experiential installation",
    place: "Justice and public-space contexts",
    collaborators: "JusticeHub / ACT Studio",
    connectedTo: "JusticeHub",
    connectedHref: "/projects/justicehub",
    fallbackDescription:
      "An installation exploring detention, alternatives, and the emotional architecture of confinement.",
    fallbackQuote:
      "Some systems can only be understood once they are felt in the body.",
  },
  {
    slug: "uncle-allan-palm-island-art",
    title: "Uncle Allan Palm Island Art",
    href: "/projects/uncle-allan-palm-island-art",
    medium: "Art practice and cultural knowledge sharing",
    place: "Palm Island",
    collaborators: "Uncle Allan / ACT",
    connectedTo: "Works",
    connectedHref: "/art",
    fallbackDescription:
      "A body of work grounded in cultural memory, authority, and the passing on of story through image and material practice.",
    fallbackQuote: "Art is one of the ways story stays in community hands.",
  },
  {
    slug: "the-confessional",
    title: "The Confessional",
    href: "/projects/the-confessional",
    medium: "Storytelling installation",
    place: "Public and event contexts",
    collaborators: "ACT Studio",
    connectedTo: "Works",
    connectedHref: "/art",
    fallbackDescription:
      "A work for anonymous truth-telling, pressure release, and the public handling of what systems teach people to hide.",
    fallbackQuote:
      "Some truths only come out when anonymity creates enough safety to speak.",
  },
];

export function getFeaturedWorkConfigBySlug(
  slug: string
): FeaturedWorkConfig | null {
  return featuredWorkConfigs.find((config) => config.slug === slug) || null;
}

function summarizeText(text: string | null | undefined, limit: number): string {
  if (!text) return "";

  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) {
    return normalized;
  }

  const clipped = normalized.slice(0, limit);
  const boundary = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, boundary > 80 ? boundary : limit).trim()}…`;
}

function normalizeValue(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferMediaKind(
  type: string | null | undefined
): FeaturedWorkPreviewMedia["kind"] {
  const normalized = (type || "").toLowerCase();

  if (normalized.startsWith("video")) return "video";
  if (normalized.startsWith("audio")) return "audio";
  if (normalized.startsWith("image") || normalized === "photo") return "image";

  return "other";
}

function getPrimaryStory(project: EnrichedProject | null) {
  const stories = project?.empathyLedgerContent?.featured.stories || [];
  return stories.find((story) => story.featured_as_hero) || stories[0] || null;
}

function getPrimaryStoryteller(project: EnrichedProject | null) {
  const storytellers = project?.empathyLedgerContent?.featured.storytellers || [];
  return storytellers[0] || null;
}

function getPreviewMedia(
  project: EnrichedProject | null
): FeaturedWorkPreviewMedia | null {
  const fieldMedia = project ? getProjectFieldMedia(project) : null;

  if (project?.coverVideo?.url) {
    return {
      kind: "video",
      url: project.coverVideo.url,
      thumbnailUrl: project.coverVideo.posterUrl || project.coverImage?.url || null,
      title: project.coverVideo.title || project.title,
      alt: project.coverVideo.title || project.title,
      caption: null,
    };
  }

  if (fieldMedia?.video?.url) {
    return {
      kind: "video",
      url: fieldMedia.video.url,
      thumbnailUrl:
        fieldMedia.video.posterUrl ||
        project?.coverImage?.url ||
        fieldMedia.images[0]?.url ||
        null,
      title: fieldMedia.video.title || project?.title || null,
      alt: fieldMedia.video.title || project?.title || null,
      caption: null,
    };
  }

  const media = project?.mediaGallery[0];
  if (media?.url) {
    return {
      kind: inferMediaKind(media.type),
      url: media.url,
      thumbnailUrl: media.thumbnailUrl || null,
      title: media.title || project?.title || null,
      alt: media.alt || media.title || project?.title || null,
      caption: media.caption || null,
    };
  }

  if (project?.coverImage?.url) {
    return {
      kind: "image",
      url: project.coverImage.url,
      thumbnailUrl: project.coverImage.url,
      title: project.title,
      alt: project.coverImage.alt || project.title,
      caption: null,
    };
  }

  if (project?.videoUrl) {
    return {
      kind: "video",
      url: project.videoUrl,
      thumbnailUrl: project.coverImage?.url || null,
      title: project.title,
      alt: project.title,
      caption: null,
    };
  }

  return null;
}

function getSupportingMedia(project: EnrichedProject | null): LiveFeaturedWork["supportingMedia"] {
  if (!project) return [];

  const fieldMedia = getProjectFieldMedia(project);
  const previewUrl = project.coverVideo?.posterUrl || project.coverImage?.url || null;

  return fieldMedia.images
    .filter((image) => image.url !== previewUrl)
    .slice(0, 2)
    .map((image) => ({
      url: image.url,
      alt: image.alt,
      eyebrow: image.eyebrow,
    }));
}

function getDescription(
  config: FeaturedWorkConfig,
  project: EnrichedProject | null
): string {
  const source =
    project?.wikiData?.overview || project?.description || config.fallbackDescription;
  return summarizeText(source, 220);
}

function getQuote(
  config: FeaturedWorkConfig,
  project: EnrichedProject | null
): string {
  const story = getPrimaryStory(project);

  return (
    summarizeText(story?.excerpt, 140) ||
    summarizeText(project?.quote?.text, 140) ||
    config.fallbackQuote
  );
}

function getLiveMeta(project: EnrichedProject | null) {
  const meta = project?.empathyLedgerContent?.meta;

  return {
    storyCount: meta?.story_count || 0,
    storytellerCount: meta?.storyteller_count || 0,
    mediaCount: meta?.media_count || 0,
    galleryCount: meta?.gallery_count || 0,
    source: meta?.source || null,
    siteSlug: meta?.site_slug || null,
    fetchedAt: meta?.fetched_at || null,
  };
}

const getFeaturedWorksCached = cache(
  async (serializedOptions: string): Promise<LiveFeaturedWork[]> => {
    const options = JSON.parse(serializedOptions) as {
      slugs?: string[];
      limit?: number;
    };

    const selectedConfigs = featuredWorkConfigs.filter((config) =>
      options.slugs ? options.slugs.includes(config.slug) : true
    );

    const hydrated = await Promise.all(
      selectedConfigs.map(async (config) => {
        const project = await getProjectData(config.slug).catch(() => null);

        return {
          slug: config.slug,
          title: project?.title || config.title,
          href: config.href,
          medium: config.medium,
          place: config.place,
          collaborators: config.collaborators,
          connectedTo: config.connectedTo,
          description: getDescription(config, project),
          quote: getQuote(config, project),
          previewMedia: getPreviewMedia(project),
          supportingMedia: getSupportingMedia(project),
          live: getLiveMeta(project),
          project,
        } satisfies LiveFeaturedWork;
      })
    );

    return typeof options.limit === "number"
      ? hydrated.slice(0, options.limit)
      : hydrated;
  }
);

export async function getFeaturedWorks(
  options: { slugs?: string[]; limit?: number } = {}
): Promise<LiveFeaturedWork[]> {
  const normalizedSlugs = options.slugs ? [...options.slugs].sort() : null;
  const serializedOptions = JSON.stringify({
    slugs: normalizedSlugs,
    limit: options.limit ?? null,
  });

  return getFeaturedWorksCached(serializedOptions);
}

export function getFeaturedWorkVoiceFragments(
  works: LiveFeaturedWork[],
  limit: number = 3
): FeaturedWorkVoiceFragment[] {
  const fragments = works
    .map((work) => {
      const primaryStory = getPrimaryStory(work.project);
      const attribution =
        primaryStory?.storyteller_display_name ||
        primaryStory?.storyteller_name ||
        `From ${work.title}`;

      return {
        text: work.quote,
        attribution,
        href: work.href,
      };
    })
    .filter((fragment) => fragment.text.trim().length > 0);

  return fragments.slice(0, limit);
}

export function getFeaturedWorkCollaborators(
  works: LiveFeaturedWork[],
  limit: number = 6
): FeaturedWorkCollaborator[] {
  const collaborators = new Map<string, FeaturedWorkCollaborator>();

  for (const work of works) {
    const storyteller = getPrimaryStoryteller(work.project);
    const story = getPrimaryStory(work.project);

    if (storyteller) {
      const name =
        storyteller.display_name ||
        storyteller.full_name ||
        work.collaborators;
      const key = `storyteller:${name.toLowerCase()}`;
      const role =
        storyteller.custom_tagline ||
        storyteller.current_role ||
        work.medium;
      const description =
        summarizeText(
          storyteller.featured_bio || storyteller.bio,
          150
        ) ||
        summarizeText(story?.excerpt, 150) ||
        `${name}'s voice is part of ${work.title}.`;

      const existing = collaborators.get(key);
      if (existing) {
        if (!existing.relatedWorks.includes(work.title)) {
          existing.relatedWorks.push(work.title);
        }
      } else {
        collaborators.set(key, {
          key,
          name,
          role,
          description,
          href: work.href,
          relatedWorks: [work.title],
          avatarUrl: storyteller.profile_image_url || null,
          source: "storyteller",
        });
      }
      continue;
    }

    const key = `config:${work.slug}`;
    collaborators.set(key, {
      key,
      name: work.collaborators,
      role: work.medium,
      description: `${work.collaborators} are the collaborators behind ${work.title}.`,
      href: work.href,
      relatedWorks: [work.title],
      avatarUrl: null,
      source: "work-config",
    });
  }

  return Array.from(collaborators.values()).slice(0, limit);
}

const getRelatedFeaturedWorksCached = cache(
  async (
    projectSlug: string,
    projectTitle: string | undefined,
    limit: number
  ): Promise<LiveFeaturedWork[]> => {
    const works = await getFeaturedWorks();
    const slugKey = normalizeValue(projectSlug);
    const titleKey = normalizeValue(projectTitle);
    const currentWork = works.find((work) => normalizeValue(work.slug) === slugKey);

    if (currentWork) {
      return works.filter((work) => work.slug !== currentWork.slug).slice(0, limit);
    }

    const linked = works.filter((work) => {
      const connectedKey = normalizeValue(work.connectedTo);
      return connectedKey === slugKey || (!!titleKey && connectedKey === titleKey);
    });

    return linked.slice(0, limit);
  }
);

export async function getRelatedFeaturedWorks(
  projectSlug: string,
  projectTitle?: string,
  limit: number = 3
): Promise<LiveFeaturedWork[]> {
  return getRelatedFeaturedWorksCached(projectSlug, projectTitle, limit);
}
