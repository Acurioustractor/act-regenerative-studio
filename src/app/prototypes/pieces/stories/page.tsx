import type { Metadata } from "next";
import { ArticleBody, BodyHeading, Divider, Figure, Paragraph, PullQuote } from "@/components/pieces/ArticleBody";
import { ArticleOpening } from "@/components/pieces/ArticleOpening";
import { Byline } from "@/components/pieces/Byline";
import { CallToAction } from "@/components/pieces/CallToAction";
import { FilterPills } from "@/components/pieces/FilterPills";
import { Photo } from "@/components/pieces/Photo";
import { Onward } from "@/components/pieces/Onward";
import { ReadingTractor } from "@/components/pieces/ReadingTractor";
import { StoryCard } from "@/components/pieces/StoryCard";
import { StoryRow } from "@/components/pieces/StoryRow";
import { Surface } from "@/components/pieces/Surface";
import { Specimen } from "../Specimen";
import styles from "../pieces.module.css";
import local from "./stories.module.css";
import { LoadAgain, StreamDemo } from "./Demos";

export const metadata: Metadata = {
  title: "Brand v1 pieces: stories and articles | A Curious Tractor",
  robots: { index: false, follow: false },
};

// The story and article pieces of Brand v1, drawn once each beside their Pencil node. Stories come from the Empathy
// Ledger and the pieces only render what they are given, so every storyteller, title and line below is a stand-in.
// The photographs are existing field stills; the projects and fields named are ACT's own.
const stills = "/media/field-stills/";
const road = { src: `${stills}goods-remote-aerial-video.jpg`, alt: "Aerial view of a dirt road running through green scrub toward a red hill" };
const sunrise = { src: `${stills}goods-utopia-sunrise.jpg`, alt: "Dusk over a fence line, orange low on the horizon" };
const plant = { src: `${stills}goods-site-recycling-plant.jpg`, alt: "A machine fitted with a round brush working over a green sheet" };
const aerial = { src: `${stills}harvest-witta-aerial-3.jpg`, alt: "Aerial view of sheds, gardens and paddocks" };
const container = { src: `${stills}justicehub-container.jpg`, alt: "A shipping container with its doors open" };
const coast = { src: `${stills}palm-island-coastline.jpg`, alt: "A coastline of bush and water seen from above" };

const teller = "Storyteller name";
const storyTitle = "A story title as it was given";
const excerpt = "The opening lines of the story, in the storyteller's own words, cut where the card ends.";
const line = "A line from the story, in the person's own words.";
const fields = ["JusticeHub", "Goods on Country", "Empathy Ledger", "The Harvest"];
const para = (n: number) =>
  `Paragraph ${n} of the story, set in the reading face at 20 on 1.6 in a column 680 wide. The storyteller's words run here exactly as they wrote them, and this stand-in is only long enough to wrap onto a second and a third line.`;

const cards = [
  { project: "Goods", title: storyTitle, excerpt, author: teller, tileWords: "Field\nnotes" },
  { project: "Goods", title: "A shorter title", excerpt, author: teller, photo: sunrise },
  { project: "JusticeHub", title: "A story title that runs on to a third line, as the longest ones do", excerpt, author: teller, photo: container },
  { project: "The Harvest", title: storyTitle, excerpt, author: teller, photo: aerial },
  { project: "Empathy Ledger", title: "A short one", excerpt, author: teller, tileWords: "Field\nnotes" },
  { project: "Land", title: storyTitle, excerpt, author: teller, photo: coast },
];

export default function StoriesPiecesPage() {
  return (
    <Surface className={`full-bleed ${styles.page}`}>
      <div className={styles.intro}>
        <h1>Stories and articles</h1>
        <p>
          Story card, row, filter pills, byline, the article opening and its body blocks, the call to action, the photo
          and the reading tractor. Every name, title and line here is a stand-in; the stories come from the Empathy
          Ledger. Nothing live uses these yet.
        </p>
      </div>

      <h2 className={styles.group}>Photo</h2>
      <Specimen node="E6GIv" name="Photo, duotone (Pencil's treatment)" width={560}>
        <Photo src={aerial.src} alt={aerial.alt} tone="duotone" className={local.loadAgainPhoto} />
      </Specimen>
      <Specimen node="E6GIv-colour" name="Photo, in colour (what the cards and the article use)" width={560}>
        <Photo src={aerial.src} alt={aerial.alt} className={local.loadAgainPhoto} />
      </Specimen>
      <Specimen node="d-load" name="Photo while it loads (act-play.html d-load)" width={560}>
        <LoadAgain src={`${stills}palm-island-coastline.jpg`} alt={coast.alt} />
      </Specimen>
      <Specimen node="d-load-failed" name="Photo that never arrives" width={560}>
        <Photo src="/media/field-stills/never-arrives.jpg" alt="A photograph that is not there" className={local.loadAgainPhoto} />
      </Specimen>

      <h2 className={styles.group}>Cards and rows</h2>
      <Specimen node="BUhG1" name="Story card" width={420}>
        <StoryCard href="/prototypes/pieces/stories" title={storyTitle} project="Across ACT" excerpt={excerpt} author={teller} photo={road} />
      </Specimen>
      <Specimen node="yk6Yr" name="Story card, text tile" width={420}>
        <StoryCard href="/prototypes/pieces/stories" title={storyTitle} project="Across ACT" excerpt={excerpt} author={teller} tileWords={"Field\nnotes"} />
      </Specimen>
      <Specimen node="eT6wu" name="Story row" width={900}>
        <StoryRow href="/prototypes/pieces/stories" marker="01" title={storyTitle} />
      </Specimen>
      <Specimen node="RbsRA" name="Filter pills">
        <div className={local.pair}>
          <FilterPills
            label="Filter stories by project"
            pills={[
              { value: "all", label: "All" },
              { value: "justicehub", label: "JusticeHub" },
              { value: "goods", label: "Goods" },
              { value: "el", label: "Empathy Ledger" },
              { value: "harvest", label: "The Harvest" },
              { value: "land", label: "Land" },
            ]}
          />
        </div>
      </Specimen>
      <Specimen node="ZI1Qs" name="The stream: pills choose, cards follow (Phone: ZI1Qs, Desktop: ECwwj)" width={1440}>
        <StreamDemo cards={cards} />
      </Specimen>

      <h2 className={styles.group}>The article</h2>
      <Specimen node="B7ed4r" name="Article opening" width={1440}>
        <ArticleOpening
          photo={road}
          kicker="Editorial · Across ACT"
          title="A story title that runs to two lines"
          subtitle="A line under the title, in the storyteller's own words, long enough to run on to a second line"
          author={teller}
          readingMinutes={8}
        />
      </Specimen>
      <Specimen node="R1wK5" name="Paragraph" width={680}>
        <Paragraph>A paragraph of the story, in the reading face.</Paragraph>
      </Specimen>
      <Specimen node="p4dfi" name="Body heading" width={680}>
        <BodyHeading>A heading inside an article</BodyHeading>
      </Specimen>
      <Specimen node="YPZDq" name="Divider" width={680}>
        <Divider />
      </Specimen>
      <Specimen node="hGi4g" name="Figure, with a caption" width={1000}>
        <Figure src={plant.src} alt={plant.alt} caption="A caption is their words, or nothing." />
      </Specimen>
      <Specimen node="hGi4g-bare" name="Figure, no caption" width={1000}>
        <Figure src={plant.src} alt={plant.alt} />
      </Specimen>
      <Specimen node="MF3w7" name="Pull quote" width={680}>
        <PullQuote quote={line} from={storyTitle} />
      </Specimen>
      <Specimen node="Q9FnS" name="Byline" width={560}>
        <Byline name={teller} fields={fields} />
      </Specimen>
      <Specimen node="KdzlR" name="Call to action" width={1440}>
        <CallToAction
          heading="This story lives in the Empathy Ledger, carried with consent. Keep reading, or get in touch."
          actions={[
            { label: "Open source record", href: "https://empathy-ledger.example" },
            { label: "Read stories", href: "/stories" },
            { label: "Start a conversation", href: "/contact" },
          ]}
        />
      </Specimen>

      <h2 className={styles.group}>Put together</h2>
      <Specimen node="nq1e6" name="An article, opening to call to action (Pencil: Page 10, without the chrome)" width={1440}>
        <article id="composed-article">
          <ReadingTractor target="composed-article" />
          <ArticleOpening
            photo={road}
            kicker="Editorial · Across ACT"
            title="A story title that runs to two lines"
            subtitle="A line under the title, in the storyteller's own words, long enough to run on to a second line"
            author={teller}
            readingMinutes={8}
          />
          <div className={local.articleGap}>
            <Onward href="/prototypes/pieces/stories" tone="fg" back>
              All stories
            </Onward>
          </div>
          <ArticleBody>
            <Paragraph>{para(1)}</Paragraph>
            <Paragraph>{para(2)}</Paragraph>
            <Figure src={sunrise.src} alt={sunrise.alt} />
            <Paragraph>{para(3)}</Paragraph>
            <BodyHeading>A heading inside an article</BodyHeading>
            <Paragraph>{para(4)}</Paragraph>
            <PullQuote quote={line} from={storyTitle} />
            <Paragraph>{para(5)}</Paragraph>
            <Divider />
            <div className={local.bylineRow}>
              <Byline name={teller} fields={fields} />
            </div>
          </ArticleBody>
          <CallToAction
            heading="This story lives in the Empathy Ledger, carried with consent. Keep reading, or get in touch."
            actions={[
              { label: "Open source record", href: "https://empathy-ledger.example" },
              { label: "Read stories", href: "/stories" },
              { label: "Start a conversation", href: "/contact" },
            ]}
          />
        </article>
      </Specimen>

      <h2 className={styles.group}>Reading progress</h2>
      <Specimen node="d-read" name="Reading tractor (act-play.html d-read): scroll the page through the text" width={1000}>
        <ReadingTractor target="reader-text" />
        <div id="reader-text" className={local.readerBody}>
          {Array.from({ length: 14 }, (_, i) => (
            <p key={i}>
              {para(i + 1)} The tractor above follows how far through this block you have scrolled, and its wheels turn
              with the page.
            </p>
          ))}
        </div>
      </Specimen>

      <h2 className={styles.group}>Rows in a list</h2>
      <div className={local.rows} data-piece="rows">
        {["01", "02", "03"].map((marker) => (
          <StoryRow key={marker} href="/prototypes/pieces/stories" marker={marker} title={storyTitle} />
        ))}
      </div>
    </Surface>
  );
}
