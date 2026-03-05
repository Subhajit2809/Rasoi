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
import { UndoToast } from "@/components/UndoToast";
import { Avatar } from "@/components/Avatar";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/Skeleton";
import { restoreCookedItem, insertCookedItem } from "@/lib/services/cooked";
import { insertFridgeItems } from "@/lib/services/fridge";
import {
  getDaysRemaining,
  freshnessLevel,
  FRESHNESS_CONFIG,
  relativeTime,
  formatRemaining,
} from "@/lib/freshness";
import { useNotifications } from "@/hooks/useNotifications";
import type { CookedItem, FridgeItem } from "@/types";

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
    <header className="bg-white dark:bg-dark-surface border-b border-[#E8C9A0] dark:border-dark-border px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#3D2010] dark:text-gray-100 text-sm truncate leading-tight">
          {householdName}
        </p>
        <p className="text-xs text-[#8B5E3C] dark:text-gray-400">Mera Fridge</p>
      </div>

      {/* Member avatars */}
      <div className="flex items-center -space-x-2">
        {membersLoading
          ? [0, 1].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-[#F5E6D3] dark:bg-dark-border animate-pulse ring-2 ring-white dark:ring-dark-surface"
                style={{ zIndex: 2 - i }}
              />
            ))
          : visible.map((m, i) => (
              <div key={m.id} style={{ zIndex: visible.length - i }}>
                <Avatar member={m} size={32} overlap={i > 0} />
              </div>
            ))}
        {overflow > 0 && (
          <div className="w-8 h-8 rounded-full bg-[#E8C9A0] dark:bg-dark-border flex items-center justify-center text-xs font-bold text-[#5C3A1E] dark:text-gray-200 ring-2 ring-white dark:ring-dark-surface">
            +{overflow}
          </div>
        )}
      </div>

      <Link
        href="/settings"
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[#8B5E3C] dark:text-gray-400 hover:bg-[#FFF0E0] dark:hover:bg-dark-card transition-colors text-base"
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
  onRemove,
}: {
  item: CookedItem;
  onDone: () => void;
  onRemove: () => void;
}) {
  const daysLeft = getDaysRemaining(item);
  const level = freshnessLevel(daysLeft);
  const cfg = FRESHNESS_CONFIG[level];
  const pct = Math.max(0, Math.min(100, (daysLeft / item.freshness_days) * 100));

  return (
    <div
      className={`bg-white dark:bg-dark-surface rounded-2xl border border-[#E8C9A0] dark:border-dark-border border-l-4 ${cfg.border} overflow-hidden`}
    >
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start gap-3">
          <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${cfg.dot}`} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#3D2010] dark:text-gray-100 text-base leading-tight truncate">
              {item.dish_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}
              >
                {cfg.label}
              </span>
              <span className="text-xs text-[#8B5E3C] dark:text-gray-400">
                cooked {relativeTime(item.cooked_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={onDone}
              className="px-3 py-1.5 rounded-xl bg-[#FFF0E0] dark:bg-dark-card border border-[#E8C9A0] dark:border-dark-border text-xs font-semibold text-[#D2691E] hover:bg-[#D2691E] hover:text-white transition-colors active:scale-95"
            >
              ✓ Done
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#8B5E3C] dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors active:scale-95"
              title="Remove"
            >
              🗑
            </button>
          </div>
        </div>
        <p className="text-xs text-[#8B5E3C] dark:text-gray-400 mt-1.5 pl-5">
          {formatRemaining(daysLeft)}
        </p>
      </div>
      <div className="h-1 bg-[#F5E6D3] dark:bg-dark-border">
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
  onRemove,
}: {
  items: CookedItem[];
  loading: boolean;
  onDone: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="px-4 pt-5">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-bold text-[#3D2010] dark:text-gray-100 text-base">🍲 Cooked Food</h2>
        {items.length > 0 && (
          <span className="text-xs font-semibold bg-[#FFE8CC] dark:bg-[#4A3020] text-[#D2691E] px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E8C9A0] dark:border-dark-border border-l-4 border-l-[#E8C9A0] dark:border-l-dark-border overflow-hidden animate-pulse"
            >
              <div className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="w-14 h-7 rounded-xl flex-shrink-0" />
                </div>
                <Skeleton className="h-2.5 w-28 mt-2 ml-5" />
              </div>
              <div className="h-1 bg-[#F5E6D3] dark:bg-dark-border" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-dashed border-[#E8C9A0] dark:border-dark-border p-6 text-center">
          <p className="text-3xl mb-2">🍽️</p>
          <p className="text-sm font-semibold text-[#5C3A1E] dark:text-gray-200">Nothing on the stove yet</p>
          <p className="text-xs text-[#8B5E3C] dark:text-gray-400 mt-1 leading-relaxed">
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
              onRemove={() => onRemove(item.id)}
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
      <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800/40 rounded-2xl p-4">
        <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-2.5 flex items-center gap-1.5">
          ⏰ Use Before It&apos;s Gone
          <span className="text-xs font-semibold bg-yellow-200 dark:bg-yellow-800/40 text-yellow-800 dark:text-yellow-300 px-1.5 py-0.5 rounded-full">
            {expiring.length}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {expiring.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 bg-white dark:bg-dark-surface border border-yellow-200 dark:border-yellow-800/40 rounded-full px-3 py-1"
            >
              <span className="text-xs font-semibold text-[#3D2010] dark:text-gray-100 truncate max-w-[100px]">
                {item.item_name}
              </span>
              <span className="text-xs text-yellow-700 dark:text-yellow-400 font-bold whitespace-nowrap">
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

function FridgeChip({ item, onRemove }: { item: FridgeItem; onRemove: () => void }) {
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
          ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/40 text-yellow-800 dark:text-yellow-300"
          : "bg-white dark:bg-dark-surface border-[#E8C9A0] dark:border-dark-border text-[#3D2010] dark:text-gray-100"
      }`}
    >
      <span className="truncate max-w-[90px]">{item.item_name}</span>
      {qty && <span className="text-[10px] text-[#8B5E3C] dark:text-gray-400 whitespace-nowrap">{qty}</span>}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 -mr-1 w-4 h-4 flex items-center justify-center rounded-full text-[10px] leading-none opacity-50 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-500 transition-all"
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}

function RawIngredientsSection({
  items,
  loading,
  onRemove,
}: {
  items: FridgeItem[];
  loading: boolean;
  onRemove: (id: string) => void;
}) {
  const grouped = new Map<string, FridgeItem[]>();
  for (const item of items) {
    const cat = item.category || "Other";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  return (
    <section className="px-4 pt-5 pb-2">
      <h2 className="font-bold text-[#3D2010] dark:text-gray-100 text-base mb-3 flex items-center gap-2">
        🧊 In the Fridge
        {items.length > 0 && (
          <span className="text-xs font-semibold bg-[#E8F5FF] dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
            {items.length} items
          </span>
        )}
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i}>
              <Skeleton className="h-3 w-24 mb-2" />
              <div className="flex gap-2 flex-wrap">
                {[0, 1, 2].map((j) => (
                  <Skeleton key={j} className="h-7 w-20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-dashed border-[#E8C9A0] dark:border-dark-border p-8 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <p className="text-sm font-semibold text-[#5C3A1E] dark:text-gray-200">Your fridge is empty!</p>
          <p className="text-xs text-[#8B5E3C] dark:text-gray-400 mt-1 leading-relaxed">
            Tap{" "}
            <span className="font-bold text-[#D2691E]">+ Add Items</span>{" "}
            to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([category, catItems]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-[#8B5E3C] dark:text-gray-400 uppercase tracking-wider mb-2">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {catItems.map((item) => (
                  <FridgeChip key={item.id} item={item} onRemove={() => onRemove(item.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Sticky action buttons ────────────────────────────────────────────────────

function StickyActions() {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-10 px-4 pb-2 pt-3 bg-gradient-to-t from-[#FFF8F0] via-[#FFF8F0]/95 to-transparent dark:from-dark-bg dark:via-dark-bg/95">
      <div className="flex gap-3 max-w-lg mx-auto">
        <Link
          href="/add-items"
          className="flex-1 py-3 rounded-2xl border-2 border-[#D2691E] text-[#D2691E] font-bold text-sm text-center hover:bg-[#FFF0E0] dark:hover:bg-dark-card active:scale-95 transition-all"
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
  const { items: cookedItems, loading: cookedLoading, markDone, removeItem: removeCookedItem, refetch: refetchCooked } = useCookedItems(household?.id);
  const { items: fridgeItems, loading: fridgeLoading, removeItem: removeFridgeItem, refetch: refetchFridge } = useFridgeItems(household?.id);

  useNotifications(cookedItems, fridgeItems);

  // ── Toast (from add-items page via sessionStorage) ──
  const [toast, setToast] = useState("");
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem("rasoi_added_toast");
      if (msg) {
        sessionStorage.removeItem("rasoi_added_toast");
        setTimeout(() => setToast(msg), 300);
      }
    } catch {
      // sessionStorage unavailable — ignore
    }
  }, []);

  // ── Undo toast for "Done" and "Remove" actions ──
  const [undoState, setUndoState] = useState<{
    name: string;
    type: "done" | "remove-cooked" | "remove-fridge";
    cookedItem?: CookedItem;
    fridgeItem?: FridgeItem;
  } | null>(null);

  const handleDone = useCallback(
    (id: string) => {
      const item = cookedItems.find((i) => i.id === id);
      if (!item) return;
      markDone(id);
      setUndoState({ name: item.dish_name, type: "done", cookedItem: item });
    },
    [cookedItems, markDone]
  );

  const handleRemoveCooked = useCallback(
    (id: string) => {
      const item = cookedItems.find((i) => i.id === id);
      if (!item) return;
      removeCookedItem(id);
      setUndoState({ name: item.dish_name, type: "remove-cooked", cookedItem: item });
    },
    [cookedItems, removeCookedItem]
  );

  const handleRemoveFridge = useCallback(
    (id: string) => {
      const item = fridgeItems.find((i) => i.id === id);
      if (!item) return;
      removeFridgeItem(id);
      setUndoState({ name: item.item_name, type: "remove-fridge", fridgeItem: item });
    },
    [fridgeItems, removeFridgeItem]
  );

  const handleUndo = useCallback(async () => {
    if (!undoState) return;
    if (undoState.type === "done" && undoState.cookedItem) {
      await restoreCookedItem(undoState.cookedItem.id);
      refetchCooked();
    } else if (undoState.type === "remove-cooked" && undoState.cookedItem) {
      const ci = undoState.cookedItem;
      await insertCookedItem({
        household_id: ci.household_id,
        dish_name: ci.dish_name,
        freshness_days: ci.freshness_days,
        status: ci.status as "fresh" | "stale" | "finished",
        cooked_at: ci.cooked_at,
      });
      refetchCooked();
    } else if (undoState.type === "remove-fridge" && undoState.fridgeItem) {
      const fi = undoState.fridgeItem;
      await insertFridgeItems([{
        household_id: fi.household_id,
        item_name: fi.item_name,
        category: fi.category,
        qty: fi.qty,
        unit: fi.unit,
        added_by: fi.added_by,
        estimated_expiry: fi.estimated_expiry,
      }]);
      refetchFridge();
    }
    setUndoState(null);
  }, [undoState, refetchCooked, refetchFridge]);

  const handleUndoExpire = useCallback(() => {
    setUndoState(null);
  }, []);

  // ── Pull-to-refresh ──
  const mainRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const scrollTop = mainRef.current?.scrollTop ?? 1;
    if (scrollTop > 0) return;
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
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!household) return null; // redirecting

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg flex flex-col">
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

      {/* Undo toast for Done/Remove actions */}
      <UndoToast
        message={
          undoState
            ? undoState.type === "done"
              ? `${undoState.name} marked done`
              : `${undoState.name} removed`
            : ""
        }
        visible={!!undoState}
        onUndo={handleUndo}
        onExpire={handleUndoExpire}
      />

      {/* Scrollable body */}
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
          onDone={handleDone}
          onRemove={handleRemoveCooked}
        />
        <UseSoonAlert items={fridgeItems} />
        <RawIngredientsSection items={fridgeItems} loading={fridgeLoading} onRemove={handleRemoveFridge} />
        <div className="h-6" />
      </main>

      <StickyActions />
      <BottomNav active="fridge" />
    </div>
  );
}
