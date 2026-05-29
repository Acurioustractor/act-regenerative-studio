import Link from 'next/link';

import { PayoutWall } from '@/components/confessions/PayoutWall';
import { CallCTA } from '@/components/confessions/CallCTA';
import { pageMetadata } from '@/lib/seo/site';

export const metadata = pageMetadata({
  title: 'The Payout Wall',
  description:
    'Australian foundations gave $12.95 billion last year. About 112 of them will let you ask. One cell per foundation, the rare open doors lit gold, the voices behind the data on the gold phone.',
  path: '/art/the-payout-wall',
});

// Robust, query-verified receipts only (2026-05-29). The "45 foundations control
// half" concentration line is deliberately held back until a manual operating-
// charity exclusion list lands, because the raw giving set still ranks aid
// fundraisers (World Vision, Red Cross) as top "givers". See
// grantscope/output/foundation-power.provenance.md.
const RECEIPTS = [
  {
    big: '45',
    line: 'Of the 10,133 organisations that give, just 45 move half of the $12.95 billion between them. The top 100 move two thirds. The whole system is built around a handful.',
  },
  {
    big: '7',
    line: 'Narrow it to the foundations confirmed as grantmakers, the corporate foundations, family trusts and endowments, and it is starker still: just seven of them control half of the $2.34 billion they give. BHP, Paul Ramsay and Rio Tinto among them.',
  },
  {
    big: '98.9%',
    line: 'Of 10,133 organisations that give money, only about 112 publish an open application program. For everyone else there is no form, no front door, no public way in.',
  },
  {
    big: '$43.3B',
    line: 'Foundation capital paying out under five percent a year. A further $15.6 billion sat in foundations that moved nothing at all. The US has a legal floor that forces it to move. Australia has none.',
  },
  {
    big: '96.8%',
    line: 'For every $50 a foundation gives, you can trace where one dollar landed. The rest disappears between the tax return and the community.',
  },
  {
    big: '15x',
    line: 'A company that donates to a political party holds, on average, about fifteen times more in government contracts than one that stays out of it.',
  },
];

export default function PayoutWallPage() {
  return (
    <div className="relative min-h-screen bg-[#15100A] text-[#F3EBDD]">
      {/* HERO */}
      <section className="full-bleed border-b border-[#2E2215] px-6 pb-12 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            The receipts
          </p>
          <h1 className="mt-7 font-[var(--font-display)] text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.04]">
            The Payout Wall
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#D8CBB6]">
            Australia’s foundations and charities gave $12.95 billion last year. About 112 of them
            will let you ask. Every cell below is one of them. The few with an open door glow gold.
            Almost none do.
          </p>
        </div>
      </section>

      {/* THE WALL + THE VOICES */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <PayoutWall />
        </div>
      </section>

      {/* THE RECEIPTS */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-[var(--font-display)] text-[clamp(1.6rem,4vw,2.4rem)] font-semibold">
            What the data says, with the receipts attached
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {RECEIPTS.map((r) => (
              <div key={r.big} className="rounded-3xl border border-[#3A2C18] bg-[#15100A] p-8">
                <p className="font-[var(--font-display)] text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-none text-[#E0B068]">
                  {r.big}
                </p>
                <p className="mt-4 font-[var(--font-body)] text-[15px] leading-8 text-[#D8CBB6]">{r.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE KNOW */}
      <section className="border-t border-[#2E2215] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            How we know
          </p>
          <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            Every number here was queried from public records: charity financials, foundation
            registers and program data, cross-referenced by ABN. Each figure is verified, dated, and
            traceable to a query. We hold ourselves to the same standard, and publish our own
            openness and funding the moment we ask it of anyone else.
          </p>
          <p className="mt-6 font-[var(--font-body)] text-[13px] text-[#7C7060]">
            We name systems, not people. Foundations are shown as open or closed, never as
            wrongdoers.
          </p>
          <p className="mt-8">
            <Link
              href="/art/the-payout-wall/method"
              className="font-[var(--font-sans)] text-xs uppercase tracking-[0.3em] text-[rgba(224,176,104,0.85)] underline-offset-4 hover:underline"
            >
              How we know + right of reply &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* THE LINK TO CONFESSIONS */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            The wall is the receipts. The phone is the people.
          </p>
          <h2 className="mt-7 font-[var(--font-display)] text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-tight">
            You have seen the structure. Now say the quiet bit out loud.
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            The voices on this wall came from a gold phone. There is a seat for yours.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <CallCTA />
            <Link
              href="/confessions"
              className="font-[var(--font-sans)] text-xs uppercase tracking-[0.3em] text-[rgba(224,176,104,0.85)] underline-offset-4 hover:underline"
            >
              Read the confessions &rarr;
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
