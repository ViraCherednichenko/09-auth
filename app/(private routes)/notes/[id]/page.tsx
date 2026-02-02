import type { Metadata } from "next";
import { cookies } from "next/headers";

import { fetchNoteById } from "@/lib/api/serverApi";
import type { Note } from "@/types/note";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type PageProps = {
  params: Promise<{ id: string }>;
};

/* ===== META ===== */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const cookie = cookies().toString();
  const note: Note = await fetchNoteById(id, cookie);

  const title = `${note.title} | NoteHub`;
  const description =
    (note.content?.trim().slice(0, 120) || "Note details in NoteHub.") +
    (note.content && note.content.length > 120 ? "…" : "");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/notes/${id}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

/* ===== PAGE ===== */
export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const cookie = cookies().toString();
  const note: Note = await fetchNoteById(id, cookie);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>{note.title}</h1>

      <p style={{ marginBottom: 8 }}>
        <b>Tag:</b> {note.tag}
      </p>

      {note.content ? (
        <p style={{ lineHeight: 1.6 }}>{note.content}</p>
      ) : (
        <p style={{ opacity: 0.7 }}>No content</p>
      )}
    </main>
  );
}
