import type { ReactNode } from "react";
import styles from "./small.module.css";

// The small pieces from Pencil's board 02: the eyebrow over a heading, the rust rule, the rust square.

/** Mono capitals in rust over a heading (Pencil's Eyebrow, I7lf2l). */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={[styles.eyebrow, className].filter(Boolean).join(" ")}>{children}</p>;
}

/** A short rust bar (Pencil's Rule, ctFoO). */
export function Rule() {
  return <span aria-hidden="true" className={styles.rule} />;
}

/** The rust square (Pencil's Rust square, g5xia). 48 on the board; the Part of label uses it at 7. */
export function RustSquare({ size = 48 }: { size?: number }) {
  return <span aria-hidden="true" className={styles.square} style={{ width: size, height: size }} />;
}
