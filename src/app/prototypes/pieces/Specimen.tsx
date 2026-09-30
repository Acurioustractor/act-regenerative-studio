import type { ReactNode } from "react";
import styles from "./pieces.module.css";

/** One piece on the sheet, framed at the width Pencil draws it, and tagged with its Pencil node for comparison. */
export function Specimen({
  node,
  name,
  width,
  tone = "paper",
  children,
}: {
  node: string;
  name: string;
  width?: number;
  tone?: "paper" | "ink";
  children: ReactNode;
}) {
  return (
    <section className={styles.specimen} aria-label={name}>
      <p className={styles.caption}>
        {name} · Pencil {node}
      </p>
      <div className={styles.frame} data-piece={node} data-surface={tone} style={width ? { width } : undefined}>
        {children}
      </div>
    </section>
  );
}
