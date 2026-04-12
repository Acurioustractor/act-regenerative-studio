import type { EditorialMediaOverride } from "@/lib/empathy-ledger-editorial";
import { buildProjectIndexSignals } from "@/lib/projects/build-project-index-signals";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getProjectFieldMedia } from "@/lib/projects/get-project-field-media";
import { getFlagshipProjectPacks } from "@/lib/wiki/flagship-project-packs";
import { getCanonicalWikiProjectRecords } from "@/lib/wiki/canonical-project-wiki";

export interface CuratedProjectCardConfig {
  slug: string;
  href: string;
  eyebrow: string;
  fallbackTitle: string;
  fallbackTagline: string;
  fallbackDescription: string;
}

export interface CuratedProjectCard {
  slug: string;
  href: string;
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  previewMedia?: {
    kind: "image" | "video";
    url: string;
    posterUrl?: string | null;
    alt: string;
  };
  supportingMedia?: Array<{
    url: string;
    alt: string;
    eyebrow?: string;
  }>;
  mediaEmphasis?: boolean;
  liveSignals?: {
    serviceConnectionCount: number;
    totalWorkCount: number;
    storyCount: number;
    mediaCount: number;
  };
}

function excerptToTagline(value: string | null, fallback: string): string {
  if (!value) return fallback;

  return value.length > 110 ? `${value.slice(0, 107).trimEnd()}...` : value;
}

function descriptionFromOverview(value: string | null, fallback: string): string {
  if (!value) return fallback;

  return value.length > 240 ? `${value.slice(0, 237).trimEnd()}...` : value;
}

export async function buildCuratedProjectCards(
  configs: CuratedProjectCardConfig[],
  options?: {
    includeMedia?: boolean;
    mediaEmphasisSlugs?: string[];
    mediaOverrides?: Record<string, EditorialMediaOverride>;
  }
): Promise<CuratedProjectCard[]> {
  const mediaEmphasisSlugs = new Set(options?.mediaEmphasisSlugs || []);
  const mediaOverrides = options?.mediaOverrides || {};
  const [canonicalProjects, flagshipPacks, signalPayload, projectDataBySlug] = await Promise.all([
    getCanonicalWikiProjectRecords(),
    getFlagshipProjectPacks(),
    buildProjectIndexSignals(),
    options?.includeMedia
      ? Promise.all(
          configs.map(async (config) => [config.slug, await getProjectData(config.slug)] as const)
        ).then((entries) => new Map(entries))
      : Promise.resolve(new Map()),
  ]);
  const flagshipPackBySlug = new Map(flagshipPacks.map((pack) => [pack.slug, pack]));

  return configs.map((config) => {
    const wikiRecord = canonicalProjects.find((record) => record.slug === config.slug);
    const flagshipPack = flagshipPackBySlug.get(config.slug);
    const liveSignals = signalPayload.bySlug[config.slug];
    const projectData = projectDataBySlug.get(config.slug);
    const mediaOverride = mediaOverrides[config.slug];
    const heroMedia = projectData?.empathyLedgerContent?.media.hero || null;
    const firstImageMedia = projectData?.mediaGallery.find((item: { type: string }) =>
      item.type.startsWith("image")
    );
    const previewMedia =
      mediaOverride
        ? {
            kind: mediaOverride.kind,
            url: mediaOverride.url,
            posterUrl: mediaOverride.posterUrl || null,
            alt:
              mediaOverride.alt ||
              projectData?.coverImage?.alt ||
              projectData?.title ||
              config.fallbackTitle,
          }
        : projectData?.coverVideo
        ? {
            kind: "video" as const,
            url: projectData.coverVideo.url,
            posterUrl: projectData.coverVideo.posterUrl || projectData.coverImage?.url || null,
            alt: projectData.coverVideo.title || projectData.title || config.fallbackTitle,
          }
        : heroMedia?.kind === "video"
        ? {
            kind: "video" as const,
            url: heroMedia.url,
            posterUrl:
              heroMedia.thumbnail_url ||
              projectData?.coverImage?.url ||
              firstImageMedia?.url ||
              null,
            alt: heroMedia.alt || heroMedia.title || projectData?.title || config.fallbackTitle,
          }
        : projectData?.coverImage?.url
          ? {
              kind: "image" as const,
              url: projectData.coverImage.url,
              posterUrl: null,
              alt:
                projectData.coverImage.alt || projectData.title || config.fallbackTitle,
            }
          : undefined;
    const fieldMedia = projectData ? getProjectFieldMedia(projectData) : null;
    const previewUrl =
      previewMedia?.kind === "video"
        ? previewMedia.posterUrl || null
        : previewMedia?.url || null;
    const supportingMedia = fieldMedia
      ? fieldMedia.images
          .filter((image) => image.url !== previewUrl)
          .slice(0, 2)
          .map((image) => ({
            url: image.url,
            alt: image.alt,
            eyebrow: image.eyebrow,
          }))
      : [];

    return {
      slug: config.slug,
      href: config.href,
      eyebrow: config.eyebrow,
      title: flagshipPack?.title || wikiRecord?.title || config.fallbackTitle,
      tagline: excerptToTagline(
        flagshipPack?.summary || wikiRecord?.summary || null,
        config.fallbackTagline
      ),
      description: descriptionFromOverview(
        flagshipPack?.overview ||
          flagshipPack?.whatItIs ||
          flagshipPack?.systemPosition ||
          wikiRecord?.overview ||
          null,
        config.fallbackDescription
      ),
      previewMedia,
      supportingMedia,
      mediaEmphasis: mediaEmphasisSlugs.has(config.slug),
      liveSignals: liveSignals
        ? {
            serviceConnectionCount: liveSignals.serviceConnectionCount,
            totalWorkCount: liveSignals.totalWorkCount,
            storyCount: liveSignals.storyCount,
            mediaCount: liveSignals.mediaCount,
          }
        : undefined,
    };
  });
}
