import type { Metadata, Viewport } from "next";
import "./globals.css";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Vito Piccolini - Sviluppatore AI",
  description: "Portfolio di Vito Piccolini, Sviluppatore AI orientato all'utente",
  authors: [{ name: "Vito Piccolini" }],
  keywords: ["AI", "Machine Learning", "LLM", "Developer", "Frontend", "React", "Next.js"],
  creator: "Vito Piccolini",
  icons: {
    icon: '/vp.svg',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "Vito Piccolini - Sviluppatore AI",
    description: "Portfolio di Vito Piccolini, Sviluppatore AI orientato all'utente",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="dark" suppressHydrationWarning>
      <head>
        {/* Metadata handled by Next.js App Router */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] text-white">
        {children}
        {process.env.NODE_ENV === 'production' && <PerformanceMonitor />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}