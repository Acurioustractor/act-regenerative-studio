import { Parts } from "./Parts";
import styles from "./full-stop.module.css";

/** act.place, with the tractor as the full stop. Sized by font-size, like the wordmark. */
export function FullStop({ className }: { className?: string }) {
  return (
    <span className={[styles.fullStop, className].filter(Boolean).join(" ")} role="img" aria-label="act.place">
      <span aria-hidden="true" className={styles.letters}>
        act
        <span className={styles.dot}>
          <Parts className={styles.tractor} />
        </span>
        place
      </span>
    </span>
  );
}
