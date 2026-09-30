import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CallLine } from "@/components/confessions/CallLine";
import { CampaignNav } from "@/components/confessions/CampaignNav";
import { ConfessionsFrame } from "@/components/confessions/ConfessionsFrame";
import { LineOfWork } from "@/components/confessions/LineOfWork";
import look from "@/components/confessions/look.module.css";
import { confessionsShareImage } from "@/components/confessions/og";
import { VoicemailInbox } from "@/components/confessions/VoicemailInbox";
import { confessionsWays } from "@/components/confessions/ways";
import { Onward } from "@/components/pieces/Onward";
import { Photo } from "@/components/pieces/Photo";
import { confessionsEditions } from "@/content";
import { IS_MOCK, mockConfessions, realConfessions } from "@/data/confessions-mock";
import { pageMetadata, siteUrl } from "@/lib/seo/site";
import styles from "./philanthropy.module.css";

const BASE = "/confessions/philanthropy";

export const metadata: Metadata = pageMetadata({
  title: "Confessions to Philanthropy",
  description:
    "A gold phone for the things people don’t say out loud. Call and leave an anonymous message for philanthropy. What do you wish it knew?",
  path: BASE,
  image: confessionsShareImage,
});

// The inbox shows realConfessions (consented, human-moderated) when live. Set IS_MOCK true only for local design work,
// which swaps in the shaped sample set. Gating here means nothing fabricated renders once the line is live. New real
// messages are curated into realConfessions until the Dialpad pipeline (Phase 2) auto-populates them.
const confessions = IS_MOCK ? mockConfessions : realConfessions;

// Share kit: post the edition or pass the number on. Intent links share the edition's URL, which renders the gold-phone
// card through the opengraph-image one level up. The three cards are stable images at /confessions/share/<variant>.
const SHARE_URL = `${siteUrl}${BASE}`;
const SHARE_TEXT =
  "I told philanthropy what I really think. Confessions to Philanthropy, a gold phone from A Curious Tractor:";
const SHARE_X = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;
const SHARE_LINKEDIN = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`;
const SHARE_CARDS = [
  { variant: "hook", label: "The hook" },
  { variant: "answer", label: "A confession" },
  { variant: "invite", label: "The invite" },
];

// Pencil: Page 14b · Confessions to Philanthropy, edition 01 (E5hyfE).
export default function ConfessionsPhilanthropyPage() {
  const edition = confessionsEditions.find((e) => e.to === "Philanthropy");
  if (!edition) notFound();

  return (
    <ConfessionsFrame
      context={`Confessions, edition ${edition.number}`}
      back={{ label: "All editions", href: "/confessions" }}
      ways={confessionsWays()}
    >
      <CampaignNav base={BASE} name="Confessions to Philanthropy" current="confess" />

      <section className={styles.hero} aria-labelledby="edition-title">
        <div className={styles.heroWords}>
          <p className={look.eyebrow}>Line open</p>
          <h1 id="edition-title" className={styles.title}>
            You’ve reached
            <br />
            philanthropy.
          </h1>
          <p className={styles.lede}>
            A gold phone for the things people don’t say out loud. An anonymous voicemail for the truths, love notes, hot
            takes and confessions people have about giving.
          </p>
          <CallLine label="Leave a message at the tone" />
          <Onward href={`${BASE}/listen`} tone="fg">
            Listen to the messages
          </Onward>
        </div>
        <Photo
          src="/media/field-stills/confessions-to-philanthropy.jpg"
          alt="A gold rotary telephone on a wooden table, with the words You’ve reached philanthropy."
          priority
          className={styles.photo}
        />
      </section>

      <section className={styles.anti} aria-labelledby="anti-title">
        <div className={styles.antiWords}>
          <p className={look.eyebrow}>Anti-pretending</p>
          <h2 id="anti-title" className={styles.antiHeading}>
            This is not anti-philanthropy. It is a place to say the quiet bit out loud.
          </h2>
        </div>
        <p className={styles.antiText}>
          Philanthropy is powerful. It is also confusing, secretive, generous, awkward, hopeful and sometimes full of very
          shiny words. So we made it a voicemail.
        </p>
      </section>

      <section className={styles.how}>
        <div className={styles.step}>
          <h2 className={look.eyebrow}>How it works</h2>
          <h3 className={styles.stepTitle}>You can be anonymous.</h3>
          <p className={styles.stepText}>
            Say your name if you want to. You do not have to. We are listening for what is true, not for who is calling.
          </p>
        </div>
        <div className={styles.step}>
          <h2 className={look.eyebrow}>How we share it back</h2>
          <h3 className={styles.stepTitle}>We will never turn your voice into a word cloud.</h3>
          <p className={styles.stepText}>
            A human reads every message before any of it is shared. Names and anything that could identify you are
            removed first. The message stays a message. The voice stays the point.
          </p>
        </div>
      </section>

      <section className={styles.inbox} aria-labelledby="inbox-title">
        <p className={look.eyebrow}>The line is open</p>
        <h2 id="inbox-title" className={styles.inboxHeading}>
          The inbox. Every message, in full.
        </h2>
        <p className={styles.inboxText}>
          {IS_MOCK
            ? "Press play to listen. Filter by what each one is about. Sample messages while the line warms up. When the real confessions land, they arrive here, anonymous and unedited."
            : "Press play to hear the real voice. Some callers shared their words and not their voice, and we kept it that way. Filter by what each one is about. Every message is anonymous and unedited, exactly as it came through."}
        </p>
        <VoicemailInbox confessions={confessions} />
      </section>

      <section className={styles.friday} aria-labelledby="friday-title">
        <div className={styles.fridayWords}>
          <p className={look.eyebrow}>Friday</p>
          <h2 id="friday-title" className={styles.fridayHeading}>
            The honest version drops Friday.
          </h2>
        </div>
        <div className={styles.fridayRight}>
          <p className={styles.fridayText}>
            At the end of the week we play it back. Anonymous, themed, said out loud. Not a survey. Not an acquittal.
            Every number opens back into a voice.
          </p>
          <Onward href={`${BASE}/friday`} tone="fg">
            Friday tape
          </Onward>
        </div>
      </section>

      <LineOfWork
        border
        words="For years we have built quiet places where the truth gets easier to say. Confessions to Philanthropy is the latest in that line."
        href={edition.work ? `/art/${edition.work}` : "/art"}
        linkLabel="See the work"
      />

      <section className={styles.pickUp} aria-labelledby="pick-up-title">
        <h2 id="pick-up-title" className={styles.pickUpHeading}>
          Pick up the phone. Say the thing.
        </h2>
        <CallLine />
        <p className={styles.pickUpLine}>Not anti-philanthropy. Anti-pretending.</p>
      </section>

      <section className={styles.share} aria-labelledby="share-title">
        <div className={styles.shareTop}>
          <div className={styles.shareWords}>
            <p className={look.eyebrow}>Pass it on</p>
            <h2 id="share-title" className={styles.shareHeading}>
              The honest stuff spreads quietly.
            </h2>
          </div>
          <div className={styles.shareRight}>
            <p className={styles.shareText}>
              Send the number to someone who has been holding a confession. Or post a card.
            </p>
            <div className={styles.shareLinks}>
              <a href={SHARE_X} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                Share on X
              </a>
              <a href={SHARE_LINKEDIN} target="_blank" rel="noopener noreferrer" className={styles.shareLink}>
                Share on LinkedIn
              </a>
            </div>
          </div>
        </div>
        <ul className={styles.cards}>
          {SHARE_CARDS.map((card) => (
            <li key={card.variant}>
              <a
                href={`/confessions/share/${card.variant}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/confessions/share/${card.variant}`}
                  alt={`Confessions to Philanthropy share card: ${card.label}`}
                  width={1200}
                  height={630}
                  className={styles.cardImage}
                  loading="lazy"
                />
                <span className={styles.cardLabel}>{card.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </ConfessionsFrame>
  );
}
