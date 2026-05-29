#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = (process.env.LAUNCH_CHECK_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const repoRoot = process.cwd();

// Every static public route in the sitemap. Dynamic detail pages (/projects/*,
// /wiki/*, /storytellers/*, /art/<slug>, /blog/*) are added separately below and
// policed for drift by checkSitemapCoverage(). Keep this in sync with the static
// routes in src/app/sitemap.ts.
const launchRoutes = [
  '/',
  '/confessions',
  '/projects',
  '/stories',
  '/stories/utopia-may-2026',
  // Launch hold (2026-05-27): /storytellers held — see config/launch-redirects.cjs
  '/art',
  '/farm',
  '/harvest',
  '/goods',
  '/empathy-ledger',
  '/justicehub',
  '/ecosystem',
  '/method',
  // Launch hold (2026-05-27): /wiki held — see config/launch-redirects.cjs
  '/about',
  '/vision',
  '/principles',
  '/how-we-work',
  '/governance',
  '/studio',
  '/impact',
  '/partners',
  '/events',
  '/contact',
  '/blog',
  '/media',
  // Launch hold (2026-05-29): /people held (internal bio notes leaking); see config/launch-redirects.cjs
  // Launch hold (2026-05-27): /ask held — see config/launch-redirects.cjs
  '/farm/stay',
  '/farm/retreats',
  '/farm/workshops',
  '/harvest/csa',
  '/harvest/produce',
  '/art/artists',
  '/art/artworks',
  '/art/commissions',
  '/art/exhibitions',
  '/art/residencies',
  '/privacy',
  '/terms',
];

function readProjectRoutes() {
  const filePath = path.join(repoRoot, 'src/data/wiki-projects.generated.json');
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.from(
      new Set(
        (parsed.projects || [])
          .map((project) => project?.slug)
          .filter(Boolean)
          .map((slug) => `/projects/${slug}`)
      )
    );
  } catch (error) {
    return {
      error: `Unable to read generated project routes from ${filePath}: ${error.message}`,
      routes: [],
    };
  }
}

function stripScriptsAndStyles(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
}

function getTagAttr(tag, attr) {
  const match = tag.match(new RegExp(`${attr}=["']([^"']+)["']`, 'i'));
  return match?.[1] || null;
}

function getCanonicalHref(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (getTagAttr(tag, 'rel') === 'canonical') return getTagAttr(tag, 'href');
  }
  return null;
}

function getOgUrl(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (getTagAttr(tag, 'property') === 'og:url') return getTagAttr(tag, 'content');
  }
  return null;
}

function pathFromHref(href) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).pathname || '/';
  } catch {
    return href;
  }
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

  failIf(response.status !== 200, failures, route, `expected 200, got ${response.status}`);

  const visibleHtml = stripScriptsAndStyles(html);
  const visibleText = visibleHtml.replace(/<[^>]+>/g, ' ');
  const h1Count = (visibleHtml.match(/<h1\b/gi) || []).length;
  failIf(h1Count !== 1, failures, route, `expected exactly one h1, found ${h1Count}`);

  const canonicalHref = getCanonicalHref(html);
  const ogUrl = getOgUrl(html);
  const finalPath = response.url ? new URL(response.url).pathname : route;
  const expectedPath = finalPath === '/' ? '/' : finalPath.replace(/\/$/, '');
  const canonicalPath = pathFromHref(canonicalHref);
  const ogPath = pathFromHref(ogUrl);

  failIf(!canonicalHref, failures, route, 'missing canonical metadata');
  failIf(!ogUrl, failures, route, 'missing og:url metadata');
  failIf(
    canonicalPath && canonicalPath.replace(/\/$/, '') !== expectedPath.replace(/\/$/, ''),
    failures,
    route,
    `canonical points to ${canonicalHref}, expected ${expectedPath}`
  );
  failIf(
    ogPath && ogPath.replace(/\/$/, '') !== expectedPath.replace(/\/$/, ''),
    failures,
    route,
    `og:url points to ${ogUrl}, expected ${expectedPath}`
  );

  const stalePatterns = [
    /www\.act\.place/i,
    /https?:\/\/act\.place/i,
    /2025[- ]review/i,
    /year[- ]in[- ]review/i,
  ];
  for (const pattern of stalePatterns) {
    failIf(pattern.test(visibleHtml), failures, route, `stale launch reference matched ${pattern}`);
  }

  const placeholderPatterns = [
    /coming soon/i,
    /still being prepared/i,
    /still being surfaced/i,
    /placeholder/i,
    /GHL embed/i,
  ];
  for (const pattern of placeholderPatterns) {
    failIf(pattern.test(visibleText), failures, route, `placeholder/internal copy matched ${pattern}`);
  }

  if (route === '/stories/utopia-may-2026') {
    const consentLeakPatterns = [
      /Internal preview/i,
      /Consent:\s*pending/i,
      /Reserved consent-pending voice layer/i,
      /Mykel/i,
    ];
    for (const pattern of consentLeakPatterns) {
      failIf(pattern.test(visibleText), failures, route, `pending-consent story content matched ${pattern}`);
    }
  }

  return failures;
}

function checkNewsletterSource() {
  const sourcePath = path.join(repoRoot, 'src/components/forms/NewsletterForm.tsx');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const required = [
    "'Newsletter'",
    '`Route: ${pathname}`',
    '`Source: ${source}`',
    '`Audience: ${audience}`',
    '`Project: ${projectSlug}`',
    '`Story: ${storySlug}`',
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
    const href = loc.replace(/<\/?loc>/g, '').trim();
    let pathname;
    try {
      pathname = new URL(href).pathname.replace(/\/$/, '') || '/';
    } catch {
      continue;
    }
    const depth = pathname === '/' ? 0 : pathname.split('/').filter(Boolean).length;
    if (depth <= 1 && !covered.has(pathname) && !seen.has(pathname)) {
      seen.add(pathname);
      failures.push(
        `sitemap coverage: ${pathname} is in the sitemap but missing from the launch gate (add it to launchRoutes so its metadata is checked)`
      );
    }
  }
  return failures;
}

const projectRouteResult = readProjectRoutes();
const projectRoutes = Array.isArray(projectRouteResult)
  ? projectRouteResult
  : projectRouteResult.routes;
const routes = Array.from(new Set([...launchRoutes, ...projectRoutes]));

const failures = [];
if (!Array.isArray(projectRouteResult) && projectRouteResult.error) {
  failures.push(projectRouteResult.error);
}

for (const route of routes) {
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
console.log(`Checked ${routes.length} routes, h1s, metadata, stale CTAs, placeholder copy, consent leaks, newsletter context tags, and sitemap coverage.`);
