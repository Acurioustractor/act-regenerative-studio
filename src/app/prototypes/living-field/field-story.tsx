"use client";

import Link from "next/link";
import { useEffect } from "react";
import { livingFieldsById, type LivingField } from "@/data/living-field";
import heroMedia from "@/data/hero-media-selections.json";
import {
  EditorialHeader,
  PageRail,
} from "@/components/prototypes/EditorialHeader";
import styles from "./field-story.module.css";

export const fieldStories = livingFieldsById;

export function FieldStoryPrototype({
  story,
  production = false,
}: {
  story: LivingField;
  production?: boolean;
}) {
  // The art selection is the Confessions phone video, whose burned-in captions
  // run wall-to-wall; this portrait hero crops the 16:9 frame and cuts every
  // caption line mid-word. Fall back to the field's own caption-free assets
  // here — the home card is wide enough to keep the phone video.
  const selectedHero = story.id === "art" ? undefined : heroMedia.fields[story.id];

  useEffect(() => {
    const chrome = Array.from(
      document.querySelectorAll<HTMLElement>("[data-site-chrome]"),
    );
    chrome.forEach((node) => {
      node.hidden = true;
    });
    return () =>
      chrome.forEach((node) => {
        node.hidden = false;
      });
  }, []);

  return (
    <div
      className={`${styles.story} livingFieldPrototype`}
      style={
        {
          // --accent is decorative only. Text uses the surface-specific pair,
          // because no single accent clears AA on both light and dark.
          "--accent": story.accent,
          "--accent-light": story.accentOnLight,
          "--accent-dark": story.accentOnDark,
        } as React.CSSProperties
      }
    >
      <EditorialHeader
        homeHref={production ? "/" : "/prototypes/living-field"}
      />
      <PageRail
        label={`${story.name} field`}
        links={[
          ["Opening", "#field-opening"],
          ["Question", "#field-question"],
          [story.projectLabel, story.projectHref],
        ]}
      />

      <main>
        <section id="field-opening" className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>{story.eyebrow}</p>
            <span className={styles.number}>{story.number}</span>
            <h1>{story.title}</h1>
            <p className={styles.opening}>{story.opening}</p>
          </div>
          <div
            className={styles.heroMedia}
            style={{
              backgroundImage: `url(${selectedHero?.posterUrl ?? story.image})`,
            }}
          >
            {selectedHero?.videoUrl || story.video ? (
              <video
                key={selectedHero?.videoUrl ?? story.video}
                autoPlay
                muted
                loop
                playsInline
                poster={selectedHero?.posterUrl ?? story.image}
              >
                <source
                  src={selectedHero?.videoUrl ?? story.video}
                  type="video/mp4"
                />
              </video>
            ) : null}
            <span>{story.name}</span>
          </div>
        </section>

        <section id="field-question" className={styles.question}>
          <p className={styles.eyebrow}>The question underneath</p>
          <h2>{story.question}</h2>
          <div className={styles.answer}>
            <p>{story.answer}</p>
            {production ? (
              <a
                href={story.projectHref}
                target={
                  story.projectHref.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  story.projectHref.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {story.projectLabel}{" "}
                {story.projectHref.startsWith("http") ? "↗" : "→"}
              </a>
            ) : (
              <Link href={story.experienceHref}>
                Continue into the project →
              </Link>
            )}
          </div>
        </section>

        <section className={styles.photoChapter}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.secondImage} alt="" />
          <p>
            <span>Listen</span> before naming the problem.{" "}
            <span>Stay curious</span> long enough for the first answer to
            change. <span>Act</span> with people who carry the consequence. Let{" "}
            <span>art</span> return the work to culture.
          </p>
        </section>

        {story.destinationAction ? (
          <section id="field-project" className={styles.handoff}>
            <p className={styles.eyebrow}>The work continues elsewhere</p>
            <h2>{story.destinationAction}.</h2>
            <p>
              ACT holds the connecting story. {story.name} has its own living
              home.
            </p>
            <a
              href={story.destinationHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {story.destinationLabel} ↗
            </a>
          </section>
        ) : null}

        <footer className={styles.next}>
          <span>Next field</span>
          <Link
            href={
              production
                ? `/fields/${story.next.href.split("/").at(-1)}`
                : story.next.href
            }
          >
            {story.next.label} →
          </Link>
        </footer>
      </main>
    </div>
  );
}
