import CardGrid from "../../components/CardGrid";
import PageHero from "../../components/PageHero";
import SectionHeading from "../../components/SectionHeading";

export const metadata = {
  title: "Economy",
  description:
    "How money moves through ACT. The four lanes (To Us, To Down, To Grow, To Others), the structure that carries them, and why we built it this way.",
};

const lanes = [
  {
    eyebrow: "Lane 1",
    title: "To Us",
    description:
      "Director wages and trust distributions. The founders being able to keep showing up for the work. Two humans hold the soul. If they cannot stay, the soul has nowhere to live.",
  },
  {
    eyebrow: "Lane 2",
    title: "To Down",
    description:
      "Debts paid, old liabilities cleared, receivables collected. An organisation that owes money cannot move freely. Clearing the past is what frees the future.",
  },
  {
    eyebrow: "Lane 3",
    title: "To Grow",
    description:
      "Reinvestment into projects. Equipment, sites, engineering hours, travel. Growth here is not scale. It is depth.",
  },
  {
    eyebrow: "Lane 4",
    title: "To Others",
    description:
      "Donations, fellowship payments, anchor partner support. ACT exists in service of communities. A dollar that never reaches a community has not done its job.",
  },
];

const quarterTemplate = [
  {
    title: "To Us",
    description:
      "Director wages and trust distributions for the quarter.",
  },
  {
    title: "To Down",
    description:
      "Receivables collected, BAS obligations met, legacy liabilities cleared.",
  },
  {
    title: "To Grow",
    description:
      "Site costs, equipment, engineering hours, project travel.",
  },
  {
    title: "To Others",
    description: "Fellowship payments and anchor partner support.",
  },
];

const lcaaPhases = ["Listen", "Curiosity", "Action", "Art"];

export default function EconomyPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="How the money moves"
        title="The Four Lanes"
        description="ACT earns money through services, contracts, and grants. This page tells you where it goes, and why we built our economy this way. It is not a P&L. It is the story our money tells."
        actions={[
          { label: "Read the history", href: "/about" },
          { label: "How we work", href: "/how-we-work", variant: "outline" },
        ]}
      />

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Premise"
          title="Most regenerative orgs forget the regenerators"
          description="Why we built our economy the way we did."
        />
        <div className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-8 md:p-12 space-y-4">
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Most organisations doing this kind of work underpay their founders until those founders burn out, then leave. The work either dies with them or gets absorbed by a generation of consultants who do not carry the soul.
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Our economy is built to refuse that pattern. Custodianship over ownership only works if the custodians can keep showing up. That means money has to flow in four directions, not one. To us. To our debts. To our growth. To the communities we serve.
          </p>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="The lanes"
          title="Where every dollar lands"
          description="Each dollar that moves through ACT lands in one of four lanes. None at the expense of the others."
        />
        <CardGrid cards={lanes} className="grid gap-6 md:grid-cols-2" />
      </section>

      <section className="rounded-3xl border border-[var(--we-sand)] bg-gradient-to-br from-[#F6F1E7] via-[#E7DDC7] to-[#D7C4A2] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
              Structure
            </p>
            <h2 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--we-olive)] md:text-4xl">
              Why separate ledgers, not one company
            </h2>
            <p className="text-sm leading-7 text-[var(--we-brown)]">
              A Curious Tractor Pty Ltd is the trade muscle. The place and land ledgers for The Harvest and ACT Farm are being designed with our accountant and are not yet separate companies, so we track them as their own ledgers in the meantime. The charitable work has its own independent home in The Butterfly Movement Ltd, which we do not own.
            </p>
            <p className="text-sm leading-7 text-[var(--we-brown)]">
              The structure costs more in compliance. It saves more in legibility. Each project's economic story stays its own. We can see whether each one pays its way, where each is growing, where each needs help. A single ledger would have hidden all of that.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                Trade muscle
              </p>
              <h3 className="mt-2 font-semibold text-[var(--we-olive)]">A Curious Tractor Pty Ltd</h3>
              <p className="mt-2 text-sm text-[var(--we-brown)]">
                Service revenue, contracts, corporate-trustee grants. Holds the founder relationship and the cross-cutting work.
              </p>
            </div>
            <div className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                Place ledger
              </p>
              <h3 className="mt-2 font-semibold text-[var(--we-olive)]">The Harvest</h3>
              <p className="mt-2 text-sm text-[var(--we-brown)]">
                Its own P&L for the Witta place work. The entity that will hold it is still being designed.
              </p>
            </div>
            <div className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                Land ledger
              </p>
              <h3 className="mt-2 font-semibold text-[var(--we-olive)]">ACT Farm</h3>
              <p className="mt-2 text-sm text-[var(--we-brown)]">
                Its own P&L for conservation, land practice, residencies and BCV. Land is kept separate from trading risk.
              </p>
            </div>
            <div className="rounded-3xl border border-[#D8C7A5] bg-white/75 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                Charitable home
              </p>
              <h3 className="mt-2 font-semibold text-[var(--we-olive)]">The Butterfly Movement Ltd</h3>
              <p className="mt-2 text-sm text-[var(--we-brown)]">
                An independent ACNC-registered charity with DGR status and its own board. Tax-deductible gifts go here, not to any company we own.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="What gets reported"
          title="How a quarter shows up"
          description="The shape of our quarterly reporting. The dollar amounts stay private. The shape is public. Specific projects and quarter-by-quarter detail will populate this section once the lane tagging is wired into our books."
        />
        <CardGrid cards={quarterTemplate} className="grid gap-6 md:grid-cols-2" />
        <div className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-8 md:p-12 space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            Listen, Curiosity, Action, Art
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Every dollar is also tagged to one of our four method phases. The quarterly split tells us whether we are living the method or just talking about it. The percentages will publish here once the phase tagging is live.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
            {lcaaPhases.map((phase) => (
              <div
                key={phase}
                className="rounded-2xl border border-[var(--we-sand)] bg-white/80 p-4 text-center"
              >
                <span className="font-[var(--font-display)] text-2xl text-[var(--we-olive)]">
                  {phase[0]}
                </span>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--we-warm-brown)]">
                  {phase}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Discipline"
          title="Built to be handed back"
          description="Beautiful obsolescence applied to money."
        />
        <div className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-8 md:p-12 space-y-4">
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Same discipline as everything else we do. We are not building a financial empire. We are building a system that, if the founders stepped away, could still run.
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Standalone P&Ls so each project's economy is portable. Documentation good enough that someone else could read the books. Charitable work held by a charity we do not own, so the public-good money never depends on us staying. We are not building this to be inherited by family. We are building it to be handed back to the work itself.
          </p>
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          eyebrow="Transparency"
          title="Why we tell you this"
          description="The case for making the shape of our money public."
        />
        <div className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-8 md:p-12 space-y-4">
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Some of the money that moves through ACT is your money. Government grants. Philanthropic capital that would otherwise have funded other things. Service revenue from organisations whose missions overlap with ours.
          </p>
          <p className="text-sm leading-7 text-[var(--we-brown)]">
            Telling you where it lands is the cost of asking for it in the first place. If the shape on this page ever stops looking like ACT, we owe you and ourselves an explanation.
          </p>
        </div>
      </section>
    </div>
  );
}
