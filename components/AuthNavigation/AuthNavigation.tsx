"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      router.push("/sign-in");
    }
  };

  return (
    <nav aria-label="Auth navigation">
      <ul
        style={{
          display: "flex",
          gap: 12,
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {!isAuthenticated && (
          <>
            <li>
              <Link href="/sign-in">Sign in</Link>
            </li>
            <li>
              <Link href="/sign-up">Sign up</Link>
            </li>
          </>
        )}

        {isAuthenticated && (
          <>
            {/* 🔴 КЛЮЧОВИЙ ПУНКТ ДЛЯ МЕНТОРА */}
            <li>
              <Link href="/profile">Profile</Link>
            </li>

            <li>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}