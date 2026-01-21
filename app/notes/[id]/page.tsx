// app/notes/[id]/page.tsx
import type { Metadata } from "next";
import { getNoteById } from "@/lib/api/notes"; // підстав свою реальну
// або "@/lib/api" якщо так зроблено

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getNoteById(params.id);

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
      url: `${APP_URL}/notes/${params.id}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) {
  // твоя SSR сторінка з деталями
  return null;
}