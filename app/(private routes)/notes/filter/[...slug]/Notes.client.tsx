"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

import { fetchNotes } from "@/lib/api/notes";
import type { Note, NoteTag } from "@/types/note";

type NotesClientProps = {
  tag?: NoteTag;
};

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

const PER_PAGE = 12;

export default function NotesClient({ tag }: NotesClientProps) {
  // SearchBox already debounces and calls onChange later
  const [search, setSearch] = useState<string>("");
  // keep 1-based page in state
  const [page, setPage] = useState<number>(1);

  // reset page on filter/search change
  useEffect(() => {
    setPage(1);
  }, [tag, search]);

  const queryKey = useMemo(
    () => ["notes", { tag: tag ?? "all", search, page, perPage: PER_PAGE }],
    [tag, search, page]
  );

  const { data, isLoading, isError, error, isFetching } = useQuery<
    NotesResponse,
    Error
  >({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag,
      }) as Promise<NotesResponse>,
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <section>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h1>Notes</h1>
        <Link href="/notes/action/create">Create note</Link>
      </header>

      <div style={{ margin: "12px 0" }}>
        <SearchBox value={search} onChange={setSearch} />
      </div>

      {isLoading ? (
        <p>Loading…</p>
      ) : isError ? (
        <p role="alert">Error: {error.message}</p>
      ) : notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <NoteList notes={notes} />
      )}

      <Pagination
        pageCount={totalPages}
        forcePage={Math.max(0, page - 1)} // react-paginate is 0-based
        onPageChange={(selectedZeroBased) => setPage(selectedZeroBased + 1)}
      />

      {isFetching && !isLoading ? <p>Updating…</p> : null}
    </section>
  );
}
