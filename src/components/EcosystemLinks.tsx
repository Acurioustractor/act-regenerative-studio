import Link from 'next/link';
import { ecosystemProjects, type EcosystemProject } from '@/data/ecosystem';
import { getCanonicalWikiProjectRecords } from '@/lib/wiki/canonical-project-wiki';

type EcosystemLinkProject = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  url: string;
  repo: string | null;
  status: 'live' | 'beta' | 'development' | 'planned';
  category?: EcosystemProject['category'];
};

interface EcosystemLinksProps {
  /** Show as cards (default) or compact list */
  variant?: 'cards' | 'compact' | 'buttons';
  /** Filter to specific category */
  category?: EcosystemProject['category'];
  /** Exclude a specific project (useful when on that project's page) */
  exclude?: string;
  /** Maximum number of projects to show */
  limit?: number;
  /** Title for the section */
  title?: string;
  /** Show only live projects */
  liveOnly?: boolean;
  className?: string;
}

const PRIORITY_SLUGS = [
  'justicehub',
  'goods-on-country',
  'the-harvest',
  'empathy-ledger',
  'act-farm',
  'oonchiumpa',
  'picc',
  'civicgraph',
];

function getPriorityIndex(slug: string): number {
  const index = PRIORITY_SLUGS.indexOf(slug);
  return index === -1 ? PRIORITY_SLUGS.length + 1 : index;
}

function isHubUrl(value: string): boolean {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return (
      host === 'act.place' ||
      host === 'www.act.place' ||
      host === 'act-regenerative-studio.vercel.app'
    );
  } catch {
    return false;
  }
}

async function loadDisplayProjects(): Promise<EcosystemLinkProject[]> {
  const canonicalRecords = await getCanonicalWikiProjectRecords().catch(() => []);
  const staticBySlug = new Map(ecosystemProjects.map((project) => [project.slug, project]));

  const canonicalProjects = canonicalRecords
    .filter((record) => record.publicSiteUrl && !isHubUrl(record.publicSiteUrl))
    .map((record) => {
      const staticProject = staticBySlug.get(record.slug);

      return {
        name: record.slug === 'act-farm' ? 'Black Cockatoo Valley' : record.title,
        slug: record.slug,
        tagline: record.summary || staticProject?.tagline || 'Dedicated project website',
        description:
          record.overview || staticProject?.description || 'Public site connected to the wider ACT field.',
        url: record.publicSiteUrl!,
        repo:
          record.repoUrl?.replace('https://github.com/', '') ||
          staticProject?.repo ||
          null,
        status: staticProject?.status || 'live',
        category: staticProject?.category,
      } satisfies EcosystemLinkProject;
    });

  const mergedBySlug = new Map<string, EcosystemLinkProject>();

  for (const project of ecosystemProjects) {
    if (isHubUrl(project.url)) {
      continue;
    }

    mergedBySlug.set(project.slug, {
      name: project.name,
      slug: project.slug,
      tagline: project.tagline,
      description: project.description,
      url: project.url,
      repo: project.repo,
      status: project.status,
      category: project.category,
    });
  }

  for (const project of canonicalProjects) {
    mergedBySlug.set(project.slug, project);
  }

  return Array.from(mergedBySlug.values()).sort((left, right) => {
    const priorityDelta = getPriorityIndex(left.slug) - getPriorityIndex(right.slug);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return left.name.localeCompare(right.name);
  });
}

export async function EcosystemLinks({
  variant = 'cards',
  category,
  exclude,
  limit,
  title,
  liveOnly = true,
  className = '',
}: EcosystemLinksProps) {
  let projects = await loadDisplayProjects();

  if (liveOnly) {
    projects = projects.filter((project) => project.status === 'live' || project.status === 'beta');
  }

  if (category) {
    projects = projects.filter((project) => project.category === category);
  }

  if (exclude) {
    projects = projects.filter((project) => project.slug !== exclude);
  }

  if (limit) {
    projects = projects.slice(0, limit);
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {projects.map((project) => (
          <a
            key={project.slug}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#4CAF50] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3D9143]"
          >
            <span>{project.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={className}>
        {title && (
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--we-olive)]">
            {title}
          </h3>
        )}
        <nav aria-label="Ecosystem, related sites" className="space-y-2">
          {projects.map((project) => (
            <a
              key={project.slug}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-[#4CAF50]/10"
            >
              <div>
                <div className="text-sm font-medium text-[var(--we-olive)] group-hover:text-[#4CAF50]">
                  {project.name}
                </div>
                <div className="text-xs text-[var(--we-warm-brown)]">{project.tagline}</div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--we-warm-brown)] group-hover:text-[#4CAF50]"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ))}
        </nav>
      </div>
    );
  }

  // Default: cards
  return (
    <div className={className}>
      {title && (
        <h2 className="mb-6 text-lg font-semibold uppercase tracking-[0.2em] text-[var(--we-olive)]">
          {title}
        </h2>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="rounded-2xl border border-[#E4D7BF] bg-white p-6 transition hover:shadow-lg"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-[var(--we-olive)]">{project.name}</h3>
              <p className="mt-1 text-sm text-[var(--we-warm-brown)]">{project.tagline}</p>
            </div>
            <p className="mb-4 text-sm text-[var(--we-brown-deep)] line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#4CAF50] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#3D9143]"
              >
                Visit Site
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <a
                href={`https://github.com/${project.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#4CAF50] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--we-olive)] transition hover:bg-[#4CAF50]/10"
              >
                GitHub
              </a>
            </div>
            {project.status === 'beta' && (
              <span className="mt-3 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                Beta
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Standalone "Visit Site" button for a single project
 */
export function VisitSiteButton({
  project,
  size = 'md',
  className = '',
}: {
  project: EcosystemProject;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-[#4CAF50] font-semibold text-white transition hover:bg-[#3D9143] ${sizes[size]} ${className}`}
    >
      Visit {project.name}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  );
}
