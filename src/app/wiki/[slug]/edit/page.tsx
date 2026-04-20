import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { getCanonicalWikiPage } from '@/lib/wiki/canonical-site-wiki';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const PAGE_TYPES = [
  'principle',
  'method',
  'practice',
  'procedure',
  'guide',
  'template',
] as const;

const STATUSES = ['draft', 'active', 'needs_review', 'archived'] as const;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

function isAuthorized(token: string | undefined): boolean {
  const expected = process.env.WIKI_EDIT_TOKEN;
  if (!expected) return false;
  return typeof token === 'string' && token === expected;
}

export const metadata = {
  title: 'Edit wiki page | A Curious Tractor',
  robots: 'noindex',
};

async function saveWikiPage(slug: string, token: string, formData: FormData) {
  'use server';

  if (!isAuthorized(token)) {
    throw new Error('Unauthorized');
  }

  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }

  const title = String(formData.get('title') || '').trim();
  const excerpt = String(formData.get('excerpt') || '').trim();
  const content = String(formData.get('content') || '').trim();
  const pageType = String(formData.get('page_type') || 'method');
  const status = String(formData.get('status') || 'active');

  if (!title || !content) {
    throw new Error('Title and content are required');
  }
  if (!(PAGE_TYPES as readonly string[]).includes(pageType)) {
    throw new Error(`Invalid page_type: ${pageType}`);
  }
  if (!(STATUSES as readonly string[]).includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const { error } = await client
    .from('wiki_pages')
    .upsert(
      {
        slug,
        title,
        excerpt: excerpt || null,
        content,
        page_type: pageType,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    );
  if (error) throw new Error(`Save failed: ${error.message}`);

  revalidatePath(`/wiki/${slug}`);
  revalidatePath('/wiki');
  redirect(`/wiki/${slug}?saved=1`);
}

export default async function EditWikiPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (!isAuthorized(token)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--we-olive)]">
          Editing disabled
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--we-olive-deep)]">
          Wiki editing requires the <code className="px-1 text-[var(--we-warm-brown)]">WIKI_EDIT_TOKEN</code> env var and
          a matching <code className="px-1 text-[var(--we-warm-brown)]">?token=</code> query parameter. This is a dev-mode
          gate — replace with proper session auth before exposing to external users.
        </p>
        <Link
          href={`/wiki/${slug}`}
          className="mt-6 inline-block text-sm uppercase tracking-[0.22em] text-[var(--we-brown-deep)] underline"
        >
          ← Back to page
        </Link>
      </div>
    );
  }

  const existing = await getCanonicalWikiPage(slug);

  const save = saveWikiPage.bind(null, slug, token || '');

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/wiki/${slug}`}
          className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)] underline"
        >
          ← Back to page
        </Link>
        <span className="rounded-full border border-[#D7C4A2] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#7A6A55]">
          Editing · saves to Supabase
        </span>
      </div>

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-brown-deep)]">
          {existing ? 'Edit wiki page' : 'New wiki page'}
        </p>
        <h1 className="font-[var(--font-display)] text-3xl font-light text-[var(--we-olive)]">
          {existing?.title || slug}
        </h1>
        <p className="text-xs text-[var(--we-brown-deep)]">
          Slug: <code>{slug}</code>
          {existing?.source ? (
            <span>
              {' '}· current source: <strong>{existing.source}</strong>
            </span>
          ) : null}
        </p>
      </header>

      <form action={save} className="space-y-6">
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
            Title
          </span>
          <input
            name="title"
            required
            defaultValue={existing?.title || ''}
            className="w-full rounded-xl border border-[var(--we-sand)] bg-white px-4 py-2 text-base text-[var(--we-olive)] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
            Excerpt
          </span>
          <textarea
            name="excerpt"
            rows={3}
            defaultValue={existing?.excerpt || ''}
            className="w-full rounded-xl border border-[var(--we-sand)] bg-white px-4 py-2 text-sm text-[var(--we-olive-deep)] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
            Content (markdown)
          </span>
          <textarea
            name="content"
            required
            rows={20}
            defaultValue={existing?.content || ''}
            className="w-full rounded-xl border border-[var(--we-sand)] bg-white px-4 py-3 font-mono text-sm text-[var(--we-olive-deep)] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
              Page type (PMPP)
            </span>
            <select
              name="page_type"
              defaultValue="method"
              className="w-full rounded-xl border border-[var(--we-sand)] bg-white px-4 py-2 text-sm text-[var(--we-olive)]"
            >
              {PAGE_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-[var(--we-brown-deep)]">
              Status
            </span>
            <select
              name="status"
              defaultValue="active"
              className="w-full rounded-xl border border-[var(--we-sand)] bg-white px-4 py-2 text-sm text-[var(--we-olive)]"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href={`/wiki/${slug}`}
            className="rounded-full border border-[var(--we-sand)] px-5 py-2 text-sm uppercase tracking-[0.2em] text-[var(--we-brown-deep)] hover:border-[var(--we-olive)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-full bg-[var(--we-olive)] px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#3A4A3D]"
          >
            Save to Supabase
          </button>
        </div>
      </form>
    </div>
  );
}
