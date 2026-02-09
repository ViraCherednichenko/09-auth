import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { checkSession } from "@/lib/api/serverApi";

const AUTH_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isPrivateRoute(pathname: string) {
  return PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function buildCookieHeader(store: Awaited<ReturnType<typeof cookies>>) {
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && refreshToken) {
    try {
      const cookieHeader = buildCookieHeader(cookieStore);
      const response = await checkSession(cookieHeader);

      const setCookie = response.headers["set-cookie"];

      if (setCookie) {
        // ✅ ПІСЛЯ REFRESH:
        // - якщо це auth-роут → /
        // - інакше → той самий URL (повторний запит вже з новими cookie)
        const redirectTo = isAuthRoute(pathname) ? new URL("/", req.url) : req.nextUrl;

        const res = NextResponse.redirect(redirectTo);

        for (const cookie of setCookie) {
          res.headers.append("set-cookie", cookie);
        }

        return res;
      }
    } catch {
      // нічого — нижче спрацює звичайна логіка
    }
  }

  const isAuthenticated = Boolean(accessToken);

  if (!isAuthenticated && isPrivateRoute(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ✅ автентифікований користувач не має бачити sign-in / sign-up
  if (isAuthenticated && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};