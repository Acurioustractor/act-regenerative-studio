#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const baseUrl = (
  process.env.LAUNCH_CHECK_BASE_URL || "http://localhost:3001"
).replace(/\/$/, "");
const repoRoot = process.cwd();

// Every static route in the editorial public site. Dynamic article, art and
// question pages are covered through sitemap drift checks and the focused Living
// Field QA. Keep this list aligned with src/app/sitemap.ts.
const launchRoutes = [
  "/",
  "/confessions",
  "/confessions/listen",
  "/confessions/friday",
  "/confessions/method",
  "/stories",
  "/questions",
  "/fields/art",
  "/fields/empathy",
  "/fields/justice",
  "/fields/goods",
  "/fields/harvest",
  "/stories/utopia-may-2026",
  "/stories/the-spirit-must-be-strong",
  "/art",
  "/harvest",
  "/about",
  "/contact",
  "/harvest/csa",
  "/harvest/produce",
  "/art/artists",
  "/art/artworks",
  "/art/commissions",
  "/art/exhibitions",
  "/art/residencies",
  "/privacy",
  "/terms",
];

function stripScriptsAndStyles(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");
}

function getTagAttr(tag, attr) {
  const match = tag.match(new RegExp(`${attr}=["']([^"']+)["']`, "i"));
  return match?.[1] || null;
}

function getCanonicalHref(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (getTagAttr(tag, "rel") === "canonical") return getTagAttr(tag, "href");
  }
  return null;
}

function getOgUrl(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (getTagAttr(tag, "property") === "og:url")
      return getTagAttr(tag, "content");
  }
  return null;
}

function pathFromHref(href) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).pathname || "/";
  } catch {
    return href;
  }
}

// Syndicated editorial articles point canonical and og:url at Empathy Ledger,
// the master copy, on purpose. The path-equality checks below only apply to
// same-host metadata; an off-site canonical is the syndication design, not
// drift. "The site's host" cannot be baseUrl's host — the gate runs against
// localhost while pages emit their production host — so it is read once from
// the homepage's own canonical, which always points at the site itself.
let siteHost = null;
async function resolveSiteHost() {
  try {
    const response = await fetch(`${baseUrl}/`);
    const canonical = getCanonicalHref(await response.text());
    if (canonical) return new URL(canonical, baseUrl).host;
  } catch {
    // fall through to baseUrl's host
  }
  return new URL(baseUrl).host;
}

function isOffSiteHref(href) {
  if (!href) return false;
  try {
    return new URL(href, baseUrl).host !== siteHost;
  } catch {
    return false;
  }
}

// The stale-reference scan below must not fire on the site's own address.
// Canonical and og:url tags emit the site host on every page, so once the site
// lives at act.place — the domain the launch cuts over to, whose old routes
// config/launch-redirects.cjs already maps — every page would fail a rule meant
// to catch links back to the *old* site. Strip the site's own origin first.
// The other form of the domain still fails: if the site is the apex, a
// www.act.place link survives this and trips the pattern, which is right,
// because that is an avoidable redirect hop.
function withoutSelfOrigin(html) {
  if (!siteHost) return html;
  const escaped = siteHost.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`https?://${escaped}(?![\\w-])`, "gi"), "");
}

function failIf(condition, failures, route, message) {
  if (condition) failures.push(`${route}: ${message}`);
}

async function checkRoute(route) {
  const failures = [];
  const url = `${baseUrl}${route}`;
  let response;
  let html;

  try {
    response = await fetch(url);
    html = await response.text();
  } catch (error) {
    return [`${route}: request failed: ${error.message}`];
  }

  failIf(
    response.status !== 200,
    failures,
    route,
    `expected 200, got ${response.status}`,
  );

  const visibleHtml = stripScriptsAndStyles(html);
  const visibleText = visibleHtml.replace(/<[^>]+>/g, " ");
  const h1Count = (visibleHtml.match(/<h1\b/gi) || []).length;
  failIf(
    h1Count !== 1,
    failures,
    route,
    `expected exactly one h1, found ${h1Count}`,
  );

  const canonicalHref = getCanonicalHref(html);
  const ogUrl = getOgUrl(html);
  const finalPath = response.url ? new URL(response.url).pathname : route;
  const expectedPath = finalPath === "/" ? "/" : finalPath.replace(/\/$/, "");

  // fetch follows redirects, and everything below is then judged against wherever
  // it landed: a route that quietly became a redirect passed with the
  // destination's h1, canonical and og:url standing in for its own. These routes
  // are the launch set, so each must answer for itself. /confessions/wall reached
  // production this way, 307ing to /confessions/listen while still sitting in
  // this list and in the sitemap.
  const requestedPath = route === "/" ? "/" : route.replace(/\/$/, "");
  failIf(
    expectedPath !== requestedPath,
    failures,
    route,
    `expected to serve its own page, redirected to ${expectedPath}`,
  );
  const canonicalPath = pathFromHref(canonicalHref);
  const ogPath = pathFromHref(ogUrl);

  failIf(!canonicalHref, failures, route, "missing canonical metadata");
  failIf(!ogUrl, failures, route, "missing og:url metadata");
  failIf(
    !isOffSiteHref(canonicalHref) &&
      canonicalPath &&
      canonicalPath.replace(/\/$/, "") !== expectedPath.replace(/\/$/, ""),
    failures,
    route,
    `canonical points to ${canonicalHref}, expected ${expectedPath}`,
  );
  failIf(
    !isOffSiteHref(ogUrl) &&
      ogPath &&
      ogPath.replace(/\/$/, "") !== expectedPath.replace(/\/$/, ""),
    failures,
    route,
    `og:url points to ${ogUrl}, expected ${expectedPath}`,
  );

  // Host patterns end at a hostname boundary so act.placeholder.com and the
  // like cannot masquerade as the old site.
  const stalePatterns = [
    /www\.act\.place(?![\w-])/i,
    /https?:\/\/act\.place(?![\w-])/i,
    /2025[- ]review/i,
    /year[- ]in[- ]review/i,
  ];
  const staleScope = withoutSelfOrigin(visibleHtml);
  for (const pattern of stalePatterns) {
    failIf(
      pattern.test(staleScope),
      failures,
      route,
      `stale launch reference matched ${pattern}`,
    );
  }

  const placeholderPatterns = [
    /coming soon/i,
    /still being prepared/i,
    /still being surfaced/i,
    /placeholder/i,
    /GHL embed/i,
  ];
  for (const pattern of placeholderPatterns) {
    failIf(
      pattern.test(visibleText),
      failures,
      route,
      `placeholder/internal copy matched ${pattern}`,
    );
  }

  if (route === "/stories/utopia-may-2026") {
    const consentLeakPatterns = [
      /Internal preview/i,
      /Consent:\s*pending/i,
      /Reserved consent-pending voice layer/i,
      /Mykel/i,
    ];
    for (const pattern of consentLeakPatterns) {
      failIf(
        pattern.test(visibleText),
        failures,
        route,
        `pending-consent story content matched ${pattern}`,
      );
    }
  }

  return failures;
}

function checkNewsletterSource() {
  const sourcePath = path.join(
    repoRoot,
    "src/components/forms/NewsletterForm.tsx",
  );
  const source = fs.readFileSync(sourcePath, "utf8");
  const required = [
    "formType: 'newsletter'",
    "signupRoute: pathname",
    "signupPlacement: source",
    "`source:website-${source}`",
    "`source:page:${projectSlug}`",
    "`source:story:${storySlug}`",
    "`interest:${audience}`",
  ];
  return required
    .filter((needle) => !source.includes(needle))
    .map((needle) => `NewsletterForm: missing payload tag source ${needle}`);
}

// Drift guard: every top-level static route the sitemap exposes must be in the
// launch gate, so a new public page can't ship indexed but unchecked. Dynamic
// detail pages live two segments deep and are covered by template + samples.
async function checkSitemapCoverage(covered) {
  let xml;
  try {
    const response = await fetch(`${baseUrl}/sitemap.xml`);
    xml = await response.text();
  } catch (error) {
    return [`sitemap.xml: request failed: ${error.message}`];
  }

  const failures = [];
  const seen = new Set();
  for (const loc of xml.match(/<loc>[^<]+<\/loc>/g) || []) {
    const href = loc.replace(/<\/?loc>/g, "").trim();
    let pathname;
    try {
      pathname = new URL(href).pathname.replace(/\/$/, "") || "/";
    } catch {
      continue;
    }
    const depth =
      pathname === "/" ? 0 : pathname.split("/").filter(Boolean).length;
    if (depth <= 1 && !covered.has(pathname) && !seen.has(pathname)) {
      seen.add(pathname);
      failures.push(
        `sitemap coverage: ${pathname} is in the sitemap but missing from the launch gate (add it to launchRoutes so its metadata is checked)`,
      );
    }
  }
  return failures;
}

const failures = [];

siteHost = await resolveSiteHost();

for (const route of launchRoutes) {
  failures.push(...(await checkRoute(route)));
}

failures.push(...checkNewsletterSource());
failures.push(...(await checkSitemapCoverage(new Set(launchRoutes))));

if (failures.length > 0) {
  console.error(`Launch check failed against ${baseUrl}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Launch check passed against ${baseUrl}`);
console.log(
  `Checked ${launchRoutes.length} routes, h1s, metadata, stale CTAs, placeholder copy, consent leaks, newsletter context tags, and sitemap coverage.`,
);
