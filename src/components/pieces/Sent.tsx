"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Parts } from "./Parts";
import styles from "./sent.module.css";

/**
 * What a form shows once it has gone (Pencil: Page 03b, Contact sent: Sent B2T5GR and Ground AIQIw; the move is act-play's
 * "07 Unhitch"). The tractor drives off and the rust part stays: the trailer left behind is the message, with us. The
 * words come in through props. Where the form was, render this: focus moves to its heading, so it is read out when it
 * appears and a keyboard reader lands on it. With reduced motion set, the tractor is simply gone.
 */
export function Sent({
  eyebrow = "Sent",
  heading,
  children,
  left,
  againLabel,
  onAgain,
  as: Heading = "h2",
  takeFocus = true,
}: {
  /** The mono capitals over the heading. */
  eyebrow?: string;
  /** What we say first, in big type. */
  heading: string;
  /** What happens next. */
  children: ReactNode;
  /** The caption over the part left behind, e.g. what it stands for. Leave out for none. */
  left?: string;
  /** The words on the button that brings the form back. Shown only with `onAgain`. */
  againLabel?: string;
  /** Bring the form back. */
  onAgain?: () => void;
  as?: "h1" | "h2";
  /** Move focus here when it appears. Leave on when it replaces a form; turn off where it is shown on its own. */
  takeFocus?: boolean;
}) {
  const heard = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (takeFocus) heard.current?.focus({ preventScroll: true });
  }, [takeFocus]);

  return (
    <section className={styles.sent}>
      <div className={styles.words}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <Heading ref={heard} tabIndex={-1} className={styles.heading}>
          {heading}
        </Heading>
        <p className={styles.body}>{children}</p>
        {onAgain && (
          <button type="button" className={styles.again} onClick={onAgain}>
            {againLabel}
          </button>
        )}
      </div>

      <div className={styles.ground}>
        <span aria-hidden="true" className={styles.line} />
        {left && <p className={styles.caption}>{left}</p>}
        <span aria-hidden="true" className={styles.trailer}>
          <i className={styles.wheel} />
          <i className={styles.wheel} />
        </span>
        <span aria-hidden="true" className={styles.tractor}>
          <Parts name="tractor" rust="none" />
        </span>
      </div>
    </section>
  );
}
