"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useHousehold } from "@/hooks/useHousehold";
import { PRESET_ITEMS, CATEGORIES, CATEGORY_EMOJI, calcExpiry, type Category, type PresetItem } from "@/lib/ingredients";
import { insertFridgeItems } from "@/lib/services/fridge";

// ─── Quantity helpers ─────────────────────────────────────────────────────────

function stepFor(unit: string): number {
  if (unit === "kg" || unit === "L") return 0.5;
  if (unit === "g" || unit === "ml") return 50;
  return 1;
}

function fmtQty(qty: number, unit: string): string {
  const n = Number.isInteger(qty) ? qty : qty.toFixed(1);
  return `${n} ${unit}`;
}

// ─── Selection state ──────────────────────────────────────────────────────────

interface Selection {
  preset: PresetItem;
  qty: number;
}

// ─── ItemChip ─────────────────────────────────────────────────────────────────

function ItemChip({
  preset,
  selection,
  onToggle,
  onAdjust,
}: {
  preset: PresetItem;
  selection: Selection | undefined;
  onToggle: () => void;
  onAdjust: (delta: number) => void;
}) {
  const selected = !!selection;
  const step = stepFor(preset.unit);

  if (!selected) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center px-3 py-2 rounded-full border border-[#E8C9A0] dark:border-dark-border bg-white dark:bg-dark-surface text-[#5C3A1E] dark:text-gray-200 text-sm font-medium hover:border-[#D2691E] hover:bg-[#FFF0E0] dark:hover:bg-dark-card active:scale-95 transition-all"
      >
        {preset.name}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-0.5 pl-2.5 pr-1 py-1 rounded-full bg-[#D2691E] text-white text-sm font-medium shadow-sm dark:shadow-none">
      <span className="text-xs mr-0.5 opacity-90">✓</span>
      <span className="whitespace-nowrap">{preset.name}</span>
      <div className="flex items-center ml-1.5 bg-white/20 rounded-full px-1 py-0.5 gap-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (selection.qty - step <= 0) {
              onToggle();
            } else {
              onAdjust(-step);
            }
          }}
          className="w-5 h-5 rounded-full flex items-center justify-center text-base leading-none hover:bg-white/20 active:scale-90 transition-all"
          aria-label="Decrease"
        >
          −
        </button>
        <span className="min-w-[3.5rem] text-center text-xs font-semibold px-0.5">
          {fmtQty(selection.qty, preset.unit)}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdjust(step);
          }}
          className="w-5 h-5 rounded-full flex items-center justify-center text-base leading-none hover:bg-white/20 active:scale-90 transition-all"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AddItemsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { household } = useHousehold();

  const [activeCategory, setActiveCategory] = useState<Category>("Vegetables");
  const [selections, setSelections] = useState<Map<string, Selection>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(() => router.back(), 260);
  }, [router]);

  function toggle(preset: PresetItem) {
    setSelections((prev) => {
      const next = new Map(prev);
      if (next.has(preset.name)) {
        next.delete(preset.name);
      } else {
        next.set(preset.name, { preset, qty: preset.defaultQty });
      }
      return next;
    });
  }

  function adjust(name: string, delta: number) {
    setSelections((prev) => {
      const sel = prev.get(name);
      if (!sel) return prev;
      const next = new Map(prev);
      const newQty = Math.max(0, +(sel.qty + delta).toFixed(2));
      if (newQty <= 0) {
        next.delete(name);
      } else {
        next.set(name, { ...sel, qty: newQty });
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (!household || !user || selections.size === 0) return;
    setSubmitting(true);
    setError("");

    const rows = Array.from(selections.values()).map(({ preset, qty }) => ({
      household_id:     household.id,
      item_name:        preset.name,
      category:         preset.category,
      qty,
      unit:             preset.unit,
      added_by:         user.id,
      estimated_expiry: calcExpiry(preset.shelfLife),
    }));

    const { error: insErr } = await insertFridgeItems(rows);

    if (insErr) {
      setError("Couldn't add items. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      sessionStorage.setItem(
        "rasoi_added_toast",
        `${totalSelected} item${totalSelected !== 1 ? "s" : ""} added to fridge 🧊`
      );
    } catch {
      // sessionStorage unavailable
    }

    setSuccessMsg(`${totalSelected} item${totalSelected !== 1 ? "s" : ""} added! 🎉`);
    setTimeout(() => {
      setClosing(true);
      setTimeout(() => router.replace("/"), 260);
    }, 1000);
  }

  const visibleItems = PRESET_ITEMS.filter((i) => i.category === activeCategory);
  const totalSelected = selections.size;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-end ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        className={`w-full bg-white dark:bg-dark-surface rounded-t-3xl flex flex-col overflow-hidden ${
          closing ? "animate-slide-down" : "animate-slide-up"
        }`}
        style={{ maxHeight: "88svh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#E8C9A0] dark:bg-dark-border" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#3D2010] dark:text-gray-100">Add to Fridge</h2>
            <p className="text-xs text-[#8B5E3C] dark:text-gray-400">Tap items to select, then adjust qty</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="w-8 h-8 rounded-full bg-[#F5E6D3] dark:bg-dark-border flex items-center justify-center text-[#5C3A1E] dark:text-gray-200 hover:bg-[#E8C9A0] dark:hover:bg-dark-border-light transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex gap-2 px-4 pb-3 flex-shrink-0 border-b border-[#F5E6D3] dark:border-dark-border-light">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            const count = PRESET_ITEMS.filter(
              (i) => i.category === cat && selections.has(i.name)
            ).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#D2691E] text-white shadow-sm dark:shadow-none"
                    : "bg-[#FFF0E0] dark:bg-dark-card text-[#5C3A1E] dark:text-gray-200 hover:bg-[#FFE0C0] dark:hover:bg-dark-border"
                }`}
              >
                <span>{CATEGORY_EMOJI[cat]}</span>
                <span className="hidden sm:inline">{cat}</span>
                <span className="sm:hidden">
                  {cat === "Dairy & Protein" ? "Dairy" : cat}
                </span>
                {count > 0 && (
                  <span
                    className={`text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                      active
                        ? "bg-white text-[#D2691E]"
                        : "bg-[#D2691E] text-white"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {visibleItems.map((preset) => (
              <ItemChip
                key={preset.name}
                preset={preset}
                selection={selections.get(preset.name)}
                onToggle={() => toggle(preset)}
                onAdjust={(delta) => adjust(preset.name, delta)}
              />
            ))}
          </div>
          <p className="text-xs text-[#B8967A] dark:text-gray-500 mt-5 text-center">
            Don&apos;t see an item?{" "}
            <span className="font-medium text-[#D2691E]">
              Custom items coming soon
            </span>
          </p>
        </div>

        <div className="flex-shrink-0 px-4 pt-3 pb-6 border-t border-[#F5E6D3] dark:border-dark-border-light bg-white dark:bg-dark-surface">
          {totalSelected > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 max-h-16 overflow-y-auto">
              {Array.from(selections.values()).map(({ preset, qty }) => (
                <span
                  key={preset.name}
                  className="text-xs bg-[#FFF0E0] dark:bg-dark-card text-[#5C3A1E] dark:text-gray-200 border border-[#E8C9A0] dark:border-dark-border px-2 py-0.5 rounded-full"
                >
                  {preset.name} · {fmtQty(qty, preset.unit)}
                </span>
              ))}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 rounded-xl px-3 py-2.5 mb-3 animate-slide-in-right">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
              <p className="text-xs font-semibold">{successMsg}</p>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl px-3 py-2 mb-3">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={totalSelected === 0 || submitting || !!successMsg}
            className="w-full py-4 rounded-2xl bg-[#D2691E] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#B85C18] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#D2691E]/25 dark:shadow-none"
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding…
              </>
            ) : totalSelected === 0 ? (
              "Tap items to select"
            ) : (
              `Add ${totalSelected} item${totalSelected !== 1 ? "s" : ""} to Fridge 🧊`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
