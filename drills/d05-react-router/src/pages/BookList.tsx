import { Link, useSearchParams } from "react-router-dom";
import { BOOKS } from "../books";

// TODO d05-5: a book list filtered by the ?q= query string.
//   - Read q with useSearchParams: searchParams.get("q") ?? "".
//   - Render <h1>Books</h1> and <input type="search" aria-label="Search books">
//     whose value is q. On change, write the new text back into the URL with
//     setSearchParams({ q: text }) (or setSearchParams({}) when the box is empty).
//   - Render a <ul> with one <li> per book whose title contains q (ignore case),
//     each holding <Link to={`/books/${book.id}`}>{book.title}</Link>.
export function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const shown = BOOKS.filter((b) =>
    b.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <section>
      <h1>Books</h1>
      <input
        type="search"
        aria-label="Search books"
        value={q}
        onChange={(e) =>
          setSearchParams(e.target.value ? { q: e.target.value } : {})
        }
      />
      <ul>
        {shown.map((book) => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>{book.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
