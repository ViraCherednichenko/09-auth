"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api/clientApi";

import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const [error, setError] = useState<string>("");

  const mutation = useMutation({
    mutationFn: () =>
      createNote({
        title: draft.title.trim(),
        content: draft.content.trim() ? draft.content.trim() : undefined,
        tag: draft.tag as NoteTag,
      }),
    onSuccess: async () => {
      clearDraft();

      // ✅ інвалідуємо кеш нотаток після створення
      await queryClient.invalidateQueries({ queryKey: ["notes"] });

      router.back();
    },
    onError: () => {
      setError("Failed to create note");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const title = draft.title.trim();

    if (!title || title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    mutation.mutate();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      {error ? <p className={css.error}>{error}</p> : null}

      <div className={css.field}>
        <label className={css.label} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDraft({ title: e.target.value })
          }
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.field}>
        <label className={css.label} htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          value={draft.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDraft({ content: e.target.value })
          }
          maxLength={500}
        />
      </div>

      <div className={css.field}>
        <label className={css.label} htmlFor="tag">
          Tag
        </label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setDraft({ tag: e.target.value as NoteTag })
          }
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={css.cancel}
          disabled={mutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}