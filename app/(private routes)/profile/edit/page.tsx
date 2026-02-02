import Link from "next/link";

export default function ProfileEditPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Edit profile</h1>
      <p>Profile edit page</p>
      <Link href="/profile">Back to profile</Link>
    </main>
  );
}