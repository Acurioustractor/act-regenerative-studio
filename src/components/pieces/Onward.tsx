import type { ReactNode } from "react";
import { PieceLink } from "./PieceLink";
import styles from "./onward.module.css";

/**
 * The small wheel that stands where an arrow would: "The arrow is the small wheel, and it rolls toward where you are
 * going" (Pencil, 12 Play). It rolls and turns rust when anything with the `rolls` class around it is pointed at.
 */
export function Wheel() {
  return <i aria-hidden="true" className={styles.wheel} />;
}

/** The class that makes a Wheel inside roll on hover and focus. Put it on the link. */
export const rolls = styles.rolls;

/**
 * A link that goes somewhere: its words in mono capitals, then the wheel. `back` is a link to where you came from, such
 * as "All stories": the wheel leads and rolls back the way you came.
 */
export function Onward({
  href,
  children,
  tone = "accent",
  back = false,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "accent" | "fg";
  back?: boolean;
  className?: string;
}) {
  const classes = [styles.onward, styles.rolls, styles[tone], back && styles.back, className].filter(Boolean).join(" ");
  return (
    <PieceLink href={href} className={classes}>
      {back && <Wheel />}
      <span>{children}</span>
      {!back && <Wheel />}
    </PieceLink>
  );
}
