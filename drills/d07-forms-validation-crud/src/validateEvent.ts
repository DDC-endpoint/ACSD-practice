import type { EventFormValues } from "./types/Event";

// One optional message per field. An empty object {} means "valid".
export type EventErrors = Partial<Record<"name" | "location" | "maxAttendees", string>>;

export function validateEvent(input: EventFormValues): EventErrors {
  // TODO d07-1: build an errors object and return it:
  //   - name empty after .trim()     -> errors.name = "Event name is required."
  //   - location empty after .trim() -> errors.location = "Location is required."
  //   - maxAttendees not a positive whole number -> errors.maxAttendees = "..."
  //     It may arrive as a string ("50") or a number (50). Reject 0, -3, 2.5, "", "abc".
  //     Careful: Number("") is 0 and Number("abc") is NaN. Number.isInteger() helps.
  //   Valid input returns {}.
  throw new Error("TODO d07-1");
}
