// j03 · format.js: small formatting helpers for CampusEvents.
// This file is a MODULE: other files can import the things it exports.

// Month names, so formatDate gives the same answer on every computer.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// GIVEN: a NAMED export. "2026-11-24" becomes "24 Nov 2026".
export function formatDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

// TODO j03-1: make formatPrice an arrow function with an implicit return (no braces, no `return`):
//   it takes pence (1250) and gives back "£12.50".  Hint: `£${(pence / 100).toFixed(2)}`
//   ALSO: this line is missing the word `export`. Add it so other files can import formatPrice.
const formatPrice = (pence) => {
  throw new Error("TODO j03-1");
};

// TODO j03-2: an arrow function that returns an OBJECT: { id: event.id, label: event.title }.
//   Careful: the object needs round brackets around it: ({ ... }). Without them the { } is read
//   as a function body: undefined with one property, a SyntaxError (file won't load) with two.
export const toSummary = (event) => {
  throw new Error("TODO j03-2");
};

// TODO j03-3: this should be the DEFAULT export of the file (one per file).
//   Add `export default` in front of `function`. It returns text like
//   "Hack Night - 24 Nov 2026 - £5.00": title, formatDate(event.date), formatPrice(event.price).
function formatEvent(event) {
  throw new Error("TODO j03-3");
}
