"use client";

import { useState } from "react";
import { Film } from "@/components/pieces/Film";
import { Onward } from "@/components/pieces/Onward";
import { Photo } from "@/components/pieces/Photo";
import styles from "./field-chooser.module.css";

export type ChooserField = {
  id: string;
  number: string;
  name: string;
  line: string;
  /** The words after the number over the open field: "Find an alternative". */
  invitation: string;
  /** The field's page on act.place. */
  href: string;
  /** Where the field lives beyond act.place, and what that link says. */
  destinationHref: string;
  destinationLabel: string;
  /** The still, and the film the screening room chose for the field, when there is one. */
  poster: string;
  video?: string;
  mediaTitle?: string;
};

// On a phone the open field leaves the list, so pointing at or tabbing to a row must not open it: the row would vanish
// under the finger or the focus. There a press is what opens a field.
const onPhone = () => window.matchMedia("(max-width: 759px)").matches;

/**
 * Choose a way in: the five fields in a list and one open beside it (Pencil: Page 01 Home, Chooser m1de1; Phone · 01
 * Home, where the open field comes first and the other four follow). Pointing at, focusing or pressing a field opens it
 * (on a phone, pressing only). Each open field says where it lives here and where it lives beyond.
 */
export function FieldChooser({ fields }: { fields: ChooserField[] }) {
  const [activeId, setActiveId] = useState(fields[0].id);
  const active = fields.find((field) => field.id === activeId) ?? fields[0];
  const point = (id: string) => {
    if (!onPhone()) setActiveId(id);
  };

  return (
    <div className={styles.chooser}>
      <ul className={styles.list} aria-label="The five fields">
        {fields.map((field) => (
          <li key={field.id}>
            <button
              type="button"
              className={styles.row}
              aria-pressed={field.id === active.id}
              onMouseEnter={() => point(field.id)}
              onFocus={() => point(field.id)}
              onClick={() => setActiveId(field.id)}
            >
              <span className={styles.number}>{field.number}</span>
              <span className={styles.words}>
                <span className={styles.name}>{field.name}</span>
                <span className={styles.line}>{field.line}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <article key={active.id} className={styles.reveal} aria-live="polite">
        <div className={styles.photo}>
          {active.video ? (
            <Film
              src={active.video}
              poster={active.poster}
              label={active.mediaTitle ? `${active.name}: ${active.mediaTitle}` : undefined}
              className={styles.film}
            />
          ) : (
            <Photo src={active.poster} alt="" className={styles.film} />
          )}
        </div>
        <p className={styles.kicker}>
          {active.number} · {active.invitation}
        </p>
        <h3 className={styles.title}>{active.name}</h3>
        <p className={styles.description}>{active.line}</p>
        <div className={styles.links}>
          <Onward href={active.href} tone="fg">
            Enter the field story
          </Onward>
          <a href={active.destinationHref} target="_blank" rel="noopener noreferrer" className={styles.external}>
            {active.destinationLabel} ↗
          </a>
        </div>
      </article>
    </div>
  );
}
