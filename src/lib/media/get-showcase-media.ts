import { cache } from 'react';

import {
  getFeaturedContentForProject,
  type FeaturedMediaItem,
} from '@/lib/empathy-ledger-featured';
import { getCanonicalWikiProjectRecords } from '@/lib/wiki/canonical-project-wiki';

export interface ShowcaseMediaItem {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  kind: 'image' | 'video' | 'audio' | 'other';
  title: string | null;
  alt: string | null;
  caption: string | null;
  credit: string | null;
  isHero: boolean;
  isFeatured: boolean;
  projectSlug: string;
  source: 'empathy-ledger' | 'local';
}

export interface ShowcaseMediaResult {
  items: ShowcaseMediaItem[];
  projectNames: Record<string, string>;
  stats: {
    totalMedia: number;
    imageCount: number;
    videoCount: number;
    projectCount: number;
  };
}

const LOCAL_FIELD_MEDIA: ShowcaseMediaItem[] = [
  {
    id: 'local-bcv-aerial',
    url: '/media/field-stills/black-cockatoo-valley-farm-aerial.jpg',
    thumbnailUrl: '/media/field-stills/black-cockatoo-valley-farm-aerial.jpg',
    kind: 'image',
    title: 'Black Cockatoo Valley aerial',
    alt: 'Black Cockatoo Valley aerial through fog above the canopy',
    caption: 'Morning fog lifts over Black Cockatoo Valley on Jinibara Country',
    credit: null,
    isHero: true,
    isFeatured: true,
    projectSlug: 'black-cockatoo-valley',
    source: 'local',
  },
  {
    id: 'local-el-community',
    url: '/media/field-stills/empathy-ledger-community-story.jpg',
    thumbnailUrl: '/media/field-stills/empathy-ledger-community-story.jpg',
    kind: 'image',
    title: 'Community storytelling',
    alt: 'Community storytelling conversation connected to Empathy Ledger',
    caption: null,
    credit: null,
    isHero: true,
    isFeatured: true,
    projectSlug: 'empathy-ledger',
    source: 'local',
  },
  {
    id: 'local-harvest-aerial',
    url: '/media/field-stills/harvest-witta-aerial.jpg',
    thumbnailUrl: '/media/field-stills/harvest-witta-aerial.jpg',
    kind: 'image',
    title: 'The Harvest aerial',
    alt: 'The Harvest aerial over the Witta site and surrounding fields',
    caption: null,
    credit: null,
    isHero: true,
    isFeatured: true,
    projectSlug: 'the-harvest',
    source: 'local',
  },
  {
    id: 'local-goods-delivery',
    url: '/media/field-stills/goods-delivery.jpg',
    thumbnailUrl: '/media/field-stills/goods-delivery.jpg',
    kind: 'image',
    title: 'Goods on Country delivery',
    alt: 'Goods on Country delivery in remote community',
    caption: null,
    credit: null,
    isHero: false,
    isFeatured: true,
    projectSlug: 'goods-on-country',
    source: 'local',
  },
  {
    id: 'local-goods-aerial',
    url: '/media/field-stills/goods-community-aerial.jpg',
    thumbnailUrl: '/media/field-stills/goods-community-aerial.jpg',
    kind: 'image',
    title: 'Goods on Country community',
    alt: 'Aerial view of Goods on Country community',
    caption: null,
    credit: null,
    isHero: false,
    isFeatured: true,
    projectSlug: 'goods-on-country',
    source: 'local',
  },
  {
    id: 'local-contained',
    url: '/media/field-stills/contained-aerial.jpg',
    thumbnailUrl: '/media/field-stills/contained-aerial.jpg',
    kind: 'image',
    title: 'CONTAINED',
    alt: 'CONTAINED art installation aerial',
    caption: null,
    credit: null,
    isHero: false,
    isFeatured: true,
    projectSlug: 'contained',
    source: 'local',
  },
  {
    id: 'local-jh-video',
    url: '/media/field-videos/justicehub-community.mp4',
    thumbnailUrl: '/media/field-stills/justicehub-community.jpg',
    kind: 'video',
    title: 'JusticeHub community',
    alt: 'JusticeHub community field footage',
    caption: null,
    credit: null,
    isHero: false,
    isFeatured: true,
    projectSlug: 'justicehub',
    source: 'local',
  },
  {
    id: 'local-bcv-video',
    url: '/media/field-videos/black-cockatoo-valley-farm-aerial.mp4',
    thumbnailUrl: '/media/field-stills/black-cockatoo-valley-farm-aerial.jpg',
    kind: 'video',
    title: 'Black Cockatoo Valley canopy aerial',
    alt: 'Black Cockatoo Valley canopy aerial video',
    caption: null,
    credit: null,
    isHero: false,
    isFeatured: true,
    projectSlug: 'black-cockatoo-valley',
    source: 'local',
  },
  {
    id: 'local-palm-island-video',
    url: '/media/field-videos/palm-island-coastline.mp4',
    thumbnailUrl: null,
    kind: 'video',
    title: 'Palm Island coastline',
    alt: 'Palm Island coastline aerial footage',
    caption: null,
    credit: null,
    isHero: false,
    isFeatured: false,
    projectSlug: 'picc',
    source: 'local',
  },
];

export const getShowcaseMedia = cache(
  async function getShowcaseMedia(): Promise<ShowcaseMediaResult> {
    const wikiProjects = await getCanonicalWikiProjectRecords();
    const projectNames: Record<string, string> = {};
    for (const p of wikiProjects) {
      projectNames[p.slug] = p.title;
    }

    const projectSlugs = wikiProjects.map((p) => p.slug);
    const results = await Promise.allSettled(
      projectSlugs.map((slug) =>
        getFeaturedContentForProject(slug, { type: 'all', limit: 30 })
      )
    );

    const items: ShowcaseMediaItem[] = [...LOCAL_FIELD_MEDIA];
    const seenUrls = new Set(LOCAL_FIELD_MEDIA.map((m) => m.url));

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status !== 'fulfilled' || !result.value) continue;

      const slug = projectSlugs[i];
      for (const m of result.value.media.items) {
        if (seenUrls.has(m.url)) continue;
        seenUrls.add(m.url);

        items.push({
          id: m.id,
          url: m.url,
          thumbnailUrl: m.thumbnail_url || m.preview_url || null,
          kind: m.kind,
          title: m.title,
          alt: m.alt,
          caption: m.caption,
          credit: m.credit,
          isHero: m.is_hero,
          isFeatured: m.is_featured,
          projectSlug: slug,
          source: 'empathy-ledger',
        });
      }
    }

    // Sort: heroes first, then featured, then by project
    items.sort((a, b) => {
      if (a.isHero !== b.isHero) return a.isHero ? -1 : 1;
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return a.projectSlug.localeCompare(b.projectSlug);
    });

    const projectsWithMedia = new Set(items.map((m) => m.projectSlug));

    return {
      items,
      projectNames,
      stats: {
        totalMedia: items.length,
        imageCount: items.filter((m) => m.kind === 'image').length,
        videoCount: items.filter((m) => m.kind === 'video').length,
        projectCount: projectsWithMedia.size,
      },
    };
  }
);
