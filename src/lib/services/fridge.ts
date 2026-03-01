import { createClient } from "@/lib/supabase/client";
import type { FridgeItem } from "@/types";

export async function insertFridgeItems(
  rows: {
    household_id: string;
    item_name: string;
    category: string;
    qty: number;
    unit: string;
    added_by: string;
    estimated_expiry: string | null;
  }[]
) {
  const supabase = createClient();
  return supabase.from("fridge_items").insert(rows);
}

export async function deleteFridgeItems(ids: string[]) {
  if (ids.length === 0) return;
  const supabase = createClient();
  return supabase.from("fridge_items").delete().in("id", ids);
}

export async function fetchFridgeItems(householdId: string): Promise<FridgeItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("fridge_items")
    .select("*")
    .eq("household_id", householdId)
    .order("added_at", { ascending: false });
  return (data ?? []) as FridgeItem[];
}
