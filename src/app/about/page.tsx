import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { EmpathyLedgerConnections } from "@/components/projects/EmpathyLedgerConnections";

export const metadata = {
  title: "About",
  description:
    "A regenerative innovation studio on Jinibara Country. Land, story, method, and the commitment to hand over the keys when community leadership is ready.",
};

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

const orientationLinks = [
  {
    title: "Projects",
    description: "The 40-plus initiatives across justice, land, story, and ventures.",
    href: "/projects",
    meta: "See the portfolio",
  },
  {
    title: "People",
    description: "The team, elders, advisors, and partners holding the work.",
    href: "/people",
    meta: "Meet who is building this",
  },
  {
    title: "Partners",
    description: "Community organisations, funders, and co-investors walking with us.",
    href: "/partners",
    meta: "See who is walking with us",
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
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Our promise
          </p>
          <ul className="space-y-2 text-sm leading-6 text-[var(--we-brown)]">
            <li>We build with communities, not for them.</li>
            <li>We treat story as infrastructure, not as marketing.</li>
            <li>We design for handover, not dependence.</li>
          </ul>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="How it stays current"
        title="The work is written down where anyone can find it"
        description="ACT's method, projects, and commitments live in a working wiki. Stories and voices arrive through Empathy Ledger with consent. The site changes as those sources do, it is not a brochure."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel: "Stories and media through Empathy Ledger",
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Method loop", value: "LCAA" },
          { label: "Structure", value: "Dual-entity" },
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

      <section className="rounded-3xl border border-[var(--we-sand)] bg-white/60 p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
              Method
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)] md:text-4xl">
              Listen, Curiosity, Action, Art
            </h2>
            <p className="text-sm leading-7 text-[var(--we-brown)]">
              LCAA is the loop that keeps ACT from jumping to delivery before the listening is real. Every project sits somewhere in this cycle.
            </p>
            <Link
              href="/method"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] underline-offset-4 hover:underline"
            >
              See how the method works
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { letter: "L", word: "Listen" },
              { letter: "C", word: "Curiosity" },
              { letter: "A", word: "Action" },
              { letter: "A", word: "Art" },
            ].map((step) => (
              <div
                key={step.word}
                className="flex flex-col items-start gap-2 rounded-2xl border border-[var(--we-sand)] bg-white/80 p-4"
              >
                <span className="font-[var(--font-display)] text-3xl text-[var(--we-olive)]">
                  {step.letter}
                </span>
                <span className="text-sm font-semibold text-[var(--we-brown)]">
                  {step.word}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--we-sand)] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
              Structure
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)] md:text-4xl">
              Built to protect community value and keep the work moving
            </h2>
            <p className="text-sm leading-7 text-[var(--we-brown)]">
              ACT uses a dual-entity structure so grant-funded, place-based, and community-protective work can sit alongside trading activity without collapsing into the logic of extraction.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                Foundation
              </p>
              <h3 className="mt-2 font-semibold text-[var(--we-olive)]">Community protection</h3>
              <p className="mt-2 text-sm text-[var(--we-brown)]">
                Holds charitable, relationship-based, and public-good work in ways that protect local value and authority.
              </p>
            </div>
            <div className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                Ventures
              </p>
              <h3 className="mt-2 font-semibold text-[var(--we-olive)]">Trading with purpose</h3>
              <p className="mt-2 text-sm text-[var(--we-brown)]">
                Generates revenue, supports the commons, and keeps value circulating back to communities instead of extracting it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Keep exploring"
          title="Where to go from here"
          description="About is a starting point. The depth lives in the people, partners, and projects that make the work real."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {orientationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col justify-between gap-4 rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6 transition hover:border-[var(--we-olive)] hover:bg-white"
            >
              <div className="space-y-2">
                <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                  {link.title}
                </h3>
                <p className="text-sm leading-6 text-[var(--we-brown)]">
                  {link.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)]">
                {link.meta}
                <span aria-hidden className="transition group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
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
