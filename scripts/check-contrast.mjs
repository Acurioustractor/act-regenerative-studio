#!/usr/bin/env node
/**
 * WCAG AA contrast gate for the live public routes.
 *
 * This exists because the brand clay (#C4845C) reads at 2.95:1 on the warm
 * white background and 2.60:1 on the sage band, and it was being used for the
 * small uppercase eyebrow labels that appear on nearly every page. The fix is
 * --site-clay-text (#945A32); this check stops the old value coming back.
 *
 * Usage:
 *   node scripts/check-contrast.mjs             # fail on any AA violation
 *   node scripts/check-contrast.mjs --report    # list findings, exit 0
 *
 * Requires a running server (CONTRAST_BASE_URL, default http://localhost:3001)
 * and Playwright, since contrast can only be judged after CSS cascades.
 */
import { chromium } from "playwright";

const baseUrl = (
  process.env.CONTRAST_BASE_URL || "http://localhost:3001"
).replace(/\/$/, "");
const reportOnly = process.argv.includes("--report");

/** The launch set. Keep aligned with src/app/sitemap.ts. */
const routes = [
  "/",
  "/about",
  "/contact",
  "/stories",
  "/questions",
  "/confessions",
  "/confessions/listen",
  "/confessions/friday",
  "/confessions/method",
  "/fields/art",
  "/fields/empathy",
  "/fields/justice",
  "/fields/goods",
  "/fields/harvest",
  "/art",
  "/art/artists",
  "/art/artworks",
  "/art/commissions",
  "/art/exhibitions",
  "/art/residencies",
  "/harvest",
  "/harvest/csa",
  "/harvest/produce",
  "/privacy",
  "/terms",
];

/**
 * Runs inside the page. Walks every leaf text node, resolves the nearest
 * opaque ancestor background, and applies the WCAG 2.1 contrast formula.
 *
 * Elements whose resolved background is semi-transparent are skipped rather
 * than guessed at: compositing a real value would need the full stacking
 * context, and a wrong guess here produces false failures that erode trust in
 * the gate. Those cases are counted and reported separately.
 */
const collect = () => {
  const parse = (value) => {
    const nums = (value.match(/-?[\d.]+/g) || []).map(Number);
    if (value.startsWith("color(")) {
      // color(srgb r g b / a) uses 0..1 channels.
      return { rgb: nums.slice(0, 3).map((n) => n * 255), alpha: nums[3] ?? 1 };
    }
    return { rgb: nums.slice(0, 3), alpha: nums.length > 3 ? nums[3] : 1 };
  };
  const lum = (rgb) =>
    rgb
      .map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      })
      .reduce((acc, v, i) => acc + [0.2126, 0.7152, 0.0722][i] * v, 0);

  const findings = [];
  let skipped = 0;

  /**
   * Boxes of media elements on the page. Text laid over a photo (a card
   * caption, a hero overlay) has no CSS background to resolve, so walking the
   * ancestor chain lands on <body> and reports white-on-white. That is a false
   * failure: the real backdrop is the image, usually behind a gradient scrim.
   * Contrast against a photograph cannot be decided from computed style, so
   * those elements are counted as skipped rather than guessed at.
   */
  const mediaBoxes = [...document.querySelectorAll("img, video, canvas, svg")]
    .map((m) => m.getBoundingClientRect())
    .filter((r) => r.width > 24 && r.height > 24);

  const overlapsMedia = (rect) =>
    mediaBoxes.some(
      (m) =>
        rect.left < m.right &&
        rect.right > m.left &&
        rect.top < m.bottom &&
        rect.bottom > m.top,
    );

  for (const el of document.querySelectorAll("body *")) {
    if (el.children.length) continue;
    const text = (el.textContent || "").trim();
    if (!text) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    if (parseFloat(style.opacity) < 0.5) continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    if (overlapsMedia(rect)) {
      skipped += 1;
      continue;
    }

    // Nearest ancestor with an opaque background.
    let bg = null;
    for (let n = el; n; n = n.parentElement) {
      const parsed = parse(getComputedStyle(n).backgroundColor);
      if (parsed.alpha >= 0.999) {
        bg = parsed;
        break;
      }
      if (parsed.alpha > 0) {
        bg = "translucent";
        break;
      }
    }
    if (bg === "translucent") {
      skipped += 1;
      continue;
    }
    if (!bg) bg = { rgb: [255, 255, 255], alpha: 1 };

    const fg = parse(style.color);
    if (fg.alpha < 0.999) {
      skipped += 1;
      continue;
    }

    const [a, b] = [lum(fg.rgb), lum(bg.rgb)].sort((x, y) => y - x);
    const ratio = (a + 0.05) / (b + 0.05);

    const px = parseFloat(style.fontSize);
    const bold = parseInt(style.fontWeight, 10) >= 700;
    const large = px >= 24 || (px >= 18.66 && bold);
    const required = large ? 3 : 4.5;

    if (ratio < required) {
      findings.push({
        text: text.slice(0, 48),
        // The class is what you actually need to grep for when fixing this.
        selector: `${el.tagName.toLowerCase()}.${String(el.className || "").trim().split(/\s+/).join(".")}`.replace(/\.$/, ""),
        color: style.color,
        background: `rgb(${bg.rgb.map(Math.round).join(", ")})`,
        px: Math.round(px * 10) / 10,
        ratio: Math.round(ratio * 100) / 100,
        required,
      });
    }
  }
  return { findings, skipped };
};

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const all = [];
  let totalSkipped = 0;

  for (const route of routes) {
    // "load", not "networkidle": the dev server holds an HMR websocket open,
    // so the network never goes idle and every navigation would time out.
    const res = await page.goto(baseUrl + route, {
      waitUntil: "load",
      timeout: 60_000,
    });
    // Let webfonts settle, since font size feeds the large-text threshold.
    await page.waitForTimeout(400);
    if (!res || res.status() !== 200) {
      console.log(`  skip ${route} (status ${res ? res.status() : "no response"})`);
      continue;
    }
    const { findings, skipped } = await page.evaluate(collect);
    totalSkipped += skipped;
    // One row per distinct colour pairing, not per element, so a label used
    // forty times reads as one problem to fix rather than forty.
    const seen = new Set();
    for (const f of findings) {
      const key = `${f.color}|${f.background}|${f.required}`;
      if (seen.has(key)) continue;
      seen.add(key);
      all.push({ route, ...f });
    }
  }
  await browser.close();

  if (all.length === 0) {
    console.log(`\n✓ No WCAG AA contrast violations across ${routes.length} routes.`);
    console.log(`  (${totalSkipped} elements skipped: translucent fg/bg, not decidable statically.)`);
    return;
  }

  console.log(`\n${all.length} distinct contrast violation(s):\n`);
  for (const f of all) {
    console.log(
      `  ${f.route.padEnd(24)} ${String(f.ratio).padStart(5)}:1 ` +
        `(need ${f.required}) ${f.px}px  ${f.color} on ${f.background}`,
    );
    console.log(`    "${f.text}"   ${f.selector}`);
  }
  console.log(
    `\n  (${totalSkipped} elements skipped: translucent fg/bg, not decidable statically.)`,
  );
  if (!reportOnly) {
    console.log("\nFailing. Use --report to list without failing.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
