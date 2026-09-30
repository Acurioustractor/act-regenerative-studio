// What the two Art pages (/art and /art/[slug]) say about a work, worked out from the work's record. The words are the
// record's own (src/content/works.ts, hydrated in ./art-portfolio); this file only chooses, shortens and labels them.
import { fieldHref, fieldsById, works, type FieldId } from "@/content";
import { cleanPublicBrandText } from "@/lib/brand/public-copy";
import type { ArtMedium, ArtStatus, HydratedArtProject } from "./art-portfolio";

/** Public text from the record: the brand's spellings, no dashes. Empty when there is nothing. */
export function clean(value: string | null | undefined): string {
  return cleanPublicBrandText(value) ?? "";
}

const MEDIUMS: Record<ArtMedium, string> = {
  photography: "Photography",
  installation: "Installation",
  interactive: "Interactive",
  performance: "Performance",
  sculpture: "Sculpture",
  painting: "Painting",
  exhibition: "Exhibition",
  residency: "Residency",
  making: "Making",
  film: "Film",
};

export const mediumLabel = (medium: ArtMedium): string => MEDIUMS[medium] || medium;

const STATUSES: Record<ArtStatus, string> = {
  exhibited: "Exhibited",
  active: "Active",
  ideation: "In development",
  concept: "Concept",
};

export const statusLabel = (status: ArtStatus): string => STATUSES[status] || status;

/** "2022–present" reads "2022 to present", as Pencil sets it. */
export function readYear(year: string | null | undefined): string {
  return (year ?? "").replace(/\s*[–—-]\s*/g, " to ").trim();
}

/** The first `max` characters of a text, cut at a word, with an ellipsis (Pencil cuts the featured descriptions at 200). */
export function shorten(text: string, max = 200): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/**
 * A figure: a number that is a claim. The same test as src/content/content.test.ts, which lists the known unsourced ones:
 * dates and names with a number in them ("10x10") are not figures.
 */
const FIGURE = /(?<![\w])\d[\d,]*(?:\.\d+)?%?(?![\w])/g;

export function hasFigure(text: string): boolean {
  return [...text.matchAll(FIGURE)].some((m) => !/^(19|20)\d\d$/.test(m[0].replace(/,$/, "")));
}

/** The sentences of a text that carry no figure. A figure with no named source does not render, so its sentence goes. */
export function sentencesWithoutFigures(text: string | null | undefined): string[] {
  return clean(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && !hasFigure(sentence));
}

/** A work's words as one text, without the sentences that carry an unsourced figure. */
export const withoutFigures = (text: string | null | undefined): string => sentencesWithoutFigures(text).join(" ");

/** The lines of a work's "what it did" that can stand without a source ("2,491 self-directed portraits captured" cannot). */
export const impactLines = (impact: string | null | undefined): string[] => sentencesWithoutFigures(impact);

/**
 * The order Pencil sets the works in (Page 05 · Art, Featured works and Works still forming). The record keeps its
 * pieces by slug, which is not an order anyone chose; works Pencil does not place follow, in the record's order.
 */
const PORTFOLIO_ORDER = [
  "redtape",
  "the-caravan",
  "picc-photo-kiosk",
  "gold-phone",
  "confessions-to-philanthropy",
  "the-confessional",
  "contained",
  "uncle-allan-palm-island-art",
  "caring-for-those-who-care",
  "treacher",
  "the-vagina",
  "regional-arts-fellowship",
  "cars-and-microcontrollers",
];

export function inPortfolioOrder<T extends { slug: string }>(list: T[]): T[] {
  const rank = (slug: string) => {
    const i = PORTFOLIO_ORDER.indexOf(slug);
    return i === -1 ? PORTFOLIO_ORDER.length : i;
  };
  // Array.prototype.sort is stable, so works that share a rank keep the record's order.
  return [...list].sort((a, b) => rank(a.slug) - rank(b.slug));
}

/** Where a work's own photograph is, when Empathy Ledger has one. */
export function heroPhoto(project: HydratedArtProject): { src: string; alt: string } | null {
  const hero = project.heroImage;
  const src = hero?.url || hero?.thumbnail_url;
  if (!hero || !src || (hero.kind && hero.kind !== "image")) return null;
  return { src, alt: hero.alt || project.title };
}

/**
 * A picture at the width its slot needs. Empathy Ledger serves originals of up to two megabytes, and some are HEIC, which
 * most browsers cannot show; its media address takes `?w=` and answers with a JPEG that wide. Pictures on this site
 * already are the right size, and an address that is not Empathy Ledger's is left as it is.
 */
export function sized(src: string, width: number): string {
  return /^https:\/\/(www\.)?empathyledger\.com\/api\/media\//.test(src)
    ? `${src}${src.includes("?") ? "&" : "?"}w=${width}`
    : src;
}

export type PartOfChip = { label: string; href: string };

/**
 * What a work is part of, the project first. The projects are the work's own (src/content/works.ts partOf); where the
 * record also names a home with an address of its own (Confessions to Philanthropy, PICC), that stays as it was. A work
 * that belongs to no project is part of Art, so no work stands without saying what it is part of.
 */
export function partOfChips(project: HydratedArtProject): PartOfChip[] {
  const chips: PartOfChip[] = fieldsOf(project)
    .filter((id) => fieldsById[id].kind === "project")
    .map((id) => ({ label: fieldsById[id].name, href: fieldHref(id) }));

  const named = clean(project.connectedProject);
  if (named && project.connectedProjectHref && !chips.some((c) => c.label.toLowerCase() === named.toLowerCase())) {
    chips.push({ label: named, href: project.connectedProjectHref });
  }
  return chips.length ? chips : [{ label: fieldsById.art.name, href: fieldHref("art") }];
}

/** The fields a work is part of (src/content/works.ts): its project, when it has one, and Art. */
export function fieldsOf(project: HydratedArtProject): FieldId[] {
  return works.find((w) => w.slug === project.slug)?.partOf ?? ["art"];
}

/** The project a work grows through, by name, for the line above its title on /art. */
export function projectName(project: HydratedArtProject): string | null {
  const id = fieldsOf(project).find((f) => fieldsById[f].kind === "project");
  return id ? fieldsById[id].name : null;
}

/**
 * How big the loud title can be for these words: the loud face is narrow, so a short name fills the page and a long one
 * has to come down to fit on a few lines.
 */
export function titleSize(title: string): "xl" | "l" | "m" {
  const longest = Math.max(...title.split(/\s+/).map((word) => word.length));
  if (title.length <= 10) return "xl";
  if (title.length <= 18 && longest <= 10) return "l";
  return "m";
}

/**
 * Works to lead on from another: the ones in the same project first, then the other featured works, in the order the
 * portfolio keeps them. `featured` is the works with something to show (splitFeaturedAndEmerging), so every card has a
 * photograph, a drawing or a name.
 */
export function relatedWorks(project: HydratedArtProject, featured: HydratedArtProject[], count = 3): HydratedArtProject[] {
  const projectsOf = (slug: string) =>
    works.find((w) => w.slug === slug)?.partOf.filter((id) => fieldsById[id].kind === "project") ?? [];
  const mine = projectsOf(project.slug);
  const others = featured.filter((p) => p.slug !== project.slug);
  const together = others.filter((p) => projectsOf(p.slug).some((id) => mine.includes(id)));
  return [...together, ...others.filter((p) => !together.includes(p))].slice(0, count);
}
