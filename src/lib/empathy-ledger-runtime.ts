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
  if (error instanceof DOMException) {
    return error.name === "AbortError" || error.name === "TimeoutError";
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    error.name === "AbortError" ||
    message.includes("timeout") ||
    message.includes("timed out") ||
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

export function isEmpathyLedgerFetchEnabled(): boolean {
  return empathyLedgerState !== "disabled";
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

  const url = resolveUrl(pathOrUrl);

  try {
    const response = await fetch(url, {
      headers: buildEmpathyLedgerHeaders(),
      next: { revalidate: options.revalidate ?? 300 },
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });

    if (response.status === 404 || response.status === 401 || response.status === 403) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Empathy Ledger API error: ${response.status}`);
    }

    empathyLedgerState = "available";
    return response.json();
  } catch (error) {
    if (isConnectionFailure(error)) {
      empathyLedgerState = "unavailable";
      logUnavailableOnce(
        `[ACT Studio] Empathy Ledger is unreachable at ${EMPATHY_LEDGER_URL}. Using wiki/static fallbacks for the rest of this build.`
      );
      return null;
    }

    throw error;
  }
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

  const url = resolveUrl(pathOrUrl);

  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        ...buildEmpathyLedgerHeaders(),
        ...(options.headers || {}),
      },
      body: options.body,
      next: { revalidate: options.revalidate ?? 300 },
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });

    if (response.status === 404 || response.status === 401 || response.status === 403) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Empathy Ledger API error: ${response.status}`);
    }

    empathyLedgerState = "available";
    return response.json();
  } catch (error) {
    if (isConnectionFailure(error)) {
      empathyLedgerState = "unavailable";
      logUnavailableOnce(
        `[ACT Studio] Empathy Ledger is unreachable at ${EMPATHY_LEDGER_URL}. Using wiki/static fallbacks for the rest of this build.`
      );
      return null;
    }

    throw error;
  }
}
