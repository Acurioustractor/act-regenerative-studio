import { AskACT } from '@/components/AskACT';
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: 'Ask ACT | A Curious Tractor',
  description: 'Ask questions across the ACT wiki, projects, methods, and public knowledge surfaces.',
};

export default function AskPage() {
  return (
    <div className="space-y-20">
      <PageHero
        eyebrow="Ask ACT"
        title="Ask a question about the work"
        description="A direct way to find your way into ACT&rsquo;s projects, methods, and thinking. Answers come from the wiki and point you back to the source so you can read the full context yourself."
        actions={[
          { label: "Open the wiki", href: "/wiki" },
          { label: "Explore projects", href: "/projects", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            What to ask
          </p>
          <p>
            Practical questions about projects, methods, places, and the language we use. For sensitive or internal matters, this isn&rsquo;t the right channel, reach out directly instead.
          </p>
        </div>
      </PageHero>

      <LivingSystemStrip
        eyebrow="Ask"
        title="Ask anything about ACT's work"
        description="A conversational way into the ACT wiki. Each answer points back to the source page so you can read the full context."
        wiki={{
          href: "/wiki",
          label: "Browse the wiki",
        }}
        live={{
          sourceLabel: null,
        }}
        stats={[
          { label: "Source", value: "ACT Wiki" },
          { label: "Use", value: "Public query" },
          { label: "Scope", value: "ACT knowledge" },
        ]}
      />

      <section>
        <AskACT />
      </section>
    </div>
  );
}
