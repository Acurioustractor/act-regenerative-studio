import Link from "next/link";

import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import {
  getLivingEcosystemOpenDecisions,
  getLivingEcosystemSummary,
  getLivingEcosystemSurfaces,
} from "@/lib/living-ecosystem-canon";
import { buildProjectIndexSignals } from "@/lib/projects/build-project-index-signals";
import { buildCuratedProjectCards } from "@/lib/projects/build-curated-project-cards";
import { studioProjectConfigs } from "@/lib/projects/studio-project-configs";

export default async function EcosystemPage() {
  const [signalPayload, curatedProjects, ecosystemSummary, surfaceNodes, openDecisions] = await Promise.all([
    buildProjectIndexSignals(),
    buildCuratedProjectCards(studioProjectConfigs),
    getLivingEcosystemSummary(),
    getLivingEcosystemSurfaces(),
    getLivingEcosystemOpenDecisions(),
  ]);
  const sortedSurfaces = [...surfaceNodes].sort((left, right) => {
    const rank = (value: string) => {
      switch (value) {
        case "primary":
          return 0;
        case "spoke":
          return 1;
        case "supporting":
          return 2;
        case "legacy":
          return 3;
        case "sandbox":
          return 4;
        default:
          return 5;
      }
    };

    return rank(left.classification) - rank(right.classification);
  });

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Ecosystem"
        title="One ecosystem, held together by place, method, and living memory"
        description="ACT is not a stack of disconnected brands. The projects share land, stories, governance questions, cultural work, and the same commitment to hand over the keys when community ownership is ready."
        actions={[
          { label: "Explore projects", href: "/projects" },
          { label: "Open the works", href: "/art", variant: "outline" },
        ]}
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            What makes it one ecosystem
          </p>
          <ul className="space-y-2 text-sm leading-6 text-[var(--we-brown)]">
            <li>Shared place: Jinibara Country and the places where communities lead.</li>
            <li>Shared method: LCAA shapes how listening becomes action and art.</li>
            <li>Shared memory: the ACT wiki keeps durable knowledge in one place.</li>
            <li>Shared live layer: Empathy Ledger keeps stories, voices, and media moving across the graph.</li>
          </ul>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Living ecosystem"
        title="The public ecosystem map now reads from the same memory and live layer as the rest of the site"
        description="This page is no longer a separate dashboard surface. It uses the ACT wiki for project framing and the live story layer for current signals, so the public ecosystem can keep learning without being rebuilt by hand."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel:
            signalPayload.summary.connectedProjectCount > 0
              ? "Live signals connected through Empathy Ledger"
              : null,
          storyCount: signalPayload.summary.totalStorySignals,
          mediaCount: signalPayload.summary.totalMediaSignals,
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Connected projects", value: signalPayload.summary.connectedProjectCount },
          { label: "Live services", value: signalPayload.summary.activeServiceCount },
          { label: "Featured works", value: signalPayload.summary.featuredWorkCount },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Fields"
          title="The main fields of practice"
          description="These are the current public fields through which ACT moves resources, relationships, and knowledge. Each one feeds the others."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {curatedProjects.map((project) => (
            <Link
              key={project.slug}
              href={project.href}
              className="group rounded-2xl border border-[#E1D3BA] bg-white/80 p-6 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-lg"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--we-warm-brown)]">
                {project.eyebrow}
              </p>
              <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {project.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#4CAF50]">{project.tagline}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--we-brown)]">
                {project.description}
              </p>

              {project.liveSignals &&
              (project.liveSignals.serviceConnectionCount > 0 ||
                project.liveSignals.totalWorkCount > 0 ||
                project.liveSignals.storyCount > 0 ||
                project.liveSignals.mediaCount > 0) ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.liveSignals.serviceConnectionCount > 0 ? (
                    <span className="rounded-full bg-[#EDF6EC] px-2.5 py-1 text-[10px] font-medium text-[var(--we-olive)]">
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
                    <span className="rounded-full bg-[#F6F1E7] px-2.5 py-1 text-[10px] font-medium text-[var(--we-brown-deep)]">
                      {project.liveSignals.storyCount} stories
                    </span>
                  ) : null}
                  {project.liveSignals.mediaCount > 0 ? (
                    <span className="rounded-full bg-[#F6F1E7] px-2.5 py-1 text-[10px] font-medium text-[var(--we-brown-deep)]">
                      {project.liveSignals.mediaCount} media
                    </span>
                  ) : null}
                </div>
              ) : null}

              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#4CAF50] transition group-hover:gap-3">
                <span>Explore field</span>
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#2F2A25] bg-[#11110F] p-8 text-[#F3EBDD] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
              Live graph
            </p>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold md:text-3xl">
              Shared signals across the ecosystem
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#D7C8B2]">
              The ecosystem now exposes where services, works, stories, and media are already touching the graph. Durable framing still comes from the wiki. The live layer shows where activity is already gathering.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#4A3B2E] bg-[#171612] px-5 py-4">
              <p className="text-2xl font-semibold text-[#F3EBDD]">
                {signalPayload.summary.activeServiceCount}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                Live services
              </p>
            </div>
            <div className="rounded-2xl border border-[#4A3B2E] bg-[#171612] px-5 py-4">
              <p className="text-2xl font-semibold text-[#F3EBDD]">
                {signalPayload.summary.featuredWorkCount}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                Featured works
              </p>
            </div>
            <div className="rounded-2xl border border-[#4A3B2E] bg-[#171612] px-5 py-4">
              <p className="text-2xl font-semibold text-[#F3EBDD]">
                {signalPayload.summary.totalStorySignals}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                Story signals
              </p>
            </div>
            <div className="rounded-2xl border border-[#4A3B2E] bg-[#171612] px-5 py-4">
              <p className="text-2xl font-semibold text-[#F3EBDD]">
                {signalPayload.summary.totalMediaSignals}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                Media signals
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Assembly"
          title="How this map stays alive"
          description="The ecosystem map is now a composed public surface, not a static diagram. The wiki holds durable meaning. Source packets move approved narrative and media. Source bridges keep the site attached to its canonical trail."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Canonical wiki",
              description:
                "The durable memory layer where ACT authors meaning, not just display copy.",
              href: "/wiki",
              cta: "Open wiki memory",
              meta: `${ecosystemSummary.verifiedCount} verified nodes across the living system`,
            },
            {
              title: "Source packets",
              description:
                "Governed packet outputs from Empathy Ledger that the hub can compose without duplicating the story system.",
              href: "/wiki/source-packets",
              cta: "Open source packets",
              meta: `${signalPayload.summary.featuredWorkCount} featured works already visible downstream`,
            },
            {
              title: "Source bridges",
              description:
                "The trail from canonical note to source summary to implementation repo to public surface.",
              href: "/wiki/source-bridges",
              cta: "Open source bridges",
              meta: `${ecosystemSummary.openDecisionCount} human decisions still open in the public system`,
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[28px] border border-[#E1D3BA] bg-white/85 p-6 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">{item.meta}</p>
              <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4CAF50]">
                <span>{item.cta}</span>
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Public system"
          title="The current public surfaces and their roles"
          description="Not every site in the ecosystem plays the same role. The hub, content spoke, and project spokes now have an explicit public-system map instead of an implicit one."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedSurfaces.map((surface) => (
            <article
              key={surface.id}
              className="rounded-[28px] border border-[#E1D3BA] bg-white/85 p-6 shadow-sm"
            >
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F5F1E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5A4A3A]">
                  {surface.classification}
                </span>
                <span className="rounded-full bg-[#EDF6EC] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2F5233]">
                  {surface.surface_role}
                </span>
                <span className="rounded-full bg-[#EEF2F7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3F546B]">
                  {surface.verification_status}
                </span>
              </div>
              <h2 className="mt-4 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {surface.display_name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                {surface.notes || "Public ecosystem surface."}
              </p>
              <div className="mt-4 space-y-2 text-sm leading-6 text-[var(--we-brown)]">
                <p>Kind: {surface.kind}</p>
                {surface.canonical_note_path ? (
                  <p>Canonical note: {surface.canonical_note_path}</p>
                ) : null}
                {surface.public_copy_owner_for?.length ? (
                  <p>Owns: {surface.public_copy_owner_for.join(", ")}</p>
                ) : null}
              </div>
              {surface.site_url ? (
                <a
                  href={surface.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4CAF50]"
                >
                  <span>Visit surface</span>
                  <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {openDecisions.length > 0 ? (
        <section className="space-y-10">
          <SectionHeading
            eyebrow="Open decisions"
            title="What still needs human confirmation"
            description="The system is already live enough to design and integrate against. These are the remaining classification decisions that still need a human owner rather than an inferred default."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {openDecisions.map((decision) => (
              <article
                key={`${decision.scope}-${decision.id}`}
                className="rounded-[28px] border border-dashed border-[#D8C6A7] bg-[#FFFCF7] p-6"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                  {decision.scope}
                </p>
                <h2 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                  {decision.display_name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                  {decision.notes || "Human confirmation still required."}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Pathways"
          title="Different ways into the ecosystem"
          description="People do not all arrive through the same door. Some come through projects. Some through cultural work. Some through the method or the knowledge base."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Projects",
              description: "Explore the main public fields, initiatives, and proof projects.",
              href: "/projects",
              cta: "Open projects",
            },
            {
              title: "Works",
              description: "See the art, installations, commissions, and voice-led public work.",
              href: "/art",
              cta: "Enter works",
            },
            {
              title: "Method",
              description: "Read the LCAA method and the handover logic underneath the ecosystem.",
              href: "/method",
              cta: "See the method",
            },
            {
              title: "Wiki",
              description: "Browse the durable memory layer that keeps the public site grounded.",
              href: "/wiki",
              cta: "Open the wiki",
            },
          ].map((pathway) => (
            <Link
              key={pathway.title}
              href={pathway.href}
              className="rounded-2xl border border-[#E1D3BA] bg-white/75 p-6 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-md"
            >
              <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                {pathway.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--we-brown)]">
                {pathway.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4CAF50]">
                <span>{pathway.cta}</span>
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
