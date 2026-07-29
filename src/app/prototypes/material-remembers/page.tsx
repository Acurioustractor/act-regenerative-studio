import type { Metadata } from "next";
import Link from "next/link";
import styles from "./story.module.css";
import { FieldBrand } from "@/components/prototypes/FieldBrand";

export const metadata: Metadata = {
  title: "Material remembers | A Curious Tractor",
  description: "A story moving through Goods on Country, The Harvest and Black Cockatoo Valley.",
  robots: { index: false, follow: false },
};

const chapters = [
  {
    number: "01",
    project: "Goods on Country",
    invitation: "Follow the object",
    title: "A lid does not stop being material when we call it waste.",
    body: "It can be gathered, sorted, remade and carried back as something useful. The bed matters. So do the hands that can make it, repair it and decide what comes next.",
    note: "Plastic becomes an object. An object becomes local capability.",
    video: "/media/field-videos/goods-community-build.mp4",
    poster: "/media/field-stills/goods-community-build.jpg",
    href: "https://www.goodsoncountry.com",
    link: "Follow the material into Goods on Country",
    tone: "clay",
  },
  {
    number: "02",
    project: "The Harvest",
    invitation: "Come under the roof",
    title: "A place can begin before the building is finished.",
    body: "Milk crates become a pavilion. Cedar carries the history of a range. A garden is tended before every plan is settled. Making together is not decoration around the work. It is how the place learns who it is for.",
    note: "Inherited material becomes shelter. Shelter becomes invitation.",
    video: "/media/field-videos/harvest-witta-aerial.mp4",
    poster: "/media/field-stills/harvest-witta-aerial-3.jpg",
    href: "https://theharvestwitta.com.au",
    link: "Come to The Harvest",
    tone: "gold",
  },
  {
    number: "03",
    project: "Black Cockatoo Valley",
    invitation: "Let Country set the pace",
    title: "The land is not an empty surface waiting for an idea.",
    body: "Across approximately 138 acres on Jinibara Country, forest, creek, habitat and weather place limits around the work. Those limits are not obstacles to imagination. They are part of its intelligence.",
    note: "Place becomes a boundary. A boundary becomes care.",
    video: "/media/field-videos/black-cockatoo-valley-farm-aerial.mp4",
    poster: "/media/field-stills/black-cockatoo-valley-farm-aerial-2.jpg",
    href: "/farm",
    link: "Walk into Black Cockatoo Valley",
    tone: "green",
  },
] as const;

export default function MaterialRemembersPage() {
  return (
    <main className={styles.story}>
      <header className={styles.header}>
        <FieldBrand />
        <span>A field story · 01</span>
      </header>

      <section className={styles.opening}>
        <p className={styles.eyebrow}>An object · a shelter · a valley</p>
        <h1>Material<br />remembers.</h1>
        <p className={styles.lede}>What happens when material, place and people are allowed to shape the work?</p>
        <a href="#chapter-1" className={styles.begin}>Follow the thread <span>↓</span></a>
        <div className={styles.thread} aria-hidden="true"><i /><i /><i /></div>
      </section>

      {chapters.map((chapter, index) => (
        <section
          id={`chapter-${index + 1}`}
          key={chapter.project}
          className={`${styles.chapter} ${styles[chapter.tone]}`}
        >
          <div className={styles.media}>
            <video autoPlay muted loop playsInline poster={chapter.poster}>
              <source src={chapter.video} type="video/mp4" />
            </video>
            <span>{chapter.number}</span>
          </div>
          <article>
            <p className={styles.eyebrow}>{chapter.invitation}</p>
            <p className={styles.project}>{chapter.project}</p>
            <h2>{chapter.title}</h2>
            <p className={styles.body}>{chapter.body}</p>
            <blockquote>{chapter.note}</blockquote>
            <a href={chapter.href} target={chapter.href.startsWith("http") ? "_blank" : undefined} rel={chapter.href.startsWith("http") ? "noreferrer" : undefined}>
              {chapter.link} <span>↗</span>
            </a>
          </article>
        </section>
      ))}

      <section className={styles.close}>
        <p className={styles.eyebrow}>The field between them</p>
        <h2>Nothing here begins from nothing.</h2>
        <p>Every object has a before. Every place holds a memory. Every useful thing asks who can carry it after us.</p>
        <nav aria-label="Continue exploring">
          <Link href="/prototypes/field-history">Read the long ACT history <span>→</span></Link>
          <Link href="/prototypes/living-field">Return to the living field <span>↑</span></Link>
        </nav>
      </section>
    </main>
  );
}
