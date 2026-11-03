import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#FCFBF7] dark:bg-[#0B0908] text-stone-900 dark:text-stone-100 transition-colors">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151210] shadow-xl text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Compass className="w-6 h-6 animate-spin-slow" />
        </div>

        <p className="font-mono text-xs uppercase tracking-widest text-karnataka-crimson dark:text-red-400 mb-1 font-semibold">
          404 / ಪುಟ ಲಭ್ಯವಿಲ್ಲ
        </p>

        <h1 className="text-xl sm:text-2xl font-bold font-kannada mb-2 text-stone-900 dark:text-stone-100">
          ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
          The requested page does not exist or has moved. Explore the Karnataka dialect workspace instead.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-kannada font-semibold text-sm bg-karnataka-crimson text-white hover:bg-red-700 active:scale-95 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ (Home)</span>
          </Link>
          <Link
            href="/workspace"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-kannada text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 transition-all"
          >
            <span>ನಕ್ಷೆ ಅನ್ವೇಷಿಸಿ (Workspace)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

