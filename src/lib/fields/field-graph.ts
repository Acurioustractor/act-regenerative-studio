import {
  getEditorialSnapshot,
  type EditorialArticle,
} from "@/lib/empathy-ledger-editorial";
import { fieldQuestions, type FieldQuestion } from "@/data/field-questions";
import { livingFields, type LivingFieldId } from "@/data/living-field";

/**
 * The join between the five fields and everything written about them.
 *
 * Three datasets already carry the edges, but each names things differently and
 * nothing reads across them:
 *
 *   living-field.ts    five canonical fields, keyed art | empathy | justice |
 *                      goods | harvest
 *   editorial articles 29 pieces tagged with `relatedProjectSlugs`, which use
 *                      project names ("goods-on-country") rather than field ids
 *   field-questions.ts six questions tagged with free-text `fields` strings
 *                      ("Public imagination", "Consent", "Making")
 *
 * This module is the vocabulary that reconciles them, so a field page can ask
 * "what has been written here?" and a story can ask "which field am I in?".
 *
 * The important property is the guard. Every project slug and every question
 * tag must appear in the maps below, including the ones that deliberately
 * belong to no field. A slug that is simply absent would silently vanish from
 * the graph, and the page would look finished while quietly showing less than
 * it should. field-graph.test.ts fails when a new slug or tag appears, which
 * turns that silent gap into a failing build.
 */

/**
 * Project slug to field.
 *
 * `null` means "deliberately not one of the five". Black Cockatoo Valley and
 * the farm are land and place rather than a field of practice; their story
 * lives in the history section of /about. Keep them listed so the guard can
 * tell an intentional omission from a forgotten one.
 */
export const PROJECT_SLUG_TO_FIELD: Record<string, LivingFieldId | null> = {
  justicehub: "justice",
  "goods-on-country": "goods",
  "empathy-ledger": "empathy",
  "the-harvest": "harvest",
  "black-cockatoo-valley": null,
  "act-farm": null,
};

/**
 * Question tag to field.
 *
 * The tags are editorial rather than structural, and several are broader than
 * any single field ("Public imagination", "Practice"). Those map to null: a
 * question can be about the work without belonging to one field, and forcing
 * it into one would misrepresent it.
 */
export const QUESTION_TAG_TO_FIELD: Record<string, LivingFieldId | null> = {
  Art: "art",
  Justice: "justice",
  Goods: "goods",
  Story: "empathy",
  Consent: "empathy",
  Land: "harvest",
  Place: "harvest",
  Gathering: "harvest",
  Making: "goods",
  Evidence: "justice",
  Community: "justice",
  Technology: "empathy",
  "Public imagination": null,
  Practice: null,
};

export const FIELD_IDS: LivingFieldId[] = livingFields.map((field) => field.id);

function isFieldId(value: string | null): value is LivingFieldId {
  return value !== null && (FIELD_IDS as string[]).includes(value);
}

/**
 * All articles, synchronously.
 *
 * getSiteEditorialArticles() is async and caps at 60; the graph wants the whole
 * corpus and wants it without making every caller async, so it reads the
 * snapshot directly.
 */
function allArticles(): EditorialArticle[] {
  return getEditorialSnapshot().articles;
}

/** Every field an article touches, derived from its related project slugs. */
export function fieldsForArticle(article: EditorialArticle): LivingFieldId[] {
  const slugs = article.relatedProjectSlugs ?? [];
  const mapped = slugs.map((slug) => PROJECT_SLUG_TO_FIELD[slug] ?? null);
  return [...new Set(mapped.filter(isFieldId))];
}

/** Every field a question touches, derived from its free-text tags. */
export function fieldsForQuestion(question: FieldQuestion): LivingFieldId[] {
  const mapped = question.fields.map((tag) => QUESTION_TAG_TO_FIELD[tag] ?? null);
  return [...new Set(mapped.filter(isFieldId))];
}

/** Articles belonging to a field, newest first. */
export function articlesForField(fieldId: LivingFieldId): EditorialArticle[] {
  return allArticles()
    .filter((article) => fieldsForArticle(article).includes(fieldId))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

/** Questions belonging to a field. */
export function questionsForField(fieldId: LivingFieldId): FieldQuestion[] {
  return fieldQuestions.filter((question) =>
    fieldsForQuestion(question).includes(fieldId),
  );
}

/**
 * Other articles worth reading after this one.
 *
 * Shared field first, because that is the edge a reader actually feels, then
 * shared storyteller. Falls back to nothing rather than padding with unrelated
 * pieces: an empty related list is more honest than a filled irrelevant one.
 */
export function relatedArticles(
  article: EditorialArticle,
  limit = 3,
): EditorialArticle[] {
  const fields = new Set(fieldsForArticle(article));
  const storyteller = article.storyteller?.displayName ?? null;

  const scored = allArticles()
    .filter((other) => other.slug !== article.slug)
    .map((other) => {
      const shared = fieldsForArticle(other).filter((f) => fields.has(f)).length;
      const sameVoice =
        storyteller && other.storyteller?.displayName === storyteller ? 1 : 0;
      return { other, score: shared * 2 + sameVoice };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.other);
}

/** Counts per field, for coverage checks and admin views. */
export function fieldCoverage(): Array<{
  fieldId: LivingFieldId;
  articles: number;
  questions: number;
}> {
  return FIELD_IDS.map((fieldId) => ({
    fieldId,
    articles: articlesForField(fieldId).length,
    questions: questionsForField(fieldId).length,
  }));
}

/**
 * Slugs and tags present in the data but absent from the maps above.
 *
 * Exported so the test can assert it is empty, rather than hiding the check
 * inside the test file where it would be invisible to anyone reading this
 * module.
 */
export function unmappedReferences(): { slugs: string[]; tags: string[] } {
  const slugs = new Set<string>();
  for (const article of allArticles()) {
    for (const slug of article.relatedProjectSlugs ?? []) {
      if (!(slug in PROJECT_SLUG_TO_FIELD)) slugs.add(slug);
    }
  }
  const tags = new Set<string>();
  for (const question of fieldQuestions) {
    for (const tag of question.fields) {
      if (!(tag in QUESTION_TAG_TO_FIELD)) tags.add(tag);
    }
  }
  return { slugs: [...slugs].sort(), tags: [...tags].sort() };
}
