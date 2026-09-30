"use client";

import { useState } from "react";
import styles from "./filter-pills.module.css";

export type Pill = { value: string; label: string };

/**
 * Pills that filter a list (Pencil: Filter pills RbsRA). One is on at a time; the first is usually "All". It holds no
 * list of its own: it says which pill is on, and the page filters. Controlled with `value` and `onChange`, or
 * uncontrolled with `defaultValue` (the first pill when there is none). On a phone the row scrolls sideways.
 */
export function FilterPills({
  label,
  pills,
  value,
  defaultValue,
  onChange,
}: {
  /** Read aloud for the group, e.g. "Filter stories by project". */
  label: string;
  pills: Pill[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [inner, setInner] = useState(defaultValue ?? pills[0]?.value);
  const current = value ?? inner;

  return (
    <div role="group" aria-label={label} className={styles.pills}>
      {pills.map((pill) => (
        <button
          key={pill.value}
          type="button"
          className={styles.pill}
          aria-pressed={pill.value === current}
          onClick={() => {
            setInner(pill.value);
            onChange?.(pill.value);
          }}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}
