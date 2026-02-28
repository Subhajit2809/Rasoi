"use client";

import { useCallback, useEffect, useState } from "react";
import type { Household } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";

interface UseHouseholdResult {
  household: Household | null;
  /** True while the initial fetch is in flight. */
  loading: boolean;
  /** Call after onboarding creates a household to refresh the value. */
  refetch: () => void;
}

/**
 * Returns the household the current user belongs to.
 *
 * Lookup strategy:
 *   1. household_members  →  find a row matching auth.uid()
 *   2. households         →  fetch the full household row by id
 *
 * Returns null (not loading) when the user has no household yet —
 * the /onboarding screen uses this to know setup is needed.
 */
export function useHousehold(): UseHouseholdResult {
  const { user, loading: userLoading } = useUser();
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHousehold = useCallback(async () => {
    if (!user) {
      setHousehold(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Step 1: find the user's household_id via household_members.
    const { data: membership, error: memberError } = await supabase
      .from("household_members")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (memberError || !membership?.household_id) {
      setHousehold(null);
      setLoading(false);
      return;
    }

    // Step 2: fetch the household details.
    const { data: householdData, error: householdError } = await supabase
      .from("households")
      .select("*")
      .eq("id", membership.household_id)
      .single();

    if (householdError || !householdData) {
      setHousehold(null);
    } else {
      setHousehold(householdData as Household);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (userLoading) return;
    fetchHousehold();
  }, [userLoading, fetchHousehold]);

  return { household, loading, refetch: fetchHousehold };
}
