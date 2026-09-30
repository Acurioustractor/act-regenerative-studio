import type { Metadata } from "next";
import { CallLine } from "@/components/confessions/CallLine";
import { CampaignNav } from "@/components/confessions/CampaignNav";
import { ConfessionsFrame } from "@/components/confessions/ConfessionsFrame";
import { FridayTape } from "@/components/confessions/FridayTape";
import look from "@/components/confessions/look.module.css";
import { confessionsShareImage } from "@/components/confessions/og";
import { confessionsWays } from "@/components/confessions/ways";
import { Onward } from "@/components/pieces/Onward";
import { pageMetadata } from "@/lib/seo/site";
import styles from "./friday.module.css";

const BASE = "/confessions/philanthropy";

export const metadata: Metadata = pageMetadata({
  title: "The Friday Tape: Confessions to Philanthropy",
  description:
    "At the end of the week we play it back. Anonymous, themed, said out loud. The honest version of what philanthropy heard.",
  path: `${BASE}/friday`,
  image: confessionsShareImage,
});

const MOVEMENTS = [
  {
    tag: "Money",
    body: "The loudest thread was money, and not the way you might expect. Nobody asked for more of it. They asked us to be honest about it. One caller said philanthropy has lost its way, that it tends to be about the money now, when the word itself just means love of humanity. Another put it plainly: please just ask us. Genuinely ask. Not with a glossy brochure. And then this, which we have not stopped thinking about: when you make the ask human and honest, the answer is always yes.",
  },
  {
    tag: "Power",
    body: "Then there was power, and one voice was blunt about it. You have got a really difficult job, the caller said, and you do it really difficultly. If you gave up on thinking you already knew what you were doing, you would do it better. Just give the money to the people who actually know what is going on.",
  },
  {
    tag: "Hope",
    body: "And underneath all of it, hope, the kind that aches. One person rang to say it is not really a confession, it is to say I wish you didn’t have to exist. Thank you for pouring your heart into a world that still needs you. But I wish we lived somewhere equity was just a given, and you were not necessary at all.",
  },
];

// The Friday Tape of edition 01. Pencil draws the edition's home (E5hyfE), not this page; it is set in the same look.
export default function ConfessionsFridayPage() {
  return (
    <ConfessionsFrame
      context="Confessions, edition 01"
      back={{ label: "All editions", href: "/confessions" }}
      ways={confessionsWays()}
    >
      <CampaignNav base={BASE} name="Confessions to Philanthropy" current="friday" />

      <section className={styles.opening} aria-labelledby="friday-title">
        <p className={look.eyebrow}>Friday</p>
        <h1 id="friday-title" className={styles.title}>
          We played the week back.
        </h1>
        <p className={styles.lede}>
          Here is what came through the gold phone this week. Every message anonymous, every one shared with consent,
          every one a real voice. Not a survey. Not an acquittal. The honest version, said out loud.
        </p>
      </section>

      <section className={styles.tape} aria-label="The tape">
        <FridayTape />
      </section>

      <section className={styles.said} aria-labelledby="said-title">
        <h2 id="said-title" className={look.eyebrow}>
          What it said
        </h2>
        <ol className={styles.movements}>
          {MOVEMENTS.map((m) => (
            <li key={m.tag} className={styles.movement}>
              <h3 className={styles.movementTitle}>{m.tag}</h3>
              <p className={styles.movementBody}>{m.body}</p>
            </li>
          ))}
        </ol>
        <p className={styles.closing}>
          That is the honest version. Be more human. Trust the people closest to the work. And keep going, while quietly
          hoping for the day the work is done.
        </p>
        <Onward href={`${BASE}/listen`} tone="fg">
          Listen to the voices
        </Onward>
      </section>

      <section className={styles.open} aria-labelledby="open-title">
        <h2 id="open-title" className={styles.openHeading}>
          The line is still open.
        </h2>
        <p className={styles.openText}>Next week’s tape needs your voice. Say the thing you usually keep tidy.</p>
        <CallLine />
        <Onward back href={BASE} tone="fg">
          Back to Confessions
        </Onward>
      </section>
    </ConfessionsFrame>
  );
}
