"use client";

import Link from "next/link";
import { useState } from "react";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import styles from "./story.module.css";

const permissions = [
  { id: "source", label: "Source", note: "Who spoke, where it came from and what was actually said remain connected." },
  { id: "boundary", label: "Boundary", note: "Permission sets the banks. Private, family, community or public are real choices." },
  { id: "review", label: "Review", note: "Meaning is not assumed. Storytellers and cultural authorities can correct the record." },
  { id: "use", label: "Use", note: "One named purpose, audience and destination at a time." },
  { id: "return", label: "Return", note: "Responsibility, benefit and a way to change or withdraw remain visible." },
] as const;

const views = [
  { id: "storyteller", label: "Storyteller", text: "My source, my choices, who can see it, every named use and the way back." },
  { id: "authority", label: "Community authority", text: "What our community can hold, review, restrict, release and withdraw together." },
  { id: "steward", label: "Platform steward", text: "What must be protected, traced, corrected and kept operational over time." },
  { id: "audience", label: "Approved audience", text: "Only the view permitted for this purpose, with provenance and limits still visible." },
] as const;

export function StoryRemainsExperience() {
  const [active, setActive] = useState<string[]>([]);
  const [view, setView] = useState<(typeof views)[number]>(views[0]);
  const complete = active.length === permissions.length;

  function toggle(id: string) {
    setActive((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <main className={styles.story}>
      <header className={styles.header}>
        <FieldBrand />
        <span>A field story · 02</span>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Stories remain with their owners</p>
        <h1>A story is<br />a relationship.</h1>
        <p className={styles.lede}>Not content left behind after the camera leaves. A relationship with source, permission, decisions and return intact.</p>
        <a href="#permission" className={styles.begin}>See what travels with it <span>↓</span></a>
        <div className={styles.voiceField} aria-hidden="true">
          {Array.from({ length: 11 }, (_, index) => <i key={index} />)}
          <strong>voice</strong>
        </div>
      </section>

      <section id="permission" className={styles.permission} aria-labelledby="permission-title">
        <div className={styles.permissionCopy}>
          <p className={styles.eyebrow}>Try the relationship</p>
          <h2 id="permission-title">Follow the river.</h2>
          <p>Select each part of the relationship. Public is a release, never the default.</p>
        </div>

        <div className={`${styles.orbit} ${complete ? styles.complete : ""}`} aria-live="polite">
          <div className={styles.storySeed}>
            <span>{complete ? "ready for one named use" : `${active.length} of 5 held`}</span>
          </div>
          {permissions.map((permission, index) => {
            const selected = active.includes(permission.id);
            return (
              <button
                key={permission.id}
                type="button"
                className={styles[`condition${index + 1}`]}
                aria-pressed={selected}
                onClick={() => toggle(permission.id)}
              >
                <i aria-hidden="true" />
                <strong>{permission.label}</strong>
                <span>{permission.note}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.answer}>
        <p className={styles.eyebrow}>{complete ? "The relationship can move" : "The file can move. The relationship cannot."}</p>
        <h2>{complete ? "The evidence for trust travels too." : "A public link is not permission."}</h2>
        <p>{complete
          ? "Source, boundary, review, use and return remain visible. The storyteller has not disappeared from the decision."
          : "A photograph can sit in a public folder while its intended use, cultural authority and right of return remain unresolved."}</p>
        {!complete ? <button type="button" onClick={() => setActive(permissions.map((item) => item.id))}>Hold the whole relationship</button> : null}
      </section>

      <section className={styles.model} aria-labelledby="model-title">
        <div className={styles.modelIntro}>
          <p className={styles.eyebrow}>One institution · three connected capacities</p>
          <h2 id="model-title">What Empathy Ledger actually holds.</h2>
        </div>
        <div className={styles.modelParts}>
          <article><span>01</span><h3>The Ledger</h3><p>Stories, media, sources, permissions, decisions and provenance remain connected as a durable record.</p></article>
          <article><span>02</span><h3>Evidence engine</h3><p>Approved stories and observations can become traceable themes, outcomes, reports and claims without losing their source.</p></article>
          <article><span>03</span><h3>Reciprocity</h3><p>Uses, benefits, obligations and return are recorded so value does not disappear when a story travels.</p></article>
        </div>

        <div className={styles.boundedViews}>
          <div>
            <p className={styles.eyebrow}>The same record · bounded views</p>
            <h3>Not everyone should see the same thing.</h3>
            <p>Choose a position around the story.</p>
          </div>
          <div className={styles.viewControl}>
            <div role="tablist" aria-label="Views around a governed story">
              {views.map((item) => <button key={item.id} type="button" role="tab" aria-selected={view.id === item.id} onClick={() => setView(item)}>{item.label}</button>)}
            </div>
            <blockquote key={view.id}>{view.text}</blockquote>
          </div>
        </div>
      </section>

      <section className={styles.proof} aria-labelledby="proof-title">
        <div>
          <p className={styles.eyebrow}>Already living in the platform</p>
          <h2 id="proof-title">This is not only a promise.</h2>
          <p>A story can move from its held source into private review, public release and an approved destination without losing the record of who decided.</p>
        </div>
        <ol>
          <li><span>01</span><strong>Write from the source</strong><p>Transcript, story, media and provenance remain connected in one workspace.</p></li>
          <li><span>02</span><strong>Review before release</strong><p>Storytellers can approve, exclude or request changes to individual words and media.</p></li>
          <li><span>03</span><strong>See the audience</strong><p>The storyteller home places the current story beside who can see it.</p></li>
          <li><span>04</span><strong>Name every use</strong><p>Purpose, audience, destination and return agreement stay visible.</p></li>
          <li><span>05</span><strong>Change the decision</strong><p>Visibility, correction, withdrawal and syndication remain revocable.</p></li>
        </ol>
      </section>

      <section className={styles.handoff}>
        <p className={styles.eyebrow}>Community knowledge infrastructure</p>
        <h2>Empathy Ledger keeps the relationship beside the story.</h2>
        <p>ACT holds the connecting story. Empathy Ledger lets storytellers, communities and organisations steward knowledge, build trustworthy evidence and keep reciprocity visible over time.</p>
        <a href="https://www.empathyledger.com" target="_blank" rel="noreferrer">Enter Empathy Ledger <span>↗</span></a>
      </section>

      <footer className={styles.footer}>
        <Link href="/prototypes/material-remembers">Previous story <span>←</span></Link>
        <Link href="/prototypes/living-field/justice">Follow story into justice <span>→</span></Link>
      </footer>
    </main>
  );
}
