import styles from "./loud-title.module.css";

/**
 * The loud voice: a few words in the loud face on ink, over a rust block (Pencil: Loud title WwOiE). The words come in
 * as a sentence and are set in capitals by the piece. The block sits where Pencil puts it, behind the last lines of
 * the three-line sample; longer or shorter words will want it moved.
 */
export function LoudTitle({ words, as: Words = "h2" }: { words: string; as?: "h1" | "h2" | "p" }) {
  return (
    <div className={styles.loud}>
      <span aria-hidden="true" className={styles.block} />
      <Words className={styles.words}>{words}</Words>
    </div>
  );
}
