"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";
import { login } from "@/lib/api/clientApi";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      router.push("/profile");
    } catch {
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}