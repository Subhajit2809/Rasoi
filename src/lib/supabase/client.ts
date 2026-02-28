import { createBrowserClient } from "@supabase/ssr";
import { createClient as supabaseCreateClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Browser (client-component) Supabase client.
 * createBrowserClient is a singleton per URL+key pair — safe to call
 * from multiple hooks/components without creating duplicate instances.
 * Use for auth operations (getSession, signIn, signOut, onAuthStateChange).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Creates a one-off Supabase client with the JWT pinned in the
 * Authorization header. Use this for all DB operations (select/insert/update/
 * delete) in client components after a server-side OAuth callback.
 *
 * Background: @supabase/ssr's createBrowserClient stores the session in
 * cookies after the server callback but does not always hydrate the
 * PostgREST client's in-memory auth state, causing DB requests to be sent
 * as `anon`. Pinning the token here guarantees the correct JWT is sent.
 */
export function createClientWithToken(accessToken: string) {
  return supabaseCreateClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }
  );
}
