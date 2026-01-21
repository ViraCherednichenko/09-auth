import { apiClient } from "./client";
import type { NoteTag } from "@/types/note";

export async function fetchNotes(
  page: number,
  perPage: number,
  search: string,
  tag: string
) {
  const { data } = await apiClient.get("/notes", {
    params: { page, perPage, search, tag },
  });
  return data;
}

export async function createNote(note: {
  title: string;
  content: string;
  tag: NoteTag;
}) {
  const { data } = await apiClient.post("/notes", note);
  return data;
}

export async function getNoteById(id: string) {
  const { data } = await apiClient.get(`/notes/${id}`);
  return data;
}