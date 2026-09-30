import Link from "next/link";
import { Wheel, rolls } from "./Onward";
import { RustSquare } from "./Small";
import styles from "./part-of.module.css";

/** Every item says what it is part of (Pencil: Part of, RKSFG). */
export function PartOf({ name, href }: { name: string; href: string }) {
  return (
    <Link href={href} className={`${styles.partOf} ${rolls}`}>
      <RustSquare size={7} />
      <span>Part of {name}</span>
      <Wheel />
    </Link>
  );
}
