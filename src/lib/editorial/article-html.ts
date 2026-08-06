/**
 * Server-side preparation for Empathy Ledger article HTML.
 *
 * 24 of the 26 syndicated articles arrive as raw exported HTML (Webflow and
 * Storipress vintages), not markdown. The markup is structurally sound — the
 * embeds carry their own intrinsic-ratio wrappers inline — but it ships three
 * defects that must not reach the page:
 *
 *  - `<script>` tags for the old Storipress analytics loader. React's
 *    innerHTML never executes them, but they don't belong in the DOM at all.
 *  - stray `<h1>`s inside body copy (8 across the corpus), which duplicate
 *    the page H1 the hero renders.
 *  - Webflow's reserved alt placeholder (`__wf_reserved_inherit`, 115
 *    occurrences) and filename-shaped alts, which read as junk in a screen
 *    reader. An empty alt (decorative) is the honest fallback when no real
 *    description exists.
 *
 * Everything visual (full-bleed figures, captions, blockquotes, video ratio
 * for Webflow figures) is handled by the .rich-text CSS, not by rewriting
 * markup here. Keep this transform minimal: it runs on trusted first-party
 * content from Empathy Ledger, and every regex added is a new way to corrupt
 * an article.
 */

const SCRIPT_TAG = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const BODY_H1_OPEN = /<h1(\s[^>]*)?>/gi;
const BODY_H1_CLOSE = /<\/h1>/gi;
const ALT_ATTR = /\balt=(["'])(.*?)\1/gi;

/**
 * Junk-alt detection, same shape as StoryScroll's cleanAlt: Webflow reserved
 * placeholders, bare filenames, and `img_1234`-style machine names all count
 * as "no alt was ever written".
 */
export function cleanAltText(value: string | null | undefined, fallback = ""): string {
  if (!value) return fallback;
  const cleaned = value
    .replace(/^Image:\s*/i, "")
    .replace(/^Video:\s*/i, "")
    .trim();
  if (!cleaned) return fallback;
  if (/^__wf_reserved/i.test(cleaned)) return fallback;
  if (/^[\w().\-\s]+?\.(jpe?g|png|webp|gif|mp4|mov|webm)$/i.test(cleaned)) return fallback;
  if (/^(img|image|video|file|photo)[-_ ]?\d+/i.test(cleaned)) return fallback;
  return cleaned;
}

export function prepareArticleHtml(html: string): string {
  return html
    .replace(SCRIPT_TAG, "")
    .replace(BODY_H1_OPEN, "<h2$1>")
    .replace(BODY_H1_CLOSE, "</h2>")
    .replace(ALT_ATTR, (_match, quote: string, value: string) => {
      // HTML-decode the two entities that appear in these alts before
      // judging them; re-encode is unnecessary because junk becomes "".
      const decoded = value.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      const cleaned = cleanAltText(decoded);
      return cleaned === decoded ? `alt=${quote}${value}${quote}` : `alt=${quote}${cleaned}${quote}`;
    });
}

/**
 * Rounded-up minutes at 220 wpm over the tag-stripped text. Returns null under
 * a minute of reading — a "1 min read" badge on a stub is noise, not signal.
 */
export function readingTimeMinutes(html: string): number | null {
  const text = html
    .replace(SCRIPT_TAG, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 220) return null;
  return Math.ceil(words / 220);
}
