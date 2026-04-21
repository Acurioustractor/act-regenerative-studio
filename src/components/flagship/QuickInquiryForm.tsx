"use client";

import { useState } from "react";

interface QuickInquiryFormProps {
  projectName: string;
  projectSlug: string;
  projectCode?: string;
}

export function QuickInquiryForm({
  projectName,
  projectSlug,
  projectCode,
}: QuickInquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [interest, setInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const interests = [
    "Collaborate",
    "Partner",
    "Fund",
    "Visit",
    "Learn more",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setError("");

    try {
      const [firstName, ...rest] = name.split(" ");
      const lastName = rest.join(" ");

      const res = await fetch("/api/forms/submit", {
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
          },
          additionalTags: [
            "Flagship Inquiry",
            `Project: ${projectName}`,
            `Interest: ${interest || "General"}`,
            `Source: flagship-page-${projectSlug}`,
          ],
        }),
      });

      const result = await res.json();
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
      <div className="rounded-[var(--site-radius)] border border-[var(--site-green)]/20 bg-[var(--site-green)]/5 px-8 py-12 text-center">
        <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--site-ink)]">
          We&apos;ll be in touch
        </p>
        <p className="mt-3 font-[var(--font-body)] text-[15px] text-[var(--site-muted)]">
          Thanks for your interest in {projectName}. We typically respond within
          a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Interest chips */}
      <div>
        <p className="mb-3 font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--site-muted)]">
          I want to
        </p>
        <div className="flex flex-wrap gap-2">
          {interests.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setInterest(opt)}
              className={`rounded-full px-5 py-2.5 font-[var(--font-sans)] text-[12px] font-semibold tracking-[0.05em] transition ${
                interest === opt
                  ? "bg-[var(--site-green)] text-white"
                  : "border border-[var(--site-line)] text-[var(--site-muted)] hover:border-[var(--site-ink)] hover:text-[var(--site-ink)]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-[var(--site-radius)] border border-[var(--site-line)] bg-white px-5 py-3.5 font-[var(--font-body)] text-[15px] text-[var(--site-ink)] outline-none placeholder:text-[var(--site-muted)]/50 focus:border-[var(--site-green)]"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-[var(--site-radius)] border border-[var(--site-line)] bg-white px-5 py-3.5 font-[var(--font-body)] text-[15px] text-[var(--site-ink)] outline-none placeholder:text-[var(--site-muted)]/50 focus:border-[var(--site-green)]"
        />
      </div>

      <textarea
        placeholder={`What draws you to ${projectName}?`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full rounded-[var(--site-radius)] border border-[var(--site-line)] bg-white px-5 py-3.5 font-[var(--font-body)] text-[15px] text-[var(--site-ink)] outline-none placeholder:text-[var(--site-muted)]/50 focus:border-[var(--site-green)]"
      />

      {error && (
        <p className="font-[var(--font-body)] text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={sending || !email}
        className="w-full rounded-[var(--site-radius)] bg-[var(--site-green)] px-8 py-4 font-[var(--font-sans)] text-[14px] font-semibold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 md:w-auto"
      >
        {sending ? "Sending..." : "Reach out"}
      </button>
    </form>
  );
}
