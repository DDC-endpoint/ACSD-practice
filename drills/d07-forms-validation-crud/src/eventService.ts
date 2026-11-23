import type { EventDto, EventRecord } from "./types/Event";

const EVENTS_URL = "/api/events";

// POST to the collection URL: create a new event. The server assigns the id.
export async function createEvent(data: EventDto): Promise<EventRecord> {
  const res = await fetch(EVENTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Could not create the event (HTTP ${res.status}).`);
  }
  return (await res.json()) as EventRecord;
}

// PUT to the event's own URL: replace event 42 with this data.
export async function updateEvent(id: number, data: EventDto): Promise<void> {
  const res = await fetch(`${EVENTS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Could not update the event (HTTP ${res.status}).`);
  }
}

// DELETE to the event's own URL. No body to send, and usually none back (204).
export async function deleteEvent(id: number): Promise<void> {
  const res = await fetch(`${EVENTS_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`Could not delete the event (HTTP ${res.status}).`);
  }
}
