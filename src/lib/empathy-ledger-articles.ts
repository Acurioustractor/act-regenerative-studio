import {
  getEditorialArticleBySlug,
  getProjectEditorialArticles,
  getSiteEditorialArticles,
  type EditorialArticle,
} from "@/lib/empathy-ledger-editorial";

export type ContentHubArticle = EditorialArticle;
export type ContentHubArticleDetail = EditorialArticle;

export async function fetchContentHubArticles(params: {
  project?: string;
  limit?: number;
}): Promise<ContentHubArticle[]> {
  if (params.project) {
    return getProjectEditorialArticles(params.project, params.limit || 20);
  }

  return getSiteEditorialArticles(params.limit || 20);
}

export async function fetchContentHubArticleBySlug(
  slug: string
): Promise<ContentHubArticleDetail | null> {
  return getEditorialArticleBySlug(slug);
}
