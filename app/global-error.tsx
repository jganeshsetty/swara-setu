"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="kn">
      <body className="min-h-screen w-full flex items-center justify-center p-4 bg-[#FCFBF7] text-stone-900 font-sans antialiased">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-stone-200 bg-white shadow-xl text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-stone-900">
            ಕ್ಷಮಿಸಿ, ದೋಷವೊಂದು ಸಂಭವಿಸಿದೆ
          </h1>
          <p className="text-xs text-stone-500 mb-6">
            An unexpected error occurred. Please refresh or try again.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#D92D20] text-white hover:bg-red-700 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ (Try Again)</span>
          </button>
        </div>
      </body>
    </html>
  );
}

