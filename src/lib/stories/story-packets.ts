export type StoryStatus = 'published' | 'public-preview' | 'internal';
export type StoryBlockVisibility = 'public' | 'internal';

export interface StoryMedia {
  kind: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
  title?: string;
}

export interface StoryTagQuery {
  all?: string[];
  any?: string[];
}

export type StoryBlock =
  | {
      kind: 'read';
      visibility?: StoryBlockVisibility;
      eyebrow?: string;
      title?: string;
      paragraphs: string[];
      media?: StoryMedia;
    }
  | {
      kind: 'immersive';
      visibility?: StoryBlockVisibility;
      eyebrow?: string;
      title: string;
      body?: string;
      media: StoryMedia;
    }
  | {
      kind: 'pullquote';
      visibility?: StoryBlockVisibility;
      quote: string;
      attribution?: string;
      consentLabel?: string;
    }
  | {
      kind: 'voices';
      visibility?: StoryBlockVisibility;
      title: string;
      description?: string;
      voices: Array<{
        quote: string;
        who: string;
        community?: string;
        consent: 'cleared' | 'pending';
      }>;
    }
  | {
      kind: 'stats';
      visibility?: StoryBlockVisibility;
      title: string;
      description?: string;
      items: Array<{ value: string; label: string }>;
    }
  | {
      kind: 'before-after';
      visibility?: StoryBlockVisibility;
      title: string;
      description?: string;
      before: StoryMedia & { label: string };
      after: StoryMedia & { label: string };
    }
  | {
      kind: 'el-gallery';
      visibility?: StoryBlockVisibility;
      title: string;
      description?: string;
      sourceProjectSlug: string;
      tagQuery: StoryTagQuery;
      limit?: number;
    }
  | {
      kind: 'el-video-gallery';
      visibility?: StoryBlockVisibility;
      title: string;
      description?: string;
      sourceProjectSlug: string;
      tagQuery: StoryTagQuery;
      limit?: number;
    }
  | {
      kind: 'wiki-links';
      visibility?: StoryBlockVisibility;
      title: string;
      description?: string;
      links: Array<{ label: string; href: string; note?: string }>;
    }
  | {
      kind: 'newsletter';
      visibility?: StoryBlockVisibility;
      title: string;
      description: string;
      source: string;
      audience?: string;
    }
  | {
      kind: 'close';
      visibility?: StoryBlockVisibility;
      title: string;
      description?: string;
      media: StoryMedia;
      links?: Array<{ label: string; href: string }>;
    };

export interface StoryPacket {
  slug: string;
  status: StoryStatus;
  title: string;
  summary: string;
  dateline: string;
  projectCode: string;
  projectSlug: string;
  tags: string[];
  hero: {
    eyebrow: string;
    title: string;
    subhead: string;
    media: StoryMedia;
  };
  sourceLinks: Array<{ label: string; href: string }>;
  blocks: StoryBlock[];
}

export const storyPackets: StoryPacket[] = [
  {
    slug: 'utopia-may-2026',
    status: 'public-preview',
    title: 'From Alice Springs to Utopia',
    summary:
      'A consent-safe public story shell for the Oonchiumpa-supported Goods trip through Alice Springs, Utopia Homelands, Arawerr, and Ampilatwatja.',
    dateline:
      'Alice Springs, Utopia Homelands, Arawerr, and Ampilatwatja, Northern Territory. May 2026.',
    projectCode: 'ACT-GD',
    projectSlug: 'goods',
    tags: ['Goods', 'Utopia Homelands', 'Oonchiumpa', 'Empathy Ledger'],
    hero: {
      eyebrow: 'Field story · Goods on Country',
      title: 'The beds stayed where they were needed.',
      subhead:
        'A public, consent-safe version of the May 2026 Goods trip. The deeper voice layer will open as consent clears through Empathy Ledger.',
      media: {
        kind: 'video',
        src: '/media/field-videos/goods-remote-aerial.mp4',
        poster: '/media/field-stills/goods-remote-aerial.jpg',
        alt: 'Remote Country seen from above during a Goods on Country field trip',
        title: 'Goods on Country remote aerial',
      },
    },
    sourceLinks: [
      { label: 'Goods project page', href: '/goods' },
      { label: 'ACT wiki', href: '/wiki/goods' },
      { label: 'Empathy Ledger', href: 'https://empathyledger.com' },
    ],
    blocks: [
      {
        kind: 'read',
        eyebrow: 'What this page is',
        title: 'A story packet, not a finished claim.',
        paragraphs: [
          'This page is the ACT story layer for a field trip that is still moving through consent. It lets the public structure exist without publishing names, voices, or cultural material before people have agreed to how the story travels.',
          'The source of truth is split deliberately: Goods carries the asset register, Empathy Ledger carries consented stories and media, and this ACT page carries the public narrative once those pieces are safe to share.',
        ],
      },
      {
        kind: 'stats',
        title: 'What can be said now',
        description:
          'These numbers come from the Goods trip report and should stay dated until the live asset register is connected directly.',
        items: [
          { value: '36', label: 'Beds placed with households during the trip' },
          { value: '87', label: 'Beds physically transferred to community' },
          { value: '1.74t', label: 'Recycled HDPE represented in transferred beds' },
          { value: '107', label: 'Stretch Beds allocated in the funded batch' },
        ],
      },
      {
        kind: 'immersive',
        eyebrow: 'The road',
        title: 'Oonchiumpa held the relationship. Goods brought the beds.',
        body:
          'The important design choice is not to make ACT the hero of the page. The story needs to keep showing who held the trip, who made decisions on the ground, and what can only be published once consent is clear.',
        media: {
          kind: 'image',
          src: '/media/field-stills/goods-remote-aerial.jpg',
          alt: 'Aerial view of remote Country connected to Goods on Country work',
        },
      },
      {
        kind: 'el-gallery',
        title: 'Photos and clips should keep arriving from Empathy Ledger',
        description:
          'This block reads from the Goods media snapshot today. As Utopia-specific media is tagged and cleared in Empathy Ledger, the same story slot can become more specific without changing the page design.',
        sourceProjectSlug: 'goods',
        tagQuery: {
          all: ['project:goods', 'trip:may-2026'],
          any: ['community:utopia-homelands', 'community:ampilatwatja'],
        },
        limit: 6,
      },
      {
        kind: 'el-video-gallery',
        title: 'Video should land in the same consent path',
        description:
          'When public clips are cleared and tagged in Empathy Ledger, this block can show them without making the page depend on a local upload folder.',
        sourceProjectSlug: 'goods',
        tagQuery: {
          all: ['project:goods'],
          any: ['trip:may-2026', 'community:utopia-homelands'],
        },
        limit: 3,
      },
      {
        kind: 'pullquote',
        visibility: 'internal',
        quote: 'Reserved consent-pending voice layer. Replace only after Empathy Ledger consent is cleared.',
        attribution: 'Internal preview note',
        consentLabel: 'Hidden on the public route until consent clears.',
      },
      {
        kind: 'voices',
        visibility: 'internal',
        title: 'Consent-pending voices',
        description:
          'These cards prove the page shape can hold voice. They must not publish until Empathy Ledger consent is verified.',
        voices: [
          {
            quote: 'Reserved storyteller quote. Do not replace until consent is cleared.',
            who: 'Consent-pending storyteller',
            community: 'Remote community',
            consent: 'pending',
          },
          {
            quote: 'Reserved community quote. Do not replace until consent is cleared.',
            who: 'Consent-pending community voice',
            community: 'Remote community',
            consent: 'pending',
          },
        ],
      },
      {
        kind: 'before-after',
        title: 'The proof is practical',
        description:
          'The strongest visual frame is simple: what people were resting on before, and what stayed in the room after the build.',
        before: {
          kind: 'image',
          src: '/media/field-stills/goods-delivery.jpg',
          alt: 'Goods on Country delivery context before a bed is installed',
          label: 'Before',
        },
        after: {
          kind: 'image',
          src: '/media/field-stills/goods-community-build.jpg',
          alt: 'Community members building a Goods Stretch Bed',
          label: 'After',
        },
      },
      {
        kind: 'wiki-links',
        title: 'Where the facts should point',
        description:
          'Story pages should never become isolated campaign pages. They need to point back to durable context, the project, and the consent system.',
        links: [
          {
            label: 'Goods on Country',
            href: '/goods',
            note: 'The ACT-facing Goods project page.',
          },
          {
            label: 'Goods wiki page',
            href: '/wiki/goods',
            note: 'Durable project context and source bridges.',
          },
          {
            label: 'Share a story',
            href: '/contact?type=share-your-story&source=stories&context=utopia-may-2026',
            note: 'Routes to the existing GHL-backed contact flow.',
          },
        ],
      },
      {
        kind: 'newsletter',
        title: 'Follow the field notes as consent clears',
        description:
          'Get the next public version when more photos, voices, and partner proof can be shared safely.',
        source: 'story-utopia-may-2026',
        audience: 'story-reader',
      },
      {
        kind: 'close',
        title: 'The story closes where the work should land: in place, with people, and with art.',
        description:
          'This is the pattern for future ACT stories. Start with place. Carry proof. Protect voice. End with culture.',
        media: {
          kind: 'image',
          src: '/media/field-stills/goods-community-aerial.jpg',
          alt: 'Remote community landscape connected to Goods on Country',
        },
        links: [
          { label: 'Open Goods', href: '/goods' },
          { label: 'Read all stories', href: '/stories' },
        ],
      },
    ],
  },
];

export function getStoryPacket(slug: string): StoryPacket | null {
  return storyPackets.find((story) => story.slug === slug) || null;
}
