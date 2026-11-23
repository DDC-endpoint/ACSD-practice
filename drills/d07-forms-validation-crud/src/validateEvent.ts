import type { EventFormValues } from "./types/Event";

// One optional message per field. An empty object {} means "valid".
export type EventErrors = Partial<Record<"name" | "location" | "maxAttendees", string>>;

export function validateEvent(input: EventFormValues): EventErrors {
  const errors: EventErrors = {};

  if (input.name.trim() === "") {
    errors.name = "Event name is required.";
  }
  if (input.location.trim() === "") {
    errors.location = "Location is required.";
  }

  // The value may arrive as a string from the input. Number("") is 0 and
  // Number("abc") is NaN, so check the empty string first.
  const raw = String(input.maxAttendees).trim();
  const max = Number(raw);
  if (raw === "" || !Number.isInteger(max) || max <= 0) {
    errors.maxAttendees = "Maximum attendees must be a positive whole number.";
  }

  return errors;
}
