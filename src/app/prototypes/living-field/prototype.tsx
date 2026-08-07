"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { EditorialHeader } from "@/components/prototypes/EditorialHeader";
import heroMedia from "@/data/hero-media-selections.json";
import { livingFields } from "@/data/living-field";
import styles from "./prototype.module.css";

export function LivingFieldPrototype({ production = false }: { production?: boolean }) {
  const [activeField, setActiveField] = useState(livingFields[0]);
  const [selectedMedia, setSelectedMedia] = useState(heroMedia);
  const activeFieldHero = selectedMedia.fields[activeField.id];
  const [scrollProgress, setScrollProgress] = useState(0);
  const [shareStatus, setShareStatus] = useState("");
  const artworkRef = useRef<HTMLDivElement>(null);

  // The hero travels the fields rather than sitting on one clip: the ribbon
  // under it says the work moves in every direction, and the section below it
  // asks you to choose a way in. The screening room's homepage pick still leads
  // the sequence, so that control keeps meaning something; a field repeating
  // that same clip is dropped rather than shown twice.
  const heroSequence = [selectedMedia.homepage, ...livingFields.map((field) => selectedMedia.fields[field.id])]
    .filter((shot): shot is typeof selectedMedia.homepage => Boolean(shot?.videoUrl))
    .filter((shot, index, all) => all.findIndex((other) => other.videoUrl === shot.videoUrl) === index);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroHeld, setHeroHeld] = useState(false);
  const heroShot = heroSequence[heroIndex % heroSequence.length] ?? selectedMedia.homepage;

  useEffect(() => {
    if (heroSequence.length < 2 || heroHeld) return;
    // Someone who has asked for less motion gets the opening frame and no cycle.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setHeroIndex((current) => (current + 1) % heroSequence.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroSequence.length, heroHeld]);

  useEffect(() => {
    const chrome = Array.from(document.querySelectorAll<HTMLElement>("[data-site-chrome]"));
    chrome.forEach((node) => { node.hidden = true; });
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? window.scrollY / available : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      chrome.forEach((node) => { node.hidden = false; });
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    if (production) return;
    const refreshHeroChoices = () => {
      void fetch("/api/prototypes/media-review/selections", { cache: "no-store" })
        .then((response) => response.ok ? response.json() : Promise.reject())
        .then((choices: typeof heroMedia) => setSelectedMedia(choices))
        .catch(() => {
          // Keep the bundled choices if the private local editor is unavailable.
        });
    };
    refreshHeroChoices();
    window.addEventListener("focus", refreshHeroChoices);
    return () => window.removeEventListener("focus", refreshHeroChoices);
  }, [production]);

  useEffect(() => {
    const resumeVisibleVideos = () => {
      if (document.hidden) return;
      document.querySelectorAll<HTMLVideoElement>(".livingFieldPrototype video").forEach((video) => {
        video.muted = true;
        void video.play().catch(() => {
          // The still image beneath each video remains visible if autoplay is unavailable.
        });
      });
    };
    document.addEventListener("visibilitychange", resumeVisibleVideos);
    window.addEventListener("pageshow", resumeVisibleVideos);
    resumeVisibleVideos();
    return () => {
      document.removeEventListener("visibilitychange", resumeVisibleVideos);
      window.removeEventListener("pageshow", resumeVisibleVideos);
    };
  }, []);

  function moveArtwork(event: React.PointerEvent<HTMLDivElement>) {
    const node = artworkRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--tilt-x", `${x * 1.5}deg`);
    node.style.setProperty("--tilt-y", `${y * -1.5}deg`);
  }

  function resetArtwork() {
    artworkRef.current?.style.setProperty("--tilt-x", "0deg");
    artworkRef.current?.style.setProperty("--tilt-y", "0deg");
  }

  async function shareField() {
    const shareData = { title: "A Curious Tractor · Living Field", text: "Come into the art, then follow it into the field.", url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Shared");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Link copied");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareStatus("Copy the address from your browser to share");
    }
  }

  return (
    <div className={`${styles.prototype} livingFieldPrototype`}>
      <a className={styles.skip} href="#prototype-content">Skip to the field</a>
      <div className={styles.progress} aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <EditorialHeader homeHref={production ? "/" : "/prototypes/living-field"} />

      <main id="prototype-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Art moves first</p>
            <h1 id="hero-title"><span>Make the</span><span>system felt.</span></h1>
            <p>We use art to open hard questions. Then we work with communities to build practical alternatives.</p>
            <a className={styles.textLink} href="#fields">Follow it into the field <span>↓</span></a>
          </div>

          <div className={styles.heroArtworkCell}>
            <svg className={styles.returnMark} viewBox="0 0 180 180" aria-hidden="true">
              <path d="M145 145C116 171 65 169 35 137C7 106 10 57 40 28C67 2 113 6 143 33C164 52 174 84 165 111" />
              <circle cx="165" cy="111" r="6" />
            </svg>
            <div
              ref={artworkRef}
              className={styles.heroArtwork}
              onPointerMove={moveArtwork}
              onPointerEnter={() => setHeroHeld(true)}
              onPointerLeave={() => { setHeroHeld(false); resetArtwork(); }}
            >
              <video key={`shot-${heroShot.videoUrl}`} autoPlay muted loop playsInline poster={heroShot.posterUrl}>
                <source src={heroShot.videoUrl} type="video/mp4" />
              </video>
              <div key={`note-${heroShot.videoUrl}`} className={styles.artworkNote}>
                <span>{heroShot.title}</span>
                <span>{heroShot.field}</span>
              </div>
              <p>{heroHeld ? "Held" : "Move near it"}</p>
            </div>
          </div>
        </section>

        <aside className={styles.methodRibbon} aria-label="How A Curious Tractor works">
          <span>Listen</span><i aria-hidden="true" />
          <span>Curiosity</span><i aria-hidden="true" />
          <span>Action</span><i aria-hidden="true" />
          <strong>Art</strong>
          <p>The work moves in every direction.</p>
        </aside>

        <section id="fields" className={styles.fieldSection} aria-labelledby="fields-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>The field is alive</p>
            <h2 id="fields-title">Choose a way into the work.</h2>
            <p>You do not need to understand the whole field. Begin with what pulls you closer.</p>
          </div>

          <div className={styles.fieldMap}>
            <svg className={styles.furrow} viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
              <path d="M18 94C145 26 250 42 338 112C435 188 475 190 570 123C674 49 805 57 932 142C1007 193 966 285 867 310C755 338 707 267 593 281C466 297 459 433 322 455C203 474 93 419 36 341" />
            </svg>
            <div className={styles.fieldButtons}>
              {livingFields.map((field) => (
                <button
                  key={field.id}
                  type="button"
                  aria-pressed={activeField.id === field.id}
                  onMouseEnter={() => setActiveField(field)}
                  onFocus={() => setActiveField(field)}
                  onClick={() => setActiveField(field)}
                >
                  <span className={styles.seed} aria-hidden="true" />
                  <strong>{field.name}</strong>
                  <small>{field.line}</small>
                </button>
              ))}
            </div>

            <article key={activeField.id} className={styles.fieldReveal} aria-live="polite">
              <video
                key={activeFieldHero.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                poster={activeFieldHero.posterUrl || activeField.image}
                aria-label={`${activeField.name}: ${activeFieldHero.title}`}
              >
                <source src={activeFieldHero.videoUrl} type="video/mp4" />
              </video>
              <div>
                <span className={styles.fieldNumber}>{activeField.number}</span>
                <p className={styles.eyebrow}>{activeField.invitation}</p>
                <h3>{activeField.name}</h3>
                <p>{activeField.line}</p>
                <div className={styles.fieldPaths}>
                  <Link href={production ? `/fields/${activeField.id}` : activeField.experienceHref}>Enter the field story <span>→</span></Link>
                  <Link href={production ? activeField.localHref : activeField.overviewHref}>Read the ACT overview <span>→</span></Link>
                  <a href={activeField.destinationHref} target="_blank" rel="noreferrer">
                    {activeField.destinationLabel} <span>↗</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.crossStory} aria-labelledby="material-title">
          <p className={styles.eyebrow}>A thread across the field</p>
          <h2 id="material-title">Material remembers.</h2>
          <p>Discarded plastic. Reclaimed structure. Living land. Follow one question through Goods, The Harvest and Black Cockatoo Valley.</p>
          <Link href={production ? "/stories" : "/prototypes/material-remembers"}>Read the field story <span>→</span></Link>
        </section>

        <section id="field-letter" className={styles.letter} aria-labelledby="letter-title">
          <div className={styles.question}>
            <p className={styles.eyebrow}>Field letter #001 · working prototype</p>
            <h2 id="letter-title">How do we know when the work should no longer need us?</h2>
            <p className={styles.byline}>An ACT working question</p>
          </div>
          <div className={styles.answer}>
            <p className={styles.mono}>Dear Maya,</p>
            <p>A tool can be useful and still hold too tightly. We see it in the meeting room. ACT is still speaking after everyone else has learned the words.</p>
            <p>The test is ordinary. Who holds the key? Who can change the timetable? Where does the money come to rest? Could the work continue if our engine went quiet?</p>
            <blockquote>The tractor should transfer power without mistaking itself for the field.</blockquote>
            <div className={styles.letterLinks}>
              <Link href={production ? "/questions" : "/prototypes/field-notes"}>Read the field notes →</Link>
              <Link href="/contact?type=general&source=living-field&context=field-question">Ask a question →</Link>
            </div>
          </div>
        </section>

        <section className={styles.harvest} aria-labelledby="harvest-title">
          <div className={styles.harvestMedia}>
            <video autoPlay muted loop playsInline poster="/media/field-stills/hero-farm-aerial.jpg">
              <source src="/media/field-videos/hero-farm-aerial.mp4" type="video/mp4" />
            </video>
          </div>
          <div className={styles.harvestCopy}>
            <p className={styles.eyebrow}>The Harvest · Witta</p>
            <h2 id="harvest-title">Leave the screen.<br />Come to the table.</h2>
            <p>Grow, make and gather in Witta, on Jinibara Country, while the place is still finding its rhythm. Arrive through food, art, work or a question.</p>
            <div className={styles.nextEvent}>
              <span>Now in the field</span>
              <strong>The gate is open</strong>
            </div>
            <Link href={production ? "/fields/harvest" : "/prototypes/harvest-field"}>Enter The Harvest story →</Link>
          </div>
        </section>

        <section className={styles.return} aria-labelledby="return-title">
          <h2 id="return-title">What question<br />is following you?</h2>
          <div>
            <p>ACT is co-designed with people who will hold the work. We build toward the moment we can hand over the keys. Send a question from your work, your street, your kitchen table or the paddock.</p>
            <Link href="/contact?type=general&source=living-field&context=field-question">Ask a question →</Link>
            <button type="button" className={styles.shareButton} onClick={shareField}>Share this field ↗</button>
            <p className={styles.shareStatus} aria-live="polite">{shareStatus}</p>
            <div className={styles.newsletter}><p>Receive the next field letter</p><NewsletterForm contextLabel="Living Field letter signup" source="living-field" projectSlug="living-field" audience="field-notes" /></div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        {livingFields.map((field) => <Link key={field.id} href={field.localHref}>{field.name}</Link>)}
        <Link href={production ? "/about" : "/"}>{production ? "About A Curious Tractor →" : "Return to the current site ↑"}</Link>
      </footer>
    </div>
  );
}
