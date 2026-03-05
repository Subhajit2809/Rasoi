import { createClient } from "@/lib/supabase/client";
import type { MealPlan } from "@/types";

export async function fetchMealPlans(
  householdId: string,
  startDate: string,
  endDate: string
): Promise<MealPlan[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("household_id", householdId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date")
    .order("meal_type");
  return (data ?? []) as MealPlan[];
}

export async function insertMealPlan(row: {
  household_id: string;
  date: string;
  meal_type: string;
  recipe_id?: string | null;
  dish_name: string;
  created_by: string;
}) {
  const supabase = createClient();
  return supabase.from("meal_plans").insert(row).select().single();
}

export async function deleteMealPlan(id: string) {
  const supabase = createClient();
  return supabase.from("meal_plans").delete().eq("id", id);
}

/**
 * Fetch today's planned dish names for a household.
 * Used by suggestions page to deprioritize already-planned dishes.
 */
export async function fetchTodayPlannedDishes(
  householdId: string
): Promise<Set<string>> {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createClient();
  const { data } = await supabase
    .from("meal_plans")
    .select("dish_name")
    .eq("household_id", householdId)
    .eq("date", today);
  return new Set(
    (data ?? []).map((p: { dish_name: string }) => p.dish_name.toLowerCase())
  );
}
