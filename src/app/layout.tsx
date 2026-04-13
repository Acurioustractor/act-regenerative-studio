import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Work_Sans } from "next/font/google";
import UnifiedFooter from "../components/UnifiedFooter";
import "./globals.css";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const navItems = [
  { label: "Studio", href: "/studio" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Projects", href: "/projects" },
  { label: "Works", href: "/art" },
  { label: "Method", href: "/method" },
  { label: "Contact", href: "/contact" },
];

export const metadata: Metadata = {
  title: "A Curious Tractor | Regenerative Innovation Studio",
  description:
    "A regenerative innovation studio stewarding a working farm on Jinibara Country.",
  icons: {
    icon: "/branding/act-logo-square.png",
    apple: "/branding/act-logo-square.png",
    shortcut: "/branding/act-logo-square.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen font-[var(--font-sans)] text-[#2F3E2E] antialiased">
        <div className="site-shell mx-auto flex min-h-screen max-w-[1320px] flex-col px-4 pb-4 md:px-6">
          <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[26rem] bg-gradient-to-b from-white/45 via-white/10 to-transparent" />
          <header className="sticky top-0 z-40 pt-4 md:pt-5">
            <div className="site-surface relative overflow-hidden rounded-[30px] px-5 py-4 md:px-6">
              <div className="absolute inset-y-0 left-[28%] hidden w-px bg-gradient-to-b from-transparent via-[#d8c3a8] to-transparent lg:block" />
              <div className="flex flex-wrap items-center justify-between gap-5">
                <Link
                  href="/"
                  className="site-glow-link flex items-center gap-3"
                >
                  <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#ddc8ae] bg-white/70 shadow-[0_10px_28px_rgba(74,56,34,0.08)]">
                    <Image
                      src="/branding/act-logo-square.png"
                      alt="A Curious Tractor logo"
                      width={48}
                      height={48}
                      className="h-10 w-10 object-contain"
                      priority
                    />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[0.63rem] font-semibold uppercase tracking-[0.38em] text-[#78634e]">
                      Regenerative studio
                    </span>
                    <span className="font-[var(--font-display)] text-xl font-semibold tracking-[0.08em] text-[#1f2b21] md:text-2xl">
                      A Curious Tractor
                    </span>
                  </span>
                </Link>

                <div className="hidden min-w-[240px] flex-1 px-6 lg:block">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#7b6753]">
                    Jinibara Country
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#5f4f41]">
                    Land, story, justice, and art held together by living knowledge.
                  </p>
                </div>

                <nav className="flex flex-wrap items-center gap-2 md:gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="site-glow-link rounded-full border border-[#dcc8af] bg-white/55 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#5c4d40] hover:border-[#2d6a4f] hover:bg-[#e7f2e7] hover:text-[#1f2b21]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </header>
          <main className="relative z-10 flex-1 py-8 md:py-12">{children}</main>
          <UnifiedFooter
            currentProject="A Curious Tractor"
            showProjects={true}
            customLinks={[
              { label: "Studio", href: "/studio" },
              { label: "Ecosystem", href: "/ecosystem" },
              { label: "Projects", href: "/projects" },
              { label: "Works", href: "/art" },
              { label: "Media", href: "/media" },
              { label: "Method", href: "/method" },
              { label: "Wiki", href: "/wiki" },
              { label: "People", href: "/people" },
              { label: "About", href: "/about" },
              { label: "Partners", href: "/partners" },
              { label: "Contact", href: "/contact" },
            ]}
            contactEmail="hi@act.place"
          />
        </div>
      </body>
    </html>
  );
}
