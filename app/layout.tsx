import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import Header from "@/components/Header/Header";
import Providers from "@/components/Providers/Providers";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

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

type RootLayoutProps = {
  children: ReactNode;
  modal: ReactNode;
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="uk">
      <body>
        <Providers>
          <AuthProvider>
            <Header />
            {children}
            {modal}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}