import type { Metadata } from "next";
import { Chapter } from "@/components/pieces/Chapter";
import { PullQuote } from "@/components/pieces/ArticleBody";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { NumberedCard } from "@/components/pieces/NumberedCard";
import { Onward } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { PageRail } from "@/components/pieces/PageRail";
import { Parts } from "@/components/pieces/Parts";
import { Photo } from "@/components/pieces/Photo";
import { Surface } from "@/components/pieces/Surface";
import { TimelineRow } from "@/components/pieces/TimelineRow";
import { fieldHref, fields, questionsBySlug } from "@/content";
import { pageMetadata } from "@/lib/seo/site";
import { bearings, chapters, convictions, manifesto, turns, type ChapterContent } from "./about-content";
import { Film } from "./Film";
import styles from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About A Curious Tractor | The field between us",
  description:
    "The history, philosophy and living projects of A Curious Tractor. Two people learning what to build, what to hold and what to give away.",
  path: "/about",
  image: {
    url: "/media/field-stills/hero-farm-aerial.jpg",
    alt: "A Curious Tractor's work seen from above",
  },
});

/** One chapter of the history: its number is its anchor, so the ten turns can point at it. */
function HistoryChapter({ number }: { number: string }) {
  const c: ChapterContent = chapters.find((chapter) => chapter.number === number)!;
  return (
    <div id={`chapter-${c.number}`} className={styles.chapterBlock}>
      <Chapter number={c.number} kicker={c.kicker} heading={c.heading}>
        {c.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {c.link && (
          <p className={styles.chapterLink}>
            <Onward href={fieldHref(c.link.to)}>{c.link.label}</Onward>
          </p>
        )}
      </Chapter>
    </div>
  );
}

/** A photograph or a film that runs the width of the chapters, with the words the live page sets over it. */
function Interlude({
  label,
  words,
  side = "left",
  children,
}: {
  label?: string;
  words: string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <figure className={styles.interlude}>
      {children}
      <figcaption className={`${styles.interludeWords} ${side === "right" ? styles.interludeRight : ""}`}>
        {label && <span className={styles.tagLabel}>{label}</span>}
        <span className={styles.interludeText}>{words}</span>
      </figcaption>
    </figure>
  );
}

// Pencil: Page 02 · About (manifesto, then history) (vcol9).
export default function AboutPage() {
  const noLonger = questionsBySlug["when-should-the-work-no-longer-need-us"];
  const [last, ...firstWords] = manifesto.headline.split(" ").reverse();
  const headStart = firstWords.reverse().join(" ");

  return (
    <Page door="About">
      <PageRail
        label="About"
        links={[
          { label: "Manifesto", href: "#manifesto" },
          { label: "History", href: "#history" },
          { label: "Convictions", href: "#convictions" },
        ]}
      />

      <section id="manifesto" className={styles.manifesto} aria-labelledby="manifesto-title">
        <p className={styles.eyebrow}>{manifesto.eyebrow}</p>
        <h1 id="manifesto-title" className={styles.headline}>
          {headStart}{" "}
          <span className={styles.lastWord}>
            {last}
            <Parts name="tractor" className={styles.tractor} />
            <span className={styles.stop}>.</span>
          </span>
        </h1>
        <div className={styles.stanzas}>
          {manifesto.columns.map((column) => (
            <div key={column[0].lead} className={styles.column}>
              {column.map((stanza) => (
                <div key={stanza.lead} className={styles.stanza}>
                  <p className={styles.lead}>{stanza.lead}</p>
                  <p className={styles.stanzaText}>{stanza.body}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.asking}>
          <p className={styles.eyebrow}>{manifesto.asking}</p>
          <p className={styles.question}>{manifesto.question}</p>
        </div>
      </section>

      <section id="history" className={styles.opening}>
        <div className={styles.openingText}>
          <p className={styles.eyebrow}>A founders&apos; history · the work so far</p>
          <h2 className={styles.openingTitle}>
            The field
            <br />
            between us.
          </h2>
          <p className={styles.openingLede}>
            Two people, one curious tractor, and the long work of learning what to build, what to hold and what to give
            away.
          </p>
          <Onward href="#chapter-01" tone="fg">
            Begin before the tractor
          </Onward>
        </div>
        <div className={styles.openingPhoto}>
          <Film
            className={styles.fill}
            src="/media/field-videos/hero-farm-aerial.mp4"
            poster="/media/field-stills/hero-farm-aerial.jpg"
          />
          <span className={styles.tag}>Place teaches the work</span>
        </div>
      </section>

      <section className={styles.note}>
        <p className={styles.noteTitle}>This is not a company story in which the company is the hero.</p>
        <div className={styles.noteText}>
          <p>
            It is a record of two people learning that the worth of a tool is measured by what it allows other people to
            hold, and that the deepest work of building is often the work of becoming less necessary.
          </p>
          <p>
            Some parts of this history belong in public. Some remain inside relationships, permissions and cultural
            authority. This page will keep that boundary visible.
          </p>
          <p>
            A Curious Tractor is not a First Nations organisation and does not speak as one. When we are invited into
            work with First Nations communities, our responsibility is to follow community authority, be clear about
            what we hold, and accept correction, refusal and silence as part of the work. A relationship is not consent
            in perpetuity. A good history together does not turn the next visit into an entitlement.
          </p>
        </div>
      </section>

      <nav className={styles.turns} aria-labelledby="turns-title">
        <p id="turns-title" className={styles.eyebrow}>
          Ten turns in the field
        </p>
        <ol className={styles.turnList}>
          {chapters.map((c, i) => (
            <li key={c.number}>
              <a href={`#chapter-${c.number}`} className={styles.turn}>
                <span className={styles.turnNumber}>{c.number}</span>
                <span className={styles.turnLabel}>{turns[i]}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.chapters}>
        <HistoryChapter number="01" />
        <div className={styles.proud}>
          <PullQuote quote="Are you proud of it?" from="The question that travelled further than any framework" />
        </div>
        <HistoryChapter number="02" />
        <Interlude words="The archive reads less like a business plan than a weather map.">
          <Photo
            src="/media/field-stills/goods-community-aerial.jpg"
            alt="Goods on Country field work viewed from above"
            className={styles.fillPhoto}
          />
        </Interlude>
        <HistoryChapter number="03" />
        <Interlude
          label="Hands before claims"
          words="The object enters the room. Then the real questions begin."
        >
          <Film
            className={styles.fill}
            src="/media/field-videos/goods-community-build.mp4"
            poster="/media/field-stills/goods-community-build.jpg"
          />
        </Interlude>
        <HistoryChapter number="04" />
        <div className={styles.dual}>
          <Photo
            src="/media/field-stills/palm-island-coastline.jpg"
            alt="Bwgcolman (Palm Island) coastline"
            className={styles.dualPhoto}
          />
          <Photo
            src="/media/field-stills/empathy-ledger-elder-trip.jpg"
            alt="Documentary landscape from Empathy Ledger field work"
            className={styles.dualPhoto}
          />
        </div>
        <HistoryChapter number="05" />
      </div>

      <Surface as="section" tone="ink" className={styles.band} aria-labelledby="fire-title">
        <div className={styles.bandFilm}>
          <Film
            className={styles.fill}
            src="/media/field-videos/contained-aerial.mp4"
            poster="/media/field-stills/contained-aerial.jpg"
          />
        </div>
        <div className={styles.bandWords}>
          <p className={styles.eyebrow}>Justice · story · art</p>
          <h2 id="fire-title" className={styles.bandTitle}>
            The platform is not the fire.
          </h2>
          <p className={styles.bandText}>
            Community remains the fire. Our responsibility is to tend the connections around it and know when the
            machinery is too loud.
          </p>
        </div>
      </Surface>

      <div className={`${styles.chapters} ${styles.chaptersAfterBand}`}>
        <HistoryChapter number="06" />
        <HistoryChapter number="07" />
        <Interlude
          label="The Harvest"
          words="A table is small architecture. Who can reach it changes the room."
          side="right"
        >
          <Film
            className={styles.fill}
            src="/media/field-videos/harvest-witta-aerial.mp4"
            poster="/media/field-stills/harvest-witta-aerial.jpg"
          />
        </Interlude>
        <Interlude words="Some work needs a table, a garden and time.">
          <Photo
            src="/media/field-stills/harvest-witta-aerial-3.jpg"
            alt="The Harvest in Witta viewed from above"
            className={styles.fillPhoto}
          />
        </Interlude>
        <HistoryChapter number="08" />
        <HistoryChapter number="09" />
        <HistoryChapter number="10" />
      </div>

      <Surface as="section" tone="ink" className={styles.connects} aria-labelledby="connects-title">
        <div className={styles.connectsWords}>
          <p className={styles.eyebrow}>How it connects</p>
          <h2 id="connects-title" className={styles.connectsTitle}>
            What connects the work.
          </h2>
          <p className={styles.connectsText}>
            Beds, stories, public art and places to gather appear throughout this history. Each brings us back to who
            decides, who benefits, and what people can carry forward.
          </p>
        </div>
        <ul className={styles.five}>
          {fields.map((field) => (
            <li key={field.id}>
              <details className={styles.item} name="connects" open={field.id === "empathy"}>
                <summary className={styles.summary}>
                  <span className={styles.itemTitle}>{field.name}</span>
                  <span aria-hidden="true" className={styles.glyph} />
                </summary>
                <p className={styles.itemText}>{field.line}</p>
              </details>
            </li>
          ))}
        </ul>
      </Surface>

      <section id="convictions" className={styles.convictions} aria-labelledby="convictions-title">
        <p className={styles.eyebrow}>What we now believe</p>
        <h2 id="convictions-title" className={styles.convictionsTitle}>
          Seven convictions for the next field.
        </h2>
        <ol className={styles.convictionList}>
          {convictions.map((conviction, i) => (
            <NumberedCard
              key={conviction.title}
              as="li"
              number={String(i + 1).padStart(2, "0")}
              title={conviction.title}
              text={conviction.text}
            />
          ))}
        </ol>
      </section>

      <section id="bearings" className={styles.bearings} aria-labelledby="bearings-title">
        <div className={styles.bearingsHead}>
          <p className={styles.eyebrow}>Historical bearings</p>
          <h2 id="bearings-title" className={styles.bearingsTitle}>
            A chronology of becoming.
          </h2>
        </div>
        <ol className={styles.timeline}>
          {bearings.map((step) => (
            <TimelineRow key={step.when} as="li" when={step.when} title={step.title} text={step.text} />
          ))}
        </ol>
      </section>

      <Surface as="section" tone="ink" className={styles.close} aria-labelledby="close-title">
        <p className={styles.eyebrow}>Are you proud of it?</p>
        <h2 id="close-title" className={styles.closeTitle}>
          Not yet. Go back.
          <br />
          Come closer. Listen again.
        </h2>
        <div className={styles.closeLinks}>
          <Onward href="/" tone="fg">
            Return to the living field
          </Onward>
          <Onward href="/contact" tone="fg">
            Bring us a question
          </Onward>
        </div>
      </Surface>

      <div className={styles.source}>
        <p>
          This living history draws from &quot;The Field Between Us&quot;, ACT&apos;s project archive and the yearly
          reviews. Some stories remain inside relationships, permissions and cultural authority. That boundary is part of
          the record.
        </p>
      </div>

      <FourWaysOn
        listen={{ title: "What the Road Corrects", href: "/stories/what-the-road-corrects" }}
        curiosity={{ title: noLonger.question, href: `/questions/${noLonger.slug}` }}
        action={{ title: "The work", href: "/work" }}
        art={{ title: "Come into the art.", href: "/art" }}
      />
    </Page>
  );
}
