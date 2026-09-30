import Link from "next/link";
import { Wheel, rolls } from "./Onward";
import { RustSquare } from "./Small";
import styles from "./part-of.module.css";

/**
 * Every item says what it is part of (Pencil: Part of, RKSFG). `bare` drops the "Part of" words from the chip, for a
 * row of them under one "Part of" label, as an article draws its fields.
 */
export function PartOf({ name, href, bare = false }: { name: string; href: string; bare?: boolean }) {
  return (
    <Link href={href} className={`${styles.partOf} ${rolls}`}>
      <RustSquare size={7} />
      <span>{bare ? name : `Part of ${name}`}</span>
      <Wheel />
    </Link>
  );
}
