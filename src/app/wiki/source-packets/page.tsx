import Link from 'next/link';

import LivingSystemStrip from '@/components/LivingSystemStrip';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import {
  getAllProjectSourcePackets,
  getSourcePacketSnapshot,
  type ProjectSourcePacket,
} from '@/lib/empathy-ledger-source-packets';
import { getLivingEcosystemSummary } from '@/lib/living-ecosystem-canon';

const REVIEW_STAGES = ['editorial', 'cultural', 'consent', 'release'] as const;

function getPacketTitle(slug: string, packet: ProjectSourcePacket): string {
  return (
    packet.packet_context?.project_name ||
    packet.narrative?.headline ||
    packet.canonical_entity?.canonical_slug ||
    slug
  );
}

function getPacketSummary(packet: ProjectSourcePacket): string {
  return (
    packet.narrative?.summary ||
    packet.provenance?.notes ||
    'This packet carries a governed public-ready summary from the live story layer into the ACT public hub.'
  );
}

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

function formatStatus(value: string | null | undefined): string {
  return (value || 'unknown').replace(/-/g, ' ');
}

function statusClasses(value: string | null | undefined): string {
  switch (value) {
    case 'approved':
      return 'border-[#9BC39B] bg-[#E8F5E8] text-[#244F2C]';
    case 'pending':
    case 'review':
      return 'border-[#D8C6A7] bg-[#F8EEDC] text-[#6B4F28]';
    case 'not-required':
      return 'border-[#D7DDE8] bg-[#EEF2F7] text-[#3F546B]';
    default:
      return 'border-[#D7CFC2] bg-[#F5F1EA] text-[#5B4C3D]';
  }
}

export default async function SourcePacketsPage() {
  const [packetSnapshot, packets, ecosystemSummary] = await Promise.all([
    Promise.resolve(getSourcePacketSnapshot()),
    getAllProjectSourcePackets(),
    getLivingEcosystemSummary(),
  ]);

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Stories from the field"
        title="Voices, interviews, and field material"
        description="Stories collected with consent through Empathy Ledger and composed into ACT's public pages. Each one carries who it's from, where, and how it can be used."
        actions={[
          { label: 'Browse the ecosystem', href: '/ecosystem' },
          { label: 'How this site stays current', href: '/wiki/source-bridges', variant: 'outline' },
        ]}
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Why this matters
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            The packet is the reusable publishing object. That means another organisation could
            use Empathy Ledger as the governed story, media, consent, and review engine while
            their own site consumes the same packet model for impact, communications, strategy,
            and public proof.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Packet status"
        title="The public hub is now reading from a real machine-to-machine packet layer"
        description="This is no longer a design concept. The ACT site syncs a packet snapshot from Empathy Ledger and composes packet media into flagship project pages. What you see here is the public-facing explanation of that same contract."
        wiki={{
          href: '/wiki',
          label: 'Open canonical wiki',
        }}
        live={{
          sourceLabel: packetSnapshot.sourceUrl
            ? `Source: ${new URL(packetSnapshot.sourceUrl).hostname}`
            : 'Source packet sync',
          siteLabel: packetSnapshot.siteSlug ? `Site: ${packetSnapshot.siteSlug}` : null,
          storyCount: packets.length,
          mediaCount: packets.reduce(
            (total, entry) => total + (entry.packet.media_assets?.length || 0),
            0
          ),
          fetchedAt: packetSnapshot.generatedAt,
          href: packetSnapshot.sourceUrl || 'https://www.empathyledger.com',
        }}
        stats={[
          { label: 'Packets synced', value: packetSnapshot.packetCount },
          { label: 'Open human decisions', value: ecosystemSummary.openDecisionCount },
          { label: 'Public surfaces', value: ecosystemSummary.surfaceCount },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Contract"
          title="What each packet carries"
          description="Packets should stay legible to humans. The point is not to expose raw ingestion internals. It is to show the canonical thing, how trusted it is, and where it goes next."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Canonical entity',
              description:
                'Project type, canonical slug, wiki note path, and public copy owner.',
            },
            {
              title: 'Narrative and media',
              description:
                'Headline, summary, and approved images or clips that can safely travel downstream.',
            },
            {
              title: 'Review gates',
              description:
                'Editorial, cultural, consent, and release states make the packet governable rather than merely convenient.',
            },
            {
              title: 'Output targets',
              description:
                'Each packet states what surface it is destined for and what kind of composition it is meant to support.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[#E1D3BA] bg-white/85 p-6 shadow-sm"
            >
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Live packet set"
          title="Flagship packets currently feeding the hub"
          description="Each card keeps the public-facing shape of a packet: what it is, where it lives, how trusted it is, and what downstream outputs it supports."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {packets.map(({ slug, packet }) => {
            const projectTitle = getPacketTitle(slug, packet);
            const heroImage =
              packet.media_assets?.find((asset) => asset.kind === 'image') ||
              packet.media_assets?.[0] ||
              null;

            return (
              <article
                key={slug}
                className="overflow-hidden rounded-[32px] border border-[#E1D3BA] bg-white/90 shadow-sm"
              >
                {heroImage ? (
                  <div className="relative h-60 overflow-hidden bg-[#11110F]">
                    <img
                      src={heroImage.uri_or_path}
                      alt={heroImage.alt_text || heroImage.caption || projectTitle}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusClasses(
                          packet.status
                        )}`}
                      >
                        {formatStatus(packet.status)}
                      </span>
                      {packet.packet_type ? (
                        <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                          {packet.packet_type}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-6 p-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#7A6A55]">
                      <span>{packet.canonical_entity?.entity_type || 'project'}</span>
                      {packet.canonical_entity?.project_code ? (
                        <span>{packet.canonical_entity.project_code}</span>
                      ) : null}
                      {formatDate(packet.provenance?.generated_at) ? (
                        <span>Updated {formatDate(packet.provenance?.generated_at)}</span>
                      ) : null}
                    </div>
                    <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)]">
                      {projectTitle}
                    </h2>
                    <p className="text-sm leading-7 text-[var(--we-brown)]">{getPacketSummary(packet)}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] bg-[#F7F1E7] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                        Where it lives
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[var(--we-olive)]">
                        {packet.canonical_entity?.canonical_slug || slug}
                      </p>
                      {packet.canonical_entity?.canonical_note_path ? (
                        <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
                          Canonical note: {packet.canonical_entity.canonical_note_path}
                        </p>
                      ) : null}
                      {packet.canonical_entity?.public_copy_owner ? (
                        <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
                          Public copy owner: {packet.canonical_entity.public_copy_owner}
                        </p>
                      ) : null}
                    </div>

                    <div className="rounded-[24px] bg-[#F7F1E7] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                        What happens next
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(packet.outputs || []).map((output) => (
                          <span
                            key={`${output.target_surface}-${output.output_type}`}
                            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusClasses(
                              output.status
                            )}`}
                          >
                            {(output.output_type || 'output').replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[var(--we-brown)]">
                        {packet.outputs?.length || 0} output
                        {(packet.outputs?.length || 0) === 1 ? '' : 's'} currently attached to
                        this packet.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                      Review gates
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {REVIEW_STAGES.map((stage) => {
                        const reviewStage = packet.review?.[stage];

                        return (
                          <span
                            key={stage}
                            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusClasses(
                              reviewStage?.status
                            )}`}
                          >
                            {stage}: {formatStatus(reviewStage?.status)}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-sm leading-6 text-[var(--we-brown)]">
                      {packet.source_refs?.length || 0} source reference
                      {(packet.source_refs?.length || 0) === 1 ? '' : 's'} from{' '}
                      {Array.from(
                        new Set((packet.source_refs || []).map((ref) => ref.source_system))
                      ).join(', ') || 'no source systems yet'}.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/projects/${slug}`}
                      className="rounded-full bg-[#4CAF50] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#3E9845]"
                    >
                      Open project page
                    </Link>
                    <Link
                      href="/wiki/source-bridges"
                      className="rounded-full border border-[#4CAF50] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--we-olive)] transition hover:bg-[#E5F4E4]"
                    >
                      Open bridge layer
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
