import 'server-only';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  getStorytellerById,
  canDisplayStoryteller,
  type StorytellerProfile,
} from '@/lib/empathy-ledger-storytellers';

export const dynamic = 'force-dynamic';

// Internal admin OCAP-loop view. Public storyteller page lives at
// /storytellers/[id]. This page is for ACT operators (Ben/Nic) to:
//   - see consent state at a glance
//   - know when re-consent is due (elder review > 12 months old)
//   - see where each storyteller's stories are being used across surfaces
//   - mark consent renewed when re-confirmed
//
// Phase 1 (this MVP): consent state + flags + stories list (read-only).
// Phase 2: where-used tracking (newsletter editions, website pages,
//   funder briefs). Wired once cross-codebase feed + newsletter pipeline
//   have surface usage logged.

const REVIEW_DUE_MONTHS = 12;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminStorytellerPage({ params }: Props) {
  const { id } = await params;
  const profile = getStorytellerById(decodeURIComponent(id));
  if (!profile) notFound();

  const flags = computeFlags(profile);

  return (
    <main className="space-y-6 p-6">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown)]">
            Storyteller · OCAP admin view
          </p>
          <h1 className="text-3xl font-semibold text-[var(--we-olive)] font-[var(--font-display)]">
            {profile.displayName}
          </h1>
          <p className="mt-1 text-sm text-[var(--we-brown)]">
            ID: <code className="font-mono">{profile.id}</code>
          </p>
        </div>
        <Link
          href={`/storytellers/${encodeURIComponent(profile.id)}`}
          className="rounded-full bg-[var(--we-olive)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white"
        >
          Public view →
        </Link>
      </header>

      <FlagsPanel flags={flags} />

      <ConsentPanel profile={profile} />

      <RolesPanel profile={profile} />

      <UsagePanel profile={profile} />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────

interface Flags {
  canDisplay: boolean;
  needsReReview: boolean;
  reviewDueDate: string | null;
  reviewedMonthsAgo: number | null;
  missingProcessingConsent: boolean;
  noConsent: boolean;
}

function computeFlags(profile: StorytellerProfile): Flags {
  const canDisplay = canDisplayStoryteller(profile);
  const reviewedAt = profile.consent.elderReviewedAt
    ? new Date(profile.consent.elderReviewedAt)
    : null;
  const monthsAgo = reviewedAt
    ? Math.floor((Date.now() - reviewedAt.getTime()) / (1000 * 60 * 60 * 24 * 30))
    : null;
  const needsReReview = !!(
    profile.consent.requiresElderReview &&
    (monthsAgo === null || monthsAgo >= REVIEW_DUE_MONTHS)
  );

  return {
    canDisplay,
    needsReReview,
    reviewDueDate: reviewedAt
      ? new Date(reviewedAt.getTime() + REVIEW_DUE_MONTHS * 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10)
      : null,
    reviewedMonthsAgo: monthsAgo,
    missingProcessingConsent: profile.consent.processingConsent === false,
    noConsent: profile.consent.consentToShare === false,
  };
}

function FlagsPanel({ flags }: { flags: Flags }) {
  const items: Array<{ label: string; tone: 'good' | 'warn' | 'fail' }> = [];
  items.push(
    flags.canDisplay
      ? { label: 'Public display allowed', tone: 'good' }
      : { label: 'Public display BLOCKED — consent missing or expired', tone: 'fail' }
  );
  if (flags.noConsent) items.push({ label: 'consentToShare = false', tone: 'fail' });
  if (flags.missingProcessingConsent)
    items.push({ label: 'processingConsent = false', tone: 'fail' });
  if (flags.needsReReview)
    items.push({
      label:
        flags.reviewedMonthsAgo === null
          ? 'Elder review required — never reviewed'
          : `Elder re-review due (${flags.reviewedMonthsAgo} months since last)`,
      tone: 'warn',
    });
  if (flags.reviewDueDate && !flags.needsReReview)
    items.push({ label: `Re-review due ${flags.reviewDueDate}`, tone: 'good' });

  return (
    <section className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--we-brown)]">
        Status flags
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                item.tone === 'good'
                  ? 'bg-emerald-500'
                  : item.tone === 'warn'
                  ? 'bg-amber-500'
                  : 'bg-rose-600'
              }`}
            />
            <span className="text-sm text-[var(--we-brown)]">{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ConsentPanel({ profile }: { profile: StorytellerProfile }) {
  const { consent } = profile;
  const rows: Array<[string, React.ReactNode]> = [
    ['Consent to share', booleanLabel(consent.consentToShare)],
    ['Processing consent', booleanLabel(consent.processingConsent)],
    ['Cultural sensitivity', consent.culturalSensitivity || '—'],
    ['Requires elder review', booleanLabel(consent.requiresElderReview)],
    ['Last elder review', consent.elderReviewedAt || '—'],
  ];
  return (
    <section className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--we-brown)]">
        Consent state
      </h2>
      <dl className="mt-3 grid grid-cols-[200px_1fr] gap-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-[var(--we-brown)]">{k}</dt>
            <dd className="text-[var(--we-olive)]">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function booleanLabel(v: boolean | null): React.ReactNode {
  if (v === true) return <span className="text-emerald-700">yes</span>;
  if (v === false) return <span className="text-rose-700">no</span>;
  return <span className="text-[var(--we-brown)]">—</span>;
}

function RolesPanel({ profile }: { profile: StorytellerProfile }) {
  if (!profile.roles?.length) return null;
  return (
    <section className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--we-brown)]">
        Roles + projects
      </h2>
      <ul className="mt-3 space-y-2">
        {profile.roles.map((r, i) => (
          <li key={i} className="text-sm">
            <span className="font-semibold text-[var(--we-olive)]">{r.role}</span>
            {r.site && <span className="ml-2 text-[var(--we-brown)]">· {r.site}</span>}
            {r.projects?.length > 0 && (
              <span className="ml-2 text-[var(--we-brown)]">
                · {r.projects.join(', ')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function UsagePanel({ profile }: { profile: StorytellerProfile }) {
  // Phase 1 stub: where this storyteller's stories are being used across surfaces.
  // Phase 2 wiring: read from newsletter_editions, website pages, funder briefs
  // tables — each row tags storyteller_ids surfaced. Until then, show what
  // we KNOW from existing snapshots: transcript count + media count + project tags.
  const transcripts = profile.analysis?.transcriptCount ?? 0;
  const media = profile.analysis?.mediaCount ?? 0;
  const themes = profile.analysis?.themes ?? [];

  return (
    <section className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--we-brown)]">
        Where used (current snapshot)
      </h2>
      <p className="mt-2 text-xs text-[var(--we-brown)]">
        Phase 2 will surface specific newsletter editions, website pages, and
        funder briefs that include this storyteller. For now: transcript +
        media counts from the most recent EL sync.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-4">
        <Stat label="Transcripts" value={transcripts} />
        <Stat label="Media items" value={media} />
        <Stat label="Galleries" value={profile.galleries?.length || 0} />
      </div>
      {themes.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--we-brown)]">
            Themes
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {themes.slice(0, 10).map((t, i) => (
              <span
                key={i}
                className="rounded-full bg-[var(--we-sand)] px-3 py-1 text-xs text-[var(--we-olive)]"
              >
                {t.label}
                {t.count ? ` · ${t.count}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[var(--we-sand)]/50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--we-brown)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-[var(--we-olive)] font-[var(--font-display)]">
        {value}
      </p>
    </div>
  );
}
