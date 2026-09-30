"use client";

import { usePathname } from "next/navigation";

const editorialRoots = [
  "/stories",
  "/questions",
  "/fields",
  "/art",
  "/harvest",
  "/about",
  "/contact",
];

export function isEditorialRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    editorialRoots.some(
      (root) => pathname === root || pathname.startsWith(`${root}/`),
    )
  );
}

/**
 * Routes rebuilt on Brand v1. Their pages draw their own header and footer (src/components/pieces/Page.tsx), so neither
 * the old chrome nor the editorial legal line renders on them. A route joins this list in the commit that rebuilds it.
 */
const brandRoots: string[] = ["/questions"];

export function isBrandRoute(pathname: string): boolean {
  return brandRoots.some((root) =>
    root === "/" ? pathname === "/" : pathname === root || pathname.startsWith(`${root}/`),
  );
}

export function SiteChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return isEditorialRoute(pathname) || isBrandRoute(pathname) ? null : children;
}
