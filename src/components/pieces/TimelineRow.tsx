import styles from "./timeline-row.module.css";

/**
 * One step in a history: when, then what happened (Pencil: Timeline row ihmpx). Pass as="li" inside a list.
 */
export function TimelineRow({
  when,
  title,
  text,
  as: Item = "div",
  headingAs: Title = "h3",
}: {
  /** "31 Jul 2022", "2023 to 24", "Next". Set in capitals by the piece. */
  when: string;
  title: string;
  text: string;
  as?: "div" | "li";
  headingAs?: "h2" | "h3" | "h4";
}) {
  return (
    <Item className={styles.item}>
      <div className={styles.row}>
        <p className={styles.when}>{when}</p>
        <div className={styles.what}>
          <Title className={styles.title}>{title}</Title>
          <p className={styles.text}>{text}</p>
        </div>
      </div>
    </Item>
  );
}
