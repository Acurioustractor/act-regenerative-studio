import type { Metadata } from "next";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Page } from "@/components/pieces/Page";
import { PageRail } from "@/components/pieces/PageRail";
import {
  getBakedEditorialSnapshot,
  getEditorialSnapshot,
  getSiteEditorialArticles,
} from "@/lib/empathy-ledger-editorial";
import { pageMetadata } from "@/lib/seo/site";
import { StoriesStream } from "./StoriesStream";
import { streamModel } from "./stories-model";
import styles from "./stories.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Stories across the field",
  description: "Writing, images and films carried with consent from across A Curious Tractor's projects.",
  path: "/stories",
  image: {
    url: "/media/field-stills/empathy-ledger-community-story.jpg",
    alt: "A community storytelling conversation",
  },
});

export const revalidate = 60;

/** The day the feed behind the page was made, in the studio's own time zone. */
function snapshotDay(generatedAt: string | null): string {
  if (!generatedAt) return "awaiting first sync";
  const date = new Date(generatedAt);
  if (Number.isNaN(date.getTime())) return "awaiting first sync";
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "Australia/Brisbane" });
}

// Pencil: Page 09 · Stories (GPOEr); phone Phone · 09 Stories (nh9b4).
export default async function StoriesPage() {
  // The same read the page has always made: live from Empathy Ledger with the baked snapshot as the fallback, the
  // consent gate applied to both inside getSiteEditorialArticles.
  const stories = await getSiteEditorialArticles(100).catch(() => []);
  const snapshot = await getEditorialSnapshot().catch(() => getBakedEditorialSnapshot());
  const { rows, pills, storyCount, projectCount, soleAuthor } = streamModel(stories);
  const lead = rows.find((row) => row.photo) ?? rows[0];

  return (
    <Page door="Stories">
      <PageRail
        label="Stories"
        links={[
          { label: "Introduction", href: "#introduction" },
          { label: "Browse", href: "#browse" },
          { label: "Publishing model", href: "#model" },
        ]}
      />

      <section id="introduction" className={styles.opening}>
        <div className={styles.openingWords}>
          <p className={styles.eyebrow}>Stories across the field</p>
          <h1 className={styles.title}>
            The writing
            <br />
            so far.
          </h1>
        </div>
        <div className={styles.openingRight}>
          <p className={styles.lede}>
            Writing from A Curious Tractor&rsquo;s work across justice, story, making and place. Empathy Ledger holds the
            master copy of every piece, so a story can be corrected or withdrawn at its source.
          </p>
          <dl className={styles.counts}>
            <div className={styles.count}>
              <dt>Public stories</dt>
              <dd>{storyCount}</dd>
            </div>
            <div className={styles.count}>
              <dt>Connected projects</dt>
              <dd>{projectCount}</dd>
            </div>
          </dl>
        </div>
      </section>

      <ul className={styles.strip} aria-label="How a story reaches this page">
        <li>Published through Empathy Ledger</li>
        <li>Carried here with consent</li>
        <li>Linked back to its project</li>
      </ul>

      {storyCount > 0 && <StoriesStream rows={rows} pills={pills} />}

      <section id="model" className={styles.model} aria-labelledby="model-title">
        <div className={styles.modelLeft}>
          <p className={styles.eyebrow}>The publishing model</p>
          <h2 id="model-title" className={styles.modelHeading}>
            Write once.
            <br />
            Let the story travel carefully.
          </h2>
        </div>
        <div className={styles.modelRight}>
          <p>
            A project publishes through Empathy Ledger. Consent, attribution, project relationships and media travel with
            the story. ACT gathers the public stories here without creating an orphaned copy.
          </p>
          <p>
            If permission changes, the story can be withdrawn from every connected destination. The source remains
            visible, and each project can keep its own voice.
          </p>
          {/* Said only while it is true of what the feed returned: one byline across every story, and the name is the
              feed's own. If a second author appears the paragraph drops out rather than go on claiming it. */}
          {soleAuthor && (
            <p>
              Every piece here is currently written by one of us, {soleAuthor}. The work it describes belongs to the
              people and organisations carrying it. That the writing has not caught up with that yet is a fact about this
              page, not about the work, and the next pieces should not come from us.
            </p>
          )}
          <div className={styles.modelLinks}>
            <a className={styles.enter} href="https://empathyledger.com" target="_blank" rel="noreferrer">
              Enter Empathy Ledger ↗
            </a>
            <span className={styles.snapshot}>Feed snapshot: {snapshotDay(snapshot.generatedAt)}</span>
          </div>
        </div>
      </section>

      <FourWaysOn
        listen={lead ? { title: lead.title, href: lead.href } : { invite: "All the stories", title: "The writing so far.", href: "/stories" }}
        curiosity={{ invite: "All the questions", title: "Curiosity before certainty.", href: "/questions" }}
        action={{ title: "The work", href: "/work" }}
        art={{ title: "Come into the art.", href: "/art" }}
      />
    </Page>
  );
}
