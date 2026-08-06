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

export function isEditorialRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    editorialRoots.some(
      (root) => pathname === root || pathname.startsWith(`${root}/`),
    )
  );
}

export function SiteChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return isEditorialRoute(pathname) ? null : children;
}
