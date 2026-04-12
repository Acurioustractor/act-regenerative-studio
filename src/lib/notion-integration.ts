/**
 * Legacy Notion snapshot compatibility layer.
 *
 * Reads project enrichment from a generated snapshot when older tooling still
 * expects the ACT Placemat/Notion shape. The public website no longer depends
 * on this module for its main build path.
 */

import snapshot from '@/data/notion-projects.generated.json';

export interface NotionProject {
  id: string;
  slug?: string | null;
  name: string;
  description?: string;
  aiSummary?: string;
  status?: string;
  themes?: string[];
  relatedPlaces?: Array<{ displayName: string; [key: string]: any }>;
  relatedOrganisations?: string[];
  relatedPeople?: string[];
  autonomyScore?: number;
  coverImage?: string | null;
  storytellerCount?: number;
  startDate?: string | null;
  endDate?: string | null;
  nextMilestoneDate?: string | null;
  supporters?: number;
  partnerCount?: number;
  relatedResources?: string[];
  relatedArtifacts?: string[];
  notionUrl?: string;
  projectLead?: string | null | { id: string; name: string; avatarUrl?: string };
  funding?: string;
  featured?: boolean;
  projectType?: string;
}

export interface NotionProjectsResponse {
  projects: NotionProject[];
  lastUpdated: string | null;
  totalCount: number;
}

interface NotionProjectsSnapshot extends NotionProjectsResponse {
  generatedAt: string;
  sourceUrl: string | null;
}

const SNAPSHOT = snapshot as NotionProjectsSnapshot;

/**
 * Fetch all projects from the generated legacy Notion snapshot.
 *
 * @deprecated Prefer the wiki-derived public metadata layer.
 */
export async function fetchNotionProjects(): Promise<NotionProjectsResponse> {
  return {
    projects: Array.isArray(SNAPSHOT.projects) ? SNAPSHOT.projects : [],
    lastUpdated: SNAPSHOT.lastUpdated || SNAPSHOT.generatedAt || null,
    totalCount: Number.isFinite(SNAPSHOT.totalCount)
      ? SNAPSHOT.totalCount
      : Array.isArray(SNAPSHOT.projects)
        ? SNAPSHOT.projects.length
        : 0,
  };
}

/**
 * Find a project by name in the legacy Notion snapshot.
 *
 * @deprecated Prefer the wiki-derived public metadata layer.
 */
export async function findNotionProjectByName(
  projectName: string
): Promise<NotionProject | null> {
  const { projects } = await fetchNotionProjects();

  // Exact match first
  const exactMatch = projects.find(
    (p) => p.name.toLowerCase() === projectName.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // Fuzzy match - contains or is contained
  const fuzzyMatch = projects.find((p) => {
    const name = p.name.toLowerCase();
    const search = projectName.toLowerCase();
    return name.includes(search) || search.includes(name);
  });

  return fuzzyMatch || null;
}

/**
 * Get enrichment data for a project from the legacy Notion snapshot.
 *
 * @deprecated Prefer the wiki-derived public metadata layer.
 */
export async function enrichProjectFromNotion(
  projectName: string
): Promise<Partial<NotionProject>> {
  const notionProject = await findNotionProjectByName(projectName);

  if (!notionProject) {
    return {};
  }

  // Extract relevant enrichment data for older compatibility paths.
  return {
    aiSummary: notionProject.aiSummary,
    themes: notionProject.themes,
    relatedPlaces: notionProject.relatedPlaces,
    relatedOrganisations: notionProject.relatedOrganisations,
    relatedPeople: notionProject.relatedPeople,
    autonomyScore: notionProject.autonomyScore,
    coverImage: notionProject.coverImage,
    storytellerCount: notionProject.storytellerCount,
    supporters: notionProject.supporters,
    partnerCount: notionProject.partnerCount,
    notionUrl: notionProject.notionUrl,
    projectLead: notionProject.projectLead,
    funding: notionProject.funding,
  };
}
