import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css"; // якщо є

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "NoteHub",
  description: "Create, manage, and browse notes with tags and filters.",
  openGraph: {
    title: "NoteHub",
    description: "Create, manage, and browse notes with tags and filters.",
    url: APP_URL,
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={roboto.variable}>
      <body>{children}</body>
    </html>
  );
}