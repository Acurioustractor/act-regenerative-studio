import Link from "next/link";
import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import { getFeaturedWorks } from "@/lib/works/live-featured-works";

import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Artworks",
  description:
    "A working catalogue of pieces ACT is currently making, showing, or carrying with community, each opening into its fuller story.",
  path: "/art/artworks",
});

export default async function ArtworksPage() {
  const works = await getFeaturedWorks();

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Artworks"
        title="An evolving index of studio works"
        description="A working catalogue of pieces that ACT is currently making, showing, or carrying with community. Each card opens into the fuller story, with photos, voice, and video where the work already has them."
        actions={[
          { label: "Enter the works", href: "/art" },
          { label: "Commission work", href: "/art/commissions", variant: "outline" },
        ]}
        gradientClass="from-[#F4E8DD] via-[#E3CBB4] to-[#CFA486]"
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Current works"
          title="What the studio is making right now"
          description="These works are active. Each piece is in motion, in residency, on tour, in commission, or being carried with the community that shaped it."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {works.map((work) => (
            <Link
              key={work.slug}
              href={work.href}
              className="group overflow-hidden rounded-[28px] border border-[#E1D3BA] bg-white/80 transition hover:-translate-y-1 hover:border-forest hover:shadow-[0_20px_50px_rgba(50,42,31,0.12)]"
            >
              {work.previewMedia ? (
                work.previewMedia.kind === "image" ? (
                  <img
                    src={work.previewMedia.thumbnailUrl || work.previewMedia.url}
                    alt={work.previewMedia.alt || work.title}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="relative h-64 overflow-hidden bg-[#171612]">
                    {work.previewMedia.kind === "video" ? (
                      <SiteLoopVideo
                        src={work.previewMedia.url}
                        poster={work.previewMedia.thumbnailUrl || undefined}
                        title={work.previewMedia.alt || work.title}
                        preload="metadata"
                        className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : work.previewMedia.thumbnailUrl ? (
                      <img
                        src={work.previewMedia.thumbnailUrl}
                        alt={work.previewMedia.alt || work.title}
                        className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                      {work.previewMedia.kind}
                    </div>
                  </div>
                )
              ) : (
                <div className="flex h-64 items-end bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
                    Images to come
                  </p>
                </div>
              )}

              <div className="space-y-5 p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--we-warm-brown)]">
                  <span>{work.medium}</span>
                  <span>•</span>
                  <span>{work.place}</span>
                </div>

                <div>
                  <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)]">
                    {work.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                    {work.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs font-medium text-[var(--we-brown-deep)]">
                    {work.collaborators}
                  </span>
                  {work.live.storyCount > 0 ? (
                    <span className="rounded-full bg-forest-soft px-3 py-1 text-xs font-medium text-[var(--we-olive)]">
                      {work.live.storyCount} {work.live.storyCount === 1 ? "story" : "stories"}
                    </span>
                  ) : null}
                  {work.live.mediaCount > 0 ? (
                    <span className="rounded-full bg-forest-soft px-3 py-1 text-xs font-medium text-[var(--we-olive)]">
                      {work.live.mediaCount} photos and films
                    </span>
                  ) : null}
                </div>

                <p className="border-l border-[#D8C7A5] pl-4 text-sm italic text-[#5A4A3A]">
                  {work.quote}
                </p>

                {work.supportingMedia.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {work.supportingMedia.map((item) => (
                      <div
                        key={item.url}
                        className="overflow-hidden rounded-[18px] border border-[var(--we-sand)] bg-[#FDFBF7]"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.alt}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
                          {item.eyebrow ? (
                            <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white">
                              {item.eyebrow}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition group-hover:gap-3">
                  <span>Open work page</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
