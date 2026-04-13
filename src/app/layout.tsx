import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Source_Serif_4, Work_Sans } from "next/font/google";
import UnifiedFooter from "../components/UnifiedFooter";
import "./globals.css";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const serifBody = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
});

const sansFont = Work_Sans({
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
    <html lang="en" className={`${displayFont.variable} ${serifBody.variable} ${sansFont.variable}`}>
      <body className="min-h-screen font-[var(--font-body)] text-[var(--site-ink)] antialiased">
        <div className="site-shell mx-auto flex min-h-screen max-w-[1320px] flex-col px-4 pb-4 md:px-6">
          {/* subtle top fade */}
          <header className="sticky top-0 z-40 pt-4 md:pt-5">
            <div className="relative overflow-hidden rounded-lg border border-[var(--site-line)] bg-[var(--site-panel)] px-5 py-4 shadow-[var(--site-shadow)] backdrop-blur-xl md:px-6">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <Link
                  href="/"
                  className="site-glow-link flex items-center gap-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-[var(--site-line)] bg-white/80">
                    <Image
                      src="/branding/act-logo-square.png"
                      alt="A Curious Tractor logo"
                      width={40}
                      height={40}
                      className="h-8 w-8 object-contain"
                      priority
                    />
                  </span>
                  <span className="font-[var(--font-display)] text-xl font-bold text-[var(--site-ink)]">
                    A Curious Tractor
                  </span>
                </Link>

                <nav className="flex flex-wrap items-center gap-1 md:gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="site-glow-link px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--site-muted)] hover:text-[var(--site-ink)]"
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
