import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { cache } from 'react';

export type ProjectSourcePacketMediaAsset = {
  asset_id: string
  kind: string
  uri_or_path: string
  caption?: string | null
  alt_text?: string | null
  usage_rights?: string | null
}

export type ProjectSourcePacketSourceRef = {
  source_id: string
  source_system: string
  source_kind: string
  uri_or_path: string
  captured_at?: string | null
  verification_status?: string | null
  notes?: string | null
}

export type ProjectSourcePacketReviewStage = {
  status?: string | null
  owner?: string | null
  decided_at?: string | null
  notes?: string | null
}

export type ProjectSourcePacketOutput = {
  target_surface?: string | null
  output_type?: string | null
  status?: string | null
  destination?: string | null
  notes?: string | null
}

export type ProjectSourcePacket = {
  packet_id: string
  schema_version?: string
  packet_type?: string
  status?: string
  canonical_entity?: {
    entity_type?: string | null
    canonical_slug?: string | null
    canonical_note_path?: string | null
    project_code?: string | null
    public_copy_owner?: string | null
  } | null
  source_refs?: ProjectSourcePacketSourceRef[] | null
  narrative?: {
    headline?: string | null
    summary?: string | null
    body_markdown?: string | null
    themes?: string[] | null
  } | null
  media_assets?: ProjectSourcePacketMediaAsset[] | null
  review?: {
    editorial?: ProjectSourcePacketReviewStage | null
    cultural?: ProjectSourcePacketReviewStage | null
    consent?: ProjectSourcePacketReviewStage | null
    release?: ProjectSourcePacketReviewStage | null
  } | null
  outputs?: ProjectSourcePacketOutput[] | null
  provenance?: {
    generated_at?: string | null
    generated_by?: string | null
    provenance_note_path?: string | null
    notes?: string | null
  } | null
  packet_context?: {
    site_slug?: string | null
    destination?: string | null
    project_name?: string | null
    story_ids?: string[] | null
    storyteller_ids?: string[] | null
    media_asset_ids?: string[] | null
    featured_article_slugs?: string[] | null
  } | null
}

type SourcePacketSnapshot = {
  generatedAt: string | null
  sourceUrl: string | null
  siteSlug: string | null
  destination: string | null
  packetCount: number
  packets: Record<string, ProjectSourcePacket>
}

const SNAPSHOT_PATH = path.join(
  process.cwd(),
  'src/data/empathy-ledger-source-packets.generated.json'
);

function createEmptySnapshot(): SourcePacketSnapshot {
  return {
    generatedAt: null,
    sourceUrl: null,
    siteSlug: null,
    destination: null,
    packetCount: 0,
    packets: {},
  };
}

function loadSnapshot(): SourcePacketSnapshot {
  try {
    const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf8');
    return JSON.parse(raw) as SourcePacketSnapshot;
  } catch {
    return createEmptySnapshot();
  }
}

export const getSourcePacketSnapshot = cache(
  (): SourcePacketSnapshot => loadSnapshot()
);

export const getProjectSourcePacket = cache(
  async (projectSlug: string): Promise<ProjectSourcePacket | null> => {
    const snapshot = getSourcePacketSnapshot();
    return snapshot.packets?.[projectSlug] || null;
  }
);

export const getAllProjectSourcePackets = cache(
  async (): Promise<Array<{ slug: string; packet: ProjectSourcePacket }>> => {
    const snapshot = getSourcePacketSnapshot();

    return Object.entries(snapshot.packets || {})
      .map(([slug, packet]) => ({ slug, packet }))
      .sort((left, right) => {
        const leftTitle =
          left.packet.packet_context?.project_name ||
          left.packet.narrative?.headline ||
          left.slug;
        const rightTitle =
          right.packet.packet_context?.project_name ||
          right.packet.narrative?.headline ||
          right.slug;

        return leftTitle.localeCompare(rightTitle);
      });
  }
);
