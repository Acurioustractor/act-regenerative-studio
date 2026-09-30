import { useId } from "react";
import type {
  FormHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { RustSquare } from "./Small";
import styles from "./form-fields.module.css";

// The form fields from Pencil's board 02 (Input jSQEz, Choice ffNkC, Message WKcpA). Each is a real label tied to a real
// input, select or textarea, so they sit in a plain HTML form: `name`, `required`, `autoComplete`, `value` and
// `onChange` pass straight through to the element, and the form posts what it always posted.

type Common = {
  /** Mono capitals over the box, written in sentence case. */
  label: string;
  /** Says what is wrong, under the box. The box turns rust-edged and the message is announced. */
  error?: string;
};

/** The label, the box the caller supplies, and the error slot: one shape for all three fields. */
function Field({
  id,
  label,
  error,
  errorId,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className={styles.error}>
          <RustSquare size={7} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

const ids = (given: string | undefined, generated: string) => {
  const id = given ?? generated;
  return { id, errorId: `${id}-error` };
};

/** A line of text: a name, an email (Pencil: Input, jSQEz). */
export function Input({
  label,
  error,
  id: given,
  className,
  ...rest
}: Common & InputHTMLAttributes<HTMLInputElement>) {
  const { id, errorId } = ids(given, useId());
  return (
    <Field id={id} label={label} error={error} errorId={errorId}>
      <input
        type="text"
        {...rest}
        id={id}
        className={[styles.control, className].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
    </Field>
  );
}

export type ChoiceOption = { value: string; label: string };

/**
 * One of a few (Pencil: Choice, ffNkC). A native select, so it opens the way the device opens one. The first option is
 * the prompt, with an empty value, and reads as a placeholder until something else is chosen.
 */
export function Choice({
  label,
  error,
  id: given,
  className,
  prompt,
  options,
  ...rest
}: Common &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
    /** The words in the box before anything is chosen. */
    prompt: string;
    options: ChoiceOption[];
  }) {
  const { id, errorId } = ids(given, useId());
  return (
    <Field id={id} label={label} error={error} errorId={errorId}>
      <div className={styles.choice}>
        <select
          {...rest}
          id={id}
          className={[styles.control, styles.select, className].filter(Boolean).join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        >
          <option value="">{prompt}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}

/** A few lines of their own words (Pencil: Message, WKcpA). */
export function Message({
  label,
  error,
  id: given,
  className,
  ...rest
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { id, errorId } = ids(given, useId());
  return (
    <Field id={id} label={label} error={error} errorId={errorId}>
      <textarea
        {...rest}
        id={id}
        className={[styles.control, styles.message, className].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
    </Field>
  );
}

/** The gap between fields (Pencil: Form set, G3qo9T). A form; give it an `onSubmit` or an `action` as any form. */
export function FormSet({ className, children, ...rest }: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form {...rest} className={[styles.formSet, className].filter(Boolean).join(" ")}>
      {children}
    </form>
  );
}
