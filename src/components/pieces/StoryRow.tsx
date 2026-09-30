import { PieceLink } from "./PieceLink";
import styles from "./story-row.module.css";

/**
 * One story as a line in a list (Pencil: Story row eT6wu): a mono marker in the margin, the title large. The marker is
 * whatever the list numbers by (an index, a project); the article itself carries no date, on purpose.
 */
export function StoryRow({ href, title, marker }: { href: string; title: string; marker?: string }) {
  return (
    <PieceLink href={href} className={styles.row}>
      <span className={styles.marker}>{marker}</span>
      <span className={styles.title}>{title}</span>
    </PieceLink>
  );
}
