import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Browser (client-component) Supabase client.
 * createBrowserClient is a singleton per URL+key pair — safe to call
 * from multiple hooks/components without creating duplicate instances.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
