"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Sent } from "@/components/pieces/Sent";
import { ContactFormV1 } from "./ContactFormV1";
import styles from "./contact.module.css";

/**
 * The contact page in its two states (Pencil: Page 03 Contact, Page 03b Contact, sent). Until a message goes, the
 * invitation sits beside the form, then the ways in, what happens next and the four ways on. Once it has gone the page
 * is the Sent scene and the four ways on, "while you wait". The words of each part come in from the page as slots; the
 * only state is whether the message has been sent.
 */
export function ContactFlow({
  invitation,
  formIntro,
  waysIn,
  next,
  ways,
  waysSent,
  sent: { heading, body, left, again },
}: {
  invitation: ReactNode;
  formIntro: ReactNode;
  waysIn: ReactNode;
  next: ReactNode;
  ways: ReactNode;
  waysSent: ReactNode;
  sent: { heading: string; body: string; left: string; again: string };
}) {
  const [sent, setSent] = useState(false);
  // Set once someone has chosen to write another, so the new form starts at its first field.
  const [wroteAnother, setWroteAnother] = useState(false);
  const first = useRef(true);

  // The form is taller than the Sent scene, so bring the reader back to the top when the swap happens.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (sent) window.scrollTo({ top: 0, behavior: "instant" });
  }, [sent]);

  if (sent) {
    return (
      <>
        <Sent
          as="h1"
          heading={heading}
          left={left}
          againLabel={again}
          onAgain={() => {
            setWroteAnother(true);
            setSent(false);
          }}
        >
          {body}
        </Sent>
        {waysSent}
      </>
    );
  }

  return (
    <>
      <section className={styles.opening}>
        <div className={styles.invitation}>{invitation}</div>
        <div id="start-a-conversation" className={styles.formPanel}>
          {formIntro}
          <Suspense fallback={<p className={styles.loading}>Loading the form…</p>}>
            <ContactFormV1 onSent={() => setSent(true)} focusFirst={wroteAnother} />
          </Suspense>
        </div>
      </section>
      {waysIn}
      {next}
      {ways}
    </>
  );
}
