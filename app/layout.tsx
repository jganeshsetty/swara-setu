import "@/styles/globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "Swara-Setu (ಸ್ವರಸೇತು) — Namma Kannada Regional Language Explorer",
  description:
    "Explore the regional dialects of Kannada through an interactive 3D Karnataka map " +
    "and AI voice assistant. Discover everyday phrases, slangs, and accents.",
  keywords: [
    "Kannada",
    "dialect",
    "regional language",
    "Karnataka",
    "Swara-Setu",
    "Namma Kannada",
    "Karavali",
    "Old Mysuru",
    "Kittur",
    "Kalyana",
  ],
  authors: [{ name: "Swara-Setu Team" }],
  openGraph: {
    title: "Swara-Setu — Namma Kannada Explorer",
    description: "Discover the living dialects of Karnataka through a spatial 3D map experience.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF9F5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="kn" className="h-full w-full scroll-smooth overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Kannada:wght@300;400;500;600;700;800&family=Hubballi&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Kannada:wght@400;500;600;700&family=Noto+Serif+Kannada:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Tiro+Kannada:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Instant theme & Kannada default language initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Strict Light Theme default
                var savedTheme = localStorage.getItem('swara_theme');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }

                // Strict Kannada Language default (clear legacy English setting)
                localStorage.removeItem('swara_lang');
                var savedLang = localStorage.getItem('swara_user_lang_v2');
                if (savedLang === 'en') {
                  document.documentElement.setAttribute('lang', 'en');
                  document.documentElement.setAttribute('data-lang', 'en');
                } else {
                  document.documentElement.setAttribute('lang', 'kn');
                  document.documentElement.setAttribute('data-lang', 'kn');
                  localStorage.setItem('swara_user_lang_v2', 'kn');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans min-h-screen w-full max-w-full bg-paper dark:bg-[#0E0D0B] text-ink-900 dark:text-stone-100 selection:bg-karnataka-gold-light dark:selection:bg-amber-900/50 selection:text-ink-900 dark:selection:text-amber-100 overflow-x-hidden transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
