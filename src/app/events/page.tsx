import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";

export const metadata = {
  title: "Events",
  description:
    "Community meals, workshops, residencies, and public gatherings, invitations to step onto the valley.",
};

const eventTypes = [
  {
    title: "Community meals",
    description:
      "Seasonal dinners that connect harvest, art, and shared governance.",
  },
  {
    title: "Workshops",
    description:
      "Learning sessions on land care, justice practice, and creative inquiry.",
  },
  {
    title: "Residency showcases",
    description:
      "Open studios and conversations with artists and researchers on site.",
  },
];

const currentPathways = [
  {
    title: "Farm stays and retreats",
    description:
      "Longer, slower invitations onto Jinibara Country through retreats, stays, and place-based learning.",
    href: "/farm/retreats",
    cta: "See retreats",
  },
  {
    title: "Harvest gatherings",
    description:
      "Seasonal meals, local exchange, and community rhythms emerging through The Harvest.",
    href: "/harvest",
    cta: "Open Harvest",
  },
  {
    title: "Residencies and works",
    description:
      "Artist residencies, showcases, and public cultural work connected to the broader studio practice.",
    href: "/art/residencies",
    cta: "See residencies",
  },
];

export default function EventsPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Events"
        title="Gatherings, invitations, and public moments"
        description="ACT gatherings do not all come through one event system. Some happen through the farm, some through The Harvest, some through residencies and works. This page is the invitation rather than a fixed calendar."
        actions={[
          { label: "Start a conversation", href: "/contact" },
          { label: "Visit the farm", href: "/farm", variant: "outline" },
        ]}
        gradientClass="from-[#F6F1E7] via-[#EADFCC] to-[#D7C4A2]"
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Gathering note
          </p>
          <p>
            What belongs here is not an empty event grid. It is a clearer sense of the kinds of invitations ACT makes and where to look next.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="How gatherings work"
        title="Gatherings connected to place, projects, and story"
        description="ACT gatherings emerge through the farm, The Harvest, residencies, exhibitions, and project partnerships. This page is the invitation; the calendar follows the work, not the other way around."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel: "Carried through project and story pages",
          href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
        }}
        stats={[
          { label: "Formats", value: eventTypes.length },
          { label: "Current pathways", value: currentPathways.length },
          { label: "Orientation", value: "Invitation" },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Formats"
          title="Event types"
          description="A mix of gatherings that serve community, place, and public learning."
        />
        <CardGrid cards={eventTypes} className="grid gap-6 md:grid-cols-3" />
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Current pathways"
          title="Where to look now"
          description="Until a fuller event syndication layer exists, these are the main public pathways into ACT gatherings and invitations."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {currentPathways.map((pathway) => (
            <Link
              key={pathway.title}
              href={pathway.href}
              className="group rounded-3xl border border-[#E1D3BA] bg-white/75 p-7 transition hover:-translate-y-1 hover:border-[#4CAF50] hover:shadow-[0_18px_45px_rgba(50,42,31,0.1)]"
            >
              <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
                {pathway.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
                {pathway.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#4CAF50] transition group-hover:gap-3">
                <span>{pathway.cta}</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
