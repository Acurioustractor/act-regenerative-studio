import { arrangement, brand, type PartColour, type PartRole, type Piece } from "@/brand/brand";
import styles from "./parts.module.css";

// The four parts in any arrangement from brand.json, drawn flat and fitted into the box, as
// ~/Documents/ACT_manifesto_assets/scripts/parts.js draws them in Pencil. Colours follow the surface: ink is the
// foreground, paper the ground, and the one accent part is rust.

const FILL: Record<PartColour, string> = { ink: "var(--fg)", accent: "var(--accent)", paper: "var(--bg)" };

type Unhitched = {
  trailer: Piece[];
  tractorOffsetX: number;
};

function piecesOf(name: string): Piece[] {
  if (name !== "unhitched") return arrangement(name).parts;
  // The tractor leaves and the rust part stays: the trailer is rust, so the tractor is all ink.
  const scene = brand.scenes.unhitched as Unhitched;
  const tractor = arrangement("tractor").parts.map((p) => ({ ...p, x: p.x + scene.tractorOffsetX, colour: "ink" as const }));
  return [...scene.trailer, ...tractor];
}

/** Move the rust to another part, or take it away, as the header's doors and the menu do. */
function recolour(pieces: Piece[], rust: PartRole | "none"): Piece[] {
  return pieces.map((p) => {
    if (p.colour === "paper" || !(p.role in brand.partMeanings)) return p;
    return { ...p, colour: rust !== "none" && p.role === rust ? "accent" : "ink" };
  });
}

export function Parts({
  name = "tractor",
  rust,
  label,
  className,
}: {
  /** An arrangement in brand.json (tractor, bed, container, ...) or "unhitched". */
  name?: string;
  rust?: PartRole | "none";
  /** Read aloud in place of the drawing. Leave out when the drawing is decoration. */
  label?: string;
  className?: string;
}) {
  const pieces = rust ? recolour(piecesOf(name), rust) : piecesOf(name);
  const minX = Math.min(...pieces.map((p) => p.x));
  const minY = Math.min(...pieces.map((p) => p.y));
  const maxX = Math.max(...pieces.map((p) => p.x + p.w));
  const maxY = Math.max(...pieces.map((p) => p.y + p.h));

  return (
    <svg
      className={[styles.parts, className].filter(Boolean).join(" ")}
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {pieces.map((p, i) => {
        // Pencil turns a part counter-clockwise about its top-left corner; SVG turns clockwise.
        const transform = p.rotate ? `rotate(${-p.rotate} ${p.x} ${p.y})` : undefined;
        const common = { fill: FILL[p.colour], transform, "data-part": p.role };
        return p.shape === "round" ? (
          <ellipse key={i} cx={p.x + p.w / 2} cy={p.y + p.h / 2} rx={p.w / 2} ry={p.h / 2} {...common} />
        ) : (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} {...common} />
        );
      })}
    </svg>
  );
}
