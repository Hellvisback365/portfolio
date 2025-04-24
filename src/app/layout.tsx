import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import type { Metadata } from "next";
import "./globals.css";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import AnimatedBackground from '@/components/AnimatedBackground';

export const metadata: Metadata = {
  title: "Vito Piccolini - Sviluppatore AI",
  description: "Portfolio di Vito Piccolini, Sviluppatore AI orientato all'utente",
  authors: [{ name: "Vito Piccolini" }],
  keywords: ["AI", "Machine Learning", "LLM", "Developer", "Frontend", "React", "Next.js"],
  creator: "Vito Piccolini",
  icons: {
    icon: '/favicon.ico',
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
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Metadata handled by Next.js App Router */}
      </head>
      <body className="bg-transparent dark:text-white transition-colors">
        <ThemeProviderWrapper>
          <AnimatedBackground />
          {children}
          {process.env.NODE_ENV === 'production' && <PerformanceMonitor />}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}