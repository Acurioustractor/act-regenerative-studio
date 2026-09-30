// Brand v1's three faces, self-hosted by next/font. Each sets a --face-* variable that src/brand/tokens.css reads into
// --font-display, --font-mono and --font-loud. Only the weights the Pencil file uses are loaded.
import { Big_Shoulders, Fraunces, IBM_Plex_Mono } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], weight: ["400", "700"], variable: "--face-display", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--face-mono", display: "swap" });
// next/font has no fallback metrics for Big Shoulders yet, so it does not try to adjust one.
const loud = Big_Shoulders({ subsets: ["latin"], weight: ["800"], variable: "--face-loud", display: "swap", adjustFontFallback: false });

/** Put on the element that carries data-surface, or an ancestor of it, so --font-* resolve to these faces. */
export const faces = [display.variable, mono.variable, loud.variable].join(" ");
