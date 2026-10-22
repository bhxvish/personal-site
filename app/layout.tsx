import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Colophon from "@/components/layout/Colophon";
import Cursor from "@/components/layout/Cursor";
import MarginRail from "@/components/layout/MarginRail";
import Nav from "@/components/layout/Nav";
import { TransitionProvider } from "@/components/layout/PageTransition";
import Preloader from "@/components/layout/Preloader";
import RevealController from "@/components/layout/RevealController";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { site, siteUrl, visibleSocials } from "@/content/site";
import { introInlineScript } from "@/lib/intro";
import "./globals.css";

// Fraunces, pinned to the one instance the site uses (opsz 144, weight 360), latin only.
// A static cut is a fraction of the variable font's size. Fetched from Google Fonts (OFL).
const fraunces = localFont({
  src: "./fonts/fraunces-144-normal.woff2",
  variable: "--font-fraunces",
  weight: "360",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

// Italic is only used for emphasis words, so it isn't preloaded.
const frauncesItalic = localFont({
  src: "./fonts/fraunces-144-italic.woff2",
  variable: "--font-fraunces-italic",
  weight: "360",
  style: "italic",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.fullName, url: siteUrl }],
  creator: site.fullName,
  keywords: ["Bhavish", "AI engineer", "RAG", "LLM evaluation", "machine learning", "Bangalore", "PES University"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#0f0e0c",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.fullName,
  alternateName: site.name,
  jobTitle: site.role,
  url: siteUrl,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "PES University" },
  knowsAbout: ["Retrieval-augmented generation", "LLM evaluation", "Machine learning", "Storage engines"],
  sameAs: visibleSocials.map((s) => s.href),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introInlineScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Preloader />
        <SmoothScroll>
          <TransitionProvider>
            <Nav />
            <main id="main">{children}</main>
            <Colophon />
            <MarginRail />
            <RevealController />
          </TransitionProvider>
        </SmoothScroll>
        <Cursor />
        <div className="grain" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
