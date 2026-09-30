"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Choice, FormSet, Input, Message } from "@/components/pieces/FormFields";
import { Newsletter } from "@/components/pieces/Newsletter";
import { SendButton } from "@/components/pieces/SendButton";
import { Sent } from "@/components/pieces/Sent";

// Preview-only wiring. Nothing here posts anywhere: every form stops at preventDefault, so the sheet can be clicked
// through without sending a thing.

const noSend = (event: FormEvent) => event.preventDefault();

const kinds = [
  { value: "project-partnership", label: "A project or partnership" },
  { value: "commission-cultural-work", label: "Art, story or a commission" },
  { value: "residency-visit", label: "A visit or residency" },
  { value: "share-your-story", label: "A story to share" },
  { value: "support", label: "Supporting the work" },
  { value: "research", label: "Research or media" },
  { value: "general", label: "A question or something else" },
];

/** The four fields and the button, laid out as Pencil's Form set. Empty, as the board draws it. */
export function FormSetDemo() {
  return (
    <FormSet onSubmit={noSend} noValidate>
      <Input label="Your name" name="firstName" placeholder="What should we call you?" autoComplete="given-name" />
      <Choice label="What brings you here?" name="inquiryType" prompt="Choose the closest fit" options={kinds} />
      <Message label="What is happening?" name="message" />
      <SendButton>Send the question</SendButton>
    </FormSet>
  );
}

/** The same fields as they sit in the contact panel: a name, an email, a choice, a message, the button. */
export function ContactFieldsDemo() {
  return (
    <FormSet onSubmit={noSend}>
      <Input label="Your name" name="firstName" required autoComplete="given-name" placeholder="What should we call you?" />
      <Input label="Your email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      <Choice label="What brings you here?" name="inquiryType" required prompt="Choose the closest fit" options={kinds} />
      <Message label="What is happening?" name="message" required />
      <SendButton>Send the question</SendButton>
    </FormSet>
  );
}

/** What each field looks like when it has something to say. */
export function ErrorsDemo() {
  return (
    <FormSet onSubmit={noSend} noValidate>
      <Input label="Your email" name="email" type="email" defaultValue="hello@" error="That email needs an @ and a domain." />
      <Choice label="What brings you here?" name="inquiryType" prompt="Choose the closest fit" options={kinds} error="Choose the closest fit." />
      <Message label="What is happening?" name="message" error="A line or two is enough, but we need something." />
      <SendButton disabled>Sending</SendButton>
    </FormSet>
  );
}

export function NewsletterDemo({ error }: { error?: string }) {
  return (
    <Newsletter
      onSubmit={noSend}
      noValidate
      label="Receive the next field letter"
      placeholder="Your email"
      button="Sign up"
      error={error}
      input={error ? { defaultValue: "hello@" } : undefined}
    />
  );
}

/** Sent, with a way to watch the tractor go again. The button brings the "form" back, which here is the same scene. */
export function SentDemo() {
  const [run, setRun] = useState(0);
  return (
    <Sent
      key={run}
      heading="We read every message."
      left="Your message, left with us"
      againLabel="Write another"
      onAgain={() => setRun((n) => n + 1)}
      takeFocus={run > 0}
    >
      We will route it to the person closest to the work and reply with an honest next step, usually within a few working
      days.
    </Sent>
  );
}
