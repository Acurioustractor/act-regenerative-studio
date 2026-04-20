import { AskACT } from '@/components/AskACT';
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: 'Ask ACT | A Curious Tractor',
  description: 'Ask questions across the ACT wiki, projects, methods, and public knowledge surfaces.',
};

export default function AskPage() {
  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="Ask ACT"
        title="Query the public ACT knowledge layer"
        description="Use this surface to ask questions across the ACT wiki, project framing, methods, and public knowledge. It is a reading aid for the living system, not a replacement for shared judgment."
        actions={[
          { label: "Open the wiki", href: "/wiki" },
          { label: "Explore projects", href: "/projects", variant: "outline" },
        ]}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
            How to use it
          </p>
          <p>
            Ask practical questions about ACT’s projects, methods, places, and working language. For sensitive or internal matters, the public shell is not the right source.
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

      <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-4">
        <AskACT />
      </main>
    </div>
  );
}
