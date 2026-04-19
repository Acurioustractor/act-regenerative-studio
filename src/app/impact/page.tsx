import { Metadata } from 'next';
import CardGrid from '@/components/CardGrid';
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "@/components/PageHero";
import SectionHeading from '@/components/SectionHeading';
import SignalBars from '@/components/impact/SignalBars';
import ImpactSankey from '@/components/impact/ImpactSankey';
import { REAL_INITIATIVES, REAL_CONTEXTS, REAL_EVIDENCE } from '@/data/alma-seeds';

export const metadata: Metadata = {
    title: 'Impact & Learning | A Curious Tractor',
    description: 'A working ACT impact surface using ALMA signal sets, evidence patterns, and contextual learning.',
};

export default function ImpactPage() {
    // Calculate high-level metrics
    const totalInitiatives = REAL_INITIATIVES.length;
    const totalContexts = REAL_CONTEXTS.length;
    const communityLedCount = REAL_INITIATIVES.filter(i => i.community_authority === 'High').length;
    const highEvidenceCount = REAL_INITIATIVES.filter(i => i.evidence_strength === 'High').length;

    return (
        <div className="space-y-16">
            <PageHero
                eyebrow="Impact & learning"
                title="A working view of ACT’s ALMA signals"
                description="This page is a learning surface, not a polished impact report. It uses the current ALMA seed set to show how initiatives, contexts, authority, and evidence are being interpreted across the ecosystem."
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
                        Use it to understand how ACT is thinking about impact, authority, and evidence. Do not treat it as a final audited dashboard or a real-time data feed.
                    </p>
                </div>
            </PageHero>

            <LivingSystemStrip
                eyebrow="Impact layer"
                title="Impact should stay legible without becoming surveillance"
                description="ACT uses ALMA to hold learning and evidence without flattening people into metrics. The durable method lives in the wiki, and the wider public story continues through projects, works, and consented story layers."
                wiki={{
                    href: "/wiki/alma",
                    label: "Open ALMA in the wiki",
                }}
                live={{
                    sourceLabel: "Public impact framing with live project/story context around it",
                    href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
                }}
                stats={[
                    { label: "Initiatives", value: totalInitiatives },
                    { label: "Contexts", value: totalContexts },
                    { label: "Evidence records", value: REAL_EVIDENCE.length },
                ]}
            />

            <section className="space-y-8">
                <SectionHeading
                    eyebrow="Working model"
                    title="How initiatives move through the current ALMA signal set"
                    description="This diagram reflects the current seeded initiative set in the public codebase. It is useful for pattern-reading and discussion, not as a claim of real-time completeness."
                />
                <div className="w-full h-[500px] bg-[#F6F1E7] border border-[#E1D3BA] rounded-3xl overflow-hidden p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-[#E1D3BA]/50 pb-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--we-warm-brown)]">ALMA signal flow</h3>
                        <span className="text-xs text-[#8B4513] bg-[#F0EAE0] px-2 py-1 rounded-full">Working seed set</span>
                    </div>
                    <ImpactSankey />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-white/60 rounded-2xl border border-[#E1D3BA] text-center">
                        <div className="text-4xl font-[var(--font-display)] text-[#D87D4A]">{totalInitiatives}</div>
                        <div className="text-xs uppercase tracking-widest mt-2 text-[var(--we-warm-brown)]">Current initiatives</div>
                    </div>
                    <div className="p-6 bg-white/60 rounded-2xl border border-[#E1D3BA] text-center">
                        <div className="text-4xl font-[var(--font-display)] text-[var(--we-warm-brown)]">{totalContexts}</div>
                        <div className="text-xs uppercase tracking-widest mt-2 text-[var(--we-warm-brown)]">Contexts in view</div>
                    </div>
                    <div className="p-6 bg-white/60 rounded-2xl border border-[#E1D3BA] text-center">
                        <div className="text-4xl font-[var(--font-display)] text-[#4CAF50]">{communityLedCount}</div>
                        <div className="text-xs uppercase tracking-widest mt-2 text-[var(--we-warm-brown)]">High authority</div>
                    </div>
                    <div className="p-6 bg-white/60 rounded-2xl border border-[#E1D3BA] flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl font-[var(--font-display)] text-[var(--we-olive)]">{highEvidenceCount}</div>
                            <div className="text-xs uppercase tracking-widest mt-2 text-[var(--we-warm-brown)]">High evidence</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <div className="flex items-end justify-between border-b border-[#E1D3BA] pb-4">
                    <h2 className="text-2xl font-[var(--font-display)]">Current initiative set</h2>
                    <span className="text-xs uppercase tracking-widest text-[var(--we-warm-brown)]">
                        Working ALMA slice
                    </span>
                </div>

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

            {/* Contexts Map (List for now) */}
            <section className="space-y-8">
                <div className="flex items-end justify-between border-b border-[#E1D3BA] pb-4">
                    <h2 className="text-2xl font-[var(--font-display)]">Contexts in view</h2>
                </div>
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

            {/* Evidence Library */}
            <section className="space-y-8">
                <div className="flex items-end justify-between border-b border-[#E1D3BA] pb-4">
                    <h2 className="text-2xl font-[var(--font-display)]">Evidence references</h2>
                </div>
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
        </div>
    );
}
