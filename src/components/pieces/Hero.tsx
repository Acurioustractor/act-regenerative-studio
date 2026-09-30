"use client";

import { Fragment, useEffect, useState } from "react";
import styles from "./hero.module.css";

/** Lines of a small label, set one under the other. */
function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={line}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}

/** The label and, once the page is up, the time at the place, ticking over each half minute. */
function LocalTime({ label, timeZone }: { label: string; timeZone: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit", hour12: true, timeZone });
    const tick = () => setNow(format.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, [timeZone]);

  return (
    <p className={styles.time}>
      {label}
      {now && <> {now}</>}
    </p>
  );
}

/**
 * The home page's opening: one photograph in ink and paper only, the loud face over a rust block, and small mono labels
 * at the corners (Pencil: Section / Hero LPNhx at 1440 by 860; Page 01 Home, and Phone · 01 Home T4XPf at 390 by 560,
 * where only the words and the block remain). Below 1440 the drawing scales down as one; below 1080 it is rebuilt as the
 * phone's, larger. `words` is one entry per line and is the page's h1.
 */
export function Hero({
  image,
  place,
  timeLabel,
  timeZone,
  line,
  words,
  oneLine,
  method,
  down,
}: {
  /** The photograph. It is drawn in greys between ink and paper; it is decoration, so it carries no alt text. */
  image: string;
  /** Top left, one entry per line, in sentence case. */
  place: string[];
  /** Top middle: the label, and after it the time at the place. */
  timeLabel: string;
  /** IANA name of the place's time zone, for the clock. */
  timeZone: string;
  /** Top right, one entry per line. */
  line: string[];
  /** The loud words, one entry per line. */
  words: string[];
  /** The sentence under the words. */
  oneLine: string;
  /** Bottom left, one entry per line. */
  method: string[];
  /** Bottom middle: where the page goes on to. */
  down: { label: string; href: string };
}) {
  return (
    <div className={styles.frame}>
      <section className={styles.hero} aria-labelledby="hero-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.image} src={image} alt="" fetchPriority="high" decoding="async" />
        <span aria-hidden="true" className={styles.tint} />

        <p className={styles.place}>
          <Lines lines={place} />
        </p>
        <LocalTime label={timeLabel} timeZone={timeZone} />
        <p className={styles.line}>
          <Lines lines={line} />
        </p>

        <span aria-hidden="true" className={styles.block} />
        <h1 id="hero-title" className={styles.words}>
          {words.map((word) => (
            <span key={word} className={styles.word}>
              {word}
            </span>
          ))}
        </h1>

        <p className={styles.oneLine}>{oneLine}</p>
        <p className={styles.method}>
          <Lines lines={method} />
        </p>
        <a className={styles.down} href={down.href}>
          <span aria-hidden="true">↓</span> {down.label}
        </a>
      </section>
    </div>
  );
}
