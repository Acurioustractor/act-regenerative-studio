"use client";

import { useEffect, useRef } from "react";
import { arrangement } from "@/brand/brand";
import { Parts } from "./Parts";
import styles from "./reading-tractor.module.css";

// The wheels of the tractor, as a share of its drawing, from brand.json, so the notches sit where the wheels are.
const tractor = arrangement("tractor").parts;
const minX = Math.min(...tractor.map((p) => p.x));
const minY = Math.min(...tractor.map((p) => p.y));
const width = Math.max(...tractor.map((p) => p.x + p.w)) - minX;
const height = Math.max(...tractor.map((p) => p.y + p.h)) - minY;
const wheels = tractor
  .filter((p) => p.shape === "round")
  .map((p) => ({
    role: p.role,
    left: `${(((p.x - minX) / width) * 100).toFixed(3)}%`,
    top: `${(((p.y - minY) / height) * 100).toFixed(3)}%`,
    width: `${((p.w / width) * 100).toFixed(3)}%`,
    height: `${((p.h / height) * 100).toFixed(3)}%`,
  }));

/**
 * Reading progress: a small tractor drives along the top as you read, its wheels turning with the page (act-play.html's
 * d-read: "It replaces the progress bar"). Place it under the header; it sticks to the top of the window. `target` is the
 * id of the element being read, so the tractor arrives at the far end when you reach the end of it; without one it
 * follows the whole page. The big wheel turns 1.4 degrees for each pixel scrolled, the small one 1.6 times that.
 * When motion is reduced the tractor still shows where you are but its wheels do not turn.
 */
export function ReadingTractor({ target, label = "Reading progress" }: { target?: string; label?: string }) {
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let shown = -1;

    const measure = () => {
      frame = 0;
      const article = target ? document.getElementById(target) : null;
      let done: number;
      if (article) {
        const box = article.getBoundingClientRect();
        const span = box.height - window.innerHeight;
        done = span > 0 ? -box.top / span : box.bottom <= window.innerHeight ? 1 : 0;
      } else {
        const span = document.documentElement.scrollHeight - window.innerHeight;
        done = span > 0 ? window.scrollY / span : 0;
      }
      done = Math.min(1, Math.max(0, done));
      node.style.setProperty("--progress", done.toFixed(4));
      if (!reduced.matches) node.style.setProperty("--turn", String(Math.round(window.scrollY * 1.4)));
      const percent = Math.round(done * 100);
      if (percent !== shown) {
        shown = percent;
        node.setAttribute("aria-valuenow", String(percent));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <div
      ref={rail}
      className={styles.rail}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div className={styles.tractor}>
        <Parts />
        {wheels.map((wheel) => (
          <span
            key={wheel.role}
            aria-hidden="true"
            className={`${styles.wheel} ${wheel.role === "small" ? styles.small : ""}`}
            style={{ left: wheel.left, top: wheel.top, width: wheel.width, height: wheel.height }}
          />
        ))}
      </div>
    </div>
  );
}
