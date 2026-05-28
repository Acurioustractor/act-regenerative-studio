import Link from "next/link";

import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { EmpathyLedgerConnections } from "@/components/projects/EmpathyLedgerConnections";
import { buildProjectIndexSignals } from "@/lib/projects/build-project-index-signals";
import { buildCuratedProjectCards } from "@/lib/projects/build-curated-project-cards";
import { studioProjectConfigs } from "@/lib/projects/studio-project-configs";

import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Ecosystem",
  description:
    "Six public works across land, food, justice, storytelling, and art, grounded on Jinibara Country and held together by a single long conversation with place.",
  path: "/ecosystem",
});

export default async function EcosystemPage() {
  const [signalPayload, curatedProjects] = await Promise.all([
    buildProjectIndexSignals(),
    buildCuratedProjectCards(studioProjectConfigs),
  ]);

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Ecosystem"
        title="Public works, one long conversation with place"
        description="A farm, a food hub, a manufactured-goods program, a justice network, a storytelling platform, and a body of art. Each one is grounded in a specific community and a specific place. They share land, method, and a long view."
        actions={[
          { label: "Explore projects", href: "/projects" },
          { label: "See the works", href: "/art", variant: "outline" },
        ]}
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            What holds them together
          </p>
          <ul className="space-y-2 text-sm leading-6 text-[var(--we-brown)]">
            <li>One place to start: Jinibara Country, where the farm anchors the work.</li>
            <li>One method: listen first, then act, then make it visible through art.</li>
            <li>One commitment: hand the keys over when community leadership is ready.</li>
          </ul>
        </div>
      </PageHero>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Fields"
          title="The main fields of practice"
          description="These are the public works ACT currently moves through. Each one feeds the others."
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
                <span>Open the field</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#2F2A25] bg-[#11110F] p-8 text-[#F3EBDD] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
              On the ground
            </p>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold md:text-3xl">
              The shape of the work right now
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#D7C8B2]">
              Numbers straight from the community platforms people are actually
              using. Not a marketing snapshot, what's moving this week.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#4A3B2E] bg-[#171612] px-5 py-4">
              <p className="text-2xl font-semibold text-[#F3EBDD]">
                {signalPayload.summary.activeServiceCount}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                Platforms serving communities
              </p>
            </div>
            <div className="rounded-2xl border border-[#4A3B2E] bg-[#171612] px-5 py-4">
              <p className="text-2xl font-semibold text-[#F3EBDD]">
                {signalPayload.summary.featuredWorkCount}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                Works in circulation
              </p>
            </div>
            <div className="rounded-2xl border border-[#4A3B2E] bg-[#171612] px-5 py-4">
              <p className="text-2xl font-semibold text-[#F3EBDD]">
                {signalPayload.summary.totalStorySignals}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                Community stories
              </p>
            </div>
            <div className="rounded-2xl border border-[#4A3B2E] bg-[#171612] px-5 py-4">
              <p className="text-2xl font-semibold text-[#F3EBDD]">
                {signalPayload.summary.totalMediaSignals}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#BDAE98]">
                Media documented
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Ways in"
          title="Different doors into the same work"
          description="People do not all arrive through the same door. Some come through a project. Some through the art. Some through the method, or the people, or the wiki."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Projects",
              description:
                "The public fields of practice, land, food, goods, justice, story.",
              href: "/projects",
              cta: "Open projects",
            },
            {
              title: "Works",
              description:
                "The art, installations, and voice-led public pieces.",
              href: "/art",
              cta: "Enter the works",
            },
            {
              title: "Method",
              description:
                "Listen, curiosity, action, art. The sequence that shapes every project.",
              href: "/method",
              cta: "See the method",
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
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <EmpathyLedgerConnections
        projectSlug="a-curious-tractor"
        projectTitle="A Curious Tractor"
        orgSlug="a-curious-tractor"
      />
    </div>
  );
}
