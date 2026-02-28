"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHousehold } from "@/hooks/useHousehold";
import { useUser } from "@/hooks/useUser";
import { useHouseholdMembers, type MemberProfile } from "@/hooks/useHouseholdMembers";
import { useCookedItems } from "@/hooks/useCookedItems";
import { useFridgeItems } from "@/hooks/useFridgeItems";
import { Toast } from "@/components/Toast";
import type { CookedItem, FridgeItem } from "@/types";

// ─── Freshness helpers ────────────────────────────────────────────────────────

type FreshnessLevel = "fresh" | "soon" | "toss";

function getDaysRemaining(item: CookedItem): number {
  const elapsed =
    (Date.now() - new Date(item.cooked_at).getTime()) / 86_400_000;
  return item.freshness_days - elapsed;
}

function freshnessLevel(daysRemaining: number): FreshnessLevel {
  if (daysRemaining > 1.5) return "fresh";
  if (daysRemaining > 0.5) return "soon";
  return "toss";
}

const FRESHNESS_CONFIG: Record<
  FreshnessLevel,
  { dot: string; label: string; bar: string; border: string; badge: string }
> = {
  fresh: {
    dot: "bg-green-500",
    label: "Fresh",
    bar: "bg-green-400",
    border: "border-l-green-400",
    badge: "bg-green-50 text-green-700",
  },
  soon: {
    dot: "bg-yellow-400",
    label: "Eat Soon",
    bar: "bg-yellow-400",
    border: "border-l-yellow-400",
    badge: "bg-yellow-50 text-yellow-700",
  },
  toss: {
    dot: "bg-red-500",
    label: "Toss It",
    bar: "bg-red-400",
    border: "border-l-red-400",
    badge: "bg-red-50 text-red-700",
  },
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

function formatRemaining(days: number): string {
  if (days <= 0) return "Expired";
  const totalHours = days * 24;
  if (totalHours < 1) return "<1h left";
  if (totalHours < 24) return `${Math.floor(totalHours)}h left`;
  const d = Math.floor(days);
  const h = Math.floor((days - d) * 24);
  return h === 0 ? `${d}d left` : `${d}d ${h}h left`;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  member,
  size = 32,
  overlap = false,
}: {
  member: MemberProfile;
  size?: number;
  overlap?: boolean;
}) {
  const initials = (member.display_name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const ring = overlap ? "ring-2 ring-white" : "";

  if (member.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.avatar_url}
        alt={member.display_name ?? ""}
        width={size}
        height={size}
        className={`rounded-full object-cover ${ring}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`rounded-full bg-[#FFE8CC] flex items-center justify-center font-bold text-[#D2691E] ${ring}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  householdName,
  members,
  membersLoading,
}: {
  householdName: string;
  members: MemberProfile[];
  membersLoading: boolean;
}) {
  const visible = members.slice(0, 3);
  const overflow = members.length - 3;

  return (
    <header className="bg-white border-b border-[#E8C9A0] px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#3D2010] text-sm truncate leading-tight">
          {householdName}
        </p>
        <p className="text-xs text-[#8B5E3C]">Mera Fridge</p>
      </div>

      {/* Member avatars */}
      <div className="flex items-center -space-x-2">
        {membersLoading
          ? [0, 1].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-[#F5E6D3] animate-pulse ring-2 ring-white"
                style={{ zIndex: 2 - i }}
              />
            ))
          : visible.map((m, i) => (
              <div key={m.id} style={{ zIndex: visible.length - i }}>
                <Avatar member={m} size={32} overlap={i > 0} />
              </div>
            ))}
        {overflow > 0 && (
          <div className="w-8 h-8 rounded-full bg-[#E8C9A0] flex items-center justify-center text-xs font-bold text-[#5C3A1E] ring-2 ring-white">
            +{overflow}
          </div>
        )}
      </div>

      <Link
        href="/settings"
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[#8B5E3C] hover:bg-[#FFF0E0] transition-colors text-base"
        aria-label="Settings"
      >
        ⚙️
      </Link>
    </header>
  );
}

// ─── Cooked item card ─────────────────────────────────────────────────────────

function CookedCard({
  item,
  onDone,
}: {
  item: CookedItem;
  onDone: () => void;
}) {
  const daysLeft = getDaysRemaining(item);
  const level = freshnessLevel(daysLeft);
  const cfg = FRESHNESS_CONFIG[level];
  const pct = Math.max(0, Math.min(100, (daysLeft / item.freshness_days) * 100));

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E8C9A0] border-l-4 ${cfg.border} overflow-hidden`}
    >
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start gap-3">
          {/* Freshness dot */}
          <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${cfg.dot}`} />

          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#3D2010] text-base leading-tight truncate">
              {item.dish_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}
              >
                {cfg.label}
              </span>
              <span className="text-xs text-[#8B5E3C]">
                cooked {relativeTime(item.cooked_at)}
              </span>
            </div>
          </div>

          {/* Done button */}
          <button
            type="button"
            onClick={onDone}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#FFF0E0] border border-[#E8C9A0] text-xs font-semibold text-[#D2691E] hover:bg-[#D2691E] hover:text-white transition-colors active:scale-95"
          >
            ✓ Done
          </button>
        </div>

        {/* Remaining time */}
        <p className="text-xs text-[#8B5E3C] mt-1.5 pl-5">
          {formatRemaining(daysLeft)}
        </p>
      </div>

      {/* Freshness progress bar */}
      <div className="h-1 bg-[#F5E6D3]">
        <div
          className={`h-full ${cfg.bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Cooked section ───────────────────────────────────────────────────────────

function CookedSection({
  items,
  loading,
  onDone,
}: {
  items: CookedItem[];
  loading: boolean;
  onDone: (id: string) => void;
}) {
  return (
    <section className="px-4 pt-5">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-bold text-[#3D2010] text-base">🍲 Cooked Food</h2>
        {items.length > 0 && (
          <span className="text-xs font-semibold bg-[#FFE8CC] text-[#D2691E] px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E8C9A0] border-l-4 border-l-[#E8C9A0] overflow-hidden animate-pulse"
            >
              <div className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F5E6D3] mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#F5E6D3] rounded-full w-36" />
                    <div className="h-3 bg-[#F5E6D3] rounded-full w-20" />
                  </div>
                  <div className="w-14 h-7 bg-[#F5E6D3] rounded-xl flex-shrink-0" />
                </div>
                <div className="h-2.5 bg-[#F5E6D3] rounded-full w-28 mt-2 ml-5" />
              </div>
              <div className="h-1 bg-[#F5E6D3]" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E8C9A0] p-6 text-center">
          <p className="text-3xl mb-2">🍽️</p>
          <p className="text-sm font-semibold text-[#5C3A1E]">Nothing on the stove yet</p>
          <p className="text-xs text-[#8B5E3C] mt-1 leading-relaxed">
            What did you cook today?{" "}
            <span className="font-semibold text-[#D2691E]">Tap I Cooked ↓</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <CookedCard
              key={item.id}
              item={item}
              onDone={() => onDone(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Use Soon alert ───────────────────────────────────────────────────────────

function UseSoonAlert({ items }: { items: FridgeItem[] }) {
  const now = Date.now();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

  const expiring = items.filter((item) => {
    if (!item.estimated_expiry) return false;
    const exp = new Date(item.estimated_expiry).getTime();
    return exp > now && exp <= now + twoDaysMs;
  });

  if (expiring.length === 0) return null;

  function hoursLeft(expiry: string): string {
    const h = Math.round(
      (new Date(expiry).getTime() - now) / 3_600_000
    );
    if (h <= 0) return "today";
    if (h < 24) return `${h}h`;
    return `${Math.ceil(h / 24)}d`;
  }

  return (
    <section className="px-4 pt-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-yellow-800 mb-2.5 flex items-center gap-1.5">
          ⏰ Use Before It&apos;s Gone
          <span className="text-xs font-semibold bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full">
            {expiring.length}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {expiring.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 bg-white border border-yellow-200 rounded-full px-3 py-1"
            >
              <span className="text-xs font-semibold text-[#3D2010] truncate max-w-[100px]">
                {item.item_name}
              </span>
              <span className="text-xs text-yellow-700 font-bold whitespace-nowrap">
                {hoursLeft(item.estimated_expiry!)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Raw ingredients section ──────────────────────────────────────────────────

function FridgeChip({ item }: { item: FridgeItem }) {
  const qty =
    item.qty === 1 && item.unit === "piece"
      ? ""
      : ` · ${item.qty}${item.unit !== "piece" ? ` ${item.unit}` : ""}`;

  const isUseSoon = item.estimated_expiry
    ? new Date(item.estimated_expiry).getTime() - Date.now() < 2 * 86_400_000
    : false;

  return (
    <div
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium ${
        isUseSoon
          ? "bg-yellow-50 border-yellow-200 text-yellow-800"
          : "bg-white border-[#E8C9A0] text-[#3D2010]"
      }`}
    >
      <span className="truncate max-w-[90px]">{item.item_name}</span>
      {qty && <span className="text-[10px] text-[#8B5E3C] whitespace-nowrap">{qty}</span>}
    </div>
  );
}

function RawIngredientsSection({
  items,
  loading,
}: {
  items: FridgeItem[];
  loading: boolean;
}) {
  // Group by category — preserve insertion order, unknown → "Other"
  const grouped = new Map<string, FridgeItem[]>();
  for (const item of items) {
    const cat = item.category || "Other";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  return (
    <section className="px-4 pt-5 pb-2">
      <h2 className="font-bold text-[#3D2010] text-base mb-3 flex items-center gap-2">
        🧊 In the Fridge
        {items.length > 0 && (
          <span className="text-xs font-semibold bg-[#E8F5FF] text-blue-600 px-2 py-0.5 rounded-full">
            {items.length} items
          </span>
        )}
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i}>
              <div className="h-3 w-24 bg-[#F5E6D3] rounded animate-pulse mb-2" />
              <div className="flex gap-2 flex-wrap">
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    className="h-7 w-20 bg-[#F5E6D3] rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E8C9A0] p-8 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-sm font-semibold text-[#5C3A1E]">Your fridge is empty!</p>
          <p className="text-xs text-[#8B5E3C] mt-1 leading-relaxed">
            Tap{" "}
            <span className="font-bold text-[#D2691E]">+ Add Items</span>{" "}
            to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([category, catItems]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider mb-2">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {catItems.map((item) => (
                  <FridgeChip key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

function BottomNav({ active }: { active: "fridge" | "cook" | "grocery" }) {
  const tabs = [
    { id: "fridge",  label: "Fridge",  icon: "🧊", href: "/"          },
    { id: "cook",    label: "Cook",    icon: "🍳", href: "/i-cooked"  },
    { id: "grocery", label: "Grocery", icon: "🛒", href: "/grocery"   },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8C9A0] pb-safe z-20">
      <div className="flex max-w-lg mx-auto">
        {tabs.map(({ id, label, icon, href }) => {
          const isActive = id === active;
          return (
            <Link
              key={id}
              href={href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
                isActive ? "text-[#D2691E]" : "text-[#8B5E3C] hover:text-[#D2691E]"
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? "text-[#D2691E]" : "text-[#8B5E3C]"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-[#D2691E] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Sticky action buttons ────────────────────────────────────────────────────

function StickyActions() {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-10 px-4 pb-2 pt-3 bg-gradient-to-t from-[#FFF8F0] via-[#FFF8F0]/95 to-transparent">
      <div className="flex gap-3 max-w-lg mx-auto">
        <Link
          href="/add-items"
          className="flex-1 py-3 rounded-2xl border-2 border-[#D2691E] text-[#D2691E] font-bold text-sm text-center hover:bg-[#FFF0E0] active:scale-95 transition-all"
        >
          + Add Items
        </Link>
        <Link
          href="/i-cooked"
          className="flex-1 py-3 rounded-2xl bg-[#D2691E] text-white font-bold text-sm text-center hover:bg-[#B85C18] active:scale-95 transition-all shadow-lg shadow-[#D2691E]/30"
        >
          🍳 I Cooked
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { household, loading: hhLoading } = useHousehold();
  const { members, loading: membLoading } = useHouseholdMembers(household?.id);
  const { items: cookedItems, loading: cookedLoading, markDone, refetch: refetchCooked } = useCookedItems(household?.id);
  const { items: fridgeItems, loading: fridgeLoading, refetch: refetchFridge } = useFridgeItems(household?.id);

  // ── Toast (from add-items page via sessionStorage) ──
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem("rasoi_added_toast");
      if (msg) {
        sessionStorage.removeItem("rasoi_added_toast");
        // Small delay so the page transition settles first
        setTimeout(() => setToast(msg), 300);
      }
    } catch {
      // sessionStorage unavailable — ignore
    }
  }, []);

  // ── Pull-to-refresh ──
  const mainRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);
  const [pullY, setPullY] = useState(0);       // 0-64, capped
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const scrollTop = mainRef.current?.scrollTop ?? 1;
    if (scrollTop > 0) return;                 // only act when at the top
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setPullY(Math.min(delta * 0.45, 64));
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (pullY >= 50) {
      setRefreshing(true);
      setPullY(0);
      await Promise.all([refetchFridge(), refetchCooked()]);
      setRefreshing(false);
    } else {
      setPullY(0);
    }
  }, [pullY, refetchFridge, refetchCooked]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!userLoading && !user) router.replace("/login");
  }, [user, userLoading, router]);

  // Redirect to onboarding if logged in but no household
  useEffect(() => {
    if (!hhLoading && !household && !userLoading && user) {
      router.replace("/onboarding");
    }
  }, [household, hhLoading, user, userLoading, router]);

  const pageLoading = userLoading || hhLoading;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!household) return null; // redirecting

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347] flex-shrink-0" />

      <Header
        householdName={household.name}
        members={members}
        membersLoading={membLoading}
      />

      {/* Toast — items added from add-items page */}
      <Toast
        message={toast}
        visible={!!toast}
        onHide={() => setToast("")}
        variant="success"
      />

      {/* Scrollable body — padded for sticky buttons (h-16 nav + ~68px buttons) */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto pb-40"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Pull-to-refresh indicator */}
        {(pullY > 0 || refreshing) && (
          <div
            className="flex items-center justify-center overflow-hidden transition-all duration-150"
            style={{ height: refreshing ? 48 : pullY }}
          >
            <div
              className={`w-7 h-7 border-2 border-[#D2691E] border-t-transparent rounded-full ${
                refreshing ? "animate-spin" : ""
              }`}
              style={
                !refreshing
                  ? { transform: `rotate(${(pullY / 64) * 270}deg)` }
                  : undefined
              }
            />
          </div>
        )}

        <CookedSection
          items={cookedItems}
          loading={cookedLoading}
          onDone={markDone}
        />
        <UseSoonAlert items={fridgeItems} />
        <RawIngredientsSection items={fridgeItems} loading={fridgeLoading} />
        {/* Bottom breathing room */}
        <div className="h-6" />
      </main>

      <StickyActions />
      <BottomNav active="fridge" />
    </div>
  );
}
