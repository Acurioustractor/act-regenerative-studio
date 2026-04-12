/**
 * ACT Ecosystem Integration
 *
 * Connects to the central act-ecosystem repository for:
 * - Project metadata (codes, leads, status)
 * - Cross-system identifiers (Notion, GHL, Xero, etc.)
 * - LCAA themes and ALMA programs
 *
 * Data sources:
 * - Local: Reads from act-ecosystem/config/*.json
 * - API: Can connect to Command Center at localhost:3456
 * - Supabase: Shared database for live data
 */

import { promises as fs } from 'fs';
import path from 'path';
import projectCodeRegistry from '@/data/project-code-registry.generated.json';
import { ecosystemProjects as websiteEcosystemProjects } from '@/data/ecosystem';

// Path to act-ecosystem repository (sibling directory)
const ECOSYSTEM_PATH = process.env.ACT_ECOSYSTEM_PATH ||
  path.join(process.cwd(), '..', 'act-ecosystem');

export interface EcosystemProject {
  name: string;
  code: string;
  category: string;
  priority?: string;
  status: 'active' | 'ideation' | 'sunsetting' | 'archived' | 'transferred';
  description: string;
  leads?: string[];
  location?: string;
  place?: string; // Country/traditional land
  notion_pages?: string[];
  notion_ids?: Record<string, string>;
  ghl_tags?: string[];
  xero_tracking?: string;
  dext_category?: string;
  alma_program?: string;
  lcaa_themes?: string[];
  cultural_protocols?: boolean;
  github_repo?: string;
  production_url?: string;
  parent_project?: string;
  sub_projects?: string[];
}

export interface EcosystemMeta {
  description: string;
  version: string;
  updated: string;
  systems: string[];
  status_values: string[];
}

export interface EcosystemData {
  _meta: EcosystemMeta;
  projects: Record<string, EcosystemProject>;
}

interface ProjectCodeRegistrySnapshot {
  generatedAt: string;
  projectCount: number;
  projects: Array<{
    code: string;
    name: string;
    status: EcosystemProject['status'];
    category: string;
    canonicalSlug: string | null;
    wikiSlug: string | null;
    staticSlug: string | null;
    aliases?: string[];
    lookupKeys?: string[];
    notionPages?: string[];
    ghlTags?: string[];
    xeroTracking?: string | null;
    productionUrl?: string | null;
  }>;
}

// Cache for ecosystem data
let ecosystemCache: EcosystemData | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 60 * 1000; // 1 minute cache

const PROJECT_CODE_REGISTRY =
  projectCodeRegistry as unknown as ProjectCodeRegistrySnapshot;

function buildGeneratedEcosystemData(): EcosystemData {
  const projects: Record<string, EcosystemProject> = {};

  for (const project of PROJECT_CODE_REGISTRY.projects) {
    const websiteProject =
      websiteEcosystemProjects.find((candidate) => {
        const lookupValues = [
          candidate.slug,
          candidate.projectCode,
          candidate.name,
        ].map((value) => value.toLowerCase());

        return [project.canonicalSlug, project.staticSlug, project.wikiSlug, ...(project.aliases || [])]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase())
          .some((value) => lookupValues.includes(value));
      }) || null;

    projects[project.code] = {
      name: project.name,
      code: project.code,
      category: project.category,
      status: project.status,
      description: websiteProject?.description || project.name,
      notion_pages: project.notionPages,
      ghl_tags: project.ghlTags,
      xero_tracking: project.xeroTracking || undefined,
      production_url: project.productionUrl || websiteProject?.url,
      github_repo: websiteProject?.repo,
    };
  }

  return {
    _meta: {
      description: 'Bundled ACT ecosystem registry fallback',
      version: PROJECT_CODE_REGISTRY.generatedAt,
      updated: PROJECT_CODE_REGISTRY.generatedAt,
      systems: ['project-code-registry.generated.json'],
      status_values: Array.from(
        new Set(PROJECT_CODE_REGISTRY.projects.map((project) => project.status))
      ).sort(),
    },
    projects,
  };
}

async function loadFileBackedEcosystemData(configPath: string): Promise<EcosystemData | null> {
  try {
    await fs.access(configPath);
  } catch {
    return null;
  }

  const content = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(content) as EcosystemData;
}

/**
 * Load ecosystem project data from config
 */
export async function loadEcosystemData(): Promise<EcosystemData | null> {
  // Return cached data if fresh
  if (ecosystemCache && Date.now() - cacheTime < CACHE_TTL) {
    return ecosystemCache;
  }

  try {
    const configPath = path.join(ECOSYSTEM_PATH, 'config', 'project-codes.json');
    ecosystemCache =
      (await loadFileBackedEcosystemData(configPath)) || buildGeneratedEcosystemData();
    cacheTime = Date.now();
    return ecosystemCache;
  } catch (error) {
    console.warn('Could not load file-backed ecosystem data, using bundled registry:', error);

    try {
      ecosystemCache = buildGeneratedEcosystemData();
      cacheTime = Date.now();
      return ecosystemCache;
    } catch (fallbackError) {
      console.warn('Could not load bundled ecosystem registry:', fallbackError);
      return null;
    }
  }
}

/**
 * Get a project by its ecosystem code (e.g., "ACT-JH")
 */
export async function getProjectByCode(code: string): Promise<EcosystemProject | null> {
  const data = await loadEcosystemData();
  return data?.projects[code] || null;
}

/**
 * Find ecosystem project by slug (matches against name)
 */
export async function getProjectBySlug(slug: string): Promise<EcosystemProject | null> {
  const data = await loadEcosystemData();
  if (!data) return null;

  // Convert slug to searchable name
  const searchName = slug.toLowerCase().replace(/-/g, ' ');

  for (const [code, project] of Object.entries(data.projects)) {
    const projectName = project.name.toLowerCase();
    if (
      projectName === searchName ||
      projectName.includes(searchName) ||
      searchName.includes(projectName) ||
      code.toLowerCase() === slug.toUpperCase()
    ) {
      return project;
    }
  }

  return null;
}

/**
 * Get all active ecosystem projects
 */
export async function getActiveProjects(): Promise<EcosystemProject[]> {
  const data = await loadEcosystemData();
  if (!data) return [];

  return Object.values(data.projects).filter(p => p.status === 'active');
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: string): Promise<EcosystemProject[]> {
  const data = await loadEcosystemData();
  if (!data) return [];

  return Object.values(data.projects).filter(p => p.category === category);
}

/**
 * Get all unique categories
 */
export async function getCategories(): Promise<string[]> {
  const data = await loadEcosystemData();
  if (!data) return [];

  const categories = new Set<string>();
  Object.values(data.projects).forEach(p => categories.add(p.category));
  return Array.from(categories).sort();
}

/**
 * Get ecosystem metadata
 */
export async function getEcosystemMeta(): Promise<EcosystemMeta | null> {
  const data = await loadEcosystemData();
  return data?._meta || null;
}

/**
 * Clear the ecosystem cache (for development)
 */
export function clearEcosystemCache(): void {
  ecosystemCache = null;
  cacheTime = 0;
}

/**
 * Check if ecosystem data is available
 */
export async function isEcosystemAvailable(): Promise<boolean> {
  try {
    const data = await loadEcosystemData();
    return data !== null;
  } catch {
    return false;
  }
}
