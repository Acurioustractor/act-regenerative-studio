import { CallCTA } from '@/components/confessions/CallCTA';
import { ConfessionField } from '@/components/confessions/ConfessionField';
import { ListenTheatre } from '@/components/confessions/ListenTheatre';
import { mockConfessions, realConfessions, IS_MOCK, feelingMeta, feelingOf, feelingOrder } from '@/data/confessions-mock';
import { pageMetadata } from '@/lib/seo/site';

export const metadata = pageMetadata({
  title: 'Confessions to Philanthropy',
  description:
    'We pointed a gold phone at philanthropy and asked what people wish it knew. These are the voices that called back. Listen.',
  path: '/confessions/listen',
});

const confessions = IS_MOCK ? mockConfessions : realConfessions;
// The thematics actually on the line right now, warm to hard.
const feelingsPresent = feelingOrder.filter((f) => confessions.some((c) => feelingOf(c) === f));

export default function ListenPage() {
  return (
    <div className="relative min-h-screen bg-[#15100A] text-[#F3EBDD]">
      {/* THE MESSAGE */}
      <section className="full-bleed px-6 pt-12 text-center md:pt-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            Confessions to philanthropy
          </p>
          <h1 className="mt-7 font-[var(--font-display)] text-[clamp(2.3rem,6vw,4.2rem)] font-semibold leading-[1.05]">
            We pointed a gold phone at philanthropy.
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#D8CBB6]">
            We asked what people wish it knew. No forms, no grant language, no dear valued stakeholder.
            These are the voices that called back. The thank-yous, the heartbreak, and the things
            people usually keep tidy.
          </p>
        </div>
      </section>

      {/* THE THEMATICS + THE VISUALISATION */}
      <section className="px-6 pt-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
            {feelingsPresent.map((f) => (
              <span key={f} className="flex items-center gap-2 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.18em]" style={{ color: `rgb(${feelingMeta[f].rgb})` }}>
                <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: `rgb(${feelingMeta[f].rgb})`, boxShadow: `0 0 8px 1px rgba(${feelingMeta[f].rgb},0.6)` }} />
                {feelingMeta[f].label}
              </span>
            ))}
          </div>

          <div className="relative mt-6 h-[60vh] min-h-[440px] w-full overflow-hidden rounded-3xl border border-[#2E2215]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,#241910_0%,#15100A_66%)]" />
            <ConfessionField confessions={confessions} interactive />
            <p className="pointer-events-none absolute inset-x-0 top-5 text-center font-[var(--font-sans)] text-[11px] uppercase tracking-[0.3em] text-[#7C7060]">
              Tap a voice to hear it
            </p>
          </div>

          {/* FULL-SCREEN LISTENING */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <ListenTheatre confessions={confessions} />
            <p className="font-[var(--font-sans)] text-[11px] uppercase tracking-[0.24em] text-[#7C7060]">
              {confessions.length} on the line. Listen full screen, or play them all.
            </p>
          </div>
        </div>
      </section>

      {/* LEAVE ONE */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-24 text-center md:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-[var(--font-display)] text-[clamp(1.7rem,4vw,2.6rem)] font-semibold leading-tight">
            However it feels, the line is open.
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            Leave an anonymous voicemail for philanthropy. We add the consented ones to the line.
          </p>
          <div className="mt-10 flex justify-center">
            <CallCTA />
          </div>
        </div>
      </section>
    </div>
  );
}
