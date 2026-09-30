import { DISPLAY_NUMBER, TEL } from "./CallCTA";
import styles from "./call-line.module.css";

/**
 * The gold block that is the number to ring (Pencil: Call, DOvAn in the hero of Page 14b; nohWw in Pick up the phone).
 * The number is the phone line's own, DISPLAY_NUMBER in CallCTA.tsx, the one place it is written down. It is a way to
 * reach the line, not a statistic, so it carries no source beyond that. `label` is the words over it in the hero.
 */
export function CallLine({ label }: { label?: string }) {
  return (
    <a href={TEL} className={`${styles.call} ${label ? "" : styles.alone}`}>
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.number}>{DISPLAY_NUMBER}</span>
    </a>
  );
}
