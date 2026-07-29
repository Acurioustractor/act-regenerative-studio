"use client";

import { usePathname } from "next/navigation";

const editorialRoots = [
  "/stories",
  "/blog",
  "/questions",
  "/fields",
  "/art",
  "/harvest",
  "/about",
  "/contact",
];

export function SiteChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidden =
    pathname === "/" ||
    editorialRoots.some(
      (root) => pathname === root || pathname.startsWith(`${root}/`),
    );
  return hidden ? null : children;
}
