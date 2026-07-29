import Link from "next/link";
import styles from "./FieldBrand.module.css";

export function FieldBrand({ href = "/prototypes/living-field", className = "" }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={`${styles.brand} ${className}`.trim()} aria-label="A Curious Tractor, return to the Living Field">
      {/* Exact mark used by act.place, retrieved from the live brand asset. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/branding/act-place-logo.png" alt="" aria-hidden="true" />
      <span>A Curious Tractor</span>
    </Link>
  );
}
