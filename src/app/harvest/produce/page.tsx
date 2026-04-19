import CardGrid from "../../../components/CardGrid";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

const seasonalRhythms = [
  {
    title: "Autumn",
    description: "Roots, herbs, and storage crops for shared pantries.",
  },
  {
    title: "Winter",
    description: "Leafy greens, brassicas, and warming staples.",
  },
  {
    title: "Spring",
    description: "Tender shoots, early fruit, and planting days.",
  },
  {
    title: "Summer",
    description: "Tomatoes, corn, berries, and gathering events.",
  },
];

const practices = [
  {
    title: "Regenerative soil care",
    description:
      "We invest in soil health, water retention, and biodiversity each season.",
  },
  {
    title: "Community harvests",
    description:
      "Harvest days invite neighbors and partners into the field and kitchen.",
  },
];

export default async function HarvestProducePage() {
  const project = await getProjectData("the-harvest");

  if (!project) {
    notFound();
  }

  const relatedWorks = await getRelatedFeaturedWorks("the-harvest", project.title, 3);

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Produce"
        title="Seasonal rhythms"
        description="A seasonal view into what grows across the year and how we share it with community. This page sits inside the wider Harvest field, so the details change with season, weather, soil, and what the land is ready to offer."
        actions={[
          { label: "Back to harvest", href: "/harvest" },
          { label: "Join the CSA", href: "/harvest/csa", variant: "outline" },
        ]}
        gradientClass="from-[#FFF4DE] via-[#F0D9B7] to-[#DCC29A]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Crop planning
          </p>
          <p>
            Seasonal planning is collaborative. Crop mixes respond to community
            needs, soil health, and learning goals.
          </p>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Calendar"
          title="What grows when"
          description="A working seasonal frame for the kinds of crops and rhythms we tend across the year. Actual harvest windows shift with weather, soil conditions, and community demand."
        />
        <CardGrid cards={seasonalRhythms} className="grid gap-6 md:grid-cols-2" />
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Practice"
          title="How we grow"
          description="Land care practices that keep harvest aligned with stewardship."
        />
        <CardGrid cards={practices} className="grid gap-6 md:grid-cols-2" />
      </section>
    </div>
  );
}
