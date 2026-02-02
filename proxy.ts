import "server-only";
import { cookies, headers } from "next/headers";

const API_ORIGIN = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!API_ORIGIN) {
  throw new Error("Missing API_URL (or NEXT_PUBLIC_API_URL as fallback)");
}

type ProxyOptions = Omit<RequestInit, "headers" | "body"> & {
  headers?: Record<string, string>;
  body?: unknown;
};

/**
 * Server-side proxy to backend API.
 * - Forwards cookies to keep session/auth working.
 * - Supports JSON body.
 * - Disables caching by default.
 */
export async function proxy<T>(path: string, options: ProxyOptions = {}): Promise<T> {
  const url = `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    // інколи корисно прокинути user-agent / referer
    "User-Agent": headers().get("user-agent") ?? "next",
    ...(options.headers ?? {}),
  };

  const res = await fetch(url, {
    ...options,
    headers: reqHeaders,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Proxy failed: ${res.status} ${res.statusText}${text ? ` | ${text}` : ""}`);
  }

  // якщо endpoint повертає empty body (204)
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}