import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import atlas from "@/data/story-source-index.generated.json";
import styles from "./story-atlas.module.css";
import { FieldBrand } from "@/components/prototypes/FieldBrand";

export const metadata: Metadata = {
  title: "ACT story atlas | Internal prototype",
  robots: { index: false, follow: false },
};

const governanceLabel: Record<string, string> = {
  hub: "ACT receiving surface",
  authority: "Story authority",
  "project-review": "Project review",
  "archive-reference": "Archive reference",
  "partner-boundary": "Community boundary",
  "client-boundary": "Client boundary",
  "prototype-reference": "Interaction reference",
};

export default function StoryAtlasPage() {
  return (
    <main className={styles.atlas}>
      <header className={styles.nav}>
        <FieldBrand />
        <nav aria-label="Story atlas navigation">
          <Link href="/prototypes/field-history">History</Link>
          <Link href="/prototypes/history-media">Media map</Link>
          <Link href="/prototypes/brand-guide">Brand guide</Link>
          <a href="#fields">Project fields</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Internal story-source atlas</p>
          <h1>Every project<br />leaves a trail.</h1>
          <p className={styles.lede}>Find the words, photographs and movement already living across ACT. Follow the governed pieces into a story. Leave the rest where they belong.</p>
        </div>
        <div className={styles.orbit} style={{ width: "min(35rem, 100%)", maxWidth: "none" }} aria-hidden="true"><i /><i /><i /><span style={{ left: "-1.2rem", top: "44%", padding: ".45rem .65rem", background: "#FAFAF7" }}>listen</span><span style={{ right: "8%", top: "10%", padding: ".45rem .65rem", background: "#FAFAF7" }}>move</span><span style={{ left: "auto", right: "18%", bottom: "3%", padding: ".45rem .65rem", background: "#FAFAF7" }}>return</span></div>
      </section>

      <section className={styles.metrics} aria-label="Story source totals">
        {[
          [atlas.projects.length, "repositories"],
          [atlas.totals.storyCandidates, "story signals"],
          [atlas.totals.images, "image files"],
          [atlas.totals.videos, "films"],
          [atlas.totals.audio, "audio files"],
        ].map(([value, label]) => <div key={label}><strong>{value.toLocaleString()}</strong><span>{label}</span></div>)}
      </section>

      <section className={styles.rule}>
        <p>Discovery is not permission.</p>
        <div>{atlas.publishingChain.map((step, index) => <span key={step}><b>{String(index + 1).padStart(2, "0")}</b>{step}</span>)}</div>
      </section>

      <section id="fields" className={styles.fields}>
        <div className={styles.sectionIntro}><p className={styles.eyebrow}>Ways into the work</p><h2>One field.<br />Different doors.</h2></div>
        {atlas.projects.map((project, index) => (
          <article key={project.code} className={styles.project} style={{ "--accent": project.accent } as CSSProperties}>
            <div className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</div>
            <div className={styles.projectIdentity}>
              <p>{project.field}</p>
              <h3>{project.name}</h3>
              <span>{governanceLabel[project.governance] || project.governance}</span>
            </div>
            <div className={styles.projectStory}>
              <blockquote>{project.storyThread}</blockquote>
              <p>{project.invitation}</p>
              <div className={styles.motion}><span>Movement</span>{project.motionIdea}</div>
              {project.site ? <a href={project.site} target="_blank" rel="noreferrer">Enter this project ↗</a> : <span className={styles.held}>Source held inside its boundary</span>}
            </div>
            <div className={styles.projectEvidence}>
              <div className={styles.counts}>
                <span><b>{project.counts.storyCandidates || 0}</b> story signals</span>
                <span><b>{project.counts.images || 0}</b> images</span>
                <span><b>{project.counts.videos || 0}</b> films</span>
                <span><b>{project.counts.audio || 0}</b> audio</span>
              </div>
              <details>
                <summary>Strong source paths</summary>
                <ul>{project.candidates.slice(0, 7).map((candidate) => <li key={candidate.path}>{candidate.path}</li>)}</ul>
              </details>
              <details>
                <summary>Media concentrations</summary>
                <ul>{project.mediaDirectories.slice(0, 6).map((item) => <li key={item.directory}><span>{item.directory}</span><b>{item.count}</b></li>)}</ul>
              </details>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.close}>
        <p className={styles.eyebrow}>The ongoing sweep</p>
        <h2>The archive can grow.<br />The boundary stays put.</h2>
        <p>Run <code>npm run story:sweep</code> whenever a project changes. The atlas will count new story and media signals without moving a single community file.</p>
        <div><Link href="/prototypes/field-history">Return to the long history →</Link><Link href="/prototypes/history-media">Review publishing boundaries →</Link></div>
      </section>
    </main>
  );
}
