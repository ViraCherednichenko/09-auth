"use client";

import { useEffect, type ReactNode } from "react";

import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const init = async () => {
      try {
        const sessionUser = await checkSession(); // User | null

        if (!sessionUser) {
          clearAuth();
          return;
        }

        // Якщо getMe повертає актуальніший профіль — оновлюємо
        const me = await getMe();
        setUser(me);
      } catch {
        clearAuth();
      }
    };

    void init();
  }, [setUser, clearAuth]);

  return <>{children}</>;
}