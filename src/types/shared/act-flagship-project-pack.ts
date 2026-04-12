/**
 * Shared types for ACT flagship project packs.
 *
 * SOURCE OF TRUTH: This file in ACT Main Website repo
 * Used by: ACT Website client, Empathy Ledger integrations
 */

export interface ACTFlagshipPackPerson {
  title: string;
  role: string | null;
  stem: string | null;
  wikiPath: string | null;
}

export interface ACTFlagshipPackSourceBridge {
  title: string;
  href: string;
  relativePath: string;
  wikiPath: string;
  stem: string;
}

export interface ACTFlagshipPackSection {
  id: string;
  title: string;
  body: string | null;
}

export interface ACTFlagshipPackImplementationRepo {
  name: string | null;
  localPath: string | null;
  github: string | null;
  githubUrl: string | null;
  description: string | null;
  stack: string | null;
  deployment: string | null;
  role: string | null;
}

export interface ACTFlagshipProjectPack {
  slug: string;
  title: string;
  status: string | null;
  canonicalSlug: string;
  canonicalCode: string | null;
  entityType: string | null;
  taggingMode: string | null;
  cluster: string | null;
  parentProject: string | null;
  empathyLedgerKey: string | null;
  websiteSlug: string | null;
  summary: string | null;
  overview: string | null;
  whatItIs: string | null;
  clusterContext: string | null;
  systemPosition: string | null;
  sourcePage: {
    relativePath: string;
    wikiPath: string;
    modifiedAt: string | null;
  };
  downstream: {
    website: {
      primaryPath: string | null;
      projectPath: string | null;
    };
    empathyLedger: {
      projectKey: string | null;
    };
  };
  implementation: {
    primaryRepo: ACTFlagshipPackImplementationRepo | null;
    supportingRepos: ACTFlagshipPackImplementationRepo[];
  };
  keyPeople: ACTFlagshipPackPerson[];
  sourceBridges: ACTFlagshipPackSourceBridge[];
  packSections: ACTFlagshipPackSection[];
}

export interface ACTFlagshipProjectPackSnapshot {
  generatedAt: string | null;
  sourceRoot: string | null;
  packCount: number;
  packs: ACTFlagshipProjectPack[];
}
