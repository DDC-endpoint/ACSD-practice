// j01 · JavaScript basics, on CampusEvents.
// An event looks like: { id: 3, title: "Hack Night", capacity: 40, booked: 38, category: "tech", isOpen: true }

// GIVEN: a function with NO return line. Calling it gives you undefined, not the answer.
// (A very common bug: you work the value out, then forget to `return` it.)
export function forgetfulTitle(event) {
  event.title.toUpperCase();
}

// TODO j01-1: return how many seats are left (capacity minus booked).
export function seatsLeft(event) {
  return event.capacity - event.booked;
}

// TODO j01-1: return true only if the two ids are the same VALUE and the same TYPE.
//   Use ===, never ==. So "3" and 3 are NOT the same id.
export function sameId(a, b) {
  return a === b;
}

// TODO j01-2: return true if the text is "blank": missing (undefined or null), "" or only spaces.
//   Hint: missing and "" are falsy. For spaces, trim() removes them.
export function isBlank(text) {
  return !text || text.trim() === "";
}

// TODO j01-3: use if / else if / else. Return "Full" when no seats are left,
//   "Almost full" when 5 or fewer are left, otherwise "Open".
export function statusLabel(event) {
  const left = event.capacity - event.booked;
  if (left === 0) {
    return "Full";
  } else if (left <= 5) {
    return "Almost full";
  } else {
    return "Open";
  }
}

// TODO j01-3: use the ternary (cond ? a : b), on one line.
//   Return "Open for booking" when event.isOpen is true, otherwise "Closed".
export function openText(event) {
  return event.isOpen ? "Open for booking" : "Closed";
}

// TODO j01-4: return a word for the kind of value, using typeof.
//   null -> "null" (typeof null is "object", a famous quirk, so check null first)
//   an array -> "array" (typeof [] is also "object", so use Array.isArray)
//   anything else -> whatever typeof says ("string", "number", "boolean", "undefined", "object")
export function describeValue(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

// TODO j01-5: count the events that are open. Use a for...of loop and a `let count`.
export function countOpen(events) {
  let count = 0;
  for (const event of events) {
    if (event.isOpen) count++;
  }
  return count;
}

// TODO j01-5: collect every title into a NEW array, using a classic for loop (let i = 0; ...).
//   `const titles = []` is fine: const stops you re-assigning titles, but push() still works.
export function titlesOf(events) {
  const titles = [];
  for (let i = 0; i < events.length; i++) {
    titles.push(events[i].title);
  }
  return titles;
}

// TODO j01-6: book n more seats. Change event.booked IN PLACE (changing the inside of a
//   const object is allowed) and return the new booked number.
//   If there are not enough seats left, change nothing and return -1.
export function addBooking(event, n) {
  if (n > event.capacity - event.booked) return -1;
  event.booked += n;
  return event.booked;
}
