"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import css from "./SignUpPage.module.css";
import { register } from "@/lib/api/clientApi";

export default function SignUpPage() {
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
      await register({ email, password });
      router.push("/profile");
    } catch (err) {
      setError("Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} onSubmit={handleSubmit}>
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
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>

        {error ? <p className={css.error}>{error}</p> : null}
      </form>
    </main>
  );
}