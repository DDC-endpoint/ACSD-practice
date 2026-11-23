import type { EventDto, EventRecord } from "./types/Event";

const EVENTS_URL = "/api/events";

// POST to the collection URL: create a new event. The server assigns the id.
export async function createEvent(data: EventDto): Promise<EventRecord> {
  // TODO d07-2: await fetch(EVENTS_URL, { method, headers, body }) where
  //   method is "POST", headers is { "Content-Type": "application/json" },
  //   and body is the data turned into a JSON string.
  //   If !res.ok, throw an Error. Otherwise return the parsed JSON (the created event).
  throw new Error("TODO d07-2");
}

// PUT to the event's own URL: replace event 42 with this data.
export async function updateEvent(id: number, data: EventDto): Promise<void> {
  // TODO d07-3: like createEvent, but method "PUT" to `${EVENTS_URL}/${id}`.
  //   Throw if !res.ok. Return nothing (don't read the body: it may be a 204).
  throw new Error("TODO d07-3");
}

// DELETE to the event's own URL. No body to send, and usually none back (204).
export async function deleteEvent(id: number): Promise<void> {
  // TODO d07-4: fetch `${EVENTS_URL}/${id}` with method "DELETE". Throw if !res.ok.
  throw new Error("TODO d07-4");
}
