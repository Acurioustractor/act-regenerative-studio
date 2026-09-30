import type { Metadata } from "next";
import Link from "next/link";
import { ConfessionsFrame } from "@/components/confessions/ConfessionsFrame";
import { LineOfWork } from "@/components/confessions/LineOfWork";
import look from "@/components/confessions/look.module.css";
import { confessionsShareImage } from "@/components/confessions/og";
import { confessionsWays } from "@/components/confessions/ways";
import { Onward } from "@/components/pieces/Onward";
import { Photo } from "@/components/pieces/Photo";
import { confessionsEditions, type ConfessionsEdition } from "@/content";
import { pageMetadata } from "@/lib/seo/site";
import styles from "./confessions.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Confessions to ___",
  description:
    "A gold phone for the things people don’t say out loud. Same idea every time. Take away the screens and the grant language, and people tell the truth.",
  path: "/confessions",
  image: confessionsShareImage,
});

// What only the live edition has to say for itself. The list of editions is src/content/confessions.ts; these are the
// words Pencil draws beside edition 01 (Page 14, Edition 01 pATj0).
const liveWords: Record<string, { line: string; chip: string }> = {
  "01": {
    line: "You’ve reached philanthropy.",
    chip: "Live · Queensland Philanthropy Week 2026",
  },
};

// The three rules every edition keeps (Page 14, Every edition aNQJH).
const rules = [
  {
    title: "You can be anonymous.",
    body: "Say your name if you want to. You do not have to. We are listening for what is true, not for who is calling.",
  },
  {
    title: "A human reads every message.",
    body: "A human reads every message before any of it is shared. Names and anything that could identify you are removed first. The message stays a message. The voice stays the point.",
  },
  {
    title: "The honest version is played back.",
    body: "At the end of the week we play it back. Anonymous, themed, said out loud. Not a survey. Not an acquittal. Every number opens back into a voice.",
  },
];

/** An edition's own address: /confessions/philanthropy for the one confessing to Philanthropy. */
const editionHref = (edition: ConfessionsEdition) => `/confessions/${(edition.to ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

// Pencil: Page 14 · Confessions to ___ (n0MhK).
export default function ConfessionsSeriesPage() {
  return (
    <ConfessionsFrame context="A series" back={{ label: "All the art", href: "/art" }} ways={confessionsWays()}>
      <section className={styles.hero} aria-labelledby="series-title">
        <div className={styles.heroWords}>
          <p className={look.eyebrow}>The line is open</p>
          <h1 id="series-title" className={styles.title}>
            <span className={styles.titleLine}>Confessions</span>{" "}
            <span className={`${styles.titleLine} ${styles.toBlank}`}>
              to <span aria-hidden="true" className={styles.blank} />
            </span>
          </h1>
          <p className={styles.lede}>
            A gold phone for the things people don’t say out loud. Same idea every time. Take away the screens and the
            grant language, and people tell the truth.
          </p>
        </div>
        <Photo
          src="/media/field-stills/confessions-to-philanthropy.jpg"
          alt="A gold rotary telephone on a wooden table, with the words You’ve reached philanthropy."
          priority
          className={styles.photo}
        />
      </section>

      <section className={styles.editions} aria-labelledby="editions-title">
        <h2 id="editions-title" className={look.eyebrow}>
          The editions · one sector or system at a time
        </h2>
        <ol className={styles.rows}>
          {confessionsEditions.map((edition) => {
            const live = edition.status === "live" && edition.to !== null ? liveWords[edition.number] : undefined;
            return live && edition.to ? (
              <li key={edition.number} className={styles.row}>
                <span className={styles.number}>{edition.number}</span>
                <div className={styles.rowWords}>
                  <h3 className={styles.rowTitle}>
                    <Link href={editionHref(edition)} className={styles.rowLink}>
                      Confessions to {edition.to}
                    </Link>
                  </h3>
                  <p className={styles.rowLine}>{live.line}</p>
                </div>
                <div className={styles.status}>
                  <span className={`${styles.chip} ${styles.chipLive}`}>{live.chip}</span>
                  <Onward href={`${editionHref(edition)}/listen`} tone="fg" className={styles.listenLink}>
                    Listen to the messages
                  </Onward>
                </div>
              </li>
            ) : (
              <li key={edition.number} className={`${styles.row} ${styles.rowBlank}`}>
                <span className={styles.number}>{edition.number}</span>
                <div className={styles.rowWords}>
                  <h3 className={styles.rowTitle}>
                    Confessions to <span aria-hidden="true" className={styles.rowBlankBar} />
                  </h3>
                  <p className={styles.rowLine}>To be chosen.</p>
                </div>
                <div className={styles.status}>
                  <span className={styles.chip}>Not yet open</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.rules} aria-labelledby="rules-title">
        <h2 id="rules-title" className={look.eyebrow}>
          Every edition keeps the same three rules
        </h2>
        <ol className={styles.three}>
          {rules.map((rule, i) => (
            <li key={rule.title} className={styles.rule}>
              <span className={look.eyebrow}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.ruleTitle}>{rule.title}</h3>
              <p className={styles.ruleBody}>{rule.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <LineOfWork
        words="For years we have built quiet places where the truth gets easier to say."
        href="/art/gold-phone"
        linkLabel="See the work"
      />
    </ConfessionsFrame>
  );
}
