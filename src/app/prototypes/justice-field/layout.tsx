"use client";

import { useEffect } from "react";

export default function JusticeFieldLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const chrome = Array.from(document.querySelectorAll<HTMLElement>("[data-site-chrome]"));
    chrome.forEach((node) => { node.hidden = true; });
    return () => chrome.forEach((node) => { node.hidden = false; });
  }, []);
  return children;
}
