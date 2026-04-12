import 'server-only';

import snapshot from '@/data/wiki-flagship-project-packs.generated.json';
import type {
  ACTFlagshipProjectPack,
  ACTFlagshipProjectPackSnapshot,
} from '@/types/shared/act-flagship-project-pack';

const SNAPSHOT = snapshot as ACTFlagshipProjectPackSnapshot;

export async function getFlagshipProjectPacks(): Promise<ACTFlagshipProjectPack[]> {
  return Array.isArray(SNAPSHOT.packs) ? SNAPSHOT.packs : [];
}

export async function getFlagshipProjectPack(
  slug: string
): Promise<ACTFlagshipProjectPack | null> {
  const packs = await getFlagshipProjectPacks();
  return packs.find((pack) => pack.slug === slug) || null;
}
