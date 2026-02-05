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

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && refreshToken) {
    try {
      const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

      const response = await checkSession(cookieHeader);

      const setCookie = response.headers["set-cookie"];

      if (setCookie) {
        const res = NextResponse.next();

        for (const cookie of setCookie) {
          res.headers.append("set-cookie", cookie);
        }

        return res;
      }
    } catch {
    }
  }

  const isAuthenticated = Boolean(accessToken);

  if (!isAuthenticated && isPrivateRoute(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuthenticated && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
