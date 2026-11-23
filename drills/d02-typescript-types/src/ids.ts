// d02 · A union of two types, and narrowing it with typeof.

// TODO d02-4: an id can be EITHER a number (42) OR a string ("ab-12"). Write that type.
export type Id = string | number;

// TODO d02-4: narrow with typeof.
//   number -> "#" followed by the number          (42 -> "#42")
//   string -> trimmed and upper-cased              (" ab-12 " -> "AB-12")
export function formatId(id: Id): string {
  if (typeof id === "number") {
    return `#${id}`;
  }
  return id.trim().toUpperCase();
}
