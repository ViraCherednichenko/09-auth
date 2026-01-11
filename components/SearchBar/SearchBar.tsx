"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const params = useParams();
  const id = params.id as string;

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      {/* 🔙 ОТУТ */}
      <Link href="/notes">← Back to notes</Link>

      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>

        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </div>
  );
}