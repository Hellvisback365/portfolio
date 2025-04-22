import type { Metadata } from "next";
import "./globals.css";
import PerformanceMonitor from "@/components/PerformanceMonitor";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Reset tema e debug */}
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              // RESETTA COMPLETAMENTE IL TEMA
              console.log("[THEME-RESET] Resetting theme completely");
              document.documentElement.classList.remove('dark');
              localStorage.removeItem('darkMode');
              
              console.log("[THEME-RESET] Theme reset completed");
            } catch (e) {
              console.error("[THEME-RESET] Error:", e);
            }
          `
        }} />
      </head>
      {/* Body styling: transparent background to show Animated Background */}
      <body className="bg-transparent text-black dark:text-white" >
        {children}
        {process.env.NODE_ENV === 'production' && <PerformanceMonitor />}
      </body>
    </html>
  );
}
