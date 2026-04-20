/**
 * Cluster cohort resolver
 *
 * Given a current project's wiki cluster (e.g. "act-studio", "justicehub",
 * "act-farm"), return the sibling projects that share that cluster — i.e. the
 * editorial cohort defined by wiki folder layout + frontmatter `cluster:` field.
 *
 * Source of truth: `getCanonicalWikiProjectRecords()` from canonical-project-wiki,
 * which already parses `cluster` from frontmatter or infers it from the wiki path
 * (first path segment under `projects/`). See `inferCluster` in
 * `src/lib/wiki/canonical-project-wiki.ts`.
 *
 * Cohort semantics:
 * - Exclude the current project (by slug, canonicalSlug, or websiteSlug).
 * - Exclude the generic "projects" cluster value — that's the fallback bucket
 *   for flat top-level docs (e.g. `projects/foo.md` with no subfolder and no
 *   explicit frontmatter cluster). It isn't a meaningful editorial cohort; it's
 *   just "everything loose at the top of the projects folder". Showing 30+
 *   unrelated projects as "sisters" would be noise.
 * - Return up to 8 members, alphabetised by title (records come pre-sorted).
 */

import 'server-only';

import { cache } from 'react';

import {
  getCanonicalWikiProjectRecords,
  type CanonicalWikiProjectRecord,
} from '@/lib/wiki/canonical-project-wiki';

export interface ClusterCohortEntry {
  /** Website slug used for /projects/<slug> routing. */
  slug: string;
  /** Display name. */
  name: string;
  /** One-line editorial summary for the card. */
  excerpt: string | null;
  /** The cluster both projects share. */
  cluster: string;
}

/** Clusters we never surface as a cohort — too broad / not editorially meaningful. */
const NON_COHORT_CLUSTERS = new Set<string>(['projects']);

function pickExcerpt(record: CanonicalWikiProjectRecord): string | null {
  // Prefer summary (epigraph), then overview — both are already stripped of
  // markdown by the canonical-project-wiki parser.
  const summary = record.summary?.trim();
  if (summary) return summary;

  const overview = record.overview?.trim();
  if (!overview) return null;

  // Overview can be multi-sentence — trim to first sentence for card density.
  const firstSentence = overview.split(/(?<=[.!?])\s+/)[0];
  return firstSentence.length > 220
    ? `${firstSentence.slice(0, 217).trimEnd()}...`
    : firstSentence;
}

function matchesCurrentProject(
  record: CanonicalWikiProjectRecord,
  currentSlug: string
): boolean {
  const current = currentSlug.toLowerCase();
  return (
    record.slug.toLowerCase() === current ||
    record.canonicalSlug.toLowerCase() === current ||
    record.websiteSlug.toLowerCase() === current
  );
}

/**
 * Return sister projects in the same wiki cluster as `currentSlug`.
 * Empty array when cluster is absent, non-editorial, or has no siblings.
 */
export const getClusterCohort = cache(
  async (
    currentSlug: string,
    cluster: string | null | undefined
  ): Promise<ClusterCohortEntry[]> => {
    if (!cluster) return [];
    const normalizedCluster = cluster.trim().toLowerCase();
    if (!normalizedCluster || NON_COHORT_CLUSTERS.has(normalizedCluster)) {
      return [];
    }

    const records = await getCanonicalWikiProjectRecords();
    const siblings = records.filter((record) => {
      if (!record.cluster) return false;
      if (record.cluster.toLowerCase() !== normalizedCluster) return false;
      if (matchesCurrentProject(record, currentSlug)) return false;
      return true;
    });

    return siblings.slice(0, 8).map((record) => ({
      slug: record.websiteSlug,
      name: record.title,
      excerpt: pickExcerpt(record),
      cluster: normalizedCluster,
    }));
  }
);
