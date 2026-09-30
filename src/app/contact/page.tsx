import Link from "next/link";
import { FourWaysOn, type Closing } from "@/components/pieces/FourWaysOn";
import { NumberedCard } from "@/components/pieces/NumberedCard";
import { Page } from "@/components/pieces/Page";
import { site } from "@/content/site";
import { generalWays } from "@/lib/ways-on";
import { pageMetadata } from "@/lib/seo/site";
import { ContactFlow } from "./ContactFlow";
import styles from "./contact.module.css";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Bring A Curious Tractor a question, project, artwork, place or possibility worth exploring together.",
  path: "/contact",
});

// Each way in opens the form with its choice made (the form reads `type` from the address).
// The page is already a way to write to us, so four ways on offers the address instead (Pencil: Page 03 Contact).
const byEmail: Closing = { words: `Or write to ${site.email}.`, label: "Email", href: `mailto:${site.email}` };

const waysIn = [
  { type: "project-partnership", title: "A project", text: "A live challenge, partnership or practical idea." },
  { type: "commission-cultural-work", title: "Art or story", text: "An installation, commission, exhibition or story." },
  { type: "residency-visit", title: "A visit", text: "The Harvest, the farm, a residency or time on Country." },
  { type: "general", title: "A question", text: "Something unfinished that might be worth exploring together." },
];

// Pencil: Page 03 · Contact (P340ec), Page 03b · Contact, sent (ofUwn), Phone · 03 Contact (FZX6b).
export default function ContactPage() {
  return (
    <Page door="Contact">
      <ContactFlow
        invitation={
          <>
            <p className={styles.eyebrow}>Contact</p>
            <h1 className={styles.title}>{site.invitation}</h1>
            <p className={styles.lede}>
              It might begin with an artwork, a place, a system that is not working, or something practical that needs to
              be built. Start where you are.
            </p>
            <p className={styles.email}>
              <span>Prefer email?</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </>
        }
        formIntro={
          <>
            <p className={styles.eyebrow}>Start a conversation</p>
            <h2 className={styles.formHeading}>A little context is enough.</h2>
            <p className={styles.formText}>
              No polished brief required. Tell us what is happening, who is involved and what you are curious about.
            </p>
          </>
        }
        waysIn={
          <section className={styles.waysIn} aria-labelledby="ways-in-title">
            <p className={styles.eyebrow}>Ways in</p>
            <h2 id="ways-in-title" className={styles.waysInHeading}>
              You do not need to know which project it belongs to.
            </h2>
            <ol className={styles.cards}>
              {waysIn.map((way, i) => (
                <li key={way.type}>
                  <Link href={`/contact?type=${way.type}#start-a-conversation`} className={styles.way}>
                    <NumberedCard number={String(i + 1).padStart(2, "0")} title={way.title} text={way.text} />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        }
        next={
          <section className={styles.next} aria-labelledby="next-title">
            <h2 id="next-title" className={styles.nextLabel}>
              What happens next
            </h2>
            <p className={styles.nextText}>
              We read every message. We will route it to the person closest to the work and reply with an honest next
              step, usually within a few working days.
            </p>
          </section>
        }
        ways={<FourWaysOn {...generalWays} closing={byEmail} />}
        waysSent={<FourWaysOn {...generalWays} listen={{ ...generalWays.listen, invite: "While you wait" }} closing={byEmail} />}
        sent={{
          heading: "We read every message.",
          body: "We will route it to the person closest to the work and reply with an honest next step, usually within a few working days.",
          left: "Your message, left with us",
          again: "Write another",
        }}
      />
    </Page>
  );
}
