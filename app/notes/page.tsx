import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  
  const page = 1;
  const perPage = 12;
  const search = "";

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page, perPage, search }],
    queryFn: () => fetchNotes(page, perPage, search),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={page} initialPerPage={perPage} initialSearch={search} />
    </HydrationBoundary>
  );
}