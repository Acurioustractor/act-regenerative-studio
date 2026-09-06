/**
 * Presentation the record and the wiki cannot hold: a local hero video, a
 * work's own public wall, an Empathy Ledger pointer that differs from the
 * project's, or a "Part of" that is a campaign rather than a project.
 * Keyed by the piece slug from src/data/art-pieces.generated.json. Everything
 * else about a piece comes from the record and its wiki page.
 */
import type { ArtProjectConfig } from './art-portfolio';

export type ArtOverride = Partial<
  Pick<ArtProjectConfig, 'heroVideo' | 'externalSite' | 'empathyLedger' | 'connectedProject' | 'connectedProjectHref'>
>;

export const ART_OVERRIDES: Record<string, ArtOverride> = {
  'the-caravan': {
    empathyLedger: { orgSlug: 'a-curious-tractor', elProjectSlugs: ['the-caravan'] },
  },
  'confessions-to-philanthropy': {
    heroVideo: {
      url: '/media/field-videos/confessions-to-philanthropy.mp4',
      posterUrl: '/media/field-stills/confessions-to-philanthropy.jpg',
      alt: 'Confessions to Philanthropy, the gold phone film',
      fit: 'contain',
    },
    // The campaign is the work's home; CivicGraph is the data behind it.
    connectedProject: 'Confessions to Philanthropy',
    connectedProjectHref: '/confessions',
  },
  'caring-for-those-who-care': {
    externalSite: {
      label: 'The wall',
      url: 'https://caring-for-those-who-care.vercel.app',
    },
  },
};
