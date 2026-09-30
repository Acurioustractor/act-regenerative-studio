"use client";

import { useState } from "react";
import { FilterPills } from "@/components/pieces/FilterPills";
import { Photo } from "@/components/pieces/Photo";
import { StoryCard } from "@/components/pieces/StoryCard";
import styles from "./stories.module.css";

type Card = {
  project: string;
  title: string;
  excerpt: string;
  author: string;
  photo?: { src: string; alt: string };
  tileWords?: string;
};

const PILLS = [
  { value: "all", label: "All" },
  { value: "JusticeHub", label: "JusticeHub" },
  { value: "Goods", label: "Goods" },
  { value: "Empathy Ledger", label: "Empathy Ledger" },
  { value: "The Harvest", label: "The Harvest" },
  { value: "Land", label: "Land" },
];

/** The stream of a stories page: the pills choose, the cards are filtered by their project. Words are stand-ins. */
export function StreamDemo({ cards }: { cards: Card[] }) {
  const [project, setProject] = useState("all");
  const shown = cards.filter((card) => project === "all" || card.project === project);

  return (
    <section className={styles.stream}>
      <div className={styles.streamHead}>
        <div className={styles.streamWords}>
          <p className={styles.streamKicker}>The living stream</p>
          <h2 className={styles.streamTitle}>Follow what is moving.</h2>
        </div>
        <FilterPills label="Filter stories by project" pills={PILLS} value={project} onChange={setProject} />
      </div>
      <div className={styles.grid}>
        {shown.map((card, i) => (
          <StoryCard key={i} href="/prototypes/pieces/stories" {...card} />
        ))}
      </div>
    </section>
  );
}

/** A photograph arriving again: the big wheel turns until it does. Slow the network in DevTools to watch it. */
export function LoadAgain({ src, alt }: { src: string; alt: string }) {
  const [round, setRound] = useState(0);
  return (
    <div className={styles.loadAgain}>
      <Photo key={round} src={`${src}?again=${round}`} alt={alt} className={styles.loadAgainPhoto} />
      <button type="button" className={styles.button} onClick={() => setRound((n) => n + 1)}>
        Load again
      </button>
    </div>
  );
}
