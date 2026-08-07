import type { Metadata } from "next";
import {
  EditorialHeader,
  PageRail,
} from "@/components/prototypes/EditorialHeader";
import {
  getSiteEditorialArticles,
  getBakedEditorialSnapshot,
} from "@/lib/empathy-ledger-editorial";
import { StoriesStream } from "./stories-stream";
import styles from "./stories.module.css";

export const metadata: Metadata = {
  title: "Stories across the field | A Curious Tractor",
  robots: { index: false, follow: false },
};
export const revalidate = 60;

export async function StoriesExperience({
  production = false,
}: {
  production?: boolean;
}) {
  const stories = await getSiteEditorialArticles(100).catch(() => []);
  const snapshot = getBakedEditorialSnapshot();
  const projectCount = new Set(
    stories.flatMap((story) => story.relatedProjectSlugs),
  ).size;
  return (
    <div className={styles.page}>
      <EditorialHeader
        homeHref={production ? "/" : "/prototypes/living-field"}
      />
      <PageRail
        label="Stories"
        links={[
          ["Introduction", "#stories-introduction"],
          ["Browse", "#stories-browse"],
          ["Publishing model", "#stories-model"],
        ]}
      />
      <main>
        <section id="stories-introduction" className={styles.hero}>
          <p className={styles.eyebrow}>Stories across the field</p>
          {/* "One place. Many voices." was not true. Every article in the feed
              carries one byline, Benjamin Knight, and the line beneath it
              claimed each story stays connected to "its people and its
              permissions" when the feed carries no per-story consent record at
              all. Both are the kind of claim ACT asks funders not to make.
              Corrected 2026-08-07; the authorship note now sits in the
              publishing-model section below, where it can be said plainly. */}
          {/* Two short lines, because the display face is set at up to 10rem
              and anything longer wraps to four and swallows the viewport.
              "Field notes" was the first attempt and collided with the nav
              item of that name, which points at /questions. */}
          <h1>
            The writing
            <br />
            so far.
          </h1>
          <div>
            <p>
              Writing from A Curious Tractor's work across justice, story,
              making and place. Empathy Ledger holds the master copy of every
              piece, so a story can be corrected or withdrawn at its source.
            </p>
            <dl>
              <div>
                <dt>{stories.length}</dt>
                <dd>public stories</dd>
              </div>
              <div>
                <dt>{projectCount}</dt>
                <dd>connected projects</dd>
              </div>
            </dl>
          </div>
        </section>
        <div className={styles.flow}>
          <span>Published through Empathy Ledger</span>
          <i />
          <span>Carried here with consent</span>
          <i />
          <span>Linked back to its project</span>
        </div>
        <div id="stories-browse">
          <StoriesStream stories={stories} />
        </div>
      <section id="stories-model" className={styles.system}>
          <p className={styles.eyebrow}>The publishing model</p>
          <h2>
            Write once.
            <br />
            Let the story travel carefully.
          </h2>
          <div>
            <p>
              A project publishes through Empathy Ledger. Consent, attribution,
              project relationships and media travel with the story. ACT gathers
              the public stories here without creating an orphaned copy.
            </p>
            <p>
              If permission changes, the story can be withdrawn from every
              connected destination. The source remains visible, and each
              project can keep its own voice.
            </p>
            <p>
              Every piece here is currently written by one of us, Benjamin
              Knight. The work it describes belongs to the people and
              organisations carrying it. That the writing has not caught up with
              that yet is a fact about this page, not about the work, and the
              next pieces should not come from us.
            </p>
            <a
              href="https://empathyledger.com"
              target="_blank"
              rel="noreferrer"
            >
              Enter Empathy Ledger ↗
            </a>
          </div>
          <small>
            Feed snapshot:{" "}
            {snapshot.generatedAt
              ? new Date(snapshot.generatedAt).toLocaleDateString("en-AU")
              : "awaiting first sync"}
          </small>
        </section>
      </main>
    </div>
  );
}
export default async function AggregatedStoriesPage() {
  return <StoriesExperience />;
}
