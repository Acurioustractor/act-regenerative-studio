/**
 * Empathy Ledger Service Syndication
 *
 * Site-scoped services/capabilities for the ACT site.
 * Unlike the old content-hub service feed, this only reads the service layer
 * that sits inside the site's existing project/org boundary.
 */

import { cache } from 'react';
import {
  EMPATHY_LEDGER_SITE_SLUG,
  fetchEmpathyLedgerJson,
} from '@/lib/empathy-ledger-runtime';

async function fetchJson<T>(url: string): Promise<T | null> {
  return fetchEmpathyLedgerJson<T>(url, { revalidate: 300 });
}

export interface LiveServiceStoryPreview {
  id: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  themes: string[];
  storyteller: {
    id: string | null;
    displayName: string;
    avatarUrl: string | null;
  } | null;
}

export interface LiveServiceMediaItem {
  id: string;
  kind: 'image' | 'video' | 'audio' | 'other';
  type: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  title: string | null;
  altText: string | null;
  caption: string | null;
  duration: number | null;
}

export interface LiveServiceRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  serviceType: string | null;
  status: string | null;
  imageUrl: string | null;
  organizationId: string | null;
  address: string | null;
  location: { lat: number; lng: number } | null;
  storytellerCount: number;
  linkedStoryCount: number;
  linkedStories: LiveServiceStoryPreview[];
  topThemes: Array<{ theme: string; count: number }>;
  galleryIds: string[];
  media: {
    photoCount: number;
    videoCount: number;
    photoPreviews: LiveServiceMediaItem[];
    videoPreviews: LiveServiceMediaItem[];
  };
  detail: {
    overview: string | null;
    longDescription: string | null;
    deliveryPillars: string[];
    keyOutcomes: string[];
    audience: string[];
    serviceTags: string[];
    cta: {
      label: string | null;
      url: string | null;
      text: string | null;
    };
    testimonial: {
      quote: string | null;
      author: string | null;
      role: string | null;
    };
    impactStats: Array<{
      label: string;
      value: string;
    }>;
  };
  relatedProjects: Array<{ id: string; name: string; projectCode: string | null }>;
  createdAt: string | null;
  updatedAt: string | null;
  detailUrl: string;
}

interface LiveServiceListResponse {
  services: LiveServiceRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

interface LiveServiceDetailResponse {
  service: LiveServiceRecord;
  stories: LiveServiceStoryPreview[];
  storytellers: Array<{
    id: string;
    display_name?: string | null;
    displayName?: string | null;
    bio: string | null;
    location: string | null;
    role: string | null;
    is_elder?: boolean;
    isElder?: boolean;
    profile_image_url?: string | null;
    profileImageUrl?: string | null;
  }>;
  media: LiveServiceMediaItem[];
  meta: {
    storyCount: number;
    storytellerCount: number;
    mediaCount: number;
    galleryCount: number;
    fetchedAt: string;
  };
}

type LiveServiceOptions = {
  limit?: number;
  page?: number;
  organizationId?: string;
  serviceType?: string;
  status?: string;
};

const getLiveServicesForSiteCached = cache(
  async (serializedOptions: string): Promise<LiveServiceRecord[]> => {
    if (!process.env.EMPATHY_LEDGER_API_KEY) {
      return [];
    }

    const options = JSON.parse(serializedOptions) as LiveServiceOptions;
    const params = new URLSearchParams();

    if (options.limit) params.set('limit', String(options.limit));
    if (options.page) params.set('page', String(options.page));
    if (options.organizationId) params.set('organizationId', options.organizationId);
    if (options.serviceType) params.set('serviceType', options.serviceType);
    if (options.status) params.set('status', options.status);

    const url = `/api/v2/sites/${EMPATHY_LEDGER_SITE_SLUG}/services${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    const response = await fetchJson<LiveServiceListResponse>(url);
    return response?.services || [];
  }
);

export async function getLiveServicesForSite(options: LiveServiceOptions = {}): Promise<LiveServiceRecord[]> {
  const serializedOptions = JSON.stringify({
    limit: options.limit ?? null,
    page: options.page ?? null,
    organizationId: options.organizationId ?? null,
    serviceType: options.serviceType ?? null,
    status: options.status ?? null,
  });

  return getLiveServicesForSiteCached(serializedOptions);
}

export async function getLiveServiceForSite(
  serviceKey: string,
  options: {
    storyLimit?: number;
    mediaLimit?: number;
    storytellerLimit?: number;
  } = {}
): Promise<LiveServiceDetailResponse | null> {
  if (!process.env.EMPATHY_LEDGER_API_KEY) {
    return null;
  }

  const params = new URLSearchParams();

  if (options.storyLimit) params.set('storyLimit', String(options.storyLimit));
  if (options.mediaLimit) params.set('mediaLimit', String(options.mediaLimit));
  if (options.storytellerLimit) {
    params.set('storytellerLimit', String(options.storytellerLimit));
  }

  const url = `/api/v2/sites/${EMPATHY_LEDGER_SITE_SLUG}/services/${serviceKey}${
    params.toString() ? `?${params.toString()}` : ''
  }`;

  return fetchJson<LiveServiceDetailResponse>(url);
}
