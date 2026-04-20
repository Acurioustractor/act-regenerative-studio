/**
 * Transcripts Section
 * Shows consented transcripts for a project with audio/video + transcript text.
 * Source of truth: src/lib/empathy-ledger-transcripts.ts (snapshot-backed).
 * Each transcript is gated by canDisplayTranscript (consent + cultural sensitivity).
 */

import Link from 'next/link';

import {
  canDisplayTranscript,
  type TranscriptRecord,
} from '@/lib/empathy-ledger-transcripts';
import { getStorytellerById } from '@/lib/empathy-ledger-storytellers';

interface TranscriptsSectionProps {
  transcripts: TranscriptRecord[];
  projectTitle: string;
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds || seconds <= 0) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function DescriptEmbed({ url }: { url: string }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      <iframe
        src={url}
        title="Transcript video"
        allow="autoplay; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

function MediaPlayer({ transcript }: { transcript: TranscriptRecord }) {
  const { sourceVideoPlatform, sourceVideoUrl, videoUrl, audioUrl } = transcript;

  if (sourceVideoPlatform === 'descript' && sourceVideoUrl) {
    return <DescriptEmbed url={sourceVideoUrl} />;
  }

  if (videoUrl || sourceVideoUrl) {
    return (
      <video
        controls
        preload="metadata"
        poster={transcript.sourceVideoThumbnail || undefined}
        className="w-full rounded-2xl bg-black"
      >
        <source src={(videoUrl || sourceVideoUrl) as string} />
      </video>
    );
  }

  if (audioUrl) {
    return (
      <audio controls preload="metadata" className="w-full">
        <source src={audioUrl} />
      </audio>
    );
  }

  return null;
}

export function TranscriptsSection({
  transcripts,
  projectTitle,
}: TranscriptsSectionProps) {
  const displayable = transcripts.filter(canDisplayTranscript);
  if (displayable.length === 0) return null;

  return (
    <section className="space-y-10">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          Transcripts
        </p>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)] md:text-3xl">
          In their own words
        </h2>
        <p className="mt-3 text-sm text-[var(--we-olive-deep)]">
          Voice and video from people connected to {projectTitle}, carried through Empathy Ledger with consent.
        </p>
      </div>

      <div className="space-y-10">
        {displayable.map((t) => {
          const duration = formatDuration(t.durationSeconds);
          const hasMedia = Boolean(
            t.sourceVideoUrl || t.videoUrl || t.audioUrl
          );
          return (
            <article
              key={t.id}
              className="grid gap-8 rounded-[28px] border border-[var(--we-sand)] bg-white p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:p-8"
            >
              <div className="space-y-5">
                {hasMedia ? <MediaPlayer transcript={t} /> : null}
                <div className="space-y-2">
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--we-olive)]">
                    {t.title}
                  </h3>
                  {t.storytellerName ? (
                    <p className="text-sm text-[var(--we-olive-deep)]">
                      {t.storytellerId && getStorytellerById(t.storytellerId) ? (
                        <Link
                          href={`/storytellers/${encodeURIComponent(t.storytellerId)}`}
                          className="underline decoration-[var(--we-sand)] underline-offset-4 hover:decoration-[var(--we-olive)]"
                        >
                          {t.storytellerName}
                        </Link>
                      ) : (
                        t.storytellerName
                      )}
                      {duration ? (
                        <span className="text-[var(--we-brown-deep)]">
                          {' '}· {duration}
                        </span>
                      ) : null}
                    </p>
                  ) : duration ? (
                    <p className="text-sm text-[var(--we-brown-deep)]">{duration}</p>
                  ) : null}
                </div>
                {t.themes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {t.themes.slice(0, 6).map((theme) => (
                      <span
                        key={theme}
                        className="rounded-full border border-[var(--we-sand)] bg-[#F6F1E7] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--we-olive)]"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                ) : null}
                {t.aiSummary ? (
                  <p className="text-sm leading-7 text-[var(--we-olive-deep)]">
                    {t.aiSummary}
                  </p>
                ) : null}
              </div>

              <div className="space-y-4">
                {t.keyQuotes.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                      Key quotes
                    </p>
                    <ul className="space-y-3">
                      {t.keyQuotes.slice(0, 3).map((q, i) => (
                        <li
                          key={i}
                          className="rounded-2xl bg-[#2F3E2E] p-4 text-sm leading-7 text-white"
                        >
                          “{q}”
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {t.segments.length > 0 ? (
                  <details className="group rounded-2xl border border-[var(--we-sand)] bg-[#FDFBF7] p-4">
                    <summary className="cursor-pointer text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                      Full transcript ({t.segments.length} segments)
                    </summary>
                    <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-2">
                      {t.segments.map((s, i) => (
                        <p key={i} className="text-sm leading-7 text-[var(--we-olive-deep)]">
                          {s.speaker ? (
                            <span className="font-semibold text-[var(--we-olive)]">
                              {s.speaker}:{' '}
                            </span>
                          ) : null}
                          {s.text}
                        </p>
                      ))}
                    </div>
                  </details>
                ) : t.content ? (
                  <details className="group rounded-2xl border border-[var(--we-sand)] bg-[#FDFBF7] p-4">
                    <summary className="cursor-pointer text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
                      Full transcript
                    </summary>
                    <div className="mt-4 max-h-[28rem] overflow-y-auto pr-2 text-sm leading-7 text-[var(--we-olive-deep)] whitespace-pre-wrap">
                      {t.content}
                    </div>
                  </details>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
