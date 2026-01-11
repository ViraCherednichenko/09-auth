import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

/* ================= TYPES ================= */

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

/* ================= API ================= */

export async function fetchNotes(
  page: number,
  perPage: number,
  search?: string
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
    },
  });

  return data;
}

export async function createNote(
  payload: CreateNotePayload
): Promise<Note> {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}