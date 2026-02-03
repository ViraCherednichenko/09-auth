"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";


import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";
type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        const session = await checkSession();

        if (!session) {
          if (!cancelled) {
            clearIsAuthenticated();
          }
          return;
        }

        const user = await getMe();

        if (!cancelled) {
          setUser(user);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          clearIsAuthenticated();
        }
      }
    };

    initAuth();

    return () => {
      cancelled = true;
    };
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}