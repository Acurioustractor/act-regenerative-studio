import { describe, expect, it } from "vitest";

/**
 * API contract tests.
 *
 * The important half of this file is the authorisation block. Before
 * src/lib/auth/require-internal.ts existed, twelve mutating endpoints were
 * reachable by anyone, including a 50MB upload straight into Supabase Storage
 * and an LLM endpoint that spends real money per call. These tests are what
 * stop that regressing the next time someone adds a route.
 *
 * They run against a server, not against imported handlers, because the thing
 * under test is the deployed behaviour: middleware, guards and route handlers
 * composed together.
 *
 *   ACT_INTERNAL_TOKEN=<token> npm run dev      # terminal 1
 *   npm run test:api                            # terminal 2
 *
 * When ACT_INTERNAL_TOKEN is unset the server is deliberately open in
 * development, so the authorisation assertions would be meaningless. They skip
 * with a loud message rather than passing vacuously.
 */

const baseUrl = (process.env.TEST_BASE_URL || "http://localhost:3001").replace(
  /\/$/,
  "",
);
const token = process.env.ACT_INTERNAL_TOKEN;

/** Endpoints that must never be reachable without the internal token. */
const guardedEndpoints: Array<{ path: string; method: string }> = [
  { path: "/api/media/upload", method: "POST" },
  { path: "/api/media", method: "POST" },
  { path: "/api/media/some-id", method: "PATCH" },
  { path: "/api/media/some-id", method: "DELETE" },
  { path: "/api/v1/intelligence/ask", method: "POST" },
  { path: "/api/registry/sync", method: "POST" },
  { path: "/api/projects/enrich", method: "POST" },
  { path: "/api/projects/some-slug/hero", method: "PUT" },
  { path: "/api/projects/some-slug/media", method: "POST" },
  { path: "/api/enrichment-review", method: "POST" },
  { path: "/api/notifications", method: "POST" },
  { path: "/api/image-overrides", method: "POST" },
];

/** Page routes gated by src/middleware.ts. */
const guardedPages = ["/admin", "/admin/queue", "/prototypes/stories"];

/** Must stay reachable by the public. */
const publicPages = ["/", "/about", "/stories", "/contact", "/fields/art"];

const call = (path: string, method: string, headers: Record<string, string> = {}) =>
  fetch(baseUrl + path, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: ["GET", "HEAD"].includes(method) ? undefined : "{}",
    redirect: "manual",
  });

describe("public surface", () => {
  it.each(publicPages)("%s is reachable without credentials", async (path) => {
    const res = await fetch(baseUrl + path, { redirect: "manual" });
    expect(res.status).toBe(200);
  });

  it("the public form endpoint is not caught by the internal guard", async () => {
    const res = await call("/api/forms/submit", "POST");
    // A validation error is fine and expected for an empty body. A 401 would
    // mean the guard has been applied too broadly and real submissions break.
    expect(res.status).not.toBe(401);
  });
});

describe.runIf(token)("authorisation", () => {
  it.each(guardedEndpoints)(
    "$method $path returns 401 without a token",
    async ({ path, method }) => {
      const res = await call(path, method);
      expect(res.status).toBe(401);
    },
  );

  it.each(guardedEndpoints)(
    "$method $path is not 401 with a valid token",
    async ({ path, method }) => {
      const res = await call(path, method, { "x-act-internal-token": token! });
      expect(res.status).not.toBe(401);
    },
  );

  it.each(guardedPages)("%s returns 404 without a token", async (path) => {
    const res = await fetch(baseUrl + path, { redirect: "manual" });
    expect(res.status).toBe(404);
  });

  it.each(guardedPages)("%s is reachable with a token", async (path) => {
    const res = await fetch(baseUrl + path, {
      headers: { "x-act-internal-token": token! },
      redirect: "manual",
    });
    expect(res.status).toBe(200);
  });

  it("rejects a wrong token", async () => {
    const res = await fetch(baseUrl + "/admin", {
      headers: { "x-act-internal-token": "not-the-token" },
      redirect: "manual",
    });
    expect(res.status).toBe(404);
  });
});

if (!token) {
  describe("authorisation", () => {
    it.skip("SKIPPED: set ACT_INTERNAL_TOKEN on both server and test run", () => {});
  });
}
