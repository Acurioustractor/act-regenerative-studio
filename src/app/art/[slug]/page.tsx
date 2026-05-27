import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { STORYTELLERS_PUBLIC } from '@/lib/launch-flags';
import { SiteLoopVideo } from '@/components/media/SiteLoopVideo';
import {
  getAllArtSlugs,
  getArtProject,
  getAllArtProjects,
  type HydratedArtProject,
  type ArtMedium,
} from '@/lib/art/art-portfolio';
import { projects as actProjects } from '@/data/projects';
import { EmpathyLedgerConnections } from '@/components/projects/EmpathyLedgerConnections';

export function generateStaticParams() {
  return getAllArtSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getArtProject(slug);
  if (!project) return { title: 'Work not found' };

  return {
    title: `${project.title} | ACT Art Portfolio`,
    description: project.quote,
  };
}

function formatMedium(medium: ArtMedium): string {
  const labels: Record<ArtMedium, string> = {
    photography: 'Photography',
    installation: 'Installation',
    interactive: 'Interactive',
    performance: 'Performance',
    sculpture: 'Sculpture',
    painting: 'Painting',
    exhibition: 'Exhibition',
    residency: 'Residency',
    making: 'Making',
    film: 'Film',
  };
  return labels[medium] || medium;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 border-b border-[var(--we-sand)] py-3 last:border-0">
      <span className="w-28 shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--we-warm-brown)]">
        {label}
      </span>
      <span className="text-sm leading-6 text-[var(--we-brown)]">{value}</span>
    </div>
  );
}

function RelatedWorkCard({ project }: { project: HydratedArtProject }) {
  const heroUrl =
    project.heroImage?.thumbnail_url || project.heroImage?.url;

  return (
    <Link
      href={`/art/${project.slug}`}
      className="group overflow-hidden rounded-[24px] border border-[var(--we-sand)] bg-[#FDFBF7] transition-all hover:border-[#CFA16B] hover:shadow-[0_16px_40px_rgba(50,42,31,0.08)]"
    >
      {heroUrl ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={heroUrl}
            alt={project.heroImage?.alt || project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-[var(--font-display)] text-xl font-semibold text-white">
              {project.title}
            </h3>
          </div>
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-end bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-5">
          <h3 className="font-[var(--font-display)] text-xl font-semibold text-[#241c15]">
            {project.title}
          </h3>
        </div>
      )}
      <div className="p-5">
        <p className="text-sm italic leading-6 text-[#5A4A3A] line-clamp-2">
          "{project.quote}"
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.mediums.map((medium) => (
            <span
              key={medium}
              className="rounded-full border border-[#D7C4A2] bg-[#F6F1E7] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--we-warm-brown)]"
            >
              {formatMedium(medium)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default async function ArtWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getArtProject(slug);
  if (!project) notFound();

  const allProjects = await getAllArtProjects();
  const relatedProjects = allProjects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const heroUrl = project.heroImage?.url;
  const galleryItems = project.media.filter(
    (item) => item.id !== project.heroImage?.id && item.kind === 'image'
  );

  // Resolve EL mapping. Priority:
  // 1. Direct empathyLedger field on the art piece
  // 2. ACT project whose slug matches the art slug
  // 3. ACT project whose slug or title matches connectedProject (case-insensitive)
  const connected = project.connectedProject?.toLowerCase() || '';
  const linkedAct =
    actProjects.find((p) => p.slug === project.slug) ||
    actProjects.find(
      (p) =>
        connected &&
        (p.slug === connected || p.title.toLowerCase() === connected)
    ) ||
    null;
  const elMapping = project.empathyLedger || linkedAct?.empathyLedger;
  const elOwnerSlug = project.empathyLedger ? project.slug : linkedAct?.slug;

  return (
    <div className="space-y-16">
      {elMapping && elOwnerSlug && (
        <EmpathyLedgerConnections
          projectSlug={elOwnerSlug}
          projectTitle={project.title}
          orgSlug={elMapping.orgSlug}
          elProjectSlugs={elMapping.elProjectSlugs}
          notes={elMapping.notes}
        />
      )}
      {/* Hero */}
      {heroUrl || project.heroVideo ? (
        <section className="relative overflow-hidden rounded-[36px]">
          <div className="relative aspect-[21/9] min-h-[340px] md:min-h-[480px]">
            {heroUrl ? (
              <Image
                src={heroUrl}
                alt={project.heroImage?.alt || project.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : project.heroVideo ? (
              <SiteLoopVideo
                src={project.heroVideo.url}
                poster={project.heroVideo.posterUrl}
                title={project.heroVideo.alt || project.title}
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.connectedProject && project.connectedProjectHref && (
                <Link
                  href={project.connectedProjectHref}
                  className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:bg-white/25"
                >
                  Part of {project.connectedProject} &rarr;
                </Link>
              )}
              {project.mediums.map((medium) => (
                <span
                  key={medium}
                  className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm"
                >
                  {formatMedium(medium)}
                </span>
              ))}
              {project.location && (
                <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                  {project.location}
                </span>
              )}
            </div>
            <h1 className="font-[var(--font-display)] text-[2.4rem] font-semibold leading-[0.95] text-white md:text-[4rem]">
              {project.title}
            </h1>
          </div>
        </section>
      ) : (
        <section className="rounded-[36px] bg-gradient-to-br from-[#f5efe5] via-[#e6dcc9] to-[#d4c2a2] p-8 md:p-14">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.connectedProject && project.connectedProjectHref && (
              <Link
                href={project.connectedProjectHref}
                className="rounded-full border border-[#245c43] bg-[#245c43] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#1d4b37]"
              >
                Part of {project.connectedProject} &rarr;
              </Link>
            )}
            {project.mediums.map((medium) => (
              <span
                key={medium}
                className="rounded-full border border-[#D7C4A2] bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)]"
              >
                {formatMedium(medium)}
              </span>
            ))}
          </div>
          <h1 className="font-[var(--font-display)] text-[2.4rem] font-semibold leading-[0.95] text-[#241c15] md:text-[4rem]">
            {project.title}
          </h1>
          {project.location && (
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[var(--we-warm-brown)]">
              {project.location}
            </p>
          )}
        </section>
      )}

      {/* Quote + Philosophy */}
      <section className="mx-auto max-w-3xl space-y-8">
        <blockquote className="border-l-2 border-[#CFA16B] pl-6 text-xl italic leading-8 text-[var(--we-brown)] md:text-2xl md:leading-10">
          "{project.quote}"
        </blockquote>

        <p className="text-[1.05rem] leading-8 text-[var(--we-brown)]">
          {project.description}
        </p>

        {project.philosophy && (
          <div className="rounded-[24px] border border-[var(--we-sand)] bg-[#FDFBF7] p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)] mb-3">
              Philosophy
            </p>
            <p className="text-[0.95rem] leading-7 text-[var(--we-brown)]">
              {project.philosophy}
            </p>
          </div>
        )}
      </section>

      {/* Gallery */}
      {galleryItems.length > 0 && (
        <section className="space-y-6">
          <div className="mx-auto max-w-3xl">
            <p className="site-eyebrow">Documentation</p>
            <h2 className="mt-3 font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#241c15]">
              From the field
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5b4d3f]">
              {project.media.length} images from community-consented documentation through Empathy Ledger.
            </p>
          </div>

          {/* Editorial masonry-style grid */}
          <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
            {galleryItems.map((item, index) => {
              // Vary aspect ratios for editorial feel
              const aspectClass =
                index % 5 === 0
                  ? 'aspect-[3/4]'
                  : index % 5 === 1
                    ? 'aspect-[4/3]'
                    : index % 5 === 2
                      ? 'aspect-square'
                      : index % 5 === 3
                        ? 'aspect-[3/2]'
                        : 'aspect-[2/3]';

              return (
                <div
                  key={item.id}
                  className="mb-3 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--we-sand)]"
                >
                  <div className={`relative ${aspectClass}`}>
                    <Image
                      src={item.thumbnail_url || item.url}
                      alt={item.alt || `${project.title} documentation ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  {item.caption && (
                    <div className="bg-[#FDFBF7] px-4 py-3">
                      <p className="text-xs leading-5 text-[#5A4A3A]">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Details */}
      <section className="mx-auto max-w-3xl">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
          <div className="rounded-[24px] border border-[var(--we-sand)] bg-[#FDFBF7] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)] mb-4">
              Details
            </p>
            <DetailRow
              label="Medium"
              value={project.mediums.map(formatMedium).join(', ')}
            />
            <DetailRow label="Location" value={project.location} />
            <DetailRow label="Year" value={project.year} />
            <DetailRow
              label="Status"
              value={
                project.status === 'exhibited'
                  ? 'Exhibited'
                  : project.status === 'active'
                    ? 'Active'
                    : project.status === 'ideation'
                      ? 'In development'
                      : 'Concept'
              }
            />
            {project.lcaaStages && project.lcaaStages.length > 0 && (
              <DetailRow
                label="Method stage"
                value={project.lcaaStages.join(', ')}
              />
            )}
            <DetailRow
              label="Photos"
              value={
                project.photoCount > 0
                  ? `${project.photoCount} documented`
                  : undefined
              }
            />
            <DetailRow
              label="Storytellers"
              value={
                project.storytellerCount > 0
                  ? `${project.storytellerCount} contributor${project.storytellerCount === 1 ? '' : 's'}`
                  : undefined
              }
            />
          </div>

          <div className="space-y-6">
            {project.tags.length > 0 && (
              <div className="rounded-[24px] border border-[var(--we-sand)] bg-[#FDFBF7] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)] mb-4">
                  Art tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#D7C4A2] bg-[#F6F1E7] px-3 py-1.5 text-xs text-[#5A4A3A]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.connectedProject && (
              <div className="rounded-[24px] border border-[var(--we-sand)] bg-[#FDFBF7] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)] mb-3">
                  Connected to
                </p>
                <Link
                  href={project.connectedProjectHref || '/projects'}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#245c43] transition hover:gap-3"
                >
                  {project.connectedProject}{' '}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )}

            {/* Storytellers */}
            {/* Launch hold (2026-05-27): hidden while /storytellers is held. See @/lib/launch-flags. */}
            {STORYTELLERS_PUBLIC && project.storytellers.length > 0 && (
              <div className="rounded-[24px] border border-[var(--we-sand)] bg-[#FDFBF7] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)] mb-4">
                  Storytellers
                </p>
                <div className="space-y-3">
                  {project.storytellers.slice(0, 5).map((storyteller) => (
                    <div key={storyteller.storyteller_id} className="flex items-center gap-3">
                      {storyteller.profile_image_url ? (
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={storyteller.profile_image_url}
                            alt={storyteller.display_name || 'Storyteller'}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E5F4E4] text-xs font-semibold text-[#2F5233]">
                          {(storyteller.display_name || '?')[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[var(--we-olive)]">
                          {storyteller.display_name || storyteller.full_name || 'Anonymous'}
                        </p>
                        {storyteller.custom_tagline && (
                          <p className="text-xs text-[var(--we-warm-brown)]">
                            {storyteller.custom_tagline}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Impact */}
      {project.impact && (
        <section className="mx-auto max-w-3xl">
          <div className="rounded-[24px] border border-[#244c39] bg-[#15261d] p-6 md:p-8 text-[#f5ecde]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#CFA16B] mb-3">
              What it did
            </p>
            <p className="text-[0.95rem] leading-7 text-[#d7c8b2]">
              {project.impact}
            </p>
          </div>
        </section>
      )}

      {/* Related works */}
      {relatedProjects.length > 0 && (
        <section className="space-y-8">
          <div className="mx-auto max-w-3xl">
            <p className="site-eyebrow">Other works</p>
            <h2 className="mt-3 font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#241c15]">
              Connected work in the portfolio
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {relatedProjects.map((related) => (
              <RelatedWorkCard key={related.slug} project={related} />
            ))}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="flex justify-center">
        <Link
          href="/art"
          className="rounded-full border border-[var(--we-sand)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--we-olive)] transition hover:border-[#245c43] hover:bg-[#E5F4E4]"
        >
          Back to art portfolio
        </Link>
      </div>
    </div>
  );
}
