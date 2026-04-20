import Link from "next/link";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";

export const metadata = {
  title: "Method",
  description:
    "Listen, curiosity, action, art. The sequence that shapes every project ACT takes on.",
};

const lcaaSteps = [
  {
    title: "Listen",
    description:
      "Start with place, people, and histories that are often ignored. Deep listening comes before design.",
  },
  {
    title: "Curiosity",
    description:
      "Ask better questions, test assumptions, and let emerging insight shape the next move.",
  },
  {
    title: "Action",
    description:
      "Build useful things with communities, not for them. Prototype carefully and stay accountable.",
  },
  {
    title: "Art",
    description:
      "Translate learning into culture, meaning, and public pressure. Art returns the loop back to listening.",
  },
];

const methodCommitments = [
  {
    title: "Country sets the pace",
    description:
      "The land is the teacher and the limiter. We do not scale beyond land capacity or community readiness.",
  },
  {
    title: "Community authority comes first",
    description:
      "Consent, local authority, and cultural protocol are not optional layers. They shape the work itself.",
  },
  {
    title: "Build for handover",
    description:
      "The goal is not dependence. Tools, knowledge, and pathways should be transferable and locally repairable.",
  },
  {
    title: "Art is part of the method",
    description:
      "Art is not a decorative layer. It is one of the main ways change becomes felt, legible, and shareable.",
  },
];

const deeperPages = [
  {
    title: "Principles",
    description:
      "The values, promises, and practice commitments that shape every ACT decision.",
    href: "/principles",
    cta: "Read principles",
  },
  {
    title: "How we work",
    description:
      "The practical rhythms, collaboration pathways, and operating habits that carry the work.",
    href: "/how-we-work",
    cta: "See the rhythms",
  },
];

export default function MethodPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Method"
        title="The method behind the work"
        description="ACT uses LCAA as a working loop for regenerative innovation. We listen deeply, stay curious, build with people, and translate learning into art that can travel further."
        actions={[
          { label: "Explore projects", href: "/projects" },
          { label: "Read our principles", href: "/principles", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Why it matters
          </p>
          <p>
            Method is how we stop urgency from flattening place, community
            authority, and care into generic delivery.
          </p>
        </div>
      </PageHero>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="LCAA"
          title="Listen. Curiosity. Action. Art."
          description="This loop is how ACT moves from field signal to practical response without losing meaning."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {lcaaSteps.map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-[#E1D3BA] bg-white/75 p-7"
            >
              <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--we-brown)]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--we-sand)] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
              Practice commitments
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)] md:text-4xl">
              Method only matters if it changes behavior
            </h2>
            <p className="text-sm text-[var(--we-brown)]">
              These are some of the commitments that keep ACT's method grounded in
              place, reciprocity, and handover rather than generic innovation
              language.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {methodCommitments.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6"
              >
                <h3 className="font-semibold text-[var(--we-olive)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--we-brown)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Go deeper"
          title="Two supporting pages"
          description="The method page is the public overview. These pages go deeper into values and operating rhythms."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {deeperPages.map((page) => (
            <Link
              key={page.title}
              href={page.href}
              className="group rounded-3xl border border-[#E1D3BA] bg-white/75 p-7 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_18px_45px_rgba(50,42,31,0.1)]"
            >
              <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {page.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--we-brown)]">{page.description}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--we-olive)] transition group-hover:gap-3">
                <span>{page.cta}</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
