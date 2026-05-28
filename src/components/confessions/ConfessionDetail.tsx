import type { Confession } from '@/data/confessions-mock';
import { themeMeta } from '@/data/confessions-mock';

import { formatDuration, renderTranscript } from './transcript';
import { Waveform } from './Waveform';

// The voice you patched through to. Clicking a node in the Switchboard or the
// Murmuration surfaces it here: theme glows, transcript scrolls in, waveform
// stands in for the recording (audio plays here once the real line is live).
export function ConfessionDetail({ confession }: { confession: Confession | null }) {
  if (!confession) {
    return (
      <p className="text-center font-[var(--font-sans)] text-[11px] uppercase tracking-[0.3em] text-[#7C7060]">
        Click a light to patch through to a voice
      </p>
    );
  }

  const t = themeMeta[confession.theme];

  return (
    <div
      className="confession-detail-in mx-auto max-w-2xl rounded-2xl border bg-[#1E160D] p-7 md:p-8"
      style={{ borderColor: `rgba(${t.rgb},0.35)` }}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className="font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: `rgb(${t.rgb})`, textShadow: `0 0 16px rgba(${t.rgb},0.55)` }}
        >
          {t.label}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.05em] text-[#9A8C73]">
          <span aria-hidden="true">▸</span> voicemail · {formatDuration(confession.durationSeconds)}
        </span>
      </div>
      <div className="mt-4">
        <Waveform seed={confession.id + confession.text.slice(0, 12)} bars={52} />
      </div>
      <blockquote className="mt-5 font-[var(--font-body)] text-lg leading-9 text-[#E4D8C4]">
        {renderTranscript(confession.text)}
      </blockquote>
    </div>
  );
}
