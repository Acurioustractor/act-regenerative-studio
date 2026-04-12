import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import { EnquiryExpectations } from "../../components/forms/EnquiryExpectations";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";

const partnerTypes = [
  {
    title: "Community Partners",
    description:
      "First Nations communities, grassroots organizations, and local groups we work alongside to co-design solutions.",
    examples: "Indigenous land councils, youth justice programs, community cooperatives",
  },
  {
    title: "Research Partners",
    description:
      "Universities, evaluators, and knowledge partners helping build evidence without flattening people into data points.",
    examples: "University of the Sunshine Coast, Indigenous research networks, evaluators aligned with consent-first practice",
  },
  {
    title: "Funding Partners",
    description:
      "Philanthropic foundations, government programs, and aligned capital partners helping the work stay accountable to communities and place.",
    examples: "Government innovation funds, philanthropic trusts, long-term aligned capital",
  },
  {
    title: "Capability Partners",
    description:
      "People and organizations who help carry specific capabilities like manufacturing, cultural production, stewardship, or technical infrastructure.",
    examples: "Service providers, creative collaborators, technical and place-based partners",
  },
];

const partnershipPrinciples = [
  {
    title: "Community leads",
    description:
      "Partners don't speak for communities. We ensure community voice is centered in all decisions.",
  },
  {
    title: "Shared ownership",
    description:
      "We build toward community ownership of tools, IP, and outcomes. 40% of profits flow back.",
  },
  {
    title: "Transparent reporting",
    description:
      "Partners receive honest updates about progress, challenges, and impact—good and bad.",
  },
  {
    title: "Long-term commitment",
    description:
      "We prefer relationships that can hold complexity over time, even when a specific project is small or temporary.",
  },
];

const currentPartnerships = [
  {
    name: "June's Patch",
    description:
      "Healthcare worker wellbeing program with Wishlist community and University of the Sunshine Coast. Prescription to nature for healthcare workers.",
    type: "Research Partnership",
  },
  {
    name: "Orange Sky Australia",
    description:
      "Co-founder Nicholas Marchesi also co-founded Orange Sky. This foundational relationship informs our approach to scaled social impact.",
    type: "Founding Relationship",
  },
];

export default function PartnersPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Partners"
        title="Partnerships that can hold real place, pressure, and transfer"
        description="ACT is built through relationships, not client capture. The best partnerships help work move closer to community ownership, better evidence, and more durable local capability."
        actions={[
          {
            label: "Start a conversation",
            href: "/contact?type=project-partnership&source=partners-page&context=partner-conversation",
          },
          { label: "How we work", href: "/how-we-work", variant: "outline" },
        ]}
      >
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
            Our approach
          </p>
          <p>
            We do not treat communities as delivery channels or stories as proof-of-work. Every partnership should improve authority, clarity, and what can be handed over.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Partnership layer"
        title="Partnerships sit on top of shared memory and live proof"
        description="The public site can show what ACT is, but the deeper memory lives in the wiki and the proof keeps arriving through project stories, voices, and media. Good partnership conversations should not begin from a blank page."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel: "Projects, stories, and media continue through Empathy Ledger",
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Partner types", value: partnerTypes.length },
          { label: "Working principles", value: partnershipPrinciples.length },
          { label: "Current examples", value: currentPartnerships.length },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Types"
          title="Different ways people and organizations work with ACT"
          description="Not every relationship asks for the same thing. These categories are there to make fit clearer, not to force everyone into the same template."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {partnerTypes.map((type) => (
            <div
              key={type.title}
              className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4"
            >
              <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                {type.title}
              </h3>
              <p className="text-sm text-[#4D3F33]">{type.description}</p>
              <p className="text-xs text-[#6B5A45]">
                <span className="font-medium">Examples:</span> {type.examples}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#E3D4BA] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12 space-y-8">
        <SectionHeading
          eyebrow="Principles"
          title="How we partner"
          description="The commitments that keep partnership from sliding into extraction, optics, or vague alignment language."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {partnershipPrinciples.map((principle) => (
            <div
              key={principle.title}
              className="rounded-2xl border border-[#D8C7A5] bg-white/70 p-6 space-y-2"
            >
              <h3 className="font-semibold text-[#2F3E2E]">{principle.title}</h3>
              <p className="text-sm text-[#4D3F33]">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Featured"
          title="Current partnerships"
          description="A selection of the relationships that shape our work."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {currentPartnerships.map((partnership) => (
            <div
              key={partnership.name}
              className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4"
            >
              <div className="inline-block rounded-full bg-[#E5F4E4] px-3 py-1 text-xs font-medium text-[#2F3E2E]">
                {partnership.type}
              </div>
              <h3 className="text-xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
                {partnership.name}
              </h3>
              <p className="text-sm text-[#4D3F33]">{partnership.description}</p>
            </div>
          ))}
        </div>
      </section>

      <EnquiryExpectations
        eyebrow="Partnership enquiries"
        title="What helps a partnership conversation land well"
        intro="A useful partnership conversation starts with the real field, the real constraints, and a truthful sense of why ACT is in the picture. We are usually more useful where there is place, community authority, live pressure, and a need for shared infrastructure rather than outsourced delivery."
        whatHelps={[
          "Name the project, place, institution, or community context directly.",
          "Be clear about whether you are exploring early fit, active delivery, funding, or a longer strategic relationship.",
          "If budget, governance, or reporting constraints already exist, say so early.",
        ]}
        whatHappensNext={[
          "We review for fit, timing, and whether the relationship strengthens community authority rather than just expanding ACT's surface area.",
          "If there is alignment, the next step is usually a smaller working conversation with the right people in the field.",
          "If the fit is weak or the route is wrong, we would rather say that early than perform alignment.",
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Collaborate"
          title="Work with us"
          description="If there is real alignment, the next step is usually a smaller, clearer conversation rather than a bigger pitch deck."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
            <div className="text-3xl">1</div>
            <h3 className="font-semibold text-[#2F3E2E]">Reach out</h3>
            <p className="text-sm text-[#4D3F33]">
              Contact us with your idea, challenge, or interest. We respond to
              every inquiry and prioritize community-led initiatives.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
            <div className="text-3xl">2</div>
            <h3 className="font-semibold text-[#2F3E2E]">Explore fit</h3>
            <p className="text-sm text-[#4D3F33]">
              We'll have an initial conversation to understand alignment,
              capacity, and what partnership might look like.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E1D3BA] bg-white/70 p-8 space-y-4">
            <div className="text-3xl">3</div>
            <h3 className="font-semibold text-[#2F3E2E]">Design together</h3>
            <p className="text-sm text-[#4D3F33]">
              If there's a fit, we co-design the partnership structure, ensuring
              community benefit and mutual accountability.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/contact?type=project-partnership&source=partners-page&context=partner-conversation"
            className="inline-flex rounded-full bg-[#4CAF50] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#3D9143]"
          >
            Get in touch
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-[#BFA883] bg-[#F7F0E2]/70 p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-semibold text-[#2F3E2E] font-[var(--font-display)]">
            Looking to back place-based regenerative work?
          </h2>
          <p className="text-sm text-[#4D3F33]">
            ACT welcomes relationships with philanthropic foundations, government programs, and aligned capital partners who care about handover, community authority, and evidence that does not become surveillance.
          </p>
          <Link
            href="/contact?type=project-partnership&source=partners-page&context=funding-partnership"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4CAF50] hover:gap-3 transition"
          >
            <span>Discuss funding partnership</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
