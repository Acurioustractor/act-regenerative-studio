"use client";

import Link from "next/link";
import { useState } from "react";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import styles from "./story.module.css";

const harvestImage = (name: string) =>
  `https://www.theharvestwitta.com.au/images/overrides/${name}`;

const works = [
  {
    id: "garden",
    state: "Growing",
    title: "The Garden",
    line: "A working garden, already planted and cared for each week.",
    image: harvestImage("works-the-garden-feature-1.jpg"),
    href: "https://www.theharvestwitta.com.au/works/the-garden",
  },
  {
    id: "pavilion",
    state: "Building",
    title: "Milk Create Pavilion",
    line: "Dairy crates becoming a modular room for art, food and gathering.",
    image: harvestImage("works-milk-crate-pavilion-gallery-1.jpg"),
    href: "https://www.theharvestwitta.com.au/works/milk-crate-pavilion",
  },
  {
    id: "paths",
    state: "Building + making",
    title: "The Garden Paths",
    line: "Reclaimed timber laid down as a path through the place.",
    image: harvestImage("new-look-test-timber-walkways-card.jpg"),
    href: "https://www.theharvestwitta.com.au/works/the-garden-paths",
  },
  {
    id: "milk-man",
    state: "Standing now",
    title: "The Milk Man",
    line: "A milk-crate sentinel at the gate. Part sign, part sculpture.",
    image: harvestImage("works-the-milk-man-hero.jpg"),
    href: "https://www.theharvestwitta.com.au/works/the-milk-man",
  },
  {
    id: "shop",
    state: "Taking shape",
    title: "The Shop",
    line: "The first shared shelf is being imagined, not declared finished.",
    image: harvestImage("works-the-shop-card.jpg"),
    href: "https://www.theharvestwitta.com.au/works/the-shop",
  },
  {
    id: "kids",
    state: "Listening first",
    title: "Kids' Area",
    line: "A future space intended to be shaped with local kids.",
    image: harvestImage("works-kids-area-card.png"),
    href: "https://www.theharvestwitta.com.au/works/kids-area",
  },
] as const;

export function HarvestFieldExperience() {
  const [active, setActive] = useState<(typeof works)[number]>(works[0]);

  return (
    <main className={styles.story}>
      <header className={styles.header}>
        <FieldBrand />
        <span>The Harvest · Witta, Jinibara Country</span>
      </header>

      <section className={styles.hero}>
        <img src={harvestImage("works-the-milk-man-feature-2.jpg")} alt="The Milk Man sculpture glowing at the entrance to The Harvest" />
        <div className={styles.heroShade} />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>The gate is open</p>
          <h1>The rhythm is not settled.</h1>
          <p>You do not arrive at something finished. You arrive at something you can help make.</p>
          <a href="#field">Walk through the gate <span>↓</span></a>
        </div>
      </section>

      <section className={styles.manifesto}>
        <p>Grow.</p><p>Make.</p><p>Gather.</p>
        <span>Leave it changed.</span>
      </section>

      <section id="field" className={styles.field} aria-labelledby="field-title">
        <div className={styles.fieldIntro}>
          <div><p className={styles.eyebrow}>A living collection</p><h2 id="field-title">Nothing here shares the same tense.</h2></div>
          <p>Some things are standing. Some are growing. Some are being built. Others need more listening. Move through the works as they really are now.</p>
        </div>

        <div className={styles.workField}>
          <nav className={styles.workNav} aria-label="Works at The Harvest">
            {works.map((work, index) => (
              <button key={work.id} type="button" aria-pressed={active.id === work.id} onClick={() => setActive(work)}>
                <span>0{index + 1}</span><strong>{work.title}</strong><em>{work.state}</em>
              </button>
            ))}
          </nav>
          <article key={active.id} className={styles.workReveal}>
            <img src={active.image} alt="" />
            <div><p>{active.state}</p><h3>{active.title}</h3><span>{active.line}</span><a href={active.href} target="_blank" rel="noreferrer">Enter this work ↗</a></div>
          </article>
        </div>
      </section>

      <section className={styles.cycle}>
        <p className={styles.eyebrow}>The place is the invitation</p>
        <ol><li>Gate</li><li>Grow</li><li>Make</li><li>Gather</li><li>Leave a mark</li><li>Return</li></ol>
      </section>

      <section className={styles.doorways}>
        <div><p className={styles.eyebrow}>Come this way</p><h2>Choose a real door.</h2></div>
        <div className={styles.doorLinks}>
          <a href="https://www.theharvestwitta.com.au/whats-on" target="_blank" rel="noreferrer"><span>Visit</span><strong>See what is happening now</strong><i>↗</i></a>
          <a href="https://www.theharvestwitta.com.au/works" target="_blank" rel="noreferrer"><span>Follow</span><strong>Watch the works change</strong><i>↗</i></a>
          <a href="https://www.theharvestwitta.com.au/get-involved" target="_blank" rel="noreferrer"><span>Help</span><strong>Bring hands, skills or an idea</strong><i>↗</i></a>
          <a href="https://www.theharvestwitta.com.au/membership" target="_blank" rel="noreferrer"><span>Return</span><strong>Join the free member list</strong><i>↗</i></a>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/prototypes/goods-field">Previous story <span>←</span></Link>
        <a href="https://www.theharvestwitta.com.au" target="_blank" rel="noreferrer">Enter The Harvest <span>↗</span></a>
      </footer>
    </main>
  );
}
