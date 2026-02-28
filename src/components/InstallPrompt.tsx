"use client";

import { useState, useEffect, useCallback } from "react";

// Chrome/Android fires this before the browser's own install prompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_VISIT_KEY = "rasoi_visit_count";
const STORAGE_DISMISSED_KEY = "rasoi_install_dismissed";
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SHOW_AFTER_VISITS = 2;

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Don't show if user dismissed recently
    const dismissed = localStorage.getItem(STORAGE_DISMISSED_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_DURATION_MS) return;

    // Increment visit counter
    const prev = parseInt(localStorage.getItem(STORAGE_VISIT_KEY) ?? "0", 10);
    const count = prev + 1;
    localStorage.setItem(STORAGE_VISIT_KEY, String(count));

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !("MSStream" in window);
    setIsIOS(ios);

    // iOS: show manual instructions from 2nd visit onward
    if (ios && count >= SHOW_AFTER_VISITS) {
      setShowPrompt(true);
      return;
    }

    // Android/Chrome: capture the native prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (count >= SHOW_AFTER_VISITS) {
        setShowPrompt(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowPrompt(false);
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem(STORAGE_DISMISSED_KEY, String(Date.now()));
  }, []);

  if (!showPrompt) return null;

  // ── iOS: manual instructions ──────────────────────────────────────────────
  if (isIOS) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="bg-white rounded-3xl shadow-xl border border-[#E8C9A0] p-5 flex gap-4 items-start animate-slide-up">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#D2691E] flex items-center justify-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon.svg" alt="Rasoi" className="w-8 h-8" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Add Rasoi to Home Screen</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Tap the{" "}
              <span className="inline-flex items-center gap-0.5 font-semibold text-[#D2691E]">
                Share
                <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                </svg>
              </span>{" "}
              button, then{" "}
              <strong className="text-gray-700">&ldquo;Add to Home Screen&rdquo;</strong>
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="text-gray-300 text-2xl leading-none flex-shrink-0 -mt-0.5"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  // ── Android/Chrome: native install prompt ─────────────────────────────────
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
      <div className="bg-white rounded-3xl shadow-xl border border-[#E8C9A0] p-5 flex gap-4 items-center animate-slide-up">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#D2691E] flex items-center justify-center flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon.svg" alt="Rasoi" className="w-8 h-8" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">Add Rasoi to Home Screen</p>
          <p className="text-xs text-gray-500 mt-0.5">Works offline, launches instantly</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-[#D2691E] text-white rounded-xl text-sm font-semibold whitespace-nowrap active:scale-95 transition-transform"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-1.5 text-gray-400 rounded-xl text-xs font-medium whitespace-nowrap"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
