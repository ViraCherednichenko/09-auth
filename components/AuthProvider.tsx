"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore(
    (s) => s.clearIsAuthenticated
  );

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/session");

        if (!res.ok) {
          clearIsAuthenticated();
          return;
        }

        const user = await res.json();
        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    };

    loadSession();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}