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
  return <p>TODO d05-5</p>;
}
