import type { Metadata } from "next";
import Link from "next/link";
import { ArriveIntro } from "@/components/pieces/ArriveIntro";
import { Film } from "@/components/pieces/Film";
import { Hero } from "@/components/pieces/Hero";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Onward, Wheel } from "@/components/pieces/Onward";
import { Page } from "@/components/pieces/Page";
import { Parts } from "@/components/pieces/Parts";
import { PullQuote } from "@/components/pieces/ArticleBody";
import { Surface } from "@/components/pieces/Surface";
import { fieldHref, fields, partDoors, site } from "@/content";
import heroMedia from "@/data/hero-media-selections.json";
import { pageMetadata } from "@/lib/seo/site";
import { FieldChooser, type ChooserField } from "./_home/FieldChooser";
import { FieldLetterSignup } from "./_home/FieldLetterSignup";
import { ReturnActions } from "./_home/ReturnActions";
import styles from "./_home/home.module.css";

export const metadata: Metadata = pageMetadata({
  title: "A Curious Tractor | Art, stories and work in the field",
  description: "Come into the art, then follow it into A Curious Tractor's work across story, justice, making and place.",
  path: "/",
  image: { url: "/media/field-stills/contained-aerial.jpg", alt: "CONTAINED artwork seen from above" },
});

const ASK = "/contact?type=general&source=living-field&context=field-question";

// The five fields as the chooser shows them: each field's own words from src/content, and the footage the screening room
// chose for it (src/data/hero-media-selections.json), with the field's still where none was chosen.
const chooserFields: ChooserField[] = fields.map((field) => {
  const chosen = heroMedia.fields[field.id];
  return {
    id: field.id,
    number: field.number,
    name: field.name,
    line: field.line,
    invitation: field.invitation,
    href: fieldHref(field.id),
    destinationHref: field.destinationHref,
    destinationLabel: field.destinationLabel,
    poster: chosen?.posterUrl || field.image,
    video: chosen?.videoUrl,
    mediaTitle: chosen?.title,
  };
});

const harvestBand = heroMedia.fields.harvest;

// Pencil: Page 01 Home (n3PJGp), Phone · 01 Home (zH7Jr).
export default function HomePage() {
  return (
    <Page>
      <ArriveIntro />

      <Hero
        image="/media/field-stills/harvest-witta-aerial-3.jpg"
        place={["Witta /", "Jinibara Country"]}
        timeLabel="Local time"
        timeZone="Australia/Brisbane"
        line={["Made with people /", "left with them"]}
        words={["What stays", "after we leave."]}
        oneLine={site.oneLine}
        method={["Listen · Curiosity /", "Action · Art"]}
        down={{ label: "The work", href: "#fields" }}
      />

      <section className={styles.under} aria-label="What the road corrects">
        <div className={styles.intro}>
          <p className={styles.eyebrow}>What the road corrects</p>
          <p className={styles.introText}>
            Useful work often arrives without the relationship needed to change it. Good relationships are left without
            the machinery, money or memory to continue. We work in the space between them.
          </p>
        </div>
        <div className={styles.five}>
          <ul className={styles.fiveList} aria-label="The five fields">
            {fields.map((field) => (
              <li key={field.id}>
                <Link href={fieldHref(field.id)} className={styles.fiveLink}>
                  <span>{field.name}</span>
                  <span aria-hidden="true" className={styles.fiveNumber}>
                    {field.number}
                    <Wheel />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <a href="#fields" className={styles.follow}>
            Follow it into the field ↓
          </a>
        </div>
      </section>

      <Surface as="section" tone="ink" className={styles.ribbon} aria-label="How A Curious Tractor works">
        <ul className={styles.four}>
          {partDoors.map((door) => (
            <li key={door.meaning} className={styles.method}>
              <span className={styles.glyph}>
                <Parts name="tractor" rust={door.part} />
              </span>
              <span className={styles.methodName}>{door.meaning}</span>
            </li>
          ))}
        </ul>
        <p className={styles.ribbonLine}>Listening does not finish before curiosity begins.</p>
      </Surface>

      <section id="fields" className={styles.choose} aria-labelledby="fields-title">
        <div className={styles.chooseHead}>
          <p className={styles.eyebrow}>The field is alive</p>
          <h2 id="fields-title" className={styles.chooseTitle}>
            Choose a way into the work.
          </h2>
          <p className={styles.chooseText}>
            You do not need to understand the whole field. Begin with what pulls you closer.
          </p>
        </div>
        <FieldChooser fields={chooserFields} />
      </section>

      <section className={styles.oneQuestion} aria-labelledby="one-question-title">
        <div className={styles.oneLeft}>
          <p className={styles.eyebrow}>How the writing works</p>
          <h2 id="one-question-title" className={styles.oneTitle}>
            One question moves across the field.
          </h2>
        </div>
        <div className={styles.oneRight}>
          <p className={styles.oneText}>
            We begin with a question we cannot leave alone. Then we write into it from the work: art, land, justice,
            goods, story and the people already carrying it.
          </p>
          <Onward href="/stories" tone="fg">
            Read the stories
          </Onward>
        </div>
      </section>

      <section id="field-letter" className={styles.letter} aria-labelledby="letter-title">
        <div className={styles.letterLeft}>
          <p className={styles.eyebrow}>Field letter #001</p>
          <h2 id="letter-title" className={styles.letterTitle}>
            How do we know when the work should no longer need us?
          </h2>
          <p className={styles.byline}>An ACT working question</p>
        </div>
        <div className={styles.panel}>
          <p className={styles.salutation}>Dear Maya,</p>
          <p className={styles.letterText}>
            A tool can be useful and still hold too tightly. We see it in the meeting room. ACT is still speaking after
            everyone else has learned the words.
          </p>
          <p className={styles.letterText}>
            The test is ordinary. Who holds the key? Who can change the timetable? Where does the money come to rest?
            Could the work continue if our engine went quiet?
          </p>
          <PullQuote
            quote="The tractor should transfer power without mistaking itself for the field."
            from="Field letter #001"
          />
          <div className={styles.letterLinks}>
            <Onward href="/questions" tone="fg">
              Read the questions
            </Onward>
            <Onward href={ASK} tone="fg">
              Ask a question
            </Onward>
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="harvest-title">
        <div className={styles.bandPhoto}>
          <Film src={harvestBand.videoUrl} poster={harvestBand.posterUrl} className={styles.bandFilm} />
        </div>
        <Surface tone="ink" className={styles.bandText}>
          <p className={styles.eyebrow}>The Harvest · Witta</p>
          <h2 id="harvest-title" className={styles.bandTitle}>
            Leave the screen.
            <br />
            Come to the table.
          </h2>
          <p className={styles.bandLine}>
            Grow, make and gather in Witta, on Jinibara Country, while the place is still finding its rhythm. Arrive
            through food, art, work or a question.
          </p>
          <p className={styles.chip}>
            <span aria-hidden="true" className={styles.dot} />
            Now in the field · The gate is open
          </p>
          <Onward href={fieldHref("harvest")} tone="fg">
            Enter the Harvest story
          </Onward>
        </Surface>
      </section>

      <section className={styles.return} aria-labelledby="return-title">
        <div className={styles.returnLeft}>
          <h2 id="return-title" className={styles.returnTitle}>
            What question
            <br className={styles.wide} /> is following you?
          </h2>
          <p className={styles.returnText}>
            This is an invitation, though not a general one. We are looking for people already holding real work: a
            community organisation with the authority to tell us no, a buyer who can place a real order, a funder who
            knows the difference between plant, people and proof.
          </p>
          <p className={styles.returnText}>
            Do not send a polished brief. Tell us what is happening, who is already carrying it, what must not be
            taken, and what would need to remain after we leave.
          </p>
          <ReturnActions askHref={ASK} />
        </div>
        <div className={styles.returnRight}>
          <FieldLetterSignup />
        </div>
      </section>

      <FourWaysOn
        listen={{ invite: "All the stories", title: "The writing so far.", href: "/stories" }}
        curiosity={{ invite: "All the questions", title: "Curiosity before certainty.", href: "/questions" }}
        action={{ title: "The work", href: "/work" }}
        art={{ title: "Come into the art.", href: "/art" }}
        closing={{ words: "Or read the manifesto.", label: "About", href: "/about" }}
      />
    </Page>
  );
}
