"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GroceryItem } from "@/types";

interface UseGroceryListResult {
  items: GroceryItem[];
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Fetches all grocery list items for the household and subscribes to
 * realtime changes so both partners see updates instantly.
 */
export function useGroceryList(
  householdId: string | null | undefined
): UseGroceryListResult {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("grocery_list")
      .select("*")
      .eq("household_id", householdId)
      .order("created_at", { ascending: false });

    setItems((data ?? []) as GroceryItem[]);
    setLoading(false);
  }, [householdId]);

  useEffect(() => {
    if (!householdId) {
      setItems([]);
      return;
    }

    fetchItems();

    const supabase = createClient();
    const channel = supabase
      .channel(`grocery-list:${householdId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "grocery_list",
          filter: `household_id=eq.${householdId}`,
        },
        fetchItems
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId, fetchItems]);

  return { items, loading, refetch: fetchItems };
}
