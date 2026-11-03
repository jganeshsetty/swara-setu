import "@/styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Swara-Setu (ಸ್ವರಸೇತು) — Namma Kannada Regional Language Explorer",
  description:
    "Explore the regional dialects of Kannada through an interactive 3D Karnataka map " +
    "and AI voice assistant. Discover everyday phrases, slangs, and accents.",
  keywords: [
    "Kannada", "dialect", "regional language", "Karnataka", "Swara-Setu",
    "Namma Kannada", "Karavali", "Old Mysuru", "Kittur", "Kalyana",
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
    <html lang="kn" className="h-full w-full scroll-smooth overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Kannada:wght@400;500;600;700&family=Noto+Serif+Kannada:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Tiro+Kannada:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen w-full max-w-full bg-paper text-ink-900 selection:bg-karnataka-gold-light selection:text-ink-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}