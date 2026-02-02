import { api } from "./api";
import type { Note, NoteTag, NotesResponse } from "@/types/note";
import type { User } from "@/types/user";

export type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: NoteTag;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateMeRequest = {
  username: string;
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


export async function register(body: RegisterRequest) {
  const { data } = await api.post<User>("/auth/register", body);
  return data;
}

export async function login(body: LoginRequest) {
  const { data } = await api.post<User>("/auth/login", body);
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(body: UpdateMeRequest) {
  const { data } = await api.patch<User>("/users/me", body);
  return data;
}