import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Tipografia self-hosted via next/font: niente <link> render-blocking,
 * niente FOUT, subset latino. Inter variable copre display e body con
 * pesi disciplinati (300/450/600); JetBrains Mono è la voce "engineer"
 * per eyebrow, label e dati.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#04060c",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vitopiccolini.com'),
  title: "Vito Piccolini — AI Engineer",
  description:
    "Sistemi di raccomandazione, architetture multi-agente e RAG ibridi. Portfolio di Vito Piccolini, AI Engineer.",
  authors: [{ name: "Vito Piccolini" }],
  keywords: ["AI", "Machine Learning", "RAG", "LangGraph", "Recommender Systems", "Next.js"],
  creator: "Vito Piccolini",
  icons: { icon: "/vp.svg", apple: "/apple-icon.png" },
  openGraph: {
    title: "Vito Piccolini — AI Engineer",
    description:
      "Sistemi di raccomandazione, architetture multi-agente e RAG ibridi.",
    type: "website",
    locale: "it_IT",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vito Piccolini',
  jobTitle: 'AI & Software Engineer',
  url: 'https://vitopiccolini.com',
  sameAs: [
    'https://www.linkedin.com/in/vitopiccolini/',
    'https://github.com/Hellvisback365',
  ],
  knowsAbout: ['Machine Learning', 'Artificial Intelligence', 'React', 'Next.js', 'TypeScript', 'Retrieval-Augmented Generation'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`dark ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="bg-ink text-[var(--text-primary)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
