import type { Metadata } from "next";
import Link from "next/link";
import { FourWaysOn } from "@/components/pieces/FourWaysOn";
import { Page } from "@/components/pieces/Page";
import { fieldsById, questionsBySlug } from "@/content";
import { pageMetadata } from "@/lib/seo/site";
import styles from "./returned.module.css";

/**
 * A story that has gone back to its owner (Pencil: Page 10b, m3JFv).
 *
 * config/withdrawn-editorial.json is the tombstone. The consent gate in empathy-ledger-editorial.ts already keeps a
 * withdrawn slug out of every read, so the article is never fetched for it; this only decides what the reader is told
 * at that address. It says nothing about the story and names no one: not its title, not its teller, not why.
 *
 * The words are Pencil's, proposed for Ben and Nic to judge ("It was theirs to take back, and they have.").
 */

const HEADLINE = "It was theirs to take back, and they have.";

/** Not for the index, and nothing in the title or description that belongs to the story. */
export function returnedMetadata(slug: string): Metadata {
  return pageMetadata({
    title: HEADLINE,
    description: "Other stories are carried with consent in Stories.",
    path: `/stories/${slug}`,
    noIndex: true,
  });
}

export function StoryReturned() {
  const told = questionsBySlug["who-holds-the-story"];
  const empathy = fieldsById.empathy;

  return (
    <Page door="Stories">
      <section className={styles.returned} aria-labelledby="returned-title">
        <p className={styles.eyebrow}>This story has gone back to its owner</p>
        <h1 id="returned-title" className={styles.title}>
          {HEADLINE}
        </h1>
        <p className={styles.words}>
          Other stories are carried with consent in <Link href="/stories">Stories</Link>.
        </p>
      </section>

      <div className={styles.ground} aria-hidden="true">
        <span className={styles.line} />
        <span className={styles.story}>
          <span className={styles.wheel} />
          <span className={styles.wheel} />
        </span>
      </div>

      <FourWaysOn
        listen={{ invite: "All the stories", title: "The writing so far.", href: "/stories" }}
        curiosity={{ title: told.question, href: `/questions/${told.slug}` }}
        action={{ title: `${empathy.name} ↗`, href: empathy.destinationHref }}
        art={{ title: "Come into the art.", href: "/art" }}
      />
    </Page>
  );
}
