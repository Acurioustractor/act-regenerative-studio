/**
 * Which of the site's two design languages a route speaks. This is the rule;
 * DESIGN.md describes it, scripts/check-palette.mjs enforces it.
 *
 * documentary  Bold Documentary: full-bleed media, Fraunces light display,
 *              forest + clay on warm white. Tokens: --site-*, Tailwind forest / clay / ink.
 * editorial    Warm Editorial: meta, listings, legal, the art catalogue.
 *              Tokens: --we-*, Tailwind we-*.
 * shell        Header, footer, forms: neutral, --site-* only.
 *
 * --warm-* (gold, paper, cream, sand, bark, earth, night, sage) is a shared
 * family both languages may paint with; it is never counted as foreign.
 *
 * Longest prefix wins. Routes not listed are editorial.
 */
export type DesignLanguage = "documentary" | "editorial" | "shell";

export const ROUTE_LANGUAGE: ReadonlyArray<readonly [prefix: string, language: DesignLanguage]> = [
  ["/", "documentary"],
  ["/fields", "documentary"],
  ["/harvest", "documentary"],
  ["/confessions", "documentary"],
  ["/stories", "documentary"],
  ["/questions", "documentary"],
  ["/about", "documentary"],
  ["/contact", "documentary"],
  // Flagship narrative pages. Held behind launch redirects today, still documentary.
  ["/empathy-ledger", "documentary"],
  ["/farm", "documentary"],
  ["/goods", "documentary"],
  ["/justicehub", "documentary"],
  ["/impact", "documentary"],
  ["/art", "editorial"],
  ["/privacy", "editorial"],
  ["/terms", "editorial"],
];

export function languageForPath(pathname: string): DesignLanguage {
  const clean = pathname.replace(/\/+$/, "") || "/";
  let best: readonly [string, DesignLanguage] | null = null;
  for (const entry of ROUTE_LANGUAGE) {
    const [prefix] = entry;
    const hit = prefix === "/" ? clean === "/" : clean === prefix || clean.startsWith(prefix + "/");
    if (hit && (!best || prefix.length > best[0].length)) best = entry;
  }
  return best ? best[1] : "editorial";
}

/** Token family each language may use in page and component code. */
export const TOKEN_FAMILY: Record<DesignLanguage, RegExp> = {
  documentary: /--site-/,
  editorial: /--we-/,
  shell: /--site-/,
};
