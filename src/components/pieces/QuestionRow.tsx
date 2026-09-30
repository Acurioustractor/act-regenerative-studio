import Link from "next/link";
import { Wheel, rolls } from "./Onward";
import styles from "./question-row.module.css";

/**
 * One question in a list: its number, where it stands and what it is part of, the question and a line that invites
 * (Pencil: Question row zNR0b). status, fields, question and invitation are a Question's own. The whole row is the one
 * link, and its wheel rolls when any part of it is pointed at. Pass as="li" inside a list.
 */
export function QuestionRow({
  number,
  status,
  fields,
  question,
  invitation,
  href,
  as: Item = "div",
  headingAs: Title = "h3",
}: {
  /** "03". */
  number: string;
  /** "Growing", "Still open" or "Answered for now". */
  status: string;
  /** The tags as written: "Justice", "Evidence", "Community". */
  fields: string[];
  question: string;
  invitation: string;
  href: string;
  as?: "div" | "li";
  headingAs?: "h2" | "h3" | "h4";
}) {
  return (
    <Item className={styles.item}>
      <Link href={href} className={`${styles.row} ${rolls}`}>
        <span className={styles.number}>{number}</span>
        <span className={styles.body}>
          <span className={styles.status}>{[status, fields.join(", ")].filter(Boolean).join(" · ")}</span>
          <Title className={styles.question}>{question}</Title>
          <span className={styles.invitation}>{invitation}</span>
        </span>
        <span className={styles.arrow}>
          <Wheel />
        </span>
      </Link>
    </Item>
  );
}
