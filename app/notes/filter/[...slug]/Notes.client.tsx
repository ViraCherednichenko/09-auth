"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

type Props = {
  tag: string;
};

const PER_PAGE = 12;

export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", tag, page, debouncedSearch],
    queryFn: () => fetchNotes(page, PER_PAGE, debouncedSearch, tag),
    placeholderData: (prev) => prev,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const hasNotes = (data?.notes?.length ?? 0) > 0;

  return (
    <>
      <SearchBox value={search} onChange={handleSearchChange} />

      <button type="button" onClick={handleOpenModal}>
        Add note
      </button>

      {isLoading && <p>Loading...</p>}

      {!isLoading && !isError && hasNotes && <NoteList notes={data!.notes} />}

      {!isLoading && !isError && !hasNotes && <p>No notes found.</p>}

      <Pagination
        pageCount={data?.totalPages ?? 1}
        forcePage={page - 1}
        onPageChange={(selectedPage) => setPage(selectedPage + 1)}
      />

      {isModalOpen && (
        <Modal isOpen={true} onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </>
  );
}