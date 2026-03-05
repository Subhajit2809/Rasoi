import { createClient } from "@/lib/supabase/client";
import type { Recipe, PantryStaple } from "@/types";

/**
 * Fetch all recipes: global (seeded) + custom (household-scoped).
 * If householdId is provided, includes that household's custom recipes.
 */
export async function fetchAllRecipes(householdId?: string): Promise<Recipe[]> {
  const supabase = createClient();
  let query = supabase.from("recipes").select("*").order("name");

  if (householdId) {
    query = query.or(`household_id.is.null,household_id.eq.${householdId}`);
  } else {
    query = query.is("household_id", null);
  }

  const { data } = await query;
  return (data ?? []) as Recipe[];
}

export async function insertRecipe(row: {
  name: string;
  region: string;
  category: string;
  cook_time_mins: number;
  ingredients: { name: string; qty: string }[];
  instructions: string;
  diet_type: "veg" | "nonveg" | "eggetarian";
  household_id: string;
  created_by: string;
}) {
  const supabase = createClient();
  return supabase.from("recipes").insert(row).select().single();
}

export async function updateRecipe(
  id: string,
  updates: Partial<{
    name: string;
    region: string;
    category: string;
    cook_time_mins: number;
    ingredients: { name: string; qty: string }[];
    instructions: string;
    diet_type: "veg" | "nonveg" | "eggetarian";
  }>
) {
  const supabase = createClient();
  return supabase.from("recipes").update(updates).eq("id", id);
}

export async function deleteRecipe(id: string) {
  const supabase = createClient();
  return supabase.from("recipes").delete().eq("id", id);
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
