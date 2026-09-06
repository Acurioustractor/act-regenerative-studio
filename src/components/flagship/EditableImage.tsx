"use client";

import NextImage from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface EditableImageProps {
  src: string;
  alt: string;
  slot: string;
  projectSlug: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

interface PickerImage {
  id: string;
  url: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  title: string | null;
  alt: string | null;
}

interface OrgGroup {
  slug: string;
  name: string;
  id: string | null;
  images: PickerImage[];
}

interface ProjectGroup {
  slug: string;
  title: string;
  images: PickerImage[];
}

type Segment = "projects" | "orgs";

const imageUrlPattern = /\.(jpe?g|png|webp|gif)(\?|#|$)/i;

function isImageUrl(url: string | null | undefined) {
  return Boolean(url && imageUrlPattern.test(url));
}

function pickerImageSource(image: PickerImage) {
  if (isImageUrl(image.thumbnail_url)) return image.thumbnail_url;
  if (isImageUrl(image.preview_url)) return image.preview_url;
  if (isImageUrl(image.url)) return image.url;
  return null;
}

export function EditableImage({
  src: defaultSrc,
  alt,
  slot,
  projectSlug,
  fill,
  sizes,
  className,
  priority,
}: EditableImageProps) {
  const [currentSrc, setCurrentSrc] = useState(defaultSrc);
  const [picking, setPicking] = useState(false);
  const [allOrgs, setAllOrgs] = useState<OrgGroup[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectGroup[]>([]);
  const [activeSegment, setActiveSegment] = useState<Segment>("projects");
  const [activeOrgSlug, setActiveOrgSlug] = useState<string>("");
  const [activeProjectSlug, setActiveProjectSlug] = useState<string>(projectSlug);
  const [loading, setLoading] = useState(false);

  // Load override from saved config on mount
  useEffect(() => {
    fetch("/api/image-overrides")
      .then((r) => r.json())
      .then((data) => {
        const override = data.overrides?.[slot];
        if (isImageUrl(override)) {
          setCurrentSrc(override);
        }
      })
      .catch(() => {});
  }, [slot]);

  function openPicker() {
    setPicking(true);
    if (allOrgs.length === 0 && allProjects.length === 0) {
      setLoading(true);
      fetch(`/api/image-picker`)
        .then((r) => r.json())
        .then((data) => {
          const orgs: OrgGroup[] = (data.organizations || []).filter(
            (o: OrgGroup) => o.images && o.images.length > 0
          );
          const projects: ProjectGroup[] = (data.projects || [])
            .filter((p: ProjectGroup) => p.images && p.images.length > 0)
            .sort((a: ProjectGroup, b: ProjectGroup) => {
              if (a.slug === projectSlug) return -1;
              if (b.slug === projectSlug) return 1;
              return a.title.localeCompare(b.title);
            });

          const projectOrgId =
            (data.projectOrgIdMap && data.projectOrgIdMap[projectSlug]) || null;
          const defaultOrg =
            orgs.find((o) => projectOrgId && o.id === projectOrgId) ||
            orgs.find((o) => o.slug === "a-curious-tractor") ||
            orgs[0];

          const hasProject = projects.some((p) => p.slug === projectSlug);

          setAllOrgs(orgs);
          setAllProjects(projects);
          setActiveOrgSlug(defaultOrg?.slug || "");
          setActiveProjectSlug(hasProject ? projectSlug : projects[0]?.slug || "");
          setActiveSegment(hasProject ? "projects" : "orgs");
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }

  async function pickImage(url: string) {
    if (!isImageUrl(url)) return;

    setCurrentSrc(url);
    setPicking(false);
    await fetch("/api/image-overrides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot, url }),
    }).catch(() => {});
  }

  const activeOrg = allOrgs.find((o) => o.slug === activeOrgSlug);
  const activeProject = allProjects.find((p) => p.slug === activeProjectSlug);
  const activeImages =
    activeSegment === "orgs"
      ? activeOrg?.images || []
      : activeProject?.images || [];
  const activeDisplayImages = activeImages.filter((image) => isImageUrl(image.url) && pickerImageSource(image));
  const activeLabel =
    activeSegment === "orgs"
      ? activeOrg?.name || "Empathy Ledger"
      : activeProject?.title || activeProject?.slug || "Project";

  return (
    <>
      <div className="group/edit absolute inset-0">
        <NextImage
          src={currentSrc}
          alt={alt}
          fill={fill}
          sizes={sizes}
          className={className}
          priority={priority}
          unoptimized
        />
        <button
          onClick={openPicker}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur transition-all hover:bg-black/80 hover:scale-110"
          title="Swap image"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      {/* Picker modal — portalled to body to escape any parent stacking context */}
      {picking && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center"
          onClick={() => setPicking(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-[var(--site-ink)] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Pick a photo
                </p>
                <p className="text-xs text-white/40">
                  {activeLabel}, {activeImages.length} images
                </p>
              </div>
              <button
                onClick={() => setPicking(false)}
                className="rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Segment toggle: ACT Projects | Organisations */}
            <div className="shrink-0 flex gap-2 border-b border-white/5 px-4 py-3">
              <button
                onClick={() => setActiveSegment("projects")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  activeSegment === "projects"
                    ? "bg-white text-[var(--site-ink)]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                ACT Projects
                <span className="ml-1.5 text-[10px] opacity-60">{allProjects.length}</span>
              </button>
              <button
                onClick={() => setActiveSegment("orgs")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  activeSegment === "orgs"
                    ? "bg-white text-[var(--site-ink)]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                Organisations
                <span className="ml-1.5 text-[10px] opacity-60">{allOrgs.length}</span>
              </button>
            </div>

            {/* Tabs within the active segment */}
            <div className="shrink-0 flex gap-1 overflow-x-auto border-b border-white/5 px-4 py-2">
              {activeSegment === "projects"
                ? allProjects.map((proj) => (
                    <button
                      key={proj.slug}
                      onClick={() => setActiveProjectSlug(proj.slug)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                        activeProjectSlug === proj.slug
                          ? "bg-white/20 text-white"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {proj.title}
                      <span className="ml-1 text-[10px] opacity-60">{proj.images.length}</span>
                    </button>
                  ))
                : allOrgs.map((org) => (
                    <button
                      key={org.slug}
                      onClick={() => setActiveOrgSlug(org.slug)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                        activeOrgSlug === org.slug
                          ? "bg-white/20 text-white"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {org.name}
                      <span className="ml-1 text-[10px] opacity-60">{org.images.length}</span>
                    </button>
                  ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="py-12 text-center text-sm text-white/30">Loading...</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {activeDisplayImages.map((img) => {
                    const thumb = pickerImageSource(img);
                    const isActive = currentSrc === img.url;
                    if (!thumb) return null;

                    return (
                      <button
                        key={img.id}
                        onClick={() => pickImage(img.url)}
                        className={`group relative aspect-square overflow-hidden rounded-lg transition ${
                          isActive
                            ? "ring-2 ring-green-500 ring-offset-2 ring-offset-[var(--site-ink)]"
                            : "hover:ring-1 hover:ring-white/30"
                        }`}
                      >
                        <NextImage
                          src={thumb}
                          alt={img.alt || img.title || ""}
                          fill
                          sizes="150px"
                          className="object-cover"
                        />
                        {img.title && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                            <p className="truncate text-[10px] text-white/80">{img.title}</p>
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-green-600/40">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
