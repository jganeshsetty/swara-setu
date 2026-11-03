"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Avoid hydration mismatch by rendering a stable placeholder until mounted
  if (!mounted) {
    return (
      <div
        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl border border-hairline bg-surface dark:bg-stone-900/80 shadow-2xs flex items-center justify-center opacity-60 ${className}`}
        aria-hidden="true"
      >
        <span className="w-3.5 h-3.5 rounded-full bg-neutral-300 dark:bg-stone-700 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer border min-h-[32px] min-w-[32px] sm:min-h-[38px] ${
        isDark
          ? "bg-stone-900/90 hover:bg-stone-800 text-amber-300 border-amber-500/40 hover:border-amber-400 shadow-[0_0_12px_rgba(245,183,0,0.18)]"
          : "bg-surface hover:bg-neutral-100 text-stone-700 border-hairline hover:border-stone-400 shadow-2xs hover:shadow-xs"
      } ${className}`}
      aria-label={isDark ? "ಬೆಳಕು ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ (Switch to Light Mode)" : "ಕತ್ತಲೆ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ (Switch to Dark Mode)"}
      title={isDark ? "ಬೆಳಕು ಮೋಡ್ (Light Mode)" : "ಕತ್ತಲೆ ಮೋಡ್ (Dark Mode)"}
    >
      <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
        ) : (
          <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-900 group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="kannada-text text-xs font-semibold select-none hidden sm:inline">
          {isDark ? "ಬೆಳಕು" : "ಕತ್ತಲೆ"}
        </span>
      )}
    </button>
  );
}

