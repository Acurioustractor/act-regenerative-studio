// Brand v1's three faces, self-hosted by next/font. Each sets a --face-* variable that src/brand/tokens.css reads into
// --font-display, --font-mono and --font-loud.
import { Big_Shoulders, Fraunces, IBM_Plex_Mono } from "next/font/google";

// Fraunces in the static cuts Pencil draws with; its optical sizes set the wordmark 3% narrower than the design.
const display = Fraunces({ subsets: ["latin"], weight: ["400", "700"], variable: "--face-display", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--face-mono", display: "swap" });
// Big Shoulders with its optical-size axis, as Pencil draws it; the static cut sets loud type 7% wider than the design.
// next/font has no fallback metrics for Big Shoulders yet, so it does not try to adjust one.
const loud = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--face-loud",
  display: "swap",
  adjustFontFallback: false,
});

/** Put on the element that carries data-surface, or an ancestor of it, so --font-* resolve to these faces. */
export const faces = [display.variable, mono.variable, loud.variable].join(" ");
