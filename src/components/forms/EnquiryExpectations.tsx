interface EnquiryExpectationsProps {
  eyebrow?: string;
  title: string;
  intro: string;
  whatHelps: string[];
  whatHappensNext: string[];
}

export function EnquiryExpectations({
  eyebrow = "Enquiry notes",
  title,
  intro,
  whatHelps,
  whatHappensNext,
}: EnquiryExpectationsProps) {
  return (
    <div className="rounded-3xl border border-[var(--we-sand)] bg-[#F6F1E7]/80 p-6 md:p-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
          {eyebrow}
        </p>
        <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
          {title}
        </h3>
        <p className="max-w-3xl text-sm leading-7 text-[var(--we-brown)]">{intro}</p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#D9C9A9] bg-white/75 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
            What helps
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--we-brown)]">
            {whatHelps.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[#4CAF50]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#D9C9A9] bg-white/75 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--we-warm-brown)]">
            What happens next
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--we-brown)]">
            {whatHappensNext.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[#A8753F]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
