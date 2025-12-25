import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { projects } from "../../data/projects";

const engagementCards = [
  {
    title: "Partner with a seed",
    description:
      "Co-design pilots, share research, or bring a funding partner into the work.",
  },
  {
    title: "Host a residency",
    description:
      "Invite artists, researchers, and community leaders to stay and build together.",
  },
  {
    title: "Support the commons",
    description:
      "Back harvest shares, shared governance experiments, and art-led outcomes.",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Outputs"
        title="Projects and active seeds"
        description="ACT projects hold the practical outputs of LCAA. Each seed is a living project with its own brand, site, and pace, while sharing a common promise of co-stewardship."
        actions={[
          { label: "Visit the farm", href: "/farm" },
          { label: "Explore art", href: "/art", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            How this hub works
          </p>
          <p>
            Each project keeps its own site and identity. The ACT hub holds the
            shared narrative, navigation, and invitations to collaborate.
          </p>
          <p>
            We update this registry as new projects emerge and as existing seeds
            mature into shared governance.
          </p>
        </div>
      </PageHero>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Active seeds"
          title="Current outputs and initiatives"
          description="Explore what is live, what is in R&D, and what is ready for co-stewardship."
        />
        <CardGrid
          cards={projects.map((project) => ({
            title: project.title,
            description: project.tagline,
            href: `/projects/${project.slug}`,
            image: project.heroImage,
            theme: project.theme,
          }))}
        />
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Engage"
          title="Ways to step in"
          description="Choose the collaboration mode that matches your role in the ecosystem."
        />
        <CardGrid
          cards={engagementCards}
          className="grid gap-6 md:grid-cols-3"
        />
      </section>

      <section className="rounded-[32px] border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 text-center md:p-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E4D7BF] bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            <span>Annual Report</span>
          </div>
          <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[#2F3E2E] md:text-4xl">
            Celebrating our 2025 journey
          </h2>
          <p className="text-sm leading-relaxed text-[#5A4A3A] md:text-base">
            Explore the full story of our work in 2025—photos, videos, impact
            metrics, and the journey across all our projects. See the LCAA
            method in action through an interactive timeline, constellation
            maps, and featured project showcases.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="https://act.place/2025-review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3D9143]"
            >
              View 2025 Year in Review →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
