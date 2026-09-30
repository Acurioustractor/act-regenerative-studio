import type { ButtonHTMLAttributes } from "react";
import { Wheel, rolls } from "./Onward";
import styles from "./send-button.module.css";

/**
 * The button that sends a form (Pencil: Send button, G9eS6, and the Button inside Newsletter sign-up, aY7Rl). Ink
 * ground, paper words in mono capitals, and the small wheel where Pencil draws an arrow: it rolls on hover and focus.
 * A submit button unless told otherwise. While a send is under way (`pending`) it waits and the wheel is gone: nothing
 * is going anywhere yet.
 */
export function SendButton({
  children,
  className,
  type = "submit",
  pending = false,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean }) {
  return (
    <button
      {...rest}
      type={type}
      disabled={pending || disabled}
      aria-busy={pending || undefined}
      className={[styles.send, rolls, className].filter(Boolean).join(" ")}
    >
      <span>{children}</span>
      {!pending && (
        <span className={styles.wheel}>
          <Wheel />
        </span>
      )}
    </button>
  );
}
