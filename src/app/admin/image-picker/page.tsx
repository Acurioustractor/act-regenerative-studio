"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  kind: string;
  title: string | null;
  alt: string | null;
  caption: string | null;
  credit: string | null;
}

interface ProjectMedia {
  slug: string;
  title: string;
  images: MediaItem[];
}

export default function ImagePickerPage() {
  const [projects, setProjects] = useState<ProjectMedia[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Load from the generated snapshot
    fetch("/api/image-picker")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => {});
  }, []);

  const filtered = search
    ? projects.filter(
        (p) =>
          p.slug.includes(search.toLowerCase()) ||
          p.title.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  const activeProject = selected
    ? projects.find((p) => p.slug === selected)
    : null;

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#111]/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg font-semibold">Image Picker</h1>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
          />
        </div>
        {/* Project tabs */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {filtered.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelected(p.slug)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                selected === p.slug
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {p.title || p.slug}{" "}
              <span className="ml-1 opacity-40">{p.images.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-6">
        {!activeProject ? (
          <div className="py-20 text-center text-white/30">
            <p className="text-lg">Pick a project above to browse photos</p>
            <p className="mt-2 text-sm">
              Click any image to copy its URL. Use it in page code or field-stills.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {activeProject.title || activeProject.slug}
              </h2>
              <p className="text-sm text-white/40">
                {activeProject.images.length} images. Click to copy URL.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {activeProject.images.map((img) => {
                const thumbUrl =
                  img.thumbnail_url || img.preview_url || img.url;
                const isCopied = copied === img.url;
                return (
                  <button
                    key={img.id}
                    onClick={() => copyUrl(img.url)}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-white/5 transition hover:border-white/20"
                    title={img.title || img.alt || img.url}
                  >
                    <Image
                      src={thumbUrl}
                      alt={img.alt || img.title || "Photo"}
                      fill
                      sizes="200px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="w-full">
                        {img.title && (
                          <p className="truncate text-xs text-white/80">
                            {img.title}
                          </p>
                        )}
                        <p className="mt-1 truncate text-[10px] text-white/40">
                          {img.url.split("/").pop()}
                        </p>
                      </div>
                    </div>
                    {/* Copied indicator */}
                    {isCopied && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-600/80">
                        <p className="text-sm font-bold text-white">
                          URL copied
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Copied toast */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-lg">
          URL copied to clipboard
        </div>
      )}
    </div>
  );
}
