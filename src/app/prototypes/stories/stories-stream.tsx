"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EditorialArticle } from "@/lib/empathy-ledger-editorial";
import { canonicalMediaSrc, isEmpathyLedgerMedia, optimisedImageUrl } from "@/lib/media/optimised-image";
import styles from "./stories.module.css";
import { FallbackImage } from "@/components/media/FallbackImage";

const projectNames: Record<string,string> = { "justicehub":"JusticeHub", "goods-on-country":"Goods", "the-harvest":"The Harvest", "empathy-ledger":"Empathy Ledger", "black-cockatoo-valley":"Land", "art":"Art" };
const publicText = (value: string) => value.replace(/[—–]/g, ",");
// The grid is three columns above 900px (the lead card spans two), two up to
// 700px, one below. Cards were full originals until 30 Sep 2026: 13.4 MB for
// ten cards, one 8,192px wide for a 266px slot.
const CARD_SIZES = "(max-width: 700px) 100vw, (max-width: 900px) 50vw, 33vw";
const LEAD_SIZES = "(max-width: 900px) 100vw, 66vw";

export function StoriesStream({ stories }: { stories: EditorialArticle[] }) {
  const [project, setProject] = useState("all");
  // Every featured image resolves today, but 81 of the 114 gallery photographs
  // behind these same articles return HTTP 400 from Empathy Ledger's storage
  // (measured 2026-08-07). A card whose image dies should fall back to the tile
  // this grid already has for an article with no image, rather than leaving a
  // browser's broken-image glyph in an editorial grid.
  const [deadImages, setDeadImages] = useState<string[]>([]);
  const projects = useMemo(() => Array.from(new Set(stories.flatMap((story) => story.relatedProjectSlugs))).sort(), [stories]);
  const visible = project === "all" ? stories : stories.filter((story) => story.relatedProjectSlugs.includes(project));
  return <section className={styles.stream} aria-labelledby="stories-stream-title">
    <div className={styles.streamHead}><div><p className={styles.eyebrow}>The living stream</p><h2 id="stories-stream-title">Follow what is moving.</h2></div><div className={styles.filters} aria-label="Filter stories by project"><button type="button" aria-pressed={project === "all"} onClick={() => setProject("all")}>All</button>{projects.map((slug) => <button type="button" key={slug} aria-pressed={project === slug} onClick={() => setProject(slug)}>{projectNames[slug] || slug.replaceAll("-", " ")}</button>)}</div></div>
    <div className={styles.grid}>{visible.map((story, index) => {
      const video = story.media?.videoPreviews?.[0];
      const image = story.featuredImageUrl && !deadImages.includes(story.featuredImageUrl) ? story.featuredImageUrl : null;
      const lead = index === 0 && project === "all";
      const markDead = () => { if (image) setDeadImages((current) => current.includes(image) ? current : [...current, image]); };
      const poster = video?.thumbnailUrl || (isEmpathyLedgerMedia(image) ? optimisedImageUrl(canonicalMediaSrc(image), 1200) : image) || undefined;
      return <article key={story.id} className={lead ? styles.lead : ""}><Link href={story.localPath}>
        <div className={styles.media}>{video?.url ? <video muted loop playsInline preload="metadata" poster={poster} onMouseEnter={(event) => { void event.currentTarget.play().catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) console.error("Story preview could not play", error); }); }} onMouseLeave={(event) => { event.currentTarget.pause(); event.currentTarget.currentTime = 0; }}><source src={video.url} /></video> : image ? <FallbackImage src={image} alt={story.featuredImageAlt || ""} fill sizes={lead ? LEAD_SIZES : CARD_SIZES} onGiveUp={markDead} /> : <span>Story<br />waiting for an image</span>}{video?.url ? <b>Film</b> : null}</div>
        <div className={styles.copy}><p>{story.relatedProjectSlugs.map((slug) => projectNames[slug] || slug.replaceAll("-", " ")).join(" · ") || "Across ACT"}</p><h3>{publicText(story.title)}</h3>{story.excerpt ? <span>{publicText(story.excerpt)}</span> : null}<footer><em>{publicText(story.authorName || "A Curious Tractor")}</em><b>Read →</b></footer></div>
      </Link></article>;
    })}</div>
  </section>;
}
