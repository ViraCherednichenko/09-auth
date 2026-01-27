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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = resolveTag(slug);

  const title = tag ? `Notes — ${tag}` : "Notes — All";
  const description = tag ? `Notes filtered by tag: ${tag}.` : "All notes.";

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  const path = tag ? `/notes/filter/${tag}` : "/notes/filter/all";
  const url = `${appUrl}${path}`;

  const imageUrl = `${appUrl}/og-notes.png`; // файл лежить у /public/og-notes.png

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Notes application",
        },
      ],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const tag = resolveTag(slug);

  return <NotesClient tag={tag} />;
}