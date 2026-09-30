"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { usePathname } from "next/navigation";
import { Newsletter } from "@/components/pieces/Newsletter";
import styles from "./field-letter-signup.module.css";

/**
 * Receive the next field letter (Pencil: Newsletter sign-up Agacj in Home's Return, 480 wide). It posts what the
 * home page's sign-up has always posted: /api/forms/submit as a "newsletter", the email, the route and where on the page
 * it was, and the same source, page and interest tags.
 */
export function FieldLetterSignup() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectCode: "ACT-IN",
          formType: "newsletter",
          fields: {
            email,
            signupRoute: pathname,
            signupContext: "Living Field letter signup",
            signupPlacement: "living-field",
          },
          additionalTags: ["source:website-living-field", "source:page:living-field", "interest:field-notes"],
        }),
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error - please try again");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className={styles.thanks}>
        <p>Thanks for subscribing!</p>
      </div>
    );
  }

  return (
    <Newsletter
      onSubmit={submit}
      noValidate
      label="Receive the next field letter"
      placeholder="Your email"
      button="Sign up"
      pending={status === "loading"}
      error={status === "error" ? message : undefined}
      input={{ value: email, onChange: (event) => setEmail(event.target.value) }}
    />
  );
}
