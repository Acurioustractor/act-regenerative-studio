import Image from 'next/image';
import Link from 'next/link';

import SectionHeading from '@/components/SectionHeading';
import {
  getAllArtProjects,
  splitFeaturedAndEmerging,
  type HydratedArtProject,
  type ArtMedium,
} from '@/lib/art/art-portfolio';

export const metadata = {
  title: "Art",
  description:
    "Installations, photography, film, sculpture — art as the final act of listening. Works from across the ACT ecosystem.",
};

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

function ArtProjectBlock({ project, index }: { project: HydratedArtProject; index: number }) {
  const hasMedia = project.media.length > 0;
  const heroUrl = project.heroImage?.url || project.heroImage?.thumbnail_url;
  const isEven = index % 2 === 0;

  return (
    <article className="group">
      <Link href={`/art/${project.slug}`} className="block">
        {hasMedia && heroUrl ? (
          <div className={`grid gap-0 lg:grid-cols-[1fr_1fr] ${isEven ? '' : 'lg:direction-rtl'}`}>
            {/* Image panel */}
            <div className={`relative overflow-hidden ${isEven ? 'lg:rounded-l-[32px]' : 'lg:rounded-r-[32px] lg:order-2'} rounded-t-[32px] lg:rounded-none`}>
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src={heroUrl}
                  alt={project.heroImage?.alt || project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-none" />
              </div>
              {/* Gallery count badge */}
              {project.media.length > 1 && (
                <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
                  {project.media.length} images
                </div>
              )}
            </div>

            {/* Text panel */}
            <div className={`flex flex-col justify-center ${isEven ? 'lg:rounded-r-[32px] lg:pl-12 lg:pr-10' : 'lg:rounded-l-[32px] lg:pl-10 lg:pr-12 lg:order-1'} rounded-b-[32px] lg:rounded-none border border-[var(--we-sand)] lg:border-0 bg-[#FDFBF7] p-8 lg:py-12`}>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.mediums.map((medium) => (
                  <span
                    key={medium}
                    className="rounded-full border border-[#D7C4A2] bg-[#F6F1E7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)]"
                  >
                    {formatMedium(medium)}
                  </span>
                ))}
                {project.status === 'exhibited' && (
                  <span className="rounded-full border border-[#8CB58B] bg-[#E5F4E4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2F5233]">
                    Exhibited
                  </span>
                )}
              </div>

              <h2 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#241c15] md:text-[2.6rem]">
                {project.title}
              </h2>

              <blockquote className="mt-5 border-l-2 border-[#CFA16B] pl-5 text-[0.95rem] italic leading-7 text-[#5A4A3A]">
                {project.quote}
              </blockquote>

              <p className="mt-5 text-[0.92rem] leading-7 text-[var(--we-brown)]">
                {project.description.length > 200
                  ? `${project.description.slice(0, 197).trimEnd()}...`
                  : project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] tracking-wide text-[#9F927F]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                  {project.storytellerCount > 0 && (
                    <span>{project.storytellerCount} storyteller{project.storytellerCount === 1 ? '' : 's'}</span>
                  )}
                  {project.location && <span>{project.location}</span>}
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition-all group-hover:gap-3">
                  Enter the work <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Text-only card for projects without media */
          <div className="rounded-[32px] border border-[var(--we-sand)] bg-[#FDFBF7] p-8 md:p-12 transition-all group-hover:border-[#CFA16B] group-hover:shadow-[0_20px_50px_rgba(50,42,31,0.08)]">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-5">
                {project.mediums.map((medium) => (
                  <span
                    key={medium}
                    className="rounded-full border border-[#D7C4A2] bg-[#F6F1E7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)]"
                  >
                    {formatMedium(medium)}
                  </span>
                ))}
              </div>

              <h2 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#241c15] md:text-[2.6rem]">
                {project.title}
              </h2>

              <blockquote className="mt-5 border-l-2 border-[#CFA16B] pl-5 text-[0.95rem] italic leading-7 text-[#5A4A3A]">
                {project.quote}
              </blockquote>

              <p className="mt-5 text-[0.92rem] leading-7 text-[var(--we-brown)]">
                {project.description}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition-all group-hover:gap-3">
                Enter the work <span aria-hidden="true">&rarr;</span>
              </div>
            </div>
          </div>
        )}
      </Link>

      {/* Supporting gallery strip for projects with multiple images */}
      {project.media.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
          {project.media
            .filter((item) => item.id !== project.heroImage?.id)
            .slice(0, 6)
            .map((item) => (
              <div
                key={item.id}
                className="relative aspect-square overflow-hidden rounded-[16px] border border-[var(--we-sand)]"
              >
                <Image
                  src={item.thumbnail_url || item.url}
                  alt={item.alt || project.title}
                  fill
                  sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover"
                />
              </div>
            ))}
        </div>
      )}
    </article>
  );
}

function EmergingWorkCard({ project }: { project: HydratedArtProject }) {
  return (
    <Link
      href={`/art/${project.slug}`}
      className="group rounded-[24px] border border-dashed border-[#D6C19A] bg-[#f8f0e3] p-6 transition-all hover:border-solid hover:border-[#CFA16B] hover:shadow-[0_16px_40px_rgba(50,42,31,0.08)]"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {project.mediums.map((medium) => (
          <span
            key={medium}
            className="rounded-full border border-[#D7C4A2] bg-white/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--we-warm-brown)]"
          >
            {formatMedium(medium)}
          </span>
        ))}
        <span className="rounded-full border border-[#D7C4A2] bg-white/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B6914]">
          {project.status === 'ideation' ? 'In development' : 'Concept'}
        </span>
      </div>

      <h3 className="font-[var(--font-display)] text-xl font-semibold text-[#241c15]">
        {project.title}
      </h3>

      <blockquote className="mt-3 text-sm italic leading-6 text-[#5A4A3A]">
        &ldquo;{project.quote}&rdquo;
      </blockquote>

      <p className="mt-3 text-sm leading-6 text-[var(--we-brown)]">
        {project.description.length > 140
          ? `${project.description.slice(0, 137).trimEnd()}...`
          : project.description}
      </p>

      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] opacity-0 transition-opacity group-hover:opacity-100">
        Read more <span aria-hidden="true">&rarr;</span>
      </div>
    </Link>
  );
}

export default async function ArtPage() {
  const allProjects = await getAllArtProjects();
  const { featured, emerging } = splitFeaturedAndEmerging(allProjects);

  const totalPhotos = allProjects.reduce((sum, p) => sum + p.photoCount, 0);
  const totalStorytellers = allProjects.reduce(
    (sum, p) => sum + p.storytellerCount,
    0
  );

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[36px] border border-[#2F2A25] bg-[#0D0C0A] px-8 py-14 text-[#F3EBDD] md:px-14 md:py-20">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#CFA16B]/8 blur-[100px]" />
        <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-[#7A9B76]/8 blur-[80px]" />
        <div className="relative max-w-4xl space-y-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            Art portfolio
          </p>
          <h1 className="font-[var(--font-display)] text-[2.4rem] font-semibold leading-[0.95] text-white md:text-[4.2rem]">
            If art isn&apos;t being made and stories aren&apos;t being told, the whole system dies.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#D7C8B2] md:text-xl">
            Installation, photography, film, sculpture, performance &mdash; art as the final act of listening.
          </p>
          <p className="max-w-2xl text-[0.92rem] leading-7 text-[#9F927F]">
            Every project in the ACT ecosystem follows the same path: Listen, then get curious, then act, then make art. These are the works that emerge at the end of that journey &mdash; where research, community trust, and lived experience become something you can see, hear, enter, or hold.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <div>
              <p className="text-2xl font-semibold text-white">{allProjects.length}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#BDAE98]">
                Art projects
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{totalPhotos.toLocaleString()}+</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#BDAE98]">
                Photos documented
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{totalStorytellers}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#BDAE98]">
                Storytellers
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{featured.length}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#BDAE98]">
                Works with documentation
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="#featured-works"
              className="rounded-full bg-[#CFA16B] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#11110F] transition hover:bg-[#E0B680]"
            >
              View the works
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#CFA16B]/40 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EBDD] transition hover:border-[#CFA16B] hover:bg-[#1B1A16]"
            >
              Commission a work
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by slice */}
      <section className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
          Browse by slice
        </p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {[
            { label: 'Artists', href: '/art/artists', sub: 'People behind the work' },
            { label: 'Artworks', href: '/art/artworks', sub: 'The full catalogue' },
            { label: 'Commissions', href: '/art/commissions', sub: 'Work with the studio' },
            { label: 'Exhibitions', href: '/art/exhibitions', sub: 'Where the work has shown' },
            { label: 'Residencies', href: '/art/residencies', sub: 'Come make something with us' },
          ].map((slice) => (
            <Link
              key={slice.href}
              href={slice.href}
              className="group rounded-[18px] border border-[var(--we-sand)] bg-white/80 px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#CFA16B] hover:shadow-[0_8px_24px_rgba(50,42,31,0.08)]"
            >
              <p className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)]">
                {slice.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--we-brown)]">{slice.sub}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#CFA16B] transition group-hover:gap-2">
                Open <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Works */}
      <section id="featured-works" className="space-y-16">
        <SectionHeading
          eyebrow="Featured works"
          title="Installations, archives, and public experiments"
          description="Each work is a project in the ACT ecosystem. The documentation here comes from community-consented sources through Empathy Ledger. These are not portfolio pieces. They are ongoing relationships with people and places."
        />
        {featured.map((project, index) => (
          <ArtProjectBlock key={project.slug} project={project} index={index} />
        ))}
      </section>

      {/* Method strip */}
      <section className="rounded-[36px] bg-gradient-to-br from-[#f5efe5] via-[#e6dcc9] to-[#d4c2a2] p-8 md:p-12">
        <div className="max-w-4xl space-y-6">
          <p className="site-eyebrow">The method behind the art</p>
          <h2 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#241c15] md:text-[2.6rem]">
            Listen &middot; Curiosity &middot; Action &middot; Art
          </h2>
          <p className="text-[0.97rem] leading-8 text-[var(--we-brown)]">
            Art is not where ACT starts. It is where the process arrives after listening has earned trust, curiosity has surfaced what matters, and action has built something real. The art carries the story of what was learned, heard, and tested &mdash; not as illustration, but as a form that can move through public life on its own terms.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {[
              { stage: 'Listen', description: 'Go to the place. Be with the people. Earn the right to hear.' },
              { stage: 'Curiosity', description: 'Ask the harder questions. Follow what matters, not what is funded.' },
              { stage: 'Action', description: 'Build the tool, the service, the infrastructure. Test it in the field.' },
              { stage: 'Art', description: 'Make the work that carries all of it into public consciousness.' },
            ].map((item) => (
              <div
                key={item.stage}
                className="rounded-[20px] border border-[var(--we-sand)] bg-white/60 p-5"
              >
                <p className="font-[var(--font-display)] text-lg font-semibold text-[#245c43]">
                  {item.stage}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--we-brown)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <Link
              href="/method"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#245c43] transition hover:gap-3"
            >
              Read about the full method <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Emerging works */}
      {emerging.length > 0 && (
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Emerging and in-development"
            title="Works still forming"
            description="These projects are in early stages: listening, researching, prototyping. They do not have full documentation yet, but the ideas are alive and moving."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {emerging.map((project) => (
              <EmergingWorkCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="rounded-[32px] border border-[#2F2A25] bg-[#11110F] px-8 py-10 text-[#F3EBDD] md:px-12 md:py-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
              Work with us
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold md:text-4xl">
              The studio is open.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#D7C8B2]">
              If you have a story that needs a form, a place that needs an
              intervention, or an institution that needs to feel something
              differently &mdash; the studio takes commissions, residencies, and
              collaborations.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Link
              href="/contact"
              className="rounded-full bg-[#CFA16B] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#11110F] transition hover:bg-[#E0B680]"
            >
              Get in touch
            </Link>
            <Link
              href="/art/residencies"
              className="rounded-full border border-[#CFA16B]/40 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EBDD] transition hover:border-[#CFA16B]"
            >
              Explore residencies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
