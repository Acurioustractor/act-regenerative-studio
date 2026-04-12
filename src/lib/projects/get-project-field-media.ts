import { projects } from '@/data/projects';
import type { ProjectTheme } from '@/data/projects';
import type { EnrichedProject } from './get-project-data';

export interface ProjectFieldMediaImage {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  eyebrow: string;
  sourceTitle: string | null;
  href: string;
}

export interface ProjectFieldMediaVideo {
  id: string;
  url: string;
  posterUrl: string | null;
  title: string;
  eyebrow: string;
  sourceTitle: string | null;
  autoplay?: boolean;
}

export interface ProjectFieldMediaSet {
  images: ProjectFieldMediaImage[];
  video: ProjectFieldMediaVideo | null;
  theme: ProjectTheme;
}

const RELATED_FIELD_MEDIA: Record<
  string,
  {
    photoSlugs: string[];
    videoSlug?: string;
  }
> = {
  justicehub: {
    photoSlugs: [
      'diagrama-spain',
      'bg-fit-mount-isa',
      'oonchiumpa',
      'naidoc-week-mount-isa',
    ],
    videoSlug: 'naidoc-week-mount-isa',
  },
  'goods-on-country': {
    photoSlugs: [
      'goods-tennant-creek',
      'pakkinjalki-kari',
      'weave-bed-tennant-creek',
      'bupa-tfn-pitch',
    ],
    videoSlug: 'goods-tennant-creek',
  },
  'the-harvest': {
    photoSlugs: ['green-harvest-witta'],
  },
  'empathy-ledger': {
    photoSlugs: ['gold-phone', 'global-laundry-alliance', 'diagrama-spain'],
  },
  'black-cockatoo-valley': {
    photoSlugs: ['green-harvest-witta'],
  },
};

const LOCAL_FIELD_MEDIA_OVERRIDES: Record<
  string,
  {
    images?: ProjectFieldMediaImage[];
    video?: ProjectFieldMediaVideo;
  }
> = {
  justicehub: {
    images: [
      {
        id: 'justicehub-community-still',
        url: '/media/field-stills/justicehub-community.jpg',
        alt: 'Community gathering connected to JusticeHub work',
        caption:
          'Justice work needs to stay close to the people, places, and conversations it is answerable to.',
        eyebrow: 'Community field still',
        sourceTitle: 'JusticeHub',
        href: '/media/field-stills/justicehub-community.jpg',
      },
      {
        id: 'justicehub-community-still-2',
        url: '/media/field-stills/justicehub-community-2.jpg',
        alt: 'People gathering in a JusticeHub community setting',
        caption:
          'The work should read through real social texture: conversation, bodies, and trust in the room.',
        eyebrow: 'Community portrait',
        sourceTitle: 'JusticeHub',
        href: '/media/field-stills/justicehub-community-2.jpg',
      },
    ],
    video: {
      id: 'justicehub-community-video',
      url: '/media/field-videos/justicehub-community.mp4',
      posterUrl: '/media/field-stills/justicehub-community.jpg',
      title: 'JusticeHub community field loop',
      eyebrow: 'Community footage',
      sourceTitle: 'JusticeHub',
      autoplay: true,
    },
  },
  'goods-on-country': {
    images: [
      {
        id: 'goods-remote-aerial',
        url: '/media/field-stills/goods-remote-aerial.jpg',
        alt: 'Remote landscape connected to Goods on Country work',
        caption: 'The scale of place matters. Delivery, durability, and design all change when the work is truly on Country.',
        eyebrow: 'Drone field still',
        sourceTitle: 'Goods on Country',
        href: '/media/field-stills/goods-remote-aerial.jpg',
      },
      {
        id: 'goods-community-aerial',
        url: '/media/field-stills/goods-community-aerial.jpg',
        alt: 'Community setting linked to Goods on Country',
        caption: 'Community conditions, housing, and logistics are part of the design brief, not background noise.',
        eyebrow: 'Field still',
        sourceTitle: 'Goods on Country',
        href: '/media/field-stills/goods-community-aerial.jpg',
      },
      {
        id: 'goods-delivery-still-2',
        url: '/media/field-stills/goods-delivery-2.jpg',
        alt: 'Goods on Country delivery scene in community context',
        caption:
          'The delivery moment matters as much as the product: goods arriving, being handled, and becoming useful in context.',
        eyebrow: 'Delivery still',
        sourceTitle: 'Goods on Country',
        href: '/media/field-stills/goods-delivery-2.jpg',
      },
    ],
    video: {
      id: 'goods-delivery-video',
      url: '/media/field-videos/goods-delivery.mp4',
      posterUrl: '/media/field-stills/goods-delivery.jpg',
      title: 'Goods delivery on Country',
      eyebrow: 'Field footage',
      sourceTitle: 'Goods on Country',
      autoplay: true,
    },
  },
  contained: {
    images: [
      {
        id: 'contained-aerial-still',
        url: '/media/field-stills/contained-aerial.jpg',
        alt: 'Aerial view of installation footprint',
        caption: 'An aerial trace of the installation footprint and how the work sits in physical space.',
        eyebrow: 'Aerial installation still',
        sourceTitle: 'CONTAINED',
        href: '/media/field-stills/contained-aerial.jpg',
      },
    ],
    video: {
      id: 'contained-aerial-video',
      url: '/media/field-videos/contained-aerial.mp4',
      posterUrl: '/media/field-stills/contained-aerial.jpg',
      title: 'CONTAINED aerial pass',
      eyebrow: 'Aerial footage',
      sourceTitle: 'CONTAINED',
      autoplay: true,
    },
  },
  'black-cockatoo-valley': {
    images: [
      {
        id: 'black-cockatoo-valley-farm-aerial-still',
        url: '/media/field-stills/black-cockatoo-valley-farm-aerial.jpg',
        alt: 'Fog lifting above Black Cockatoo Valley canopy',
        caption:
          'Black Cockatoo Valley should open with the pace and scale of the land itself, not a generic project card image.',
        eyebrow: 'Farm aerial still',
        sourceTitle: 'Black Cockatoo Valley',
        href: '/media/field-stills/black-cockatoo-valley-farm-aerial.jpg',
      },
      {
        id: 'black-cockatoo-valley-farm-aerial-still-2',
        url: '/media/field-stills/black-cockatoo-valley-farm-aerial-2.jpg',
        alt: 'Morning light moving over Black Cockatoo Valley canopy',
        caption:
          'The secondary frames should hold the slower rhythm of the valley: tree line, light, and the feeling of moving through Country.',
        eyebrow: 'Canopy still',
        sourceTitle: 'Black Cockatoo Valley',
        href: '/media/field-stills/black-cockatoo-valley-farm-aerial-2.jpg',
      },
      {
        id: 'black-cockatoo-valley-farm-aerial-still-3',
        url: '/media/field-stills/black-cockatoo-valley-farm-aerial-3.jpg',
        alt: 'Black Cockatoo Valley ridgeline and tree canopy',
        caption:
          'Place should stay legible as landscape, not just as infrastructure for activities happening on top of it.',
        eyebrow: 'Ridgeline still',
        sourceTitle: 'Black Cockatoo Valley',
        href: '/media/field-stills/black-cockatoo-valley-farm-aerial-3.jpg',
      },
    ],
    video: {
      id: 'black-cockatoo-valley-farm-aerial-video',
      url: '/media/field-videos/black-cockatoo-valley-farm-aerial.mp4',
      posterUrl: '/media/field-stills/black-cockatoo-valley-farm-aerial.jpg',
      title: 'Black Cockatoo Valley canopy aerial',
      eyebrow: 'Farm footage',
      sourceTitle: 'Black Cockatoo Valley',
      autoplay: true,
    },
  },
  'the-harvest': {
    images: [
      {
        id: 'harvest-witta-aerial-still',
        url: '/media/field-stills/harvest-witta-aerial.jpg',
        alt: 'The Harvest site and surrounding fields seen from above',
        caption:
          'The Harvest should open with place, scale, and the social life of the site rather than reading like a generic food or venue page.',
        eyebrow: 'Harvest aerial still',
        sourceTitle: 'The Harvest',
        href: '/media/field-stills/harvest-witta-aerial.jpg',
      },
      {
        id: 'harvest-witta-aerial-still-2',
        url: '/media/field-stills/harvest-witta-aerial-2.jpg',
        alt: 'The Harvest site and surrounding green fields from above',
        caption:
          'The Harvest should read as a lived site with edges, neighbours, growing space, and social infrastructure all visible together.',
        eyebrow: 'Field still',
        sourceTitle: 'The Harvest',
        href: '/media/field-stills/harvest-witta-aerial-2.jpg',
      },
      {
        id: 'harvest-witta-aerial-still-3',
        url: '/media/field-stills/harvest-witta-aerial-3.jpg',
        alt: 'The Harvest landscape sequence over Witta',
        caption:
          'A harvest story needs more than one image: aerial rhythm, land texture, and the wider scale of the place.',
        eyebrow: 'Landscape still',
        sourceTitle: 'The Harvest',
        href: '/media/field-stills/harvest-witta-aerial-3.jpg',
      },
    ],
    video: {
      id: 'harvest-witta-aerial-video',
      url: '/media/field-videos/harvest-witta-aerial.mp4',
      posterUrl: '/media/field-stills/harvest-witta-aerial.jpg',
      title: 'The Harvest aerial over Witta',
      eyebrow: 'Harvest footage',
      sourceTitle: 'The Harvest',
      autoplay: true,
    },
  },
  'empathy-ledger': {
    images: [
      {
        id: 'empathy-ledger-community-story-still',
        url: '/media/field-stills/empathy-ledger-community-story.jpg',
        alt: 'Community storytelling conversation connected to Empathy Ledger',
        caption:
          'Empathy Ledger should open with real voice and consent-based story practice, not a purely abstract software frame.',
        eyebrow: 'Story process still',
        sourceTitle: 'Empathy Ledger',
        href: '/media/field-stills/empathy-ledger-community-story.jpg',
      },
      {
        id: 'empathy-ledger-community-story-still-2',
        url: '/media/field-stills/empathy-ledger-community-story-2.jpg',
        alt: 'Community conversation scene connected to Empathy Ledger',
        caption:
          'Empathy Ledger should show the room, the people, and the atmosphere of consent-based conversation rather than only the platform abstraction.',
        eyebrow: 'Conversation still',
        sourceTitle: 'Empathy Ledger',
        href: '/media/field-stills/empathy-ledger-community-story-2.jpg',
      },
      {
        id: 'empathy-ledger-community-story-still-3',
        url: '/media/field-stills/empathy-ledger-community-story-3.jpg',
        alt: 'Community storytelling moment connected to Empathy Ledger',
        caption:
          'A stronger EL page needs portraits of process: real people, real gathering, and visible trust in how the story is held.',
        eyebrow: 'Story process still',
        sourceTitle: 'Empathy Ledger',
        href: '/media/field-stills/empathy-ledger-community-story-3.jpg',
      },
    ],
    video: {
      id: 'empathy-ledger-community-story-video',
      url: '/media/field-videos/empathy-ledger-community-story.mp4',
      posterUrl: '/media/field-stills/empathy-ledger-community-story.jpg',
      title: 'Community storytelling conversation',
      eyebrow: 'Story process footage',
      sourceTitle: 'Empathy Ledger',
      autoplay: true,
    },
  },
  'uncle-allan-palm-island-art': {
    images: [
      {
        id: 'palm-island-coastline-still',
        url: '/media/field-stills/palm-island-coastline.jpg',
        alt: 'Palm Island coastline aerial',
        caption: 'Coastline, community, and Country held together in one wider frame.',
        eyebrow: 'Coastal aerial still',
        sourceTitle: 'Palm Island',
        href: '/media/field-stills/palm-island-coastline.jpg',
      },
    ],
    video: {
      id: 'palm-island-coastline-video',
      url: '/media/field-videos/palm-island-coastline.mp4',
      posterUrl: '/media/field-stills/palm-island-coastline.jpg',
      title: 'Palm Island coastline aerial',
      eyebrow: 'Coastal aerial footage',
      sourceTitle: 'Palm Island',
      autoplay: true,
    },
  },
};

function isImageType(type: string) {
  return type.startsWith('image') || type === 'image';
}

function isVideoType(type: string) {
  return type.startsWith('video') || type === 'video';
}

export function getProjectFieldMedia(project: EnrichedProject): ProjectFieldMediaSet {
  const mediaMap = new Map<string, ProjectFieldMediaImage>();
  const localOverride = LOCAL_FIELD_MEDIA_OVERRIDES[project.slug];

  const pushImage = (image: ProjectFieldMediaImage | null) => {
    if (!image || !image.url) return;
    if (!mediaMap.has(image.url)) {
      mediaMap.set(image.url, image);
    }
  };

  if (localOverride?.images) {
    for (const image of localOverride.images) {
      pushImage(image);
    }
  }

  for (const item of project.mediaGallery) {
    if (!isImageType(item.type)) continue;
    pushImage({
      id: item.id,
      url: item.thumbnailUrl || item.url,
      alt: item.alt || item.title || `${project.title} field media`,
      caption: item.caption || item.title || null,
      eyebrow: item.source === 'empathy_ledger' ? 'Live field image' : 'Project gallery',
      sourceTitle: item.source === 'empathy_ledger' ? 'Empathy Ledger' : project.title,
      href: item.url,
    });
  }

  if (project.coverImage && !project.coverImage.url.toLowerCase().endsWith('.png')) {
    pushImage({
      id: `${project.slug}-cover`,
      url: project.coverImage.url,
      alt: project.coverImage.alt,
      caption: project.tagline,
      eyebrow:
        project.coverImage.source === 'empathy_ledger'
          ? 'Live project cover'
          : project.coverImage.source === 'media_gallery'
            ? 'Project gallery'
            : 'Project image',
      sourceTitle: project.title,
      href: project.coverImage.url,
    });
  }

  for (const photoUrl of project.photos || []) {
    pushImage({
      id: `${project.slug}-${photoUrl}`,
      url: photoUrl,
      alt: `${project.title} project image`,
      caption: project.tagline,
      eyebrow: 'Project image',
      sourceTitle: project.title,
      href: photoUrl,
    });
  }

  const relatedConfig = RELATED_FIELD_MEDIA[project.slug];
  if (relatedConfig) {
    for (const relatedSlug of relatedConfig.photoSlugs) {
      const related = projects.find((candidate) => candidate.slug === relatedSlug);
      if (!related?.heroImage) continue;

      pushImage({
        id: `${project.slug}-${related.slug}`,
        url: related.heroImage,
        alt: `${related.title} field image`,
        caption: related.tagline,
        eyebrow: 'Related field image',
        sourceTitle: related.title,
        href: `/projects/${related.slug}`,
      });
    }
  }

  let video: ProjectFieldMediaVideo | null = null;
  const liveVideo = project.mediaGallery.find((item) => isVideoType(item.type));

  if (liveVideo) {
    video = {
      id: liveVideo.id,
      url: liveVideo.url,
      posterUrl: liveVideo.thumbnailUrl || project.coverImage?.url || null,
      title: liveVideo.title || liveVideo.caption || `${project.title} field footage`,
      eyebrow: liveVideo.source === 'empathy_ledger' ? 'Live field footage' : 'Project footage',
      sourceTitle: liveVideo.source === 'empathy_ledger' ? 'Empathy Ledger' : project.title,
    };
  } else if (project.videoUrl) {
    video = {
      id: `${project.slug}-video`,
      url: project.videoUrl,
      posterUrl: project.coverImage?.url || mediaMap.values().next().value?.url || null,
      title: `${project.title} field footage`,
      eyebrow: 'Project footage',
      sourceTitle: project.title,
    };
  } else if (localOverride?.video) {
    video = localOverride.video;
  } else if (relatedConfig?.videoSlug) {
    const relatedVideo = projects.find((candidate) => candidate.slug === relatedConfig.videoSlug);
    if (relatedVideo?.videoUrl) {
      video = {
        id: `${project.slug}-${relatedVideo.slug}-video`,
        url: relatedVideo.videoUrl,
        posterUrl: relatedVideo.heroImage || mediaMap.values().next().value?.url || null,
        title: `${relatedVideo.title} field footage`,
        eyebrow: 'Related field footage',
        sourceTitle: relatedVideo.title,
      };
    }
  }

  return {
    images: Array.from(mediaMap.values()).slice(0, 4),
    video,
    theme: project.theme,
  };
}
