import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Source_Serif_4, Work_Sans } from "next/font/google";
import UnifiedFooter from "../components/UnifiedFooter";
import { MobileMenu } from "../components/MobileMenu";
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
  { label: "Stories", href: "/blog" },
  { label: "Art", href: "/art" },
  { label: "Farm", href: "/farm" },
  { label: "Method", href: "/method" },
  { label: "Wiki", href: "/wiki" },
  { label: "Contact", href: "/contact" },
];

const siteUrl = (() => {
  // Match sitemap.ts/robots.ts: reject dev URLs so production og:url / canonical
  // never points at localhost even if `.env.local` sets NEXT_PUBLIC_SITE_URL for previews.
  const candidate = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!candidate || /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(candidate)) {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://act-regenerative-studio.vercel.app";
  }
  return candidate;
})();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "A Curious Tractor | Regenerative Innovation Studio",
    template: "%s | A Curious Tractor",
  },
  description:
    "A regenerative innovation studio stewarding a farm on Jinibara Country. Places, story systems, and public works you can step into.",
  icons: {
    icon: "/branding/act-logo-square.png",
    apple: "/branding/act-logo-square.png",
    shortcut: "/branding/act-logo-square.png",
  },
  openGraph: {
    type: "website",
    siteName: "A Curious Tractor",
    url: siteUrl,
    title: "A Curious Tractor | Regenerative Innovation Studio",
    description:
      "Places, story systems, and public works you can step into. A regenerative studio on Jinibara Country.",
    images: [
      {
        url: "/branding/act-logo-square.png",
        width: 1200,
        height: 630,
        alt: "A Curious Tractor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Curious Tractor | Regenerative Innovation Studio",
    description:
      "Places, story systems, and public works you can step into.",
    images: ["/branding/act-logo-square.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
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
        {/* Skip link, visually hidden until focused. Lets keyboard + screenreader
            users bypass the nav and jump straight to page content. */}
        <a
          href="#main-content"
          className="absolute left-4 top-4 z-[100] -translate-y-24 rounded-full bg-[var(--we-olive)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CFA16B]"
        >
          Skip to content
        </a>

        {/* Floating nav, sits on top of full-bleed content */}
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

                <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
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

                <MobileMenu items={navItems} />
              </div>
            </div>
          </div>
        </header>

        {/* Full-bleed main, no max-width constraint */}
        <main id="main-content" className="relative z-10 min-h-screen">{children}</main>
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
