import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes">Notes</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}