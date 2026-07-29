"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldBrand } from "@/components/prototypes/FieldBrand";
import styles from "./editorial-header.module.css";

const links = [
  ["Fields", "/#fields"],
  ["Stories", "/stories"],
  ["Art", "/art"],
  ["Visit", "/harvest"],
  ["Field notes", "/questions"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function EditorialHeader({ homeHref = "/" }: { homeHref?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={styles.header}>
      <FieldBrand className={styles.wordmark} href={homeHref} />
      <button className={styles.menuButton} type="button" aria-expanded={open} aria-controls="editorial-site-menu" aria-label={open ? "Close site menu" : "Open site menu"} onClick={() => setOpen((value) => !value)}>
        <span /><span />
      </button>
      <nav id="editorial-site-menu" className={open ? styles.open : ""} aria-label="A Curious Tractor">
        {links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>
    </header>
  );
}

export function PageRail({ label, links: pageLinks }: { label: string; links: ReadonlyArray<readonly [string, string]> }) {
  return (
    <nav className={styles.pageRail} aria-label={`${label} sections`}>
      <span>{label}</span>
      <div>{pageLinks.map(([text, href]) => <a key={href} href={href}>{text}</a>)}</div>
    </nav>
  );
}
