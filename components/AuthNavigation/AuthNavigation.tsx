"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/authStore";
import { logout } from "@/lib/api/clientApi";
export default function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <li>
          <Link href="/sign-in">Sign in</Link>
        </li>
        <li>
          <Link href="/sign-up">Sign up</Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <span>{user?.email ?? user?.username ?? "User"}</span>
      </li>
      <li>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  );
}