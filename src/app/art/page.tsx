import Image from "next/image";
import Link from "next/link";

import SectionHeading from "@/components/SectionHeading";
import { SiteLoopVideo } from "@/components/media/SiteLoopVideo";
import {
  getAllArtProjects,
  splitFeaturedAndEmerging,
  type HydratedArtProject,
  type ArtMedium,
} from "@/lib/art/art-portfolio";
import { cleanPublicBrandText } from "@/lib/brand/public-copy";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Art",
  description:
    "Installations, photography, film, sculpture, art as the final act of listening. Works from across the ACT ecosystem.",
  path: "/art",
});

function formatMedium(medium: ArtMedium): string {
  const labels: Record<ArtMedium, string> = {
    photography: "Photography",
    installation: "Installation",
    interactive: "Interactive",
    performance: "Performance",
    sculpture: "Sculpture",
    painting: "Painting",
    exhibition: "Exhibition",
    residency: "Residency",
    making: "Making",
    film: "Film",
  };
  return labels[medium] || medium;
}

function ArtProjectBlock({
  project,
  index,
}: {
  project: HydratedArtProject;
  index: number;
}) {
  const hasMedia = project.media.length > 0;
  const heroUrl = project.heroImage?.url || project.heroImage?.thumbnail_url;
  const isEven = index % 2 === 0;
  const quote = cleanPublicBrandText(project.quote) || project.quote;
  const description =
    cleanPublicBrandText(project.description) || project.description;
  const location = cleanPublicBrandText(project.location) || project.location;

  return (
    <article className="group">
      <Link href={`/art/${project.slug}`} className="block">
        {(hasMedia && heroUrl) || project.heroVideo ? (
          <div
            className={`relative grid items-center gap-0 lg:grid-cols-[1.15fr_.85fr] ${isEven ? "" : "lg:grid-cols-[.85fr_1.15fr]"}`}
          >
            {/* Media panel (image, or looping video when the work is video-led) */}
            <div
              className={`relative overflow-hidden ${isEven ? "" : "lg:order-2"}`}
            >
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
                {heroUrl ? (
                  <Image
                    src={heroUrl}
                    alt={project.heroImage?.alt || project.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : project.heroVideo ? (
                  <SiteLoopVideo
                    src={project.heroVideo.url}
                    poster={project.heroVideo.posterUrl}
                    title={project.heroVideo.alt || project.title}
                    className={
                      project.heroVideo.fit === "contain"
                        ? "absolute inset-0 h-full w-full bg-black object-contain"
                        : "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    }
                  />
                ) : null}
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
            <div
              className={`relative z-10 flex flex-col justify-center border border-[var(--site-line)] bg-[var(--site-bg)] p-8 lg:py-12 ${isEven ? "lg:-ml-12 lg:pl-14" : "lg:order-1 lg:-mr-12 lg:pr-14"}`}
            >
              <div className="flex flex-wrap gap-2 mb-5">
                {project.mediums.map((medium) => (
                  <span
                    key={medium}
                    className="border-b border-[var(--site-clay)] pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--site-muted)]"
                  >
                    {formatMedium(medium)}
                  </span>
                ))}
                {project.status === "exhibited" && (
                  <span className="border-b border-[var(--site-green)] pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--site-green)]">
                    Exhibited
                  </span>
                )}
              </div>

              <h2 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#241c15] md:text-[2.6rem]">
                {project.title}
              </h2>

              <blockquote className="mt-5 border-l-2 border-[#CFA16B] pl-5 text-[0.95rem] italic leading-7 text-[#5A4A3A]">
                {quote}
              </blockquote>

              <p className="mt-5 text-[0.92rem] leading-7 text-[var(--we-brown)]">
                {description.length > 200
                  ? `${description.slice(0, 197).trimEnd()}...`
                  : description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] tracking-wide text-muted-deep"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--we-warm-brown)]">
                  {project.storytellerCount > 0 && (
                    <span>
                      {project.storytellerCount} storyteller
                      {project.storytellerCount === 1 ? "" : "s"}
                    </span>
                  )}
                  {location && <span>{location}</span>}
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition-all group-hover:gap-3">
                  View work <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Text-only card for projects without media */
          <div className="border-l-2 border-[var(--site-clay)] bg-[var(--site-surface)] p-8 md:p-12 transition-colors group-hover:bg-[var(--site-green-soft)]">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-5">
                {project.mediums.map((medium) => (
                  <span
                    key={medium}
                    className="border-b border-[#D7C4A2] pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--we-warm-brown)]"
                  >
                    {formatMedium(medium)}
                  </span>
                ))}
              </div>

              <h2 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#241c15] md:text-[2.6rem]">
                {project.title}
              </h2>

              <blockquote className="mt-5 border-l-2 border-[#CFA16B] pl-5 text-[0.95rem] italic leading-7 text-[#5A4A3A]">
                {quote}
              </blockquote>

              <p className="mt-5 text-[0.92rem] leading-7 text-[var(--we-brown)]">
                {description}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition-all group-hover:gap-3">
                View work <span aria-hidden="true">&rarr;</span>
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
                className="relative aspect-square overflow-hidden border border-[var(--site-line)]"
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
  const quote = cleanPublicBrandText(project.quote) || project.quote;
  const description =
    cleanPublicBrandText(project.description) || project.description;

  return (
    <Link
      href={`/art/${project.slug}`}
      className="group border-t border-[var(--site-line)] p-6 transition-colors hover:bg-[var(--site-green-soft)]"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {project.mediums.map((medium) => (
          <span
            key={medium}
            className="border-b border-[#D7C4A2] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--we-warm-brown)]"
          >
            {formatMedium(medium)}
          </span>
        ))}
        <span className="border-b border-[var(--site-gold)] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8B6914]">
          {project.status === "ideation" ? "In development" : "Concept"}
        </span>
      </div>

      <h3 className="font-[var(--font-display)] text-xl font-semibold text-[#241c15]">
        {project.title}
      </h3>

      <blockquote className="mt-3 text-sm italic leading-6 text-[#5A4A3A]">
        "{quote}"
      </blockquote>

      <p className="mt-3 text-sm leading-6 text-[var(--we-brown)]">
        {description.length > 140
          ? `${description.slice(0, 137).trimEnd()}...`
          : description}
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

  const heroArtwork = featured.find(
    (project) => project.heroImage?.url || project.heroImage?.thumbnail_url,
  );
  const heroImageUrl =
    heroArtwork?.heroImage?.url || heroArtwork?.heroImage?.thumbnail_url;

  return (
    <div className="!mx-0 !max-w-none !px-0 !pt-0">
      {/* Hero */}
      <section className="relative grid min-h-[100svh] overflow-hidden bg-[var(--site-bg)] pt-24 text-[var(--site-ink)] lg:grid-cols-[.9fr_1.1fr] lg:pt-0">
        <div className="flex flex-col justify-center px-8 py-20 lg:px-[8vw]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-clay-text">
            Art belongs in the method
          </p>
          <h1 className="mt-7 max-w-[8ch] font-[var(--font-display)] text-[clamp(4rem,8vw,8rem)] font-light leading-[.9] tracking-[-0.045em]">
            Come into the art.
          </h1>
          <p className="mt-10 max-w-xl font-[var(--font-body)] text-[clamp(1.25rem,2vw,1.8rem)] leading-[1.45] text-[var(--site-green)]">
            Find yourself in the work. Then follow it into the field.
          </p>
          <div className="mt-12 flex flex-wrap gap-8 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.18em]">
            <Link
              href="#featured-works"
              className="border-b border-[var(--site-ink)] pb-2"
            >
              View the works ↓
            </Link>
            <Link
              href="/contact"
              className="border-b border-[var(--site-clay)] pb-2 text-clay-text"
            >
              Commission a work →
            </Link>
          </div>
        </div>
        <div className="relative min-h-[65vh] overflow-hidden bg-[var(--site-dark)]">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={
                heroArtwork?.heroImage?.alt ||
                `${heroArtwork?.title || "ACT art"} documentation`
              }
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute bottom-8 left-0 bg-[var(--site-bg)] px-5 py-4 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em]">
            {heroArtwork?.title || "ACT Art"}
          </div>
        </div>
      </section>

      {/* Browse by slice */}
      <section className="mx-auto max-w-[1200px] px-8 py-20 md:py-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
          Browse by slice
        </p>
        <div className="mt-8 grid gap-px bg-[var(--site-line)] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {[
            {
              label: "Artists",
              href: "/art/artists",
              sub: "People behind the work",
            },
            {
              label: "Artworks",
              href: "/art/artworks",
              sub: "The full catalogue",
            },
            {
              label: "Commissions",
              href: "/art/commissions",
              sub: "Work with the studio",
            },
            {
              label: "Exhibitions",
              href: "/art/exhibitions",
              sub: "Where the work has shown",
            },
            {
              label: "Residencies",
              href: "/art/residencies",
              sub: "Come make something with us",
            },
          ].map((slice) => (
            <Link
              key={slice.href}
              href={slice.href}
              className="group bg-[var(--site-bg)] px-5 py-6 transition-colors hover:bg-[var(--site-green-soft)]"
            >
              <p className="font-[var(--font-display)] text-lg font-semibold text-[var(--we-olive)]">
                {slice.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--we-brown)]">
                {slice.sub}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-clay-text transition group-hover:gap-2">
                Open <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Works */}
      <section
        id="featured-works"
        className="mx-auto max-w-[1200px] space-y-24 px-8 py-24 md:py-36"
      >
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
      <section className="border-y border-[var(--site-line)] bg-[var(--site-surface)] px-8 py-24 md:py-32">
        <div className="mx-auto max-w-4xl space-y-6">
          <p className="site-eyebrow">The method behind the art</p>
          <h2 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-[#241c15] md:text-[2.6rem]">
            Listen &middot; Curiosity &middot; Action &middot; Art
          </h2>
          <p className="text-[0.97rem] leading-8 text-[var(--we-brown)]">
            Art is not where ACT starts. It is where the process arrives after
            listening has earned trust, curiosity has surfaced what matters, and
            action has built something real. The art carries the story of what
            was learned, heard, and tested, not as illustration, but as a form
            that can move through public life on its own terms.
          </p>
          <div className="mt-12 grid gap-px bg-[var(--site-line)] sm:grid-cols-4">
            {[
              {
                stage: "Listen",
                description:
                  "Go to the place. Be with the people. Earn the right to hear.",
              },
              {
                stage: "Curiosity",
                description:
                  "Ask the harder questions. Follow what matters, not what is funded.",
              },
              {
                stage: "Action",
                description:
                  "Build the tool, the service, the infrastructure. Test it in the field.",
              },
              {
                stage: "Art",
                description:
                  "Make the work that carries all of it into public consciousness.",
              },
            ].map((item) => (
              <div key={item.stage} className="bg-[var(--site-surface)] p-6">
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
              href="/about#convictions"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#245c43] transition hover:gap-3"
            >
              Read about the full method <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Emerging works */}
      {emerging.length > 0 && (
        <section className="mx-auto max-w-[1200px] space-y-8 px-8 py-24 md:py-32">
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
      <section className="bg-[var(--site-dark)] px-8 py-24 text-[#F3EBDD] md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-2 lg:items-center">
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
              differently, the studio takes commissions, residencies, and
              collaborations.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Link
              href="/contact"
              className="border-b border-[#CFA16B] pb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EBDD] transition hover:text-[#CFA16B]"
            >
              Get in touch
            </Link>
            <Link
              href="/art/residencies"
              className="border-b border-[#CFA16B]/40 pb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EBDD] transition hover:border-[#CFA16B]"
            >
              Explore residencies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
