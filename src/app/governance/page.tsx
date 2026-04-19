import LivingSystemStrip from "@/components/LivingSystemStrip";
import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";

const governancePrinciples = [
  {
    title: "Shared decision-making",
    description:
      "Governance is built with community partners, artists, and land stewards.",
  },
  {
    title: "Transparency",
    description:
      "We document commitments, outcomes, and learning in public ways.",
  },
  {
    title: "Reciprocity",
    description:
      "Benefits return to the people and place that make the work possible.",
  },
];

const governancePractices = [
  {
    title: "Listening councils",
    description:
      "Seasonal gatherings to listen, review, and set priorities together.",
  },
  {
    title: "Shared stewardship agreements",
    description:
      "Formal agreements that outline shared responsibility and care.",
  },
  {
    title: "Community accountability",
    description:
      "Structures for feedback, consent, and cultural protocols.",
  },
];

export default function GovernancePage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Governance"
        title="Governance that moves toward shared stewardship"
        description="ACT treats governance as a living practice rather than a policy appendix. The work is to move authority, accountability, and care closer to the people and places most affected."
        actions={[
          { label: "Read the principles", href: "/principles" },
          { label: "Talk with us", href: "/contact", variant: "outline" },
        ]}
        gradientClass="from-[#EDEBE4] via-[#E3D8C7] to-[#D2C0A3]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Governance intent
          </p>
          <p>
            We are interested in governance that can be practiced in public, adapted locally, and held with cultural respect rather than hidden behind institutional abstractions.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Governance layer"
        title="Shared stewardship needs durable memory and live accountability"
        description="Governance on the public site should point toward the real sources of accountability: the ACT wiki for durable commitments, and the live project/story surfaces where people can see what is actually being held."
        wiki={{
          href: "/wiki/governance-consent",
          label: "Open governance notes",
        }}
        live={{
          sourceLabel: "Governance shows up through projects, consent, and live evidence",
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Principles", value: governancePrinciples.length },
          { label: "Practices", value: governancePractices.length },
          { label: "Orientation", value: "Co-stewardship" },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Principles"
          title="How we govern"
          description="Commitments that help move governance from centralized control toward shared stewardship."
        />
        <CardGrid cards={governancePrinciples} className="grid gap-6 md:grid-cols-3" />
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Practice"
          title="Governance in action"
          description="Working practices ACT is trying to hold in public rather than bury inside hidden process."
        />
        <CardGrid cards={governancePractices} className="grid gap-6 md:grid-cols-3" />
      </section>

      <section className="rounded-3xl border border-[#2F2A25] bg-[#11110F] p-8 text-[#F3EBDD] md:p-12">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
            Why this matters
          </p>
          <h2 className="font-[var(--font-display)] text-2xl font-semibold md:text-3xl">
            Governance is where values either become structure or collapse into branding
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-[#D7C8B2]">
            ACT’s public governance language should always point back to shared authority, cultural protocol, and handover. If a governance surface cannot be connected to what communities can actually see, change, or refuse, it is probably just optics.
          </p>
        </div>
      </section>
    </div>
  );
}
