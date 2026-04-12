import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { getLiveServicesForSite } from "@/lib/empathy-ledger-services";
import { resolveServiceProjectLinks } from "@/lib/projects/resolve-service-project-links";

const workStyles = [
  {
    title: "Partnership First",
    description:
      "We don't do projects 'to' communities—we do them alongside. Every partnership begins with listening, and communities lead the direction.",
  },
  {
    title: "Prototype Quickly",
    description:
      "We prototype early enough to learn from reality, but not so fast that urgency crushes listening, trust, or cultural protocol.",
  },
  {
    title: "Open by Default",
    description:
      "Our tools, code, and learnings are designed to be shared. Forkable IP means communities can take what works and make it their own.",
  },
  {
    title: "Sunset Clauses",
    description:
      "Every project includes a plan for handover or wind-down. We design for our own obsolescence.",
  },
];

const rhythms = [
  {
    title: "Weekly",
    items: [
      "Studio sync for active projects",
      "Community partner check-ins",
      "Error monitoring and system health",
    ],
  },
  {
    title: "Monthly",
    items: [
      "Relationship health review",
      "Project retrospectives",
      "Knowledge sharing sessions",
    ],
  },
  {
    title: "Quarterly",
    items: [
      "Impact assessment",
      "Partner advisory meetings",
      "Strategic planning",
    ],
  },
  {
    title: "Annually",
    items: [
      "Community accountability report",
      "Profit-sharing distribution",
      "Long-term vision review",
    ],
  },
];

const collaborationTypes = [
  {
    title: "R&D Residencies",
    description:
      "Accommodation and prototyping space at Black Cockatoo Valley for artists, researchers, and innovators working on aligned projects.",
    cta: "Learn about residencies",
    href: "/farm",
  },
  {
    title: "Project Partnerships",
    description:
      "Deep collaboration on specific initiatives where ACT provides methodology, infrastructure, and network while partners bring community relationships and domain expertise.",
    cta: "Contact us",
    href: "/contact",
  },
  {
    title: "Infrastructure Access",
    description:
      "Use of ACT's technical stack, tools, and platforms for aligned organizations—from Empathy Ledger's consent framework to JusticeHub's program registry.",
    cta: "Explore projects",
    href: "/projects",
  },
  {
    title: "Learning and capability transfer",
    description:
      "Workshops, accompaniment, and practical handover support that help others adapt ACT approaches without becoming dependent on ACT.",
    cta: "Talk with us",
    href: "/contact",
  },
];

export default async function HowWeWorkPage() {
  const liveServices = await getLiveServicesForSite({
    limit: 3,
    status: "active",
  }).catch(() => []);
  const serviceProjectLinks = await resolveServiceProjectLinks(liveServices);

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="How We Work"
        title="How the work moves from listening into public form"
        description="This page is about operating rhythms, collaboration pathways, and the practical habits that stop ACT from becoming just another service brand."
        actions={[
          { label: "Read the principles", href: "/principles" },
          { label: "Open the method", href: "/method", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Working stance
          </p>
          <p>
            We try to move at the speed of relationship, use tools to create space, and treat documentation and handover as part of delivery rather than cleanup.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Living practice"
        title="Practice is documented in the wiki and tested in the field"
        description="ACT’s operating habits are not just internal process notes. The durable layer lives in the wiki, while approved service proof, stories, and media can keep updating through Empathy Ledger as collaborations deepen."
        wiki={{
          href: "/wiki/ways-of-working",
          label: "Open ways of working",
        }}
        live={{
          sourceLabel: liveServices.length > 0 ? "Live capabilities connected through Empathy Ledger" : null,
          storyCount: liveServices.reduce((sum, service) => sum + service.linkedStoryCount, 0),
          storytellerCount: liveServices.reduce((sum, service) => sum + service.storytellerCount, 0),
          mediaCount: liveServices.reduce(
            (sum, service) => sum + service.media.photoCount + service.media.videoCount,
            0
          ),
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Live capabilities", value: liveServices.length },
          { label: "Collaboration paths", value: collaborationTypes.length },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Approach"
          title="How we do the work"
          description="The practices that guide our project delivery and partnerships."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {workStyles.map((style) => (
            <div
              key={style.title}
              className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-3"
            >
              <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                {style.title}
              </h3>
              <p className="text-sm text-[#4D3F33]">{style.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12 space-y-8">
        <SectionHeading
          eyebrow="Rhythms"
          title="How we stay accountable"
          description="Regular practices that keep us grounded and responsive."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {rhythms.map((rhythm) => (
            <div
              key={rhythm.title}
              className="rounded-2xl border border-[#D8C7A5] bg-white/70 p-6 space-y-4"
            >
              <h3 className="font-semibold text-[#2F3E2E]">{rhythm.title}</h3>
              <ul className="space-y-2">
                {rhythm.items.map((item) => (
                  <li key={item} className="text-sm text-[#4D3F33] flex gap-2">
                    <span className="text-[#4CAF50]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Collaboration"
          title="Ways to work with us"
          description="Different pathways into the ACT ecosystem based on what you're looking for."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {collaborationTypes.map((collab) => (
            <div
              key={collab.title}
              className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4"
            >
              <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                {collab.title}
              </h3>
              <p className="text-sm text-[#4D3F33]">{collab.description}</p>
              <Link
                href={collab.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] hover:gap-3 transition"
              >
                <span>{collab.cta}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {liveServices.length > 0 ? (
        <section className="space-y-10">
          <SectionHeading
            eyebrow="Live capabilities"
            title="Services that keep learning as the work grows"
            description="This section is syndicated from Empathy Ledger. As new stories, photos, videos, and service notes are approved, the public studio shell can keep evolving without becoming a second CMS."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {liveServices.map((service) => {
              const ctaLabel =
                service.detail.cta.label ||
                service.detail.cta.text ||
                "Start a conversation";
              const ctaHref = service.detail.cta.url || "/contact";
              const ctaExternal =
                ctaHref.startsWith("http://") || ctaHref.startsWith("https://");
              const preview =
                service.media.photoPreviews[0] || service.media.videoPreviews[0] || null;
              const relatedProjectLinks = serviceProjectLinks[service.id] || [];

              return (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-3xl border border-[#E1D3BA] bg-white/80"
                >
                  {preview?.kind === "image" && (preview.previewUrl || preview.thumbnailUrl || preview.url) ? (
                    <img
                      src={preview.previewUrl || preview.thumbnailUrl || preview.url || undefined}
                      alt={preview.altText || preview.title || service.name}
                      className="h-44 w-full object-cover"
                    />
                  ) : preview ? (
                    <div className="flex h-44 items-end bg-gradient-to-br from-[#2F3E2E] via-[#4A4035] to-[#7A9B76] p-5 text-white">
                      <div>
                        <p className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                          {preview.kind}
                        </p>
                        <p className="mt-3 text-xl font-semibold">
                          {preview.title || service.name}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-4 p-7">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#6B5A45]">
                      <span>{service.serviceType?.replaceAll("_", " ") || "capability"}</span>
                      <span>•</span>
                      <span>{service.storytellerCount} voices</span>
                      <span>•</span>
                      <span>{service.linkedStoryCount} stories</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                        {service.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#4D3F33]">
                        {service.detail.overview || service.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {service.detail.serviceTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#F6F1E7] px-3 py-1 text-xs font-medium text-[#4A4035]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {relatedProjectLinks.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B5A45]">
                          Project pathways
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {relatedProjectLinks.slice(0, 3).map((projectLink) =>
                            projectLink.href ? (
                              <Link
                                key={projectLink.key}
                                href={projectLink.href}
                                className="rounded-full bg-[#EDF6EC] px-3 py-1 text-xs font-medium text-[#2F3E2E] transition hover:bg-[#DCEED8]"
                              >
                                {projectLink.label}
                              </Link>
                            ) : (
                              <span
                                key={projectLink.key}
                                className="rounded-full bg-[#EDF6EC] px-3 py-1 text-xs font-medium text-[#2F3E2E]"
                              >
                                {projectLink.label}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    ) : null}

                    {ctaExternal ? (
                      <a
                        href={ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] hover:gap-3 transition"
                      >
                        <span>{ctaLabel}</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <Link
                        href={ctaHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] hover:gap-3 transition"
                      >
                        <span>{ctaLabel}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Shared infrastructure"
          title="What the system is designed to hold"
          description="The public shell should not read like a stack diagram. What matters here is the kind of infrastructure ACT keeps building so projects can stay grounded, consentful, and transferable."
        />
        <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              <h3 className="font-semibold text-[#2F3E2E]">Living memory</h3>
              <ul className="space-y-2 text-sm text-[#4D3F33]">
                <li>• Canonical ACT wiki as durable source of truth</li>
                <li>• Project framing synced into the public site</li>
                <li>• Knowledge designed to compound, not duplicate</li>
                <li>• Public pages that can stay aligned as the wiki grows</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-[#2F3E2E]">Consent-first story layer</h3>
              <ul className="space-y-2 text-sm text-[#4D3F33]">
                <li>• Empathy Ledger for approved stories, voices, photos, and media</li>
                <li>• Story remains linked to project and place</li>
                <li>• Public proof can update without rebuilding the site by hand</li>
                <li>• Consent and authority shape what can be shown</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-[#2F3E2E]">Handover-oriented tooling</h3>
              <ul className="space-y-2 text-sm text-[#4D3F33]">
                <li>• Tools should create space, not lock people in</li>
                <li>• Systems are designed to be explained, adapted, and transferred</li>
                <li>• Documentation is part of delivery, not a leftover task</li>
                <li>• Infrastructure should support community ownership, not platform dependence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Farm Metaphor"
          title="Speaking our language"
          description="We use farm imagery to describe our work and approach."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Seeds</h4>
            <p className="text-sm text-[#4D3F33]">
              Active projects that need time, water, and attention
            </p>
          </div>
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Soil</h4>
            <p className="text-sm text-[#4D3F33]">
              Our knowledge network and community wisdom
            </p>
          </div>
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Seasons</h4>
            <p className="text-sm text-[#4D3F33]">
              Natural cycles of growth, harvest, and rest
            </p>
          </div>
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Harvest</h4>
            <p className="text-sm text-[#4D3F33]">
              Shared value that feeds the community
            </p>
          </div>
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Fields</h4>
            <p className="text-sm text-[#4D3F33]">
              Domains where we cultivate change
            </p>
          </div>
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Tractor/PTO</h4>
            <p className="text-sm text-[#4D3F33]">
              We provide capacity, then communities drive forward
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
