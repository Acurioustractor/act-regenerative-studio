import Link from "next/link";
import { Onward } from "./Onward";
import styles from "./act-strip.module.css";

/**
 * The slim strip over a work that keeps its own look inside act.place (Pencil: ACT strip, oLYJ2 on Page 14 and XLM2m on
 * Page 14b). It says whose work this is and gives the way back to the wider body of work. Paper, like the header, so
 * the page under it can be any colour it likes. `context` is the words after "An artwork by A Curious Tractor".
 */
export function ActStrip({ context, back }: { context: string; back: { label: string; href: string } }) {
  return (
    <header className={styles.strip}>
      <p className={styles.words}>
        An artwork by{" "}
        <Link href="/" className={styles.home}>
          A Curious Tractor
        </Link>
        <span aria-hidden="true"> · </span>
        <span className={styles.context}>{context}</span>
      </p>
      <Onward back href={back.href} className={styles.back}>
        {back.label}
      </Onward>
    </header>
  );
}
