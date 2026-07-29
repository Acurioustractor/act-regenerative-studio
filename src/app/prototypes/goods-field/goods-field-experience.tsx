"use client";

import Link from "next/link";
import { useState } from "react";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import styles from "./story.module.css";

const journey = [
  ["01", "Material", "Recovered plastic becomes a durable component with a traceable material story."],
  ["02", "Make", "The design is tested against heat, distance, repair and real use."],
  ["03", "Install", "Field teams can capture place, status and setup even when the network disappears."],
  ["04", "Return", "A scan opens naming, support, feedback, photographs, voice and a private story pathway."],
  ["05", "Learn", "Signals become community-level demand, evidence and the next design decision."],
] as const;

const truckQuestions = [
  { id: "product", label: "The product stays", detail: "The useful object remains in the community." },
  { id: "wages", label: "The wages stay", detail: "Making creates local paid work rather than delivery alone." },
  { id: "tools", label: "The tools stay", detail: "Production capability can continue after the truck leaves." },
  { id: "knowledge", label: "The knowledge stays", detail: "Repair, adaptation and product learning remain available." },
  { id: "decisions", label: "The decisions stay", detail: "Ownership includes contracts, margin, title and authority." },
] as const;

export function GoodsFieldExperience() {
  const [held, setHeld] = useState<string[]>(["product"]);
  const transferComplete = held.length === truckQuestions.length;

  return (
    <main className={styles.story}>
      <header className={styles.header}><FieldBrand /><span>A field story · 04</span></header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Goods on Country</p>
        <h1>Every object keeps a relationship alive.</h1>
        <p>Goods turns community knowledge into health hardware, local work and production that communities can own.</p>
        <a href="#journey">Follow one object <span>↓</span></a>
        <div className={styles.material} aria-hidden="true"><i /><i /><i /><i /></div>
      </section>

      <section id="journey" className={styles.journey} aria-labelledby="journey-title">
        <p className={styles.eyebrow}>The living object</p>
        <h2 id="journey-title">Delivery is the middle, not the end.</h2>
        <ol>{journey.map(([number, title, body]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{body}</p></li>)}</ol>
        <div className={styles.journeyFilm}>
          <video autoPlay muted loop playsInline poster="/media/field-stills/goods-community-build.jpg"><source src="/media/field-videos/goods-community-build.mp4" type="video/mp4" /></video>
          <p>Material moves. Support stays.</p>
        </div>
      </section>

      <section className={styles.voices} aria-labelledby="voices-title">
        <div className={styles.voicesIntro}>
          <p className={styles.eyebrow}>Beside the bed</p>
          <h2 id="voices-title">The people doing the work enter the frame.</h2>
          <p>The object has arrived. Karen speaks beside it. Mykel puts it together. Ownership begins with whose hands hold the tools.</p>
        </div>
        <article>
          <video controls playsInline preload="metadata" poster="/media/field-stills/goods-karen-liddle-on-beds.jpg">
            <source src="/media/field-videos/goods-karen-liddle-on-beds.mp4" type="video/mp4" />
          </video>
          <div><span>01 · Listen</span><h3>Karen Liddle on beds</h3><p>A partner voice beside the work.</p></div>
        </article>
        <article>
          <video controls playsInline preload="metadata" poster="/media/field-stills/goods-mykel-building-the-bed.jpg">
            <source src="/media/field-videos/goods-mykel-building-the-bed.mp4" type="video/mp4" />
          </video>
          <div><span>02 · Make</span><h3>Mykel builds the bed</h3><p>The knowledge sits in the hands doing the work.</p></div>
        </article>
        <small>Published with permission confirmed for ACT website reuse on 21 July 2026.</small>
      </section>

      <section className={styles.truck} aria-labelledby="truck-title">
        <div className={styles.truckCopy}>
          <p className={styles.eyebrow}>The truck test</p>
          <h2 id="truck-title">What remains after the truck leaves?</h2>
          <p>The product is proven. The transfer is not. Select what must stay for ownership to become more than a promise.</p>
        </div>
        <div className={`${styles.truckBed} ${transferComplete ? styles.complete : ""}`} aria-live="polite">
          <div className={styles.truckShape} aria-hidden="true"><i /><i /></div>
          {truckQuestions.map((question) => {
            const selected = held.includes(question.id);
            return <button key={question.id} type="button" aria-pressed={selected} onClick={() => setHeld((current) => selected ? current.filter((id) => id !== question.id) : [...current, question.id])}>
              <i aria-hidden="true" /><strong>{question.label}</strong><span>{question.detail}</span>
            </button>;
          })}
          <p className={styles.truckResult}>{transferComplete ? "The making can stay." : `${held.length} of 5 conditions remain.`}</p>
        </div>
      </section>

      <section className={styles.proof}>
        <p className={styles.eyebrow}>What exists now</p>
        <h2>An object can already carry its history home.</h2>
        <div>
          <p><strong>540</strong><span>beds in the current committed asset canon</span></p>
          <p><strong>20</strong><span>washing machines recorded in community</span></p>
          <p><strong>11</strong><span>communities in the canonical public record</span></p>
        </div>
        <small>Counts are current committed code figures. Material diversion is modelled from product specifications, not weighbridge verification.</small>
      </section>

      <section className={styles.handoff}>
        <p className={styles.eyebrow}>Designed in community</p>
        <h2>Listen. Make. Deliver. Return. Transfer.</h2>
        <p>Goods on Country holds the full product, process, community and support journey. The ACT story opens the question, then gets out of the way.</p>
        <a href="https://www.goodsoncountry.com/the-work" target="_blank" rel="noreferrer">Enter the work <span>↗</span></a>
      </section>

      <footer className={styles.footer}><Link href="/prototypes/justice-field">Previous story <span>←</span></Link><Link href="/prototypes/living-field/harvest">Follow making to The Harvest <span>→</span></Link></footer>
    </main>
  );
}
