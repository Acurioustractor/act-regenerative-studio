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
  philosophy?: string;
  impact?: string;
}

export interface HydratedArtProject extends ArtProjectConfig {
  media: FeaturedMediaItem[];
  heroImage: FeaturedMediaItem | null;
  storytellers: FeaturedStoryteller[];
  stories: FeaturedStory[];
  elContent: FeaturedContentResponse | null;
}

const ART_PROJECTS: ArtProjectConfig[] = [
  {
    slug: 'picc-photo-kiosk',
    elSlugs: ['picc-photo-kiosk'],
    title: 'PICC Photo Kiosk',
    quote:
      '2,491 photos documented. Not by outside photographers \u2014 by community, for community, stored on community terms.',
    description:
      'A self-service photography station placed at the heart of the Palm Island Community Company, the kiosk shifted who holds the camera. Families, elders, young people, and visitors documented their own stories on their own terms. Over 2,491 photographs now sit in a community-owned archive, not behind an institutional paywall.',
    mediums: ['photography', 'installation'],
    tags: ['community-portrait', 'cultural-preservation', 'participatory'],
    status: 'active',
    lcaaStages: ['Action', 'Art'],
    location: 'Palm Island, Queensland',
    year: '2023\u20132025',
    photoCount: 501,
    storytellerCount: 32,
    connectedProject: 'Empathy Ledger',
    connectedProjectHref: '/projects/empathy-ledger',
    philosophy:
      'Cameras have a long, difficult history in First Nations communities. The kiosk inverts that dynamic. It sits in a trusted space. The shutter belongs to the subject. The archive belongs to community.',
    impact:
      '2,491 self-directed portraits captured. 32 storytellers documented. Community-owned visual archive established. No external access without community consent.',
  },
  {
    slug: 'gold-phone',
    elSlugs: ['gold-phone', 'goldphone'],
    title: 'Gold.Phone',
    quote:
      'A random connection voice platform tackling social isolation through authentic, unscripted human conversation.',
    description:
      'Gold.Phone is a sculptural phone booth that connects strangers through unscripted, anonymous voice calls. No profiles, no algorithms, no swiping. Just two people, a phone, and whatever they choose to say to each other. Installed in public spaces, it interrupts the loneliness epidemic with actual human encounter.',
    mediums: ['interactive', 'installation'],
    tags: ['participatory', 'public-art', 'social-practice'],
    status: 'active',
    lcaaStages: ['Listen', 'Connect'],
    location: 'Distributed / digital',
    year: '2024\u2013present',
    photoCount: 53,
    storytellerCount: 0,
    connectedProject: 'Empathy Ledger',
    connectedProjectHref: '/projects/empathy-ledger',
    philosophy:
      'Social isolation is a design failure, not a personal one. Gold.Phone treats voice as the simplest technology for connection. Two strangers. No screens. No filters. Just presence.',
    impact:
      'Prototype deployed. Voice connection platform built. Partnering with councils and public space curators for permanent installations.',
  },
  {
    slug: 'the-confessional',
    elSlugs: ['the-confessional'],
    title: 'The Confessional',
    quote:
      'A horse trailer converted into a sacred healing space \u2014 a mobile art therapy installation.',
    description:
      'A decommissioned horse trailer transformed into a mobile installation for anonymous truth-telling. The Confessional creates temporary sacred space in public settings \u2014 festivals, community events, institutional foyers \u2014 where people can speak what systems teach them to hide.',
    mediums: ['installation', 'performance'],
    tags: ['immersive', 'participatory', 'social-practice'],
    status: 'active',
    lcaaStages: ['Listen'],
    location: 'Mobile / touring',
    year: '2023\u2013present',
    photoCount: 48,
    storytellerCount: 0,
    connectedProject: 'Works',
    connectedProjectHref: '/art',
    philosophy:
      'Some truths only emerge when the architecture of a space grants permission. The Confessional is not therapy. It is not art for art\'s sake. It is a pressure valve \u2014 a portable room where honesty becomes possible.',
    impact:
      'Deployed at multiple events and community gatherings. Stories captured under consent protocols. Demonstrated model for mobile truth-telling infrastructure.',
  },
  {
    slug: 'contained',
    elSlugs: ['contained'],
    title: 'CONTAINED',
    quote:
      'An experiential design campaign about youth detention \u2014 placing people inside the question of what we\'re actually paying for.',
    description:
      'CONTAINED is an immersive installation that puts visitors inside a simulated youth detention environment. Not to shock, but to ask: what does this system feel like from the inside? And what are we choosing when we fund it? The work has been shown alongside justice reform campaigns and policy advocacy.',
    mediums: ['installation'],
    tags: ['immersive', 'justice-art', 'public-art'],
    status: 'exhibited',
    lcaaStages: ['Art'],
    location: 'Justice and public-space contexts',
    year: '2022\u20132024',
    photoCount: 37,
    storytellerCount: 2,
    connectedProject: 'JusticeHub',
    connectedProjectHref: '/projects/justicehub',
    philosophy:
      'Policy documents flatten human experience into statistics. CONTAINED works in the opposite direction: it uses sensory experience to restore the weight of what a system does to a person. When a visitor walks out, the abstraction of "youth detention" is harder to sustain.',
    impact:
      'Exhibited in justice reform contexts. 2 storytellers contributed lived experience. Connected to JusticeHub evidence platform. Cited in advocacy submissions.',
  },
  {
    slug: 'redtape',
    elSlugs: ['redtape'],
    title: 'Redtape',
    quote:
      'Bureaucratic friction made visible. Art that takes the invisible labour of compliance and makes it impossible to ignore.',
    description:
      'Redtape is a sculptural and installation-based work that materialises the invisible weight of administrative systems. Forms, compliance requirements, reporting frameworks \u2014 the work makes this friction tangible, physical, and impossible to walk past. It asks who carries the weight of bureaucracy and what it costs.',
    mediums: ['installation', 'sculpture'],
    tags: ['justice-art', 'public-art', 'social-practice'],
    status: 'exhibited',
    lcaaStages: ['Art'],
    location: 'Gallery and public contexts',
    year: '2023',
    photoCount: 29,
    storytellerCount: 0,
    philosophy:
      'Every form is a power relationship. Every compliance framework carries an assumption about who is trustworthy and who must prove themselves. Redtape makes that architecture visible \u2014 not as metaphor, but as material.',
    impact:
      '29 documentary photographs. Exhibited alongside community sector practitioners. Opened conversation about administrative burden as a justice issue.',
  },
  {
    slug: 'uncle-allan',
    elSlugs: ['uncle-allan-palm-island-art'],
    title: 'Uncle Allan',
    quote:
      'Works inspired by reef life and Dreaming stories \u2014 cultural sovereignty and economic empowerment for Aboriginal artists.',
    description:
      'A body of painting practice by Uncle Allan on Palm Island, supported through ACT\'s cultural partnership model. The work connects reef ecology, Dreaming stories, and contemporary Aboriginal art practice. ACT provides infrastructure, materials, and pathways to market \u2014 but the creative authority stays with the artist.',
    mediums: ['painting'],
    tags: ['cultural-preservation', 'documentary'],
    status: 'active',
    lcaaStages: ['Art'],
    location: 'Palm Island, Queensland',
    year: '2023\u2013present',
    photoCount: 17,
    storytellerCount: 1,
    connectedProject: 'Works',
    connectedProjectHref: '/art',
    philosophy:
      'Supporting an artist is not the same as commissioning one. Uncle Allan\'s practice existed before ACT. What ACT provides is infrastructure: materials, documentation, exhibition pathways, and economic channels that respect cultural authority.',
    impact:
      '17 works documented. 1 storyteller. Cultural knowledge preserved through art practice. Economic pathway established for artist.',
  },
  {
    slug: 'treacher',
    elSlugs: ['treacher'],
    title: 'Treacher',
    quote:
      'The tree is no longer in its ground. But it still carries the voice of where it came from.',
    description:
      'A conceptual installation exploring displacement, memory, and what survives when something is removed from its context. Treacher works with found objects, natural materials, and the tension between preservation and loss.',
    mediums: ['installation'],
    tags: ['documentary', 'justice-art'],
    status: 'ideation',
    lcaaStages: ['Listen'],
    location: 'TBC',
    year: 'In development',
    photoCount: 9,
    storytellerCount: 0,
    philosophy:
      'Displacement is not just a political event. It happens to trees, to languages, to the feeling of a place. Treacher sits with what remains after removal \u2014 the root structure, the soil memory, the ghost of something that was here.',
  },
  {
    slug: 'caring-for-those-who-care',
    elSlugs: ['caring-for-those-who-care'],
    title: 'Caring for Those Who Care',
    quote:
      'A sector sustainability initiative honouring the invisible labour of carers.',
    description:
      'An exhibition and performance work that centres the people who hold others up. Caring for Those Who Care makes visible the emotional, physical, and economic cost of care work \u2014 and asks what would change if we actually valued it.',
    mediums: ['exhibition', 'performance'],
    tags: ['social-practice', 'community-portrait'],
    status: 'concept',
    lcaaStages: ['Listen', 'Amplify'],
    location: 'Community and gallery contexts',
    year: 'In development',
    photoCount: 0,
    storytellerCount: 1,
    philosophy:
      'Care work is the infrastructure beneath every other kind of work. This project does not treat carers as subjects to be studied. It treats them as the foundation that everything else depends on.',
  },
  {
    slug: 'regional-arts-fellowship',
    elSlugs: ['regional-arts-fellowship'],
    title: 'Regional Arts Fellowship',
    quote:
      'A fellowship for practitioners working at the intersection of art, technology, and agriculture.',
    description:
      'A structured fellowship program connecting artists, technologists, and agricultural practitioners in regional Australia. The fellowship provides residency time, mentorship, and exhibition pathways for work that sits across disciplines \u2014 because the most urgent problems are never contained within one field.',
    mediums: ['residency'],
    tags: ['social-practice'],
    status: 'concept',
    lcaaStages: ['Listen', 'Curiosity'],
    location: 'Regional Australia',
    year: 'In development',
    photoCount: 0,
    storytellerCount: 0,
    connectedProject: 'Black Cockatoo Valley',
    connectedProjectHref: '/projects/black-cockatoo-valley',
    philosophy:
      'Regional Australia is full of practitioners doing extraordinary work at the edges of art, technology, and land. This fellowship creates a frame for that work to be seen, resourced, and connected.',
  },
  {
    slug: 'cars-and-microcontrollers',
    elSlugs: ['cars-and-microcontrollers'],
    title: 'Cars and Microcontrollers',
    quote:
      'Making things with your hands is not a hobby. For some young people, it\'s the first time their intelligence has been recognised.',
    description:
      'A hands-on making program that uses car repair and microcontroller projects as the entry point for young people who learn by doing. Not coding bootcamps. Not classrooms. Engines, wires, soldering irons, and the dignity of being trusted with real tools.',
    mediums: ['interactive', 'making'],
    tags: ['digital', 'participatory'],
    status: 'concept',
    lcaaStages: ['Action'],
    location: 'Regional Queensland',
    year: 'In development',
    photoCount: 0,
    storytellerCount: 0,
    philosophy:
      'Intelligence shows up in many forms. Some people think best with their hands. This program does not "engage youth" \u2014 it recognises a kind of intelligence that school systems routinely miss.',
  },
];

/**
 * Get all configured art projects (static config only, no EL hydration).
 */
export function getArtProjectConfigs(): ArtProjectConfig[] {
  return ART_PROJECTS;
}

/**
 * Get a single art project config by slug.
 */
export function getArtProjectConfigBySlug(
  slug: string
): ArtProjectConfig | null {
  return ART_PROJECTS.find((project) => project.slug === slug) || null;
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

  const media = elContent?.media.items || [];
  const heroImage = elContent?.media.hero || media[0] || null;
  const storytellers = elContent?.featured.storytellers || [];
  const stories = elContent?.featured.stories || [];

  return {
    ...config,
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
        project.stories.length === 0)
    ) {
      emerging.push(project);
    } else {
      featured.push(project);
    }
  }

  return { featured, emerging };
}
