import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";

const operationalPrinciples = [
  {
    number: 1,
    title: "Country Sets the Pace",
    description:
      "The land is the teacher and the limiter. We do not scale beyond land capacity or community readiness. Conservation-first is the baseline.",
  },
  {
    number: 2,
    title: "Community Authority Comes First",
    description:
      "Consent, cultural protocols, and local authority are non-negotiable. OCAP is enforced in code and practice. Elder review is required where culture demands it.",
  },
  {
    number: 3,
    title: "Identity Before Product",
    description:
      "We start with belonging, not features. Events are culture, not marketing. We build slower with the right people than fast with the wrong assumptions.",
  },
  {
    number: 4,
    title: "Build for Handover",
    description:
      "We design for transfer from day one. A Curious Tractor means tools can be repaired locally, adapted by communities, and left behind.",
  },
  {
    number: 5,
    title: "Make with Lived Experience",
    description:
      "Lived experience is not advisory; it is core capability. We build pathways for people rich in lived knowledge, not just formal credentials.",
  },
  {
    number: 6,
    title: "Enterprise Funds the Commons",
    description:
      "Goods, Harvest, and related enterprise fund land care and community value, not extraction. 40% profit-sharing is built into all financial models.",
  },
  {
    number: 7,
    title: "Evidence is Story, Not Surveillance",
    description:
      "We track system-level signals, learn from consented stories, and change practice in response. We do not profile people.",
  },
  {
    number: 8,
    title: "Tools Should Create Space",
    description:
      "Infrastructure should be quiet. The system is the tractor, the humans are the farmers, the community is the harvest.",
  },
  {
    number: 9,
    title: "Share with Care",
    description:
      "We share what is safe and keep what is sensitive. If a story cannot be told without harm, we do not tell it.",
  },
  {
    number: 10,
    title: "Art Returns Us to Listen",
    description:
      "Art is not a layer on top. It is how we make change felt and understood. The LCAA loop only completes when Art returns us to Listen.",
  },
];

const coreValues = [
  {
    title: "Radical Humility",
    description:
      "We don't have all the answers, but we're cultivating solutions together. Every partnership begins with listening.",
  },
  {
    title: "Decentralised Power",
    description:
      "Communities lead; we support. Every tool has a sunset clause and forkable IP. We design for our own obsolescence.",
  },
  {
    title: "Creativity as Disruption",
    description:
      "Revolution starts with imagination. Art opens new possibilities and challenges the status quo.",
  },
  {
    title: "Uncomfortable Truth-telling",
    description:
      "Name extractive systems and work to dismantle them. Honesty builds trust; avoidance perpetuates harm.",
  },
];

const promises = [
  {
    title: "Shared Governance",
    description: "Move toward co-stewardship with community and partners",
  },
  {
    title: "Value in Community Hands",
    description:
      "Social, cultural, environmental and economic value remains with communities",
  },
  {
    title: "40% Profit Sharing",
    description: "Profits flow to community ownership, not extraction",
  },
  {
    title: "Farm as Commons",
    description:
      "The farm is a commons; the studio is the toolkit to practice care, accountability, and collective power",
  },
];

export default function PrinciplesPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Principles"
        title="The commitments that keep the work accountable"
        description="These principles are not aspiration language. They are the constraints and promises ACT returns to when the work gets noisy, pressured, or unclear."
        actions={[
          { label: "See the method", href: "/method" },
          { label: "How we work", href: "/how-we-work", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Why this page exists
          </p>
          <p>
            When a decision is difficult, these principles should make the next move smaller, clearer, and more accountable.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Principled system"
        title="The principles stay public, while the practice keeps learning"
        description="The public site expresses ACT’s values, but the deeper memory sits in the wiki and the field signal keeps arriving through live stories, media, and project evidence. Principles matter most when they change what gets built and shared."
        wiki={{
          href: "/wiki/act-identity",
          label: "Open ACT identity in the wiki",
        }}
        live={{
          sourceLabel: "Principles expressed through live projects and story layers",
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Operational principles", value: operationalPrinciples.length },
          { label: "Core values", value: coreValues.length },
          { label: "Promises", value: promises.length },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Values"
          title="Core values"
          description="The non-negotiables that shape every decision, partnership, and project."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {coreValues.map((value) => (
            <div
              key={value.title}
              className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-3"
            >
              <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                {value.title}
              </h3>
              <p className="text-sm text-[#4D3F33]">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12 space-y-8">
        <SectionHeading
          eyebrow="Commitments"
          title="Our promise"
          description="Accountable commitments we make to communities, partners, and Country."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise) => (
            <div
              key={promise.title}
              className="rounded-2xl border border-[#D8C7A5] bg-white/70 p-6 space-y-2"
            >
              <h3 className="font-semibold text-[#2F3E2E]">{promise.title}</h3>
              <p className="text-sm text-[#4D3F33]">{promise.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10 Operational Principles */}
      <section className="space-y-10">
        <SectionHeading
          eyebrow="Practice"
          title="10 Principles of Practice"
          description="The operational backbone of how we work. When we are unclear, we return here."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {operationalPrinciples.map((principle) => (
            <div
              key={principle.number}
              className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-6 space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4CAF50] text-sm font-bold text-white">
                  {principle.number}
                </span>
                <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                  {principle.title}
                </h3>
              </div>
              <p className="text-sm text-[#4D3F33]">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Philosophy"
          title="Regenerative innovation"
          description="What it means to build differently."
        />
        <div className="prose prose-stone max-w-none">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
                <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                  The Power Take-Off Metaphor
                </h3>
                <p className="text-sm text-[#4D3F33]">
                  Like a tractor's power take-off (PTO), ACT transfers resources,
                  knowledge, and capacity to community-led initiatives. We hand over
                  the keys. The goal isn't to build our own empire—it's to build
                  capacity for communities to drive their own futures.
                </p>
              </div>

              <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
                <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                  Beautiful Obsolescence
                </h3>
                <p className="text-sm text-[#4D3F33]">
                  Our north star is communities owning their narratives, land, and
                  economic futures. We design for our own obsolescence—success means
                  communities no longer need us. Every project includes a sunset
                  clause.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
                <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                  Conservation First
                </h3>
                <p className="text-sm text-[#4D3F33]">
                  At Black Cockatoo Valley, conservation comes first. We practice
                  low-impact, limited-volume activity—no extractive tourism. Revenue
                  is reinvested into habitat care, weed management, and monitoring.
                  The land teaches us; we don't exploit it.
                </p>
              </div>

              <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
                <h3 className="text-lg font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                  Dual-Entity Structure
                </h3>
                <p className="text-sm text-[#4D3F33]">
                  ACT operates as a dual-entity: a charitable CLG for grant
                  eligibility and community protection, plus a mission-locked trading
                  arm for equitable profit-sharing. This structure ensures we can
                  sustain the work while keeping communities at the center.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Voice"
          title="How we communicate"
          description="The tone and approach that guides our storytelling."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Grounded yet Visionary</h4>
            <p className="text-xs text-[#4D3F33]">
              Plant seeds today for forests tomorrow
            </p>
          </div>
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Humble yet Confident</h4>
            <p className="text-xs text-[#4D3F33]">
              We don't have all the answers, but we're cultivating solutions
            </p>
          </div>
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Warm yet Challenging</h4>
            <p className="text-xs text-[#4D3F33]">
              Let's get our hands dirty with hard truths
            </p>
          </div>
          <div className="rounded-2xl border border-[#E1D3BA] bg-white/70 p-6 space-y-2">
            <h4 className="font-semibold text-[#2F3E2E]">Poetic yet Clear</h4>
            <p className="text-xs text-[#4D3F33]">
              Every story is a seed that can grow into change
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
