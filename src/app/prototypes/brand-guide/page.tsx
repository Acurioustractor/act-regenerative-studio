import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import styles from "./brand-guide.module.css";

export const metadata: Metadata = {
  title: "ACT brand guide | Internal review",
  description: "The working identity, logo system and page review rules for A Curious Tractor.",
  robots: { index: false, follow: false },
};

const logos = [
  { name: "Primary mark", file: "act-mark-primary.png", note: "Exact act.place source. Use first.", tone: "paper" },
  { name: "Clay mark", file: "act-mark-clay.png", note: "One-colour use on warm white or pale photography.", tone: "paper" },
  { name: "Forest mark", file: "act-mark-forest.png", note: "One-colour use when green carries the page.", tone: "paper" },
  { name: "Ink mark", file: "act-mark-ink.png", note: "Monochrome documents and restrained applications.", tone: "paper" },
  { name: "White mark", file: "act-mark-white.png", note: "Dark fields and moving image.", tone: "dark" },
  { name: "Warm-white plate", file: "act-mark-warm-white-plate.png", note: "Use where transparency is unavailable.", tone: "clay" },
] as const;

const colours = [
  ["Warm white", "#FAFAF7", "Paper and breathing room"],
  ["Forest", "#2D5A3D", "Primary field accent"],
  ["Clay", "#C4845C", "Mark, annotation and heat"],
  ["Gold", "#B8943F", "Small moments of signal"],
  ["Ink", "#1A1F1A", "Type and dark rooms"],
] as const;

export default function BrandGuidePage() {
  return (
    <main className={styles.guide}>
      <header className={styles.nav}>
        <FieldBrand />
        <nav aria-label="Brand guide navigation">
          <a href="#logo">Logo</a>
          <a href="#system">System</a>
          <a href="#voice">Voice</a>
          <a href="#review">Review</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Internal working guide · 22 July 2026</p>
          <h1>One mark.<br />A living field.</h1>
          <p>The tractor is a tool. The identity should work the same way: recognisable, useful and ready to hand power on.</p>
          <div className={styles.heroLinks}>
            <a href="/branding/act/act-logo-pack.zip" download>Download the logo pack ↓</a>
            <Link href="/prototypes/living-field">Review the Living Field →</Link>
          </div>
        </div>
        <div className={styles.masterMark}>
          <Image src="/branding/act/act-mark-primary.png" alt="The official A Curious Tractor mark" fill priority sizes="(max-width: 800px) 75vw, 38vw" />
        </div>
      </section>

      <section id="logo" className={styles.logoSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>The mark</p>
          <h2>Use the real tractor.</h2>
          <p>The primary PNG is the exact mark used by act.place. The other files are deterministic colour versions of that master. No geometry has been redrawn.</p>
        </div>
        <div className={styles.logoGrid}>
          {logos.map((logo) => (
            <article key={logo.file} className={styles[logo.tone]}>
              <div className={styles.logoPreview}>
                <Image src={`/branding/act/${logo.file}`} alt={`${logo.name} preview`} fill sizes="(max-width: 800px) 80vw, 30vw" />
              </div>
              <div><h3>{logo.name}</h3><p>{logo.note}</p><a href={`/branding/act/${logo.file}`} download>Download PNG ↓</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.rules}>
        <div className={styles.clearSpace}>
          <p className={styles.eyebrow}>Clear space</p>
          <div><Image src="/branding/act/act-mark-primary.png" alt="ACT mark with clear space" width={360} height={360} /><i /><i /><i /><i /></div>
          <p>Keep one headlight of space around the mark. More is welcome. Less turns the tractor into furniture.</p>
        </div>
        <div className={styles.minimums}>
          <p className={styles.eyebrow}>Minimum size</p>
          <div><Image src="/branding/act/act-mark-32.png" alt="ACT mark at 32 pixels" width={32} height={32} /><span>32 px interface minimum</span></div>
          <div><Image src="/branding/act/act-mark-180.png" alt="ACT mark at 180 pixels" width={90} height={90} /><span>24 mm print minimum</span></div>
          <p>At 16 px, use only the supplied favicon. Do not shrink the full navigation lockup below 44 px high.</p>
        </div>
        <div className={styles.dont}>
          <p className={styles.eyebrow}>Do not</p>
          <ul><li>Redraw or simplify the mark</li><li>Stretch, rotate or add effects</li><li>Place it over a busy face or text</li><li>Invent new project colours for it</li><li>Use the retired clean-line tractor</li></ul>
        </div>
      </section>

      <section id="system" className={styles.system}>
        <div className={styles.sectionIntro}><p className={styles.eyebrow}>The parent system</p><h2>Editorial warmth.<br />Documentary scale.</h2><p>ACT pages feel like a field journal opened wide. Warm paper, dark rooms, honest photographs and enough space for a sentence to stop.</p></div>
        <div className={styles.palette}>{colours.map(([name, value, use]) => <article key={name}><i style={{ background: value }} /><h3>{name}</h3><code>{value}</code><p>{use}</p></article>)}</div>
        <div className={styles.typeSpecimen}>
          <div><span>Display · Fraunces</span><p>Come into the art.</p></div>
          <div><span>Body · Source Serif 4</span><p>The hand reaches for the tool. The field decides what happens next.</p></div>
          <div><span>Interface · Work Sans</span><p>LISTEN · CURIOSITY · ACTION · ART</p></div>
        </div>
      </section>

      <section id="voice" className={styles.voice}>
        <p className={styles.eyebrow}>The voice</p>
        <h2>Name the room.<br />Name the body.<br />Stop the line.</h2>
        <div>
          <p>The court is a room that forgets. We work with people who remember.</p>
          <p>The bed is in the yard. Mykel holds the tool.</p>
          <p>The gate is open. The rhythm is not settled.</p>
        </div>
        <ul><li>Use short sentences and concrete nouns.</li><li>Name Country and the people carrying the work.</li><li>Do not use saviour language or pitch-deck puff.</li><li>Write “Listen · Curiosity · Action · Art” in full.</li><li>Use commas or full stops. Never em dashes.</li></ul>
      </section>

      <section id="review" className={styles.review}>
        <div className={styles.sectionIntro}><p className={styles.eyebrow}>Before a page moves</p><h2>Seven checks at the gate.</h2></div>
        <ol>
          <li><span>01</span><strong>Source</strong><p>Is the mark, image, film and fact connected to its source?</p></li>
          <li><span>02</span><strong>Permission</strong><p>Do we have authority for this use, on this page, now?</p></li>
          <li><span>03</span><strong>Room</strong><p>Can the reader tell where the work is happening?</p></li>
          <li><span>04</span><strong>Body</strong><p>Are the people and hands visible without becoming decoration?</p></li>
          <li><span>05</span><strong>Project</strong><p>Does the page belong to ACT while respecting the project's own identity?</p></li>
          <li><span>06</span><strong>Path</strong><p>Can someone reach the live project, ask a question or leave the screen?</p></li>
          <li><span>07</span><strong>Plainness</strong><p>Could a fourteen-year-old say the sentence without translation?</p></li>
        </ol>
        <div className={styles.reviewLinks}><Link href="/prototypes/media-review">Open media review →</Link><Link href="/prototypes/history-media">Open publishing review →</Link><Link href="/prototypes/story-atlas">Open story atlas →</Link></div>
      </section>

      <footer><FieldBrand /><p>Canonical master: act.place live asset · Retrieved 22 July 2026</p><a href="/branding/act/act-logo-pack.zip" download>Logo pack ↓</a></footer>
    </main>
  );
}
