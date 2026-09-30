import type { HTMLAttributes, ReactNode } from "react";
import "@/brand/tokens.css";
import { faces } from "./fonts";
import styles from "./surface.module.css";

/**
 * A paper or ink ground for Brand v1 pieces. Every piece is drawn inside one: it brings the tokens, the three faces and
 * the surface's colours. Nest an ink Surface inside a paper one for a dark band.
 */
export function Surface({
  tone = "paper",
  as: Tag = "div",
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  tone?: "paper" | "ink";
  as?: "div" | "section" | "header" | "footer" | "main";
  children: ReactNode;
}) {
  return (
    <Tag {...rest} data-surface={tone} className={[faces, styles.surface, className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
