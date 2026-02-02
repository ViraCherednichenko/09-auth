export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalResults: number;
};