import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Server-side Supabase client for use in Server Components,
 * Route Handlers, and Server Actions.
 *
 * Reads and writes auth cookies via next/headers so the session is
 * automatically forwarded to the browser on each response.
 */
export async function createClient() {
  // In Next.js 14 cookies() is synchronous; the async wrapper here
  // keeps the signature forward-compatible with Next.js 15.
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies cannot be mutated.
            // The middleware handles session refresh for Server Components.
          }
        },
      },
    }
  );
}
