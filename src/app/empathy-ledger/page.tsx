import Link from "next/link";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Empathy Ledger | A Curious Tractor",
  description:
    "Consent-first story infrastructure built around Indigenous data sovereignty, community control, and live syndication into ACT project surfaces.",
};

const features = [
  {
    name: "Consent-first storytelling",
    description:
      "Stories should only travel where explicit permission allows, and permissions can change over time.",
  },
  {
    name: "Data sovereignty",
    description:
      "The system is shaped by Indigenous data sovereignty principles and by community control over how narrative material is used.",
  },
  {
    name: "Community voice",
    description:
      "Lived experience is surfaced without treating people as raw content inputs for institutional storytelling.",
  },
  {
    name: "ALMA learning loop",
    description:
      "Adaptive Listening and Meaning Analysis helps story work stay useful, legible, and accountable.",
  },
];

const useCases = [
  {
    title: "Justice Programs",
    description: "Capturing participant journeys and program outcomes through their own words",
  },
  {
    title: "Cultural Preservation",
    description: "Archiving community knowledge, traditions, and oral histories",
  },
  {
    title: "Impact Reporting",
    description: "Evidence and storytelling that respects dignity while demonstrating outcomes",
  },
];

export default async function EmpathyLedgerPage() {
  const project = await getProjectData("empathy-ledger");

  if (!project) {
    notFound();
  }

  const relatedWorks = await getRelatedFeaturedWorks(
    "empathy-ledger",
    project.title,
    3
  );

  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="Stories + consent"
        title="Story infrastructure with consent at the centre"
        description={project.description}
        coverImage={project.coverImage}
        coverVideo={project.coverVideo}
        actions={[
          ...(project.projectWebsiteUrl
            ? [{ label: "Visit Empathy Ledger", href: project.projectWebsiteUrl, external: true as const }]
            : []),
          { label: "Partner With Us", href: "/contact", variant: "outline" },
        ]}
        gradientClass="from-[#E8F4F4] via-[#D0E8E8] to-[#A8D8D8]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#4A6B6B]">
            Core principles
          </p>
          <ul className="space-y-2 text-sm">
            <li>Consent is ongoing and revocable</li>
            <li>Community owns their narratives</li>
            <li>No story without permission</li>
          </ul>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      {/* Features */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Commitments"
          title="What Empathy Ledger is built to protect"
          description="Empathy Ledger is the live story and media layer that can feed ACT projects without separating impact evidence from permission."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="rounded-2xl border border-[#E3D4BA] bg-white p-6"
            >
              <h3 className="font-semibold text-[#2F3E2E]">{feature.name}</h3>
              <p className="mt-2 text-sm text-[#5A4A3A]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#2F3E2E] to-[#1a2a1a] p-8 md:p-12">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9AA396]">Where it serves</p>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white md:text-3xl">
            Contexts where story stewardship matters
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-2xl border border-[#4a5a4a] bg-[#3a4a3a]/50 p-6"
            >
              <h3 className="font-semibold text-white">{useCase.title}</h3>
              <p className="mt-2 text-sm text-[#B8C4B8]">{useCase.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LCAA Application */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Method"
          title="LCAA in action"
          description="How ACT's shared method becomes consent-based story practice."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Listen
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Communities told us their stories were being extracted without consent.
              They wanted to share on their own terms, with control over how narratives travel and where they stop.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Curiosity
            </h3>
            <p className="text-sm text-[#4D3F33]">
              What if consent was built into the architecture? What if communities
              could change their mind later? How might data sovereignty principles actually shape software?
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Action
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Built a system where consent, syndication, and public storytelling can
              stay connected instead of being managed in separate silos.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Art
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Stories can become exhibitions, reports, and cultural archives, but
              only through approved pathways that keep attribution and permission visible.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-white p-8 text-center md:p-12">
        <div className="space-y-6">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E] md:text-3xl">
            Explore the live story layer
          </h2>
          <p className="mx-auto max-w-xl text-sm text-[#5A4A3A]">
            See how approved voices, media, and field material can flow into ACT
            projects without losing context, attribution, or consent.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {project.projectWebsiteUrl ? (
              <a
                href={project.projectWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3D9143]"
              >
                Visit Platform
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ) : null}
            <Link
              href="/contact"
              className="rounded-full border border-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#2F3E2E] transition hover:bg-[#E5F4E4]"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
