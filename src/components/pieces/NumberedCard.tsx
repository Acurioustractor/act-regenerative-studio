import styles from "./numbered-card.module.css";

/**
 * A short numbered card: the doors, the convictions (Pencil: Numbered card L1GHII). Pass as="li" inside a list.
 */
export function NumberedCard({
  number,
  title,
  text,
  as: Item = "div",
  headingAs: Title = "h3",
}: {
  /** "01". */
  number: string;
  title: string;
  text: string;
  as?: "div" | "li";
  headingAs?: "h2" | "h3" | "h4";
}) {
  return (
    <Item className={styles.item}>
      <div className={styles.card}>
        <p className={styles.number}>{number}</p>
        <Title className={styles.title}>{title}</Title>
        <p className={styles.text}>{text}</p>
      </div>
    </Item>
  );
}
