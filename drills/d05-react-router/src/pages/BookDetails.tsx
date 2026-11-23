import { useParams } from "react-router-dom";
import { BOOKS } from "../books";

// TODO d05-3: read `bookId` from the URL ("/books/:bookId") with useParams.
//   Render <h1>Book details</h1> and <p>Book ID: {bookId}</p>.
//   Then look the book up in BOOKS (careful: URL params are strings, ids are numbers)
//   and render <p>{title} by {author}</p>, or <p>No book with that ID.</p> if none matches.
export function BookDetails() {
  return <p>TODO d05-3</p>;
}
