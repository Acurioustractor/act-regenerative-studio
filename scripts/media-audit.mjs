#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const projectsPath = path.join(repoRoot, "src", "data", "projects.ts");

if (typeof fetch !== "function") {
  console.error("Fetch API not available. Use Node 18+ to run this script.");
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const asJson = args.has("--json");
const timeoutMs = 10000;

const readProjectsSource = () => {
  const raw = fs.readFileSync(projectsPath, "utf8");
  const startIndex = raw.indexOf("export const projects");
  if (startIndex === -1) {
    throw new Error("Could not find projects array in src/data/projects.ts");
  }
  return raw.slice(startIndex);
};

const extractField = (block, field) => {
  const match = block.match(
    new RegExp(`${field}:\\s*([\"'])([\\s\\S]*?)\\1`)
  );
  return match ? match[2].trim() : null;
};

const parseProjects = (source) => {
  const slugMatches = [...source.matchAll(/slug:\s*["']([^"']+)["']/g)];
  return slugMatches.map((match, index) => {
    const start = match.index ?? 0;
    const end =
      index + 1 < slugMatches.length
        ? slugMatches[index + 1].index ?? source.length
        : source.length;
    const block = source.slice(start, end);
    return {
      slug: extractField(block, "slug") ?? "unknown",
      title: extractField(block, "title") ?? "Untitled project",
      heroImage: extractField(block, "heroImage"),
      videoUrl: extractField(block, "videoUrl"),
    };
  });
};

const fetchWithTimeout = async (url, options) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

const checkUrl = async (url) => {
  const attempts = [
    { method: "HEAD" },
    { method: "GET", headers: { Range: "bytes=0-0" } },
  ];

  for (const attempt of attempts) {
    try {
      const response = await fetchWithTimeout(url, {
        method: attempt.method,
        headers: attempt.headers,
        redirect: "follow",
      });

      if (response.ok) {
        return {
          ok: true,
          status: response.status,
          method: attempt.method,
          contentType: response.headers.get("content-type"),
        };
      }

      if (response.status === 405 || response.status === 403) {
        continue;
      }

      return {
        ok: false,
        status: response.status,
        method: attempt.method,
        contentType: response.headers.get("content-type"),
      };
    } catch (error) {
      if (attempt.method === "GET") {
        return {
          ok: false,
          status: null,
          method: attempt.method,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }
  }

  return {
    ok: false,
    status: null,
    method: "HEAD",
    error: "No successful request",
  };
};

const formatList = (items) =>
  items.length === 0 ? "None" : items.map((item) => `- ${item}`).join("\n");

const run = async () => {
  const source = readProjectsSource();
  const projects = parseProjects(source);

  const missingHero = projects.filter((item) => !item.heroImage);
  const missingVideo = projects.filter((item) => !item.videoUrl);

  const urlEntries = [];
  projects.forEach((project) => {
    if (project.heroImage) {
      urlEntries.push({
        slug: project.slug,
        title: project.title,
        type: "heroImage",
        url: project.heroImage,
      });
    }
    if (project.videoUrl) {
      urlEntries.push({
        slug: project.slug,
        title: project.title,
        type: "videoUrl",
        url: project.videoUrl,
      });
    }
  });

  const cache = new Map();
  const results = [];

  for (const entry of urlEntries) {
    if (!cache.has(entry.url)) {
      cache.set(entry.url, await checkUrl(entry.url));
    }
    results.push({
      ...entry,
      ...cache.get(entry.url),
    });
  }

  const failed = results.filter((result) => !result.ok);

  if (asJson) {
    const payload = {
      summary: {
        totalProjects: projects.length,
        heroImages: projects.length - missingHero.length,
        videos: projects.length - missingVideo.length,
        missingHero: missingHero.length,
        missingVideo: missingVideo.length,
        urlChecks: results.length,
        failedUrls: failed.length,
      },
      missingHero: missingHero.map((item) => ({
        slug: item.slug,
        title: item.title,
      })),
      missingVideo: missingVideo.map((item) => ({
        slug: item.slug,
        title: item.title,
      })),
      failed,
    };
    console.log(JSON.stringify(payload, null, 2));
    process.exitCode = failed.length > 0 ? 1 : 0;
    return;
  }

  console.log("Media audit for src/data/projects.ts");
  console.log("");
  console.log(`Projects: ${projects.length}`);
  console.log(`Hero images: ${projects.length - missingHero.length}`);
  console.log(`Videos: ${projects.length - missingVideo.length}`);
  console.log(`Missing hero images: ${missingHero.length}`);
  console.log(`Missing videos: ${missingVideo.length}`);
  console.log("");
  console.log("Missing hero images:");
  console.log(formatList(missingHero.map((item) => `${item.title} (${item.slug})`)));
  console.log("");
  console.log("Missing videos:");
  console.log(formatList(missingVideo.map((item) => `${item.title} (${item.slug})`)));
  console.log("");
  console.log(`URL checks: ${results.length}`);
  console.log(`Failed URLs: ${failed.length}`);
  if (failed.length > 0) {
    console.log("");
    console.log("Failed URL details:");
    failed.forEach((item) => {
      console.log(
        `- ${item.type} | ${item.title} (${item.slug}) | ${item.url} | status: ${
          item.status ?? "n/a"
        } | method: ${item.method}${item.error ? ` | error: ${item.error}` : ""}`
      );
    });
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error("Media audit failed:", error);
  process.exit(1);
});
