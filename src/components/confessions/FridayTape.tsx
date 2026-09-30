'use client';

// The Friday Tape: play the week's cleared confessions back in sequence
// (money -> power -> hope), one continuous "said out loud" reckoning. Each card
// is the real recording; pressing "Play the week back" runs them end to end,
// auto-advancing, and any card can be played on its own.

import { useEffect, useRef, useState } from 'react';

import type { Confession } from '@/data/confessions-mock';
import { realConfessions, themeMeta } from '@/data/confessions-mock';
import { Wheel } from '@/components/pieces/Onward';

import styles from './friday-tape.module.css';
import { renderTranscript } from './transcript';

const THEME_SEQ = ['money', 'power', 'the forms', 'shame', 'hope', 'breakthrough', 'the weird'];

// the cleared (audio) confessions, ordered to match the honest version's arc
const TAPE: Confession[] = realConfessions
  .filter((c) => c.audioStatus === 'cleared' && !!c.audioSrc)
  .sort((a, b) => THEME_SEQ.indexOf(a.theme) - THEME_SEQ.indexOf(b.theme));

export function FridayTape() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idxRef = useRef<number | null>(null);
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  // one shared audio element; on a track ending, advance to the next in the tape
  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    const onEnded = () => {
      const cur = idxRef.current;
      if (cur !== null && cur + 1 < TAPE.length) {
        const next = cur + 1;
        a.src = TAPE[next].audioSrc!;
        a.currentTime = 0;
        a.play().then(() => setIdx(next)).catch(() => setIdx(null));
      } else {
        setIdx(null);
      }
    };
    a.addEventListener('ended', onEnded);
    audioRef.current = a;
    return () => {
      a.pause();
      a.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, []);

  const playFrom = (i: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.src = TAPE[i].audioSrc!;
    a.currentTime = 0;
    a.play().then(() => setIdx(i)).catch(() => setIdx(null));
  };

  const toggleAll = () => {
    const a = audioRef.current;
    if (!a) return;
    if (idx !== null) {
      a.pause();
      setIdx(null);
    } else {
      playFrom(0);
    }
  };

  const toggleOne = (i: number) => {
    const a = audioRef.current;
    if (!a) return;
    if (idx === i) {
      a.pause();
      setIdx(null);
    } else {
      playFrom(i);
    }
  };

  return (
    <div className={styles.tape}>
      <div className={styles.controls}>
        <button type="button" onClick={toggleAll} aria-pressed={idx !== null} className={styles.playAll}>
          {idx !== null ? (
            <>
              <span aria-hidden="true" className={styles.turning}>
                <Wheel />
              </span>
              Stop the tape
            </>
          ) : (
            <>
              <span aria-hidden="true" className={styles.triangle} />
              Play the week back
            </>
          )}
        </button>
        <p className={styles.note}>Messages, in sequence</p>
      </div>

      <ol className={styles.tracks}>
        {TAPE.map((c, i) => {
          const playing = idx === i;
          const t = themeMeta[c.theme];
          return (
            <li key={c.id} className={`${styles.track} ${playing ? styles.playing : ''}`}>
              <button
                type="button"
                onClick={() => toggleOne(i)}
                aria-label={playing ? 'Pause this message' : 'Play this message'}
                aria-pressed={playing}
                className={styles.trackPlay}
              >
                {playing ? (
                  <span aria-hidden="true" className={styles.turning}>
                    <Wheel />
                  </span>
                ) : (
                  <span aria-hidden="true" className={styles.triangle} />
                )}
              </button>
              <div className={styles.trackWords}>
                <span className={styles.theme}>{t.label}</span>
                <blockquote className={styles.quote}>&ldquo;{renderTranscript(c.text)}&rdquo;</blockquote>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
