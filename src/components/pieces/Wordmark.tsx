import styles from "./wordmark.module.css";

/**
 * A Curious Tractor, with the two o's as rust wheels. Every measure is in em, so the mark is set by its font-size
 * alone: 46px in the header, 24px on a phone.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={[styles.wordmark, className].filter(Boolean).join(" ")} role="img" aria-label="A Curious Tractor">
      <span aria-hidden="true" className={styles.letters}>
        A<i className={styles.space} />
        Curi<i className={styles.wheel} />
        us<i className={styles.space} />
        Tract<i className={styles.wheel} />r
      </span>
    </span>
  );
}
