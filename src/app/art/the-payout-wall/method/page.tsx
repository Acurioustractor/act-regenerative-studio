import Link from 'next/link';

import { pageMetadata } from '@/lib/seo/site';

export const metadata = pageMetadata({
  title: 'The Payout Wall — method and right of reply',
  description:
    'How the Payout Wall is built, what the numbers mean, where the limits are, and how a foundation can see and contest its own reading. We hold ourselves to the same standard.',
  path: '/art/the-payout-wall/method',
});

const SECTIONS = [
  {
    h: 'What the data is',
    body: 'Every figure comes from public records, cross-referenced by ABN: charity financial statements lodged with the ACNC, foundation and grant registers, federal procurement (AusTender), and political donation disclosures (AEC). Nothing here is private or leaked. We did not survey anyone or ask permission, because the whole point is that this information is already public and should be legible to the communities it affects.',
  },
  {
    h: 'How we read open vs closed',
    body: 'A foundation is counted as having an open door when it publishes a way to apply: an open program, application guidance, or a stated process anyone can use. It is read as closed when there is no public route in, only invitation or relationship. This is a factual reading of what a foundation chooses to publish. It is not a judgement that a closed foundation does bad work. Many do excellent work. The point is who can reach them.',
  },
  {
    h: 'How we count giving and capital',
    body: 'Annual giving is each entity’s reported giving for its latest filing year. The concentration figure for foundations specifically uses only entities confidently classified as grantmakers (corporate foundations, family trusts, ancillary funds, endowments), which sets aside large aid charities and universities that give large sums but are not grantmaking foundations. The capital figures (money paying out under five percent a year, money that moved nothing) use audited ACNC net assets and are kept distributional: we report the totals, never a named list of who is "hoarding".',
  },
  {
    h: 'Where the limits are',
    body: 'The data runs to the most recent complete ACNC year and is point in time, not live. Some entities cannot be confidently classified, so we are conservative about calling anything a "foundation". Figures from different universes (all givers versus grantmakers only) are never summed. We are honest that this is the most comprehensive cross-domain map of philanthropic power in Australia, not the largest grant database in the world.',
  },
  {
    h: 'Right of reply',
    body: 'If you run a foundation and believe we have read your openness or your numbers wrong, tell us. We will review against the source, correct what is wrong, and note the change. A reading here is an invitation to publish a door, not an accusation.',
  },
  {
    h: 'We hold ourselves to it',
    body: 'A Curious Tractor publishes its own openness and its own funding sources, because it would be dishonest to ask of others what we will not show ourselves. We sell foundations nothing and represent none of them, which is exactly why we can do this in the open.',
  },
];

export default function PayoutWallMethodPage() {
  return (
    <div className="relative min-h-screen bg-[#15100A] text-[#F3EBDD]">
      <section className="full-bleed border-b border-[#2E2215] px-6 pb-12 pt-32 md:pt-40">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            Method and right of reply
          </p>
          <h1 className="mt-7 font-[var(--font-display)] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.06]">
            How the wall is made
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#D8CBB6]">
            Every number on the Payout Wall is public, dated, and traceable to a query. Here is how
            it is built, what it means, where it falls short, and how to contest it.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl space-y-12">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[#E0B068]">{s.h}</h2>
              <p className="mt-4 font-[var(--font-body)] text-[16px] leading-8 text-[#D8CBB6]">{s.body}</p>
            </div>
          ))}

          <div className="rounded-3xl border border-[#3A2C18] bg-[#1A130B] p-8 text-center">
            <p className="font-[var(--font-body)] leading-8 text-[#C7B9A4]">
              Think we have read your foundation wrong, or want to add a door?
            </p>
            <a
              href="mailto:hi@act.place?subject=The%20Payout%20Wall%20%E2%80%94%20right%20of%20reply"
              className="mt-4 inline-block font-[var(--font-display)] text-xl text-[#E0B068] underline-offset-4 hover:underline"
            >
              hi@act.place
            </a>
          </div>

          <div className="border-t border-[#2E2215] pt-8 text-center">
            <Link
              href="/art/the-payout-wall"
              className="font-[var(--font-sans)] text-xs uppercase tracking-[0.3em] text-[rgba(224,176,104,0.85)] underline-offset-4 hover:underline"
            >
              &larr; Back to the Payout Wall
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
