import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FieldOpening } from "@/components/pieces/FieldOpening";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Onward, Wheel, rolls } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { PageRail } from "@/components/pieces/PageRail";
import { Photo } from "@/components/pieces/Photo";
import { StoryRow } from "@/components/pieces/StoryRow";
import { Surface } from "@/components/pieces/Surface";
import { fieldHref, fields, fieldsById, works, type FieldId } from "@/content";
import heroMedia from "@/data/hero-media-selections.json";
import { articlesForField, questionsForField } from "@/lib/fields/field-graph";
import { pageMetadata } from "@/lib/seo/site";
import { waysOn } from "@/lib/ways-on";
import styles from "./field.module.css";

// The fields that have a page here are the ones src/content says live at /fields/<id>. Art folds into /art and The
// Harvest into /harvest; those two are redirected, and anything else is a 404.
const withPages = fields.filter((field) => fieldHref(field.id) === `/fields/${field.id}`);

export const dynamicParams = false;

export function generateStaticParams() {
  return withPages.map(({ id }) => ({ field: id }));
}

export async function generateMetadata({ params }: { params: Promise<{ field: string }> }): Promise<Metadata> {
  const { field: id } = await params;
  const field = withPages.find((f) => f.id === id);
  if (!field) return {};
  return pageMetadata({
    title: field.name,
    description: field.opening,
    path: `/fields/${field.id}`,
    image: { url: field.image, alt: field.name },
  });
}

/** The four parts of the method as one sentence. The same on every field page. */
const sentence =
  "Listen before naming the problem. Stay curious long enough for the first answer to change. Act with people who carry the consequence. Let art return the work to culture.";

/** Whose organisation this is, on every field page (the essay's words, as /about says them). */
const standing = {
  heading: "Who we are, and who we are not",
  words:
    "A Curious Tractor is not a First Nations organisation and does not speak as one. When we are invited into work with First Nations communities, our responsibility is to follow community authority, be clear about what we hold, and accept correction, refusal and silence as part of the work. A relationship is not consent in perpetuity. A good history together does not turn the next visit into an entitlement.",
};

/** CONTAINED, the art project within JusticeHub. Its words are Pencil's (Field page · JusticeHub, hDg27). */
const contained = {
  field: "justice" as FieldId,
  slug: "contained",
  tagline: "Step inside what we are choosing to fund",
  words: "Reports can describe confinement while keeping the reader safely outside it. Art changes the distance.",
};

/** An article's own page: where it says it lives, else /stories/<slug>. */
const articleHref = (localPath: string | null | undefined, slug: string) => localPath || `/stories/${slug}`;

/**
 * The photograph at the top. The hero selected for the field (src/data/hero-media-selections.json) when it is not the
 * one the photo chapter below already shows; otherwise the field's own still.
 */
function openingPhoto(id: FieldId): string {
  const field = fieldsById[id];
  const selected = (heroMedia.fields as Record<string, { posterUrl: string }>)[id]?.posterUrl;
  return selected && selected !== field.secondImage ? selected : field.image;
}

// Pencil: Page 04 · Field page · JusticeHub (rzmZ2), Phone · 04 Field · JusticeHub (w3ZpTK).
export default async function FieldPage({ params }: { params: Promise<{ field: string }> }) {
  const { field: id } = await params;
  const field = withPages.find((f) => f.id === id);
  if (!field) notFound();

  const next = fields[(fields.findIndex((f) => f.id === field.id) + 1) % fields.length];
  const articles = articlesForField(field.id);
  const questions = questionsForField(field.id);
  const work = field.id === contained.field ? works.find((w) => w.slug === contained.slug) : undefined;
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <Page door="The work">
      <PageRail
        label={`${field.name} field`}
        links={[
          { label: "Opening", href: "#field-opening" },
          { label: "Question", href: "#field-question" },
          { label: field.destinationLabel, href: field.destinationHref },
        ]}
      />

      <div id="field-opening">
        <FieldOpening
          number={field.number}
          name={field.name}
          eyebrow={field.eyebrow}
          title={field.title}
          opening={field.opening}
          photo={{ src: openingPhoto(field.id), alt: "" }}
        />
      </div>

      <section id="field-question" className={styles.question} aria-labelledby="field-question-title">
        <div className={styles.questionWords}>
          <p className={styles.eyebrow}>The question underneath</p>
          <h2 id="field-question-title" className={styles.questionTitle}>
            {field.question}
          </h2>
        </div>
        <div className={styles.answer}>
          <p className={styles.answerText}>{field.answer}</p>
          <a href={field.destinationHref} className={styles.textLink} {...external}>
            {field.destinationLabel} ↗
          </a>
        </div>
      </section>

      <div className={styles.chapter}>
        {work && (
          <section className={styles.contained} aria-labelledby="contained-title">
            <Photo src={fieldsById.art.image} alt="" className={styles.containedPhoto} />
            <div className={styles.containedWords}>
              <p className={styles.eyebrow}>An art project within {field.name}</p>
              <h2 id="contained-title" className={styles.containedTitle}>
                {work.title}
              </h2>
              <h3 className={styles.containedTagline}>{contained.tagline}</h3>
              <p className={styles.containedText}>{contained.words}</p>
              <Onward href={`/art/${work.slug}`} tone="fg">
                See the work
              </Onward>
            </div>
          </section>
        )}
        <Photo src={field.secondImage} alt="" className={styles.chapterPhoto} />
        <Surface tone="ink" className={styles.sentence}>
          <p className={styles.sentenceText}>{sentence}</p>
        </Surface>
      </div>

      {field.destinationAction && (
        <section id="field-project" className={styles.elsewhere} aria-labelledby="field-project-title">
          <div className={styles.elsewhereWords}>
            <p className={styles.eyebrow}>The work continues elsewhere</p>
            <h2 id="field-project-title" className={styles.elsewhereTitle}>
              {field.destinationAction}.
            </h2>
          </div>
          <a href={field.destinationHref} className={styles.button} {...external}>
            {field.destinationLabel} ↗
          </a>
        </section>
      )}

      <Link href={fieldHref(next.id)} className={`${styles.next} ${rolls}`}>
        <span className={styles.nextLabel}>Next field</span>
        <span className={styles.nextTitle}>
          {next.name}
          <span className={styles.nextWheel}>
            <Wheel />
          </span>
        </span>
      </Link>

      {(articles.length > 0 || questions.length > 0) && (
        <section className={styles.written} aria-labelledby="field-writing-title">
          <div className={styles.writing}>
            <p className={styles.eyebrow}>Written from this field</p>
            <h2 id="field-writing-title" className={styles.writingTitle}>
              Follow {field.name} into the writing.
            </h2>
            {articles.length > 0 && (
              <ol className={styles.stories}>
                {articles.map((article, i) => (
                  <li key={article.slug}>
                    <StoryRow
                      href={articleHref(article.localPath, article.slug)}
                      title={article.title}
                      marker={String(i + 1).padStart(2, "0")}
                    />
                  </li>
                ))}
              </ol>
            )}
          </div>

          {questions.length > 0 && (
            <div className={styles.open}>
              <h2 className={styles.eyebrow}>Still open here</h2>
              <ul className={styles.questions}>
                {questions.map((question) => (
                  <li key={question.slug}>
                    <Link href={`/questions/${question.slug}`} className={styles.questionLink}>
                      {question.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className={styles.stand} aria-labelledby="field-stand-title">
        <p className={styles.eyebrow}>Where we stand</p>
        <h2 id="field-stand-title" className={styles.standTitle}>
          {standing.heading}
        </h2>
        <p className={styles.standText}>{standing.words}</p>
      </section>

      <FourWaysOn {...waysOn([field.id])} />
    </Page>
  );
}
