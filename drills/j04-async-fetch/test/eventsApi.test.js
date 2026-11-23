import {
  countEvents,
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  loadWithStatus,
  parseSaved,
  toBody,
} from "../src/eventsApi.js";

// Build a fake server reply, the same shape fetch gives back.
function reply(status, body) {
  const text = body === undefined ? null : JSON.stringify(body);
  return new Response(text, { status, headers: { "Content-Type": "application/json" } });
}

function stubFetch(status, body) {
  const fake = vi.fn(async () => reply(status, body));
  vi.stubGlobal("fetch", fake);
  return fake;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("j04 eventsApi", () => {
  test("1. getEvent GETs /api/events/:id and returns the parsed JSON", async () => {
    const fake = stubFetch(200, { id: 3, title: "Hack Night" });
    const event = await getEvent(3);
    expect(event).toEqual({ id: 3, title: "Hack Night" });
    expect(fake.mock.calls[0][0]).toBe("/api/events/3");
  });

  test("2. a 404 makes getEvent reject (fetch itself does not throw, so you must check res.ok)", async () => {
    stubFetch(404, { message: "not found" });
    await expect(getEvent(99)).rejects.toThrow("404");
    stubFetch(500, {});
    await expect(getEvent(1)).rejects.toThrow("HTTP 500");
  });

  test("3. createEvent POSTs JSON: method, Content-Type header and a STRING body", async () => {
    const fake = stubFetch(201, { id: 7, title: "Quiz" });
    const created = await createEvent({ title: "Quiz", capacity: 40 });
    expect(created).toEqual({ id: 7, title: "Quiz" });
    const [url, options] = fake.mock.calls[0];
    expect(url).toBe("/api/events");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(typeof options.body).toBe("string");
    expect(JSON.parse(options.body)).toEqual({ title: "Quiz", capacity: 40 });
  });

  test("4. createEvent rejects on a 400", async () => {
    stubFetch(400, { message: "bad data" });
    await expect(createEvent({})).rejects.toThrow("400");
  });

  test("5. deleteEvent sends DELETE and returns true on 204 WITHOUT calling res.json()", async () => {
    const json = vi.fn();
    const fake = vi.fn(async () => ({ ok: true, status: 204, json }));
    vi.stubGlobal("fetch", fake);
    const result = await deleteEvent(5);
    expect(result).toBe(true);
    expect(fake).toHaveBeenCalledWith("/api/events/5", { method: "DELETE" });
    expect(json).not.toHaveBeenCalled();
  });

  test("6. deleteEvent rejects when the server says 404", async () => {
    stubFetch(404, {});
    await expect(deleteEvent(5)).rejects.toThrow("404");
  });

  test("7. loadWithStatus returns { data, error: null } on success and switches loading on then off", async () => {
    const setLoading = vi.fn();
    const result = await loadWithStatus(async () => [1, 2], setLoading);
    expect(result).toEqual({ data: [1, 2], error: null });
    expect(setLoading.mock.calls).toEqual([[true], [false]]);
  });

  test("8. loadWithStatus catches a failure, returns the message, and STILL switches loading off (finally)", async () => {
    const setLoading = vi.fn();
    const result = await loadWithStatus(async () => {
      throw new Error("HTTP 500");
    }, setLoading);
    expect(result).toEqual({ data: null, error: "HTTP 500" });
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  test("9. toBody makes JSON text and parseSaved turns it back (bad text gives null)", () => {
    const text = toBody({ title: "Quiz", isOpen: true });
    expect(typeof text).toBe("string");
    expect(text).toBe('{"title":"Quiz","isOpen":true}');
    expect(parseSaved(text)).toEqual({ title: "Quiz", isOpen: true });
    expect(parseSaved("not json {")).toBe(null);
  });

  test("10. async functions always return a Promise (countEvents awaits getEvents)", async () => {
    stubFetch(200, [{ id: 1 }, { id: 2 }, { id: 3 }]);
    const promise = countEvents();
    expect(promise).toBeInstanceOf(Promise);
    expect(await promise).toBe(3);
    expect(await getEvents()).toHaveLength(3);
  });
});
