"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <button type="button" onClick={handleClose} aria-label="Close modal">
        Close
      </button>

      {isLoading && <p>Loading...</p>}

      {isError && (
        <p>
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {!isLoading && !isError && data && (
        <div>
          <h2>{data.title}</h2>

          {data.content && <p>{data.content}</p>}

          <p>Tag: {data.tag}</p>
          {"createdAt" in data && data.createdAt && (
            <p>
              Created:{" "}
              {new Date(data.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}