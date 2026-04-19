import Link from "next/link";
import { EnquiryExpectations } from "../../../components/forms/EnquiryExpectations";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import { getFeaturedWorks } from "@/lib/works/live-featured-works";

const commissionModes = [
  {
    title: "Public-facing installations",
    description:
      "Works that help a community, institution, or campaign make a hidden condition felt in public life.",
  },
  {
    title: "Research and policy artefacts",
    description:
      "Objects, environments, or media that turn evidence and systems knowledge into something people can stand inside, hear, or hold.",
  },
  {
    title: "Place-based cultural commissions",
    description:
      "Longer collaborations shaped by Country, local authority, and the time needed to do the work properly.",
  },
];

export default async function ArtCommissionsPage() {
  const works = await getFeaturedWorks({ limit: 3 });

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Commissions"
        title="Commission work through the ACT studio"
        description="We make commissions that sit between art, infrastructure, and public reasoning. The strongest projects are not decorative overlays; they are forms that help a place, institution, or campaign handle a difficult reality differently."
        actions={[
          {
            label: "Start a commission",
            href: "/contact?type=commission-cultural-work&source=art-commissions&context=works-commission",
          },
          { label: "Back to works", href: "/art", variant: "outline" },
        ]}
        gradientClass="from-[#F4E8DD] via-[#E1C6B0] to-[#C7997A]"
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Commission modes"
          title="How commissions tend to take shape"
          description="The exact form depends on the question, the place, and the people involved. These are the patterns we return to most often."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {commissionModes.map((mode) => (
            <div
              key={mode.title}
              className="rounded-3xl border border-[#E1D3BA] bg-white/75 p-8"
            >
              <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                {mode.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Relevant case studies"
          title="Current works that show the commission logic"
          description="These pieces are already being carried by the live ACT stack, so they are the clearest current reference points for how a commission can look, feel, and grow over time."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {works.map((work) => (
            <Link
              key={work.slug}
              href={work.href}
              className="group overflow-hidden rounded-3xl border border-[#E1D3BA] bg-white/80 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_18px_45px_rgba(50,42,31,0.1)]"
            >
              {work.previewMedia?.kind === "image" ? (
                <img
                  src={work.previewMedia.thumbnailUrl || work.previewMedia.url}
                  alt={work.previewMedia.alt || work.title}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-48 items-end bg-gradient-to-br from-[#171612] via-[#2F2A25] to-[#5B4634] p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.22em]">
                    {work.previewMedia?.kind || "Live project record"}
                  </p>
                </div>
              )}
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--we-warm-brown)]">
                  <span>{work.medium}</span>
                  <span>•</span>
                  <span>{work.connectedTo}</span>
                </div>
                <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
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
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition group-hover:gap-3">
                  <span>Open work</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <EnquiryExpectations
        eyebrow="Commission enquiries"
        title="What makes a strong commission conversation"
        intro="The best commission enquiries are specific about the public condition or institutional pressure the work needs to hold. We are usually a poor fit for decorative branding exercises and a better fit for projects that need form, testimony, installation, or place-based translation."
        whatHelps={[
          "Name the setting, institution, or campaign context the work will sit inside.",
          "Be direct about timing, budget range, collaborators, and whether the work needs public, policy, or cultural outcomes.",
          "Share any real constraints early, especially if there are permissions, community partners, or public exhibition timelines involved.",
        ]}
        whatHappensNext={[
          "We review the enquiry for fit with ACT's studio line and current capacity.",
          "If it looks aligned, the next step is a smaller scoping conversation rather than a full proposal process.",
          "If another route fits better, we will say so early.",
        ]}
      />

      <div className="flex justify-center">
        <Link
          href="/contact?type=commission-cultural-work&source=art-commissions&context=works-commission"
          className="inline-flex rounded-full bg-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3D9143]"
        >
          Start a commission enquiry
        </Link>
      </div>
    </div>
  );
}
