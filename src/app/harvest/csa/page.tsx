import { CSAInterestForm } from "../../../components/forms/CSAInterestForm";
import { EnquiryExpectations } from "../../../components/forms/EnquiryExpectations";
import CardGrid from "../../../components/CardGrid";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

const shareTypes = [
  {
    title: "Weekly share",
    description:
      "A steady rhythm of fresh produce and seasonal pantry items.",
  },
  {
    title: "Fortnightly share",
    description:
      "Flexible share size for households that travel or cook less often.",
  },
  {
    title: "Community share",
    description:
      "Sponsored boxes for neighbors and partners in the region.",
  },
];

export default async function HarvestCsaPage() {
  const project = await getProjectData("the-harvest");

  if (!project) {
    notFound();
  }

  const relatedWorks = await getRelatedFeaturedWorks("the-harvest", project.title, 3);

  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="CSA"
        title="Harvest shares"
        description="Community Supported Agriculture shares connect you to the land and to each other. We pilot small batches while we build the long-term model."
        actions={[
          { label: "Register interest", href: "#register" },
          { label: "Back to harvest", href: "/harvest", variant: "outline" },
        ]}
        gradientClass="from-[#FFF2D6] via-[#F0D4A3] to-[#E2B47A]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Current pilot
          </p>
          <p>
            Harvest shares are in pilot phase. We will refine the model with
            community partners before scaling.
          </p>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Share types"
          title="Choose your rhythm"
          description="We match share sizes with the season, what the land can offer, and the needs of the community around the harvest."
        />
        <CardGrid cards={shareTypes} className="grid gap-6 md:grid-cols-3" />
      </section>

      <section id="register" className="space-y-10">
        <SectionHeading
          eyebrow="Join the waitlist"
          title="CSA interest form"
          description="Add your name to the waitlist and tell us what kind of share could fit your household. We are building this gradually rather than overselling the first season."
        />
        <EnquiryExpectations
          title="This is a waitlist, not a checkout"
          intro="Harvest shares are being built in rhythm with what the land, the season, and the community can actually support. We would rather stay honest about that than imply fixed weekly certainty before it exists."
          whatHelps={[
            "Tell us what share rhythm is realistic for your household.",
            "Use the notes field for any dietary or household details that matter.",
            "If you are interested in community-supported or sponsored shares, say so clearly.",
          ]}
          whatHappensNext={[
            "We use these signals to shape the first rounds of shares and communication.",
            "Being on the list does not guarantee a share in the first cycle.",
            "When a harvest window is ready, we will contact people with clearer timing and offer details.",
          ]}
        />
        <div className="mx-auto max-w-2xl">
          <CSAInterestForm
            contextLabel="Harvest CSA page"
            additionalTags={["The Harvest", "CSA waitlist route"]}
          />
        </div>
      </section>
    </div>
  );
}
