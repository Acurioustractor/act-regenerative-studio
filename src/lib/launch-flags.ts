/**
 * Launch hold flags (2026-05-27).
 *
 * `STORYTELLERS_PUBLIC` gates the in-context storyteller blocks (Community Voices,
 * Transcripts, Key People, the flagship storyteller strip, and the art-work
 * storyteller list) while the /storytellers surface is held. Flip to `true` to
 * restore them (re-open the /storytellers routes separately in
 * config/launch-redirects.cjs + sitemap.ts + check-launch-site.mjs).
 *
 * The explicit `: boolean` annotation is load-bearing: a literal `false &&`
 * guard makes TypeScript treat the right-hand side as statically dead and drops
 * non-null narrowing (e.g. `project` after a `notFound()` guard), which fails the
 * build type-check. A `boolean`-typed flag keeps normal narrowing.
 */
export const STORYTELLERS_PUBLIC: boolean = false;

/**
 * `WIKI_PUBLIC` gates the public /wiki surface and every link/CTA that points at
 * it while the wiki is a longer build. Flip to `true` to relaunch (also re-open
 * the /wiki routes in config/launch-redirects.cjs + sitemap.ts + check-launch-site.mjs
 * and restore the nav entries). Annotated `: boolean` for the same narrowing reason.
 */
export const WIKI_PUBLIC: boolean = false;
