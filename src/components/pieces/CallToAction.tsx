import { useId } from "react";
import { Wheel, rolls } from "./Onward";
import { PieceLink } from "./PieceLink";
import { Surface } from "./Surface";
import styles from "./call-to-action.module.css";

/**
 * The band that closes an article, on ink (Pencil: Call to action KdzlR): a kicker, one statement, and up to three
 * places to go. Each button is a link with the small wheel, which rolls when you point at it.
 */
export function CallToAction({
  kicker = "Keep moving",
  heading,
  actions,
}: {
  kicker?: string;
  heading: string;
  actions: Array<{ label: string; href: string }>;
}) {
  const headingId = useId();

  return (
    <Surface tone="ink" as="section" className={styles.cta} aria-labelledby={headingId}>
      <p className={styles.kicker}>{kicker}</p>
      <h2 id={headingId} className={styles.heading}>
        {heading}
      </h2>
      <div className={styles.buttons}>
        {actions.map((action) => (
          <PieceLink key={action.href + action.label} href={action.href} className={`${styles.button} ${rolls}`}>
            <span>{action.label}</span>
            <Wheel />
          </PieceLink>
        ))}
      </div>
    </Surface>
  );
}
