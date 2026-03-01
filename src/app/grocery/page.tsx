"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useHousehold } from "@/hooks/useHousehold";
import { useFridgeItems } from "@/hooks/useFridgeItems";
import { useGroceryList } from "@/hooks/useGroceryList";
import { Toast } from "@/components/Toast";
import { UndoToast } from "@/components/UndoToast";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/Skeleton";
import { nameMatches, dietCompatible, isExpiringSoon } from "@/lib/matching";
import { PRESET_ITEMS, inferCategory, calcExpiry, type Category } from "@/lib/ingredients";
import {
  insertGroceryItems,
  updateGroceryPurchased,
  deleteGroceryItem,
} from "@/lib/services/grocery";
import { insertFridgeItems } from "@/lib/services/fridge";
import { fetchAllRecipes, fetchPantryStaples } from "@/lib/services/recipes";
import type { GroceryItem, FridgeItem, PantryStaple, Recipe } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORE_MAP: Record<string, string> = {
  "Vegetables":      "🥬 Sabzi Mandi",
  "Dairy & Protein": "🥛 Dairy & Other",
  "Pantry":          "🏪 Kirana Store",
};

const STORE_ORDER: Category[] = ["Vegetables", "Dairy & Protein", "Pantry"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function storeLabel(category: string): string {
  return STORE_MAP[category] ?? "🏪 Kirana Store";
}

function todayString(): string {
  return new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Scoring helpers ─────────────────────────────────────────────────────────

function computeTopMissingIngredients(
  recipes: Recipe[],
  fridgeItems: FridgeItem[],
  pantryStaples: PantryStaple[],
  householdDiet: string,
  topN = 3
): string[] {
  const pantryNames = pantryStaples.map((p) => p.item_name);

  interface ScoredRecipe { score: number; missing: string[]; }

  const scored: ScoredRecipe[] = recipes
    .filter((r) => dietCompatible(r.diet_type, householdDiet))
    .map((recipe) => {
      const usedIds = new Set<string>();
      let matchCount = 0;
      let expiringCount = 0;
      const missing: string[] = [];

      for (const ing of recipe.ingredients) {
        const fridgeMatch = fridgeItems.find(
          (fi) => !usedIds.has(fi.id) && nameMatches(ing.name, fi.item_name)
        );
        if (fridgeMatch) {
          matchCount++;
          usedIds.add(fridgeMatch.id);
          if (isExpiringSoon(fridgeMatch)) expiringCount++;
          continue;
        }
        if (pantryNames.some((p) => nameMatches(ing.name, p))) {
          matchCount++;
          continue;
        }
        missing.push(ing.name);
      }

      const total = recipe.ingredients.length;
      const matchPct = total > 0 ? matchCount / total : 0;
      return { score: matchPct + expiringCount * 0.15, missing };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  const seen = new Set<string>();
  const result: string[] = [];
  for (const sr of scored) {
    for (const name of sr.missing) {
      if (!seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        result.push(name);
      }
    }
  }
  return result;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GroceryItemRow({
  item,
  onToggle,
  onDelete,
}: {
  item: GroceryItem;
  onToggle: (id: string, purchased: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`flex items-center gap-3 py-3 px-4 ${item.is_purchased ? "opacity-50" : ""}`}>
      <button
        onClick={() => onToggle(item.id, item.is_purchased)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          item.is_purchased
            ? "bg-[#D2691E] border-[#D2691E]"
            : "border-gray-300 hover:border-[#D2691E]"
        }`}
      >
        {item.is_purchased && (
          <span className="text-white text-xs font-bold leading-none">✓</span>
        )}
      </button>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {item.source === "auto" && !item.is_purchased && (
          <span className="text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
            AUTO
          </span>
        )}
        <span
          className={`text-sm text-gray-800 truncate ${item.is_purchased ? "line-through" : ""}`}
        >
          {item.item_name}
        </span>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 text-xl leading-none w-7 h-7 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
}

function SectionGroup({
  category,
  items,
  onToggle,
  onDelete,
}: {
  category: string;
  items: GroceryItem[];
  onToggle: (id: string, purchased: boolean) => void;
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-3">
      <div className="px-4 pb-1">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          {storeLabel(category)}
        </span>
      </div>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50 mx-4">
        {items.map((item) => (
          <GroceryItemRow key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GroceryPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { household, loading: householdLoading } = useHousehold();
  const { items: fridgeItems } = useFridgeItems(household?.id);
  const { items: groceryItems, loading: groceryLoading, refetch } = useGroceryList(household?.id);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pantryStaples, setPantryStaples] = useState<PantryStaple[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [autoSynced, setAutoSynced] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [purchasedExpanded, setPurchasedExpanded] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [purchaseToast, setPurchaseToast] = useState("");

  // Undo state for delete
  const [undoDelete, setUndoDelete] = useState<{ item: GroceryItem } | null>(null);

  // Auth redirects
  useEffect(() => {
    if (!userLoading && !user) router.replace("/login");
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!householdLoading && user && !household) router.replace("/onboarding");
  }, [household, householdLoading, user, router]);

  // Load recipes + pantry staples once
  useEffect(() => {
    if (!household) return;
    async function load() {
      setDataLoading(true);
      const [r, p] = await Promise.all([
        fetchAllRecipes(),
        fetchPantryStaples(household!.id),
      ]);
      setRecipes(r);
      setPantryStaples(p);
      setDataLoading(false);
    }
    load();
  }, [household]);

  // Auto-sync missing recipe ingredients + expired fridge items
  useEffect(() => {
    if (!household || dataLoading || groceryLoading || autoSynced) return;
    setAutoSynced(true);

    async function sync() {
      const existingNames = new Set(groceryItems.map((g) => g.item_name.toLowerCase()));
      const toInsert: {
        household_id: string;
        item_name: string;
        category: string;
        source: "auto" | "manual";
        is_purchased: boolean;
      }[] = [];

      if (recipes.length > 0) {
        const missing = computeTopMissingIngredients(
          recipes,
          fridgeItems,
          pantryStaples,
          household!.diet_pref
        );
        for (const name of missing) {
          if (!existingNames.has(name.toLowerCase())) {
            toInsert.push({
              household_id: household!.id,
              item_name: name,
              category: inferCategory(name),
              source: "auto",
              is_purchased: false,
            });
            existingNames.add(name.toLowerCase());
          }
        }
      }

      const now = Date.now();
      for (const fi of fridgeItems) {
        if (
          fi.estimated_expiry &&
          new Date(fi.estimated_expiry).getTime() < now &&
          !existingNames.has(fi.item_name.toLowerCase())
        ) {
          toInsert.push({
            household_id: household!.id,
            item_name: fi.item_name,
            category: fi.category,
            source: "auto",
            is_purchased: false,
          });
          existingNames.add(fi.item_name.toLowerCase());
        }
      }

      if (toInsert.length > 0) {
        await insertGroceryItems(toInsert);
        refetch();
      }
    }

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [household, dataLoading, groceryLoading, autoSynced]);

  // Add manual item
  const handleAdd = useCallback(async () => {
    const name = inputValue.trim();
    if (!name || !household || !user) return;
    setAdding(true);
    await insertGroceryItems([{
      household_id: household.id,
      item_name: name,
      category: inferCategory(name),
      source: "manual",
      is_purchased: false,
    }]);
    setInputValue("");
    setAdding(false);
  }, [inputValue, household, user]);

  // Toggle purchased / un-purchased
  const handleToggle = useCallback(
    async (id: string, currentlyPurchased: boolean) => {
      if (!household || !user) return;

      if (!currentlyPurchased) {
        await updateGroceryPurchased(id, true);

        const item = groceryItems.find((g) => g.id === id);
        if (item) {
          const preset = PRESET_ITEMS.find((p) => nameMatches(item.item_name, p.name));
          if (preset) {
            await insertFridgeItems([{
              household_id: household.id,
              item_name: preset.name,
              category: preset.category,
              qty: preset.defaultQty,
              unit: preset.unit,
              added_by: user.id,
              estimated_expiry: calcExpiry(preset.shelfLife),
            }]);
          } else {
            await insertFridgeItems([{
              household_id: household.id,
              item_name: item.item_name,
              category: item.category,
              qty: 1,
              unit: "pcs",
              added_by: user.id,
              estimated_expiry: null,
            }]);
          }
          setPurchaseToast(`${item.item_name} added to fridge 🧊`);
          setTimeout(() => setPurchaseToast(""), 2500);
        }
      } else {
        await updateGroceryPurchased(id, false);
      }
    },
    [household, user, groceryItems]
  );

  // Delete item (with undo)
  const handleDelete = useCallback(
    (id: string) => {
      const item = groceryItems.find((g) => g.id === id);
      if (!item) return;
      // Optimistic removal — hide from UI immediately
      setUndoDelete({ item });
      deleteGroceryItem(id);
    },
    [groceryItems]
  );

  const handleUndoDelete = useCallback(async () => {
    if (!undoDelete || !household) return;
    const { item } = undoDelete;
    await insertGroceryItems([{
      household_id: household.id,
      item_name: item.item_name,
      category: item.category,
      source: item.source,
      is_purchased: item.is_purchased,
    }]);
    setUndoDelete(null);
    refetch();
  }, [undoDelete, household, refetch]);

  // Share list as WhatsApp-friendly text
  const handleShare = useCallback(() => {
    const unpurchased = groceryItems.filter((g) => !g.is_purchased);
    const lines: string[] = ["🛒 Rasoi — Grocery List", `📅 ${todayString()}`, ""];

    for (const cat of STORE_ORDER) {
      const catItems = unpurchased.filter((g) => g.category === cat);
      if (catItems.length === 0) continue;
      lines.push(storeLabel(cat));
      catItems.forEach((item) => lines.push(`• ${item.item_name}`));
      lines.push("");
    }

    const others = unpurchased.filter((g) => !STORE_ORDER.includes(g.category as Category));
    if (others.length > 0) {
      lines.push(storeLabel("Pantry"));
      others.forEach((item) => lines.push(`• ${item.item_name}`));
      lines.push("");
    }

    lines.push("Generated by Rasoi 🍽️");
    const text = lines.join("\n");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
      });
    }
  }, [groceryItems]);

  // ─── Derived state ──────────────────────────────────────────────────────────

  const { pending, purchased } = useMemo(() => ({
    pending:   groceryItems.filter((g) => !g.is_purchased),
    purchased: groceryItems.filter((g) => g.is_purchased),
  }), [groceryItems]);

  const pendingByCategory = useMemo(
    () =>
      STORE_ORDER.reduce<Record<string, GroceryItem[]>>((acc, cat) => {
        acc[cat] = pending.filter((g) => g.category === cat);
        return acc;
      }, {}),
    [pending]
  );

  const unknownPending = useMemo(
    () => pending.filter((g) => !(STORE_ORDER as string[]).includes(g.category)),
    [pending]
  );

  const loading = userLoading || householdLoading || groceryLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0]">
        <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-9 w-16 rounded-xl" />
        </div>
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="pt-4 px-4 space-y-4">
          {["🥬 Sabzi Mandi", "🥛 Dairy & Other"].map((label) => (
            <div key={label}>
              <Skeleton className="h-3 w-28 mb-3" />
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-3 py-3 px-4">
                    <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                    <Skeleton className="flex-1 h-4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user || !household) return null;

  const totalPending = pending.length;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-content-safe">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Grocery List 🛒</h1>
          <p className="text-xs text-gray-500">
            {totalPending > 0
              ? `${totalPending} item${totalPending !== 1 ? "s" : ""} to buy`
              : purchased.length > 0
              ? "All done! 🎉"
              : "List is empty"}
          </p>
        </div>
        <button
          onClick={handleShare}
          disabled={totalPending === 0}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#FFF8F0] border border-[#E8C9A0] rounded-xl text-sm font-semibold text-[#D2691E] active:scale-95 transition-transform disabled:opacity-40"
        >
          Share ↗
        </button>
      </div>

      {/* Purchase toast */}
      <Toast
        message={purchaseToast}
        visible={!!purchaseToast}
        onHide={() => setPurchaseToast("")}
        variant="success"
        duration={0}
      />

      {/* Share toast */}
      {shareToast && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-green-700 text-white text-sm font-medium rounded-xl text-center animate-slide-in-right">
          📋 Copied! Paste in WhatsApp to share.
        </div>
      )}

      {/* Undo delete toast */}
      <UndoToast
        message={undoDelete ? `${undoDelete.item.item_name} removed` : ""}
        visible={!!undoDelete}
        onUndo={handleUndoDelete}
        onExpire={() => setUndoDelete(null)}
      />

      {/* Add item input */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add item (e.g. Paneer, Atta…)"
            className="flex-1 px-4 py-3 bg-[#FFF8F0] border border-[#E8C9A0] rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#D2691E] transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!inputValue.trim() || adding}
            className="px-4 py-3 bg-[#D2691E] text-white rounded-xl font-semibold text-sm disabled:opacity-50 active:scale-95 transition-transform"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Empty states */}
      {totalPending === 0 && purchased.length > 0 && (
        <div className="px-4 pt-10 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-bold text-gray-800 text-lg">All stocked up!</p>
          <p className="text-sm text-gray-400 mt-1">Everything on your list is purchased.</p>
        </div>
      )}
      {totalPending === 0 && purchased.length === 0 && (
        <div className="px-4 pt-16 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <p className="font-semibold text-gray-700 text-lg">Your grocery list is empty</p>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Add items above, or check{" "}
            <button
              onClick={() => router.push("/suggestions")}
              className="text-[#D2691E] underline"
            >
              Aaj Kya Banaye
            </button>{" "}
            for auto-suggestions.
          </p>
        </div>
      )}

      {/* Pending items grouped by store */}
      {totalPending > 0 && (
        <div className="pt-4">
          {STORE_ORDER.map((cat) => (
            <SectionGroup
              key={cat}
              category={cat}
              items={pendingByCategory[cat]}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
          {unknownPending.length > 0 && (
            <SectionGroup
              category="Pantry"
              items={unknownPending}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}

      {/* Purchased section */}
      {purchased.length > 0 && (
        <div className="mx-4 mt-3 mb-2">
          <button
            onClick={() => setPurchasedExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm"
          >
            <span className="text-sm font-semibold text-gray-600">
              ✅ Purchased ({purchased.length})
            </span>
            <span className="text-gray-400 text-sm">{purchasedExpanded ? "▲" : "▼"}</span>
          </button>

          {purchasedExpanded && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50 mt-1">
              {purchased.map((item) => (
                <GroceryItemRow
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom spacing for nav */}
      <div className="h-20" />

      <BottomNav active="grocery" />
    </div>
  );
}
