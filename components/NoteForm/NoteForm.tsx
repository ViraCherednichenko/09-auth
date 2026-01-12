"use client";

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { NoteTag } from "@/types/note";
import { createNote } from "@/lib/api";

export interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, "Min 2 characters")
    .max(50, "Max 50 characters")
    .required("Title is required"),
  content: Yup.string()
    .trim()
    .min(2, "Min 2 characters")
    .max(500, "Max 500 characters")
    .required("Content is required"),
  tag: Yup.mixed<NoteTag>().required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: NoteFormValues) => createNote(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = async (
    values: NoteFormValues,
    helpers: FormikHelpers<NoteFormValues>
  ) => {
    try {
      await mutation.mutateAsync(values);
      helpers.resetForm();
    } catch {
      // optional
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange={false}
    >
      {({ isValid }) => (
        <Form>
          <label>
            Title
            <Field name="title" type="text" />
            <ErrorMessage name="title" component="p" />
          </label>

          <label>
            Content
            <Field name="content" as="textarea" rows={4} />
            <ErrorMessage name="content" component="p" />
          </label>

          <label>
            Tag
            <Field name="tag" as="select">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="p" />
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button type="submit" disabled={!isValid || mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </button>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}