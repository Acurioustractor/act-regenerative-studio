import type { ReactNode } from "react";
import styles from "./chapter.module.css";

/**
 * A long page in chapters: the number and a kicker (often a date or a name for the stretch) in the margin, then the
 * heading and the prose (Pencil: Chapter u6VSho). Children are the prose, one <p> per paragraph.
 */
export function Chapter({
  number,
  kicker,
  heading,
  children,
  headingAs: Heading = "h2",
}: {
  /** "01". */
  number: string;
  kicker: string;
  heading: string;
  children: ReactNode;
  headingAs?: "h2" | "h3";
}) {
  return (
    <section className={styles.chapter}>
      <div className={styles.margin}>
        <p className={styles.number}>{number}</p>
        <p className={styles.kicker}>{kicker}</p>
      </div>
      <div className={styles.body}>
        <Heading className={styles.heading}>{heading}</Heading>
        <div className={styles.text}>{children}</div>
      </div>
    </section>
  );
}
