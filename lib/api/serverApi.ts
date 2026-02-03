import type { AxiosResponse } from "axios";
import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: NoteTag;
};

function withCookie(cookie?: string) {
  return cookie ? { headers: { Cookie: cookie } } : undefined;
}

// NOTES (SSR)
export async function fetchNotes(params: FetchNotesParams, cookie?: string) {
  const { data } = await api.get<Note[]>("/notes", {
    ...(withCookie(cookie) ?? {}),
    params: { perPage: 12, ...params },
  });
  return data;
}

export async function fetchNoteById(id: string, cookie?: string) {
  const { data } = await api.get<Note>(`/notes/${id}`, withCookie(cookie));
  return data;
}

// AUTH (SSR)
export async function checkSession(
  cookie?: string
): Promise<AxiosResponse<User | null>> {
  const res = await api.get<User | null>("/auth/session", withCookie(cookie));
  return res;
}

// USER (SSR)
export async function getMe(cookie?: string) {
  const { data } = await api.get<User>("/users/me", withCookie(cookie));
  return data;
}