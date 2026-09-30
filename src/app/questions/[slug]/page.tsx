import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Paragraph, PullQuote } from "@/components/pieces/ArticleBody";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Onward } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { PageRail } from "@/components/pieces/PageRail";
import { PartOf } from "@/components/pieces/PartOf";
import { Photo } from "@/components/pieces/Photo";
import { fieldHref, fieldsById, questions, questionsBySlug } from "@/content";
import { waysOn } from "@/lib/ways-on";
import styles from "./question.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return questions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = questionsBySlug[slug];
  return {
    title: q?.question || "Question from the Field",
    description: q?.invitation,
    alternates: { canonical: `/questions/${slug}` },
  };
}

// Pencil: Page 13 · Question (i8FMhQ).
export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = questionsBySlug[slug];
  if (!q) notFound();
  const next = questionsBySlug[q.nextSlug];
  const ways = waysOn(q.partOf, { question: q.slug }, {
    curiosity: { invite: "The next question", title: next.question, href: `/questions/${next.slug}` },
  });

  return (
    <Page door="Questions">
      <PageRail
        label="Question"
        links={[
          { label: "All questions", href: "/questions" },
          { label: "Response", href: "#response" },
          { label: "Next", href: `/questions/${next.slug}` },
        ]}
      />

      <section className={styles.opening}>
        <div className={styles.words}>
          <p className={styles.status}>
            {q.status} · {q.fields.join(", ")}
          </p>
          <div className={styles.partOf}>
            {q.partOf.map((id) => (
              <PartOf key={id} name={fieldsById[id].name} href={fieldHref(id)} />
            ))}
          </div>
          <h1 className={styles.question}>{q.question}</h1>
          <p className={styles.invitation}>{q.invitation}</p>
        </div>
        <Photo src={q.image} alt="" priority className={styles.photo} />
      </section>

      <dl className={styles.provenance}>
        <div>
          <dt>Asked by</dt>
          <dd>{q.askedBy}</dd>
        </div>
        <div>
          <dt>Responding here</dt>
          <dd>{q.responseBy}</dd>
        </div>
        <div>
          <dt>Where it came from</dt>
          <dd>{q.origin}</dd>
        </div>
      </dl>

      <section id="response" className={styles.response} aria-labelledby="response-title">
        <h2 id="response-title" className={styles.eyebrow}>
          A response, for now
        </h2>
        {q.response.map((paragraph) => (
          <Paragraph key={paragraph}>{paragraph}</Paragraph>
        ))}
        {q.pullQuote && <PullQuote quote={q.pullQuote} from={q.slug.replace(/-/g, " ")} />}
        <p className={styles.coda}>
          This response can change as the work changes. If you carry another answer, we would like to hear it.
        </p>
        <Onward href="/contact?type=general&source=field-note-response" tone="fg">
          Respond to this question
        </Onward>
      </section>

      <FourWaysOn {...ways} />
    </Page>
  );
}
