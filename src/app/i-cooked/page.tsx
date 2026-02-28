"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useHousehold } from "@/hooks/useHousehold";
import { useFridgeItems } from "@/hooks/useFridgeItems";
import type { Recipe, FridgeItem, PantryStaple } from "@/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface MatchedRecipe {
  recipe: Recipe;
  matchCount: number;
  totalIngredients: number;
  score: number;            // 0–1
  deductIds: string[];      // fridge_item ids to remove after logging
}

type DietFilter = "all" | "veg" | "eggetarian" | "nonveg";

// ─── Matching helpers ─────────────────────────────────────────────────────────

/**
 * True if ingredient name plausibly refers to the same thing as a fridge/pantry
 * item name. Handles "onion" ↔ "Pyaz (Onion)", "ginger-garlic paste" ↔ "Adrak
 * (Ginger)", "tomatoes" ↔ "Tamatar (Tomato)", etc.
 */
function nameMatches(ingredientRaw: string, itemName: string): boolean {
  const a = ingredientRaw.toLowerCase();
  const b = itemName.toLowerCase();

  // Direct containment
  if (b.includes(a) || a.includes(b)) return true;

  // Word-level: any ≥4-char word from ingredient appears in item name
  const words = a.split(/[\s\-,()]+/).filter((w) => w.length >= 4);
  return words.some((w) => b.includes(w));
}

const PERISHABLE_CATS = new Set(["Vegetables", "Dairy & Protein"]);

function computeMatches(
  recipes: Recipe[],
  fridgeItems: FridgeItem[],
  pantryStaples: PantryStaple[]
): MatchedRecipe[] {
  const pantryNames = pantryStaples.map((p) => p.item_name);

  return recipes
    .map((recipe) => {
      let matchCount = 0;
      const deductIds: string[] = [];
      const usedFridgeIds = new Set<string>();

      for (const ing of recipe.ingredients) {
        // 1. Check fridge items first (any category)
        const fridgeMatch = fridgeItems.find(
          (fi) => !usedFridgeIds.has(fi.id) && nameMatches(ing.name, fi.item_name)
        );

        if (fridgeMatch) {
          matchCount++;
          usedFridgeIds.add(fridgeMatch.id);
          // Queue for deduction only if perishable
          if (PERISHABLE_CATS.has(fridgeMatch.category)) {
            deductIds.push(fridgeMatch.id);
          }
          continue;
        }

        // 2. Fall back to pantry staples (not deducted — they're always there)
        if (pantryNames.some((p) => nameMatches(ing.name, p))) {
          matchCount++;
        }
      }

      const total = recipe.ingredients.length;
      return {
        recipe,
        matchCount,
        totalIngredients: total,
        score: total > 0 ? matchCount / total : 0,
        deductIds,
      };
    })
    .sort((a, b) => b.score - a.score);
}

// ─── Freshness days ───────────────────────────────────────────────────────────

function getFreshnessDays(recipe: Recipe): number {
  const n = recipe.name.toLowerCase();
  if (n.includes("fish") || n.includes("ilish") || n.includes("macher")) return 1;
  return 2; // dal, sabzi, paneer, chicken, rice dishes — all 2 days
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

const DIET_EMOJI: Record<string, string> = {
  veg: "🥦",
  eggetarian: "🥚",
  nonveg: "🍗",
};

function matchBarColor(score: number): string {
  if (score >= 0.65) return "bg-green-400";
  if (score >= 0.35) return "bg-yellow-400";
  return "bg-gray-300";
}

function matchBorderColor(score: number): string {
  if (score >= 0.65) return "border-l-green-400";
  if (score >= 0.35) return "border-l-yellow-400";
  return "border-l-gray-200";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CookButton({
  busy,
  onClick,
  compact = false,
}: {
  busy: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`flex items-center justify-center gap-1.5 rounded-xl bg-[#D2691E] text-white font-bold transition-all active:scale-95 disabled:opacity-60 ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      {busy ? (
        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>🍳 {compact ? "Cook" : "Cook It"}</>
      )}
    </button>
  );
}

function SuggestionCard({
  m,
  busy,
  onLog,
}: {
  m: MatchedRecipe;
  busy: boolean;
  onLog: () => void;
}) {
  const { recipe, matchCount, totalIngredients, score } = m;
  const pct = Math.round(score * 100);

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E8C9A0] border-l-4 ${matchBorderColor(score)} p-4`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#3D2010] text-base leading-tight truncate">
            {recipe.name}
          </p>
          <p className="text-xs text-[#8B5E3C] mt-0.5">
            {recipe.region} · {DIET_EMOJI[recipe.diet_type]} · {recipe.cook_time_mins} min
          </p>

          {/* Match bar */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#8B5E3C]">
                {matchCount}/{totalIngredients} ingredients ready
              </span>
              <span className="text-[10px] font-bold text-[#5C3A1E]">{pct}%</span>
            </div>
            <div className="h-1.5 bg-[#F5E6D3] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${matchBarColor(score)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <CookButton busy={busy} onClick={onLog} />
      </div>
    </div>
  );
}

function RecipeRow({
  m,
  busy,
  onLog,
}: {
  m: MatchedRecipe;
  busy: boolean;
  onLog: () => void;
}) {
  const { recipe, matchCount, totalIngredients } = m;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#F5E6D3] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-[#3D2010] text-sm">{recipe.name}</p>
          {matchCount > 0 && (
            <span className="text-[10px] bg-[#FFF0E0] text-[#D2691E] border border-[#E8C9A0] px-1.5 py-0.5 rounded-full font-semibold">
              {matchCount}/{totalIngredients}
            </span>
          )}
        </div>
        <p className="text-xs text-[#8B5E3C] mt-0.5">
          {recipe.region} · {DIET_EMOJI[recipe.diet_type]} · {recipe.cook_time_mins} min
        </p>
      </div>
      <CookButton busy={busy} onClick={onLog} compact />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ICookedPage() {
  const router = useRouter();
  const { user } = useUser();
  const { household } = useHousehold();
  const { items: fridgeItems } = useFridgeItems(household?.id);

  // Remote data (one-time fetch — recipes don't change, pantry staples rarely do)
  const [recipes, setRecipes]           = useState<Recipe[]>([]);
  const [pantryStaples, setPantryStaples] = useState<PantryStaple[]>([]);
  const [dataLoading, setDataLoading]   = useState(true);

  // UI state
  const [search, setSearch]         = useState("");
  const [dietFilter, setDietFilter] = useState<DietFilter>("all");
  const [loggingId, setLoggingId]   = useState<string | null>(null);
  const [toast, setToast]           = useState<{ name: string; days: number } | null>(null);
  const [closing, setClosing]       = useState(false);

  // Fetch recipes + pantry staples on mount
  useEffect(() => {
    if (!household) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [recipesRes, staplesRes] = await Promise.all([
        supabase.from("recipes").select("*").order("name"),
        supabase.from("pantry_staples").select("*").eq("household_id", household!.id),
      ]);
      if (cancelled) return;
      setRecipes((recipesRes.data ?? []) as Recipe[]);
      setPantryStaples((staplesRes.data ?? []) as PantryStaple[]);
      setDataLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [household]);

  // Compute match scores (derived, recalculated when fridge changes)
  const matchedRecipes = useMemo(
    () => computeMatches(recipes, fridgeItems, pantryStaples),
    [recipes, fridgeItems, pantryStaples]
  );

  // Suggestions: ≥25% match, cap at 5
  const suggestions = useMemo(
    () => matchedRecipes.filter((m) => m.score >= 0.25).slice(0, 5),
    [matchedRecipes]
  );

  // All-recipes list: apply search + diet filter
  const filteredRecipes = useMemo(() => {
    const q = search.toLowerCase();
    return matchedRecipes.filter((m) => {
      if (q && !m.recipe.name.toLowerCase().includes(q)) return false;
      if (dietFilter !== "all" && m.recipe.diet_type !== dietFilter) return false;
      return true;
    });
  }, [matchedRecipes, search, dietFilter]);

  // Close sheet
  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(() => router.back(), 260);
  }, [router]);

  // Log a dish
  const handleLog = useCallback(
    async (m: MatchedRecipe) => {
      if (!household || !user || loggingId) return;
      setLoggingId(m.recipe.id);

      const supabase = createClient();
      const freshnessDays = getFreshnessDays(m.recipe);
      const today = new Date().toISOString().split("T")[0];

      // Run all inserts in parallel; deductions are fire-and-forget
      await Promise.all([
        supabase.from("cooked_items").insert({
          household_id:   household.id,
          dish_name:      m.recipe.name,
          freshness_days: freshnessDays,
          status:         "fresh",
        }),
        supabase.from("meal_log").insert({
          household_id: household.id,
          dish_name:    m.recipe.name,
          date:         today,
        }),
        // Deduct perishable ingredients from fridge
        m.deductIds.length > 0
          ? supabase.from("fridge_items").delete().in("id", m.deductIds)
          : Promise.resolve(),
      ]);

      setLoggingId(null);

      // Show success toast
      setToast({ name: m.recipe.name, days: freshnessDays });

      // Close after toast is visible
      setTimeout(() => {
        setClosing(true);
        setTimeout(() => router.replace("/"), 260);
      }, 1800);
    },
    [household, user, loggingId, router]
  );

  const DIET_TABS: { id: DietFilter; label: string; emoji: string }[] = [
    { id: "all",        label: "All",     emoji: "🍽️" },
    { id: "veg",        label: "Veg",     emoji: "🥦" },
    { id: "eggetarian", label: "Egg",     emoji: "🥚" },
    { id: "nonveg",     label: "Non-Veg", emoji: "🍗" },
  ];

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
      {/* ── Success toast (absolute, above the sheet) ── */}
      {toast && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-green-700 text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right">
          <span className="text-2xl">✓</span>
          <div>
            <p className="font-bold text-sm">{toast.name} logged!</p>
            <p className="text-xs opacity-85">
              🟢 Fresh for {toast.days} day{toast.days !== 1 ? "s" : ""}
              {" · "}
              used ingredients removed from fridge
            </p>
          </div>
        </div>
      )}

      {/* ── Bottom sheet ── */}
      <div
        className={`w-full bg-[#FFF8F0] rounded-t-3xl flex flex-col overflow-hidden ${
          closing ? "animate-slide-down" : "animate-slide-up"
        }`}
        style={{ maxHeight: "92svh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0 bg-white rounded-t-3xl">
          <div className="w-10 h-1 rounded-full bg-[#E8C9A0]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-white flex-shrink-0 border-b border-[#F5E6D3]">
          <div>
            <h2 className="text-lg font-bold text-[#3D2010]">🍳 I Cooked</h2>
            <p className="text-xs text-[#8B5E3C]">Tap a dish to log it</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="w-8 h-8 rounded-full bg-[#F5E6D3] flex items-center justify-center text-[#5C3A1E] hover:bg-[#E8C9A0] transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ══ Suggestions section ══ */}
          <section className="px-4 pt-5 pb-4">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-bold text-[#3D2010] text-sm flex items-center gap-1.5">
                ✨ Suggested for you
              </h3>
              <p className="text-xs text-[#8B5E3C]">based on your fridge</p>
            </div>

            {dataLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-[#F5E6D3] animate-pulse" />
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E8C9A0] p-5 text-center">
                <p className="text-2xl mb-2">🛒</p>
                <p className="text-sm font-medium text-[#5C3A1E]">
                  Add more ingredients for personalised suggestions
                </p>
                <p className="text-xs text-[#8B5E3C] mt-1">
                  Browse all recipes below ↓
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((m) => (
                  <SuggestionCard
                    key={m.recipe.id}
                    m={m}
                    busy={loggingId === m.recipe.id}
                    onLog={() => handleLog(m)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ══ All Recipes section ══ */}
          <section className="px-4 pb-8">
            {/* Sticky search + filter bar */}
            <div className="sticky top-0 z-10 bg-[#FFF8F0] pb-2 pt-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-[#3D2010] text-sm flex-shrink-0">
                  📖 All Recipes
                </h3>
                <span className="text-xs text-[#8B5E3C]">
                  ({filteredRecipes.length})
                </span>
              </div>

              {/* Search input */}
              <div className="relative mb-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C] text-sm">
                  🔍
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search recipes…"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8C9A0] rounded-xl text-sm text-[#3D2010] placeholder-[#C4A882] focus:outline-none focus:border-[#D2691E] focus:ring-1 focus:ring-[#D2691E]/30 transition-all"
                />
              </div>

              {/* Diet filter chips */}
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                {DIET_TABS.map(({ id, label, emoji }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDietFilter(id)}
                    className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      dietFilter === id
                        ? "bg-[#D2691E] text-white"
                        : "bg-white border border-[#E8C9A0] text-[#5C3A1E] hover:border-[#D2691E]"
                    }`}
                  >
                    <span>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe rows */}
            {dataLoading ? (
              <div className="space-y-3 mt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-xl bg-[#F5E6D3] animate-pulse" />
                ))}
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-2xl mb-2">🍽️</p>
                <p className="text-sm text-[#5C3A1E]">No recipes found</p>
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-xs text-[#D2691E] mt-2 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E8C9A0] px-4 mt-2">
                {filteredRecipes.map((m) => (
                  <RecipeRow
                    key={m.recipe.id}
                    m={m}
                    busy={loggingId === m.recipe.id}
                    onLog={() => handleLog(m)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
