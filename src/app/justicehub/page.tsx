import Link from "next/link";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

export const metadata = {
  title: "JusticeHub | A Curious Tractor",
  description:
    "Justice infrastructure for community-led reform, forkable program models, and youth voice shaped around local ownership rather than system extraction.",
};

const features = [
  {
    name: "Service pathways",
    description:
      "Help families and communities find relevant support, legal pathways, and grounded local options.",
  },
  {
    name: "Advocacy pressure",
    description:
      "Campaign and communications infrastructure that can support reform without flattening lived experience.",
  },
  {
    name: "Forkable models",
    description:
      "Program structures communities can adapt locally instead of importing one rigid service template.",
  },
  {
    name: "Youth voice",
    description:
      "Pathways for young people to shape narrative, policy, and program design on their own terms.",
  },
];

const workingLines = [
  {
    title: "MMEIC Justice",
    description: "First Nations-led justice work grounded in local authority and place.",
  },
  {
    title: "Youth Diversion",
    description: "Alternatives to detention that address root causes and keep connection intact.",
  },
  {
    title: "Family Support",
    description: "Wraparound support for families navigating complex and often hostile systems.",
  },
  {
    title: "Reintegration",
    description: "Return pathways that support young people coming back into community life.",
  },
];

export default async function JusticeHubPage() {
  const project = await getProjectData("justicehub");

  if (!project) {
    notFound();
  }

  const relatedWorks = await getRelatedFeaturedWorks("justicehub", project.title, 3);

  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="Justice"
        title="Justice infrastructure shaped for local ownership"
        description={project.description}
        coverImage={project.coverImage}
        coverVideo={project.coverVideo}
        actions={[
          ...(project.projectWebsiteUrl
            ? [{ label: "Visit JusticeHub", href: project.projectWebsiteUrl, external: true as const }]
            : []),
          { label: "Partner With Us", href: "/contact", variant: "outline" },
        ]}
        gradientClass="from-[#E8EEF4] via-[#D0DEE8] to-[#A8C8D8]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#4A5A6B]">
            Our focus
          </p>
          <ul className="space-y-2 text-sm">
            <li>Youth justice reform</li>
            <li>First Nations-led programs</li>
            <li>Community-based alternatives</li>
          </ul>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      {/* Features */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Field lines"
          title="What JusticeHub is built to hold"
          description="JusticeHub is not a standalone service brand. It is one part of ACT's broader effort to move power, support, and narrative closer to community control."
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

      {/* Working lines */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#0B1F2A] to-[#1a3040] p-8 md:p-12">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#7A9AAA]">Current work</p>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white md:text-3xl">
            Working lines in the justice field
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workingLines.map((program) => (
            <div
              key={program.title}
              className="rounded-2xl border border-[#2a4a5a] bg-[#1a3a4a]/50 p-6"
            >
              <h3 className="font-semibold text-white">{program.title}</h3>
              <p className="text-sm text-[#A8C4D4]">{program.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Problem */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="space-y-6">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E] md:text-3xl">
            The challenge we address
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#2F3E2E]">System failure</h3>
              <ul className="space-y-2 text-sm text-[#4D3F33]">
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>Youth detention doesn't reduce reoffending</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>First Nations young people vastly over-represented</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A24A2E]">•</span>
                  <span>Families struggle to navigate complex systems</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#2F3E2E]">Community solutions</h3>
              <ul className="space-y-2 text-sm text-[#4D3F33]">
                <li className="flex items-start gap-2">
                  <span className="text-[#4CAF50]">•</span>
                  <span>Community-led programs that address root causes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4CAF50]">•</span>
                  <span>Cultural connection and Elder mentorship</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4CAF50]">•</span>
                  <span>Open-source models others can adapt</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LCAA Application */}
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Method"
          title="LCAA in action"
          description="How ACT's shared method moves from listening to forkable justice practice."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Listen
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Young people, families, and Elders told us the system wasn't working.
              They wanted alternatives that kept kids connected to community, family, and culture.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Curiosity
            </h3>
            <p className="text-sm text-[#4D3F33]">
              What if justice programs were designed by those most affected?
              What if successful models stayed adaptable so communities could shape their own version?
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Action
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Built service pathways, community partnerships, and shared infrastructure
              that can support local programs without forcing one template on every place.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
              Art
            </h3>
            <p className="text-sm text-[#4D3F33]">
              Youth voice campaigns, storytelling through Empathy Ledger, and
              public narrative work that resists reducing young people to case files.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border border-[#E3D4BA] bg-white p-8 text-center md:p-12">
        <div className="space-y-6">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#2F3E2E] md:text-3xl">
            Explore JusticeHub
          </h2>
          <p className="mx-auto max-w-xl text-sm text-[#5A4A3A]">
            Find services, learn about our programs, or get in touch about partnering
            on justice innovation in your community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://justicehub.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3D9143]"
            >
              Visit JusticeHub
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
