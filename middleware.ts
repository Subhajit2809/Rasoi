import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

/**
 * Paths that never require authentication.
 * The auth callback must be public so Supabase can complete the
 * OAuth code exchange before a session exists.
 */
function isPublicPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/welcome" ||
    pathname.startsWith("/auth/")
  );
}

export async function middleware(request: NextRequest) {
  // Start with a plain pass-through response; the setAll callback
  // below replaces it so that refreshed session cookies are forwarded.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Step 1: mirror the cookies onto the *request* so downstream
          //         server components see the refreshed values.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Step 2: rebuild the response and copy the cookies onto it so
          //         the browser receives the refreshed tokens.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT add any logic between createServerClient and
  // getUser(). A pending session refresh runs inside getUser() and
  // the setAll callback above must be able to write the new cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Unauthenticated user hitting a protected route → /welcome (root) or /login
  if (!user && !isPublicPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === "/" ? "/welcome" : "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // Authenticated user hitting /login → / (middleware doesn't know
  // about household yet; the login page itself handles that redirect
  // only when coming from a fresh OAuth callback)
  if (user && pathname === "/login") {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match every path EXCEPT:
     *   - _next/static  (Next.js static assets)
     *   - _next/image   (Next.js image optimisation)
     *   - favicon.ico
     *   - public folder assets (icons/, manifest.json, PWA service worker)
     *   - common image extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw\\.js|workbox-.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
