import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";
import { EmpathyLedgerConnections } from "@/components/projects/EmpathyLedgerConnections";

export const metadata = {
  title: "About",
  description:
    "A Curious Tractor. Two humans, one tractor. We build platforms, places, and tools with communities, designed to be handed back when the season ends.",
};

const founders = [
  {
    eyebrow: "Co-founder. Systems and story.",
    title: "Benjamin Knight",
    description:
      "Ben grew up in Muswellbrook. He spent three years sitting with people on the street as a photographer for Orange Sky. He listened to men talk about hope in a prison in Bolivia. He met Brodie in Mount Isa during NAIDOC week and watched a community already running its own answers. Every job he has had has been an apprenticeship in not interrupting.",
  },
  {
    eyebrow: "Co-founder. Place and hospitality.",
    title: "Nicholas Marchesi OAM",
    description:
      "Nic was twenty when he and Lucas Patchett bolted a washing machine into a van and drove to a park in Brisbane. They went to do laundry. They found themselves doing conversation. Orange Sky grew from there into a national service and earned Nic an OAM for service to community. He now treats every project as something broken that could work again.",
  },
];

const lcaaPhases = [
  {
    title: "Listen",
    description:
      "Sit with place, people, and lived experience. Receive what is offered. Resist the urge to arrive with a fix.",
  },
  {
    title: "Curiosity",
    description:
      "Ask better questions. Prototype. Test. Stay in the not-knowing long enough for the right answer to surface.",
  },
  {
    title: "Action",
    description:
      "Build with communities, not for them. Ship rough, then iterate.",
  },
  {
    title: "Art",
    description:
      "Translate the work into culture. Art is how we know we have learned something.",
  },
];

const projectClusters = [
  {
    title: "Empathy Ledger",
    description:
      "Sovereign storytelling. Communities own their narratives, with consent and cryptographic protocols built in.",
    href: "/empathy-ledger",
  },
  {
    title: "JusticeHub",
    description:
      "Open-source justice network. Forkable program models, civic intelligence, public-money transparency.",
    href: "/justicehub",
  },
  {
    title: "Goods on Country",
    description:
      "Circular manufacturing on Country. Community ownership, materials with stories, products that last.",
    href: "/goods",
  },
  {
    title: "The Harvest, ACT Farm, Black Cockatoo Valley",
    description:
      "Place and land practice. Witta hub, Jinibara Country regeneration, retreats, residencies.",
    href: "/farm",
  },
  {
    title: "The Studio",
    description:
      "Gold.Phone, The Confessional, Uncle Allan, CONTAINED. Art as the fourth phase, the highest expression of the work.",
    href: "/art",
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
    title: "Economy",
    description: "How the money moves, where it lands, and why we built it this way.",
    href: "/economy",
    meta: "Read the four lanes",
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
        title="Two humans, one tractor"
        description="A Curious Tractor is a studio, land practice, and shared ecosystem for projects working across justice, stories, art, and community-owned futures. We build with communities, designed to be handed back when the season ends."
        actions={[
          { label: "Explore projects", href: "/projects" },
          { label: "How the money moves", href: "/economy", variant: "outline" },
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

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Two humans"
          title="The why under everything"
          description="ACT was co-founded by two people whose practice predates the org. The org is the vehicle. The drive is older."
        />
        <CardGrid cards={founders} className="grid gap-6 md:grid-cols-2" />
        <div className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6 md:p-8">
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Different doors into the same kitchen. Ben moves through systems and story. Nic moves through place and people. Both build, both connect, both make art at the end because they cannot help it.
          </p>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="What ACT is"
          title="Not a charity, not a consultancy, not an NGO"
          description="A regenerative innovation ecosystem that powers communities without owning what it builds."
        />
        <div className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-8 md:p-12 space-y-4">
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            The name comes from the agricultural Power Take-Off mechanism, the connection shaft that transfers engine power from a tractor to attached implements. A tractor powers things. The farmer directs it. When the season ends, it is unhitched.
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            This is not a brand metaphor. It is a delivery philosophy. We build with communities, not for them. The measure of success is not reach or scale. It is that ACT becomes unnecessary.
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            ACT partners with First Nations communities and is not a First Nations organisation.
          </p>
        </div>
      </section>

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
          { label: "Structure", value: "Three Pty + charity" },
          { label: "Orientation", value: "Handover" },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Method"
          title="Listen, Curiosity, Action, Art"
          description="Our operating loop. Not a checklist. Art returns us to Listen, and the cycle continues."
        />
        <CardGrid cards={lcaaPhases} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" />
        <div className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-8 md:p-12">
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Listen, Curiosity, Action, Art did not come from a whiteboard. It is a description of what already happens when Ben builds, Nic connects, and both make art at the end. The method is the founders' practice externalised, then offered to the work.{" "}
            <Link
              href="/method"
              className="font-semibold text-[var(--we-olive)] underline-offset-4 hover:underline"
            >
              See how the method works
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--we-sand)] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
              Structure
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)] md:text-4xl">
              Three Pty Ltds plus a charity
            </h2>
            <p className="text-sm leading-7 text-[var(--we-brown)]">
              ACT trades through A Curious Tractor Pty Ltd (the trade muscle) plus Harvest Pty Ltd and Farm Pty Ltd, which carry their own ledgers for The Harvest and ACT Farm. A Kind Tractor Ltd is the charity, currently dormant, ready to activate when the time comes.
            </p>
            <p className="text-sm leading-7 text-[var(--we-brown)]">
              The structure costs more in compliance and saves more in legibility. Each project's economic story stays its own.
            </p>
            <Link
              href="/economy"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] underline-offset-4 hover:underline"
            >
              How the money moves
              <span aria-hidden>&rarr;</span>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Trade muscle", name: "A Curious Tractor Pty Ltd" },
              { label: "Place ledger", name: "Harvest Pty Ltd" },
              { label: "Land ledger", name: "Farm Pty Ltd" },
              { label: "Public-good cap", name: "A Kind Tractor Ltd" },
            ].map((entity) => (
              <div
                key={entity.name}
                className="rounded-2xl border border-[#D8C7A5] bg-white/80 p-5"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                  {entity.label}
                </p>
                <h3 className="mt-2 font-semibold text-[var(--we-olive)]">
                  {entity.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="What we build"
          title="The cluster"
          description="A small group of interconnected projects spanning place, technology, justice, and art. Not siloed programs. Components of a single ecosystem."
        />
        <CardGrid cards={projectClusters} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Discipline"
          title="Beautiful obsolescence"
          description="Why we build for handover from day one."
        />
        <div className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-8 md:p-12 space-y-4">
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Every platform, tool, and engagement is designed with handover in mind from day one. Sunset clauses in agreements. Documentation as a deliverable. Training embedded in delivery. Open-source codebases.
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            The test for any ACT project: can the community run this without us? Can they modify it? Can they export their data? If any answer is no, the work is not finished.
          </p>
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
