/**
 * Knowledge Links Section
 * Connects project pages to the ACT knowledge ecosystem:
 * - Wiki/Knowledge base articles
 * - Empathy Ledger stories
 * - Impact metrics
 * - Related resources
 * - Ecosystem metadata (code, status, location, external links)
 */

import Link from 'next/link';
import type { ProjectTheme } from '@/data/projects';
import { themeStyles } from '@/lib/projects';
import type { EcosystemProject } from '@/lib/ecosystem';

interface KnowledgeLink {
  title: string;
  description: string;
  href: string;
  icon: string;
  external?: boolean;
}

interface KnowledgeLinksSectionProps {
  projectSlug: string;
  projectTitle: string;
  theme: ProjectTheme;
  ecosystemData?: EcosystemProject;
  projectWebsiteUrl?: string | null;
  projectRepoUrl?: string | null;
  hasEmpathyLedgerContent?: boolean;
  hasWikiArticles?: boolean;
  customLinks?: KnowledgeLink[];
}

const EMPATHY_LEDGER_URL = process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || 'https://empathyledger.org';

export function KnowledgeLinksSection({
  projectSlug,
  projectTitle,
  theme,
  ecosystemData,
  projectWebsiteUrl = null,
  projectRepoUrl = null,
  hasEmpathyLedgerContent = false,
  hasWikiArticles = false,
  customLinks = [],
}: KnowledgeLinksSectionProps) {
  const style = themeStyles[theme];

  // Build default links based on available content
  const defaultLinks: KnowledgeLink[] = [
    {
      title: 'Living Knowledge Base',
      description: 'Explore the ACT wiki, research, and evolving methodology connected to this work',
      href: `/wiki?project=${projectSlug}`,
      icon: '📚',
    },
    {
      title: 'Impact Data',
      description: 'Metrics, outcomes, and evidence from this work',
      href: `/impact?project=${projectSlug}`,
      icon: '📊',
    },
  ];

  // Add Empathy Ledger link if content exists
  if (hasEmpathyLedgerContent) {
    defaultLinks.push({
      title: 'Community Stories',
      description: 'First-person stories from people connected to this work',
      href: `${EMPATHY_LEDGER_URL}/projects/${projectSlug}`,
      icon: '💬',
      external: true,
    });
  }

  // Add wiki link if articles exist
  if (hasWikiArticles) {
    defaultLinks.unshift({
      title: 'Project Wiki',
      description: 'In-depth documentation and how-to guides',
      href: `/wiki/${projectSlug}`,
      icon: '📖',
    });
  }

  if (projectWebsiteUrl) {
    defaultLinks.push({
      title: 'Project Website',
      description: 'Visit the dedicated public site for this project',
      href: projectWebsiteUrl,
      icon: '🌐',
      external: true,
    });
  }

  if (projectRepoUrl || ecosystemData?.github_repo) {
    defaultLinks.push({
      title: 'Source Code',
      description: 'Open source repository and technical documentation',
      href: projectRepoUrl || `https://github.com/${ecosystemData?.github_repo}`,
      icon: '💻',
      external: true,
    });
  }

  const allLinks = [...defaultLinks, ...customLinks];

  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Learn More
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          Explore the Knowledge Base
        </h2>
        <p className="mt-3 text-sm text-[var(--we-olive-deep)] max-w-xl mx-auto">
          Dive deeper into the research, stories, and impact data behind {projectTitle}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allLinks.map((link) => {
          const LinkComponent = link.external ? 'a' : Link;
          const linkProps = link.external
            ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
            : { href: link.href };

          return (
            <LinkComponent
              key={link.href}
              {...linkProps}
              className="group flex items-start gap-4 rounded-2xl border border-[var(--we-sand)] bg-white p-5 transition-all hover:border-[#7A9B76] hover:shadow-md"
            >
              <span className="text-2xl">{link.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--we-olive)] group-hover:text-[#7A9B76]">
                  {link.title}
                  {link.external && (
                    <svg
                      className="ml-1 inline-block h-3 w-3 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </h3>
                <p className="mt-1 text-sm text-[var(--we-brown-deep)]">{link.description}</p>
              </div>
            </LinkComponent>
          );
        })}
      </div>

      {/* Ecosystem Metadata Badge */}
      {ecosystemData && (
        <div className="flex flex-wrap items-center justify-center gap-3 py-4 border-t border-[var(--we-sand)]">
          {ecosystemData.code && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F1E7] px-3 py-1.5 text-xs font-medium text-[var(--we-brown-deep)]">
              <span className="opacity-60">Code:</span>
              <span className="font-semibold">{ecosystemData.code}</span>
            </span>
          )}
          {ecosystemData.status && (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
              ecosystemData.status === 'active'
                ? 'bg-[#E5F4E4] text-[#2F5233]'
                : ecosystemData.status === 'ideation'
                ? 'bg-[#FFF8E7] text-[#8B6914]'
                : 'bg-[#F0F0F0] text-[#666666]'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                ecosystemData.status === 'active' ? 'bg-[#4CAF50]' : 'bg-current opacity-50'
              }`} />
              {ecosystemData.status.charAt(0).toUpperCase() + ecosystemData.status.slice(1)}
            </span>
          )}
          {ecosystemData.location && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6F1E7] px-3 py-1.5 text-xs text-[var(--we-brown-deep)]">
              📍 {ecosystemData.location}
            </span>
          )}
          {ecosystemData.alma_program && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0E8] px-3 py-1.5 text-xs text-[#4D6B4D]">
              🌱 {ecosystemData.alma_program}
            </span>
          )}
          {ecosystemData.lcaa_themes && ecosystemData.lcaa_themes.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0E8F0] px-3 py-1.5 text-xs text-[#6B4D6B]">
              LCAA: {ecosystemData.lcaa_themes.join(', ')}
            </span>
          )}
        </div>
      )}

      {/* ACT studio connection */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <div className="flex items-center gap-3 text-sm text-[var(--we-brown-deep)]">
          <span>Part of the</span>
          <Link
            href="/"
            className="font-semibold text-[var(--we-olive)] hover:text-[#7A9B76] transition"
          >
            ACT studio field
          </Link>
        </div>
        <span className="hidden sm:inline text-[var(--we-sand)]">|</span>
        <a
          href={EMPATHY_LEDGER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[var(--we-brown-deep)] hover:text-[#B85C38] transition"
        >
          <span>Stories powered by</span>
          <span className="font-semibold">Empathy Ledger</span>
          <svg
            className="h-3 w-3 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
