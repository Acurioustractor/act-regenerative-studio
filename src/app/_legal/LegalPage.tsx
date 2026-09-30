import Link from "next/link";
import type { ReactNode } from "react";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Wheel, rolls } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { RustSquare } from "@/components/pieces/Small";
import { generalWays } from "@/lib/ways-on";
import styles from "./legal.module.css";

export type LegalSection = {
  title: string;
  /** Each paragraph as the page words it; a paragraph may carry a link. */
  paragraphs: ReactNode[];
};

/**
 * The one design Privacy and Terms share (Pencil: Page 15 · Privacy (and Terms), FCoht): the opening with its three
 * points, four numbered sections with the title in the margin, then the four ways on. The words come from the page.
 */
export function LegalPage({
  eyebrow,
  title,
  description,
  pointsLabel,
  points,
  contact,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  pointsLabel: string;
  points: string[];
  contact: { label: string; href: string };
  sections: LegalSection[];
}) {
  return (
    <Page>
      <section className={styles.opening}>
        <div className={styles.words}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>

        <aside className={styles.points} aria-labelledby="legal-points">
          <h2 id="legal-points" className={styles.eyebrow}>
            {pointsLabel}
          </h2>
          <ul className={styles.pointList}>
            {points.map((point) => (
              <li key={point} className={styles.point}>
                <RustSquare size={8} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link href={contact.href} className={`${styles.button} ${rolls}`}>
            <span>{contact.label}</span>
            <span className={styles.wheel}>
              <Wheel />
            </span>
          </Link>
        </aside>
      </section>

      <div className={styles.sections}>
        {sections.map((section, i) => {
          const id = `legal-section-${i + 1}`;
          return (
            <section key={section.title} className={styles.section} aria-labelledby={id}>
              <div className={styles.margin}>
                <p className={styles.number}>{String(i + 1).padStart(2, "0")}</p>
                <h2 id={id} className={styles.sectionTitle}>
                  {section.title}
                </h2>
              </div>
              <div className={styles.text}>
                {section.paragraphs.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <FourWaysOn {...generalWays} />
    </Page>
  );
}

/** A link inside a legal paragraph, drawn the way the design draws a link in reading text. */
export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.inlineLink}>
      {children}
    </Link>
  );
}
