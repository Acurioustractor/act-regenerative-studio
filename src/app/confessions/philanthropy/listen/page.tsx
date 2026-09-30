import type { Metadata } from "next";
import { CallLine } from "@/components/confessions/CallLine";
import { CampaignNav } from "@/components/confessions/CampaignNav";
import { ConfessionField } from "@/components/confessions/ConfessionField";
import { ConfessionsFrame } from "@/components/confessions/ConfessionsFrame";
import { ListenTheatre } from "@/components/confessions/ListenTheatre";
import look from "@/components/confessions/look.module.css";
import { confessionsShareImage } from "@/components/confessions/og";
import { confessionsWays } from "@/components/confessions/ways";
import { feelingMeta, feelingOf, feelingOrder, IS_MOCK, mockConfessions, realConfessions } from "@/data/confessions-mock";
import { pageMetadata } from "@/lib/seo/site";
import styles from "./listen.module.css";

const BASE = "/confessions/philanthropy";

export const metadata: Metadata = pageMetadata({
  title: "Confessions to Philanthropy",
  description:
    "We pointed a gold phone at philanthropy and asked what people wish it knew. These are the voices that called back. Listen.",
  path: `${BASE}/listen`,
  image: confessionsShareImage,
});

const confessions = IS_MOCK ? mockConfessions : realConfessions;
// The thematics actually on the line right now, warm to hard.
const feelingsPresent = feelingOrder.filter((f) => confessions.some((c) => feelingOf(c) === f));

// The Listen page of edition 01. Pencil draws the edition's home (E5hyfE), not this page; it is set in the same look.
export default function ConfessionsListenPage() {
  return (
    <ConfessionsFrame
      context="Confessions, edition 01"
      back={{ label: "All editions", href: "/confessions" }}
      ways={confessionsWays()}
    >
      <CampaignNav base={BASE} name="Confessions to Philanthropy" current="listen" />

      <section className={styles.opening} aria-labelledby="listen-title">
        <p className={look.eyebrow}>Confessions to philanthropy</p>
        <h1 id="listen-title" className={styles.title}>
          We pointed a gold phone at philanthropy.
        </h1>
        <p className={styles.lede}>
          We asked what people wish it knew. No forms, no grant language, no dear valued stakeholder. These are the voices
          that called back. The thank-yous, the heartbreak, and the things people usually keep tidy.
        </p>
      </section>

      <section className={styles.voices} aria-label="The voices">
        <ul className={styles.legend}>
          {feelingsPresent.map((f) => (
            <li key={f} className={styles.feeling} style={{ color: `rgb(${feelingMeta[f].rgb})` }}>
              <span
                aria-hidden="true"
                className={styles.dot}
                style={{ background: `rgb(${feelingMeta[f].rgb})`, boxShadow: `0 0 8px 1px rgba(${feelingMeta[f].rgb},0.6)` }}
              />
              {feelingMeta[f].label}
            </li>
          ))}
        </ul>

        <div className={styles.field}>
          <ConfessionField confessions={confessions} interactive />
          <p className={styles.tap}>Tap a voice to hear it</p>
        </div>

        <div className={styles.theatre}>
          <ListenTheatre confessions={confessions} />
          <p className={styles.theatreNote}>Listen full screen, or play them all.</p>
        </div>
      </section>

      <section className={styles.leave} aria-labelledby="leave-title">
        <h2 id="leave-title" className={styles.leaveHeading}>
          However it feels, the line is open.
        </h2>
        <p className={styles.leaveText}>
          Leave an anonymous voicemail for philanthropy. We add the consented ones to the line.
        </p>
        <CallLine />
      </section>
    </ConfessionsFrame>
  );
}
