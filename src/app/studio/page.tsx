import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import {
  getLiveServicesForSite,
  type LiveServiceRecord,
} from "@/lib/empathy-ledger-services";
import { buildCuratedProjectCards } from "@/lib/projects/build-curated-project-cards";
import { resolveServiceProjectLinks } from "@/lib/projects/resolve-service-project-links";
import { studioProjectConfigs } from "@/lib/projects/studio-project-configs";

const fallbackStudioCapabilities = [
  {
    title: "Contracted Projects",
    description:
      "We take on mission-aligned projects with partners, applying our methodology to their challenges.",
  },
  {
    title: "Art Portfolio",
    description:
      "Artworks, exhibitions, and commissions that translate change into culture and meaning.",
  },
  {
    title: "Research & Development",
    description:
      "Prototyping new models for governance, land care, and community ownership.",
  },
  {
    title: "Custodian Economy",
    description:
      "Research into Indigenous economic models and place-based regenerative systems.",
  },
];

function formatServiceType(serviceType: string | null): string {
  if (!serviceType) return "Capability";
  return serviceType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPrimaryMedia(service: LiveServiceRecord) {
  return service.media.photoPreviews[0] || service.media.videoPreviews[0] || null;
}

function getServiceAction(service: LiveServiceRecord) {
  const label =
    service.detail.cta.label ||
    service.detail.cta.text ||
    "Talk with us";
  const href = service.detail.cta.url || "/contact";
  const external = href.startsWith("http://") || href.startsWith("https://");

  return { label, href, external };
}

export default async function StudioPage() {
  const [liveServices, curatedProjects] = await Promise.all([
    getLiveServicesForSite({
      limit: 4,
      status: "active",
    }).catch(() => []),
    buildCuratedProjectCards(studioProjectConfigs),
  ]);
  const serviceProjectLinks = await resolveServiceProjectLinks(liveServices);
  const studioStoryCount = curatedProjects.reduce(
    (sum, project) => sum + (project.liveSignals?.storyCount || 0),
    0
  );
  const studioMediaCount = curatedProjects.reduce(
    (sum, project) => sum + (project.liveSignals?.mediaCount || 0),
    0
  );
  const studioWorkCount = curatedProjects.reduce(
    (sum, project) => sum + (project.liveSignals?.totalWorkCount || 0),
    0
  );

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Studio"
        title="The studio that holds land, story, justice, and works together"
        description="ACT Regenerative Innovation Studio is the public shell for a living ecosystem. It holds the shared method, the field memory, and the connective infrastructure that lets projects grow without becoming disconnected brands."
        actions={[
          { label: "Explore projects", href: "/projects" },
          { label: "Open the wiki", href: "/wiki", variant: "outline" },
        ]}
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">What holds it together</p>
          <ul className="space-y-2 text-sm leading-6 text-[#4D3F33]">
            <li>Shared method: Listen, Curiosity, Action, Art.</li>
            <li>Shared memory: the ACT wiki remains the durable source of truth.</li>
            <li>Shared live layer: Empathy Ledger keeps voice, photos, video, and field material moving.</li>
            <li>Shared promise: we build with communities and design to hand over the keys.</li>
          </ul>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Studio system"
        title="The studio is where durable memory meets live field material"
        description="This site no longer needs separate project brochures to stay current. Core framing comes from the ACT wiki, while approved stories, voices, and media can continue arriving through Empathy Ledger as the ecosystem changes."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel: liveServices.length > 0 ? "Live services and story layers connected" : null,
          storyCount: studioStoryCount,
          mediaCount: studioMediaCount,
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Public fields", value: curatedProjects.length },
          ...(liveServices.length > 0 ? [{ label: "Live capabilities", value: liveServices.length }] : []),
          ...(studioWorkCount > 0 ? [{ label: "Connected works", value: studioWorkCount }] : []),
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Capabilities"
          title="What the studio can hold with others"
          description={
            liveServices.length > 0
              ? "These capabilities are syndicated through the live story layer, so service framing, imagery, and proof can keep evolving without rebuilding the public site by hand."
              : "The studio holds the shared capabilities that support land practice, justice work, story infrastructure, and cultural production."
          }
        />
        {liveServices.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {liveServices.map((service) => {
              const preview = getPrimaryMedia(service);
              const action = getServiceAction(service);
              const relatedProjectLinks = serviceProjectLinks[service.id] || [];

              return (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-3xl border border-[#E1D3BA] bg-white/80"
                >
                  {preview ? (
                    preview.kind === "image" ? (
                      <img
                        src={preview.previewUrl || preview.thumbnailUrl || preview.url || undefined}
                        alt={preview.altText || preview.title || service.name}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="relative h-52 overflow-hidden bg-[#2F3E2E]">
                        {preview.thumbnailUrl || preview.previewUrl ? (
                          <img
                            src={preview.thumbnailUrl || preview.previewUrl || undefined}
                            alt={preview.altText || preview.title || service.name}
                            className="h-full w-full object-cover opacity-70"
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5">
                          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                            {preview.kind}
                          </span>
                          <span className="text-sm font-medium text-white">
                            {preview.title || service.name}
                          </span>
                        </div>
                      </div>
                    )
                  ) : null}

                  <div className="space-y-4 p-8">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#6B5A45]">
                      <span>{formatServiceType(service.serviceType)}</span>
                      {service.media.photoCount + service.media.videoCount > 0 ? (
                        <>
                          <span>•</span>
                          <span>
                            {service.media.photoCount + service.media.videoCount} media items
                          </span>
                        </>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                        {service.name}
                      </h3>
                      <p className="text-sm leading-7 text-[#4D3F33]">
                        {service.detail.overview || service.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {service.detail.serviceTags.slice(0, 4).map((tag) => (
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
                          Connected projects
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {relatedProjectLinks.slice(0, 4).map((projectLink) =>
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

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-[#F6F1E7] px-4 py-3">
                        <p className="text-lg font-semibold text-[#2F3E2E]">
                          {service.storytellerCount}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6B5A45]">
                          Voices
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#F6F1E7] px-4 py-3">
                        <p className="text-lg font-semibold text-[#2F3E2E]">
                          {service.linkedStoryCount}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6B5A45]">
                          Stories
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#F6F1E7] px-4 py-3">
                        <p className="text-lg font-semibold text-[#2F3E2E]">
                          {service.relatedProjects.length}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6B5A45]">
                          Related projects
                        </p>
                      </div>
                    </div>

                    {service.detail.testimonial.quote ? (
                      <p className="border-l border-[#D8C7A5] pl-4 text-sm italic text-[#5A4A3A]">
                        {service.detail.testimonial.quote}
                      </p>
                    ) : service.linkedStories[0]?.excerpt ? (
                      <p className="border-l border-[#D8C7A5] pl-4 text-sm italic text-[#5A4A3A]">
                        {service.linkedStories[0].excerpt}
                      </p>
                    ) : null}

                    {action.external ? (
                      <a
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] hover:gap-3 transition"
                      >
                        <span>{action.label}</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <Link
                        href={action.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] hover:gap-3 transition"
                      >
                        <span>{action.label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {fallbackStudioCapabilities.map((capability) => (
              <div
                key={capability.title}
                className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-3"
              >
                <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                  {capability.title}
                </h3>
                <p className="text-sm text-[#4D3F33]">{capability.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12 space-y-8">
        <SectionHeading
          eyebrow="Fields of practice"
          title="Where the work is already taking root"
          description="These projects inherit their core framing from the ACT wiki, then show where services, works, stories, and media are already active in the live graph."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {curatedProjects.map((project) => (
            <Link
              key={project.slug}
              href={project.href}
              className="group rounded-2xl border border-[#D8C7A5] bg-gradient-to-br from-white/80 via-[#F8F2E8] to-[#E6D6BA] p-6 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-lg"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B5A45]">
                {project.eyebrow}
              </p>
              <h3 className="mt-2 font-semibold text-[#2F3E2E]">{project.title}</h3>
              <p className="mt-1 text-sm font-medium text-[#4CAF50]">{project.tagline}</p>
              <p className="mt-3 text-sm leading-6 text-[#4D3F33]">
                {project.description}
              </p>
              {project.liveSignals &&
              (project.liveSignals.serviceConnectionCount > 0 ||
                project.liveSignals.totalWorkCount > 0 ||
                project.liveSignals.storyCount > 0 ||
                project.liveSignals.mediaCount > 0) ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.liveSignals.serviceConnectionCount > 0 ? (
                    <span className="rounded-full bg-[#EDF6EC] px-2.5 py-1 text-[10px] font-medium text-[#2F3E2E]">
                      {project.liveSignals.serviceConnectionCount} service
                      {project.liveSignals.serviceConnectionCount === 1 ? "" : "s"}
                    </span>
                  ) : null}
                  {project.liveSignals.totalWorkCount > 0 ? (
                    <span className="rounded-full bg-[#F7EFFA] px-2.5 py-1 text-[10px] font-medium text-[#6B4D6B]">
                      {project.liveSignals.totalWorkCount} work
                      {project.liveSignals.totalWorkCount === 1 ? "" : "s"}
                    </span>
                  ) : null}
                  {project.liveSignals.storyCount > 0 ? (
                    <span className="rounded-full bg-[#F6F1E7] px-2.5 py-1 text-[10px] font-medium text-[#4A4035]">
                      {project.liveSignals.storyCount} stories
                    </span>
                  ) : null}
                  {project.liveSignals.mediaCount > 0 ? (
                    <span className="rounded-full bg-[#F6F1E7] px-2.5 py-1 text-[10px] font-medium text-[#4A4035]">
                      {project.liveSignals.mediaCount} media
                    </span>
                  ) : null}
                </div>
              ) : null}
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#4CAF50] transition group-hover:gap-3">
                <span>Explore</span>
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Structure"
          title="How we're organized"
          description="A dual-entity structure that protects community interests while enabling sustainable operations."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
            <div className="inline-block rounded-full bg-[#E5F4E4] px-4 py-1 text-xs font-medium text-[#2F3E2E]">
              Not-for-profit
            </div>
            <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              ACT Foundation (CLG)
            </h3>
            <ul className="space-y-2 text-sm text-[#4D3F33]">
              <li>• Charitable status for grants and donations</li>
              <li>• Mission-locked governance</li>
              <li>• Owns majority of ventures</li>
              <li>• Protects community interests</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
            <div className="inline-block rounded-full bg-[#FEF3C7] px-4 py-1 text-xs font-medium text-[#92400E]">
              Social Enterprise
            </div>
            <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              ACT Ventures (Trading)
            </h3>
            <ul className="space-y-2 text-sm text-[#4D3F33]">
              <li>• Generates sustainable revenue</li>
              <li>• 40% profit-sharing to communities</li>
              <li>• Attracts impact investment</li>
              <li>• Creates jobs and opportunities</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Impact"
          title="What we're building toward"
          description="By 2027, we aim to demonstrate that regenerative innovation can scale."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-[#4CAF50]">3+</p>
            <p className="text-sm text-[#4D3F33]">
              Communities independently replicating ACT models
            </p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-[#4CAF50]">117</p>
            <p className="text-sm text-[#4D3F33]">
              Hectares of land under conservation
            </p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-[#4CAF50]">50+</p>
            <p className="text-sm text-[#4D3F33]">
              Jobs created in marginalised communities
            </p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-[#4CAF50]">1000+</p>
            <p className="text-sm text-[#4D3F33]">
              Stories protected through Empathy Ledger
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
