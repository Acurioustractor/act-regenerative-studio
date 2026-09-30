'use client';

import { useEffect, useRef, useState } from 'react';

import { FilterPills } from '@/components/pieces/FilterPills';
import { Wheel } from '@/components/pieces/Onward';
import type { Confession, ConfessionTheme } from '@/data/confessions-mock';
import { themeMeta, themeOrder } from '@/data/confessions-mock';

import { renderTranscript } from './transcript';
import styles from './voicemail-inbox.module.css';

// A message plays its recording only when the caller consented to their voice and the audio carries nothing that
// identifies them. Every other message is shown as words, and has no play button.
const isCleared = (c: Confession) => c.audioStatus === 'cleared' && !!c.audioSrc;

// The inbox (Pencil: The inbox, mFUvx, its Message cards on Page 14b): every message in full, a filter by what each is
// about, and a voice to play where the caller cleared one. While a voice plays the small wheel turns on its button.
export function VoicemailInbox({ confessions }: { confessions: Confession[] }) {
  const [filter, setFilter] = useState<ConfessionTheme | 'all'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // One shared audio element for the whole inbox.
  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = '';
      audioRef.current = null;
    };
  }, []);

  // Drive whatever is playing: the real recording, with the progress line following its currentTime. If the audio
  // cannot load, the line still sweeps so the card answers, unless motion is reduced.
  useEffect(() => {
    const a = audioRef.current;
    if (!playingId || !a) {
      a?.pause();
      return;
    }
    const conf = confessions.find((c) => c.id === playingId);
    if (!conf || !isCleared(conf)) return;

    let fellBack = false;
    let raf = 0;
    const onTime = () => {
      if (a.duration > 0) setProgress(a.currentTime / a.duration);
    };
    const stop = () => setPlayingId(null);
    const startSweep = () => {
      fellBack = true;
      if (reduced) {
        setPlayingId(null);
        return;
      }
      const durMs = Math.min(Math.max(conf.durationSeconds * 110, 1800), 6000);
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / durMs);
        setProgress(p);
        if (p < 1) raf = requestAnimationFrame(tick);
        else setPlayingId(null);
      };
      raf = requestAnimationFrame(tick);
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', stop);
    a.addEventListener('error', startSweep);
    a.src = conf.audioSrc!;
    a.currentTime = 0;
    a.play().catch(startSweep);
    return () => {
      cancelAnimationFrame(raf);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', stop);
      a.removeEventListener('error', startSweep);
      if (!fellBack) a.pause();
    };
  }, [playingId, reduced, confessions]);

  const themes = themeOrder.filter((t) => confessions.some((c) => c.theme === t));
  const pills = [
    { value: 'all', label: 'All' },
    ...themes.map((t) => ({ value: t, label: themeMeta[t].label })),
  ];
  const shown = filter === 'all' ? confessions : confessions.filter((c) => c.theme === filter);

  const toggle = (id: string) => {
    setProgress(0);
    setPlayingId((cur) => (cur === id ? null : id));
  };

  return (
    <div>
      <div className={styles.filter}>
        <FilterPills
          label="Filter the messages by what each one is about"
          pills={pills}
          value={filter}
          onChange={(value) => {
            setPlayingId(null);
            setFilter(value as ConfessionTheme | 'all');
          }}
        />
      </div>

      <ul className={styles.messages}>
        {shown.map((c) => {
          const cleared = isCleared(c);
          const playing = playingId === c.id;
          return (
            <li key={c.id} className={`${styles.message} ${playing ? styles.playing : ''}`}>
              <div className={styles.top}>
                <span className={styles.theme}>{themeMeta[c.theme].label}</span>
                {cleared ? (
                  <button
                    type="button"
                    className={styles.play}
                    aria-pressed={playing}
                    onClick={() => toggle(c.id)}
                  >
                    {playing ? (
                      <>
                        <span aria-hidden="true" className={styles.turning}>
                          <Wheel />
                        </span>
                        Pause the voice
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className={styles.triangle} />
                        Play the voice
                      </>
                    )}
                  </button>
                ) : (
                  <span className={styles.wordsOnly}>Words only</span>
                )}
              </div>
              <blockquote className={styles.quote}>&ldquo;{renderTranscript(c.text)}&rdquo;</blockquote>
              {cleared && <span aria-hidden="true" className={styles.progress} style={{ transform: `scaleX(${playing ? progress : 0})` }} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
