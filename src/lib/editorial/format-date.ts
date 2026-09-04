/**
 * One way to print an article's date, everywhere it appears.
 *
 * Dates arrive from Empathy Ledger as ISO timestamps in UTC. The day a reader
 * should see is the day in Brisbane, where the writing happens: a piece
 * published at 2025-10-07T19:21Z went up on the morning of 8 October, and
 * saying "7 October" would be wrong by a day for the person who wrote it.
 *
 * Both functions return null for anything missing or unparseable, so a caller
 * renders nothing rather than "Invalid Date". Until 2026-09-05 nothing here was
 * printed at all, because the feed carried the import day as every article's
 * date; see the test in src/lib/fields/field-graph.test.ts that now guards
 * against that coming back.
 */

const TIME_ZONE = "Australia/Brisbane";

const longDate = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

// en-CA is the locale whose default numeric order is year-month-day.
const isoDay = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: TIME_ZONE,
});

function parse(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "14 August 2026", on the Brisbane day. Null when there is no real date. */
export function formatArticleDate(value: string | null | undefined): string | null {
  const date = parse(value);
  return date ? longDate.format(date) : null;
}

/** "2026-08-14", the Brisbane day, for a <time dateTime> attribute. */
export function articleDateTime(value: string | null | undefined): string | null {
  const date = parse(value);
  return date ? isoDay.format(date) : null;
}
