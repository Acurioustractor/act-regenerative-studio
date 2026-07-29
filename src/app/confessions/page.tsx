import Link from 'next/link';

import { CallCTA } from '@/components/confessions/CallCTA';
import { CallTimer } from '@/components/confessions/CallTimer';
import { ConfessionField } from '@/components/confessions/ConfessionField';
import { RotaryDial } from '@/components/confessions/RotaryDial';
import { VoicemailInbox } from '@/components/confessions/VoicemailInbox';
import { mockConfessions, realConfessions, IS_MOCK } from '@/data/confessions-mock';
import { pageMetadata, siteUrl } from '@/lib/seo/site';

export const metadata = pageMetadata({
  title: 'Confessions to Philanthropy',
  description:
    'A gold phone for the things people don’t say out loud. Call and leave an anonymous message for philanthropy. What do you wish it knew?',
  path: '/confessions',
});

// The inbox shows realConfessions (consented, human-moderated) when live. Set
// IS_MOCK true only for local design work, which swaps in the shaped sample set.
// Gating here means nothing fabricated renders once the line is live. New real
// messages are curated into realConfessions until the Dialpad pipeline (Phase 2)
// auto-populates them.
const confessions = IS_MOCK ? mockConfessions : realConfessions;

const QUESTIONS = [
  'What do you wish philanthropy knew?',
  'What have you always wanted to tell it?',
  'What have you never confessed?',
];

const LITANY = ['The good.', 'The weird.', 'The messy.', 'The hopeful.', 'The bullshit.', 'The breakthrough.'];

const STEPS = [
  { n: '1', label: 'Call the number.', sub: 'It rings a gold phone. No one picks up. That is the point.' },
  { n: '2', label: 'Leave a voicemail.', sub: 'Say the thing you usually keep tidy. Long or short. Funny or raw.' },
  { n: '3', label: 'That is it.', sub: 'No form. No grant language. No “dear valued stakeholder”.' },
];

// The lineage trio: ACT has a practice of building anonymous truth-telling
// infrastructure, and Confessions to Philanthropy is the latest in that line.
// All three slugs resolve at /art/[slug] (verified 200). No em-dashes (ACT voice).
const LINEAGE = [
  {
    year: '2023',
    title: 'The Confessional',
    slug: 'the-confessional',
    line: 'A horse trailer made into a room where honesty becomes possible.',
  },
  {
    year: '2024',
    title: 'Gold.Phone',
    slug: 'gold-phone',
    line: 'A booth that connects strangers by voice. No screens, no profiles.',
  },
  {
    year: '2026',
    title: 'Confessions to Philanthropy',
    slug: 'confessions-to-philanthropy',
    line: 'The same gold phone, pointed at the sector that funds change.',
    current: true,
  },
];

// A short, conservative history. Only well-established beats: the Greek
// etymology, the waqf as an early perpetual endowment, tzedakah, the langar.
// No contested figures, no anthropological claims about First Nations culture.
const HISTORY = [
  {
    word: 'philanthropia',
    gloss: 'Greek, love of humanity',
    line: 'The word first appears describing Prometheus, who stole fire from the gods and gave it to people. Philanthropy began as defiance of power, not a tool of it.',
  },
  {
    word: 'waqf',
    gloss: 'Arabic, a held endowment',
    line: 'The perpetual charitable endowment ran hospitals and houses of learning across the Islamic world for centuries before the modern foundation was invented.',
  },
  {
    word: 'tzedakah',
    gloss: 'Hebrew, giving',
    line: 'The word for charitable giving shares its root with the word for justice. Not a favour from above. An obligation between equals.',
  },
  {
    word: 'langar',
    gloss: 'Punjabi, the free kitchen',
    line: 'In the Sikh tradition the richest and the poorest sit on the same floor and eat the same meal, on purpose, so no one is made a charity case.',
  },
];

// Share kit: post the campaign or pass the number on. Intent links share the
// /confessions URL, which renders the gold-phone card via opengraph-image.
const SHARE_URL = `${siteUrl}/confessions`;
const SHARE_TEXT =
  'I told philanthropy what I really think. Confessions to Philanthropy, a gold phone from A Curious Tractor:';
const SHARE_X = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;
const SHARE_LINKEDIN = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`;
const SHARE_CARDS = [
  { variant: 'hook', label: 'The hook' },
  { variant: 'answer', label: 'A confession' },
  { variant: 'invite', label: 'The invite' },
];

// A redaction bar, the moderation made visible. Cream block over removed text.
function Redact({ w = 'w-20' }: { w?: string }) {
  return (
    <span
      aria-label="redacted"
      className={`mx-0.5 inline-block h-[0.92em] ${w} translate-y-[2px] rounded-[2px] bg-[#D8CBB6]/85`}
    />
  );
}

export default function ConfessionsPage() {
  return (
    <div className="relative bg-[#15100A] text-[#F3EBDD]">
      {/* HERO, immersive. `full-bleed` (see globals.css) makes this first child
          break the default 1200px container so the dark page runs edge to edge
          and sits flush behind the fixed nav, like the homepage hero. */}
      <section className="full-bleed relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#241910_0%,#15100A_60%)]" />
        <ConfessionField confessions={confessions} interactive={false} />
        {/* Faint rotary-dial engraving, the old-phone signature. */}
        <RotaryDial className="pointer-events-none absolute left-1/2 top-1/2 h-[min(86vmin,800px)] w-[min(86vmin,800px)] -translate-x-1/2 -translate-y-1/2 text-[#CFA16B]/[0.07]" />
        {/* Warm vignette, the object under a single light. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0E0A05_100%)]" />

        {/* pointer-events-none lets taps fall through to the voices on the canvas
            behind this column; the interactive controls re-enable them. */}
        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[88svh] max-w-3xl flex-col items-center justify-center px-6 pb-20 pt-10 text-center">
          <CallTimer />
          <h1 className="mt-8 font-[var(--font-display)] text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[1.02] tracking-tight">
            You’ve reached
            <br />
            philanthropy.
          </h1>
          <p className="mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#D8CBB6]">
            A gold phone for the things people don’t say out loud. An anonymous voicemail for the
            truths, love notes, hot takes and confessions people have about giving.
          </p>

          <div className="pointer-events-auto mt-9 flex flex-col items-center gap-3">
            <CallCTA />
            <p className="font-[var(--font-sans)] text-xs uppercase tracking-[0.35em] text-[rgba(224,176,104,0.7)]">
              Leave a message at the tone
            </p>
          </div>

          <div className="pointer-events-auto mt-14 flex flex-col items-center gap-3">
            <p className="font-[var(--font-sans)] text-[11px] uppercase tracking-[0.3em] text-sand-lift">
              {confessions.length} messages on the line
            </p>
            <Link
              href="/confessions/listen"
              className="inline-flex items-center gap-2 rounded-full border border-[#CFA16B]/50 px-5 py-2.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(224,176,104,0.9)] transition hover:border-[#CFA16B] hover:text-[#F3EBDD]"
            >
              Listen to the messages
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* INVITATION */}
      <section className="border-t border-[#2E2215] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            Anti-pretending
          </p>
          <p className="mt-7 font-[var(--font-display)] text-[clamp(1.7rem,4vw,2.6rem)] font-medium leading-[1.2]">
            This is not anti-philanthropy. It is a place to say the quiet bit out loud.
          </p>
          <p className="mt-6 font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            Philanthropy is powerful. It is also confusing, secretive, generous, awkward, hopeful and
            sometimes full of very shiny words. So we made it a voicemail.
          </p>

          <div className="mt-14 space-y-3">
            {QUESTIONS.map((q) => (
              <p
                key={q}
                className="font-[var(--font-display)] text-xl italic leading-8 text-[#F3EBDD] md:text-2xl"
              >
                {q}
              </p>
            ))}
          </div>

          <ul className="mx-auto mt-12 flex max-w-md flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LITANY.map((line) => (
              <li
                key={line}
                className="font-[var(--font-sans)] text-sm font-semibold uppercase tracking-[0.18em] text-[rgba(224,176,104,0.75)]"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT WAS THE GIFT FOR — the history spine */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            Before the foundation
          </p>
          <h2 className="mt-7 text-center font-[var(--font-display)] text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-[1.1]">
            The first philanthropist was a god in chains.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-center font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            Long before the tax deduction and the donor’s name on the wall, giving meant something
            older. Across the world it was obligation, reciprocity and justice, held inside a
            relationship. Four words still remember it.
          </p>

          <dl className="mt-14 space-y-px overflow-hidden rounded-3xl border border-[#3A2C18]">
            {HISTORY.map((h) => (
              <div key={h.word} className="bg-[#1E160D] p-7 md:flex md:gap-8 md:p-8">
                <dt className="md:w-56 md:shrink-0">
                  <span className="font-[var(--font-display)] text-2xl text-[#CFA16B]">{h.word}</span>
                  <span className="mt-1 block font-[var(--font-sans)] text-[11px] uppercase tracking-[0.2em] text-sand-lift">
                    {h.gloss}
                  </span>
                </dt>
                <dd className="mt-3 font-[var(--font-body)] leading-8 text-[#D8CBB6] md:mt-0">
                  {h.line}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mx-auto mt-14 max-w-2xl text-center font-[var(--font-display)] text-[clamp(1.4rem,3vw,2rem)] italic leading-[1.3] text-[#F3EBDD]">
            Before the endowment, before the deduction, before the name went on the wall, what was the
            gift for?
          </p>
          <p className="mx-auto mt-6 max-w-xl text-center font-[var(--font-body)] leading-8 text-[#A99B86]">
            This is not anti-philanthropy. It is philanthropy trying to remember its older self.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-[#2E2215] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.6rem)] font-semibold">
            How it works
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-3xl border border-[#3A2C18] bg-[#1E160D] p-7">
                <span className="font-[var(--font-display)] text-3xl text-[#CFA16B]">{step.n}</span>
                <p className="mt-4 font-[var(--font-display)] text-xl">{step.label}</p>
                <p className="mt-3 font-[var(--font-body)] text-[0.95rem] leading-7 text-[#A99B86]">
                  {step.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-[#CFA16B]/30 bg-[#CFA16B]/[0.06] p-8 text-center">
            <p className="font-[var(--font-display)] text-xl">You can be anonymous.</p>
            <p className="mt-3 font-[var(--font-body)] leading-7 text-[#C7B9A4]">
              Say your name if you want to. You do not have to. We are listening for what is true, not
              for who is calling.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE SHARE IT BACK — redaction, the one rule */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            How we share it back
          </p>
          <h2 className="mt-7 text-center font-[var(--font-display)] text-[clamp(1.7rem,4vw,2.4rem)] font-semibold leading-tight">
            We will never turn your voice into a word cloud.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            A human reads every message before any of it is shared. Names and anything that could
            identify you are removed first. The message stays a message. The voice stays the point.
          </p>

          <figure className="mt-12">
            <blockquote className="rounded-3xl border border-[#3A2C18] bg-[#15100A] p-8 font-[var(--font-body)] text-lg leading-9 text-[#D8CBB6] md:p-10">
              “I worked at <Redact w="w-24" /> for six years. We declined more good people than we
              ever funded, and we never told <Redact w="w-16" /> why. I still think about the ones we
              said no to.”
            </blockquote>
            <figcaption className="mt-4 text-center font-[var(--font-sans)] text-[11px] uppercase tracking-[0.2em] text-sand-lift">
              Illustration only. This is how a confession looks when we share it back.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* THE INBOX — an elegant voicemail list; play, scrub, filter by theme */}
      <section className="border-t border-[#2E2215] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="inline-flex items-center gap-2.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[rgba(224,176,104,0.9)]" />
              The line is open
            </p>
            <h2 className="mt-7 font-[var(--font-display)] text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight">
              The inbox. Every message, in full.
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-[var(--font-body)] leading-8 text-[#A99B86]">
              {IS_MOCK ? (
                <>
                  Press play to listen. Filter by what each one is about. Sample messages while the
                  line warms up. When the real confessions land, they arrive here, anonymous and
                  unedited.
                </>
              ) : (
                <>
                  Press play to hear the real voice. Some callers shared their words and not their
                  voice, and we kept it that way. Filter by what each one is about. Every message is
                  anonymous and unedited, exactly as it came through.
                </>
              )}
            </p>
          </div>
          <div className="mt-14">
            <VoicemailInbox confessions={confessions} />
          </div>
        </div>
      </section>

      {/* THE GREETING, styled like an answering machine transcript */}
      <section className="border-t border-[#2E2215] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <p className="text-center font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            What you will hear
          </p>
          <blockquote className="mt-8 rounded-3xl border border-[#3A2C18] bg-[#1A130B] p-8 font-[var(--font-body)] text-lg leading-9 text-[#D8CBB6] md:p-10">
            <p>Hello. You’ve reached Confessions to Philanthropy.</p>
            <p className="mt-4">No one is available to take your call right now.</p>
            <p className="mt-4 text-[#A99B86]">
              They may be in a strategy session. Or reviewing a theory of change. Or accidentally making
              a simple idea very complicated.
            </p>
            <p className="mt-4">After the tone, please leave your confession.</p>
            <p className="mt-4 font-[var(--font-display)] italic text-[#F3EBDD]">
              You can be anonymous. Say the thing. Leave a message at the tone.
            </p>
          </blockquote>
        </div>
      </section>

      {/* THE WEEK — guest chair rhythm */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-24 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            All week, the operator’s chair
          </p>
          <h2 className="mt-7 font-[var(--font-display)] text-[clamp(1.7rem,4vw,2.4rem)] font-semibold leading-tight">
            Each day, someone sits with what came through and answers out loud.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            A grantee. A funder willing to be honest on the record. A historian. Someone who has been
            consulted to exhaustion. Confession booth meets late-night talkback. The phone is open the
            whole of Queensland Philanthropy Week.
          </p>
          <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-[15px] leading-8 text-[#A99B86]">
            Queensland Gives runs the week: Queensland Philanthropy Week 2026, more than 24 events to
            connect, reflect and celebrate giving, led by the connector Tara Castle.
          </p>
        </div>
      </section>

      {/* THE FRIDAY INBOX — findings teaser */}
      <section className="border-t border-[#2E2215] px-6 py-24 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
            Friday
          </p>
          <p className="mt-7 font-[var(--font-sans)] text-sm uppercase tracking-[0.3em] text-[rgba(224,176,104,0.7)]">
            ▸ Philanthropy has {confessions.length} new {confessions.length === 1 ? 'message' : 'messages'}
          </p>
          <h2 className="mt-5 font-[var(--font-display)] text-[clamp(1.8rem,4.5vw,2.8rem)] font-semibold leading-tight">
            The honest version drops Friday.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
            At the end of the week we play it back. Anonymous, themed, said out loud. Not a survey. Not
            an acquittal. Every number opens back into a voice.
          </p>
          <p className="mt-9">
            <Link
              href="/confessions/listen"
              className="inline-flex items-center gap-2 rounded-full border border-[#CFA16B]/40 px-5 py-2.5 text-sm font-semibold text-[#CFA16B] transition hover:border-[#CFA16B] hover:bg-[#CFA16B]/10"
            >
              Listen to the voices <span aria-hidden="true">&rarr;</span>
            </Link>
          </p>
        </div>
      </section>

      {/* THE LINE OF WORK, lineage of the phones we have built */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.4em] text-[#CFA16B]">
              A line of work
            </p>
            <h2 className="mx-auto mt-7 max-w-2xl font-[var(--font-display)] text-[clamp(1.7rem,4vw,2.4rem)] font-semibold leading-tight">
              This is not the first phone we have built.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-[var(--font-body)] text-lg leading-8 text-[#C7B9A4]">
              For years we have built quiet places where the truth gets easier to say. Confessions to
              Philanthropy is the latest in that line.
            </p>
          </div>

          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {LINEAGE.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/art/${w.slug}`}
                  className={`group flex h-full flex-col rounded-3xl border p-8 transition ${
                    w.current
                      ? 'border-[#CFA16B]/60 bg-[#15100A] shadow-[0_0_36px_-14px_rgba(207,161,107,0.55)]'
                      : 'border-[#2E2215] bg-[#15100A] hover:border-[#5A4A30]'
                  }`}
                >
                  <span className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-sand-lift">
                    {w.year}
                    {w.current && <span className="ml-2 text-[#CFA16B]">the current call</span>}
                  </span>
                  <span className="mt-3 font-[var(--font-display)] text-xl font-semibold text-[#E0B068]">
                    {w.title}
                  </span>
                  <span className="mt-3 flex-1 font-[var(--font-body)] text-[15px] leading-7 text-[#C7B9A4]">
                    {w.line}
                  </span>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(224,176,104,0.85)] group-hover:text-[#CFA16B]">
                    See the work <span aria-hidden="true">&rarr;</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-12 max-w-2xl text-center font-[var(--font-body)] text-[16px] leading-8 text-[#A99B86]">
            Same idea every time. Take away the screens and the grant language, and people tell the
            truth. The line is open again, and this time it is pointed at philanthropy.
          </p>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="border-t border-[#2E2215] bg-[#1A130B] px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-[var(--font-display)] text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-tight">
            Pick up the phone. Say the thing.
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4">
            <CallCTA />
            <p className="font-[var(--font-sans)] text-xs uppercase tracking-[0.35em] text-[rgba(224,176,104,0.7)]">
              Anonymous messages welcome
            </p>
          </div>
          <p className="mt-12 font-[var(--font-body)] text-sm text-sand-lift">
            A gold phone from{' '}
            <Link href="/art" className="text-[#CFA16B] underline-offset-4 hover:underline">
              the ACT art program
            </Link>
            . Not anti-philanthropy. Anti-pretending.
          </p>
        </div>
      </section>

      {/* PASS IT ON, share kit */}
      <section className="border-t border-[#2E2215] bg-[#15100A] px-6 py-20 text-center md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.35em] text-[#CFA16B]">
            Pass it on
          </p>
          <h2 className="mt-5 font-[var(--font-display)] text-[clamp(1.8rem,4.5vw,2.6rem)] font-semibold leading-tight">
            The honest stuff spreads quietly.
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-[var(--font-body)] text-[16px] leading-7 text-[#C7B9A4]">
            Send the number to someone who has been holding a confession. Or post a card.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={SHARE_X}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#CFA16B] px-5 py-2.5 text-sm font-semibold text-[#1A130B] transition hover:bg-[#E0B985]"
            >
              Share on X
            </a>
            <a
              href={SHARE_LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#CFA16B]/40 px-5 py-2.5 text-sm font-semibold text-[#CFA16B] transition hover:border-[#CFA16B] hover:bg-[#CFA16B]/10"
            >
              Share on LinkedIn
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {SHARE_CARDS.map((card) => (
              <a
                key={card.variant}
                href={`/confessions/share/${card.variant}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-xl border border-[#CFA16B]/20 transition hover:border-[#CFA16B]/50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/confessions/share/${card.variant}`}
                  alt={`Confessions to Philanthropy share card: ${card.label}`}
                  width={1200}
                  height={630}
                  className="aspect-[1200/630] w-full object-cover transition group-hover:opacity-90"
                />
                <span className="block bg-[#1A130B] px-3 py-2 font-[var(--font-sans)] text-[10px] uppercase tracking-[0.25em] text-[#CFA16B]/80">
                  {card.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Analog film grain over the whole page. Subtle, decorative, non-interactive.
          Last child + absolute inset-0 so it overlays every section. */}
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
