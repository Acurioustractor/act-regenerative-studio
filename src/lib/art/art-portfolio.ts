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

const ART_PROJECTS: ArtProjectConfig[] = [
  {
    slug: 'the-caravan',
    elSlugs: ['the-caravan', 'ACT-CVN'],
    title: 'The Caravan',
    quote: 'A room with wheels that goes to the conversation',
    description: 'Born at the 10x10 Community Capital Leadership Retreat, The Caravan is a hand-built room on wheels that travels between communities for leadership gatherings, listening sessions and on-Country conversations. The table is always set, the kettle is always on, and the meeting comes to the people rather than asking the people to come to it.',
    mediums: ['installation', 'making'],
    tags: ['community-portrait', 'public-art', 'social-practice'],
    status: 'active',
    lcaaStages: ['Action', 'Art'],
    location: 'Mobile, Australia',
    year: '2024\u2013present',
    photoCount: 24,
    storytellerCount: 0,
    connectedProject: 'Community Capital',
    connectedProjectHref: '/projects/10x10-retreat',
    philosophy:
      'The most important spaces are the ones that show up when and where they are needed. The Caravan is a room with wheels. It goes to the conversation rather than asking the conversation to come to it.',
    empathyLedger: { orgSlug: 'a-curious-tractor', elProjectSlugs: ['the-caravan'] },
  },
  {
    slug: 'picc-photo-kiosk',
    elSlugs: ['picc-photo-kiosk'],
    title: 'PICC Photo Kiosk',
    quote: 'The shutter belongs to the subject',
    description: 'On Palm Island (Bwgcolman), a self-service photo station at the Palm Island Community Company shifted who holds the camera. Families, elders, young people and visitors documented their own stories on their own terms, and more than 2,491 photographs now live in a community-owned archive that no outsider can open without consent.',
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
    quote: 'Two strangers, one phone, whatever they choose to say',
    description: 'Gold.Phone is a sculptural phone booth that connects strangers through unscripted, anonymous voice calls. No screens, no filters, no swiping: just two people and whatever they choose to say to each other. Placed in public space, it treats voice as the simplest technology we have for being present to one another.',
    mediums: ['interactive', 'installation'],
    tags: ['participatory', 'public-art', 'social-practice'],
    status: 'active',
    lcaaStages: ['Listen', 'Art'],
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
    slug: 'confessions-to-philanthropy',
    elSlugs: ['confessions-to-philanthropy'],
    title: 'Confessions to Philanthropy',
    quote: 'Say the quiet bit out loud',
    description: 'Confessions to Philanthropy is a gold phone and an anonymous voicemail for the sector that funds change. Callers leave unscripted messages about giving and power, the awkward and hopeful and unsaid, and the inbox becomes a public record you can listen to. It is not anti-philanthropy. It is a place to say the quiet bit out loud.',
    mediums: ['interactive', 'performance'],
    tags: ['participatory', 'social-practice', 'public-art'],
    status: 'active',
    lcaaStages: ['Listen', 'Art'],
    location: 'Distributed / digital',
    year: '2026',
    photoCount: 0,
    storytellerCount: 0,
    heroVideo: {
      url: '/media/field-videos/confessions-to-philanthropy.mp4',
      posterUrl: '/media/field-stills/confessions-to-philanthropy.jpg',
      alt: 'Confessions to Philanthropy, the gold phone film',
      fit: 'contain',
    },
    connectedProject: 'Confessions to Philanthropy',
    connectedProjectHref: '/confessions',
    philosophy:
      'The word philanthropy first described Prometheus, who stole fire from the gods and gave it to people. It began as defiance of power, not a tool of it. The gold phone returns philanthropy to honesty: anonymous, unscripted, and unafraid of the quiet bit.',
  },
  {
    slug: 'the-confessional',
    elSlugs: ['the-confessional'],
    title: 'The Confessional',
    quote: 'A portable room where honesty becomes possible',
    description: 'A decommissioned horse trailer, rebuilt into a mobile space for anonymous truth-telling. The Confessional sets up at festivals, community events and institutional foyers, creating a temporary room where people can say what systems teach them to hide. It is not therapy and not art for art\'s sake; it is a pressure valve that travels.',
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
      'Some truths only emerge when the architecture of a space grants permission. The Confessional is not therapy. It is not art for art\'s sake. It is a pressure valve, a portable room where honesty becomes possible.',
    impact:
      'Deployed at multiple events and community gatherings. Stories captured under consent protocols. Demonstrated model for mobile truth-telling infrastructure.',
  },
  {
    slug: 'contained',
    elSlugs: ['contained'],
    title: 'CONTAINED',
    quote: 'Step inside what we are choosing to fund',
    description: 'CONTAINED is an immersive installation that places visitors inside a simulated youth detention environment, not to shock but to ask how this system feels from the inside and what we choose when we fund it. Shaped with two people who have lived experience of detention, it has been shown alongside justice reform campaigns and advocacy work.',
    mediums: ['installation'],
    tags: ['immersive', 'justice-art', 'public-art'],
    status: 'active',
    lcaaStages: ['Art'],
    location: 'Justice and public-space contexts',
    year: '2022\u2013present',
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
    quote: 'Making the weight of paperwork impossible to ignore',
    description: 'Forms, compliance demands and reporting requirements fall hardest on the people least equipped to absorb them. Redtape turns that invisible administrative burden into sculpture you cannot walk past, asking who carries the cost of red tape and why. Twenty-nine documentary photographs trace the work, shown alongside community sector practitioners who live it.',
    mediums: ['installation', 'sculpture'],
    tags: ['justice-art', 'public-art', 'social-practice'],
    status: 'active',
    lcaaStages: ['Art'],
    location: 'Gallery and public contexts',
    year: '2023',
    photoCount: 29,
    storytellerCount: 0,
    philosophy:
      'Every form is a power relationship. Every compliance framework carries an assumption about who is trustworthy and who must prove themselves. Redtape makes that architecture visible, not as metaphor, but as material.',
    impact:
      '29 documentary photographs. Exhibited alongside community sector practitioners. Opened conversation about administrative burden as a justice issue.',
  },
  {
    slug: 'uncle-allan',
    elSlugs: ['uncle-allan-palm-island-art'],
    title: 'Uncle Allan',
    quote: 'Reef life and Dreaming, painted on Bwgcolman',
    description: 'Uncle Allan paints reef ecology and Dreaming stories on Palm Island (Bwgcolman), a practice that long predates any partnership with ACT. Creative authority stays entirely with him; ACT contributes materials, documentation and pathways to market that respect cultural sovereignty. Seventeen works are documented so the knowledge held in them travels on the artist\'s terms.',
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
    quote: 'What remains when a tree leaves its ground',
    description: 'A tree pulled from its ground still carries the voice of where it came from. Treacher works with found objects and natural materials to sit with displacement: of trees, of languages, of the feeling of a place. The work holds what survives after removal, the root structure and the soil memory of something that was here.',
    mediums: ['installation'],
    tags: ['documentary', 'justice-art'],
    status: 'ideation',
    lcaaStages: ['Listen'],
    location: 'TBC',
    year: 'In development',
    photoCount: 9,
    storytellerCount: 0,
    philosophy:
      'Displacement is not just a political event. It happens to trees, to languages, to the feeling of a place. Treacher sits with what remains after removal, the root structure, the soil memory, the ghost of something that was here.',
  },
  {
    slug: 'the-vagina',
    elSlugs: ['the-vagina'],
    title: 'The Vagina',
    quote: 'A work has a home before it has a finished form',
    description: 'An ACT Studio piece in early development. The working title is public, but its question, materials, collaborators and exhibition context are not yet documented. This page holds its place without pretending the work is finished.',
    mediums: ['installation'],
    tags: ['social-practice'],
    status: 'concept',
    lcaaStages: ['Art'],
    location: 'TBC',
    year: 'Coming soon',
    photoCount: 0,
    storytellerCount: 0,
    philosophy:
      'An emerging work should be visible as emerging. Its public record can grow as the question, authority, collaborators and material become clear.',
  },
  {
    slug: 'caring-for-those-who-care',
    elSlugs: ['caring-for-those-who-care'],
    title: 'Caring for Those Who Care',
    // Corrected 2026-08-21. The entry here described unpaid care work: carers as
    // the infrastructure beneath every other kind of work. That is a different
    // project. This one is about the founders and chief executives of small
    // not-for-profits, and what it costs them to keep telling their own worst
    // day on stage so the funding continues. Every figure below is read off the
    // live wall payload (7 people, 7 portraits, 5 further photographs), and the
    // subject matter off the interim report and the seven transcripts.
    quote: 'The people who hold everyone else, and who holds them',
    description: 'Seven people built not-for-profits out of the hardest thing that ever happened to them, and the sector then asked each of them to keep telling that story, on stage and on demand, for as long as the support keeps coming. This work sits down with them, photographs them, and puts what the telling costs into their own words on a public wall and in an exhibition. It runs alongside a pilot study into the wellbeing of not-for-profit leaders and social entrepreneurs in Australia.',
    mediums: ['photography', 'exhibition', 'performance'],
    tags: ['social-practice', 'community-portrait'],
    status: 'active',
    lcaaStages: ['Listen', 'Art'],
    location: 'Sunshine Coast, Mount Isa, Sydney, Gold Coast and the Atherton Tablelands',
    year: '2025 to 2026',
    photoCount: 12,
    storytellerCount: 7,
    externalSite: {
      label: 'The wall',
      url: 'https://caring-for-those-who-care.vercel.app',
    },
    philosophy:
      'A founder is not their worst day. The sector meets these seven mid-performance and keeps rewarding them for staying there. The work is to let them be met as people first, with every word their own, and every word removable by them at any time.',
  },
  {
    slug: 'regional-arts-fellowship',
    elSlugs: ['regional-arts-fellowship'],
    title: 'Regional Arts Fellowship',
    quote: 'Where art, technology and land meet in the regions',
    description: 'Across regional Australia, practitioners are doing extraordinary work at the edges of art, technology and agriculture, where the most urgent problems refuse to stay inside one field. This fellowship gives them residency time, mentorship and exhibition pathways so cross-disciplinary work can be seen, resourced and connected. Developed in connection with Black Cockatoo Valley.',
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
    quote: 'Engines, wires and the dignity of real tools',
    description: 'For young people who learn by doing, making something real with their hands can be the first time their intelligence is recognised. This program uses car repair and microcontroller projects as the way in: no classrooms, no coding bootcamps, just engines, soldering irons and the trust that comes with real tools. It honours a kind of intelligence that school systems routinely miss.',
    mediums: ['interactive', 'making'],
    tags: ['digital', 'participatory'],
    status: 'concept',
    lcaaStages: ['Action'],
    location: 'Regional Queensland',
    year: 'In development',
    photoCount: 0,
    storytellerCount: 0,
    philosophy:
      'Intelligence shows up in many forms. Some people think best with their hands. This program does not "engage youth", it recognises a kind of intelligence that school systems routinely miss.',
  },
  {
    slug: 'anat-spectra-2025',
    elSlugs: ['anat-spectra-2025'],
    title: 'ANAT SPECTRA 2025',
    quote: 'Where art, technology and community story meet',
    description: 'A creative research collaboration with the Australian Network for Art and Technology exploring how emerging technology can serve community storytelling. The work asks how technology can carry voice, evidence and cultural memory without extracting control from the people who hold them.',
    mediums: ['residency', 'interactive'],
    tags: ['digital', 'social-practice'],
    status: 'active',
    lcaaStages: ['Curiosity', 'Art'],
    location: 'Australia',
    year: '2025',
    photoCount: 0,
    storytellerCount: 0,
    connectedProject: 'ANAT',
    philosophy:
      'New technology is not automatically useful or just. Creative research gives communities room to test what it might hold, what it might change and what must remain in their control.',
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
