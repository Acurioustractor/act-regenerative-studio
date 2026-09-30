import type { CSSProperties } from "react";
import { arrangement } from "@/brand/brand";
import styles from "./arrive-intro.module.css";

// The first of the three moves, "arrive": the four parts drop in, bolt together into the tractor, and get out of the way
// (act-play.html d-arrive; brand.json motion.arrive). It plays once, on the first page of a visit, and never again in the
// same visit. The order the parts come in, and the way they tumble, are the demo's.
const ORDER = ["big", "small", "cab", "bonnet"];

// The page asks the browser once, before anything is painted, so there is no flash on later visits and nothing at all
// without script. It marks the veil `data-play`; the animation is all CSS. sessionStorage is the visit.
const decide = `(function(){try{var v=document.currentScript.previousElementSibling;if(!v)return;var k="act-arrived";if(sessionStorage.getItem(k)||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;sessionStorage.setItem(k,"1");v.setAttribute("data-play","")}catch(e){}})();`;

/**
 * Put this at the top of the first page a visitor sees (the home page). Renders a paper veil over the page for about a
 * second and a half: the parts arrive, hold, and the veil lifts. It is decoration (hidden from a screen reader, never
 * catches a click) and it does not play for someone who has asked for less motion.
 */
export function ArriveIntro() {
  const parts = arrangement("tractor").parts;
  const minX = Math.min(...parts.map((p) => p.x));
  const minY = Math.min(...parts.map((p) => p.y));
  const maxX = Math.max(...parts.map((p) => p.x + p.w));
  const maxY = Math.max(...parts.map((p) => p.y + p.h));

  return (
    <>
      {/* The script sets data-play on this element after the server drew it, so React is told not to mind. */}
      <div className={styles.veil} aria-hidden="true" suppressHydrationWarning>
        <div className={styles.stage} style={{ "--w": maxX - minX, "--h": maxY - minY } as CSSProperties}>
          {ORDER.map((role, i) => {
            const p = parts.find((part) => part.role === role);
            if (!p) return null;
            return (
              <span
                key={role}
                className={`${styles.part} ${p.shape === "round" ? styles.round : ""} ${
                  p.colour === "accent" ? styles.rust : ""
                }`}
                style={
                  {
                    "--x": p.x - minX,
                    "--y": p.y - minY,
                    "--pw": p.w,
                    "--ph": p.h,
                    "--i": i,
                    "--dx": `${(i - 1.5) * 90}px`,
                    "--drop": `${120 + i * 60}px`,
                    "--r": `${i % 2 ? 25 : -25}deg`,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: decide }} />
    </>
  );
}
