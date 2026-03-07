// Database row types matching the Supabase schema

export interface Household {
  id: string;
  name: string;
  region: string;
  diet_pref: "veg" | "nonveg" | "eggetarian" | "vegan" | "jain";
  household_size: number;
  spice_level: "mild" | "medium" | "spicy";
  complexity: "quick" | "medium" | "elaborate" | "any";
  created_at: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: "admin" | "member";
}

export interface PantryStaple {
  id: string;
  household_id: string;
  item_name: string;
  category: string;
}

export interface FridgeItem {
  id: string;
  household_id: string;
  item_name: string;
  category: string;
  qty: number;
  unit: string;
  added_at: string;
  estimated_expiry: string | null;
  added_by: string;
}

export interface CookedItem {
  id: string;
  household_id: string;
  dish_name: string;
  cooked_at: string;
  freshness_days: number;
  status: "fresh" | "stale" | "finished";
  finished_at: string | null;
}

export interface Recipe {
  id: string;
  name: string;
  region: string;
  category: string;
  cook_time_mins: number;
  ingredients: { name: string; qty: string }[];
  instructions: string;
  diet_type: "veg" | "nonveg" | "eggetarian";
  household_id?: string | null;
  created_by?: string | null;
}

export interface GroceryItem {
  id: string;
  household_id: string;
  item_name: string;
  category: string;
  is_purchased: boolean;
  source: "auto" | "manual";
  created_at: string;
}

export interface MealLog {
  id: string;
  household_id: string;
  dish_name: string;
  date: string;
}

export interface MealPlan {
  id: string;
  household_id: string;
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  recipe_id: string | null;
  dish_name: string;
  created_by: string | null;
  created_at: string;
}
