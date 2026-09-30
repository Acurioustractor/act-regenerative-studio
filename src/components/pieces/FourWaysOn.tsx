import Link from "next/link";
import type { CSSProperties } from "react";
import { partDoors, site } from "@/content/site";
import { Arrive } from "./Arrive";
import { Onward, Wheel, rolls } from "./Onward";
import { PartGlyph } from "./PartGlyph";
import styles from "./four-ways-on.module.css";

export type Way = {
  title: string;
  href: string;
  /** Words after the part's meaning, where a page says it its own way ("Listen · All the stories"). */
  invite?: string;
};

/**
 * The end of every page: the tractor taken apart into four next steps, a story, a question, the work and the art,
 * then an invitation to bring us a question (Pencil: Four ways on x5WoQq, Four ways on · phone aWeTk). No dead ends.
 * The one you point at lifts and turns rust; the other three step back.
 */
export function FourWaysOn({
  listen,
  curiosity,
  action,
  art,
}: {
  listen: Way;
  curiosity: Way;
  action: Way;
  art: Way;
}) {
  const ways: Record<string, Way> = { Listen: listen, Curiosity: curiosity, Action: action, Art: art };
  const invitation = `Or ${site.invitation[0].toLowerCase()}${site.invitation.slice(1)}`;

  return (
    <section className={styles.fourWaysOn} aria-labelledby="four-ways-on">
      <p className={styles.eyebrow}>Keep going</p>
      <h2 id="four-ways-on" className={styles.heading}>
        Four ways on from here
      </h2>

      <Arrive className={styles.four}>
        {partDoors.map((door, i) => {
          const way = ways[door.meaning];
          return (
            <Link
              key={door.meaning}
              href={way.href}
              className={`${styles.way} ${rolls}`}
              style={{ "--i": i } as CSSProperties}
            >
              <span className={styles.part}>
                <PartGlyph part={door.part} size="way" />
              </span>
              <span className={styles.words}>
                <span className={styles.label}>
                  {door.meaning} · {way.invite ?? door.invite}
                </span>
                <span className={styles.title}>{way.title}</span>
              </span>
              <span className={styles.wheel}>
                <Wheel />
              </span>
            </Link>
          );
        })}
      </Arrive>

      <div className={styles.yourQuestion}>
        <p className={styles.question}>{invitation}</p>
        <Onward href="/contact">Contact</Onward>
      </div>
    </section>
  );
}
