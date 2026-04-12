import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';

import { cache } from 'react';

export interface LivingEcosystemMeta {
  description: string | null;
  version: string | null;
  updated: string | null;
  classification_values: string[];
  kind_values: string[];
  surface_role_values: string[];
  verification_status_values: string[];
}

export interface LivingEcosystemNode {
  display_name: string;
  kind: string;
  classification: string;
  surface_role: string;
  verification_status: string;
  human_decision_required: boolean;
  repo_path?: string | null;
  local_path?: string | null;
  site_url?: string | null;
  canonical_root?: string | null;
  canonical_note_path?: string | null;
  project_refs?: string[] | null;
  public_copy_owner_for?: string[] | null;
  generated_inputs?: string[] | null;
  notes?: string | null;
}

export interface LivingEcosystemOwnershipRule {
  owner_id: string;
  mirror_targets?: string[] | null;
  rule: string;
}

export interface LivingEcosystemCanon {
  _meta: LivingEcosystemMeta;
  systems: Record<string, LivingEcosystemNode>;
  surfaces: Record<string, LivingEcosystemNode>;
  ownership_rules: Record<string, LivingEcosystemOwnershipRule>;
}

export interface LivingEcosystemNodeRecord extends LivingEcosystemNode {
  id: string;
  scope: 'system' | 'surface';
}

const SNAPSHOT_PATH = path.resolve(
  process.cwd(),
  'src/data/living-ecosystem-canon.generated.json'
);

function createEmptyCanon(): LivingEcosystemCanon {
  return {
    _meta: {
      description: null,
      version: null,
      updated: null,
      classification_values: [],
      kind_values: [],
      surface_role_values: [],
      verification_status_values: [],
    },
    systems: {},
    surfaces: {},
    ownership_rules: {},
  };
}

async function resolveCanonPath(): Promise<string | null> {
  const candidates = [
    process.env.ACT_LIVING_ECOSYSTEM_CANON_PATH,
    path.resolve(process.cwd(), '../act-global-infrastructure/config/living-ecosystem-canon.json'),
    SNAPSHOT_PATH,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isFile()) {
        return candidate;
      }
    } catch {
      // Try next candidate.
    }
  }

  return null;
}

async function loadCanon(): Promise<LivingEcosystemCanon> {
  try {
    const canonPath = await resolveCanonPath();

    if (!canonPath) {
      return createEmptyCanon();
    }

    const raw = await fs.readFile(canonPath, 'utf8');
    return JSON.parse(raw) as LivingEcosystemCanon;
  } catch {
    return createEmptyCanon();
  }
}

export const getLivingEcosystemCanon = cache(
  async (): Promise<LivingEcosystemCanon> => loadCanon()
);

export const getLivingEcosystemSystems = cache(
  async (): Promise<LivingEcosystemNodeRecord[]> => {
    const canon = await getLivingEcosystemCanon();

    return Object.entries(canon.systems).map(([id, node]) => ({
      ...node,
      id,
      scope: 'system',
    }));
  }
);

export const getLivingEcosystemSurfaces = cache(
  async (): Promise<LivingEcosystemNodeRecord[]> => {
    const canon = await getLivingEcosystemCanon();

    return Object.entries(canon.surfaces).map(([id, node]) => ({
      ...node,
      id,
      scope: 'surface',
    }));
  }
);

export const getLivingEcosystemSummary = cache(
  async () => {
    const [systems, surfaces] = await Promise.all([
      getLivingEcosystemSystems(),
      getLivingEcosystemSurfaces(),
    ]);

    const allNodes = [...systems, ...surfaces];

    return {
      systemCount: systems.length,
      surfaceCount: surfaces.length,
      verifiedCount: allNodes.filter((node) => node.verification_status === 'verified').length,
      inferredCount: allNodes.filter((node) => node.verification_status === 'inferred').length,
      openDecisionCount: allNodes.filter((node) => node.human_decision_required).length,
    };
  }
);

export const getLivingEcosystemOpenDecisions = cache(
  async (): Promise<LivingEcosystemNodeRecord[]> => {
    const [systems, surfaces] = await Promise.all([
      getLivingEcosystemSystems(),
      getLivingEcosystemSurfaces(),
    ]);

    return [...systems, ...surfaces].filter((node) => node.human_decision_required);
  }
);
