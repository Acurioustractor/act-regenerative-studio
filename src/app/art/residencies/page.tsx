import { ResidencyForm } from "../../../components/forms/ResidencyForm";
import { EnquiryExpectations } from "../../../components/forms/EnquiryExpectations";
import CardGrid from "../../../components/CardGrid";
import PageHero from "../../../components/PageHero";
import SectionHeading from "../../../components/SectionHeading";
import { ProjectEntryBridgeSection } from "@/components/projects";
import { getProjectData } from "@/lib/projects/get-project-data";
import { getRelatedFeaturedWorks } from "@/lib/works/live-featured-works";
import { notFound } from "next/navigation";

const residencyFormats = [
  {
    title: "Studio residency",
    description:
      "Solo or small team residencies with studio access and land-based research time.",
  },
  {
    title: "Community co-design",
    description:
      "Residencies that embed with community partners and shared governance pilots.",
  },
  {
    title: "Public showcase",
    description:
      "Residencies that culminate in an exhibition, performance, or open studio.",
  },
];

export default async function ArtResidenciesPage() {
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
        eyebrow="Art residencies"
        title="Residencies for art and social change"
        description="Residencies invite artists to work alongside ACT, land, and community. They are rooted in Black Cockatoo Valley and in the wider studio's commitment to place, story, and shared stewardship."
        actions={[
          { label: "Apply now", href: "#apply" },
          { label: "Back to art", href: "/art", variant: "outline" },
        ]}
        gradientClass="from-[#F4E8DD] via-[#E3C8B2] to-[#CFA486]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Residency focus
          </p>
          <p>
            We prioritize projects that honor Country, community governance, and
            regenerative practice.
          </p>
        </div>
      </PageHero>

      <ProjectEntryBridgeSection project={project} relatedWorks={relatedWorks} />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Formats"
          title="Residency models"
          description="Choose the residency structure that best matches your practice, then we shape the details around place, timing, and community fit."
        />
        <CardGrid cards={residencyFormats} className="grid gap-6 md:grid-cols-3" />
      </section>

      <section id="apply" className="space-y-10">
        <SectionHeading
          eyebrow="Apply"
          title="Residency application"
          description="Tell us about your practice, timing, and needs. This is an application and conversation starter, not an automatic booking flow."
        />
        <EnquiryExpectations
          title="What helps a residency application"
          intro="The strongest residency proposals already show some relationship to place, community, or a real pressure the work is trying to hold. We are not looking for polished grant language so much as coherence, fit, and care."
          whatHelps={[
            "Be specific about the work you want to develop and why this place matters to it.",
            "Name any community or Country relationship you already have, or be honest that you do not yet have one.",
            "Tell us if you need time for making, co-design, public sharing, or quiet research.",
          ]}
          whatHappensNext={[
            "We review for fit with place, timing, and what ACT can responsibly host.",
            "Some applications may be better suited to a stay, commission, or another project pathway.",
            "If there is alignment, we follow up with a conversation about scope, timing, and practical needs.",
          ]}
        />
        <div className="mx-auto max-w-2xl">
          <ResidencyForm
            contextLabel="Art residencies page"
            additionalTags={["Works", "Residency route"]}
          />
        </div>
      </section>
    </div>
  );
}
