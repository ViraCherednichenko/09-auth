import type { Metadata } from "next";
import NotesClient from "./Notes.client";
import type { NoteTag } from "@/types/note";

type Params = {
  slug?: string[];
};

type PageProps = {
  params: Promise<Params>;
};

function resolveTag(slug?: string[]): NoteTag | undefined {
  const rawTag = slug?.[0];
  return !rawTag || rawTag === "all" ? undefined : (rawTag as NoteTag);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = resolveTag(slug);

  const title = tag ? `Notes — ${tag}` : "Notes — All";
  const description = tag
    ? `Notes filtered by tag: ${tag}.`
    : "All notes.";

  return {
    title,
    description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const tag = resolveTag(slug);

  return <NotesClient tag={tag} />;
}