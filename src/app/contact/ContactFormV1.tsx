"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Choice, FormSet, Input, Message } from "@/components/pieces/FormFields";
import { SendButton } from "@/components/pieces/SendButton";
import { RustSquare } from "@/components/pieces/Small";
import styles from "./contact.module.css";

// The contact form on Brand v1: the same form the page has always had (src/components/forms/ContactForm.tsx), drawn
// with the FormFields and SendButton pieces. It posts what it always posted to /api/forms/submit: the same field names,
// the same project code, form type, context label and tag, and `type`, `source` and `context` from the address still
// preselect the choice and tag the message.

const PROJECT_CODE = "ACT-IN";
const FORM_TYPE = "contact";
const CONTEXT_LABEL = "ACT contact page";
const TAGS = ["Public contact route"];
const FALLBACK_ERROR = "The message could not be sent. Please email hi@act.place.";

const kinds = [
  { value: "project-partnership", label: "A project or partnership" },
  { value: "commission-cultural-work", label: "Art, story or a commission" },
  { value: "residency-visit", label: "A visit or residency" },
  { value: "share-your-story", label: "A story to share" },
  { value: "support", label: "Supporting the work" },
  { value: "research", label: "Research or media" },
  { value: "general", label: "A question or something else" },
];

// Project pages link with `type=commission`, which is not one of the choices; it means the commission choice.
const aliases: Record<string, string> = { commission: "commission-cultural-work" };
const known = new Set(kinds.map((kind) => kind.value));

/** The choice an address asks for, or none when it names one the form does not have. */
function presetKind(raw: string) {
  const value = aliases[raw] ?? raw;
  return known.has(value) ? value : "";
}

const empty = { firstName: "", email: "", inquiryType: "", message: "" };

export function ContactFormV1({ onSent, focusFirst = false }: { onSent: () => void; focusFirst?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") || "";
  const presetSource = searchParams.get("source") || "";
  const presetContext = searchParams.get("context") || "";
  const [formData, setFormData] = useState({ ...empty, inquiryType: presetKind(rawType) });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [problem, setProblem] = useState("");

  // A way in on this page changes the address without reloading it; the choice follows.
  useEffect(() => {
    const preset = presetKind(rawType);
    if (preset) setFormData((current) => ({ ...current, inquiryType: preset }));
  }, [rawType]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setProblem("");
    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectCode: PROJECT_CODE,
          formType: FORM_TYPE,
          fields: {
            ...formData,
            context: CONTEXT_LABEL,
            source_route: pathname,
            ...(presetSource ? { preset_source: presetSource } : {}),
            ...(presetContext ? { requested_context: presetContext } : {}),
          },
          additionalTags: TAGS,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setStatus("error");
        setProblem(typeof result.error === "string" && result.error ? result.error : FALLBACK_ERROR);
        return;
      }
      onSent();
    } catch {
      setStatus("error");
      setProblem(FALLBACK_ERROR);
    }
  };

  const pending = status === "loading";

  return (
    <FormSet onSubmit={handleSubmit}>
      <Input
        label="Your name"
        required
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        autoComplete="given-name"
        placeholder="What should we call you?"
        disabled={pending}
        // After "Write another" the form is new, so the reader starts at its first field.
        autoFocus={focusFirst}
      />
      <Input
        label="Your email"
        required
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
        placeholder="you@example.com"
        disabled={pending}
      />
      <Choice
        label="What brings you here?"
        required
        name="inquiryType"
        value={formData.inquiryType}
        onChange={handleChange}
        prompt="Choose the closest fit"
        options={kinds}
        disabled={pending}
      />
      <Message
        label="What is happening?"
        required
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={6}
        placeholder="Tell us enough to understand the place, people and question. It does not need to be polished."
        disabled={pending}
      />
      <div className={styles.finish}>
        <SendButton pending={pending}>{pending ? "Sending…" : "Send the question"}</SendButton>
        <p className={styles.promise}>We will only use these details to respond to your enquiry.</p>
      </div>
      {problem && (
        <p role="alert" className={styles.problem}>
          <RustSquare size={7} />
          <span>{problem}</span>
        </p>
      )}
    </FormSet>
  );
}
