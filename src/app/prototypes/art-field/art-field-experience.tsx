"use client";

import Link from "next/link";
import { useState } from "react";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import styles from "./story.module.css";

const rooms = [
  {
    number: "01",
    name: "Feel",
    title: "The room closes around you.",
    body: "Detention becomes physical. Scale, sound, light and restricted movement make an abstract policy choice difficult to hold at a distance.",
    prompt: "What are we asking a young person to survive?",
  },
  {
    number: "02",
    name: "Imagine",
    title: "Another room is possible.",
    body: "The encounter turns toward therapeutic practice, relationship and possibility. The question changes from punishment to what helps a life reconnect.",
    prompt: "What would care build here instead?",
  },
  {
    number: "03",
    name: "Find",
    title: "The alternatives already exist.",
    body: "The final room belongs to the host place. Local organisations and community-led work become visible as the practical answer beyond the installation.",
    prompt: "Who is already doing the work nearby?",
  },
] as const;

const studioLine = [
  { title: "The Caravan", slug: "the-caravan", medium: "Installation + making", state: "Active" },
  { title: "Gold.Phone", slug: "gold-phone", medium: "Interactive + installation", state: "Active" },
  { title: "The Confessional", slug: "the-confessional", medium: "Installation + performance", state: "Active" },
  { title: "CONTAINED", slug: "contained", medium: "Installation", state: "Active + touring" },
  { title: "Redtape", slug: "redtape", medium: "Installation + sculpture", state: "Active, evidence sparse" },
  { title: "Uncle Allan", slug: "uncle-allan", medium: "Painting", state: "Active" },
  { title: "Treacher", slug: "treacher", medium: "Sound installation", state: "Ideation, not built" },
  { title: "Regional Arts Fellowship", slug: "regional-arts-fellowship", medium: "Fellowship + residency", state: "Active" },
  { title: "The Vagina", slug: "the-vagina", medium: "Installation", state: "Coming soon" },
] as const;

const connectedPractice = [
  { title: "PICC Photo Kiosk", slug: "picc-photo-kiosk", medium: "Photography + installation", state: "Active" },
  { title: "Confessions to Philanthropy", slug: "confessions-to-philanthropy", medium: "Interactive + performance", state: "Active" },
  { title: "Caring for Those Who Care", slug: "caring-for-those-who-care", medium: "Research + storytelling", state: "Active project" },
  { title: "Cars and Microcontrollers", slug: "cars-and-microcontrollers", medium: "Interactive + making", state: "Concept" },
  { title: "ANAT SPECTRA 2025", slug: "anat-spectra-2025", medium: "Gold.Phone collaboration", state: "Happened in 2025" },
] as const;

export function ArtFieldExperience() {
  const [room, setRoom] = useState<(typeof rooms)[number]>(rooms[0]);

  return (
    <main className={styles.story}>
      <header className={styles.header}><FieldBrand /><span>Art + CONTAINED</span></header>

      <section className={styles.hero}>
        <video autoPlay muted loop playsInline poster="/media/field-stills/contained-aerial.jpg"><source src="/media/field-videos/contained-aerial.mp4" type="video/mp4" /></video>
        <div className={styles.shade} />
        <div className={styles.heroCopy}><p>Art moves first</p><h1>Step inside what we are choosing to fund.</h1><a href="#threshold">Enter the work <span>↓</span></a></div>
        <div className={styles.measure}><span>3 rooms</span><span>30 minutes</span><span>1 encounter</span></div>
      </section>

      <section id="threshold" className={styles.threshold}>
        <p className={styles.kicker}>CONTAINED</p>
        <h2>Not a report about detention.<br />An encounter with the choice.</h2>
        <p>CONTAINED is an artwork that travels. It does not pretend to reproduce another person&apos;s experience. It changes the distance between a public system and the people asked to live inside it.</p>
      </section>

      <section className={styles.rooms} aria-labelledby="rooms-title">
        <div className={styles.roomsHead}><p className={styles.kicker}>Move through the work</p><h2 id="rooms-title">Three rooms.<br />One movement.</h2></div>
        <div className={styles.roomGrid}>
          <nav aria-label="Rooms inside CONTAINED">
            {rooms.map((item) => <button key={item.number} type="button" aria-pressed={room.number === item.number} onClick={() => setRoom(item)}><span>{item.number}</span><strong>{item.name}</strong></button>)}
          </nav>
          <article key={room.number} className={styles.roomReveal}>
            <span>{room.number}</span><div><p>{room.name}</p><h3>{room.title}</h3><p>{room.body}</p><blockquote>{room.prompt}</blockquote></div>
          </article>
        </div>
      </section>

      <section className={styles.turn}>
        <div className={styles.bars} aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <i key={index} />)}</div>
        <article><p className={styles.kicker}>The turn</p><h2>The artwork is the doorway. Community is the answer.</h2><p>Room three changes in every host place. The work turns attention toward local organisations already keeping young people connected to culture, family and possibility.</p></article>
      </section>

      <section className={styles.atlas}>
        <div className={styles.atlasIntro}><p className={styles.kicker}>The Studio line</p><h2>Nine works carry the argument.</h2><p>These are the canonical Studio works. Active pieces sit beside ideas and works still finding form, with that difference left visible.</p></div>
        <div className={styles.workList}>
          {studioLine.map((work, index) => (
            <Link key={work.slug} href={`/art/${work.slug}`}>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{work.title}</strong><em>{work.medium}</em><i>{work.state} ↗</i>
            </Link>
          ))}
        </div>
        <div className={styles.connectedHead}><p className={styles.kicker}>Connected practice</p><h3>Artistic projects, experiments and collaborations around the Studio line.</h3></div>
        <div className={styles.workList}>
          {connectedPractice.map((work, index) => (
            <Link key={work.slug} href={`/art/${work.slug}`}>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{work.title}</strong><em>{work.medium}</em><i>{work.state} ↗</i>
            </Link>
          ))}
        </div>
        <Link className={styles.allArt} href="/art">Enter the complete Art catalogue <span>→</span></Link>
      </section>

      <section className={styles.continues}>
        <p className={styles.kicker}>The work continues through JusticeHub</p>
        <h2>Feel it here.<br />Find the alternatives there.</h2>
        <div><a href="https://www.justicehub.com.au/contained" target="_blank" rel="noreferrer"><span>Experience</span><strong>Enter CONTAINED</strong><i>↗</i></a><a href="https://www.justicehub.com.au/communities/justice-reinvestment" target="_blank" rel="noreferrer"><span>Place</span><strong>Find community-led alternatives</strong><i>↗</i></a></div>
      </section>

      <footer className={styles.footer}><Link href="/prototypes/living-field">Return to all fields <span>←</span></Link><Link href="/prototypes/story-remains">Next: Empathy Ledger <span>→</span></Link></footer>
    </main>
  );
}
