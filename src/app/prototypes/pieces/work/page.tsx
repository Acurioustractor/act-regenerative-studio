import type { Metadata } from "next";
import { Caption } from "@/components/pieces/Caption";
import { Chapter } from "@/components/pieces/Chapter";
import { FieldCard } from "@/components/pieces/FieldCard";
import { FieldOpening } from "@/components/pieces/FieldOpening";
import { LoudTitle } from "@/components/pieces/LoudTitle";
import { NumberedCard } from "@/components/pieces/NumberedCard";
import { QuestionRow } from "@/components/pieces/QuestionRow";
import { StatTile } from "@/components/pieces/StatTile";
import { Surface } from "@/components/pieces/Surface";
import { TimelineRow } from "@/components/pieces/TimelineRow";
import { WorkCard } from "@/components/pieces/WorkCard";
import { fields, fieldsById, projects, questions, questionsBySlug } from "@/content";
import { Specimen } from "../Specimen";
import styles from "../pieces.module.css";
import layout from "./work.module.css";

export const metadata: Metadata = {
  title: "Brand v1 pieces: fields and work | A Curious Tractor",
  robots: { index: false, follow: false },
};

const justice = fieldsById.justice;
const alternatives = questionsBySlug["what-if-alternatives-were-easier-to-find"];
const numberOf = (slug: string) => String(questions.findIndex((q) => q.slug === slug) + 1).padStart(2, "0");

// The fields and the questions are read from src/content, so their words are not typed a second time here. The
// stat tile, chapter, timeline row and caption take Pencil's own bracketed placeholders: nothing about a person or a
// figure is invented for the preview.
export default function WorkPiecesPage() {
  return (
    <Surface className={`full-bleed ${styles.page}`}>
      <div className={styles.intro}>
        <h1>The pieces: fields and work</h1>
        <p>
          Field opening, Field card, Work card, Question row, Stat tile, Chapter, Numbered card, Timeline row, and the
          two on-picture pieces, Loud title and Caption. Fields and questions come from src/content; the rest are
          Pencil&apos;s own samples.
        </p>
      </div>

      <h2 className={styles.group}>Fields</h2>
      <Specimen node="ALEwz" name="Field opening" width={1440}>
        <FieldOpening
          number={justice.number}
          name={justice.name}
          eyebrow={justice.eyebrow}
          title={justice.title}
          opening={justice.opening}
          photo={{
            src: justice.secondImage,
            alt: "A shipping container with two doors open: a pink bedroom on the left, a bare grey cell on the right.",
          }}
        />
      </Specimen>
      <Specimen node="n6ix0f" name="Field card" width={300}>
        <FieldCard number={justice.number} name={justice.name} line={justice.line} href="/fields/justice" />
      </Specimen>
      <Specimen node="n6ix0f-five" name="Field cards, the five" width={1440}>
        <div className={layout.pad}>
          <ul className={layout.fiveCards}>
            {fields.map((field) => (
              <FieldCard
                key={field.id}
                as="li"
                number={field.number}
                name={field.name}
                line={field.line}
                href={`/fields/${field.id}`}
              />
            ))}
          </ul>
        </div>
      </Specimen>

      <h2 className={styles.group}>Work</h2>
      <Specimen node="XLWbP" name="Work card (no record strip, no Held by)" width={440}>
        <WorkCard
          photo={{ src: justice.image, alt: "A group of people standing outside a small house at the foot of a hill." }}
          kicker={`02 · ${justice.name}`}
          title={justice.title}
          sentence={justice.line}
          link={{ label: justice.destinationLabel, href: justice.destinationHref }}
        />
      </Specimen>
      <Specimen node="AJNp3" name="Work cards, as The work page sets them (feature size)" width={1440}>
        <div className={layout.pad}>
          <ul className={layout.workGrid}>
            {projects.map((field, i) => (
              <WorkCard
                key={field.id}
                as="li"
                size="feature"
                photo={{ src: field.id === "empathy" ? field.secondImage : field.image, alt: `A photograph from ${field.name}.` }}
                kicker={`${String(i + 1).padStart(2, "0")} · ${field.name}`}
                title={field.title}
                sentence={field.line}
                link={{ label: field.destinationLabel, href: field.destinationHref }}
              />
            ))}
          </ul>
        </div>
      </Specimen>

      <h2 className={styles.group}>Questions and figures</h2>
      <Specimen node="zNR0b" name="Question row" width={900}>
        <QuestionRow
          number={numberOf(alternatives.slug)}
          status={alternatives.status}
          fields={alternatives.fields}
          question={alternatives.question}
          invitation={alternatives.invitation}
          href={`/questions/${alternatives.slug}`}
        />
      </Specimen>
      <Specimen node="hN7R0" name="Question rows, as Questions sets them" width={1440}>
        <div className={layout.pad}>
          <ul className={layout.list}>
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
          </ul>
        </div>
      </Specimen>
      <Specimen node="PZ8tE" name="Stat tile" width={300}>
        <StatTile figure="[figure]" counts="[what it counts]" source={{ name: "[named here]" }} />
      </Specimen>
      <Specimen node="PZ8tE-link" name="Stat tile, source with a link" width={300}>
        <StatTile
          figure="[figure]"
          counts="[what it counts]"
          source={{ name: "[named here]", href: "https://example.org/source" }}
        />
      </Specimen>
      <Specimen node="PZ8tE-none" name="Stat tile with no source: it renders nothing" width={300}>
        <StatTile figure="[figure]" counts="[what it counts]" source={{ name: "" }} />
        <p className={layout.note}>Nothing renders above this line.</p>
      </Specimen>

      <h2 className={styles.group}>Long pages</h2>
      <Specimen node="u6VSho" name="Chapter" width={1100}>
        <Chapter number="01" kicker="[Chapter kicker]" heading="[Chapter heading]">
          <p>[Chapter text]</p>
        </Chapter>
      </Specimen>
      <Specimen node="u6VSho-prose" name="Chapter, with paragraphs" width={1100}>
        <Chapter number="02" kicker="[Chapter kicker]" heading="[Chapter heading]">
          <p>[A paragraph of chapter text. It runs on as long as the chapter needs to, in the writers&apos; own words.]</p>
          <p>[A second paragraph, to show the space between them.]</p>
        </Chapter>
      </Specimen>
      <Specimen node="L1GHII" name="Numbered card" width={380}>
        <NumberedCard number="01" title="A project" text="A live challenge, partnership or practical idea." />
      </Specimen>
      <Specimen node="L1GHII-four" name="Numbered cards, as Contact sets them" width={1440}>
        <div className={layout.pad}>
          <ul className={layout.fourCards}>
            <NumberedCard as="li" number="01" title="A project" text="A live challenge, partnership or practical idea." />
            <NumberedCard as="li" number="02" title="Art or story" text="An installation, commission, exhibition or story." />
            <NumberedCard as="li" number="03" title="A visit" text="The Harvest, the farm, a residency or time on Country." />
            <NumberedCard as="li" number="04" title="A question" text="Something unfinished that might be worth exploring together." />
          </ul>
        </div>
      </Specimen>
      <Specimen node="ihmpx" name="Timeline row" width={700}>
        <TimelineRow when="[Year]" title="[What happened]" text="[One or two sentences]" />
      </Specimen>
      <Specimen node="ihmpx-list" name="Timeline rows, in a list" width={700}>
        <ol className={layout.list}>
          <TimelineRow as="li" when="[Year]" title="[What happened]" text="[One or two sentences]" />
          <TimelineRow as="li" when="[Years]" title="[What happened next]" text="[One or two sentences]" />
          <TimelineRow as="li" when="Next" title="[What comes next]" text="[One or two sentences]" />
        </ol>
      </Specimen>

      <h2 className={styles.group}>On pictures</h2>
      <Specimen node="WwOiE" name="Loud title" width={620}>
        <LoudTitle words="What stays after we leave." />
      </Specimen>
      <Specimen node="gzAFI" name="Caption" width={528}>
        <Caption words="[Verbatim words only]" />
      </Specimen>
    </Surface>
  );
}
