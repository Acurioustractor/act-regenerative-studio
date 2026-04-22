/**
 * ACT Ecosystem - Centralized project configuration
 *
 * This is the single source of truth for all ACT ecosystem projects.
 * Used across: footer, ecosystem page, project cards, navigation.
 *
 * GitHub org: https://github.com/Acurioustractor
 */

export interface EcosystemProject {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  // URLs
  url: string;
  repo: string;
  // Categorization
  category: 'platform' | 'community' | 'farm' | 'studio';
  projectCode: string;
  // Status
  status: 'live' | 'beta' | 'development' | 'planned';
  // Optional
  icon?: string;
}

export const ecosystemProjects: EcosystemProject[] = [
  {
    name: 'ACT Regenerative Studio',
    slug: 'act-regenerative-studio',
    tagline: 'Regenerative innovation hub',
    description: 'Unified platform and operations hub for the ACT ecosystem',
    url: 'https://act-regenerative-studio.vercel.app',
    repo: 'Acurioustractor/act-regenerative-studio',
    category: 'studio',
    projectCode: 'ACT-IN',
    status: 'live',
  },
  {
    name: 'Empathy Ledger',
    slug: 'empathy-ledger',
    tagline: 'Ethical storytelling & cultural wisdom',
    description: 'Consent-first storytelling platform built on Indigenous data sovereignty principles',
    url: 'https://empathy-ledger-v2.vercel.app',
    repo: 'Acurioustractor/empathy-ledger-v2',
    category: 'platform',
    projectCode: 'ACT-EL',
    status: 'live',
  },
  {
    name: 'JusticeHub',
    slug: 'justicehub',
    tagline: 'Youth justice & community services',
    description: 'Open-source justice network with forkable program models',
    url: 'https://justicehub.com.au',
    repo: 'Acurioustractor/justicehub-platform',
    category: 'platform',
    projectCode: 'ACT-JH',
    status: 'live',
  },
  {
    name: 'The Harvest',
    slug: 'the-harvest',
    tagline: 'Community hub & local enterprise',
    description: 'Therapeutic horticulture and heritage preservation at Witta',
    url: 'https://theharvestwitta.com.au',
    repo: 'Acurioustractor/theharvest',
    category: 'community',
    projectCode: 'ACT-HV',
    status: 'live',
  },
  {
    name: 'ACT Farm',
    slug: 'act-farm',
    tagline: 'Regenerative tourism & residencies',
    description: 'Farm stays, artist residencies, and land-based learning',
    url: 'https://act-farm.vercel.app',
    repo: 'Acurioustractor/act-farm',
    category: 'farm',
    projectCode: 'ACT-FM',
    status: 'live',
  },
  {
    name: 'Goods on Country',
    slug: 'goods-on-country',
    tagline: 'Circular economy & community goods-on-country',
    description: 'Asset tracking and circular economy for community goods-on-country',
    url: 'https://goodsoncountry.netlify.app',
    repo: 'Acurioustractor/goods-asset-tracker',
    category: 'community',
    projectCode: 'ACT-GD',
    status: 'beta',
  },
];

// Helper functions
export function getProjectBySlug(slug: string): EcosystemProject | undefined {
  return ecosystemProjects.find(p => p.slug === slug);
}

export function getProjectByCode(code: string): EcosystemProject | undefined {
  return ecosystemProjects.find(p => p.projectCode === code);
}

export function getProjectsByCategory(category: EcosystemProject['category']): EcosystemProject[] {
  return ecosystemProjects.filter(p => p.category === category);
}

export function getLiveProjects(): EcosystemProject[] {
  return ecosystemProjects.filter(p => p.status === 'live' || p.status === 'beta');
}
