import type { Metadata } from "next";
import Link from "next/link";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import { fieldQuestions } from "@/data/field-questions";
import { QuestionShuffle } from "./question-shuffle";
import styles from "./questions.module.css";

export const metadata: Metadata = { title: "Questions from the Field | A Curious Tractor", robots: { index: false, follow: false } };

export function FieldNotesExperience({ production = false }: { production?: boolean }) {
  const basePath = production ? "/questions" : "/prototypes/field-notes";
  return <div className={styles.page}>
    <header className={styles.header}><FieldBrand href={production ? "/" : "/prototypes/living-field"} /><Link href={production ? "/" : "/prototypes/living-field"}>Return to the field</Link></header>
    <main>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Questions from the field</p>
        <h1>Curiosity<br />before certainty.</h1>
        <p>Every note begins with a real question. Some answers come from us. Some come from people we work beside. Some remain open long enough to change the work.</p>
      </section>
      <section className={styles.intro} aria-label="How these notes work">
        <span>01 · Ask honestly</span><span>02 · Name who is speaking</span><span>03 · Leave room for change</span>
      </section>
      <section className={styles.questions} aria-labelledby="questions-title">
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Begin anywhere</p><QuestionShuffle basePath={basePath} slugs={fieldQuestions.map(({ slug }) => slug)} /></div><h2 id="questions-title">What is pulling at you?</h2></div>
        <div className={styles.list}>{fieldQuestions.map((item, index) => <article key={item.slug}>
          <Link href={`${basePath}/${item.slug}`}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <div><p>{item.status} · {item.fields.join(" · ")}</p><h3>{item.question}</h3><span>{item.invitation}</span></div>
            <b aria-hidden="true">↗</b>
          </Link>
        </article>)}</div>
      </section>
      <section className={styles.ask}><p className={styles.eyebrow}>Add to the field</p><h2>What question is following you?</h2><p>A question can come from a meeting, a kitchen table, a workshop or a walk. Tell us where it came from. We will never publish your name or words without permission.</p><Link href="/contact?type=general&source=field-notes&context=field-question">Offer a question →</Link></section>
    </main>
  </div>;
}
export default function FieldNotesPage(){ return <FieldNotesExperience />; }
