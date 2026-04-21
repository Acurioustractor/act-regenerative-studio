import { Metadata } from 'next';
import CardGrid from '@/components/CardGrid';
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "@/components/PageHero";
import SectionHeading from '@/components/SectionHeading';
import SignalBars from '@/components/impact/SignalBars';
import ImpactSankey from '@/components/impact/ImpactSankey';
import { EmpathyLedgerConnections } from '@/components/projects/EmpathyLedgerConnections';
import { REAL_INITIATIVES, REAL_CONTEXTS, REAL_EVIDENCE } from '@/data/alma-seeds';

export const metadata: Metadata = {
    title: 'Impact & Learning',
    description: 'What the work is actually doing, initiatives, contexts, community authority, and the evidence behind the claims.',
};

export default function ImpactPage() {
    // Calculate high-level metrics
    const totalInitiatives = REAL_INITIATIVES.length;
    const totalContexts = REAL_CONTEXTS.length;
    const communityLedCount = REAL_INITIATIVES.filter(i => i.community_authority === 'High').length;
    const highEvidenceCount = REAL_INITIATIVES.filter(i => i.evidence_strength === 'High').length;

    return (
        <div className="space-y-20">
            <PageHero
                eyebrow="Impact & learning"
                title="What's working, what we're learning"
                description="How we think about impact: the initiatives, the communities they sit with, who holds authority in each, and the evidence behind each claim. Honest about what's strong and what's still early."
                actions={[
                    { label: "Open the wiki", href: "/wiki" },
                    { label: "Explore projects", href: "/projects", variant: "outline" },
                ]}
            >
                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                        What this page is for
                    </p>
                    <p>
                        A working view, not a polished annual report. Read it to understand how ACT tracks what the work is doing, not as a real-time dashboard.
                    </p>
                </div>
            </PageHero>

            <LivingSystemStrip
                eyebrow="How we hold impact"
                title="Legible learning, not surveillance of people"
                description="We track what the work is doing without flattening people into metrics. The detailed method sits in the wiki; the wider public story continues through projects, works, and stories carried with consent."
                wiki={{
                    href: "/wiki/alma",
                    label: "Read the method",
                }}
                live={{
                    sourceLabel: "Framed here, lived out across projects and storyteller profiles",
                    href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
                }}
                stats={[
                    { label: "Initiatives", value: totalInitiatives },
                    { label: "Contexts", value: totalContexts },
                    { label: "Evidence records", value: REAL_EVIDENCE.length },
                ]}
            />

            <section className="space-y-10">
                <SectionHeading
                    eyebrow="How the work moves"
                    title="From listening to action, across the current set of initiatives"
                    description="A map of how our current work connects listening, communities, authority, and evidence. Useful for pattern-reading, not a real-time audit."
                />
                <div className="w-full h-[500px] bg-[#F6F1E7] border border-[#E1D3BA] rounded-3xl overflow-hidden p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-[#E1D3BA]/50 pb-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--we-warm-brown)]">How the work flows</h3>
                        <span className="text-xs text-[#8B4513] bg-[#F0EAE0] px-2 py-1 rounded-full">Current working set</span>
                    </div>
                    <ImpactSankey />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-white/60 rounded-2xl border border-[#E1D3BA] text-center">
                        <div className="text-4xl font-[var(--font-display)] text-[var(--we-warm-brown)]">{totalInitiatives}</div>
                        <div className="text-xs uppercase tracking-widest mt-2 text-[var(--we-warm-brown)]">Current initiatives</div>
                    </div>
                    <div className="p-6 bg-white/60 rounded-2xl border border-[#E1D3BA] text-center">
                        <div className="text-4xl font-[var(--font-display)] text-[var(--we-warm-brown)]">{totalContexts}</div>
                        <div className="text-xs uppercase tracking-widest mt-2 text-[var(--we-warm-brown)]">Contexts in view</div>
                    </div>
                    <div className="p-6 bg-white/60 rounded-2xl border border-[#E1D3BA] text-center">
                        <div className="text-4xl font-[var(--font-display)] text-[var(--we-warm-brown)]">{communityLedCount}</div>
                        <div className="text-xs uppercase tracking-widest mt-2 text-[var(--we-warm-brown)]">High authority</div>
                    </div>
                    <div className="p-6 bg-white/60 rounded-2xl border border-[#E1D3BA] text-center">
                        <div className="text-4xl font-[var(--font-display)] text-[var(--we-warm-brown)]">{highEvidenceCount}</div>
                        <div className="text-xs uppercase tracking-widest mt-2 text-[var(--we-warm-brown)]">High evidence</div>
                    </div>
                </div>
            </section>

            <section className="space-y-10">
                <SectionHeading
                    eyebrow="Current set"
                    title="What we're working on right now"
                />

                <CardGrid
                    cards={REAL_INITIATIVES.map((init) => ({
                        title: init.title,
                        description: init.outcome_focus,
                        eyebrow: init.type,
                        theme: init.status === 'active' ? 'Active' : 'Concept',
                        meta: (
                            <div className="mt-4 flex gap-6">
                                <SignalBars label="Evidence" level={init.evidence_strength} color="#4CAF50" />
                                <SignalBars label="Authority" level={init.community_authority} color="#D87D4A" />
                            </div>
                        )
                    }))}
                />
            </section>

            <section className="space-y-10">
                <SectionHeading
                    eyebrow="Contexts"
                    title="Contexts in view"
                />
                <div className="grid md:grid-cols-2 gap-6">
                    {REAL_CONTEXTS.map(ctx => (
                        <div key={ctx.name} className="p-6 bg-[#F0EAE0] rounded-2xl border border-transparent hover:border-[#D87D4A] transition">
                            <h3 className="text-xl font-[var(--font-display)] mb-2">{ctx.name}</h3>
                            <p className="text-sm text-[var(--we-warm-brown)] mb-4 uppercase tracking-widest">{ctx.bioregion} • {ctx.cultural_authority}</p>
                            <p className="text-[var(--we-brown)]">{ctx.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-10">
                <SectionHeading
                    eyebrow="Evidence"
                    title="Evidence references"
                />
                <div className="space-y-4">
                    {REAL_EVIDENCE.map((ev, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-xl border border-[#E1D3BA]">
                            <div className="md:w-1/4">
                                <span className="inline-block px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-xs font-semibold mb-2">
                                    {ev.evidence_type}
                                </span>
                                <h4 className="font-semibold text-lg">{ev.title}</h4>
                            </div>
                            <div className="md:w-3/4">
                                <p className="text-[var(--we-brown)] italic mb-2">"{ev.findings}"</p>
                                <p className="text-xs text-[var(--we-warm-brown)] uppercase tracking-wider">{ev.consent_level}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-3xl border border-[#2F2A25] bg-[#11110F] p-8 text-[#F3EBDD] md:p-12">
                <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
                        Interpretation note
                    </p>
                    <h2 className="font-[var(--font-display)] text-2xl font-semibold md:text-3xl">
                        Impact is for learning and accountability, not performance theatre
                    </h2>
                    <p className="max-w-3xl text-sm leading-7 text-[#D7C8B2]">
                        The strongest next version of this page will connect ALMA more directly to canonical wiki pages, project-level live story signals, and clearer provenance. For now, this surface is deliberately framed as a working model rather than overstated as a live dashboard.
                    </p>
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
