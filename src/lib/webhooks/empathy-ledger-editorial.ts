import { createHmac, timingSafeEqual } from "node:crypto";

export const EMPATHY_LEDGER_EDITORIAL_EVENTS = new Set([
  "article.published",
  "article.updated",
  "article.withdrawn",
]);

export function isValidEmpathyLedgerSignature(
  body: string,
  supplied: string | null,
  secret: string,
): boolean {
  if (!supplied) return false;

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const normalized = supplied.replace(/^sha256=/, "");
  if (!/^[a-f0-9]+$/i.test(normalized) || normalized.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(normalized, "hex"),
    Buffer.from(expected, "hex"),
  );
}
