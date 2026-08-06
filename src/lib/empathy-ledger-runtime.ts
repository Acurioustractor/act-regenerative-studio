const EMPATHY_LEDGER_DISABLE_FETCH = /^(1|true|yes)$/i.test(
  process.env.EMPATHY_LEDGER_DISABLE_FETCH || ""
);

const DEFAULT_TIMEOUT_MS = Number.parseInt(
  process.env.EMPATHY_LEDGER_FETCH_TIMEOUT_MS || "1500",
  10
);

export const EMPATHY_LEDGER_URL =
  process.env.EMPATHY_LEDGER_URL ||
  process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL ||
  "http://localhost:3030";

export const EMPATHY_LEDGER_SITE_SLUG =
  process.env.EMPATHY_LEDGER_SITE_SLUG || "act-regenerative-studio";

export const EMPATHY_LEDGER_PUBLIC_URL =
  process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || EMPATHY_LEDGER_URL;

let empathyLedgerState: "unknown" | "available" | "unavailable" | "disabled" =
  EMPATHY_LEDGER_DISABLE_FETCH ? "disabled" : "unknown";

let warningLogged = false;

export function buildEmpathyLedgerHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};

  if (process.env.EMPATHY_LEDGER_API_KEY) {
    headers["X-API-Key"] = process.env.EMPATHY_LEDGER_API_KEY;
  }

  return headers;
}

function logUnavailableOnce(message: string) {
  if (warningLogged) return;
  warningLogged = true;
  console.warn(message);
}

function isConnectionFailure(error: unknown): boolean {
  // Duck-typed on purpose. The 2026-08-06 production build died on a
  // TimeoutError that failed BOTH instanceof checks below: by the time it
  // surfaced it was a prototype-stripped plain object (DOMExceptions lose
  // their prototype crossing undici/build-worker boundaries), so a
  // recognised timeout fell through to the throw path and one slow Empathy
  // Ledger response killed the whole deploy.
  const name = (error as { name?: unknown } | null)?.name;
  if (name === "AbortError" || name === "TimeoutError") {
    return true;
  }

  const message = String(
    (error as { message?: unknown } | null)?.message ?? ""
  ).toLowerCase();

  return (
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("aborted") ||
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("etimedout") ||
    message.includes("enotfound") ||
    message.includes("eai_again") ||
    message.includes("network")
  );
}

function resolveUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  return `${EMPATHY_LEDGER_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/**
 * One cache tag for everything read from Empathy Ledger.
 *
 * Every read goes through fetchEmpathyLedgerJson below, so tagging here means a
 * single revalidateTag() drops all of it at once. That is what the webhook at
 * /api/webhooks/empathy-ledger uses when somebody withdraws consent.
 *
 * Before this, the only bound on a withdrawal reaching this site was the 300
 * second revalidate window. Five minutes is not long, but it is five minutes of
 * showing a story after the person said stop, and it is avoidable.
 */
export const EMPATHY_LEDGER_CACHE_TAG = "empathy-ledger";

export function isEmpathyLedgerFetchEnabled(): boolean {
  return empathyLedgerState !== "disabled";
}

const TIMED_OUT = Symbol("empathy-ledger-timed-out");

/**
 * Shared fetch core. Two hard rules, both learned from failed deploys on
 * 2026-08-06:
 *
 * 1. NEVER pass an AbortSignal to this fetch. Next's patched fetch writes the
 *    response into its data cache in the background; aborting makes that
 *    cache write reject outside any try/catch here, and during prerender an
 *    unhandled rejection fails the page and exits the build. The timeout is a
 *    race instead: on expiry the request is ABANDONED, not cancelled — it
 *    finishes silently (undici's own ~300s limits bound a truly dead server)
 *    and its late outcome is ignored.
 *
 * 2. NEVER throw. Every consumer treats null as "fall back to the baked
 *    snapshot", and no Empathy Ledger failure — however unrecognised — is
 *    worth failing a build or a request over. Unexpected failures log loudly.
 */
async function performEmpathyLedgerFetch<T>(
  url: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
  timeoutMs: number
): Promise<T | null> {
  const fetchPromise = (async () => {
    const response = await fetch(url, init);

    if (response.status === 404 || response.status === 401 || response.status === 403) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Empathy Ledger API error: ${response.status}`);
    }

    empathyLedgerState = "available";
    return (await response.json()) as T;
  })();

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<typeof TIMED_OUT>((resolve) => {
    timer = setTimeout(() => resolve(TIMED_OUT), timeoutMs);
  });

  try {
    const result = await Promise.race([fetchPromise, timeoutPromise]);

    if (result === TIMED_OUT) {
      // Swallow whatever the abandoned request eventually does.
      fetchPromise.catch(() => {});
      empathyLedgerState = "unavailable";
      logUnavailableOnce(
        `[ACT Studio] Empathy Ledger is unreachable at ${EMPATHY_LEDGER_URL}. Using wiki/static fallbacks for the rest of this build.`
      );
      return null;
    }

    return result;
  } catch (error) {
    if (isConnectionFailure(error)) {
      empathyLedgerState = "unavailable";
      logUnavailableOnce(
        `[ACT Studio] Empathy Ledger is unreachable at ${EMPATHY_LEDGER_URL}. Using wiki/static fallbacks for the rest of this build.`
      );
      return null;
    }

    console.error(`[ACT Studio] Empathy Ledger read failed for ${url}:`, error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchEmpathyLedgerJson<T>(
  pathOrUrl: string,
  options: {
    revalidate?: number;
    timeoutMs?: number;
  } = {}
): Promise<T | null> {
  if (empathyLedgerState === "disabled" || empathyLedgerState === "unavailable") {
    return null;
  }

  return performEmpathyLedgerFetch<T>(
    resolveUrl(pathOrUrl),
    {
      headers: buildEmpathyLedgerHeaders(),
      next: {
        revalidate: options.revalidate ?? 300,
        // Tagged so a withdrawal can drop this immediately instead of waiting out
        // the window. See EMPATHY_LEDGER_CACHE_TAG above.
        tags: [EMPATHY_LEDGER_CACHE_TAG],
      },
    },
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );
}

export async function requestEmpathyLedgerJson<T>(
  pathOrUrl: string,
  options: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
    revalidate?: number;
    timeoutMs?: number;
  } = {}
): Promise<T | null> {
  if (empathyLedgerState === "disabled" || empathyLedgerState === "unavailable") {
    return null;
  }

  return performEmpathyLedgerFetch<T>(
    resolveUrl(pathOrUrl),
    {
      method: options.method || "GET",
      headers: {
        ...buildEmpathyLedgerHeaders(),
        ...(options.headers || {}),
      },
      body: options.body,
      next: { revalidate: options.revalidate ?? 300 },
    },
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );
}
