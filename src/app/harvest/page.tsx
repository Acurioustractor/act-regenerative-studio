import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

const harvestPaths = [
  {
    title: "CSA harvest shares",
    description:
      "Seasonal boxes and shared meals rooted in stewardship of the land.",
    href: "/harvest/csa",
  },
  {
    title: "Seasonal produce",
    description:
      "What we grow, when it arrives, and how we share it with community.",
    href: "/harvest/produce",
  },
  {
    title: "Events + gatherings",
    description:
      "Markets, harvest feasts, and community days on the farm.",
    href: "/events",
  },
];

export default async function HarvestPage() {
  const project = await getProjectData("the-harvest");

  if (!project) {
    notFound();
  }

  const relatedWorks = await getRelatedFeaturedWorks("the-harvest", project.title, 3);

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Harvest"
        title="Food, community, and shared care"
        description={project.description}
        coverImage={project.coverImage}
        coverVideo={project.coverVideo}
        actions={[
          ...(project.projectWebsiteUrl
            ? [{ label: "Visit The Harvest", href: project.projectWebsiteUrl, external: true as const }]
            : []),
          { label: "Join the CSA", href: "/harvest/csa", variant: "outline" },
        ]}
        gradientClass="from-[#FFF2D6] via-[#F5D8A9] to-[#E9BC7D]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Harvest principles
          </p>
          <ul className="space-y-2">
            <li>Shared stewardship and reciprocity</li>
            <li>Seasonal rhythms and regenerative practice</li>
            <li>Community meals and learning</li>
          </ul>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Paths"
          title="How harvest shows up"
          description="Choose how you want to participate in the harvest cycle."
        />
        <CardGrid cards={harvestPaths} />
      </section>
    </div>
  );
}
