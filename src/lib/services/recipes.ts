import { createClient } from "@/lib/supabase/client";
import type { Recipe, PantryStaple } from "@/types";

export async function fetchAllRecipes(): Promise<Recipe[]> {
  const supabase = createClient();
  const { data } = await supabase.from("recipes").select("*").order("name");
  return (data ?? []) as Recipe[];
}

export async function fetchPantryStaples(householdId: string): Promise<PantryStaple[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("pantry_staples")
    .select("*")
    .eq("household_id", householdId);
  return data ?? [];
}

export async function fetchRecentMealDishes(
  householdId: string,
  daysBack = 3
): Promise<Set<string>> {
  const supabase = createClient();
  const since = new Date(Date.now() - daysBack * 86_400_000).toISOString().slice(0, 10);
  const { data } = await supabase
    .from("meal_log")
    .select("dish_name")
    .eq("household_id", householdId)
    .gte("date", since);
  return new Set(
    (data ?? []).map((m: { dish_name: string }) => m.dish_name.toLowerCase())
  );
}

export async function insertMealLog(row: {
  household_id: string;
  dish_name: string;
  date: string;
}) {
  const supabase = createClient();
  return supabase.from("meal_log").insert(row);
}
