"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { acknowledgementShort, doors, site } from "@/content/site";
import { PartGlyph } from "./PartGlyph";
import { Surface } from "./Surface";
import { Wordmark } from "./Wordmark";
import styles from "./header.module.css";

/**
 * One header everywhere (Pencil: Header hAT8r, Header · phone g3LT4, Menu · phone open EUjDC). The part under the
 * door you are in turns rust; pointing at another door wakes that one instead. On a phone the doors fold into a menu.
 */
export function Header({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      openButton.current?.focus();
    };
  }, [open]);

  const here = (label: string) => (label === current ? "page" : undefined);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.home} aria-label="A Curious Tractor, home">
        <Wordmark className={styles.mark} />
      </Link>

      <nav aria-label="Main" className={styles.doors}>
        {doors.map((door) => (
          <Link key={door.label} href={door.href} className={styles.door} aria-current={here(door.label)}>
            <span className={styles.label}>{door.label}</span>
            <span className={styles.part}>{door.part && <PartGlyph part={door.part} />}</span>
          </Link>
        ))}
      </nav>

      <button
        ref={openButton}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(true)}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.hidden}>Menu</span>
      </button>

      {open && (
        <Surface tone="ink" id={menuId} className={styles.menu} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={styles.menuTop}>
            <Link href="/" aria-label="A Curious Tractor, home" onClick={() => setOpen(false)}>
              <Wordmark className={styles.menuMark} />
            </Link>
            <button ref={closeButton} type="button" className={styles.close} onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <nav aria-label="Main" className={styles.menuDoors}>
            {doors
              .filter((door) => door.part)
              .map((door) => (
                <Link
                  key={door.label}
                  href={door.href}
                  className={styles.menuDoor}
                  aria-current={here(door.label)}
                  onClick={() => setOpen(false)}
                >
                  <span className={styles.menuPart}>{door.part && <PartGlyph part={door.part} size="way" />}</span>
                  <span className={styles.menuWords}>
                    <span className={styles.menuName}>{door.label}</span>
                    <span className={styles.menuInvite}>{door.invite}.</span>
                  </span>
                </Link>
              ))}
            <span className={styles.menuPlain}>
              {doors
                .filter((door) => !door.part)
                .map((door) => (
                  <Link key={door.label} href={door.href} aria-current={here(door.label)} onClick={() => setOpen(false)}>
                    {door.label}
                  </Link>
                ))}
            </span>
          </nav>

          <div className={styles.menuBottom}>
            <p className={styles.menuInvitation}>{site.invitation}</p>
            <a href={`mailto:${site.email}`} className={styles.menuEmail}>
              {site.email}
            </a>
            <p className={styles.menuAck}>{acknowledgementShort}</p>
          </div>
        </Surface>
      )}
    </header>
  );
}
