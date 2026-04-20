import Link from 'next/link';

import { WikiSearch } from '@/components/wiki/WikiSearch';
import { getSourcePacketSnapshot } from '@/lib/empathy-ledger-source-packets';
import { getLivingEcosystemSummary } from '@/lib/living-ecosystem-canon';
import { getFlagshipProjectPacks } from '@/lib/wiki/flagship-project-packs';
import {
  getCanonicalWikiSections,
  listAllWikiPages,
} from '@/lib/wiki/canonical-site-wiki';

export default async function WikiHomepage() {
  const [allPages, packetSnapshot, ecosystemSummary, flagshipPacks] = await Promise.all([
    listAllWikiPages(),
    Promise.resolve(getSourcePacketSnapshot()),
    getLivingEcosystemSummary(),
    getFlagshipProjectPacks(),
  ]);

  const sections = getCanonicalWikiSections(
    allPages.map((page) => ({
      // getCanonicalWikiSections only reads sectionId/sectionTitle, but the
      // type expects the full record shape — fill with safe empties.
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
  const bridgeCount = flagshipPacks.reduce(
    (total, pack) => total + (pack.sourceBridges?.length || 0),
    0
  );

  const sourceNotConfigured = allPages.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F1E7] via-[#F5F1E8] to-white">
      <section className="border-b border-[var(--we-sand)] bg-[var(--we-olive)] text-white">
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
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-2 pt-10">
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
