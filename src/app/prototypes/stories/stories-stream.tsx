"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EditorialArticle } from "@/lib/empathy-ledger-editorial";
import styles from "./stories.module.css";

const projectNames: Record<string,string> = { "justicehub":"JusticeHub", "goods-on-country":"Goods", "the-harvest":"The Harvest", "empathy-ledger":"Empathy Ledger", "black-cockatoo-valley":"Land", "art":"Art" };
const publicText = (value: string) => value.replace(/[—–]/g, ",");

export function StoriesStream({ stories }: { stories: EditorialArticle[] }) {
  const [project, setProject] = useState("all");
  const projects = useMemo(() => Array.from(new Set(stories.flatMap((story) => story.relatedProjectSlugs))).sort(), [stories]);
  const visible = project === "all" ? stories : stories.filter((story) => story.relatedProjectSlugs.includes(project));
  return <section className={styles.stream} aria-labelledby="stories-stream-title">
    <div className={styles.streamHead}><div><p className={styles.eyebrow}>The living stream</p><h2 id="stories-stream-title">Follow what is moving.</h2></div><div className={styles.filters} aria-label="Filter stories by project"><button type="button" aria-pressed={project === "all"} onClick={() => setProject("all")}>All</button>{projects.map((slug) => <button type="button" key={slug} aria-pressed={project === slug} onClick={() => setProject(slug)}>{projectNames[slug] || slug.replaceAll("-", " ")}</button>)}</div></div>
    <div className={styles.grid}>{visible.map((story, index) => {
      const video = story.media?.videoPreviews?.[0];
      return <article key={story.id} className={index === 0 && project === "all" ? styles.lead : ""}><Link href={story.localPath}>
        <div className={styles.media}>{video?.url ? <video muted loop playsInline preload="metadata" poster={video.thumbnailUrl || story.featuredImageUrl || undefined} onMouseEnter={(event) => { void event.currentTarget.play().catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) console.error("Story preview could not play", error); }); }} onMouseLeave={(event) => { event.currentTarget.pause(); event.currentTarget.currentTime = 0; }}><source src={video.url} /></video> : story.featuredImageUrl ? <img src={story.featuredImageUrl} alt={story.featuredImageAlt || ""} /> : <span>Story<br />waiting for an image</span>}{video?.url ? <b>Film</b> : null}</div>
        <div className={styles.copy}><p>{story.relatedProjectSlugs.map((slug) => projectNames[slug] || slug.replaceAll("-", " ")).join(" · ") || "Across ACT"}</p><h3>{publicText(story.title)}</h3>{story.excerpt ? <span>{publicText(story.excerpt)}</span> : null}<footer><em>{publicText(story.authorName || "A Curious Tractor")}</em><b>Read →</b></footer></div>
      </Link></article>;
    })}</div>
  </section>;
}
