import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "./forms/NewsletterForm";
import { studioProjectConfigs } from "@/lib/projects/studio-project-configs";

interface UnifiedFooterProps {
  currentProject?: string;
  showProjects?: boolean;
  customLinks?: Array<{ label: string; href: string }>;
  contactEmail?: string;
}

export default function UnifiedFooter({
  currentProject,
  showProjects = true,
  customLinks = [],
  contactEmail = "hi@act.place",
}: UnifiedFooterProps) {
  const fieldLinks = studioProjectConfigs
    .map((project) => ({
      name: project.fallbackTitle,
      href: project.href,
      tagline: project.fallbackTagline,
    }))
    .filter((project) => !currentProject || project.name !== currentProject);

  return (
    <footer className="mt-8 pb-2">
      <div className="mx-auto rounded-lg bg-[#1a1612] px-6 py-12 text-[#f2e8d9] md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div className="space-y-4">
            <p className="site-eyebrow text-[#dbc5a6] before:bg-[#8a7560]">
              A Curious Tractor
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-[#4a3c2f] bg-white/8">
                <Image
                  src="/branding/act-logo-square.png"
                  alt="A Curious Tractor logo"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain"
                />
              </span>
              <h3 className="font-[var(--font-display)] text-2xl font-semibold tracking-[0.05em] text-[#fff6ea]">
                A Curious Tractor
              </h3>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#e0d4c4]">
              A regenerative innovation studio stewarding a working farm on
              Jinibara Country. We cultivate seeds of impact through listening,
              curiosity, action, and art.
            </p>

            {/* Custom Links */}
            {customLinks.length > 0 && (
              <nav className="space-y-2 pt-4">
                {customLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="site-glow-link block text-sm text-[#e8ddd0] transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Column 2: Public fields */}
          {showProjects && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#dbc5a6]">
                Fields of practice
              </h3>
              <nav className="space-y-3">
                {fieldLinks.map((project) => (
                  <Link key={project.href} href={project.href} className="group block">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#f2e8d9] transition group-hover:text-[#9cd09e]">
                      {project.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 transition group-hover:opacity-100"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </div>
                    <div className="text-xs text-[#c8b8a4]">
                      {project.tagline}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Column 3: Studio — identity, governance, partners */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#dbc5a6]">
              Studio
            </h3>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#e0d4c4]">
              {[
                { label: 'About', href: '/about' },
                { label: 'Vision', href: '/vision' },
                { label: 'Method', href: '/method' },
                { label: 'Principles', href: '/principles' },
                { label: 'How we work', href: '/how-we-work' },
                { label: 'Governance', href: '/governance' },
                { label: 'Impact', href: '/impact' },
                { label: 'Studio services', href: '/studio' },
                { label: 'Partners', href: '/partners' },
                { label: 'Events', href: '/events' },
                { label: 'Ask ACT', href: '/ask' },
                { label: 'Wiki', href: '/wiki' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="site-glow-link transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#dbc5a6]">
              Connect
            </h3>

            <div className="space-y-3">
              <a
                href={`mailto:${contactEmail}`}
                className="site-glow-link block text-sm text-[#f2e8d9] transition hover:text-white"
              >
                {contactEmail}
              </a>

              <div className="pt-4">
                <h4 className="mb-2 text-sm font-medium text-[#fff6ea]">
                  Stay Connected
                </h4>
                <p className="mb-3 text-xs text-[#c8b8a4]">
                  Get updates about our ecosystem
                </p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#45382d] pt-8 text-xs text-[#c8b8a4] md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p>
              We acknowledge the Jinibara people as the Traditional Custodians
              of the land on which we work and live. We pay our respects to
              Elders past and present, and extend that respect to all Aboriginal
              and Torres Strait Islander peoples.
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <span>© {new Date().getFullYear()} A Curious Tractor</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
