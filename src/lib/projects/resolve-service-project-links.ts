import { projects } from "@/data/projects";
import {
  getCanonicalWikiProjectRecords,
  type CanonicalWikiProjectRecord,
} from "@/lib/wiki/canonical-project-wiki";
import type { LiveServiceRecord } from "@/lib/empathy-ledger-services";

export interface ResolvedServiceProjectLink {
  key: string;
  label: string;
  href: string | null;
  slug: string | null;
  code: string | null;
  source: "canonical-wiki" | "static-project" | "unresolved";
}

function normalizeValue(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findCanonicalRecord(
  record: { name: string; projectCode: string | null },
  canonicalRecords: CanonicalWikiProjectRecord[]
): CanonicalWikiProjectRecord | null {
  const codeKey = normalizeValue(record.projectCode);
  const nameKey = normalizeValue(record.name);

  if (codeKey) {
    const codeMatch = canonicalRecords.find(
      (candidate) =>
        normalizeValue(candidate.code) === codeKey ||
        normalizeValue(candidate.canonicalCode) === codeKey ||
        normalizeValue(candidate.slug) === codeKey
    );
    if (codeMatch) {
      return codeMatch;
    }
  }

  if (!nameKey) {
    return null;
  }

  return (
    canonicalRecords.find(
      (candidate) =>
        normalizeValue(candidate.title) === nameKey ||
        normalizeValue(candidate.slug) === nameKey ||
        normalizeValue(candidate.canonicalSlug) === nameKey ||
        normalizeValue(candidate.websiteSlug) === nameKey
    ) || null
  );
}

function resolveStaticSlug(
  record: { name: string; projectCode: string | null },
  preferredSlug: string | null
): string | null {
  const candidates = [
    preferredSlug,
    record.projectCode,
    record.name,
  ].map((value) => normalizeValue(value));

  const match = projects.find((project) => {
    const projectSlug = normalizeValue(project.slug);
    const projectTitle = normalizeValue(project.title);

    return candidates.some(
      (candidate) =>
        !!candidate && (candidate === projectSlug || candidate === projectTitle)
    );
  });

  return match?.slug || preferredSlug;
}

function resolveSingleServiceProjectLink(
  record: { name: string; projectCode: string | null },
  canonicalRecords: CanonicalWikiProjectRecord[]
): ResolvedServiceProjectLink {
  const canonicalRecord = findCanonicalRecord(record, canonicalRecords);
  const staticSlug = resolveStaticSlug(record, canonicalRecord?.slug || null);

  if (canonicalRecord || staticSlug) {
    const slug = staticSlug || canonicalRecord?.slug || null;

    return {
      key: `${record.projectCode || record.name}:${slug || "resolved"}`,
      label: canonicalRecord?.title || record.name,
      href: slug ? `/projects/${slug}` : canonicalRecord?.websitePath || null,
      slug,
      code: canonicalRecord?.canonicalCode || canonicalRecord?.code || record.projectCode || null,
      source: canonicalRecord ? "canonical-wiki" : "static-project",
    };
  }

  return {
    key: `${record.projectCode || record.name}:unresolved`,
    label: record.name,
    href: null,
    slug: null,
    code: record.projectCode || null,
    source: "unresolved",
  };
}

function dedupeResolvedLinks(
  links: ResolvedServiceProjectLink[]
): ResolvedServiceProjectLink[] {
  const seen = new Set<string>();

  return links.filter((link) => {
    const key = link.slug || normalizeValue(link.label) || link.key;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export async function resolveServiceProjectLinks(
  services: LiveServiceRecord[]
): Promise<Record<string, ResolvedServiceProjectLink[]>> {
  const canonicalRecords = await getCanonicalWikiProjectRecords();

  return Object.fromEntries(
    services.map((service) => [
      service.id,
      dedupeResolvedLinks(
        service.relatedProjects.map((record) =>
          resolveSingleServiceProjectLink(record, canonicalRecords)
        )
      ),
    ])
  );
}
