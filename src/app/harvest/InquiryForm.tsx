"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Choice, FormSet, Input, Message } from "@/components/pieces/FormFields";
import { SendButton } from "@/components/pieces/SendButton";
import { RustSquare } from "@/components/pieces/Small";
import styles from "./inquiry-form.module.css";

const interests = ["Collaborate", "Partner", "Fund", "Visit", "Learn more"].map((label) => ({ value: label, label }));

/**
 * The enquiry form on a flagship page, drawn with the Brand v1 fields (Pencil: Page 08 The Harvest, Form QvUZP). It posts
 * what the flagship form has always posted: /api/forms/submit as a "flagship-inquiry" for the project code, with the name
 * split into first and last, the email, the message, what they want to do, the project and the route they were on.
 * Canonical source, role and project tags are set on the server.
 */
export function InquiryForm({
  projectName,
  projectSlug,
  projectCode,
}: {
  projectName: string;
  projectSlug: string;
  projectCode?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [interest, setInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const thanks = useRef<HTMLHeadingElement>(null);

  // What replaces the form is read out when it appears.
  useEffect(() => {
    if (submitted) thanks.current?.focus({ preventScroll: true });
  }, [submitted]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    setSending(true);
    setError("");

    try {
      const [firstName, ...rest] = name.split(" ");
      const lastName = rest.join(" ");

      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectCode: projectCode || undefined,
          formType: "flagship-inquiry",
          fields: {
            firstName: firstName || name,
            lastName: lastName || undefined,
            email,
            message: message || undefined,
            interest: interest || undefined,
            flagship_project: projectName,
            source_route: `flagship-page-${projectSlug}`,
          },
          additionalTags: [],
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong. Try emailing hi@act.place instead.");
      }
    } catch {
      setError("Network error. Try emailing hi@act.place instead.");
    }

    setSending(false);
  }

  if (submitted) {
    return (
      <div role="status" className={styles.thanks}>
        <h3 ref={thanks} tabIndex={-1} className={styles.thanksHeading}>
          We&apos;ll be in touch
        </h3>
        <p className={styles.thanksText}>
          Thanks for your interest in {projectName}. We typically respond within a few days.
        </p>
      </div>
    );
  }

  return (
    <FormSet onSubmit={submit}>
      <Input
        label="Your name"
        name="name"
        required
        autoComplete="name"
        placeholder="What should we call you?"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        label="Your email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Choice
        label="I want to"
        name="interest"
        prompt="Choose the closest fit"
        options={interests}
        value={interest}
        onChange={(event) => setInterest(event.target.value)}
      />
      <Message label="Message" name="message" value={message} onChange={(event) => setMessage(event.target.value)} />
      {error && (
        <p role="alert" className={styles.error}>
          <RustSquare size={7} />
          <span>{error}</span>
        </p>
      )}
      <SendButton pending={sending}>{sending ? "Sending" : "Send"}</SendButton>
    </FormSet>
  );
}
