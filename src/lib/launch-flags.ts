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
