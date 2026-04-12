import { getLiveServicesForSite } from "@/lib/empathy-ledger-services";
import { getFeaturedWorks } from "@/lib/works/live-featured-works";
import { resolveServiceProjectLinks } from "@/lib/projects/resolve-service-project-links";

export interface ProjectIndexSignal {
  slug: string;
  directWorkCount: number;
  linkedWorkCount: number;
  totalWorkCount: number;
  serviceConnectionCount: number;
  storyCount: number;
  mediaCount: number;
  serviceNames: string[];
  workNames: string[];
}

export interface ProjectIndexSignalSummary {
  activeServiceCount: number;
  featuredWorkCount: number;
  connectedProjectCount: number;
  totalStorySignals: number;
  totalMediaSignals: number;
}

export interface ProjectIndexSignalPayload {
  summary: ProjectIndexSignalSummary;
  bySlug: Record<string, ProjectIndexSignal>;
}

function normalizeValue(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createEmptySignal(slug: string): ProjectIndexSignal {
  return {
    slug,
    directWorkCount: 0,
    linkedWorkCount: 0,
    totalWorkCount: 0,
    serviceConnectionCount: 0,
    storyCount: 0,
    mediaCount: 0,
    serviceNames: [],
    workNames: [],
  };
}

function ensureSignal(
  map: Map<string, ProjectIndexSignal>,
  slug: string
): ProjectIndexSignal {
  const existing = map.get(slug);
  if (existing) {
    return existing;
  }

  const created = createEmptySignal(slug);
  map.set(slug, created);
  return created;
}

function pushUnique(target: string[], value: string) {
  if (!target.includes(value)) {
    target.push(value);
  }
}

export async function buildProjectIndexSignals(): Promise<ProjectIndexSignalPayload> {
  const [featuredWorks, liveServices] = await Promise.all([
    getFeaturedWorks(),
    getLiveServicesForSite({ limit: 100, status: "active" }).catch(() => []),
  ]);

  const serviceLinks = await resolveServiceProjectLinks(liveServices);
  const bySlug = new Map<string, ProjectIndexSignal>();

  for (const work of featuredWorks) {
    const directSignal = ensureSignal(bySlug, work.slug);
    directSignal.directWorkCount += 1;
    directSignal.totalWorkCount += 1;
    directSignal.storyCount += work.live.storyCount;
    directSignal.mediaCount += work.live.mediaCount;
    pushUnique(directSignal.workNames, work.title);

    const connectedKey = normalizeValue(work.connectedTo);
    if (connectedKey && connectedKey !== normalizeValue(work.slug)) {
      const linkedSignal = ensureSignal(bySlug, connectedKey);
      linkedSignal.linkedWorkCount += 1;
      linkedSignal.totalWorkCount += 1;
      linkedSignal.storyCount += work.live.storyCount;
      linkedSignal.mediaCount += work.live.mediaCount;
      pushUnique(linkedSignal.workNames, work.title);
    }
  }

  for (const service of liveServices) {
    const relatedProjects = serviceLinks[service.id] || [];

    for (const projectLink of relatedProjects) {
      if (!projectLink.slug) {
        continue;
      }

      const signal = ensureSignal(bySlug, projectLink.slug);
      signal.serviceConnectionCount += 1;
      pushUnique(signal.serviceNames, service.name);
    }
  }

  const summary: ProjectIndexSignalSummary = {
    activeServiceCount: liveServices.length,
    featuredWorkCount: featuredWorks.length,
    connectedProjectCount: Array.from(bySlug.values()).filter(
      (signal) =>
        signal.totalWorkCount > 0 ||
        signal.serviceConnectionCount > 0 ||
        signal.storyCount > 0 ||
        signal.mediaCount > 0
    ).length,
    totalStorySignals: Array.from(bySlug.values()).reduce(
      (sum, signal) => sum + signal.storyCount,
      0
    ),
    totalMediaSignals: Array.from(bySlug.values()).reduce(
      (sum, signal) => sum + signal.mediaCount,
      0
    ),
  };

  return {
    summary,
    bySlug: Object.fromEntries(bySlug.entries()),
  };
}
