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
        eyebrow="Knowledge query"
        title="Answers should stay connected to the canonical wiki"
        description="This tool sits on top of the same public knowledge system as the rest of the site. The durable memory is still the ACT wiki, and the right next step after a useful answer is often to open the underlying page."
        wiki={{
          href: "/wiki",
          label: "Open ACT wiki",
        }}
        live={{
          sourceLabel: "Public knowledge query surface",
        }}
        stats={[
          { label: "Source", value: "Canonical wiki" },
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
