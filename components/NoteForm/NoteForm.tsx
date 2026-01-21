"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

import type { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import {
  createNoteAction,
  type CreateNoteActionState,
} from "@/lib/actions/createNoteAction";

import css from "./NoteForm.module.css";

const initialActionState: CreateNoteActionState = { ok: false, error: "" };

export default function NoteForm() {
  const router = useRouter();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const [state, formAction, isPending] = useActionState(
    createNoteAction,
    initialActionState
  );

  useEffect(() => {
    if (state.ok) {
      clearDraft();
      router.back();
    }
  }, [state.ok, clearDraft, router]);

  const handleCancel = () => {
    router.back();
  };

  return (
    <form action={formAction} className={css.form}>
      {state.ok === false && state.error ? (
        <p className={css.error}>{state.error}</p>
      ) : null}

      <div className={css.field}>
        <label className={css.label} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
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
          onChange={(e) => setDraft({ content: e.target.value })}
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
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
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
          disabled={isPending}
        >
          Cancel
        </button>

        <button type="submit" className={css.submit} disabled={isPending}>
          Create
        </button>
      </div>
    </form>
  );
}