"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface InvitePreview {
  household_id: string;
  household_name: string;
  region: string;
  diet_pref: "veg" | "nonveg" | "eggetarian";
  expires_at: string;
}

type PageState =
  | { status: "loading" }
  | { status: "invalid"; reason: string }
  | { status: "ready" }
  | { status: "joining" }
  | { status: "joined" }
  | { status: "error"; reason: string };

const DIET_LABEL: Record<string, string> = {
  veg: "Vegetarian 🥦",
  eggetarian: "Eggetarian 🥚",
  nonveg: "Non-Veg 🍗",
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const code = (
    Array.isArray(params.code) ? params.code[0] : params.code
  )?.toUpperCase() ?? "";

  const [state,   setState]   = useState<PageState>({ status: "loading" });
  const [preview, setPreview] = useState<InvitePreview | null>(null);

  // Load invite preview once user is available
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      // Not signed in — redirect to login, preserving the join URL so we can
      // return here after OAuth (middleware will bounce them back)
      router.replace(`/login?next=/join/${code}`);
      return;
    }
    if (!code) {
      setState({ status: "invalid", reason: "No invite code in the URL." });
      return;
    }

    let cancelled = false;

    async function loadPreview() {
      setState({ status: "loading" });
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_invite_preview", {
        p_code: code,
      });

      if (cancelled) return;

      if (error) {
        setState({ status: "invalid", reason: error.message });
        return;
      }

      const result = data as InvitePreview & { error?: string };
      if (result.error) {
        setState({ status: "invalid", reason: result.error });
      } else {
        setPreview(result);
        setState({ status: "ready" });
      }
    }

    loadPreview();
    return () => { cancelled = true; };
  }, [code, user, userLoading, router]);

  async function handleJoin() {
    if (state.status !== "ready") return;
    setState({ status: "joining" });

    const supabase = createClient();
    const { data, error } = await supabase.rpc("join_household_by_code", {
      p_code: code,
    });

    if (error) {
      setState({ status: "error", reason: error.message });
      return;
    }

    const result = data as {
      household_id?: string;
      already_member?: boolean;
      error?: string;
    };

    if (result.error) {
      setState({ status: "error", reason: result.error });
    } else {
      setState({ status: "joined" });
      // Small delay so the user sees the success state before redirect
      setTimeout(() => router.replace("/"), 1200);
    }
  }

  // ── Loading / auth wait ──
  if (userLoading || state.status === "loading") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="w-10 h-10 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#8B5E3C] dark:text-gray-400">Checking invite…</p>
        </div>
      </Shell>
    );
  }

  // ── Invalid code ──
  if (state.status === "invalid") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="text-5xl">😕</span>
          <h2 className="text-xl font-bold text-[#3D2010] dark:text-gray-100">Invite not found</h2>
          <p className="text-sm text-[#8B5E3C] dark:text-gray-400 max-w-xs">{state.reason}</p>
          <p className="text-xs text-[#8B5E3C] dark:text-gray-400 max-w-xs">
            Ask your partner to generate a new code from their Kitchen Settings.
          </p>
          <Link
            href="/"
            className="mt-2 px-6 py-2.5 rounded-xl border-2 border-[#E8C9A0] dark:border-dark-border text-[#8B5E3C] dark:text-gray-300 text-sm font-medium hover:border-[#D2691E] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </Shell>
    );
  }

  // ── Joined success ──
  if (state.status === "joined") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="text-5xl animate-bounce">🎉</span>
          <h2 className="text-xl font-bold text-[#3D2010] dark:text-gray-100">You&apos;re in!</h2>
          <p className="text-sm text-[#8B5E3C] dark:text-gray-400">
            Taking you to your shared kitchen…
          </p>
          <div className="w-6 h-6 border-2 border-[#D2691E] border-t-transparent rounded-full animate-spin mt-2" />
        </div>
      </Shell>
    );
  }

  // ── Error after attempting join ──
  if (state.status === "error") {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-xl font-bold text-[#3D2010] dark:text-gray-100">Couldn&apos;t join</h2>
          <p className="text-sm text-[#8B5E3C] dark:text-gray-400 max-w-xs">{state.reason}</p>
          <button
            type="button"
            onClick={() => setState({ status: "ready" })}
            className="mt-2 px-6 py-2.5 rounded-xl bg-[#D2691E] text-white text-sm font-medium hover:bg-[#B85C18] transition-colors"
          >
            Try Again
          </button>
        </div>
      </Shell>
    );
  }

  // ── Ready: show preview + join button ──
  const joining = state.status === "joining";
  if ((state.status !== "ready" && !joining) || !preview) return null;
  const expiryLabel = new Date(preview.expires_at).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        {/* Invite card */}
        <div className="bg-[#FFF0E0] dark:bg-dark-card border-2 border-[#D2691E] rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold tracking-widest text-[#D2691E] uppercase mb-2">
            Kitchen Invite
          </p>
          <div className="text-5xl mb-3">🍳</div>
          <h2 className="text-2xl font-bold text-[#3D2010] dark:text-gray-100 mb-1">
            {preview.household_name}
          </h2>
          <p className="text-sm text-[#8B5E3C] dark:text-gray-400">
            {preview.region} · {DIET_LABEL[preview.diet_pref] ?? preview.diet_pref}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-white dark:bg-dark-surface rounded-full px-3 py-1 text-xs text-[#8B5E3C] dark:text-gray-400 border border-[#E8C9A0] dark:border-dark-border">
            <span className="font-mono font-bold text-[#D2691E] tracking-wider">
              {code}
            </span>
            <span>· Expires {expiryLabel}</span>
          </div>
        </div>

        {/* Explainer */}
        <div className="text-center px-2">
          <p className="text-sm text-[#5C3A1E] dark:text-gray-300">
            You&apos;re about to join this kitchen. You&apos;ll share the fridge inventory,
            cooked items, and grocery list with your partner.
          </p>
        </div>

        {/* Join button */}
        <button
          type="button"
          onClick={handleJoin}
          disabled={joining}
          className="w-full py-4 rounded-2xl bg-[#D2691E] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#B85C18] active:scale-95 transition-all disabled:opacity-60"
        >
          {joining ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Joining…
            </>
          ) : (
            "Join this Kitchen 🍳"
          )}
        </button>

        <p className="text-xs text-center text-[#8B5E3C] dark:text-gray-400">
          This invite can only be used once.
        </p>
      </div>
    </Shell>
  );
}

// ─── Shell layout ─────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex flex-col">
      <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />
      <div className="flex-1 flex flex-col justify-center px-5 py-10 max-w-sm mx-auto w-full">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🍳</span>
          <span className="text-lg font-bold text-[#D2691E]">Rasoi</span>
        </div>
        {children}
      </div>
    </div>
  );
}
