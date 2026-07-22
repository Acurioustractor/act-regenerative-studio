import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";

import {
  EMPATHY_LEDGER_EDITORIAL_EVENTS,
  isValidEmpathyLedgerSignature,
} from "./empathy-ledger-editorial";

test("validates the HMAC for the exact raw body", () => {
  const secret = "test-secret";
  const body = JSON.stringify({
    event: "article.published",
    article: { slug: "article-slug" },
  });
  const signature = createHmac("sha256", secret).update(body).digest("hex");

  assert.equal(
    isValidEmpathyLedgerSignature(body, `sha256=${signature}`, secret),
    true,
  );
  assert.equal(
    isValidEmpathyLedgerSignature(`${body}\n`, `sha256=${signature}`, secret),
    false,
  );
});

test("rejects missing and malformed signatures", () => {
  assert.equal(isValidEmpathyLedgerSignature("{}", null, "test-secret"), false);
  assert.equal(isValidEmpathyLedgerSignature("{}", "sha256=not-hex", "test-secret"), false);
});

test("allows only the editorial contract events", () => {
  assert.deepEqual([...EMPATHY_LEDGER_EDITORIAL_EVENTS], [
    "article.published",
    "article.updated",
    "article.withdrawn",
  ]);
});
