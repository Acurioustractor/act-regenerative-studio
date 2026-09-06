import { NewsletterForm } from './NewsletterForm';

interface NewsletterCTAProps {
  eyebrow?: string;
  title: string;
  description: string;
  projectCode?: string;
  projectSlug?: string;
  storySlug?: string;
  source: string;
  audience?: string;
  additionalTags?: string[];
  variant?: 'light' | 'dark';
}

export function NewsletterCTA({
  eyebrow = 'Stay with the story',
  title,
  description,
  projectCode,
  projectSlug,
  storySlug,
  source,
  audience,
  additionalTags = [],
  variant = 'light',
}: NewsletterCTAProps) {
  const dark = variant === 'dark';

  return (
    <section
      className={
        dark
          ? 'rounded-[28px] border border-[#4A3B2E] bg-[#171612] p-7 text-[var(--warm-cream)] md:p-9'
          : 'rounded-[28px] border border-[var(--we-sand)] bg-[var(--warm-paper-bright)] p-7 md:p-9'
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.86fr] lg:items-end">
        <div>
          <p
            className={
              dark
                ? 'font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--warm-gold)]'
                : 'font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--we-warm-brown)]'
            }
          >
            {eyebrow}
          </p>
          <h2
            className={
              dark
                ? 'mt-3 font-[var(--font-display)] text-2xl font-semibold leading-tight text-[var(--warm-cream)] md:text-3xl'
                : 'mt-3 font-[var(--font-display)] text-2xl font-semibold leading-tight text-[var(--we-olive)] md:text-3xl'
            }
          >
            {title}
          </h2>
          <p
            className={
              dark
                ? 'mt-3 max-w-2xl text-sm leading-7 text-[#D7C8B2]'
                : 'mt-3 max-w-2xl text-sm leading-7 text-[var(--we-brown)]'
            }
          >
            {description}
          </p>
        </div>
        <NewsletterForm
          projectCode={projectCode}
          contextLabel={title}
          source={source}
          projectSlug={projectSlug}
          storySlug={storySlug}
          audience={audience}
          additionalTags={additionalTags}
        />
      </div>
    </section>
  );
}
