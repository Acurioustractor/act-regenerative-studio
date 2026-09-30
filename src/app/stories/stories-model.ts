import { cleanAltText } from "@/lib/editorial/article-html";
import { formatArticleType } from "@/lib/editorial/article-type";
import type { EditorialArticle } from "@/lib/empathy-ledger-editorial";
import { PROJECT_SLUG_TO_FIELD, fieldsForArticle } from "@/lib/fields/field-graph";

/**
 * What the stream on /stories is drawn from: the stories the Empathy Ledger feed returned, turned into plain rows.
 * Nothing here is written for the page. A count is a count of those rows, and a label is a name the article's own
 * fields already carry (through fieldsForArticle, so the curated assignments count too).
 */

export type Group = "justice" | "goods" | "empathy" | "harvest" | "land" | "art";

/** The order the filter runs in: Pencil's four projects and Land, then Art. */
export const GROUP_ORDER: Group[] = ["justice", "goods", "empathy", "harvest", "land", "art"];

/** The short names the stream has always used (the projects, not the field titles). */
export const GROUP_NAMES: Record<Group, string> = {
  justice: "JusticeHub",
  goods: "Goods",
  empathy: "Empathy Ledger",
  harvest: "The Harvest",
  land: "Land",
  art: "Art",
};

export type StreamRow = {
  slug: string;
  href: string;
  title: string;
  excerpt: string | null;
  /** A longer taste of the piece, for the lead. */
  excerptLong: string | null;
  author: string;
  /** The names over the title, "Across ACT" when the story belongs to none. */
  label: string;
  groups: Group[];
  photo: { src: string; alt: string } | null;
  /** The words on the tile a story without a photograph gets: what kind of piece it is. */
  tileWords: string | null;
};

/** Em and en dashes read as commas in the stream, as they always have; "a, b" not "a,b". */
const DASHES = new RegExp("\\s*[\\u2014\\u2013]\\s*", "g");
const publicText = (value: string) => value.replace(DASHES, ", ");

/** A card holds a taste of the piece, not the whole excerpt. Cut at a word, and say it was cut. */
export function clip(text: string, limit: number): string {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length <= limit + 10) return value;
  const cut = value.slice(0, limit).replace(/[\s,;:.\-]+\S*$/, "").replace(/[\s,;:.\-]+$/, "");
  return `${cut}…`;
}

/** The fields a story is part of, then Land if any of its projects is land, then Art, in the filter's order. */
export function groupsFor(article: EditorialArticle): Group[] {
  const fields = fieldsForArticle(article);
  const projects = fields.filter((id): id is Exclude<typeof id, "art"> => id !== "art");
  const land = (article.relatedProjectSlugs ?? []).some((slug) => PROJECT_SLUG_TO_FIELD[slug] === null);
  const groups: Group[] = [...projects, ...(land ? (["land"] as const) : []), ...(fields.includes("art") ? (["art"] as const) : [])];
  return groups.sort((a, b) => GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b));
}

export function rowFor(article: EditorialArticle): StreamRow {
  const groups = groupsFor(article);
  const source = article.excerpt ? publicText(article.excerpt) : "";
  const excerpt = source ? clip(source, 150) : "";
  const excerptLong = source ? clip(source, 240) : "";
  return {
    slug: article.slug,
    href: article.localPath,
    title: publicText(article.title),
    excerpt: excerpt || null,
    excerptLong: excerptLong || null,
    author: publicText(article.authorName || "A Curious Tractor"),
    label: groups.map((group) => GROUP_NAMES[group]).join(" · ") || "Across ACT",
    groups,
    photo: article.featuredImageUrl
      ? { src: article.featuredImageUrl, alt: cleanAltText(article.featuredImageAlt) }
      : null,
    tileWords: formatArticleType(article.articleType),
  };
}

export type StreamModel = {
  rows: StreamRow[];
  pills: Array<{ value: string; label: string }>;
  /** How many stories the feed returned. */
  storyCount: number;
  /** How many projects (Land counts as one, Art does not) those stories are part of. */
  projectCount: number;
  /** When every story has one author, that name (from the feed). Null when authors differ or are missing. */
  soleAuthor: string | null;
};

export function streamModel(articles: EditorialArticle[]): StreamModel {
  const rows = articles.map((article) => rowFor(article));
  const present = new Set(rows.flatMap((row) => row.groups));
  const authors = new Set(articles.map((article) => article.authorName?.trim() ?? ""));
  const [only] = [...authors];
  return {
    rows,
    pills: [
      { value: "all", label: "All" },
      ...GROUP_ORDER.filter((group) => present.has(group)).map((group) => ({ value: group, label: GROUP_NAMES[group] })),
    ],
    storyCount: rows.length,
    projectCount: GROUP_ORDER.filter((group) => group !== "art" && present.has(group)).length,
    soleAuthor: authors.size === 1 && only ? only : null,
  };
}
