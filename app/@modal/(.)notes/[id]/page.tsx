import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";
import ModalRouteWrapper from "@/components/ModalRouteWrapper/ModalRouteWrapper";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NoteModalPage({ params }: Props) {
  const { id } = await params;

  return (
    <ModalRouteWrapper>
      <NoteDetailsClient id={id} />
    </ModalRouteWrapper>
  );
}
