"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase/client";

type ContentItem = {
  id: string;
  type: string;
  slug: string;
  title: string;
  status: string;
  updated_at: string;
  published_at: string | null;
};

const typeOptions = [
  "post",
  "page",
  "project",
  "event",
  "residency",
  "news",
  "case_study",
];

const statusOptions = ["draft", "scheduled", "published", "archived"];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ContentListPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newType, setNewType] = useState("post");
  const [creating, setCreating] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("content_items")
      .select("id, type, slug, title, status, updated_at, published_at")
      .order("updated_at", { ascending: false });

    if (filterType !== "all") {
      query = query.eq("type", filterType);
    }

    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setItems(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [filterType, filterStatus]);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);

    const resolvedSlug = newSlug.trim() || slugify(newTitle);
    if (!newTitle.trim() || !resolvedSlug) {
      setError("Title and slug are required.");
      setCreating(false);
      return;
    }

    const { data, error: createError } = await supabase
      .from("content_items")
      .insert({
        title: newTitle.trim(),
        slug: resolvedSlug,
        type: newType,
        status: "draft",
      })
      .select("id")
      .single();

    if (createError) {
      setError(createError.message);
      setCreating(false);
      return;
    }

    setNewTitle("");
    setNewSlug("");
    setCreating(false);

    if (data?.id) {
      router.push(`/admin/content/${data.id}`);
    } else {
      fetchItems();
    }
  };

  const list = useMemo(() => items, [items]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6">
        <h2 className="text-xl font-semibold text-[var(--we-olive)] font-[var(--font-display)]">
          Create new content
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            className="rounded-2xl border border-[var(--we-sand)] bg-white px-4 py-3 text-sm"
          />
          <input
            type="text"
            placeholder="slug"
            value={newSlug}
            onChange={(event) => setNewSlug(event.target.value)}
            className="rounded-2xl border border-[var(--we-sand)] bg-white px-4 py-3 text-sm"
          />
          <select
            value={newType}
            onChange={(event) => setNewType(event.target.value)}
            className="rounded-2xl border border-[var(--we-sand)] bg-white px-4 py-3 text-sm"
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="rounded-full bg-forest px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
        {error ? (
          <p className="mt-3 text-sm text-[#B4321E]">{error}</p>
        ) : null}
      </section>

      <section className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[var(--we-olive)] font-[var(--font-display)]">
            Content library
          </h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              className="rounded-full border border-[var(--we-sand)] bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--we-olive)]"
            >
              <option value="all">All types</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="rounded-full border border-[var(--we-sand)] bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--we-olive)]"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-[var(--we-brown)]">Loading...</p>
        ) : (
          <div className="mt-6 space-y-3">
            {list.map((item) => (
              <Link
                key={item.id}
                href={`/admin/content/${item.id}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--we-sand)] bg-white/70 p-4 transition hover:border-forest"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--we-warm-brown)]">
                    {item.type}
                  </p>
                  <h3 className="text-lg font-semibold text-[var(--we-olive)]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--we-warm-brown)]">/{item.slug}</p>
                </div>
                <div className="text-right text-xs text-[var(--we-warm-brown)]">
                  <p className="uppercase tracking-[0.3em]">{item.status}</p>
                  <p>{new Date(item.updated_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
            {list.length === 0 ? (
              <p className="text-sm text-[var(--we-brown)]">No content yet.</p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
