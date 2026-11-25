// j04 · Talking to the CampusEvents server with fetch.
// Every function here is async: it returns a Promise (a value that arrives later).
// Remember: fetch does NOT throw on 404 or 500. You must check res.ok yourself.

const BASE = "/api/events";

// GIVEN: the pattern to copy. Read it line by line before you start.
export async function getEvents() {
  const res = await fetch(BASE);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return await res.json();
}

// GIVEN: an async function that uses another async function.
export async function countEvents() {
  const events = await getEvents();
  return events.length;
}

// TODO j04-1: fetch ONE event from `${BASE}/${id}`.
//   Same shape as getEvents: if (!res.ok) throw new Error(`HTTP ${res.status}`), then return the parsed JSON.
export async function getEvent(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return await res.json();
}

// TODO j04-2: create an event with POST. Send `data` as JSON (method, Content-Type header, JSON.stringify body).
//   Check res.ok (a 201 is ok). Return the created event (parsed JSON).
export async function createEvent(data) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return await res.json();
}

// TODO j04-3: delete an event with method "DELETE" on `${BASE}/${id}`.
//   A 204 has NO body, so do not call res.json(). Check res.ok, then return true.
export async function deleteEvent(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return true;
}

// TODO j04-4: run `load()` (an async function) safely. This is the try/catch/finally you write in a React component.
//   - call setLoading(true) first
//   - try: const data = await load(); return { data, error: null }
//   - catch (err): return { data: null, error: err.message }
//   - finally: setLoading(false)   <- runs on success AND on failure
export async function loadWithStatus(load, setLoading) {
  setLoading(true);
  try {
    const data = await load();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  } finally {
    setLoading(false);
  }
}

// TODO j04-5: turn an object into the JSON TEXT that goes in a request body (JSON.stringify).
export function toBody(obj) {
  return JSON.stringify(obj);
}

// TODO j04-5: turn saved JSON text back into an object (JSON.parse).
//   If the text is not valid JSON, JSON.parse throws, so catch it and return null instead.
export function parseSaved(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
