"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  items: NavItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // Close on Escape and lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--site-ink)] transition hover:bg-black/5 md:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[150] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-xs flex-col bg-[var(--site-panel,#FDFBF7)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--site-line,#E7DDC7)] px-5 py-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--site-muted,#8a6a3f)]">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--site-ink)] transition hover:bg-black/5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav aria-label="Primary mobile" className="flex flex-1 flex-col gap-1 px-4 py-4">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--site-ink)] transition hover:bg-black/5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
