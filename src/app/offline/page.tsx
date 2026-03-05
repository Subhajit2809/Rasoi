"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="w-24 h-24 mb-6 rounded-3xl bg-[#D2691E]/10 flex items-center justify-center">
        <span className="text-5xl">📡</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">You&apos;re offline</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
        Rasoi needs a connection to sync your kitchen data. Check your internet and try again.
      </p>

      {/* Retry button */}
      <button
        onClick={() => window.location.reload()}
        className="mt-8 px-6 py-3 bg-[#D2691E] text-white font-semibold rounded-2xl active:scale-95 transition-transform"
      >
        Try again
      </button>

      {/* Tip */}
      <p className="mt-10 text-xs text-gray-400">
        Tip: Previously visited pages may still be available while offline.
      </p>
    </div>
  );
}
