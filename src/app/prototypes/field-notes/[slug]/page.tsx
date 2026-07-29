import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import { fieldQuestions, fieldQuestionsBySlug } from "@/data/field-questions";
import styles from "./response.module.css";

export const dynamicParams = false;
export function generateStaticParams(){ return fieldQuestions.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const {slug}=await params; const note=fieldQuestionsBySlug[slug]; return { title: note ? `${note.question} | A Curious Tractor` : "Field note", robots:{index:false,follow:false} }; }

export function QuestionExperience({ slug, production = false }: { slug: string; production?: boolean }) {
  const note = fieldQuestionsBySlug[slug]; if (!note) notFound(); const next = fieldQuestionsBySlug[note.nextSlug]; const basePath=production?"/questions":"/prototypes/field-notes";
  return <div className={styles.page}>
    <header className={styles.header}><FieldBrand href={production?"/":"/prototypes/living-field"}/><Link href={basePath}>All questions</Link></header>
    <main>
      <section className={styles.hero}><div><p className={styles.eyebrow}>{note.status} · {note.fields.join(" · ")}</p><h1>{note.question}</h1><p className={styles.invitation}>{note.invitation}</p></div><img src={note.image} alt="" /></section>
      <section className={styles.provenance} aria-label="Question provenance"><div><span>Asked by</span><strong>{note.askedBy}</strong></div><div><span>Responding here</span><strong>{note.responseBy}</strong></div><div><span>Where it came from</span><strong>{note.origin}</strong></div></section>
      <article className={styles.response}><p className={styles.eyebrow}>A response, for now</p>{note.response.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{note.pullQuote?<blockquote>{note.pullQuote}</blockquote>:null}<p className={styles.coda}>This response can change as the work changes. If you carry another answer, we would like to hear it.</p><Link href="/contact?type=general&source=field-note-response">Respond to this question →</Link></article>
      <footer className={styles.next}><span>Another question</span><Link href={`${basePath}/${next.slug}`}>{next.question} →</Link></footer>
    </main>
  </div>;
}
export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {const {slug}=await params;return <QuestionExperience slug={slug}/>}
