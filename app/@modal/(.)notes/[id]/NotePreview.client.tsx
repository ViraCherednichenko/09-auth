"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal"; // якщо шлях інший — заміни

type Props = {
  noteId: string;
};

export default function NotePreview({ noteId }: Props) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: Boolean(noteId),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
   <Modal isOpen onClose={handleClose}>
      <div style={{ padding: 16, minWidth: 320 }}>
        <button type="button" onClick={handleClose} style={{ marginBottom: 12 }}>
          Close
        </button>

        {isLoading && <p>Loading…</p>}
        {!isLoading && isError && <p>Something went wrong.</p>}
        {!isLoading && !isError && note ? (
          <>
            <h2>{note.title}</h2>

            {note.content ? <p>{note.content}</p> : null}

            <p>
              <b>Tag:</b> {note.tag}
            </p>

            <p>
              <b>Created:</b> {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </>
        ) : null}
      </div>
    </Modal>
  );
}