import type { ButtonHTMLAttributes } from "react";
import { Wheel, rolls } from "./Onward";
import styles from "./send-button.module.css";

/**
 * The button that sends a form (Pencil: Send button, G9eS6, and the Button inside Newsletter sign-up, aY7Rl). Ink
 * ground, paper words in mono capitals, and the small wheel where Pencil draws an arrow: it rolls on hover and focus.
 * A submit button unless told otherwise; `disabled` while a send is under way.
 */
export function SendButton({
  children,
  className,
  type = "submit",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} type={type} className={[styles.send, rolls, className].filter(Boolean).join(" ")}>
      <span>{children}</span>
      <span className={styles.wheel}>
        <Wheel />
      </span>
    </button>
  );
}
