import 'server-only';

import { cache } from 'react';

import storytellerSnapshot from '@/data/empathy-ledger-storytellers.generated.json';

export interface StorytellerConsent {
  consentToShare: boolean | null;
  processingConsent: boolean | null;
  culturalSensitivity: string | null;
  requiresElderReview: boolean | null;
  elderReviewedAt: string | null;
}

export interface StorytellerProfile {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  culturalBackground: string[];
  location: string | null;
  isElder: boolean;
  isFeatured: boolean;
  authorRole: string | null;

  roles: Array<{
    role: string;
    site: string | null;
    projects: string[];
  }>;

  galleries: string[];

  analysis: {
    themes: Array<{ label: string; count?: number }>;
    quotes: Array<{ text: string; context?: string | null }>;
    culturalMarkers: string[];
    transcriptCount: number;
    mediaCount: number;
    analyzedAt: string | null;
  } | null;

  consent: StorytellerConsent;
}

interface StorytellerSnapshot {
  generatedAt: string;
  sourceUrl: string | null;
  siteSlug: string;
  storytellerCount: number;
  storytellers: Array<{
    id: string;
    list: Record<string, unknown> | null;
    detail: Record<string, unknown> | null;
  }>;
}

const SNAPSHOT = storytellerSnapshot as unknown as StorytellerSnapshot;

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.length > 0);
  }
  if (typeof value === 'string' && value.length > 0) return [value];
  return [];
}

function readString(obj: Record<string, unknown> | null, ...keys: string[]): string | null {
  if (!obj) return null;
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return null;
}

function readBool(obj: Record<string, unknown> | null, ...keys: string[]): boolean | null {
  if (!obj) return null;
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'boolean') return value;
  }
  return null;
}

function toProfile(record: StorytellerSnapshot['storytellers'][number]): StorytellerProfile {
  const list = record.list || {};
  const detail = record.detail || null;
  const source = detail || list;

  const rolesRaw = Array.isArray((list as Record<string, unknown>).roles)
    ? ((list as Record<string, unknown>).roles as Array<Record<string, unknown>>)
    : [];

  const analysisSource = detail && typeof (detail as Record<string, unknown>).analysis === 'object'
    ? ((detail as Record<string, unknown>).analysis as Record<string, unknown>)
    : null;

  return {
    id: record.id,
    displayName:
      readString(source as Record<string, unknown>, 'name', 'displayName', 'display_name', 'full_name') ||
      'Unknown storyteller',
    bio: readString(source as Record<string, unknown>, 'bio'),
    avatarUrl:
      readString(source as Record<string, unknown>, 'avatarUrl', 'avatar_url', 'profile_image_url', 'public_avatar_url'),
    culturalBackground: toStringArray(
      (source as Record<string, unknown>).culturalBackground ??
        (source as Record<string, unknown>).cultural_background
    ),
    location: readString(source as Record<string, unknown>, 'location'),
    isElder: Boolean(
      readBool(source as Record<string, unknown>, 'isElder', 'is_elder')
    ),
    isFeatured: Boolean(
      readBool(source as Record<string, unknown>, 'isFeatured', 'is_featured')
    ),
    authorRole: readString(source as Record<string, unknown>, 'authorRole', 'author_role'),
    roles: rolesRaw
      .map((r) => ({
        role: typeof r.role === 'string' ? r.role : '',
        site: typeof r.site === 'string' ? r.site : null,
        projects: toStringArray(r.projects),
      }))
      .filter((r) => r.role.length > 0),
    galleries: toStringArray((list as Record<string, unknown>).galleries),
    analysis: analysisSource
      ? {
          themes: Array.isArray(analysisSource.themes)
            ? (analysisSource.themes as Array<{ label?: string; count?: number }>)
                .filter((t) => typeof t.label === 'string')
                .map((t) => ({ label: t.label!, count: t.count }))
            : [],
          quotes: Array.isArray(analysisSource.quotes)
            ? (analysisSource.quotes as Array<{ text?: string; context?: string | null }>)
                .filter((q) => typeof q.text === 'string')
                .map((q) => ({ text: q.text!, context: q.context ?? null }))
            : [],
          culturalMarkers: Array.isArray(analysisSource.culturalMarkers)
            ? (analysisSource.culturalMarkers as Array<{ marker?: string } | string>)
                .map((m) => (typeof m === 'string' ? m : m.marker))
                .filter((m): m is string => typeof m === 'string')
            : [],
          transcriptCount:
            typeof analysisSource.transcriptCount === 'number'
              ? analysisSource.transcriptCount
              : typeof analysisSource.transcript_count === 'number'
                ? (analysisSource.transcript_count as number)
                : 0,
          mediaCount:
            typeof analysisSource.mediaCount === 'number'
              ? analysisSource.mediaCount
              : typeof analysisSource.media_count === 'number'
                ? (analysisSource.media_count as number)
                : 0,
          analyzedAt:
            typeof analysisSource.analyzedAt === 'string'
              ? analysisSource.analyzedAt
              : typeof analysisSource.analyzed_at === 'string'
                ? (analysisSource.analyzed_at as string)
                : null,
        }
      : null,
    consent: {
      consentToShare: readBool(source as Record<string, unknown>, 'consentToShare', 'consent_to_share'),
      processingConsent: readBool(
        source as Record<string, unknown>,
        'processingConsent',
        'processing_consent'
      ),
      culturalSensitivity: readString(
        source as Record<string, unknown>,
        'culturalSensitivity',
        'cultural_sensitivity'
      ),
      requiresElderReview: readBool(
        source as Record<string, unknown>,
        'requiresElderReview',
        'requires_elder_review'
      ),
      elderReviewedAt: readString(
        source as Record<string, unknown>,
        'elderReviewedAt',
        'elder_reviewed_at'
      ),
    },
  };
}

export const getAllStorytellers = cache((): StorytellerProfile[] => {
  return SNAPSHOT.storytellers.map(toProfile);
});

export const getStorytellerById = cache((id: string): StorytellerProfile | null => {
  const record = SNAPSHOT.storytellers.find((r) => r.id === id);
  return record ? toProfile(record) : null;
});

export const getStorytellersForProject = cache(
  (projectSlug: string): StorytellerProfile[] => {
    return getAllStorytellers().filter((s) =>
      s.roles.some((r) => r.projects.includes(projectSlug))
    );
  }
);

export function canDisplayStoryteller(profile: StorytellerProfile): boolean {
  if (profile.consent.consentToShare === false) return false;
  if (profile.consent.requiresElderReview && !profile.consent.elderReviewedAt) return false;
  return true;
}

export function getStorytellerSnapshotMeta() {
  return {
    generatedAt: SNAPSHOT.generatedAt,
    sourceUrl: SNAPSHOT.sourceUrl,
    siteSlug: SNAPSHOT.siteSlug,
    storytellerCount: SNAPSHOT.storytellerCount,
  };
}
