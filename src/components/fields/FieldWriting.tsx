import Link from "next/link";

import {
  articlesForField,
  questionsForField,
} from "@/lib/fields/field-graph";
import type { LivingFieldId } from "@/data/living-field";

/**
 * What has been written from a field, rendered under its story.
 *
 * The five field pages told a field's story and then handed off, with no route
 * from the field into the 29 editorial articles or the six open questions. This
 * closes that loop: a reader who has just been persuaded by the Art field can
 * read the pieces about CONTAINED without going back to the index and hunting.
 *
 * A server component, deliberately. The field graph reads the editorial
 * snapshot, which is marked `server-only`, and FieldStoryPrototype is a client
 * component. Composing this alongside it in the page rather than inside it
 * keeps the boundary clean and leaves the shared prototype untouched.
 *
 * Styling follows Bold Documentary as the homepage renders it: sharp corners,
 * hairline rules, no shadows, Fraunces for titles, Work Sans for the eyebrow.
 * Labels use clay-text rather than clay, which fails WCAG AA at this size.
 */

/** Articles read at /stories/[slug]; /stories is the index that points at them. */
function articleHref(localPath: string | null | undefined, slug: string) {
  return localPath || `/stories/${slug}`;
}

/*
 * No date is rendered, deliberately.
 *
 * `publishedAt` in the editorial feed is a migration artifact rather than an
 * editorial date: 21 of the 29 articles share one timestamp to the millisecond
 * (2026-01-09T23:40:59.476Z), and createdAt and updatedAt each hold a single
 * value across the whole corpus. Printing that as "10 January 2026" under every
 * headline would state something false on a public page.
 *
 * Restore a date here once the feed carries real ones.
 */

export function FieldWriting({
  fieldId,
  fieldName,
}: {
  fieldId: LivingFieldId;
  fieldName: string;
}) {
  const articles = articlesForField(fieldId);
  const questions = questionsForField(fieldId);

  // Nothing to show is a real state, not an error. Rendering an empty shell
  // with a heading and no rows reads as broken; rendering nothing lets the
  // field story end where it ended before.
  if (articles.length === 0 && questions.length === 0) return null;

  return (
    <section
      className="full-bleed border-t border-rule bg-bg px-6 py-20 md:px-12 lg:px-20"
      aria-labelledby={`field-writing-${fieldId}`}
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-sans text-eyebrow font-semibold uppercase text-clay-text">
          Written from this field
        </p>
        <h2
          id={`field-writing-${fieldId}`}
          className="mt-4 max-w-2xl font-display text-4xl font-light tracking-display text-ink md:text-5xl"
        >
          Follow {fieldName} into the writing.
        </h2>

        {articles.length > 0 && (
          <ul className="mt-14 border-t border-rule">
            {articles.map((article) => (
              <li key={article.slug} className="border-b border-rule">
                <Link
                  href={articleHref(article.localPath, article.slug)}
                  className="group block py-7"
                >
                  <h3 className="font-display text-2xl font-light text-ink transition-colors group-hover:text-forest md:text-3xl">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 max-w-2xl font-body text-base leading-relaxed text-muted-deep">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {questions.length > 0 && (
          <div className="mt-16">
            <p className="font-sans text-eyebrow font-semibold uppercase text-clay-text">
              Still open here
            </p>
            <ul className="mt-6 space-y-4">
              {questions.map((question) => (
                <li key={question.slug}>
                  <Link
                    href={`/questions/${question.slug}`}
                    className="group flex items-baseline gap-3 font-display text-xl font-light text-ink transition-colors hover:text-forest md:text-2xl"
                  >
                    <span aria-hidden className="text-clay-text">
                      →
                    </span>
                    {question.question}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
