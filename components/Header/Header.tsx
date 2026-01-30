import Link from "next/link";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
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
            <Link href="/notes/filter/all">Notes</Link>
          </li>
             <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}