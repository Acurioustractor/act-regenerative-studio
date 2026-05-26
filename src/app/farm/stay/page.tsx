import { FarmStayForm } from "../../../components/forms/FarmStayForm";
import { EnquiryExpectations } from "../../../components/forms/EnquiryExpectations";
import CardGrid from "../../../components/CardGrid";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

const stayOptions = [
  {
    title: "Residency cabins",
    description:
      "Quiet studios for artists, researchers, and collaborators staying on Country.",
  },
  {
    title: "Farmhouse stays",
    description:
      "Shared accommodation for longer working visits and field research.",
  },
  {
    title: "Group accommodation",
    description:
      "Flexible layouts for teams, retreats, and intergenerational gatherings.",
  },
];

import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Stay",
  description:
    "Accommodation at Black Cockatoo Valley. Slow down, stay close to the work, and join the rhythm of the land, shaped by stewardship and season.",
  path: "/farm/stay",
});

export default async function FarmStayPage() {
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
        eyebrow="Stay"
        title="Accommodation on the farm"
        description="Slow down, stay close to the work, and join the rhythm of the land. These stays sit inside the wider Black Cockatoo Valley field, so they are shaped by stewardship, seasonality, and what the place can actually hold."
        actions={[
          { label: "Request dates", href: "#register" },
          { label: "Back to farm", href: "/farm", variant: "outline" },
        ]}
        gradientClass="from-[#F7F2E8] via-[#EADFCB] to-[#D7C4A2]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Residency focus
          </p>
          <ul className="space-y-2">
            <li>Creative and research residencies</li>
            <li>Community-led convenings</li>
            <li>Land-based learning and rest</li>
          </ul>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Stay options"
          title="Accommodation formats"
          description="A flexible mix of ways to stay on Country, depending on whether you are coming for research, creative development, retreat time, or longer field work."
        />
        <CardGrid cards={stayOptions} className="grid gap-6 md:grid-cols-3" />
      </section>

      <section id="register" className="space-y-10">
        <SectionHeading
          eyebrow="Bookings"
          title="Register interest for a stay"
          description="Tell us about your timing, purpose, and accessibility needs. This is an enquiry pathway, not an instant booking system."
        />
        <EnquiryExpectations
          title="What helps us assess a stay"
          intro="Black Cockatoo Valley is a live place with shifting seasonal, stewardship, and hosting capacity. The more grounded your request is, the easier it is to see whether the timing and fit are right."
          whatHelps={[
            "Tell us what brings you to the farm and whether this is research, rest, writing, making, or team time.",
            "Name your likely dates, group size, and any access or care needs early.",
            "If your stay connects to a live ACT project, say which one.",
          ]}
          whatHappensNext={[
            "We review for fit, timing, and what the land can hold in that season.",
            "Some requests may be redirected toward residencies, retreats, or workshops instead.",
            "If there is a fit, we follow up with a more practical conversation about dates and logistics.",
          ]}
        />
        <div className="mx-auto max-w-2xl">
          <FarmStayForm
            contextLabel="Farm stay page"
            additionalTags={["Black Cockatoo Valley", "Farm stay route"]}
          />
        </div>
      </section>
    </div>
  );
}
