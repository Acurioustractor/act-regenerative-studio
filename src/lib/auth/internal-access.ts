/**
 * Shared secret gate for internal surfaces.
 *
 * This protects the admin console, the prototype pages and the mutating API
 * routes that back them. It is deliberately not a user system: there are no
 * accounts, just one token held by the people who run the studio. That is the
 * right weight for a handful of operators, and it is a great deal better than
 * the previous state, where every /admin page and twelve write endpoints were
 * reachable by anyone who guessed the URL.
 *
 * Configure `ACT_INTERNAL_TOKEN` in the environment (Vercel project settings
 * and .env.local). Generate one with:
 *
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * Behaviour when the variable is missing:
 *   development  open, so local work needs no setup
 *   production   closed, every internal surface returns 404 / 401
 *
 * Failing closed is intentional. A deploy that forgets the variable should
 * lock the operators out, not let the public in.
 */

export const INTERNAL_COOKIE = "act_internal";
export const INTERNAL_HEADER = "x-act-internal-token";

/** Path prefixes that require the token. */
export const INTERNAL_PATH_PREFIXES = ["/admin", "/prototypes"];

export function isInternalPath(pathname: string): boolean {
  return INTERNAL_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Length-independent comparison, so a caller cannot learn the token by timing
 * how long a wrong guess takes to reject. Runs on the edge runtime, so this
 * uses plain string ops rather than node:crypto.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

type AccessMode = "open-dev" | "granted" | "denied";

/**
 * Decide whether a request may reach an internal surface.
 *
 * `presented` should carry every credential the caller supplied: the cookie,
 * an `x-act-internal-token` header, and a `?key=` query parameter. The query
 * parameter exists so an operator can open a link once and have the middleware
 * set the cookie for the rest of the session.
 */
export function evaluateInternalAccess(presented: Array<string | undefined | null>): AccessMode {
  const expected = process.env.ACT_INTERNAL_TOKEN;

  if (!expected) {
    return process.env.NODE_ENV === "production" ? "denied" : "open-dev";
  }
  const ok = presented.some(
    (candidate) => typeof candidate === "string" && safeEqual(candidate, expected),
  );
  return ok ? "granted" : "denied";
}

export function internalAccessAllowed(
  presented: Array<string | undefined | null>,
): boolean {
  return evaluateInternalAccess(presented) !== "denied";
}
