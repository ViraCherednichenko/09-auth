import type { Metadata } from "next";
import NotesClient from "./Notes.client";
import type { NoteTag } from "@/types/note";

type Params = { slug?: string[] };

type PageProps = {
  params: Promise<Params>;
};

function resolveTag(slug?: string[]): NoteTag | undefined {
  const rawTag = slug?.[0];
  return !rawTag || rawTag === "all" ? undefined : (rawTag as NoteTag);
}

const APP_URL =
  (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = resolveTag(slug);

  const title = tag ? `Notes — ${tag} | NoteHub` : "Notes — All | NoteHub";
  const description = tag
    ? `Notes filtered by tag: ${tag}.`
    : "All notes in NoteHub.";

  const path = tag ? `/notes/filter/${tag}` : "/notes/filter/all";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}${path}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function NotesFilterPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = resolveTag(slug);

  return <NotesClient tag={tag} />;
}