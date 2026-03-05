"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHousehold } from "@/hooks/useHousehold";
import { useUser } from "@/hooks/useUser";
import { useHouseholdMembers, type MemberProfile } from "@/hooks/useHouseholdMembers";
import { Avatar } from "@/components/Avatar";
import { Skeleton } from "@/components/Skeleton";
import { generateInviteCode } from "@/lib/services/household";
import { useTheme } from "@/components/ThemeProvider";
import {
  isNotificationSupported,
  getPermissionState,
  getUserPreference,
  setUserPreference,
  requestPermission,
} from "@/lib/notifications";

type ThemeOption = "light" | "dark" | "system";

// ─── Invite code section ──────────────────────────────────────────────────────

interface InviteState {
  code: string;
  expiresAt: string;
}

function InviteSection({ householdId }: { householdId: string }) {
  const [invite, setInvite]     = useState<InviteState | null>(null);
  const [generating, setGen]    = useState(false);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function generate() {
    setGen(true);
    setError("");
    const { data, error: rpcErr } = await generateInviteCode(householdId);

    if (rpcErr) {
      setError("Could not generate invite. Please try again.");
    } else {
      const result = data as { code?: string; expires_at?: string; error?: string };
      if (result.error) {
        setError(result.error);
      } else if (result.code) {
        setInvite({ code: result.code, expiresAt: result.expires_at ?? "" });
      }
    }
    setGen(false);
  }

  function copyCode() {
    if (!invite) return;
    navigator.clipboard.writeText(invite.code);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  function copyLink() {
    if (!invite) return;
    const url = `${window.location.origin}/join/${invite.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  const expiryLabel = invite
    ? new Date(invite.expiresAt).toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 border border-[#E8C9A0] dark:border-dark-border">
      <h3 className="font-semibold text-[#3D2010] dark:text-gray-100 mb-1 flex items-center gap-2">
        <span>🔗</span> Invite a Partner
      </h3>
      <p className="text-xs text-[#8B5E3C] dark:text-gray-400 mb-4">
        Generate a 6-character code. Your partner enters it at{" "}
        <span className="font-mono text-[#D2691E]">/join</span> to share your kitchen.
        Codes expire in 24 hours and can only be used once.
      </p>

      {!invite ? (
        <button
          type="button"
          onClick={generate}
          disabled={generating}
          className="w-full py-3 rounded-xl bg-[#D2691E] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#B85C18] transition-colors disabled:opacity-50"
        >
          {generating ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating…
            </>
          ) : (
            "Generate Invite Code"
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-[#FFF8F0] dark:bg-dark-bg border-2 border-[#D2691E] rounded-2xl p-4 text-center">
            <p className="text-xs text-[#8B5E3C] dark:text-gray-400 mb-1 uppercase tracking-widest font-medium">
              Invite Code
            </p>
            <p className="text-4xl font-bold tracking-[0.3em] text-[#D2691E] font-mono">
              {invite.code}
            </p>
            {expiryLabel && (
              <p className="text-xs text-[#8B5E3C] dark:text-gray-400 mt-2">Expires {expiryLabel}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#E8C9A0] dark:border-dark-border text-[#5C3A1E] dark:text-gray-200 text-sm font-medium hover:border-[#D2691E] transition-colors"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="flex-1 py-2.5 rounded-xl bg-[#D2691E] text-white text-sm font-medium hover:bg-[#B85C18] transition-colors"
            >
              Copy Link
            </button>
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={generating}
            className="w-full text-xs text-[#8B5E3C] dark:text-gray-400 hover:text-[#D2691E] transition-colors py-1"
          >
            Generate new code
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2 mt-3">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Members section ──────────────────────────────────────────────────────────

function MembersSection({
  members,
  currentUserId,
  loading,
}: {
  members: MemberProfile[];
  currentUserId: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 border border-[#E8C9A0] dark:border-dark-border">
        <Skeleton className="h-5 w-36 mb-4" />
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 border border-[#E8C9A0] dark:border-dark-border">
      <h3 className="font-semibold text-[#3D2010] dark:text-gray-100 mb-4 flex items-center gap-2">
        <span>👥</span> Kitchen Members
      </h3>
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <Avatar member={m} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#3D2010] dark:text-gray-100 truncate">
                {m.display_name ?? "Unknown user"}
                {m.user_id === currentUserId && (
                  <span className="text-xs font-normal text-[#8B5E3C] dark:text-gray-400 ml-1">(you)</span>
                )}
              </p>
              <p className="text-xs text-[#8B5E3C] dark:text-gray-400 capitalize">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const DIET_LABEL: Record<string, string> = {
  veg: "Vegetarian 🥦",
  eggetarian: "Eggetarian 🥚",
  nonveg: "Non-Veg 🍗",
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { household, loading: hhLoading } = useHousehold();
  const { members, loading: membLoading } = useHouseholdMembers(household?.id);

  useEffect(() => {
    if (!userLoading && !user) router.replace("/login");
  }, [user, userLoading, router]);

  const loading = userLoading || hhLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg">
        <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />
        <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-dark-surface border-b border-[#E8C9A0] dark:border-dark-border">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <Skeleton className="h-5 w-32 flex-1" />
        </div>
        <div className="px-5 py-6 max-w-lg mx-auto space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!household) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#8B5E3C] dark:text-gray-400">No household found.</p>
          <Link href="/onboarding" className="text-[#D2691E] text-sm mt-2 block hover:underline">
            Set up your kitchen →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg">
      <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />

      <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-dark-surface border-b border-[#E8C9A0] dark:border-dark-border">
        <Link
          href="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8B5E3C] dark:text-gray-400 hover:bg-[#FFF0E0] dark:hover:bg-dark-card transition-colors"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#3D2010] dark:text-gray-100 text-base">Kitchen Settings</h1>
        </div>
        <span className="text-lg">⚙️</span>
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-4">
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 border border-[#E8C9A0] dark:border-dark-border">
          <h3 className="font-semibold text-[#3D2010] dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>🏠</span> Your Kitchen
          </h3>
          <div className="space-y-2.5">
            <InfoRow label="Name" value={household.name} />
            <InfoRow label="Region" value={household.region} />
            <InfoRow
              label="Diet"
              value={DIET_LABEL[household.diet_pref] ?? household.diet_pref}
            />
            <InfoRow label="Household size" value={`${household.household_size} people`} />
          </div>
        </div>

        <MembersSection
          members={members}
          currentUserId={user?.id ?? ""}
          loading={membLoading}
        />

        <ThemeSection />

        <NotificationSection />

        <InviteSection householdId={household.id} />
      </div>
    </div>
  );
}

const THEME_OPTIONS: { value: ThemeOption; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 border border-[#E8C9A0] dark:border-dark-border">
      <h3 className="font-semibold text-[#3D2010] dark:text-gray-100 mb-4 flex items-center gap-2">
        <span>🎨</span> Appearance
      </h3>
      <div className="flex gap-2">
        {THEME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              theme === opt.value
                ? "bg-[#D2691E] text-white"
                : "border-2 border-[#E8C9A0] dark:border-dark-border text-[#5C3A1E] dark:text-gray-300 hover:border-[#D2691E]"
            }`}
          >
            <span>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NotificationSection() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sup = isNotificationSupported();
    setSupported(sup);
    if (sup) {
      setPermission(getPermissionState());
      setEnabled(getUserPreference() === "enabled");
    }
  }, []);

  async function handleToggle() {
    if (enabled) {
      setUserPreference("disabled");
      setEnabled(false);
      return;
    }

    if (permission !== "granted") {
      const result = await requestPermission();
      setPermission(result);
      if (result !== "granted") return;
    }

    setUserPreference("enabled");
    setEnabled(true);
  }

  if (!supported) return null;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 border border-[#E8C9A0] dark:border-dark-border">
      <h3 className="font-semibold text-[#3D2010] dark:text-gray-100 mb-1 flex items-center gap-2">
        <span>🔔</span> Notifications
      </h3>
      <p className="text-xs text-[#8B5E3C] dark:text-gray-400 mb-4">
        Get alerts when cooked food needs eating or fridge items are expiring.
      </p>

      {permission === "denied" ? (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2">
          Notifications are blocked in your browser settings. Please enable them to receive alerts.
        </p>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleToggle}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              enabled
                ? "bg-[#D2691E] text-white"
                : "border-2 border-[#E8C9A0] dark:border-dark-border text-[#5C3A1E] dark:text-gray-300 hover:border-[#D2691E]"
            }`}
          >
            {enabled ? "Enabled" : "Enable"}
          </button>
          {enabled && (
            <button
              type="button"
              onClick={handleToggle}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#E8C9A0] dark:border-dark-border text-[#5C3A1E] dark:text-gray-300 text-sm font-medium hover:border-[#D2691E] transition-colors"
            >
              Disable
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#F5E6D3] dark:border-dark-border-light last:border-0">
      <span className="text-xs text-[#8B5E3C] dark:text-gray-400 font-medium">{label}</span>
      <span className="text-sm text-[#3D2010] dark:text-gray-100 font-semibold">{value}</span>
    </div>
  );
}
