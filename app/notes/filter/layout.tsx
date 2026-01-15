import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
};

export default function FilterLayout({ children, sidebar, modal }: Props) {
  return (
    <div style={{ display: "flex", gap: "24px" }}>
      <aside>{sidebar}</aside>
      <section style={{ position: "relative", flex: 1 }}>
        {children}
        {modal}
      </section>
    </div>
  );
}