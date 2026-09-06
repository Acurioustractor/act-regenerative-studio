import LivingSystemStrip from "@/components/LivingSystemStrip";
import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { EmpathyLedgerConnections } from "@/components/projects/EmpathyLedgerConnections";

import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Governance",
  description:
    "How decisions get made at ACT, shared responsibility, community authority, and the long timelines behind handover.",
  path: "/governance",
});

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
        description="ACT treats governance as ongoing practice, not a policy appendix. The work is to move authority, accountability, and care closer to the people and places most affected."
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
        eyebrow="How we work"
        title="Shared stewardship, with the receipts"
        description="ACT's governance commitments live in the wiki. The proof shows up in the projects and stories, what was decided, by whom, and what changed."
        wiki={{
          href: "/wiki/governance-consent",
          label: "Read the governance notes",
        }}
        live={{
          sourceLabel: null,
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

      <section className="rounded-3xl border border-[#2F2A25] bg-[var(--warm-night)] p-8 text-[var(--warm-cream)] md:p-12">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--warm-gold)]">
            Why this matters
          </p>
          <h2 className="font-[var(--font-display)] text-2xl font-semibold md:text-3xl">
            Governance is where values either become structure or collapse into branding
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-[#D7C8B2]">
            ACT's governance language points back to shared authority, cultural protocol, and handover. If a governance claim can't be connected to what communities can actually see, change, or refuse, it's probably just optics.
          </p>
        </div>
      </section>

      <EmpathyLedgerConnections
        projectSlug="a-curious-tractor"
        projectTitle="A Curious Tractor"
        orgSlug="a-curious-tractor"
      />
    </div>
  );
}
