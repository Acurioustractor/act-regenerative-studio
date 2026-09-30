"use client";

import { useState } from "react";
import type { PartColour } from "@/brand/brand";
import { Wheel, rolls } from "@/components/pieces/Onward";
import { BECOMES, BECOME_ORDER, placeParts, standsFor } from "@/lib/art/become";
import styles from "./become-parts.module.css";

const FILL: Record<PartColour, string> = { ink: "var(--fg)", accent: "var(--accent)", paper: "var(--bg)" };

/**
 * "The four parts, as this work" (Pencil: The parts, as CONTAINED, c8Xg09; the behaviour is act-play.html's d-become).
 * The same four parts, drawn as the thing the work is; tap the drawing and they come apart and go back together as the
 * next thing they have become. The drawing is <Parts>' own (the arrangements are src/brand/brand.json), but each part is
 * one element that moves from one arrangement to the next, which a single static <Parts> cannot do. It starts as `own`,
 * the arrangement that stands for this work, or as the tractor when the brand has not made the work out of the parts.
 * Without script the drawing simply shows. Motion is reduced to a cut when the visitor asks for less.
 */
export function BecomeParts({ title, own }: { title: string; own: string | null }) {
  const order = own ? [own, ...BECOME_ORDER.filter((name) => name !== own)] : BECOME_ORDER;
  const [index, setIndex] = useState(0);
  const name = order[index];
  const isThisWork = Boolean(own) && name === own;
  const next = () => setIndex((i) => (i + 1) % order.length);

  return (
    <section className={styles.parts} aria-labelledby="parts-title">
      <div className={styles.words}>
        <p className={styles.eyebrow}>The four parts, as {isThisWork ? title : standsFor(name)}</p>
        <h2 id="parts-title" className={styles.heading} aria-live="polite">
          {BECOMES[name] ?? `A ${name}`}.
        </h2>
        <p className={styles.text}>
          {own && "The same four parts that make the tractor make this work. "}
          Tap the drawing and it comes apart and goes back together as a bed, a table, a phone: the other things the parts
          have become.
        </p>
        <button type="button" className={`${styles.tap} ${rolls}`} onClick={next}>
          <span>Tap to change</span>
          <Wheel />
        </button>
      </div>

      <button type="button" className={styles.stage} onClick={next} aria-label="Change what the four parts make">
        {placeParts(name).map((part) => (
          <span
            key={part.role}
            aria-hidden="true"
            className={styles.part}
            data-part={part.role}
            style={{
              left: `${part.left}%`,
              top: `${part.top}%`,
              width: `${part.width}%`,
              height: `${part.height}%`,
              borderRadius: part.shape === "round" ? "50%" : 0,
              background: FILL[part.colour],
              transform: part.rotate ? `rotate(${part.rotate}deg)` : "none",
              zIndex: part.layer,
            }}
          />
        ))}
      </button>
    </section>
  );
}
