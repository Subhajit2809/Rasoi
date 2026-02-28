"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FridgeItem } from "@/types";

interface UseFridgeItemsResult {
  items: FridgeItem[];
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Fetches all fridge items for the household and subscribes to
 * realtime changes so both partners see updates instantly.
 */
export function useFridgeItems(
  householdId: string | null | undefined
): UseFridgeItemsResult {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("fridge_items")
      .select("*")
      .eq("household_id", householdId)
      .order("added_at", { ascending: false });

    setItems((data ?? []) as FridgeItem[]);
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
      .channel(`fridge-items:${householdId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fridge_items",
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
