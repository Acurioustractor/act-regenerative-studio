import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Wheel, rolls } from "./Onward";
import { PieceLink } from "./PieceLink";
import styles from "./link-button.module.css";

/**
 * A boxed button in mono capitals: ink fill (`solid`) or a hairline box (`outline`). It is a link when it has an `href`,
 * and a real button when it has not (Pencil: the "Ask a question" and "Share this field" pair on Page 01 Home, the
 * "Visit the Harvest" and "Read the story" pair on Page 08, drawn as frames with a 16 by 22 padding). `onward` puts the
 * small wheel after the words where Pencil draws "→". An "↗" or a "↓" is part of the words: write it in the label.
 * On an ink surface the ground and the words swap, as they do everywhere.
 */
export function LinkButton({
  href,
  children,
  variant = "solid",
  onward = false,
  className,
  ...rest
}: {
  href?: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  onward?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  const classes = [styles.button, styles[variant], rolls, className].filter(Boolean).join(" ");
  const inside = (
    <>
      <span>{children}</span>
      {onward && <Wheel />}
    </>
  );

  if (href) {
    const external = /^https?:/.test(href);
    return (
      <PieceLink
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : undefined)}
      >
        {inside}
      </PieceLink>
    );
  }

  return (
    <button type="button" {...rest} className={classes}>
      {inside}
    </button>
  );
}
