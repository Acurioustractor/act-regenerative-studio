import type { Metadata } from "next";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Onward } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { PageRail } from "@/components/pieces/PageRail";
import { QuestionRow } from "@/components/pieces/QuestionRow";
import { Surface } from "@/components/pieces/Surface";
import { questions, questionsBySlug } from "@/content";
import { pageMetadata } from "@/lib/seo/site";
import { QuestionShuffle } from "./QuestionShuffle";
import styles from "./questions.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Questions from the Field",
  description: "Questions and evolving responses from across A Curious Tractor's work.",
  path: "/questions",
});

// Pencil: Page 12 · Questions (hN7R0).
export default function QuestionsPage() {
  const told = questionsBySlug["who-holds-the-story"];
  return (
    <Page door="Questions">
      <PageRail
        label="Questions"
        links={[
          { label: "Introduction", href: "#introduction" },
          { label: "Browse", href: "#browse" },
          { label: "Ask", href: "#ask" },
        ]}
      />

      <section id="introduction" className={styles.opening}>
        <div className={styles.openingWords}>
          <p className={styles.eyebrow}>Questions from the field</p>
          <h1 className={styles.title}>
            Curiosity
            <br />
            before certainty.
          </h1>
        </div>
        <p className={styles.lede}>
          Every note begins with a real question. Some answers come from us. Some come from people we work beside. Some
          remain open long enough to change the work.
        </p>
      </section>

      <ol className={styles.steps} aria-label="How these questions work">
        <li>01 · Ask honestly</li>
        <li>02 · Name who is speaking</li>
        <li>03 · Leave room for change</li>
      </ol>

      <section id="browse" className={styles.list} aria-labelledby="browse-title">
        <div className={styles.head}>
          <div className={styles.headWords}>
            <p className={styles.eyebrow}>Begin anywhere</p>
            <h2 id="browse-title" className={styles.heading}>
              What is pulling at you?
            </h2>
          </div>
          <QuestionShuffle slugs={questions.map((q) => q.slug)} />
        </div>
        <ol className={styles.rows}>
          {questions.map((q, i) => (
            <QuestionRow
              key={q.slug}
              as="li"
              number={String(i + 1).padStart(2, "0")}
              status={q.status}
              fields={q.fields}
              question={q.question}
              invitation={q.invitation}
              href={`/questions/${q.slug}`}
            />
          ))}
        </ol>
      </section>

      <FourWaysOn
        listen={{ invite: "All the stories", title: "The writing so far.", href: "/stories" }}
        curiosity={{ title: told.question, href: `/questions/${told.slug}` }}
        action={{ title: "The work", href: "/work" }}
        art={{ title: "Come into the art.", href: "/art" }}
      />

      <Surface as="section" tone="ink" id="ask" className={styles.ask} aria-labelledby="ask-title">
        <div className={styles.askWords}>
          <p className={styles.eyebrow}>Add to the field</p>
          <h2 id="ask-title" className={styles.askHeading}>
            What question is following you?
          </h2>
        </div>
        <div className={styles.askRight}>
          <p className={styles.askText}>
            A question can come from a meeting, a kitchen table, a workshop or a walk. Tell us where it came from. We will
            never publish your name or words without permission.
          </p>
          <Onward href="/contact?type=general&source=field-notes&context=field-question" tone="fg">
            Offer a question
          </Onward>
        </div>
      </Surface>
    </Page>
  );
}
