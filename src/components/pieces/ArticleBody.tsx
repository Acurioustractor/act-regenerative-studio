import type { ReactNode } from "react";
import { Photo } from "./Photo";
import { RustSquare } from "./Small";
import styles from "./article-body.module.css";

/**
 * The column an article's words run in: 680 wide, centred, 22 between blocks (Pencil: Body, page items D and E, and
 * the article page nq1e6). A Figure steps out to 1000 wide, and to the full width on a phone. Put the blocks below in it.
 */
export function ArticleBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

/** A paragraph: 20 on 1.6 (Pencil: Paragraph R1wK5). Its words are the storyteller's, so it takes them as given. */
export function Paragraph({ children }: { children: ReactNode }) {
  return <p className={styles.paragraph}>{children}</p>;
}

/** A heading inside an article (Pencil: Body heading p4dfi). An h2 unless the article nests deeper. */
export function BodyHeading({ children, level = 2 }: { children: ReactNode; level?: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3";
  return <Tag className={styles.heading}>{children}</Tag>;
}

/** A pause between parts of a story: the rust square on its own line (Pencil: Divider YPZDq). */
export function Divider() {
  return (
    <div role="separator" className={styles.divider}>
      <RustSquare size={12} />
    </div>
  );
}

/**
 * A line the piece itself said, set large on a rust bar (Pencil: Pull quote MF3w7). Word for word from the piece:
 * never written for the page. `from` names where it comes from (the piece, or the person who said it).
 */
export function PullQuote({ quote, from }: { quote: string; from?: string }) {
  return (
    <figure className={styles.pullQuote}>
      <blockquote className={styles.quote}>
        <p>{quote}</p>
      </blockquote>
      {from && <figcaption className={styles.from}>{from}</figcaption>}
    </figure>
  );
}

/**
 * A photograph in the story (Pencil: Figure hGi4g). A caption is the words of the people in it, or nothing: without
 * `caption` no caption is drawn.
 */
export function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  /** The photograph's own proportions, when known, so the words do not jump when it arrives. */
  width?: number;
  height?: number;
}) {
  // With its own proportions the photograph is shown whole, not cropped to Pencil's 1000 by 560, and the frame still
  // holds its place before it arrives. Without them, Pencil's frame.
  const shape = width && height ? { aspectRatio: `${width} / ${height}` } : undefined;
  return (
    <figure data-lane="wide" className={styles.figure}>
      <div className={styles.image} style={shape}>
        <Photo src={src} alt={alt} className={styles.fill} sizes="(max-width: 759px) 100vw, 1000px" />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
