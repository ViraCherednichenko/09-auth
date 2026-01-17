import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
  params: {
    slug?: string[];
  };
};

export default async function FilteredNotesPage({ params }: Props) {
  const slugValue = params.slug?.[0] ?? "all";
  const tag = slugValue === "all" ? undefined : slugValue;

  const data = await fetchNotes(1, 12, undefined, tag);

  return <NoteList notes={data.notes} />;
}