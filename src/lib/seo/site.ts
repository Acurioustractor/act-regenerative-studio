import type { Metadata } from 'next';

export const siteUrl = (() => {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL || '';
  if (!candidate || /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(candidate)) {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://act-regenerative-studio.vercel.app';
  }
  return candidate.replace(/\/$/, '');
})();

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, siteUrl).toString();
}

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  image?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  noIndex = false,
  image,
}: PageMetadataInput): Metadata {
  const imageMeta = image
    ? [
        {
          url: image.url,
          width: image.width || 1200,
          height: image.height || 630,
          alt: image.alt,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      siteName: 'A Curious Tractor',
      title,
      description,
      url: path,
      images: imageMeta,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image.url] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'A Curious Tractor',
  legalName: 'A Curious Tractor Pty Ltd',
  identifier: 'ACN 697 347 676',
  url: siteUrl,
  logo: absoluteUrl('/branding/act-logo-square.png'),
  email: 'hi@act.place',
  description:
    'A regenerative innovation studio stewarding a farm on Jinibara Country, building public works, story systems, circular goods, and land-based projects.',
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'A Curious Tractor',
  url: siteUrl,
  publisher: {
    '@type': 'Organization',
    name: 'A Curious Tractor',
  },
};

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  image,
  authorName,
  publishedAt,
  modifiedAt,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  modifiedAt?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    image: image ? [absoluteUrl(image)] : undefined,
    author: authorName
      ? {
          '@type': 'Person',
          name: authorName,
        }
      : {
          '@type': 'Organization',
          name: 'A Curious Tractor',
        },
    publisher: {
      '@type': 'Organization',
      name: 'A Curious Tractor',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/branding/act-logo-square.png'),
      },
    },
    datePublished: publishedAt || undefined,
    dateModified: modifiedAt || publishedAt || undefined,
  };
}
