import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "404 — Page not found | NoteHub",
  description: "This page does not exist in NoteHub.",
  openGraph: {
    title: "404 — Page not found | NoteHub",
    description: "This page does not exist in NoteHub.",
    url: `${APP_URL}/not-found`,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>404</h1>
      <p>This page does not exist.</p>
      <Link href="/">Go Home</Link>
    </main>
  );
}