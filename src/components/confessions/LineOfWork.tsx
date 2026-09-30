import type { ReactNode } from "react";
import { Onward } from "@/components/pieces/Onward";
import look from "./look.module.css";
import styles from "./line-of-work.module.css";

/**
 * "A line of work": the phones ACT has built, and where to see them (Pencil: A line of work, q6Uu0V on Page 14 and
 * Is3Mu on Page 14b). The words differ by page, so they come in; only the heading is the work's own.
 */
export function LineOfWork({
  border = false,
  words,
  href,
  linkLabel,
}: {
  /** The quiet gold rule over it, drawn on the edition page and not on the series page. */
  border?: boolean;
  words: ReactNode;
  href: string;
  linkLabel: string;
}) {
  return (
    <section className={`${styles.line} ${border ? styles.border : ""}`} aria-labelledby="line-of-work">
      <div className={styles.left}>
        <p className={look.eyebrow}>A line of work</p>
        <h2 id="line-of-work" className={styles.heading}>
          This is not the first phone we have built.
        </h2>
      </div>
      <div className={styles.right}>
        <p className={styles.words}>{words}</p>
        <Onward href={href} tone="fg">
          {linkLabel}
        </Onward>
      </div>
    </section>
  );
}
