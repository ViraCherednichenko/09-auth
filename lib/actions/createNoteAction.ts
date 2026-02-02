"use server";

import { createNote } from "@/lib/api/clientApi";
import type { NoteTag } from "@/types/note";

export type CreateNoteActionState =
  | { ok: false; error: string }
  | { ok: true };

const allowedTags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export async function createNoteAction(
  _prevState: CreateNoteActionState,
  formData: FormData
): Promise<CreateNoteActionState> {
  try {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    const rawTag = String(formData.get("tag") ?? "Todo");
    const tag = (allowedTags.includes(rawTag as NoteTag) ? rawTag : "Todo") as NoteTag;

    if (!title || title.length < 3) {
      return { ok: false, error: "Title must be at least 3 characters." };
    }

    await createNote({ title, content, tag });
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create note. Try again.";
    return { ok: false, error: message };
  }
}