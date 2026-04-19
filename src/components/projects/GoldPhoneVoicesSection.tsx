import Link from 'next/link';

import { goldPhoneExperience } from '@/data/works/gold-phone';

function truncateVoice(text: string, limit: number) {
  if (text.length <= limit) return text;

  const clipped = text.slice(0, limit);
  const boundary = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, boundary > 50 ? boundary : limit).trim()}…`;
}

export function GoldPhoneVoicesSection() {
  const featuredVoices = goldPhoneExperience.featuredVoiceIndexes.map(
    (index) => goldPhoneExperience.voices[index]
  );

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[34px] border border-[#8D642A] bg-[#070707] text-[#F8E4BF] shadow-[0_28px_90px_rgba(8,6,3,0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,145,32,0.22),transparent_38%),radial-gradient(circle_at_20%_20%,rgba(255,145,32,0.12),transparent_24%),linear-gradient(180deg,rgba(255,145,32,0.06),transparent_38%)]" />
          <div className="relative min-h-[36rem] p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center rounded-full border border-[#8D642A] bg-[#140D06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFB453]">
                Voice constellation
              </div>
              <div className="font-mono text-sm uppercase tracking-[0.5em] text-[#FF9725]/70 md:text-base">
                {goldPhoneExperience.timestamp}
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-[54%] h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8D642A]/40 bg-[radial-gradient(circle,rgba(255,145,32,0.13),rgba(0,0,0,0.04)_55%,transparent_70%)] shadow-[0_0_60px_rgba(255,145,32,0.18)] md:h-[20rem] md:w-[20rem]">
              <div className="absolute inset-[13%] rounded-full border border-[#8D642A]/25" />
              <div className="absolute inset-[28%] rounded-full border border-[#8D642A]/20" />
              <div className="absolute inset-[38%] flex items-center justify-center rounded-full border border-[#8D642A]/30 bg-black/30 px-5 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-[#FFB453]/75">
                    Reciprocal Voices
                  </p>
                  <p className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-white">
                    23
                  </p>
                  <p className="mt-2 text-xs leading-6 text-[#E8D1A7]">
                    voice fragments held together without flattening them into one message
                  </p>
                </div>
              </div>
            </div>

            {goldPhoneExperience.voices.map((voice, index) => {
              const angle = (index / goldPhoneExperience.voices.length) * Math.PI * 2 - Math.PI / 2;
              const ring = index % 2 === 0 ? 37 : 44;
              const left = 50 + Math.cos(angle) * ring;
              const top = 54 + Math.sin(angle) * ring;

              return (
                <div
                  key={`${voice.keywords.join('-')}-${index}`}
                  className="absolute"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <div className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-[#8D642A]/45 bg-[#130D08]/85 px-3 py-2 text-[11px] text-[#F8E4BF] shadow-[0_0_20px_rgba(255,145,32,0.14)] backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-[#FF9725] shadow-[0_0_12px_rgba(255,145,32,0.9)]" />
                    <span className="hidden whitespace-nowrap uppercase tracking-[0.18em] text-[#FFB453] sm:inline">
                      {voice.keywords[0]}
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="relative z-10 mt-72 max-w-xl space-y-4 md:mt-80">
              <p className="text-xs uppercase tracking-[0.28em] text-[#FFB453]">
                Gold.Phone work score
              </p>
              <h2 className="font-[var(--font-display)] text-[2.1rem] font-semibold leading-tight text-white md:text-[2.7rem]">
                Voice arrives as encounter before it becomes content.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[#E9D5B2] md:text-base">
                {goldPhoneExperience.sourceNote} The original piece asked people to move through a
                black field of orange particles and meet one voice at a time. This page keeps that
                structure visible instead of collapsing the work into a generic project summary.
              </p>
              <p className="text-sm leading-7 text-[#D8C1A2]">
                {goldPhoneExperience.instruction}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[30px] border border-[#D5C3A6] bg-[#F7F1E5] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A9B76]">
              Transcript rail
            </p>
            <h3 className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
              Reciprocity held in multiple voices at once.
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
              The strongest thing Gold.Phone has is not a screenshot. It is the transcript field:
              generosity, time, care, awkwardness, and humor all speaking beside each other.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredVoices.map((voice, index) => (
              <article
                key={`${voice.keywords.join('-')}-${index}`}
                className="rounded-[28px] border border-[#D9C7AA] bg-white p-5 shadow-[0_14px_36px_rgba(35,27,18,0.08)]"
              >
                <p className="font-[var(--font-display)] text-lg leading-relaxed text-[#1E1A16]">
                  “{truncateVoice(voice.text, 112)}”
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {voice.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-[#17110B] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFB453]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#D5C3A6] bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A9B76]">
            Work behaviour
          </p>
          <p className="mt-3 font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
            Encounter first. Transcript second.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
            Gold.Phone does not begin with author biography or platform explanation. It begins with
            listening, uncertainty, and response.
          </p>
        </div>

        <div className="rounded-[28px] border border-[#8D642A] bg-[#17110B] p-6 text-[#F4E1BF]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FFB453]">
            Field vocabulary
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {goldPhoneExperience.fieldKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-[#8D642A] bg-[#24170F] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F7D38F]"
              >
                {keyword}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-[#E3CCAA]">
            These are not campaign tags. They are the actual conceptual texture of the piece as it
            was originally staged.
          </p>
        </div>

        <div className="rounded-[28px] border border-[#D5C3A6] bg-[#F8F3EA] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A9B76]">
            Next pathway
          </p>
          <p className="mt-3 font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
            Host it in a real public context.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--we-brown)]">
            Gold.Phone is strongest when it sits in a site, gathering, or public program that can
            hold curiosity without rushing to resolution.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/contact?type=commission&source=gold-phone-voices&context=gold-phone"
              className="inline-flex items-center rounded-full bg-[#17110B] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F7DE72] transition hover:bg-[#2A1D12]"
            >
              Talk about hosting
            </Link>
            <Link
              href="/art"
              className="inline-flex items-center rounded-full border border-[#CAB28A] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3C3227] transition hover:bg-white"
            >
              Open works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
