"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error to console
    console.error("App error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#FCFBF7] dark:bg-[#0B0908] text-stone-900 dark:text-stone-100 transition-colors">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151210] shadow-xl text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold font-kannada mb-2 text-stone-900 dark:text-stone-100">
          ಕ್ಷಮಿಸಿ, ದೋಷವೊಂದು ಸಂಭವಿಸಿದೆ
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          Something went wrong while rendering this page.
        </p>

        {error?.message && (
          <div className="mb-6 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-left font-mono text-[11px] text-stone-600 dark:text-stone-300 overflow-x-auto max-h-28">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-kannada font-semibold text-sm bg-karnataka-crimson text-white hover:bg-red-700 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ (Try Again)</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-kannada text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>ಮುಖಪುಟ (Home)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

