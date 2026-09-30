"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FilterPills, type Pill } from "@/components/pieces/FilterPills";
import { Wheel, rolls } from "@/components/pieces/Onward";
import { Photo } from "@/components/pieces/Photo";
import { PieceLink } from "@/components/pieces/PieceLink";
import { StoryCard } from "@/components/pieces/StoryCard";
import type { StreamRow } from "./stories-model";
import styles from "./stories.module.css";

/** On a phone the stream shows the lead and three more, then a button for the rest (Pencil: Phone · 09 Stories). */
const SHOWN_ON_PHONE = 3;

type Photographed = StreamRow & { photo: NonNullable<StreamRow["photo"]> };

/** The first story in the list, large: photograph left, words right (Pencil: Lead card m7lLj). */
function Lead({ row }: { row: Photographed }) {
  const titleId = useId();
  return (
    <PieceLink href={row.href} className={`${styles.lead} ${rolls}`} aria-labelledby={titleId}>
      <Photo src={row.photo.src} alt={row.photo.alt} priority className={styles.leadImage} />
      <div className={styles.leadText}>
        <p className={styles.leadLabel}>{row.label}</p>
        <h3 id={titleId} className={styles.leadTitle}>
          {row.title}
        </h3>
        {row.excerptLong && <p className={styles.leadExcerpt}>{row.excerptLong}</p>}
        <div className={styles.leadFoot}>
          <span className={styles.leadAuthor}>{row.author}</span>
          <span className={styles.leadRead}>
            Read
            <Wheel />
          </span>
        </div>
      </div>
    </PieceLink>
  );
}

/**
 * The living stream (Pencil: Stream ECwwj). Filter pills by field, the lead card, then the rest as cards. Every story
 * is one the Empathy Ledger feed returned; the page filters what it was given and adds nothing. A photograph that will
 * not load gives its card the tile a story with no photograph gets, as this stream has always done.
 */
export function StoriesStream({ rows, pills }: { rows: StreamRow[]; pills: Pill[] }) {
  const [value, setValue] = useState("all");
  const [open, setOpen] = useState(false);
  const [dead, setDead] = useState<string[]>([]);
  const cards = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cards.current;
    if (!node) return;
    const mark = (image: HTMLImageElement) => {
      const slug = image.closest("[data-slug]")?.getAttribute("data-slug");
      if (slug) setDead((current) => (current.includes(slug) ? current : [...current, slug]));
    };
    for (const image of node.querySelectorAll("img")) {
      if (image.complete && image.naturalWidth === 0) mark(image);
    }
    // An image that fails does not bubble an error, so listen on the way down.
    const onError = (event: Event) => {
      if (event.target instanceof HTMLImageElement) mark(event.target);
    };
    node.addEventListener("error", onError, true);
    return () => node.removeEventListener("error", onError, true);
  }, []);

  const shown = value === "all" ? rows : rows.filter((row) => row.groups.includes(value as StreamRow["groups"][number]));
  const photographed = (row: StreamRow): row is Photographed => Boolean(row.photo) && !dead.includes(row.slug);
  const lead = shown.find(photographed);
  const rest = shown.filter((row) => row !== lead);
  const hidden = Math.max(0, rest.length - SHOWN_ON_PHONE);

  return (
    <section id="browse" className={styles.stream} aria-labelledby="stream-title">
      <div className={styles.head}>
        <div className={styles.headWords}>
          <p className={styles.eyebrow}>The living stream</p>
          <h2 id="stream-title" className={styles.heading}>
            Follow what is moving.
          </h2>
        </div>
        <div className={styles.pillsWrap}>
          <FilterPills
            label="Filter stories by field"
            pills={pills}
            value={value}
            onChange={(next) => {
              setValue(next);
              setOpen(false);
            }}
          />
        </div>
      </div>

      <div ref={cards} className={styles.cards} data-open={open ? "" : undefined}>
        {lead && (
          <div data-slug={lead.slug} className={styles.leadWrap}>
            <Lead row={lead} />
          </div>
        )}
        <ul className={styles.grid}>
          {rest.map((row, index) => (
            <li key={row.slug} data-slug={row.slug} className={index >= SHOWN_ON_PHONE ? styles.beyond : undefined}>
              <StoryCard
                href={row.href}
                title={row.title}
                project={row.label}
                excerpt={row.excerpt ?? undefined}
                author={row.author}
                photo={photographed(row) ? row.photo : undefined}
                tileWords={row.tileWords ?? undefined}
              />
            </li>
          ))}
        </ul>
        {hidden > 0 && !open && (
          <button type="button" className={`${styles.more} ${rolls}`} onClick={() => setOpen(true)}>
            Show {hidden} more {hidden === 1 ? "story" : "stories"}
            <Wheel />
          </button>
        )}
      </div>
    </section>
  );
}
