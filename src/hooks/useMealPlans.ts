"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MealPlan } from "@/types";

interface UseMealPlansResult {
  plans: MealPlan[];
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Fetches meal plans for the given date range and subscribes to
 * realtime changes so both partners see updates instantly.
 */
export function useMealPlans(
  householdId: string | null | undefined,
  startDate: string,
  endDate: string
): UseMealPlansResult {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("meal_plans")
      .select("*")
      .eq("household_id", householdId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date")
      .order("meal_type");

    setPlans((data ?? []) as MealPlan[]);
    setLoading(false);
  }, [householdId, startDate, endDate]);

  useEffect(() => {
    if (!householdId) {
      setPlans([]);
      return;
    }

    fetchPlans();

    const supabase = createClient();
    const channel = supabase
      .channel(`meal-plans:${householdId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "meal_plans",
          filter: `household_id=eq.${householdId}`,
        },
        fetchPlans
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId, fetchPlans]);

  return { plans, loading, refetch: fetchPlans };
}
