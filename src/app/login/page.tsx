"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Google "G" logo (official colours) ──────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29
           1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45
           1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3
           7.565 24 12.255 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86
           11.86 0 000 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19
           15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85
           3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

// ─── Feature pills shown below the brand ─────────────────────────────────────

const FEATURES = [
  { emoji: "🥘", label: "Track everything in your fridge" },
  { emoji: "⏰", label: "Freshness alerts before food goes bad" },
  { emoji: "🛒", label: "Auto-generated grocery lists" },
] as const;

// ─── Inner component — uses useSearchParams so needs a Suspense boundary ─────

function LoginContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
    // On success the browser navigates away; keep loading=true intentionally.
  }

  const displayError =
    error ??
    (urlError === "auth_failed" ? "Sign in failed. Please try again." : null);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative"
      style={{ backgroundColor: "#FFF8F0" }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 inset-x-0 h-1"
        style={{
          background:
            "linear-gradient(90deg, #A0522D 0%, #D2691E 40%, #FF8C42 60%, #D2691E 100%)",
        }}
      />

      <div className="w-full max-w-xs space-y-10">
        {/* ── Brand ─────────────────────────────────────────────── */}
        <div className="text-center space-y-3">
          {/* Decorative spice row */}
          <div className="flex justify-center gap-3 text-2xl select-none">
            <span>🌶️</span>
            <span>🧅</span>
            <span>🫚</span>
            <span>🌿</span>
          </div>

          <h1
            className="text-5xl font-extrabold tracking-tight leading-none"
            style={{ color: "#D2691E" }}
          >
            Rasoi
          </h1>

          <p className="text-sm font-medium" style={{ color: "#8B5E3C" }}>
            Smart kitchen for Indian homes
          </p>
        </div>

        {/* ── Feature list ─────────────────────────────────────── */}
        <ul className="space-y-2" aria-label="App features">
          {FEATURES.map(({ emoji, label }) => (
            <li
              key={label}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium"
              style={{ backgroundColor: "#FFE8CC", color: "#6B3A1F" }}
            >
              <span className="text-xl leading-none" aria-hidden="true">
                {emoji}
              </span>
              {label}
            </li>
          ))}
        </ul>

        {/* ── Sign-in button ───────────────────────────────────── */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold bg-white transition-transform duration-100 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              color: "#3C4043",
              border: "1px solid #DADCE0",
              boxShadow:
                "0 1px 3px rgba(60,64,67,.25), 0 4px 8px rgba(60,64,67,.12)",
            }}
            aria-busy={loading}
          >
            {loading ? (
              <span
                className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin shrink-0"
                role="status"
                aria-label="Loading"
              />
            ) : (
              <GoogleIcon />
            )}
            {loading ? "Redirecting to Google…" : "Continue with Google"}
          </button>

          {displayError && (
            <p className="text-center text-sm text-red-500" role="alert">
              {displayError}
            </p>
          )}
        </div>

        {/* ── Footer note ──────────────────────────────────────── */}
        <p
          className="text-center text-xs leading-relaxed"
          style={{ color: "#A0522D" }}
        >
          For couples managing their kitchen together — in real time.
        </p>
      </div>
    </div>
  );
}

// ─── Page export — Suspense required for useSearchParams ─────────────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
