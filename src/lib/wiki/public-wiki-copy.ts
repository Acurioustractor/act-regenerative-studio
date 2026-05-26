import { cleanPublicBrandText } from '@/lib/brand/public-copy';

const sensitiveExcerptPattern =
  /\bABNs?\b|\bAPI keys?\b|\bpasswords?\b|\b2FA\b|\bbanking creds?\b|\bCLAUDE\.md\b|\bsync-act-context\b|\bsource upstream\b/i;

export function sanitizePublicWikiExcerpt(
  excerpt: string | null | undefined,
  title: string
) {
  const trimmed = excerpt?.trim();
  if (!trimmed) return null;

  if (/coming soon|placeholder|still being prepared|still being surfaced/i.test(trimmed)) {
    return `${title} is an ACT wiki page. Public details will be shared when the source record is ready.`;
  }

  if (sensitiveExcerptPattern.test(trimmed)) {
    return `Read ${title} for public context, source notes, and related project links.`;
  }

  return sanitizePublicWikiText(trimmed);
}

export function sanitizePublicWikiText(value: string | null | undefined) {
  if (!value) return value ?? null;

  const cleaned = value
    .replace(/\bABNs\b/g, 'business registrations')
    .replace(/\bABN\s*(?:PENDING|[:\s]*\d[\d\s]+)?/gi, 'business registration')
    .replace(/\bACNs?,\s*business registrations\b/gi, 'public registration details')
    .replace(/\bAPI keys?, passwords?, 2FA backup codes, banking creds\b/gi, 'private credentials')
    .replace(/\bAPI keys?\b/gi, 'private keys')
    .replace(/\bpasswords?\b/gi, 'private credentials')
    .replace(/\b2FA backup codes\b/gi, 'private recovery codes')
    .replace(/\bbanking creds\b/gi, 'private banking details')
    .replace(/\bCLAUDE\.md\b/g, 'repo context files')
    .replace(/`?scripts\/sync-act-context\.mjs`?/g, 'the context sync')
    .replace(/\bsync-act-context\b/g, 'context sync');

  return cleaned
    .split('\n')
    .map((line) => cleanPublicBrandText(line))
    .join('\n');
}
