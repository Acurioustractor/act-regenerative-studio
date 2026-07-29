import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageMetadata } from "@/lib/seo/site";
import styles from "./contact.module.css";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Bring A Curious Tractor a question, project, artwork, place or possibility worth exploring together.",
  path: "/contact",
});

const paths = [
  ["A project", "A live challenge, partnership or practical idea."],
  ["Art or story", "An installation, commission, exhibition or story."],
  ["A visit", "The Harvest, the farm, a residency or time on Country."],
  ["A question", "Something unfinished that might be worth exploring together."],
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.invitation}>
          <p className={styles.eyebrow}>Contact</p>
          <h1>Bring us the question you cannot leave alone.</h1>
          <p className={styles.intro}>
            It might begin with an artwork, a place, a system that is not working, or something practical that needs to be built. Start where you are.
          </p>
          <div className={styles.direct}>
            <span>Prefer email?</span>
            <a href="mailto:hi@act.place">hi@act.place</a>
          </div>
        </div>

        <div className={styles.formPanel} id="start-a-conversation">
          <div className={styles.formHeading}>
            <p className={styles.eyebrow}>Start a conversation</p>
            <h2>A little context is enough.</h2>
            <p>No polished brief required. Tell us what is happening, who is involved and what you are curious about.</p>
          </div>
          <Suspense fallback={<p className={styles.loading}>Loading the form…</p>}>
            <ContactForm
              projectCode="ACT-IN"
              formType="contact"
              contextLabel="ACT contact page"
              additionalTags={["Public contact route"]}
            />
          </Suspense>
        </div>
      </section>

      <section className={styles.paths} aria-labelledby="contact-paths-title">
        <div>
          <p className={styles.eyebrow}>Ways in</p>
          <h2 id="contact-paths-title">You do not need to know which project it belongs to.</h2>
        </div>
        <div className={styles.pathGrid}>
          {paths.map(([title, description], index) => (
            <Link key={title} href={`/contact?type=${["project-partnership", "commission-cultural-work", "residency-visit", "general"][index]}#start-a-conversation`}>
              <span>0{index + 1}</span>
              <strong>{title}</strong>
              <p>{description}</p>
              <i aria-hidden="true">→</i>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.expectation}>
        <p className={styles.eyebrow}>What happens next</p>
        <p>We read every message. We will route it to the person closest to the work and reply with an honest next step, usually within a few working days.</p>
      </section>
    </div>
  );
}
