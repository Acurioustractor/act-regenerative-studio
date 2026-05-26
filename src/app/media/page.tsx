import Image from 'next/image';
import Link from 'next/link';

import SectionHeading from '@/components/SectionHeading';
import { getShowcaseMedia } from '@/lib/media/get-showcase-media';

import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: 'Media',
  description:
    'Photography, video, and field documentation from across the ACT ecosystem.',
  path: "/media",
});

export default async function MediaPage() {
  const { items, projectNames, stats } = await getShowcaseMedia();

  const heroes = items.filter((m) => m.isHero);
  const featured = items.filter((m) => m.isFeatured && !m.isHero);
  const rest = items.filter((m) => !m.isHero && !m.isFeatured);
  const videos = items.filter((m) => m.kind === 'video');
  const images = items.filter((m) => m.kind === 'image');

  return (
    <div className="space-y-16">
      <section className="site-surface relative overflow-hidden rounded-[38px] bg-gradient-to-br from-[#f7f1e8] via-[#e9ddca] to-[#d5c09f] p-8 md:p-12">
        <div className="absolute -left-10 bottom-8 h-36 w-36 rounded-full bg-[#d9ead7] blur-3xl" />
        <div className="relative max-w-3xl space-y-6">
          <p className="site-eyebrow">Media</p>
          <h1 className="font-[var(--font-display)] text-[2.8rem] font-semibold leading-[0.92] text-[#221b15] md:text-[4.45rem]">
            Field documentation.
          </h1>
          <p className="text-lg leading-8 text-[#56483b] md:text-[1.12rem]">
            Photography, video, and visual documentation from across the ACT
            ecosystem. Every image here is connected to a real project, a real
            place, or a real person, not stock imagery.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-full border border-[#d7c4aa] bg-white/50 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#5f4f41]">
              {stats.imageCount} photos
            </div>
            {stats.videoCount > 0 && (
              <div className="rounded-full border border-[#d7c4aa] bg-white/50 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#5f4f41]">
                {stats.videoCount} videos
              </div>
            )}
            <div className="rounded-full border border-[#d7c4aa] bg-white/50 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#5f4f41]">
              {stats.projectCount} projects
            </div>
          </div>
        </div>
      </section>

      {heroes.length > 0 && (
        <section>
          <SectionHeading
            eyebrow="Hero moments"
            title="The images that anchor the work"
            description="Field-defining photographs from the strongest public projects."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {heroes.map((item) => (
              <Link
                key={item.id}
                href={`/projects/${item.projectSlug}`}
                className="group relative aspect-[16/10] overflow-hidden rounded-[28px] bg-stone-100"
              >
                <Image
                  src={item.thumbnailUrl || item.url}
                  alt={item.alt || item.title || 'Field photo'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {item.caption && (
                    <p className="text-sm leading-6 text-white/90">{item.caption}</p>
                  )}
                  <p className="mt-1 text-xs font-medium text-white/60">
                    {projectNames[item.projectSlug] || item.projectSlug}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section>
          <SectionHeading
            eyebrow="Field footage"
            title="Moving images from the field"
            description="Video documentation from project sites, communities, and field work."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-video overflow-hidden rounded-[24px] bg-black"
              >
                <video
                  src={item.url}
                  poster={item.thumbnailUrl || undefined}
                  controls
                  preload="metadata"
                  className="h-full w-full object-cover"
                  title={item.title || undefined}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pointer-events-none">
                  <p className="text-xs font-medium text-white/80">
                    {item.title || projectNames[item.projectSlug] || item.projectSlug}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeading
          eyebrow="Gallery"
          title="Photography from across the ecosystem"
          description="Field stills, community moments, and project documentation, all connected to real places and real people."
        />
        <div className="mt-8 columns-2 gap-4 space-y-4 lg:columns-3 xl:columns-4">
          {[...featured, ...rest]
            .filter((m) => m.kind === 'image')
            .map((item) => (
              <Link
                key={item.id}
                href={`/projects/${item.projectSlug}`}
                className="group relative block overflow-hidden rounded-[20px] bg-stone-100 break-inside-avoid"
              >
                <Image
                  src={item.thumbnailUrl || item.url}
                  alt={item.alt || item.title || 'Field photo'}
                  width={600}
                  height={400}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  {item.title && (
                    <p className="text-xs font-medium text-white">{item.title}</p>
                  )}
                  <p className="text-[10px] text-white/70">
                    {projectNames[item.projectSlug] || item.projectSlug}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <section className="site-surface rounded-[36px] bg-gradient-to-br from-[#f5efe5] via-[#e6dcc9] to-[#d4c2a2] p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="space-y-4">
            <p className="site-eyebrow">Media sovereignty</p>
            <h2 className="font-[var(--font-display)] text-[2.2rem] font-semibold leading-tight text-[#241c15]">
              Every image here is real, consented, and connected.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--we-brown)]">
              ACT does not use stock photography. All media on this site comes
              from real field work, real communities, and real collaborators.
              Media featuring individuals is published with their consent
              through Empathy Ledger's narrative sovereignty framework.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/empathy-ledger"
              className="site-glow-link rounded-full bg-[#245c43] px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#1c4935]"
            >
              About Empathy Ledger
            </Link>
            <Link
              href="/people"
              className="site-glow-link rounded-full border border-[#245c43] px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f2b21] transition hover:bg-white/75"
            >
              Meet the people
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
