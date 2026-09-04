"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EditorialArticle } from "@/lib/empathy-ledger-editorial";
import { articleDateTime, formatArticleDate } from "@/lib/editorial/format-date";
import styles from "./stories.module.css";

const projectNames: Record<string,string> = { "justicehub":"JusticeHub", "goods-on-country":"Goods", "the-harvest":"The Harvest", "empathy-ledger":"Empathy Ledger", "black-cockatoo-valley":"Land", "art":"Art" };
// An article arrives tagged in two vocabularies at once: the project-code
// registry calls Goods "goods" and the farm "act-farm", while Empathy Ledger
// and the map above use "goods-on-country" and "black-cockatoo-valley". The
// sync unions both, so without this a card read "goods · Goods" and the filter
// offered both. Display-only: the data keeps both forms for the field graph.
const displaySlug = (slug: string) => ({ goods: "goods-on-country", "act-farm": "black-cockatoo-valley" } as Record<string,string>)[slug] ?? slug;
const displaySlugs = (slugs: string[]) => Array.from(new Set(slugs.map(displaySlug)));
const publicText = (value: string) => value.replace(/[—–]/g, ",");

export function StoriesStream({ stories }: { stories: EditorialArticle[] }) {
  const [project, setProject] = useState("all");
  // Every featured image resolves today, but 81 of the 114 gallery photographs
  // behind these same articles return HTTP 400 from Empathy Ledger's storage
  // (measured 2026-08-07). A card whose image dies should fall back to the tile
  // this grid already has for an article with no image, rather than leaving a
  // browser's broken-image glyph in an editorial grid.
  const [deadImages, setDeadImages] = useState<string[]>([]);
  const projects = useMemo(() => Array.from(new Set(stories.flatMap((story) => displaySlugs(story.relatedProjectSlugs)))).sort(), [stories]);
  const visible = project === "all" ? stories : stories.filter((story) => displaySlugs(story.relatedProjectSlugs).includes(project));
  return <section className={styles.stream} aria-labelledby="stories-stream-title">
    <div className={styles.streamHead}><div><p className={styles.eyebrow}>The living stream</p><h2 id="stories-stream-title">Follow what is moving.</h2></div><div className={styles.filters} aria-label="Filter stories by project"><button type="button" aria-pressed={project === "all"} onClick={() => setProject("all")}>All</button>{projects.map((slug) => <button type="button" key={slug} aria-pressed={project === slug} onClick={() => setProject(slug)}>{projectNames[slug] || slug.replaceAll("-", " ")}</button>)}</div></div>
    <div className={styles.grid}>{visible.map((story, index) => {
      const video = story.media?.videoPreviews?.[0];
      const image = story.featuredImageUrl && !deadImages.includes(story.featuredImageUrl) ? story.featuredImageUrl : null;
      return <article key={story.id} className={index === 0 && project === "all" ? styles.lead : ""}><Link href={story.localPath}>
        <div className={styles.media}>{video?.url ? <video muted loop playsInline preload="metadata" poster={video.thumbnailUrl || image || undefined} onMouseEnter={(event) => { void event.currentTarget.play().catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) console.error("Story preview could not play", error); }); }} onMouseLeave={(event) => { event.currentTarget.pause(); event.currentTarget.currentTime = 0; }}><source src={video.url} /></video> : image ? <img src={image} alt={story.featuredImageAlt || ""} onError={() => setDeadImages((current) => current.includes(image) ? current : [...current, image])} /> : <span>Story<br />waiting for an image</span>}{video?.url ? <b>Film</b> : null}</div>
        <div className={styles.copy}><p>{displaySlugs(story.relatedProjectSlugs).map((slug) => projectNames[slug] || slug.replaceAll("-", " ")).join(" · ") || "Across ACT"}{formatArticleDate(story.publishedAt) ? <> · <time dateTime={articleDateTime(story.publishedAt) ?? undefined}>{formatArticleDate(story.publishedAt)}</time></> : null}</p><h3>{publicText(story.title)}</h3>{story.excerpt ? <span>{publicText(story.excerpt)}</span> : null}<footer><em>{publicText(story.authorName || "A Curious Tractor")}</em><b>Read →</b></footer></div>
      </Link></article>;
    })}</div>
  </section>;
}
