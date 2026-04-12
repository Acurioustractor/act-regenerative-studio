import Link from 'next/link';
import { BookOpen, Search } from 'lucide-react';

import { getSourcePacketSnapshot } from '@/lib/empathy-ledger-source-packets';
import { getLivingEcosystemSummary } from '@/lib/living-ecosystem-canon';
import { getFlagshipProjectPacks } from '@/lib/wiki/flagship-project-packs';
import {
  filterCanonicalWikiPages,
  getCanonicalWikiPages,
  getCanonicalWikiSections,
} from '@/lib/wiki/canonical-site-wiki';

function getParam(
  value: string | string[] | undefined,
  fallback: string = 'all'
): string {
  if (Array.isArray(value)) {
    return value[0] || fallback;
  }

  return value || fallback;
}

export default async function WikiHomepage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = getParam(resolvedSearchParams.q, '');
  const section = getParam(resolvedSearchParams.section, 'all');
  const project = getParam(resolvedSearchParams.project, 'all');

  const [allPages, filteredPages] = await Promise.all([
    getCanonicalWikiPages(),
    filterCanonicalWikiPages({
      query,
      section,
      project,
    }),
  ]);
  const [packetSnapshot, ecosystemSummary, flagshipPacks] = await Promise.all([
    Promise.resolve(getSourcePacketSnapshot()),
    getLivingEcosystemSummary(),
    getFlagshipProjectPacks(),
  ]);

  const sections = getCanonicalWikiSections(allPages);
  const bridgeCount = flagshipPacks.reduce(
    (total, pack) => total + (pack.sourceBridges?.length || 0),
    0
  );
  const projectOptions = [
    'act-farm',
    'the-harvest',
    'justicehub',
    'empathy-ledger',
    'goods-on-country',
    'black-cockatoo-valley',
    'contained',
    'picc',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F1E7] via-[#F5F1E8] to-white">
      <section className="border-b border-[#E3D4BA] bg-[#2F3E2E] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D7E7D4]">
              Living Knowledge Base
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold md:text-6xl">
              ACT wiki, used as working infrastructure
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#E8E1D0] md:text-lg">
              This is the public face of the canonical ACT wiki. It is where project context,
              methods, decisions, communities, and people can keep learning in public as the
              ecosystem evolves.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                {allPages.length} canonical pages
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                {sections.length} sections
              </span>
              {project !== 'all' && (
                <span className="rounded-full border border-[#7A9B76] bg-[#7A9B76]/20 px-4 py-2 text-sm">
                  Filtered to {project}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-2">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Living ecosystem map',
              description:
                'See the public system map: hub, spokes, live layers, and the human decisions still open.',
              href: '/ecosystem',
              cta: 'Open ecosystem',
              stat: `${ecosystemSummary.surfaceCount} public surfaces`,
            },
            {
              title: 'Source packets',
              description:
                'Read the governed packet layer that moves approved narrative and media from Empathy Ledger into the hub.',
              href: '/wiki/source-packets',
              cta: 'Open source packets',
              stat: `${packetSnapshot.packetCount} synced packets`,
            },
            {
              title: 'Source bridges',
              description:
                'Follow the path from canonical source note to implementation repo to public page.',
              href: '/wiki/source-bridges',
              cta: 'Open source bridges',
              stat: `${bridgeCount} bridge notes`,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[28px] border border-[#E3D4BA] bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#7A9B76] hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#7A6A55]">{item.stat}</p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#4D3F33]">{item.description}</p>
              <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[#4CAF50]">
                {item.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <form className="rounded-[28px] border border-[#E3D4BA] bg-white/90 p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_220px_220px_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A6A55]" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search the ACT wiki..."
                className="w-full rounded-2xl border border-[#D7C4A2] bg-[#FDFBF7] py-3 pl-12 pr-4 text-sm text-[#2F3E2E] outline-none ring-0 transition focus:border-[#7A9B76]"
              />
            </label>

            <select
              name="section"
              defaultValue={section}
              className="rounded-2xl border border-[#D7C4A2] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2F3E2E] outline-none transition focus:border-[#7A9B76]"
            >
              <option value="all">All sections</option>
              {sections.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <select
              name="project"
              defaultValue={project}
              className="rounded-2xl border border-[#D7C4A2] bg-[#FDFBF7] px-4 py-3 text-sm text-[#2F3E2E] outline-none transition focus:border-[#7A9B76]"
            >
              <option value="all">All projects</option>
              {projectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-2xl bg-[#4CAF50] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
            >
              Filter
            </button>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/wiki/source-packets"
            className="rounded-full border border-[#D8C6A7] bg-white px-3 py-1.5 text-xs font-medium text-[#4D3F33] transition hover:border-[#7A9B76]"
          >
            Source packets
          </Link>
          <Link
            href="/wiki/source-bridges"
            className="rounded-full border border-[#D8C6A7] bg-white px-3 py-1.5 text-xs font-medium text-[#4D3F33] transition hover:border-[#7A9B76]"
          >
            Source bridges
          </Link>
          {sections.map((item) => {
            const active = section === item.id;
            return (
              <Link
                key={item.id}
                href={item.id === 'all' ? '/wiki' : `/wiki?section=${item.id}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'border-[#4CAF50] bg-[#E5F4E4] text-[#2F5233]'
                    : 'border-[#E3D4BA] bg-white text-[#4D3F33] hover:border-[#7A9B76]'
                }`}
              >
                {item.title} ({item.count})
              </Link>
            );
          })}
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#7A6A55]">
              Canonical ACT wiki
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">
              {filteredPages.length} page{filteredPages.length === 1 ? '' : 's'} available
            </h2>
            <p className="mt-2 text-sm text-[#4D3F33]">
              {ecosystemSummary.openDecisionCount} public-system decisions are still marked for
              human confirmation, but the knowledge layer is already strong enough to build on.
            </p>
          </div>
          <Link
            href="/projects"
            className="rounded-full border border-[#4CAF50] px-4 py-2 text-sm font-medium text-[#2F3E2E] transition hover:bg-[#E5F4E4]"
          >
            Back to projects
          </Link>
        </div>

        {filteredPages.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#D7C4A2] bg-white/80 px-6 py-14 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-[#7A6A55]" />
            <h3 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E]">
              No canonical pages matched this view
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#4D3F33]">
              Try a broader search, remove a filter, or go back to the full ACT wiki index. The
              source of truth stays in the markdown wiki even when this view is quiet.
            </p>
            <Link
              href="/wiki"
              className="mt-6 inline-flex rounded-full bg-[#4CAF50] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
            >
              Reset filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredPages.map((page) => (
              <Link
                key={page.path}
                href={`/wiki/${page.stem}`}
                className="group rounded-[28px] border border-[#E3D4BA] bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#7A9B76] hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#F5F1E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A4A3A]">
                    {page.sectionTitle}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#8A7A65]">
                    {page.stem}
                  </span>
                </div>
                <h3 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E] group-hover:text-[#4E6A4F]">
                  {page.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4D3F33]">
                  {page.excerpt || 'Open this page to read the full ACT wiki entry.'}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs text-[#7A6A55]">
                  <span>{page.relativePath}</span>
                  <span className="font-medium text-[#4CAF50]">Open →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
