"use client";

import { useState } from "react";
import { LinkButton } from "@/components/pieces/LinkButton";
import styles from "./return-actions.module.css";

/**
 * The two buttons under "What question is following you?": ask a question (a link to Contact, carrying where it came
 * from) and share this field. Sharing opens the device's share sheet where there is one and copies the address where
 * there is not. Both as the current home page does it.
 */
export function ReturnActions({ askHref }: { askHref: string }) {
  const [status, setStatus] = useState("");

  async function share() {
    const data = {
      title: "A Curious Tractor · Living Field",
      text: "Come into the art, then follow it into the field.",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        setStatus("Shared");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setStatus("Link copied");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setStatus("Copy the address from your browser to share");
    }
  }

  return (
    <div className={styles.actions}>
      <div className={styles.buttons}>
        <LinkButton href={askHref} onward>
          Ask a question
        </LinkButton>
        <LinkButton variant="outline" onClick={share}>
          Share this field ↗
        </LinkButton>
      </div>
      <p role="status" className={styles.status}>
        {status}
      </p>
    </div>
  );
}
