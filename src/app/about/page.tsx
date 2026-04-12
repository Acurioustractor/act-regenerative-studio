import LivingSystemStrip from "@/components/LivingSystemStrip";
import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";

const identityCards = [
  {
    title: "A regenerative studio",
    description:
      "We hold land practice, justice work, cultural production, and shared infrastructure inside one ecosystem.",
  },
  {
    title: "Jinibara Country",
    description:
      "The work is grounded on Jinibara Country and shaped by reciprocal, place-first practice.",
  },
  {
    title: "Power take-off philosophy",
    description:
      "Like a tractor PTO, we transfer capacity to community-led initiatives and design to hand over the keys.",
  },
  {
    title: "Dual-entity structure",
    description:
      "A charitable foundation and a mission-locked trading arm let us protect community value while sustaining the work.",
  },
];

const methodSteps = [
  {
    title: "Listen",
    description: "Ground in place, people, and lived experience.",
  },
  {
    title: "Curiosity",
    description: "Ask better questions and test new ideas.",
  },
  {
    title: "Action",
    description: "Prototype with partners and build shared tools.",
  },
  {
    title: "Art",
    description: "Translate change into culture and meaning.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="About ACT"
        title="A regenerative studio built to make itself less necessary over time"
        description="A Curious Tractor is a studio, land practice, and shared ecosystem for projects working across justice, stories, art, and community-owned futures."
        actions={[
          { label: "Explore projects", href: "/projects" },
          { label: "See the method", href: "/method", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Our promise
          </p>
          <ul className="space-y-2 text-sm leading-6 text-[#4D3F33]">
            <li>We build with communities, not for them.</li>
            <li>We treat story as infrastructure, not as marketing.</li>
            <li>We design for handover, not dependence.</li>
          </ul>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="ACT system"
        title="The public site stays grounded in living memory"
        description="ACT’s core framing now comes from the canonical wiki, while approved stories, voices, and media can keep arriving through Empathy Ledger. The site is the public surface of a learning system, not a static brochure."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel: "Live story and media layer available through Empathy Ledger",
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Method loop", value: "LCAA" },
          { label: "Profit share", value: "40%" },
          { label: "Orientation", value: "Handover" },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Identity"
          title="Who we are"
          description="The commitments that keep ACT grounded in place, authority, and transfer rather than generic innovation language."
        />
        <CardGrid cards={identityCards} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" />
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Method"
          title="Listen - Curiosity - Action - Art"
          description="LCAA is the loop that keeps ACT from jumping to delivery before the listening is real."
        />
        <CardGrid cards={methodSteps} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" />
      </section>

      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
              Structure
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[#2F3E2E] md:text-4xl">
              Built to protect community value and keep the work moving
            </h2>
            <p className="text-sm leading-7 text-[#4D3F33]">
              ACT uses a dual-entity structure so grant-funded, place-based, and community-protective work can sit alongside trading activity without collapsing into the logic of extraction.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#6B5A45]">
                Foundation
              </p>
              <h3 className="mt-2 font-semibold text-[#2F3E2E]">Community protection</h3>
              <p className="mt-2 text-sm text-[#4D3F33]">
                Holds charitable, relationship-based, and public-good work in ways that protect local value and authority.
              </p>
            </div>
            <div className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#6B5A45]">
                Ventures
              </p>
              <h3 className="mt-2 font-semibold text-[#2F3E2E]">Trading with purpose</h3>
              <p className="mt-2 text-sm text-[#4D3F33]">
                Generates revenue, supports the commons, and keeps 40% profit-sharing in view as a structural commitment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
