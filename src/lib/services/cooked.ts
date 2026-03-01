import { createClient } from "@/lib/supabase/client";
import type { CookedItem } from "@/types";

export async function insertCookedItem(row: {
  household_id: string;
  dish_name: string;
  freshness_days: number;
  status: "fresh" | "stale" | "finished";
  cooked_at?: string;
}) {
  const supabase = createClient();
  return supabase.from("cooked_items").insert(row);
}

export async function markCookedItemDone(id: string) {
  const supabase = createClient();
  return supabase
    .from("cooked_items")
    .update({ status: "finished", finished_at: new Date().toISOString() })
    .eq("id", id);
}

/** Undo a "mark done" — restore to fresh status. */
export async function restoreCookedItem(id: string) {
  const supabase = createClient();
  return supabase
    .from("cooked_items")
    .update({ status: "fresh", finished_at: null })
    .eq("id", id);
}

export async function fetchActiveCookedItems(householdId: string): Promise<CookedItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("cooked_items")
    .select("*")
    .eq("household_id", householdId)
    .neq("status", "finished")
    .order("cooked_at", { ascending: false });
  return (data ?? []) as CookedItem[];
}
