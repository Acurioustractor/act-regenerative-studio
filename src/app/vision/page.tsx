import fs from 'fs';
import path from 'path';
import Link from "next/link";
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';
import { VisionSearch } from '@/components/ui/VisionSearch';

export default async function VisionPage() {
    const filePath = path.join(process.cwd(), 'src/data/vision/vision.md');
    const content = fs.readFileSync(filePath, 'utf8');

    return (
        <div className="space-y-20">
            <PageHero
                eyebrow="Vision"
                title="A seasonal map for where ACT is trying to go"
                description="This page holds a working vision document rather than a polished brochure. It is a directional map: part creative brief, part operating thesis, part reminder of what the ecosystem is trying to grow next."
                actions={[
                    { label: "Explore projects", href: "/projects" },
                    { label: "See the method", href: "/method", variant: "outline" },
                ]}
            >
                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#6B5A45]">
                        Seasonal note
                    </p>
                    <p>
                        Vision is useful when it sharpens the next season of work. It becomes noise when it floats above place, capacity, and what the ecosystem can actually hold.
                    </p>
                </div>
            </PageHero>

            <LivingSystemStrip
                eyebrow="Working direction"
                title="Vision should stay connected to the wiki, not drift into a standalone manifesto"
                description="This page holds a seasonal directional document, but the durable memory still lives in the ACT wiki and the public site still reflects live field material through the wider system. Vision is most useful when it stays tied to place, projects, and real signals."
                wiki={{
                    href: "/wiki/roadmap-2026",
                    label: "Open roadmap in the wiki",
                }}
                live={{
                    sourceLabel: "Projects and public proof continue through the live story layer",
                    href: `${process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathyledger.com"}/projects`,
                }}
                stats={[
                    { label: "Frame", value: "Seasonal" },
                    { label: "Orientation", value: "Place-first" },
                    { label: "Method", value: "LCAA" },
                ]}
            />

            <section className="space-y-10">
                <SectionHeading
                    eyebrow="Search"
                    title="Find themes inside the vision"
                    description="Use search if you are looking for a specific thread, project, or phrase inside the seasonal map."
                />
                <div className="rounded-3xl border border-[#E1D3BA] bg-white/80 p-8">
                    <VisionSearch />
                </div>
            </section>

            <section className="space-y-10">
                <SectionHeading
                    eyebrow="Document"
                    title="ACT 2026: The Harvest Year"
                    description="A working directional document retained inside the public shell so it can stay readable without becoming a second design language."
                />
                <main className="rounded-[32px] border border-[#E3D4BA] bg-white/85 p-8 md:p-12">
                    <MarkdownViewer content={content} />
                </main>
            </section>

            <section className="rounded-3xl border border-[#2F2A25] bg-[#11110F] p-8 text-[#F3EBDD] md:p-12">
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#CFA16B]">
                            Next move
                        </p>
                        <h2 className="font-[var(--font-display)] text-2xl font-semibold">
                            Direction is only useful if it changes the next season of work
                        </h2>
                        <p className="max-w-2xl text-sm leading-7 text-[#D7C8B2]">
                            The vision should feed the roadmap, the project pages, and the method pages. If it starts to drift away from those living surfaces, it should be revised rather than protected as doctrine.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/projects"
                            className="rounded-full bg-[#CFA16B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#11110F] transition hover:bg-[#E0B680]"
                        >
                            Open projects
                        </Link>
                        <Link
                            href="/wiki"
                            className="rounded-full border border-[#CFA16B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#F3EBDD] transition hover:bg-[#1B1A16]"
                        >
                            Open wiki
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
