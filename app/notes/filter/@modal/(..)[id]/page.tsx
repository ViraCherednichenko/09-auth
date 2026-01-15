import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

type Props = {
  params: {
    id: string;
  };
};

export default async function NoteModalPage({ params }: Props) {
  const note = await fetchNoteById(params.id);

  return (
    <Modal>
      <NoteDetailsClient note={note} />
    </Modal>
  );
}