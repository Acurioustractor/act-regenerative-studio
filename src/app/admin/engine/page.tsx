import fs from 'fs';
import path from 'path';
import LivingSystemStrip from "@/components/LivingSystemStrip";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { MarkdownViewer } from '@/components/ui/MarkdownViewer';

export default async function EnginePage() {
    const filePath = path.join(process.cwd(), 'src/data/engine/workflow.md');
    const content = fs.readFileSync(filePath, 'utf8');

    return (
        <div className="space-y-20">
            <PageHero
                eyebrow="Engine notes"
                title="Operational notes for setting up new ACT project surfaces"
                description="This page is not part of the main public story. It is a lightweight workflow note for how new ACT project shells inherit shared structure, language, and handover thinking."
                actions={[
                    { label: "Open studio", href: "/studio" },
                    { label: "See the method", href: "/method", variant: "outline" },
                ]}
            >
                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                        What this is
                    </p>
                    <p>
                        A working setup note. Useful for orienting the internal logic of new project shells, not for explaining ACT to the public from scratch.
                    </p>
                </div>
            </PageHero>

            <LivingSystemStrip
                eyebrow="Operational document"
                title="This route is a workflow note, not a separate public product"
                description="The public shell should stay centered on projects, works, method, and the wiki. This page exists because the operational workflow still matters, but it should remain clearly secondary to the main ACT story."
                wiki={{
                    href: "/wiki",
                    label: "Open ACT wiki",
                }}
                stats={[
                    { label: "Type", value: "Workflow note" },
                    { label: "Audience", value: "Internal-facing" },
                    { label: "Source", value: "Local markdown" },
                ]}
            />

            <section className="space-y-10">
                <SectionHeading
                    eyebrow="Workflow"
                    title="Project setup workflow"
                    description="A retained document for how new ACT project surfaces inherit shared DNA without pretending the workflow itself is a public-facing product."
                />
                <main className="rounded-[32px] border border-[#2F2A25] bg-[#11110F] p-8 text-stone-300 shadow-2xl md:p-12">
                    <MarkdownViewer content={content} variant="dark" />
                </main>
            </section>
        </div>
    );
}
