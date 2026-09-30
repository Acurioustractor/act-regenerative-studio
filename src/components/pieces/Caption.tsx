import styles from "./caption.module.css";

/**
 * A caption laid over a photograph: the words of the people in it, exactly as they said them, or no caption at all
 * (Pencil: Caption gzAFI, "verbatim or nothing"). It renders nothing when there are no words.
 */
export function Caption({ words }: { words: string }) {
  if (!words?.trim()) return null;
  return (
    <div className={styles.caption}>
      <p className={styles.words}>{words}</p>
    </div>
  );
}
