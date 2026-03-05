"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useHousehold } from "@/hooks/useHousehold";
import { useFridgeItems } from "@/hooks/useFridgeItems";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/Skeleton";
import { nameMatches, dietCompatible, isExpiringSoon } from "@/lib/matching";
import { getFreshnessForCategory } from "@/lib/freshness";
import { insertCookedItem } from "@/lib/services/cooked";
import { insertMealLog, fetchAllRecipes, fetchPantryStaples, fetchRecentMealDishes } from "@/lib/services/recipes";
import { deleteFridgeItems } from "@/lib/services/fridge";
import type { Recipe, FridgeItem, PantryStaple } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IngredientStatus {
  name: string;
  qty: string;
  have: boolean;
  expiring: boolean;
  deductId?: string;
}

interface ScoredRecipe {
  recipe: Recipe;
  score: number;
  matchCount: number;
  totalIngredients: number;
  matchPct: number;
  urgencyBonus: number;
  recencyPenalty: number;
  ingredients: IngredientStatus[];
  deductIds: string[];
}

type TimeFilter = "all" | "quick" | "elaborate";

// ─── Constants ────────────────────────────────────────────────────────────────

const PERISHABLE_CATS = new Set(["Vegetables", "Dairy & Protein"]);

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreRecipes(
  recipes: Recipe[],
  fridgeItems: FridgeItem[],
  pantryStaples: PantryStaple[],
  recentDishNames: Set<string>,
  householdDiet: string
): ScoredRecipe[] {
  const pantryNames = pantryStaples.map((p) => p.item_name);

  return recipes
    .filter((r) => dietCompatible(r.diet_type, householdDiet))
    .map((recipe) => {
      const usedFridgeIds = new Set<string>();
      const deductIds: string[] = [];
      let matchCount = 0;
      let expiringCount = 0;

      const ingredients: IngredientStatus[] = recipe.ingredients.map((ing) => {
        const fridgeMatch = fridgeItems.find(
          (fi) => !usedFridgeIds.has(fi.id) && nameMatches(ing.name, fi.item_name)
        );

        if (fridgeMatch) {
          matchCount++;
          usedFridgeIds.add(fridgeMatch.id);
          const expiring = isExpiringSoon(fridgeMatch);
          if (expiring) expiringCount++;
          if (PERISHABLE_CATS.has(fridgeMatch.category)) {
            deductIds.push(fridgeMatch.id);
          }
          return { name: ing.name, qty: ing.qty, have: true, expiring, deductId: fridgeMatch.id };
        }

        const inPantry = pantryNames.some((p) => nameMatches(ing.name, p));
        if (inPantry) {
          matchCount++;
          return { name: ing.name, qty: ing.qty, have: true, expiring: false };
        }

        return { name: ing.name, qty: ing.qty, have: false, expiring: false };
      });

      const total = recipe.ingredients.length;
      const matchPct = total > 0 ? matchCount / total : 0;
      const urgencyBonus = expiringCount * 0.15;
      const recencyPenalty = recentDishNames.has(recipe.name.toLowerCase()) ? 0.3 : 0;
      const score = Math.max(0, matchPct + urgencyBonus - recencyPenalty);

      return {
        recipe,
        score,
        matchCount,
        totalIngredients: total,
        matchPct,
        urgencyBonus,
        recencyPenalty,
        ingredients,
        deductIds,
      };
    })
    .sort((a, b) => b.score - a.score);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MatchBar({ pct }: { pct: number }) {
  const color =
    pct >= 0.65 ? "bg-green-500" : pct >= 0.35 ? "bg-amber-400" : "bg-gray-300 dark:bg-gray-600";
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-dark-card overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(100, Math.round(pct * 100))}%` }}
      />
    </div>
  );
}

function MatchLabel({ pct, matchCount, total }: { pct: number; matchCount: number; total: number }) {
  if (pct >= 1) {
    return <span className="text-xs font-semibold text-green-600 dark:text-green-400">All ingredients</span>;
  }
  const color = pct >= 0.65 ? "text-green-600 dark:text-green-400" : pct >= 0.35 ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400";
  return (
    <span className={`text-xs font-semibold ${color}`}>
      {matchCount}/{total} match ({Math.round(pct * 100)}%)
    </span>
  );
}

function RecipeCard({
  sr,
  rank,
  onClick,
}: {
  sr: ScoredRecipe;
  rank: number;
  onClick: () => void;
}) {
  const missing = sr.ingredients.filter((i) => !i.have);
  const expiring = sr.ingredients.filter((i) => i.expiring);
  const borderColor =
    sr.matchPct >= 0.65 ? "border-green-400" : sr.matchPct >= 0.35 ? "border-amber-400" : "border-gray-200 dark:border-dark-border";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white dark:bg-dark-surface rounded-2xl border-l-4 ${borderColor} shadow-sm dark:shadow-none p-4 flex flex-col gap-2 active:scale-[0.98] transition-transform`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {rank === 1 && (
              <span className="text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                Top Pick
              </span>
            )}
            {expiring.length > 0 && (
              <span className="text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                Use soon
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1 leading-snug">{sr.recipe.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {sr.recipe.region} · {sr.recipe.category} · {sr.recipe.cook_time_mins} min
          </p>
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-lg flex-shrink-0">›</div>
      </div>

      <div className="space-y-1">
        <MatchBar pct={sr.matchPct} />
        <MatchLabel pct={sr.matchPct} matchCount={sr.matchCount} total={sr.totalIngredients} />
      </div>

      {missing.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {missing.slice(0, 4).map((m) => (
            <span
              key={m.name}
              className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/40 px-2 py-0.5 rounded-full"
            >
              {m.name}
            </span>
          ))}
          {missing.length > 4 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 px-1 py-0.5">
              +{missing.length - 4} more
            </span>
          )}
        </div>
      )}
    </button>
  );
}

function RecipeDetailSheet({
  sr,
  householdId,
  onClose,
  onLogged,
}: {
  sr: ScoredRecipe;
  householdId: string;
  onClose: () => void;
  onLogged: (dishName: string) => void;
}) {
  const [closing, setClosing] = useState(false);
  const [logging, setLogging] = useState(false);
  const [toast, setToast] = useState(false);

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 260);
  }, [onClose]);

  async function handleLog() {
    setLogging(true);
    const now = new Date().toISOString();
    const freshnessForCat = getFreshnessForCategory(sr.recipe.category);

    try {
      await Promise.all([
        insertCookedItem({
          household_id: householdId,
          dish_name: sr.recipe.name,
          cooked_at: now,
          freshness_days: freshnessForCat,
          status: "fresh",
        }),
        insertMealLog({
          household_id: householdId,
          dish_name: sr.recipe.name,
          date: now.slice(0, 10),
        }),
        deleteFridgeItems(sr.deductIds),
      ]);

      setToast(true);
      setTimeout(() => {
        onLogged(sr.recipe.name);
        close();
      }, 1200);
    } catch {
      setLogging(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end ${closing ? "animate-fade-out" : "animate-fade-in"}`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <div
        className={`relative bg-white dark:bg-dark-surface rounded-t-3xl w-full max-h-[90vh] flex flex-col ${closing ? "animate-slide-down" : "animate-slide-up"}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 dark:bg-dark-border rounded-full" />
        </div>
        <div className="px-5 py-3 border-b border-gray-100 dark:border-dark-border-light">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{sr.recipe.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {sr.recipe.region} · {sr.recipe.category} · {sr.recipe.cook_time_mins} min
              </p>
            </div>
            <button
              onClick={close}
              className="text-gray-400 dark:text-gray-500 text-2xl leading-none mt-0.5 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 px-5 pt-4 pb-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Ingredients
            </h3>
            <div className="space-y-2">
              {sr.ingredients.map((ing) => (
                <div key={ing.name} className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      ing.have
                        ? ing.expiring
                          ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                    }`}
                  >
                    {ing.have ? "✓" : "✕"}
                  </span>
                  <span className={`text-sm flex-1 ${ing.have ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}`}>
                    {ing.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{ing.qty}</span>
                  {ing.expiring && (
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">use soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
              Instructions
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {sr.recipe.instructions}
            </p>
          </div>
        </div>
        <div className="px-5 pb-8 pt-3 border-t border-gray-100 dark:border-dark-border-light">
          {toast && (
            <div className="mb-3 px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-xl text-center animate-slide-in-right">
              Logged! Enjoy your meal.
            </div>
          )}
          <button
            onClick={handleLog}
            disabled={logging || toast}
            className="w-full py-4 rounded-2xl bg-[#D2691E] text-white font-semibold text-base disabled:opacity-60 active:scale-[0.98] transition-transform"
          >
            {logging ? "Logging…" : "I Made This!"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SuggestionsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { household, loading: householdLoading } = useHousehold();
  const { items: fridgeItems, loading: fridgeLoading } = useFridgeItems(household?.id);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pantryStaples, setPantryStaples] = useState<PantryStaple[]>([]);
  const [recentDishes, setRecentDishes] = useState<Set<string>>(new Set());
  const [dataLoading, setDataLoading] = useState(true);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<ScoredRecipe | null>(null);
  const [loggedDishes, setLoggedDishes] = useState<Set<string>>(new Set());

  // Auth redirects
  useEffect(() => {
    if (!userLoading && !user) router.replace("/login");
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!householdLoading && user && !household) router.replace("/onboarding");
  }, [household, householdLoading, user, router]);

  // Fetch recipes, pantry staples, recent meal_log
  useEffect(() => {
    if (!household) return;

    async function loadData() {
      setDataLoading(true);
      const [r, p, recent] = await Promise.all([
        fetchAllRecipes(),
        fetchPantryStaples(household!.id),
        fetchRecentMealDishes(household!.id),
      ]);
      setRecipes(r);
      setPantryStaples(p);
      setRecentDishes(recent);
      setDataLoading(false);
    }

    loadData();
  }, [household]);

  const scoredRecipes = useMemo(() => {
    if (!household || !recipes.length) return [];
    return scoreRecipes(
      recipes,
      fridgeItems,
      pantryStaples,
      recentDishes,
      household.diet_pref
    );
  }, [recipes, fridgeItems, pantryStaples, recentDishes, household]);

  const displayedRecipes = useMemo(() => {
    let filtered = scoredRecipes;
    if (timeFilter === "quick") filtered = filtered.filter((sr) => sr.recipe.cook_time_mins < 20);
    if (timeFilter === "elaborate") filtered = filtered.filter((sr) => sr.recipe.cook_time_mins > 30);
    return filtered.slice(0, 5);
  }, [scoredRecipes, timeFilter]);

  const loading = userLoading || householdLoading || fridgeLoading || dataLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg">
        <div className="bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border-light px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="flex gap-2 px-4 pt-4 pb-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="px-4 space-y-3 pt-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !household) return null;

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg pb-content-safe">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border-light px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="text-gray-500 dark:text-gray-400 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-dark-card"
        >
          ‹
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Aaj Kya Banaye? 🍽️</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ranked by what you have</p>
        </div>
      </div>

      {/* Time filter chips */}
      <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto no-scrollbar">
        {(
          [
            { key: "all", label: "All" },
            { key: "quick", label: "⚡ Quick (<20 min)" },
            { key: "elaborate", label: "🍲 Elaborate (>30 min)" },
          ] as { key: TimeFilter; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTimeFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              timeFilter === key
                ? "bg-[#D2691E] text-white"
                : "bg-white dark:bg-dark-surface text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-border"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Fridge context pill */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {fridgeItems.length > 0
            ? `${fridgeItems.length} item${fridgeItems.length > 1 ? "s" : ""} in fridge`
            : "No fridge items — results based on pantry staples"}{" "}
          ·{" "}
          {scoredRecipes.length} recipe{scoredRecipes.length !== 1 ? "s" : ""} matched
        </p>
      </div>

      {/* Recipe cards */}
      <div className="px-4 space-y-3">
        {displayedRecipes.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-8 text-center shadow-sm dark:shadow-none mx-0">
            <div className="text-4xl mb-3">
              {timeFilter !== "all" ? "⏱️" : "🥬"}
            </div>
            <p className="font-semibold text-[#3D2010] dark:text-gray-100">
              {timeFilter !== "all"
                ? "No recipes in this time range"
                : "Add some ingredients to get meal ideas"}
            </p>
            <p className="text-sm text-[#8B5E3C] dark:text-gray-400 mt-1 leading-relaxed">
              {timeFilter !== "all" ? (
                <button
                  onClick={() => setTimeFilter("all")}
                  className="text-[#D2691E] underline font-medium"
                >
                  Show all recipes
                </button>
              ) : (
                <>
                  Tap{" "}
                  <button
                    onClick={() => router.push("/add-items")}
                    className="text-[#D2691E] underline font-medium"
                  >
                    + Add Items
                  </button>{" "}
                  to stock your fridge
                </>
              )}
            </p>
          </div>
        ) : (
          displayedRecipes.map((sr, idx) => (
            <RecipeCard
              key={sr.recipe.id}
              sr={sr}
              rank={idx + 1}
              onClick={() => setSelectedRecipe(sr)}
            />
          ))
        )}
      </div>

      {loggedDishes.size > 0 && (
        <div className="px-4 mt-4">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium text-center">
            {Array.from(loggedDishes).join(", ")} logged
          </p>
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailSheet
          sr={selectedRecipe}
          householdId={household.id}
          onClose={() => setSelectedRecipe(null)}
          onLogged={(name) => {
            setLoggedDishes((prev) => new Set(Array.from(prev).concat(name)));
            setRecentDishes((prev) => new Set(Array.from(prev).concat(name.toLowerCase())));
          }}
        />
      )}

      {/* Bottom spacing for nav */}
      <div className="h-20" />

      <BottomNav active="fridge" />
    </div>
  );
}
