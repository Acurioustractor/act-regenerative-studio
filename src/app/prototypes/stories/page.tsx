import type { Metadata } from "next";
import {
  EditorialHeader,
  PageRail,
} from "@/components/prototypes/EditorialHeader";
import {
  getSiteEditorialArticles,
  getEditorialSnapshot,
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
  const snapshot = getEditorialSnapshot();
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
          <h1>
            One place.
            <br />
            Many voices.
          </h1>
          <div>
            <p>
              Writing, images and films from across ACT's projects. Each story
              stays connected to its source, its people and its permissions.
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
