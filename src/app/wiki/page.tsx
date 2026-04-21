import Link from 'next/link';

import { WikiSearch } from '@/components/wiki/WikiSearch';
import {
  canDisplayStoryteller,
  getAllStorytellers,
} from '@/lib/empathy-ledger-storytellers';
import { getLivingEcosystemSummary } from '@/lib/living-ecosystem-canon';
import {
  getCanonicalWikiSections,
  listAllWikiPages,
} from '@/lib/wiki/canonical-site-wiki';

export const metadata = {
  title: "Wiki",
  description:
    "Methods, decisions, and the people behind every project, kept in public so you can check our thinking.",
};

export default async function WikiHomepage() {
  const [allPages, ecosystemSummary] = await Promise.all([
    listAllWikiPages(),
    getLivingEcosystemSummary(),
  ]);
  const storytellerCount = getAllStorytellers().filter(canDisplayStoryteller).length;

  const sections = getCanonicalWikiSections(
    allPages.map((page) => ({
      // getCanonicalWikiSections only reads sectionId/sectionTitle, but the
      // type expects the full record shape, fill with safe empties.
      title: page.title,
      excerpt: page.excerpt,
      content: '',
      sectionId: page.sectionId,
      sectionTitle: page.sectionTitle,
      stem: page.stem,
      path: page.path,
      relativePath: page.relativePath,
      modifiedAt: page.modifiedAt,
    }))
  );

  const sourceNotConfigured = allPages.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F1E7] via-[#F5F1E8] to-white">
      <section className="border-b border-[var(--we-sand)] bg-[var(--we-olive)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D7E7D4]">
              Wiki
            </p>
            <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold md:text-6xl">
              How the work actually gets done
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#E8E1D0] md:text-lg">
              Methods, decisions, and the people behind every project, kept
              in public so you can check our thinking. Nothing here is
              polished for you. It&rsquo;s what we use ourselves.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                {allPages.length} pages
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                {sections.length} sections
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-2 pt-10">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'The ecosystem at a glance',
              description:
                'Six public works and the relationships between them. A single page to see how the whole thing holds together.',
              href: '/ecosystem',
              cta: 'Open the ecosystem',
              stat: `${ecosystemSummary.surfaceCount} public works`,
            },
            {
              title: 'Voices from the field',
              description:
                'The people whose stories, craft, and community work shape every project, carried with consent.',
              href: '/storytellers',
              cta: 'Meet the storytellers',
              stat: `${storytellerCount} storytellers`,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[28px] border border-[var(--we-sand)] bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#7A9B76] hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#7A6A55]">{item.stat}</p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">{item.description}</p>
              <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[#4CAF50]">
                {item.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-end">
          <Link
            href="/projects"
            className="rounded-full border border-[#4CAF50] px-4 py-2 text-sm font-medium text-[var(--we-olive)] transition hover:bg-[#E5F4E4]"
          >
            Back to projects
          </Link>
        </div>

        {sourceNotConfigured ? (
          <div className="rounded-[28px] border border-dashed border-[#D7C4A2] bg-white/80 px-6 py-14 text-center">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              Wiki source not configured
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--we-brown)]">
              No canonical wiki pages are available in this environment. Configure Supabase, the
              live canonical wiki filesystem, or regenerate the snapshot to populate this index.
            </p>
          </div>
        ) : (
          <WikiSearch pages={allPages} sections={sections} />
        )}
      </section>
    </div>
  );
}
