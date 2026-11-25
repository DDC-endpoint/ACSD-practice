// j02 · Objects and arrays on CampusEvents.
// An event looks like: { id: 1, title: "Hack Night", date: "2026-12-01", capacity: 50, booked: 10 }
// Rule for the "copy" functions: build a NEW object or array and leave the one you were given alone.

// TODO j02-1: return a NEW event that is a copy of `event` with booked one higher.
//   Use spread: { ...event, booked: ... }. Do NOT write event.booked++ (that changes the original).
export function bookSeat(event) {
  return { ...event, booked: event.booked + 1 };
}

// TODO j02-1: return a NEW event that is a copy of `event` with a different title (spread again).
export function renameEvent(event, title) {
  return { ...event, title };
}

// TODO j02-2: return a NEW array with `event` added at the end: [...list, event]. Do NOT use list.push.
export function addEvent(list, event) {
  return [...list, event];
}

// TODO j02-2: return a NEW array without the event whose id is `id`. Use filter. Do NOT use splice.
export function removeEvent(list, id) {
  return list.filter((e) => e.id !== id);
}

// TODO j02-3: destructure in the parameters, with a default for venue, and return a template literal
//   like "Hack Night on 2026-12-01 at Room 4". If venue is missing it should say "TBC".
//   The function is given the parameter list `{ title, date, venue = "TBC" }` already.
export function summary({ title, date, venue = "TBC" }) {
  return `${title} on ${date} at ${venue}`;
}

// TODO j02-4: return the organiser's email, or "no contact" when there isn't one.
//   Some events have no organiser at all. Use ?. then ??  (event.organiser?.email ?? "no contact")
export function organiserEmail(event) {
  return event.organiser?.email ?? "no contact";
}

// TODO j02-4: return event.capacity, but fall back to 100 ONLY when capacity is missing (undefined/null).
//   A capacity of 0 is real (sold out) and must stay 0. That's why you use ?? and NOT ||.
export function capacityOf(event) {
  return event.capacity ?? 100;
}

// TODO j02-5: return a copy of `user` WITHOUT the password, using rest in destructuring:
//   const { password, ...safeUser } = user;  then return safeUser.
export function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// TODO j02-6: return the first two items as an object { first, second } using array destructuring:
//   const [first, second] = list;
export function firstTwo(list) {
  const [first, second] = list;
  return { first, second };
}

// TODO j02-6: return the value of the property whose NAME is stored in `key`. A variable name
//   needs square brackets: event[key]. (event.key would look for a property literally called "key".)
export function getField(event, key) {
  return event[key];
}
