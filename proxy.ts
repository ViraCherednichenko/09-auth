import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;

if (!API_URL) {
  throw new Error("Missing API url. Set NEXT_PUBLIC_API_URL (or API_URL).");
}

const privateRoutes = ["/notes", "/profile", "/settings"];
const authRoutes = ["/sign-in", "/sign-up"];

function isRouteMatch(pathname: string, routes: string[]) {
  return routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

function isPrivate(pathname: string) {
  return isRouteMatch(pathname, privateRoutes);
}

function isAuth(pathname: string) {
  return isRouteMatch(pathname, authRoutes);
}

function getSetCookies(res: Response): string[] {
  const anyHeaders = res.headers as unknown as { getSetCookie?: () => string[] };

  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie();
  }

  const sc = res.headers.get("set-cookie");
  return sc ? [sc] : [];
}

async function tryRefreshSession(req: NextRequest): Promise<Response> {
  const cookieHeader = req.headers.get("cookie") ?? "";

  return fetch(`${API_URL}/auth/session`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
      accept: "application/json",
    },
    cache: "no-store",
  });
}

// ✅ Next expects default export OR `export function proxy` in proxy.ts
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // пропускаємо статику/службове
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const userHasAccess = Boolean(accessToken);
  const userHasRefresh = Boolean(refreshToken);

  // 1) auth routes: якщо вже залогінений — на /
  if (userHasAccess && isAuth(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 2) private routes: пускаємо або рефрешимо, або редірект на sign-in
  if (isPrivate(pathname)) {
    if (userHasAccess) {
      return NextResponse.next();
    }

    if (userHasRefresh) {
      const refreshRes = await tryRefreshSession(req);

      if (refreshRes.ok) {
        const res = NextResponse.next();
        const setCookies = getSetCookies(refreshRes);
        setCookies.forEach((c) => res.headers.append("set-cookie", c));
        return res;
      }
    }

    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // 3) auth routes для неавтентифікованих — пускаємо
  if (isAuth(pathname)) {
    return NextResponse.next();
  }

  // 4) все інше — як є
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
