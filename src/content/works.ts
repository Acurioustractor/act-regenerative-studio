// The works in Art. The list is src/data/art-pieces.generated.json, which scripts/sync-art-pieces.mjs builds from
// the ACT project record and each piece's wiki page, so nothing about a piece is typed here. What this adds is where
// each work sits: the project it grows through, when that is one of the four, and then Art, which every work is in.
import artPiecesSnapshot from "@/data/art-pieces.generated.json";
import { projects, type FieldId } from "./fields";

/** One piece as scripts/sync-art-pieces.mjs writes it. */
export interface GeneratedArtPiece {
  code: string;
  slug: string;
  aliases: string[];
  title: string;
  quote: string;
  description: string;
  philosophy: string | null;
  impact: string | null;
  mediums: string[];
  tags: string[];
  status: string;
  lcaaStages: string[];
  year: string | null;
  location: string | null;
  connectedProject: string | null;
  connectedProjectHref: string | null;
  elSlugs: string[];
}

/**
 * How a work is shown where the side pages of /art lead with it. act.place's own words, moved unchanged from
 * src/lib/works/live-featured-works.ts. The title is the work's own, from the record.
 */
export type FeaturedWords = {
  href: string;
  medium: string;
  place: string;
  collaborators: string;
  connectedTo: string;
  connectedHref?: string;
  fallbackDescription: string;
  fallbackQuote: string;
};

/** The four works those pages lead with, in the order they show. Each must be one of the works. */
export const FEATURED_WORDS: Record<string, FeaturedWords> = {
  "gold-phone": {
    href: "/projects/gold-phone",
    medium: "Interactive voice work",
    place: "Distributed / digital",
    collaborators: "Empathy Ledger / ACT Studio",
    connectedTo: "Empathy Ledger",
    connectedHref: "/projects/empathy-ledger",
    fallbackDescription:
      "A participatory work where voice arrives as encounter rather than content, allowing testimony to move through space slowly and with tension.",
    fallbackQuote: "Move your cursor over a voice particle to hear it.",
  },
  contained: {
    href: "/projects/contained",
    medium: "Experiential installation",
    place: "Justice and public-space contexts",
    collaborators: "JusticeHub / ACT Studio",
    connectedTo: "JusticeHub",
    connectedHref: "/projects/justicehub",
    fallbackDescription:
      "An installation exploring detention, alternatives, and the emotional architecture of confinement.",
    fallbackQuote:
      "Some systems can only be understood once they are felt in the body.",
  },
  "uncle-allan-palm-island-art": {
    href: "/projects/uncle-allan-palm-island-art",
    medium: "Art practice and cultural knowledge sharing",
    place: "Palm Island",
    collaborators: "Uncle Allan / ACT",
    connectedTo: "Works",
    connectedHref: "/art",
    fallbackDescription:
      "A body of work grounded in cultural memory, authority, and the passing on of story through image and material practice.",
    fallbackQuote: "Art is one of the ways story stays in community hands.",
  },
  "the-confessional": {
    href: "/projects/the-confessional",
    medium: "Storytelling installation",
    place: "Public and event contexts",
    collaborators: "ACT Studio",
    connectedTo: "Works",
    connectedHref: "/art",
    fallbackDescription:
      "A work for anonymous truth-telling, pressure release, and the public handling of what systems teach people to hide.",
    fallbackQuote:
      "Some truths only come out when anonymity creates enough safety to speak.",
  },
};

export type Work = GeneratedArtPiece & {
  /** CONTAINED is ["justice", "art"]: part of JusticeHub, and a work in Art. */
  partOf: FieldId[];
  featured?: FeaturedWords;
};

function partOf(piece: GeneratedArtPiece): FieldId[] {
  const project = projects.find((p) => p.name === piece.connectedProject);
  return project ? [project.id, "art"] : ["art"];
}

export const works: Work[] = (artPiecesSnapshot as unknown as { pieces: GeneratedArtPiece[] }).pieces.map(
  (piece) => ({
    ...piece,
    partOf: partOf(piece),
    ...(FEATURED_WORDS[piece.slug] && { featured: FEATURED_WORDS[piece.slug] }),
  }),
);

/** The featured works, in the order they show. */
export const featuredWorks = Object.keys(FEATURED_WORDS).flatMap((slug) => {
  const work = works.find((w) => w.slug === slug);
  return work?.featured ? [{ ...work, featured: work.featured }] : [];
});
