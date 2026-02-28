"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface MemberProfile {
  id: string;          // household_members.id
  user_id: string;
  role: "admin" | "member";
  display_name: string | null;
  avatar_url: string | null;
}

interface UseHouseholdMembersResult {
  members: MemberProfile[];
  loading: boolean;
}

/**
 * Fetches members of a household together with their profiles.
 * Two-step: household_members → profiles (separate query because
 * household_members.user_id → auth.users, not directly to profiles).
 */
export function useHouseholdMembers(
  householdId: string | null | undefined
): UseHouseholdMembersResult {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!householdId) {
      setMembers([]);
      return;
    }

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      const supabase = createClient();

      // Step 1: get all members of this household
      const { data: memberRows, error: membErr } = await supabase
        .from("household_members")
        .select("id, user_id, role")
        .eq("household_id", householdId!);

      if (membErr || !memberRows || cancelled) {
        setLoading(false);
        return;
      }

      const userIds = memberRows.map((m) => m.user_id);

      // Step 2: get profiles for those user_ids
      const { data: profileRows } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      if (cancelled) return;

      const profileMap = new Map(
        (profileRows ?? []).map((p) => [p.id, p])
      );

      setMembers(
        memberRows.map((m) => {
          const p = profileMap.get(m.user_id);
          return {
            id:           m.id,
            user_id:      m.user_id,
            role:         m.role as "admin" | "member",
            display_name: p?.display_name ?? null,
            avatar_url:   p?.avatar_url   ?? null,
          };
        })
      );
      setLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, [householdId]);

  return { members, loading };
}
