import Link from 'next/link';

import { CallCTA } from '@/components/confessions/CallCTA';
import { FridayTape } from '@/components/confessions/FridayTape';
import { pageMetadata } from '@/lib/seo/site';

export const metadata = pageMetadata({
  title: 'The Friday Tape — Confessions to Philanthropy',
  description:
    'At the end of the week we play it back. Anonymous, themed, said out loud. The honest version of what philanthropy heard.',
  path: '/confessions/friday',
});

const MOVEMENTS = [
  {
    tag: 'Money',
    body: 'The loudest thread was money, and not the way you might expect. Nobody asked for more of it. They asked us to be honest about it. One caller said philanthropy has lost its way, that it tends to be about the money now, when the word itself just means love of humanity. Another put it plainly: please just ask us. Genuinely ask. Not with a glossy brochure. And then this, which we have not stopped thinking about: when you make the ask human and honest, the answer is always yes.',
  },
  {
    tag: 'Power',
    body: 'Then there was power, and one voice was blunt about it. You have got a really difficult job, the caller said, and you do it really difficultly. If you gave up on thinking you already knew what you were doing, you would do it better. Just give the money to the people who actually know what is going on.',
  },
  {
    tag: 'Hope',
    body: 'And underneath all of it, hope, the kind that aches. One person rang to say it is not really a confession, it is to say I wish you didn’t have to exist. Thank you for pouring your heart into a world that still needs you. But I wish we lived somewhere equity was just a given, and you were not necessary at all.',
  },
];

export default function FridayTapePage() {
  return (
    <div className="relative min-h-screen bg-[#15100A] text-[#F3EBDD]">
      {/* COLD OPEN */}
      <section className="full-bleed border-b border-[#2E2215] px-6 pb-14 pt-10 text-center md:pt-14">
        <div className="mx-auto max-w-2xl">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            Friday
          </p>
          <h1 className="mt-7 font-[var(--font-display)] text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.04]">
            We played the week back.
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#D8CBB6]">
            Here is what came through the gold phone this week. Every message anonymous, every one
            shared with consent, every one a real voice. Not a survey. Not an acquittal. The honest
            version, said out loud.
          </p>
        </div>
      </section>

      {/* THE TAPE */}
      <section className="px-6 py-16 md:py-20">
        <FridayTape />
      </section>

      {/* WHAT IT SAID — the three movements */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            What it said
          </p>
          <div className="mt-12 space-y-12">
            {MOVEMENTS.map((m) => (
              <div key={m.tag}>
                <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#E0B068]">{m.tag}</h2>
                <p className="mt-4 font-[var(--font-body)] text-[17px] leading-8 text-[#D8CBB6]">{m.body}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-16 max-w-xl text-center font-[var(--font-display)] text-[clamp(1.4rem,3.5vw,2rem)] italic leading-[1.3] text-[#F3EBDD]">
            That is the honest version. Be more human. Trust the people closest to the work. And keep
            going, while quietly hoping for the day the work is done.
          </p>
        </div>
      </section>

      {/* THE RECEIPTS BRIDGE */}
      <section className="border-t border-[#2E2215] px-6 py-16 text-center md:py-20">
        <div className="mx-auto max-w-xl">
          <p className="font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            The voices told us how it feels. The data shows how it is built.
          </p>
          <Link
            href="/confessions/listen"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#CFA16B]/40 px-5 py-2.5 text-sm font-semibold text-[#CFA16B] transition hover:border-[#CFA16B] hover:bg-[#CFA16B]/10"
          >
            Listen to the voices <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* PASS IT ON */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-[var(--font-display)] text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-tight">
            The line is still open.
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            Next week’s tape needs your voice. Say the thing you usually keep tidy.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <CallCTA />
            <Link
              href="/confessions"
              className="font-[var(--font-sans)] text-xs uppercase tracking-[0.3em] text-[rgba(224,176,104,0.85)] underline-offset-4 hover:underline"
            >
              Back to Confessions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* film grain, matching /confessions */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[60] opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
