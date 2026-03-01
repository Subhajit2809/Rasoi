import { createClient } from "@/lib/supabase/client";

export async function generateInviteCode(householdId: string) {
  const supabase = createClient();
  return supabase.rpc("generate_household_invite", {
    p_household_id: householdId,
  });
}
