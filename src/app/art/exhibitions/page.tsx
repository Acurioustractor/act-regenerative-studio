import Link from "next/link";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import { getFeaturedWorks } from "@/lib/works/live-featured-works";

const exhibitionPatterns = [
  {
    title: "On-Country and place-based showings",
    description:
      "Slow exhibitions and gatherings that are shaped by the place itself rather than dropped in as a generic touring format.",
  },
  {
    title: "Traveling installations",
    description:
      "Works that move through partner sites, community events, justice contexts, and temporary public spaces.",
  },
  {
    title: "Documentation-led displays",
    description:
      "Transcript fragments, stills, and process residue that let audiences encounter the work even when the full installation is not present.",
  },
];

export default async function ExhibitionsPage() {
  const works = await getFeaturedWorks();

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Exhibitions"
        title="Spaces where the work becomes public"
        description="Exhibitions are one way ACT makes a system, story, or place legible in public life. Sometimes that means a full installation. Sometimes it means fragments, documentation, or a temporary site that can hold the work properly."
        actions={[
          { label: "Host an exhibition", href: "/contact" },
          { label: "Back to works", href: "/art", variant: "outline" },
        ]}
        gradientClass="from-[#F4E8DD] via-[#DEC3AF] to-[#C89B7F]"
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Exhibition models"
          title="How ACT tends to share work publicly"
          description="These are recurring models, not a fixed catalogue. The exact shape depends on the work, the community, and what the venue can ethically hold."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {exhibitionPatterns.map((pattern) => (
            <div
              key={pattern.title}
              className="rounded-3xl border border-[#E1D3BA] bg-white/75 p-8"
            >
              <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                {pattern.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                {pattern.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Works in circulation"
          title="Current pieces that can travel, gather, or exhibit"
          description="These works already have public project records, so they are the right entry points for exhibition conversations rather than a separate manual list."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {works.map((work) => (
            <Link
              key={work.slug}
              href={work.href}
              className="group overflow-hidden rounded-[28px] border border-[#E1D3BA] bg-white/80 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_20px_50px_rgba(50,42,31,0.12)]"
            >
              {work.previewMedia ? (
                work.previewMedia.kind === "image" ? (
                  <img
                    src={work.previewMedia.thumbnailUrl || work.previewMedia.url}
                    alt={work.previewMedia.alt || work.title}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="relative h-56 overflow-hidden bg-[#171612]">
                    {work.previewMedia.thumbnailUrl ? (
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
              ) : null}

              <div className="space-y-4 p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--we-warm-brown)]">
                  <span>{work.medium}</span>
                  <span>•</span>
                  <span>{work.place}</span>
                </div>
                <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)]">
                  {work.title}
                </h2>
                <p className="text-sm leading-7 text-[var(--we-brown)]">
                  {work.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {work.live.storyCount > 0 ? (
                    <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs font-medium text-[var(--we-brown-deep)]">
                      {work.live.storyCount} stories
                    </span>
                  ) : null}
                  {work.live.mediaCount > 0 ? (
                    <span className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs font-medium text-[var(--we-brown-deep)]">
                      {work.live.mediaCount} media
                    </span>
                  ) : null}
                  <span className="rounded-full bg-[#EDF6EC] px-3 py-1 text-xs font-medium text-[var(--we-olive)]">
                    {work.connectedTo}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition group-hover:gap-3">
                  <span>Open work</span>
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
