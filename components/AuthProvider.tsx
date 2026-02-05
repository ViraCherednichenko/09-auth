"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore(
    (s) => s.clearAuth
  );

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/session");

        if (!res.ok) {
          clearAuth();
          return;
        }

        const user = await res.json();
        setUser(user);
      } catch {
        clearAuth();
      }
    };

    loadSession();
  }, [setUser, clearAuth]);

  return <>{children}</>;
}