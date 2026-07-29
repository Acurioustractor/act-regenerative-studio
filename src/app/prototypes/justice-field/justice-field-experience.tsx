"use client";

import Link from "next/link";
import { useState } from "react";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import styles from "./story.module.css";

const rooms = [
  {
    id: "feel",
    number: "01",
    eyebrow: "CONTAINED",
    verb: "Feel",
    title: "Detention becomes physical.",
    body: "Three rooms turn policy into an encounter. The first makes confinement felt. The second holds therapeutic practice and possibility. The third gives the room to local organisations already doing the work.",
    proof: "Built, installed and tested on Kaurna Yarta in Adelaide. The art is the doorway. Local organisations are the answer behind it.",
    href: "https://www.justicehub.com.au/contained/adelaide-proof",
    link: "Walk through CONTAINED",
    image: "/media/field-stills/contained-aerial.jpg",
  },
  {
    id: "place",
    number: "02",
    eyebrow: "Justice Reinvestment",
    verb: "Place",
    title: "Change is named locally.",
    body: "A national public record now connects 42 places with sourced history, organisations, programs and outcomes. Community authority remains separate from public-source evidence. Local owners decide what becomes a community-published edition.",
    proof: "Map, directory, site dossiers, private workspaces, local outcomes, three evidence lanes, review, publication and withdrawal already exist in one governed system.",
    href: "https://www.justicehub.com.au/communities/justice-reinvestment",
    link: "Enter the justice reinvestment map",
    image: "/media/field-stills/justicehub-community-2.jpg",
  },
  {
    id: "evidence",
    number: "03",
    eyebrow: "Justice Matrix",
    verb: "Connect",
    title: "Evidence becomes strategy.",
    body: "One question can move across reviewed cases, movement campaigns and governed evidence. Machines help find and draft. Humans verify. Gaps remain visible instead of being filled with false certainty.",
    proof: "Hybrid search, cited answers, trust states, faithfulness checks, issue timelines and case-to-campaign relationships are working parts of the current system.",
    href: "https://www.justicehub.com.au/justice-matrix",
    link: "Ask the Justice Matrix",
    image: "/media/field-stills/justicehub-container.jpg",
  },
] as const;

export function JusticeFieldExperience() {
  const [active, setActive] = useState<(typeof rooms)[number]>(rooms[0]);

  return (
    <main className={styles.story}>
      <header className={styles.header}>
        <FieldBrand />
        <span>A field story · 03</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Justice does not move in one direction</p>
        <h1>Feel it.<br />Place it.<br />Connect it.</h1>
        <p>Art makes the system impossible to ignore. Community authority shows what change looks like here. Evidence helps strategy travel without flattening place.</p>
        <a href="#three-rooms">Enter the three rooms <span>↓</span></a>
        <div className={styles.signal} aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section id="three-rooms" className={styles.rooms} aria-labelledby="rooms-title">
        <div className={styles.roomIntro}>
          <p className={styles.eyebrow}>Three forms of infrastructure</p>
          <h2 id="rooms-title">Choose where to enter.</h2>
        </div>
        <div className={styles.roomTabs} role="tablist" aria-label="JusticeHub systems">
          {rooms.map((room) => (
            <button key={room.id} type="button" role="tab" aria-selected={active.id === room.id} onClick={() => setActive(room)}>
              <span>{room.number}</span><strong>{room.verb}</strong><small>{room.eyebrow}</small>
            </button>
          ))}
        </div>

        <article key={active.id} className={styles.room} role="tabpanel">
          <div className={styles.roomMedia} style={{ backgroundImage: `url(${active.image})` }}>
            <span>{active.number}</span>
          </div>
          <div className={styles.roomCopy}>
            <p className={styles.eyebrow}>{active.eyebrow}</p>
            <h3>{active.title}</h3>
            <p>{active.body}</p>
            <blockquote>{active.proof}</blockquote>
            <a href={active.href} target="_blank" rel="noreferrer">{active.link} <span>↗</span></a>
          </div>
        </article>
      </section>

      <section className={styles.thread}>
        <p className={styles.eyebrow}>The thread between them</p>
        <h2>Encounter is not enough. Evidence is not enough. A map is not authority.</h2>
        <div>
          <p>CONTAINED opens attention.</p>
          <i aria-hidden="true" />
          <p>Justice Reinvestment returns the question to place.</p>
          <i aria-hidden="true" />
          <p>The Justice Matrix connects law, campaigns and evidence to action.</p>
        </div>
      </section>

      <section className={styles.handoff}>
        <p className={styles.eyebrow}>The work continues elsewhere</p>
        <h2>JusticeHub is becoming public memory for justice change.</h2>
        <p>Not one answer. A governed way to find what communities are building, what law has moved, what campaigns made possible and what remains unknown.</p>
        <a href="https://www.justicehub.com.au" target="_blank" rel="noreferrer">Enter JusticeHub <span>↗</span></a>
      </section>

      <footer className={styles.footer}>
        <Link href="/prototypes/story-remains">Previous story <span>←</span></Link>
        <Link href="/prototypes/living-field/goods">Follow justice into making <span>→</span></Link>
      </footer>
    </main>
  );
}
