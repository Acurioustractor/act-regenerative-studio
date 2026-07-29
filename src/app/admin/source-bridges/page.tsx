import Link from 'next/link';

import LivingSystemStrip from '@/components/LivingSystemStrip';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import { getAllProjectSourcePackets } from '@/lib/empathy-ledger-source-packets';
import { getLivingEcosystemCanon, getLivingEcosystemSummary } from '@/lib/living-ecosystem-canon';
import { getFlagshipProjectPacks } from '@/lib/wiki/flagship-project-packs';

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function SourceBridgesPage() {
  const [packs, packets, canon, ecosystemSummary] = await Promise.all([
    getFlagshipProjectPacks(),
    getAllProjectSourcePackets(),
    getLivingEcosystemCanon(),
    getLivingEcosystemSummary(),
  ]);

  const packetLookup = new Map(packets.map((entry) => [entry.slug, entry.packet]));
  const totalBridgeCount = packs.reduce(
    (total, pack) => total + (pack.sourceBridges?.length || 0),
    0
  );
  const implementationRepoCount = packs.reduce((total, pack) => {
    const primary = pack.implementation.primaryRepo ? 1 : 0;
    const supporting = pack.implementation.supportingRepos?.length || 0;
    return total + primary + supporting;
  }, 0);

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="How this site stays current"
        title="Pages here point back to the work they came from"
        description="Most pages on this site are composed from the ACT wiki, partner platforms, and the live story system. This page lists the trail, so you can see where a claim, a number, or a quote actually originates."
        actions={[
          { label: 'Browse the ecosystem', href: '/ecosystem' },
          { label: 'See stories', href: '/admin/source-packets', variant: 'outline' },
        ]}
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Why this matters
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            ACT works in the open. When the website makes a claim, about a project's outcomes,
            a partnership, or a methodology, you should be able to follow it back to a wiki
            entry, a community story, or an implementation repo. This page is that trail.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Bridge status"
        title="The public hub can now explain how its pages are assembled"
        description="This layer makes the provenance visible: which wiki page anchors the project, which source notes fed the pack, which repo carries the product surface, and which packet is currently feeding the site."
        wiki={{
          href: '/wiki',
          label: 'Open canonical wiki',
        }}
        live={{
          sourceLabel: 'Flagship bridge layer',
          storyCount: packs.length,
          mediaCount: totalBridgeCount,
          href: '/admin/source-packets',
        }}
        stats={[
          { label: 'Flagship projects', value: packs.length },
          { label: 'Bridge notes', value: totalBridgeCount },
          { label: 'Implementation repos', value: implementationRepoCount },
          { label: 'Open human decisions', value: ecosystemSummary.openDecisionCount },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Operating rules"
          title="The ownership and routing rules underneath the bridge layer"
          description="These are the load-bearing rules. Meaning starts in the wiki. Runtime state stays in the ledger. Story packets originate in Empathy Ledger. The public hub composes those layers rather than replacing them."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(canon.ownership_rules).map(([ruleId, rule]) => (
            <div
              key={ruleId}
              className="rounded-[28px] border border-[#E1D3BA] bg-white/85 p-6 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                {ruleId.replace(/_/g, ' ')}
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {rule.owner_id}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">{rule.rule}</p>
              {rule.mirror_targets?.length ? (
                <p className="mt-3 text-sm leading-6 text-[var(--we-brown)]">
                  Mirrors into: {rule.mirror_targets.join(', ')}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Bridge set"
          title="How flagship public pages stay attached to source"
          description="Each flagship project below shows the canonical wiki home, the bridge notes feeding it, the main implementation repo, and the packet state currently attached to the hub."
        />
        <div className="grid gap-6 xl:grid-cols-2">
          {packs.map((pack) => {
            const packet = packetLookup.get(pack.slug) || null;
            const packetStatus = packet?.status || 'unavailable';

            return (
              <article
                key={pack.slug}
                className="rounded-[32px] border border-[#E1D3BA] bg-white/90 p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#7A6A55]">
                  <span>{pack.entityType || 'project'}</span>
                  {pack.canonicalCode ? <span>{pack.canonicalCode}</span> : null}
                  {formatDate(pack.sourcePage.modifiedAt) ? (
                    <span>Updated {formatDate(pack.sourcePage.modifiedAt)}</span>
                  ) : null}
                </div>

                <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)]">
                  {pack.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                  {pack.summary ||
                    'This flagship project is wired into the ACT knowledge system through canonical source notes and downstream public paths.'}
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] bg-[#F7F1E7] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                      Canonical source
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[var(--we-olive)]">
                      {pack.sourcePage.wikiPath}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
                      Primary public path: {pack.downstream.website.projectPath || 'Not set'}
                    </p>
                    {pack.downstream.website.primaryPath ? (
                      <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
                        Dedicated spoke path: {pack.downstream.website.primaryPath}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-[24px] bg-[#F7F1E7] p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                      Runtime bridge
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#D8C6A7] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B4F28]">
                        packet {packetStatus}
                      </span>
                      <span className="rounded-full border border-[#D7DDE8] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3F546B]">
                        {pack.sourceBridges.length} bridge note
                        {pack.sourceBridges.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    {packet?.review?.release?.status ? (
                      <p className="mt-3 text-sm leading-6 text-[var(--we-brown)]">
                        Release gate: {packet.review.release.status}
                      </p>
                    ) : null}
                    {packet?.outputs?.length ? (
                      <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
                        Outputs: {packet.outputs.map((output) => output.output_type).filter(Boolean).join(', ')}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                    Sources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pack.sourceBridges.slice(0, 5).map((bridge) => (
                      <Link
                        key={bridge.stem}
                        href={`/wiki/${bridge.stem}`}
                        className="rounded-full border border-[#D8C6A7] bg-[#FBF7F0] px-3 py-2 text-xs font-semibold text-[var(--we-brown)] transition hover:border-forest hover:bg-forest-soft hover:text-[var(--we-olive)]"
                      >
                        {bridge.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {pack.implementation.primaryRepo ? (
                    <div className="rounded-[24px] border border-[#E7DAC4] bg-[#FFFCF7] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                        Primary repo
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[var(--we-olive)]">
                        {pack.implementation.primaryRepo.name || 'Primary implementation repo'}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
                        {pack.implementation.primaryRepo.role ||
                          'Primary public product surface for this field.'}
                      </p>
                      {pack.implementation.primaryRepo.githubUrl ? (
                        <a
                          href={pack.implementation.primaryRepo.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-forest"
                        >
                          Open repo →
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  {pack.implementation.supportingRepos?.length ? (
                    <div className="rounded-[24px] border border-[#E7DAC4] bg-[#FFFCF7] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                        Supporting repos
                      </p>
                      <p className="mt-3 text-sm leading-6 text-[var(--we-brown)]">
                        {pack.implementation.supportingRepos.length} supporting codebase
                        {pack.implementation.supportingRepos.length === 1 ? '' : 's'} attached to
                        this field.
                      </p>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
