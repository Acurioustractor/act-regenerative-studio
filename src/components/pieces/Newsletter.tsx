import { useId } from "react";
import type { FormHTMLAttributes, InputHTMLAttributes } from "react";
import { RustSquare } from "./Small";
import { SendButton } from "./SendButton";
import styles from "./newsletter.module.css";

/**
 * The sign-up (Pencil: Newsletter sign-up, Agacj): a heavy rule, one line of mono capitals, an email box and the
 * button on the same row. It is a plain form with one `email` field. The words come in through props; nothing here
 * sends anything, so give it an `onSubmit` or an `action` as any form. Pair it with Sent for the moment it goes through.
 */
export function Newsletter({
  label,
  placeholder,
  button,
  name = "email",
  error,
  pending = false,
  input,
  className,
  ...form
}: Omit<FormHTMLAttributes<HTMLFormElement>, "children"> & {
  /** The line over the row, in sentence case. */
  label: string;
  /** The words in the empty email box. */
  placeholder: string;
  /** The words on the button. */
  button: string;
  /** The field name the form posts. */
  name?: string;
  /** Says what is wrong, under the row. */
  error?: string;
  /** A send is under way: the box and the button wait. */
  pending?: boolean;
  /** More for the email box (value, onChange, autoComplete, ...). */
  input?: Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "type" | "placeholder">;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <form {...form} className={[styles.newsletter, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.row}>
        <input
          autoComplete="email"
          required
          disabled={pending}
          {...input}
          id={id}
          name={name}
          type="email"
          placeholder={placeholder}
          className={styles.email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <SendButton className={styles.button} pending={pending}>
          {button}
        </SendButton>
      </div>
      {error && (
        <p id={errorId} role="alert" className={styles.error}>
          <RustSquare size={7} />
          <span>{error}</span>
        </p>
      )}
    </form>
  );
}
