import { cookies } from "next/headers";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/serverApi";
import NotePreview from "./NotePreview.client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ModalNotePage({ params }: Props) {
  const { id } = await params;

  // збираємо cookies для SSR-запиту
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
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}