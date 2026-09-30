// The rule behind the Stat tile: a figure carries a source or does not run. It lives here, apart from the component, so
// a page that assembles figures can ask the same question the tile asks.

/** Where a figure comes from: its name, and a link to it when there is one. */
export type StatSource = { name: string; href?: string };

/** Text with something in it. Anything else that arrives at runtime, a number or a missing value, is not. */
export const isText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

/** A figure may be shown only when it has text and its source is named. */
export function canShowStat(figure: unknown, source: unknown): source is StatSource {
  return isText(figure) && typeof source === "object" && source !== null && isText((source as { name?: unknown }).name);
}
