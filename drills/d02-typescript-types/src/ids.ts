// d02 · A union of two types, and narrowing it with typeof.

// TODO d02-4: an id can be EITHER a number (42) OR a string ("ab-12"). Write that type.
//   (unknown is a placeholder so the file compiles. Replace it.)
export type Id = unknown;

// TODO d02-4: narrow with typeof.
//   number -> "#" followed by the number          (42 -> "#42")
//   string -> trimmed and upper-cased              (" ab-12 " -> "AB-12")
export function formatId(id: Id): string {
  throw new Error("TODO d02-4");
}
