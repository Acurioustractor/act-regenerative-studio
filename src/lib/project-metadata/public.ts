import 'server-only';

import { cache } from 'react';

import { projects } from '@/data/projects';
import { getCanonicalWikiProjectRecords } from '@/lib/wiki/canonical-project-wiki';
import type { ProjectMetadata } from '@/lib/project-metadata/types';

function normalizeValue(value: string | null | undefined): string {
  return (value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inferStatus(value: string | null | undefined): ProjectMetadata['status'] {
  const normalized = normalizeValue(value);

  if (normalized.includes('pause')) return 'paused';
  if (normalized.includes('complete') || normalized.includes('done')) return 'completed';
  if (normalized.includes('plan') || normalized.includes('proposal')) return 'planning';
  if (normalized.includes('sunset')) return 'paused';
  if (normalized.includes('idea')) return 'planning';

  return 'active';
}

function toTitleCase(value: string): string {
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function dedupe(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))
  );
}

const getCanonicalProjectMap = cache(async () => {
  const records = await getCanonicalWikiProjectRecords().catch(() => []);
  return new Map(records.map((record) => [record.slug, record]));
});

function getStaticProject(slug: string) {
  return projects.find((project) => project.slug === slug) || null;
}

function buildBaseMetadata(slug: string): ProjectMetadata | null {
  const staticProject = getStaticProject(slug);

  if (!staticProject) {
    return null;
  }

  return {
    id: slug,
    slug,
    title: staticProject.title,
    description: staticProject.description,
    status: 'active',
    priority: 0,
    focusAreas: staticProject.focus || [],
    themes: dedupe([...staticProject.focus, toTitleCase(staticProject.theme)]),
    partners: [],
    organizationName: staticProject.title,
    startDate: null,
    endDate: null,
    outcomes: staticProject.description,
    metrics: {},
    timelineEntries: [],
    connections: [],
    notes: '',
    coverImage: staticProject.heroImage,
    lastUpdated: new Date(0).toISOString(),
  };
}

async function enrichWithWiki(base: ProjectMetadata): Promise<ProjectMetadata> {
  const staticProject = getStaticProject(base.slug);
  const canonicalBySlug = await getCanonicalProjectMap();
  const wikiRecord = canonicalBySlug.get(base.slug);

  if (!staticProject) {
    return base;
  }

  return {
    ...base,
    title: wikiRecord?.title || base.title,
    description:
      wikiRecord?.overview ||
      wikiRecord?.summary ||
      staticProject.description ||
      base.description,
    status: inferStatus(wikiRecord?.status || base.status),
    priority:
      wikiRecord?.tier === 'Place' ||
      wikiRecord?.tier === 'Ecosystem' ||
      ['justicehub', 'goods', 'the-harvest', 'empathy-ledger', 'black-cockatoo-valley'].includes(base.slug)
        ? 1
        : 0,
    focusAreas: staticProject.focus || base.focusAreas,
    themes: dedupe([
      ...base.themes,
      ...(staticProject.focus || []),
      wikiRecord?.tier || null,
      wikiRecord?.status || null,
    ]),
    partners: base.partners,
    organizationName: wikiRecord?.title || base.organizationName,
    outcomes:
      wikiRecord?.overview ||
      wikiRecord?.summary ||
      staticProject.description ||
      base.outcomes,
    metrics: {
      ...base.metrics,
      wikiStatus: wikiRecord?.status || null,
      wikiTier: wikiRecord?.tier || null,
      wikiCode: wikiRecord?.canonicalCode || wikiRecord?.code || null,
      wikiCanonicalSlug: wikiRecord?.canonicalSlug || null,
      wikiEntityType: wikiRecord?.entityType || null,
      wikiTaggingMode: wikiRecord?.taggingMode || null,
      wikiPrimaryPath: wikiRecord?.websitePath || null,
    },
    notes: wikiRecord?.summary || base.notes,
    coverImage: staticProject.heroImage || base.coverImage,
    lastUpdated: wikiRecord?.modifiedAt || base.lastUpdated,
  };
}

export async function getPublicProjectMetadata(
  slug: string
): Promise<ProjectMetadata | null> {
  const base = buildBaseMetadata(slug);

  if (!base) {
    return null;
  }

  return enrichWithWiki(base);
}

export async function getAllPublicProjectMetadata(): Promise<ProjectMetadata[]> {
  const records = await Promise.all(
    projects.map((project) => getPublicProjectMetadata(project.slug))
  );

  return records.filter((record): record is ProjectMetadata => !!record);
}

export async function getPublicProjectPageContent(slug: string): Promise<string> {
  const project = await getPublicProjectMetadata(slug);

  if (!project) {
    return '';
  }

  return [project.description, project.outcomes, project.notes]
    .filter(Boolean)
    .join('\n\n')
    .trim();
}
