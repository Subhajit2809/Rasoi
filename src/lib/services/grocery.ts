import { createClient } from "@/lib/supabase/client";
import type { GroceryItem } from "@/types";

export async function insertGroceryItems(
  rows: {
    household_id: string;
    item_name: string;
    category: string;
    source: "auto" | "manual";
    is_purchased: boolean;
  }[]
) {
  const supabase = createClient();
  return supabase.from("grocery_list").insert(rows);
}

export async function updateGroceryPurchased(id: string, is_purchased: boolean) {
  const supabase = createClient();
  return supabase.from("grocery_list").update({ is_purchased }).eq("id", id);
}

export async function deleteGroceryItem(id: string) {
  const supabase = createClient();
  return supabase.from("grocery_list").delete().eq("id", id);
}

export async function fetchGroceryItems(householdId: string): Promise<GroceryItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("grocery_list")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });
  return (data ?? []) as GroceryItem[];
}
