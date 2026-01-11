"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import css from "./NoteDetails.module.css";
import Link from "next/link";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
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
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}