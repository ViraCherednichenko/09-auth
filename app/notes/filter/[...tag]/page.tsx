import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
  params: {
    tag?: string[];
  };
};

export default async function FilteredNotesPage({ params }: Props) {
  const slug = params.tag?.[0] ?? "all";
  const tag = slug === "all" ? undefined : slug;

  const notes = await fetchNotes(tag);

  return <NoteList notes={notes} />;
}