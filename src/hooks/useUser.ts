"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface UseUserResult {
  user: User | null;
  loading: boolean;
}

/**
 * Returns the current authenticated user and a loading flag.
 *
 * - Reads the session from local storage on mount (instant, no network).
 * - Subscribes to onAuthStateChange so sign-in / sign-out events update
 *   the returned value automatically.
 * - The middleware already protects routes server-side, so `user` being
 *   null here is only a transient loading state on protected pages.
 */
export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Populate immediately from the cached session so there is no flash.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Keep in sync with sign-in / sign-out / token refresh events.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
