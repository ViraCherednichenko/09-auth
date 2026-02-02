import { api } from "./api";
import type { Note, NoteTag, NotesResponse } from "@/types/note";

export type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: NoteTag;
};

export type CreateNoteRequest = {
  title: string;
  content?: string;
  tag: NoteTag;
};

export async function fetchNotes(params: FetchNotesParams) {
  const { data } = await api.get<NotesResponse>("/notes", {
    params: { perPage: 12, ...params },
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(body: CreateNoteRequest) {
  const { data } = await api.post<Note>("/notes", body);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}