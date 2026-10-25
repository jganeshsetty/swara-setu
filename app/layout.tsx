import "@/styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Swara-Setu (ಸ್ವರಸೇತು) — Namma Kannada Regional Language Explorer",
  description:
    "Explore the five regional dialects of Kannada through an interactive 360° 3D Karnataka map, " +
    "AI-powered phrase comparison, and crowdsourced cultural documentation. " +
    "Built for the Kannada Digital Innovation Hackathon 2026 — Problem Statement 4.",
  keywords: [
    "Kannada", "dialect", "regional language", "Karnataka", "Swara-Setu",
    "Namma Kannada", "hackathon", "Havyaka", "Karavali", "Old Mysuru",
    "Kittur", "Kalyana", "linguistics", "dialect comparison",
  ],
  authors: [{ name: "Swara-Setu Team" }],
  openGraph: {
    title: "Swara-Setu — Namma Kannada Explorer",
    description: "Discover the living dialects of Karnataka through a spatial 3D map experience.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="kn" className="h-full w-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Kannada:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans h-full w-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}