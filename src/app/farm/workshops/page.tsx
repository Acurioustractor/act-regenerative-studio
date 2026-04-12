import CardGrid from "../../../components/CardGrid";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

const workshopThemes = [
  {
    title: "Soil to story",
    description:
      "Hands-on soil care, composting, and land-based storytelling methods.",
  },
  {
    title: "Justice innovation labs",
    description:
      "Collaborative systems prototyping grounded in community needs.",
  },
  {
    title: "Art and cultural practice",
    description:
      "Creative workshops that translate listening into shared culture.",
  },
  {
    title: "Co-governance skills",
    description:
      "Tools for shared decision-making and community stewardship.",
  },
];

export default async function FarmWorkshopsPage() {
  const project = await getProjectData("black-cockatoo-valley");

  if (!project) {
    notFound();
  }

  const relatedWorks = await getRelatedFeaturedWorks(
    "black-cockatoo-valley",
    project.title,
    3
  );

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Workshops"
        title="Learning on Country"
        description="Workshops at the farm blend land care, justice practice, and creative inquiry. They sit inside the wider Black Cockatoo Valley project rather than as standalone training products."
        actions={[
          { label: "Host a workshop", href: "/contact" },
          { label: "Back to farm", href: "/farm", variant: "outline" },
        ]}
        gradientClass="from-[#EEF4EA] via-[#D8E7CF] to-[#BED4B2]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Community-led
          </p>
          <p>
            We co-design workshops with local partners and invite facilitators
            who are grounded in place-based practice.
          </p>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Themes"
          title="Workshop streams"
          description="Sample themes we adapt to each season, host group, and field question."
        />
        <CardGrid cards={workshopThemes} className="grid gap-6 md:grid-cols-2" />
      </section>
    </div>
  );
}
