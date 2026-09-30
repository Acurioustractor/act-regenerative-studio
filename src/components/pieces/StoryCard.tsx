import { useId } from "react";
import { Wheel, rolls } from "./Onward";
import { Photo } from "./Photo";
import { PieceLink } from "./PieceLink";
import styles from "./story-card.module.css";

/**
 * A story in a list or a grid (Pencil: Story card BUhG1, and Story card · text tile yk6Yr when it has no photograph).
 * The whole card is one link, named by its title. With no `photo`, a shade tile carries `tileWords` instead; the words
 * on it are the card's own (a series, a kind of piece), never a placeholder for the missing picture.
 * It only renders what it is given: the story comes from the Empathy Ledger.
 */
export function StoryCard({
  href,
  title,
  project,
  excerpt,
  author,
  photo,
  tileWords,
}: {
  href: string;
  title: string;
  /** The project or projects it belongs to, in mono capitals over the title. */
  project?: string;
  excerpt?: string;
  /** Who wrote it or told it, bottom left. */
  author?: string;
  photo?: { src: string; alt: string };
  /** For the tile with no photograph. A line break starts a new line. */
  tileWords?: string;
}) {
  const titleId = useId();

  return (
    <PieceLink href={href} className={`${styles.card} ${rolls}`} aria-labelledby={titleId}>
      {photo ? (
        <Photo src={photo.src} alt={photo.alt} className={styles.image} sizes="(max-width: 759px) 100vw, 420px" />
      ) : (
        <div className={styles.tile}>{tileWords && <p className={styles.tileWords}>{tileWords}</p>}</div>
      )}
      {project && <p className={styles.project}>{project}</p>}
      <h3 id={titleId} className={styles.title}>
        {title}
      </h3>
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
      <div className={styles.foot}>
        <span className={styles.author}>{author}</span>
        <span className={styles.read}>
          Read
          <Wheel />
        </span>
      </div>
    </PieceLink>
  );
}
