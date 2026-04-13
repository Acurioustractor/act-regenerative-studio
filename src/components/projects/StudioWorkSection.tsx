import Link from 'next/link';

import type { EditorialArticle } from '@/lib/empathy-ledger-editorial';

interface StudioWorkSectionProps {
  title: string;
  description: string;
  quote: string;
  medium: string;
  place: string;
  collaborators: string;
  connectedTo: string;
  connectedHref?: string;
  supportImages: Array<{
    url: string;
    alt: string;
    eyebrow?: string;
  }>;
  leadArticle?: EditorialArticle | null;
  live: {
    storyCount: number;
    storytellerCount: number;
    mediaCount: number;
  };
}

function truncateText(text: string, limit: number) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) return normalized;

  const clipped = normalized.slice(0, limit);
  const boundary = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, boundary > 80 ? boundary : limit).trim()}…`;
}

export function StudioWorkSection({
  title,
  description,
  quote,
  medium,
  place,
  collaborators,
  connectedTo,
  connectedHref,
  supportImages,
  leadArticle,
  live,
}: StudioWorkSectionProps) {
  const [firstStill, secondStill] = supportImages;
  const liveSignalCount = live.storyCount + live.storytellerCount + live.mediaCount;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
      <div className="overflow-hidden rounded-[34px] border border-[#C7AF86] bg-[#11110F] text-[#F5ECDD] shadow-[0_28px_70px_rgba(26,20,14,0.18)]">
        {(leadArticle?.featuredImageUrl || firstStill) && (
          <div className="relative h-64 overflow-hidden md:h-72">
            <img
              src={leadArticle?.featuredImageUrl || firstStill?.url || ''}
              alt={
                leadArticle?.featuredImageAlt ||
                leadArticle?.title ||
                firstStill?.alt ||
                title
              }
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute left-6 top-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                Studio work
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E9D7BA] backdrop-blur-sm">
                {medium}
              </span>
            </div>
            {leadArticle ? (
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#D8B47B]">
                  Lead field note
                </p>
                <p className="mt-2 max-w-2xl font-[var(--font-display)] text-2xl font-semibold leading-tight text-white">
                  {leadArticle.title}
                </p>
              </div>
            ) : null}
          </div>
        )}

        <div className="space-y-6 p-7 md:p-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#CDA56D]">
              Exhibition context
            </p>
            <h2 className="font-[var(--font-display)] text-[2rem] font-semibold leading-tight text-white md:text-[2.5rem]">
              Made to be felt in the body, not just understood on the page.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[#E4D5BF] md:text-base">
              {truncateText(description, 280)}
            </p>
          </div>

          <blockquote className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="font-[var(--font-display)] text-xl leading-relaxed text-white md:text-2xl">
              “{truncateText(quote, 220)}”
            </p>
          </blockquote>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/art"
              className="inline-flex items-center rounded-full bg-[#F7DE72] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#17130F] transition hover:bg-[#FFE793]"
            >
              Open works
            </Link>
            {leadArticle ? (
              <Link
                href={leadArticle.localPath}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#F5ECDD] transition hover:bg-white/14"
              >
                Read field note
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            eyebrow: 'Medium',
            value: medium,
            tone: 'bg-[#F7F1E7]',
          },
          {
            eyebrow: 'Place',
            value: place,
            tone: 'bg-[#F4F0E8]',
          },
          {
            eyebrow: 'Collaborators',
            value: collaborators,
            tone: 'bg-[#F8F3EB]',
          },
        ].map((item) => (
          <div
            key={item.eyebrow}
            className={`rounded-[26px] border border-[#E3D4BA] ${item.tone} p-5`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A9B76]">
              {item.eyebrow}
            </p>
            <p className="mt-3 font-[var(--font-display)] text-lg font-semibold leading-snug text-[#2F3E2E]">
              {item.value}
            </p>
          </div>
        ))}

        <div className="rounded-[26px] border border-[#D4BC97] bg-[#2B241F] p-5 text-[#F3EBDD]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D7B47B]">
            Connected field
          </p>
          <p className="mt-3 font-[var(--font-display)] text-lg font-semibold leading-snug text-white">
            {connectedTo}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#D8C9B4]">
            This work sits inside the wider ACT ecosystem, not outside it.
          </p>
          <Link
            href={connectedHref || '/projects'}
            className="mt-4 inline-flex items-center text-xs font-semibold uppercase tracking-[0.22em] text-[#F7DE72] transition hover:text-white"
          >
            Follow the thread
          </Link>
        </div>

        <div className="sm:col-span-2 grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-[#E3D4BA] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A9B76]">
              Live trace
            </p>
            <p className="mt-3 font-[var(--font-display)] text-3xl font-semibold text-[#2F3E2E]">
              {liveSignalCount}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#4D3F33]">
              {live.storyCount} stories, {live.storytellerCount} storytellers, {live.mediaCount} media
              assets currently shaping how this work is seen in public.
            </p>
          </div>

          {secondStill ? (
            <div className="overflow-hidden rounded-[28px] border border-[#E3D4BA] bg-[#F8F1E5]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={secondStill.url}
                  alt={secondStill.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  {secondStill.eyebrow || 'Field still'}
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm leading-6 text-[#4D3F33]">
                  {secondStill.alt || 'Field documentation'}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
