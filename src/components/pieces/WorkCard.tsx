import type { ReactNode } from "react";
import { Wheel, rolls } from "./Onward";
import { PieceLink } from "./PieceLink";
import styles from "./work-card.module.css";

/**
 * A project on The work page: photo, what it is called, its line, one sentence and one link (Pencil: Work card XLWbP).
 * There is no record strip and no "Held by" on it: that is an open decision and is not shown. The whole card is the one
 * link. size="feature" is how The work page sets it, with a taller photo and a bigger title. Pass as="li" in a list.
 */
export function WorkCard({
  photo,
  kicker,
  title,
  sentence,
  link,
  size = "card",
  as: Item = "div",
  headingAs: Title = "h3",
}: {
  photo: { src: string; alt: string };
  /** "02 · JusticeHub": a number, then the field it belongs to. */
  kicker: string;
  title: string;
  sentence: string;
  /** The one link, its label ("Search JusticeHub") and where it goes. */
  link: { label: string; href: string };
  size?: "card" | "feature";
  as?: "div" | "li";
  headingAs?: "h2" | "h3" | "h4";
}) {
  const inner: ReactNode = (
    <>
      <span className={styles.photo}>
        <img src={photo.src} alt={photo.alt} width={440} height={size === "feature" ? 400 : 280} loading="lazy" />
      </span>
      <span className={styles.kicker}>{kicker}</span>
      <Title className={styles.title}>{title}</Title>
      <p className={styles.sentence}>{sentence}</p>
      <span className={styles.link}>
        {link.label}
        <Wheel />
      </span>
    </>
  );
  const classes = [styles.card, rolls, size === "feature" && styles.feature].filter(Boolean).join(" ");

  return (
    <Item className={styles.item}>
      <PieceLink href={link.href} className={classes}>
        {inner}
      </PieceLink>
    </Item>
  );
}
