"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CookedItem } from "@/types";

interface UseCookedItemsResult {
  items: CookedItem[];
  loading: boolean;
  markDone: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Fetches all non-finished cooked items for the household and
 * subscribes to realtime changes so both partners see updates instantly.
 *
 * Requires cooked_items to be in the supabase_realtime publication
 * (see migration 20260228000002_enable_realtime.sql).
 */
export function useCookedItems(
  householdId: string | null | undefined
): UseCookedItemsResult {
  const [items, setItems] = useState<CookedItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("cooked_items")
      .select("*")
      .eq("household_id", householdId)
      .neq("status", "finished")
      .order("cooked_at", { ascending: false });

    setItems((data ?? []) as CookedItem[]);
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
      .channel(`cooked-items:${householdId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cooked_items",
          filter: `household_id=eq.${householdId}`,
        },
        // Refetch on any change — simpler and more reliable than
        // constructing the new state from partial payloads.
        fetchItems
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId, fetchItems]);

  const markDone = useCallback(
    async (id: string) => {
      // Optimistic update — remove immediately from local state.
      setItems((prev) => prev.filter((item) => item.id !== id));

      const supabase = createClient();
      const { error } = await supabase
        .from("cooked_items")
        .update({ status: "finished", finished_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        // Rollback optimistic update on failure
        fetchItems();
      }
      // On success, the realtime subscription will echo the UPDATE
      // and trigger a refetch — which is fine (idempotent).
    },
    [fetchItems]
  );

  return { items, loading, markDone, refetch: fetchItems };
}
