import type { Metadata, Viewport } from "next";
import "./globals.css";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import NeuralBackground from '@/components/NeuralBackground';
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
      </head>
      <body className="bg-transparent text-white transition-colors">
        <NeuralBackground />
        {children}
        {process.env.NODE_ENV === 'production' && <PerformanceMonitor />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}