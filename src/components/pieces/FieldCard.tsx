import Link from "next/link";
import { Wheel, rolls } from "./Onward";
import styles from "./field-card.module.css";

/**
 * One of the five fields as a card: number, name, its line and a way in (Pencil: Field card n6ix0f). The whole card is
 * the one link, so its wheel rolls when any part of it is pointed at. Pass as="li" inside a list.
 */
export function FieldCard({
  number,
  name,
  line,
  href,
  linkLabel = "Enter the field",
  as: Item = "div",
  headingAs: Name = "h3",
}: {
  number: string;
  name: string;
  line: string;
  href: string;
  linkLabel?: string;
  as?: "div" | "li";
  headingAs?: "h2" | "h3" | "h4";
}) {
  return (
    <Item className={styles.item}>
      <Link href={href} className={`${styles.card} ${rolls}`}>
        <span className={styles.number}>{number}</span>
        <Name className={styles.name}>{name}</Name>
        <p className={styles.line}>{line}</p>
        <span className={styles.link}>
          {linkLabel}
          <Wheel />
        </span>
      </Link>
    </Item>
  );
}
