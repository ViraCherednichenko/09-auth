"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getSession } from "@/lib/api/api";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        await getSession();
      } catch (error) {
        router.push("/sign-in");
      }
    }

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
