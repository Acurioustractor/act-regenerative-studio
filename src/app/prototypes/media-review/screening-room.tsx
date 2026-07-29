"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import styles from "./screening.module.css";

type Decision = "home" | "story" | "hold" | "no";
type FieldId = "art" | "empathy" | "justice" | "goods" | "harvest";
type Selection = { mediaId: string; videoUrl: string; posterUrl: string; title: string; field: string };
type Selections = { homepage: Selection; fields: Record<FieldId, Selection> };
type ReviewItem = { id: string; title: string; field: string; role: string; note: string; boundary: string; publicUrl?: string; posterUrl?: string; url: string };
const decisions: { id: Decision; label: string }[] = [{ id: "home", label: "Shortlist" }, { id: "story", label: "Story" }, { id: "hold", label: "Hold" }, { id: "no", label: "No" }];
const projects: { id: FieldId; label: string }[] = [
  { id: "art", label: "Art" },
  { id: "empathy", label: "Empathy Ledger" },
  { id: "justice", label: "JusticeHub" },
  { id: "goods", label: "Goods on Country" },
  { id: "harvest", label: "The Harvest" },
];
const fieldDefaults: Record<string, FieldId> = { Art: "art", "Empathy Ledger": "empathy", JusticeHub: "justice", "Goods on Country": "goods", "The Harvest": "harvest", "ACT / Farm": "art" };

export function MediaScreeningRoom({ items }: { items: ReviewItem[] }) {
  const [field, setField] = useState("All");
  const [picks, setPicks] = useState<Record<string, Decision>>({});
  const [status, setStatus] = useState("");
  const [selections, setSelections] = useState<Selections | null>(null);
  const [targets, setTargets] = useState<Record<string, FieldId>>({});
  const [saving, setSaving] = useState("");

  useEffect(() => {
    try { setPicks(JSON.parse(localStorage.getItem("act-media-review") || "{}")); } catch { setPicks({}); }
    void fetch("/api/prototypes/media-review/selections", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load hero choices")))
      .then((data: Selections) => setSelections(data))
      .catch(() => setStatus("Hero choices could not be loaded. Refresh and try again."));
  }, []);

  const fields = ["All", ...Array.from(new Set(items.map((item) => item.field)))];
  const visible = useMemo(() => field === "All" ? items : items.filter((item) => item.field === field), [field, items]);
  const choose = (id: string, decision: Decision) => {
    const next = { ...picks, [id]: decision };
    setPicks(next);
    localStorage.setItem("act-media-review", JSON.stringify(next));
  };
  const copyReview = async () => {
    const lines = items.filter((item) => picks[item.id]).map((item) => `${picks[item.id]?.toUpperCase()} | ${item.field} | ${item.title} | ${item.id}`);
    await navigator.clipboard.writeText(lines.join("\n"));
    setStatus(lines.length ? `${lines.length} decisions copied` : "Choose at least one film first");
  };
  const assignHero = async (item: ReviewItem, slot: "homepage" | FieldId) => {
    setSaving(`${item.id}:${slot}`);
    setStatus(`Saving ${item.title}…`);
    try {
      const response = await fetch("/api/prototypes/media-review/selections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, mediaId: item.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The hero choice could not be saved.");
      setSelections(data as Selections);
      setStatus(slot === "homepage" ? `${item.title} is now the homepage hero.` : `${item.title} is now the ${projects.find((project) => project.id === slot)?.label} hero.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The hero choice could not be saved.");
    } finally {
      setSaving("");
    }
  };

  return <main className={styles.room}>
    <header>
      <div><FieldBrand className={styles.screeningBrand} /><p>Private local prototype</p><h1>The screening room.</h1></div>
      <div className={styles.intro}><p>Watch for the room, the body and the work. A beautiful shot still needs a job.</p><p>Every film in this room is approved for ACT website use. Shortlist as you watch, then use the hero controls to place it.</p></div>
    </header>
    <nav className={styles.filters} aria-label="Filter films by field">
      {fields.map((name) => <button key={name} type="button" aria-pressed={field === name} onClick={() => setField(name)}>{name}</button>)}
      <button type="button" className={styles.export} onClick={copyReview}>Copy decisions</button>
      <span role="status">{status}</span>
    </nav>
    <section className={styles.grid} aria-label={`${field} candidate films`}>
      {visible.map((item, index) => <article key={item.id} className={styles.card}>
        <div className={styles.film}><video controls playsInline preload="metadata" src={item.url} /><span>{String(index + 1).padStart(2, "0")}</span></div>
        <div className={styles.copy}><p className={styles.meta}>{item.field} · {item.role}</p><h2>{item.title}</h2><p>{item.note}</p><p className={styles.boundary}>{item.boundary}</p></div>
        <div className={styles.decisions} aria-label={`Choose a use for ${item.title}`}>
          {decisions.map((decision) => <button key={decision.id} type="button" aria-pressed={picks[item.id] === decision.id} onClick={() => choose(item.id, decision.id)}>{decision.label}</button>)}
        </div>
        <div className={styles.heroControls}>
          {item.publicUrl && item.posterUrl ? <>
            <div className={styles.activeUses} aria-live="polite">
              {selections?.homepage.mediaId === item.id ? <span>Active homepage hero</span> : null}
              {projects.filter((project) => selections?.fields[project.id].mediaId === item.id).map((project) => <span key={project.id}>Active {project.label} hero</span>)}
            </div>
            <button className={styles.primaryAction} type="button" disabled={Boolean(saving)} onClick={() => assignHero(item, "homepage")}>
              {saving === `${item.id}:homepage` ? "Saving…" : "Use as homepage hero"}
            </button>
            <div className={styles.projectAction}>
              <label htmlFor={`project-${item.id}`}>Project hero</label>
              <select id={`project-${item.id}`} value={targets[item.id] ?? fieldDefaults[item.field]} onChange={(event) => setTargets((current) => ({ ...current, [item.id]: event.target.value as FieldId }))}>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.label}</option>)}
              </select>
              <button type="button" disabled={Boolean(saving)} onClick={() => assignHero(item, targets[item.id] ?? fieldDefaults[item.field])}>
                {saving === `${item.id}:${targets[item.id] ?? fieldDefaults[item.field]}` ? "Saving…" : "Use as project hero"}
              </button>
            </div>
          </> : <p className={styles.unavailable}>Approved source film. Import it into the ACT media library before assigning it as a published hero.</p>}
        </div>
      </article>)}
    </section>
    <footer><Link href="/prototypes/living-field">← View the homepage</Link><Link href="/prototypes/brand-guide">Brand guide →</Link><span>{Object.keys(picks).length} of {items.length} reviewed</span></footer>
  </main>;
}
