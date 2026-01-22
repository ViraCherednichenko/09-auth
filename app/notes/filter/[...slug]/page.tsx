import type { Metadata } from "next";
import NotesClient from "./Notes.client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] ?? "all";

  const title = `Notes filter: ${filter} | NoteHub`;
  const description = `Browse notes in NoteHub filtered by: ${filter}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/notes/filter/${filter}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function FilterPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  return <NotesClient tag={tag} />;
}