#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = (process.env.LAUNCH_CHECK_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const repoRoot = process.cwd();

const launchRoutes = [
  '/',
  '/about',
  '/projects',
  '/stories',
  '/stories/utopia-may-2026',
  '/goods',
  '/justicehub',
  '/empathy-ledger',
  '/harvest',
  '/farm',
  '/art',
  '/wiki',
  '/contact',
  '/blog',
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

if (failures.length > 0) {
  console.error(`Launch check failed against ${baseUrl}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Launch check passed against ${baseUrl}`);
console.log(`Checked ${routes.length} routes, h1s, metadata, stale CTAs, placeholder copy, consent leaks, and newsletter context tags.`);
