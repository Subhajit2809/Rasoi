"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useHousehold } from "@/hooks/useHousehold";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useFridgeItems } from "@/hooks/useFridgeItems";
import { BottomNav } from "@/components/BottomNav";
import { MealSlot } from "@/components/MealSlot";
import { RecipePicker } from "@/components/RecipePicker";
import { Skeleton } from "@/components/Skeleton";
import { UndoToast } from "@/components/UndoToast";
import { insertMealPlan, deleteMealPlan } from "@/lib/services/mealPlan";
import { fetchAllRecipes, fetchPantryStaples } from "@/lib/services/recipes";
import { insertGroceryItems, fetchGroceryItems } from "@/lib/services/grocery";
import { nameMatches } from "@/lib/matching";
import type { Recipe, MealPlan } from "@/types";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date): string {
  const today = new Date();
  const todayStr = formatDate(today);
  const dateStr = formatDate(date);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  if (dateStr === todayStr) return "Today";
  if (dateStr === formatDate(tomorrow)) return "Tomorrow";
  if (dateStr === formatDate(yesterdayDate)) return "Yesterday";
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function MealPlanPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { household, loading: hhLoading } = useHousehold();

  // Current date navigation
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Date range for the week (for fetching plans)
  const { startDate, endDate } = useMemo(() => {
    const d = new Date(selectedDate);
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day); // Sunday
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Saturday
    return { startDate: formatDate(start), endDate: formatDate(end) };
  }, [selectedDate]);

  const { plans, loading: plansLoading } = useMealPlans(household?.id, startDate, endDate);
  const { items: fridgeItems } = useFridgeItems(household?.id);

  // Recipes for picker
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesLoaded, setRecipesLoaded] = useState(false);

  // Picker state
  const [pickerMealType, setPickerMealType] = useState<string | null>(null);

  // Undo state
  const [undoItem, setUndoItem] = useState<{ plan: MealPlan } | null>(null);

  // Grocery sync state
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  // Logged dishes for today (from meal_log via cooked_items)
  const [loggedDishes, setLoggedDishes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userLoading && !user) router.replace("/login");
  }, [user, userLoading, router]);

  // Load recipes
  useEffect(() => {
    if (!household) return;
    fetchAllRecipes(household.id).then((r) => {
      setRecipes(r);
      setRecipesLoaded(true);
    });
  }, [household]);

  // Load logged dishes for selected date
  useEffect(() => {
    if (!household) return;
    const supabase = (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const sb = createClient();
      const dateStr = formatDate(selectedDate);
      const { data } = await sb
        .from("meal_log")
        .select("dish_name")
        .eq("household_id", household.id)
        .eq("date", dateStr);
      setLoggedDishes(
        new Set((data ?? []).map((d: { dish_name: string }) => d.dish_name.toLowerCase()))
      );
    })();
  }, [household, selectedDate]);

  // Plans for selected date
  const dateStr = formatDate(selectedDate);
  const dayPlans = useMemo(
    () => plans.filter((p) => p.date === dateStr),
    [plans, dateStr]
  );

  function prevDay() {
    setSelectedDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 1);
      return n;
    });
  }

  function nextDay() {
    setSelectedDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 1);
      return n;
    });
  }

  function goToday() {
    setSelectedDate(new Date());
  }

  function openPicker(mealType: string) {
    setPickerMealType(mealType);
  }

  async function handlePickerSelect(recipe: Recipe | null, customName: string | null) {
    if (!household || !user || !pickerMealType) return;
    const dishName = recipe?.name ?? customName ?? "";
    if (!dishName) return;

    setPickerMealType(null);

    await insertMealPlan({
      household_id: household.id,
      date: dateStr,
      meal_type: pickerMealType,
      recipe_id: recipe?.id ?? null,
      dish_name: dishName,
      created_by: user.id,
    });
  }

  async function handleRemove(planId: string) {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    setUndoItem({ plan });
    await deleteMealPlan(planId);
  }

  async function handleUndoExpire() {
    setUndoItem(null);
  }

  const handleUndo = useCallback(async () => {
    if (!undoItem) return;
    const { plan } = undoItem;
    await insertMealPlan({
      household_id: plan.household_id,
      date: plan.date,
      meal_type: plan.meal_type,
      recipe_id: plan.recipe_id,
      dish_name: plan.dish_name,
      created_by: plan.created_by ?? user?.id ?? "",
    });
    setUndoItem(null);
  }, [undoItem, user]);

  // Sync planned recipes to grocery
  async function handleSyncGrocery() {
    if (!household) return;
    setSyncing(true);
    setSyncMsg("");

    // Get plans for the coming week
    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 6);

    const weekPlans = plans.filter((p) => {
      return p.date >= formatDate(today) && p.date <= formatDate(weekEnd) && p.recipe_id;
    });

    if (weekPlans.length === 0) {
      setSyncMsg("No recipes planned this week.");
      setSyncing(false);
      return;
    }

    // Get recipe details for planned items
    const plannedRecipeIds = new Set(weekPlans.map((p) => p.recipe_id).filter(Boolean));
    const plannedRecipes = recipes.filter((r) => plannedRecipeIds.has(r.id));

    // Get pantry staples and existing grocery items
    const [pantry, existingGrocery] = await Promise.all([
      fetchPantryStaples(household.id),
      fetchGroceryItems(household.id),
    ]);

    const existingNames = new Set(
      existingGrocery.map((g) => g.item_name.toLowerCase())
    );

    // Find missing ingredients
    const missing: { item_name: string; category: string }[] = [];

    for (const recipe of plannedRecipes) {
      for (const ing of recipe.ingredients) {
        const ingName = ing.name.toLowerCase();
        // Skip if already in grocery
        if (existingNames.has(ingName)) continue;
        // Skip if in fridge
        if (fridgeItems.some((fi) => nameMatches(ing.name, fi.item_name))) continue;
        // Skip if in pantry
        if (pantry.some((ps) => nameMatches(ing.name, ps.item_name))) continue;
        // Skip duplicates
        if (missing.some((m) => m.item_name.toLowerCase() === ingName)) continue;

        missing.push({ item_name: ing.name, category: "Pantry" });
        existingNames.add(ingName);
      }
    }

    if (missing.length === 0) {
      setSyncMsg("You have everything you need!");
    } else {
      await insertGroceryItems(
        missing.map((m) => ({
          household_id: household.id,
          item_name: m.item_name,
          category: m.category,
          source: "auto" as const,
          is_purchased: false,
        }))
      );
      setSyncMsg(`Added ${missing.length} item${missing.length > 1 ? "s" : ""} to grocery list.`);
    }
    setSyncing(false);
  }

  const loading = userLoading || hhLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg pb-20">
        <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />
        <div className="px-5 py-4 bg-white dark:bg-dark-surface border-b border-[#E8C9A0] dark:border-dark-border">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="px-5 py-6 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <BottomNav active="plan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-dark-bg pb-24">
      <div className="h-1 bg-gradient-to-r from-[#D2691E] via-[#FF8C42] to-[#FFB347]" />

      {/* Header with date navigation */}
      <div className="bg-white dark:bg-dark-surface border-b border-[#E8C9A0] dark:border-dark-border px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-[#3D2010] dark:text-gray-100">
            Meal Plan 📅
          </h1>
          {formatDate(selectedDate) !== formatDate(new Date()) && (
            <button
              type="button"
              onClick={goToday}
              className="text-xs text-[#D2691E] font-medium"
            >
              Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={prevDay}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B5E3C] dark:text-gray-400 hover:bg-[#FFF0E0] dark:hover:bg-dark-card transition-colors"
          >
            ‹
          </button>
          <div className="flex-1 text-center">
            <p className="text-lg font-semibold text-[#3D2010] dark:text-gray-100">
              {formatDayLabel(selectedDate)}
            </p>
            <p className="text-xs text-[#8B5E3C] dark:text-gray-400">
              {selectedDate.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={nextDay}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B5E3C] dark:text-gray-400 hover:bg-[#FFF0E0] dark:hover:bg-dark-card transition-colors"
          >
            ›
          </button>
        </div>

        {/* Week dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const dayStr = formatDate(d);
            const isSelected = dayStr === dateStr;
            const hasPlans = plans.some((p) => p.date === dayStr);
            return (
              <button
                key={dayStr}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-[#D2691E] text-white"
                    : hasPlans
                    ? "bg-[#FFE8CC] dark:bg-[#4A3020] text-[#D2691E]"
                    : "text-[#8B5E3C] dark:text-gray-400 hover:bg-[#FFF0E0] dark:hover:bg-dark-card"
                }`}
              >
                {d.toLocaleDateString("en-IN", { weekday: "narrow" })}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal slots */}
      <div className="px-5 py-5 space-y-3">
        {plansLoading ? (
          [0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))
        ) : (
          MEAL_TYPES.map((mealType) => {
            const slotPlans = dayPlans.filter((p) => p.meal_type === mealType);
            const anyLogged = slotPlans.some((p) =>
              loggedDishes.has(p.dish_name.toLowerCase())
            );
            return (
              <MealSlot
                key={mealType}
                mealType={mealType}
                plans={slotPlans}
                logged={anyLogged}
                onAdd={() => openPicker(mealType)}
                onRemove={handleRemove}
              />
            );
          })
        )}
      </div>

      {/* Sync to Grocery button */}
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={handleSyncGrocery}
          disabled={syncing}
          className="w-full py-3 rounded-2xl border-2 border-[#D2691E] text-[#D2691E] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#D2691E] hover:text-white transition-colors disabled:opacity-50"
        >
          {syncing ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Syncing…
            </>
          ) : (
            "🛒 Sync to Grocery List"
          )}
        </button>
        {syncMsg && (
          <p className="text-xs text-center text-[#8B5E3C] dark:text-gray-400 mt-2">
            {syncMsg}
          </p>
        )}
      </div>

      {/* Recipe Picker */}
      {pickerMealType && recipesLoaded && (
        <RecipePicker
          recipes={recipes}
          householdDiet={household?.diet_pref ?? "nonveg"}
          onSelect={handlePickerSelect}
          onClose={() => setPickerMealType(null)}
        />
      )}

      {/* Undo Toast */}
      <UndoToast
        visible={!!undoItem}
        message={undoItem ? `Removed "${undoItem.plan.dish_name}"` : ""}
        onUndo={handleUndo}
        onExpire={handleUndoExpire}
      />

      <BottomNav active="plan" />
    </div>
  );
}
