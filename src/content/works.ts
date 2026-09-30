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

export type Work = GeneratedArtPiece & {
  /** CONTAINED is ["justice", "art"]: part of JusticeHub, and a work in Art. */
  partOf: FieldId[];
};

function partOf(piece: GeneratedArtPiece): FieldId[] {
  const project = projects.find((p) => p.name === piece.connectedProject);
  return project ? [project.id, "art"] : ["art"];
}

export const works: Work[] = (artPiecesSnapshot as unknown as { pieces: GeneratedArtPiece[] }).pieces.map(
  (piece) => ({ ...piece, partOf: partOf(piece) }),
);
