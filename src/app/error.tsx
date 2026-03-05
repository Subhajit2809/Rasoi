"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🍳</p>
        <h2 className="text-xl font-bold text-[#3D2010] dark:text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[#8B5E3C] dark:text-gray-400 mb-6 leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-2xl bg-[#D2691E] text-white font-semibold text-sm hover:bg-[#B85C18] active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
