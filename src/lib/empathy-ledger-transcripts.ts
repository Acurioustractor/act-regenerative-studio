import 'server-only';

import { cache } from 'react';

import transcriptSnapshot from '@/data/empathy-ledger-transcripts.generated.json';

export type TranscriptProcessingStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'needs_review'
  | 'paused'
  | 'consent_required'
  | 'synthetic'
  | 'test';

export type TranscriptCulturalSensitivity =
  | 'standard'
  | 'sensitive'
  | 'sacred'
  | 'restricted';

export interface TranscriptSegment {
  start?: number;
  end?: number;
  speaker?: string | null;
  text: string;
}

export interface TranscriptRecord {
  id: string;
  title: string;
  storytellerId: string | null;
  storytellerName: string | null;
  projectId: string | null;
  projectSlug: string | null;
  organizationId: string | null;

  content: string | null;
  formattedText: string | null;
  segments: TranscriptSegment[];

  audioUrl: string | null;
  videoUrl: string | null;
  sourceVideoUrl: string | null;
  sourceVideoPlatform: string | null;
  sourceVideoThumbnail: string | null;
  durationSeconds: number | null;
  language: string | null;

  themes: string[];
  keyQuotes: string[];
  aiSummary: string | null;

  processingStatus: TranscriptProcessingStatus | null;
  culturalSensitivity: TranscriptCulturalSensitivity | null;
  requiresElderReview: boolean;
  elderReviewedAt: string | null;
  processingConsent: boolean | null;
  aiProcessingConsent: boolean | null;

  recordedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

interface TranscriptSnapshot {
  generatedAt: string;
  sourceUrl: string | null;
  siteSlug: string;
  transcriptCount: number;
  transcripts: Array<Record<string, unknown>>;
  note?: string;
}

const SNAPSHOT = transcriptSnapshot as unknown as TranscriptSnapshot;

function readString(obj: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return null;
}

function readNumber(obj: Record<string, unknown>, ...keys: string[]): number | null {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return null;
}

function readBool(obj: Record<string, unknown>, ...keys: string[]): boolean | null {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'boolean') return v;
  }
  return null;
}

function readStringArray(obj: Record<string, unknown>, ...keys: string[]): string[] {
  for (const key of keys) {
    const v = obj[key];
    if (Array.isArray(v)) {
      return v.filter((x): x is string => typeof x === 'string');
    }
  }
  return [];
}

function toRecord(raw: Record<string, unknown>): TranscriptRecord | null {
  const id = readString(raw, 'id', 'transcript_id');
  if (!id) return null;

  const segmentsRaw = raw.segments;
  const segments: TranscriptSegment[] = Array.isArray(segmentsRaw)
    ? (segmentsRaw as Array<Record<string, unknown>>)
        .filter((s) => typeof s.text === 'string')
        .map((s) => ({
          start: typeof s.start === 'number' ? s.start : undefined,
          end: typeof s.end === 'number' ? s.end : undefined,
          speaker: typeof s.speaker === 'string' ? s.speaker : null,
          text: s.text as string,
        }))
    : [];

  const storyteller =
    typeof raw.storyteller === 'object' && raw.storyteller !== null
      ? (raw.storyteller as Record<string, unknown>)
      : {};

  const project =
    typeof raw.project === 'object' && raw.project !== null
      ? (raw.project as Record<string, unknown>)
      : {};

  return {
    id,
    title: readString(raw, 'title') || 'Untitled transcript',
    storytellerId:
      readString(raw, 'storyteller_id', 'storytellerId') || readString(storyteller, 'id'),
    storytellerName: readString(storyteller, 'display_name', 'displayName', 'name'),
    projectId: readString(raw, 'project_id', 'projectId') || readString(project, 'id'),
    projectSlug: readString(raw, 'project_slug', 'projectSlug') || readString(project, 'slug'),
    organizationId: readString(raw, 'organization_id', 'organizationId'),

    content: readString(raw, 'content', 'transcript_content', 'text', 'formatted_text'),
    formattedText: readString(raw, 'formatted_text', 'formattedText'),
    segments,

    audioUrl: readString(raw, 'audio_url', 'audioUrl'),
    videoUrl: readString(raw, 'video_url', 'videoUrl'),
    sourceVideoUrl: readString(raw, 'source_video_url', 'sourceVideoUrl'),
    sourceVideoPlatform: readString(raw, 'source_video_platform', 'sourceVideoPlatform'),
    sourceVideoThumbnail: readString(raw, 'source_video_thumbnail', 'sourceVideoThumbnail'),
    durationSeconds: readNumber(raw, 'duration_seconds', 'durationSeconds', 'source_video_duration'),
    language: readString(raw, 'language'),

    themes: readStringArray(raw, 'themes'),
    keyQuotes: readStringArray(raw, 'key_quotes', 'keyQuotes'),
    aiSummary: readString(raw, 'ai_summary', 'aiSummary', 'summary'),

    processingStatus: readString(raw, 'processing_status', 'processingStatus', 'status') as
      | TranscriptProcessingStatus
      | null,
    culturalSensitivity: readString(
      raw,
      'cultural_sensitivity',
      'culturalSensitivity'
    ) as TranscriptCulturalSensitivity | null,
    requiresElderReview: Boolean(readBool(raw, 'requires_elder_review', 'requiresElderReview')),
    elderReviewedAt: readString(raw, 'elder_reviewed_at', 'elderReviewedAt'),
    processingConsent: readBool(raw, 'processing_consent', 'processingConsent'),
    aiProcessingConsent: readBool(raw, 'ai_processing_consent', 'aiProcessingConsent'),

    recordedAt: readString(raw, 'recording_date', 'recordedAt', 'recorded_at'),
    createdAt: readString(raw, 'created_at', 'createdAt'),
    updatedAt: readString(raw, 'updated_at', 'updatedAt'),
  };
}

export const getAllTranscripts = cache((): TranscriptRecord[] => {
  return SNAPSHOT.transcripts
    .map((raw) => toRecord(raw))
    .filter((r): r is TranscriptRecord => r !== null);
});

export const getTranscriptById = cache((id: string): TranscriptRecord | null => {
  return getAllTranscripts().find((t) => t.id === id) || null;
});

export const getTranscriptsForStoryteller = cache(
  (storytellerId: string): TranscriptRecord[] => {
    return getAllTranscripts().filter((t) => t.storytellerId === storytellerId);
  }
);

export const getTranscriptsForProject = cache(
  (projectSlug: string): TranscriptRecord[] => {
    return getAllTranscripts().filter((t) => t.projectSlug === projectSlug);
  }
);

/**
 * Guard: should this transcript be renderable to the public?
 * - Requires processing_consent (or not explicitly false).
 * - If elder review is required, must have been reviewed.
 * - sacred / restricted cultural_sensitivity is hidden.
 * - Must be in a terminal non-failure processing state.
 */
export function canDisplayTranscript(t: TranscriptRecord): boolean {
  if (t.processingConsent === false) return false;
  if (t.aiProcessingConsent === false) return false;
  if (t.requiresElderReview && !t.elderReviewedAt) return false;
  if (t.culturalSensitivity === 'sacred' || t.culturalSensitivity === 'restricted') {
    return false;
  }
  if (
    t.processingStatus === 'failed' ||
    t.processingStatus === 'consent_required' ||
    t.processingStatus === 'paused'
  ) {
    return false;
  }
  return true;
}

export function getTranscriptSnapshotMeta() {
  return {
    generatedAt: SNAPSHOT.generatedAt,
    sourceUrl: SNAPSHOT.sourceUrl,
    siteSlug: SNAPSHOT.siteSlug,
    transcriptCount: SNAPSHOT.transcriptCount,
    note: SNAPSHOT.note ?? null,
  };
}
