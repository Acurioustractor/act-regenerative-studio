import type { PartRole } from "@/brand/brand";
import styles from "./part-glyph.module.css";

/**
 * One part of the tractor, small, standing for its door: the big wheel for Stories, the small wheel for Questions,
 * the cab for The work, the bonnet for Art. It takes the colour of its text, so a door turns it rust.
 * "door" is the size under the header's labels; "way" the size in four ways on and the phone menu.
 */
export function PartGlyph({ part, size = "door" }: { part: PartRole; size?: "door" | "way" }) {
  return <i aria-hidden="true" className={`${styles.glyph} ${styles[size]} ${styles[part]}`} />;
}
