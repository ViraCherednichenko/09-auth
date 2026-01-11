"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api";

type Props = {
  initialPage: number;
  initialPerPage: number;
  initialSearch: string;
};

export default function NotesClient({
  initialPage,
  initialPerPage,
  initialSearch,
}: Props) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", { page, perPage: initialPerPage, search }],
    queryFn: () => fetchNotes(page, initialPerPage, search),
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <main>
      <h1>Notes</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
        />
        <button type="submit">Search</button>
      </form>

      {data ? <NoteList notes={data.notes} /> : null}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <span>Page: {page}</span>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (data?.totalPages ?? 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}