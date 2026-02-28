"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useHousehold } from "@/hooks/useHousehold";
import { useUser } from "@/hooks/useUser";
import { useHouseholdMembers, type MemberProfile } from "@/hooks/useHouseholdMembers";

// ─── Invite code section ──────────────────────────────────────────────────────

interface InviteState {
  code: string;
  expiresAt: string;
}

function Avatar({ member, size = 40 }: { member: MemberProfile; size?: number }) {
  const initials = (member.display_name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (member.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.avatar_url}
        alt={member.display_name ?? "Member"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-[#FFE8CC] flex items-center justify-center font-bold text-[#D2691E]"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
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
    const supabase = createClient();
    const { data, error: rpcErr } = await supabase.rpc(
      "generate_household_invite",
      { p_household_id: householdId }
    );

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
    <div className="bg-white rounded-2xl p-5 border border-[#E8C9A0]">
      <h3 className="font-semibold text-[#3D2010] mb-1 flex items-center gap-2">
        <span>🔗</span> Invite a Partner
      </h3>
      <p className="text-xs text-[#8B5E3C] mb-4">
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
          {/* Code display */}
          <div className="bg-[#FFF8F0] border-2 border-[#D2691E] rounded-2xl p-4 text-center">
            <p className="text-xs text-[#8B5E3C] mb-1 uppercase tracking-widest font-medium">
              Invite Code
            </p>
            <p className="text-4xl font-bold tracking-[0.3em] text-[#D2691E] font-mono">
              {invite.code}
            </p>
            {expiryLabel && (
              <p className="text-xs text-[#8B5E3C] mt-2">Expires {expiryLabel}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#E8C9A0] text-[#5C3A1E] text-sm font-medium hover:border-[#D2691E] transition-colors"
            >
              {copied ? "✓ Copied!" : "Copy Code"}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="flex-1 py-2.5 rounded-xl bg-[#D2691E] text-white text-sm font-medium hover:bg-[#B85C18] transition-colors"
            >
              Copy Link
            </button>
          </div>

          {/* Regenerate */}
          <button
            type="button"
            onClick={generate}
            disabled={generating}
            className="w-full text-xs text-[#8B5E3C] hover:text-[#D2691E] transition-colors py-1"
          >
            Generate new code
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mt-3">
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
      <div className="bg-white rounded-2xl p-5 border border-[#E8C9A0] flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#8B5E3C]">Loading members…</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8C9A0]">
      <h3 className="font-semibold text-[#3D2010] mb-4 flex items-center gap-2">
        <span>👥</span> Kitchen Members
      </h3>
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <Avatar member={m} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#3D2010] truncate">
                {m.display_name ?? "Unknown user"}
                {m.user_id === currentUserId && (
                  <span className="text-xs font-normal text-[#8B5E3C] ml-1">(you)</span>
                )}
              </p>
              <p className="text-xs text-[#8B5E3C] capitalize">{m.role}</p>
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
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!household) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[#8B5E3C]">No household found.</p>
          <Link href="/onboarding" className="text-[#D2691E] text-sm mt-2 block hover:underline">
            Set up your kitchen →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-[#E8C9A0]">
        <Link
          href="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#8B5E3C] hover:bg-[#FFF0E0] transition-colors"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#3D2010] text-base">Kitchen Settings</h1>
        </div>
        <span className="text-lg">⚙️</span>
      </div>

      <div className="px-5 py-6 max-w-lg mx-auto space-y-4">
        {/* Household info card */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8C9A0]">
          <h3 className="font-semibold text-[#3D2010] mb-4 flex items-center gap-2">
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

        {/* Members */}
        <MembersSection
          members={members}
          currentUserId={user?.id ?? ""}
          loading={membLoading}
        />

        {/* Invite */}
        <InviteSection householdId={household.id} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[#F5E6D3] last:border-0">
      <span className="text-xs text-[#8B5E3C] font-medium">{label}</span>
      <span className="text-sm text-[#3D2010] font-semibold">{value}</span>
    </div>
  );
}
