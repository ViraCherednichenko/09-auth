"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function ProfileEditPage() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const value = username.trim();
    if (!value) {
      setError("Username is required");
      return;
    }

    try {
      setIsLoading(true);

      // ✅ оновлення профілю через clientApi
      const updatedUser = await updateMe({ username: value });

      // ✅ збереження в глобальному auth store
      setUser(updatedUser);

      router.push("/profile");
    } catch (err: unknown) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Edit profile</h1>

      {/* навігація назад */}
      <Link href="/profile">← Back to profile</Link>

      {/* аватар */}
      <div style={{ marginTop: 16 }}>
        <Image
          src={user?.avatar || "/avatar.png"}
          alt="User avatar"
          width={120}
          height={120}
        />
      </div>

      {/* форма */}
      <form onSubmit={handleSubmit} style={{ marginTop: 24, maxWidth: 400 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={user?.email ?? ""}
            readOnly
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>

          <button type="button" onClick={() => router.back()}>
            Cancel
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </main>
  );
}