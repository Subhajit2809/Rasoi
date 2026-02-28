"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useHousehold } from "@/hooks/useHousehold";

// ─── Data catalogue ───────────────────────────────────────────────────────────

type Category = "Vegetables" | "Dairy & Protein" | "Pantry";

interface PresetItem {
  name: string;       // stored as fridge_items.item_name
  category: Category;
  unit: string;
  defaultQty: number;
  shelfLife: number;  // days until estimated_expiry
}

const ITEMS: PresetItem[] = [
  // ── Vegetables ──────────────────────────────────────────────
  { name: "Pyaz (Onion)",        category: "Vegetables",      unit: "pcs",   defaultQty: 6,   shelfLife: 14  },
  { name: "Tamatar (Tomato)",    category: "Vegetables",      unit: "pcs",   defaultQty: 4,   shelfLife: 5   },
  { name: "Aloo (Potato)",       category: "Vegetables",      unit: "kg",    defaultQty: 1,   shelfLife: 21  },
  { name: "Palak (Spinach)",     category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 2   },
  { name: "Gobi (Cauliflower)",  category: "Vegetables",      unit: "pcs",   defaultQty: 1,   shelfLife: 4   },
  { name: "Capsicum",            category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 7   },
  { name: "Baingan (Brinjal)",   category: "Vegetables",      unit: "pcs",   defaultQty: 2,   shelfLife: 4   },
  { name: "Gajar (Carrot)",      category: "Vegetables",      unit: "pcs",   defaultQty: 4,   shelfLife: 10  },
  { name: "Bhindi (Okra)",       category: "Vegetables",      unit: "g",     defaultQty: 250, shelfLife: 3   },
  { name: "Hari Mirch",          category: "Vegetables",      unit: "pcs",   defaultQty: 8,   shelfLife: 7   },
  { name: "Adrak (Ginger)",      category: "Vegetables",      unit: "pcs",   defaultQty: 1,   shelfLife: 14  },
  { name: "Lahsun (Garlic)",     category: "Vegetables",      unit: "bulb",  defaultQty: 2,   shelfLife: 30  },
  { name: "Lauki (Bottle Gourd)",category: "Vegetables",      unit: "pcs",   defaultQty: 1,   shelfLife: 7   },
  { name: "Dhaniya (Coriander)", category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 3   },
  { name: "Methi Leaves",        category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 3   },
  { name: "Pudina (Mint)",       category: "Vegetables",      unit: "bunch", defaultQty: 1,   shelfLife: 3   },
  { name: "Nimbu (Lemon)",       category: "Vegetables",      unit: "pcs",   defaultQty: 4,   shelfLife: 14  },
  { name: "Matar (Peas)",        category: "Vegetables",      unit: "g",     defaultQty: 250, shelfLife: 3   },

  // ── Dairy & Protein ──────────────────────────────────────────
  { name: "Paneer",              category: "Dairy & Protein", unit: "g",     defaultQty: 200, shelfLife: 4   },
  { name: "Dahi (Yogurt)",       category: "Dairy & Protein", unit: "ml",    defaultQty: 500, shelfLife: 5   },
  { name: "Doodh (Milk)",        category: "Dairy & Protein", unit: "L",     defaultQty: 1,   shelfLife: 3   },
  { name: "Eggs",                category: "Dairy & Protein", unit: "pcs",   defaultQty: 6,   shelfLife: 21  },
  { name: "Chicken",             category: "Dairy & Protein", unit: "g",     defaultQty: 500, shelfLife: 2   },
  { name: "Fish",                category: "Dairy & Protein", unit: "g",     defaultQty: 500, shelfLife: 1   },
  { name: "Mutton",              category: "Dairy & Protein", unit: "g",     defaultQty: 500, shelfLife: 2   },
  { name: "Butter",              category: "Dairy & Protein", unit: "g",     defaultQty: 100, shelfLife: 30  },
  { name: "Fresh Cream",         category: "Dairy & Protein", unit: "ml",    defaultQty: 200, shelfLife: 5   },
  { name: "Cheese",              category: "Dairy & Protein", unit: "g",     defaultQty: 200, shelfLife: 14  },
  { name: "Tofu",                category: "Dairy & Protein", unit: "g",     defaultQty: 200, shelfLife: 4   },

  // ── Pantry ────────────────────────────────────────────────────
  { name: "Chawal (Rice)",       category: "Pantry",          unit: "kg",    defaultQty: 1,   shelfLife: 365 },
  { name: "Atta",                category: "Pantry",          unit: "kg",    defaultQty: 1,   shelfLife: 60  },
  { name: "Maida",               category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 90  },
  { name: "Toor Dal",            category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Moong Dal",           category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Chana Dal",           category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Rajma",               category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Kabuli Chana",        category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 365 },
  { name: "Cooking Oil",         category: "Pantry",          unit: "L",     defaultQty: 1,   shelfLife: 180 },
  { name: "Ghee",                category: "Pantry",          unit: "g",     defaultQty: 200, shelfLife: 180 },
  { name: "Tomato Puree",        category: "Pantry",          unit: "ml",    defaultQty: 200, shelfLife: 5   },
  { name: "Bread",               category: "Pantry",          unit: "pcs",   defaultQty: 1,   shelfLife: 7   },
  { name: "Poha",                category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 180 },
  { name: "Besan",               category: "Pantry",          unit: "g",     defaultQty: 500, shelfLife: 180 },
  { name: "Coconut Milk",        category: "Pantry",          unit: "ml",    defaultQty: 200, shelfLife: 3   },
];

const CATEGORIES: Category[] = ["Vegetables", "Dairy & Protein", "Pantry"];

const CATEGORY_EMOJI: Record<Category, string> = {
  "Vegetables":      "🥦",
  "Dairy & Protein": "🥛",
  "Pantry":          "🫙",
};

// ─── Quantity helpers ─────────────────────────────────────────────────────────

function stepFor(unit: string): number {
  if (unit === "kg" || unit === "L") return 0.5;
  if (unit === "g" || unit === "ml") return 50;
  return 1; // pcs, bunch, bulb, packet, cups
}

function fmtQty(qty: number, unit: string): string {
  const n = Number.isInteger(qty) ? qty : qty.toFixed(1);
  return `${n} ${unit}`;
}

function calcExpiry(shelfLife: number): string {
  const d = new Date();
  d.setDate(d.getDate() + shelfLife);
  return d.toISOString();
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
        className="flex items-center px-3 py-2 rounded-full border border-[#E8C9A0] bg-white text-[#5C3A1E] text-sm font-medium hover:border-[#D2691E] hover:bg-[#FFF0E0] active:scale-95 transition-all"
      >
        {preset.name}
      </button>
    );
  }

  // Selected: show ✓ name + inline −/qty/+ stepper
  return (
    <div className="flex items-center gap-0.5 pl-2.5 pr-1 py-1 rounded-full bg-[#D2691E] text-white text-sm font-medium shadow-sm">
      {/* Check + name */}
      <span className="text-xs mr-0.5 opacity-90">✓</span>
      <span className="whitespace-nowrap">{preset.name}</span>

      {/* Stepper */}
      <div className="flex items-center ml-1.5 bg-white/20 rounded-full px-1 py-0.5 gap-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            // If going to 0 or below, deselect instead
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
  // Map<item name → Selection>
  const [selections, setSelections] = useState<Map<string, Selection>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ── Close / dismiss ──

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(() => router.back(), 260);
  }, [router]);

  // ── Toggle chip selection ──

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

  // ── Adjust quantity ──

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

  // ── Submit ──

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

    const { error: insErr } = await createClient()
      .from("fridge_items")
      .insert(rows);

    if (insErr) {
      setError("Couldn't add items. Please try again.");
      setSubmitting(false);
      return;
    }

    // Signal home screen to show a toast
    try {
      sessionStorage.setItem(
        "rasoi_added_toast",
        `${totalSelected} item${totalSelected !== 1 ? "s" : ""} added to fridge 🧊`
      );
    } catch {
      // sessionStorage unavailable (private browsing edge case) — ignore
    }

    // Show success inside the sheet, then dismiss
    setSuccessMsg(`${totalSelected} item${totalSelected !== 1 ? "s" : ""} added! 🎉`);
    setTimeout(() => {
      setClosing(true);
      setTimeout(() => router.replace("/"), 260);
    }, 1000);
  }

  // ── Derived ──

  const visibleItems = ITEMS.filter((i) => i.category === activeCategory);
  const totalSelected = selections.size;

  return (
    // Full-screen overlay — tap backdrop to dismiss
    <div
      className={`fixed inset-0 z-40 flex items-end ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      {/* Bottom sheet */}
      <div
        className={`w-full bg-white rounded-t-3xl flex flex-col overflow-hidden ${
          closing ? "animate-slide-down" : "animate-slide-up"
        }`}
        style={{ maxHeight: "88svh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Drag handle ── */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#E8C9A0]" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#3D2010]">Add to Fridge</h2>
            <p className="text-xs text-[#8B5E3C]">Tap items to select, then adjust qty</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="w-8 h-8 rounded-full bg-[#F5E6D3] flex items-center justify-center text-[#5C3A1E] hover:bg-[#E8C9A0] transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ── Category tabs ── */}
        <div className="flex gap-2 px-4 pb-3 flex-shrink-0 border-b border-[#F5E6D3]">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            const count = ITEMS.filter(
              (i) => i.category === cat && selections.has(i.name)
            ).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#D2691E] text-white shadow-sm"
                    : "bg-[#FFF0E0] text-[#5C3A1E] hover:bg-[#FFE0C0]"
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

        {/* ── Chips grid (scrollable) ── */}
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

          {/* Custom item hint */}
          <p className="text-xs text-[#B8967A] mt-5 text-center">
            Don&apos;t see an item?{" "}
            <span className="font-medium text-[#D2691E]">
              Custom items coming soon
            </span>
          </p>
        </div>

        {/* ── Footer: selected summary + submit ── */}
        <div className="flex-shrink-0 px-4 pt-3 pb-6 border-t border-[#F5E6D3] bg-white">
          {/* Mini summary of all selections across categories */}
          {totalSelected > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 max-h-16 overflow-y-auto">
              {Array.from(selections.values()).map(({ preset, qty }) => (
                <span
                  key={preset.name}
                  className="text-xs bg-[#FFF0E0] text-[#5C3A1E] border border-[#E8C9A0] px-2 py-0.5 rounded-full"
                >
                  {preset.name} · {fmtQty(qty, preset.unit)}
                </span>
              ))}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-xl px-3 py-2.5 mb-3 animate-slide-in-right">
              <span className="text-green-600 font-bold">✓</span>
              <p className="text-xs font-semibold">{successMsg}</p>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={totalSelected === 0 || submitting || !!successMsg}
            className="w-full py-4 rounded-2xl bg-[#D2691E] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#B85C18] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#D2691E]/25"
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
