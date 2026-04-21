"use client";

import { useState, useMemo } from "react";
import NextImage from "next/image";
import { createPortal } from "react-dom";
import featuredSnapshot from "@/data/empathy-ledger-featured.generated.json";

interface EmpathyLedgerConnectionsProps {
  projectSlug: string;
  projectTitle: string;
  orgSlug: string;
  elProjectSlugs?: string[];
  notes?: string;
}

interface MediaItem {
  id: string;
  url: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  kind: string;
  title: string | null;
  alt: string | null;
}

interface OrgBlock {
  org: { slug: string; name: string; id: string };
  media?: { items?: MediaItem[] };
}

interface ProjectBlock {
  project: { slug: string; title: string };
  media?: { items?: MediaItem[] };
  featured?: {
    stories?: Array<{ story_id: string; story_title: string; story_url: string | null }>;
    storytellers?: Array<{ storyteller_id: string; display_name: string | null }>;
  };
}

const EL_PUBLIC_URL =
  process.env.NEXT_PUBLIC_EMPATHY_LEDGER_URL || "https://empathy-ledger-v2.vercel.app";

export function EmpathyLedgerConnections({
  projectSlug,
  projectTitle,
  orgSlug,
  elProjectSlugs = [],
  notes,
}: EmpathyLedgerConnectionsProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"photos" | "videos" | "stories">("photos");
  const [scope, setScope] = useState<"project" | "org">("project");

  const snapshot = featuredSnapshot as unknown as {
    organizations?: Record<string, OrgBlock | null>;
    projects: Record<string, ProjectBlock | null>;
  };

  const orgBlock = snapshot.organizations?.[orgSlug] || null;
  const projectBlock = snapshot.projects?.[projectSlug] || null;

  const projectPool = useMemo(() => {
    const items = projectBlock?.media?.items || [];
    return {
      photos: items.filter((m) => m.kind === "image"),
      videos: items.filter((m) => m.kind === "video"),
    };
  }, [projectBlock]);

  const orgPool = useMemo(() => {
    const items = orgBlock?.media?.items || [];
    return {
      photos: items.filter((m) => m.kind === "image"),
      videos: items.filter((m) => m.kind === "video"),
    };
  }, [orgBlock]);

  const photos = scope === "project" ? projectPool.photos : orgPool.photos;
  const videos = scope === "project" ? projectPool.videos : orgPool.videos;

  const stories = projectBlock?.featured?.stories || [];
  const storytellers = projectBlock?.featured?.storytellers || [];

  const orgName = orgBlock?.org?.name || orgSlug;

  return (
    <>
      {/* Collapsed launcher button (bottom-left, fixed) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-[90] flex items-center gap-2 rounded-full bg-[var(--we-olive,#5a6b3a)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg transition hover:opacity-90"
        aria-label="Open Empathy Ledger connections"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span>EL · {orgName}</span>
        {(photos.length + videos.length + stories.length) > 0 && (
          <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
            {photos.length + videos.length + stories.length}
          </span>
        )}
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-end justify-start bg-black/60 backdrop-blur-sm sm:items-stretch"
          onClick={() => setOpen(false)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col overflow-hidden bg-[#1a1a1a] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="shrink-0 border-b border-white/10 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Empathy Ledger · {projectTitle}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">{orgName}</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {notes && (
                <p className="mt-2 rounded-md bg-amber-500/10 px-2 py-1 text-[11px] text-amber-200/90">
                  {notes}
                </p>
              )}

              {/* Deep links */}
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`${EL_PUBLIC_URL}/organizations/${orgSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/90 transition hover:bg-white/10"
                >
                  Open org in EL →
                </a>
                {elProjectSlugs.map((elSlug) => (
                  <a
                    key={elSlug}
                    href={`${EL_PUBLIC_URL}/projects/${elSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/90 transition hover:bg-white/10"
                  >
                    {elSlug} →
                  </a>
                ))}
              </div>
            </div>

            {/* Scope toggle: Project vs Organisation pool */}
            {tab !== "stories" && (
              <div className="shrink-0 flex gap-1 border-b border-white/10 px-4 py-2">
                <button
                  onClick={() => setScope("project")}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition ${
                    scope === "project"
                      ? "bg-white/20 text-white"
                      : "text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  This project
                  <span className="ml-1 opacity-60">
                    {tab === "videos" ? projectPool.videos.length : projectPool.photos.length}
                  </span>
                </button>
                <button
                  onClick={() => setScope("org")}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition ${
                    scope === "org"
                      ? "bg-white/20 text-white"
                      : "text-white/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Whole org · {orgName}
                  <span className="ml-1 opacity-60">
                    {tab === "videos" ? orgPool.videos.length : orgPool.photos.length}
                  </span>
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="shrink-0 flex gap-1 border-b border-white/10 px-4 py-2">
              {[
                { key: "photos" as const, label: "Photos", count: photos.length },
                { key: "videos" as const, label: "Videos", count: videos.length },
                { key: "stories" as const, label: "Stories", count: stories.length },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    tab === t.key
                      ? "bg-white text-[#1a1a1a]"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t.label}
                  <span className="ml-1 text-[10px] opacity-60">{t.count}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {tab === "photos" && (
                photos.length === 0 ? (
                  <EmptyState label="No photos in this org's EL pool yet." />
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {photos.map((p) => {
                      const thumb = p.thumbnail_url || p.preview_url || p.url;
                      return (
                        <a
                          key={p.id}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-square overflow-hidden rounded-md bg-white/5 transition hover:ring-1 hover:ring-white/40"
                        >
                          <NextImage
                            src={thumb}
                            alt={p.alt || p.title || ""}
                            fill
                            sizes="180px"
                            className="object-cover"
                            unoptimized
                          />
                        </a>
                      );
                    })}
                  </div>
                )
              )}

              {tab === "videos" && (
                videos.length === 0 ? (
                  <EmptyState label="No videos in this org's EL pool yet." />
                ) : (
                  <div className="space-y-3">
                    {videos.map((v) => (
                      <a
                        key={v.id}
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-md border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                      >
                        <p className="text-sm font-medium">{v.title || "Untitled video"}</p>
                        <p className="mt-1 truncate text-[11px] text-white/50">{v.url}</p>
                      </a>
                    ))}
                  </div>
                )
              )}

              {tab === "stories" && (
                <>
                  {stories.length === 0 && storytellers.length === 0 ? (
                    <EmptyState label="No stories or storytellers linked to this project in EL yet." />
                  ) : (
                    <div className="space-y-4">
                      {stories.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                            Stories ({stories.length})
                          </h3>
                          <div className="space-y-2">
                            {stories.map((s) => (
                              <a
                                key={s.story_id}
                                href={s.story_url || `${EL_PUBLIC_URL}/stories/${s.story_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-md border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10"
                              >
                                {s.story_title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {storytellers.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                            Storytellers ({storytellers.length})
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {storytellers.map((st) => (
                              <span
                                key={st.storyteller_id}
                                className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/80"
                              >
                                {st.display_name || "Anonymous"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-white/10 px-5 py-3 text-[10px] text-white/40">
              Use these assets for reflections, story-writing, and page design. All content sits in Empathy Ledger under consent.
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="py-12 text-center text-xs text-white/40">{label}</p>
  );
}
