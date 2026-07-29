import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { historyMedia, type HistoryMediaStatus } from "@/data/history-media";
import { FieldBrand } from "@/components/prototypes/FieldBrand";

export const metadata: Metadata = {
  title: "History media map | Review prototype",
  robots: { index: false, follow: false },
};

const statusLabels: Record<HistoryMediaStatus, string> = {
  "currently-public": "Currently public",
  "internal-candidate": "Internal candidate",
  "approval-required": "Approval required",
  "do-not-publish": "Do not publish",
};

const statusStyles: Record<HistoryMediaStatus, string> = {
  "currently-public": "border-[#2D5A3D] text-[#2D5A3D]",
  "internal-candidate": "border-[#B8943F] text-[#7a611f]",
  "approval-required": "border-[#C4845C] text-[#9a5535]",
  "do-not-publish": "border-[#1A1F1A] text-[#1A1F1A]",
};

export default function HistoryMediaPage() {
  return (
    <div className="!mx-0 !max-w-none !px-0 bg-[#FAFAF7] pt-28 text-[#1A1F1A]">
      <header className="mx-auto max-w-[1200px] px-8 pb-20 pt-10">
        <FieldBrand className="mb-16" />
        <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-clay-text">Internal publishing review</p>
        <h1 className="mt-5 max-w-[11ch] font-[var(--font-display)] text-[clamp(3.8rem,8vw,8rem)] font-light leading-[.9] tracking-[-.045em]">What can the history show?</h1>
        <p className="mt-10 max-w-[680px] font-[var(--font-body)] text-xl leading-[1.65] text-[var(--site-green)]">A media map for the ACT history and linked field stories. “Currently public” describes repository state only. It is not a substitute for a consent record.</p>
        <div className="mt-10 flex flex-wrap gap-6 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.15em]">
          <Link className="border-b border-current pb-2" href="/prototypes/field-history">Read the history →</Link>
          <Link className="border-b border-current pb-2" href="/prototypes/story-atlas">Open the story atlas →</Link>
          <Link className="border-b border-[var(--site-clay)] pb-2 text-clay-text" href="/prototypes/living-field">Return to the field →</Link>
          <Link className="border-b border-current pb-2" href="/prototypes/brand-guide">Open the brand guide →</Link>
        </div>
      </header>

      <section className="border-y border-[var(--site-line)] bg-[#E8EDE5] px-8 py-10">
        <div className="mx-auto grid max-w-[1200px] gap-px bg-[var(--site-line)] sm:grid-cols-3">
          {(["currently-public", "internal-candidate", "approval-required"] as const).map((status) => (
            <div key={status} className="bg-[#E8EDE5] p-7">
              <p className="font-[var(--font-display)] text-4xl font-light">{historyMedia.filter((item) => item.status === status).length}</p>
              <p className="mt-2 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.18em]">{statusLabels[status]}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-8 py-24">
        <div className="space-y-20">
          {historyMedia.map((item, index) => (
            <article key={item.id} className="grid gap-8 border-t border-[var(--site-line)] pt-8 md:grid-cols-[.2fr_.8fr_1.2fr]">
              <span className="font-[var(--font-display)] text-5xl font-light text-black/15">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.18em] text-clay-text">{item.chapter}</p>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl font-medium leading-tight">{item.title}</h2>
                <span className={`mt-5 inline-block border-b pb-1 font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.15em] ${statusStyles[item.status]}`}>{statusLabels[item.status]}</span>
              </div>
              <div>
                {item.publicPath ? (
                  <div className="relative mb-7 aspect-[16/9] overflow-hidden bg-[var(--site-surface)]">
                    {item.kind === "video" ? <video className="h-full w-full object-cover" muted loop autoPlay playsInline poster={item.publicPath.replace("/field-videos/", "/field-stills/").replace(".mp4", ".jpg")}><source src={item.publicPath} type="video/mp4" /></video> : <Image src={item.publicPath} alt="" fill sizes="60vw" className="object-cover" />}
                  </div>
                ) : (
                  <div className="mb-7 flex aspect-[16/7] items-center justify-center border border-dashed border-[var(--site-clay)] bg-[#F3E9E1] px-8 text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.16em] text-clay-text">Media intentionally not reproduced here</div>
                )}
                <p className="font-[var(--font-body)] text-xl leading-[1.55] text-[var(--site-green)]">{item.role}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--site-muted)]">{item.note}</p>
                <p className="mt-4 break-all font-mono text-[10px] leading-5 text-black/45">{item.source}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="bg-[var(--site-dark)] px-8 py-20 text-[#FAFAF7]">
        <div className="mx-auto max-w-[1000px]">
          <p className="font-[var(--font-sans)] text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-text">Publishing rule</p>
          <p className="mt-5 font-[var(--font-display)] text-[clamp(2rem,4vw,4rem)] font-light leading-[1.15]">A file existing in a public folder does not prove that its authority record exists.</p>
        </div>
      </footer>
    </div>
  );
}
