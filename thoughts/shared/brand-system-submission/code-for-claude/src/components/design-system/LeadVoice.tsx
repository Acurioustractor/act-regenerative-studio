import Image from "next/image";

type LeadVoiceProps = {
  quote: string;
  authorName: string;
  authorTagline?: string | null;
  authorImageUrl?: string | null;
};

export function LeadVoice({
  quote,
  authorName,
  authorTagline,
  authorImageUrl,
}: LeadVoiceProps) {
  return (
    <section className="full-bleed bg-[var(--site-dark)] px-8 py-32 md:py-44">
      <div className="mx-auto max-w-[800px]">
        <blockquote className="border-l-4 border-[var(--site-clay)] pl-10 md:pl-14">
          <p className="font-[var(--font-display)] text-[clamp(1.4rem,3vw,2.2rem)] font-light italic leading-[1.5] text-[#FAFAF7]">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="mt-10 flex items-center gap-5">
            {authorImageUrl ? (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--site-clay)]/30">
                <Image
                  src={authorImageUrl}
                  alt={authorName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div>
              <p className="font-[var(--font-sans)] text-[15px] font-semibold text-[#FAFAF7]">
                {authorName}
              </p>
              {authorTagline ? (
                <p className="mt-1 font-[var(--font-sans)] text-[11px] uppercase tracking-[0.15em] text-[#FAFAF7]/50">
                  {authorTagline}
                </p>
              ) : null}
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
