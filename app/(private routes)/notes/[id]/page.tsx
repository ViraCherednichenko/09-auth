import type { Metadata } from "next";
import { cookies } from "next/headers";

import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";


type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const note = await fetchNoteById(id, cookieHeader);

    return {
      title: `${note.title} | NoteHub`,
      description: note.content ? note.content.slice(0, 140) : "Note details",
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content ? note.content.slice(0, 140) : "Note details",
        url: `/notes/${id}`,
      },
    };
  } catch {
    return {
      title: "Note | NoteHub",
      description: "Note details",
    };
  }
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;

  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id, cookieHeader),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} backHref="/notes" />
    </HydrationBoundary>
  );
}