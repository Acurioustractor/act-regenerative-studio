"use client";

import { useState } from "react";
import { arrangement, type Piece } from "@/brand/brand";
import styles from "./parts-apart.module.css";

// The tractor's four parts lying scattered, each one a thing to click: click and they bolt back into a tractor, click
// again and they come apart. Pencil draws the scattered arrangement in Parts · scattered (a script node,
// ossh6 at 560 by 420, m4BoPr at full width by 260 on a phone); the move is act-play's "09 The page that is not there".

const scattered = arrangement("scattered").parts;
const tractor = arrangement("tractor").parts;

// Fit the drawing to the scattered parts, as Pencil's parts.js does (rotation not counted).
const minX = Math.min(...scattered.map((p) => p.x));
const minY = Math.min(...scattered.map((p) => p.y));
const maxX = Math.max(...scattered.map((p) => p.x + p.w));
const maxY = Math.max(...scattered.map((p) => p.y + p.h));

// The tractor stands in the middle of that box.
const tractorBox = {
  minX: Math.min(...tractor.map((p) => p.x)),
  minY: Math.min(...tractor.map((p) => p.y)),
  maxX: Math.max(...tractor.map((p) => p.x + p.w)),
  maxY: Math.max(...tractor.map((p) => p.y + p.h)),
};
const shiftX = (minX + maxX) / 2 - (tractorBox.minX + tractorBox.maxX) / 2;
const shiftY = (minY + maxY) / 2 - (tractorBox.minY + tractorBox.maxY) / 2;

const FILL = { ink: "var(--fg)", accent: "var(--accent)", paper: "var(--bg)" } as const;

/** Where a part sits: moved to its corner, then turned counter-clockwise about that corner, as Pencil turns it. */
const place = (piece: Piece, dx = 0, dy = 0) =>
  `translate(${piece.x + dx}px, ${piece.y + dy}px) rotate(${-(piece.rotate ?? 0)}deg)`;

export function PartsApart({ label, className }: { label: string; className?: string }) {
  const [together, setTogether] = useState(false);
  const toggle = () => setTogether((now) => !now);

  return (
    <div className={[styles.stage, className].filter(Boolean).join(" ")}>
      <svg
        className={styles.drawing}
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
        aria-hidden="true"
        focusable="false"
      >
        {scattered.map((from) => {
          const to = tractor.find((p) => p.role === from.role) ?? from;
          const move = together ? place(to, shiftX, shiftY) : place(from);
          return (
            <g key={from.role} className={styles.part} style={{ transform: move }} onClick={toggle}>
              {from.shape === "round" ? (
                <ellipse cx={from.w / 2} cy={from.h / 2} rx={from.w / 2} ry={from.h / 2} fill={FILL[from.colour]} />
              ) : (
                <rect width={from.w} height={from.h} fill={FILL[from.colour]} />
              )}
            </g>
          );
        })}
      </svg>
      {/* The parts take the mouse; this is the way in for a keyboard or a screen reader. */}
      <button type="button" className={styles.toggle} aria-pressed={together} onClick={toggle}>
        {label}
      </button>
    </div>
  );
}
