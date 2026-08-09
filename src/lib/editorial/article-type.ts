/**
 * Human labels for Empathy Ledger's article-type tokens.
 *
 * `articleType` arrives from Empathy Ledger as a snake_case machine token
 * (`editorial`, `story_feature`). Three of the four places that rendered it
 * printed the token more or less as-is, so a reader on the Oonchiumpa story
 * saw `STORY_FEATURE` sitting in the byline between the author and the reading
 * time. The two project-page call sites each did their own `.replace(/_/g,' ')`,
 * which fixed the underscore and nothing else, and drifted from each other.
 *
 * One formatter, so the taxonomy stays Empathy Ledger's business and the label
 * a reader sees is always a word. Unknown tokens degrade to Title Case rather
 * than disappearing: a new type added upstream should look unremarkable here,
 * not vanish silently.
 */

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  editorial: 'Editorial',
  story_feature: 'Feature',
  story_photo_essay: 'Photo essay',
  field_note: 'Field note',
  interview: 'Interview',
};

export function formatArticleType(
  articleType: string | null | undefined
): string | null {
  if (!articleType) return null;

  const key = articleType.trim().toLowerCase();
  if (!key) return null;

  const known = ARTICLE_TYPE_LABELS[key];
  if (known) return known;

  // Unknown token: make it readable rather than leaking snake_case.
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}
