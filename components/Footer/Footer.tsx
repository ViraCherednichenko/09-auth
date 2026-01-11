export default function Footer() {
  return (
    <footer>
      <div>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div>
          <p>Developer: your name</p>
          <p>
            Contact us: <a href="mailto:student@notehub.app">student@notehub.app</a>
          </p>
        </div>
      </div>
    </footer>
  );
}