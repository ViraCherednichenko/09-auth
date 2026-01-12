"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

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
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryKey = useMemo(
    () => ["notes", { page, perPage: initialPerPage, search }],
    [page, initialPerPage, search]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchNotes(page, initialPerPage, search),
    // щоб не було “мерехтіння” при переході між сторінками
    placeholderData: (prev) => prev,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (selectedPage0: number) => {
    // ReactPaginate працює з 0-based, а наш API/стан — 1-based
    setPage(selectedPage0 + 1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main>
      <h1>Notes</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <button type="button" onClick={openModal}>
          Add note
        </button>
      </div>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}

      {data ? <NoteList notes={data.notes} /> : null}

      <Pagination
        pageCount={totalPages}
        forcePage={page - 1}
        onPageChange={handlePageChange}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Create note</h2>
        <NoteForm onClose={closeModal} />
      </Modal>
    </main>
  );
}