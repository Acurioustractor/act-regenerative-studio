/**
 * Sister Projects Section
 *
 * Editorial cohort navigation: lists other ACT projects that share a wiki
 * cluster with this one (e.g. act-studio, justicehub, act-farm). Complements
 * the backlinks-driven "Related Projects" grid, we accept slight overlap
 * between the two rather than dedupe. Backlinks are author-curated "these are
 * connected" statements; cluster membership is "these live in the same editorial
 * neighbourhood". A project can legitimately surface in both lists, and the
 * adjacent eyebrows make the distinction clear.
 *
 * Silent when the cohort is empty.
 */

import Link from 'next/link';

import type { ClusterCohortEntry } from '@/lib/projects/cluster-cohort';

interface SisterProjectsSectionProps {
  cluster: string;
  projects: ClusterCohortEntry[];
}

function formatClusterLabel(cluster: string): string {
  // "act-studio" -> "ACT Studio", "justicehub" -> "JusticeHub" (rough);
  // we keep it simple: replace dashes with spaces and title-case words,
  // with a small override map for acronyms that should stay cased.
  const overrides: Record<string, string> = {
    'act-studio': 'ACT Studio',
    'act-farm': 'ACT Farm',
    'empathy-ledger': 'Empathy Ledger',
    'the-harvest': 'The Harvest',
    'goods': 'Goods on Country',
    justicehub: 'JusticeHub',
    picc: 'PICC',
  };
  if (overrides[cluster]) return overrides[cluster];
  return cluster
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function publicExcerpt(excerpt: string | null | undefined, name: string) {
  const trimmed = excerpt?.trim();
  if (!trimmed) return null;
  if (/coming soon|placeholder|still being prepared|still being surfaced/i.test(trimmed)) {
    return `${name} is in development, with public details held until the story and source record are ready.`;
  }
  return trimmed;
}

export function SisterProjectsSection({
  cluster,
  projects,
}: SisterProjectsSectionProps) {
  if (projects.length === 0) return null;

  const clusterLabel = formatClusterLabel(cluster);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Cluster cohort
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          Sister projects in the {clusterLabel} cluster
        </h2>
        <p className="mt-3 text-sm text-[var(--we-olive-deep)]">
          Other projects that share this project&rsquo;s editorial cluster in the
          ACT wiki, the same neighbourhood of practice, place, or programme.
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="group block h-full rounded-[20px] border border-[var(--we-sand)] bg-white p-5 transition hover:border-[#7A9B76] hover:shadow-lg"
            >
              <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)] group-hover:text-[#7A9B76]">
                {project.name}
              </h3>
              {publicExcerpt(project.excerpt, project.name) ? (
                <p className="mt-2 text-sm leading-6 text-[var(--we-olive-deep)] line-clamp-3">
                  {publicExcerpt(project.excerpt, project.name)}
                </p>
              ) : null}
              <span className="mt-4 inline-block text-[11px] uppercase tracking-[0.22em] text-[var(--we-brown-deep)] group-hover:text-[var(--we-olive)]">
                Open project &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
