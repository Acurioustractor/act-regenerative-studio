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
  { label: "Projects", href: "/projects" },
  { label: "Storytellers", href: "/storytellers" },
  { label: "Art", href: "/art" },
  { label: "Farm", href: "/farm" },
  { label: "Method", href: "/method" },
  { label: "Wiki", href: "/wiki" },
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
      <body className="min-h-screen antialiased">
        {/* Floating nav — sits on top of full-bleed content */}
        <header className="fixed left-0 right-0 top-0 z-50 px-6 pt-4 md:px-8 md:pt-5">
          <div className="mx-auto max-w-[1200px]">
            <div className="relative overflow-hidden rounded-[var(--site-radius)] border border-[var(--site-line)] bg-[var(--site-panel)] px-5 py-3 shadow-[var(--site-shadow)] backdrop-blur-xl md:px-6">
              <div className="flex items-center justify-between gap-5">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
                    <Image
                      src="/branding/act-logo-square.png"
                      alt="A Curious Tractor logo"
                      width={32}
                      height={32}
                      className="h-7 w-7 object-contain"
                      priority
                    />
                  </span>
                  <span className="font-[var(--font-display)] text-lg font-bold text-[var(--site-ink)]">
                    A Curious Tractor
                  </span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--site-muted)] transition-colors hover:text-[var(--site-ink)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Full-bleed main — no max-width constraint */}
        <main className="relative z-10 min-h-screen">{children}</main>
        <UnifiedFooter
            currentProject="A Curious Tractor"
            showProjects={true}
            customLinks={[
              { label: "Projects", href: "/projects" },
              { label: "Art", href: "/art" },
              { label: "Farm", href: "/farm" },
              { label: "Method", href: "/method" },
              { label: "About", href: "/about" },
              { label: "Partners", href: "/partners" },
              { label: "Wiki", href: "/wiki" },
              { label: "Contact", href: "/contact" },
            ]}
            contactEmail="hi@act.place"
          />
      </body>
    </html>
  );
}
