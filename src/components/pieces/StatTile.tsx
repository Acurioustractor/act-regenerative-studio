import { canShowStat, isText, type StatSource } from "./stat-source";
import styles from "./stat-tile.module.css";

export type { StatSource };

/**
 * A figure and what it counts (Pencil: Stat tile PZ8tE). A figure never runs without its source: `source` is required,
 * and the tile renders nothing at all if the source has no name or the figure has no text, so a bare number cannot
 * reach a page. (The types say the same; this holds at runtime for content that arrives untyped.)
 * Pass as="li" inside a list.
 */
export function StatTile({
  figure,
  counts,
  source,
  as: Item = "div",
}: {
  /** The number as it should read: "98.9%". */
  figure: string;
  /** What it counts, in a line. */
  counts: string;
  source: StatSource;
  as?: "div" | "li";
}) {
  if (!canShowStat(figure, source)) return null;

  return (
    <Item className={styles.item}>
      <div className={styles.tile}>
        <p className={styles.figure}>{figure}</p>
        <p className={styles.counts}>{counts}</p>
        <p className={styles.source}>
          Source ·{" "}
          {isText(source.href) ? (
            <a href={source.href} target="_blank" rel="noreferrer">
              {source.name}
            </a>
          ) : (
            source.name
          )}
        </p>
      </div>
    </Item>
  );
}
