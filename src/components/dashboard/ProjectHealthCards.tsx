"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock, ExternalLink } from "lucide-react";

interface Project {
  name: string;
  slug: string;
  url: string;
  status: "healthy" | "degraded" | "down" | "unknown";
  lastDeployed: string;
  registryStatus: "active" | "stale" | "error" | "none";
  githubRepo: string;
  vercelProject: string;
}

export function ProjectHealthCards() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/dashboard/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
    const interval = setInterval(fetchProjects, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-forest" />;
      case "degraded":
        return <Clock className="w-5 h-5 text-[#FF9800]" />;
      case "down":
        return <AlertCircle className="w-5 h-5 text-[#F44336]" />;
      default:
        return <AlertCircle className="w-5 h-5 text-[#9E9E9E]" />;
    }
  };

  const getRegistryBadge = (status: Project["registryStatus"]) => {
    const badges = {
      active: "bg-forest/20 text-forest",
      stale: "bg-[#FF9800]/20 text-[#FF9800]",
      error: "bg-[#F44336]/20 text-[#F44336]",
      none: "bg-[#9E9E9E]/20 text-[#9E9E9E]",
    };
    return badges[status];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6 animate-pulse"
          >
            <div className="h-20 bg-[var(--we-sand)]/30 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.slug}
          className="rounded-3xl border border-[var(--we-sand)] bg-white/70 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status)}
                <h3 className="font-semibold text-[var(--we-olive)]">{project.name}</h3>
              </div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--we-brown)] hover:underline flex items-center gap-1 mt-1"
              >
                {project.url.replace(/^https?:\/\//, "")}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--we-brown)]">Last deployed:</span>
              <span className="text-[var(--we-olive)] font-medium">
                {new Date(project.lastDeployed).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--we-brown)]">Registry:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getRegistryBadge(
                  project.registryStatus
                )}`}
              >
                {project.registryStatus}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--we-sand)] flex gap-2">
            <a
              href={`https://github.com/${project.githubRepo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--we-brown)] hover:text-[var(--we-olive)] underline"
            >
              GitHub
            </a>
            <a
              href={`https://vercel.com/${project.vercelProject}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--we-brown)] hover:text-[var(--we-olive)] underline"
            >
              Vercel
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
